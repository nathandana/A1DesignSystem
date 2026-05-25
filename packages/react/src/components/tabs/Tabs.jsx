import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from "react";
import { Icon } from "../icon/Icon.jsx";
import "./tabs.css";

const TabsContext = createContext(null);

/* ─── Tabs ─────────────────────────────────────────────────────────────────── */

export function Tabs({ children, value, onChange, variant = "line", level = 1 }) {
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
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Only line tabs support overflow scroll
  const enableScroll = variant === "line";

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    if (!enableScroll) return;
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
  }, [checkScroll, enableScroll]);

  const scrollBy = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 200, behavior: "smooth" });
  };

  const handleKeyDown = (e) => {
    const tabs = Array.from(
      e.currentTarget.querySelectorAll('[role="tab"]:not([disabled])')
    );
    const idx = tabs.indexOf(document.activeElement);
    if (idx === -1) return;

    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (idx + 1) % tabs.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (idx - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;

    if (next !== -1) {
      e.preventDefault();
      tabs[next].focus();
      tabs[next].click();
    }
  };

  return (
    <div className={`a1-tab-list-wrapper a1-tab-list-wrapper--${variant}`}>
      {enableScroll && canScrollLeft && (
        <button
          type="button"
          className="a1-tab-list__scroll-btn a1-tab-list__scroll-btn--prev"
          onClick={() => scrollBy(-1)}
          aria-label="Scroll tabs left"
          tabIndex={-1}
        >
          <Icon name="chevron_left" />
        </button>
      )}
      <div
        ref={scrollRef}
        role="tablist"
        className={`a1-tab-list a1-tab-list--${variant}${enableScroll ? " a1-tab-list--scrollable" : ""}`}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
      {enableScroll && canScrollRight && (
        <button
          type="button"
          className="a1-tab-list__scroll-btn a1-tab-list__scroll-btn--next"
          onClick={() => scrollBy(1)}
          aria-label="Scroll tabs right"
          tabIndex={-1}
        >
          <Icon name="chevron_right" />
        </button>
      )}
    </div>
  );
}

/* ─── Tab ───────────────────────────────────────────────────────────────────── */

export function Tab({ children, value: tabValue, count, icon, iconPosition = "start", status }) {
  const { value, onChange, variant, uid } = useContext(TabsContext);
  const isSelected = value === tabValue;

  const iconEl = icon ? (
    <Icon name={icon} className="a1-tab__icon" />
  ) : null;

  return (
    <button
      role="tab"
      type="button"
      id={`${uid}-tab-${tabValue}`}
      aria-selected={isSelected}
      aria-controls={`${uid}-panel-${tabValue}`}
      tabIndex={isSelected ? 0 : -1}
      className={[
        "a1-tab",
        `a1-tab--${variant}`,
        iconPosition === "above" && "a1-tab--icon-above",
        status && `a1-tab--status-${status}`,
      ].filter(Boolean).join(" ")}
      onClick={() => onChange?.(tabValue)}
    >
      {variant === "progress" && (
        <span className="a1-tab__step" aria-hidden="true">
          {status === "completed" && <Icon name="check" />}
        </span>
      )}
      {iconPosition === "above" && iconEl}
      {iconPosition === "start" && iconEl}
      <span className="a1-tab__label">{children}</span>
      {iconPosition === "end" && iconEl}
      {count !== undefined && (
        <span className="a1-tab__count">{count}</span>
      )}
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
