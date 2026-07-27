# A1 Design System — Quick Orientation

## Build commands

| Task | Command |
|------|---------|
| Token + theme + html-css rebuild | `npm run build:tokens && npm run build:html-css` |
| Theme rebuild only | `npm run build:themes` |
| Color-token inventory + validation | `npm run tokens:audit:check` |
| Update computed color contract | `npm run tokens:contract:update` |
| Check computed color contract | `npm run tokens:contract:check` |
| Verify react npm tarball (imports, entry points, guidelines sync) | `npm run pack:check` |
| Regenerate component History from the maintenance log | `npm run history:generate` (`:check` to verify freshness) |
| Full QA (axe + visual + report) | `npm run test:qa` |
| Update visual baselines | `npm run test:qa:update` |
| A1-Web route baseline | `npm run test:a1-web` |
| Update A1-Web route baselines | `npm run test:a1-web:update` |
| A1-Web release gate | `npm run release:a1-web:check` |
| Storybook dev | `npm run storybook` |
| a1-web dev | `npm run dev:a1-web` |
| General dev server | `npm run dev` |

## Stable local ports

Use the root scripts for bookmarkable local URLs. They all use `--strictPort`, so the command fails if the reserved port is busy instead of silently moving to another port.

| App/site | Command | URL |
|----------|---------|-----|
| Examples index | `npm run dev` | `http://127.0.0.1:5176/` |
| a1-web | `npm run dev:a1-web` | `http://127.0.0.1:5177/` |
| a1-web local bridge (Codex + Figma handoff) | `npm run codex:bridge:a1-web` | `http://127.0.0.1:4318/` |
| Tesla A1 | `npm run dev:tesla-a1` | `http://127.0.0.1:5188/` |
| Tesla A1 proxy-backed app | `npm run serve:tesla-a1` | `http://127.0.0.1:5189/` |
| Storybook | `npm run storybook` | `http://127.0.0.1:6006/` |
| Priority Guide | `npm run dev:priority-guide` | `http://127.0.0.1:5178/examples/priority-guide/` |
| Cat Stack Cafe | `npm run dev:cat-stack-cafe` | `http://127.0.0.1:5179/examples/cat-stack-cafe/` |
| Theme Editor | `npm run dev:theme-editor` | `http://127.0.0.1:5180/examples/theme-editor/` |
| Catlympics | `npm run dev:catlympics` | `http://127.0.0.1:5181/examples/cat-lympics/` |

Always run `npm run build:tokens && npm run build:html-css` after any change to `system/tokens/` or `system/themes/` before testing or committing.

## Key file locations

| What | Where |
|------|-------|
| Token source files | `system/tokens/` |
| Theme source files | `system/themes/` |
| React components | `packages/react/src/components/{name}/` |
| BEM classes (generated — edit `componentCss()` in `scripts/build-html-css.mjs`) | `packages/pure/dist/a1-base.css` |
| Hand-authored pure classes | `packages/pure/dist/a1-pure.css` |
| Pure example site | `examples/a1-pure/` |
| Color scheme switching (dark mode, inverse) | `packages/react/src/color-scheme.css` |
| Component registry | `packages/react/ai/components.md` |
| a1-web app | `apps/a1-web/src/` |
| Accessibility report data | `reports/a11y.json` |

## Node version

This project uses Node v24 via nvm. If commands fail to find `npm`, run:

```
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && nvm use 24
```
