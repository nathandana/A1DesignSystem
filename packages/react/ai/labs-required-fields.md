# Labs required fields

A comparison of five new ways to mark required and optional fields on one
complex form, from subtle to extreme, and how each marks missing fields on
submission. The variations are deliberately new alternatives: none uses A1's
existing asterisk, comfortable Required badge or field error styling. This is
not a published A1 component. Follow the
[Labs isolation contract](labs-contributing.md#isolate-experiments-and-prepare-them-for-a1).

## The form

"Request a tasting" has 16 fields in five sections: Contact, Shipping,
Preferences, Your message and Agreement. 10 are required and 6 are optional.
It mixes text, email and phone fields, selects, a textarea, a radio group, a
checkbox group and a single required terms checkbox, so every marking has to
work across the field family. Sections are A1 `Fieldset`s; related inputs share
`FieldRow`s (first/last name; city/state/ZIP), except on the rail. Fields have
browser `autoComplete` values and no placeholders.

## Variations

| # | Variation | Required | Optional | On submission | Focus |
| --- | --- | --- | --- | --- | --- |
| 1 | Margin tick | A thin accent line in the margin beside the field | Unmarked | Ticks thicken and turn red; message under each | First missing field |
| 2 | Ink lines | Solid control with a heavy base line; solid frame for groups | Dashed control or frame | Control redrawn in red; message with a spellcheck-style wave | First missing field |
| 3 | Completion rings | Hollow ring after the label, filled with a check once answered; section "N of M answered" | Unmarked | Empty rings turn red with "!"; sections say "N still needed" | First missing field |
| 4 | Opt-in extras | Everything shown is required | Hidden until added with "Add …" buttons, then labelled "optional" | "Before you send" checklist by the submit button, linking to each field | Checklist |
| 5 | Required rail (default) | Numbered stops on a vertical track; answered stops become success checkmarks; "N of 10 stops answered" | Off the track, small hollow marker, "optional" | Missing stops turn red, the track breaks into a red dashed line, a sticky bar steps through each missing field | First missing field |

Each variation states its convention in a sentence above the form, so no
marking relies on the reader guessing.

## Files and API

- `apps/a1-labs/src/required-fields/form-model.js` — pure data and logic:
  `SECTIONS`, `FIELDS` (optional fields carry an `addLabel`), `REQUIRED`,
  `VARIANTS` (`id`, `name`, `summary`, `note`, `onSubmit`, `focus`:
  `'field'` | `'checklist'`, optional `rows: false`), `emptyValues()`,
  `requiredExample()`, `validate(values)` (required, email format, 5-digit
  ZIP), `requiredProgress(values)` and `filled(value)`. Unit-tested in
  `tests/required-fields.test.mjs`.
- `RequiredFieldsForm.jsx` — `RequiredFieldsForm`, a controlled form taking
  `variant`, `values`, `errors`, `result` (`'invalid'` | `'sent'` | `'idle'`),
  `onChange(id, value)` and `onSubmit()`. Its ref goes to the checklist or
  success message so the host can move focus there. It owns only which
  optional fields have been added (remount with a `key` to reset). Also exports
  `controlId(id)` and `focusField(id)`. Depends only on React, A1 components and
  the model.
- `RequiredFieldsExperiment.jsx` — the Labs page: variation picker, "Fill
  required fields", "Reset form" and submit handling.
- `required-fields.css` — every marker and message, scoped under
  `.a1-required-fields[data-variant]`, using live semantic roles (action,
  text, border, status success/error, surface). Items expose `data-required`,
  `data-kind` (`control` | `group`), `data-invalid` and `data-done` (answered
  and valid). Rail stops are real `aria-hidden` elements holding the stop
  number or an A1 check icon.

## Accessibility

- The A1 fields get no `required` or `error` props, so A1 draws no markers.
  The experiment sets `aria-required` on required controls; groups (which can't
  carry it) get visually hidden "(required)" text in their legend.
- Missing-field messages are the experiment's own, linked to the control with
  `aria-describedby` (with the hint) and `aria-invalid` on controls. Each
  message has an icon as well as text, so colour is never the only signal.
- A rail stop turns into a success checkmark only when its answer is valid; an
  answer that fails a format check keeps its number and turns red.
- Visual-only markers (ticks, ink lines, rings, rail stops) are decorative and
  `aria-hidden` where they are elements; the note above the form explains them.
- The form uses `noValidate`. Messages appear after the first submission and
  update as fields are fixed.
- Opt-in "Add …" buttons move focus into the field they reveal. The rail's
  sticky bar is a polite status with a "Go to next" button that cycles through
  missing fields.
- A valid submission shows a focused A1 success banner. Nothing is sent.

## Recorded checks — Oct. 11, 2026

- All five variations, dark mode at desktop and light mode at phone width: axe
  reported no violations idle and after an empty submission; all 10 missing
  fields showed messages; focus moved as described; Opt-in reveal focused the
  new field; the rail's Go to next stepped to the next missing field; the
  success path worked; no console errors or horizontal overflow.
- Model unit tests pass.
- Not yet done: a screen-reader review, other browsers and every theme.
