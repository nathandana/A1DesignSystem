# A1-web translation review

This is the working review list for A1-366. It captures app-shell terms that are similar in English but may need different translations depending on product intent.

Scope for this slice: A1-web shell/navigation/settings labels. Project names, project page content, page-definition examples, and pattern names are intentionally out of scope.

| English terms | Current decision | Review question |
|---|---|---|
| Editor / Editors | Different labels: `app.page.editor` for the single page/tool, `app.nav.editors` for the tools group. | Should some locales use the same word for both, or should the group imply “authoring tools”? |
| Theme / Themes | Shell uses singular `Theme` for the editor. Existing pages may use `Themes` for the list. | Should the editor menu label stay singular, or should it describe the full theme area? |
| Label / Labels | Shell uses plural `Labels` for the editor area. Field controls may use singular `Label`. | Should “label” mean UI string, form label, or both in each locale? |
| Rules / Standards | `Rules` is an editor tool; `Standards` is a foundation group. | Are these distinct enough in each language, or should “Rules” become “Design rules”? |
| Components / Patterns | Components are primitives; patterns are reusable assemblies. | Some languages may translate both as “templates” in casual usage. Keep them distinct? |
| Projects / All projects | `Projects` names the area; `All projects` opens the list. | Is “All projects” needed in locales where the area label already implies the list? |
| Backlog / Your backlog queue | Backlog is a product-planning term; queue is the user’s notification/action queue. | Should “Backlog” remain borrowed in locales where product teams use the English term? |
| Color scheme / Theme | Color scheme means light/dark/system; theme means full brand/theme selection. | Are these distinct in the target language without extra words? |
| Locale / Language | Existing UI says `Locale` because it can include regional formatting/RTL behavior. | Should user-facing copy use “Language” instead for clarity, while technical docs keep “Locale”? |
| Custom icons / Image library | Both are asset libraries, but one is generated/uploaded icons and one is image media. | Should “Custom icons” emphasize project-scoped custom assets? |
| Accessibility / Increase contrast / Reduce motion | Accessibility is the settings group; the controls are specific preferences. | Are the control labels clear enough without “accessibility” repeated? |
| Open sidebar / Settings / Help | Icon-only accessible labels. | Screen reader labels should stay action-oriented; confirm verbs are natural in each locale. |
| Configure / Settings | `app.action.configure` is the config panel title; `app.action.settings` is the header button. | Spanish: both translate to “Configuración” in casual usage — configure uses noun form here to avoid collision. Confirm this is the right choice per locale. |
| Filters / Filter | `app.action.filters` is the backlog panel title. No singular form exists yet. | Confirm plural is appropriate; some locales treat filter-as-category as singular (e.g. German “Filter” is already plural-neutral). |

Initial locales in `system/labels/app.json`: Spanish, French, German, Portuguese, Japanese, Chinese, and Arabic.

---

## Cross-locale collision findings

These pairs share translations in at least one locale. Decisions recorded below.

| Pair | Locale | Was | Resolution | Status |
|------|--------|-----|------------|--------|
| `app.page.about` / `app.nav.overview` | Japanese | Both → “概要” | `app.page.about` ja → “紹介” (introduction). `app.nav.overview` keeps “概要”. | ✓ Fixed |
| `app.page.patterns` / `app.foundationGroup.standards` | Portuguese | Both → “Padrões” | `app.page.patterns` pt → “Modelos” (templates). `app.foundationGroup.standards` pt → “Normas” (norms/rules). | ✓ Fixed |
| `app.page.theme` / `app.settings.theme` | All locales | Identical everywhere | Removed `app.settings.theme`. Settings menu section now uses `app.page.theme`. | ✓ Fixed |
| `app.page.accessibility` / `app.settings.accessibility` | All locales | Identical everywhere | Removed `app.settings.accessibility`. Settings menu section now uses `app.page.accessibility`. | ✓ Fixed |
| `app.page.editor` / `app.settings.editor` | All locales | Identical everywhere | Removed `app.settings.editor`. Settings menu section now uses `app.page.editor`. | ✓ Fixed |
| `app.action.configure` / `app.action.settings` | Spanish | Both → “Configuración” | `configure` changed to verb form: es “Configurar”, pt “Configurar”. Settings stays “Configuración” (noun). | ✓ Fixed |
