import { useEffect, useState } from "react"
import { getRoute, getRoutePath, isPlainLeftClick } from "./lib/routing.js"
import { GamePage, LoginPage, StartPage } from "./pages/index.js"

const PAGE_TITLES = {
  start: "CatLympics",
  login: "Sign in | CatLympics",
  game: "Arena | CatLympics",
}

export function App() {
  const [route, setRoute] = useState(() => getRoute())

  useEffect(() => {
    document.documentElement.classList.add("a1-theme-catlympics")
    return () => document.documentElement.classList.remove("a1-theme-catlympics")
  }, [])

  useEffect(() => {
    document.title = PAGE_TITLES[route.page] ?? "CatLympics"
  }, [route.page])

  useEffect(() => {
    window.history.replaceState(getRoute(), "", window.location.href)

    const onPopState = () => {
      setRoute(getRoute())
    }

    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])

  function navigate(page) {
    const nextRoute = { page }
    const nextPath = getRoutePath(page)
    const currentPath = `${window.location.pathname}${window.location.search}`

    if (nextPath !== currentPath) {
      window.history.pushState(nextRoute, "", nextPath)
    }

    setRoute(nextRoute)
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }

  function handleNavigate(event, page) {
    if (!event) {
      navigate(page)
      return
    }

    if (!isPlainLeftClick(event)) return

    event.preventDefault()
    navigate(page)
  }

  if (route.page === "login") {
    return <LoginPage onNavigate={handleNavigate} />
  }

  if (route.page === "game") {
    return <GamePage onNavigate={handleNavigate} />
  }

  return <StartPage onNavigate={handleNavigate} />
}
