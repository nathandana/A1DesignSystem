const PAGE_IDS = ["start", "login", "game"]

export function getRoute(search = window.location.search) {
  const params = new URLSearchParams(search)
  const page = params.get("page")
  return {
    page: PAGE_IDS.includes(page) ? page : "start",
  }
}

export function getRoutePath(page = "start") {
  const params = new URLSearchParams()
  if (page !== "start") {
    params.set("page", page)
  }
  const query = params.toString()
  return `${window.location.pathname}${query ? `?${query}` : ""}`
}

export function isPlainLeftClick(event) {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.shiftKey
  )
}
