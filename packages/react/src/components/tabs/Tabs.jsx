import { createContext, useContext, useId } from "react";
import "./tabs.css";

const TabsContext = createContext(null);

/* ─── Tabs ─────────────────────────────────────────────────────────────────── */

export function Tabs({
  children,
  value,
  onChange,
  variant = "line",
  level = 1,
}) {
  const uid = useId();
  return (
    <TabsContext.Provider value={{ value, onChange, variant, level, uid }}>
      <div className={`a1-tabs a1-tabs--level-${level}`}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

/* ─── TabList ───────────────────────────────────────────────────────────────── */

export function TabList({ children }) {
  const { variant } = useContext(TabsContext);

  const handleKeyDown = (e) => {
    const tabs = Array.from(e.currentTarget.querySelectorAll('[role="tab"]:not([disabled])'));
    const idx = tabs.indexOf(document.activeElement);
    if (idx === -1) return;

    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      next = (idx + 1) % tabs.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      next = (idx - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      next = 0;
    } else if (e.key === "End") {
      next = tabs.length - 1;
    }

    if (next !== -1) {
      e.preventDefault();
      tabs[next].focus();
      tabs[next].click();
    }
  };

  return (
    <div
      role="tablist"
      className={`a1-tab-list a1-tab-list--${variant}`}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}

/* ─── Tab ───────────────────────────────────────────────────────────────────── */

export function Tab({ children, value: tabValue }) {
  const { value, onChange, variant, uid } = useContext(TabsContext);
  const isSelected = value === tabValue;

  return (
    <button
      role="tab"
      type="button"
      id={`${uid}-tab-${tabValue}`}
      aria-selected={isSelected}
      aria-controls={`${uid}-panel-${tabValue}`}
      tabIndex={isSelected ? 0 : -1}
      className={`a1-tab a1-tab--${variant}`}
      onClick={() => onChange?.(tabValue)}
    >
      {children}
    </button>
  );
}

/* ─── TabPanel ──────────────────────────────────────────────────────────────── */

export function TabPanel({ children, value: panelValue }) {
  const { value, variant, uid } = useContext(TabsContext);
  if (value !== panelValue) return null;

  return (
    <div
      role="tabpanel"
      id={`${uid}-panel-${panelValue}`}
      aria-labelledby={`${uid}-tab-${panelValue}`}
      className={`a1-tab-panel a1-tab-panel--${variant}`}
    >
      {children}
    </div>
  );
}
