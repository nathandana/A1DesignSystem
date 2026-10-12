import React, { useContext, useState } from 'react'
import { Heading, Paragraph, SearchField, Stack, TopHeader } from '@gtivr4/a1-design-system-react'

import { AppearanceContext, AppearanceControls } from './AppearanceSettings.jsx'
import { useLabsSearch } from './useSearchShortcut.js'
import { experimentMenu } from './experiment-menu.js'

// The one Labs toolbar, shared by the home gallery, About, release notes and every experiment.
// `current` marks the active nav item: "home" | "about" | "release-notes".
export function LabsHeader({ onOpenSettings, current }) {
  const settings = useContext(AppearanceContext)
  const { openSearch } = useLabsSearch()
  const [menuSearch, setMenuSearch] = useState('')
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  const menu = experimentMenu(menuSearch, path)
  // At md+ the appearance controls sit inline, inside the header's border.
  return (
    <TopHeader
      role="presentation"
      logo={<Heading as="span" size="sm">A1 Labs</Heading>}
      logoHref="/"
      navItems={[
        {
          id: 'experiments', label: 'Experiments', active: current === 'home' || path.startsWith('/experiments/'),
          menuHeader: ({ onClose }) => <Stack gap={8}>
            <SearchField aria-label="Search experiments" name="labs-experiments-menu-search" size="compact"
              autoComplete="off" autoCapitalize="none" autoCorrect="off" spellCheck={false}
              data-1p-ignore="true" data-bwignore="true" data-form-type="other" data-lpignore="true"
              value={menuSearch} onChange={event => setMenuSearch(event.target.value)}
              onSearch={value => {
                const first = value.trim() && experimentMenu(value, path).matches[0]
                if (!first) return
                onClose()
                window.location.assign(first.href)
              }} />
            {menuSearch.trim() && menu.matches.length === 0 && <Paragraph size="sm" color="muted" role="status">No experiments found.</Paragraph>}
          </Stack>,
          items: menu.items,
        },
        { id: 'about', label: 'About Labs', href: '/about', active: current === 'about' },
        { id: 'release-notes', label: 'Release notes', href: '/release-notes', active: current === 'release-notes' },
      ]}
      actions={[
        { id: 'search', icon: 'search', iconOnly: true, label: 'Search Labs', onClick: openSearch },
        ...(settings?.inline ? [] : [{ id: 'settings', icon: 'settings', iconOnly: true, label: 'Settings', onClick: onOpenSettings }]),
      ]}
      endContent={settings?.inline ? <AppearanceControls /> : undefined}
    />
  )
}
