import assert from 'node:assert/strict'
import test from 'node:test'
import {
  responsiveVisibilityClasses,
  resolveResponsiveVisibility,
  visibilityFromBreakpoints,
  visibleBreakpoints,
} from '../src/editor/responsiveVisibility.js'

test('resolves visibility with A1 breakpoint cascading and visible defaults', () => {
  assert.deepEqual(resolveResponsiveVisibility(undefined), {
    xs: true,
    sm: true,
    md: true,
    lg: true,
    xl: true,
  })
  assert.deepEqual(resolveResponsiveVisibility({ xs: false, md: true, xl: false }), {
    xs: false,
    sm: false,
    md: true,
    lg: true,
    xl: false,
  })
})

test('compacts explicit editor choices into responsive transitions', () => {
  assert.equal(visibilityFromBreakpoints(['xs', 'sm', 'md', 'lg', 'xl']), null)
  assert.deepEqual(visibilityFromBreakpoints(['md', 'lg']), { xs: false, md: true, xl: false })
  assert.deepEqual(visibleBreakpoints({ xs: false, md: true, xl: false }), ['md', 'lg'])
})

test('emits exact-range hidden classes without changing visible display modes', () => {
  assert.equal(responsiveVisibilityClasses(true), '')
  assert.equal(
    responsiveVisibilityClasses({ xs: false, md: true, xl: false }),
    'a1-web-node-hidden-xs a1-web-node-hidden-sm a1-web-node-hidden-xl',
  )
})
