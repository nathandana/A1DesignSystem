import canvasTokens from '../../../../system/tokens/component/canvas.json' with { type: 'json' }

// Graph spacing derives from A1's node-size token; positions are graph data.
export const nodeUnit = parseFloat(canvasTokens.component.canvas.node.size.$value)
export const moveStep = nodeUnit / 5

export function fitGraph(nodes, width, height) {
  if (!nodes.length || width <= 0 || height <= 0) return { zoom: 1, pan: { x: 0, y: 0 } }
  const xs = nodes.map(node => node.x), ys = nodes.map(node => node.y)
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys)
  // One node-unit margin at each side includes the widest default node and breathing room.
  const zoom = Math.min(1, width / (x1 - x0 + nodeUnit * 2), height / (y1 - y0 + nodeUnit * 2))
  return { zoom, pan: { x: width / 2 - (x0 + x1) / 2 * zoom, y: height / 2 - (y0 + y1) / 2 * zoom } }
}
