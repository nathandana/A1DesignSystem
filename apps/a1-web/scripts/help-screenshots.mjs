/**
 * Automated Help screenshots — proof of concept.
 *
 * Captures real UI states with Playwright and writes PNGs into
 * apps/a1-web/public/help/, which the Help page references via
 * `<Figure src="/help/<name>.png" />`. Re-run any time to refresh the images so the
 * walkthrough never drifts from the live UI.
 *
 * Needs a running a1-web server. The normal dev server works when you're signed in;
 * for an ungated capture run a "smoke" server with empty Supabase env so the auth
 * gate is skipped and the bundled "Ember & Oak" sample project is seeded:
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

// Open a top-nav dropdown by its visible label. Finds the real trigger in the DOM
// (an aria-haspopup element whose text is the label), clicks it, and confirms a menu
// opened. Returns true on success.
async function openTopMenu(page, label) {
  const handle = await page.evaluateHandle((lbl) => {
    const visible = (e) => e.offsetParent !== null
    const els = Array.from(document.querySelectorAll('[aria-haspopup], header button, header a, nav button, nav a'))
    return (
      els.find((e) => visible(e) && e.getAttribute('aria-haspopup') && e.textContent.trim().startsWith(lbl)) ||
      els.find((e) => visible(e) && e.textContent.trim() === lbl) ||
      null
    )
  }, label)
  const el = handle.asElement()
  if (!el) return false
  await el.click().catch(() => {})
  await page.waitForTimeout(350)
  return await page.locator('[role="menu"]').first().isVisible().catch(() => false)
}

const shots = [
  {
    // The editor landing page: the Projects list with the sample project card.
    name: 'open-editor-projects',
    async run(page) {
      await page.goto(`${baseUrl}/?page=editor`, { waitUntil: 'networkidle' })
      await page.waitForSelector('text=/Ember\\s*&\\s*Oak/i', { timeout: 8000 }).catch(() => {})
      await page.waitForTimeout(500)
      return {} // full viewport
    },
  },
  {
    // The top-nav Editor menu opened, with the Projects submenu revealed so the
    // project list shows.
    name: 'open-editor-menu',
    async run(page) {
      await page.goto(`${baseUrl}/?page=home`, { waitUntil: 'networkidle' })
      await page.waitForTimeout(400)
      const opened = await openTopMenu(page, 'Editor')
      if (opened) {
        // Reveal the nested Projects flyout by moving the real cursor onto the
        // "Projects" item (hover-triggered submenu).
        const box = await page.evaluate(() => {
          const item = Array.from(document.querySelectorAll('[role="menu"] [role="menuitem"], [role="menu"] button, [role="menu"] a'))
            .find((e) => e.offsetParent !== null && e.textContent.trim().startsWith('Projects'))
          if (!item) return null
          const r = item.getBoundingClientRect()
          return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
        })
        if (box) {
          // Best-effort: reveal the nested project list. Some hover-intent menus
          // won't open from a teleported cursor; the top-level menu is captured
          // either way.
          await page.mouse.move(box.x, box.y)
          await page.waitForTimeout(600)
        }
      }
      // Clip to the top region where the nav + dropdown live.
      return { clip: { x: 0, y: 0, width: 1280, height: 600 } }
    },
  },
]

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 2,
  reducedMotion: 'reduce',
})
const page = await ctx.newPage()
for (const shot of shots) {
  const opts = (await shot.run(page)) || {}
  const file = resolve(outDir, `${shot.name}.png`)
  await page.screenshot({ path: file, ...opts })
  console.log('captured', file)
}
await browser.close()
console.log('done →', outDir)
