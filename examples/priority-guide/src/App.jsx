import React, { useEffect, useRef, useState } from "react";
import {
  IconButton,
  Menu,
  PageLayout,
  SegmentedControl,
} from "../../../packages/react/src/index.js";
import { exampleGuides, exampleFlows, pageIds } from "./lib/data.jsx";
import { getRoute, getRoutePath, isPlainLeftClick } from "./lib/routing.js";
import {
  EditorPage,
  ExamplesPage,
  FlowEditorPage,
  FlowsPage,
  GuideLibraryPage,
  LandingPage,
  NewGuidePage,
  PresentationPage,
  StartPage,
} from "./pages/index.js";

function loadAppSettings() {
  try { return JSON.parse(localStorage.getItem("priority-guide-settings") ?? "{}"); } catch { return {}; }
}
function saveAppSettings(s) { localStorage.setItem("priority-guide-settings", JSON.stringify(s)); }
function applyTheme(theme) {
  document.documentElement.classList.remove("a1-theme-light", "a1-theme-dark");
  if (theme === "light") document.documentElement.classList.add("a1-theme-light");
  if (theme === "dark") document.documentElement.classList.add("a1-theme-dark");
}

export function App() {
  const [route, setRoute] = useState(() => getRoute());
  const [settings, setSettings] = useState(() => loadAppSettings());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsAnchorRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.add("a1-theme-heritage");
    return () => { document.documentElement.classList.remove("a1-theme-heritage"); };
  }, []);

  useEffect(() => { applyTheme(settings.theme ?? "system"); }, [settings.theme]);

  function updateSetting(key, value) {
    const next = { ...settings, [key]: value };
    setSettings(next);
    saveAppSettings(next);
  }

  useEffect(() => {
    const pageTitles = {
      examples: "Examples | Priority Guide",
      start: "Start | Priority Guide",
      flows: "Flows | Priority Guide",
      "flow-editor": "Flow Editor | Priority Guide",
      guides: "Pages | Priority Guide",
      new: "New guide | Priority Guide",
      editor: "Pages | Priority Guide",
      presentation: "Presentation | Priority Guide",
    };
    const title = pageTitles[route.page] ?? "Priority Guide";
    document.title = title;
  }, [route.page]);

  useEffect(() => {
    window.history.replaceState(getRoute(), "", window.location.href);

    const onPopState = () => {
      setRoute(getRoute());
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (route.page !== "home") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    if (!route.hash) return;

    window.requestAnimationFrame(() => {
      const target = document.getElementById(route.hash);
      target?.scrollIntoView();
    });
  }, [route.page, route.hash]);

  function navigate(page, { guide = route.guide, flow = route.flow, hash } = {}) {
    const nextRoute = {
      page: pageIds.includes(page) ? page : "home",
      guide: guide || exampleGuides[0].id,
      flow: flow || exampleFlows[0].id,
      hash: hash ?? "",
    };
    const nextPath = getRoutePath(nextRoute.page, { guide: nextRoute.guide, flow: nextRoute.flow, hash });
    const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    if (nextPath !== currentPath) {
      window.history.pushState(nextRoute, "", nextPath);
    }

    setRoute(nextRoute);
  }

  function handleRouteClick(event, page, options) {
    if (!event) {
      navigate(page, options);
      return;
    }

    if (!isPlainLeftClick(event)) return;

    event.preventDefault();
    navigate(page, options);
  }

  function handleGuideChange(guide) {
    navigate("examples", { guide });
  }

  const themeOptions = [
    { value: "light", icon: "light_mode", label: "Light" },
    { value: "dark", icon: "dark_mode", label: "Dark" },
    { value: "system", icon: "computer", label: "System" },
  ];
  const currentTheme = settings.theme ?? "system";

  const header = (
    <header className="priority-guide-header">
      <a
        className="priority-guide-logo"
        href={getRoutePath("home")}
        onClick={(event) => handleRouteClick(event, "home")}
        aria-current={route.page === "home" && !route.hash ? "page" : undefined}
      >
        Priority Guide: Align before AI
      </a>
      <nav aria-label="Primary navigation">
        <a
          className={route.page === "home" ? "priority-guide-nav-link--active" : ""}
          href={getRoutePath("home", { hash: "overview" })}
          onClick={(event) => handleRouteClick(event, "home", { hash: "overview" })}
        >
          Overview
        </a>
        <a
          className={route.page === "examples" ? "priority-guide-nav-link--active" : ""}
          href={getRoutePath("examples", { guide: route.guide })}
          onClick={(event) => handleRouteClick(event, "examples")}
          aria-current={route.page === "examples" ? "page" : undefined}
        >
          Examples
        </a>
        <a
          className={route.page === "start" ? "priority-guide-nav-link--active" : ""}
          href={getRoutePath("start")}
          onClick={(event) => handleRouteClick(event, "start")}
          aria-current={route.page === "start" ? "page" : undefined}
        >
          Start
        </a>
        <a
          className={route.page === "flows" || route.page === "flow-editor" ? "priority-guide-nav-link--active" : ""}
          href={getRoutePath("flows", { flow: route.flow })}
          onClick={(event) => handleRouteClick(event, "flows")}
          aria-current={route.page === "flows" || route.page === "flow-editor" ? "page" : undefined}
        >
          Flows
        </a>
        <a
          className={route.page === "guides" || route.page === "editor" || route.page === "new" ? "priority-guide-nav-link--active" : ""}
          href={getRoutePath("guides")}
          onClick={(event) => handleRouteClick(event, "guides")}
          aria-current={route.page === "guides" || route.page === "editor" || route.page === "new" ? "page" : undefined}
        >
          Pages
        </a>
      </nav>
      <div ref={settingsAnchorRef} className="priority-guide-header-settings">
        <IconButton
          icon="settings"
          label="Settings"
          aria-haspopup="dialog"
          aria-expanded={settingsOpen}
          onClick={() => setSettingsOpen((v) => !v)}
        />
        <Menu open={settingsOpen} onClose={() => setSettingsOpen(false)} anchorRef={settingsAnchorRef} aria-label="Settings">
          <div className="priority-guide-settings-menu">
            <p className="priority-guide-settings-menu__label">Theme</p>
            <SegmentedControl
              options={themeOptions}
              value={currentTheme}
              onChange={(v) => updateSetting("theme", v)}
              fullWidth
            />
          </div>
        </Menu>
      </div>
    </header>
  );

  if (route.page === "presentation") {
    return <PresentationPage activeGuide={route.guide} onNavigate={handleRouteClick} />;
  }

  return (
    <PageLayout stickyHeader header={header}>
      {route.page === "examples" ? (
        <ExamplesPage activeGuide={route.guide} onGuideChange={handleGuideChange} />
      ) : route.page === "start" ? (
        <StartPage onNavigate={handleRouteClick} />
      ) : route.page === "flows" ? (
        <FlowsPage onNavigate={handleRouteClick} />
      ) : route.page === "flow-editor" ? (
        <FlowEditorPage flowId={route.flow} onNavigate={handleRouteClick} />
      ) : route.page === "guides" ? (
        <GuideLibraryPage onNavigate={handleRouteClick} />
      ) : route.page === "new" ? (
        <NewGuidePage onNavigate={handleRouteClick} />
      ) : route.page === "editor" ? (
        <EditorPage onNavigate={handleRouteClick} activeGuide={route.guide} />
      ) : (
        <LandingPage onNavigate={handleRouteClick} />
      )}
    </PageLayout>
  );
}
