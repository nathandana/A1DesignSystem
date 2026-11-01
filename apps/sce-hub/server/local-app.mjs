import { resolve } from "node:path";
import { createApp as createServerApp } from "./app.mjs";
import { openStore } from "./store.mjs";
export const createApp = (options) =>
  createServerApp({
    dist: resolve(import.meta.dirname, "../dist"),
    ...options,
    openStore,
  });
