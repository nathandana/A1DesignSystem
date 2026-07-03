import { useEffect, useState } from 'react'
import {
  Banner,
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
import { runManualSync } from '../lib/manualSync.js'
import { loadProjects } from '../projects/projectStore'
import { migrateLocalImagesToCloud } from '../lib/imageLibrary'
import { getStorageStatus } from '../lib/storageStatus'
import { useT } from '../labels/useT.js'
import { PageTitleArea } from './PageTitleArea.jsx'

// Account page built from A1 components. Invite-only: sign-in only (no public
// sign-up — the whole app is gated by AuthGate). Signed in: account info, a
// storage-location panel, "import local data", sign out, and delete. Cloud sync
// follows the session automatically. Replaces the former Account dialog.
export function AccountPage({ onNavigate }) {
  const { user, configured, signIn, signOut, resetPassword, deleteAccount } = useAuth()
  const t = useT()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState(false)
  const [pushing, setPushing] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [storage, setStorage] = useState(null)

  // Load where each data category lives whenever a user is present, and refresh
  // after a push or a manual sync so counts/locations stay accurate.
  useEffect(() => {
    if (!user) { setStorage(null); return }
    let active = true
    getStorageStatus(true).then((s) => { if (active) setStorage(s) })
    return () => { active = false }
  }, [user, pushing, syncing])

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

  async function handleSyncNow() {
    setSyncing(true); setStatus(null)
    try {
      await runManualSync()
      // Toggling `syncing` off (below) re-runs the storage-status effect.
      setStatus({ status: 'success', message: t('app.account.syncNowDone', 'Synced with the shared workspace.') })
    } catch (e) {
      setStatus({ status: 'error', message: e.message })
    }
    setSyncing(false)
  }

  async function submit() {
    if (!email || !password) { setStatus({ status: 'warn', message: t('app.account.warnEmailPassword', 'Enter an email and password.') }); return }
    setBusy(true); setStatus(null)
    const error = await signIn(email, password)
    setBusy(false)
    if (error) { setStatus({ status: 'error', message: error.message }); return }
    setEmail(''); setPassword(''); setStatus(null)
  }

  async function handleReset() {
    if (!email) { setStatus({ status: 'warn', message: t('app.account.warnEmailRequired', 'Enter your email first.') }); return }
    const error = await resetPassword(email)
    setStatus(error ? { status: 'error', message: error.message } : { status: 'success', message: t('app.account.resetPasswordSent', 'Password reset email sent.') })
  }

  async function handleDelete() {
    if (!window.confirm(t('app.account.deleteConfirm', 'Delete your account and all cloud-synced data? This cannot be undone.'))) return
    try { await deleteAccount() } catch (e) { setStatus({ status: 'error', message: e.message }) }
  }

  return (
    <>
      <PageTitleArea
        headingId="account-heading"
        contentWidth="md"
        breadcrumbItems={[
          { label: t('app.page.home', 'Home'), href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
          { label: t('app.page.account', 'Account') },
        ]}
        title={t('app.page.account', 'Account')}
      />

      <Section padding="sm" contentWidth="xs" aria-labelledby="account-heading">
        {!configured ? (
          <Banner status="info">{t('app.account.notConfigured', "Cloud accounts aren't configured for this build.")}</Banner>
        ) : user ? (
          <Card>
          <Stack gap="lg">
            <Paragraph>{t('app.account.signedInAs', 'Signed in as')} <strong>{user.email}</strong>. {t('app.account.sharedWorkspace', 'This is a shared workspace — every signed-in user sees and edits the same projects, themes, patterns, and images.')}</Paragraph>
            {status && <Banner status={status.status}>{status.message}</Banner>}
            {storage && (
              <Stack gap="xs">
                <Heading as="h2" size="sm">{t('app.account.whereDataStored', 'Where your data is stored')}</Heading>
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
              <Heading as="h2" size="sm">{t('app.account.syncNow', 'Sync now')}</Heading>
              <Paragraph size="sm" color="muted">
                {t('app.account.syncNowHint', "Pull the latest projects, patterns, themes, labels, backlog, and data sources from the shared workspace. Changes normally arrive live; use this if something looks out of date.")}
              </Paragraph>
              <Button variant="secondary" icon="cloud_sync" loading={syncing} onClick={handleSyncNow}>
                {t('app.account.syncNow', 'Sync now')}
              </Button>
            </Stack>

            <Stack gap="xs">
              <Heading as="h2" size="sm">{t('app.account.importLocalData', 'Import local data')}</Heading>
              <Paragraph size="sm" color="muted">
                {t('app.account.importLocalDataHint', 'Push everything stored in this browser — projects, patterns, themes, and images — up to the shared workspace (replaces the shared copy). Changes after this sync automatically.')}
              </Paragraph>
              <Button variant="secondary" icon="cloud_upload" loading={pushing} onClick={handlePushLocal}>
                {t('app.account.importLocalData', 'Import local data')}{loadProjects().length ? ` (${loadProjects().length} projects)` : ''}
              </Button>
            </Stack>
            <ButtonContainer>
              <Button variant="secondary" onClick={() => signOut()}>{t('app.action.signOut', 'Sign out')}</Button>
              <Button variant="tertiary" icon="lock_reset" onClick={() => resetPassword(user.email).then(() => setStatus({ status: 'success', message: t('app.account.resetPasswordSent', 'Password reset email sent.') }))}>{t('app.account.resetPassword', 'Reset password')}</Button>
              <Button variant="destructive" icon="delete" onClick={handleDelete}>{t('app.account.deleteAccount', 'Delete account')}</Button>
            </ButtonContainer>
          </Stack>
          </Card>
        ) : (
          <Card>
          <Stack gap="md">
            <Paragraph size="sm" color="muted">{t('app.account.inviteOnly', 'Accounts are invite-only — sign in to continue.')}</Paragraph>
            <TextField label={t('app.account.emailLabel', 'Email')} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label={t('app.account.passwordLabel', 'Password')} type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {status && <Banner status={status.status}>{status.message}</Banner>}
            <ButtonContainer fillButtons>
              <Button variant="primary" loading={busy} onClick={submit}>{t('app.action.signIn', 'Sign in')}</Button>
            </ButtonContainer>
            <Button variant="tertiary" size="sm" icon="lock_reset" onClick={handleReset}>{t('app.account.forgotPassword', 'Forgot password?')}</Button>
          </Stack>
          </Card>
        )}
      </Section>
    </>
  )
}
