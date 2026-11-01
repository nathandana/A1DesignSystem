# Configurator presentation metadata

A1-2732 adds a reusable generated-configurator layer to A1 Web. It consumes the
existing property rows generated from React `.d.ts` contracts; it does not own a
second component prop schema.

## Contract

`buildPropertyContract()` flattens the existing property tables and infers a
supported editor from each authoritative TypeScript type:

- `string`: Text field or text area.
- string-literal union: Select or Toolbar group, using only contract values.
- `boolean`: labeled Switch or icon Toolbar toggle.
- `number`: Number field.
- functions, nodes, arrays and structured objects: explicit custom-editor
  diagnostic.

Presentation metadata uses schema version `1.0.0`, the component ID, a contract
fingerprint and sparse property overrides. An override may set the control,
label, help text, group, order or conditional visibility. It records the source
contract type only for drift detection; it cannot add values or change a type.

The component contract remains authoritative. Loading metadata reports a wrong
component, unsupported version, missing or changed property, invalid control or
broken visibility dependency. Invalid control overrides fall back to the
inferred control rather than rendering an invalid editor.

## Reuse

`GeneratedConfigurator` owns the renderer and typed value updates independently
of the component explorer editor. The A1 editor and future browser extension can
use the same contract, metadata and values interface without importing the
component-detail page.

The component explorer exposes the editor under **Configurator editor** on each
component page. Saved metadata is local to the browser and keyed by component.
The JSON panel remains copyable and editable for portable versioned overrides.

No CSS or tokens are specific to this feature. A1 Section, Grid, Stack, Field,
Switch, Toolbar, Accordion, Banner, Badge, Button and Code components provide the
complete layout and interaction surface.
