# Overflow menu

`OverflowMenu` is a formal React pattern composed from IconButton, Menu,
MenuItem and the nested VerificationDialog pattern. It owns no CSS or tokens. Its system
contract is `system/patterns/overflow-menu.json`; semantic rules live in
`system/rules/overflow-menu.yaml`. Coverage is React only.

## Public contract

- The trigger is always a tertiary IconButton with `more_vert`. `label` names
  its context (localized “More actions” by default); `size` is sm/md/lg.
- `actions` is an ordered collection of `{ id, label, icon?, href?, disabled?,
  destructive?, verification? }`. IDs must be unique. Authored order is retained.
- Any action may supply a nested `<VerificationDialog>` element in React. JSON
  carries a full versioned VerificationDialog node under `verification`, including
  its props and optional Content area. Confirm defaults to the action label;
  Cancel is localized.
- `destructive` styles the menu action. The nested VerificationDialog owns its
  confirmation treatment. Enabling verification initially copies the action
  treatment, then each remains independently editable.
- React `onAction(action)` is called once after direct activation or confirmation.
  The host owns application behavior and async work. If `href` is present,
  navigation follows the callback; it also waits for confirmation.
- Disabled items cannot activate. An empty or disabled menu has a disabled trigger.
  If the selected item is changed, removed or disabled during verification,
  confirmation does not execute a stale action.

OverflowMenu owns menu state and dispatch; VerificationDialog owns the message,
content, footer and initial focus. OverflowMenu passes controlled visibility and
confirmation/dismissal callbacks into the nested instance.

The pattern follows A1 Menu's dialog semantics and keyboard model: Enter/Space
or ArrowDown opens it; Tab moves among controls; Escape dismisses it. The trigger
uses `aria-haspopup="dialog"`, matching the actual shared component. Opening
verification closes the menu first, focuses Cancel, and labels/describes the
Dialog. Shared Dialog `initialFocusId` points to the stable Cancel button ID.
Cancel, close, backdrop dismissal and Escape never execute the action.
Focus returns to the trigger.

## JSON and editor

This pattern uses a structured action collection, declared in the manifest's
`collections`, with its item schema under `propsSchema.properties.actions`. The collection
declares `patterns: { verification: "VerificationDialog" }`; validation,
canonicalization and MCP can traverse that relationship without guessing at
arbitrary prop objects.
Manifest schema `1.1.0` adds collections and permits no child areas for a pattern
whose editing surface is entirely structured data. Earlier manifests remain
valid. The React implementation owns executable behavior; the manifest names
supported policies, and the shared validator checks item shape, IDs and URLs.

The Pattern library defaults to the requested Edit, Duplicate, Delete example,
with verification enabled on Delete. There is no load-example button. A second
example verifies Duplicate and leaves Delete immediate, demonstrating that
verification belongs to each action rather than its label.

The configurator edits every action's label, icon, destination, disabled and
destructive states, verification text, order and removal. It preserves imported
extra metadata and IDs. Its preview reports selections and does not navigate
away. JSON and React code export contain the configured items; there are no
sample-filled slots. An import without actions stays empty, as does editor
catalog insertion. The project editor uses the same controls and schema.
JSON cannot supply the executable `onAction` callback.

## Files and checks

- `packages/react/src/patterns/overflow-menu/`: implementation, declarations, stories.
- `apps/a1-web/src/pages/components/detail/overflow-menu.jsx`: shared configurator.
- `system/labels/overflow-menu.json`: trigger labels in eight languages.
- `system/labels/verification-dialog.json`: Confirm/Cancel labels in eight languages.
- `tests/patterns/overflow-menu.test.mjs`: contracts and invalid input.
- `tests/a1-web/overflow-menu.spec.js`: default example, immediate/verified
  activation, cancellation, keyboard focus, disabled items, verified navigation,
  editing/round trips, responsive theme checks and focused axe scans.

Run `npm run build:patterns`, `npm run patterns:check`, `npm run build:mcp-index`,
`npm run test:patterns`, `npm run test:rsc` and `npm run pack:check`.
Build the website before running the overflow-menu Playwright spec. The formal
pattern CI workflow includes it. Follow the existing npm and MCP publication
processes; implementation and local checks are not production deployment.

## React composition

```jsx
<OverflowMenu actions={[
  { id: 'edit', label: 'Edit', icon: 'edit' },
  { id: 'duplicate', label: 'Duplicate', icon: 'content_copy' },
  {
    id: 'delete', label: 'Delete', icon: 'delete', destructive: true,
    verification: (
      <VerificationDialog title="Delete item?"
        message="This will delete the selected item."
        confirmLabel="Delete" destructive />
    ),
  },
]} onAction={handleAction} />
```

No `open`, `onConfirm` or `onClose` wiring is needed on the nested instance;
OverflowMenu supplies it. Use VerificationDialog independently with those
controlled props for other verification flows. Code export produces the same
nested JSX composition; JSON preserves nested IDs, versions and Content nodes.

## Verification translations

VerificationDialog accepts `titleKey`, `messageKey`, `confirmLabelKey` and
`cancelLabelKey`. Each resolves through the host LabelsProvider (locale, brand,
then default), using the corresponding text prop as a fallback when the key is
missing. Confirm and Cancel retain localized system defaults without bindings.
The example title, message and confirmation verb use `verificationDialog.*`
labels in English, Spanish, French, German, Portuguese, Japanese, Chinese and
Arabic. These labels appear in the Label editor and lookup dialog, including
workspace overrides. Both standalone and nested configurators can choose or add
a label for any field. Editing literal text clears that field's binding; JSON
and JSX exports preserve configured keys and fallback text.

Code export formats action objects and nested JSX on separate lines, and groups
each translation key with its fallback text. Both values are intentional: the
key selects the label-service value; the fallback keeps the dialog readable if
the host has no LabelsProvider or the key is unavailable.
