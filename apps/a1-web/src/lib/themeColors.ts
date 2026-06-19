/**
 * OKLCH colour-ramp generation for the theme editor. From a single -500 hex per
 * ramp we generate the full 12-stop scale in perceptual OKLCH so lightness steps
 * stay even. Ported from the standalone theme-editor example.
 */
import { oklch, formatHex, clampChroma } from 'culori';

export const RAMP_STOPS = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000] as const;

export const RAMP_NAMES = ['neutral', 'accent', 'info', 'error', 'warn', 'success'] as const;
export type RampName = (typeof RAMP_NAMES)[number];

export const RAMP_LABELS: Record<RampName, string> = {
  neutral: 'Neutral',
  accent: 'Accent',
  info: 'Info',
  error: 'Error',
  warn: 'Warning',
  success: 'Success',
};

export const DEFAULT_RAMPS: Record<RampName, string> = {
  neutral: '#6b7280',
  accent: '#1d1d1f',
  info: '#0071e3',
  error: '#d11720',
  warn: '#b8860b',
  success: '#1f9d55',
};

function lerp(a: number, b: number, t: number): number { return a + (b - a) * t; }
function ease(t: number, exp: number): number { return Math.pow(Math.max(0, Math.min(1, t)), exp); }

function stopToHex(l: number, c: number, h: number): string {
  return formatHex(clampChroma({ mode: 'oklch', l: Math.max(0, Math.min(1, l)), c: Math.max(0, c), h }, 'oklch', 'rgb'));
}

/** 12-stop ramp from a -500 hex (keys are the RAMP_STOPS). */
export function generateColorRamp(hex500: string): Record<number, string> | null {
  const parsed = oklch(hex500);
  if (!parsed) return null;
  const { l: L500, c: C500, h: H500 = 0 } = parsed;
  const L_LIGHT = 0.99;
  const L_DARK = 0.04;
  const ramp: Record<number, string> = { 500: hex500 };

  [400, 300, 200, 100, 50, 0].forEach((stop, i, arr) => {
    const t = (i + 1) / arr.length;
    ramp[stop] = stopToHex(lerp(L500, L_LIGHT, ease(t, 0.8)), C500 * Math.max(0.01, 1 - ease(t, 1.1)), H500);
  });
  [600, 700, 800, 900, 1000].forEach((stop, i, arr) => {
    const t = (i + 1) / arr.length;
    ramp[stop] = stopToHex(lerp(L500, L_DARK, ease(t, 0.8)), C500 * Math.max(0.01, 1 - ease(t, 1.4)), H500);
  });
  return ramp;
}
