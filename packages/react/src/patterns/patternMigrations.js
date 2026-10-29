import { createPatternArea, getPatternManifest, supportsPatternVersion } from './patternPolicies.js';
import { validatePatterns } from './patternValidation.js';

/** Explicit migration only: callers receive a new node and must choose to save it. */
export function migratePatternNode(source) {
  const manifest = getPatternManifest(source?.type);
  const reject = message => ({ node: source, valid: false, diagnostics: [{ nodeId: source?.id ?? null, path: '/patternVersion', ruleId: 'pattern.migration', severity: 'error', message, recovery: 'Keep the original JSON and use a matching runtime or resolve the conflict.' }] });
  if (!manifest) return reject('This runtime does not know this formal pattern.');
  if (source.patternVersion === manifest.version) return { node: source, ...validatePatterns(source) };
  const migration = manifest.migrations.find(m => m.from === (source.patternVersion ?? 'unversioned'));
  if (!migration) return reject(`No migration exists from ${source.patternVersion} to ${manifest.version}.`);
  if (!supportsPatternVersion(source)) return reject('This migration is not supported by this runtime.');
  if (source.children != null && (!Array.isArray(source.children) || source.children.some(child => !child || typeof child !== 'object' || (child.children != null && !Array.isArray(child.children))))) return reject('Children and area children must be arrays of component nodes.');
  for (const area of manifest.areas.filter(area => area.kind === 'zone')) {
    const data = source.props?.[area.destination];
    if (data != null && (!Array.isArray(data) || data.some(item => !item || typeof item !== 'object'))) return reject(`${area.destination} must be an array of items before migration.`);
  }
  const areaIds = (source.children ?? []).filter(child => child.type === 'Slot').map(child => child.props?.area);
  if (new Set(areaIds).size !== areaIds.length) return reject('Duplicate areas need to be resolved before migration.');
  let node = { ...source, props: { ...source.props }, children: [...(source.children ?? [])] };
  const ids = new Set();
  const collect = value => { if (!value || typeof value !== 'object') return; if (value.id) ids.add(value.id); Object.values(value).forEach(v => Array.isArray(v) ? v.forEach(collect) : collect(v)); };
  collect(source);
  const unique = base => { let id = base; let i = 1; while (ids.has(id)) id = `${base}-${i++}`; ids.add(id); return id; };
  for (const operation of migration.operations) {
    if (operation.op === 'renameProp') {
      if (Object.hasOwn(node.props, operation.from)) {
        if (Object.hasOwn(node.props, operation.to)) return reject(`Both ${operation.from} and ${operation.to} are present; choose the intended value first.`);
        node.props[operation.to] = node.props[operation.from];
        delete node.props[operation.from];
      }
    } else if (operation.op === 'adoptAreas') {
      const direct = node.children.filter(child => child.type !== 'Slot');
      const areas = node.children.filter(child => child.type === 'Slot');
      node.children = manifest.areas.map(area => {
        const existing = areas.find(child => child.props?.area === area.id);
        if (existing) return area.kind === 'open' && direct.length ? { ...existing, children: [...(existing.children ?? []), ...direct] } : existing;
        const data = node.props[area.destination];
        const children = area.kind === 'open' ? direct : Array.isArray(data) ? data.map((item, i) => {
          const id = item.id ?? unique(`${source.id}-${area.id}-${i + 1}`);
          if (area.destination === 'meta') {
            const { label, id: _id, ...props } = item;
            return { id, type: 'MessageBadge', props, content: { fallback: label } };
          }
          const { kind, label, id: _id, ...props } = item;
          const type = kind === 'link' ? 'Link' : kind === 'icon-button' ? 'IconButton' : 'Button';
          if (type === 'Button') props.variant ??= 'secondary';
          if (type === 'IconButton') { props.label = label; props.icon ||= 'more_horiz'; }
          if (props.href && type !== 'Link') props.as = 'a';
          return { id, type, props, ...(type === 'IconButton' ? {} : { content: { fallback: label } }) };
        }) : [];
        if (area.kind === 'zone') delete node.props[area.destination];
        return createPatternArea(source.type, area.id, { id: unique(`${source.id}-${area.id}`), children });
      });
      node.children.push(...areas.filter(child => !manifest.areas.some(a => a.id === child.props?.area)));
    } else return reject(`Unsupported migration operation ${operation.op}.`);
  }
  node = { ...node, patternVersion: migration.to };
  const validation = validatePatterns(node);
  return validation.valid ? { node, ...validation } : { node: source, ...validation };
}
