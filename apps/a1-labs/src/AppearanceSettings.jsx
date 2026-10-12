import React, { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Button, IconButton, Stack, Menu, MenuSection, SegmentedControl, SelectField } from '@gtivr4/a1-design-system-react'
// Keep Labs' choices and theme classes aligned with the A1-web settings menu.
import { settingsThemeOptions, settingsThemeValues, themeClassName, themeOptions } from '../../a1-web/src/lib/appThemes.ts'

import breakpoints from '../../../system/tokens/breakpoint.json'

export const AppearanceContext = createContext(null)
const inlineQuery = `(min-width: ${breakpoints.breakpoint.md.min.$value})`

const modes = [
  { value: 'light', label: 'Light', icon: 'light_mode', ariaLabel: 'Light mode' },
  { value: 'dark', label: 'Dark', icon: 'dark_mode', ariaLabel: 'Dark mode' },
  { value: 'system', label: 'System', icon: 'desktop_windows', ariaLabel: 'System mode' },
]

function readPreference(key, values, fallback) {
  try {
    const saved = window.localStorage.getItem(key)
    return values.includes(saved) ? saved : fallback
  } catch {
    return fallback
  }
}

export function useAppearanceSettings() {
  const [theme, setTheme] = useState(() => readPreference('a1-labs-theme', settingsThemeValues, 'a1Light'))
  const [mode, setMode] = useState(() => readPreference('a1-labs-color-mode', modes.map(item => item.value), 'dark'))
  const [systemDark, setSystemDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [open, setOpen] = useState(false)
  const [inline, setInline] = useState(() => window.matchMedia(inlineQuery).matches)
  useEffect(() => {
    const query = window.matchMedia(inlineQuery)
    const change = () => { setInline(query.matches); if (query.matches) setOpen(false) }
    change()
    query.addEventListener('change', change)
    return () => query.removeEventListener('change', change)
  }, [])

  const anchorRef = useRef(null)

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const update = event => setSystemDark(event.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useLayoutEffect(() => {
    const root = document.documentElement
    const activeTheme = themeClassName(theme)
    for (const option of themeOptions) {
      const className = themeClassName(option.value)
      if (className) root.classList.toggle(className, className === activeTheme)
    }
    const dark = mode === 'dark' || (mode === 'system' && systemDark)
    root.classList.toggle('a1-theme-dark', dark)
    root.classList.toggle('a1-theme-light', mode === 'light')
    document.querySelector('meta[name="color-scheme"]').content = dark ? 'dark' : 'light'
    try {
      localStorage.setItem('a1-labs-theme', theme)
      localStorage.setItem('a1-labs-color-mode', mode)
    } catch {
      // Appearance still works when browser storage is unavailable.
    }
  }, [theme, mode, systemDark])

  function openSettings(event) {
    anchorRef.current = event.currentTarget
    setOpen(true)
  }

  return { theme, setTheme, mode, setMode, systemDark, inline, open, setOpen, anchorRef, openSettings }
}

export function AppearanceControls() {
  const settings = useContext(AppearanceContext)
  if (!settings) return null
  if (!settings.inline) return <IconButton icon="settings" label="Settings" aria-haspopup="dialog" onClick={settings.openSettings} />
  return <Stack direction="row" align="center" gap={8} role="group" aria-label="Appearance">
    <SegmentedControl options={modes} value={settings.mode} onChange={settings.setMode} aria-label="Color scheme" size="md" />
    <SelectField aria-label="Theme" title="Theme" size="compact" value={settings.theme} onChange={event => settings.setTheme(event.target.value)}>
      {settingsThemeOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
    </SelectField>
  </Stack>
}

export function AppearanceSettings({ settings }) {
  return (
    <Menu open={settings.open} onClose={() => settings.setOpen(false)} anchorRef={settings.anchorRef} aria-label="Settings">
      <MenuSection label="Theme">
        <SelectField aria-label="Theme" size="compact" value={settings.theme} onChange={event => settings.setTheme(event.target.value)}>
          {settingsThemeOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
        </SelectField>
      </MenuSection>
      <MenuSection label="Color scheme">
        <SegmentedControl options={modes} value={settings.mode} onChange={settings.setMode} aria-label="Color scheme" size="md" fullWidth />
      </MenuSection>
      <MenuSection>
        <Button variant="secondary" size="sm" onClick={() => { settings.setTheme('a1Light'); settings.setMode('dark') }}>
          Reset to defaults
        </Button>
      </MenuSection>
    </Menu>
  )
}
