# A1 Figma Code Connect templates

This folder holds repo-side Code Connect templates for A1 Figma components.

## Button

- Figma component set: `https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=123-701`
- React source: `packages/react/src/components/button/Button.jsx`
- Template: `Button.figma.ts`

The live Code Connect MCP mapping could not be created in this session because Figma returned the Organization or Enterprise plan requirement for Code Connect. The template is still checked in so the mapping is ready to publish once the component is available from a team library with a supported seat.

The Button template maps the Figma `Variant`, `Size`, `State`, `Label`, `Show icon`, `Icon`, and `IconPosition` properties to the React Button API. Figma-only visual states (`hover`, `focus`, `pressed`) do not emit React props. The icon prop currently emits `smart_button` when an icon is visible; standardizing icon instance names to React icon registry names will make this output exact.
