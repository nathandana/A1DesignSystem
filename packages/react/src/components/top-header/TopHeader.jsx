import { useEffect, useRef, useState } from "react";
import { Button } from "../button/Button.jsx";
import { Icon } from "../icon/Icon.jsx";
import { IconButton } from "../icon-button/IconButton.jsx";
import { Menu, MenuSection, MenuItem } from "../menu/Menu.jsx";
import { SideNav, SideNavGroup, SideNavItem } from "../side-nav/SideNav.jsx";
import "./top-header.css";

// ── Helpers ────────────────────────────────────────────────────────────────────

// Split a flat items array into sections separated by { divider: true } markers.
function splitIntoSections(items) {
  const sections = [];
  let current = [];
  for (const item of items) {
    if (item.divider) {
      sections.push(current);
      current = [];
    } else {
      current.push(item);
    }
  }
  if (current.length > 0) sections.push(current);
  return sections;
}

// ── NavItem (desktop) ──────────────────────────────────────────────────────────

function NavItem({ item, openId, onOpen }) {
  const triggerRef = useRef(null);
  const hasSubmenu = item.items?.length > 0;
  const isOpen = hasSubmenu && openId === item.id;
  const isIconOnly = !!item.iconOnly;

  const linkClass = [
    "a1-top-header__nav-link",
    item.active && "a1-top-header__nav-link--active",
    isIconOnly && "a1-top-header__nav-link--icon-only",
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {item.icon && (
        <Icon
          name={item.icon}
          className="a1-top-header__nav-link-icon"
          aria-hidden="true"
        />
      )}
      {!isIconOnly && <span>{item.label}</span>}
      {!isIconOnly && hasSubmenu && (
        <Icon
          name="expand_more"
          className="a1-top-header__nav-chevron"
          aria-hidden="true"
        />
      )}
    </>
  );

  return (
    <li className="a1-top-header__nav-item">
      {hasSubmenu ? (
        <>
          <button
            ref={triggerRef}
            type="button"
            className={linkClass}
            aria-expanded={isOpen}
            aria-haspopup="menu"
            aria-current={item.active ? "page" : undefined}
            aria-label={isIconOnly ? item.label : undefined}
            onClick={() => onOpen(isOpen ? null : item.id)}
          >
            {content}
          </button>
          <Menu
            open={isOpen}
            onClose={() => onOpen(null)}
            anchorRef={triggerRef}
            aria-label={`${item.label} submenu`}
          >
            <MenuSection>
              {item.items.map((sub) => (
                <MenuItem
                  key={sub.label}
                  icon={sub.icon}
                  href={sub.href}
                  onClick={sub.href ? undefined : () => { sub.onClick?.(); onOpen(null); }}
                >
                  {sub.label}
                </MenuItem>
              ))}
            </MenuSection>
          </Menu>
        </>
      ) : item.href ? (
        <a
          href={item.href}
          className={linkClass}
          aria-current={item.active ? "page" : undefined}
          aria-label={isIconOnly ? item.label : undefined}
        >
          {content}
        </a>
      ) : (
        <button
          type="button"
          className={linkClass}
          aria-current={item.active ? "page" : undefined}
          aria-label={isIconOnly ? item.label : undefined}
          onClick={item.onClick}
        >
          {content}
        </button>
      )}
    </li>
  );
}

// ── ActionMenu ─────────────────────────────────────────────────────────────────

function ActionMenu({ action, isOpen, onToggle }) {
  const btnRef = useRef(null);
  const sections = splitIntoSections(action.items ?? []);

  return (
    <div className="a1-top-header__action">
      <div
        ref={btnRef}
        className={action.badge ? "a1-top-header__action-badge-wrap" : undefined}
        data-count={action.badge || undefined}
      >
        <IconButton
          icon={action.icon}
          label={action.label}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          onClick={onToggle}
        />
      </div>

      <Menu
        open={isOpen}
        onClose={onToggle}
        anchorRef={btnRef}
        aria-label={action.label}
      >
        {sections.map((section, i) => (
          <MenuSection key={i}>
            {section.map((item, j) => {
              if (item.isHeader) {
                return (
                  <div key={j} className="a1-top-header__menu-identity">
                    <span className="a1-top-header__menu-identity-name">
                      {item.label}
                    </span>
                    {item.description && (
                      <span className="a1-top-header__menu-identity-desc">
                        {item.description}
                      </span>
                    )}
                  </div>
                );
              }
              return (
                <MenuItem
                  key={j}
                  icon={item.icon}
                  href={item.href}
                  variant={item.danger ? "destructive" : "default"}
                  onClick={item.onClick}
                >
                  {item.label}
                </MenuItem>
              );
            })}
          </MenuSection>
        ))}
      </Menu>
    </div>
  );
}

// ── MobileDrawer ───────────────────────────────────────────────────────────────

function MobileDrawer({ navItems, onClose }) {
  const [openSubId, setOpenSubId] = useState(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <SideNav open onClose={onClose}>
      {navItems.map((item) => {
        if (item.items?.length > 0) {
          return (
            <SideNavGroup
              key={item.id}
              icon={item.icon}
              label={item.label}
              open={openSubId === item.id}
              onOpenChange={(next) => setOpenSubId(next ? item.id : null)}
            >
              {item.items.map((sub) => (
                <SideNavItem
                  key={sub.label}
                  as={sub.href ? "a" : "button"}
                  href={sub.href}
                  icon={sub.icon}
                  label={sub.label}
                  onClick={sub.onClick}
                />
              ))}
            </SideNavGroup>
          );
        }

        return (
          <SideNavItem
            key={item.id}
            as={item.href ? "a" : "button"}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={item.active}
            onClick={item.onClick}
          />
        );
      })}
    </SideNav>
  );
}

// ── TopHeader ──────────────────────────────────────────────────────────────────

export function TopHeader({
  logo,
  logoText,
  logoHref = "/",
  navItems = [],
  actions = [],
  loginButton,
  className = "",
}) {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [openAction, setOpenAction] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  // SideNav handles its own Escape key; Menu handles its own Escape + outside click.

  return (
    <>
      <header
        className={["a1-top-header", className].filter(Boolean).join(" ")}
      >
        <button
          type="button"
          className="a1-top-header__hamburger"
          aria-label="Open navigation menu"
          aria-expanded={mobileNavOpen}
          onClick={() => setMobileNavOpen(true)}
        >
          <Icon name="menu" aria-hidden="true" />
        </button>

        {(logo ?? logoText) && (
          <a href={logoHref} className="a1-top-header__logo">
            {logo ?? logoText}
          </a>
        )}

        {navItems.length > 0 && (
          <nav className="a1-top-header__nav" aria-label="Main navigation">
            <ul className="a1-top-header__nav-list" role="list">
              {navItems.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  openId={openSubmenu}
                  onOpen={setOpenSubmenu}
                />
              ))}
            </ul>
          </nav>
        )}

        <div className="a1-top-header__end">
          {actions.map((action) => (
            <ActionMenu
              key={action.id}
              action={action}
              isOpen={openAction === action.id}
              onToggle={() =>
                setOpenAction(openAction === action.id ? null : action.id)
              }
            />
          ))}
          {loginButton && (
            <div className="a1-top-header__login">
              <Button
                variant="primary"
                size="sm"
                onClick={loginButton.onClick}
              >
                {loginButton.label ?? "Log in"}
              </Button>
            </div>
          )}
        </div>
      </header>

      {mobileNavOpen && (
        <MobileDrawer
          navItems={navItems}
          onClose={() => setMobileNavOpen(false)}
        />
      )}
    </>
  );
}
