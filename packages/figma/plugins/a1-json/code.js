// A1 Design System – Component JSON (proof of concept, A1-1651)
//
// Two-way bridge between A1 Figma components and the A1 page-definition JSON
// used by the a1-web editor (apps/a1-web/src/editor/pageTypes.ts):
//
//   Export — select an A1 component instance and emit it as a page-definition
//   ComponentNode. Import — paste page-definition JSON and render every
//   supported node as an instance of the matching Figma component.
//
// Button and Section are supported. Section is split in two on the Figma side
// (the Section set + a separate content-width carrier), so its exporter and
// importer translate contentWidth between the shapes. The exporters/importers
// are keyed by component-set name so further components can be added to the
// two registries at the bottom without touching the plumbing. Export runs
// automatically when the selection or the selected instance's configuration
// changes.
//
// Run via Plugins > Development > Import plugin from manifest.

// ─── A1 contract (packages/react/src/components/button/Button.d.ts) ─────────

const BUTTON_VARIANTS = ['primary', 'secondary', 'tertiary', 'destructive', 'success'];
const BUTTON_SIZES = ['sm', 'md', 'lg'];
// Figma-only inspection states that have no React prop (see
// packages/react/ai/figma-workflow.md, Button gap table).
const VISUAL_ONLY_STATES = ['hover', 'focus', 'pressed'];
// Known node id of the Button component set in the A1 Figma file; the name
// lookup below is the fallback for copies of the file.
const BUTTON_SET_ID = '123:701';

// Section (packages/react/src/components/section/Section.d.ts). In Figma the
// Section model is split in two: the Section component set carries the
// Surface/Padding variants, while contentWidth lives separately — either a
// nested content-width component instance or the ContentWidth variable
// collection's mode — so export/import translate between the two shapes.
const SECTION_SURFACES = ['page', 'panel', 'raised'];
const SECTION_PADDINGS = ['none', 'xs', 'sm', 'md', 'lg'];
const SECTION_WIDTHS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
const SECTION_GAPS = ['xs', 'sm', 'md', 'lg', 'xl'];
const NINE_POSITIONS = ['center', 'top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left', 'top-left'];
// TEXT documentation properties on the Figma Section component (see the
// Section table in figma-workflow.md) mapped to their React props. Values
// equal to the React default are omitted from the JSON.
const SECTION_TEXT_PROPS = {
  Gradient: { prop: 'gradient', allowed: ['accent', 'highlight', 'info', 'success', 'warn'] },
  GradientPosition: { prop: 'gradientPosition', allowed: NINE_POSITIONS, default: 'center' },
  Height: { prop: 'height', allowed: ['screen', 'hero'] },
  Align: { prop: 'align', allowed: ['left', 'center', 'right'] },
  BorderSize: { prop: 'borderSize', allowed: ['xs', 'sm', 'md', 'lg'] },
  BorderStyle: { prop: 'borderStyle', allowed: ['solid', 'dashed', 'dotted'], default: 'solid' },
  BorderVariant: { prop: 'borderVariant', allowed: ['subtle', 'strong', 'accent'], default: 'subtle' },
  Radius: { prop: 'radius', allowed: ['sm', 'md', 'lg', 'xl'], default: 'none' },
  BackgroundImage: { prop: 'backgroundImage' },
  BackgroundFit: { prop: 'backgroundFit', allowed: ['cover', 'contain', 'tile'], default: 'cover' },
  BackgroundPosition: { prop: 'backgroundPosition', allowed: NINE_POSITIONS, default: 'center' },
  BackgroundOverlay: { prop: 'backgroundOverlay', allowed: ['darken', 'lighten'] },
  BackgroundOverlayStrength: { prop: 'backgroundOverlayStrength', allowed: ['sm', 'md', 'lg'], default: 'md' },
};

// ─── Shared helpers ──────────────────────────────────────────────────────────

// Component property keys carry a "#nodeId" suffix for TEXT / BOOLEAN /
// INSTANCE_SWAP properties ("Label#12:3"); variant properties are plain.
function plainKey(key) {
  return key.split('#')[0];
}

function readProperties(instance) {
  const out = {};
  const props = instance.componentProperties || {};
  for (const key of Object.keys(props)) out[plainKey(key)] = props[key];
  return out;
}

// Resolve an INSTANCE_SWAP value (a component id) to a Material Symbols name.
// Icon components are named after the glyph; variants inside an icon set are
// named "Prop=value", so prefer the parent set's name in that case.
function iconNameFromSwapValue(value) {
  if (!value || typeof value !== 'string') return null;
  const node = figma.getNodeById(value);
  if (!node) return null;
  const name = node.name.includes('=') && node.parent && node.parent.type === 'COMPONENT_SET'
    ? node.parent.name
    : node.name;
  return name.split('/').pop().trim() || null;
}

function findIconComponent(iconName) {
  const match = figma.root.findOne((node) =>
    (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') &&
    (node.name === iconName || node.name.split('/').pop().trim() === iconName));
  if (!match) return null;
  return match.type === 'COMPONENT_SET' ? match.defaultVariant : match;
}

// setProperties on a TEXT property re-renders the label, which requires the
// label's font to be loaded first.
async function loadInstanceFonts(instance) {
  const texts = instance.findAll((node) => node.type === 'TEXT');
  await Promise.all(texts
    .filter((text) => text.fontName !== figma.mixed)
    .map((text) => figma.loadFontAsync(text.fontName)));
}

function postError(message) {
  figma.ui.postMessage({ type: 'error', message });
}

// The component-set name (or bare component name) an instance belongs to, if
// it has a registered exporter.
function registeredSetName(instanceNode) {
  const main = instanceNode.mainComponent;
  const set = main && main.parent && main.parent.type === 'COMPONENT_SET' ? main.parent : null;
  const name = set ? set.name : main ? main.name : '';
  return EXPORTERS[name] ? name : null;
}

// ── Variable-collection helpers (ContentWidth / Gap / Color modes) ──────────

function localCollection(name) {
  return figma.variables.getLocalVariableCollections().find((collection) => collection.name === name) || null;
}

function collectionModeName(collection, modeId) {
  const mode = collection.modes.find((entry) => entry.modeId === modeId);
  return mode ? mode.name : null;
}

// The explicitly applied mode of a named collection on the node or any frame /
// instance inside it (the ContentWidth mode may sit on the Section instance or
// on the inner _content frame). Returns null when the mode is only inherited.
function explicitCollectionMode(root, collectionName) {
  const collection = localCollection(collectionName);
  if (!collection) return null;
  const nodes = [root].concat(root.findAll((n) => n.type === 'FRAME' || n.type === 'INSTANCE'));
  for (const node of nodes) {
    const modes = node.explicitVariableModes || {};
    if (modes[collection.id]) return collectionModeName(collection, modes[collection.id]);
  }
  return null;
}

function applyCollectionMode(target, collectionName, wantedModeName) {
  const collection = localCollection(collectionName);
  if (!collection) return false;
  const mode = collection.modes.find((entry) => entry.name === wantedModeName);
  if (!mode) return false;
  try {
    target.setExplicitVariableModeForCollection(collection, mode.modeId);
    return true;
  } catch (error) {
    return false;
  }
}

// ── Section property carriers (the split Section model) ─────────────────────
// The Figma Section is split across components: the outer Section set plus
// internal part instances such as "Section Content", which carries the
// contentWidth (and possibly padding) properties. Rather than guessing names,
// property lookups scan the section instance and every internal part instance
// (anything that isn't a registered component like Button), matching property
// keys case- and spacing-insensitively.

function canonicalKey(key) {
  return plainKey(key).replace(/[\s_-]+/g, '').toLowerCase();
}

function sectionPropertyCarriers(root) {
  const carriers = [root];
  for (const instanceNode of root.findAll((n) => n.type === 'INSTANCE')) {
    if (!registeredSetName(instanceNode)) carriers.push(instanceNode);
  }
  return carriers;
}

// Find a component property by canonical name across the carriers. Returns
// { node, key, property } with the original key, usable with setProperties.
function findSectionProperty(carriers, names, type) {
  for (const node of carriers) {
    const raw = node.componentProperties || {};
    for (const key of Object.keys(raw)) {
      if (!names.includes(canonicalKey(key))) continue;
      if (type && raw[key].type !== type) continue;
      return { node, key, property: raw[key] };
    }
  }
  return null;
}

// Set a variant property wherever it lives (outer set or an internal part —
// nested instance properties are settable as overrides).
function assignSectionVariant(carriers, names, value) {
  const found = findSectionProperty(carriers, names, 'VARIANT');
  if (!found) return false;
  try {
    found.node.setProperties({ [found.key]: value });
    return true;
  } catch (error) {
    return false;
  }
}

// ─── Export: Figma instance → page-definition node ──────────────────────────

function exportButton(instance) {
  const properties = readProperties(instance);
  const warnings = [];
  const props = {};

  const variant = properties.Variant && properties.Variant.value;
  const size = properties.Size && properties.Size.value;
  const state = properties.State && properties.State.value;
  const iconPosition = properties.IconPosition && properties.IconPosition.value;
  const showIcon = properties['Show icon'] &&
    (properties['Show icon'].value === true || properties['Show icon'].value === 'true');

  // Defaults (variant=primary, size=md, iconPosition=start) are omitted, the
  // same convention the a1-web configurator snippets use.
  if (BUTTON_VARIANTS.includes(variant) && variant !== 'primary') props.variant = variant;
  if (BUTTON_SIZES.includes(size) && size !== 'md') props.size = size;
  if (state === 'disabled') props.disabled = true;
  if (state === 'loading') props.loading = true;
  if (VISUAL_ONLY_STATES.includes(state)) {
    warnings.push(`State=${state} is a visual-only Figma state — no prop was emitted.`);
  }
  if (showIcon) {
    const iconName = iconNameFromSwapValue(properties.Icon && properties.Icon.value);
    if (iconName) {
      props.icon = iconName;
      if (iconPosition === 'end') props.iconPosition = 'end';
      warnings.push(`Icon name "${iconName}" was read from the swapped component's name — confirm it is a Material Symbols name.`);
    } else {
      warnings.push('The icon instance could not be resolved to a component name — icon omitted.');
    }
  }

  const label = properties.Label && typeof properties.Label.value === 'string'
    ? properties.Label.value
    : 'Button';

  const node = {
    id: 'button-' + instance.id.replace(/[^a-zA-Z0-9]+/g, '-'),
    type: 'Button',
    content: { fallback: label },
  };
  if (Object.keys(props).length > 0) node.props = props;
  return { node, warnings };
}

// Export every registered descendant instance (e.g. Buttons inside a Section)
// as child nodes, skipping instances nested inside an already-exported one.
function exportRegisteredDescendants(root, warnings) {
  const exported = [];
  const covered = new Set();
  for (const instanceNode of root.findAll((n) => n.type === 'INSTANCE')) {
    const name = registeredSetName(instanceNode);
    if (!name) continue;
    let insideExported = false;
    for (let parent = instanceNode.parent; parent; parent = parent.parent) {
      if (covered.has(parent.id)) { insideExported = true; break; }
    }
    if (insideExported) continue;
    const result = EXPORTERS[name](instanceNode);
    exported.push(result.node);
    for (const warning of result.warnings) warnings.push(warning);
    covered.add(instanceNode.id);
  }
  return exported;
}

function exportSection(instance) {
  const warnings = [];
  const props = {};
  const carriers = sectionPropertyCarriers(instance);

  const surface = findSectionProperty(carriers, ['surface'], 'VARIANT');
  if (surface && SECTION_SURFACES.includes(surface.property.value)) {
    props.surface = surface.property.value;
  } else if (!surface) {
    warnings.push('No Surface property found on the Section or its parts — surface omitted.');
  }

  const padding = findSectionProperty(carriers, ['padding'], 'VARIANT');
  if (padding && SECTION_PADDINGS.includes(padding.property.value)) {
    // md is the React default and is omitted from the JSON.
    if (padding.property.value !== 'md') props.padding = padding.property.value;
  } else {
    warnings.push('No Padding property found on the Section or its parts — padding omitted.');
  }

  // contentWidth translation — the split half of the Figma Section model:
  // prefer a width variant on the Section or an internal part (e.g. the
  // "Section Content" component), then fall back to an explicit ContentWidth
  // variable mode on the instance or its inner frames.
  const width = findSectionProperty(carriers, ['contentwidth', 'width'], 'VARIANT');
  const modeWidth = explicitCollectionMode(instance, 'ContentWidth');
  if (width && SECTION_WIDTHS.includes(width.property.value)) {
    props.contentWidth = width.property.value;
  } else if (SECTION_WIDTHS.includes(modeWidth)) {
    props.contentWidth = modeWidth;
  } else {
    warnings.push('No content-width property or explicit ContentWidth mode found — contentWidth omitted.');
  }

  const gapVariant = findSectionProperty(carriers, ['gap'], 'VARIANT');
  const gapMode = explicitCollectionMode(instance, 'Gap');
  if (gapVariant && SECTION_GAPS.includes(gapVariant.property.value)) props.gap = gapVariant.property.value;
  else if (SECTION_GAPS.includes(gapMode)) props.gap = gapMode;

  // Inverse is a Color collection mode in Figma, never a variant property.
  const colorMode = explicitCollectionMode(instance, 'Color');
  if (colorMode === 'Dark' || colorMode === 'Inverse') {
    props.inverse = true;
    warnings.push(`inverse: true was derived from the explicit "${colorMode}" Color mode on the section.`);
  }

  // TEXT documentation properties (Gradient, Align, borders, background…).
  for (const key of Object.keys(SECTION_TEXT_PROPS)) {
    const def = SECTION_TEXT_PROPS[key];
    const found = findSectionProperty(carriers, [canonicalKey(key)], 'TEXT');
    const raw = found && typeof found.property.value === 'string' ? found.property.value.trim() : '';
    if (!raw || raw === def.default) continue;
    if (def.allowed && !def.allowed.includes(raw)) {
      warnings.push(`${key}="${raw}" is not a valid value — ignored.`);
      continue;
    }
    props[def.prop] = raw;
  }
  const sidesFound = findSectionProperty(carriers, ['bordersides'], 'TEXT');
  const sidesRaw = sidesFound && typeof sidesFound.property.value === 'string' ? sidesFound.property.value.trim() : '';
  if (sidesRaw && sidesRaw !== 'all') {
    let sides;
    try {
      sides = JSON.parse(sidesRaw);
    } catch (error) {
      sides = sidesRaw.split(/[\s,]+/);
    }
    if (Array.isArray(sides)) {
      sides = sides.filter((side) => ['top', 'right', 'bottom', 'left'].includes(side));
      if (sides.length > 0 && sides.length < 4) props.borderSides = sides;
    }
  }

  const children = exportRegisteredDescendants(instance, warnings);
  const node = {
    id: 'section-' + instance.id.replace(/[^a-zA-Z0-9]+/g, '-'),
    type: 'Section',
  };
  if (Object.keys(props).length > 0) node.props = props;
  if (children.length > 0) node.children = children;
  return { node, warnings };
}

function runExport(auto) {
  const selection = figma.currentPage.selection;
  if (selection.length !== 1) {
    if (!auto) postError('Select a single component instance to export.');
    return;
  }
  const target = selection[0];
  if (target.type !== 'INSTANCE') {
    if (!auto) postError(`The selected layer ("${target.name}") is not a component instance.`);
    return;
  }
  const componentName = registeredSetName(target);
  if (!componentName) {
    if (!auto) postError('The selected component is not supported yet — Button and Section only for now.');
    return;
  }
  const { node, warnings } = EXPORTERS[componentName](target);
  figma.ui.postMessage({
    type: 'export-result',
    auto: Boolean(auto),
    componentName,
    json: JSON.stringify(node, null, 2),
    warnings,
  });
}

// ─── Import: page-definition JSON → Figma instances ─────────────────────────

// Accept a single node, an array of nodes, or a full page definition / project
// bundle — any supported node found anywhere in the structure is rendered.
// Recursion stops at a supported node: its importer owns the node's subtree
// (e.g. a Section renders its own child Buttons), so unsupported wrappers
// (Stack, Grid, …) are walked through while supported nodes are not doubled.
function collectSupportedNodes(value, found) {
  if (Array.isArray(value)) {
    for (const item of value) collectSupportedNodes(item, found);
    return;
  }
  if (!value || typeof value !== 'object') return;
  if (typeof value.type === 'string' && IMPORTERS[value.type]) {
    found.push(value);
    return;
  }
  for (const key of ['children', 'nodes', 'regions', 'layout', 'page', 'pages', 'definition']) {
    if (value[key]) collectSupportedNodes(value[key], found);
  }
}

function findButtonSet() {
  const byId = figma.getNodeById(BUTTON_SET_ID);
  if (byId && byId.type === 'COMPONENT_SET' && byId.name === 'Button') return byId;
  return figma.root.findOne((node) => node.type === 'COMPONENT_SET' && node.name === 'Button');
}

// Apply a Button node's props to an existing Button instance (used both when
// rendering a new instance and when updating the current selection).
async function applyButton(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const raw = instance.componentProperties || {};
  const keyFor = (prefix) => Object.keys(raw).find((key) => plainKey(key) === prefix);
  const assignments = {};

  const variantKey = keyFor('Variant');
  if (variantKey) assignments[variantKey] = BUTTON_VARIANTS.includes(props.variant) ? props.variant : 'primary';
  const sizeKey = keyFor('Size');
  if (sizeKey) assignments[sizeKey] = BUTTON_SIZES.includes(props.size) ? props.size : 'md';
  const stateKey = keyFor('State');
  if (stateKey) assignments[stateKey] = props.disabled === true ? 'disabled' : props.loading === true ? 'loading' : 'default';
  const positionKey = keyFor('IconPosition');
  if (positionKey) assignments[positionKey] = props.iconPosition === 'end' ? 'end' : 'start';

  const labelKey = keyFor('Label');
  if (labelKey && node.content && typeof node.content.fallback === 'string') {
    assignments[labelKey] = node.content.fallback;
  }
  const showIconKey = keyFor('Show icon');
  if (showIconKey) assignments[showIconKey] = typeof props.icon === 'string' && props.icon.length > 0;
  const iconKey = keyFor('Icon');
  if (iconKey && typeof props.icon === 'string' && props.icon.length > 0) {
    const iconComponent = findIconComponent(props.icon);
    if (iconComponent) assignments[iconKey] = iconComponent.id;
    else warnings.push(`No icon component named "${props.icon}" exists in this file — the default glyph is shown.`);
  }
  if (Object.keys(assignments).length > 0) instance.setProperties(assignments);

  for (const runtimeProp of ['fullWidth', 'href', 'as']) {
    if (props[runtimeProp] !== undefined) {
      warnings.push(`"${runtimeProp}" is a runtime prop with no Figma representation — ignored.`);
    }
  }
}

async function importButton(node, warnings) {
  const set = findButtonSet();
  if (!set) throw new Error('No "Button" component set was found in this file.');
  const instance = set.defaultVariant.createInstance();
  await applyButton(instance, node, warnings);
  return instance;
}

// Apply a Section node's props to an existing Section instance (used both when
// rendering a new instance and when updating the current selection).
async function applySection(sectionInstance, node, warnings) {
  const props = node.props || {};
  for (const responsiveProp of ['padding', 'align']) {
    if (props[responsiveProp] && typeof props[responsiveProp] === 'object') {
      warnings.push(`"${responsiveProp}" responsive object has no Figma representation — the default was used.`);
    }
  }
  await loadInstanceFonts(sectionInstance);

  // Properties are applied wherever they live — on the Section set itself or
  // on an internal part instance such as "Section Content" (the split model).
  const carriers = sectionPropertyCarriers(sectionInstance);

  if (SECTION_SURFACES.includes(props.surface) && !assignSectionVariant(carriers, ['surface'], props.surface)) {
    warnings.push(`surface="${props.surface}" could not be applied — no Surface property found.`);
  }
  if (SECTION_PADDINGS.includes(props.padding) && !assignSectionVariant(carriers, ['padding'], props.padding)) {
    warnings.push(`padding="${props.padding}" could not be applied — no Padding property found.`);
  }
  // contentWidth — the split half of the Figma Section model: a width variant
  // on the Section or a part, then the ContentWidth variable mode as fallback.
  if (SECTION_WIDTHS.includes(props.contentWidth)) {
    const applied = assignSectionVariant(carriers, ['contentwidth', 'width'], props.contentWidth)
      || applyCollectionMode(sectionInstance, 'ContentWidth', props.contentWidth);
    if (!applied) warnings.push(`contentWidth="${props.contentWidth}" could not be applied — no content-width property or ContentWidth variable mode matched.`);
  }
  if (SECTION_GAPS.includes(props.gap)) {
    const applied = assignSectionVariant(carriers, ['gap'], props.gap)
      || applyCollectionMode(sectionInstance, 'Gap', props.gap);
    if (!applied) warnings.push(`gap="${props.gap}" could not be applied — no Gap property or variable mode matched.`);
  }
  if (props.inverse === true) {
    const applied = applyCollectionMode(sectionInstance, 'Color', 'Inverse') || applyCollectionMode(sectionInstance, 'Color', 'Dark');
    if (!applied) warnings.push('inverse could not be applied — the Color collection has no Inverse/Dark mode.');
  }

  // TEXT documentation properties, wherever the components expose them.
  for (const key of Object.keys(SECTION_TEXT_PROPS)) {
    const def = SECTION_TEXT_PROPS[key];
    const value = props[def.prop];
    if (typeof value !== 'string' || !value) continue;
    const found = findSectionProperty(carriers, [canonicalKey(key)], 'TEXT');
    if (!found) continue;
    try {
      found.node.setProperties({ [found.key]: value });
    } catch (error) {
      warnings.push(`${def.prop} could not be applied: ${error.message}`);
    }
  }
  if (Array.isArray(props.borderSides)) {
    const found = findSectionProperty(carriers, ['bordersides'], 'TEXT');
    if (found) {
      try {
        found.node.setProperties({ [found.key]: JSON.stringify(props.borderSides) });
      } catch (error) {
        warnings.push(`borderSides could not be applied: ${error.message}`);
      }
    }
  }
}

async function importSection(node, warnings) {
  const set = figma.root.findOne((n) => n.type === 'COMPONENT_SET' && n.name === 'Section');
  if (!set) throw new Error('No "Section" component set was found in this file.');
  const sectionInstance = set.defaultVariant.createInstance();
  await applySection(sectionInstance, node, warnings);

  // Child nodes: a Figma instance cannot receive new children, so a Section
  // with children is detached into a frame and the children are rendered into
  // its _content slot. Unsupported wrappers (Stack, Grid, …) are flattened.
  const childNodes = [];
  collectSupportedNodes(node.children || [], childNodes);
  if (childNodes.length > 0) {
    if ((node.children || []).some((child) => child && typeof child === 'object' && child.type && !IMPORTERS[child.type])) {
      warnings.push('Unsupported child types were flattened — only supported components were rendered inside the Section.');
    }
    const detached = sectionInstance.detachInstance();
    warnings.push('The Section was detached from its component so child nodes could be placed inside it.');
    const slot = detached.findOne((n) => n.type === 'FRAME' && n.name === '_content') || detached;
    for (const child of childNodes) {
      const childInstance = await IMPORTERS[child.type](child, warnings);
      slot.appendChild(childInstance);
    }
    return detached;
  }
  return sectionInstance;
}

async function handleImport(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    return postError('Not valid JSON: ' + error.message);
  }
  const nodes = [];
  collectSupportedNodes(data, nodes);
  if (nodes.length === 0) {
    return postError('No supported component nodes found — this proof of concept renders Button and Section nodes only.');
  }

  const warnings = [];
  const instances = [];
  let x = Math.round(figma.viewport.center.x);
  const y = Math.round(figma.viewport.center.y);
  for (const node of nodes) {
    const instance = await IMPORTERS[node.type](node, warnings);
    instance.x = x;
    instance.y = y;
    x += Math.round(instance.width) + 24; // gap/lg between rendered instances
    figma.currentPage.appendChild(instance);
    instances.push(instance);
  }
  figma.currentPage.selection = instances;
  figma.viewport.scrollAndZoomIntoView(instances);
  figma.notify(`Rendered ${instances.length} component ${instances.length === 1 ? 'instance' : 'instances'} from JSON.`);
  figma.ui.postMessage({ type: 'import-result', count: instances.length, warnings });
}

// ─── Registries ──────────────────────────────────────────────────────────────

const EXPORTERS = { Button: exportButton, Section: exportSection };
const IMPORTERS = { Button: importButton, Section: importSection };
// Appliers update an EXISTING instance in place (the "Update selection" action)
// — the same functions the importers use after creating a fresh instance.
const APPLIERS = { Button: applyButton, Section: applySection };

// ── Update: apply pasted JSON to the currently selected instance ────────────

async function handleUpdate(text) {
  const selection = figma.currentPage.selection;
  if (selection.length !== 1 || selection[0].type !== 'INSTANCE') {
    return postError('Select a single component instance to update.');
  }
  const target = selection[0];
  const componentName = registeredSetName(target);
  if (!componentName) {
    return postError('The selected component is not supported yet — Button and Section only for now.');
  }
  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    return postError('Not valid JSON: ' + error.message);
  }
  const nodes = [];
  collectSupportedNodes(data, nodes);
  const node = nodes.find((entry) => entry.type === componentName);
  if (!node) {
    return postError(`The JSON has no "${componentName}" node to apply to the selected ${componentName}.`);
  }
  const warnings = [];
  await APPLIERS[componentName](target, node, warnings);
  if (Array.isArray(node.children) && node.children.length > 0) {
    warnings.push('Child nodes were not applied — updating a selected instance changes its properties only.');
  }
  figma.notify(`Updated the selected ${componentName} from JSON.`);
  figma.ui.postMessage({ type: 'update-result', componentName, warnings });
}

// ─── Wiring ──────────────────────────────────────────────────────────────────

figma.showUI(__html__, { width: 420, height: 560 });

function postSelectionState() {
  const selection = figma.currentPage.selection;
  const target = selection.length === 1 ? selection[0] : null;
  const main = target && target.type === 'INSTANCE' ? target.mainComponent : null;
  const set = main && main.parent && main.parent.type === 'COMPONENT_SET' ? main.parent : null;
  const componentName = set ? set.name : main ? main.name : null;
  figma.ui.postMessage({
    type: 'selection',
    exportable: Boolean(componentName && EXPORTERS[componentName]),
    componentName,
  });
}

// Auto-export: the JSON regenerates on its own when the selection changes or
// when the selected instance's configuration changes (variant swap, property
// edit, nested content) — no need to click Export selection. Debounced because
// document changes arrive in bursts while dragging/typing in Figma's UI. The
// UI side keeps hand-edited JSON safe: an auto export never overwrites a
// textarea the user has typed into (manual Export selection does).
let autoExportTimer = null;
function scheduleAutoExport() {
  if (autoExportTimer) clearTimeout(autoExportTimer);
  autoExportTimer = setTimeout(() => {
    autoExportTimer = null;
    runExport(true);
  }, 250);
}

figma.on('selectionchange', () => {
  postSelectionState();
  scheduleAutoExport();
});

figma.on('documentchange', (event) => {
  const selection = figma.currentPage.selection;
  if (selection.length !== 1 || selection[0].type !== 'INSTANCE') return;
  const target = selection[0];
  const relevant = event.documentChanges.some((change) => {
    if (!change.id) return false;
    if (change.id === target.id) return true;
    const changed = figma.getNodeById(change.id);
    for (let parent = changed && changed.parent; parent; parent = parent.parent) {
      if (parent.id === target.id) return true;
    }
    return false;
  });
  if (relevant) scheduleAutoExport();
});

postSelectionState();
scheduleAutoExport();

figma.ui.onmessage = async (message) => {
  try {
    if (message.type === 'export') runExport(false);
    if (message.type === 'import') await handleImport(message.text);
    if (message.type === 'update') await handleUpdate(message.text);
  } catch (error) {
    postError(error.message);
  }
};
