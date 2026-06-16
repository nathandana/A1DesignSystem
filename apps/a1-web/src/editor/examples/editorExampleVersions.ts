/**
 * Built-in versions for the component showcase example page.
 * Each version is a full PageDefinition snapshot derived from the base
 * by patching specific node props or content so the diff panel shows
 * meaningful differences out of the box.
 */
import { editorExamplePage } from './editorExamplePage';
import { type EditorVersion, versionUid } from '../editorVersions';

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

function patchProps(nodes: any[], id: string, patch: Record<string, unknown>): boolean {
  for (const n of nodes) {
    if (n.id === id) { n.props = { ...n.props, ...patch }; return true; }
    if (n.children?.length && patchProps(n.children, id, patch)) return true;
  }
  return false;
}

function patchContent(nodes: any[], id: string, fallback: string): boolean {
  for (const n of nodes) {
    if (n.id === id) { n.content = { ...(n.content ?? {}), fallback }; return true; }
    if (n.children?.length && patchContent(n.children, id, fallback)) return true;
  }
  return false;
}

function applyPatches(base: typeof editorExamplePage, changes: Array<{
  id: string;
  props?: Record<string, unknown>;
  content?: string;
}>) {
  const def = deepClone(base);
  for (const { id, props, content } of changes) {
    for (const region of def.page.layout.regions) {
      if (props) patchProps(region.nodes, id, props);
      if (content !== undefined) patchContent(region.nodes, id, content);
    }
  }
  return JSON.stringify(def, null, 2);
}

const BASE_JSON = JSON.stringify(editorExamplePage, null, 2);

/** Three showcase versions demonstrating the multi-version diff feature. */
export const SHOWCASE_VERSIONS: EditorVersion[] = [
  {
    id: 'v-base',
    label: 'Base',
    json: BASE_JSON,
  },
  {
    id: 'v-dark-hero',
    label: 'Dark hero',
    json: applyPatches(editorExamplePage, [
      { id: 'hero',    props:   { surface: 'inverse', gradient: 'vivid', gradientPosition: 'top-left' } },
      { id: 'hero-h1', content: 'A1 design system' },
      { id: 'hero-p',  props: { size: 'lg', color: 'muted' }, content: 'Vivid inverse hero — dark surface, full-bleed gradient, alternate copy.' },
    ]),
  },
  {
    id: 'v-compact',
    label: 'Compact',
    json: applyPatches(editorExamplePage, [
      { id: 'hero',       props: { padding: 'sm', gap: 'xs' } },
      { id: 'hero-h1',    props: { as: 'h1', size: 'lg' } },
      { id: 'hero-p',     props: { size: 'md', color: 'muted' } },
      { id: 'typography-section', props: { padding: 'sm', gap: 'sm' } },
    ]),
  },
];
