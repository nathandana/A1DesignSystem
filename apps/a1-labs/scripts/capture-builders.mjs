export async function captureBuilders(page, origin, output, only) {
  for (const id of only ? [only] : ['automation-builder', 'token-styling', 'token-hierarchy', 'data-tables', 'pagination-types', 'avatars', 'tabs', 'code-highlighting', 'button-configurator-menu', 'text-selection', 'touch-card']) {
    await page.goto(`${origin}/experiments/${id}`)
    if (id === 'text-selection') {
      const study = page.locator('.a1-selection-study')
      await study.waitFor()
      const choose = name => page.locator('.a1-labs-configuration').getByRole('radio', { name }).check({ force: true })
      const select = locator => locator.evaluate(element => {
        const range = document.createRange()
        range.selectNodeContents(element)
        const selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(range)
        element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
      })
      await choose(/Information/)
      await select(study.getByText(/The new review workspace keeps/))
      await choose(/Warning/)
      await select(study.getByText(/Publishing is operating normally/))
      await page.evaluate(async () => {
        await document.fonts.ready
        const source = document.querySelector('.a1-selection-study')
        const bounds = source.getBoundingClientRect()
        const stage = document.createElement('div')
        stage.id = 'builder-capture'
        Object.assign(stage.style, { position: 'fixed', inset: '0 auto auto 0', zIndex: '9999', width: '640px', height: '360px', background: 'var(--semantic-color-surface-page)', overflow: 'hidden' })
        const scale = Math.min(592 / bounds.width, 312 / bounds.height)
        Object.assign(source.style, { position: 'absolute', width: `${bounds.width}px`, left: `${(640 - bounds.width * scale) / 2}px`, top: `${(360 - bounds.height * scale) / 2}px`, transformOrigin: 'top left', transform: `scale(${scale})` })
        stage.appendChild(source)
        document.body.appendChild(stage)
      })
      await page.locator('#builder-capture').screenshot({ path: new URL(`${id}.png`, output).pathname })
      continue
    }
    if (id === 'button-configurator-menu') {
      const button = page.getByRole('button', { name: 'Save changes', exact: true })
      await button.click()
      const menu = page.getByRole('dialog', { name: 'Configure button' })
      await menu.waitFor()
      const buttonBox = await button.boundingBox(), menuBox = await menu.boundingBox()
      const left = Math.min(buttonBox.x, menuBox.x) - 24
      const right = Math.max(buttonBox.x + buttonBox.width, menuBox.x + menuBox.width) + 24
      const top = Math.min(buttonBox.y, menuBox.y) - 24
      const width = right - left
      await page.screenshot({ path: new URL(`${id}.png`, output).pathname, clip: { x: left, y: top, width, height: width * 9 / 16 } })
      continue
    }
    if (id === 'tabs') await page.getByRole('radio', { name: 'Folder tabs', exact: true }).press('Space')
    const selector = { 'touch-card': '.a1-touch-card', 'code-highlighting': '.a1-code-highlighting-lab', tabs: '.a1-tabs-study', avatars: '.a1-avatars-lab', 'pagination-types': '.a1-pagination-types-lab', 'data-tables': '.a1-data-tables-lab', 'automation-builder': '.a1-automation-builder', 'token-styling': '.a1-token-study', 'token-hierarchy': '.a1-token-hierarchy' }[id]
    await page.locator(selector).waitFor()
    // Keep only the parts that read at card size (for avatars: profile and sizes).
    const keep = { avatars: ':scope > :nth-child(1), :scope > :nth-child(2)', 'code-highlighting': ':scope > :nth-child(1)' }[id]
    await page.evaluate(async ({ selector, keep }) => {
      await document.fonts.ready
      const stage = document.createElement('div'); stage.id = 'builder-capture'
      // Export dimensions only; the captured UI is the real experiment renderer.
      Object.assign(stage.style, { position: 'fixed', inset: '0 auto auto 0', width: '640px', height: '360px', background: 'var(--semantic-color-surface-page)', overflow: 'hidden' })
      const source = document.querySelector(selector)
      const preview = source.cloneNode(true)
      // cloneNode does not preserve a select's current value.
      const fields = source.querySelectorAll('select, input, textarea')
      preview.querySelectorAll('select, input, textarea').forEach((field, index) => { field.value = fields[index].value })
      Object.assign(preview.style, { position: 'absolute', width: '640px', transformOrigin: 'top left' })
      if (keep) { const kept = new Set(preview.querySelectorAll(keep)); [...preview.children].forEach(child => kept.has(child) || child.remove()) }
      stage.appendChild(preview); document.body.appendChild(stage)
      const bounds = preview.getBoundingClientRect(), scale = Math.min(592 / bounds.width, 312 / bounds.height)
      Object.assign(preview.style, { left: `${(640-bounds.width*scale)/2}px`, top: `${(360-bounds.height*scale)/2}px`, transform: `scale(${scale})` })
      document.getElementById('root').style.visibility = 'hidden'
    }, { selector, keep })
    await page.locator('#builder-capture').screenshot({ path: new URL(`${id}.png`, output).pathname })
  }
}
