import { useEffect, useRef, useState } from "react";
import { Card } from "../card/Card.jsx";
import "./page-nav.css";

export function PageNav({
  sections = [],
  label = "On this page",
  className = "",
  ...props
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? null);
  const [progress, setProgress] = useState(0);
  const intersectingIds = useRef(new Set());

  // Reading progress: track document scroll position
  useEffect(() => {
    function update() {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (el.scrollTop / total) * 100 : 0);
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Active section: observe each section element entering/leaving the viewport
  useEffect(() => {
    if (!sections.length) return;

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
      // header; -88% bottom offset means only the top 12% of the viewport
      // is treated as "current".
      { rootMargin: "-8% 0px -88% 0px", threshold: 0 }
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
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
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
  );
}
