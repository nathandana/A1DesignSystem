import { Icon } from "../icon/Icon.jsx";
import "./bottom-drawer.css";

export function BottomDrawer({ items = [], "aria-label": ariaLabel = "Primary navigation", className = "" }) {
  const visibleItems = items.slice(0, 5);

  return (
    <nav className={["a1-bottom-drawer", className].filter(Boolean).join(" ")} aria-label={ariaLabel}>
      <ul className="a1-bottom-drawer__list" role="list">
        {visibleItems.map((item) => {
          const Tag = item.href ? "a" : "button";
          const tagProps = item.href
            ? { href: item.href }
            : { type: "button", onClick: item.onClick };

          const linkClass = [
            "a1-bottom-drawer__link",
            item.active && "a1-bottom-drawer__link--active",
            item.disabled && "a1-bottom-drawer__link--disabled",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <li key={item.id} className="a1-bottom-drawer__item">
              <Tag
                className={linkClass}
                aria-current={item.active ? "page" : undefined}
                aria-disabled={item.disabled ? "true" : undefined}
                {...tagProps}
              >
                <span className="a1-bottom-drawer__link-icon-wrap">
                  <Icon
                    name={item.icon}
                    className="a1-bottom-drawer__link-icon"
                    aria-hidden="true"
                  />
                  {item.badge > 0 && (
                    <span
                      className="a1-bottom-drawer__badge"
                      aria-label={`${item.badge} unread`}
                    >
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </span>
                <span className="a1-bottom-drawer__link-label">{item.label}</span>
              </Tag>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
