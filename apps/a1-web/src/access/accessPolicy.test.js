import assert from 'node:assert/strict'
import test from 'node:test'
import {
  USER_ROLES,
  canRoleAccessPage,
  canRoleUseFeature,
  minimumRoleForPage,
  resolveAccessRole,
} from './accessPolicy.js'

test('resolves hosted users from trusted app metadata', () => {
  assert.deepEqual(
    resolveAccessRole({ configured: true, user: { app_metadata: { role: 'editor' } } }),
    { role: USER_ROLES.EDITOR, source: 'app_metadata' },
  )
  assert.deepEqual(
    resolveAccessRole({ configured: true, user: { user_metadata: { role: 'admin' }, app_metadata: {} } }),
    { role: USER_ROLES.USER, source: 'default' },
  )
})

test('keeps anonymous hosted access public and unconfigured builds local', () => {
  assert.equal(resolveAccessRole({ configured: true, user: null }).role, USER_ROLES.GUEST)
  assert.equal(resolveAccessRole({ configured: false, user: null }).role, USER_ROLES.ADMIN)
})

test('applies the page hierarchy and defaults unknown pages to admin', () => {
  assert.equal(canRoleAccessPage(USER_ROLES.GUEST, 'editor'), true)
  assert.equal(canRoleAccessPage(USER_ROLES.GUEST, 'patterns'), false)
  assert.equal(canRoleAccessPage(USER_ROLES.USER, 'patterns'), true)
  assert.equal(canRoleAccessPage(USER_ROLES.USER, 'backlog'), false)
  assert.equal(canRoleAccessPage(USER_ROLES.EDITOR, 'backlog-ticket'), true)
  assert.equal(canRoleAccessPage(USER_ROLES.EDITOR, 'theme-editor'), false)
  assert.equal(canRoleAccessPage(USER_ROLES.ADMIN, 'theme-editor'), true)
  assert.equal(minimumRoleForPage('future-sensitive-page'), USER_ROLES.ADMIN)
})

test('keeps component and foundation documentation public', () => {
  assert.equal(canRoleAccessPage(USER_ROLES.GUEST, 'component-button'), true)
  assert.equal(canRoleAccessPage(USER_ROLES.GUEST, 'components-layout'), true)
  assert.equal(canRoleAccessPage(USER_ROLES.GUEST, 'foundation-color'), true)
})

test('restricts feature capabilities independently from routes', () => {
  assert.equal(canRoleUseFeature(USER_ROLES.GUEST, 'detailedReleaseNotes'), false)
  assert.equal(canRoleUseFeature(USER_ROLES.USER, 'detailedReleaseNotes'), true)
  assert.equal(canRoleUseFeature(USER_ROLES.USER, 'backlog'), false)
  assert.equal(canRoleUseFeature(USER_ROLES.EDITOR, 'backlog'), true)
  assert.equal(canRoleUseFeature(USER_ROLES.EDITOR, 'administration'), false)
  assert.equal(canRoleUseFeature(USER_ROLES.ADMIN, 'administration'), true)
})

