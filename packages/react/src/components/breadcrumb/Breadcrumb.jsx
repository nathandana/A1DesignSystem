import "./breadcrumb.css";
import { Icon } from "../icon/Icon.jsx";
import { Link } from "../link/Link.jsx";

/**
 * Hierarchical navigation breadcrumb.
 *
 * Pass an `items` array where each entry is `{ label, href?, onClick? }`.
 * The last item is always the current page (non-interactive). All others
 * render as links (anchor when href is set, button when only onClick).
 *
 * Responsive behavior via container query:
 * - ≥ 480px: full breadcrumb trail with separators
 * - < 480px: "← Back" link pointing to the immediate parent item
 *
 * @param {{ label: string, href?: string, onClick?: function }[]} items
 */
export function Breadcrumb({ items = [], className = "", ...props }) {
  const parentItem = items.length >= 2 ? items[items.length - 2] : null;
  const backTarget = (parentItem?.href || parentItem?.onClick) ? parentItem : null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={["a1-breadcrumb", className].filter(Boolean).join(" ")}
      {...props}
    >
      <ol className="a1-breadcrumb__list">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li
              key={i}
              className={[
                "a1-breadcrumb__item",
                isLast && "a1-breadcrumb__item--current",
              ].filter(Boolean).join(" ")}
            >
              {isLast ? (
                <span className="a1-breadcrumb__current" aria-current="page">
                  {item.label}
                </span>
              ) : item.href ? (
                <Link href={item.href} onClick={item.onClick} className="a1-breadcrumb__link">
                  {item.label}
                </Link>
              ) : item.onClick ? (
                <button type="button" className="a1-breadcrumb__link" onClick={item.onClick}>
                  {item.label}
                </button>
              ) : (
                <span className="a1-breadcrumb__ancestor">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>

      {backTarget && (
        backTarget.href ? (
          <Link
            href={backTarget.href}
            onClick={backTarget.onClick}
            icon="arrow_back"
            className="a1-breadcrumb__back"
          >
            Back
          </Link>
        ) : (
          <button
            type="button"
            className="a1-breadcrumb__back"
            onClick={backTarget.onClick}
          >
            <Icon name="arrow_back" className="a1-breadcrumb__back-icon" />
            <span className="a1-breadcrumb__back-label">Back</span>
          </button>
        )
      )}
    </nav>
  );
}
