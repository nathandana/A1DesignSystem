import { useState } from 'react'
import {
  Banner,
  Button,
  ButtonContainer,
  Card,
  CheckboxGroup,
  CircularProgress,
  Heading,
  Paragraph,
  Section,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { useAuth } from './lib/AuthContext.jsx'

// Full-viewport centering for the app-shell auth screens. Section's height="screen"
// aligns content to the top (by design), and no layout component centers a single
// card on both axes over the full viewport, so this structural wrapper is justified
// here (app shell, not a design-system component). No visual values — only layout.
const centerScreen = {
  minBlockSize: '100dvh',
  display: 'grid',
  placeItems: 'center',
  padding: 'var(--base-spacing-24)',
}

function SignInScreen() {
  const { signIn, resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState(false)
  const [agreed, setAgreed] = useState(false)

  async function submit() {
    if (!email || !password) { setStatus({ status: 'warn', message: 'Enter your email and password.' }); return }
    if (!agreed) { setStatus({ status: 'warn', message: 'Please accept the agreement to continue.' }); return }
    setBusy(true); setStatus(null)
    const error = await signIn(email, password)
    setBusy(false)
    if (error) setStatus({ status: 'error', message: error.message })
  }

  async function handleReset() {
    if (!email) { setStatus({ status: 'warn', message: 'Enter your email first.' }); return }
    const error = await resetPassword(email)
    setStatus(error ? { status: 'error', message: error.message } : { status: 'success', message: 'Password reset email sent.' })
  }

  const onEnter = (e) => { if (e.key === 'Enter') submit() }

  return (
    <Section
  surface="raised"
  gap="sm"
  contentWidth="xs"
  height="screen"  gradient="accent"
  gradientPosition="top"
>
      <Card>
        <Stack gap="md">
          <Stack gap="xs">
            <Heading as="h1" size="lg">A1 Design System</Heading>
            <Paragraph size="sm" color="muted">Sign in to continue. Accounts are invite-only.</Paragraph>
          </Stack>
          <TextField label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={onEnter} />
          <TextField label="Password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={onEnter} />
          <CheckboxGroup
            value={agreed ? ['agree'] : []}
            onChange={(vals) => setAgreed(vals.includes('agree'))}
            options={[{
              value: 'agree',
              label: 'I agree that this is an alpha site and the intellectual property of Nathan Dana. I will not share it without permission.',
            }]}
          />
          {status && <Banner status={status.status}>{status.message}</Banner>}
          <ButtonContainer fillButtons>
            <Button variant="primary" loading={busy} disabled={!agreed} onClick={submit}>Sign in</Button>
          </ButtonContainer>
          {/* <Button variant="tertiary" size="sm" icon="lock_reset" onClick={handleReset}>Forgot password?</Button> */}
        </Stack>
      </Card>
    </Section>
  )
}

// Gate the whole app behind sign-in only on live deployments. Local development
// can still use Supabase-backed sync when env vars are present, but remains
// ungated for demos, QA captures, and walkthrough generation.
export function AuthGate({ children }) {
  const { user, loading, authRequired } = useAuth()
  if (!authRequired) return children
  if (loading) {
    return (
      <div style={centerScreen}>
        <CircularProgress indeterminate aria-label="Loading" />
      </div>
    )
  }
  if (!user) return <SignInScreen />
  return children
}
