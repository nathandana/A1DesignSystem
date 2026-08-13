// Repo-root-relative path resolution. Every indexer module resolves paths from
// this file's own location (never from process.cwd()) so `build-index.mjs`
// behaves the same whether it's run from the repo root, from within
// packages/mcp-server, or from Netlify's build sandbox with an arbitrary cwd.

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url)); // packages/mcp-server/scripts/lib
export const REPO_ROOT = path.resolve(HERE, '../../../..');
export const MCP_SERVER_ROOT = path.resolve(HERE, '../..');

export function repoPath(...segments) {
  return path.join(REPO_ROOT, ...segments);
}
