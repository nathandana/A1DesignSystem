import { caseStudies } from "../data/caseStudies.js";

export function getRouteBase(pathname = window.location.pathname) {
  return pathname.startsWith("/examples/portfolio") ? "/examples/portfolio" : "";
}

export function getRoutePath(page = "home") {
  const base = getRouteBase();
  const prefix = base || "";
  if (page === "home") return `${prefix}/`;
  if (page === "process") return `${prefix}/process`;
  if (page === "resume") return `${prefix}/resume`;
  if (page === "testimonials") return `${prefix}/testimonials`;
  if (page === "contact") return `${prefix}/contact`;
  if (page === "about") return `${prefix}/about`;
  if (caseStudies.some((study) => study.id === page)) return `${prefix}/case-studies/${page}`;
  return `${prefix}/`;
}

export function getPageFromLocation(pathname = window.location.pathname) {
  const base = getRouteBase(pathname);
  const path = (base ? pathname.slice(base.length) : pathname).replace(/\/+$/, "") || "/";
  if (path === "/") return "home";
  if (path === "/process") return "process";
  if (path === "/resume") return "resume";
  if (path === "/testimonials") return "testimonials";
  if (path === "/contact") return "contact";
  if (path === "/about") return "about";
  const caseMatch = path.match(/^\/case-studies\/([^/]+)$/);
  if (caseMatch && caseStudies.some((study) => study.id === caseMatch[1])) {
    return caseMatch[1];
  }
  return "home";
}

export function isPlainLeftClick(event) {
  return event.button === 0 && !event.metaKey && !event.altKey && !event.ctrlKey && !event.shiftKey;
}
