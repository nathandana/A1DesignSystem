import Ajv from 'ajv';
import { createPatternArea, getPatternAreaContract, getPatternManifest, patternManifests, patternTreeEntries, supportsPatternVersion, ZONE_RULE_PROPS } from './patternPolicies.js';

const ajv = new Ajv({ allErrors: true, jsonPointers: true });
const propsValidators = new Map(patternManifests.map(m => [m.type, ajv.compile(m.propsSchema)]));
const pointer = (value) => String(value).replaceAll('~', '~0').replaceAll('/', '~1');
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const isObject = value => value && typeof value === 'object' && !Array.isArray(value);

export function isPatternNavigationTarget(value) {
  if (typeof value !== 'string' || !value.trim() || /[\u0000-\u0020\u007f]/.test(value)) return false;
  // Relative URLs and known navigation schemes. Reject unknown executable schemes.
  return !/^[a-z][a-z0-9+.-]*:/i.test(value) || /^(https?:|mailto:|tel:)/i.test(value);
}

/** Validate only formal pattern contracts. It is not a whole-page schema validator. */
export function validatePatterns(input) {
  const diagnostics = [];
  const add = (node, path, ruleId, message, recovery, severity = 'error') => diagnostics.push({ nodeId: node?.id ?? null, path, ruleId, severity, message, recovery });
  function checkAction(item, path) {
    if (!isObject(item)) return;
    const props = item.props ?? {};
    if (item.type === 'IconButton' && ![props.label, props.labelKey, item.a11y?.label].some(value => typeof value === 'string' && value.trim())) {
      add(item, `${path}/props/label`, 'pattern.action-name', 'An icon button needs an accessible name.', 'Set a meaningful label describing this action.');
    }
    if (item.type === 'IconButton' && !(typeof props.icon === 'string' && props.icon.trim())) {
      add(item, `${path}/props/icon`, 'pattern.action-icon', 'An icon button needs an icon.', 'Choose an A1 icon.');
    }
    if (['Button', 'Link', 'IconButton'].includes(item.type)) {
      if (item.type === 'Link' && !props.href) add(item, `${path}/props/href`, 'pattern.action-target', 'A link needs a destination.', 'Set href to the destination.');
      if (props.href != null && !isPatternNavigationTarget(props.href)) add(item, `${path}/props/href`, 'pattern.action-target', 'The navigation target is invalid.', 'Use a relative path or an http, https, mailto or tel URL.');
      const action = item.actions?.onClick;
      if (action && ['navigate', 'externalLink'].includes(action.type) && !isPatternNavigationTarget(action.target)) add(item, `${path}/actions/onClick/target`, 'pattern.action-target', 'The action target is invalid.', 'Provide a supported navigation target.');
    }
  }
  function checkItems(parent, area, items, path) {
    if (!Array.isArray(items)) { add(parent, path, 'pattern.area-items', 'Area children must be an array.', 'Use an array of component nodes.'); return; }
    if (items.length > area.max) add(parent, path, area.ruleId, `${area.label} accepts at most ${area.max} direct items.`, 'Remove or relocate extra items explicitly; none have been discarded.');
    let primary = 0;
    function visitItems(list, basePath, allow) {
      if (!Array.isArray(list)) { add(parent, basePath, 'pattern.area-items', 'Group children must be an array.', 'Use an array of component nodes.'); return; }
      list.forEach((item, i) => {
        const itemPath = `${basePath}/${i}`;
        if (!isObject(item) || !allow.includes(item.type)) { add(item, itemPath, area.ruleId, `${area.label} does not accept ${item?.type ?? 'this value'}.`, `Use ${allow.join(', ')}.`); return; }
        if (area.destination === 'actions') checkAction(item, itemPath);
        const props = item.props ?? {};
        const variants = area.policies?.variants?.[item.type];
        if (variants && props.variant != null && !variants.allow.includes(props.variant)) add(item, `${itemPath}/props/variant`, 'pattern.action-variant', `This ${item.type} variant will render as ${variants.fallback}.`, `Use ${variants.allow.join(' or ')}.`, 'warning');
        for (const [key, fixed] of Object.entries(area.policies?.fixedProps?.[item.type] ?? {})) {
          if (props[key] !== undefined && !equal(props[key], fixed)) add(item, `${itemPath}/props/${pointer(key)}`, 'pattern.fixed-item-prop', `${area.label} fixes ${key} to ${JSON.stringify(fixed)}.`, 'Remove the override or use the fixed value.', 'warning');
        }
        if (area.policies?.primary?.types.includes(item.type) && (props.variant ?? area.policies.primary.defaultVariant) === 'primary') primary++;
        const groupAllow = area.policies?.groups?.[item.type];
        if (groupAllow) visitItems(item.children ?? [], `${itemPath}/children`, groupAllow);
      });
    }
    visitItems(items, path, area.allow);
    if (primary > (area.policies?.primary?.max ?? Infinity)) add(parent, path, 'pattern.primary-count', 'Extra primary buttons will render as secondary.', 'Choose one primary action; it renders last.', 'warning');
  }
  function visit(value, path = '') {
    if (Array.isArray(value)) { value.forEach((child, i) => visit(child, `${path}/${i}`)); return; }
    if (!isObject(value)) return;
    const manifest = getPatternManifest(value.type);
    if (value.patternVersion != null && !manifest) {
      add(value, `${path}/patternVersion`, 'pattern.unknown', `Unknown formal pattern ${value.type}.`, 'Install a runtime supporting this pattern. The original node is retained.');
      return;
    }
    if (manifest) {
      if (!supportsPatternVersion(value)) {
        add(value, `${path}/patternVersion`, 'pattern.version', `Unsupported ${value.type} version ${value.patternVersion}; this runtime supports ${manifest.version}.`, 'Use a matching runtime or an explicit migration. The original node is retained.');
        return;
      }
      for (const migration of manifest.migrations) for (const operation of migration.operations) {
        if (operation.op === 'renameProp' && Object.hasOwn(value.props ?? {}, operation.from)) add(value, `${path}/props/${pointer(operation.from)}`, 'pattern.migration-required', `${operation.from} was renamed to ${operation.to}.`, 'Run the explicit pattern migration and review its proposed JSON before saving.');
      }
      const validate = propsValidators.get(value.type);
      if (!validate(value.props ?? {})) for (const error of validate.errors ?? []) add(value, `${path}/props${error.dataPath}`, 'pattern.props', `${value.type}: ${error.message}.`, error.params?.missingProperty ? `Provide ${error.params.missingProperty}.` : 'Use a value allowed by the pattern props schema.');
      for (const [key, fixed] of Object.entries(manifest.lockedProps)) if (value.props?.[key] !== undefined && !equal(value.props[key], fixed)) add(value, `${path}/props/${pointer(key)}`, 'pattern.locked-prop', `${value.type} fixes ${key} to ${JSON.stringify(fixed)}.`, 'Remove the override or use the fixed value.');
      if (value.type === 'OverviewCard' && value.props?.status && !value.props?.statusLabel) add(value, `${path}/props/statusLabel`, 'overview-card-status-labelled', 'Status is hidden without its label.', 'Provide a status label or remove the status.', 'warning');
      for (const collection of manifest.collections ?? []) {
        const key = collection.path.split('/').at(-1);
        const items = value.props?.[key];
        if (!Array.isArray(items)) continue; // The props schema diagnoses malformed collections.
        const ids = new Set();
        function checkCollection(list, basePath) {
          list.forEach((item, index) => {
            const itemPath = `${basePath}/${index}`;
            if (!isObject(item)) return;
            const id = item[collection.policies.uniqueBy];
            if (ids.has(id)) add(value, `${itemPath}/id`, collection.ruleId, 'Item IDs must be unique across the collection.', 'Give each item a stable, distinct ID.');
            ids.add(id);
            if (collection.policies.navigation === 'safe-target' && item.href) checkAction({ id: item.id, type: 'Button', props: item }, itemPath);
            const children = collection.policies.children;
            if (children && Array.isArray(item[children])) checkCollection(item[children], `${itemPath}/${children}`);
          });
        }
        checkCollection(items, `${path}${collection.path}`);
      }
      const seen = new Set();
      const authoredOrder = (Array.isArray(value.children) ? value.children : []).filter(child => child?.type === 'Slot').map(child => child.props?.area);
      const canonicalOrder = manifest.areas.map(area => area.id).filter(id => authoredOrder.includes(id));
      if (!equal(authoredOrder, canonicalOrder)) add(value, `${path}/children`, 'pattern.area-order', 'Areas render in the order declared by the manifest.', 'Use the manifest area order in JSON.', 'warning');
      if (value.children != null && !Array.isArray(value.children)) add(value, `${path}/children`, 'pattern.areas', 'Pattern children must be an array of areas.', 'Use the named Slot areas in the manifest.');
      else (value.children ?? []).forEach((slot, i) => {
        const slotPath = `${path}/children/${i}`;
        const area = slot?.type === 'Slot' ? getPatternAreaContract(value.type, slot.props?.area) : null;
        if (!area) { add(slot, slotPath, 'pattern.area-unknown', 'This child is not a declared pattern area.', 'Put authored content in the Content area; preserve unknown areas until their contract is available.'); return; }
        if (seen.has(area.id)) add(slot, slotPath, 'pattern.area-duplicate', `Duplicate ${area.label} area.`, 'Combine the content deliberately into one area.');
        seen.add(area.id);
        if (area.kind === 'open' && slot.children != null && !Array.isArray(slot.children)) add(slot, `${slotPath}/children`, 'pattern.area-items', 'Area children must be an array.', 'Use an array of component nodes.');
        if (area.kind === 'zone') {
          const expected = createPatternArea(value.type, area.id).props;
          const overrides = ZONE_RULE_PROPS.filter(key => slot.props?.[key] !== undefined && !equal(slot.props[key], expected[key]));
          if (overrides.length || slot.lock?.node === false || slot.utilities || slot.visibility) add(slot, `${slotPath}/props`, 'pattern.area-rules', `${area.label} rules are owned by ${value.type}; authored overrides cannot weaken them.`, 'Use the manifest area definition. The editor enforces the canonical rules.', 'warning');
          checkItems(value, area, slot.children ?? [], `${slotPath}/children`);
        }
      });
      if (value.patternVersion != null) for (const area of manifest.areas) if (!seen.has(area.id)) add(value, `${path}/children`, 'pattern.area-missing', `Missing ${area.label} area.`, 'Restore the empty area definition from the manifest.');
      // Legacy data forms remain supported, but receive the same diagnostics.
      for (const area of manifest.areas.filter(a => a.kind === 'zone' && !seen.has(a.id))) {
        const data = value.props?.[area.destination];
        if (Array.isArray(data)) checkItems(value, area, data.map((item, index) => area.destination === 'meta'
          ? { id: `${value.id}-meta-${index}`, type: 'MessageBadge', props: { status: item?.status }, content: { fallback: item?.label } }
          : { id: item?.id, type: item?.kind === 'link' ? 'Link' : item?.kind === 'icon-button' ? 'IconButton' : 'Button', props: { ...item, variant: item?.variant ?? (item?.kind === 'icon-button' ? 'tertiary' : 'secondary') } }), `${path}/props/${area.destination}`);
      }
    }
    for (const [location, child] of patternTreeEntries(value)) visit(child, `${path}/${location}`);
  }
  visit(input);
  return { valid: !diagnostics.some(d => d.severity === 'error'), diagnostics };
}

/** Guard visual edits, including moves/pastes/duplicates, against removing fixed areas. */
export function validatePatternEdit(previous, next) {
  const result = validatePatterns(next);
  const nodes = new Map();
  const walk = (value, fn) => {
    if (Array.isArray(value)) return value.forEach(child => walk(child, fn));
    if (!isObject(value)) return;
    if (value.type && value.id) fn(value);
    patternTreeEntries(value).forEach(([, child]) => walk(child, fn));
  };
  walk(next, node => nodes.set(node.id, node));
  walk(previous, node => {
    if (!supportsPatternVersion(node)) return;
    const updated = nodes.get(node.id);
    if (!updated) return; // Removing the whole pattern is allowed.
    for (const area of getPatternManifest(node.type).areas.filter(a => a.kind === 'zone')) {
      const before = (Array.isArray(node.children) ? node.children : []).find(child => child?.type === 'Slot' && child.props?.area === area.id);
      if (before && (updated.type !== node.type || !(Array.isArray(updated.children) ? updated.children : []).some(child => child?.id === before.id && child.type === 'Slot' && child.props?.area === area.id))) {
        result.diagnostics.push({ nodeId: node.id, path: '/children', ruleId: 'pattern.area-locked', severity: 'error', message: `${area.label} is part of ${node.type}.`, recovery: 'Edit its items, or remove the whole pattern.' });
      }
    }
  });
  result.valid = !result.diagnostics.some(d => d.severity === 'error');
  return result;
}

export const formatPatternDiagnostics = diagnostics => diagnostics.map(d => `${d.nodeId ?? 'Pattern'} ${d.path}: ${d.message} ${d.recovery}`).join('\n');
