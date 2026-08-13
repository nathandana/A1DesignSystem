import assert from 'node:assert/strict'
import test from 'node:test'
import {
  blendRgb,
  contrastRatio,
  isLargeText,
  nonTextContrastStatus,
  parseCssAlpha,
  parseCssColor,
  ratioLabel,
  rgbToHex,
  textContrastMinimum,
  textContrastStatus,
} from '../src/editor/contrastCheck.ts'

test('parses hex, rgb, rgba, and color(srgb) values into rgb triplets', () => {
  assert.deepEqual(parseCssColor('#000000'), [0, 0, 0])
  assert.deepEqual(parseCssColor('#fff'), [255, 255, 255])
  assert.deepEqual(parseCssColor('rgb(18, 52, 86)'), [18, 52, 86])
  assert.deepEqual(parseCssColor('rgba(255, 0, 0, 0.5)'), [255, 0, 0])
})

test('reads alpha from rgba() and defaults to opaque otherwise', () => {
  assert.equal(parseCssAlpha('rgba(0, 0, 0, 0.4)'), 0.4)
  assert.equal(parseCssAlpha('rgb(0, 0, 0)'), 1)
  assert.equal(parseCssAlpha('#000000'), 1)
})

test('blends a translucent foreground over a background by alpha', () => {
  assert.deepEqual(blendRgb([255, 255, 255], [0, 0, 0], 1), [255, 255, 255])
  assert.deepEqual(blendRgb([255, 255, 255], [0, 0, 0], 0), [0, 0, 0])
  assert.deepEqual(blendRgb([200, 0, 0], [0, 0, 200], 0.5), [100, 0, 100])
})

test('computes known WCAG contrast ratios', () => {
  // Black on white is the maximum possible ratio, 21:1.
  assert.equal(Math.round(contrastRatio([0, 0, 0], [255, 255, 255])), 21)
  // Same color has no contrast.
  assert.equal(contrastRatio([128, 128, 128], [128, 128, 128]), 1)
  // Ratio is symmetric regardless of which color is passed first.
  const a = contrastRatio([0, 0, 0], [255, 255, 255])
  const b = contrastRatio([255, 255, 255], [0, 0, 0])
  assert.equal(a, b)
})

test('formats a ratio label to two decimal places', () => {
  assert.equal(ratioLabel(4.5), '4.50:1')
  assert.equal(ratioLabel(21), '21.00:1')
})

test('classifies large text per WCAG 1.4.3 (>=24px, or >=18.66px and bold)', () => {
  assert.equal(isLargeText(24, 400), true)
  assert.equal(isLargeText(23.9, 400), false)
  assert.equal(isLargeText(18.66, 700), true)
  assert.equal(isLargeText(18.66, 400), false)
  assert.equal(isLargeText(16, 700), false)
})

test('picks the correct AA minimum for large vs normal text', () => {
  assert.equal(textContrastMinimum(true), 3)
  assert.equal(textContrastMinimum(false), 4.5)
})

test('text contrast status passes/fails at the right threshold', () => {
  assert.equal(textContrastStatus(4.5, false), 'pass')
  assert.equal(textContrastStatus(4.49, false), 'review')
  assert.equal(textContrastStatus(3, true), 'pass')
  assert.equal(textContrastStatus(2.99, true), 'review')
})

test('non-text contrast status uses the 3:1 minimum', () => {
  assert.equal(nonTextContrastStatus(3), 'pass')
  assert.equal(nonTextContrastStatus(2.99), 'review')
})

test('round-trips rgb triplets through hex', () => {
  assert.equal(rgbToHex([0, 0, 0]), '#000000')
  assert.equal(rgbToHex([255, 255, 255]), '#ffffff')
  assert.equal(rgbToHex([18, 52, 86]), '#123456')
})
