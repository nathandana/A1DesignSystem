import { CircularProgress } from '@gtivr4/a1-design-system-react'
import { useAuth } from './lib/AuthContext.jsx'

// Wait for a configured identity provider to restore its session before access
// checks run. Signed-out visitors continue into the public experience.
export function AuthGate({ children }) {
  const { configured, loading } = useAuth()
  if (!configured || !loading) return children

  return (
    <main aria-label="Loading">
      <CircularProgress indeterminate aria-label="Loading" />
    </main>
  )
}
