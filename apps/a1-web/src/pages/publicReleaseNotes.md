# A1 public release notes

## Unreleased

- **Release baseline testing** — Every A1-Web route now has automated page-load,
  visual-regression and accessibility checks before publishing can continue.

## 0.30.0 — 2026-07-24

### Highlights

- **Figma and A1 round trip** — More components can move between Figma, editable A1 JSON, configurators, and the page or pattern editor without losing their supported properties and content.
- **Broader Figma library** — New token-bound assets and Code Connect templates expand coverage across navigation, typography, inputs, data, feedback, and layout components.
- **Figma Foundations** — A new Foundations category explains the A1:Figma plugin end to end and establishes a dedicated Components page for embedded library views.
- **JSON playground and local handoff** — Structured component or page JSON can be previewed in A1 and sent to the open Figma plugin through the local bridge.
- **Virtual product and engineering reviews** — Backlog tickets can ask a Codex-backed Product Owner and engineer for focused clarifying questions and supplemental build guidance, with deterministic fallbacks when the bridge is unavailable.
- **Dispatch theme** — A warm editorial theme adds cream paper surfaces, ink typography, accessible azure actions, a yellow warning accent, and an expressive three-font stack.
- **Release stories** — New blog articles explain the Figma workflow, the virtual team review model, and the design decisions behind Dispatch.

## 0.29.0 — 2026-07-13

### Highlights

- **Component JSON bridge** — Button, Section, Text Field, Menu, Dialog, Radio Group, and Checkbox Group can move between Figma component instances and editable A1 JSON.
- **Local Codex review** — The editor can send a page definition to a read-only local Codex bridge and show structured findings without exposing shell access to the browser.
- **Smarter icon finding** — Plain-language icon suggestions use the local Material Symbols and project custom-icon registries, with invalid names filtered before display.
- **Project publishing and routing** — Projects can publish stable prototype links, keep navigation inside the project, and choose top-header or sidebar navigation.
- **Governed editor improvements** — Pattern edits propagate while preserving unlocked instance overrides, every addable component has an editor configurator, and project pages include a screen-reader report.

## 0.28.0 — 2026-07-07

### Highlights

- **Project-scoped themes** — Projects can store a theme that follows export, import, cloud sync, editing, and published previews without changing the surrounding A1 app.
- **Section separators and accent cards** — New layout treatments support shaped transitions between section surfaces and stronger action-colour cards.
- **Chart components** — A dedicated Data Viz category adds governed Recharts components and configurators for common Cartesian, radial, hierarchy, and flow charts.
- **More responsive navigation** — TopHeader gains a searchable submenu slot, while project and editor navigation continue to use shared A1 patterns.
- **Release-ready component coverage** — Figma, configurator, editor, and documentation coverage expanded across core components.

## 0.27.0 — 2026-07-07

### Highlights

- **System dashboard** — A new Explore dashboard summarizes backlog health, component coverage, token volume, rules, labels, and system flow.
- **Data Viz workspace** — Separate component pages make charts easier to discover, configure, and add to projects.
- **Figma Dialog and Menu** — Token-bound Figma assets document the visual contract for two important overlay components.
- **Theme consistency** — System light and forced Light now resolve the same generated color contract while preserving theme-specific surfaces.
- **Backlog reliability** — Cloud reads page through every ticket and generated Figma tickets no longer churn timestamps on load.

## 0.26.0 — 2026-07-06

### Highlights

- **Presentation walkthrough** — A focused keyboard-navigable deck presents the A1 product, AI, and software-creation story without the normal app chrome.

## 0.25.0 — 2026-07-06

### Highlights

- **Public release notes** — Releases now include searchable, simpler public summaries alongside detailed implementation notes for each package.
- **Figma foundations** — Text Field joins the Figma library, component coverage becomes visible in A1, and missing Figma assets are tracked through generated backlog tickets.
- **Backlog table filters** — All tickets can be filtered by type, status, priority, size, and scope without losing formatted table values.
- **Overlay and Tooltip configurators** — Both components gain complete A1 web pages with live controls, rules, properties, and generated snippets.
- **Priority Guide previews** — Priority Guide previews focus on the standard wireframe view, and Tree Menu’s component page demonstrates collapsed navigation more clearly.

## 0.24.0 — 2026-07-05

### Highlights

- **Planning workflows** — Ticket creation, merging, review, and mobile toolbars are smoother and easier to follow.
- **Snackbar improvements** — Snackbars are easier to see across light and dark themes and can be previewed in richer configurations.
- **Build planning guidance** — Build plans now include stronger review prompts for accessibility, design-system usage, labels, testing, and standards debt.
- **Responsive project actions** — Project page actions adapt better across small and large screens.
- **Button loading state** — Loading buttons now use the shared progress indicator for a more consistent experience.

## 0.23.0 — 2026-07-04

### Highlights

- **Priority guides** — A new editor helps teams turn content priorities into structured A1 pages and wireframe previews.
- **New ticket shortcut** — A global shortcut makes it faster to open the ticket creation flow.

## 0.22.0 — 2026-07-03

### Highlights

- **Sync controls** — Account settings now include a manual sync action for refreshing shared workspace data on demand.

## 0.21.0 — 2026-07-02

### Highlights

- **Chip component** — Chips are now available in the component library and editor for filters, selection, and navigation patterns.
- **Complete add catalog** — The editor Add panel now exposes the full component catalog.
- **Action Tiles** — A new Action Tiles component supports grouped task and navigation choices.
- **Help assistant** — Help is easier to access through a lightweight assistant and a shared help content model.
- **Smarter component discovery** — Component search now handles aliases, related terms, and common misspellings.
- **DataTable enhancements** — Tables gained better mobile layouts, filtering, page-size controls, and configurable columns.

## 0.20.0 — 2026-07-01

### Highlights

- **Section backgrounds** — Sections can now be configured with background images and contrast overlays.
- **Account access** — Settings now makes sign-in, account access, and sign-out easier to find.
- **Project definitions** — Project JSON can be reviewed and edited before copying.
- **Layer renaming** — Editor layers can be renamed directly from the layer tree.

## 0.19.0 — 2026-06-30

### Highlights

- **Pattern creation** — Page selections can be converted into reusable patterns from the editor.
- **Ticket navigation** — Ticket review gained previous and next controls.
- **Editable rules** — Rules can now be edited with examples for clearer governance.
- **Paste image support** — Ticket dialogs accept pasted images for faster visual feedback.
- **Stat component** — The Stat component is available with configuration and documentation.
- **Kitchen sink preview** — A new page shows many A1 components together for cross-theme review.
- **Component examples** — Component pages can include focused example configurations and direct example routes.

## 0.18.0 — 2026-06-29

### Highlights

- **Toolbar overflow** — Toolbar examples and controls better demonstrate responsive overflow behavior.
- **Motion foundations** — Motion examples show reusable timing and easing patterns.
- **Web components setup** — Getting-started guidance now includes Web Components.
- **Image library** — Image assets are now managed in a dedicated workspace.
- **Page title pattern** — Page headers now share a governed page title area pattern.
- **Color foundations** — Color ramps gained a finer 25 step for more precise theme work.

## 0.17.0 — 2026-06-28

### Highlights

- **Global shortcuts** — Keyboard shortcuts now make search, navigation, help, and ticket creation faster.
- **Home navigation** — Mobile navigation now includes a clear Home entry.
- **Home tools** — The home page now highlights key workspaces and tools.
- **Project deletion** — Deleted projects stay deleted after sync.
- **Backlog export** — Backlog data can be exported for review and reporting.

## 0.16.0 — 2026-06-27

### Highlights

- **Design-system cleanup** — Many app layouts now use shared A1 layout components instead of one-off styling.
- **Label translation foundation** — More app text can be managed through the shared label and translation system.
- **Label editor** — A workspace editor supports label editing, translation, export, and history.
- **TopHeader dividers** — Header actions can now be separated visually in a consistent way.

## 0.15.0 — 2026-06-25

### Highlights

- **Custom icons** — Projects can manage custom icons alongside the shared icon set.
- **Sample projects and data** — New sample content demonstrates data-connected pages and richer project previews.
- **Purpose-based navigation** — Main navigation is organized around Explore, Foundations, Components, and Editors.
- **Backlog updates** — Planning tools gained stronger ticket types, review helpers, and decision tracking.
- **Color foundations** — Foundation pages now better explain token tiers and theme flow.

## 0.14.0 — 2026-06-24

### Highlights

- **Theme workspace updates** — Theme editing and previews became easier to inspect and adjust.
- **Foundation improvements** — Color and system-map pages gained clearer explanations and visualizations.
- **Backlog review tools** — Planning review flows were expanded for product and design feedback.

## 0.13.0 — 2026-06-23

### Highlights

- **Editor and component polish** — Editor controls, component previews, and configuration flows received broad usability improvements.
- **Navigation improvements** — Key workspaces became easier to discover from the main app shell.
- **Help content** — More guidance was added for common A1 workflows.

## 0.12.0 — 2026-06-22

### Highlights

- **Backlog search** — Planning views gained smarter search and filtering.
- **AI usage visibility** — AI-assisted actions now make usage easier to understand.
- **Build planning** — Tickets can generate more useful work plans.

## 0.11.0 — 2026-06-22

### Highlights

- **Ticket organization** — Ticket details were reorganized into clearer sections.
- **Duplicate management** — Similar tickets can be reviewed and combined.
- **Backlog reliability** — Planning data and review flows became more dependable.

## 0.10.0 — 2026-06-21

### Highlights

- **Backlog workspace** — The backlog became the main place to plan and review A1 work.
- **Help screenshots** — Help articles gained visual examples for key workflows.
- **Page navigation** — Long help pages became easier to scan and navigate.
- **About page** — A new About page explains the purpose of A1 and links to major areas.

## 0.9.0 — 2026-06-20

### Highlights

- **Editor layout fixes** — Editor actions and canvas layout became more stable.
- **Card configurator updates** — Card previews gained richer badge and hero options.
- **TopHeader polish** — Navigation states became clearer.
- **Code component polish** — Collapsible code examples became easier to use.

## 0.8.0 — 2026-06-19

### Highlights

- **Optional AI features** — AI-assisted tools can be enabled only when teams want them.
- **Collapsible code** — Large code blocks can collapse for easier scanning.
- **Grid alignment** — Grid previews gained better alignment controls.
- **Inline editing** — Text with inline styling became easier to edit in the editor.

## 0.7.0 — 2026-06-19

### Highlights

- **Shared history** — Project editing history became easier for teams to review.

## 0.6.0 — 2026-06-19

### Highlights

- **Presence and refresh safety** — Shared editing became safer when collaborators are active.

## 0.5.0 — 2026-06-19

### Highlights

- **Foundational editor work** — Early editor, project, pattern, and theme workflows were expanded into a broader workspace.

## 0.3.0 — 2026-06-17

### Highlights

- **Early A1 web experience** — The app gained core navigation, component exploration, and early editor workflows.

## 0.2.0 — 2026-06-15

### Highlights

- **Initial release notes** — Early release history was added for the first A1 web milestones.
