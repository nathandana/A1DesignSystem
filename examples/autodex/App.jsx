import { useEffect, useState } from "react";
import {
  IconButton,
  LabelsProvider,
  Link,
  PageLayout,
  Paragraph,
  SideNav,
  SideNavItem,
  Stack,
} from "../../packages/react/src/index.js";
import actionLabels from "../../system/labels/action.json";
import { getRoute, getRoutePath, isPlainLeftClick } from "./src/lib/routing.js";
import { HomePage } from "./src/pages/HomePage.jsx";
import { SearchPage } from "./src/pages/SearchPage.jsx";
import { DetailsPage } from "./src/pages/DetailsPage.jsx";
import "./styles.css";
import "../../packages/react/src/utilities/spacing.css";

const pageTitles = {
  home: "AutoDex — Every Car, Every Spec",
  search: "Search — AutoDex",
  details: "Vehicle Details — AutoDex",
};

export function App() {
  const [route, setRoute] = useState(() => getRoute());
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("a1-theme-autodex");
    return () => document.documentElement.classList.remove("a1-theme-autodex");
  }, []);

  useEffect(() => {
    window.history.replaceState({ route }, "", window.location.href);
    const onPopState = () => {
      setRoute(getRoute());
      setNavOpen(false);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    document.title = pageTitles[route.page] ?? pageTitles.home;
  }, [route.page]);

  const navigate = (page, event, params = {}) => {
    if (event) {
      if (!isPlainLeftClick(event)) return;
      event.preventDefault();
    }

    const nextPath = getRoutePath(page, params);
    const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    if (nextPath !== currentPath) {
      window.history.pushState({ page }, "", nextPath);
    }

    setRoute(getRoute(undefined, new URL(nextPath, window.location.origin).search));
    setNavOpen(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const sidebar = (
    <SideNav
      open={navOpen}
      onClose={() => setNavOpen(false)}
      header={(collapsed) =>
        !collapsed ? (
          <div className="ad-nav-brand">
            <span className="ad-nav-brand-name">Auto<span className="ad-accent">Dex</span></span>
            <span className="ad-nav-brand-tag">Vehicle Registry</span>
          </div>
        ) : null
      }
    >
      <SideNavItem
        href={getRoutePath("home")}
        icon="home"
        label="Home"
        active={route.page === "home"}
        onClick={(event) => navigate("home", event)}
      />
      <SideNavItem
        href={getRoutePath("search")}
        icon="search"
        label="Search"
        active={route.page === "search"}
        onClick={(event) => navigate("search", event)}
      />
      <SideNavItem
        href={getRoutePath("search", { query: "bolt pattern" })}
        icon="settings"
        label="Bolt patterns"
        active={route.page === "search" && route.query.includes("bolt")}
        onClick={(event) => navigate("search", event, { query: "bolt pattern" })}
      />
      <SideNavItem
        href={getRoutePath("details", { car: "1990-mazda-miata-se" })}
        icon="directions_car"
        label="1990 Miata SE"
        active={route.page === "details" && route.car === "1990-mazda-miata-se"}
        onClick={(event) => navigate("details", event, { car: "1990-mazda-miata-se" })}
      />
    </SideNav>
  );

  const mobileHeader = (
    <Stack direction="row" align="center" gap="sm" className="ad-mobile-header">
      <IconButton icon="menu" label="Open navigation" onClick={() => setNavOpen(true)} />
      <Link href={getRoutePath("home")} className="ad-mobile-logo" onClick={(event) => navigate("home", event)}>
        Auto<span className="ad-accent">Dex</span>
      </Link>
    </Stack>
  );

  const footer = (
    <div className="ad-footer">
      <Paragraph size="sm" color="muted">
        AutoDex Vehicle Registry — factory specs down to the bolt pattern.
      </Paragraph>
      <Paragraph size="sm" color="muted">
        © {new Date().getFullYear()} AutoDex
      </Paragraph>
    </div>
  );

  return (
    <LabelsProvider locale="en" labels={actionLabels}>
      <PageLayout stickyHeader sidebar={sidebar} header={mobileHeader} footer={footer}>
        {route.page === "home" && <HomePage navigate={navigate} />}
        {route.page === "search" && <SearchPage navigate={navigate} route={route} />}
        {route.page === "details" && <DetailsPage navigate={navigate} route={route} />}
      </PageLayout>
    </LabelsProvider>
  );
}
