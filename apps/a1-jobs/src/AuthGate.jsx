import { CircularProgress, Section } from '@gtivr4/a1-design-system-react'
import { useAuth } from './lib/AuthContext.jsx'

export function AuthGate({ children }) {
  const { loading } = useAuth()
  if (loading) {
    return (
      <Section surface="raised" height="screen" contentWidth="xs">
        <CircularProgress indeterminate aria-label="Loading" />
      </Section>
    )
  }
  return children
}
