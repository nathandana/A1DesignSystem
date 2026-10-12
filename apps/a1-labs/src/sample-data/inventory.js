// Shared fictional inventory. Keep the original seed/order and numeric IDs so
// persisted bulk deletions still refer to the same products.
import { datasetCount } from './sizes.js'

export const stockStatus = stock => stock === 0 ? 'Out of stock' : stock < 5 ? 'Low stock' : 'In stock'
export const STATUS_TONES = Object.freeze({ 'In stock': 'success', 'Low stock': 'warn', 'Out of stock': 'error' })
const SUPPLIERS = ['Northwood Co.', 'Harbor Goods', 'Atelier Nine', 'Field & Forge', 'Linden Studio']

const MATERIALS = ['Walnut', 'Oak', 'Ash', 'Linen', 'Brass', 'Wool', 'Pine', 'Ceramic', 'Cedar', 'Velvet', 'Maple', 'Rattan', 'Marble', 'Cotton', 'Copper', 'Teak', 'Birch', 'Leather', 'Glass', 'Bamboo']
// [item, category, SKU prefix, typical price]
const ITEMS = [
  ['desk', 'Desks', 'DSK', 520], ['bookshelf', 'Storage', 'SHF', 210], ['stool', 'Seating', 'STL', 90],
  ['armchair', 'Seating', 'CHR', 480], ['floor lamp', 'Lighting', 'LMP', 190], ['rug', 'Textiles', 'RUG', 320],
  ['side table', 'Tables', 'TBL', 140], ['pendant', 'Lighting', 'PND', 160], ['chest', 'Storage', 'STR', 380],
  ['sofa', 'Seating', 'SFA', 1350], ['dining table', 'Tables', 'DIN', 980], ['throw', 'Textiles', 'THR', 70],
  ['mirror', 'Decor', 'MIR', 150], ['planter', 'Decor', 'PLT', 45], ['bench', 'Seating', 'BNC', 260], ['wall shelf', 'Storage', 'WSH', 85],
]

function seeded(seed) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** `count` unique products ({ id, name, sku, category, stock, price }), deterministic for a seed. */
export function buildInventory(size = 'medium', seed = 2026) {
  const count = datasetCount(size)
  const random = seeded(seed)
  const combos = MATERIALS.flatMap(material => ITEMS.map(item => [material, ...item]))
  for (let i = combos.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [combos[i], combos[j]] = [combos[j], combos[i]]
  }
  const numbers = {}
  return Array.from({ length: count }, (_, index) => {
    const [material, item, category, prefix, typicalPrice] = combos[index % combos.length]
    const edition = Math.floor(index / combos.length) + 1
    numbers[prefix] = (numbers[prefix] ?? 100) + 1 + Math.floor(random() * 9)
    const roll = random()
    const stock = roll < 0.08 ? 0 : roll < 0.22 ? 1 + Math.floor(random() * 4) : 5 + Math.floor(random() * 36)
    const price = Math.max(5, Math.round((typicalPrice * (0.75 + random() * 0.6)) / 5) * 5)
    const cost = Math.round((price * (0.48 + (index % 5) * 0.04)) / 5) * 5
    return {
      id: index + 1,
      name: `${material} ${item}${edition > 1 ? ` · Series ${edition}` : ''}`,
      sku: `${prefix}-${numbers[prefix]}`,
      category,
      stock,
      price,
      status: stockStatus(stock),
      supplier: SUPPLIERS[index % SUPPLIERS.length],
      reorder: 4 + (index % 4) * 2,
      cost,
      margin: Math.round(((price - cost) / price) * 100),
      warehouse: ['East', 'West', 'Central'][index % 3],
      updated: new Date(Date.UTC(2026, 9, 10 - (index % 28))).toISOString().slice(0, 10),
    }
  })
}
