import {
  converter,
  formatHex,
  clampChroma
} from "culori";

const toOklch = converter("oklch");
const toRgb = converter("rgb");

const steps = {
  0: 0.99,
  50: 0.97,
  100: 0.93,
  200: 0.86,
  300: 0.76,
  400: 0.65,
  500: null,
  600: 0.42,
  700: 0.32,
  800: 0.23,
  900: 0.15,
  1000: 0.05
};

function chromaScale(step, rootChroma) {
  const n = Number(step);

  if (n === 500) return rootChroma;

  if (n < 500) {
    const distanceFromRoot = (500 - n) / 500;
    return rootChroma * (1 - distanceFromRoot * 0.75);
  }

  const distanceFromRoot = (n - 500) / 500;
  return rootChroma * (1 - distanceFromRoot * 0.6);
}

export function generateRamp(rootHex) {
  const root = toOklch(rootHex);

  if (!root) {
    throw new Error(`Invalid color: ${rootHex}`);
  }

  const ramp = {};

  for (const [step, lightness] of Object.entries(steps)) {
    if (step === "500") {
      ramp[step] = formatHex(rootHex);
      continue;
    }

    const color = {
      mode: "oklch",
      l: lightness,
      c: chromaScale(step, root.c),
      h: root.h
    };

    const clamped = clampChroma(color, "oklch");
    ramp[step] = formatHex(toRgb(clamped));
  }

  return ramp;
}

export function generateTheme(sourceColors) {
  return {
    source: {
      color: sourceColors
    },
    color: Object.fromEntries(
      Object.entries(sourceColors).map(([name, hex]) => [
        name,
        generateRamp(hex)
      ])
    )
  };
}
