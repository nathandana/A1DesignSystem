import test from 'node:test'
import assert from 'node:assert/strict'
import { previewScale } from '../../a1-web/src/pages/components/detail/preview-scale.js'

test('device previews fit width and height including their unscaled bezel', () => {
  const device = {width:390,height:844,bezelWidth:24,bezelHeight:24}
  assert.equal(previewScale({...device,availableWidth:1000,availableHeight:868}),1)
  assert.equal(previewScale({...device,availableWidth:1000,availableHeight:446}),.5)
  assert.equal(previewScale({...device,availableWidth:219,availableHeight:2000}),.5)
  assert.equal(previewScale({...device,availableWidth:1000,availableHeight:0}),0)
  assert.equal(previewScale({...device,availableWidth:1000,availableHeight:2000}),1)
})
