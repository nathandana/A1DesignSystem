import appLabels       from '../../../../system/labels/app.json'
import actionLabels    from '../../../../system/labels/action.json'
import backlogLabels   from '../../../../system/labels/backlog.json'
import calendarLabels  from '../../../../system/labels/calendar.json'
import customBlockLabels from '../../../../system/labels/custom-block.json'
import codeLabels      from '../../../../system/labels/code.json'
import fieldLabels     from '../../../../system/labels/field.json'
import statusBarLabels from '../../../../system/labels/status-bar.json'
import treeMenuLabels  from '../../../../system/labels/tree-menu.json'

export const SYSTEM_LABELS = {
  label: {
    ...appLabels.label,
    ...actionLabels.label,
    ...backlogLabels.label,
    ...calendarLabels.label,
    ...codeLabels.label,
    ...customBlockLabels.label,
    ...fieldLabels.label,
    ...statusBarLabels.label,
    ...treeMenuLabels.label,
  },
}

export function resolveLabel(labels, locale, key, fallback) {
  if (!key || !labels) return fallback ?? key
  const parts = key.split('.')
  let node = labels.label
  for (const part of parts) {
    if (node == null || typeof node !== 'object') return fallback ?? key
    node = node[part]
  }
  if (node == null) return fallback ?? key
  if (locale && node.locale?.[locale] != null) return node.locale[locale]
  return node.$value ?? fallback ?? key
}
