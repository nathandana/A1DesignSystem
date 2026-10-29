"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLabel } from "../../components/labels/Labels.jsx";
import { SearchField } from "../../components/field/SearchField.jsx";
import { SideNav } from "../../components/side-nav/SideNav.jsx";
import { Stack } from "../../components/stack/Stack.jsx";
import { Toolbar, ToolbarToggle } from "../../components/toolbar/Toolbar.jsx";
import { TreeMenu } from "../../components/tree-menu/TreeMenu.jsx";
import { alphabetizeNavigationItems, filterNavigationItems, navigationAncestors, navigationSearchBranchIds } from "./navigationTreeModel.js";

const EMPTY_ITEMS = [];

/** Searchable side navigation composed entirely from A1 components. */
export function NavigationTree({
  items = EMPTY_ITEMS,
  selectedId: controlledSelectedId,
  defaultSelectedId = null,
  onSelect,
  searchable = true,
  sortable = true,
  search: controlledSearch,
  defaultSearch = "",
  onSearchChange,
  view: controlledView,
  defaultView = "tree",
  onViewChange,
  expandedIds: controlledExpandedIds,
  defaultExpandedIds = EMPTY_ITEMS,
  onExpandedChange,
  collapsed: controlledCollapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  onClose,
  scoreItem,
  searchLabel,
  sortLabel,
  listViewLabel,
  searchFieldProps,
  'aria-label': ariaLabel,
  className = "",
  ...sideNavProps
}) {
  const navigationName = useLabel("navigationTree.label", "Navigation");
  const searchName = useLabel("navigationTree.search", "Search navigation");
  const sortName = useLabel("navigationTree.sort", "A-Z");
  const viewName = useLabel("navigationTree.listView", "List view");
  const navRef = useRef(null);
  const [desktop, setDesktop] = useState(true);
  const [localCollapsed, setLocalCollapsed] = useState(defaultCollapsed);
  const collapsed = desktop && (controlledCollapsed ?? localCollapsed);
  useEffect(() => {
    const nav = navRef.current;
    const host = nav.ownerDocument.defaultView;
    const min = host.getComputedStyle(nav).getPropertyValue("--breakpoint-lg-min").trim();
    const query = host.matchMedia(`(min-width: ${min})`);
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  const [localSelectedId, setLocalSelectedId] = useState(defaultSelectedId);
  const [localSearch, setLocalSearch] = useState(defaultSearch);
  const [localView, setLocalView] = useState(defaultView);
  const [localExpandedIds, setLocalExpandedIds] = useState(defaultExpandedIds);
  const selectedId = controlledSelectedId !== undefined ? controlledSelectedId : localSelectedId;
  const search = controlledSearch ?? localSearch;
  const view = controlledView ?? localView;
  const expandedIds = controlledExpandedIds ?? localExpandedIds;
  const visibleItems = useMemo(() => filterNavigationItems(items, search, scoreItem), [items, search, scoreItem]);
  const displayedItems = useMemo(() => view === "az" ? alphabetizeNavigationItems(visibleItems) : visibleItems, [view, visibleItems]);
  const revealedIds = useMemo(() => search.trim()
    ? navigationSearchBranchIds(visibleItems, search, scoreItem)
    : navigationAncestors(items, selectedId) ?? [], [items, selectedId, search, visibleItems, scoreItem]);

  // Reveal search results and the active route; manual expansion is additive.
  // Controlled callers receive the same proposed state and retain ownership.
  useEffect(() => {
    const next = [...new Set([...expandedIds, ...revealedIds])];
    if (next.length === expandedIds.length) return;
    if (controlledExpandedIds === undefined) setLocalExpandedIds(next);
    onExpandedChange?.(next);
    // Only a new route/query/data reveal opens branches. A manual collapse must
    // remain collapsed until that context changes, even for the active route.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealedIds]);

  const header = searchable || sortable ? (
    <Stack direction={sortable ? "row" : "column"} gap="xs" align={sortable ? "end" : "stretch"}>
      {searchable && <SearchField
        {...searchFieldProps}
        aria-label={searchLabel ?? searchName}
        autoComplete="off"
        size="compact"
        value={search}
        onChange={(event) => {
          if (controlledSearch === undefined) setLocalSearch(event.target.value);
          onSearchChange?.(event.target.value);
        }}
      />}
      {sortable && <Toolbar aria-label={listViewLabel ?? viewName}>
        <ToolbarToggle icon="sort_by_alpha" label={sortLabel ?? sortName} pressed={view === "az"}
          onChange={(pressed) => {
            const next = pressed ? "az" : "tree";
            if (controlledView === undefined) setLocalView(next);
            onViewChange?.(next);
          }} />
      </Toolbar>}
    </Stack>
  ) : null;

  return <SideNav {...sideNavProps} onClose={onClose}
    onKeyDown={(event) => {
      sideNavProps.onKeyDown?.(event);
      if (event.key === "Escape" && !event.defaultPrevented && !desktop) {
        event.stopPropagation();
        onClose?.();
      }
    }} placement="start" collapseButtonPlacement="footer" ref={navRef} collapsed={collapsed}
    onCollapsedChange={(next) => {
      if (controlledCollapsed === undefined) setLocalCollapsed(next);
      onCollapsedChange?.(next);
    }} className={["a1-navigation-tree", className].filter(Boolean).join(" ")}
    aria-label={ariaLabel ?? navigationName} header={collapsed ? null : header}>
    <TreeMenu variant={collapsed ? "collapsed" : "expanded"} aria-label={ariaLabel ?? navigationName} items={displayedItems} selectedId={selectedId}
      onSelect={(id, event) => {
        if (controlledSelectedId === undefined) setLocalSelectedId(id);
        onSelect?.(id, event);
      }}
      expandedIds={expandedIds}
      onExpandedChange={(ids) => {
        if (controlledExpandedIds === undefined) setLocalExpandedIds(ids);
        onExpandedChange?.(ids);
      }} />
  </SideNav>;
}
