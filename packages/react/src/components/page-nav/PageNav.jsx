import { useEffect, useRef, useState } from "react";
import { Card } from "../card/Card.jsx";
import "./page-nav.css";

// Find the nearest scrollable ancestor of a node, or null when the page scrolls
// on the document/window itself. Needed because the host may scroll a nested
// container (e.g. a viewport-height PageLayout) rather than the window — in which
// case window scroll never fires and the progress/active state would freeze.
function getScrollParent(node) {
  let el = node?.parentElement;
  while (el && el !== document.body && el !== document.documentElement) {
    const overflowY = getComputedStyle(el).overflowY;
    if ((overflowY === "auto" || overflowY === "scroll") && el.scrollHeight > el.clientHeight) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

export function PageNav({
  sections = [],
  label = "On this page",
  className = "",
  ...props
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? null);
  const [progress, setProgress] = useState(0);
  const intersectingIds = useRef(new Set());

  // Reading progress: track the scroll position of the actual scroll container
  // (the window, or a nested scrollable ancestor like a viewport-height layout).
  useEffect(() => {
    const scroller = getScrollParent(sections.length ? document.getElementById(sections[0].id) : null);
    const target = scroller ?? window;
    function update() {
      const el = scroller ?? document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (el.scrollTop / total) * 100 : 0);
    }
    target.addEventListener("scroll", update, { passive: true });
    update();
    return () => target.removeEventListener("scroll", update);
  }, [sections]);

  // Active section: observe each section element entering/leaving the scroll
  // container (root = the nested scroller, or the viewport when null).
  useEffect(() => {
    if (!sections.length) return;

    const scroller = getScrollParent(document.getElementById(sections[0].id));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            intersectingIds.current.add(entry.target.id);
          } else {
            intersectingIds.current.delete(entry.target.id);
          }
        });
        // Always pick the first match in document order so the active item
        // reflects what the reader is seeing at the top of the viewport.
        const first = sections.find((s) => intersectingIds.current.has(s.id));
        if (first) setActiveId(first.id);
      },
      // -8% top offset keeps the active section stable once it clears the
      // header; -88% bottom offset means only the top 12% of the scroll area
      // is treated as "current".
      { root: scroller ?? null, rootMargin: "-8% 0px -88% 0px", threshold: 0 }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
      intersectingIds.current.clear();
    };
  }, [sections]);

  function handleClick(id) {
    // Immediately highlight the clicked item — don't wait for the observer
    setActiveId(id);
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <Card className={["a1-page-nav", className].filter(Boolean).join(" ")} {...props}>
        {/* Progress bar — spans full card width above padding */}
        <div className="a1-page-nav__progress" aria-hidden="true">
          <div
            className="a1-page-nav__progress-fill"
            style={{ width: `${progress.toFixed(1)}%` }}
          />
        </div>

        <nav className="a1-page-nav__inner" aria-label={label}>
          <p className="a1-page-nav__heading">{label}</p>
          <ul className="a1-page-nav__list" role="list">
            {sections.map(({ id, label: itemLabel, level = 1 }) => (
              <li key={id} className="a1-page-nav__item">
                <button
                  type="button"
                  className={[
                    "a1-page-nav__link",
                    level === 2 && "a1-page-nav__link--l2",
                    activeId === id && "a1-page-nav__link--active",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-current={activeId === id ? "location" : undefined}
                  onClick={() => handleClick(id)}
                >
                  {itemLabel}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </Card>

      {/* Reserves space for the fixed pill nav on mobile so content isn't hidden beneath it */}
      <div className="a1-page-nav__spacer" aria-hidden="true" />
    </>
  );
}
