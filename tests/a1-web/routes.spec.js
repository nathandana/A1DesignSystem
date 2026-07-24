import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']
const BLOCKING_IMPACTS = new Set(['critical', 'serious'])
const CORE_THEMES = [
  { id: 'default', value: 'a1Light' },
  { id: 'accessible', value: 'a1Accessible' },
  { id: 'heritage', value: 'a1Heritage' },
]
const BREAKPOINTS = [
  { id: 'xs', width: 375, height: 812 },
  { id: 'sm', width: 560, height: 812 },
  { id: 'md', width: 768, height: 900 },
  { id: 'lg', width: 1280, height: 900 },
  { id: 'xl', width: 1536, height: 960 },
]

function seedStableState(theme) {
  const stableTheme = theme || localStorage.getItem('a1-web-theme') || 'a1Light'
  localStorage.clear()
  localStorage.setItem('a1-web-product-tour-v1', 'dismissed')
  localStorage.setItem('a1-web-theme', stableTheme)
  localStorage.setItem('a1-web-color-mode', 'light')
  localStorage.setItem('a1-web-reduced-motion', 'true')
  localStorage.setItem('a1-web-contrast-more', 'false')
  localStorage.setItem('a1-web-locale', 'en')
}

async function waitForStablePage(page) {
  await page.locator('#root > *').first().waitFor({ state: 'visible', timeout: 10_000 })
  const main = page.locator('main').first()
  await main.waitFor({ state: 'visible', timeout: 10_000 })
  await page.evaluate(async () => {
    await document.fonts.ready
    await new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve))
    })
  })
}

async function scanAccessibility(page, include = null) {
  const builder = new AxeBuilder({ page }).withTags(WCAG_TAGS)
  return (include ? builder.include(include) : builder).analyze()
}

function blockingViolations(results) {
  return results.violations.filter((violation) => BLOCKING_IMPACTS.has(violation.impact))
}

function formatViolations(violations) {
  return violations
    .map((violation) => {
      const targets = violation.nodes
        .flatMap((node) => node.target)
        .slice(0, 3)
        .join(', ')
      return `${violation.impact}: ${violation.id}${targets ? ` (${targets})` : ''}`
    })
    .join('; ')
}

async function expectVisualBaseline(page, name) {
  const screenshot = await page.screenshot({
    caret: 'hide',
    timeout: 10_000,
  })
  expect(screenshot).toMatchSnapshot(name, {
    maxDiffPixelRatio: 0.02,
    threshold: 0.1,
  })
}

test.beforeEach(async ({ context }) => {
  await context.addInitScript(seedStableState)
})

test('every release route loads, matches its visual baseline and clears the accessibility gate', async ({ page }) => {
  const runtimeErrors = []
  const failures = []
  const warnings = []
  page.on('pageerror', (error) => runtimeErrors.push(error.message))

  await page.goto('/')
  const routeManifest = await page.locator('#a1-web-baseline-routes').textContent()
  const allRoutes = JSON.parse(routeManifest)
  const routeFilter = process.env.A1_WEB_QA_ROUTE
  const routes = routeFilter
    ? allRoutes.filter((route) => route.path === routeFilter)
    : allRoutes

  expect(routes.length, `No A1-Web route matched ${routeFilter}`).toBeGreaterThan(routeFilter ? 0 : 100)
  expect(new Set(routes.map((route) => route.path)).size).toBe(routes.length)

  for (const [index, route] of routes.entries()) {
    console.log(`[${index + 1}/${routes.length}] ${route.path}`)
    await test.step(route.path, async () => {
      runtimeErrors.length = 0

      try {
        const response = await page.goto(route.path, { waitUntil: 'domcontentloaded' })
        expect(response, `${route.path} did not return a document response`).not.toBeNull()
        expect(response.status(), `${route.path} returned HTTP ${response.status()}`).toBeLessThan(400)

        await waitForStablePage(page)
        expect(runtimeErrors, `${route.path} raised an uncaught browser error`).toEqual([])

        await expectVisualBaseline(page, `${route.id}.png`)

        const accessibility = await scanAccessibility(page)
        const blockers = blockingViolations(accessibility)
        if (accessibility.violations.length > blockers.length) {
          warnings.push({
            route: route.path,
            violations: accessibility.violations
              .filter((violation) => !BLOCKING_IMPACTS.has(violation.impact))
              .map(({ id, impact, helpUrl, nodes }) => ({
                id,
                impact,
                helpUrl,
                targets: nodes.flatMap((node) => node.target),
              })),
          })
        }
        expect(
          blockers,
          `${route.path} has blocking accessibility violations: ${formatViolations(blockers)}`,
        ).toEqual([])
      } catch (error) {
        failures.push(`${route.path}: ${error.message.split('\n')[0]}`)
      }
    })
  }

  await test.info().attach('nonblocking-accessibility-findings.json', {
    body: Buffer.from(JSON.stringify(warnings, null, 2)),
    contentType: 'application/json',
  })
  if (failures.length > 0) {
    await test.info().attach('route-baseline-failures.txt', {
      body: Buffer.from(failures.join('\n')),
      contentType: 'text/plain',
    })
  }

  expect(failures, `A1-Web route baseline failures:\n${failures.join('\n\n')}`).toEqual([])
})

test('core themes render across xs through xl breakpoints', async ({ page }) => {
  const failures = []
  await page.goto('/')

  for (const theme of CORE_THEMES) {
    for (const breakpoint of BREAKPOINTS) {
      const label = `${theme.id}-${breakpoint.id}`
      await test.step(label, async () => {
        try {
          await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height })
          await page.evaluate(seedStableState, theme.value)
          await page.goto(`/components/button?theme=${theme.value}`, { waitUntil: 'domcontentloaded' })
          await waitForStablePage(page)

          const accessibility = await scanAccessibility(page)
          const blockers = blockingViolations(accessibility)
          expect(
            blockers,
            `${label} has blocking accessibility violations: ${formatViolations(blockers)}`,
          ).toEqual([])

          await expectVisualBaseline(page, `matrix-${label}.png`)
        } catch (error) {
          failures.push(`${label}: ${error.message.split('\n')[0]}`)
        }
      })
    }
  }

  expect(failures, `A1-Web theme and breakpoint failures:\n${failures.join('\n\n')}`).toEqual([])
})
