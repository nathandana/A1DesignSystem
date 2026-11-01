import { useState } from 'react'
import { Accordion, Button, Code, NavigationTree, Stack, TextField } from '@gtivr4/a1-design-system-react'
import { Choice, WithHelp } from './configKit.jsx'
import { Toggle } from './Toggle.jsx'
import { IconSelect } from './IconSelect.jsx'
import { useInResponsivePreview } from './responsivePreview.js'
import { createPatternNode } from '../../../../../../packages/react/src/patterns/patternPolicies.js'
import { nodeToJsx } from '../../../editor/definitionToJsx.ts'

export const jsonType = 'NavigationTree'
export const bareDisplay = true
export function getDefaultConfig() {
  return { items: [
    { id: 'overview', label: 'Overview', icon: 'home', pinned: true },
    { id: 'workspace', label: 'Workspace', icon: 'workspaces', category: true, children: [
      { id: 'projects', label: 'Projects', icon: 'folder', category: true, children: [
        { id: 'active-projects', label: 'Active projects', icon: 'folder_open', keywords: ['current', 'work'] },
        { id: 'archived-projects', label: 'Archived projects', icon: 'archive' },
      ] },
      { id: 'team', label: 'Team members', icon: 'group', keywords: ['people', 'users'] },
      { id: 'reports', label: 'Reports', icon: 'bar_chart', keywords: ['analytics'] },
    ] },
    { id: 'account', label: 'Account', icon: 'manage_accounts', category: true, children: [
      { id: 'profile', label: 'Profile', icon: 'person', keywords: ['avatar', 'name'] },
      { id: 'billing', label: 'Billing', icon: 'credit_card', category: true, children: [
        { id: 'invoices', label: 'Invoices', icon: 'receipt_long', keywords: ['payments', 'receipts'] },
        { id: 'payment-methods', label: 'Payment methods', icon: 'payments' },
      ] },
      { id: 'notifications', label: 'Notifications', icon: 'notifications' },
    ] },
    { id: 'resources', label: 'Resources', icon: 'library_books', category: true, children: [
      { id: 'guides', label: 'Guides', icon: 'menu_book', keywords: ['documentation', 'help'] },
      { id: 'support', label: 'Support', icon: 'help', keywords: ['contact', 'help'] },
    ] },
  ], searchable: true, sortable: true, defaultView: 'tree', defaultSearch: '', defaultSelectedId: 'invoices',
    defaultCollapsed: false,
    'aria-label': 'Navigation', searchLabel: 'Search navigation', sortLabel: 'A-Z', listViewLabel: 'List view' }
}
// Samples belong to the library page; imported and editor nodes keep their authored data.
export function configFromProps(props = {}) { return { ...getDefaultConfig(), items: [], defaultSelectedId: '', ...props } }
export function propsFromConfig({ sourceNode: _source, utilities: _utilities, ...config }) { return config }
export function fromJson(node) { return { ...configFromProps(node.props), sourceNode: node } }
export function toJson(config) {
  const node = createPatternNode(jsonType, { props: propsFromConfig(config) })
  return { node: { ...node, ...config.sourceNode, props: propsFromConfig(config) } }
}

function PreviewNavigation({ props, utilityClass }) {
  const responsive = useInResponsivePreview()
  const [open, setOpen] = useState(true)
  const preview = <NavigationTree {...props} className={utilityClass} open={open} onClose={() => setOpen(false)} />
  return <Stack gap={0}>
    {!open && <Button autoFocus variant="secondary" icon="menu" onClick={() => setOpen(true)}>Open navigation</Button>}
    {responsive ? preview : <div className="a1-web-side-nav-preview">{preview}</div>}
  </Stack>
}
export function Preview({ config, utilityClass = '' }) {
  const props = propsFromConfig(config)
  return <PreviewNavigation key={JSON.stringify(props)} props={props} utilityClass={utilityClass} />
}
const newItem = (category = false) => ({ id: `nav-${crypto.randomUUID()}`, label: category ? 'New category' : 'New item', ...(category ? { category: true, icon: 'folder', children: [] } : {}) })
function ItemEditor({ item, onChange, onRemove }) {
  return <Accordion label={item.label || 'Untitled'} size="sm">
    <Stack gap="sm">
      <WithHelp helper="The name shown in navigation and matched by search.">
        <TextField label="Label" size="compact" value={item.label} onChange={e => onChange({ label: e.target.value })} />
      </WithHelp>
      <WithHelp helper="A stable, unique ID for selection and expansion. Keep it unique across the whole tree.">
        <TextField label="Item ID" size="compact" value={item.id} onChange={e => onChange({ id: e.target.value })} />
      </WithHelp>
      <WithHelp helper="An optional destination. Items without a URL notify onSelect in React.">
        <TextField label="Link" size="compact" value={item.href ?? ''} onChange={e => onChange({ href: e.target.value })} />
      </WithHelp>
      <IconSelect label="Icon" value={item.icon ?? ''} onChange={icon => onChange({ icon })} />
      <Toggle label="Category" value={!!item.category} onChange={category => onChange({ category })} helper="Categories keep their authored order in the tree and are omitted from A–Z. They may contain any number of categories and items." />
      <Toggle label="Pinned" value={!!item.pinned} onChange={pinned => onChange({ pinned })} helper="Keep an overview link first and visible while searching." />
      <Toggle label="Exclude from A–Z" value={!!item.excludeFromAz} onChange={excludeFromAz => onChange({ excludeFromAz })} helper="Hide this item and its descendants in A–Z, such as examples below a component." />
      <Toggle label="Disabled" value={!!item.disabled} onChange={disabled => onChange({ disabled })} helper="Keep the item visible but prevent activation." />
      <WithHelp helper="Extra search terms separated by commas.">
        <TextField label="Keywords" size="compact" value={(item.keywords ?? []).join(',')} onChange={e => onChange({ keywords: e.target.value.split(',') })} />
      </WithHelp>
      <WithHelp helper="Optional sorting text. Leave empty to sort by the label.">
        <TextField label="Sort label" size="compact" value={item.sortLabel ?? ''} onChange={e => onChange({ sortLabel: e.target.value || undefined })} />
      </WithHelp>
      <ItemList items={item.children ?? []} onChange={children => onChange({ children })} />
      <Button variant="destructive" size="sm" icon="delete" onClick={onRemove}>Remove item</Button>
    </Stack>
  </Accordion>
}
function ItemList({ items, onChange }) {
  return <Stack gap="sm">
    {items.map((item, index) => <ItemEditor key={index} item={item}
      onChange={patch => onChange(items.map((entry, i) => i === index ? { ...entry, ...patch } : entry))}
      onRemove={() => onChange(items.filter((_, i) => i !== index))} />)}
    <Stack direction="row" wrap gap="xs">
      <Button variant="secondary" size="sm" icon="create_new_folder" onClick={() => onChange([...items, newItem(true)])}>Add category</Button>
      <Button variant="secondary" size="sm" icon="add" onClick={() => onChange([...items, newItem()])}>Add item</Button>
    </Stack>
  </Stack>
}
export function Controls({ config, setConfig }) {
  const set = patch => setConfig(current => ({ ...current, ...patch }))
  const [itemsOpen, setItemsOpen] = useState(true)
  return <Stack gap="md">
    <Toggle prop="searchable" label="Search" value={config.searchable} onChange={searchable => set({ searchable })} helper="Show the compact search field. Search matches labels and keywords at every depth." />
    <Toggle prop="sortable" label="Sorting button" value={config.sortable} onChange={sortable => set({ sortable })} helper="Show the A–Z toggle. Turn it off to keep the initial view and let the search field fill the panel." />
    <Choice prop="defaultView" label="Initial view" value={config.defaultView} onChange={defaultView => set({ defaultView })}
      options={[{ value: 'tree', label: 'Categorized' }, { value: 'az', label: 'A–Z' }]} helper="Categorized preserves your hierarchy. A–Z lists all noncategory items alphabetically." />
    <Toggle prop="defaultCollapsed" label="Initially collapsed" value={config.defaultCollapsed} onChange={defaultCollapsed => set({ defaultCollapsed })} helper="Start with icon navigation on desktop. Phone and tablet views keep the full tree." />
    {[
      ['aria-label', 'Navigation label', 'Accessible name for the navigation and its tree.'],
      ['searchLabel', 'Search label', 'Accessible name for the optional search field.'],
      ['sortLabel', 'Sorting label', 'Accessible name for the A–Z toggle.'],
      ['listViewLabel', 'List view label', 'Accessible name for the sorting toolbar.'],
      ['defaultSelectedId', 'Initial selected ID', 'The active item on first render; its ancestors open automatically.'],
      ['defaultSearch', 'Initial search', 'Optional initial filter; leave empty to show all items.'],
    ].map(([prop, label, helper]) => <WithHelp key={prop} helper={helper}>
      <TextField label={label} size="compact" value={config[prop] ?? ''} onChange={e => set({ [prop]: e.target.value })} />
    </WithHelp>)}
    <Accordion label="Navigation items" open={itemsOpen} onChange={setItemsOpen} size="sm">
      <ItemList items={config.items} onChange={items => set({ items })} />
    </Accordion>
  </Stack>
}
export function Snippet({ config, utilityClass = '' }) {
  const { node } = toJson(config)
  if (utilityClass) node.props.className = utilityClass
  return <Code variant="block" wrapping copyCode>{nodeToJsx(node)}</Code>
}
