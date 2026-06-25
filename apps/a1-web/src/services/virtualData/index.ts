/**
 * Virtual data — local, deterministic project-to-dataset matching.
 *
 * This teammate uses the existing page-definition contracts: `repeat`,
 * `{{ dataset.column }}` bindings, and data-driven `collections`. It never calls
 * an API and never writes during analysis. The panel previews every proposed
 * connection, then applies the prepared page snapshots through project history.
 */
import type { ComponentNode, PageDefinition } from '../../editor/pageTypes';
import { datasetBindingKey, hasBinding } from '../../data/bindings';
import { collectionTargetFor } from '../../data/collections';
import { chooseModel, listLocalModels, localChat } from '../../lib/localAi';
import {
  commitPageJson, loadPages, loadProjects, resolvePageJson,
} from '../../projects/projectStore';
import {
  datasetAvailableToProject, type DataColumn, type DataSource,
} from '../dataSources/types';

export const virtualData = {
  id: 'virtual-data',
  name: 'Virtual data',
  role: 'Data teammate',
  icon: 'database',
  blurb: 'Connects project templates to available datasets using local, explainable matching.',
} as const;

export type DataConnectionKind = 'repeat' | 'content' | 'prop' | 'collection';

export interface DataConnectionProposal {
  pageId: string;
  pageTitle: string;
  nodeId: string;
  nodeType: string;
  kind: DataConnectionKind;
  field?: string;
  dataset: string;
  column?: string;
  summary: string;
}

interface PlannedPage {
  pageId: string;
  pageTitle: string;
  json: string;
  changes: number;
}

export interface VirtualDataPlan {
  projectId: string;
  projectName: string;
  datasetCount: number;
  pageCount: number;
  proposals: DataConnectionProposal[];
  pages: PlannedPage[];
}

export interface VirtualDataRun {
  plan: VirtualDataPlan;
  engine: 'model' | 'heuristic';
  model?: string;
  elapsedMs: number;
  promptTokens?: number;
  outputTokens?: number;
}

const TEXT_TYPES = new Set(['Heading', 'Paragraph', 'MessageBadge']);
const BINDABLE_PROPS = new Set([
  'href', 'src', 'alt', 'title', 'caption', 'label', 'value', 'name',
  'description', 'subtitle', 'eyebrow', 'text', 'unit', 'prefix',
]);
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'card', 'content', 'example', 'field', 'for', 'item',
  'of', 'our', 'page', 'section', 'the', 'this', 'value', 'with',
]);
const SYNONYMS = [
  ['name', 'title', 'heading', 'label'],
  ['description', 'summary', 'body', 'copy', 'bio', 'details'],
  ['image', 'photo', 'picture', 'avatar', 'thumbnail', 'src'],
  ['url', 'href', 'link', 'website'],
  ['email', 'mail'],
  ['phone', 'telephone', 'mobile'],
  ['price', 'cost', 'amount'],
  ['role', 'job', 'position'],
  ['company', 'organization', 'organisation', 'business'],
  ['status', 'state'],
  ['city', 'location', 'place'],
] as const;

function tokens(value: unknown): string[] {
  return String(value ?? '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((word) => {
      if (word.endsWith('ies') && word.length > 4) return `${word.slice(0, -3)}y`;
      if (word.endsWith('s') && word.length > 3) return word.slice(0, -1);
      return word;
    })
    .filter((word) => word && !STOP_WORDS.has(word));
}

function synonymScore(left: Set<string>, right: Set<string>): number {
  let score = 0;
  for (const group of SYNONYMS) {
    if (group.some((word) => left.has(word)) && group.some((word) => right.has(word))) score += 6;
  }
  return score;
}

function columnScore(context: string, column: DataColumn): number {
  const left = new Set(tokens(context));
  const right = new Set([...tokens(column.key), ...tokens(column.name)]);
  let score = synonymScore(left, right);
  for (const word of left) if (right.has(word)) score += 8;
  const normalizedContext = tokens(context).join(' ');
  const normalizedColumn = tokens(column.name || column.key).join(' ');
  if (normalizedColumn && normalizedContext.includes(normalizedColumn)) score += 10;
  return score;
}

function bestColumn(context: string, dataset: DataSource): DataColumn | null {
  let best: DataColumn | null = null;
  let bestScore = 0;
  for (const column of dataset.columns) {
    const score = columnScore(context, column);
    if (score > bestScore) {
      best = column;
      bestScore = score;
    }
  }
  return bestScore >= 6 ? best : null;
}

function nodeText(node: ComponentNode): string {
  return [
    node.id,
    node.type,
    node.content?.fallback,
    ...Object.values(node.props ?? {}).filter((value) => typeof value === 'string'),
    ...(node.children ?? []).map(nodeText),
  ].join(' ');
}

function datasetScore(context: string, dataset: DataSource, onlyDataset: boolean): number {
  const left = new Set(tokens(context));
  const name = new Set(tokens(dataset.name));
  const description = new Set(tokens(dataset.description));
  const columns = new Set(dataset.columns.flatMap((column) => [...tokens(column.key), ...tokens(column.name)]));
  let score = onlyDataset ? 6 : 0;
  for (const word of left) {
    if (name.has(word)) score += 8;
    if (description.has(word)) score += 2;
    if (columns.has(word)) score += 3;
  }
  score += synonymScore(left, columns);
  return score;
}

function chooseDataset(
  context: string,
  datasets: DataSource[],
  preferredKey?: string,
): DataSource | null {
  if (preferredKey) {
    const preferred = datasets.find((dataset) => datasetBindingKey(dataset.name) === preferredKey);
    if (preferred) return preferred;
  }
  let best: DataSource | null = null;
  let bestScore = 0;
  for (const dataset of datasets) {
    const score = datasetScore(context, dataset, datasets.length === 1);
    if (score > bestScore) {
      best = dataset;
      bestScore = score;
    }
  }
  return bestScore >= 6 ? best : null;
}

function binding(dataset: DataSource, column: DataColumn): string {
  return `{{ ${datasetBindingKey(dataset.name)}.${column.key} }}`;
}

function propContext(node: ComponentNode, field: string, value: string): string {
  if (field === 'alt') {
    const readableValue = value.replace(/\b(image|photo|picture|thumbnail)\b/gi, '');
    return `${node.type} alt name title label ${readableValue}`;
  }
  if (field === 'src') return `${node.id} ${node.type} image photo picture src ${value}`;
  if (field === 'href') return `${node.id} ${node.type} url link href ${value}`;
  if (field === 'caption' || field === 'description' || field === 'subtitle') {
    return `${node.id} ${node.type} description summary ${field} ${value}`;
  }
  return `${node.id} ${node.type} ${field} ${value}`;
}

function pushProposal(
  proposals: DataConnectionProposal[],
  pageId: string,
  pageTitle: string,
  node: ComponentNode,
  kind: DataConnectionKind,
  dataset: DataSource,
  summary: string,
  field?: string,
  column?: DataColumn,
): void {
  proposals.push({
    pageId,
    pageTitle,
    nodeId: node.id,
    nodeType: node.type,
    kind,
    field,
    dataset: dataset.name,
    column: column?.name,
    summary,
  });
}

function connectNodeFields(
  node: ComponentNode,
  dataset: DataSource,
  pageId: string,
  pageTitle: string,
  proposals: DataConnectionProposal[],
): void {
  if (
    TEXT_TYPES.has(node.type)
    && node.content?.fallback
    && !node.content.textKey
    && !hasBinding(node.content.fallback)
  ) {
    const column = bestColumn(`${node.id} ${node.type} ${node.content.fallback}`, dataset);
    if (column) {
      node.content.fallback = binding(dataset, column);
      pushProposal(
        proposals, pageId, pageTitle, node, 'content', dataset,
        `Bind ${node.type} text to ${dataset.name} / ${column.name}.`,
        'Text', column,
      );
    }
  }

  for (const [field, value] of Object.entries(node.props ?? {})) {
    if (!BINDABLE_PROPS.has(field) || typeof value !== 'string' || hasBinding(value)) continue;
    const column = bestColumn(propContext(node, field, value), dataset);
    if (!column) continue;
    node.props![field] = binding(dataset, column);
    pushProposal(
      proposals, pageId, pageTitle, node, 'prop', dataset,
      `Bind ${node.type} ${field} to ${dataset.name} / ${column.name}.`,
      field, column,
    );
  }

  const collectionTarget = collectionTargetFor(node.type);
  if (collectionTarget && !node.collections?.[collectionTarget.prop] && node.type === 'DefinitionList') {
    node.collections = {
      ...(node.collections ?? {}),
      [collectionTarget.prop]: { dataset: datasetBindingKey(dataset.name), mode: 'fields' },
    };
    pushProposal(
      proposals, pageId, pageTitle, node, 'collection', dataset,
      `Fill the definition list from every field in the active ${dataset.name} row.`,
      collectionTarget.prop,
    );
  }

  for (const child of node.children ?? []) {
    connectNodeFields(child, dataset, pageId, pageTitle, proposals);
  }
}

function connectTemplates(
  nodes: ComponentNode[],
  datasets: DataSource[],
  pageId: string,
  pageTitle: string,
  proposals: DataConnectionProposal[],
  preferredDataset?: string,
): void {
  for (const node of nodes) {
    const templateChildren = node.type === 'Grid'
      ? (node.children ?? []).filter((child) => child.type === 'Card')
      : node.type === 'List'
        ? (node.children ?? []).filter((child) => child.type === 'ListItem')
        : [];

    // A single child reads as a template. Multiple authored cards/list items are
    // left alone because repeating each would change the intended composition.
    if (templateChildren.length === 1) {
      const template = templateChildren[0];
      const existingKey = typeof template.repeat === 'string'
        ? template.repeat
        : template.repeat?.dataset;
      const existing = existingKey
        ? datasets.find((dataset) => datasetBindingKey(dataset.name) === existingKey)
        : null;
      const dataset = existing ?? chooseDataset(
        `${pageTitle} ${nodeText(template)}`,
        datasets,
        preferredDataset,
      );
      if (dataset) {
        if (!existingKey) {
          template.repeat = { dataset: datasetBindingKey(dataset.name) };
          pushProposal(
            proposals, pageId, pageTitle, template, 'repeat', dataset,
            `Repeat this ${template.type} once for each ${dataset.name} row.`,
          );
        }
        connectNodeFields(template, dataset, pageId, pageTitle, proposals);
      }
    }

    for (const child of node.children ?? []) {
      connectTemplates([child], datasets, pageId, pageTitle, proposals, preferredDataset);
    }
  }
}

function connectStandaloneDefinitionLists(
  nodes: ComponentNode[],
  datasets: DataSource[],
  pageId: string,
  pageTitle: string,
  proposals: DataConnectionProposal[],
  preferredDataset?: string,
): void {
  for (const node of nodes) {
    if (node.type === 'DefinitionList' && !node.collections?.items) {
      const dataset = chooseDataset(`${pageTitle} ${nodeText(node)}`, datasets, preferredDataset);
      if (dataset) connectNodeFields(node, dataset, pageId, pageTitle, proposals);
    }
    for (const child of node.children ?? []) {
      connectStandaloneDefinitionLists(
        [child], datasets, pageId, pageTitle, proposals, preferredDataset,
      );
    }
  }
}

export function planVirtualDataConnections(
  projectId: string,
  allDatasets: DataSource[],
  preferredDatasets: Record<string, string> = {},
): VirtualDataPlan {
  const project = loadProjects().find((item) => item.id === projectId);
  const projectName = project?.name ?? 'Project';
  const datasets = allDatasets.filter((dataset) => datasetAvailableToProject(dataset, projectId));
  const pages = loadPages(projectId);
  const proposals: DataConnectionProposal[] = [];
  const plannedPages: PlannedPage[] = [];

  for (const page of pages) {
    const source = resolvePageJson(page.id);
    if (!source) continue;
    let definition: PageDefinition;
    try { definition = JSON.parse(source) as PageDefinition; } catch { continue; }
    const beforeCount = proposals.length;
    for (const region of definition.page.layout.regions) {
      connectTemplates(
        region.nodes, datasets, page.id, page.title, proposals, preferredDatasets[page.id],
      );
      connectStandaloneDefinitionLists(
        region.nodes, datasets, page.id, page.title, proposals, preferredDatasets[page.id],
      );
    }
    const changes = proposals.length - beforeCount;
    if (changes) {
      plannedPages.push({
        pageId: page.id,
        pageTitle: page.title,
        json: JSON.stringify(definition, null, 2),
        changes,
      });
    }
  }

  return {
    projectId,
    projectName,
    datasetCount: datasets.length,
    pageCount: pages.length,
    proposals,
    pages: plannedPages,
  };
}

function pageSummary(pageId: string, pageTitle: string): string {
  const source = resolvePageJson(pageId);
  if (!source) return pageTitle;
  try {
    const definition = JSON.parse(source) as PageDefinition;
    const text = definition.page.layout.regions
      .flatMap((region) => region.nodes.map(nodeText))
      .join(' ');
    return `${pageTitle}: ${text}`.slice(0, 800);
  } catch {
    return pageTitle;
  }
}

function parseAssignments(text: string, validPages: Set<string>, validDatasets: Set<string>): Record<string, string> {
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  let data: unknown;
  try { data = JSON.parse(cleaned); } catch { return {}; }
  const rows = Array.isArray(data)
    ? data
    : Array.isArray((data as { assignments?: unknown[] })?.assignments)
      ? (data as { assignments: unknown[] }).assignments
      : [];
  const assignments: Record<string, string> = {};
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue;
    const pageId = (row as { pageId?: unknown }).pageId;
    const dataset = (row as { dataset?: unknown }).dataset;
    if (
      typeof pageId === 'string' && typeof dataset === 'string'
      && validPages.has(pageId) && validDatasets.has(dataset)
    ) {
      assignments[pageId] = dataset;
    }
  }
  return assignments;
}

/**
 * Ask an optional local Ollama model to choose the most relevant dataset per
 * page, then pass those validated choices into the deterministic connector.
 * Falls back silently when no local model is available.
 */
export async function runVirtualData(
  projectId: string,
  allDatasets: DataSource[],
): Promise<VirtualDataRun> {
  const started = performance.now();
  const pages = loadPages(projectId);
  const datasets = allDatasets.filter((dataset) => datasetAvailableToProject(dataset, projectId));
  const available = await listLocalModels();
  const model = chooseModel(available);

  if (model && pages.length && datasets.length) {
    try {
      const datasetLines = datasets.map((dataset) => (
        `${datasetBindingKey(dataset.name)}: ${dataset.name}; fields: ${dataset.columns.map((column) => `${column.key} (${column.name})`).join(', ')}`
      ));
      const pageLines = pages.map((page) => `${page.id}: ${pageSummary(page.id, page.title)}`);
      const response = await localChat({
        model,
        temperature: 0,
        system: [
          'You match design-system pages to local datasets.',
          'Return JSON only: {"assignments":[{"pageId":"...","dataset":"binding_key"}]}.',
          'Use only supplied ids and dataset keys. Omit pages with no credible match.',
          'Do not propose components, fields, code, or explanations.',
        ].join(' '),
        prompt: `Datasets:\n${datasetLines.join('\n')}\n\nPages:\n${pageLines.join('\n')}`,
      });
      const assignments = parseAssignments(
        response.text,
        new Set(pages.map((page) => page.id)),
        new Set(datasets.map((dataset) => datasetBindingKey(dataset.name))),
      );
      return {
        plan: planVirtualDataConnections(projectId, allDatasets, assignments),
        engine: 'model',
        model: response.model,
        elapsedMs: performance.now() - started,
        promptTokens: response.promptTokens,
        outputTokens: response.outputTokens,
      };
    } catch { /* deterministic fallback below */ }
  }

  return {
    plan: planVirtualDataConnections(projectId, allDatasets),
    engine: 'heuristic',
    elapsedMs: performance.now() - started,
  };
}

export function applyVirtualDataPlan(plan: VirtualDataPlan): number {
  for (const page of plan.pages) {
    commitPageJson(
      page.pageId,
      page.json,
      `Virtual data connected ${page.changes} field${page.changes === 1 ? '' : 's'}`,
    );
  }
  return plan.proposals.length;
}
