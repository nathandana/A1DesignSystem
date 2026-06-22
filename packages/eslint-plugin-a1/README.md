# eslint-plugin-a1

Enforces the **A1 Design System** design rules on real code. The rules in
[`system/rules/*.yaml`](../../system/rules) are the single source of truth (also shown on the
a1-web **Rules** page); this plugin makes the ones that can be checked statically **fail the
build** instead of living only as documentation.

## Rules

| Rule | Enforces (YAML) | Flags |
|------|-----------------|-------|
| `a1/no-uppercase-text` | `system-no-uppercase-content` | `.toUpperCase()` on whole strings, `textTransform: "uppercase\|lowercase\|capitalize"`, and `text-transform: …` in CSS-in-JS. Allows first-letter capitalisation (`s.charAt(0).toUpperCase()`, `s.replace(/^\w/, c => c.toUpperCase())`). |
| `a1/no-raw-color` | `system-tokens-only` | Raw `#hex` / `rgb()` / `hsl()` in a colour-bearing style declaration (`color`, `background`, `borderColor`, `boxShadow`, …). Allows `var(--token)`, `transparent`, `currentColor`. |
| `a1/no-nested-interactive-in-card` | `card-navigation-no-nested-interactive` | Interactive elements (button/link/field/menu/tabs/…) inside a `<Card variant="navigation">` or `<Card href>`. |
| `a1/single-primary-button` | `button-single-primary-action` | More than one primary `<Button>` (no `variant` = primary) within a `form` / `Dialog` / `ButtonContainer` / `StickyActions`. |

## How it stays in sync with the YAML

`scripts/build-eslint-rules.mjs` reads every YAML rule with an `enforcement.eslint: <rule-name>`
and:

1. generates `lib/generated/rule-meta.js` — the rule's requirement/do/dont/file, which
   `lib/index.js` overlays onto each rule's `meta.docs` (so a lint message links back to its
   rule id), and
2. **validates the mapping is 1:1** — every `enforcement.eslint` has an implemented rule file
   and every rule file is claimed by a YAML rule. `--check` fails CI if the committed generated
   file is stale.

Add a new enforced rule by writing `lib/rules/<name>.js`, adding
`enforcement: { eslint: <name> }` to a `system/rules/*.yaml` rule, and running
`npm run build:eslint-rules`.

## Usage

The repo's root [`eslint.config.mjs`](../../eslint.config.mjs) wires the recommended config onto
`packages/react/src` and `apps/a1-web/src`. The CSS laws (`no-uppercase`, `tokens-only`) are also
enforced on hand-authored stylesheets by `scripts/lint-a1-css.mjs`. Run the whole gate with
`npm run lint`; the plugin's own tests with `npm run lint:rules`.

```js
import a1 from 'eslint-plugin-a1';
export default [
  { plugins: { a1 }, rules: a1.configs.recommended.rules },
];
```
