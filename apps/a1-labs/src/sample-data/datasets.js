import { datasetCount } from './sizes.js'
import { buildInventory } from './inventory.js'

const names = ['Alex Morgan', 'Sam Rivera', 'Jordan Chen', 'Taylor Brooks', 'Casey Patel', 'Riley James', 'Avery Kim', 'Cameron Reed']
const teams = ['Design', 'Engineering', 'Operations', 'Research']
const date = index => new Date(Date.UTC(2026, 9, 1 + index)).toISOString().slice(0, 10)

export function createDataset(type, size = 'medium') {
  const count = datasetCount(size)
  if (type === 'inventory') return buildInventory(count)
  if (!['directory', 'invoices', 'requests'].includes(type)) throw new RangeError(`Unknown dataset: ${type}`)
  return Array.from({ length: count }, (_, i) => {
    const id = `${type}-${i + 1}`
    if (type === 'directory') return { id, name: `${names[i % names.length]}${i >= names.length ? ` ${Math.floor(i / names.length) + 1}` : ''}`, team: teams[i % teams.length], status: ['Active', 'Active', 'Away', 'Invited'][i % 4], role: ['Lead', 'Specialist', 'Manager'][i % 3], location: ['New York', 'London', 'Toronto', 'Remote'][i % 4], email: `person${i + 1}@example.com`, projects: i % 12 + 1, joined: date(i % 90) }
    if (type === 'invoices') return { id, number: `INV-${1001 + i}`, client: ['North Studio', 'Fieldwork', 'Common Ground', 'Open House'][i % 4], amount: 250 + i * 75, status: ['Paid', 'Pending', 'Overdue'][i % 3], due: date(i % 90 + 30), owner: names[i % names.length], items: i % 8 + 1, issued: date(i % 90) }
    return { id: `record-${i + 1}`, reference: `REQ-${String(i + 1).padStart(5, '0')}`, title: ['Workspace access', 'Equipment request', 'Project review', 'Account update'][i % 4], team: teams[Math.floor(i / 4) % teams.length], status: ['Open', 'In review', 'Complete'][i % 3], amount: 25 + ((i * 73) % 2500) }
  })
}
