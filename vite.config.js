export default {
  plugins: [
    {
      name: "portfolio-history-fallback",
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const url = req.url ?? "";
          const isPortfolioRoute = url.startsWith("/examples/portfolio/");
          const isAssetRequest = /\.[a-z0-9]+($|\?)/i.test(url);

          if (isPortfolioRoute && !isAssetRequest) {
            req.url = "/examples/portfolio/index.html";
          }

          next();
        });
      },
    },
  ],
};
