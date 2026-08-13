import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const BREAKPOINTS = [
  { id: 'xs', width: 375, visible: false },
  { id: 'sm', width: 560, visible: true },
  { id: 'md', width: 768, visible: false },
  { id: 'lg', width: 1280, visible: true },
  { id: 'xl', width: 1536, visible: false },
]

const THEMES = ['a1Light', 'a1Accessible', 'a1Heritage']
const TEST_COPY = 'Breakpoint-specific visibility probe'
const definition = {
  type: 'Paragraph',
  id: 'responsive-visibility-probe',
  visibility: { xs: false, sm: true, md: false, lg: true, xl: false },
  content: { fallback: TEST_COPY },
}

test('responsive nodes follow every A1 breakpoint across core themes', async ({ page }) => {
  const json = encodeURIComponent(JSON.stringify(definition))

  for (const theme of THEMES) {
    await page.goto('/')
    await page.evaluate((value) => {
      localStorage.setItem('a1-web-theme', value)
      localStorage.setItem('a1-web-color-mode', 'light')
      localStorage.setItem('a1-web-reduced-motion', 'true')
      localStorage.setItem('a1-web-locale', 'en')
    }, theme)

    for (const breakpoint of BREAKPOINTS) {
      await test.step(`${theme}-${breakpoint.id}`, async () => {
        await page.setViewportSize({ width: breakpoint.width, height: 900 })
        await page.goto(`/playground?json=${json}`, { waitUntil: 'domcontentloaded' })

        const probe = page.getByText(TEST_COPY, { exact: true })
        await expect(probe).toHaveCount(1)
        if (breakpoint.visible) {
          await expect(probe).toBeVisible()
        } else {
          await expect(probe).toBeHidden()
          await expect(probe).toHaveCSS('display', 'none')
        }
      })
    }
  }

  await page.setViewportSize({ width: 560, height: 900 })
  await page.goto(`/playground?json=${json}`, { waitUntil: 'domcontentloaded' })
  const accessibility = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(accessibility.violations.filter(({ impact }) => impact === 'critical' || impact === 'serious')).toEqual([])
})
