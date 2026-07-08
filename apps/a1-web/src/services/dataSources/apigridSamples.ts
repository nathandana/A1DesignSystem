/**
 * Data sources — ApiGrid sample datasets.
 *
 * The five collections that drive the "ApiGrid" API-management dashboard handoff
 * (`_tmp-design_handoff_apigrid/data.js`: apis, consumers, activity, traffic,
 * logs), expressed as A1 datasets so the dashboard can be rebuilt in a1-web and
 * bound to real data source records instead of the prototype's `APP_DATA`.
 *
 * Each dataset is global (available to every project) and referenced in bindings
 * by its slugified name — "ApiGrid APIs" → `apigrid_apis`, etc. Column `key`s are
 * the field ids used in `{{ apigrid_apis.name }}`-style bindings.
 *
 * Fidelity: business content is transcribed verbatim from the prototype. Array
 * fields (`methods`, `scopes`) are flattened to comma-joined text so they sit in
 * flat table cells; activity `text` has its `<b>` markup stripped to plain content;
 * and the deterministic `traffic`/`logs` series are the exact values the
 * prototype's generators produce. Purely presentational generated fields
 * (`glyph`, `glyphColor`, `spark`) are omitted.
 */
import type { CreateDataSourceInput, DataColumn, DataRow } from './types';

/** Compact column authoring helper: `[key, name, type?]` → DataColumn. */
const cols = (
  defs: Array<[key: string, name: string, type?: DataColumn['type']]>,
): DataColumn[] => defs.map(([key, name, type = 'text']) => ({ key, name, type }));

// ── APIs ────────────────────────────────────────────────────────────────────

const API_COLUMNS: DataColumn[] = cols([
  ['id', 'ID'],
  ['name', 'Service'],
  ['path', 'Path'],
  ['env', 'Environment'],
  ['status', 'Status'],
  ['type', 'Type'],
  ['methods', 'Methods'],
  ['reqs', 'Requests 24h'],
  ['rps', 'Requests / sec', 'number'],
  ['p95', 'p95 latency (ms)', 'number'],
  ['err', 'Error rate (%)', 'number'],
  ['endpoints', 'Endpoints', 'number'],
  ['version', 'Version'],
  ['owner', 'Owning team'],
  ['uptime', 'Uptime health'],
]);

const API_ROWS: DataRow[] = [
  { id: 'payments', name: 'Payments API', path: '/v2/payments', env: 'Production', status: 'healthy', type: 'REST', methods: 'POST, GET, PUT', reqs: '4.82M', rps: 812, p95: 128, err: 0.04, endpoints: 24, version: 'v2.3.1', owner: 'Core Platform', uptime: 'ok' },
  { id: 'identity', name: 'Identity & Auth', path: '/v1/auth', env: 'Production', status: 'healthy', type: 'REST', methods: 'POST, GET, DELETE', reqs: '9.14M', rps: 1503, p95: 62, err: 0.01, endpoints: 18, version: 'v1.9.0', owner: 'Security', uptime: 'ok' },
  { id: 'catalog', name: 'Product Catalog', path: '/v3/catalog', env: 'Production', status: 'degraded', type: 'GraphQL', methods: 'POST, GET', reqs: '2.31M', rps: 388, p95: 342, err: 1.8, endpoints: 12, version: 'v3.0.4', owner: 'Commerce', uptime: 'warn' },
  { id: 'shipping', name: 'Shipping & Fulfillment', path: '/v2/shipping', env: 'Production', status: 'healthy', type: 'REST', methods: 'GET, POST, PUT, DELETE', reqs: '1.07M', rps: 176, p95: 210, err: 0.12, endpoints: 31, version: 'v2.1.7', owner: 'Logistics', uptime: 'ok' },
  { id: 'notify', name: 'Notifications', path: '/v1/notify', env: 'Production', status: 'healthy', type: 'REST', methods: 'POST, GET', reqs: '6.55M', rps: 1092, p95: 44, err: 0.03, endpoints: 8, version: 'v1.4.2', owner: 'Growth', uptime: 'ok' },
  { id: 'search', name: 'Search Service', path: '/v2/search', env: 'Production', status: 'down', type: 'gRPC', methods: 'POST', reqs: '812K', rps: 0, p95: 0, err: 100, endpoints: 5, version: 'v2.0.0', owner: 'Discovery', uptime: 'err' },
  { id: 'analytics', name: 'Analytics Ingest', path: '/v1/events', env: 'Staging', status: 'healthy', type: 'REST', methods: 'POST', reqs: '18.2M', rps: 3021, p95: 22, err: 0.02, endpoints: 3, version: 'v1.2.0', owner: 'Data', uptime: 'ok' },
  { id: 'billing', name: 'Billing & Invoices', path: '/v2/billing', env: 'Staging', status: 'degraded', type: 'REST', methods: 'GET, POST, PUT', reqs: '440K', rps: 73, p95: 488, err: 3.2, endpoints: 19, version: 'v2.4.0-rc1', owner: 'Finance', uptime: 'warn' },
  { id: 'geocode', name: 'Geocoding', path: '/v1/geo', env: 'Development', status: 'healthy', type: 'REST', methods: 'GET', reqs: '96K', rps: 12, p95: 156, err: 0.5, endpoints: 4, version: 'v0.9.1', owner: 'Logistics', uptime: 'ok' },
  { id: 'webhooks', name: 'Webhook Delivery', path: '/v1/hooks', env: 'Production', status: 'healthy', type: 'REST', methods: 'POST, GET, DELETE', reqs: '3.40M', rps: 567, p95: 98, err: 0.21, endpoints: 11, version: 'v1.6.3', owner: 'Core Platform', uptime: 'ok' },
];

/** "ApiGrid APIs" — every gateway service (dashboard + APIs list). Global. */
export function buildApiGridApisSample(): CreateDataSourceInput {
  return {
    name: 'ApiGrid APIs',
    description: 'API gateway services with status, environment, methods, traffic, latency, and ownership. Drives the ApiGrid dashboard and APIs list.',
    columns: API_COLUMNS,
    rows: API_ROWS,
    projectIds: [],
  };
}

// ── Consumers (keys & consumers) ──────────────────────────────────────────────

const CONSUMER_COLUMNS: DataColumn[] = cols([
  ['id', 'ID'],
  ['name', 'Consumer'],
  ['team', 'Team'],
  ['tier', 'Tier'],
  ['key', 'API key'],
  ['reqs', 'Requests / month'],
  ['quota', 'Quota (M)', 'number'],
  ['used', 'Quota used (%)', 'number'],
  ['status', 'Status'],
  ['scopes', 'Access scopes'],
  ['created', 'Created'],
]);

const CONSUMER_ROWS: DataRow[] = [
  { id: 'ios', name: 'iOS Mobile App', team: 'Mobile', tier: 'Internal', key: 'ak_live_9f3ac2••••••••4e21', reqs: '12.4M', quota: 20, used: 62, status: 'active', scopes: 'payments, identity, catalog, notify', created: 'Jan 2024' },
  { id: 'web', name: 'Web Storefront', team: 'Commerce', tier: 'Internal', key: 'ak_live_71bd08••••••••9a04', reqs: '28.9M', quota: 50, used: 58, status: 'active', scopes: 'catalog, payments, search, shipping', created: 'Nov 2023' },
  { id: 'partner-acme', name: 'Acme Logistics', team: 'External Partner', tier: 'Partner', key: 'ak_live_c40e91••••••••b7f2', reqs: '3.10M', quota: 5, used: 88, status: 'active', scopes: 'shipping, geocode', created: 'Mar 2024' },
  { id: 'data-warehouse', name: 'Data Warehouse ETL', team: 'Data', tier: 'Internal', key: 'ak_live_2ea7f5••••••••10cc', reqs: '9.80M', quota: 15, used: 41, status: 'active', scopes: 'analytics, billing', created: 'Aug 2023' },
  { id: 'partner-globex', name: 'Globex Integrations', team: 'External Partner', tier: 'Partner', key: 'ak_test_88b3de••••••••55af', reqs: '210K', quota: 2, used: 12, status: 'active', scopes: 'catalog, identity', created: 'May 2024' },
  { id: 'legacy', name: 'Legacy Batch Jobs', team: 'Finance', tier: 'Internal', key: 'ak_live_004bca••••••••e39d', reqs: '1.02M', quota: 10, used: 9, status: 'revoked', scopes: 'billing', created: 'Feb 2022' },
];

/** "ApiGrid consumers" — API keys & consumers with tier, quota usage, and scopes. Global. */
export function buildApiGridConsumersSample(): CreateDataSourceInput {
  return {
    name: 'ApiGrid consumers',
    description: 'API keys and consumers with tier, masked key, monthly usage vs quota, status, and access scopes. Drives the Keys & Consumers cards.',
    columns: CONSUMER_COLUMNS,
    rows: CONSUMER_ROWS,
    projectIds: [],
  };
}

// ── Activity feed ─────────────────────────────────────────────────────────────

const ACTIVITY_COLUMNS: DataColumn[] = cols([
  ['icon', 'Icon'],
  ['tone', 'Tone'],
  ['text', 'Event'],
  ['time', 'Relative time'],
]);

const ACTIVITY_ROWS: DataRow[] = [
  { icon: 'rocket_launch', tone: 'accent', text: 'Priya Shah deployed Payments API v2.3.1 to Production', time: '4 minutes ago' },
  { icon: 'error', tone: 'err', text: 'Search Service is returning 5xx — health check failing', time: '11 minutes ago' },
  { icon: 'key', tone: 'info', text: 'New API key issued for Globex Integrations', time: '38 minutes ago' },
  { icon: 'warning', tone: 'warn', text: 'Product Catalog p95 latency exceeded 300ms threshold', time: '1 hour ago' },
  { icon: 'edit', tone: 'neutral', text: 'Marcus Lee updated rate limits on Shipping & Fulfillment', time: '2 hours ago' },
  { icon: 'check_circle', tone: 'ok', text: 'Identity & Auth passed 30-day security audit', time: '5 hours ago' },
  { icon: 'add_circle', tone: 'accent', text: 'Ada Okoro created a new API Webhook Delivery', time: 'Yesterday' },
];

/** "ApiGrid activity" — recent-activity feed rows (icon, tone, event, time). Global. */
export function buildApiGridActivitySample(): CreateDataSourceInput {
  return {
    name: 'ApiGrid activity',
    description: 'Recent-activity feed: a Material Symbols icon, a status tone, the event text, and a relative time. Drives the dashboard Recent Activity list.',
    columns: ACTIVITY_COLUMNS,
    rows: ACTIVITY_ROWS,
    projectIds: [],
  };
}

// ── Request-volume traffic series ─────────────────────────────────────────────

const TRAFFIC_COLUMNS: DataColumn[] = cols([
  ['x', 'Hour', 'number'],
  ['req', 'Requests', 'number'],
  ['err', 'Errors', 'number'],
]);

// Exact values from the prototype's deterministic generator (spark(9, 24) with the
// 14:00–15:00 error spike), so the chart matches the handoff.
const TRAFFIC_ROWS: DataRow[] = [
  { x: 0, req: 57, err: 3 }, { x: 1, req: 56, err: 3 }, { x: 2, req: 41, err: 2 }, { x: 3, req: 30, err: 2 },
  { x: 4, req: 30, err: 2 }, { x: 5, req: 42, err: 2 }, { x: 6, req: 57, err: 3 }, { x: 7, req: 57, err: 3 },
  { x: 8, req: 48, err: 2 }, { x: 9, req: 35, err: 2 }, { x: 10, req: 27, err: 1 }, { x: 11, req: 31, err: 2 },
  { x: 12, req: 46, err: 2 }, { x: 13, req: 53, err: 3 }, { x: 14, req: 56, err: 30 }, { x: 15, req: 50, err: 27 },
  { x: 16, req: 40, err: 2 }, { x: 17, req: 35, err: 2 }, { x: 18, req: 31, err: 2 }, { x: 19, req: 38, err: 2 },
  { x: 20, req: 49, err: 2 }, { x: 21, req: 54, err: 3 }, { x: 22, req: 51, err: 3 }, { x: 23, req: 44, err: 2 },
];

/** "ApiGrid traffic" — 24-hour request/error volume series for the dashboard chart. Global. */
export function buildApiGridTrafficSample(): CreateDataSourceInput {
  return {
    name: 'ApiGrid traffic',
    description: 'Request-volume series over 24 hours (hour, requests, errors) with a mid-afternoon error spike. Drives the dashboard Request Volume area chart.',
    columns: TRAFFIC_COLUMNS,
    rows: TRAFFIC_ROWS,
    projectIds: [],
  };
}

// ── Request logs ──────────────────────────────────────────────────────────────

const LOG_COLUMNS: DataColumn[] = cols([
  ['time', 'Time'],
  ['method', 'Method'],
  ['path', 'Path'],
  ['status', 'Status', 'number'],
  ['consumer', 'Consumer'],
  ['ms', 'Latency (ms)', 'number'],
  ['ip', 'Client IP'],
  ['id', 'Request ID'],
]);

// Exact values from the prototype's deterministic log generator.
const LOG_ROWS: DataRow[] = [
  { time: '14:48:44', method: 'GET', path: '/v2/payments/intents/pi_8fa2', status: 200, consumer: 'iOS Mobile App', ms: 40, ip: '52.14.0.0', id: 'req_2717' },
  { time: '14:48:40', method: 'POST', path: '/v1/auth/token', status: 200, consumer: 'Web Storefront', ms: 77, ip: '18.221.13.7', id: 'req_4b4e' },
  { time: '14:48:35', method: 'POST', path: '/v2/search/query', status: 503, consumer: 'Web Storefront', ms: 32, ip: '34.72.26.14', id: 'req_6f85' },
  { time: '14:48:29', method: 'GET', path: '/v3/catalog/products?page=2', status: 200, consumer: 'Web Storefront', ms: 151, ip: '104.18.39.21', id: 'req_93bc' },
  { time: '14:48:22', method: 'POST', path: '/v2/payments/pi_71bd/capture', status: 200, consumer: 'iOS Mobile App', ms: 188, ip: '172.58.52.28', id: 'req_b7f3' },
  { time: '14:48:19', method: 'GET', path: '/v2/shipping/rates', status: 200, consumer: 'Acme Logistics', ms: 225, ip: '99.81.65.35', id: 'req_dc2a' },
  { time: '14:48:15', method: 'POST', path: '/v1/events/batch', status: 202, consumer: 'Data Warehouse ETL', ms: 262, ip: '52.14.78.42', id: 'req_10061' },
  { time: '14:48:10', method: 'GET', path: '/v3/catalog/products/sku_402', status: 404, consumer: 'Globex Integrations', ms: 273, ip: '18.221.91.49', id: 'req_12498' },
  { time: '14:48:04', method: 'PUT', path: '/v2/billing/subscriptions/sub_19', status: 500, consumer: 'Legacy Batch Jobs', ms: 38, ip: '34.72.104.56', id: 'req_148cf' },
  { time: '14:47:57', method: 'POST', path: '/v1/notify/send', status: 200, consumer: 'Notifications', ms: 373, ip: '104.18.117.63', id: 'req_16d06' },
  { time: '14:47:54', method: 'DELETE', path: '/v1/auth/sessions/se_2a', status: 204, consumer: 'iOS Mobile App', ms: 410, ip: '172.58.130.70', id: 'req_1913d' },
  { time: '14:47:50', method: 'GET', path: '/v2/payments/pi_c40e', status: 200, consumer: 'Web Storefront', ms: 67, ip: '99.81.143.77', id: 'req_1b574' },
  { time: '14:47:45', method: 'POST', path: '/v3/catalog/graphql', status: 429, consumer: 'Globex Integrations', ms: 318, ip: '52.14.156.84', id: 'req_1d9ab' },
  { time: '14:47:39', method: 'GET', path: '/v2/shipping/labels/lb_88', status: 200, consumer: 'Acme Logistics', ms: 141, ip: '18.221.169.91', id: 'req_1fde2' },
  { time: '14:47:32', method: 'POST', path: '/v2/search/query', status: 503, consumer: 'iOS Mobile App', ms: 44, ip: '34.72.182.98', id: 'req_22219' },
  { time: '14:47:29', method: 'GET', path: '/v1/auth/userinfo', status: 401, consumer: 'Globex Integrations', ms: 345, ip: '104.18.195.105', id: 'req_24650' },
  { time: '14:47:25', method: 'POST', path: '/v2/payments/refunds', status: 200, consumer: 'Web Storefront', ms: 252, ip: '172.58.208.112', id: 'req_26a87' },
  { time: '14:47:20', method: 'GET', path: '/v2/billing/invoices?status=open', status: 200, consumer: 'Data Warehouse ETL', ms: 289, ip: '99.81.221.119', id: 'req_28ebe' },
];

/** "ApiGrid request logs" — sampled gateway request log lines. Global. */
export function buildApiGridLogsSample(): CreateDataSourceInput {
  return {
    name: 'ApiGrid request logs',
    description: 'Sampled gateway request log lines: time, method, path, status, consumer, latency, client IP, and request id. Drives the Request Logs table.',
    columns: LOG_COLUMNS,
    rows: LOG_ROWS,
    projectIds: [],
  };
}

/** All ApiGrid datasets, for the sample registry and one-click seeding. */
export const APIGRID_SAMPLE_BUILDERS: {
  id: string;
  label: string;
  icon: string;
  build: () => CreateDataSourceInput;
}[] = [
  { id: 'apigrid-apis', label: 'ApiGrid APIs', icon: 'api', build: buildApiGridApisSample },
  { id: 'apigrid-consumers', label: 'ApiGrid consumers', icon: 'vpn_key', build: buildApiGridConsumersSample },
  { id: 'apigrid-activity', label: 'ApiGrid activity', icon: 'history', build: buildApiGridActivitySample },
  { id: 'apigrid-traffic', label: 'ApiGrid traffic', icon: 'show_chart', build: buildApiGridTrafficSample },
  { id: 'apigrid-logs', label: 'ApiGrid request logs', icon: 'receipt_long', build: buildApiGridLogsSample },
];
