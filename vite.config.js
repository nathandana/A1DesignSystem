import { existsSync } from "node:fs";
import { join } from "node:path";

export default {
  plugins: [
    {
      name: "example-history-fallback",
      configureServer(server) {
        const root = server.config.root;

        server.middlewares.use((req, _res, next) => {
          const url = req.url ?? "";
          const path = url.split("?")[0];
          const isPortfolioRoute = path === "/examples/portfolio" || path.startsWith("/examples/portfolio/");
          const isNathanDanaRoute = path === "/examples/nathan-dana" || path.startsWith("/examples/nathan-dana/");
          const isAutodexRoute = path === "/examples/autodex" || path.startsWith("/examples/autodex/");
          const isAssetRequest = /\.[a-z0-9]+$/i.test(path);

          if (isPortfolioRoute && !isAssetRequest) {
            req.url = "/examples/portfolio/index.html";
          } else if (isNathanDanaRoute && !isAssetRequest) {
            req.url = "/examples/nathan-dana/index.html";
          } else if (isAutodexRoute && !isAssetRequest) {
            req.url = "/examples/autodex/index.html";
          } else if (isAssetRequest && !existsSync(join(root, path))) {
            // Examples are built to be deployed standalone at their own domain
            // root, so their HTML/JS reference assets and entry scripts either
            // root-absolute ("/img/foo.png") or root-relative ("./main.jsx").
            // Both resolve correctly at "/examples/<name>/" itself, but break
            // once client-side routing shows a deeper URL like
            // "/examples/<name>/case-studies/a1" — a root-absolute request
            // loses the "/examples/<name>" prefix entirely, and a root-relative
            // one picks up extra path segments it was never meant to have. Use
            // the referring page's URL to recover the example and fall back to
            // its real copy of the file, so local dev matches the standalone
            // production deploy without changing example source.
            const referer = req.headers.referer ?? "";
            const match = referer.match(/\/examples\/([^/]+)\//);
            if (match) {
              const [, exampleName] = match;
              const exampleRoot = join(root, "examples", exampleName);
              const prefix = `/examples/${exampleName}/`;

              // Root-absolute request (e.g. "/img/foo.png") — try it directly under
              // the example's own root. Root-relative-to-a-deep-page request (e.g.
              // "./main.jsx" resolved against ".../<name>/case-studies/a1") — the
              // real file lives higher up, so try progressively shorter tails of
              // what follows the example prefix until one exists.
              const tails = path.startsWith(prefix)
                ? path.slice(prefix.length).split("/").map((_, i, segments) => segments.slice(i).join("/"))
                : [path.replace(/^\//, "")];

              for (const tail of tails) {
                if (existsSync(join(exampleRoot, tail))) {
                  req.url = `${prefix}${tail}`;
                  break;
                }
              }
            }
          }

          next();
        });
      },
    },
  ],
};
