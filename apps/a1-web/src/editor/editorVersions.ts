/** Version data model and diff computation for the multi-version editor. */

export interface EditorVersion {
  id: string;
  label: string;
  /** Serialized PageDefinition JSON — snapshot at the time this version was last active. */
  json: string;
}

export type DiffKind = 'changed' | 'added' | 'removed';

export interface PropChange {
  key: string;
  from: unknown;
  to: unknown;
}

export interface NodeDiff {
  nodeId: string;
  nodeType: string;
  kind: DiffKind;
  propChanges: PropChange[];
  contentChanged: boolean;
}

export function versionUid(): string {
  return `v${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
}

function flattenNodes(nodes: any[], out = new Map<string, any>()): Map<string, any> {
  for (const n of nodes) {
    out.set(n.id, n);
    if (n.children?.length) flattenNodes(n.children, out);
  }
  return out;
}

/** Compare two parsed PageDefinitions and return per-node differences. */
export function computeDiff(baseDef: any, currentDef: any): NodeDiff[] {
  const bMap = new Map<string, any>();
  const cMap = new Map<string, any>();
  for (const r of baseDef?.page?.layout?.regions ?? []) flattenNodes(r.nodes, bMap);
  for (const r of currentDef?.page?.layout?.regions ?? []) flattenNodes(r.nodes, cMap);

  const diffs: NodeDiff[] = [];

  for (const [id, cur] of cMap) {
    const base = bMap.get(id);
    if (!base) {
      diffs.push({ nodeId: id, nodeType: cur.type, kind: 'added', propChanges: [], contentChanged: false });
      continue;
    }
    const bp = base.props ?? {};
    const cp = cur.props ?? {};
    const propChanges: PropChange[] = [];
    for (const k of new Set([...Object.keys(bp), ...Object.keys(cp)])) {
      if (JSON.stringify(bp[k]) !== JSON.stringify(cp[k])) {
        propChanges.push({ key: k, from: bp[k], to: cp[k] });
      }
    }
    const contentChanged = JSON.stringify(base.content) !== JSON.stringify(cur.content);
    if (propChanges.length || contentChanged) {
      diffs.push({ nodeId: id, nodeType: cur.type, kind: 'changed', propChanges, contentChanged });
    }
  }

  for (const [id, base] of bMap) {
    if (!cMap.has(id)) {
      diffs.push({ nodeId: id, nodeType: base.type, kind: 'removed', propChanges: [], contentChanged: false });
    }
  }

  return diffs;
}
