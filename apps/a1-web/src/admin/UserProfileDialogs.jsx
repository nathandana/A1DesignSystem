import {
  Banner,
  Button,
  ButtonContainer,
  CircularProgress,
  DataTable,
  DefinitionList,
  Dialog,
  Heading,
  MessageBadge,
  Paragraph,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { accessRoleLabel } from '../access/PageAccessBoundary.jsx'
import { useT } from '../labels/useT.js'

const ROLE_STATUS = {
  user: 'neutral',
  editor: 'info',
  admin: 'warn',
}

function formatDateTime(value, fallback) {
  if (!value) return fallback
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value))
  } catch {
    return fallback
  }
}

function historyActionLabel(t, action) {
  if (action === 'user_invited') return t('app.access.auditInvited', 'Invitation sent')
  if (action === 'user_deleted') return t('app.access.auditDeleted', 'User deleted')
  return t('app.access.auditRoleChanged', 'Role changed')
}

export function UserProfileDialog({
  open,
  user,
  history,
  logins,
  loading,
  error,
  currentUserId,
  onClose,
  onRetry,
  onEditRole,
  onDelete,
}) {
  const t = useT()
  const neverLabel = t('app.access.never', 'Never')
  const unavailableLabel = t('app.access.notProvided', 'Not provided')
  const isCurrentUser = user?.id === currentUserId
  const status = user?.bannedUntil
    ? t('app.access.accountSuspended', 'Suspended')
    : user?.emailConfirmedAt
      ? t('app.access.accountActive', 'Active')
      : t('app.access.invitationPending', 'Invitation pending')

  const historyRows = (history ?? []).map((entry) => ({
    id: entry.id,
    action: historyActionLabel(t, entry.action),
    actor: entry.actor_email ?? t('app.access.deletedAccount', 'Deleted account'),
    change: entry.action === 'user_deleted'
      ? accessRoleLabel(t, entry.previous_role)
      : entry.previous_role
        ? `${accessRoleLabel(t, entry.previous_role)} → ${accessRoleLabel(t, entry.new_role)}`
        : accessRoleLabel(t, entry.new_role),
    occurred: formatDateTime(entry.created_at, neverLabel),
    occurredAt: entry.created_at,
  }))

  const historyColumns = [
    { key: 'action', label: t('app.access.auditAction', 'Action'), sortable: true },
    { key: 'actor', label: t('app.access.auditActor', 'Administrator'), sortable: true },
    { key: 'change', label: t('app.access.auditChange', 'Role change') },
    {
      key: 'occurred',
      label: t('app.access.auditDate', 'Date'),
      sortable: true,
      sortAccessor: (row) => row.occurredAt,
    },
  ]
  const loginRows = (logins ?? []).map((entry) => ({
    id: entry.id,
    email: entry.user_email ?? user?.email ?? t('app.access.deletedAccount', 'Deleted account'),
    signedIn: formatDateTime(entry.signed_in_at, neverLabel),
    signedInAt: entry.signed_in_at,
  }))
  const loginColumns = [
    { key: 'email', label: t('app.access.userEmail', 'Email'), sortable: true },
    {
      key: 'signedIn',
      label: t('app.access.signedInAt', 'Signed in'),
      sortable: true,
      sortAccessor: (row) => row.signedInAt,
    },
  ]

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('app.access.userProfileTitle', 'User profile')}
      size="xl"
      footer={(
        <ButtonContainer align="end">
          <Button variant="secondary" onClick={onClose}>
            {t('app.access.close', 'Close')}
          </Button>
          {user && !isCurrentUser && (
            <>
              <Button variant="secondary" icon="manage_accounts" onClick={() => onEditRole(user)}>
                {t('app.access.editRole', 'Edit role')}
              </Button>
              <Button variant="destructive" icon="delete" onClick={() => onDelete(user)}>
                {t('app.access.deleteUser', 'Delete user')}
              </Button>
            </>
          )}
        </ButtonContainer>
      )}
    >
      <Stack gap="lg">
        {loading && (
          <Stack direction="row" gap="sm" align="center">
            <CircularProgress
              size="xs"
              indeterminate
              aria-label={t('app.access.loadingUserProfile', 'Loading user profile')}
            />
            <Paragraph size="sm" color="muted">
              {t('app.access.loadingUserProfile', 'Loading user profile')}
            </Paragraph>
          </Stack>
        )}

        {error && (
          <Banner
            status="error"
            variant="inline"
            action={(
              <Button size="sm" variant="secondary" icon="refresh" onClick={onRetry}>
                {t('app.access.retryUserProfile', 'Retry profile')}
              </Button>
            )}
          >
            {error}
          </Banner>
        )}

        {user && (
          <>
            <Stack gap="md">
              <Stack direction="row" gap="sm" align="center" wrap>
                <Heading as="h2" size="sm">{user.email || user.id}</Heading>
                <MessageBadge size="sm" subtle status={ROLE_STATUS[user.role]}>
                  {accessRoleLabel(t, user.role)}
                </MessageBadge>
                {isCurrentUser && (
                  <MessageBadge size="sm" subtle status="info">
                    {t('app.access.currentAccount', 'Current account')}
                  </MessageBadge>
                )}
              </Stack>
              <DefinitionList
                items={[
                  { label: t('app.access.userId', 'User ID'), value: user.id },
                  { label: t('app.access.userEmail', 'Email'), value: user.email || unavailableLabel },
                  { label: t('app.access.userPhone', 'Phone'), value: user.phone || unavailableLabel },
                  { label: t('app.access.currentRole', 'Role'), value: accessRoleLabel(t, user.role) },
                  { label: t('app.access.accountStatus', 'Status'), value: status },
                  {
                    label: t('app.access.signInProviders', 'Sign-in providers'),
                    value: user.providers?.length ? user.providers.join(', ') : unavailableLabel,
                  },
                  { label: t('app.access.accountCreated', 'Created'), value: formatDateTime(user.createdAt, neverLabel) },
                  { label: t('app.access.invitationSentAt', 'Invitation sent'), value: formatDateTime(user.invitedAt ?? user.confirmationSentAt, neverLabel) },
                  { label: t('app.access.emailConfirmedAt', 'Email confirmed'), value: formatDateTime(user.emailConfirmedAt, neverLabel) },
                  { label: t('app.access.lastSignIn', 'Last sign-in'), value: formatDateTime(user.lastSignInAt, neverLabel) },
                  { label: t('app.access.accountUpdated', 'Last updated'), value: formatDateTime(user.updatedAt, neverLabel) },
                ]}
              />
            </Stack>

            <Stack gap="md">
              <Stack gap="xs">
                <Heading as="h2" size="sm">{t('app.access.fullHistoryTitle', 'Full account history')}</Heading>
                <Paragraph size="sm" color="muted">
                  {t('app.access.fullHistoryDescription', 'Every recorded invitation, role change and deletion associated with this account.')}
                </Paragraph>
              </Stack>
              <DataTable
                caption={t('app.access.fullHistoryCaption', 'Complete account access history')}
                columns={historyColumns}
                rows={historyRows}
                getRowId={(row) => row.id}
                defaultSort={{ key: 'occurred', direction: 'desc' }}
                defaultPageSize={10}
                pageSizeOptions={[10, 25, 50]}
                emptyTitle={t('app.access.noUserHistoryTitle', 'No account history yet')}
                emptyDescription={t('app.access.noUserHistoryDescription', 'Invitations, role changes and deletions for this account will appear here.')}
                emptyIcon="history"
                size="compact"
                scrollable
              />
            </Stack>

            <Stack gap="md">
              <Stack gap="xs">
                <Heading as="h2" size="sm">
                  {t('app.access.fullLoginHistoryTitle', 'Full login history')}
                </Heading>
                <Paragraph size="sm" color="muted">
                  {t('app.access.fullLoginHistoryDescription', 'Every successful A1 password sign-in recorded for this account after login tracking was enabled.')}
                </Paragraph>
              </Stack>
              <DataTable
                caption={t('app.access.fullLoginHistoryCaption', 'Complete account login history')}
                columns={loginColumns}
                rows={loginRows}
                getRowId={(row) => row.id}
                defaultSort={{ key: 'signedIn', direction: 'desc' }}
                defaultPageSize={10}
                pageSizeOptions={[10, 25, 50]}
                emptyTitle={t('app.access.noLoginsTitle', 'No logins recorded')}
                emptyDescription={t('app.access.noLoginsDescription', 'Successful sign-ins recorded after login tracking was enabled will appear here.')}
                emptyIcon="login"
                size="compact"
                scrollable
              />
            </Stack>
          </>
        )}
      </Stack>
    </Dialog>
  )
}

export function UserDeleteDialog({
  user,
  confirmation,
  error,
  saving,
  onConfirmationChange,
  onClose,
  onDelete,
}) {
  const t = useT()
  const expectedConfirmation = user?.email || user?.id || ''
  const confirmed = confirmation.trim().toLowerCase() === expectedConfirmation.toLowerCase()

  return (
    <Dialog
      open={!!user}
      onClose={onClose}
      title={t('app.access.deleteUserTitle', 'Delete user')}
      status="error"
      size="sm"
      footer={(
        <ButtonContainer align="end">
          <Button variant="secondary" onClick={onClose}>
            {t('app.access.cancel', 'Cancel')}
          </Button>
          <Button
            type="submit"
            form="a1-admin-delete-user-form"
            variant="destructive"
            icon="delete"
            disabled={!confirmed}
            loading={saving}
          >
            {t('app.access.deleteUser', 'Delete user')}
          </Button>
        </ButtonContainer>
      )}
    >
      <form
        id="a1-admin-delete-user-form"
        onSubmit={(event) => {
          event.preventDefault()
          if (confirmed) onDelete()
        }}
      >
        <Stack gap="md">
          <Paragraph>
            {t('app.access.deleteUserWarning', 'This permanently deletes the account and associated authentication data. This action cannot be undone.')}
          </Paragraph>
          <Paragraph size="sm" color="muted">
            {t('app.access.deleteUserConfirmationGuidance', 'Type the account email or user ID exactly to confirm.')}
          </Paragraph>
          {error && <Banner status="error" variant="inline">{error}</Banner>}
          <TextField
            label={t('app.access.deleteUserConfirmationLabel', 'Account email or user ID')}
            value={confirmation}
            onChange={(event) => onConfirmationChange(event.target.value)}
            autoComplete="off"
          />
        </Stack>
      </form>
    </Dialog>
  )
}
