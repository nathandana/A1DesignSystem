import * as React from 'react';
import type { TreeItem } from '../../components/tree-menu/TreeMenu';
import type { SideNavProps } from '../../components/side-nav/SideNav';

export interface NavigationTreeItem extends Omit<TreeItem, 'children'> {
  /** Category nodes retain their hierarchy but are omitted in A–Z view. */
  category?: boolean;
  /** Keep an overview link first and visible during search. */
  pinned?: boolean;
  /** Omit this item and its descendants from A–Z, e.g. component examples. */
  excludeFromAz?: boolean;
  /** Additional searchable terms. */
  keywords?: string[];
  /** Optional unlocalized A–Z sort key. Defaults to label. */
  sortLabel?: string;
  /** Any number of nested categories and items; IDs must be globally unique. */
  children?: NavigationTreeItem[];
}
export interface NavigationTreeProps extends Omit<SideNavProps, 'header' | 'children' | 'placement' | 'collapseButtonPlacement'> {
  /** Navigation data. Default: empty. */
  items?: NavigationTreeItem[];
  /** Controlled active item. */
  selectedId?: string | null;
  /** Initial active item for uncontrolled use. */
  defaultSelectedId?: string | null;
  onSelect?: (id: string, event?: React.SyntheticEvent) => void;
  /** Show the search field. Default: true. External search remains supported when hidden. */
  searchable?: boolean;
  /** Show the A–Z toggle. Default: true. */
  sortable?: boolean;
  search?: string;
  defaultSearch?: string;
  onSearchChange?: (search: string) => void;
  view?: 'tree' | 'az';
  /** Initial ordering. Default: tree. Hiding sorting preserves this ordering. */
  defaultView?: 'tree' | 'az';
  onViewChange?: (view: 'tree' | 'az') => void;
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onExpandedChange?: (ids: string[]) => void;
  /** Optional search rank; positive values match, higher ranks appear first in categorized view. */
  scoreItem?: (item: NavigationTreeItem, query: string) => number;
  /** Localizable accessible search name. Default: Search navigation. */
  searchLabel?: string;
  /** Localizable toggle name. Default: A-Z. */
  sortLabel?: string;
  /** Localizable toolbar name. Default: List view. */
  listViewLabel?: string;
  /** Input attributes for host integration; size, value and accessible name remain pattern-owned. */
  searchFieldProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'onChange' | 'aria-label'>;
  /** Accessible name for navigation and tree. Default: Navigation. */
  'aria-label'?: string;
}
export declare function NavigationTree(props: NavigationTreeProps): React.ReactElement;
