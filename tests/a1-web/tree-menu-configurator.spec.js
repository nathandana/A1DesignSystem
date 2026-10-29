import { expect, test } from '@playwright/test'

const node = { id: 'tree-test', type: 'TreeMenu', props: {
  variant: 'expanded', expandedIds: ['parent', 'child'], items: [
    { id: 'parent', label: 'Parent', children: [{ id: 'child', label: 'Child' }] },
  ],
} }
async function readJson(page) {
  const field = page.getByRole('textbox', { name: 'Edit code', exact: true })
  await expect(field).toHaveValue(/"TreeMenu"/)
  return JSON.parse(await field.inputValue())
}

test('nested Add child and Remove controls operate only in their own open panels', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('a1-web-locale', 'en'))
  await page.goto(`/components/tree-menu?json=${encodeURIComponent(JSON.stringify(node))}`)
  const parentTrigger = page.getByRole('button', { name: 'Parent (1)', exact: true })
  await parentTrigger.click()
  const childTrigger = page.getByRole('region', { name: 'Parent (1)', exact: true }).getByRole('button', { name: 'Child', exact: true })
  const childBody = page.locator(`#${await childTrigger.getAttribute('aria-controls')}`)
  await expect(childTrigger).toHaveAttribute('aria-expanded', 'false')
  await expect.poll(() => childBody.evaluate(el => el.getBoundingClientRect().height)).toBe(0)
  await childTrigger.click()
  await childBody.getByRole('button', { name: 'Add child', exact: true }).click()
  const newItem = page.getByRole('region', { name: 'New item', exact: true })
  await expect(newItem.getByRole('textbox', { name: 'Label', exact: true })).toBeVisible()
  await newItem.getByRole('textbox', { name: 'Label', exact: true }).fill('Grandchild')
  await expect(page.getByRole('tree', { name: 'Settings navigation', exact: true }).getByRole('button', { name: 'Grandchild', exact: true })).toBeVisible()
  expect((await readJson(page)).props.items[0].children[0].children[0].label).toBe('Grandchild')
  await page.getByRole('region', { name: 'Grandchild', exact: true }).getByRole('button', { name: 'Remove', exact: true }).click()
  expect((await readJson(page)).props.items[0].children[0].children).toBeUndefined()
  await expect(page.getByRole('tree', { name: 'Settings navigation', exact: true }).getByRole('button', { name: 'Grandchild', exact: true })).toHaveCount(0)
  await page.getByRole('region', { name: 'Child', exact: true }).getByRole('button', { name: 'Remove', exact: true }).click()
  expect((await readJson(page)).props.items[0].children).toBeUndefined()
  await page.getByRole('region', { name: 'Parent', exact: true }).getByRole('button', { name: 'Remove', exact: true }).click()
  const empty = await readJson(page)
  expect(empty.props.items).toEqual([])
  await page.goto(`/components/tree-menu?json=${encodeURIComponent(JSON.stringify(empty))}`)
  expect((await readJson(page)).props.items).toEqual([])
  await expect(page.getByRole('button', { name: 'Account (3)', exact: true })).toHaveCount(0)
})
