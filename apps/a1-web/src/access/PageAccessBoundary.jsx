import {
  Button,
  ButtonContainer,
  Card,
  Heading,
  MessageBadge,
  Paragraph,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { useT } from '../labels/useT.js'
import { PageTitleArea } from '../pages/PageTitleArea.jsx'
import { useAccess } from './AccessContext.jsx'
import { USER_ROLES } from './accessPolicy.js'

const ROLE_LABEL_KEYS = {
  [USER_ROLES.GUEST]: 'app.access.roleGuest',
  [USER_ROLES.USER]: 'app.access.roleUser',
  [USER_ROLES.EDITOR]: 'app.access.roleEditor',
  [USER_ROLES.ADMIN]: 'app.access.roleAdmin',
}

const DENIED_DESCRIPTION_KEYS = {
  [USER_ROLES.USER]: 'app.access.deniedUser',
  [USER_ROLES.EDITOR]: 'app.access.deniedEditor',
  [USER_ROLES.ADMIN]: 'app.access.deniedAdmin',
}

const ROLE_FALLBACKS = {
  [USER_ROLES.GUEST]: 'Guest',
  [USER_ROLES.USER]: 'User',
  [USER_ROLES.EDITOR]: 'Editor',
  [USER_ROLES.ADMIN]: 'Administrator',
}

export function accessRoleLabel(t, role) {
  return t(ROLE_LABEL_KEYS[role], ROLE_FALLBACKS[role])
}

export function PageAccessBoundary({ page, onNavigate, children }) {
  const t = useT()
  const { canAccessPage, isSignedIn, minimumRoleForPage, role } = useAccess()
  if (canAccessPage(page)) return children

  const requiredRole = minimumRoleForPage(page)
  const description = t(
    DENIED_DESCRIPTION_KEYS[requiredRole],
    requiredRole === USER_ROLES.USER
      ? 'Sign in with an A1 account to open this page.'
      : requiredRole === USER_ROLES.EDITOR
        ? 'This page is available to editors and administrators.'
        : 'This page is available to administrators.',
  )

  return (
    <>
      <PageTitleArea
        contentWidth="md"
        headingId="access-required-heading"
        breadcrumbItems={[
          {
            label: t('app.page.home', 'Home'),
            href: '/',
            onClick: (event) => {
              event.preventDefault()
              onNavigate?.('home')
            },
          },
          { label: t('app.access.deniedTitle', 'Access required') },
        ]}
        title={t('app.access.deniedTitle', 'Access required')}
        description={description}
      />
      <Section padding="sm" contentWidth="xs" aria-labelledby="access-required-heading">
        <Card>
          <Stack gap="md">
            <MessageBadge status="warn" icon="lock">
              {t('app.access.requiredRole', 'Required role')}: {accessRoleLabel(t, requiredRole)}
            </MessageBadge>
            <Stack gap="xs">
              <Heading as="h2" size="sm">{t('app.access.currentAccess', 'Your access')}</Heading>
              <Paragraph color="muted">
                {accessRoleLabel(t, role)}
              </Paragraph>
            </Stack>
            <ButtonContainer>
              {!isSignedIn && requiredRole !== USER_ROLES.GUEST ? (
                <Button variant="primary" onClick={() => onNavigate?.('account')}>
                  {t('app.action.signIn', 'Sign in')}
                </Button>
              ) : null}
              <Button variant="secondary" onClick={() => onNavigate?.('home')}>
                {t('app.page.home', 'Home')}
              </Button>
            </ButtonContainer>
          </Stack>
        </Card>
      </Section>
    </>
  )
}

