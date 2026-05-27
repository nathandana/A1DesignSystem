import { createContext, useContext, useEffect, useState } from "react";
import "./scrim.css";
import "./side-nav.css";
import { Icon } from "../icon/Icon.jsx";
import { IconButton } from "../icon-button/IconButton.jsx";

const DepthCtx = createContext(0);
const SideNavCtx = createContext({ collapsed: false, onExpand: null });

/**
 * A leaf navigation item — renders an icon and label as a link or button.
 * In collapsed state (lg+), the label is hidden and used as a native tooltip.
 * @param {object} props
 * @param {"a"|"button"|string} [props.as="a"] - Underlying HTML element
 * @param {string} [props.icon] - Material Symbols icon name (recommended for collapsed nav)
 * @param {string} props.label - Visible label text
 * @param {boolean} [props.active] - Marks this item as the current page
 * @param {string} [props.className]
 */
export function SideNavItem({ as: Component = "a", icon, label, active, className = "", ...props }) {
  const depth = useContext(DepthCtx);
  const { collapsed } = useContext(SideNavCtx);

  const classes = [
    "a1-side-nav-item",
    active && "a1-side-nav-item--active",
    className,
  ].filter(Boolean).join(" ");

  return (
    <Component
      className={classes}
      style={{ "--a1-side-nav-depth": collapsed ? 0 : depth }}
      aria-current={active ? "page" : undefined}
      title={collapsed ? label : undefined}
      {...props}
    >
      {icon && <Icon name={icon} className="a1-side-nav-item__icon" />}
      <span className="a1-side-nav-item__label">{label}</span>
    </Component>
  );
}

/**
 * An expandable group — a trigger that reveals nested SideNavItems or SideNavGroups.
 * When the sidebar is collapsed (lg+), clicking the trigger expands the sidebar instead.
 * Supports uncontrolled (`defaultOpen`) and controlled (`open` + `onOpenChange`) usage.
 * @param {object} props
 * @param {string} [props.icon] - Material Symbols icon name (recommended for collapsed nav)
 * @param {string} props.label - Trigger label text
 * @param {boolean} [props.defaultOpen=false] - Initial expanded state (uncontrolled)
 * @param {boolean} [props.open] - Controlled expanded state
 * @param {function} [props.onOpenChange] - Called with next boolean when toggled
 * @param {React.ReactNode} props.children - Nested SideNavItems or SideNavGroups
 * @param {string} [props.className]
 */
export function SideNavGroup({ icon, label, defaultOpen = false, open: controlledOpen, onOpenChange, children, className = "", ...props }) {
  const depth = useContext(DepthCtx);
  const { collapsed, onExpand } = useContext(SideNavCtx);
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isControlled ? controlledOpen : internalOpen;

  function toggle() {
    if (collapsed) { onExpand?.(); return; }
    if (!isControlled) setInternalOpen(v => !v);
    onOpenChange?.(!isOpen);
  }

  const triggerClasses = [
    "a1-side-nav-item",
    "a1-side-nav-group__trigger",
    isOpen && "a1-side-nav-group__trigger--open",
    className,
  ].filter(Boolean).join(" ");

  const childrenClasses = [
    "a1-side-nav-group__children",
    isOpen && "a1-side-nav-group__children--open",
  ].filter(Boolean).join(" ");

  return (
    <div className="a1-side-nav-group" {...props}>
      <button
        type="button"
        className={triggerClasses}
        style={{ "--a1-side-nav-depth": collapsed ? 0 : depth }}
        aria-expanded={collapsed ? undefined : isOpen}
        title={collapsed ? label : undefined}
        onClick={toggle}
      >
        {icon && <Icon name={icon} className="a1-side-nav-item__icon" />}
        <span className="a1-side-nav-item__label">{label}</span>
        <Icon name="chevron_right" className="a1-side-nav-group__chevron" />
      </button>
      <div className={childrenClasses}>
        <DepthCtx.Provider value={depth + 1}>
          <div className="a1-side-nav-group__children-inner">
            {children}
          </div>
        </DepthCtx.Provider>
      </div>
    </div>
  );
}

/**
 * Side navigation shell with responsive controls, header, nav area, and footer slots.
 *
 * Responsive behavior:
 * - xs (≤480px): full-viewport-width fixed overlay; built-in close (✕) button
 * - sm/md (481–1024px): fixed-width overlay with scrim; built-in close (✕) button
 * - lg/xl (≥1025px): persistent in the document flow; built-in collapse (‹/›) toggle
 *
 * The close button is rendered inline with the header content. The desktop
 * collapse button can be rendered in the header or footer.
 *
 * @param {object} props
 * @param {React.ReactNode | ((collapsed: boolean) => React.ReactNode)} [props.header]
 *   Header content. Pass a render function to receive the current collapsed state,
 *   e.g. `header={(collapsed) => <MyLogo collapsed={collapsed} />}`.
 * @param {React.ReactNode} [props.footer] - Below nav items; hidden when collapsed
 * @param {React.ReactNode} props.children - SideNavItem and SideNavGroup elements
 * @param {boolean} [props.open=false] - Controls overlay visibility on xs/sm/md
 * @param {function} [props.onClose] - Called when scrim, Escape, or the close button is triggered
 * @param {boolean} [props.defaultCollapsed=false] - Initial collapsed state for lg/xl (uncontrolled)
 * @param {boolean} [props.collapsed] - Controlled collapsed state for lg/xl
 * @param {function} [props.onCollapsedChange] - Called with next boolean when collapsed state changes
 * @param {"header"|"footer"} [props.collapseButtonPlacement="header"] - Where the desktop collapse button appears
 * @param {"start"|"end"} [props.placement="start"] - Side of the viewport/layout where the nav appears
 * @param {string} [props.className]
 */
export function SideNav({
  header, footer, children,
  open = false, onClose,
  collapsed: controlledCollapsed, defaultCollapsed = false, onCollapsedChange,
  collapseButtonPlacement = "header",
  placement = "start",
  className = "", ...props
}) {
  const isCollapsedControlled = controlledCollapsed !== undefined;
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const isCollapsed = isCollapsedControlled ? controlledCollapsed : internalCollapsed;

  function toggleCollapse() {
    if (!isCollapsedControlled) setInternalCollapsed(v => !v);
    onCollapsedChange?.(!isCollapsed);
  }

  function handleExpand() {
    if (!isCollapsedControlled) setInternalCollapsed(false);
    onCollapsedChange?.(false);
  }

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const resolvedHeader = typeof header === "function" ? header(isCollapsed) : header;

  const navClasses = [
    "a1-side-nav",
    `a1-side-nav--placement-${placement}`,
    collapseButtonPlacement === "footer" && "a1-side-nav--collapse-footer",
    open && "a1-side-nav--open",
    isCollapsed && "a1-side-nav--collapsed",
    className,
  ].filter(Boolean).join(" ");

  const collapseIcon = placement === "end"
    ? (isCollapsed ? "chevron_left" : "chevron_right")
    : (isCollapsed ? "chevron_right" : "chevron_left");

  return (
    <>
      <div
        className={`a1-scrim a1-side-nav__scrim${open ? " a1-scrim--visible" : ""}`}
        aria-hidden="true"
        onClick={onClose}
      />
      <nav className={navClasses} {...props}>
        {/* Header row: logo/content + inline close or collapse button */}
        <div className="a1-side-nav__header-row">
          {resolvedHeader && (
            <div className="a1-side-nav__header-content">{resolvedHeader}</div>
          )}
          <IconButton
            icon="close"
            label="Close navigation"
            className="a1-side-nav__close-btn"
            onClick={onClose}
          />
          <IconButton
            icon={collapseIcon}
            label={isCollapsed ? "Expand navigation" : "Collapse navigation"}
            className="a1-side-nav__collapse-btn"
            onClick={toggleCollapse}
            hidden={collapseButtonPlacement !== "header"}
          />
        </div>

        <SideNavCtx.Provider value={{ collapsed: isCollapsed, onExpand: handleExpand }}>
          <div className="a1-side-nav__nav">{children}</div>
        </SideNavCtx.Provider>

        {(footer || collapseButtonPlacement === "footer") && (
          <div className="a1-side-nav__footer">
            {footer && <div className="a1-side-nav__footer-content">{footer}</div>}
            {collapseButtonPlacement === "footer" && (
              <IconButton
                icon={collapseIcon}
                label={isCollapsed ? "Expand navigation" : "Collapse navigation"}
                className="a1-side-nav__collapse-btn"
                onClick={toggleCollapse}
              />
            )}
          </div>
        )}
      </nav>
    </>
  );
}
