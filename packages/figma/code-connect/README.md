# A1 Figma Code Connect templates

This folder holds repo-side Code Connect templates for A1 Figma components.

## Button

- Figma component set: `https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=123-701`
- React source: `packages/react/src/components/button/Button.jsx`
- Template: `Button.figma.ts`

The live Code Connect MCP mapping could not be created in this session because Figma returned the Organization or Enterprise plan requirement for Code Connect. The template is still checked in so the mapping is ready to publish once the component is available from a team library with a supported seat.

The Button template maps the Figma `Variant`, `Size`, `State`, `Label`, `Show icon`, `Icon`, and `IconPosition` properties to the React Button API. Figma-only visual states (`hover`, `focus`, `pressed`) do not emit React props. The icon prop currently emits `smart_button` when an icon is visible; standardizing icon instance names to React icon registry names will make this output exact.

## Text Field

- Figma component set: `https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=148-1360`
- React source: `packages/react/src/components/field/TextField.jsx`
- Template: `TextField.figma.ts`

The Text Field template maps the Figma `Size`, `LabelPosition`, `State`, `Label`, `Value`, `Hint`, and `Error` properties to the React `TextField` API. The aggregate Figma `State` emits `required`, `disabled`, `readOnly`, or `error` props where applicable; Figma-only `hover` and `focus` states do not emit React props. Runtime-only props such as `type`, `autoComplete`, `inputOverlay`, event handlers, and accessibility attributes remain omitted.

## Menu / Menu Item

- Figma Menu component: `https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=218-1177`
- Figma Menu Item component set: `https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=218-1176`
- React source: `packages/react/src/components/menu/Menu.jsx`
- Templates: `Menu.figma.ts`, `MenuItem.figma.ts`

The live Code Connect MCP mapping could not be inspected or published in this session because Figma returned the Organization or Enterprise plan requirement for Code Connect. The template is still checked in so the mapping is ready once the component is available from a team library with a supported seat.

The Menu template maps the parent shell's `Aria label`, `Section label`, and item-slot visibility toggles to a representative React `Menu` / `MenuSection` composition. The Menu Item template maps the child component set's `State`, `Label`, `Show icon`, `Shortcut`, and `Show shortcut` properties to `MenuItem` props. Figma-only visual states (`hover`, `focus`, `pressed`) do not emit React props. Runtime-only props such as `open` state management, `onClose`, `anchorRef`, `trapFocus`, `modalOnMobile`, `href`, event handlers, refs, and arbitrary children remain omitted.

## Dialog

- Figma component set: `https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=228-1628`
- Figma child component set: `Dialog Hero Icon` at `https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=228-1013`
- React source: `packages/react/src/components/dialog/Dialog.jsx`
- Template: `Dialog.figma.ts`

The Dialog template maps `Size`, `Status`, `Title`, `Body`, `Show close`, and `Show footer` to a representative React `Dialog` composition. `Status=none` omits the React `status` prop; visible close affordances emit a placeholder `onClose`; visible footers emit representative A1 `Button` actions. Runtime-only behavior such as open-state ownership, native `<dialog>` behavior, Escape/backdrop dismissal, focus trap, focus restoration, refs, and arbitrary native dialog attributes remains omitted. The React `icon` override is not exposed in the Figma v1 component; status variants use the default icon through the `Dialog Hero Icon` child set.
