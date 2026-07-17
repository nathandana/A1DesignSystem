# A1 Figma Code Connect templates

This folder holds repo-side Code Connect templates for A1 Figma components.

## Button

- Figma component set: `https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=123-701`
- React source: `packages/react/src/components/button/Button.jsx`
- Template: `Button.figma.ts`

The live Code Connect MCP mapping could not be created in this session because Figma returned the Organization or Enterprise plan requirement for Code Connect. The template is still checked in so the mapping is ready to publish once the component is available from a team library with a supported seat.

The Button template maps the Figma `Variant`, `Size`, `State`, `Label`, `Show icon`, `Icon`, and `IconPosition` properties to the React Button API. Figma-only visual states (`hover`, `focus`, `pressed`) do not emit React props. The icon prop currently emits `smart_button` when an icon is visible; standardizing icon instance names to React icon registry names will make this output exact.

## Link

- Figma component set: `https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=487-1143`
- React source: `packages/react/src/components/link/Link.jsx`
- Template: `Link.figma.ts`

The Link template maps `Label`, `Show icon`, `Size`, `Weight`, and `Icon position` to the React Link API. It emits the default Material `star` icon when Figma's icon property is visible; publishing instance names as React icon names will make the emitted icon exact for every swap. URL and interaction behavior remain runtime-owned.

## Icon Button

- Figma component set: `https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=489-1014`
- React source: `packages/react/src/components/icon-button/IconButton.jsx`
- Template: `IconButton.figma.ts`

The Icon Button template maps `Variant`, `Size`, and `Aria label`, and emits its default Material `star` icon. The Figma asset intentionally requires a label so the generated React example remains accessible.

## Select

- Figma component set: `https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=490-1062`
- React source: `packages/react/src/components/field/SelectField.jsx`
- Template: `Select.figma.ts`

The Select template maps `Size`, aggregate `State`, visible label/value copy, and helper/error copy to a representative `SelectField`. The selected option is emitted as one illustrative `<option>` because Figma's visual field does not store option data.

## Divider

- Figma component set: `https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=491-1126`
- React source: `packages/react/src/components/divider/Divider.jsx`
- Template: `Divider.figma.ts`

The Divider template maps `Orientation`, `Variant`, `Line style`, and `Size`. Responsive orientation, spacing, and decorative semantics are intentionally omitted because they are structural/runtime concerns.

## Text Field

- Figma component set: `https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=148-1360`
- React source: `packages/react/src/components/field/TextField.jsx`
- Template: `TextField.figma.ts`

The Text Field template maps the Figma `Size`, `State`, `Label`, `Value`, `Hint`, `Error`, and label/hint visibility properties to the React `TextField` API. The aggregate Figma `State` emits `required`, `disabled`, `readOnly`, or `error` props where applicable; Figma-only `hover` and `focus` states do not emit React props. Runtime-only props such as `type`, `autoComplete`, `labelPosition`, `inputOverlay`, event handlers, and accessibility attributes remain omitted.

## Menu / Menu Item

- Figma Menu component: `https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=218-1177`
- Figma Menu Item component set: `https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=218-1176`
- React source: `packages/react/src/components/menu/Menu.jsx`
- Templates: `Menu.figma.ts`, `MenuItem.figma.ts`

The live Code Connect MCP mapping could not be inspected or published in this session because Figma returned the Organization or Enterprise plan requirement for Code Connect. The template is still checked in so the mapping is ready once the component is available from a team library with a supported seat.

The Menu shell exposes its `Menu Section` slot; its five preconfigured child rows are `Menu Item` instances. The Menu Item template maps `Type`, `State`, `Label`, `Show icon`, `Shortcut`, and `Show shortcut` to `MenuSection` / `MenuItem` output. Figma-only visual states (`hover`, `focus`, `pressed`) do not emit React props. Runtime-only props such as `open` state management, `onClose`, `anchorRef`, `trapFocus`, `modalOnMobile`, `href`, event handlers, refs, and arbitrary children remain omitted.

## Dialog

- Figma component set: `https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=228-1628`
- Figma child component set: `Dialog Hero Icon` at `https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=228-1013`
- React source: `packages/react/src/components/dialog/Dialog.jsx`
- Template: `Dialog.figma.ts`

The Dialog template maps `Size`, `Status`, `Title`, `Body`, `Show close`, and `Show footer` to a representative React `Dialog` composition. `Status=none` omits the React `status` prop; visible close affordances emit a placeholder `onClose`; visible footers emit representative A1 `Button` actions. Runtime-only behavior such as open-state ownership, native `<dialog>` behavior, Escape/backdrop dismissal, focus trap, focus restoration, refs, and arbitrary native dialog attributes remains omitted. The React `icon` override is not exposed in the Figma v1 component; status variants use the default icon through the `Dialog Hero Icon` child set.

## Top Header

- Figma component: `https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=613-977`
- Figma child component set: `Top Header Nav Item` at `https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=612-995`
- React source: `packages/react/src/components/top-header/TopHeader.jsx`
- Template: `TopHeader.figma.ts`

The Top Header template maps `Logo text` and `Show login button` to the React `logoText` and `loginButton` props and emits a representative `navItems`/`actions` composition (the Nav Items and Actions areas are composed from Top Header Nav Item and Icon Button instances, so their copy does not map to single parent properties). Dropdown submenus, the mobile nav overlay, responsive `navIconPosition`, action badges, and runtime navigation props remain omitted.
