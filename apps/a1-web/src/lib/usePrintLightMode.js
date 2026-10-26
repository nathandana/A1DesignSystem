import { useEffect } from 'react'

/**
 * Paper is always light (A1-2707). The system print rules handle OS-preference
 * dark and inverse scopes; an element that carries an explicit `.a1-theme-dark`
 * class (the document root, or a project theme scope) swaps it for
 * `.a1-theme-light` while the browser prints, then restores the reader's mode.
 *
 * `target` is an element or a ref to one. `dark` / `light` are the classes the
 * element carries on screen, used to restore it after printing.
 */
export function usePrintLightMode(target, { dark, light }) {
  useEffect(() => {
    const element = () => target?.current ?? target
    const toLight = () => {
      const el = element()
      if (!el) return
      el.classList.remove('a1-theme-dark')
      el.classList.add('a1-theme-light')
    }
    const restore = () => {
      const el = element()
      if (!el) return
      el.classList.toggle('a1-theme-dark', dark)
      el.classList.toggle('a1-theme-light', light)
    }
    window.addEventListener('beforeprint', toLight)
    window.addEventListener('afterprint', restore)
    return () => {
      window.removeEventListener('beforeprint', toLight)
      window.removeEventListener('afterprint', restore)
    }
  }, [target, dark, light])
}
