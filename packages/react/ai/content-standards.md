# A1 content standards for agents

The canonical, public standard is
[`packages/react/guidelines/content-standards.md`](../guidelines/content-standards.md).
Read it before authoring or editing product copy, documentation, examples,
release notes, labels or AI-generated content.

## Scope

This is documentation-only guidance. Do not add lint rules, prompt injection,
templates, validators or other enforcement unless a separate ticket requests
them.

## Decision order

Apply content sources in this order:

1. Preserve approved legal, regulatory, policy and factual content, and
   people's names, identities and stated pronouns.
2. Apply explicit A1 terms and overrides from the public content standard or an
   approved product glossary.
3. Apply the current AP Stylebook.
4. Use AP's listed dictionary when AP does not answer the question.

Do not silently "fix" approved Priority Guide content. Flag a conflict for the
content owner and system owner to resolve.

## Non-negotiable A1 overrides

- Use sentence case for headings and interface copy, even when a source style
  would otherwise use title or headline case.
- Preserve **A1 Design System**, **A1**, official brand names, code identifiers,
  package names and token paths exactly.
- Never transform user-facing copy to uppercase in content, CSS or JavaScript.
- Use figures for values people scan, compare, enter or act on in an interface,
  even where AP prose would spell out a small number.
- An en dash is allowed for a compact range in UI copy (`10–12 items`); prefer
  "from 10 to 12 items" in prose.
- Use locale-aware formatting outside English. Do not force English phone,
  address, date, time, number or currency patterns on other locales.

## Agent review

Before returning content:

1. Identify whether the text is approved source content, interface copy,
   documentation, code or user-supplied data.
2. Preserve facts, hierarchy, order and exact values.
3. Apply the public standard and existing product terminology.
4. Check clarity, recovery language, inclusivity, accessibility and
   localization context.
5. Surface unresolved conflicts or missing facts instead of inventing a
   decision.
