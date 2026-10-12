export async function captureBuilders(page, origin, output, only) {
  for (const id of only ? [only] : ['automation-builder', 'token-styling', 'token-hierarchy', 'data-tables', 'pagination-types', 'avatars']) {
    await page.goto(`${origin}/experiments/${id}`)
    const selector = { avatars: '.a1-avatars-lab', 'pagination-types': '.a1-pagination-types-lab', 'data-tables': '.a1-data-tables-lab', 'automation-builder': '.a1-automation-builder', 'token-styling': '.a1-token-study', 'token-hierarchy': '.a1-token-hierarchy' }[id]
    await page.locator(selector).waitFor()
    // Keep only the parts that read at card size (for avatars: profile and sizes).
    const keep = { avatars: ':scope > :nth-child(1), :scope > :nth-child(2)' }[id]
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
