import postcssGlobalData from "@csstools/postcss-global-data";
import postcssCustomMedia from "postcss-custom-media";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  plugins: [
    postcssGlobalData({
      files: [resolve(__dirname, "build/css/breakpoints.css")],
    }),
    postcssCustomMedia(),
  ],
};
