import { resolve } from "node:path";
import { createApp } from "./local-app.mjs";
const port = Number(process.env.PORT || 5191),
  host = process.env.HOST || "127.0.0.1";
if (
  process.env.SCE_LOCAL_ACCESS === "true" &&
  !["127.0.0.1", "::1"].includes(host)
)
  throw new Error(
    "Password-free local access must bind to a loopback address.",
  );
const cloud = process.env.SCE_DATABASE_URL
  ? (await import("./cloud.mjs")).cloudServices()
  : {};
const app = createApp({
  ...cloud,
  ...(cloud.store ? { maxUploadBytes: 4 * 1024 * 1024 } : {}),
  directory: resolve(
    process.env.SCE_DATA_DIR || new URL("../data", import.meta.url).pathname,
  ),
  origin: process.env.SCE_ORIGIN || "http://127.0.0.1:5191",
  production: process.env.NODE_ENV === "production",
  publicDemo: process.env.SCE_PUBLIC_DEMO === "true",
  localAccess: process.env.SCE_LOCAL_ACCESS === "true",
  pdfCommand: process.env.SCE_PDFTOTEXT || "pdftotext",
});
app.server.listen(port, host, () =>
  console.log(`SCE workspace server: http://${host}:${port}`),
);
function stop() {
  app.server.close(() => {
    Promise.resolve(app.store.db.close()).then(() => process.exit(0));
  });
}
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
