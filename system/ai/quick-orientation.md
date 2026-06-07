# A1 Design System — Quick Orientation

## Build commands

| Task | Command |
|------|---------|
| Token + theme + html-css rebuild | `npm run build:tokens && npm run build:html-css` |
| Theme rebuild only | `npm run build:themes` |
| Full QA (axe + visual + report) | `npm run test:qa` |
| Update visual baselines | `npm run test:qa:update` |
| Storybook dev | `npm run storybook` |
| a1-web dev | `npm run dev:a1-web` |
| General dev server | `npm run dev` |

Always run `npm run build:tokens && npm run build:html-css` after any change to `system/tokens/` or `system/themes/` before testing or committing.

## Key file locations

| What | Where |
|------|-------|
| Token source files | `system/tokens/` |
| Theme source files | `system/themes/` |
| React components | `packages/react/src/components/{name}/` |
| Hand-authored BEM classes | `packages/html-css/dist/a1-base.css` |
| Hand-authored pure classes | `packages/html-css/dist/a1-pure.css` |
| Pure example site | `examples/a1-pure/` |
| Color scheme switching (dark mode, inverse) | `packages/react/src/color-scheme.css` |
| Component registry | `system/ai/components.md` |
| a1-web app | `apps/a1-web/src/` |
| Accessibility report data | `reports/a11y.json` |

## Node version

This project uses Node v24 via nvm. If commands fail to find `npm`, run:

```
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && nvm use 24
```
