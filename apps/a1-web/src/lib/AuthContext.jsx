import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, supabaseConfigured } from './supabase.js'

// Mirrors the downTracker (Weight) Supabase auth pattern. When Supabase isn't
// configured the provider resolves to a signed-out, no-op state so the rest of
// the app behaves exactly as the local-only build.
const AuthContext = createContext(null)

/** How long sign-out waits for the Auth service before signing out locally. */
const SIGN_OUT_TIMEOUT_MS = 5000

/** Remove supabase-js's persisted session (`sb-<project>-auth-token` and its code verifier). */
function clearStoredSession() {
  try {
    for (const key of Object.keys(localStorage)) {
      if (/^sb-.+-auth-token(-code-verifier)?$/.test(key)) localStorage.removeItem(key)
    }
  } catch { /* storage unavailable — nothing persisted to clear */ }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabaseConfigured) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signUp(email, password) {
    const { error } = await supabase.auth.signUp({ email, password })
    return error
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error && data?.session) {
      await supabase.rpc('a1_record_login')
    }
    return error
  }

  // Signing out must always work on this device. supabase-js keeps the local
  // session when its server revoke fails and waits indefinitely when the Auth
  // service hangs, so fall back to clearing the stored session ourselves.
  async function signOut() {
    const result = await Promise.race([
      supabase.auth.signOut().catch((error) => ({ error })),
      new Promise((resolve) => { setTimeout(() => resolve({ error: new Error('Sign-out timed out') }), SIGN_OUT_TIMEOUT_MS) }),
    ])
    if (result?.error) {
      clearStoredSession()
      setUser(null)
    }
  }

  async function resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    })
    return error
  }

  // Calls a security-definer stored procedure that deletes the calling user from
  // auth.users; on-delete cascades clean up their rows.
  async function deleteAccount() {
    const { error } = await supabase.rpc('delete_user')
    if (error) throw error
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading, configured: supabaseConfigured, signUp, signIn, signOut, resetPassword, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext) ?? { user: null, loading: false, configured: false }
}
