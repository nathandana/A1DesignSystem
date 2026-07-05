import * as React from "react";

/**
 * A1 label data in the system label format: nested categories under a `label`
 * root, each leaf carrying `$value` (English) plus optional `locale` / `brand`
 * override maps.
 */
export interface LabelsData {
  label?: Record<string, unknown>;
}

export interface LabelsProviderProps {
  /** Active locale code (e.g. "es"); resolved from each label's `locale` map. */
  locale?: string | null;
  /** Active brand key; resolved from each label's `brand` map. */
  brand?: string | null;
  /** Label data. When omitted, components fall back to their built-in English defaults. */
  labels?: LabelsData | null;
  children?: React.ReactNode;
}

/** Optional provider for localizing/overriding the built-in UI strings. */
export declare function LabelsProvider(props: LabelsProviderProps): React.ReactElement;

/**
 * Resolve a label by dotted path (e.g. "field.clearSearch").
 * Resolution order: locale override → brand override → `$value` → `defaultValue` → the key itself.
 */
export declare function useLabel(key: string, defaultValue?: string): string;
