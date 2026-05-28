export default {
  plugins: [
    {
      name: "example-history-fallback",
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const url = req.url ?? "";
          const isPortfolioRoute = url.startsWith("/examples/portfolio/");
          const isNathanDanaRoute = url === "/examples/nathan-dana" || url.startsWith("/examples/nathan-dana/");
          const isAssetRequest = /\.[a-z0-9]+($|\?)/i.test(url);

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
