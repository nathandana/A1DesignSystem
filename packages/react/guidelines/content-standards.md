# A1 content standards

Use these standards for English product copy, documentation, examples, release
notes and AI-generated content. They define how A1 writes; they do not add
linting or other automated enforcement.

## Source hierarchy

When guidance conflicts, use this order:

1. Preserve approved legal, regulatory, policy and factual content, and respect
   people's names, identities and stated pronouns.
2. Follow explicit A1 terms and overrides in this document or an approved
   product glossary.
3. Follow the current [AP Stylebook](https://www.apstylebook.com/) for spelling,
   grammar, punctuation and usage.
4. Use [Merriam-Webster](https://help.apstylebook.com/support/solutions/articles/66000524228-merriam-webster-is-our-primary-dictionary-now),
   AP's primary dictionary, for questions the Stylebook does not answer.

AP Stylebook Online changes during the year. Check the current entry when a
word or rule is disputed instead of relying on memory. If the sources still do
not settle a decision, choose the clearest plain-language option and document
the new A1 decision here before treating it as a standard.

Approved content remains approved content. Flag a conflict with these standards
instead of silently rewriting a Priority Guide, legal text, proper name or
source value.

## Voice and tone

A1 content is clear, direct and calm.

- Lead with what the reader needs to know or do.
- Use active voice and present tense when they are natural.
- Address the reader as "you." Use "we" only when A1 or the product is truly
  taking the action.
- Prefer familiar, specific words over jargon. Define a necessary technical
  term on first use.
- Use contractions when they make a sentence sound natural.
- Keep each sentence and paragraph focused on one idea.
- Do not add "please" to routine instructions or blame the reader for an error.
- Never invent facts, results, dates, names or capabilities to make copy feel
  complete.

Tone can change with the situation, but the voice does not. Success copy can be
brief and positive. Errors and warnings should be factual, respectful and
focused on recovery; do not use jokes where someone may have lost time, work or
access.

## Casing and names

A1 uses sentence case throughout its product and documentation, including where
a source would otherwise use title or headline case.

- Use sentence case for page titles, headings, buttons, links, navigation,
  tabs, menu items, field labels, badges and table headings: "Create account,"
  not "Create Account."
- Capitalize proper nouns, registered product names and acronyms as their owners
  style them.
- Use **A1 Design System** on first reference when the full name helps. Use
  **A1** afterward.
- Preserve code and repository names exactly, including `a1-web`,
  `@gtivr4/a1-design-system-react`, prop names and token paths.
- Do not use all caps for emphasis, and do not use CSS or JavaScript to change
  the case of user-facing text.
- Do not imitate unconventional brand casing when referring to a generic
  concept. Preserve it only when it is part of the official name.

## Grammar and word choice

- Write complete sentences for explanations and instructions.
- Keep the subject and verb close together. Prefer "A1 saves your changes" to
  "Your changes will be saved by A1."
- Use the imperative for instructions: "Choose a theme."
- Use parallel grammar in lists and groups of actions.
- Use singular "they" when a person's gender is unknown or when it is the
  person's stated pronoun.
- Describe people in the way they describe themselves. Mention identity,
  disability, age or other personal characteristics only when relevant.
- Avoid idioms, cultural references and directional language that may not
  translate or may depend on visual position.

## Punctuation

Follow AP punctuation unless an A1 rule below is more specific.

- Omit the final comma in a simple series unless it prevents ambiguity.
- Use one space after sentence-ending punctuation.
- Use a spaced em dash for an abrupt break — like this — and use it sparingly.
- Use an en dash without spaces for a compact numeric or date range in UI copy:
  `10–12 items`. This compact-range form is an A1 digital-content override. In
  prose, prefer "from 10 to 12 items."
- Use "and" instead of `&` unless the ampersand is part of an official name or a
  genuinely space-constrained, well-understood label.
- Avoid slashes for vague alternatives such as "and/or." Rewrite the sentence
  so the relationship is clear.
- Do not add a period to a heading, button, navigation item, tab, menu item or
  short field label. Use punctuation for full-sentence help, warning and error
  text.

## Numbers, measurements and money

Follow AP's numeral rules in prose: generally spell out zero through nine and
use figures for 10 and above. Use these A1 digital-content exceptions:

- Use figures for values people compare, scan, enter or act on in an interface,
  including counts, steps, limits, measurements and statistics: "3 files,"
  "Step 2 of 4," "8 GB."
- Use numerals with `%`: `5%`.
- Use commas in numbers of four or more digits: `1,250`.
- Use a leading zero for a decimal smaller than one: `0.5`.
- Keep a number and its unit together. Use the conventional unit symbol and do
  not pluralize symbols: `8 GB`, `5 km`. In code, preserve the required syntax,
  such as `12px`.
- Use the currency symbol when the currency is clear: `$25`. Add an ISO currency
  code when readers could reasonably interpret the symbol differently:
  `US$25` or `25 USD`.
- Avoid starting a sentence with a number. Rewrite when spelling it out would
  make a value harder to recognize.
- In prose, spell out ordinal numbers from first through ninth and use figures
  from 10th onward. Compact UI steps may use figures at every position.

Use locale-aware formatting for localized interfaces. The examples above are
the English default, not a format to force on every locale.

## Dates and times

- Write month, day and year in that order for English prose: `July 24, 2026`.
  Do not use ordinal endings in dates.
- With a specific day, abbreviate Jan., Feb., Aug., Sept., Oct., Nov. and Dec.:
  `Jan. 8, 2026`. Spell out March, April, May, June and July. Spell out every
  month when it appears with a year but no day.
- Avoid ambiguous all-numeric dates such as `7/8/26`. Use an ISO date
  (`2026-07-08`) only in technical content, data or filenames.
- Use `9 a.m.`, `9:30 a.m.`, `noon` and `midnight`. Do not write `9:00 a.m.`
  when the minutes add no information.
- Include the time zone when readers may be in different zones. Do not use
  "local time" unless the relevant location is unmistakable.
- Use locale-aware date and time formatting in localized products; do not build
  display strings by concatenating translated fragments.

## Phone numbers

- Display U.S. and Canadian numbers with hyphens:
  `212-555-0123`. Do not put the area code in parentheses.
- Add an extension as `ext. 204`.
- Include the country code for an international or cross-border audience:
  `+1 212-555-0123`.
- For non-North American numbers, use `+`, the country code and the customary
  local grouping: `+44 20 7946 0958`. Do not force every number into a U.S.
  pattern.
- When a number is callable, use its normalized international value in the
  link, such as `tel:+12125550123`, while keeping the readable format visible.
- Never use a fictional number that could reach a real person. Use a range
  reserved for examples in the relevant country.

## Addresses

Preserve the official spelling and formatting of a supplied address. Do not
translate, expand or "correct" a person's or organization's address without a
verified source.

For U.S. addresses in prose:

- Use figures for a numbered address.
- Abbreviate `Ave.`, `Blvd.` and `St.` only with a numbered address:
  `1600 Pennsylvania Ave.` Spell them out without a number:
  `Pennsylvania Avenue`.
- Abbreviate compass directions with a numbered address when they are part of
  the street name: `222 E. 42nd St.` Spell them out in general references.
- Spell out state names in prose. Use two-letter postal abbreviations in a full
  mailing address or another compact postal context.

Format a mailing address as a block when someone must copy or use it:

```text
123 Main St.
Suite 400
Boston, MA 02110
United States
```

Include the country for a cross-border audience. Follow local postal
conventions for addresses outside the United States, including line order,
capitalization, postal codes and administrative areas.

## Interface copy

- Give pages and sections short noun-based titles that describe their content.
- Start action labels with a specific verb: "Save changes," "Add address,"
  "Download report." Use "Continue" only when the next step is already clear.
- Use links for navigation and buttons for actions. Link text should describe
  the destination; do not use "click here" or expose a raw URL as prose.
- Make field labels persistent and specific. Put examples or format guidance in
  hint text, not placeholder text.
- Write empty states to explain what is missing and, when useful, what action
  creates or restores it.
- Write errors in plain language. State what happened and how to recover:
  "We couldn't save your changes. Check your connection and try again."
- Name destructive actions precisely. Prefer "Delete project" to "Confirm."
- Use the same term for the same object or action throughout a flow.

## Formatting and accessibility

- Use headings in a logical hierarchy; do not choose a heading level for its
  visual size.
- Keep list items grammatically parallel. Use periods when every item is a
  complete sentence; omit them when every item is a short fragment.
- Use bold sparingly to aid scanning, not to carry meaning by itself. Do not
  underline text that is not a link.
- Write meaningful alternative text for informative images. Use empty
  alternative text for decoration. Do not begin alt text with "Image of."
- Do not rely on color, shape, sound or position alone. Name the relevant item,
  status or action.
- Expand an unfamiliar acronym on first use. Do not add periods to common
  initialisms unless the official name requires them.
- Preserve exact casing and punctuation in commands, code, file paths, package
  names and values. Explain them in nearby prose when their meaning is not
  obvious.

## Localization

Write the English source so translators can understand it without seeing the
interface.

- Do not concatenate fragments to build a sentence.
- Give labels enough context to distinguish noun and verb meanings.
- Avoid embedding a variable where it would force English word order.
- Keep code, variables, product names and user-supplied values outside
  translatable prose when the localization system supports it.
- Let each locale format names, addresses, phone numbers, dates, times, numbers
  and currencies according to its conventions.

## Review checklist

Before publishing content, confirm:

- The source hierarchy was followed and approved wording was preserved.
- The main point or next action comes first.
- A1 names and product terms use their approved casing.
- Headings and interface labels use sentence case.
- Numbers, dates, times, phone numbers and addresses follow the relevant format
  and locale.
- Actions, links, errors and empty states are specific and useful.
- The content works without relying on visual position, color or insider
  knowledge.
- No facts, promises or capabilities were invented.
