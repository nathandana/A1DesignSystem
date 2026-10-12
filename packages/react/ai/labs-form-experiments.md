# Long forms and date-of-birth studies

Introduced in Labs 0.30.0, under the Forms sidebar category.

## Long forms

Route: `/experiments/long-form`. A fictional community-event plan with 20
sections and 3 questions per section, shared across 3 treatments:

- Paginated: choose 1 or 4 sections per page (20 or 5 pages). This consolidates
  the former pages/steps variants. Show the page count and section range;
  changing page size preserves the current section and answers. Default: 4.
- Side navigation: 20 named section buttons with current state and answer counts.
  Shared SideNav becomes an overlay at the A1 breakpoint.
- Visual grouping: all 20 section cards in one scrolling form. The persistent
  header follows the section in view or receiving keyboard focus.

`src/long-form/LongForm.jsx` is a controlled A1 composition. Inputs: `sections`
(`id`, `title`, `description`, `chapter`, `fields` with `id` and `label`),
`chapters`, `values`, `onChange(fieldId, value)`, `method` (`pages`, `sidenav`,
`visual`), `sectionsPerPage` (1 or 4, default 4), `currentSection`,
`onSectionChange(index)`, `title`, optional `onComplete(values)`. The demo groups
content into 5 named chapters. The core owns the submission/error display and
overlay focus;
its host owns answers, selected structure, section and preview configuration.
No Labs imports, network calls, persistence or custom styles exist in the core.
`form-model.js` includes the fictional content plus pure grouping/progress helpers.

The first 4 sections start filled. Configuration can fill all examples or clear
all answers. Answers and location survive structure/device changes, but remain
in memory only. Navigation is unrestricted; submission requires all 60 nonblank
answers and takes focus to the first missing field, including one in a hidden
page. Completion is explicitly a simulation. Location is separate from
completion: progress counts actual nonblank answers, never visited sections.

Use A1 PageLayout for the persistent header and scrolling content, Section/Card/
Fieldset/TextField for groups, and StickyActions with ButtonContainer for actions.
Side navigation must focus its selected item when opened, trap focus and make the
preview background inert on small screens, close on Escape and restore focus.
Navigation focuses the destination heading; errors focus the input. Scroll-only
position updates must not steal focus. All document access uses the preview's
ownerDocument. Preserve theme and reduced-motion behavior from A1; no custom
motion or local CSS is needed. This is a candidate pattern, not a shared A1 API.

## Date of birth

The 7 original studies from A1 Web now live in
`src/date-of-birth/DateOfBirthExamples.jsx`. `DATE_OF_BIRTH_EXPERIMENTS` contains
IDs, copy keys/fallbacks and renderers. A1 Web imports the same implementation,
so its `/labs/dob-*` routes remain available without a divergent copy.
In Labs the 7 studies are one experiment, `/experiments/date-of-birth`, with the
study in `?study=<id>`. The former `/experiments/dob-*` addresses redirect there
(`experimentRedirects` in `experiments.js`); one card preview, `date-of-birth.png`.
`DateOfBirthExperiment.jsx` supplies the Labs shell, input-study ChoiceGroup and reset.
Keep the selector in the right configuration panel (the shared configuration
sheet on mobile), with all 7 studies in a single column.
Render the selected study directly in the workspace, without a device frame,
iframe or viewport controls. The shared fields respond to the workspace width. Pass the selected summary as
`description` to the example; render it immediately after the prototype card
and before the testing notes, not in the configuration panel.
The reusable examples depend only on React, A1 and a `t(key, fallback)` function.

Route: `/experiments/date-of-birth`; `?study=dob-*` selects a study.
Legacy `/experiments/dob-*` addresses redirect to the combined experiment.


Preserve existing auto-advance thresholds, leading-zero formatting, masks,
current-year pivot for 2-digit years and birth-date autofill attributes. Numeric
bounds and formatting are input studies, not full calendar-date validation.
Do not silently add age policy or claim successful date validation. The original
MM/DD/YYYY examples and English month choices are retained; localization and
complete calendar validation remain promotion work. Formatted date parts have
visible labels as well as shared A1 mask overlays. Old A1 Web width overrides
were removed: FieldRow and the field components now own responsive sizing.

## Validation and maintenance

Run `npm test --workspace=a1-labs`, Labs build and A1 Web build when the shared
DOB examples change. Exercise layout switching, hidden-field errors, scrolling,
completion, phone side-navigation focus/Escape, all 7 date routes and formatting.
Use focused default-theme accessibility checks; do not repeatedly sweep themes.
Actual screen-reader speech and user preference for auto-advance need human review.

Capture previews with `npm run capture:previews --workspace=a1-labs --
http://127.0.0.1:5187 --long-form-only` or `--dob-only` (each command on one line).
Keep README, this contract, contribution guide, release notes, package version
and lockfile in sync. No custom CSS or tokens were added for these experiments.

Validation for 0.30.0: model tests cover 20-section/60-question coverage,
page boundaries, whitespace and missing answers in hidden sections. Browser
checks cover all 4 structures, retained edits, completion/error navigation and
mobile SideNav selection/Escape. All 4 structures at all 5 device presets kept
the header/actions visible without horizontal or iframe-document scrolling.
Focused axe checks passed for each structure, phone navigation open/closed and
all 7 DOB routes. DOB auto-advance, year expansion, formatting and reset passed.
Labs and A1 Web production builds passed. Card previews were captured from the
actual components and visually reviewed. No new CSS was added; the obsolete DOB
field overrides were removed. These checks do not replace screen-reader review
or establish production calendar-date validation.

In 0.30.1, pages and steps became one Paginated treatment with 1/4 sections per
page. Preserve the section anchor when changing page size; do not reintroduce
a separate steps option. Side navigation and visual grouping are unchanged.

Keep Pagination outside the form so its page buttons cannot submit the draft.
