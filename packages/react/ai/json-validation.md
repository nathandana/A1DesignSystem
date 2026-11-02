# Page and project JSON validation

A1-2737 adds `validate_json` to the MCP server and uses the same validator in
A1 Web's page editor, project JSON editor and import flow. Validation is read-only:
it does not normalize, migrate, render, execute, save or publish the submitted JSON.
Keep intentional migrations separate and review their output before validation.

## Agent workflow

1. Start with `get_json_model` (defaults to `format: "project"`) and follow its
   mandatory rules. Use a linked project for a website; reserve `page` for an
   explicitly single-page request. Do not reduce a site to one scrolling page.
2. Read `get_component` for props and `get_pattern` for governed areas before
   authoring. Prefer A1 patterns and project navigation over custom substitutes.
3. Generate JSON, then call `validate_json` with `kind` and `document`.
4. Repair errors at the returned JSON Pointer paths, review warnings and coverage,
   then revalidate the complete project so internal links resolve.
5. Call `create_preview`, open the returned A1 `/preview/` URL, and inspect
   responsive layout and accessibility. Revise and create another preview as needed.
6. Return the A1 preview URL as the primary handoff, alongside the JSON and any
   remaining review limitations. Anyone can choose **Edit as project** there.

React/npm setup remains available through `get_react_setup` when explicitly
requested. The default MCP site workflow is JSON → validation → A1 preview.

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "validate_json",
    "arguments": {
      "kind": "page",
      "document": {
        "schemaVersion": "1.1.0",
        "page": {
          "id": "home",
          "name": "Home",
          "layout": {
            "type": "PageLayout",
            "regions": [{ "id": "main", "nodes": [] }]
          }
        }
      }
    }
  }
}
```

`document` may be a parsed object or JSON text. The latter lets an agent receive
an `INVALID_JSON` diagnostic for malformed text rather than an MCP transport
parse error. `contractVersion` is an optional request-level pin to `1.1.0`.
An unsupported pin returns `UNSUPPORTED_VERSION`. Page `schemaVersion` also
accepts the existing `0.1.0` and `1.0.0` shapes; no implicit migration occurs.

The tool advertises input/output schemas and read-only annotations. Successful
tool execution returns the same result in `structuredContent` and text content.
The following examples show selected fields; every result also includes the
`coverage` object described below:

```json
{
  "valid": false,
  "contractVersion": "1.1.0",
  "errors": [{
    "code": "INVALID_VALUE",
    "severity": "error",
    "path": "/page/layout/regions/0/nodes/0/props/variant",
    "message": "Use a value allowed by the contract.",
    "allowedValues": ["success", "primary", "secondary", "tertiary", "destructive"]
  }],
  "warnings": []
}
```

`valid` means no errors; warnings do not block import. Diagnostics always include
`code`, `severity`, `path` and `message`. Depending on the check, they also include
`allowedValues`, `expectedType`, or a pattern `ruleId`, `detail` and `recovery`.
An empty path identifies the document root. For legacy JSON-encoded page
definitions, paths below `/pages/N/definition` refer to the decoded definition.

## Sources and maintenance

- `system/rules/*.yaml`: authoritative requirements and machine-readable `enforcement.json` metadata.
- `system/json-model/contentCoverage.js`: runtime content and human-review coverage.
- `system/json-model/validate.js`: pure shared validator and display formatter.
- `system/json-model/model.js`: MCP discovery schemas and starters from the same artifact.
- `scripts/build-json-contract.mjs`: uses the TypeScript checker at build time.
- `system/json-model/contract.generated.json`: generated, never hand-edited.
- `apps/a1-web/src/editor/pageTypes.ts`: page envelope, nodes and registered type union.
- `apps/a1-web/src/projects/projectImportTypes.ts`: portable import/export envelope,
  used by `exportProjectJson`; optional fields retain the existing import defaults.
- React `.d.ts` exports: props, inherited native attributes, unions and nested shapes.
- Adapter `getDefaultConfig()` return types: additive serializable config keys.
  `system/json-model/adapter-contracts.json` documents the small set of explicit
  JSON-only contracts (Slot, Outlet, Tabs content, split-button config and pagination).
- Formal pattern manifests override React-only slot types and remain authoritative.
  `validatePatterns` supplies area, locked-prop, collection and migration rules.

After changing any of those sources, run `npm run build:json-contract`,
`npm run build:mcp-index` and `npm run test:json-validation`.
`npm run json-contract:check` rejects stale generated output. A1 Web builds,
MCP deployment and the contract CI job run that gate. No TypeScript compiler or
app component code runs inside the validation service. The shared module can
serve an HTTP API later without introducing a second validator.

## Checks and boundaries

Validation covers envelope and node structure, required fields, registered types,
known props, literal values/types, responsive objects declared by the component,
duplicate IDs, GridItem/ListItem placement, leaf nodes, Slot limits, nested Tabs
content and formal pattern areas/collections, including nested VerificationDialog.
Project checks include duplicate page IDs, missing parents, parent cycles and
local `?page=` links. A single page receives a warning for page links because
the surrounding project is unavailable. The page and shared-layout editors pass
their known project page IDs as the validator's optional second argument
(`{ pageIds }`), so valid links resolve and missing destinations produce the
same `BROKEN_REFERENCE` errors as bundle validation. This context is separate
from the JSON request: standalone MCP page requests and reusable patterns retain
the warning, and project validation always uses the bundle's own IDs.
Ordinary app routes and external URLs
are not fetched or treated as project IDs. Legacy blank pages and JSON-encoded
definitions remain accepted. Unknown components now block import instead of
silently producing a renderer fallback.

Advisory checks preserve the prior import linter's section width/padding, sibling
card layout, card image proportions and duplicate project headers, and add single
primary actions, nested card interactions and inline styling guidance. They
are a documented subset of A1 design rules, not enforcement of every YAML rule.

Data-bound values cannot be evaluated without runtime data; incompatible literal
types containing bindings emit `BOUND_VALUE` warnings. TypeScript `any`, `unknown`
and generic data records remain open JSON. Untyped adapter collections receive
only their known structural checks; complete semantic validation requires an
explicit adapter contract. React callbacks and elements are not portable JSON;
use declared actions, content, children and governed pattern nodes instead.

Validation bounds work to 2 million string/key characters, 50,000 visited values
and 80 nesting levels. It rejects malformed, non-JSON and circular inputs.
No scripts, HTML, CSS, actions or remote references are executed. These checks do
not certify rendered visual layout, contrast, keyboard behavior, screen-reader
experience or custom-block accessibility. Those require rendering checks.

## Content rules and coverage (A1-2741)

`get_json_model` includes the rule catalog, component scope and automated-check
metadata alongside its starter/schema. Rules without automated checks remain
mandatory and are explicitly assigned to rendering or human review. The generated
JSON contract and MCP rule index read the same YAML; do not duplicate rule policy
in the editor, preview service or transport handlers.

Capitalization checks have been removed. All-caps content, title-case headings,
proper names, acronyms and casing transforms are accepted without casing errors
or warnings. There is no acronym exception list. Sentence case remains writing
guidance, and validation never rewrites authored text. Structure, prop types,
references and formal pattern contracts still gate import and preview creation.

Every result includes `coverage`: schema checks, rules requiring review, deferred
dynamic/opaque fields, rendering checks and human-review topics. `automatedRules`
is currently empty because no catalog rule has a dedicated JSON content checker;
structural and formal-pattern checks are still reported under `schema`.
`completeCompliance` is always false. Bound data, resolved localization, custom
markup, arbitrary datasets and runtime CSS need rendered review.

Regression coverage accepts capitalization across MCP, HTTP previews, imports
and the page editor, while malformed structure and invalid props remain blocked.
No CSS, tokens or shared component API changed as part of removing casing gates.

## Standards review

No CSS, inline styles, visual tokens, layout rules or new UI components were
added. Existing A1 Code, Banner, Paragraph and Dialog present the results. The
import Dialog now explicitly receives its localized accessible name; shared
Dialog title-to-name defaults would benefit from a separate system improvement.
Existing JSON drafts remain editable when invalid, while import and preview
require valid structure and formal pattern contracts. Diagnostics use stable labels with es/fr/de/pt/ja/zh/ar
translations; technical paths, codes and allowed values remain literal.

The shared layer replaces duplicated import validation. Generated schemas are
checked into the repository to keep browsers and MCP independent of build-time
TypeScript. The explicit adapter contract is a documented local boundary; future
adapter shape changes must update it alongside the renderer. No component API,
theme, motion, focus model or responsive styling changed. Browser tests cover
import repair and draft preservation, page-editor repair, dialog bounds at
xs–xl under base/light/accessible/heritage, and a focused axe scan. Node tests
cover MCP discovery/repair parity, malformed input, props, versions, references,
formal-pattern examples, warnings and label coverage. No deployed endpoint or
manual assistive-technology audit is claimed.

## Temporary rendered previews

### Preview import diagnostics

`usePreviewImport` checks the current import contract before creating a project.
Failures open `PreviewImportErrorDialog` until dismissed, with a return link to
the original preview and a copyable report. Preserve the preview ID, timestamp,
stage (`workspace`, `fetch`, `validation` or `import`), original error and HTTP
status when available. Keep structured validation errors intact, including codes,
JSON Pointer paths, rule IDs, offending text, suggestions and recovery guidance.
Do not collapse these into a generic retry message or a transient snackbar.
Explain validation failures without implying that retrying repairs JSON.
Capitalization is accepted by both preview and import validation.
Do not include auth credentials, account IDs, full snapshots or HTTP response
bodies in diagnostic reports. Unknown import exceptions retain their message;
promise-returning import callbacks are awaited so rejection cannot report success.

The dialog reuses A1 components with no custom CSS or tokens. Browser regression
coverage includes validation, workspace hydration, HTTP, network, malformed JSON
and structural failures, plus existing successful imports and expiry cases.
The dialog's accessible name, Escape dismissal, theme/breakpoint fit and focused
axe scan are checked in the structural-failure regression.

### Creating and viewing snapshots

After validation, call `create_preview` with the same `{ kind, document,
contractVersion? }` arguments. It validates again and returns the standard
validation result, plus `previewId`, `previewUrl` and `expiresAt` only when valid.
Invalid JSON creates no snapshot. Existing stored snapshots retain their authored
content until expiry: viewing still checks structure, references and pattern
contracts. Capitalization is not validated.
Editing as a new project still passes the current import checks. For example:

```json
{
  "name": "create_preview",
  "arguments": {
    "kind": "page",
    "document": {
      "schemaVersion": "1.1.0",
      "page": {
        "id": "home",
        "name": "Home",
        "layout": { "type": "PageLayout", "regions": [{ "id": "main", "nodes": [] }] }
      }
    }
  }
}
```

Successful output includes:

```json
{
  "valid": true,
  "contractVersion": "1.1.0",
  "errors": [],
  "warnings": [],
  "previewId": "<expiry timestamp>-<random capability>",
  "previewUrl": "https://a1design.app/preview/<previewId>",
  "expiresAt": "<ISO 8601 timestamp>"
}
```

Open `previewUrl` in a browser, inspect/screenshot the real A1 components, then
submit revised JSON for a new URL. The snapshot is immutable and expires after
30 days. Anyone with the URL can view it until then; it is not an authenticated
workspace, saved project or publication. `create_preview` advertises a write
annotation because it stores an expiring snapshot. `validate_json` remains
read-only. Browser automation can wait for `html[data-a1-preview-state="ready"]` inside the preview iframe;
loading, expired, missing, invalid and rendering-error states are explicit.

The same service is available over HTTP on the MCP host:

- `POST /previews` with the same JSON body: 201 with URL and diagnostics, or 422
  with validation diagnostics and no preview. Malformed request JSON is 400.
- `GET /previews/:id`: snapshot `{ kind, document, contractVersion, expiresAt }`;
  404 for missing/malformed IDs, 410 for expired IDs, 503 for unavailable storage.
- Responses are `no-store`; retrieval is public by unguessable capability URL.
  No list, workspace import, overwrite or publication endpoint exists.
- Preview documents are limited to 2 MB UTF-8, within a 3 MB request envelope;
  oversized requests return 413. The shared structural limits also apply.

### Rendering and isolation

`apps/a1-web/json-preview.html` is a separate Vite entry point backed by
`src/preview/main.jsx`, with no auth, analytics, cloud-sync or workspace providers.
It renders through `RenderPageDefinition`, `buildProjectNav` and
`resolveAutoBreadcrumbs`. Project pages, parent hierarchy, blank pages and
JSON-encoded definitions work without importing anything into local storage.
Page navigation uses URL fragments, supports Back/Forward and preserves deep
links. `?theme=<app theme value>`, `?mode=dark` and `?locale=<language>` support
visual checks; themes default to the submitted project's theme or the A1 base.

The `/preview/:id` route serves a trusted `preview.html` host with a collapsible A1 attribution banner
in the viewport footer. Generated content stays in a `sandbox="allow-scripts"`
iframe. Netlify also sends `Content-Security-Policy: sandbox allow-scripts` for
the direct `json-preview.html` URL, with same-origin framing allowed. The preview has an opaque origin and cannot
read A1 cookies, local storage or IndexedDB, submit forms, open popups or escape
into an opener. Public compiled assets allow anonymous cross-origin reads so
module loading works within that sandbox. Referrers are suppressed. Vite dev
and preview apply the same headers and route mapping for local tests. The trusted
host uses AuthProvider; the generated document receives no session or tokens.

External public image URLs can render. Workspace-only assets, custom icon fonts,
labels and datasets are not copied into snapshots; provide portable content and
public asset URLs. Existing renderer behavior remains authoritative: internal
`?page=` links work, while reserved declarative actions and backend submissions
remain unimplemented. CustomBlock retains its own nested sandbox. Validation is
not a rendering or runtime accessibility certification; rendering failures show
an explicit error state instead of a blank page.

### Hosting and verification

The MCP site stores snapshots in a dedicated Netlify Blobs store (no Supabase
migration or workspace credentials). It uses the installed Blobs client and
strong consistency. The name is scoped by Netlify `CONTEXT`, defaulting to
production. New snapshots receive 30 days; existing snapshots retain their recorded
expiry. Browser countdowns use bounded waits to avoid the signed 32-bit timer
limit. `preview-cleanup` runs hourly to remove expired snapshots; read-time
expiry rejects them even before cleanup, and an open viewer clears at expiry.
Netlify runs scheduled functions on production; branch/deploy-preview stores
require manual cleanup when testing on those contexts.

Deploy both the MCP functions and the A1 Web build to enable the complete flow.
`A1_PREVIEW_APP_URL` on MCP defaults to `https://a1design.app`.
`VITE_A1_PREVIEW_API_URL` on A1 Web defaults to `https://mcp.a1design.app`.
For local end-to-end work, run the MCP site with Netlify Dev on port 5190 and
point the viewer build at `http://localhost:5190`; set the MCP app URL to the
local viewer origin. No raw document is included in the returned URL.
The preview HTTP function has a per-IP/domain limit of 60 requests/minute;
MCP has 120 requests/minute through Netlify's function rate-limit configuration.

Tests use an in-memory implementation of the Blobs interface with the actual
MCP/HTTP handlers and shared validator. `npm run test:json-validation` covers
creation, parity, immutability, failed validation, expiry, cleanup, missing IDs,
request limits and storage failures. Run
`npm run test:json-preview` (an isolated build with mocked Supabase configuration) for creation-to-browser rendering, navigation,
history, storage isolation, error states, all four required themes and xs–xl,
and focused axe checks. Live Netlify storage and scheduling require deployment;
these local checks do not claim a production deployment.

### Preview standards review

The preview composes existing A1 PageTitle, Section, Banner, Paragraph and
TopHeader with the shared renderer. Page titles remain flush with their
container. No new component API, tokens, visual values or custom interaction
widget was added. The `body { margin: 0 }` reset is legitimate standalone HTML normalization,
matching the app. A local native-iframe rule sets full inline/block size, block
display and no border; PageLayout owns all surrounding layout. The embedding
boundary requires a sandbox, so the existing editor portal frame is not used.
Existing responsive visibility rules were extracted into one shared stylesheet
to avoid duplication. No visual tokens or arbitrary sizing values were added. New loading/error/blank copy is in `json-preview.json`
with all seven supported locale translations. State handling remains local to
the isolated entry, and errors use existing Banner semantics. No bespoke focus,
motion, hover or touch behavior was introduced. The viewer deliberately uses
the existing renderer's runtime boundaries rather than simulating backend
behavior. The new service is shared by HTTP and MCP, with explicit expiry and
failure paths; no second validation contract was introduced.


The isolated viewer shows a centered, indeterminate A1 CircularProgress while
loading its snapshot, using the localized loading text as its accessible name.
Error and expiry states retain their explanatory banners.

### Edit a preview as a project

The trusted preview banner shows **Edit as project** to everyone. It stays
disabled until AuthProvider has resolved the current identity and a valid,
unexpired snapshot is available. Guests edit a copy saved in this browser;
signed-in users edit a copy in their existing workspace.
The expanded A1 Banner sits in PageLayout’s viewport footer, reserves space
below the iframe and links **Made with A1:Design** to `/`. Its close control
collapses it to a small floating Button with that same text; this button reopens
the banner rather than navigating. State is local to the current visit. Focus
moves to the remaining control on collapse and back to the close control on
expansion. The iframe remains mounted and keeps its navigation state.
The banner is a quiet group, not a live alert. There is no mobile menu.
The banner stays outside the sandbox; only page-navigation hashes cross the
frame boundary. Frame messages cannot request imports or supply project JSON.

A click creates a short-lived, single-use sessionStorage intent bound to the
current user ID or `null` for a guest and opens the existing Projects workspace.
Signed-in imports wait for initial cloud hydration to succeed; guests use local
storage without cloud writes. Both fetch the snapshot again, check expiry and
validate the contract again, then call `importProjectJson` and open the first
page directly in the editor. Normal browser-local or workspace cloud persistence
handles edits. Success/failure feedback uses the existing Snackbar. A bare URL,
expired intent, sign-in change or refresh cannot repeat the import. The shared
preview remains immutable until its original expiry. That expiry does not
delete the imported project copy.

Page and project imports allocate fresh workspace IDs. The shared import helper
now remaps internal page hrefs, declared navigate targets and Figma page links
along with parent references, while keeping authored text and source unchanged.
The import button and status copy are translated in all seven supported locales.
Browser coverage includes guest page/project editing, local persistence, source
immutability, sign-in changes, signed-in page/project imports, keyboard
activation, xs–xl banner fit, collapse/reopen focus, duplicate prevention, expired snapshots and
failed workspace hydration. Auth and cloud responses are mocked; no production
account or workspace is touched by those tests.

The collapsed attribution’s local CSS only anchors the existing A1 Button to
the viewport using spacing/sticky tokens and the device safe-area inset. A1
Banner, Stack, Link, IconButton and Button own all visual styling;
PageLayout owns expanded sizing. Use a row Stack for the intrinsically sized
Banner action; ButtonContainer’s inline-size containment collapses its width
in that slot. A reusable viewport-anchor utility would be
appropriate if this positioning is needed in other surfaces; no new visual
component or token was necessary.
