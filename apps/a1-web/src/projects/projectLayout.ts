/**
 * Per-project **shared layout** — the chrome that wraps every page in a project
 * (a TopHeader, a page-content `Outlet`, and optional footer/PageLayout shell).
 * It is a normal page definition edited on the canvas like any page, under the
 * reserved doc id `__layout__`. At render time a page is composed into the layout
 * by replacing the `Outlet` node with the page's nodes.
 */
import type { ComponentNode, PageDefinition } from '../editor/pageTypes';

export const LAYOUT_DOC_ID = '__layout__';

function nodesContainType(nodes: ComponentNode[], type: string): boolean {
  return nodes.some((node) => (
    node.type === type || (node.children?.length ? nodesContainType(node.children, type) : false)
  ));
}

export function definitionContainsNodeType(definition: PageDefinition | null | undefined, type: string): boolean {
  return !!definition?.page.layout.regions.some((region) => nodesContainType(region.nodes, type));
}

/** The default shared layout: a TopHeader, the page Outlet, and a simple footer.
 *  Nav items are injected from the page hierarchy at render time, so the header's
 *  editable props are the logo and icon position. */
export function defaultLayoutDefinition(projectName = 'My project'): PageDefinition {
  return {
    schemaVersion: '0.1.0',
    page: {
      id: LAYOUT_DOC_ID,
      name: 'Shared layout',
      description: 'Chrome shared by every page in this project.',
      layout: {
        type: 'PageLayout',
        props: {},
        regions: [
          {
            id: 'main',
            name: 'Layout',
            nodes: [
              {
                id: 'shared-header',
                type: 'TopHeader',
                props: { logo: projectName, navIconPosition: 'start' },
              },
              { id: 'page-outlet', type: 'Outlet' },
              {
                id: 'shared-footer',
                type: 'Section',
                props: { padding: 'lg', surface: 'panel', align: 'center', contentWidth: 'xl' },
                children: [
                  {
                    id: 'shared-footer-text',
                    type: 'Paragraph',
                    props: { size: 'sm', color: 'muted', align: 'center' },
                    content: { fallback: `© ${projectName}` },
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  } as PageDefinition;
}

// Replace the first Outlet node found in a node list with the page's nodes.
// Returns [newNodes, replaced]. Also injects nav/logo onto TopHeader nodes.
function substitute(
  nodes: ComponentNode[],
  pageNodes: ComponentNode[],
  navItems: unknown,
  logoFallback: string,
  logoHref: string | undefined,
): [ComponentNode[], boolean] {
  let replaced = false;
  const out: ComponentNode[] = [];
  for (const node of nodes) {
    if (!replaced && node.type === 'Outlet') {
      out.push(...pageNodes);
      replaced = true;
      continue;
    }
    let next = node;
    if (node.type === 'TopHeader') {
      next = {
        ...node,
        props: {
          ...node.props,
          ...(navItems != null ? { navItems } : {}),
          ...(logoHref ? { logoHref } : {}),
          ...(node.props?.logo == null || node.props?.logo === '' ? { logo: logoFallback } : {}),
        },
      };
    }
    if (next.children?.length) {
      const [kids, didReplace] = substitute(next.children, pageNodes, navItems, logoFallback, logoHref);
      if (didReplace) replaced = true;
      next = { ...next, children: kids };
    }
    out.push(next);
  }
  return [out, replaced];
}

// Inject the auto nav + logo onto any TopHeader in a subtree (read-only chrome).
function decorateHeaders(
  node: ComponentNode,
  navItems: unknown,
  logoFallback: string,
  logoHref: string | undefined,
): ComponentNode {
  let next = node;
  if (node.type === 'TopHeader') {
    next = {
      ...node,
      props: {
        ...node.props,
        ...(navItems != null ? { navItems } : {}),
        ...(logoHref ? { logoHref } : {}),
        ...(node.props?.logo == null || node.props?.logo === '' ? { logo: logoFallback } : {}),
      },
    };
  }
  if (next.children?.length) {
    next = { ...next, children: next.children.map((c) => decorateHeaders(c, navItems, logoFallback, logoHref)) };
  }
  return next;
}

function nodesToDefinition(nodes: ComponentNode[], name = 'Layout'): PageDefinition {
  return {
    schemaVersion: '0.1.0',
    page: { id: '__layout_chrome__', name, layout: { type: 'PageLayout', props: {}, regions: [{ id: 'main', name: 'Chrome', nodes }] } },
  } as PageDefinition;
}

/**
 * Split the shared layout's first region at the top-level `Outlet` into the
 * chrome **before** the page and the chrome **after** it (each as a read-only
 * mini definition), with nav/logo injected. Used to render the layout chrome
 * around the editable page canvas. If there is no top-level Outlet, everything
 * is treated as "before" chrome (header) and the page renders beneath it.
 */
export function splitLayoutAtOutlet(
  layoutDef: PageDefinition,
  { navItems, logoFallback = '', logoHref }: { navItems?: unknown; logoFallback?: string; logoHref?: string } = {},
): { before: PageDefinition | null; after: PageDefinition | null } {
  const region = layoutDef.page.layout.regions[0];
  if (!region) return { before: null, after: null };
  const nodes = region.nodes.map((n) => decorateHeaders(n, navItems, logoFallback, logoHref));
  const idx = nodes.findIndex((n) => n.type === 'Outlet');
  if (idx === -1) return { before: nodes.length ? nodesToDefinition(nodes) : null, after: null };
  const before = nodes.slice(0, idx);
  const after = nodes.slice(idx + 1);
  return {
    before: before.length ? nodesToDefinition(before) : null,
    after: after.length ? nodesToDefinition(after) : null,
  };
}

/**
 * Compose a page into the shared layout: clone the layout definition, inject the
 * auto nav + logo onto its TopHeader, and replace the `Outlet` with the page's
 * region nodes. If the layout has no Outlet, the page nodes are appended after
 * the layout chrome (so the page is never dropped).
 */
export function combinePageIntoLayout(
  layoutDef: PageDefinition,
  pageDef: PageDefinition,
  { navItems, logoFallback = '', logoHref }: { navItems?: unknown; logoFallback?: string; logoHref?: string } = {},
): PageDefinition {
  const pageNodes = pageDef.page.layout.regions.flatMap((r) => r.nodes);
  const regions = layoutDef.page.layout.regions.map((region) => {
    const [nodes] = substitute(region.nodes, pageNodes, navItems, logoFallback, logoHref);
    return { ...region, nodes };
  });
  // Guarantee the page renders even if the layout has no Outlet.
  const anyOutlet = layoutDef.page.layout.regions.some((r) =>
    JSON.stringify(r.nodes).includes('"Outlet"'),
  );
  if (!anyOutlet && regions[0]) regions[0] = { ...regions[0], nodes: [...regions[0].nodes, ...pageNodes] };

  return {
    ...layoutDef,
    page: {
      // The shared layout owns the rendered shell, but the content page must
      // retain its identity and data-detail metadata. In particular,
      // `detailDataset` / `detailPreviewId` drive the renderer's row context.
      ...pageDef.page,
      layout: { ...layoutDef.page.layout, regions },
    },
  } as PageDefinition;
}
