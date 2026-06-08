import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Accordion,
  Breadcrumb,
  Button,
  Heading,
  Icon,
  IconButton,
  Paragraph,
  SideNavGroup,
  SideNavItem,
  Switch,
  TextField,
  TokenSelect,
} from "../../../../packages/react/src/index.js";
import { NAV, findEntry, findVariant } from "../lib/componentRegistry.jsx";
import { ThemeContext } from "../lib/ThemeContext.js";
import {
  createTheme,
  exportThemeJson,
  loadActiveId,
  loadThemes,
  saveActiveId,
  saveThemes,
} from "../lib/themeStorage.js";
import { allRampsToCssVars, generateColorRamp, RAMP_LABELS } from "../lib/colorUtils.js";

// ─── Left nav ─────────────────────────────────────────────

function ComponentNav({ selectedId, selectedVariantId, onSelect, onSelectVariant }) {
  return (
    <nav className="comp-nav" aria-label="Component navigation">
      {NAV.map((section) => (
        <div key={section.id} className="comp-nav__section">
          <span className="comp-nav__section-label">{section.label}</span>
          {section.items.map((item) => {
            const isSelected = selectedId === item.id;
            const hasVariants = item.variants?.length > 0;

            if (hasVariants) {
              return (
                <SideNavGroup
                  key={item.id}
                  label={item.label}
                  open={isSelected}
                  onOpenChange={() => onSelect(item.id)}
                >
                  {item.variants.map((v) => (
                    <SideNavItem
                      key={v.id}
                      as="button"
                      label={v.label}
                      active={selectedVariantId === v.id}
                      type="button"
                      onClick={() => onSelectVariant(v.id)}
                    />
                  ))}
                </SideNavGroup>
              );
            }

            return (
              <SideNavItem
                key={item.id}
                as="button"
                label={item.label}
                active={isSelected}
                type="button"
                onClick={() => onSelect(item.id)}
              />
            );
          })}
        </div>
      ))}
    </nav>
  );
}

// ─── Theme toolbar ────────────────────────────────────────

function ThemeToolbar({
  themes,
  activeTheme,
  reduceMotion,
  onSwitch,
  onRename,
  onNew,
  onDuplicate,
  onExport,
  onReduceMotionChange,
}) {
  const [nameValue, setNameValue] = useState(activeTheme.name);
  const isDirty = nameValue.trim() !== activeTheme.name;

  useEffect(() => {
    setNameValue(activeTheme.name);
  }, [activeTheme.id]);

  function commitRename() {
    const trimmed = nameValue.trim();
    if (trimmed && trimmed !== activeTheme.name) {
      onRename(trimmed);
    } else {
      setNameValue(activeTheme.name);
    }
  }

  return (
    <div className="theme-toolbar">
      <div className="theme-toolbar__left">
        <div className="theme-toolbar__name-wrap">
          <input
            type="text"
            className={`theme-toolbar__name-input${isDirty ? " theme-toolbar__name-input--dirty" : ""}`}
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
              if (e.key === "Escape") {
                setNameValue(activeTheme.name);
                e.currentTarget.blur();
              }
            }}
            aria-label="Theme name"
            spellCheck={false}
          />
        </div>

        {themes.length > 1 && (
          <select
            className="theme-toolbar__select"
            value={activeTheme.id}
            onChange={(e) => onSwitch(e.target.value)}
            aria-label="Switch theme"
          >
            {themes.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        )}

        <div className="theme-toolbar__divider" aria-hidden="true" />

        <div className="theme-toolbar__actions">
          <Button size="sm" variant="secondary" icon="add" iconPosition="start" onClick={onNew}>
            New
          </Button>
          <Button size="sm" variant="secondary" icon="content_copy" iconPosition="start" onClick={onDuplicate}>
            Duplicate
          </Button>
          <Button size="sm" variant="secondary" icon="download" iconPosition="start" onClick={onExport}>
            Export JSON
          </Button>
        </div>
      </div>

      <div className="theme-toolbar__right">
        <Switch
          label="Reduce motion"
          size="compact"
          checked={reduceMotion}
          onChange={onReduceMotionChange}
        />
      </div>
    </div>
  );
}

// ─── Contrast utilities ───────────────────────────────────

function parseColor(v) {
  const s = v?.trim();
  if (!s) return null;
  const rgb = s.match(/rgba?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)/);
  if (rgb) return [Math.round(+rgb[1]), Math.round(+rgb[2]), Math.round(+rgb[3])];
  const hex = s.replace(/^#/, "");
  if (/^[0-9a-f]{6}$/i.test(hex))
    return [parseInt(hex.slice(0,2),16), parseInt(hex.slice(2,4),16), parseInt(hex.slice(4,6),16)];
  if (/^[0-9a-f]{3}$/i.test(hex))
    return [parseInt(hex[0]+hex[0],16), parseInt(hex[1]+hex[1],16), parseInt(hex[2]+hex[2],16)];
  return null;
}

function luminance([r, g, b]) {
  return [r, g, b].reduce((acc, c, i) => {
    const s = c / 255;
    const l = s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    return acc + l * [0.2126, 0.7152, 0.0722][i];
  }, 0);
}

function contrastRatio(c1, c2) {
  const [l1, l2] = [luminance(c1), luminance(c2)];
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

function resolveVar(key, el) {
  if (!el) return null;
  let v = getComputedStyle(el).getPropertyValue(key).trim();
  for (let i = 0; i < 10; i++) {
    const m = v.match(/^var\(\s*(--[^,)\s]+)/);
    if (!m) break;
    v = getComputedStyle(el).getPropertyValue(m[1]).trim() || v;
    if (!v.match(/^var\(/)) break;
  }
  return v;
}

function ContrastBar({ pairs, canvasRef }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!pairs?.length || !canvasRef?.current) { setResults([]); return; }
    const el = canvasRef.current;
    const next = pairs.map(({ label, fg, bg }) => {
      const fgRgb = parseColor(resolveVar(fg, el));
      const bgRgb = parseColor(resolveVar(bg, el));
      if (!fgRgb || !bgRgb) return null;
      return { label, ratio: contrastRatio(fgRgb, bgRgb) };
    }).filter(Boolean);
    setResults((prev) => {
      if (prev.length !== next.length) return next;
      const stable = prev.every((r, i) =>
        r.label === next[i].label && Math.abs(r.ratio - next[i].ratio) < 0.0001
      );
      return stable ? prev : next;
    });
  });

  if (!results.length) return null;

  return (
    <div className="contrast-bar">
      <span className="contrast-bar__label">Contrast</span>
      {results.map(({ label, ratio }) => {
        const level = ratio >= 7 ? "aaa" : ratio >= 4.5 ? "aa" : "fail";
        return (
          <div key={label} className="contrast-bar__item">
            <span className="contrast-bar__item-label">{label}</span>
            <span className="contrast-bar__item-ratio">{ratio.toFixed(2)}:1</span>
            <span className={`contrast-badge contrast-badge--${level}`}>
              {level === "aaa" ? "AAA" : level === "aa" ? "AA" : "Fail"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Token panel ──────────────────────────────────────────

function TokenRow({ token, value, isOverridden, onChange, rampColors }) {
  if (token.type === "color") {
    return (
      <div className={`token-row token-row--color${isOverridden ? " token-row--overridden" : ""}`}>
        <TokenSelect
          label={token.label}
          value={value}
          onChange={onChange}
          rampColors={rampColors}
          rampLabels={RAMP_LABELS}
          suggestedRamp={token.suggestedRamp ?? "neutral"}
          size="compact"
        />
      </div>
    );
  }

  if (token.type === "size") {
    return (
      <div className={`token-row${isOverridden ? " token-row--overridden" : ""}`}>
        <span className="token-row__label">{token.label}</span>
        <div className="token-row__control token-row__control--size">
          <TextField
            size="compact"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label={token.label}
          />
        </div>
      </div>
    );
  }

  return null;
}

function TokenPanel({ entry, overrides, onOverride, onReset, panelMode, onModeChange }) {
  const { colors } = useContext(ThemeContext);
  const [defaults, setDefaults] = useState({});
  const [expandedGroups, setExpandedGroups] = useState(() => new Set());

  const rampColors = useMemo(() => {
    const result = {};
    for (const [name, hex] of Object.entries(colors)) {
      result[name] = generateColorRamp(hex);
    }
    return result;
  }, [colors]);

  useEffect(() => {
    if (!entry?.tokenGroups?.length) return;
    let el = document.documentElement;
    let tempEl = null;
    if (panelMode === "dark") {
      tempEl = document.createElement("div");
      tempEl.className = "a1-inverse";
      document.body.appendChild(tempEl);
      el = tempEl;
    }
    const computed = getComputedStyle(el);
    const d = {};
    for (const group of entry.tokenGroups) {
      for (const token of group.tokens) {
        d[token.key] = computed.getPropertyValue(token.key).trim();
      }
    }
    if (tempEl) document.body.removeChild(tempEl);
    setDefaults(d);
    const groups = entry.tokenGroups;
    const isStateGrouped = groups[0]?.label === "Default";
    setExpandedGroups(
      isStateGrouped
        ? new Set([groups[0].label])
        : new Set(groups.map((g) => g.label))
    );
  }, [entry?.id, panelMode]);

  const groups = entry?.tokenGroups ?? [];
  const allExpanded = groups.length > 0 && groups.every((g) => expandedGroups.has(g.label));
  const hasOverrides = Object.keys(overrides).length > 0;

  function toggleGroup(label, isOpen) {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      isOpen ? next.add(label) : next.delete(label);
      return next;
    });
  }

  function toggleAll() {
    setExpandedGroups(
      allExpanded ? new Set() : new Set(groups.map((g) => g.label))
    );
  }

  return (
    <aside className="token-panel">
      <div className="token-panel__header">
        <div className="token-panel__header-row">
          <Heading as="h2" size="sm">Tokens</Heading>
          <div className="token-panel__header-actions">
            {groups.length > 1 && (
              <IconButton
                icon={allExpanded ? "unfold_less" : "unfold_more"}
                label={allExpanded ? "Collapse all" : "Expand all"}
                variant="tertiary"
                onClick={toggleAll}
              />
            )}
            {hasOverrides && (
              <Button size="sm" variant="tertiary" onClick={onReset}>
                Reset
              </Button>
            )}
          </div>
        </div>
        <div className="token-panel__mode-tabs" role="tablist" aria-label="Preview mode">
          <button
            role="tab"
            type="button"
            className={`token-panel__mode-tab${panelMode === "light" ? " token-panel__mode-tab--active" : ""}`}
            aria-selected={panelMode === "light"}
            onClick={() => onModeChange("light")}
          >
            Light
          </button>
          <button
            role="tab"
            type="button"
            className={`token-panel__mode-tab${panelMode === "dark" ? " token-panel__mode-tab--active" : ""}`}
            aria-selected={panelMode === "dark"}
            onClick={() => onModeChange("dark")}
          >
            Dark
          </button>
        </div>
      </div>

      {!groups.length ? (
        <div className="token-panel__empty">
          <Paragraph size="sm" color="muted">
            No tokens defined for this component yet.
          </Paragraph>
        </div>
      ) : (
        <div className="token-panel__groups">
          {groups.map((group) => (
            <Accordion
              key={group.label}
              label={group.label}
              size="sm"
              open={expandedGroups.has(group.label)}
              onChange={(isOpen) => toggleGroup(group.label, isOpen)}
              className="token-panel__accordion"
            >
              {group.tokens.map((token) => {
                const value = overrides[token.key] ?? defaults[token.key] ?? "";
                return (
                  <TokenRow
                    key={token.key}
                    token={token}
                    value={value}
                    isOverridden={!!overrides[token.key]}
                    onChange={(v) => onOverride(token.key, v)}
                    rampColors={rampColors}
                  />
                );
              })}
            </Accordion>
          ))}
        </div>
      )}
    </aside>
  );
}

// ─── Main page ────────────────────────────────────────────

const REDUCE_MOTION_VARS = {
  "--semantic-motion-duration-instant": "0ms",
  "--semantic-motion-duration-quick":   "0ms",
  "--semantic-motion-duration-fast":    "0ms",
  "--semantic-motion-duration-normal":  "0ms",
  "--semantic-motion-duration-slow":    "0ms",
  "--semantic-motion-duration-slower":  "0ms",
  "--semantic-motion-duration-slowest": "0ms",
};

export function ComponentsPage() {
  const [themes, setThemes] = useState(loadThemes);
  const [activeId, setActiveId] = useState(() => loadActiveId(loadThemes()));
  const [selectedId, setSelectedId] = useState("button");
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [allOverrides, setAllOverrides] = useState({});
  const [panelMode, setPanelMode] = useState("light");
  const [reduceMotion, setReduceMotion] = useState(false);
  const canvasRef = useRef(null);

  const activeTheme = themes.find((t) => t.id === activeId) ?? themes[0];
  const parentEntry = findEntry(selectedId);
  const entry = (selectedVariantId ? findVariant(selectedId, selectedVariantId) : null) ?? parentEntry;
  const overrides = allOverrides[selectedId]?.[panelMode] ?? {};

  useEffect(() => { saveThemes(themes); }, [themes]);
  useEffect(() => { saveActiveId(activeId); }, [activeId]);

  const colorCssVars = useMemo(
    () => allRampsToCssVars(activeTheme.colors),
    [activeTheme.colors]
  );

  const canvasStyle = useMemo(
    () => ({ ...colorCssVars, ...overrides, ...(reduceMotion ? REDUCE_MOTION_VARS : {}) }),
    [colorCssVars, overrides, reduceMotion]
  );

  const updateColor = useCallback((rampName, hex) => {
    setThemes((prev) =>
      prev.map((t) => t.id === activeId ? { ...t, colors: { ...t.colors, [rampName]: hex } } : t)
    );
  }, [activeId]);

  const themeContextValue = useMemo(
    () => ({ colors: activeTheme.colors, updateColor }),
    [activeTheme.colors, updateColor]
  );

  function handleOverride(tokenKey, value) {
    setAllOverrides((prev) => ({
      ...prev,
      [selectedId]: {
        ...(prev[selectedId] ?? {}),
        [panelMode]: { ...(prev[selectedId]?.[panelMode] ?? {}), [tokenKey]: value },
      },
    }));
  }

  function handleReset() {
    setAllOverrides((prev) => {
      const modeOverrides = { ...(prev[selectedId] ?? {}) };
      delete modeOverrides[panelMode];
      return { ...prev, [selectedId]: modeOverrides };
    });
  }

  function handleRename(name) {
    setThemes((prev) => prev.map((t) => t.id === activeId ? { ...t, name } : t));
  }

  function handleNew() {
    const theme = createTheme("New theme");
    setThemes((prev) => [...prev, theme]);
    setActiveId(theme.id);
  }

  function handleDuplicate() {
    const theme = createTheme(`${activeTheme.name} copy`, activeTheme.colors);
    setThemes((prev) => [...prev, theme]);
    setActiveId(theme.id);
  }

  function handleExport() {
    const json = exportThemeJson(activeTheme, allOverrides);
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTheme.name.toLowerCase().replace(/\s+/g, "-")}-theme.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <div className="components-page">
        <ThemeToolbar
          themes={themes}
          activeTheme={activeTheme}
          reduceMotion={reduceMotion}
          onSwitch={setActiveId}
          onRename={handleRename}
          onNew={handleNew}
          onDuplicate={handleDuplicate}
          onExport={handleExport}
          onReduceMotionChange={setReduceMotion}
        />

        <div className="components-body">
          <ComponentNav
            selectedId={selectedId}
            selectedVariantId={selectedVariantId}
            onSelect={(id) => { setSelectedId(id); setSelectedVariantId(null); }}
            onSelectVariant={setSelectedVariantId}
          />

          <main className="components-canvas">
            <div className="components-canvas__header">
              {selectedVariantId && (
                <Breadcrumb
                  items={[
                    { label: parentEntry?.label ?? "Component", onClick: () => setSelectedVariantId(null) },
                  ]}
                  className="components-canvas__breadcrumb"
                />
              )}
              <Heading as="h1" size="md">{entry?.label ?? "Component"}</Heading>
            </div>
            <div
              ref={canvasRef}
              style={canvasStyle}
              className={`components-canvas__preview${panelMode === "dark" ? " a1-inverse" : ""}`}
            >
              {entry?.Example ? <entry.Example /> : null}
            </div>
            <ContrastBar pairs={entry?.contrastPairs} canvasRef={canvasRef} />
          </main>

          <TokenPanel
            entry={entry}
            overrides={overrides}
            onOverride={handleOverride}
            onReset={handleReset}
            panelMode={panelMode}
            onModeChange={setPanelMode}
          />
        </div>
      </div>
    </ThemeContext.Provider>
  );
}
