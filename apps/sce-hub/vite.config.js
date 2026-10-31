import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import postcssGlobalData from "@csstools/postcss-global-data";
import postcssCustomMedia from "postcss-custom-media";
const root = fileURLToPath(new URL("../..", import.meta.url));
export default {
  resolve: {
    alias: [
      {
        find: "@gtivr4/a1-design-system-react",
        replacement: resolve(root, "packages/react/src/index.js"),
      },
    ],
  },
  server: {
    fs: {
      allow: [root],
      deny: [
        ".env",
        ".env.*",
        "*.{crt,pem}",
        "**/.git/**",
        "**/data/**",
        "**/*.sqlite*",
        "**/src/pdf/**",
        "**/*.pdf",
      ],
    },
    proxy: { "/api": "http://127.0.0.1:5191" },
  },
  css: {
    postcss: {
      plugins: [
        postcssGlobalData({
          files: [resolve(root, "build/css/breakpoints.css")],
        }),
        postcssCustomMedia(),
      ],
    },
  },
  build: { outDir: "dist", chunkSizeWarningLimit: 1500 },
};
