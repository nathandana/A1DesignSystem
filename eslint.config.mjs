/**
 * A1 Design System — ESLint flat config.
 *
 * Wires `eslint-plugin-a1` (rules generated from `system/rules/*.yaml`) onto the canonical
 * source surfaces so the design rules are enforced on real code and gated in CI. This is a
 * design-rule gate, not a general code-style linter — only the a1/* rules are configured.
 *
 * Tiers:
 *   • Production source (components + app, excluding stories) — `error` (fails the gate).
 *   • Stories — `warn` (a softer documentation surface; visible debt, non-blocking). Raw-colour
 *     is off in stories because colour/usage demos legitimately show literal values.
 *
 * Run: `npm run lint` (regenerates the rule metadata first, then lints).
 */
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import a1 from 'eslint-plugin-a1';

const a1Error = a1.configs.recommended.rules;
const a1Warn = Object.fromEntries(Object.keys(a1Error).map((k) => [k, 'warn']));

const JS = ['packages/react/src/**/*.{js,jsx}', 'apps/a1-web/src/**/*.{js,jsx}'];
const TS = ['packages/react/src/**/*.{ts,tsx}', 'apps/a1-web/src/**/*.{ts,tsx}'];
const SRC = ['packages/react/src/**/*.{js,jsx,ts,tsx}', 'apps/a1-web/src/**/*.{js,jsx,ts,tsx}'];
const STORIES = ['packages/react/src/**/*.stories.{js,jsx,ts,tsx}', 'apps/a1-web/src/**/*.stories.{js,jsx,ts,tsx}'];

const jsLanguageOptions = {
  ecmaVersion: 2023,
  sourceType: 'module',
  parserOptions: { ecmaFeatures: { jsx: true } },
};

// The codebase carries inline `// eslint-disable react-hooks/*` and `@typescript-eslint/*`
// directives from its full editor setup. Register those plugins (no rules enabled) so this
// focused gate doesn't error on "rule definition not found".
const knownPlugins = {
  a1,
  'react-hooks': reactHooks,
  '@typescript-eslint': tseslint.plugin,
};

export default [
  {
    ignores: [
      '**/node_modules/**', '**/dist/**', '**/build/**', 'build/**',
      '**/storybook-static/**', '**/coverage/**', 'packages/pure/dist/**',
      // Vendored / generated / tooling — not design-system UI code.
      '.design-sync/**', '.tools/**', 'packages/eslint-plugin-a1/**', 'scripts/**',
      '**/*.min.js',
      // Out of scope for this gate (a follow-up): React Native (JSX in .js) needs its own
      // parser config; examples + other apps aren't the enforced surface yet.
      'packages/react-native/**', 'examples/**', 'apps/priority-guide-ios/**',
      '**/*.config.{js,mjs,cjs,ts}', 'system/**', 'reports/**',
    ],
  },

  // Focused design-rule gate — don't flag the project's pre-existing inline disable directives.
  { linterOptions: { reportUnusedDisableDirectives: 'off' } },

  // Parser + plugin registration (no rules — severity is set by the tier blocks below).
  { files: JS, plugins: knownPlugins, languageOptions: jsLanguageOptions },
  { files: TS, plugins: knownPlugins, languageOptions: { parser: tseslint.parser, ...jsLanguageOptions } },

  // Production source — the hard gate.
  { files: SRC, ignores: STORIES, rules: a1Error },

  // Stories — softer surface: warn, and no raw-colour noise on colour/usage demos.
  { files: STORIES, rules: { ...a1Warn, 'a1/no-raw-color': 'off' } },
];
