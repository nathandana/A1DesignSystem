import { createContext, useCallback, useContext, useMemo } from 'react'
import { useAuth } from '../lib/AuthContext.jsx'
import {
  canRoleAccessPage,
  canRoleUseFeature,
  minimumRoleForPage,
  resolveAccessRole,
} from './accessPolicy.js'

const AccessContext = createContext(null)

export function AccessProvider({ children }) {
  const { user, configured } = useAuth()
  const access = useMemo(
    () => resolveAccessRole({ user, configured }),
    [configured, user],
  )
  const canAccessPage = useCallback(
    (pageId) => canRoleAccessPage(access.role, pageId),
    [access.role],
  )
  const canUseFeature = useCallback(
    (featureId) => canRoleUseFeature(access.role, featureId),
    [access.role],
  )

  const value = useMemo(() => ({
    ...access,
    isSignedIn: !!user,
    canAccessPage,
    canUseFeature,
    minimumRoleForPage,
  }), [access, canAccessPage, canUseFeature, user])

  return <AccessContext.Provider value={value}>{children}</AccessContext.Provider>
}

export function useAccess() {
  const value = useContext(AccessContext)
  if (!value) throw new Error('useAccess must be used within AccessProvider')
  return value
}

