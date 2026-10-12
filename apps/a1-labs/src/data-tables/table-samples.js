import { STATUS_TONES } from '../sample-data/inventory.js'
const column = (key, label, type = 'text', extra = {}) => ({ key, label, type, sortable: true, ...extra })
export const TABLE_TYPES = [
  { value: 'inventory', label: 'Inventory' },
  { value: 'directory', label: 'Team directory' },
  { value: 'invoices', label: 'Invoices' },
]
const definitions = {
  inventory: [column('name', 'Product'), column('sku', 'SKU'), column('stock', 'In stock', 'number'), column('price', 'Price', 'currency'), column('status', 'Status', 'badge', { statusMap: STATUS_TONES }), column('category', 'Category'), column('warehouse', 'Warehouse'), column('updated', 'Updated', 'date')],
  directory: [column('name', 'Name'), column('team', 'Team'), column('status', 'Status', 'badge', { statusMap: { Active: 'success', Away: 'warn', Invited: 'info' } }), column('role', 'Role'), column('location', 'Location'), column('email', 'Email'), column('projects', 'Projects', 'number'), column('joined', 'Joined', 'date')],
  invoices: [column('number', 'Invoice'), column('client', 'Client'), column('amount', 'Amount', 'currency'), column('status', 'Status', 'badge', { statusMap: { Paid: 'success', Pending: 'info', Overdue: 'error' } }), column('due', 'Due', 'date'), column('owner', 'Owner'), column('items', 'Line items', 'number'), column('issued', 'Issued', 'date')],
}
export function tableColumns(type, detail = 'standard', searchable = true) {
  return definitions[type].slice(0, { simple: 3, standard: 5, detailed: 8 }[detail]).map(col => ({ ...col, searchable, filterable: ['status', 'team', 'category', 'location', 'client', 'owner', 'warehouse'].includes(col.key), filterType: 'multi' }))
}
