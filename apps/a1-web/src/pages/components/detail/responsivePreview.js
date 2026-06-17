import { createContext, useContext } from 'react'

// True while a preview is rendered inside the responsive-preview iframe (a real
// nested viewport). Detail Previews can read this to render position:fixed chrome
// (BottomDrawer, StickyActions, sticky TopHeader) pinned to the device viewport,
// instead of the bounded containing-block used in the normal "Fit" preview.
export const ResponsivePreviewContext = createContext(false)

export function useInResponsivePreview() {
  return useContext(ResponsivePreviewContext)
}
