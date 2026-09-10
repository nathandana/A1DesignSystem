#!/usr/bin/env node
import React from "react";
import { renderToString } from "react-dom/server";
import { createServer } from "vite";

const vite = await createServer({
  appType: "custom",
  server: { middlewareMode: true },
  ssr: { external: ["react", "react-dom"] },
});

try {
  const { TopHeader } = await vite.ssrLoadModule(
    "/packages/react/src/components/top-header/TopHeader.jsx",
  );
  const props = {
    logoText: "A1",
    navIconPosition: { xs: "hidden", md: "start" },
  };

  delete globalThis.window;
  const serverHtml = renderToString(React.createElement(TopHeader, props));

  globalThis.window = { matchMedia: () => ({ matches: true }) };
  const browserFirstRenderHtml = renderToString(React.createElement(TopHeader, props));

  if (serverHtml !== browserFirstRenderHtml) {
    throw new Error("TopHeader rendered different server and pre-hydration markup.");
  }

  console.log("RSC compatibility check passed — TopHeader initial markup is hydration-stable.");
} finally {
  delete globalThis.window;
  await vite.close();
}
