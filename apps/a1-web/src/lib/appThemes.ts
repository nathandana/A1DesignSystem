export const themeOptions = [
  { value: 'a1Light', label: 'Default' },
  { value: 'a1Heritage', label: 'Heritage' },
  { value: 'crochet', label: 'Crochet' },
  { value: 'aperture', label: 'Aperture' },
  { value: 'kong', label: 'Kong' },
  { value: 'lumen', label: 'Lumen' },
  { value: 'marshmallow', label: 'Marshmallow' },
  { value: 'a1Accessible', label: 'Accessible' },
  { value: 'fresh', label: 'Fresh' },
  { value: 'wireframe', label: 'Wireframe' },
]

export const settingsThemeOptions = themeOptions.filter((option) => !['crochet', 'marshmallow'].includes(option.value))
export const settingsThemeValues = settingsThemeOptions.map((option) => option.value)
export const VALID_THEMES = themeOptions.map((option) => option.value)

export function themeClassName(theme) {
  switch (theme) {
    case 'a1Heritage': return 'a1-theme-heritage'
    case 'a1Accessible': return 'a1-theme-accessible'
    case 'fresh': return 'a1-theme-fresh'
    case 'crochet': return 'a1-theme-crochet'
    case 'aperture': return 'a1-theme-aperture'
    case 'kong': return 'a1-theme-kong'
    case 'lumen': return 'a1-theme-lumen'
    case 'marshmallow': return 'a1-theme-marshmallow'
    case 'wireframe': return 'a1-theme-wireframe'
    default: return ''
  }
}
