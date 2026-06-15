// Per-component code snippets shown on the Configure tab. Components without an
// entry fall back to a generated tag in the generic detail module.
export const COMPONENT_SNIPPETS = {
  code: {
    react: `<Code>--semantic-color-text-default</Code>\n\n<Code variant="block" wrapping copyCode>\n{exampleCode}\n</Code>`,
    native: `// Not available in the Native package.`,
    pure: `// Not available in the Pure package.`,
  },
  calendar: {
    react: `// Scroll variant — renders all months vertically (default)\n<Calendar monthsToShow={13} />\n\n// Paginated variant — one month at a time with navigation\n<Calendar\n  variant="paginated"\n  highlightToday\n  dimPast\n  todayButton\n/>`,
    native: `// Not available in the Native package.`,
    pure: `// Not available in the Pure package.`,
  },
  'definition-list': {
    react: `<DefinitionList\n  direction="row"\n  labelWidth="fixed"\n  copyValue\n  items={[\n    { label: "Account ID", value: "A1-849204" },\n    { label: "Plan", value: "Enterprise" },\n    { label: "Renewal", value: "June 30, 2026" },\n  ]}\n/>`,
    native: `// Not available in the Native package.`,
    pure: `<dl class="a1-definition-list a1-definition-list-row a1-definition-list-medium a1-definition-list-label-fixed">\n  <div class="a1-definition-list-item">\n    <dt class="a1-definition-list-label">Account ID</dt>\n    <dd class="a1-definition-list-value">\n      <span class="a1-definition-list-value-content">A1-849204</span>\n    </dd>\n  </div>\n</dl>`,
  },
}
