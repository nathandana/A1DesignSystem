const BP_ORDER = ["xs", "sm", "md", "lg", "xl"];

// Convert a px dimension string to rem. Keeps 1px as-is (hairline borders
// don't benefit from scaling and can cause sub-pixel rendering artefacts).
// All other px values divide by 16 so they scale with the user's font preference.
function pxToRem(val) {
  if (typeof val !== "string") return val;
  const match = val.match(/^(-?\d*\.?\d+)px$/);
  if (!match) return val; // already rem/em/%, leave unchanged
  const px = parseFloat(match[1]);
  if (px === 0) return "0";
  if (Math.abs(px) === 1) return val; // keep 1px hairlines
  return `${+parseFloat((px / 16).toFixed(6))}rem`;
}

function breakpointsCssFormat({ dictionary }) {
  // Build { xs: { max: "480px" }, sm: { min: "481px", max: "640px" }, ... }
  const bp = {};
  for (const token of dictionary.allTokens) {
    if (token.path[0] !== "breakpoint") continue;
    const [, name, bound] = token.path;
    if (!bp[name]) bp[name] = {};
    // SD v5 with DTCG uses token.value (resolved) or token.$value (source)
    bp[name][bound] = token.value ?? token.$value ?? token.original?.$value;
  }

  const lines = [
    "/* ─── Breakpoints ─────────────────────────────────────────────────────────────",
    "   Generated from system/tokens/breakpoint.json via Style Dictionary.",
    "   @custom-media rules follow the CSS Media Queries Level 5 draft.",
    "   Use postcss-custom-media to expand these at build time, or reference",
    "   the --breakpoint-* CSS custom properties in JavaScript.",
    "─────────────────────────────────────────────────────────────────────────── */",
    "",
  ];

  for (const name of BP_ORDER) {
    if (!bp[name]) continue;
    const { min, max } = bp[name];
    const label = min && max
      ? `${min} – ${max}`
      : min
        ? `${min} and above`
        : `up to ${max}`;

    lines.push(`/* ${name.toUpperCase()} — ${label} */`);

    if (min && max) {
      lines.push(`@custom-media --bp-${name}      (min-width: ${min}) and (max-width: ${max});`);
      lines.push(`@custom-media --bp-${name}-up   (min-width: ${min});`);
      lines.push(`@custom-media --bp-${name}-down (max-width: ${max});`);
    } else if (max) {
      // xs — no lower bound
      lines.push(`@custom-media --bp-${name}      (max-width: ${max});`);
      lines.push(`@custom-media --bp-${name}-down (max-width: ${max});`);
    } else if (min) {
      // xl — no upper bound
      lines.push(`@custom-media --bp-${name}      (min-width: ${min});`);
      lines.push(`@custom-media --bp-${name}-up   (min-width: ${min});`);
    }

    lines.push("");
  }

  return lines.join("\n");
}

// The built-in size/rem transform in SD v5 preserves explicit units — "4px"
// stays "4px". This custom transform converts px → rem so spacing and sizing
// tokens scale with the user's browser/OS font-size preference (WCAG 1.4.4).
// Breakpoints are excluded: media query widths should stay in px.
const dimensionRemTransform = {
  type: "value",
  filter: (token, options) => {
    const type = options.usesDtcg ? token.$type : token.type;
    if (type !== "dimension") return false;
    // Keep breakpoints in px — they drive @media queries, not text layout
    if ((token.path ?? [])[0] === "breakpoint") return false;
    return true;
  },
  transform: (token, _, options) => {
    const val = options.usesDtcg ? token.$value : token.value;
    return pxToRem(val);
  },
};

// CSS platform: standard css transformGroup list with size/rem replaced by
// dimension/rem so all px dimension tokens (spacing, heights, padding) output rem.
const CSS_TRANSFORMS = [
  "attribute/cti",
  "name/kebab",
  "time/seconds",
  "html/icon",
  "dimension/rem",
  "color/css",
  "asset/url",
  "fontFamily/css",
  "cubicBezier/css",
  "strokeStyle/css/shorthand",
  "border/css/shorthand",
  "typography/css/shorthand",
  "transition/css/shorthand",
  "shadow/css/shorthand",
];

// JSON platform: standard js transformGroup list with the same swap.
// Only build-html-css.mjs consumes this output (React Native does not).
const JSON_TRANSFORMS = [
  "attribute/cti",
  "name/camel",
  "time/seconds",
  "html/icon",
  "dimension/rem",
  "color/hex",
  "asset/url",
];

export default {
  source: ["system/tokens/**/*.json"],
  hooks: {
    formats: {
      "custom/breakpoints-css": breakpointsCssFormat,
    },
    transforms: {
      "dimension/rem": dimensionRemTransform,
    },
  },
  platforms: {
    css: {
      transforms: CSS_TRANSFORMS,
      buildPath: "build/css/",
      files: [
        {
          destination: "tokens.css",
          format: "css/variables",
        },
        {
          destination: "breakpoints.css",
          format: "custom/breakpoints-css",
        },
      ],
    },
    json: {
      transforms: JSON_TRANSFORMS,
      buildPath: "build/json/",
      files: [
        {
          destination: "tokens.json",
          format: "json/nested",
        },
      ],
    },
  },
};
