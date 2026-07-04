import * as React from "react";

export interface TokenSelectProps {
  /** Visible field label. */
  label?: string;
  /** Selected token/ramp value. */
  value?: string;
  onChange?: (value: string) => void;
  /** Ramp name → array of swatch colors shown in the picker. */
  rampColors?: Record<string, string[]>;
  /** Ramp name → display label override. */
  rampLabels?: Record<string, string>;
  /** Ramp to surface first in the picker. */
  suggestedRamp?: string;
  /** Field-family density. Default: "compact" */
  size?: "comfortable" | "default" | "compact";
  disabled?: boolean;
  id?: string;
  className?: string;
}

/** Design-token picker used by system tooling (theme editor, configurators). */
export declare function TokenSelect(props: TokenSelectProps): React.ReactElement;
