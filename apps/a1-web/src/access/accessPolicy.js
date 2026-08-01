export const USER_ROLES = Object.freeze({
  GUEST: 'guest',
  USER: 'user',
  EDITOR: 'editor',
  ADMIN: 'admin',
})

export const ROLE_ORDER = Object.freeze([
  USER_ROLES.GUEST,
  USER_ROLES.USER,
  USER_ROLES.EDITOR,
  USER_ROLES.ADMIN,
])

export const FEATURE_ACCESS = Object.freeze({
  cloudWorkspace: USER_ROLES.USER,
  detailedReleaseNotes: USER_ROLES.USER,
  backlog: USER_ROLES.EDITOR,
  governanceEditors: USER_ROLES.EDITOR,
  themeEditor: USER_ROLES.ADMIN,
  administration: USER_ROLES.ADMIN,
})

const PAGE_ACCESS = Object.freeze({
  home: USER_ROLES.GUEST,
  features: USER_ROLES.GUEST,
  'get-started': USER_ROLES.GUEST,
  presentation: USER_ROLES.GUEST,
  blog: USER_ROLES.GUEST,
  'blog-article': USER_ROLES.GUEST,
  labs: USER_ROLES.GUEST,
  foundations: USER_ROLES.GUEST,
  components: USER_ROLES.GUEST,
  playground: USER_ROLES.GUEST,
  editor: USER_ROLES.GUEST,
  'editor-preview': USER_ROLES.GUEST,
  projects: USER_ROLES.GUEST,
  help: USER_ROLES.GUEST,
  accessibility: USER_ROLES.GUEST,
  releases: USER_ROLES.GUEST,
  about: USER_ROLES.GUEST,
  account: USER_ROLES.GUEST,
  'kitchen-sink': USER_ROLES.GUEST,
  patterns: USER_ROLES.USER,
  'image-library': USER_ROLES.USER,
  'custom-icons': USER_ROLES.USER,
  data: USER_ROLES.USER,
  dashboard: USER_ROLES.EDITOR,
  rules: USER_ROLES.EDITOR,
  'label-editor': USER_ROLES.EDITOR,
  'priority-guide': USER_ROLES.EDITOR,
  backlog: USER_ROLES.EDITOR,
  'backlog-ticket': USER_ROLES.EDITOR,
  'theme-editor': USER_ROLES.ADMIN,
  'virtual-team': USER_ROLES.ADMIN,
  admin: USER_ROLES.ADMIN,
  'admin-analytics': USER_ROLES.ADMIN,
})

export function normalizeRole(value, fallback = USER_ROLES.USER) {
  return ROLE_ORDER.includes(value) ? value : fallback
}

export function roleMeetsMinimum(role, minimumRole) {
  return ROLE_ORDER.indexOf(normalizeRole(role, USER_ROLES.GUEST))
    >= ROLE_ORDER.indexOf(normalizeRole(minimumRole, USER_ROLES.ADMIN))
}

export function minimumRoleForPage(pageId) {
  if (pageId?.startsWith('foundation-') || pageId?.startsWith('components-') || pageId?.startsWith('component-')) {
    return USER_ROLES.GUEST
  }
  return PAGE_ACCESS[pageId] ?? USER_ROLES.ADMIN
}

export function canRoleAccessPage(role, pageId) {
  return roleMeetsMinimum(role, minimumRoleForPage(pageId))
}

export function canRoleUseFeature(role, featureId) {
  const minimumRole = FEATURE_ACCESS[featureId]
  return minimumRole ? roleMeetsMinimum(role, minimumRole) : false
}

export function resolveAccessRole({ user, configured }) {
  if (!configured) {
    return { role: USER_ROLES.ADMIN, source: 'local' }
  }
  if (!user) {
    return { role: USER_ROLES.GUEST, source: 'anonymous' }
  }
  return {
    role: normalizeRole(user.app_metadata?.role, USER_ROLES.USER),
    source: user.app_metadata?.role ? 'app_metadata' : 'default',
  }
}
