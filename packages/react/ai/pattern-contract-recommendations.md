# Formal patterns in A1

Implemented Oct. 28, 2026 for Page title, Overview Card, Overflow menu, Verification dialog and Navigation tree. This document records
the design approach, implementation boundaries and release checks. The
[page-definition standard](page-definition-standard.md) describes page JSON;
the [generated contract reference](pattern-contracts.generated.md) describes
the current formal patterns.

## System-owned contracts

Author pattern data in `system/patterns/*.json`, validated against
`system/patterns/schema.json`. The Page title, Overview Card, Overflow menu, Verification dialog and Navigation tree
manifests are the source of truth. `patternAreas.ts` is now an editor adapter, not a second registry.

Each manifest declares identity, contract and schema versions, platform coverage,
public props JSON Schema, locked props, ordered areas, stable rule IDs, supported
normalization policies, an empty starter, explicit examples and migrations.
React rendering and executable policies stay in code. The manifest cannot
contain callbacks, JSX, JavaScript or CSS. Formal patterns compose existing A1
components without owning CSS or tokens.

| Input | Purpose | Overview Card |
| --- | --- | --- |
| Public props | Typed content and meaningful configuration | Title, icon, heading level, labeled status, Details |
| Open area | Editable component tree and layout | Content between Details and Actions |
| Zone | Editable items under system-owned rules | Up to two Buttons, Links or IconButtons; small secondary/tertiary controls |

The parent owns Overview Card width. Constrain its Grid or Section; the pattern
has no fixed or maximum width. Page title's content width aligns its page band
with sibling sections and is a separate concern.

Formal patterns ship with the system. Saved project patterns are authored
compositions with instance links and overrides. They share component-node
vocabulary, but do not share a release lifecycle.

A structured action collection is also supported (manifest schema 1.1.0):
OverflowMenu uses `collections` to identify `/props/actions`, its rule ID and
supported activation, uniqueness, disabled and navigation policies. A collection
can declare nested pattern fields, such as OverflowMenu verification →
VerificationDialog, so nested versions and areas are validated and exported. Its item
schema lives in `propsSchema`; it needs no artificial open Slot. Use this when
items are data rendered by a specific control, not arbitrary component trees.
The Overflow menu library example is populated by default at the user's request;
imports and catalog starters still preserve missing actions as empty.

## Generation and consumers

Run `npm run build:patterns` after manifest changes. It produces the portable JS
manifest artifact shipped in React and the generated Markdown reference. Run
`npm run build:mcp-index` after changing manifests, public declarations or docs.
Never hand-edit either generated artifact.

The editor, library configurators, JSON validator, JSX exporter, React adapters
and MCP consume the same manifest policies. Normalization fixes styles and
ordering without discarding controls, callbacks or node metadata. It is separate
from validation: exceeding an item limit is an error, not permission to truncate.
Limits count direct items; Page title's primary-action policy also traverses
ButtonContainer groups. Toolbar and SegmentedControl own their internal APIs.

Public package subpaths are:

- `@gtivr4/a1-design-system-react/patterns/contracts`: manifest lookup, empty
  starters, normalization and canonicalization.
- `@gtivr4/a1-design-system-react/patterns/validation`: `validatePatterns`,
  `validatePatternEdit` and formatted/structured diagnostics.
- `@gtivr4/a1-design-system-react/patterns/migrations`: `migratePatternNode`.

These modules run without React or a browser. React elements use a separate
adapter, preserving keys and callbacks. Arbitrary custom React wrappers cannot
be inspected as JSON: applications authoring raw JSX must still respect item
types/counts. Use the shared validator when generating serializable compositions.

## Empty starters and round trips

Create a starter with `createPatternNode('OverviewCard', { id, props })` or request
it through MCP `get_pattern`. It includes `patternVersion: "1.0.0"` and named
areas. Each area's `children` is omitted until explicitly configured. Examples
are separate; preview outlines and sample content never become authored nodes.
An explicitly empty zone overrides legacy data-form actions or metadata.

Configurator edits retain authored IDs, localization keys, action descriptors,
a11y metadata, unknown extra props and open-area layout. Advanced Page title
action groups and split buttons remain intact; edit their internals in the
project editor or JSON. Editing a translated literal removes its previous key
only when that literal is actually changed. JSX export retains open-area Grid
layout and ARIA relationships. It remains a readable code representation, not a
lossless project backup: JSON preserves localization and action descriptors;
applications must wire behavior themselves.

## Validation, recovery and migrations

The shared validator returns `{ valid, diagnostics }`. Every diagnostic has
`nodeId`, a JSON-pointer `path`, `ruleId`, `severity`, `message` and `recovery`.
It checks formal pattern props, versions, area identity/order, accepted zone
items, cardinality, accessible icon-button names/icons, navigation targets,
locked props and normalization warnings. It is not a whole-page schema validator.

The editor's visual commit guard covers add, paste, duplicate, drag/move and
property edits. Formal rules are resolved from the parent pattern and area ID;
authored `zone: false`, altered allowlists or weaker locks cannot relax them.
Library JSON editing, project import/replacement, JSX export, preview rendering
and prototype publication also validate. Invalid raw JSON and future-version
nodes remain available for correction or backup; rejected edits never silently
lose excess content. A full project JSON backup deliberately remains available
for recovery, including invalid drafts.

Areas follow manifest order in rendering and Layers. Zone containers and their
rule props are locked; their permitted children remain editable. Open content
areas retain layout controls. Empty affordances appear only while editing.

Pattern versions are independent of page-envelope versions. New pages use
`schemaVersion: "1.1.0"`; older `0.1.0` and `1.0.0` envelopes remain accepted.
Unversioned patterns use the current compatible contract. An explicit migration
adopts named areas, moves legacy data actions/metadata into nodes, and renames
Overview Card `facts` to `details`. It returns a proposed node; it never saves
or mutates the original. Conflicting names, ambiguous duplicate areas and unknown
future versions return diagnostics with the source retained. New breaking
changes need another declared transition and a tested code implementation.

## MCP and release verification

`list_components` and `get_component` still discover formal patterns.
`get_pattern` returns the full contract, materialized empty starter and explicit
examples. `validate_patterns` returns the shared diagnostics; `migrate_pattern`
returns an explicit proposed migration. `a1://docs/pattern-contracts` provides the
generated readable reference. The MCP index schema is `0.2.0`.

The formal-pattern CI workflow checks manifest schema, registered types, rule
references, policy support, starters/examples, generated freshness, MCP parity,
unit tests, React types/RSC, package contents and browser workflows. Release and
Netlify build checks reject stale artifacts. The browser suite covers empty and
populated patterns, metadata-preserving edits, layout, themed responsive cards,
keyboard order, disabled navigation, diagnostics and editor zone protection.
Shared Button/IconButton prevent disabled anchor activation and leave the tab
order; stacked ButtonContainer Links and IconButtons share its alignment.

Run locally:

```sh
npm run patterns:check
npm run build:mcp-index:check
npm run test:patterns
npm run test:rsc
npm run pack:check
npm run lint
npm run build:a1-web:test
npx playwright test --config playwright.a1-web.config.js tests/a1-web/formal-patterns.spec.js
```

After deployment, run `npm run patterns:verify-mcp -- <endpoint-url>` against
the deployed `/mcp` endpoint, or supply `mcp_url` to the CI workflow dispatch.
It verifies versions, props schemas, locked props, area rules, starters and
validation diagnostics against local contracts. Publication is a separate
release operation: local checks and index regeneration do not prove that the
production endpoint or npm package has been updated.

## Approach for the next pattern

Start with the public props and named editing areas. Reuse the existing `open`
and `zone` kinds until a real use case requires another. Declare constraints
and supported policies in one manifest, implement only missing runtime behavior,
then add empty/populated examples and round-trip tests. Keep the configurator
small and preserve authored data it does not understand. State actual platform
coverage; a React implementation does not imply Native, Figma or Web Components
support.

## Navigation tree structured collection

NavigationTree uses the 1.1.0 manifest collection contract for `/props/items`. Its `selection` activation policy and `children: "children"` recursion describe arbitrary nested navigation. The shared validator checks unique IDs and safe destinations across all levels. These are data items, not open component areas. Search and sorting are optional; the composition and compact control size are fixed.
