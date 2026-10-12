import React, { useContext } from 'react'
import { Heading, TopHeader } from '@gtivr4/a1-design-system-react'

import { AppearanceContext, AppearanceControls } from './AppearanceSettings.jsx'
import { useLabsSearch } from './useSearchShortcut.js'

// The one Labs toolbar, shared by the home gallery, About and every experiment.
// `current` marks the active nav item: "home" | "about".
export function LabsHeader({ onOpenSettings, current }) {
  const settings = useContext(AppearanceContext)
  const { openSearch } = useLabsSearch()
  // At md+ the appearance controls sit inline, inside the header's border.
  return (
    <TopHeader
      role="presentation"
      logo={<Heading as="span" size="sm">A1 Labs</Heading>}
      logoHref="/"
      navItems={[
        { id: 'experiments', label: 'All experiments', href: '/', active: current === 'home' },
        { id: 'about', label: 'About Labs', href: '/about', active: current === 'about' },
      ]}
      actions={[
        { id: 'search', icon: 'search', iconOnly: true, label: 'Search Labs', onClick: openSearch },
        ...(settings?.inline ? [] : [{ id: 'settings', icon: 'settings', iconOnly: true, label: 'Settings', onClick: onOpenSettings }]),
      ]}
      endContent={settings?.inline ? <AppearanceControls /> : undefined}
    />
  )
}
