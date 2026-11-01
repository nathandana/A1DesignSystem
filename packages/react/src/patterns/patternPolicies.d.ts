export interface PatternNode {
  id?: string;
  type: string;
  patternVersion?: string;
  props?: Record<string, unknown>;
  children?: PatternNode[];
  [key: string]: unknown;
}
export interface PatternAreaContract {
  id: string;
  label: string;
  hint: string;
  kind: 'open' | 'zone';
  destination: string;
  placement: string;
  allow?: string[];
  max?: number;
  count?: 'direct-items';
  ruleId?: string;
  rules?: string;
  layout?: Record<string, unknown>;
  policies?: Record<string, unknown>;
}
export interface PatternManifest {
  schemaVersion: string;
  id: string;
  type: string;
  name: string;
  description: string;
  version: string;
  kind: 'pattern';
  status: 'experimental' | 'stable' | 'deprecated';
  coverage: Record<string, boolean>;
  propsSchema: Record<string, any>;
  lockedProps: Record<string, unknown>;
  areas: PatternAreaContract[];
  collections?: { id: string; label: string; path: string; patterns?: Record<string, string>; ruleId: string; rules: string; policies: { activation: "optional-verification" | "selection"; children?: "children"; uniqueBy: "id"; navigation: "safe-target"; disabled: "block-activation" } }[];
  rules: { id: string; severity: 'error' | 'warning' }[];
  starter: { props: Record<string, unknown> };
  examples: { id: string; props?: Record<string, unknown>; areas?: Record<string, PatternNode[]> }[];
  migrations: { from: string; to: string; operations: Record<string, string>[] }[];
  compatibility: { unversioned: string; pageSchemaVersions: string[] };
}
export declare const patternManifests: PatternManifest[];
export declare const ZONE_RULE_PROPS: string[];
export declare function getPatternManifest(type: string): PatternManifest | undefined;
export declare function getPatternAreaContract(type: string, id?: string): PatternAreaContract | undefined;
export declare function supportsPatternVersion(node: Pick<PatternNode, 'type' | 'patternVersion'>): boolean;
export declare function createPatternArea(type: string, id: string, options?: { id?: string; children?: unknown[] }): PatternNode;
export declare function createPatternNode(type: string, options?: { id?: string; props?: Record<string, unknown>; areas?: Record<string, PatternNode[]> }): PatternNode;
export declare function normalizePatternItems<T>(type: string, areaId: string | undefined, items: T[]): T[];
export declare function canonicalizePatternTree<T>(value: T): T;

export declare function patternTreeEntries(value: Record<string, any>): [string, any][];
