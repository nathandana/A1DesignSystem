import { withAudience } from "./audience.js";
import { caseStudyAliases } from "../data/caseStudyAliases.js";
import { caseStudies } from "../data/caseStudies.js";

export function getRouteBase(pathname = window.location.pathname) {
  return pathname.startsWith("/examples/portfolio") ? "/examples/portfolio" : "";
}

function getPlainRoutePath(page = "home") {
  const base = getRouteBase();
  const prefix = base || "";
  page = caseStudyAliases[page] ?? page;
  if (page === "alternate") return `${prefix}/`;
  if (page === "home") return `${prefix}/`;
  if (page === "process") return `${prefix}/process`;
  if (page === "resume") return `${prefix}/resume`;
  if (page === "testimonials") return `${prefix}/testimonials`;
  if (page === "contact") return `${prefix}/contact`;
  if (page === "about") return `${prefix}/about`;
  if (caseStudies.some((study) => study.id === page)) return `${prefix}/case-studies/${page}`;
  return `${prefix}/`;
}

export function getRoutePath(page = "home", audience) {
  return withAudience(getPlainRoutePath(page), audience, typeof window === "undefined" ? "" : window.location.search);
}

export function getPageFromLocation(pathname = window.location.pathname) {
  const base = getRouteBase(pathname);
  const path = (base ? pathname.slice(base.length) : pathname).replace(/\/+$/, "") || "/";
  if (path === "/alternate") return "home";
  if (path === "/") return "home";
  if (path === "/process") return "process";
  if (path === "/resume") return "resume";
  if (path === "/testimonials") return "testimonials";
  if (path === "/contact") return "contact";
  if (path === "/about") return "about";
  const caseMatch = path.match(/^\/case-studies\/([^/]+)$/);
  const studyId = caseMatch && (caseStudyAliases[caseMatch[1]] ?? caseMatch[1]);
  if (studyId && caseStudies.some((study) => study.id === studyId)) {
    return studyId;
  }
  return "home";
}

export function isPlainLeftClick(event) {
  return event.button === 0 && !event.metaKey && !event.altKey && !event.ctrlKey && !event.shiftKey;
}
