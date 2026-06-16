// OS-aware keyboard shortcut display symbols.
export const isMac = typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform)
export const MOD = isMac ? '⌘' : 'Ctrl+'
export const ALT = isMac ? '⌥' : 'Alt+'
export const SHIFT = '⇧'
export const DEL = isMac ? '⌫' : 'Del'
