# A1 Design System — Claude Code Instructions

Read and follow the central project context before starting any task:

@ai/project-context.md

Before asking whether a component exists or where it is implemented, check the component registry:

@ai/components.md

## Quick orientation

- **Token changes:** edit `system/tokens/`, then `npm run build:tokens && npm run build:html-css`
- **Theme changes:** edit `system/themes/`, then `npm run build:themes`
- **React component:** `packages/react/src/components/{name}/`
- **HTML/CSS BEM classes:** `packages/html-css/dist/a1-base.css` (hand-authored)
- **HTML/CSS pure classes:** `packages/html-css/dist/a1-pure.css` (hand-authored)
- **Pure example site:** `examples/a1-pure/`
- **Storybook:** run with `npm run storybook`
- **Dev server:** run with `npm run dev`
