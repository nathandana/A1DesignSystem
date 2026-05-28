import "./page-layout.css";

export function PageLayout({
  header,
  footer,
  sidebar,
  sidebarPlacement = "start",
  aside,
  asidePlacement = "end",
  stickyHeader = false,
  viewportHeight = false,
  className = "",
  children,
  ...props
}) {
  const rootClasses = [
    "a1-page-layout",
    stickyHeader && "a1-page-layout--sticky-header",
    viewportHeight && "a1-page-layout--viewport-height",
    sidebar && `a1-page-layout--sidebar-${sidebarPlacement}`,
    aside && `a1-page-layout--aside-${asidePlacement}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClasses} {...props}>
      {header && (
        <header className="a1-page-layout__header">{header}</header>
      )}

      <div className="a1-page-layout__body">
        {sidebar && (
          <aside className="a1-page-layout__sidebar">{sidebar}</aside>
        )}
        <div className="a1-page-layout__content">
          {aside && asidePlacement === "start" && (
            <aside className="a1-page-layout__aside">{aside}</aside>
          )}
          <main className="a1-page-layout__main">{children}</main>
          {aside && asidePlacement !== "start" && (
            <aside className="a1-page-layout__aside">{aside}</aside>
          )}
        </div>
      </div>

      {footer && (
        <footer className="a1-page-layout__footer">{footer}</footer>
      )}
    </div>
  );
}
