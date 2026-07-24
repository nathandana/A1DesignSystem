export function canonicalKey(key) {
  return String(key || '').replace(/#.*$/, '').trim().toLowerCase().replace(/[\s_-]+/g, '');
}

export function compactKey(key) {
  return canonicalKey(key).replace(/[^a-z0-9]+/g, '');
}

export function componentNameCandidatesForAliases(name, aliasesByName = {}) {
  const base = String(name || '').trim();
  const aliases = aliasesByName[base] || [];
  const compact = base.replace(/\s+/g, '');
  const spaced = base.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
  return [...new Set([base, ...aliases, compact, spaced].filter(Boolean))];
}

export function figmaComponentNameMatchesForAliases(actualName, requestedName, aliasesByName = {}) {
  const actual = String(actualName || '').trim();
  if (!actual) return false;
  const actualKey = canonicalKey(actual);
  const actualCompact = compactKey(actual);
  const parts = actual.split(/[\\/›>]+/).map((part) => part.trim()).filter(Boolean);
  const partKeys = parts.map(canonicalKey);
  const partCompacts = parts.map(compactKey);
  return componentNameCandidatesForAliases(requestedName, aliasesByName).some((candidate) => {
    const candidateKey = canonicalKey(candidate);
    const candidateCompact = compactKey(candidate);
    return actualKey === candidateKey
      || actualCompact === candidateCompact
      || partKeys.includes(candidateKey)
      || partCompacts.includes(candidateCompact);
  });
}
