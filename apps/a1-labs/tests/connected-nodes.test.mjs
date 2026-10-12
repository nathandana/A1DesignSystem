import assert from 'node:assert/strict'
import test from 'node:test'
import { initialNodes, initialConnections } from '../src/connected-nodes/sample-graph.js'
import { fitGraph, nodeUnit } from '../src/connected-nodes/graph-model.js'

test('every connector joins two existing distinct nodes', () => {
  const ids = new Set(initialNodes.map(node => node.id))
  assert.equal(ids.size, initialNodes.length)
  for (const edge of initialConnections) {
    assert.ok(ids.has(edge.from) && ids.has(edge.to)); assert.notEqual(edge.from, edge.to)
  }
})
test('graph fit contains every node plus its margin on mobile and desktop', () => {
  for (const [width, height] of [[327, 640], [880, 640]]) {
    const {zoom, pan} = fitGraph(initialNodes, width, height)
    for (const node of initialNodes) {
      assert.ok((node.x-nodeUnit)*zoom+pan.x>=-.001)
      assert.ok((node.x+nodeUnit)*zoom+pan.x<=width+.001)
      assert.ok((node.y-nodeUnit)*zoom+pan.y>=-.001)
      assert.ok((node.y+nodeUnit)*zoom+pan.y<=height+.001)
    }
  }
})
test('empty graphs have a finite initial view', () => {
  assert.deepEqual(fitGraph([], 0, 0), {zoom:1,pan:{x:0,y:0}})
})
