/** Hostname is the only audience selector; links and storage cannot override it. */
export function resolveAudience(hostname = "") {
  return hostname.toLowerCase().replace(/\.$/, "") === "nathan.a1design.app" ? "ux" : "systems";
}

export function currentAudience() {
  return resolveAudience(typeof window === "undefined" ? "" : window.location.hostname);
}

/** Preserve referral parameters and fragments, removing legacy audience queries. */
export function withAudience(path, _audience, search = "") {
  const url = new URL(path, "https://portfolio.local");
  if (url.origin !== "https://portfolio.local") return path;
  const params = new URLSearchParams(search);
  for (const [key, value] of url.searchParams) params.set(key, value);
  params.delete("audience");
  url.search = params.toString();
  return `${url.pathname}${url.search}${url.hash}`;
}
