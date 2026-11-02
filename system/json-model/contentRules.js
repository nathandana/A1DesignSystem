import contract from './contract.generated.json' with { type: 'json' };

const mandatoryContentRules = contract.ruleCatalog.filter(rule => rule.json);
const contentRule = mandatoryContentRules.find(rule => rule.json.check === 'authored-text-case');
const headingRule = mandatoryContentRules.find(rule => rule.json.check === 'heading-sentence-case');
const policy = contentRule.json;
const tokens = new Set(policy.exceptions.tokens);
const approvedToken = (word, locale) => tokens.has(word) || (policy.exceptions.localeTokens?.[locale.split('-')[0]] ?? []).includes(word);
const textFields = new Set(policy.textFields);
const collections = new Set(policy.collections);
const excludedContent = new Set(policy.excludedContentComponents);
const headingTypes = new Set(headingRule.json.components);
const headingFields = new Set(headingRule.json.fields);
const escapePointer = value => String(value).replaceAll('~', '~0').replaceAll('/', '~1');
const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const words = /[\p{L}\p{N}][\p{L}\p{M}\p{N}]*(?:['’.-][\p{L}\p{M}\p{N}]+)*/gu;
const binding = /\{\{[^{}]+\}\}/g;

// Document language travels with the JSON, so MCP, import and preview cannot
// disagree because the agent/server/viewer has a different UI locale.
export function contentLocale(value, inherited = 'en') {
  if (value === undefined) return inherited;
  try { return Intl.getCanonicalLocales(value)[0] || 'und'; } catch { return 'und'; }
}
const lower = (text, locale) => text.toLocaleLowerCase(locale);
const upper = (text, locale) => text.toLocaleUpperCase(locale);
const cased = (text, locale) => lower(text, locale) !== upper(text, locale);
const firstUpper = (text, locale) => {
  const [first, ...rest] = [...text];
  return upper(first, locale) + rest.join('');
};

function sentenceSuggestion(text, locale, onlyCaps = false) {
  let end = 0;
  let first = true;
  let suggested = text.replace(words, (word, offset) => {
    if (/[.!?\n]/u.test(text.slice(end, offset))) first = true;
    end = offset + word.length;
    const value = approvedToken(word, locale) || onlyCaps && word !== upper(word, locale) ? word : first ? firstUpper(lower(word, locale), locale) : lower(word, locale);
    if (cased(word, locale)) first = false;
    return value;
  });
  // Preserve the canonical spelling of explicitly approved names. Suggestions
  // remain proposals: unknown names and locale-specific grammar need review.
  for (const name of policy.exceptions.names) suggested = suggested.replace(new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegex(name)}(?![\\p{L}\\p{N}])`, 'giu'), name);
  return suggested;
}

function titleCase(text, locale) {
  let remaining = text;
  for (const name of policy.exceptions.names) remaining = remaining.replace(new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegex(name)}(?![\\p{L}\\p{N}])`, 'gu'), '');
  const terms = [...remaining.matchAll(words)].map(match => match[0]).filter(word => cased(word, locale) && !approvedToken(word, locale));
  return terms.length > 1 && terms.every(word => word === firstUpper(lower(word, locale), locale));
}

// Inspect literal declarations only. Mask strings/comments to avoid treating
// examples in `content:` or comments as executable CSS. Escape decoding catches
// escaped property names/values; dynamic CSS and markup are reported as deferred.
function cssTransforms(css) {
  const masked = css.replace(/\/\*[\s\S]*?\*\/|"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'/g, match => ' '.repeat(match.length));
  const decoded = masked.replace(/\\([a-fA-F0-9]{1,6})\s?|\\([^\r\n])/g, (_, hex, char) => {
    const code = hex ? parseInt(hex, 16) : null;
    return hex ? code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : '\uFFFD' : char;
  });
  return [...decoded.matchAll(/(?:^|[;{])\s*text-transform\s*:\s*([^;}]+)/gi)]
    .some(match => match[1].toLowerCase().split(/[\s!]+/).some(value => policy.transforms.includes(value)));
}

/** Shared, bounded traversal hooks called only for real component nodes. */
export function createContentRuleChecker(add) {
  const counts = new Map(mandatoryContentRules.map(rule => [rule.id, 0]));
  const deferred = [];
  const defer = (path, reason) => {
    if (!deferred.some(item => item.path === path && item.reason === reason)) deferred.push({ path, reason });
  };
  const violation = (rule, path, value, messageKey, suggestedValue) => add('RULE_VIOLATION', path, {
    ruleId: rule.id, severity: rule.json.severity, messageKey,
    offendingText: value,
    ...(suggestedValue !== undefined ? { suggestedValue } : {}),
    recovery: messageKey === 'CONTENT_TRANSFORM' ? 'Remove the casing transform and author the text directly.' : 'Review the suggested sentence case and preserve approved names before replacing this value.',
  }, rule.json.severity);

  function text(value, path, locale = 'en', heading = false) {
    if (typeof value !== 'string' || !value.trim()) return;
    counts.set(contentRule.id, counts.get(contentRule.id) + 1);
    const literal = value.replace(binding, '');
    if (literal !== value) defer(path, 'runtime-binding');
    const terms = [...literal.matchAll(words)].map(match => match[0]).filter(word => cased(word, locale));
    const prose = terms.filter(word => !approvedToken(word, locale));
    // A single letter is not enough evidence of shouting (initials, grades,
    // size labels). No arbitrary acronym-length exemption is permitted.
    const allCaps = prose.some(word => word.replace(/[^\p{L}]/gu, '').length > 1 && word === upper(word, locale));
    if (allCaps) {
      violation(contentRule, path, value, 'CONTENT_UPPERCASE', literal === value ? sentenceSuggestion(value, locale, true) : undefined);
    }
    if (heading) {
      if (!headingRule.json.locales.includes(locale.split('-')[0])) defer(path, 'locale-heading-review');
      else {
        counts.set(headingRule.id, counts.get(headingRule.id) + 1);
        if (!allCaps && literal === value && titleCase(value, locale)) violation(headingRule, path, value, 'HEADING_SENTENCE_CASE', sentenceSuggestion(value, locale));
      }
    }
  }

  function styles(value, path) {
    if (!value || typeof value !== 'object') return;
    for (const [key, child] of Object.entries(value)) {
      const next = `${path}/${escapePointer(key)}`;
      if (['textTransform', 'text-transform'].includes(key) && typeof child === 'string') {
        counts.set(contentRule.id, counts.get(contentRule.id) + 1);
        if (child.trim().toLowerCase().split(/\s+/).some(token => policy.transforms.includes(token))) violation(contentRule, next, child, 'CONTENT_TRANSFORM', 'none');
        else if (/var\(|\{\{/u.test(child)) defer(next, 'dynamic-style');
      } else if (child && typeof child === 'object') styles(child, next);
    }
  }

  function props(type, value, path, locale = 'en') {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) { value.forEach((item, i) => props(type, item, `${path}/${i}`, locale)); return; }
    // Nested nodes are visited by the structural validator with their own type,
    // inherited language and exact path, not as arbitrary collection records.
    if (typeof value.id === 'string' && contract.componentTypes.includes(value.type)) return;
    const currentLocale = contentLocale(value.lang, locale);
    for (const [key, child] of Object.entries(value)) {
      const next = `${path}/${escapePointer(key)}`;
      if (key === 'style') styles(child, next);
      else if (type === 'CustomBlock' && key === 'css' && typeof child === 'string') {
        counts.set(contentRule.id, counts.get(contentRule.id) + 1);
        if (cssTransforms(child)) violation(contentRule, next, child, 'CONTENT_TRANSFORM');
        defer(next, 'rendered-css');
      } else if (type === 'CustomBlock' && ['markup', 'js'].includes(key) && child) defer(next, 'opaque-custom-content');
      else if (key === 'data' || key === 'rows') { if (child) defer(next, 'dataset-content'); }
      else if (textFields.has(key) || policy.displayValues[type]?.includes(key)) {
        if (typeof child === 'string') text(child, next, currentLocale, headingTypes.has(type) && headingFields.has(key));
        else if (Array.isArray(child)) child.forEach((item, i) => text(item, `${next}/${i}`, currentLocale));
      } else if (collections.has(key)) props(type, child, next, currentLocale);
    }
  }

  function node(value, path, locale) {
    if (value.content?.textKey) defer(`${path}/content/textKey`, 'resolved-localization');
    if (excludedContent.has(value.type)) {
      if (value.content?.fallback) defer(`${path}/content/fallback`, 'code-or-icon-content');
    } else text(value.content?.fallback, `${path}/content/fallback`, locale, headingTypes.has(value.type));
    text(value.a11y?.label, `${path}/a11y/label`, locale);
    if (value.repeat || value.collections) defer(path, 'runtime-collection');
  }

  function coverage(schemaChecked) {
    return {
      schema: { status: schemaChecked ? 'checked' : 'not-checked', checks: ['structure', 'component-props', 'references', 'formal-pattern-contracts'] },
      automatedRules: mandatoryContentRules.map(rule => ({ ruleId: rule.id, severity: rule.json.severity, status: counts.get(rule.id) ? 'checked' : 'not-checked', checkedValues: counts.get(rule.id) })),
      rulesRequiringReview: contract.ruleCatalog.filter(rule => !rule.json).map(rule => ({ ruleId: rule.id, requirement: rule.requirement })),
      deferred,
      requiresRendering: ['responsive-layout', 'contrast', 'keyboard-and-focus', 'screen-reader-behavior', 'resolved-content-and-styles'],
      requiresHumanReview: ['proper-names-and-approved-content', 'locale-specific-heading-case', 'site-information-architecture'],
      completeCompliance: false,
    };
  }
  return { text, props, node, coverage };
}
