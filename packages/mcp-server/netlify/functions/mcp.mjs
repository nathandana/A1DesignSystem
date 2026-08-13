// A1 Design System MCP server — a stateless Streamable HTTP endpoint (MCP
// JSON-RPC 2.0 over a single POST request/response, no session id) serving
// components, tokens, themes, rules, and page-definition data from the static
// index built by ../../scripts/build-index.mjs.
//
// Hand-rolled against the Fetch Request/Response API (the same style as the
// other functions in apps/a1-web/netlify/functions/) rather than the official
// @modelcontextprotocol/sdk transport class, which targets Node's
// IncomingMessage/ServerResponse — a mismatch with Netlify Functions v2. Every
// tool here is a stateless read-only lookup, so the SDK's session/streaming
// machinery isn't needed; zod still validates each tool's input against its
// schema and doubles as the JSON Schema source for `tools/list`.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const INDEX_PATH = path.resolve(HERE, '../../index.json');

const SERVER_NAME = 'a1-design-system';
const SERVER_VERSION = '0.1.0';
const PROTOCOL_VERSION = '2025-06-18';

let cachedIndex = null;
function loadIndex() {
  if (!cachedIndex) {
    cachedIndex = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'));
  }
  return cachedIndex;
}

// ── Tool implementations ────────────────────────────────────────────────────

function findComponent(index, name) {
  const target = String(name).trim().toLowerCase();
  return (
    index.components.find((c) => c.name.toLowerCase() === target) ??
    index.components.find((c) => c.name.toLowerCase().startsWith(target))
  );
}

const TOOLS = [
  {
    name: 'list_components',
    description:
      "List A1 Design System components with their per-package coverage (React/Native/Pure/Web Components/Figma). Filter by category (e.g. 'Actions & Controls') or by which package must be implemented.",
    input: z.object({
      category: z.string().optional().describe('Exact category heading, e.g. "Layout & Display"'),
      package: z.enum(['react', 'native', 'pure', 'webComponents', 'figma']).optional()
        .describe('Only return components implemented in this package'),
    }),
    handler(args, index) {
      const categoryById = new Map(index.categories.map((c) => [c.id, c.heading]));
      let results = index.components.map((c) => ({
        name: c.name,
        category: categoryById.get(c.categoryId) ?? null,
        coverage: c.coverage,
      }));
      if (args.category) {
        results = results.filter((c) => c.category?.toLowerCase() === args.category.toLowerCase());
      }
      if (args.package) {
        results = results.filter((c) => c.coverage[args.package] === true);
      }
      return { count: results.length, components: results };
    },
  },
  {
    name: 'get_component',
    description:
      'Get full detail for one A1 component by its display name (e.g. "Card", "Empty State"): per-package coverage, structured props parsed from its .d.ts (name, type, optional, JSDoc description), and the relevant documentation excerpt from packages/react/ai/components.md.',
    input: z.object({
      name: z.string().describe('Component display name, e.g. "Button", "Choice Group"'),
    }),
    handler(args, index) {
      const component = findComponent(index, args.name);
      if (!component) {
        const suggestions = index.components
          .map((c) => c.name)
          .filter((n) => n.toLowerCase().includes(args.name.toLowerCase().slice(0, 4)))
          .slice(0, 8);
        throw new ToolError(`No component matching "${args.name}".`, { suggestions });
      }
      const category = index.categories.find((c) => c.id === component.categoryId);
      return {
        name: component.name,
        category: category?.heading ?? null,
        coverage: component.coverage,
        exports: component.exports,
        highlights: component.highlights,
        categoryDocsMarkdown: category?.sectionMarkdown ?? null,
      };
    },
  },
  {
    name: 'search_tokens',
    description:
      'Search design tokens by dotted path or CSS custom property substring (e.g. "action.background" or "button-min-height"). Returns the resolved base value for each match.',
    input: z.object({
      query: z.string().describe('Substring to search for in the token path or CSS variable name'),
      limit: z.number().int().min(1).max(200).optional().default(50),
    }),
    handler(args, index) {
      const q = args.query.toLowerCase();
      const matches = index.tokens.filter(
        (t) => t.path.toLowerCase().includes(q) || t.cssVar.toLowerCase().includes(q),
      );
      return { count: matches.length, tokens: matches.slice(0, args.limit) };
    },
  },
  {
    name: 'get_token',
    description:
      'Look up one design token by exact dotted path (e.g. "component.button.minHeight") or CSS variable name (e.g. "--component-button-min-height"), including its value under every theme that overrides it.',
    input: z.object({
      token: z.string().describe('Dotted token path or CSS variable name'),
    }),
    handler(args, index) {
      const t = args.token.trim();
      const base = index.tokens.find((x) => x.path === t || x.cssVar === t);
      if (!base) throw new ToolError(`No token found for "${t}".`);
      const themeOverrides = [];
      for (const theme of index.themes) {
        for (const sel of theme.selectors) {
          const match = sel.overrides.find((o) => o.path === base.path);
          if (match) {
            themeOverrides.push({
              theme: theme.id,
              selector: sel.selector,
              value: match.value,
              resolvedValue: match.resolvedValue,
            });
          }
        }
      }
      return { ...base, themeOverrides };
    },
  },
  {
    name: 'list_themes',
    description:
      'List every A1 theme (id, display name, description, and the selectors that activate it). Does not include the full override list — use get_token with a theme to check one token, or search_tokens for a broad sweep.',
    input: z.object({}),
    handler(_args, index) {
      return {
        themes: index.themes.map((t) => ({
          id: t.id,
          name: t.name,
          description: t.description,
          selectors: t.selectors.map((s) => s.selector),
        })),
      };
    },
  },
  {
    name: 'list_rules',
    description:
      'List A1 design rules (system/rules/*.yaml) — the same rules enforced by eslint-plugin-a1 and shown on the a1-web Rules page. Filter by component name or by an "applies_to" category (e.g. "accessibility", "layout").',
    input: z.object({
      component: z.string().optional().describe('Only rules that name this component'),
      appliesTo: z.string().optional().describe('Only rules tagged with this category'),
    }),
    handler(args, index) {
      let results = index.rules;
      if (args.component) {
        const target = args.component.toLowerCase();
        results = results.filter((r) => r.components.some((c) => c.toLowerCase() === target));
      }
      if (args.appliesTo) {
        const target = args.appliesTo.toLowerCase();
        results = results.filter((r) => r.appliesTo.some((a) => a.toLowerCase() === target));
      }
      return { count: results.length, rules: results };
    },
  },
  {
    name: 'list_page_types',
    description:
      'List the locked A1 page-definition ComponentType registry (apps/a1-web/src/editor/pageTypes.ts) — the exact set of component "type" values allowed in an A1 page-definition JSON node. See the a1://docs/page-definition-standard resource for the full contract.',
    input: z.object({}),
    handler(_args, index) {
      return { count: index.pageTypes.length, pageTypes: index.pageTypes };
    },
  },
];

class ToolError extends Error {
  constructor(message, data) {
    super(message);
    this.data = data;
  }
}

const toolsByName = new Map(TOOLS.map((t) => [t.name, t]));

// ── JSON-RPC dispatch ────────────────────────────────────────────────────────

class RpcError extends Error {
  constructor(code, message, data) {
    super(message);
    this.code = code;
    this.data = data;
  }
}

function toolsListResult() {
  return {
    tools: TOOLS.map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: z.toJSONSchema(t.input),
    })),
  };
}

function resourcesListResult(index) {
  return {
    resources: index.docs.map((d) => ({
      uri: d.uri,
      name: d.title,
      description: d.description,
      mimeType: 'text/markdown',
    })),
  };
}

function handleMethod(method, params, index) {
  switch (method) {
    case 'initialize':
      return {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: {}, resources: {} },
        serverInfo: { name: SERVER_NAME, version: SERVER_VERSION },
      };
    case 'tools/list':
      return toolsListResult();
    case 'tools/call': {
      const tool = toolsByName.get(params?.name);
      if (!tool) throw new RpcError(-32602, `Unknown tool "${params?.name}".`);
      const parsed = tool.input.safeParse(params?.arguments ?? {});
      if (!parsed.success) {
        throw new RpcError(-32602, 'Invalid tool arguments.', parsed.error.issues);
      }
      try {
        const result = tool.handler(parsed.data, index);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        if (err instanceof ToolError) {
          return {
            content: [{ type: 'text', text: JSON.stringify({ error: err.message, ...err.data }, null, 2) }],
            isError: true,
          };
        }
        throw err;
      }
    }
    case 'resources/list':
      return resourcesListResult(index);
    case 'resources/read': {
      const doc = index.docs.find((d) => d.uri === params?.uri);
      if (!doc) throw new RpcError(-32602, `Unknown resource "${params?.uri}".`);
      return { contents: [{ uri: doc.uri, mimeType: 'text/markdown', text: doc.text }] };
    }
    case 'notifications/initialized':
    case 'ping':
      return null; // acknowledged, no meaningful result body
    default:
      throw new RpcError(-32601, `Method "${method}" not found.`);
  }
}

function rpcResponse(id, result) {
  return { jsonrpc: '2.0', id, result: result ?? {} };
}

function rpcErrorResponse(id, error) {
  return {
    jsonrpc: '2.0',
    id: id ?? null,
    error: { code: error.code ?? -32603, message: error.message, data: error.data },
  };
}

// ── HTTP layer ───────────────────────────────────────────────────────────────

const CORS_HEADERS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST,OPTIONS',
  'access-control-allow-headers': 'content-type,mcp-protocol-version',
};

function json(body, status = 200) {
  return new Response(body === null ? null : JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...CORS_HEADERS,
    },
  });
}

async function handleRequest(request) {
  if (request.method === 'OPTIONS') return json(null, 204);
  if (request.method !== 'POST') return json({ error: 'Use POST for MCP JSON-RPC requests.' }, 405);

  let body;
  try {
    body = await request.json();
  } catch {
    return json(rpcErrorResponse(null, new RpcError(-32700, 'Invalid JSON in request body.')), 200);
  }

  if (!body || body.jsonrpc !== '2.0' || typeof body.method !== 'string') {
    return json(rpcErrorResponse(body?.id ?? null, new RpcError(-32600, 'Invalid JSON-RPC request.')), 200);
  }

  // Notifications carry no `id` and expect no response body per JSON-RPC 2.0.
  const isNotification = !('id' in body);

  try {
    const index = loadIndex();
    const result = handleMethod(body.method, body.params, index);
    if (isNotification) return json(null, 202);
    return json(rpcResponse(body.id, result));
  } catch (err) {
    if (isNotification) return json(null, 202);
    const rpcErr = err instanceof RpcError ? err : new RpcError(-32603, err?.message ?? 'Internal error.');
    return json(rpcErrorResponse(body.id, rpcErr));
  }
}

export default (request) => handleRequest(request);
