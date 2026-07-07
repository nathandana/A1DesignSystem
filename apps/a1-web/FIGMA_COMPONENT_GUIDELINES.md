# Figma component guidelines

Best-practice notes from the Text Field Figma component cleanup.
Build in https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=10-2&p=f&t=gmtL56JYFMPoJnxO-11

## Core validation checklist

Use this checklist before marking any Figma component complete.

- Every structural container uses auto layout.
- Never use anonymous frames or default layer names.
- Every layer has a semantic name.
- Every reusable area becomes a slot.
- Every configurable behavior becomes a component property.
- Use variables for spacing, color, radius, typography, and effects.
- Prefer composition over variant explosion.
- Components resize correctly using Hug, Fill, and Fixed constraints.
- Document the component with a description explaining purpose and intended usage.
- Optimize for editability by future AI agents rather than minimum layer count.

Native Figma `SLOT` properties count as slots when they are named semantically, constrained with preferred values, and documented. Imported icon internals may keep a `Vector` layer only when they come from the icon library and their visible paints are variable-bound.

## Use code as the contract

The Figma component should reflect the real React component API and behavior. Do not invent a design-only component model unless the difference is intentional and documented.

- Mirror meaningful React props as Figma variants or component properties.
- Treat optional React content as optional Figma content.
- Keep runtime-only props documented as gaps instead of forcing them into the Figma component.

## Keep variants useful

Variant axes should describe meaningful visual states, not every possible implementation detail.

- Use variants for core state and scale differences such as `Size` and `State`.
- Avoid variant axes that make the component hard to scan or use.
- Remove variants that do not match the intended component scope.
- Only use Figma grid layout on a component set when the component actually has multiple variants to compare.
- Do not force a single component shell into grid layout just because nearby variant sets use it.

## Split repeated children into components

Repeated child elements should usually be their own components instead of being rebuilt inside every parent variant.

- Create child components for repeated stateful parts such as menu items, table rows, navigation items, tabs, and list items.
- Let the child component own its state variants, optional icon/shortcut/content properties, and token bindings.
- Let the parent component compose children as instances instead of duplicating their internal layers.
- Prefer public child components when designers will use them directly; use hidden building blocks only for internals designers should not insert.

## Use slots for compositional parents

Parent components that accept arbitrary children in React should preserve that flexibility in Figma.

- Use clearly named slot frames such as `_items`, `_content`, or `_actions` when React accepts children or repeated child content.
- Give slots enough token-bound space for expected children, but do not bake every child variant into the parent.
- Use example instances beside the component to show common compositions.
- Keep slot frames auto-laid-out, resizable, and easy to replace with real child component instances.

## Avoid absolute positioning

Component internals should be built with auto layout unless a specific visual treatment truly requires absolute positioning.

- Do not absolute-position normal variant content.
- Use auto layout for labels, values, hints, errors, and required markers.
- Keep components resilient when text changes, toggles hide/show content, or designers resize instances.

## Organize the component set

The component set should be easy to inspect and compare.

- Place variants in a clean grid.
- Use generous spacing between cells.
- Add page padding around the full component set.
- Fill the page with the app page surface so contrast matches the product environment.

## Label the grid

Rows and columns should communicate the properties being demonstrated.

- Label rows and columns with the relevant property names and values.
- Group labels with auto layout.
- Lock labels so designers do not accidentally select them while working with instances.

## Bind tokens and styles

Do not use raw visual values in production Figma components.

- Bind fills, strokes, focus rings, text colors, and status treatments to variables.
- Use shared text styles for labels, values, hints, and errors.
- Match React token behavior for light mode, dark mode, disabled, read-only, focus, and error states.
- Check nested icon vectors and swapped icon instances; they must inherit or be rebound to the state-specific foreground variable, not stay black.
- If an icon swap cannot reliably preserve color overrides, document the limitation or use a safer icon representation.

## Use component properties

Designers should not need to dig through layers to edit normal content.

- Expose editable text properties for user-facing labels and values.
- Add boolean properties for optional content such as hints, errors, icons, or required markers.
- Keep property names clear and close to the React API where possible.

## Validate against React

Figma should be compared against real rendered product output, not memory or approximation.

- Screenshot the React component in a1-web.
- Paste the screenshot into Figma.
- Overlay Figma instances against the screenshot.
- Check typography, spacing, borders, focus rings, status colors, disabled opacity, and required markers.

## Prefer usability over exhaustiveness

A component is not successful just because it covers many combinations.

- Prefer a smaller, accurate, maintainable component over a huge unusable variant matrix.
- Split documentation, examples, and validation boards away from the component internals.
- Keep the inserted default instance useful for common design work.

## Common Text Field mistakes to avoid

- Do not make hint text always visible if the React hint is optional.
- Do not hardcode error colors or use the wrong semantic variable.
- Do not let error side accents and field borders use different colors unless React does too.
- Do not make focus rings by eye. Bind them to the focus token behavior.
- Do not use the compact field typography for default or comfortable sizes, or vice versa.
- Do not use an asterisk for comfortable required markers when the React component uses the required badge treatment.

## Common compositional component mistakes to avoid

- Do not bake repeated child rows into every parent variant when the child should be a reusable component.
- Do not make the parent own child states that belong to the child component.
- Do not use grid layout on a single parent shell. Use grid layout for component sets with multiple variants.
- Do not leave icon vectors black or raw after placing/swapping icon instances. Validate the nested vector fills.
- Do not overload the parent with every child text property if the child component owns that content.
- Do not rely on examples as the component API. Keep examples beside the component and keep the component itself compositional.
