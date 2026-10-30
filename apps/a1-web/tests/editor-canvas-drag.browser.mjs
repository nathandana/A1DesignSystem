import assert from 'node:assert/strict';
import test from 'node:test';
import { chromium } from 'playwright';

const EDITOR_URL = 'http://127.0.0.1:5177/editor?project=proj-showcase&doc=component-showcase';

test('project canvas drag shows placement and moves through editor history', async (t) => {
  const browser = await chromium.launch({ headless: true });
  t.after(() => browser.close());
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

  await page.goto(EDITOR_URL, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-editor-node="hero-p"]').waitFor();

  const siblingOrder = () => page.locator('[data-editor-node]').evaluateAll((elements) =>
    elements
      .filter((element) => element.parentElement?.closest('[data-editor-node]')?.getAttribute('data-editor-node') === 'hero')
      .map((element) => element.getAttribute('data-editor-node')),
  );
  const source = page.locator('[data-editor-node="hero-p"]');
  const target = page.locator('[data-editor-node="hero-h1"]');
  const editableText = source.locator('[contenteditable]');
  const targetBox = await target.boundingBox();
  assert.ok(targetBox);
  assert.deepEqual(await siblingOrder(), ['hero-h1', 'hero-p']);

  // Layers-tree movement exposes the same boundary-aware commands.
  const layersTree = page.getByRole('tree', { name: 'Page structure' });
  const paragraphLayer = layersTree.locator('[data-tree-id="hero-p"]');
  await paragraphLayer.dispatchEvent('contextmenu', { clientX: 240, clientY: 240 });
  await page.getByRole('menuitem', { name: 'Move up' }).click();
  await page.waitForTimeout(100);
  assert.deepEqual(await siblingOrder(), ['hero-p', 'hero-h1']);
  await paragraphLayer.dispatchEvent('contextmenu', { clientX: 240, clientY: 240 });
  await page.getByRole('menuitem', { name: 'Move down' }).click();
  await page.waitForTimeout(100);
  assert.deepEqual(await siblingOrder(), ['hero-h1', 'hero-p']);

  // Text remains a selection/drag surface until the explicit edit gesture.
  assert.equal(await editableText.getAttribute('contenteditable'), 'false');
  assert.equal(await editableText.evaluate((element) => getComputedStyle(element).cursor), 'grab');
  await editableText.click();
  assert.equal(await source.getAttribute('data-editor-selected'), 'true');
  assert.equal(await source.getAttribute('data-editor-text'), 'true');
  assert.match(await source.evaluate((element) => getComputedStyle(element).outlineColor), /transparent|rgba\(0, 0, 0, 0\)/);
  assert.equal(await editableText.getAttribute('contenteditable'), 'false');
  await editableText.dblclick();
  assert.equal(await editableText.getAttribute('contenteditable'), 'true');
  assert.equal(await editableText.evaluate((element) => getComputedStyle(element).cursor), 'text');
  await editableText.blur();
  assert.equal(await editableText.getAttribute('contenteditable'), 'false');
  await editableText.focus();
  await page.keyboard.press('F2');
  assert.equal(await editableText.getAttribute('contenteditable'), 'true');
  await page.keyboard.press('Escape');
  assert.equal(await editableText.getAttribute('contenteditable'), 'false');

  const dataTransfer = await page.evaluateHandle(() => new DataTransfer());
  await source.dispatchEvent('dragstart', { dataTransfer });
  await target.dispatchEvent('dragover', { dataTransfer, clientY: targetBox.y + 1 });

  assert.equal(await source.getAttribute('data-editor-dragging'), 'true');
  assert.equal(await target.getAttribute('data-drop-position'), 'before');
  assert.ok(Number(await source.evaluate((element) => getComputedStyle(element).opacity)) < 1);

  await target.dispatchEvent('drop', { dataTransfer, clientY: targetBox.y + 1 });
  await source.dispatchEvent('dragend', { dataTransfer });
  await page.waitForTimeout(100);

  assert.deepEqual(await siblingOrder(), ['hero-p', 'hero-h1']);
  assert.equal(await page.locator('[data-editor-dragging]').count(), 0);
  assert.equal(await page.locator('[data-drop-position]').count(), 0);

  // Context-menu and keyboard movement share the same governed move path.
  await source.click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Move down' }).click();
  await page.waitForTimeout(100);
  assert.deepEqual(await siblingOrder(), ['hero-h1', 'hero-p']);

  await source.click();
  await page.keyboard.press('Alt+ArrowUp');
  await page.waitForTimeout(100);
  assert.deepEqual(await siblingOrder(), ['hero-p', 'hero-h1']);

  await page.keyboard.press('Alt+ArrowDown');
  await page.waitForTimeout(100);
  assert.deepEqual(await siblingOrder(), ['hero-h1', 'hero-p']);
});
