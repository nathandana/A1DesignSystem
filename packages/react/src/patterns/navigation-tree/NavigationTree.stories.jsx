import { NavigationTree } from './NavigationTree.jsx';

const items = [
  { id: 'all', label: 'All pages', icon: 'apps', pinned: true },
  { id: 'account', label: 'Account', icon: 'folder', category: true, children: [
    { id: 'profile', label: 'Profile', icon: 'person', keywords: ['name', 'avatar'] },
    { id: 'billing', label: 'Billing', category: true, children: [
      { id: 'invoices', label: 'Invoices', icon: 'receipt_long', children: [
        { id: 'current', label: 'Current invoice', children: [{ id: 'detail', label: 'Invoice details' }] },
      ] },
    ] },
  ] },
  { id: 'team', label: 'Team', category: true, children: [{ id: 'members', label: 'Members', icon: 'group' }] },
];
export default {
  title: 'Patterns/Navigation tree', component: NavigationTree,
  args: { items, searchable: true, sortable: true, defaultView: 'tree' },
  argTypes: {
    items: { control: 'object' }, searchable: { control: 'boolean' }, sortable: { control: 'boolean' },
    defaultView: { control: 'inline-radio', options: ['tree', 'az'] },
    defaultSelectedId: { control: 'text' }, defaultSearch: { control: 'text' },
    defaultExpandedIds: { control: 'object' },
    defaultCollapsed: { control: 'boolean' }, open: { control: 'boolean' },
    searchLabel: { control: 'text' }, sortLabel: { control: 'text' }, listViewLabel: { control: 'text' },
    'aria-label': { control: 'text' },
  },
};
export const Categorized = {};
export const Alphabetical = { args: { defaultView: 'az' } };
export const WithoutSearch = { args: { searchable: false } };
export const WithoutSorting = { args: { sortable: false }, parameters: { docs: { description: { story: 'The search field fills the panel when the sorting control is hidden.' } } } };
export const TreeOnly = { args: { searchable: false, sortable: false } };
export const DeepSelection = { args: { defaultSelectedId: 'detail' } };
export const Search = { args: { defaultSearch: 'invoice' } };
export const NoMatches = { args: { defaultSearch: 'missing' } };
export const Empty = { args: { items: [] } };

export const Collapsed = { args: { defaultCollapsed: true } };
export const MobileOverlay = { args: { open: true } };
