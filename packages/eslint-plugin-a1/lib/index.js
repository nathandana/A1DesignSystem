/**
 * eslint-plugin-a1 — enforces the A1 Design System design rules on real code.
 *
 * The rules are authored as prose in `system/rules/*.yaml` (the source of truth, also shown on
 * the a1-web Rules page). A YAML rule opts into code enforcement with
 * `enforcement.eslint: <rule-name>`; `scripts/build-eslint-rules.mjs` generates
 * `lib/generated/rule-meta.js` from those, and this file overlays that metadata onto each
 * rule's `meta.docs` so every lint message links back to its rule id.
 */
import noUppercaseText from './rules/no-uppercase-text.js';
import noRawColor from './rules/no-raw-color.js';
import noNestedInteractiveInCard from './rules/no-nested-interactive-in-card.js';
import singlePrimaryButton from './rules/single-primary-button.js';
import { ruleMeta } from './generated/rule-meta.js';
import { docUrl } from './util.js';

const rawRules = {
  'no-uppercase-text': noUppercaseText,
  'no-raw-color': noRawColor,
  'no-nested-interactive-in-card': noNestedInteractiveInCard,
  'single-primary-button': singlePrimaryButton,
};

// Overlay the YAML spec (source of truth) onto each rule's docs.
for (const [name, rule] of Object.entries(rawRules)) {
  const m = ruleMeta[name];
  if (!m) continue;
  rule.meta = rule.meta ?? {};
  rule.meta.docs = {
    ...rule.meta.docs,
    description: m.requirement || rule.meta.docs?.description,
    url: docUrl(m.file),
    a1RuleId: m.id,
    a1File: m.file,
    a1AppliesTo: m.appliesTo,
  };
}

const plugin = {
  meta: { name: 'eslint-plugin-a1', version: '0.1.0' },
  rules: rawRules,
};

// Flat-config "recommended" — every enforced rule on as an error, namespaced `a1/`.
plugin.configs = {
  recommended: {
    name: 'a1/recommended',
    plugins: { a1: plugin },
    rules: {
      'a1/no-uppercase-text': 'error',
      'a1/no-raw-color': 'error',
      'a1/no-nested-interactive-in-card': 'error',
      'a1/single-primary-button': 'error',
    },
  },
};

export default plugin;
