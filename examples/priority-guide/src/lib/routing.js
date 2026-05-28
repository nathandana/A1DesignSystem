import { pageIds, exampleGuides, exampleFlows } from "./data.jsx";
import { hasLocalGuides } from "./storage.js";

export function getRouteBase(pathname = window.location.pathname) {
  return pathname.startsWith("/examples/priority-guide") ? "/examples/priority-guide" : "";
}

export function getRoute(pathname = window.location.pathname, search = window.location.search, hash = window.location.hash) {
  const params = new URLSearchParams(search);
  const pageParam = params.get("page");
  const page = pageIds.includes(pageParam)
    ? pageParam
    : (!hash && hasLocalGuides() ? "guides" : "home");
  const guide = params.get("guide");

  return {
    page,
    guide: guide || exampleGuides[0].id,
    flow: params.get("flow") || exampleFlows[0].id,
    hash: hash.replace(/^#/, ""),
  };
}

export function getRoutePath(page = "home", { guide, flow, hash } = {}) {
  const base = getRouteBase();
  const pagePath = base ? `${base}/` : "/";
  const params = new URLSearchParams();

  if (page === "examples") {
    params.set("page", "examples");
    if (guide) {
      params.set("guide", guide);
    }
  } else if (page === "start") {
    params.set("page", "start");
  } else if (page === "flows") {
    params.set("page", "flows");
    if (flow) {
      params.set("flow", flow);
    }
  } else if (page === "flow-editor") {
    params.set("page", "flow-editor");
    if (flow) {
      params.set("flow", flow);
    }
  } else if (page === "guides") {
    params.set("page", "guides");
  } else if (page === "new") {
    params.set("page", "new");
  } else if (page === "editor") {
    params.set("page", "editor");
    if (guide) {
      params.set("guide", guide);
    }
  } else if (page === "presentation") {
    params.set("page", "presentation");
    if (guide) {
      params.set("guide", guide);
    }
  }

  const query = params.toString();

  return `${pagePath}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
}

export function isPlainLeftClick(event) {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.shiftKey
  );
}
