import test from 'node:test'
import assert from 'node:assert/strict'
import { cssDurationMs, moveItem, insertionIndex, placementFrames } from '../src/reordering/reorder-model.js'
const items = ['a','b','c','d'].map(id=>({id,label:id}))
test('reordering preserves identities and input while placing first/last and adjacent items',()=>{
  assert.deepEqual(moveItem(items,'a',3).map(item=>item.id),['b','c','d','a'])
  assert.deepEqual(moveItem(items,'d',0).map(item=>item.id),['d','a','b','c'])
  assert.deepEqual(moveItem(items,'b',2).map(item=>item.id),['a','c','b','d'])
  assert.deepEqual(items.map(item=>item.id),['a','b','c','d'])
  assert.equal(moveItem(items,'a',3)[3],items[0])
})
test('invalid or redundant moves are harmless and boundaries are clamped',()=>{
  assert.equal(moveItem(items,'missing',2),items)
  assert.equal(moveItem(items,'a',0),items)
  assert.equal(moveItem(items,'a',NaN),items)
  assert.equal(moveItem(items,'a',Infinity),items)
  assert.equal(moveItem([], 'a',0).length,0)
  assert.equal(moveItem(items,'a',999).at(-1).id,'a')
})
test('insertion targets stay stable around fixed slots, including first and last',()=>{
  assert.equal(insertionIndex([50,150,250],-50),0)
  assert.equal(insertionIndex([50,150,250],160),1)
  assert.equal(insertionIndex([50,150,250],999),2)
  assert.equal(insertionIndex([],100),0)
})
test('every placement settles with no residual transform',()=>{
  const visual={lift:'8px',bounce:'4px',liftScale:1.025,squashX:1.04,squashY:.94,tilt:'-2deg',counterTilt:'1deg',slide:'24px',popScale:1.05,popSettle:.98,fadeScale:.96}
  for(const style of ['subtle','plop','tilt','spring','pop','slide','fade']) {
    const last=placementFrames(style,visual).at(-1)
    assert.equal(last.transform,'none',style)
    assert.ok(last.opacity===undefined||last.opacity===1,style)
  }
})

test('slide in enters from the inline start in both directions',()=>{
  const visual={slide:'24px'}
  assert.match(placementFrames('slide',visual)[0].transform,/-1 \* 24px/)
  assert.match(placementFrames('slide',{...visual,direction:'rtl'})[0].transform,/\(1 \* 24px/)
})

test('placement timing survives production CSS conversion from milliseconds to seconds',()=>{
  assert.equal(cssDurationMs('500ms'),500)
  assert.equal(cssDurationMs(' .5s '),500)
  assert.equal(cssDurationMs('0.15s'),150)
  assert.equal(cssDurationMs(''),0)
})
