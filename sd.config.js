const BP_ORDER = ["xs", "sm", "md", "lg", "xl"];

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

export default {
  source: ["system/tokens/**/*.json"],
  hooks: {
    formats: {
      "custom/breakpoints-css": breakpointsCssFormat,
    },
  },
  platforms: {
    css: {
      transformGroup: "css",
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
      transformGroup: "js",
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
