import Ajv from 'ajv';
import contract from './contract.generated.json' with { type: 'json' };
import { validatePatterns } from '../../packages/react/src/patterns/patternValidation.js';
import { getPatternManifest } from '../../packages/react/src/patterns/patternPolicies.js';

export { contract };
export const CONTRACT_VERSION = contract.contractVersion;
export const pointer = value => String(value).replaceAll('~', '~0').replaceAll('/', '~1');
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const ajv = new Ajv({ allErrors: true, jsonPointers: true, schemaId: 'auto' });
const compile = schema => ajv.compile({ ...schema, definitions: contract.definitions });
const pageCheck = compile(contract.pageSchema);
const projectCheck = compile(contract.projectSchema);
const nodeCheck = compile(contract.nodeSchema);
const propChecks = new Map();

// Stable messages also key the UI label catalogue; values/paths stay separate
// from translated prose. Pattern-specific detail remains available to agents.
export const messages = {
  INVALID_JSON: 'Provide valid JSON.',
  INVALID_DOCUMENT: 'Provide a JSON object.',
  INVALID_KIND: 'Choose page or project validation.',
  LIMIT_EXCEEDED: 'Reduce the document size or nesting depth.',
  REQUIRED_FIELD: 'Add the required field.',
  INVALID_TYPE: 'Use the type defined by the contract.',
  INVALID_VALUE: 'Use a value allowed by the contract.',
  UNKNOWN_FIELD: 'Remove this unsupported field.',
  UNKNOWN_COMPONENT: 'Use a registered A1 component.',
  UNKNOWN_PROP: 'Remove this unsupported component prop.',
  UNSUPPORTED_VERSION: 'Use a supported contract version or migrate explicitly.',
  DUPLICATE_ID: 'Use a unique, nonempty ID within this document.',
  EMPTY_ID: 'Provide a nonempty ID.',
  EMPTY_PROJECT: 'Add at least one page to the project.',
  INVALID_LAYOUT: 'Use PageLayout for the page layout.',
  INVALID_PLACEMENT: 'Move this node to a supported parent or area.',
  BROKEN_REFERENCE: 'Reference an existing page or node.',
  PARENT_CYCLE: 'Remove the cycle in the page hierarchy.',
  REFERENCE_CONTEXT: 'Validate the project bundle to check this page reference.',
  PATTERN_CONTRACT: 'Follow the formal pattern contract at this path.',
  SECTION_WIDTH: 'Set a content width for this top-level section.',
  SECTION_PADDING: 'Use nonzero, consistent padding on adjacent sections.',
  CARD_GRID: 'Place sibling cards in a Grid.',
  CARD_IMAGE_RATIO: 'Set a consistent aspect ratio on card images.',
  DUPLICATE_HEADER: 'Project navigation already supplies a top header.',
  PRIMARY_ACTIONS: 'Choose one primary action in this button container.',
  NESTED_INTERACTION: 'Keep interactive controls outside an interactive card.',
  INLINE_STYLE: 'Use A1 props and tokenized utilities for styling.',
  BOUND_VALUE: 'Check this value after its data binding resolves.',
};

/** Side-effect-free, transport-independent validation. Never repairs input,
 * invokes callbacks, resolves network resources or reads browser storage. */
// Editor-only context lets an individual draft resolve links against its project.
// MCP requests still validate a complete project bundle to supply that context.
export function validateJson({ kind, document, contractVersion } = {}, { pageIds: contextPageIds } = {}) {
  const errors = [], warnings = [];
  const add = (code, path, extra = {}, severity = 'error') => {
    const diagnostic = { code, path, message: messages[code], ...extra };
    const list = severity === 'error' ? errors : warnings;
    if (!list.some(d => d.code === code && d.path === path && d.ruleId === diagnostic.ruleId)) list.push(diagnostic);
  };
  const result = () => ({ valid: errors.length === 0, contractVersion: CONTRACT_VERSION, errors, warnings });
  if (!['page', 'project'].includes(kind)) { add('INVALID_KIND', '', { allowedValues: ['page', 'project'] }); return result(); }
  if (contractVersion !== undefined && contractVersion !== CONTRACT_VERSION) {
    add('UNSUPPORTED_VERSION', '', { allowedValues: [CONTRACT_VERSION] }); return result();
  }
  if (typeof document === 'string') {
    if (document.length > 2_000_000) { add('LIMIT_EXCEEDED', ''); return result(); }
    try { document = JSON.parse(document); } catch { add('INVALID_JSON', ''); return result(); }
  }
  if (!object(document)) { add('INVALID_DOCUMENT', ''); return result(); }
  // Bound public validation work and reject non-JSON/circular inputs from local
  // callers before invoking recursive schema/pattern validators.
  const queue = [[document, 0]], visited = new Set();
  let size = 0, count = 0;
  while (queue.length) {
    const [value, depth] = queue.pop();
    if (++count > 50_000 || depth > 80 || size > 2_000_000) { add('LIMIT_EXCEEDED', ''); return result(); }
    if (value && typeof value === 'object') {
      if (visited.has(value)) { add('INVALID_JSON', ''); return result(); }
      visited.add(value);
      for (const [key, child] of Object.entries(value)) { size += key.length; queue.push([child, depth + 1]); }
    } else if (typeof value === 'string') size += value.length;
    else if (!['boolean', 'number'].includes(typeof value) && value !== null || typeof value === 'number' && !Number.isFinite(value)) { add('INVALID_JSON', ''); return result(); }
  }

  function check(checker, value, base, prop = false) {
    if (checker(value)) return;
    for (const error of checker.errors ?? []) {
      // anyOf's branch details already identify the offending field.
      if (error.keyword === 'anyOf') continue;
      if (prop && !['required', 'additionalProperties'].includes(error.keyword)) {
        const current = (error.dataPath ?? '').split('/').slice(1).reduce((v, key) => v?.[key.replaceAll('~1', '/').replaceAll('~0', '~')], value);
        if (typeof current === 'string' && /\{\{[^{}]+\}\}/.test(current)) {
          add('BOUND_VALUE', `${base}${error.dataPath}`, {}, 'warning');
          continue;
        }
      }
      const suffix = error.params.missingProperty ?? error.params.additionalProperty;
      const path = `${base}${error.dataPath ?? ''}${suffix === undefined ? '' : `/${pointer(suffix)}`}`;
      const code = error.keyword === 'required' ? 'REQUIRED_FIELD' : error.keyword === 'additionalProperties' ? (prop ? 'UNKNOWN_PROP' : 'UNKNOWN_FIELD') : error.keyword === 'type' ? 'INVALID_TYPE' : 'INVALID_VALUE';
      add(code, path, { ...(error.params.allowedValues ? { allowedValues: error.params.allowedValues } : {}), ...(error.params.type ? { expectedType: error.params.type } : {}) });
    }
  }
  function props(type, values = {}, path, collections) {
    if (!object(values) || !contract.components[type]) return;
    if (!propChecks.has(type)) propChecks.set(type, compile(contract.components[type]));
    // Data-bound collections are populated by the renderer. Their required
    // array props need not appear literally in the source document.
    const supplied = { ...values };
    for (const key of Object.keys(collections ?? {})) if (!(key in supplied)) supplied[key] = [];
    check(propChecks.get(type), supplied, path, true);
    if (values.style || values.className) add('INLINE_STYLE', `${path}/${values.style ? 'style' : 'className'}`, {}, 'warning');
  }
  const pages = kind === 'project' && Array.isArray(document.pages) ? document.pages : [];
  const hasPageContext = kind === 'page' && Array.isArray(contextPageIds);
  const pageIds = new Set(hasPageContext ? contextPageIds : pages.map((p, i) => typeof p?.id === 'string' ? p.id : `#${i}`));
  function reference(href, path) {
    if (typeof href !== 'string' || !/^(\/)?\?/.test(href) || href.includes('{{')) return;
    const target = new URLSearchParams(href.slice(href.indexOf('?'))).get('page');
    if (target === null) return;
    if (kind === 'page' && !hasPageContext) add('REFERENCE_CONTEXT', path, {}, 'warning');
    else if (!pageIds.has(target)) add('BROKEN_REFERENCE', path, { allowedValues: [...pageIds] });
  }
  // Only link-bearing prop fields are inspected; arbitrary dataset rows, JS,
  // CSS and markup strings are never interpreted as page nodes or actions.
  function propLinks(value, path) {
    if (Array.isArray(value)) return value.forEach((child, i) => propLinks(child, `${path}/${i}`));
    if (!object(value)) return;
    if (value.href !== undefined) reference(value.href, `${path}/href`);
    for (const key of ['items', 'actions', 'menuActions', 'options', 'children']) if (value[key]) propLinks(value[key], `${path}/${key}`);
  }
  function validatePage(input, base) {
    if (typeof input === 'string') {
      try { input = JSON.parse(input); } catch { add('INVALID_JSON', base); return; }
      // Apply the same limits to encoded page definitions before decoding them
      // into the project validation traversal.
      const preflight = validateJson({ kind: 'page', document: input });
      const unsafe = preflight.errors.filter(d => ['LIMIT_EXCEEDED', 'INVALID_JSON'].includes(d.code));
      if (unsafe.length) { unsafe.forEach(d => add(d.code, base)); return; }
    }
    check(pageCheck, input, base);
    if (!object(input)) return;
    if (!contract.supportedVersions.includes(input.schemaVersion)) add('UNSUPPORTED_VERSION', `${base}/schemaVersion`, { allowedValues: contract.supportedVersions });
    const page = input.page;
    if (!object(page) || !object(page.layout) || !Array.isArray(page.layout.regions)) return;
    if (page.layout.type !== 'PageLayout') add('INVALID_LAYOUT', `${base}/page/layout/type`, { allowedValues: ['PageLayout'] });
    props('PageLayout', page.layout.props, `${base}/page/layout/props`);
    const ids = new Set(), regionIds = new Set(), domIds = new Set(), localRefs = [];
    const register = (id, path) => {
      if (typeof id !== 'string' || !id.trim()) add('EMPTY_ID', path);
      else if (ids.has(id)) add('DUPLICATE_ID', path);
      else ids.add(id);
    };
    if (typeof page.id !== 'string' || !page.id.trim()) add('EMPTY_ID', `${base}/page/id`);
    const interactive = new Set(['Button', 'IconButton', 'Link', 'TextField', 'SelectField', 'Switch', 'Menu', 'Tabs', 'CheckboxGroup', 'RadioGroup']);
    function nodes(list, path, parent, inCard = false, single = false) {
      if (!Array.isArray(list)) return;
      const cardCount = list.filter(n => n?.type === 'Card').length;
      if (parent === 'ButtonContainer' && list.filter(n => n?.type === 'Button' && (n.props?.variant ?? 'primary') === 'primary').length > 1) add('PRIMARY_ACTIONS', path, {}, 'warning');
      list.forEach((node, index) => {
        const np = single ? path : `${path}/${index}`;
        check(nodeCheck, node, np);
        if (!object(node)) return;
        register(node.id, `${np}/id`);
        if (!contract.componentTypes.includes(node.type)) { add('UNKNOWN_COMPONENT', `${np}/type`, { allowedValues: contract.componentTypes }); return; }
        props(node.type, node.props, `${np}/props`, node.collections);
        if (typeof node.props?.id === 'string') {
          if (domIds.has(node.props.id)) add('DUPLICATE_ID', `${np}/props/id`);
          domIds.add(node.props.id);
        }
        for (const key of ['labelledBy', 'describedBy']) if (typeof node.a11y?.[key] === 'string') localRefs.push([node.a11y[key], `${np}/a11y/${key}`]);
        propLinks(node.props, `${np}/props`);
        if (Array.isArray(node.content?.inlineLinks)) {
          let end = 0;
          node.content.inlineLinks.forEach((link, i) => {
            if (!object(link)) return;
            const lp = `${np}/content/inlineLinks/${i}`;
            if (!Number.isInteger(link.start) || !Number.isInteger(link.end) || link.start < end || link.end <= link.start || link.end > (node.content?.fallback?.length ?? 0)) add('INVALID_VALUE', lp);
            end = link.end;
            reference(link.props?.href, `${lp}/props/href`);
          });
        }
        for (const [event, action] of Object.entries(node.actions ?? {})) if (action?.type === 'navigate') reference(action.target, `${np}/actions/${pointer(event)}/target`);
        if (node.type === 'GridItem' && parent !== 'Grid') add('INVALID_PLACEMENT', np, { allowedValues: ['Grid'] });
        if (node.type === 'ListItem' && parent !== 'List') add('INVALID_PLACEMENT', np, { allowedValues: ['List'] });
        if (node.type === 'CustomBlock' && (node.content || node.children?.length)) add('INVALID_PLACEMENT', `${np}/${node.content ? 'content' : 'children'}`);
        if (['Icon', 'TextField', 'NumberField', 'SearchField', 'TextareaField', 'Outlet'].includes(node.type) && node.children?.length) add('INVALID_PLACEMENT', `${np}/children`);
        if (node.type === 'TopHeader' && kind === 'project') add('DUPLICATE_HEADER', np, {}, 'warning');
        if (node.type === 'Section' && parent === null) {
          if (!node.props?.contentWidth) add('SECTION_WIDTH', `${np}/props/contentWidth`, {}, 'warning');
          const padding = node.props?.padding;
          const previous = list[index - 1];
          if (!padding || padding === 'none' || previous?.type === 'Section' && JSON.stringify(previous.props?.padding) !== JSON.stringify(padding)) add('SECTION_PADDING', `${np}/props/padding`, {}, 'warning');
        }
        if (node.type === 'Card' && parent !== 'Grid' && cardCount > 1) add('CARD_GRID', np, {}, 'warning');
        if (node.type === 'Figure' && parent === 'Card' && !node.props?.aspectRatio) add('CARD_IMAGE_RATIO', `${np}/props/aspectRatio`, {}, 'warning');
        if (inCard && interactive.has(node.type)) add('NESTED_INTERACTION', np, {}, 'warning');
        nodes(node.children, `${np}/children`, node.type, inCard || node.type === 'Card' && (!!node.props?.href || node.props?.variant === 'navigation'));
        if (node.type === 'Tabs') for (const key of ['items', 'panels']) {
          if (Array.isArray(node.props?.[key])) node.props[key].forEach((item, i) => nodes(item?.children, `${np}/props/${key}/${i}/children`, 'Tabs'));
        }
        for (const collection of getPatternManifest(node.type)?.collections ?? []) {
          const key = collection.path.split('/').at(-1);
          if (Array.isArray(node.props?.[key])) node.props[key].forEach((item, i) => {
            for (const field of Object.keys(collection.patterns ?? {})) if (item?.[field]) {
              nodes([item[field]], `${np}/props/${key}/${i}/${pointer(field)}`, node.type, false, true);
            }
          });
        }
        if (node.type === 'Slot' && !getPatternManifest(parent)) {
          const allow = node.props?.allow;
          if (Array.isArray(allow) && allow.length && Array.isArray(node.children)) node.children.forEach((child, i) => {
            if (!allow.includes(child?.type)) add('INVALID_PLACEMENT', `${np}/children/${i}`, { allowedValues: allow });
          });
          if (typeof node.props?.max === 'number' && (node.children?.length ?? 0) > node.props.max) add('INVALID_PLACEMENT', `${np}/children`);
          if (typeof node.props?.min === 'number' && (node.children?.length ?? 0) < node.props.min) add('INVALID_PLACEMENT', `${np}/children`);
        }
      });
    }
    page.layout.regions.forEach((region, i) => {
      if (!object(region)) return;
      const regionPath = `${base}/page/layout/regions/${i}/id`;
      if (typeof region.id !== 'string' || !region.id.trim()) add('EMPTY_ID', regionPath);
      else if (regionIds.has(region.id)) add('DUPLICATE_ID', regionPath);
      regionIds.add(region.id);
      nodes(region.nodes, `${base}/page/layout/regions/${i}/nodes`, null);
    });
    for (const [ids, path] of localRefs) for (const id of ids.split(/\s+/)) if (!domIds.has(id)) add('BROKEN_REFERENCE', path, {}, 'warning');
    // Malformed structure is already diagnosed; avoid calling the older pattern
    // validator with values outside its structural assumptions.
    try {
      for (const diagnostic of validatePatterns(input).diagnostics) add('PATTERN_CONTRACT', `${base}${diagnostic.path}`, { ruleId: diagnostic.ruleId, detail: diagnostic.message, recovery: diagnostic.recovery }, diagnostic.severity);
    } catch { add('PATTERN_CONTRACT', base); }
  }
  if (kind === 'page') validatePage(document, '');
  else {
    check(projectCheck, document, '');
    if (!pages.length) add('EMPTY_PROJECT', '/pages');
    const seen = new Set();
    const parents = new Map();
    pages.forEach((page, i) => {
      if (!object(page)) return;
      const id = page.id ?? `#${i}`;
      if (seen.has(id)) add('DUPLICATE_ID', `/pages/${i}/id`);
      if (typeof id === 'string' && !id.trim()) add('EMPTY_ID', `/pages/${i}/id`);
      seen.add(id);
      parents.set(id, page.parentId);
      if (page.parentId && !pageIds.has(page.parentId)) add('BROKEN_REFERENCE', `/pages/${i}/parentId`, { allowedValues: [...pageIds] });
      if (page.definition != null) validatePage(page.definition, `/pages/${i}/definition`);
    });
    pages.forEach((page, i) => {
      let id = page?.id ?? `#${i}`;
      const chain = new Set();
      while (id != null && parents.has(id)) {
        if (chain.has(id)) { add('PARENT_CYCLE', `/pages/${i}/parentId`); break; }
        chain.add(id); id = parents.get(id);
      }
    });
  }
  return result();
}

/** Keep the full structured result available; format only at the UI boundary. */
export function formatJsonDiagnostics(diagnostics, t) {
  return diagnostics.map(d => `${d.path || '/'}: ${t ? t(`label.jsonValidation.${d.code}`, d.message) : d.message}${d.allowedValues ? ` (${d.allowedValues.map(v => JSON.stringify(v)).join(', ')})` : ''}`).join('\n');
}
