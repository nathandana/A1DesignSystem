/** Pure data transforms; never mutate the caller's hierarchy. */
export function scoreNavigationItem(item, query) {
  const text = [item.label, ...(item.keywords ?? [])].join(' ').toLocaleLowerCase();
  return query.toLocaleLowerCase().split(/\s+/).every(term => text.includes(term)) ? 1 : 0;
}

export function filterNavigationItems(items, query, scoreItem = scoreNavigationItem) {
  if (!query.trim()) return items;
  function visit(list) {
    return list.map((item, index) => {
      const score = scoreItem(item, query.trim());
      const children = visit(item.children ?? []);
      const best = Math.max(score, ...children.map(child => child.score), 0);
      return { index, score: best, item: { ...item,
        ...(item.children ? { children: score > 0 ? item.children : children.map(child => child.item) } : {}),
      } };
    }).filter(entry => entry.item.pinned || entry.score > 0)
      .sort((a, b) => Number(!!b.item.pinned) - Number(!!a.item.pinned) || b.score - a.score || a.index - b.index);
  }
  return visit(items).map(entry => entry.item);
}

export function alphabetizeNavigationItems(items) {
  const flat = [];
  function visit(list) {
    for (const item of list) {
      if (item.excludeFromAz) continue;
      if (!item.category) {
        const { children: _children, ...entry } = item;
        flat.push(entry);
      }
      visit(item.children ?? []);
    }
  }
  visit(items);
  return flat.sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) ||
    (a.sortLabel ?? a.label).localeCompare(b.sortLabel ?? b.label, undefined, { sensitivity: 'base' }));
}

export function navigationAncestors(items, selectedId) {
  for (const item of items) {
    if (item.id === selectedId) return item.category && item.children?.length ? [item.id] : [];
    const path = navigationAncestors(item.children ?? [], selectedId);
    if (path) return [item.id, ...path];
  }
  return null;
}

export function navigationSearchBranchIds(items, query, scoreItem = scoreNavigationItem) {
  return items.flatMap(item => {
    if (!item.children?.length) return [];
    // A matched item keeps its subitems without opening them (catalog examples).
    if (!item.category && scoreItem(item, query.trim()) > 0) return [];
    return [item.id, ...navigationSearchBranchIds(item.children, query, scoreItem)];
  });
}
