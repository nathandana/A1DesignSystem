/**
 * Turn a backlog ticket into a **development plan** — the copy-pasteable direction shown in
 * the Backlog "Build with AI" tab.
 *
 * Two ways to produce it:
 *  - `PLAN_SYSTEM` + `buildTicketContext()` feed a **local** LLM (see `lib/localAi.ts`) so a
 *    model on your machine writes the plan — no Anthropic API, no credits.
 *  - `developPlanLocally()` is a deterministic staff-developer planner used as the fallback
 *    when no local model is reachable, so the tab always produces a real plan (and demos).
 */
import {
  COMPLEXITY_FULL, PRIORITY_LABELS, SCOPE_LABELS, STATUS_LABELS, TYPE_LABELS, ticketRef,
} from './types';
import type { BacklogComment, BacklogItem } from './types';

// ── Shared: the raw ticket context (also the local-AI user prompt) ──────────────

function metaLine(item: BacklogItem): string {
  const parts = [`Type: ${TYPE_LABELS[item.type]}`];
  if (item.priority) parts.push(`Priority: ${PRIORITY_LABELS[item.priority]}`);
  if (item.complexity) parts.push(`Size: ${COMPLEXITY_FULL[item.complexity]}`);
  parts.push(`Status: ${STATUS_LABELS[item.status]}`);
  parts.push(`Scope: ${item.scopeKind === 'general'
    ? 'General'
    : SCOPE_LABELS[item.scopeKind] + (item.scopeLabel ? ` — ${item.scopeLabel}` : '')}`);
  return parts.join(' · ');
}

/** Questions a persona asked that nobody has answered yet. */
function openQuestions(comments: BacklogComment[]): string[] {
  const answered = new Set(
    comments.filter((c) => c.kind === 'answer' && c.meta?.answersCommentId).map((c) => c.meta!.answersCommentId),
  );
  return comments
    .filter((c) => c.kind === 'question' && !answered.has(c.id) && c.body?.trim())
    .map((c) => c.body!.trim().replace(/\s*\n\s*/g, ' '));
}

/** The ticket as plain text: title, metadata, description, and the discussion thread. */
export function buildTicketContext(
  item: BacklogItem, comments: BacklogComment[] = [], linked: BacklogItem[] = [],
): string {
  const lines = [
    `${ticketRef(item.number)}: ${item.title}`,
    metaLine(item),
    '',
  ];
  if (item.description?.trim()) lines.push('Description:', item.description.trim(), '');

  if (linked.length) {
    lines.push('Linked tickets (related work — check whether they share scope or should ship together):');
    for (const l of linked) {
      const desc = l.description?.trim()
        ? ` — ${l.description.trim().replace(/\s*\n\s*/g, ' ').slice(0, 160)}`
        : '';
      lines.push(`- ${ticketRef(l.number)} (${TYPE_LABELS[l.type]}, ${STATUS_LABELS[l.status]}): ${l.title}${desc}`);
    }
    lines.push('');
  }

  const discussion = comments.filter((c) => c.kind !== 'activity' && c.body?.trim());
  if (discussion.length) {
    lines.push('Discussion:');
    for (const c of discussion) {
      const who = c.meta?.personaName || c.userEmail || 'Someone';
      const tag = c.kind === 'question' ? ' (question)' : c.kind === 'answer' ? ' (answer)' : '';
      lines.push(`- ${who}${tag}: ${c.body!.trim().replace(/\s*\n\s*/g, ' ')}`);
    }
  }
  return lines.join('\n').trim();
}

// ── Local-AI system prompt ──────────────────────────────────────────────────────

const FINAL_STANDARDS_REVIEW_SECTION = [
  '## Final standards review',
  'For anything done in this session, justify any deviation from the existing system.',
  '',
  '1. Custom styling',
  '- List any custom CSS, inline styles, one-off classes, or layout rules added.',
  '- Explain why each was necessary.',
  '- Identify what should become a design system token, component prop, pattern, or utility.',
  '- Identify what needed better design system guidance.',
  '- Identify what was legitimate local styling.',
  '',
  '2. Component usage',
  '- Confirm existing design system components were used wherever possible.',
  '- Call out any local component that duplicates an existing system component.',
  '- Identify any props, variants, or behaviours that should belong in the design system.',
  '- Note inconsistent naming, sizing, spacing, states, or composition.',
  '',
  '3. Tokens and values',
  '- List hardcoded colors, spacing, radii, shadows, font sizes, z-indexes, breakpoints, durations, or easing values.',
  '- Explain why each hardcoded value was used.',
  '- Identify which values should be replaced with tokens.',
  '- Identify missing tokens or unclear token guidance.',
  '',
  '4. Accessibility',
  '- Justify any custom interaction pattern.',
  '- Confirm keyboard behavior, focus states, labels, roles, ARIA usage, contrast, reduced motion, and touch target size.',
  '- Identify where the design system should provide stronger accessibility defaults or examples.',
  '',
  '5. Interaction patterns',
  '- List any new behavior for menus, dialogs, drag/drop, tabs, forms, notifications, loading, empty states, or errors.',
  '- Decide whether that behavior should already exist as a system pattern.',
  '- Confirm consistency with similar flows elsewhere.',
  '',
  '6. Content and terminology',
  '- List new labels, helper text, error messages, empty states, or status language.',
  '- Confirm all user-facing copy was added to system/labels/ with translations for es, fr, de, pt, ja, zh, and ar, and consumed through the label resolver.',
  '- Confirm consistency with product voice and existing terminology.',
  '- Identify copy patterns that should be standardized.',
  '',
  '7. Data and state handling',
  '- List new loading, error, empty, success, disabled, optimistic, or offline states.',
  '- Confirm those states are handled consistently.',
  '- Identify states where the design system should define visual or behavioral guidance.',
  '',
  '8. Architecture and code standards',
  '- List new utilities, hooks, helpers, types, or abstractions.',
  '- Confirm they match existing project patterns.',
  '- Call out duplicated logic.',
  '- Identify complexity that should be simplified or promoted to a shared layer.',
  '',
  '9. Responsive behavior',
  '- Explain any custom responsive rules.',
  '- Confirm mobile, tablet, desktop, overflow, wrapping, truncation, and zoom behavior.',
  '- Identify where the system needs clearer responsive guidance.',
  '',
  '10. Test coverage',
  '- List behavior that changed.',
  '- List what was tested.',
  '- List what was not tested and why.',
  '- Identify design system contracts or regression tests that should exist but do not.',
  '',
  '11. Standards debt created',
  '- List intentional shortcuts.',
  '- List places where the implementation works but may not match system standards.',
  '- For each item, recommend: fix now, document, promote to system, or accept as local.',
].join('\n');

export const PLAN_SYSTEM = [
  'You are a pragmatic staff software engineer planning one ticket in the A1 Design System —',
  'a token-driven, multi-package monorepo: a React component library in packages/react, Style',
  'Dictionary tokens in system/, HTML/CSS + React Native packages, and the a1-web app in apps/a1-web.',
  '',
  'House rules the plan must respect:',
  '- Use existing A1 components, patterns, and tokens before anything custom; never hardcode',
  '  colours, spacing, type, radii, or motion — every value traces to a Style Dictionary token.',
  '- Semantic, accessible HTML (keyboard, focus, ARIA, WCAG AA); sentence case, never uppercase.',
  '- Any user-facing label, helper text, status, error, empty-state, or action copy must be',
  '  added to the label system in system/labels/ with English $value, $description, and',
  '  supported locale translations (es, fr, de, pt, ja, zh, ar), then consumed through the',
  '  label resolver instead of hardcoded text.',
  '- When a component API/variant/state changes, update its Storybook stories, the a1-web',
  '  configurator, and the relevant changelogs in the SAME change.',
  '- Validate across themes (base, a1-light, accessible, heritage) and breakpoints (xs–xl).',
  '',
  'Produce the MINIMUM ELEGANT plan to ship this ticket — what a senior engineer would actually',
  'do, no gold-plating. Be concrete and concise. Use exactly these sections:',
  '- Objective (one line)',
  '- Scale & approach (how big it really is, and the smallest clean way to do it)',
  '- Open questions (only genuinely blocking ones — write "None" if the ticket already settles it)',
  '- Plan (numbered, ordered, concrete steps)',
  '- Likely files & areas',
  '- Done when (acceptance criteria, including docs / stories / configurator / changelog as applicable)',
  '- Final standards review (for anything done in the session, justify any deviation from the existing system; cover custom styling, component usage, tokens and values, accessibility, interaction patterns, content and terminology, data and state handling, architecture and code standards, responsive behavior, test coverage, and standards debt created)',
  '',
  'The Final standards review section must use this exact checklist:',
  FINAL_STANDARDS_REVIEW_SECTION,
  '',
  'Write it as direct instructions a coding agent can follow. No preamble, no sign-off.',
].join('\n');

/** The user message for the local AI: the ticket context, framed as a request to plan it. */
export function buildPlanRequest(
  item: BacklogItem, comments: BacklogComment[] = [], linked: BacklogItem[] = [],
): string {
  return `Plan the work for this ticket.\n\n${buildTicketContext(item, comments, linked)}`;
}

export function ensureFinalStandardsReview(plan: string): string {
  if (/^##\s+Final standards review\b/im.test(plan)) return plan;
  return `${plan.trim()}\n\n${FINAL_STANDARDS_REVIEW_SECTION}`;
}

// ── Deterministic fallback planner ──────────────────────────────────────────────

type Scale = 'small' | 'medium' | 'large';

interface ComponentTarget {
  id: string;
  label: string;
}

const COMPONENT_TARGETS: Array<ComponentTarget & { aliases: string[] }> = [
  { id: 'snackbar', label: 'Snackbar', aliases: ['snackbar', 'snackbars', 'snack bar', 'snack bars'] },
  { id: 'banner', label: 'Banner', aliases: ['banner', 'banners'] },
  { id: 'notification', label: 'Notification', aliases: ['notification', 'notifications'] },
  { id: 'card', label: 'Card', aliases: ['card', 'cards'] },
  { id: 'section', label: 'Section', aliases: ['section', 'sections'] },
  { id: 'stack', label: 'Stack', aliases: ['stack', 'stacks'] },
  { id: 'button', label: 'Button', aliases: ['button', 'buttons'] },
  { id: 'tabs', label: 'Tabs', aliases: ['tabs', 'tab'] },
  { id: 'dialog', label: 'Dialog', aliases: ['dialog', 'dialogs', 'modal', 'modals'] },
  { id: 'menu', label: 'Menu', aliases: ['menu', 'menus'] },
];

function assessScale(item: BacklogItem): Scale {
  if (item.complexity === 'xs' || item.complexity === 's') return 'small';
  if (item.complexity === 'l' || item.complexity === 'xl') return 'large';
  if (item.complexity === 'm') return 'medium';
  // No size set — infer from the description.
  const desc = item.description ?? '';
  const conjunctions = (desc.match(/\band\b|;|\bthen\b|\+/g) || []).length;
  if (desc.length > 600 || conjunctions >= 6) return 'large';
  if (desc.length < 200 && conjunctions < 2) return 'small';
  return 'medium';
}

const SCALE_APPROACH: Record<Scale, string> = {
  small: 'Small — a focused change. Make the one clean edit, verify it, and keep the diff tight.',
  medium: 'Medium — scoped but real. Do the smallest design that fully satisfies the ask; resist gold-plating.',
  large: 'Large — slice it. Identify the thinnest vertical slice that ships value first, then layer the rest behind it.',
};

function kebab(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function textForInference(item: BacklogItem): string {
  return `${item.title} ${item.description ?? ''} ${item.scopeLabel ?? ''}`.toLowerCase();
}

function inferComponentTarget(item: BacklogItem): ComponentTarget | null {
  if (item.scopeKind === 'component') {
    const label = item.scopeLabel?.trim() || item.title.trim() || 'Component';
    return { id: kebab(item.scopeRef || label), label };
  }

  const text = textForInference(item);
  return COMPONENT_TARGETS.find((target) => target.aliases.some((alias) => {
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${escaped}\\b`, 'i').test(text);
  })) ?? null;
}

function needsBestPracticeResearch(item: BacklogItem): boolean {
  return /\b(best practices?|lookup|look up|research|determine|decide|explore)\b/i.test(`${item.title} ${item.description ?? ''}`);
}

/** Where the work likely lives, from the ticket's scope. */
function fileAreas(item: BacklogItem): string[] {
  const componentTarget = inferComponentTarget(item);
  if (componentTarget) {
    return [
      `packages/react/src/components/${componentTarget.id}/ (JSX + CSS variable architecture + d.ts + Storybook stories)`,
      `apps/a1-web/src/pages/components/detail/${componentTarget.id}.jsx and ComponentDetailPage property rows/config coverage`,
      `Matching package implementations if this component is shipped outside React (React Native / Web Components / Pure as applicable)`,
      `packages/react/ai/components.md, component rules/docs, and relevant changelogs`,
    ];
  }

  const name = item.scopeLabel ? item.scopeLabel.toLowerCase().replace(/\s+/g, '-') : '<name>';
  switch (item.scopeKind) {
    case 'component':
      return [
        `packages/react/src/components/${name}/ (jsx + css var architecture + d.ts + stories)`,
        `system/tokens/component/${name}.json (if new tokens are needed) → run build:tokens`,
        'apps/a1-web/src/pages/components/ (the configurator) + packages/react/ai/components.md',
      ];
    case 'theme':
      return ['system/themes/<name>/ (theme.json + tokens) → run build:themes', 'validate every component under the theme'];
    case 'foundation':
      return ['system/tokens/ (the relevant tier) → run build:tokens && build:html-css', 'consumers of the changed tokens'];
    case 'pattern':
      return ['apps/a1-web/src/patterns/ + the Templates page'];
    case 'package':
      return [`packages/${name}/`];
    case 'app':
    case 'general':
    default:
      return ['apps/a1-web/src/ (the page/component the ticket touches)'];
  }
}

/** Ordered steps tailored to the ticket type + scope. */
function steps(item: BacklogItem): string[] {
  const componentTarget = inferComponentTarget(item);
  const isComponent = !!componentTarget;
  const ripples = item.scopeKind === 'theme' || item.scopeKind === 'foundation';
  const componentLabel = componentTarget?.label ?? 'the component';
  const componentPath = componentTarget?.id ?? '<name>';
  const researchStep = needsBestPracticeResearch(item)
    ? [`Research current ${componentLabel} best practices and document the chosen interaction model before coding.`]
    : [];

  if (item.type === 'bug') {
    return [
      'Reproduce the issue and pin the exact trigger (which theme, breakpoint, state, or input).',
      'Locate the source in the areas below; understand why it happens before touching code.',
      'Make the minimal fix — trace every value to a token, change nothing unrelated.',
      'Verify the fix across themes (base, a1-light, accessible, heritage) and breakpoints (xs–xl); check keyboard + focus if it is interactive.',
      'Update the Storybook story / a1-web configurator if behaviour changed, and add a changelog entry referencing the ticket.',
    ];
  }

  if (item.type === 'epic') {
    return [
      'Define the user outcome and the boundaries of the epic before choosing implementation details.',
      'Break the epic into independently valuable slices and identify the thinnest end-to-end slice to ship first.',
      'Record dependencies, sequencing, and acceptance criteria for the remaining slices.',
      'Implement and verify only the first agreed slice in this ticket; file or link follow-up tickets for the rest.',
      ...(ripples ? ['Run build:tokens && build:html-css (and build:themes for a theme) and re-check consumers.'] : []),
      'Update the relevant documentation and changelog for the shipped slice.',
    ];
  }

  // feature
  if (isComponent) {
    return [
      ...researchStep,
      `Confirm the ${componentLabel} public API and interaction model (props, variants, positions, stacking/queueing, dismissal, timing, and accessibility announcements) as a small, stable contract.`,
      `Add or extend component tokens in system/tokens/component/${componentPath}.json if new separation, shadow, border, spacing, or motion values are needed; run build:tokens.`,
      `Implement in packages/react/src/components/${componentPath}/ using the CSS-variable architecture (no hardcoded values).`,
      `Add Storybook stories for single and multiple ${componentLabel} examples, including dark/inverse mode and narrow viewports.`,
      'Wire the a1-web configurator: controls + Properties rows + switch-linked helper text + a correct code snippet.',
      'Add any user-facing copy to system/labels/ with English descriptions and supported locale translations, then consume it through the label resolver.',
      'Update the changelog(s) and packages/react/ai/components.md; validate themes, breakpoints, and accessibility.',
    ];
  }

  return [
    'Pin down the exact surface (page/component) and the user need it serves.',
    'Build it from existing A1 components + tokens — custom UI is a last resort, documented if unavoidable.',
    'Keep semantics and accessibility correct (keyboard, focus, ARIA, contrast).',
    'Add any new user-facing copy to system/labels/ with supported locale translations, then consume it through the label resolver.',
    ...(ripples ? ['Rebuild tokens/themes and re-check every consumer.'] : []),
    'Update the changelog(s); validate across themes and breakpoints.',
  ];
}

function doneWhen(item: BacklogItem): string[] {
  const done = ['The ticket\'s stated outcome is met with the smallest clean change.'];
  if (inferComponentTarget(item)) {
    done.push('Stories, the a1-web configurator, the changelog, and components.md are all updated in the same change.');
  } else {
    done.push('The relevant changelog is updated; docs/configurator updated if anything user-facing changed.');
  }
  done.push('Verified across themes (base, a1-light, accessible, heritage) and breakpoints (xs–xl); accessibility holds.');
  done.push('No hardcoded values — everything traces to a token; sentence case throughout.');
  done.push('Any new user-facing labels are in system/labels/ with English descriptions and translations for es, fr, de, pt, ja, zh, and ar.');
  done.push('Final standards review is complete: justify any deviation from the existing system and identify what should be fixed, documented, promoted to the system, or accepted as local.');
  return done;
}

function appendFinalStandardsReview(out: string[]): void {
  out.push(...FINAL_STANDARDS_REVIEW_SECTION.split('\n'));
  out.push('');
}

/**
 * Build a development plan from the ticket alone — deterministic, offline, no model. Used as
 * the fallback when no local LLM is reachable so the tab always yields a real, usable plan.
 */
export function developPlanLocally(
  item: BacklogItem, comments: BacklogComment[] = [], linked: BacklogItem[] = [],
): string {
  const scale = assessScale(item);
  const open = openQuestions(comments);
  const ref = ticketRef(item.number);

  const out: string[] = [];
  out.push(`# Plan — ${ref}: ${item.title}`, '');
  out.push(`Implement ${ref} in the A1 Design System monorepo.`, '');

  out.push('## Objective');
  out.push(`Deliver: ${item.title}. ${metaLine(item)}.`);
  if (item.description?.trim()) out.push('', item.description.trim());
  out.push('');

  out.push('## Scale & approach');
  out.push(SCALE_APPROACH[scale], '');

  out.push('## Open questions');
  if (open.length) {
    out.push('Confirm these before (or early while) building — they shape the solution:');
    for (const q of open) out.push(`- ${q}`);
  } else {
    out.push('- None outstanding — the ticket and discussion settle the scope. Flag anything ambiguous as you go.');
  }
  out.push('');

  if (linked.length) {
    out.push('## Linked tickets');
    out.push('Related tickets — check whether they share scope or should ship together, and keep them consistent:');
    for (const l of linked) out.push(`- ${ticketRef(l.number)} (${STATUS_LABELS[l.status]}): ${l.title}`);
    out.push('');
  }

  out.push('## Plan');
  steps(item).forEach((s, i) => out.push(`${i + 1}. ${s}`));
  out.push('');

  out.push('## Likely files & areas');
  for (const a of fileAreas(item)) out.push(`- ${a}`);
  out.push('');

  out.push('## Done when');
  for (const d of doneWhen(item)) out.push(`- ${d}`);
  out.push('');

  appendFinalStandardsReview(out);

  out.push('## Conventions');
  out.push(
    'Follow CLAUDE.md and packages/react/ai/: A1 components + tokens only, sentence case, '
    + 'semantic + accessible markup, and user-facing labels through system/labels/ with translations. '
    + 'Work on a branch and summarise what you changed . Dont commit the branch so it can be reviewed.',
  );

  return out.join('\n');
}
