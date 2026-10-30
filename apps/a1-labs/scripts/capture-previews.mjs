import { captureBuilders } from './capture-builders.mjs'
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from '@playwright/test'

// Run against the Labs dev server so the capture can use the actual renderer.
const origin = process.argv[2] ?? 'http://127.0.0.1:5187'
const builderOnly = { '--touch-card-only': 'touch-card', '--text-selection-only': 'text-selection', '--button-configurator-only': 'button-configurator-menu', '--code-highlighting-only': 'code-highlighting', '--tabs-only': 'tabs', '--avatars-only': 'avatars', '--pagination-types-only': 'pagination-types', '--data-tables-only': 'data-tables', '--automation-only': 'automation-builder', '--token-styling-only': 'token-styling', '--token-hierarchy-only': 'token-hierarchy' }[process.argv[3]]
const chatOnly = process.argv[3] === '--chat-only'
const trackerOnly = process.argv[3] === '--step-tracker-only'
const stepsOnly = process.argv[3] === '--steps-only'
const buttonMotionOnly = process.argv[3] === '--button-motion-only'
const formOnly = process.argv[3] === '--long-form-only'
const dobOnly = process.argv[3] === '--dob-only'
const journeyOnly = process.argv[3] === '--verification-only'
const billboardOnly = process.argv[3] === '--billboard-only'
const reorderOnly = process.argv[3] === '--reordering-only'
const verifyOnly = process.argv[3] === '--verify-only'
const nodesOnly = process.argv[3] === '--nodes-only'
const thinkingOnly = process.argv[3] === '--thinking-only'
const focusOnly = process.argv[3] === '--focus-only'
const switchThreeOnly = process.argv[3] === '--switch-three-only'
const switchOnly = process.argv[3] === '--switch-only'
const frostedOnly = process.argv[3] === '--frosted-only'
const tokensOnly = process.argv[3] === '--tokens-only'
const constructionOnly = process.argv[3] === '--construction-only'
const loadersOnly = process.argv[3] === '--loaders-only'
const requiredOnly = process.argv[3] === '--required-only'
const timelineOnly = process.argv[3] === '--timeline-only'
const flipBillboardOnly = process.argv[3] === '--flip-billboard-only'
const clockOnly = process.argv[3] === '--clock-only'
const slidesOnly = process.argv[3] === '--slides-only'
const modeSwitchesOnly = process.argv[3] === '--mode-switches-only'
const radioOnly = process.argv[3] === '--radio-only'
const accordionOnly = process.argv[3] === '--accordion-only'
const segmentedOnly = process.argv[3] === '--segmented-only'
const checkboxOnly = process.argv[3] === '--checkbox-only'
const passwordOnly = process.argv[3] === '--password-only'
const helpOnly = process.argv[3] === '--help-only'
const dialogOnly = process.argv[3] === '--dialog-only'
const celebrationOnly = process.argv[3] === '--celebration-only'
const fitOnly = process.argv[3] === '--fit-only'
const fenexOnly = process.argv[3] === '--fenex-only'
const gridOnly = process.argv[3] === '--grid-only'
const bulkOnly = process.argv[3] === '--bulk-only'
const mobileTablesOnly = process.argv[3] === '--mobile-tables-only'
const output = new URL('../public/previews/', import.meta.url)
await mkdir(output, { recursive: true })

// Capture the actual rendered DOM against a clean 16:9 export background.
// Preserve measured geometry (including fitted text/indicator coordinates).
async function captureIsolatedPreview(page, selector, filename) {
  await page.evaluate(async selector => {
    await document.fonts.ready
    const source = document.querySelector(selector)
    const bounds = source.getBoundingClientRect()
    const stage = document.createElement('div')
    stage.id = 'preview-capture'
    Object.assign(stage.style, { position: 'fixed', inset: '0 auto auto 0', width: '640px', height: '360px', overflow: 'hidden', background: 'var(--semantic-color-surface-page)' })
    const preview = source.cloneNode(true)
    const scale = Math.min(592 / bounds.width, 312 / bounds.height)
    Object.assign(preview.style, { position: 'absolute', width: `${bounds.width}px`, height: `${bounds.height}px`, left: `${(640 - bounds.width * scale) / 2}px`, top: `${(360 - bounds.height * scale) / 2}px`, transformOrigin: 'top left', transform: `scale(${scale})` })
    stage.appendChild(preview)
    document.body.appendChild(stage)
    document.getElementById('root').style.visibility = 'hidden'
  }, selector)
  await page.locator('#preview-capture').screenshot({ path: new URL(filename, output).pathname })
}

// Software WebGL so headless captures can render the 3D token visualizer.
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] })
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 2 })
  await page.addInitScript(() => {
    localStorage.setItem('a1-labs-theme', 'a1Light')
    localStorage.setItem('a1-labs-color-mode', 'dark')
  })

  if (!chatOnly && !builderOnly) {
  if (!trackerOnly && !stepsOnly && !buttonMotionOnly && !switchThreeOnly && !flipBillboardOnly && !clockOnly && !formOnly && !dobOnly && !journeyOnly && !billboardOnly && !reorderOnly && !verifyOnly && !nodesOnly && !thinkingOnly && !focusOnly && !switchOnly && !frostedOnly && !tokensOnly && !constructionOnly && !loadersOnly && !requiredOnly && !timelineOnly && !slidesOnly && !modeSwitchesOnly && !radioOnly && !accordionOnly && !segmentedOnly && !checkboxOnly && !passwordOnly && !helpOnly && !dialogOnly && !celebrationOnly && !fitOnly && !fenexOnly && !gridOnly && !bulkOnly && !mobileTablesOnly) {
    await page.goto(`${origin}/experiments/ai-image-generation`)
    await page.locator('canvas').waitFor()
    const image = await page.locator('canvas').evaluate(async source => {
      const { drawFrame, readVisuals } = await import('/src/image-generation/renderer.js')
      const canvas = document.createElement('canvas')
      canvas.width = 1280
      canvas.height = 720
      const context = canvas.getContext('2d')
      context.scale(2, 2)
      drawFrame(context, 640, 360, 9000,
        { progress: 0.6, reveal: 0 }, null, readVisuals(source), false, 'discs')
      return canvas.toDataURL('image/webp', 0.9)
    })
    await writeFile(new URL('ai-image-generation.webp', output), Buffer.from(image.split(',')[1], 'base64'))

    await page.goto(`${origin}/experiments/page-loading`)
    const frame = page.frameLocator('iframe')
    await frame.getByRole('button', { name: 'Stop animation', exact: true }).waitFor()
    await page.evaluate(async () => {
      await document.fonts.ready
      const viewport = document.querySelector('.a1-web-responsive-preview__viewport')
      const bounds = viewport.getBoundingClientRect()
      const stage = document.createElement('div')
      stage.id = 'preview-capture'
      // Export geometry only. Colors, bezel, radius and glow come from the app.
      Object.assign(stage.style, {
        position: 'fixed', inset: '0 auto auto 0', width: '640px', height: '360px',
        background: 'var(--semantic-color-surface-page)', overflow: 'hidden',
      })
      const padding = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--base-spacing-16'))
        * parseFloat(getComputedStyle(document.documentElement).fontSize)
      const scale = (360 - padding * 2) / bounds.height
      Object.assign(viewport.style, {
        position: 'absolute', left: `${(640 - bounds.width * scale) / 2}px`,
        top: `${padding}px`, transform: `scale(${scale})`, transformOrigin: 'top left',
      })
      stage.appendChild(viewport)
      document.body.appendChild(stage)
      document.getElementById('root').style.visibility = 'hidden'
    })
    // Moving an iframe may reload its document; wait for its portal content.
    await frame.getByRole('button', { name: 'Stop animation', exact: true }).waitFor()
    await frame.locator('body').evaluate(async body => {
      await body.ownerDocument.fonts.ready
      for (const animation of body.getAnimations({ subtree: true })) {
        animation.pause()
        animation.currentTime = 1000
      }
    })
    await page.locator('#preview-capture').screenshot({ path: new URL('page-loading.png', output).pathname })

    await page.goto(`${origin}/experiments/button-completion`)
    const button = page.locator('button.a1-button-completion')
    await button.click()
    await page.mouse.move(0, 0)
    await page.locator('button.a1-button-completion[data-status="success"]').waitFor()
    await page.waitForTimeout(1000) // let the checkmark finish drawing
    await page.evaluate(async () => {
      await document.fonts.ready
      const card = document.querySelector('.a1-button-completion').closest('.a1-card')
      const stage = document.createElement('div')
      stage.id = 'preview-capture'
      // Export geometry only. Colors, card and button styles come from the app.
      Object.assign(stage.style, {
        position: 'fixed', inset: '0 auto auto 0', width: '640px', height: '360px',
        display: 'grid', placeItems: 'center', background: 'var(--semantic-color-surface-page)',
      })
      card.style.width = '420px'
      card.style.scale = '0.8' // the send card is taller than the 16:9 frame
      stage.appendChild(card)
      document.body.appendChild(stage)
      document.getElementById('root').style.visibility = 'hidden'
    })
    await page.waitForTimeout(1000) // moving the card restarts its CSS animations
    await page.locator('#preview-capture').screenshot({ path: new URL('button-completion.png', output).pathname })
  }

  if (!trackerOnly && !stepsOnly && !buttonMotionOnly && !switchThreeOnly && !flipBillboardOnly && !clockOnly && !formOnly && !dobOnly && !journeyOnly && !billboardOnly && !reorderOnly && !verifyOnly && !nodesOnly && !thinkingOnly && !switchOnly && !frostedOnly && !tokensOnly && !constructionOnly && !loadersOnly && !requiredOnly && !timelineOnly && !slidesOnly && !modeSwitchesOnly && !radioOnly && !accordionOnly && !segmentedOnly && !checkboxOnly && !passwordOnly && !helpOnly && !dialogOnly && !celebrationOnly && !fitOnly && !fenexOnly && !gridOnly && !bulkOnly && !mobileTablesOnly) {
    await page.goto(`${origin}/experiments/focus-animations`)
    await page.getByRole('form', { name: 'Focus animation demo' }).waitFor()
    await page.evaluate(async () => {
      await document.fonts.ready
      const card = document.querySelector('.a1-focus-animation').closest('.a1-card')
      const bounds = card.getBoundingClientRect()
      const stage = document.createElement('div')
      stage.id = 'preview-capture'
      // Export geometry only; render the real form and its theme-owned focus ring.
      Object.assign(stage.style, {
        position: 'fixed', inset: '0 auto auto 0', width: '640px', height: '360px',
        background: 'var(--semantic-color-surface-page)', overflow: 'hidden',
      })
      const padding = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--base-spacing-16'))
        * parseFloat(getComputedStyle(document.documentElement).fontSize)
      const scale = Math.min((640 - padding * 2) / bounds.width, (360 - padding * 2) / bounds.height)
      Object.assign(card.style, {
        position: 'absolute', width: `${bounds.width}px`,
        left: `${(640 - bounds.width * scale) / 2}px`, top: `${padding}px`,
        transform: `scale(${scale})`, transformOrigin: 'top left',
      })
      stage.appendChild(card)
      document.body.appendChild(stage)
      document.getElementById('root').style.visibility = 'hidden'
      card.querySelector('input').focus()
      for (const animation of card.getAnimations({ subtree: true })) animation.finish()
    })
    await page.locator('#preview-capture').screenshot({ path: new URL('focus-animations.png', output).pathname })
  }

  if (!trackerOnly && !stepsOnly && !buttonMotionOnly && !switchThreeOnly && !flipBillboardOnly && !clockOnly && !formOnly && !dobOnly && !journeyOnly && !billboardOnly && !reorderOnly && !verifyOnly && !nodesOnly && !thinkingOnly && !focusOnly && !frostedOnly && !tokensOnly && !constructionOnly && !loadersOnly && !requiredOnly && !timelineOnly && !slidesOnly && !modeSwitchesOnly && !radioOnly && !accordionOnly && !segmentedOnly && !checkboxOnly && !passwordOnly && !helpOnly && !dialogOnly && !celebrationOnly && !fitOnly && !fenexOnly && !gridOnly && !bulkOnly && !mobileTablesOnly) {
    await page.goto(`${origin}/experiments/switch-morph`)
    await page.getByRole('switch', { name: 'Switch', exact: true }).waitFor({ state: 'attached' })
    await page.evaluate(async () => {
      await document.fonts.ready
      const source = document.querySelector('.a1-switch-morph')
      const stage = document.createElement('div')
      stage.id = 'preview-capture'
      // Two static states of the actual control, arranged only for export.
      Object.assign(stage.style, {
        position: 'fixed', inset: '0 auto auto 0', width: '640px', height: '360px',
        background: 'var(--semantic-color-surface-page)', overflow: 'hidden',
      })
      for (const [index, checked] of [false, true].entries()) {
        const control = source.cloneNode(true)
        const input = control.querySelector('input')
        input.removeAttribute('id')
        input.checked = checked
        Object.assign(control.style, {
          position: 'absolute', left: '50%', top: `${48 + index * 168}px`,
          transform: 'translateX(-50%)', width: 'max-content',
        })
        stage.appendChild(control)
      }
      document.body.appendChild(stage)
      document.getElementById('root').style.visibility = 'hidden'
      for (const animation of stage.getAnimations({ subtree: true })) animation.finish()
    })
    await page.locator('#preview-capture').screenshot({ path: new URL('switch-morph.png', output).pathname })
  }
  if (!trackerOnly && !stepsOnly && !buttonMotionOnly && !switchThreeOnly && !flipBillboardOnly && !clockOnly && !formOnly && !dobOnly && !journeyOnly && !billboardOnly && !reorderOnly && !verifyOnly && !nodesOnly && !thinkingOnly && !focusOnly && !switchOnly && !tokensOnly && !constructionOnly && !loadersOnly && !requiredOnly && !timelineOnly && !slidesOnly && !modeSwitchesOnly && !radioOnly && !accordionOnly && !segmentedOnly && !checkboxOnly && !passwordOnly && !helpOnly && !dialogOnly && !celebrationOnly && !fitOnly && !fenexOnly && !gridOnly && !bulkOnly && !mobileTablesOnly) {
    // Frosted glass: the actual sample page at laptop size, captured from the
    // responsive viewport (its iframe renders into the screenshot).
    await page.goto(`${origin}/experiments/frosted-glass`)
    await page.frameLocator('iframe').getByRole('button', { name: 'Request invite' }).waitFor()
    await page.getByRole('radio', { name: 'Laptop' }).click()
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(600)
    await page.locator('.a1-web-responsive-preview__viewport').screenshot({ path: new URL('frosted-glass.png', output).pathname })
  }
  if (!trackerOnly && !stepsOnly && !buttonMotionOnly && !switchThreeOnly && !flipBillboardOnly && !clockOnly && !formOnly && !dobOnly && !journeyOnly && !billboardOnly && !reorderOnly && !verifyOnly && !nodesOnly && !focusOnly && !switchOnly && !frostedOnly && !tokensOnly && !constructionOnly && !loadersOnly && !requiredOnly && !timelineOnly && !slidesOnly && !modeSwitchesOnly && !radioOnly && !accordionOnly && !segmentedOnly && !checkboxOnly && !passwordOnly && !helpOnly && !dialogOnly && !celebrationOnly && !fitOnly && !fenexOnly && !gridOnly && !bulkOnly && !mobileTablesOnly) {
    await page.goto(`${origin}/experiments/thinking-terminal`)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.getByText('A moose bit my sister once', { exact: false }).first().waitFor()
    await page.evaluate(async () => {
      await document.fonts.ready
      const source = document.querySelector('.a1-thinking-terminal-demo')
      const stage = document.createElement('div')
      stage.id = 'preview-capture'
      // Export geometry only; clone the actual themed chat, without its composer.
      Object.assign(stage.style, {
        position: 'fixed', inset: '0 auto auto 0', width: '640px', height: '360px',
        background: 'var(--semantic-color-surface-page)', overflow: 'hidden',
      })
      const preview = source.cloneNode(true)
      preview.querySelector('form')?.remove()
      preview.querySelectorAll('button').forEach(button => button.remove())
      Object.assign(preview.style, {
        position: 'absolute', width: '720px', transformOrigin: 'top left',
      })
      stage.appendChild(preview)
      document.body.appendChild(stage)
      const bounds = preview.getBoundingClientRect()
      const scale = Math.min(576 / bounds.width, 312 / bounds.height)
      Object.assign(preview.style, {
        left: `${(640 - bounds.width * scale) / 2}px`, top: `${(360 - bounds.height * scale) / 2}px`,
        transform: `scale(${scale})`,
      })
      document.getElementById('root').style.visibility = 'hidden'
    })
    await page.locator('#preview-capture').screenshot({ path: new URL('thinking-terminal.png', output).pathname })
  }
  if (!trackerOnly && !stepsOnly && !buttonMotionOnly && !switchThreeOnly && !flipBillboardOnly && !clockOnly && !formOnly && !dobOnly && !journeyOnly && !billboardOnly && !reorderOnly && !verifyOnly && !nodesOnly && !thinkingOnly && !focusOnly && !switchOnly && !frostedOnly && !constructionOnly && !loadersOnly && !requiredOnly && !timelineOnly && !slidesOnly && !modeSwitchesOnly && !radioOnly && !accordionOnly && !segmentedOnly && !checkboxOnly && !passwordOnly && !helpOnly && !dialogOnly && !celebrationOnly && !fitOnly && !fenexOnly && !gridOnly && !bulkOnly && !mobileTablesOnly) {
    // Color token visualizer: the live 3D OKLCH scene.
    await page.goto(`${origin}/experiments/token-visualizer`)
    await page.locator('.a1-web-color-space-scene canvas').waitFor()
    await page.waitForTimeout(2000)
    await page.locator('.a1-web-color-space-scene').screenshot({ path: new URL('token-visualizer.png', output).pathname })
  }
  if (!trackerOnly && !stepsOnly && !buttonMotionOnly && !switchThreeOnly && !flipBillboardOnly && !clockOnly && !formOnly && !dobOnly && !journeyOnly && !billboardOnly && !reorderOnly && !verifyOnly && !tokensOnly && !thinkingOnly && !focusOnly && !switchOnly && !frostedOnly && !constructionOnly && !loadersOnly && !requiredOnly && !timelineOnly && !slidesOnly && !modeSwitchesOnly && !radioOnly && !accordionOnly && !segmentedOnly && !checkboxOnly && !passwordOnly && !helpOnly && !dialogOnly && !celebrationOnly && !fitOnly && !fenexOnly && !gridOnly && !bulkOnly && !mobileTablesOnly) {
    await page.goto(`${origin}/experiments/connected-nodes`)
    await page.getByRole('button', { name: 'Tokens', exact: true }).waitFor()
    await page.evaluate(async () => {
      await document.fonts.ready
      const host = document.querySelector('.a1-connected-nodes')
      host.querySelector('.a1-canvas').style.minHeight = '0' // 16:9 export geometry only
      // Export bounds only; Canvas refits itself to the capture size.
      Object.assign(host.style, {
        position: 'fixed', inset: '0 auto auto 0', width: '640px', height: '360px', zIndex: '9999',
      })
    })
    await page.getByRole('button', { name: 'Zoom to fit all nodes', exact: true }).click()
    await page.locator('.a1-connected-nodes').screenshot({ path: new URL('connected-nodes.png', output).pathname })
  }
  if (!trackerOnly && !stepsOnly && !buttonMotionOnly && !switchThreeOnly && !flipBillboardOnly && !clockOnly && !formOnly && !dobOnly && !journeyOnly && !billboardOnly && !reorderOnly && !nodesOnly && !thinkingOnly && !focusOnly && !switchOnly && !frostedOnly && !tokensOnly && !constructionOnly && !loadersOnly && !requiredOnly && !timelineOnly && !slidesOnly && !modeSwitchesOnly && !radioOnly && !accordionOnly && !segmentedOnly && !checkboxOnly && !passwordOnly && !helpOnly && !dialogOnly && !celebrationOnly && !fitOnly && !fenexOnly && !gridOnly && !bulkOnly && !mobileTablesOnly) {
    await page.goto(`${origin}/experiments/verify-button`)
    await page.getByRole('button', { name: 'Arm launch', exact: true }).click()
    await page.evaluate(async () => {
      await document.fonts.ready
      const source = document.querySelector('.a1-verify-button')
      const stage = document.createElement('div')
      stage.id = 'preview-capture'
      // Static export geometry only; artwork and theme come from the real core.
      Object.assign(stage.style, { position: 'fixed', inset: '0 auto auto 0', width: '640px', height: '360px', background: 'var(--semantic-color-surface-page)', overflow: 'hidden' })
      const preview = source.cloneNode(true)
      preview.style.setProperty('--a1-verify-button-progress', '72%')
      preview.querySelector('.a1-verify-button__dial p').textContent = '72%'
      Object.assign(preview.style, { position: 'absolute', width: '320px', transformOrigin: 'top left' })
      stage.appendChild(preview)
      document.body.appendChild(stage)
      const bounds = preview.getBoundingClientRect()
      const scale = Math.min(576 / bounds.width, 312 / bounds.height)
      Object.assign(preview.style, { left: `${(640 - bounds.width * scale) / 2}px`, top: `${(360 - bounds.height * scale) / 2}px`, transform: `scale(${scale})` })
      document.getElementById('root').style.visibility = 'hidden'
    })
    await page.locator('#preview-capture').screenshot({ path: new URL('verify-button.png', output).pathname })
  }
  if (!trackerOnly && !stepsOnly && !buttonMotionOnly && !switchThreeOnly && !flipBillboardOnly && !clockOnly && !formOnly && !dobOnly && !journeyOnly && !billboardOnly && !reorderOnly && !verifyOnly && !nodesOnly && !thinkingOnly && !focusOnly && !switchOnly && !frostedOnly && !tokensOnly && !loadersOnly && !requiredOnly && !timelineOnly && !slidesOnly && !modeSwitchesOnly && !radioOnly && !accordionOnly && !segmentedOnly && !checkboxOnly && !passwordOnly && !helpOnly && !dialogOnly && !celebrationOnly && !fitOnly && !fenexOnly && !gridOnly && !bulkOnly && !mobileTablesOnly) {
    // Under construction: laptop size, paused while a block is being lowered.
    await page.goto(`${origin}/experiments/page-construction`)
    await page.getByRole('radio', { name: 'Laptop' }).click()
    const crane = page.frameLocator('iframe').locator('.a1-page-construction__crane')
    await crane.waitFor({ state: 'attached' })
    // Wait for the third block to be partway down on the hook, then pause.
    await page.waitForFunction(() => {
      const element = document.querySelector('iframe')?.contentDocument?.querySelector('.a1-page-construction__crane')
      const placed = element?.ownerDocument.querySelectorAll('[data-construction-state="placed"]').length
      return element?.dataset.carrying === 'true' && placed === 2 && Number.parseFloat(element.style.getPropertyValue('--a1-page-construction-rope')) > 120
    }, null, { polling: 'raf', timeout: 20000 })
    await page.getByRole('button', { name: 'Pause' }).click()
    await page.mouse.move(0, 0)
    await page.waitForTimeout(300)
    await page.locator('.a1-web-responsive-preview__viewport').screenshot({ path: new URL('page-construction.png', output).pathname })
  }
  if (!trackerOnly && !stepsOnly && !buttonMotionOnly && !switchThreeOnly && !flipBillboardOnly && !clockOnly && !formOnly && !dobOnly && !journeyOnly && !billboardOnly && !verifyOnly && !nodesOnly && !thinkingOnly && !focusOnly && !switchOnly && !frostedOnly && !tokensOnly && !constructionOnly && !loadersOnly && !requiredOnly && !timelineOnly && !slidesOnly && !modeSwitchesOnly && !radioOnly && !accordionOnly && !segmentedOnly && !checkboxOnly && !passwordOnly && !helpOnly && !dialogOnly && !celebrationOnly && !fitOnly && !fenexOnly && !gridOnly && !bulkOnly && !mobileTablesOnly) {
    await page.goto(`${origin}/experiments/reordering`)
    await page.getByRole('radio', { name: 'Magnetic drag and drop', exact: true }).press('Space')
    const handle = page.getByRole('button', { name: 'Move Discover', exact: true })
    await handle.press('Space')
    await handle.press('ArrowRight')
    await page.locator('.a1-magnetic-reorder').evaluate(el => el.getAnimations({ subtree: true }).forEach(a => a.finish()))
    await page.evaluate(async () => {
      await document.fonts.ready
      const source = document.querySelector('.a1-magnetic-reorder__grid')
      const stage = document.createElement('div')
      stage.id = 'preview-capture'
      // Export geometry only. Capture the real grid and magnetic landing preview.
      Object.assign(stage.style, {position:'fixed',inset:'0 auto auto 0',width:'640px',height:'360px',background:'var(--semantic-color-surface-page)',overflow:'hidden'})
      const preview = source.cloneNode(true)
      Object.assign(preview.style,{position:'absolute',width:'640px',transformOrigin:'top left'})
      stage.appendChild(preview);document.body.appendChild(stage)
      const bounds = preview.getBoundingClientRect()
      const scale = Math.min(576/bounds.width,312/bounds.height)
      Object.assign(preview.style,{left:`${(640-bounds.width*scale)/2}px`,top:`${(360-bounds.height*scale)/2}px`,transform:`scale(${scale})`})
      document.getElementById('root').style.visibility='hidden'
    })
    await page.locator('#preview-capture').screenshot({path:new URL('reordering.png',output).pathname})
  }
  if (!trackerOnly && !stepsOnly && !buttonMotionOnly && !switchThreeOnly && !flipBillboardOnly && !clockOnly && !formOnly && !dobOnly && !journeyOnly && !billboardOnly && !reorderOnly && !verifyOnly && !nodesOnly && !thinkingOnly && !focusOnly && !switchOnly && !frostedOnly && !tokensOnly && !constructionOnly && !requiredOnly && !timelineOnly && !slidesOnly && !modeSwitchesOnly && !radioOnly && !accordionOnly && !segmentedOnly && !checkboxOnly && !passwordOnly && !helpOnly && !dialogOnly && !celebrationOnly && !fitOnly && !fenexOnly && !gridOnly && !bulkOnly && !mobileTablesOnly) {
    // Page loaders: laptop size, paused at a moment that shows the idea.
    for (const [id, wait] of [['page-blueprint', 4200], ['page-puzzle', 2300], ['page-paint', 6200], ['page-sunrise', 3200]]) {
      await page.goto(`${origin}/experiments/${id}`)
      await page.getByRole('radio', { name: 'Laptop' }).click()
      await page.frameLocator('iframe').locator('[data-loading-block]').first().waitFor({ state: 'attached' })
      await page.waitForTimeout(wait)
      await page.getByRole('button', { name: 'Pause' }).click()
      await page.mouse.move(0, 0)
      await page.waitForTimeout(400)
      await page.locator('.a1-web-responsive-preview__viewport').screenshot({ path: new URL(`${id}.png`, output).pathname })
    }
  }
  if (!trackerOnly && !stepsOnly && !buttonMotionOnly && !switchThreeOnly && !flipBillboardOnly && !clockOnly && !formOnly && !dobOnly && !journeyOnly && !reorderOnly && !verifyOnly && !nodesOnly && !thinkingOnly && !focusOnly && !switchOnly && !frostedOnly && !tokensOnly && !constructionOnly && !loadersOnly && !requiredOnly && !timelineOnly && !slidesOnly && !modeSwitchesOnly && !radioOnly && !accordionOnly && !segmentedOnly && !checkboxOnly && !passwordOnly && !helpOnly && !dialogOnly && !celebrationOnly && !fitOnly && !fenexOnly && !gridOnly && !bulkOnly && !mobileTablesOnly) {
    await page.goto(`${origin}/experiments/billboard-actions`)
    const frame = page.frameLocator('iframe')
    await frame.getByRole('heading', {name:'Small ideas. Big possibilities.'}).waitFor()
    await frame.locator('body').evaluate(() => document.fonts.ready)
    await frame.locator('.a1-billboard-actions').screenshot({path:new URL('billboard-actions.png',output).pathname})
  }
  if (!trackerOnly && !stepsOnly && !buttonMotionOnly && !switchThreeOnly && !flipBillboardOnly && !clockOnly && !formOnly && !dobOnly && !journeyOnly && !billboardOnly && !reorderOnly && !verifyOnly && !nodesOnly && !thinkingOnly && !focusOnly && !switchOnly && !frostedOnly && !tokensOnly && !constructionOnly && !loadersOnly && !timelineOnly && !slidesOnly && !modeSwitchesOnly && !radioOnly && !accordionOnly && !segmentedOnly && !checkboxOnly && !passwordOnly && !helpOnly && !dialogOnly && !celebrationOnly && !fitOnly && !fenexOnly && !gridOnly && !bulkOnly && !mobileTablesOnly) {
    // Required fields: the Required rail after submitting a partly filled form.
    await page.goto(`${origin}/experiments/required-fields`)
    await page.getByRole('button', { name: 'Send request' }).waitFor()
    await page.waitForTimeout(500)
    await page.getByRole('radio', { name: /^5\. Required rail/ }).check()
    await page.locator('form[data-variant="rail"]').waitFor()
    await page.locator('#rf-firstName').fill('Ada')
    await page.locator('#rf-email').fill('ada@example.com')
    await page.getByRole('button', { name: 'Send request' }).click()
    await page.mouse.move(0, 0)
    await page.waitForTimeout(400)
    const form = await page.locator('form.a1-required-fields').boundingBox()
    const width = form.width + 48
    await page.screenshot({ path: new URL('required-fields.png', output).pathname, clip: { x: form.x - 24, y: form.y + 40, width, height: width * 9 / 16 } })
  }
  if (!trackerOnly && !stepsOnly && !buttonMotionOnly && !switchThreeOnly && !flipBillboardOnly && !clockOnly && !formOnly && !dobOnly && !journeyOnly && !billboardOnly && !reorderOnly && !verifyOnly && !nodesOnly && !thinkingOnly && !focusOnly && !switchOnly && !frostedOnly && !tokensOnly && !constructionOnly && !loadersOnly && !requiredOnly && !slidesOnly && !modeSwitchesOnly && !radioOnly && !accordionOnly && !segmentedOnly && !checkboxOnly && !passwordOnly && !helpOnly && !dialogOnly && !celebrationOnly && !fitOnly && !fenexOnly && !gridOnly && !bulkOnly && !mobileTablesOnly) {
    // Timeline: the horizontal layout at laptop size.
    await page.goto(`${origin}/experiments/timeline`)
    const frame = page.frameLocator('iframe')
    await frame.locator('.a1-timeline__connectors path').first().waitFor()
    await frame.locator('body').evaluate(() => document.fonts.ready)
    await page.mouse.move(0, 0)
    await page.waitForTimeout(400)
    await frame.locator('.a1-timeline').screenshot({ path: new URL('timeline.png', output).pathname })
  }
  if (journeyOnly || !process.argv[3]) {
    await page.goto(`${origin}/experiments/verification-journey`)
    const view = page.frameLocator('iframe')
    await view.getByRole('button', { name: 'Save and verify application' }).click()
    await view.getByRole('status').filter({hasText:'Retrying automatically'}).waitFor()
    await page.evaluate(async () => {
      await document.fonts.ready
      const source = document.querySelector('iframe').contentDocument.querySelector('.a1-verification-journey')
      const stage = document.createElement('div')
      stage.id = 'preview-capture'
      // Export geometry only; the real A1 controls supply all visual styling.
      Object.assign(stage.style, {position:'fixed',inset:'0 auto auto 0',width:'640px',height:'360px',background:'var(--semantic-color-surface-page)',overflow:'hidden'})
      const preview = source.cloneNode(true)
      Object.assign(preview.style,{position:'absolute',width:'960px',transformOrigin:'top left',transform:'scale(.62)',left:'22px',top:'12px'})
      // Keep the overall status and two service rows in the concept image.
      preview.firstElementChild?.remove()
      preview.querySelector('details')?.remove()
      preview.querySelectorAll('[role="listitem"]').forEach((item, index) => { if (index < 2 || index > 3) item.remove() })
      stage.appendChild(preview); document.body.appendChild(stage)
      document.getElementById('root').style.visibility='hidden'
      for (const animation of stage.getAnimations({subtree: true})) {
        if (animation.animationName === 'a1-sb-indeterminate') {
          animation.pause()
          animation.currentTime = Number(animation.effect.getTiming().duration) / 2
        }
      }
    })
    await page.locator('#preview-capture').screenshot({path:new URL('verification-journey.png',output).pathname})
  }
  if (!trackerOnly && !stepsOnly && !buttonMotionOnly && !switchThreeOnly && !flipBillboardOnly && !clockOnly && !formOnly && !dobOnly && !journeyOnly && !billboardOnly && !reorderOnly && !verifyOnly && !nodesOnly && !thinkingOnly && !focusOnly && !switchOnly && !frostedOnly && !tokensOnly && !constructionOnly && !loadersOnly && !requiredOnly && !timelineOnly && !modeSwitchesOnly && !radioOnly && !accordionOnly && !segmentedOnly && !checkboxOnly && !passwordOnly && !helpOnly && !dialogOnly && !celebrationOnly && !fitOnly && !fenexOnly && !gridOnly && !bulkOnly && !mobileTablesOnly) {
    // Slides: the morph from the warm ramp to the cool one, mid-flight.
    await page.goto(`${origin}/experiments/slides`)
    await page.locator('.a1-slides__stage').waitFor()
    await page.locator('input[name=slide-transition][value=cut]').check({ force: true })
    await page.getByLabel('Go to slide').selectOption('1')
    await page.waitForTimeout(400)
    await page.locator('input[name=slide-transition][value=morph]').check({ force: true })
    await page.getByRole('slider', { name: 'Speed' }).press('End')
    await page.getByRole('button', { name: 'Next slide' }).click()
    await page.waitForTimeout(220)
    await page.locator('.a1-slides__stage').screenshot({ path: new URL('slides.png', output).pathname })
  }
  if (formOnly || !process.argv[3]) {
    await page.goto(`${origin}/experiments/long-form`)
    const frame = page.frameLocator('iframe')
    await page.getByRole('radio', { name: /Side navigation/ }).press('Space')
    await frame.getByRole('heading', { name: 'Event overview', exact: true }).waitFor()
    await frame.locator('body').evaluate(() => document.fonts.ready)
    await page.locator('.a1-web-responsive-preview__viewport').screenshot({path:new URL('long-form.png', output).pathname})
  }
  if (segmentedOnly || !process.argv[3]) {
    // Capture a settled selection, not a stretched indicator between segments.
    await page.goto(`${origin}/experiments/segmented-motion`)
    await page.locator('.a1-segmented-motion').waitFor()
    await page.getByRole('radio', { name: 'Large', exact: true }).click()
    await page.getByRole('radiogroup', { name: 'Time period' }).getByRole('radio', { name: 'Quarter', exact: true }).click()
    await page.mouse.move(0, 0)
    await page.waitForTimeout(1000)
    await captureIsolatedPreview(page, '.a1-segmented-motion', 'segmented-motion.png')
  }
  if (accordionOnly || !process.argv[3]) {
    // Accordion transitions: Returns opening with the Stagger transition.
    await page.goto(`${origin}/experiments/accordion-motion`)
    await page.locator('.a1-accordion-motion').waitFor()
    await page.locator('input[name=accordion-transition][value=stagger]').check({ force: true })
    await page.getByRole('slider', { name: 'Duration (ms)' }).press('End')
    await page.mouse.move(0, 0)
    await page.waitForTimeout(900)
    const box = await page.locator('.a1-accordion-motion').boundingBox()
    await page.getByRole('button', { name: /Returns/ }).click()
    await page.waitForTimeout(420)
    await page.screenshot({ path: new URL('accordion-motion.png', output).pathname, clip: { x: box.x - 24, y: box.y - 24, width: box.width + 48, height: (box.width + 48) * 9 / 16 } })
  }
  if (mobileTablesOnly || !process.argv[3]) {
    // Capture only the device viewport; never widen the crop into Labs panels.
    await page.goto(`${origin}/experiments/mobile-tables`)
    await page.locator('input[name="mobile-pattern"][value="frozen"]').press('Space')
    const frame = page.frameLocator('iframe')
    await frame.locator('.a1-mt-narrow .a1-data-table-scroll').waitFor()
    await frame.locator('body').evaluate(() => document.fonts.ready)
    await frame.locator('.a1-mt-narrow .a1-data-table-scroll').evaluate(el => { el.scrollLeft = 220 })
    // Keep the live iframe in place (moving/cloning it loses its rendered content).
    // Hide the shell and fit the whole device into a clean landscape card.
    await page.evaluate(() => {
      const viewport = document.querySelector('.a1-web-responsive-preview__viewport')
      const box = viewport.getBoundingClientRect()
      const scale = Math.min(592 / box.width, 336 / box.height)
      document.getElementById('root').style.visibility = 'hidden'
      Object.assign(viewport.style, { visibility: 'visible', position: 'fixed', left: `${(640 - box.width * scale) / 2}px`, top: `${(360 - box.height * scale) / 2}px`, transformOrigin: 'top left', transform: `scale(${scale})` })
    })
    await page.screenshot({ path: new URL('mobile-tables.png', output).pathname, clip: { x: 0, y: 0, width: 640, height: 360 } })
  }
  if (bulkOnly || !process.argv[3]) {
    // Bulk actions: three rows selected with the A1 bulk action bar showing.
    await page.goto(`${origin}/experiments/bulk-actions`)
    const boxes = page.getByRole('checkbox', { name: /^Select row/ }).filter({ visible: true })
    await boxes.first().waitFor()
    for (const index of [0, 2, 3]) await boxes.nth(index).check({ force: true })
    await page.mouse.move(0, 0)
    await page.waitForTimeout(300)
    const bar = await page.getByRole('region', { name: 'Bulk actions' }).boundingBox()
    const width = bar.width + 48
    await page.screenshot({ path: new URL('bulk-actions.png', output).pathname, clip: { x: bar.x - 24, y: bar.y - 24, width, height: width * 9 / 16 } })
  }
  if (gridOnly || !process.argv[3]) {
    // Data grid: the inventory with two rows selected and the totals row.
    await page.goto(`${origin}/experiments/data-grid`)
    const grid = page.getByRole('grid', { name: 'Inventory' })
    await grid.waitFor()
    await grid.getByRole('row').nth(2).getByRole('checkbox').click()
    await grid.getByRole('row').nth(4).getByRole('checkbox').click()
    await page.waitForTimeout(300)
    const box = await grid.boundingBox()
    const width = box.width + 48
    await page.screenshot({ path: new URL('data-grid.png', output).pathname, clip: { x: box.x - 24, y: box.y - 24, width, height: width * 9 / 16 } })
  }
  if (fenexOnly || !process.argv[3]) {
    // Fenex celebrates: the character mid-hop on the panel stage.
    await page.goto(`${origin}/experiments/fenex`)
    const fox = page.locator('.a1-fenex svg')
    await fox.waitFor()
    await page.waitForTimeout(1050)
    const box = await fox.boundingBox()
    const height = box.height + 32
    const width = height * 16 / 9
    await page.screenshot({ path: new URL('fenex.png', output).pathname, clip: { x: box.x + box.width / 2 - width / 2, y: box.y - 16, width, height } })
  }
  if (fitOnly || !process.argv[3]) {
    // Fit the actual type container into the card, without Labs navigation/help.
    await page.goto(`${origin}/experiments/fit-text`)
    await page.locator('.a1-fit-text-frame').waitFor()
    await page.getByRole('radio', { name: 'Event', exact: true }).click()
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(500)
    await captureIsolatedPreview(page, '.a1-fit-text-frame', 'fit-text.png')
  }
  if (celebrationOnly || !process.argv[3]) {
    // Submission celebrations: confetti bursting from the success check.
    await page.goto(`${origin}/experiments/celebrations`)
    await page.getByRole('button', { name: 'Skip to the celebration' }).click()
    await page.waitForTimeout(450)
    const box = await page.locator('.a1-celebration-host').boundingBox()
    const width = Math.max(box.width, 720)
    const height = width * 9 / 16
    await page.screenshot({ path: new URL('celebrations.png', output).pathname, clip: { x: box.x + box.width / 2 - width / 2, y: Math.max(0, box.y + box.height / 2 - height / 2 - 40), width, height } })
  }
  if (dialogOnly || !process.argv[3]) {
    // Dialog motion: the dialog open over the page with a blurred scrim. A
    // clipped screenshot drops backdrop blur, so this captures a 16:9 viewport.
    const size = page.viewportSize()
    await page.setViewportSize({ width: 1440, height: 810 })
    await page.goto(`${origin}/experiments/dialog-motion`)
    await page.getByRole('button', { name: 'Open dialog' }).waitFor()
    const blur = page.getByRole('slider', { name: /Scrim blur/ })
    await blur.focus()
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    await page.getByRole('button', { name: 'Open dialog' }).click()
    await page.waitForTimeout(800)
    await page.screenshot({ path: new URL('dialog-motion.png', output).pathname })
    await page.setViewportSize(size)
  }
  if (helpOnly || !process.argv[3]) {
    // Contextual help: the popover open from the help button in the field.
    await page.goto(`${origin}/experiments/contextual-help`)
    const form = page.locator('form').first()
    await form.waitFor()
    await page.getByRole('button', { name: 'Help with routing number' }).click()
    await page.waitForTimeout(500)
    const box = await form.boundingBox()
    const width = box.width + 48
    await page.screenshot({ path: new URL('contextual-help.png', output).pathname, clip: { x: box.x - 24, y: box.y - 24, width, height: width * 9 / 16 } })
  }
  if (passwordOnly || !process.argv[3]) {
    // Password strength: the Segments meter at Good for a sample password.
    await page.goto(`${origin}/experiments/password-strength`)
    const form = page.locator('form').first()
    await form.waitFor()
    await page.getByLabel('New password', { exact: true }).fill('Kp7#vR2q-x9')
    await page.waitForTimeout(500)
    const box = await form.boundingBox()
    const width = box.width + 48
    await page.screenshot({ path: new URL('password-strength.png', output).pathname, clip: { x: box.x - 24, y: box.y - 24, width, height: width * 9 / 16 } })
  }
  if (checkboxOnly || !process.argv[3]) {
    // Checkbox motion: Select all in the mixed state above the topping list.
    await page.goto(`${origin}/experiments/checkbox-motion`)
    const groups = page.locator('.a1-checkbox-lively')
    await groups.first().waitFor()
    await page.waitForTimeout(400)
    const first = await groups.first().boundingBox()
    const last = await groups.last().boundingBox()
    const width = Math.max(first.width, last.width) + 48
    await page.screenshot({ path: new URL('checkbox-motion.png', output).pathname, clip: { x: first.x - 24, y: first.y - 24, width, height: Math.max(width * 9 / 16, last.y + last.height - first.y + 48) } })
  }
  if (radioOnly || !process.argv[3]) {
    // Radio buttons: the lively group with Express chosen and Same day hovered.
    await page.goto(`${origin}/experiments/radio-buttons`)
    const group = page.locator('.a1-radio-lively')
    await group.waitFor()
    await group.locator('input[value=express]').click()
    await group.locator('input[value=same-day]').hover()
    await page.waitForTimeout(700)
    const box = await group.boundingBox()
    await page.screenshot({ path: new URL('radio-buttons.png', output).pathname, clip: { x: box.x - 24, y: box.y - 24, width: box.width + 48, height: (box.width + 48) * 9 / 16 } })
  }
  if (modeSwitchesOnly || !process.argv[3]) {
    // Mode switches: the ball-chain pull cord on its stage.
    await page.goto(`${origin}/experiments/mode-switches?switch=cord`)
    await page.locator('.a1-mode-cord__bead').waitFor()
    await page.evaluate(() => document.fonts.ready)
    await page.mouse.move(0, 0)
    await page.waitForTimeout(400)
    const stage = await page.locator('.a1-mode-switches').boundingBox()
    await page.screenshot({ path: new URL('mode-switches.png', output).pathname, clip: { x: stage.x, y: stage.y, width: stage.width, height: Math.min(stage.height, stage.width * 9 / 16) } })
  }
  if (dobOnly || !process.argv[3]) {
    // One card for the combined experiment, showing the mixed-fields study.
    await page.goto(`${origin}/experiments/date-of-birth?study=dob-mixed-fields`)
    await page.getByRole('heading', { name: 'Prototype', exact: true }).waitFor()
    await page.evaluate(() => document.fonts.ready)
    await page.mouse.move(0, 0)
    const box = await page.locator('.a1-date-of-birth').boundingBox()
    await page.screenshot({ path: new URL('date-of-birth.png', output).pathname, clip: { x: box.x - 16, y: box.y - 16, width: box.width + 32, height: (box.width + 32) * 9 / 16 } })
  }
  if (clockOnly || !process.argv[3]) {
    await page.goto(`${origin}/experiments/flip-clock`)
    await page.locator('.a1-flip-clock canvas').waitFor()
    await page.getByRole('button', { name: 'Pause clock', exact: true }).click()
    await page.waitForTimeout(1000)
    await page.locator('.a1-flip-clock__stage').screenshot({ path: new URL('flip-clock.png', output).pathname })
  }
  if (flipBillboardOnly || !process.argv[3]) {
    await page.goto(`${origin}/experiments/flip-billboard`)
    const preview = page
    await preview.locator('.a1-flip-billboard canvas').waitFor()
    await page.getByRole('button', { name: 'Pause headlines', exact: true }).first().click()
    await page.waitForFunction(() => document.querySelector('.a1-flip-billboard canvas')?.dataset.flipping === 'false')
    await preview.locator('.a1-flip-billboard').screenshot({ path: new URL('flip-billboard.png', output).pathname })
  }
  if (switchThreeOnly || !process.argv[3]) {
    await page.goto(`${origin}/experiments/switch-three`)
    await page.locator('.a1-switch-three canvas').waitFor()
    await page.getByRole('switch', { name: 'Switch', exact: true }).press('Space')
    await page.waitForTimeout(300)
    await page.evaluate(() => {
      const source = document.querySelector('.a1-switch-three')
      const stage = document.createElement('div')
      stage.id = 'preview-capture'
      // Export-only canvas; keep the real WebGL canvas rather than cloning it.
      Object.assign(stage.style, { position: 'fixed', inset: '0 auto auto 0', width: '640px', height: '360px',
        display: 'grid', placeItems: 'center', background: 'var(--semantic-color-surface-page)' })
      stage.appendChild(source); document.body.appendChild(stage)
      document.getElementById('root').style.visibility = 'hidden'
    })
    await page.locator('#preview-capture').screenshot({ path: new URL('switch-three.png', output).pathname })
  }
  if (buttonMotionOnly || !process.argv[3]) {
    await page.goto(`${origin}/experiments/button-motion`)
    await page.getByRole('button', { name: 'Try primary', exact: true }).waitFor()
    await page.evaluate(async () => {
      await document.fonts.ready
      const source = document.querySelector('.a1-button-motion')
      const stage = document.createElement('div')
      stage.id = 'preview-capture'
      // Export-only layout of the six actual wrappers at their hover endpoints.
      Object.assign(stage.style, { position: 'fixed', inset: '0 auto auto 0', width: '640px', height: '360px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', placeItems: 'center', padding: '32px', boxSizing: 'border-box',
        background: 'var(--semantic-color-surface-page)' })
      for (const [id, label] of [['subtle', 'Subtle'], ['lift', 'Lift'], ['glow', 'Glow'], ['tilt', 'Tilt'], ['spring', 'Spring'], ['ripple', 'Ripple']]) {
        const control = source.cloneNode(true)
        control.dataset.treatment = id
        control.querySelector('button').textContent = label
        Object.assign(control.querySelector('.a1-button-motion__surface').style, {
          transform: 'var(--a1-button-motion-hover)', filter: 'var(--a1-button-motion-hover-filter)', transition: 'none' })
        stage.appendChild(control)
      }
      document.body.appendChild(stage); document.getElementById('root').style.visibility = 'hidden'
    })
    await page.locator('#preview-capture').screenshot({ path: new URL('button-motion.png', output).pathname })
  }
  if (stepsOnly || !process.argv[3]) {
    await page.goto(`${origin}/experiments/steps`)
    await page.getByRole('radio', { name: 'Tiles', exact: true }).press('Space')
    await page.locator('.a1-steps-study').screenshot({ path: new URL('steps.png', output).pathname })
  }
  if (trackerOnly || !process.argv[3]) {
    await page.goto(`${origin}/experiments/step-tracker`)
    await page.locator('.a1-tracker-study-demo').screenshot({ path: new URL('step-tracker.png', output).pathname })
  }
  }
  if (chatOnly || !process.argv[3]) {
    await page.goto(`${origin}/experiments/chat`)
    await page.locator('.a1-chat-study__log').waitFor()
    await page.evaluate(async () => {
      await document.fonts.ready
      const stage = document.createElement('div')
      stage.id = 'preview-capture'
      Object.assign(stage.style, { position: 'fixed', inset: '0 auto auto 0', width: '640px', height: '360px', background: 'var(--semantic-color-surface-page)', overflow: 'hidden' })
      const preview = document.querySelector('.a1-chat-study').cloneNode(true)
      preview.querySelector('form').remove()
      preview.querySelector('[role=status]').parentElement.remove()
      Object.assign(preview.style, { position: 'absolute', width: '640px', transformOrigin: 'top left' })
      stage.appendChild(preview); document.body.appendChild(stage)
      const bounds = preview.getBoundingClientRect(), scale = Math.min(592 / bounds.width, 312 / bounds.height)
      Object.assign(preview.style, { left: `${(640-bounds.width*scale)/2}px`, top: `${(360-bounds.height*scale)/2}px`, transform: `scale(${scale})` })
      document.getElementById('root').style.visibility = 'hidden'
    })
    await page.locator('#preview-capture').screenshot({ path: new URL('chat.png', output).pathname })
  }
  if (builderOnly || !process.argv[3]) await captureBuilders(page, origin, output, builderOnly)
  console.log(`Captured ${builderOnly ? builderOnly : chatOnly ? 'chat' : trackerOnly ? 'step tracker' : stepsOnly ? 'steps' : buttonMotionOnly ? 'button interactions' : switchThreeOnly ? '3D switch' : flipBillboardOnly ? 'flip billboard' : clockOnly ? 'flip clock' : formOnly ? 'long form' : dobOnly ? 'date of birth' : journeyOnly ? 'verification journey' : billboardOnly ? 'billboard' : reorderOnly ? 'reordering' : verifyOnly ? 'verify button' : nodesOnly ? 'nodes' : thinkingOnly ? 'thinking' : focusOnly ? 'focus' : switchOnly ? 'switch' : frostedOnly ? 'frosted glass' : tokensOnly ? 'token visualizer' : constructionOnly ? 'construction' : loadersOnly ? 'page loader' : requiredOnly ? 'required fields' : timelineOnly ? 'timeline' : slidesOnly ? 'slides' : modeSwitchesOnly ? 'mode switches' : radioOnly ? 'radio buttons' : accordionOnly ? 'accordion transitions' : segmentedOnly ? 'segmented transitions' : checkboxOnly ? 'checkbox motion' : passwordOnly ? 'password strength' : helpOnly ? 'contextual help' : dialogOnly ? 'dialog motion' : celebrationOnly ? 'celebrations' : fitOnly ? 'fitted type' : fenexOnly ? 'Fenex' : gridOnly ? 'data grid' : bulkOnly ? 'bulk actions' : mobileTablesOnly ? 'mobile tables' : 'all experiment'} previews in apps/a1-labs/public/previews/.`)
} finally {
  await browser.close()
}
