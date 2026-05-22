import "./page-layout.css";

export function PageLayout({
  header,
  footer,
  sidebar,
  sidebarPlacement = "start",
  stickyHeader = false,
  className = "",
  children,
  ...props
}) {
  const rootClasses = [
    "a1-page-layout",
    stickyHeader && "a1-page-layout--sticky-header",
    sidebar && `a1-page-layout--sidebar-${sidebarPlacement}`,
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
        <main className="a1-page-layout__main">{children}</main>
      </div>

      {footer && (
        <footer className="a1-page-layout__footer">{footer}</footer>
      )}
    </div>
  );
}
