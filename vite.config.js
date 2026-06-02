export default {
  plugins: [
    {
      name: "example-history-fallback",
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const url = req.url ?? "";
          const path = url.split("?")[0];
          const isPortfolioRoute = path === "/examples/portfolio" || path.startsWith("/examples/portfolio/");
          const isNathanDanaRoute = path === "/examples/nathan-dana" || path.startsWith("/examples/nathan-dana/");
          const isAssetRequest = /\.[a-z0-9]+$/i.test(path);

          if (isPortfolioRoute && !isAssetRequest) {
            req.url = "/examples/portfolio/index.html";
          } else if (isNathanDanaRoute && !isAssetRequest) {
            req.url = "/examples/nathan-dana/index.html";
          }

          next();
        });
      },
    },
  ],
};
