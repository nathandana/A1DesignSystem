import { createContext, useContext, useMemo } from 'react'

const LOCAL_USER = {
  id: 'local',
  email: 'local@a1-jobs',
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const value = useMemo(() => ({
    user: LOCAL_USER,
    loading: false,
    configured: true,
    signIn: async () => null,
    signOut: async () => {},
    resetPassword: async () => null,
    accessToken: async () => 'local',
  }), [])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext) ?? {
    user: LOCAL_USER,
    loading: false,
    configured: true,
    signIn: async () => null,
    signOut: async () => {},
    resetPassword: async () => null,
    accessToken: async () => 'local',
  }
}
