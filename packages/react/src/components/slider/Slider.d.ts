import * as React from "react";

/**
 * A detent (snap stop): a bare value, or a value with an optional display `label`
 * and/or `icon` (a Material Symbols name shown in the label row instead of text).
 * Provide a `label` alongside an `icon` to give screen readers a text alternative.
 */
export type SliderDetent = number | { value: number; label?: React.ReactNode; icon?: string };

export interface SliderProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "onChange" | "min" | "max" | "step"
  > {
  /** Controlled value (in the value domain — a detent value when `detents` is set). */
  value?: number;
  /** Uncontrolled initial value. Defaults to the first detent, or `min`. */
  defaultValue?: number;
  /** Called with the new value on every change. */
  onChange?: (value: number) => void;
  /** Minimum (continuous mode). Default: 0 */
  min?: number;
  /** Maximum (continuous mode). Default: 100 */
  max?: number;
  /** Step granularity (continuous mode). Default: 1 */
  step?: number;
  /**
   * Optional snap stops. Pass numbers, or `{ value, label }` to show labels under
   * the track (e.g. `[{value:0,label:'None'},{value:1,label:'XS'},…]`). The thumb
   * snaps between detents and the keyboard moves one detent at a time.
   */
  detents?: SliderDetent[];
  /**
   * Visible field label rendered above the control and associated with it (also
   * the accessible name). Sized to match the field family per `size`. Use
   * `aria-label` / `aria-labelledby` instead for an invisible name.
   */
  label?: React.ReactNode;
  /**
   * Density, matching the field family. Default: "default". Scales the label,
   * detent labels, track, and thumb so a Slider sits naturally beside fields.
   */
  size?: "compact" | "default" | "comfortable";
  /**
   * Selection colour. "default" uses the action colour; "subtle" uses neutrals
   * for the fill, thumb, and active detent. Default: "default"
   */
  variant?: "default" | "subtle";
  /** Show the floating value bubble while dragging/focused. Default: true */
  showValue?: boolean;
  /** Preferred bubble side; it flips to stay in the viewport. Default: "above" */
  valuePosition?: "above" | "below";
  /** Format the bubble + `aria-valuetext`. Defaults to the detent label or the number. */
  formatValue?: (value: number) => React.ReactNode;
  /**
   * An alternate label shown in the value bubble (visual only — `aria-valuetext`
   * is unchanged). A node is used as-is; a function receives the current value
   * and the active detent. When omitted, the bubble keeps its current content
   * (the formatted value, detent label/icon, or the raw value). Useful for a
   * longer spoken-out size name (e.g. "Small") while the detent stays "SM".
   */
  bubbleLabel?: React.ReactNode | ((value: number, detent: { value: number; label?: React.ReactNode; icon?: string } | null) => React.ReactNode);
  /** Disable the slider. Default: false */
  disabled?: boolean;
  /** Form field name. */
  name?: string;
  id?: string;
  className?: string;
}

export declare function Slider(props: SliderProps): React.ReactElement;
