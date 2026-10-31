import serverless from "serverless-http";
import { createApp } from "../../server/app.mjs";
import { cloudServices } from "../../server/cloud.mjs";
const app = createApp({
  ...cloudServices(),
  dist: "/__sce_static_served_by_netlify",
  origin: process.env.SCE_ORIGIN,
  production: true,
  maxUploadBytes: 4 * 1024 * 1024,
});
export const handler = serverless(app.server, { binary: ["application/pdf"] });
