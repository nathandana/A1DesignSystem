import React, { useEffect, useRef } from 'react'
import { Tabs, TabList, Tab, TabPanel } from '@gtivr4/a1-design-system-react'
import './tabs.css'

export const TAB_TREATMENTS = [
  { id: 'default', label: 'A1 default', description: 'The standard underline and theme-selected color.' },
  { id: 'folder', label: 'Folder tabs', description: 'Raised file-folder tabs join the selected surface to its content sheet.' },
  { id: 'bold', label: 'Bold selected', description: 'A solid action fill makes the selected tab unmistakable.' },
  { id: 'pills', label: 'Pills', description: 'Separate rounded capsules with a filled selection.' },
  { id: 'outline', label: 'Outline', description: 'A strong outline encloses the selected label.' },
  { id: 'raised', label: 'Raised', description: 'A selected surface lifts out of a recessed track.' },
  { id: 'top-rail', label: 'Top rail', description: 'A top accent and tinted surface anchor the current view.' },
  { id: 'bookmark', label: 'Bookmarks', description: 'A notched ribbon marks the current section.' },
]

/** Controlled A1 tabs; only the opted-in visual treatment changes. */
export function StyledTabs({ items, value, onChange, treatment = 'default', icons = true, counts = false, size, label = 'Workspace views' }) {
  const host = useRef(null)
  const selectedTreatment = TAB_TREATMENTS.some(item => item.id === treatment) ? treatment : 'default'
  useEffect(() => {
    host.current?.querySelector('[role="tablist"]')?.setAttribute('aria-label', label)
    host.current?.querySelectorAll('[role="tabpanel"]').forEach(panel => {
      panel.tabIndex = panel.getAttribute('aria-hidden') === 'true' ? -1 : 0
    })
  }, [label, value, items.length])
  return <div ref={host} className="a1-tabs-study" data-treatment={selectedTreatment}>
    <Tabs value={value} onChange={onChange} variant="line" size={size}>
      <TabList>{items.map(item => <Tab key={item.id} value={item.id} icon={icons ? item.icon : undefined} count={counts ? item.count : undefined}>{item.label}</Tab>)}</TabList>
      {items.map(item => <TabPanel key={item.id} value={item.id}>{item.content}</TabPanel>)}
    </Tabs>
  </div>
}
