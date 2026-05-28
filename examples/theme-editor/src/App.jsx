import React, { useEffect, useState } from "react";
import { ComponentsPage } from "./pages/ComponentsPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";

function getPage() {
  return new URLSearchParams(window.location.search).get("page") ?? "home";
}

function isPlainLeftClick(e) {
  return e.button === 0 && !e.metaKey && !e.altKey && !e.ctrlKey && !e.shiftKey;
}

export function App() {
  const [page, setPage] = useState(getPage);

  useEffect(() => {
    const onPop = () => setPage(getPage());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function navigate(nextPage, e) {
    if (e && !isPlainLeftClick(e)) return;
    e?.preventDefault();
    const url = nextPage === "home" ? "/" : `?page=${nextPage}`;
    window.history.pushState({}, "", url);
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  if (page === "components") return <ComponentsPage onNavigate={navigate} />;
  return <HomePage onNavigate={navigate} />;
}
