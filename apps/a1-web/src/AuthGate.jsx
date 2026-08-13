import { CircularProgress } from '@gtivr4/a1-design-system-react'
import { useAuth } from './lib/AuthContext.jsx'

// Section's full-screen layout intentionally aligns content to the block start,
// so this pre-app shell uses the root's full height to center its single status.
const centeredScreen = {
  minBlockSize: '100%',
  display: 'grid',
  placeItems: 'center',
}

// Wait for a configured identity provider to restore its session before access
// checks run. Signed-out visitors continue into the public experience.
export function AuthGate({ children }) {
  const { configured, loading } = useAuth()
  if (!configured || !loading) return children

  return (
    <main style={centeredScreen} aria-label="Loading">
      <CircularProgress indeterminate aria-label="Loading" size="xl">
        Loading...
      </CircularProgress>
    </main>
  )
}
