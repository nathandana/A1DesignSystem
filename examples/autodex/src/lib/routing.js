export const pageIds = ["home", "search", "details"];

export function getRouteBase(pathname = window.location.pathname) {
  return pathname.startsWith("/examples/autodex") ? "/examples/autodex" : "";
}

export function getRoute(pathname = window.location.pathname, search = window.location.search) {
  const params = new URLSearchParams(search);
  const page = pageIds.includes(params.get("page")) ? params.get("page") : "home";

  return {
    page,
    query: params.get("q") ?? "",
    car: params.get("car") ?? "",
    make: params.get("make") ?? "",
    era: params.get("era") ?? "",
  };
}

export function getRoutePath(page = "home", { query, car, make, era } = {}) {
  const base = getRouteBase();
  const pagePath = base ? `${base}/` : "/";
  const params = new URLSearchParams();

  if (page !== "home") {
    params.set("page", page);
  }

  if (query) {
    params.set("q", query);
  }

  if (car) {
    params.set("car", car);
  }

  if (make) {
    params.set("make", make);
  }

  if (era) {
    params.set("era", era);
  }

  const queryString = params.toString();
  return `${pagePath}${queryString ? `?${queryString}` : ""}`;
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
