import contract from './contract.generated.json' with { type: 'json' };

const pointer = value => String(value).replaceAll('~', '~0').replaceAll('/', '~1');

/** Record content that needs runtime or human review; never judge its casing. */
export function createContentCoverage() {
  const deferred = [];
  const defer = (path, reason) => {
    if (!deferred.some(item => item.path === path && item.reason === reason)) deferred.push({ path, reason });
  };
  function text(value, path) {
    if (typeof value === 'string' && /\{\{[^{}]+\}\}/.test(value)) defer(path, 'runtime-binding');
  }
  function props(type, value, path) {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) { value.forEach((item, i) => props(type, item, `${path}/${i}`)); return; }
    // Structural traversal handles nested nodes separately.
    if (typeof value.id === 'string' && contract.componentTypes.includes(value.type)) return;
    for (const [key, child] of Object.entries(value)) {
      const next = `${path}/${pointer(key)}`;
      if (type === 'CustomBlock' && ['markup', 'js', 'css'].includes(key)) {
        if (child) defer(next, key === 'css' ? 'rendered-css' : 'opaque-custom-content');
      } else if (key === 'data' || key === 'rows') {
        if (child) defer(next, 'dataset-content');
      } else if (key === 'style') {
        if (child) defer(next, 'rendered-style');
      } else if (typeof child === 'string') text(child, next);
      else props(type, child, next);
    }
  }
  function node(value, path) {
    if (value.content?.textKey) defer(`${path}/content/textKey`, 'resolved-localization');
    if (['Code', 'CustomBlock', 'Icon'].includes(value.type)) {
      if (value.content?.fallback) defer(`${path}/content/fallback`, 'code-or-icon-content');
    } else text(value.content?.fallback, `${path}/content/fallback`);
    text(value.a11y?.label, `${path}/a11y/label`);
    if (value.repeat || value.collections) defer(path, 'runtime-collection');
  }
  function coverage(schemaChecked) {
    return {
      schema: { status: schemaChecked ? 'checked' : 'not-checked', checks: ['structure', 'component-props', 'references', 'formal-pattern-contracts'] },
      automatedRules: [],
      rulesRequiringReview: contract.ruleCatalog.map(rule => ({ ruleId: rule.id, requirement: rule.requirement })),
      deferred,
      requiresRendering: ['responsive-layout', 'contrast', 'keyboard-and-focus', 'screen-reader-behavior', 'resolved-content-and-styles'],
      requiresHumanReview: ['proper-names-and-approved-content', 'site-information-architecture'],
      completeCompliance: false,
    };
  }
  return { text, props, node, coverage };
}
