import { expect, test } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { createPatternNode } from '../../packages/react/src/patterns/patternPolicies.js'

const labels = JSON.parse(readFileSync(new URL('../../system/labels/verification-dialog.json', import.meta.url))).label.verificationDialog

test('standalone and nested verification resolve every supported translation', async ({ page }) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem('a1-web-locale')) localStorage.setItem('a1-web-locale', 'en')
  })
  await page.goto('/pattern-library/verification-dialog')
  for (const locale of ['es', 'fr', 'de', 'pt', 'ja', 'zh', 'ar']) {
    await page.evaluate(value => localStorage.setItem('a1-web-locale', value), locale)
    for (const nested of [false, true]) {
      await page.goto(`/pattern-library/${nested ? 'overflow-menu' : 'verification-dialog'}`)
      if (nested) {
        await page.locator('.a1-overflow-menu').click()
        await page.getByRole('dialog').getByRole('button', { name: 'Delete', exact: true }).click()
      } else await page.getByRole('button', { name: 'Open verification', exact: true }).click()
      const dialog = page.getByRole('dialog', { name: labels.deleteTitle.locale[locale], exact: true })
      await expect(dialog).toBeVisible()
      await expect(dialog).toContainText(labels.deleteMessage.locale[locale])
      await expect(dialog.getByRole('button', { name: labels.delete.locale[locale], exact: true })).toBeVisible()
      await expect(dialog.getByRole('button', { name: labels.cancel.locale[locale], exact: true })).toBeFocused()
      await page.keyboard.press('Escape')
    }
  }
})

test('workspace keys, missing-key fallbacks and binding edits round-trip', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('a1-web-locale', 'fr')
    localStorage.setItem('a1-labels-v1', JSON.stringify({ locales: ['en', 'fr'], items: [
      { key: 'record.verifyTitle', en: 'Check record?', fr: 'Vérifier la fiche ?' },
      { key: 'record.cancel', en: 'Keep record', fr: 'Conserver la fiche' },
    ] }))
  })
  const node = createPatternNode('VerificationDialog', { id: 'verify', props: {
    title: 'Check record?', titleKey: 'record.verifyTitle', message: 'Fallback consequence.', messageKey: 'missing.message',
    confirmLabel: 'Proceed', confirmLabelKey: 'missing.confirm', cancelLabelKey: 'record.cancel',
  } })
  await page.goto(`/pattern-library/verification-dialog?json=${encodeURIComponent(JSON.stringify(node))}`)
  await page.getByRole('button', { name: 'Open verification', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Vérifier la fiche ?', exact: true })
  await expect(dialog).toContainText('Fallback consequence.')
  await expect(dialog.getByRole('button', { name: 'Proceed', exact: true })).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Conserver la fiche', exact: true })).toBeFocused()
  await page.keyboard.press('Escape')
  await page.getByRole('radio', { name: 'JSON', exact: true }).click()
  expect(JSON.parse(await page.getByRole('textbox', { name: 'Edit code', exact: true }).inputValue()).props).toMatchObject(node.props)
  await page.getByRole('textbox', { name: 'Verification title', exact: true }).fill('Custom title')
  const exported = JSON.parse(await page.getByRole('textbox', { name: 'Edit code', exact: true }).inputValue())
  expect(exported.props.title).toBe('Custom title')
  expect(exported.props.titleKey).toBeUndefined()
  expect(exported.props.cancelLabelKey).toBe('record.cancel')
})
