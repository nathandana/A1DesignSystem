import assert from 'node:assert/strict'
import test from 'node:test'
import { chromium } from 'playwright'

const origin = process.env.LABS_ORIGIN ?? 'http://127.0.0.1:5187'

test('touch enlarges card actions before activating one', async t => {
  const browser = await chromium.launch({ headless: true })
  t.after(() => browser.close())
  const context = await browser.newContext({ hasTouch: true, viewport: { width: 390, height: 844 } })
  const page = await context.newPage()
  await page.goto(`${origin}/experiments/touch-card`)

  const group = page.locator('.a1-touch-card__actions')
  const save = page.getByRole('button', { name: 'Save field notes' })
  const radii = await page.locator('.a1-touch-card').evaluate((card, actionGroup) => [
    getComputedStyle(card).borderRadius,
    getComputedStyle(document.querySelector(actionGroup)).borderRadius,
  ], '.a1-touch-card__actions')
  assert.deepEqual(radii, ['12px', '4px'])
  const initialCardBox = await page.locator('.a1-touch-card').boundingBox()
  const initialGroupBox = await group.boundingBox()
  assert.equal(Math.round(initialGroupBox.y - initialCardBox.y), 8)
  assert.equal(Math.round(initialCardBox.x + initialCardBox.width - initialGroupBox.x - initialGroupBox.width), 8)
  assert.match(await save.getAttribute('class'), /a1-icon-button--small/)
  const initialCardHeight = initialCardBox.height
  const initialHeadingBox = await page.getByRole('heading', { name: 'Making city services easier to find' }).boundingBox()
  const initialBodyBox = await page.getByText(/Residents could usually name/).boundingBox()

  await save.tap()
  assert.equal(await save.getAttribute('aria-pressed'), 'false')
  assert.equal(await group.getAttribute('data-touch-ready'), 'true')
  assert.match(await save.getAttribute('class'), /a1-icon-button--small/)
  await page.waitForTimeout(250)
  const expandedButtonBox = await save.boundingBox()
  assert.deepEqual([expandedButtonBox.width, expandedButtonBox.height], [44, 44])
  assert.equal(await page.getByRole('status').textContent(), 'Actions enlarged. Tap an action again to use it.')
  const cardBox = await page.locator('.a1-touch-card').boundingBox()
  const groupBox = await group.boundingBox()
  assert.ok(groupBox.x >= cardBox.x && groupBox.x + groupBox.width <= cardBox.x + cardBox.width)
  assert.equal(cardBox.height, initialCardHeight)
  assert.deepEqual(await page.getByRole('heading', { name: 'Making city services easier to find' }).boundingBox(), initialHeadingBox)
  assert.deepEqual(await page.getByText(/Residents could usually name/).boundingBox(), initialBodyBox)

  await save.tap()
  assert.equal(await page.getByRole('button', { name: 'Remove field notes from saved items' }).getAttribute('aria-pressed'), 'true')
  assert.equal(await group.getAttribute('data-touch-ready'), null)
})

test('configuration previews enlarged actions on hover without changing layout or mouse activation', async t => {
  const browser = await chromium.launch({ headless: true })
  t.after(() => browser.close())
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  await page.goto(`${origin}/experiments/touch-card`)

  const card = page.locator('.a1-touch-card')
  assert.match(await page.locator('.a1-page-layout').getAttribute('class'), /a1-page-layout--aside-end/)
  const heading = page.getByRole('heading', { name: 'Making city services easier to find' })
  await page.locator('.a1-labs-configuration').getByRole('switch', { name: 'Show enlarged controls' }).check({ force: true })
  await page.evaluate(() => document.fonts.ready)
  const cardBox = await card.boundingBox()
  const headingBox = await heading.boundingBox()

  const save = page.getByRole('button', { name: 'Save field notes' })
  const initialButtonBox = await save.boundingBox()
  assert.deepEqual([initialButtonBox.width, initialButtonBox.height], [28, 28])
  await page.locator('.a1-touch-card__actions-slot').hover()
  await page.waitForTimeout(250)
  const buttonBox = await save.boundingBox()
  assert.deepEqual([buttonBox.width, buttonBox.height], [44, 44])
  assert.notEqual(await save.evaluate(element => getComputedStyle(element).transitionDuration), '0s')
  assert.deepEqual(await card.boundingBox(), cardBox)
  assert.deepEqual(await heading.boundingBox(), headingBox)
  await save.click()
  assert.equal(await page.getByRole('button', { name: 'Remove field notes from saved items' }).getAttribute('aria-pressed'), 'true')
  assert.equal(await page.locator('.a1-touch-card__actions').getAttribute('data-touch-ready'), null)
  await page.mouse.move(0, 0)
  await page.waitForTimeout(250)
  const compactButtonBox = await page.getByRole('button', { name: 'Remove field notes from saved items' }).boundingBox()
  assert.deepEqual([compactButtonBox.width, compactButtonBox.height], [28, 28])
  await page.emulateMedia({ reducedMotion: 'reduce' })
  assert.equal(await page.getByRole('button', { name: 'Remove field notes from saved items' }).evaluate(element => getComputedStyle(element).transitionDuration), '0s')
})
