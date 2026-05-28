import React from "react";

export function AppHeader({ page, onNavigate, children }) {
  return (
    <header className="theme-header">
      <a
        className="theme-header__logo"
        href="/"
        onClick={(e) => onNavigate("home", e)}
      >
        A1 Design System
      </a>
      <nav>
        <a
          className={`theme-header__link${page === "home" ? " theme-header__link--active" : ""}`}
          href="/"
          onClick={(e) => onNavigate("home", e)}
        >
          Home
        </a>
        <a
          className={`theme-header__link${page === "components" ? " theme-header__link--active" : ""}`}
          href="?page=components"
          onClick={(e) => onNavigate("components", e)}
        >
          Components
        </a>
      </nav>
      {children && <div className="theme-header__actions">{children}</div>}
    </header>
  );
}
