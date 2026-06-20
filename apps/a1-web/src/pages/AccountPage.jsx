import { useEffect, useState } from 'react'
import {
  Banner,
  Breadcrumb,
  Button,
  ButtonContainer,
  Card,
  Heading,
  MessageBadge,
  Paragraph,
  Section,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { useAuth } from '../lib/AuthContext.jsx'
import { pushLocalData } from '../projects/cloudSync.js'
import { loadProjects } from '../projects/projectStore'
import { migrateLocalImagesToCloud } from '../lib/imageLibrary'
import { getStorageStatus } from '../lib/storageStatus'

// Account page built from A1 components. Invite-only: sign-in only (no public
// sign-up — the whole app is gated by AuthGate). Signed in: account info, a
// storage-location panel, "import local data", sign out, and delete. Cloud sync
// follows the session automatically. Replaces the former Account dialog.
export function AccountPage({ onNavigate }) {
  const { user, configured, signIn, signOut, resetPassword, deleteAccount } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState(false)
  const [pushing, setPushing] = useState(false)
  const [storage, setStorage] = useState(null)

  // Load where each data category lives whenever a user is present, and refresh
  // after a push so counts/locations stay accurate.
  useEffect(() => {
    if (!user) { setStorage(null); return }
    let active = true
    getStorageStatus(true).then((s) => { if (active) setStorage(s) })
    return () => { active = false }
  }, [user, pushing])

  async function handlePushLocal() {
    setPushing(true); setStatus(null)
    try {
      try {
        await pushLocalData(user.id)
      } catch (e) {
        console.error('[account] projects sync failed', e)
        throw new Error(`Projects sync failed: ${e.message}`)
      }
      let images = 0
      try {
        images = await migrateLocalImagesToCloud()
      } catch (e) {
        console.error('[account] image upload failed', e)
        throw new Error(`Image upload failed: ${e.message}`)
      }
      const imageNote = images ? ` and ${images} image${images === 1 ? '' : 's'}` : ''
      setStatus({ status: 'success', message: `Local projects${imageNote} imported to your account.` })
    } catch (e) {
      setStatus({ status: 'error', message: e.message })
    }
    setPushing(false)
  }

  async function submit() {
    if (!email || !password) { setStatus({ status: 'warn', message: 'Enter an email and password.' }); return }
    setBusy(true); setStatus(null)
    const error = await signIn(email, password)
    setBusy(false)
    if (error) { setStatus({ status: 'error', message: error.message }); return }
    setEmail(''); setPassword(''); setStatus(null)
  }

  async function handleReset() {
    if (!email) { setStatus({ status: 'warn', message: 'Enter your email first.' }); return }
    const error = await resetPassword(email)
    setStatus(error ? { status: 'error', message: error.message } : { status: 'success', message: 'Password reset email sent.' })
  }

  async function handleDelete() {
    if (!window.confirm('Delete your account and all cloud-synced data? This cannot be undone.')) return
    try { await deleteAccount() } catch (e) { setStatus({ status: 'error', message: e.message }) }
  }

  return (
    <>
      <Section padding="xs" contentWidth="md" surface="panel" borderSize="sm" borderVariant="accent" borderSides="bottom">
        <Stack direction="column" gap="xs">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
              { label: 'Account' },
            ]}
          />
          <Heading as="h1" id="account-heading" size={{ xs: 'lg', md: 'xxl' }}>Account</Heading>
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="xs" aria-labelledby="account-heading">
        {!configured ? (
          <Banner status="info">Cloud accounts aren’t configured for this build.</Banner>
        ) : user ? (
          <Card>
          <Stack gap="lg">
            <Paragraph>Signed in as <strong>{user.email}</strong>. This is a shared workspace — every signed-in user sees and edits the same projects, themes, patterns, and images.</Paragraph>
            {status && <Banner status={status.status}>{status.message}</Banner>}
            {storage && (
              <Stack gap="xs">
                <Heading as="h2" size="sm">Where your data is stored</Heading>
                {storage.map((s) => (
                  <Stack key={s.key} direction="row" justify="between" align="center" gap="sm">
                    <Paragraph size="sm">{s.label} <Paragraph as="span" size="sm" color="muted">({s.count})</Paragraph></Paragraph>
                    <MessageBadge status={s.location === 'cloud' ? 'success' : 'neutral'} subtle icon={s.location === 'cloud' ? 'cloud_done' : 'computer'}>
                      {s.detail}
                    </MessageBadge>
                  </Stack>
                ))}
              </Stack>
            )}
                     
            <Stack gap="xs">
              <Heading as="h2" size="sm">Import local data</Heading>
              <Paragraph size="sm" color="muted">
                Push everything stored in this browser — projects, patterns, themes, and images — up to the shared workspace (replaces the shared copy). Changes after this sync automatically.
              </Paragraph>
              <Button variant="secondary" icon="cloud_upload" loading={pushing} onClick={handlePushLocal}>
                Import local data{loadProjects().length ? ` (${loadProjects().length} projects)` : ''}
              </Button>
            </Stack>
            <ButtonContainer>
              <Button variant="secondary" onClick={() => signOut()}>Sign out</Button>
              <Button variant="tertiary" icon="lock_reset" onClick={() => resetPassword(user.email).then(() => setStatus({ status: 'success', message: 'Password reset email sent.' }))}>Reset password</Button>
              <Button variant="destructive" icon="delete" onClick={handleDelete}>Delete account</Button>
            </ButtonContainer>
          </Stack>
          </Card>
        ) : (
          <Card>
          <Stack gap="md">
            <Paragraph size="sm" color="muted">Accounts are invite-only — sign in to continue.</Paragraph>
            <TextField label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="Password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {status && <Banner status={status.status}>{status.message}</Banner>}
            <ButtonContainer fillButtons>
              <Button variant="primary" loading={busy} onClick={submit}>Sign in</Button>
            </ButtonContainer>
            <Button variant="tertiary" size="sm" icon="lock_reset" onClick={handleReset}>Forgot password?</Button>
          </Stack>
          </Card>
        )}
      </Section>
    </>
  )
}
