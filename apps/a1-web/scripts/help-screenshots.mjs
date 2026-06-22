/**
 * Automated Help screenshots.
 *
 * Captures real UI states with Playwright at BOTH desktop and mobile sizes and writes
 * PNGs into apps/a1-web/public/help/. Desktop → `<name>.png`, mobile → `<name>-mobile.png`.
 * The Help page renders them via the `Shot` component, which shows the device-appropriate
 * image. Re-run any time to refresh so the walkthrough never drifts from the live UI.
 *
 * Needs a running a1-web server. The normal dev server works when you're signed in; for an
 * ungated capture run a "smoke" server with empty Supabase env so the auth gate is skipped
 * and the bundled "Ember & Oak" sample project is seeded:
 *
 *   cd apps/a1-web
 *   printf 'VITE_SUPABASE_URL=\nVITE_SUPABASE_ANON_KEY=\n' > .env.smoke.local
 *   npx vite --mode smoke --port 5188 --strictPort --host 127.0.0.1 &
 *   node scripts/help-screenshots.mjs http://127.0.0.1:5188
 *   rm .env.smoke.local           # cleanup (it's gitignored)
 *
 * Usage: node scripts/help-screenshots.mjs [baseUrl]   (default http://127.0.0.1:5188)
 */
import pw from 'playwright'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const { chromium } = pw
const baseUrl = (process.argv[2] || process.env.A1_BASE_URL || 'http://127.0.0.1:5188').replace(/\/$/, '')
const outDir = resolve(dirname(fileURLToPath(import.meta.url)), '../public/help')
mkdirSync(outDir, { recursive: true })

const SAMPLE = '/?page=editor&project=proj-ember-oak' // the bundled Ember & Oak sample project
const VIEWPORTS = { desktop: { width: 1280, height: 800 }, mobile: { width: 390, height: 844 } }

// ── helpers ──────────────────────────────────────────────────────────────────
const go = (page, path) => page.goto(baseUrl + path, { waitUntil: 'networkidle' })
const settle = (page, ms = 700) => page.waitForTimeout(ms)
const waitText = (page, re, timeout = 8000) =>
  page.waitForFunction((src) => new RegExp(src, 'i').test(document.body.innerText), re.source, { timeout }).catch(() => {})

const clickExact = (page, text) =>
  page.evaluate((t) => {
    const el = Array.from(document.querySelectorAll('button, a, [role="tab"], [role="menuitem"]'))
      .find((e) => e.offsetParent !== null && e.textContent.trim() === t)
    if (el) { el.click(); return true }
    return false
  }, text)

// Open a top-nav dropdown by its label (finds the real aria-haspopup trigger).
async function openTopMenu(page, label) {
  const handle = await page.evaluateHandle((lbl) => {
    const vis = (e) => e.offsetParent !== null
    const els = Array.from(document.querySelectorAll('[aria-haspopup], header button, header a, nav button, nav a'))
    return els.find((e) => vis(e) && e.getAttribute('aria-haspopup') && e.textContent.trim().startsWith(lbl)) ||
      els.find((e) => vis(e) && e.textContent.trim() === lbl) || null
  }, label)
  const el = handle.asElement()
  if (!el) return false
  await el.click().catch(() => {})
  await settle(page, 350)
  return page.locator('[role="menu"]').first().isVisible().catch(() => false)
}

// Tap the mobile hamburger to open the nav drawer.
async function openMobileNav(page) {
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.offsetParent !== null && (b.querySelector('.a1-icon')?.textContent.trim() === 'menu' || b.getAttribute('aria-label')?.toLowerCase().includes('menu')))
    btn?.click()
  })
}

// ── shots ────────────────────────────────────────────────────────────────────
// Each: name + prep(page, {mobile}). Optional `sizes` (default both) and `clip(size)`.
const SHOTS = [
  {
    name: 'open-editor-projects', // → Getting started › Opening the editor
    prep: async (page) => { await go(page, '/?page=editor'); await waitText(page, /Ember\s*&\s*Oak/); await settle(page) },
  },
  {
    name: 'open-editor-menu', // → Getting started › Opening the editor (the Editor menu / mobile nav)
    clip: (size) => (size === 'desktop' ? { x: 0, y: 0, width: 1280, height: 600 } : null),
    prep: async (page, { mobile }) => {
      await go(page, '/?page=home'); await settle(page, 500)
      if (mobile) { await openMobileNav(page); await settle(page, 600) }
      else {
        const opened = await openTopMenu(page, 'Editor')
        if (opened) {
          const box = await page.evaluate(() => {
            const it = Array.from(document.querySelectorAll('[role="menu"] [role="menuitem"], [role="menu"] button, [role="menu"] a'))
              .find((e) => e.offsetParent !== null && e.textContent.trim().startsWith('Projects'))
            if (!it) return null
            const r = it.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
          })
          if (box) { await page.mouse.move(box.x, box.y); await settle(page, 500) }
        }
      }
    },
  },
  {
    name: 'project-pages', // → Pages & navigation (page tree, all pages, hierarchy)
    prep: async (page) => { await go(page, SAMPLE); await waitText(page, /Add page|Pages/); await settle(page) },
  },
  {
    name: 'editor-canvas', // → Selecting & editing (canvas + Configure panel)
    prep: async (page) => { await go(page, SAMPLE + '&doc=ember-menus'); await waitText(page, /Configure|Page|What we/); await settle(page, 900) },
  },
  {
    name: 'patterns', // → Patterns
    prep: async (page) => { await go(page, '/?page=patterns'); await waitText(page, /Patterns/); await settle(page) },
  },
  {
    name: 'image-library', // → Media & AI › Image library
    prep: async (page) => { await go(page, '/?page=image-library'); await waitText(page, /Image library/); await settle(page) },
  },
  {
    name: 'backlog-board', // → Backlog & feedback
    prep: async (page) => { await go(page, '/?page=backlog'); await waitText(page, /Board|Backlog/); await settle(page) },
  },
]

// ── run ──────────────────────────────────────────────────────────────────────
const browser = await chromium.launch()
for (const shot of SHOTS) {
  for (const size of shot.sizes || ['desktop', 'mobile']) {
    const ctx = await browser.newContext({ viewport: VIEWPORTS[size], deviceScaleFactor: 2, reducedMotion: 'reduce' })
    const page = await ctx.newPage()
    try { await shot.prep(page, { mobile: size === 'mobile', size }) }
    catch (e) { console.log('  prep error', shot.name, size, '—', e.message) }
    const file = `${shot.name}${size === 'mobile' ? '-mobile' : ''}.png`
    const clip = shot.clip?.(size)
    await page.screenshot({ path: resolve(outDir, file), ...(clip ? { clip } : {}) })
    console.log('captured', file)
    await ctx.close()
  }
}
await browser.close()
console.log('done →', outDir)
