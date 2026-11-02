// A1 Design System MCP server — a stateless Streamable HTTP endpoint (MCP
// JSON-RPC 2.0 over a single POST request/response, no session id) serving
// components, tokens, themes, rules, and page-definition data from the static
// index built by ../../scripts/build-index.mjs.
//
// Hand-rolled against the Fetch Request/Response API (the same style as the
// other functions in apps/a1-web/netlify/functions/) rather than the official
// @modelcontextprotocol/sdk transport class, which targets Node's
// IncomingMessage/ServerResponse — a mismatch with Netlify Functions v2. Every
// tool here is sessionless, so the SDK's session/streaming
// machinery isn't needed; zod still validates each tool's input against its
// schema and doubles as the JSON Schema source for `tools/list`.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import manifest from '../../package.json' with { type: 'json' };
import { validatePatterns } from '../../../react/src/patterns/patternValidation.js';
import { migratePatternNode } from '../../../react/src/patterns/patternMigrations.js';
import { getJsonModel } from './json-model.mjs';
import { validateJson } from '../../../../system/json-model/validate.js';
import { getJsonPropsSchema } from '../../../../system/json-model/model.js';
import { previewService, PreviewError, readPreviewRequest } from '../../lib/previews.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const INDEX_PATH = path.resolve(HERE, '../../index.json');

const SERVER_NAME = 'a1-design-system';
const SERVER_VERSION = manifest.version;
const PROTOCOL_VERSION = '2025-06-18';
const SUPPORTED_PROTOCOL_VERSIONS = new Set([PROTOCOL_VERSION, '2025-03-26', '2024-11-05']);

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
    index.components.find((c) => c.name.toLowerCase() === target || c.exports.some(e => e.exportedName.toLowerCase() === target)) ??
    index.components.find((c) => c.name.toLowerCase().startsWith(target))
  );
}

const TOOLS = [
  {
    name: 'get_react_setup',
    description: 'Start here to install and use the A1 React component library from npm. Returns the npm package, install command, React peer requirements and canonical setup guide: global CSS order, fonts, PostCSS breakpoints, Vite/Next.js, themes, client boundaries and a working example. The indexed source version is not a live npm registry lookup.',
    input: z.object({}),
    handler(_args, index) {
      const { name, sourceVersion, peerDependencies } = index.reactPackage;
      const guide = index.docs.find(doc => doc.uri === 'a1://docs/react-setup');
      return {
        packageName: name,
        sourceVersion,
        peerDependencies,
        npmUrl: `https://www.npmjs.com/package/${name}`,
        installCommand: `npm install ${name}`,
        checkPublishedVersionCommand: `npm view ${name} version`,
        versionNote: 'sourceVersion describes the indexed repository. Check npm before pinning it; the source version may not be published yet.',
        resourceUri: guide.uri,
        guideMarkdown: guide.text,
      };
    },
  },
  {
    name: 'validate_json',
    description: 'Validate A1 page or project JSON against the shared component, structural and formal pattern contracts. Returns valid, contractVersion, errors and warnings with JSON Pointer paths and stable codes. Read get_json_model, generate JSON, validate, repair and revalidate. Does not save, render or modify the document; success does not certify visual layout or runtime accessibility.',
    input: z.object({
      kind: z.enum(['page', 'project']),
      document: z.unknown().describe('A parsed JSON document or JSON text to validate'),
      contractVersion: z.string().optional().describe('Optional validator contract version; omit to use the current version'),
    }),
    outputSchema: {
      type: 'object', required: ['valid', 'contractVersion', 'errors', 'warnings'],
      properties: {
        valid: { type: 'boolean' }, contractVersion: { type: 'string' },
        errors: { type: 'array', items: { $ref: '#/definitions/diagnostic' } },
        warnings: { type: 'array', items: { $ref: '#/definitions/diagnostic' } },
      },
      definitions: { diagnostic: {
        type: 'object', required: ['code', 'path', 'message'],
        properties: {
          code: { type: 'string' }, path: { type: 'string' }, message: { type: 'string' },
          allowedValues: { type: 'array', items: {} }, expectedType: { type: 'string' },
          ruleId: { type: 'string' }, detail: { type: 'string' }, recovery: { type: 'string' },
        },
      } },
    },
    handler(args) { return validateJson(args); },
  },
  {
    name: 'get_json_model',
    description: 'Get a copy-ready A1 page or project JSON starter plus a structural JSON Schema generated from the current registered component types.',
    input: z.object({
      format: z.enum(['page', 'project']).optional().default('page')
        .describe('Return a single page definition or an importable multi-page project bundle'),
    }),
    handler(args, index) { return getJsonModel(args.format, index.pageTypes); },
  },
  {
    name: 'migrate_pattern',
    description: 'Propose an explicit supported migration of one formal pattern node. Returns the migrated node and diagnostics; does not save or modify the input. Unknown versions and ambiguous renames retain the original node.',
    input: z.object({ node: z.looseObject({}) }),
    handler(args) { return migratePatternNode(args.node); },
  },
  {
    name: 'get_pattern',
    description: 'Get a versioned formal A1 pattern contract, props schema, ordered editable areas, policies, empty starter and populated examples.',
    input: z.object({ name: z.string().describe('Pattern type or slug, e.g. OverviewCard or overview-card') }),
    handler(args, index) {
      const name = args.name.toLowerCase();
      const pattern = index.patterns?.find(p => [p.id, p.type, p.name].some(value => value.toLowerCase() === name));
      if (!pattern) throw new ToolError(`Unknown formal pattern "${args.name}".`);
      return pattern;
    },
  },
  {
    name: 'validate_patterns',
    description: 'Validate formal patterns in a component node, page definition or project bundle. Returns non-destructive diagnostics with node IDs, JSON paths, rule IDs, severity and recovery guidance. Does not execute actions or validate the entire page schema.',
    input: z.object({ definition: z.unknown().describe('Parsed JSON node, page or project bundle') }),
    handler(args) { return validatePatterns(args.definition); },
  },
  {
    name: 'list_components',
    description:
      "List A1 Design System components with their per-package coverage (React/Native/Pure/Web Components/Figma). Filter by category (e.g. 'Actions & Controls') or by which package must be implemented. Patterns — compositions of components such as Page Title — are listed under the 'Patterns' category.",
    input: z.object({
      category: z.string().optional().describe('Exact category heading, e.g. "Layout & Display"'),
      package: z.enum(['react', 'native', 'pure', 'webComponents', 'figma']).optional()
        .describe('Only return components implemented in this package'),
    }),
    handler(args, index) {
      const categoryById = new Map(index.categories.map((c) => [c.id, c.heading]));
      let results = index.components.map((c) => ({
        name: c.name,
        kind: index.patterns?.some(p => c.exports.some(e => e.exportedName === p.type)) ? 'pattern' : 'component',
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
        setupResource: 'a1://docs/react-setup',
        jsonPropsSchema: component.exports.map(e => getJsonPropsSchema(e.exportedName)).find(Boolean) ?? null,
        pattern: index.patterns?.find(p => component.exports.some(e => e.exportedName === p.type)) ?? null,
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

const validationTool = TOOLS.find(tool => tool.name === 'validate_json');
TOOLS.push({
  name: 'create_preview',
  description: 'Validate page or project JSON and create a temporary A1 rendered preview URL, available for 30 days to anyone with the link. Returns validation diagnostics and, only when valid, previewId, previewUrl and expiresAt. Stores an expiring snapshot; does not import, save or publish a workspace project. Open the URL to inspect layout and accessibility; submit revised JSON to create a new preview.',
  input: validationTool.input,
  outputSchema: {
    ...validationTool.outputSchema,
    properties: {
      ...validationTool.outputSchema.properties,
      previewId: { type: 'string' }, previewUrl: { type: 'string' }, expiresAt: { type: 'string' },
    },
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  async handler(args, _index, services) {
    try { return await services.createPreview(args); }
    catch (error) {
      if (error instanceof PreviewError) throw new ToolError(error.code, { code: error.code });
      throw new ToolError('PREVIEW_UNAVAILABLE');
    }
  },
});

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
      inputSchema: z.toJSONSchema(t.input, { target: 'draft-7' }),
      ...(t.outputSchema ? { outputSchema: t.outputSchema } : {}),
      annotations: t.annotations ?? { readOnlyHint: true, destructiveHint: false },
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

async function handleMethod(method, params, index, services) {
  switch (method) {
    case 'initialize':
      return {
        protocolVersion: SUPPORTED_PROTOCOL_VERSIONS.has(params?.protocolVersion)
          ? params.protocolVersion
          : PROTOCOL_VERSION,
        capabilities: { tools: {}, resources: {} },
        serverInfo: { name: SERVER_NAME, version: SERVER_VERSION },
        instructions: 'Read a1://docs/design for A1 design language and token rationale. For React projects, start with get_react_setup to install the npm library and configure CSS, fonts and responsive breakpoints. Then use get_component/get_pattern for APIs. For A1 page/project JSON, use get_json_model, validate_json and create_preview.',
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
        const result = await tool.handler(parsed.data, index, services);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }], ...(tool.outputSchema ? { structuredContent: result } : {}) };
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

async function handleRequest(request, services) {
  if (request.method === 'OPTIONS') return json(null, 204);
  if (request.method !== 'POST') return json({ error: 'Use POST for MCP JSON-RPC requests.' }, 405);

  let body;
  try {
    body = await readPreviewRequest(request);
  } catch (error) {
    if (error?.status === 413) return json(rpcErrorResponse(null, new RpcError(-32600, 'Request exceeds the 3 MB limit.')), 413);
    return json(rpcErrorResponse(null, new RpcError(-32700, 'Invalid JSON in request body.')), 200);
  }

  if (!body || body.jsonrpc !== '2.0' || typeof body.method !== 'string') {
    return json(rpcErrorResponse(body?.id ?? null, new RpcError(-32600, 'Invalid JSON-RPC request.')), 200);
  }

  // Notifications carry no `id` and expect no response body per JSON-RPC 2.0.
  const isNotification = !('id' in body);

  try {
    const index = loadIndex();
    const result = await handleMethod(body.method, body.params, index, services);
    if (isNotification) return json(null, 202);
    return json(rpcResponse(body.id, result));
  } catch (err) {
    if (isNotification) return json(null, 202);
    const rpcErr = err instanceof RpcError ? err : new RpcError(-32603, err?.message ?? 'Internal error.');
    return json(rpcErrorResponse(body.id, rpcErr));
  }
}

export const createMcpHandler = (services = { createPreview: input => previewService.create(input) }) => request => handleRequest(request, services);
export default createMcpHandler();
export const config = { rateLimit: { action: 'rate_limit', aggregateBy: ['ip', 'domain'], windowSize: 60, windowLimit: 120 } };
