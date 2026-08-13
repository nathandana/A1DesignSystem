import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Banner,
  Button,
  ButtonContainer,
  Card,
  CircularProgress,
  DataTable,
  DefinitionList,
  Dialog,
  Heading,
  MessageBadge,
  Paragraph,
  Section,
  SelectField,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { accessRoleLabel } from '../access/PageAccessBoundary.jsx'
import { useAccess } from '../access/AccessContext.jsx'
import {
  deleteManagedUser,
  getManagedUserProfile,
  inviteManagedUser,
  listManagedUsers,
  updateManagedUserRole,
} from '../admin/userAdminApi.js'
import { UserDeleteDialog, UserProfileDialog } from '../admin/UserProfileDialogs.jsx'
import { useAuth } from '../lib/AuthContext.jsx'
import { useT } from '../labels/useT.js'
import { PageTitleArea } from './PageTitleArea.jsx'

const ROLE_STATUS = {
  user: 'neutral',
  editor: 'info',
  admin: 'warn',
}

function formatDate(value, fallback) {
  if (!value) return fallback
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(value))
  } catch {
    return fallback
  }
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

function RoleOptions({ t }) {
  return (
    <>
      <option value="user">{accessRoleLabel(t, 'user')}</option>
      <option value="editor">{accessRoleLabel(t, 'editor')}</option>
      <option value="admin">{accessRoleLabel(t, 'admin')}</option>
    </>
  )
}

export function Admin({ onNavigate }) {
  const t = useT()
  const { role, source } = useAccess()
  const { configured, user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [audit, setAudit] = useState([])
  const [logins, setLogins] = useState([])
  const [loading, setLoading] = useState(configured)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('user')
  const [editingUser, setEditingUser] = useState(null)
  const [editingRole, setEditingRole] = useState('user')
  const [dialogError, setDialogError] = useState('')
  const [saving, setSaving] = useState(false)
  const [profileUser, setProfileUser] = useState(null)
  const [profileHistory, setProfileHistory] = useState([])
  const [profileLogins, setProfileLogins] = useState([])
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deleting, setDeleting] = useState(false)
  const profileRequestRef = useRef(0)

  const sourceLabel = source === 'local'
    ? t('app.access.sourceLocal', 'Local build')
    : t('app.access.sourceAccount', 'Account metadata')

  const loadData = useCallback(async () => {
    if (!configured) return
    setLoading(true)
    setError('')
    try {
      const result = await listManagedUsers()
      setUsers(result.users ?? [])
      setAudit(result.audit ?? [])
      setLogins(result.logins ?? [])
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setLoading(false)
    }
  }, [configured])

  useEffect(() => {
    loadData()
  }, [loadData])

  function openInviteDialog() {
    setInviteEmail('')
    setInviteRole('user')
    setDialogError('')
    setInviteOpen(true)
  }

  function openRoleDialog(managedUser) {
    setEditingUser(managedUser)
    setEditingRole(managedUser.role)
    setDialogError('')
  }

  const loadProfile = useCallback(async (managedUser) => {
    const requestId = profileRequestRef.current + 1
    profileRequestRef.current = requestId
    setProfileLoading(true)
    setProfileError('')
    try {
      const result = await getManagedUserProfile(managedUser.id)
      if (profileRequestRef.current !== requestId) return
      setProfileUser(result.user ?? managedUser)
      setProfileHistory(result.history ?? [])
      setProfileLogins(result.logins ?? [])
    } catch (loadError) {
      if (profileRequestRef.current !== requestId) return
      setProfileError(loadError.message)
    } finally {
      if (profileRequestRef.current === requestId) setProfileLoading(false)
    }
  }, [])

  function openProfile(managedUser) {
    setProfileUser(managedUser)
    setProfileHistory([])
    setProfileLogins([])
    loadProfile(managedUser)
  }

  function closeProfile() {
    profileRequestRef.current += 1
    setProfileUser(null)
    setProfileHistory([])
    setProfileLogins([])
    setProfileError('')
  }

  function editRoleFromProfile(managedUser) {
    closeProfile()
    openRoleDialog(managedUser)
  }

  function openDeleteDialog(managedUser) {
    closeProfile()
    setDeleteTarget(managedUser)
    setDeleteConfirmation('')
    setDeleteError('')
  }

  function closeDeleteDialog() {
    setDeleteTarget(null)
    setDeleteConfirmation('')
    setDeleteError('')
  }

  async function handleInvite(event) {
    event.preventDefault()
    setSaving(true)
    setDialogError('')
    try {
      await inviteManagedUser(inviteEmail, inviteRole)
      setInviteOpen(false)
      await loadData()
      setFeedback(t('app.access.inviteSuccess', 'Invitation sent and role assigned.'))
    } catch (inviteError) {
      setDialogError(inviteError.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleRoleChange(event) {
    event.preventDefault()
    if (!editingUser) return
    setSaving(true)
    setDialogError('')
    try {
      await updateManagedUserRole(editingUser.id, editingRole)
      setEditingUser(null)
      await loadData()
      setFeedback(t('app.access.roleUpdateSuccess', 'Role updated. The account must refresh its session to receive the change.'))
    } catch (updateError) {
      setDialogError(updateError.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    setDeleteError('')
    try {
      await deleteManagedUser(deleteTarget.id, deleteConfirmation)
      closeDeleteDialog()
      await loadData()
      setFeedback(t('app.access.deleteSuccess', 'User deleted.'))
    } catch (deleteUserError) {
      setDeleteError(deleteUserError.message)
    } finally {
      setDeleting(false)
    }
  }

  const neverLabel = t('app.access.never', 'Never')
  const activeLabel = t('app.access.accountActive', 'Active')
  const invitedLabel = t('app.access.invitationPending', 'Invitation pending')
  const userRows = users.map((managedUser) => {
    const isCurrentUser = managedUser.id === currentUser?.id
    return {
      id: managedUser.id,
      email: managedUser.email,
      roleValue: managedUser.role,
      role: (
        <MessageBadge size="sm" subtle status={ROLE_STATUS[managedUser.role]}>
          {accessRoleLabel(t, managedUser.role)}
        </MessageBadge>
      ),
      statusValue: managedUser.emailConfirmedAt ? activeLabel : invitedLabel,
      status: (
        <MessageBadge
          size="sm"
          subtle
          status={managedUser.emailConfirmedAt ? 'success' : 'info'}
        >
          {managedUser.emailConfirmedAt ? activeLabel : invitedLabel}
        </MessageBadge>
      ),
      lastSignIn: formatDate(managedUser.lastSignInAt, neverLabel),
      lastSignInAt: managedUser.lastSignInAt,
      action: (
        <ButtonContainer align="start">
          <Button size="sm" variant="secondary" onClick={() => openProfile(managedUser)}>
            {t('app.access.viewProfile', 'View profile')}
          </Button>
          {isCurrentUser ? (
            <Paragraph as="span" size="xs" color="muted">
              {t('app.access.currentAccount', 'Current account')}
            </Paragraph>
          ) : (
            <Button size="sm" variant="secondary" onClick={() => openRoleDialog(managedUser)}>
              {t('app.access.editRole', 'Edit role')}
            </Button>
          )}
        </ButtonContainer>
      ),
    }
  })

  const userColumns = [
    {
      key: 'email',
      label: t('app.access.userEmail', 'Email'),
      sortable: true,
      searchable: true,
    },
    {
      key: 'role',
      label: t('app.access.currentRole', 'Role'),
      sortable: true,
      sortAccessor: (row) => row.roleValue,
      searchAccessor: (row) => row.roleValue,
    },
    {
      key: 'status',
      label: t('app.access.accountStatus', 'Status'),
      sortable: true,
      sortAccessor: (row) => row.statusValue,
      searchAccessor: (row) => row.statusValue,
    },
    {
      key: 'lastSignIn',
      label: t('app.access.lastSignIn', 'Last sign-in'),
      sortable: true,
      sortAccessor: (row) => row.lastSignInAt ?? '',
    },
    {
      key: 'action',
      label: t('app.access.userActions', 'Actions'),
      type: 'actions',
    },
  ]

  const auditRows = audit.map((entry) => ({
    id: entry.id,
    action: entry.action === 'user_invited'
      ? t('app.access.auditInvited', 'Invitation sent')
      : entry.action === 'user_deleted'
        ? t('app.access.auditDeleted', 'User deleted')
        : t('app.access.auditRoleChanged', 'Role changed'),
    actor: entry.actor_email ?? t('app.access.deletedAccount', 'Deleted account'),
    target: entry.target_email ?? t('app.access.deletedAccount', 'Deleted account'),
    change: entry.action === 'user_deleted'
      ? accessRoleLabel(t, entry.previous_role)
      : entry.previous_role
        ? `${accessRoleLabel(t, entry.previous_role)} → ${accessRoleLabel(t, entry.new_role)}`
        : accessRoleLabel(t, entry.new_role),
    occurred: formatDate(entry.created_at, neverLabel),
    occurredAt: entry.created_at,
  }))

  const auditColumns = [
    { key: 'action', label: t('app.access.auditAction', 'Action'), sortable: true },
    { key: 'actor', label: t('app.access.auditActor', 'Administrator'), sortable: true },
    { key: 'target', label: t('app.access.auditTarget', 'Account'), sortable: true },
    { key: 'change', label: t('app.access.auditChange', 'Role change') },
    {
      key: 'occurred',
      label: t('app.access.auditDate', 'Date'),
      sortable: true,
      sortAccessor: (row) => row.occurredAt,
    },
  ]

  const loginRows = logins.map((entry) => ({
    id: entry.id,
    email: entry.user_email ?? t('app.access.deletedAccount', 'Deleted account'),
    userId: entry.user_id ?? t('app.access.deletedAccount', 'Deleted account'),
    signedIn: formatDateTime(entry.signed_in_at, neverLabel),
    signedInAt: entry.signed_in_at,
  }))

  const loginColumns = [
    {
      key: 'email',
      label: t('app.access.userEmail', 'Email'),
      sortable: true,
      searchable: true,
    },
    {
      key: 'userId',
      label: t('app.access.userId', 'User ID'),
      sortable: true,
      searchable: true,
    },
    {
      key: 'signedIn',
      label: t('app.access.signedInAt', 'Signed in'),
      sortable: true,
      sortAccessor: (row) => row.signedInAt,
    },
  ]

  return (
    <>
      <PageTitleArea
        contentWidth="lg"
        headingId="admin-heading"
        breadcrumbItems={[
          {
            label: t('app.page.home', 'Home'),
            href: '/',
            onClick: (event) => {
              event.preventDefault()
              onNavigate?.('home')
            },
          },
          { label: t('app.page.admin', 'Administration') },
        ]}
        title={t('app.page.admin', 'Administration')}
        description={t('app.access.adminDescription', 'Manage accounts, roles and administrator-only preview tools.')}
      />
      <Section padding="sm" contentWidth="lg" aria-labelledby="admin-heading">
        <Stack gap="lg">
          <Card>
            <Stack gap="md">
              <Heading as="h2" size="sm">{t('app.access.currentAccess', 'Your access')}</Heading>
              <DefinitionList
                items={[
                  { label: t('app.access.currentRole', 'Role'), value: accessRoleLabel(t, role) },
                  { label: t('app.access.roleSource', 'Role source'), value: sourceLabel },
                ]}
              />
              <Paragraph size="sm" color="muted">
                {t('app.access.adminRoleGuidance', 'Hosted roles come from trusted Supabase account metadata. Local builds keep administrator access so offline development continues to work.')}
              </Paragraph>
            </Stack>
          </Card>

          {!configured ? (
            <Banner
              status="info"
              title={t('app.access.userManagementUnavailable', 'Cloud user management is unavailable')}
            >
              {t('app.access.userManagementUnavailableDescription', 'Configure Supabase and the server-only service key to list accounts, send invitations and assign roles.')}
            </Banner>
          ) : (
            <>
              <Card>
                <Stack gap="md">
                  <Stack direction="row" gap="md" align="center" justify="between" wrap>
                    <Stack gap="xs">
                      <Heading as="h2" size="sm">
                        {t('app.access.userManagement', 'User management')}
                      </Heading>
                      <Paragraph size="sm" color="muted">
                        {t('app.access.userManagementDescription', 'Invite people and control access with trusted account roles.')}
                      </Paragraph>
                    </Stack>
                    <Button icon="person_add" onClick={openInviteDialog}>
                      {t('app.access.inviteUser', 'Invite user')}
                    </Button>
                  </Stack>

                  {feedback && (
                    <Banner status="success" variant="inline">
                      {feedback}
                    </Banner>
                  )}
                  {error && (
                    <Banner
                      status="error"
                      variant="inline"
                      action={(
                        <Button size="sm" variant="secondary" icon="refresh" onClick={loadData}>
                          {t('app.access.retryUserManagement', 'Retry user management')}
                        </Button>
                      )}
                    >
                      {error}
                    </Banner>
                  )}

                  {loading ? (
                    <Stack direction="row" gap="sm" align="center">
                      <CircularProgress
                        size="xs"
                        indeterminate
                        aria-label={t('app.access.loadingUsers', 'Loading users')}
                      />
                      <Paragraph size="sm" color="muted">
                        {t('app.access.loadingUsers', 'Loading users')}
                      </Paragraph>
                    </Stack>
                  ) : (
                    <DataTable
                      caption={t('app.access.usersTableCaption', 'A1 user accounts')}
                      columns={userColumns}
                      rows={userRows}
                      getRowId={(row) => row.id}
                      searchableColumns={[
                        { key: 'email', label: t('app.access.userEmail', 'Email') },
                        {
                          key: 'role',
                          label: t('app.access.currentRole', 'Role'),
                          searchAccessor: (row) => row.roleValue,
                        },
                        {
                          key: 'status',
                          label: t('app.access.accountStatus', 'Status'),
                          searchAccessor: (row) => row.statusValue,
                        },
                      ]}
                      defaultSort={{ key: 'email', direction: 'asc' }}
                      defaultPageSize={10}
                      pageSizeOptions={[10, 25, 50]}
                      emptyTitle={t('app.access.noUsersTitle', 'No users yet')}
                      emptyDescription={t('app.access.noUsersDescription', 'Invite a user to create the first account.')}
                      emptyIcon="group_off"
                      scrollable
                    />
                  )}
                </Stack>
              </Card>

              <Card>
                <Stack gap="md">
                  <Stack gap="xs">
                    <Heading as="h2" size="sm">{t('app.access.auditTitle', 'Recent access activity')}</Heading>
                    <Paragraph size="sm" color="muted">
                      {t('app.access.auditDescription', 'Review the 50 most recent invitations, role changes and deletions.')}
                    </Paragraph>
                  </Stack>
                  <DataTable
                    caption={t('app.access.auditTableCaption', 'User administration audit history')}
                    columns={auditColumns}
                    rows={auditRows}
                    getRowId={(row) => row.id}
                    defaultSort={{ key: 'occurred', direction: 'desc' }}
                    emptyTitle={t('app.access.noAuditTitle', 'No access activity yet')}
                    emptyDescription={t('app.access.noAuditDescription', 'Invitations, role changes and deletions will appear here.')}
                    emptyIcon="history"
                    scrollable
                  />
                </Stack>
              </Card>

              <Card>
                <Stack gap="md">
                  <Stack gap="xs">
                    <Heading as="h2" size="sm">
                      {t('app.access.loginHistoryTitle', 'Login history')}
                    </Heading>
                    <Paragraph size="sm" color="muted">
                      {t('app.access.loginHistoryDescription', 'Review every successful A1 password sign-in recorded after login tracking was enabled.')}
                    </Paragraph>
                  </Stack>
                  <DataTable
                    caption={t('app.access.loginHistoryCaption', 'All recorded user logins')}
                    columns={loginColumns}
                    rows={loginRows}
                    getRowId={(row) => row.id}
                    searchableColumns={[
                      { key: 'email', label: t('app.access.userEmail', 'Email') },
                      { key: 'userId', label: t('app.access.userId', 'User ID') },
                    ]}
                    defaultSort={{ key: 'signedIn', direction: 'desc' }}
                    defaultPageSize={25}
                    pageSizeOptions={[25, 50, 100]}
                    emptyTitle={t('app.access.noLoginsTitle', 'No logins recorded')}
                    emptyDescription={t('app.access.noLoginsDescription', 'Successful sign-ins recorded after login tracking was enabled will appear here.')}
                    emptyIcon="login"
                    scrollable
                  />
                </Stack>
              </Card>

            </>
          )}

          <Card>
            <Stack gap="md">
              <Stack gap="xs">
                <Heading as="h2" size="sm">{t('app.access.previewTools', 'Preview tools')}</Heading>
                <Paragraph size="sm" color="muted">
                  {t('app.access.themeEditorDescription', 'Theme editing is an administrator preview because it changes shared visual foundations.')}
                </Paragraph>
              </Stack>
              <Button icon="palette" onClick={() => onNavigate?.('theme-editor')}>
                {t('app.access.openThemeEditor', 'Open theme editor')}
              </Button>
            </Stack>
          </Card>
        </Stack>
      </Section>

      <Dialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title={t('app.access.inviteUser', 'Invite user')}
        footer={(
          <ButtonContainer align="end">
            <Button variant="secondary" onClick={() => setInviteOpen(false)}>
              {t('app.access.cancel', 'Cancel')}
            </Button>
            <Button type="submit" form="a1-admin-invite-form" icon="send" loading={saving}>
              {t('app.access.sendInvite', 'Send invitation')}
            </Button>
          </ButtonContainer>
        )}
      >
        <form id="a1-admin-invite-form" onSubmit={handleInvite}>
          <Stack gap="md">
            <Paragraph size="sm" color="muted">
              {t('app.access.inviteDialogDescription', 'The person will receive an email invitation and the selected role.')}
            </Paragraph>
            {dialogError && <Banner status="error" variant="inline">{dialogError}</Banner>}
            <TextField
              label={t('app.access.userEmail', 'Email')}
              type="email"
              autoComplete="email"
              value={inviteEmail}
              onChange={(event) => setInviteEmail(event.target.value)}
              required
            />
            <SelectField
              label={t('app.access.currentRole', 'Role')}
              value={inviteRole}
              onChange={(event) => setInviteRole(event.target.value)}
            >
              <RoleOptions t={t} />
            </SelectField>
          </Stack>
        </form>
      </Dialog>

      <Dialog
        open={!!editingUser}
        onClose={() => setEditingUser(null)}
        title={t('app.access.editRoleDialogTitle', 'Edit user role')}
        footer={(
          <ButtonContainer align="end">
            <Button variant="secondary" onClick={() => setEditingUser(null)}>
              {t('app.access.cancel', 'Cancel')}
            </Button>
            <Button type="submit" form="a1-admin-role-form" icon="check" loading={saving}>
              {t('app.access.saveRole', 'Save role')}
            </Button>
          </ButtonContainer>
        )}
      >
        <form id="a1-admin-role-form" onSubmit={handleRoleChange}>
          <Stack gap="md">
            <Paragraph>{editingUser?.email}</Paragraph>
            <Paragraph size="sm" color="muted">
              {t('app.access.roleRefreshGuidance', 'The account must refresh its session after the role changes.')}
            </Paragraph>
            {dialogError && <Banner status="error" variant="inline">{dialogError}</Banner>}
            <SelectField
              label={t('app.access.currentRole', 'Role')}
              value={editingRole}
              onChange={(event) => setEditingRole(event.target.value)}
            >
              <RoleOptions t={t} />
            </SelectField>
          </Stack>
        </form>
      </Dialog>

      <UserProfileDialog
        open={!!profileUser}
        user={profileUser}
        history={profileHistory}
        logins={profileLogins}
        loading={profileLoading}
        error={profileError}
        currentUserId={currentUser?.id}
        onClose={closeProfile}
        onRetry={() => profileUser && loadProfile(profileUser)}
        onEditRole={editRoleFromProfile}
        onDelete={openDeleteDialog}
      />

      <UserDeleteDialog
        user={deleteTarget}
        confirmation={deleteConfirmation}
        error={deleteError}
        saving={deleting}
        onConfirmationChange={setDeleteConfirmation}
        onClose={closeDeleteDialog}
        onDelete={handleDelete}
      />
    </>
  )
}
