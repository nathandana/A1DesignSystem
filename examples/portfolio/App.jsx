import { useEffect, useState } from "react";
import {
  Cluster,
  IconButton,
  LabelsProvider,
  Link,
  MessageBadge,
  PageLayout,
  Paragraph,
  SideNav,
  SideNavGroup,
  SideNavItem,
  Stack,
} from "../../packages/react/src/index.js";
import actionLabels from "../../system/labels/action.json";
import { caseStudies } from "./data/caseStudies.js";
import { getPageFromLocation, getRoutePath, isPlainLeftClick } from "./utils/routing.js";
import { HomePage } from "./pages/HomePage.jsx";
import { ProcessPage } from "./pages/ProcessPage.jsx";
import { ResumePage } from "./pages/ResumePage.jsx";
import { TestimonialsPage } from "./pages/TestimonialsPage.jsx";
import { AboutPage } from "./pages/AboutPage.jsx";
import { ContactPage } from "./pages/ContactPage.jsx";
import "./styles.css";
import "../../packages/react/src/utilities/spacing.css";

export function App() {
  const [activePage, setActivePage] = useState(() => getPageFromLocation());
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    window.history.replaceState({ page: activePage }, "", window.location.href);
    const onPopState = () => {
      setActivePage(getPageFromLocation());
      setNavOpen(false);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const activeStudy = caseStudies.find((study) => study.id === activePage);
    const titles = {
      home: "Nathan Dana — Principal AI Designer",
      about: "About — Nathan Dana",
      process: "Design Process — Nathan Dana",
      resume: "Résumé & Experience — Nathan Dana",
      testimonials: "Recommendations — Nathan Dana",
      contact: "Get in Touch — Nathan Dana",
    };
    document.title = activeStudy
      ? `${activeStudy.title} — Case Study — Nathan Dana`
      : titles[activePage] ?? titles.home;
  }, [activePage]);

  const navigate = (page, event) => {
    if (event) {
      if (!isPlainLeftClick(event)) return;
      event.preventDefault();
    }
    const nextPath = getRoutePath(page);
    const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (nextPath !== currentPath) {
      window.history.pushState({ page }, "", nextPath);
    }
    setActivePage(page);
    setNavOpen(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const activeStudy = caseStudies.find((s) => s.id === activePage);

  const sidebar = (
    <SideNav
      open={navOpen}
      onClose={() => setNavOpen(false)}
      header={(collapsed) =>
        !collapsed ? (
          <div className="pf-nav-brand">
            <span className="pf-nav-brand-name">
              Nathan <span className="pf-mobile-logo-accent">Dana</span>
            </span>
            <span className="pf-nav-brand-title">Principal AI Designer</span>
          </div>
        ) : null
      }
    >
      <SideNavItem
        href={getRoutePath("home")}
        icon="home"
        label="Home"
        active={activePage === "home"}
        onClick={(event) => navigate("home", event)}
      />
      <SideNavItem
        href={getRoutePath("about")}
        icon="person"
        label="About"
        active={activePage === "about"}
        onClick={(event) => navigate("about", event)}
      />
      <SideNavItem
        href={getRoutePath("process")}
        icon="psychology"
        label="Process"
        active={activePage === "process"}
        onClick={(event) => navigate("process", event)}
      />
      <SideNavGroup icon="work" label="Case studies" defaultOpen>
        {caseStudies.map((study) => (
          <SideNavItem
            key={study.id}
            href={getRoutePath(study.id)}
            label={study.title}
            active={activePage === study.id}
            onClick={(event) => navigate(study.id, event)}
            badge={study.badge && <MessageBadge size="sm" icon={null}>{study.badge}</MessageBadge>}
          />
        ))}
      </SideNavGroup>
      <SideNavItem
        href={getRoutePath("resume")}
        icon="description"
        label="Resume"
        active={activePage === "resume"}
        onClick={(event) => navigate("resume", event)}
      />
      <SideNavItem
        href={getRoutePath("testimonials")}
        icon="forum"
        label="Testimonials"
        active={activePage === "testimonials"}
        onClick={(event) => navigate("testimonials", event)}
      />
      <SideNavItem
        href={getRoutePath("contact")}
        icon="mail"
        label="Contact"
        active={activePage === "contact"}
        onClick={(event) => navigate("contact", event)}
      />
    </SideNav>
  );

  const mobileHeader = (
    <Stack direction="row" align="center" gap="sm"  className="pf-mobile-header">
      <IconButton
        icon="menu"
        label="Open navigation"
        onClick={() => setNavOpen(true)}
      />
      <Link
        href={getRoutePath("home")}
        className="pf-mobile-logo"
        onClick={(event) => navigate("home", event)}
      >
        Nathan <span className="pf-mobile-logo-accent">Dana</span>
      </Link>
    </Stack>
  );

  const footer = (
    <Stack
      className="pf-footer"
      direction={{ xs: "column", md: "row" }}
      align="center"
      justify="between"
      gap="md"
      wrap
    >
      <Paragraph size="sm" color="muted">
        Nathan Dana
      </Paragraph>
      <Cluster as="nav" aria-label="Footer navigation" gap={24} justify="center">
        <Link
          href={getRoutePath("resume")}
          onClick={(event) => navigate("resume", event)}
        >
          Résumé
        </Link>
        <Link
          href="https://www.linkedin.com/in/midbrain"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </Link>
        <Link href="mailto:nathan.dana@gmail.com">
          nathan.dana@gmail.com
        </Link>
      </Cluster>
      <Paragraph size="sm" color="muted">
        © {new Date().getFullYear()} Nathan Dana
      </Paragraph>
    </Stack>
  );

  return (
    <LabelsProvider locale="en" labels={actionLabels}>
      <PageLayout stickyHeader sidebar={sidebar} header={mobileHeader} footer={footer}>
        {activePage === "home" && <HomePage navigate={navigate} />}
        {activePage === "process" && <ProcessPage navigate={navigate} />}
        {activeStudy && <activeStudy.component />}
        {activePage === "resume" && <ResumePage />}
        {activePage === "testimonials" && <TestimonialsPage />}
        {activePage === "about" && <AboutPage navigate={navigate} />}
        {activePage === "contact" && <ContactPage />}
      </PageLayout>
    </LabelsProvider>
  );
}
