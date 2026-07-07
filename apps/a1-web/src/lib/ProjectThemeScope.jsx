import { useEffect, useMemo, useRef } from 'react'
import { themeClassName } from './appThemes.ts'

const scopedThemeStyleDocs = new WeakSet()

function cloneScopedThemeRules(targetDocument) {
  const doc = targetDocument ?? document
  if (!doc || scopedThemeStyleDocs.has(doc)) return
  const Rule = doc.defaultView?.CSSRule ?? CSSRule
  const chunks = []

  const appendRules = (rules, media = '') => {
    for (const rule of Array.from(rules ?? [])) {
      if (rule.type === Rule.STYLE_RULE) {
        const styleRule = rule
        if (!styleRule.selectorText?.includes('html.a1-theme-')) continue
        const selector = styleRule.selectorText
          .split(',')
          .map((part) => part.trim())
          .filter((part) => part.includes('html.a1-theme-'))
          .map((part) => part.replace(/\bhtml\b/g, '.a1-theme-scope'))
          .join(', ')
        if (!selector) continue
        chunks.push(`${media}${selector}{${styleRule.style.cssText}}${media ? '}' : ''}`)
      } else if (rule.type === Rule.MEDIA_RULE) {
        const mediaRule = rule
        appendRules(mediaRule.cssRules, `@media ${mediaRule.conditionText}{`)
      }
    }
  }

  for (const sheet of Array.from(doc.styleSheets)) {
    try { appendRules(sheet.cssRules) } catch { /* ignore cross-origin sheets */ }
  }

  if (chunks.length) {
    const style = doc.createElement('style')
    style.setAttribute('data-a1-project-theme-scope', '')
    style.textContent = chunks.join('\n')
    doc.head.appendChild(style)
  }
  scopedThemeStyleDocs.add(doc)
}

export function projectThemeClassName({ theme, colorMode, resolvedColorScheme }) {
  const classes = ['a1-theme-scope', 'a1-project-theme-scope']
  const themeClass = themeClassName(theme)
  if (themeClass) classes.push(themeClass)
  if (resolvedColorScheme === 'dark') classes.push('a1-theme-dark')
  if (colorMode === 'light') classes.push('a1-theme-light')
  return classes.join(' ')
}

export function ProjectThemeScope({ theme, colorMode, resolvedColorScheme, children }) {
  const ref = useRef(null)
  useEffect(() => {
    cloneScopedThemeRules(ref.current?.ownerDocument ?? document)
  }, [])
  const className = useMemo(
    () => projectThemeClassName({ theme, colorMode, resolvedColorScheme }),
    [theme, colorMode, resolvedColorScheme],
  )
  return <div ref={ref} className={className}>{children}</div>
}
