/**
 * Pattern areas — the editable areas a first-class pattern declares (A1-2720).
 *
 * An area is a `Slot` child of the pattern node whose `props.area` names it.
 * A **zone** is an area with set rules: the pattern fixes what it accepts, how
 * many items it holds, (through `prop`) where those items render, and
 * optionally how they look (`itemProps`) and whether one may be primary. On a page
 * a zone can't be removed, moved, duplicated or reconfigured — only its items
 * change, and every way of adding into it (Add panel, drop, tree move, adding
 * beside an item) follows its rules. An open area (no `zone`) is a plain blank
 * area: any component, editable layout.
 *
 * The system manifest is the source for those rules; this module adapts it. The Add-panel catalog
 * and the Pattern library configurator build their Slot nodes from it, the
 * page renderer maps a zone's items into the pattern prop, and the editor
 * derives a zone's lock from the node itself (`props.zone`), so a page
 * definition written by hand or by an agent is governed the same way.
 */
import type { ComponentNode, ComponentProps, ComponentType } from './pageTypes';
import { patternManifests, createPatternArea, normalizePatternItems, ZONE_RULE_PROPS } from '../../../../packages/react/src/patterns/patternPolicies.js';

export type NodeLock = NonNullable<ComponentNode['lock']>;

export interface PatternZoneRules {
  /** Component types the zone accepts. */
  allow: ComponentType[];
  /** Most items the zone holds. */
  max?: number;
  /** The pattern prop the zone's items render into (instead of its children). */
  prop: string;
  /** The rule sentence shown on the canvas placeholder, in the Add panel and in the Configure panel. */
  rules: string;
  /** Props the zone fixes on its items, by type — e.g. every badge small and subtle. */
  itemProps?: Partial<Record<ComponentType, ComponentProps>>;
  policies?: Record<string, unknown>;
}

export interface PatternArea {
  /** The Slot node's `props.area`. */
  id: string;
  label: string;
  /** What the area is for — the library preview outline and documentation. */
  hint: string;
  /** Present on a zone: rules set by the pattern. */
  zone?: PatternZoneRules;
  /** Open-area layout; a zone lays its items out through the pattern prop. */
  columns?: number;
  gap?: string;
}

// Compatibility adapter: all authored data belongs to system/patterns/*.json.
export const PATTERN_AREAS: Record<string, PatternArea[]> = Object.fromEntries(
  patternManifests.map((manifest) => [manifest.type, manifest.areas.map((area) => ({
    id: area.id, label: area.label, hint: area.hint,
    ...(area.kind === 'zone' ? { zone: {
      allow: area.allow as ComponentType[], max: area.max, prop: area.destination,
      rules: area.rules, itemProps: area.policies?.fixedProps, policies: area.policies,
    } } : area.layout),
  }))]),
);

export { ZONE_RULE_PROPS };

export function getPatternAreas(type: string): PatternArea[] {
  return PATTERN_AREAS[type] ?? [];
}

export function getPatternArea(type: string, areaId: string | undefined): PatternArea | undefined {
  return areaId ? getPatternAreas(type).find((area) => area.id === areaId) : undefined;
}

/** A zone's items with the props it fixes applied (see `PatternZoneRules.itemProps`). */
export function applyZoneItemProps<T extends Pick<ComponentNode, 'type' | 'props'>>(type: string, areaId: string | undefined, items: T[]): T[] {
  return normalizePatternItems(type, areaId, items) as T[];
}

/** The pattern prop a zone's items render into; undefined for an open area or an unknown area. */
export function patternAreaProp(type: string, areaId: string | undefined): string | undefined {
  return getPatternArea(type, areaId)?.zone?.prop;
}

export interface PatternAreaSlot<T> {
  id?: string;
  type: 'Slot';
  props: ComponentProps;
  children?: T[];
}

/**
 * The Slot node for one of a pattern's areas — the canonical shape page
 * definitions carry. A zone's props name it (`area`, `zone: true`, `label`,
 * `rules`) and state its rules (`allow`, `max`); an open area carries its
 * label and layout.
 */
export function patternAreaSlot<T>(type: string, areaId: string, options: { id?: string; children?: T[] } = {}): PatternAreaSlot<T> {
  return createPatternArea(type, areaId, options) as PatternAreaSlot<T>;
}

type NodeLike = Pick<ComponentNode, 'type' | 'props'> & { lock?: ComponentNode['lock'] };

/** A Slot that is a pattern zone: part of its pattern, with rules set by the pattern. */
export function isPatternZone(node: NodeLike | null | undefined): boolean {
  return !!node && node.type === 'Slot' && node.props?.zone === true;
}

/** The lock a zone implies: it stays where it is and its rule props are read-only. */
export function zoneLock(node: NodeLike | null | undefined): NodeLock | undefined {
  return isPatternZone(node) ? { node: true, props: ZONE_RULE_PROPS } : undefined;
}

/** A node's authored lock, or the lock its zone status implies. */
export function effectiveLock(node: NodeLike | null | undefined): NodeLock | undefined {
  const formal = zoneLock(node);
  if (!formal) return node?.lock;
  return { ...node?.lock, node: true, props: [...new Set([...(node?.lock?.props ?? []), ...ZONE_RULE_PROPS])] };
}

export function zoneLabel(node: NodeLike | null | undefined): string {
  const label = node?.props?.label;
  return typeof label === 'string' && label ? label : 'Zone';
}
