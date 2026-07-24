import { useCallback, useEffect, useMemo, useState } from 'react';
import { PageLayout, Paragraph, Section, SideNav, TopHeader, TreeMenu } from '@gtivr4/a1-design-system-react';
import { RenderPageDefinition } from '../editor/pageRenderer';
import { EDITOR_EXAMPLES, BLANK_PAGE } from '../editor/examples/index.ts';
import { decompress, readStored } from '../editor/storage';
import { buildProjectNav, buildProjectTree } from '../projects/projectNav';
import {
  getPublishedProjectBySlug,
  getPublishedProjectPath,
  loadPages,
  loadProjects,
  loadProjectLayout,
} from '../projects/projectStore';
import { combinePageIntoLayout, definitionContainsNodeType } from '../projects/projectLayout';
import { ProjectThemeScope } from '../lib/ProjectThemeScope.jsx';
import type { PageDefinition } from '../editor/pageTypes';

const SESSION_KEY = 'a1-editor-preview';
const PAGES_MAP_KEY = 'a1-editor-preview-pages';
const CURRENT_KEY = 'a1-editor-preview-current';

export { SESSION_KEY as EDITOR_PREVIEW_SESSION_KEY };
export { PAGES_MAP_KEY as EDITOR_PREVIEW_PAGES_MAP_KEY };
export { CURRENT_KEY as EDITOR_PREVIEW_CURRENT_KEY };

function parseDef(json: string | null): PageDefinition | null {
  if (!json) return null;
  try { return JSON.parse(json) as PageDefinition; } catch { return null; }
}

/** Look up a page definition by id from all available sources. Exported so the
 *  app shell can resolve every page's latest JSON for the "Export all" backup. */
export function resolvePageJson(pageId: string): string | null {
  // 1. Pages map — the live snapshot written by handleExpandPreview at launch
  //    (and refreshed by live-sync). For the launched page this holds the exact
  //    working JSON, including uncommitted keystrokes, so it is the freshest
  //    source and must win. handleExpandPreview seeds every other page from its
  //    history key, so the map is reliably current for navigation too.
  try {
    const raw = readStored(PAGES_MAP_KEY);
    if (raw) {
      const map = JSON.parse(raw) as Record<string, string>;
      if (map[pageId]) return map[pageId];
    }
  } catch { /* ignore */ }

  // 2. Per-page edit history — useEditorHistory persists { entries, index } on
  //    every commit, so it reflects the page's last committed content. (The
  //    versions state, checked next, only updates on version add/switch/rename.)
  try {
    const raw = readStored(`a1-editor-history-${pageId}`);
    if (raw) {
      const parsed = JSON.parse(raw) as { entries: { json: string }[]; index: number };
      const entry = parsed.entries?.[parsed.index] ?? parsed.entries?.[parsed.entries.length - 1];
      if (entry?.json) return entry.json;
    }
  } catch { /* ignore */ }

  // 3. Per-page versions state (seeded on duplicate; updated on version ops).
  try {
    const raw = readStored(`a1-editor-versions-${pageId}`);
    if (raw) {
      const parsed = JSON.parse(raw) as { versions: { id: string; json: string }[]; activeVersionId: string };
      const active =
        parsed.versions?.find((v) => v.id === parsed.activeVersionId) ??
        parsed.versions?.[0];
      if (active?.json) return active.json;
    }
  } catch { /* ignore */ }

  // 4. Built-in example definitions
  const example = EDITOR_EXAMPLES.find((e) => e.id === pageId);
  if (example) return JSON.stringify(example.definition, null, 2);

  // 5. Blank page fallback for user pages with no saved content
  if (pageId.startsWith('new-page')) return JSON.stringify(BLANK_PAGE, null, 2);

  return null;
}

/** The `screen` query param identifies which prototype page is being viewed. */
function publishedRouteFromUrl(): { slug: string; pageId: string | null } | null {
  const parts = window.location.pathname.replace(/^\/|\/$/g, '').split('/');
  if (parts[0] !== 'p' || !parts[1]) return null;
  return {
    slug: decodeURIComponent(parts[1]),
    pageId: parts[2] ? decodeURIComponent(parts[2]) : null,
  };
}

function projectIdFromUrl(): string | null {
  const queryProject = new URLSearchParams(window.location.search).get('project');
  if (queryProject) return queryProject;
  const published = publishedRouteFromUrl();
  return published ? getPublishedProjectBySlug(published.slug)?.id ?? null : null;
}

function screenIdFromUrl(): string | null {
  const queryScreen = new URLSearchParams(window.location.search).get('screen');
  if (queryScreen) return queryScreen;

  const published = publishedRouteFromUrl();
  if (!published) return null;
  if (published.pageId) return published.pageId;

  const project = getPublishedProjectBySlug(published.slug);
  return project ? loadPages(project.id)[0]?.id ?? null : null;
}

/** The `item` query param selects which dataset row a detail page binds against. */
function itemIdFromUrl(): string | null {
  return new URLSearchParams(window.location.search).get('item');
}

/** Build a shareable URL for a given screen id, preserving standalone mode and
 *  the owning project so the generated nav survives in-prototype navigation. An
 *  `item` is carried for detail-page links. */
function urlForScreen(pageId: string, itemId?: string | null): string {
  const published = publishedRouteFromUrl();
  if (published) {
    const project = getPublishedProjectBySlug(published.slug);
    const path = project ? getPublishedProjectPath(project, pageId) : '';
    if (path) return itemId ? `${path}?item=${encodeURIComponent(itemId)}` : path;
  }

  const project = new URLSearchParams(window.location.search).get('project');
  const projectParam = project ? `&project=${encodeURIComponent(project)}` : '';
  const itemParam = itemId ? `&item=${encodeURIComponent(itemId)}` : '';
  // Built manually so `standalone` stays a bare flag (no trailing "=").
  return `/editor-preview?standalone&screen=${encodeURIComponent(pageId)}${projectParam}${itemParam}`;
}

export function EditorPreviewPage() {
  // styles.css sets body { overflow: hidden } for the main app's viewportHeight
  // PageLayout scroll model. In standalone mode there is no PageLayout, so we
  // need the document to scroll normally.
  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.body.style.blockSize = 'auto';
    document.documentElement.style.blockSize = 'auto';
  }, []);
  // An optional `?theme=` param (e.g. the Priority Guide editor's "Preview as
  // wireframe") is applied by the app's authoritative theme effect in main.jsx,
  // which seeds its `theme` state from the param when running standalone.

  // Initial screen: a `screen` URL param wins (shareable/bookmarkable deep link);
  // otherwise fall back to the last-launched working JSON in localStorage.
  const [currentJson, setCurrentJson] = useState<string | null>(() => {
    const screen = screenIdFromUrl();
    if (screen) {
      const json = resolvePageJson(screen);
      if (json) return json;
    }
    return readStored(SESSION_KEY);
  });
  const [screenId, setScreenId] = useState<string | null>(() => screenIdFromUrl());
  const [itemId, setItemId] = useState<string | null>(() => itemIdFromUrl());
  const [systemColorScheme, setSystemColorScheme] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );
  const colorMode = useMemo(() => {
    try {
      const stored = localStorage.getItem('a1-web-color-mode');
      return ['light', 'dark', 'system'].includes(stored ?? '') ? stored! : 'system';
    } catch {
      return 'system';
    }
  }, []);
  const resolvedColorScheme = colorMode === 'system' ? systemColorScheme : colorMode;

  // The owning project (from the launch URL) drives the auto-generated TopHeader.
  const projectId = useMemo(() => projectIdFromUrl(), []);
  const projectPages = useMemo(() => (projectId ? loadPages(projectId) : []), [projectId]);
  const project = useMemo(
    () => (projectId ? loadProjects().find((p) => p.id === projectId) : undefined),
    [projectId],
  );
  const projectName = useMemo(
    () => project?.name,
    [project],
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const update = (event: MediaQueryListEvent) => setSystemColorScheme(event.matches ? 'dark' : 'light');
    setSystemColorScheme(query.matches ? 'dark' : 'light');
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);

  // Navigate to another prototype screen: swap the definition AND update the URL
  // so the address bar always holds a unique, shareable link to the current page.
  const navigateToScreen = useCallback((pageId: string, nextItemId: string | null = null, pushHistory = true) => {
    const json = resolvePageJson(pageId);
    if (!json) return;
    setCurrentJson(json);
    setScreenId(pageId);
    setItemId(nextItemId);
    if (pushHistory) {
      window.history.pushState({ screen: pageId, item: nextItemId }, '', urlForScreen(pageId, nextItemId));
    }
  }, []);

  // Back/forward buttons move between visited screens.
  useEffect(() => {
    function onPop() {
      const screen = screenIdFromUrl();
      if (screen) navigateToScreen(screen, itemIdFromUrl(), false);
    }
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [navigateToScreen]);

  // Live-sync: the editor writes the working JSON to SESSION_KEY on a 500 ms
  // debounce and the id of the page being edited to CURRENT_KEY. The browser
  // fires a storage event in all OTHER tabs, so the prototype updates without
  // polling — but only when the page being edited is the screen on display.
  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key !== SESSION_KEY || !e.newValue) return;
      const screen = screenIdFromUrl();
      const editingId = readStored(CURRENT_KEY);
      if (!screen || editingId === screen) {
        // e.newValue is the stored (possibly gzip-compressed) payload.
        setCurrentJson(decompress(e.newValue));
      }
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const definition = useMemo(() => parseDef(currentJson), [currentJson]);

  const navItems = useMemo(
    () => (projectPages.length
      ? buildProjectNav(projectPages, {
          activePageId: screenId,
          onNavigate: (pageId) => navigateToScreen(pageId),
          hrefFor: (pageId) => urlForScreen(pageId),
        })
      : null),
    [projectPages, screenId, navigateToScreen, urlForScreen],
  );

  // Sidebar navigation (SideNav + TreeMenu) is opt-in per project (`navStyle`).
  const useSidebarNav = project?.navStyle === 'sidebar' && projectPages.length > 0;
  const tree = useMemo(
    () => (useSidebarNav ? buildProjectTree(projectPages, screenId) : null),
    [useSidebarNav, projectPages, screenId],
  );

  // The project's shared layout (editable chrome) wraps every page: the page is
  // composed into it by replacing the Outlet. Falls back to the bare auto header
  // for a standalone (no-project) preview.
  const layoutDef = useMemo(() => (projectId ? parseDef(loadProjectLayout(projectId)) : null), [projectId]);
  const layoutHasTopHeader = definitionContainsNodeType(layoutDef, 'TopHeader');
  const firstProjectPageId = projectPages[0]?.id ?? null;
  const projectHomeHref = firstProjectPageId
    ? (publishedRouteFromUrl() && project ? getPublishedProjectPath(project) : urlForScreen(firstProjectPageId))
    : undefined;

  const composed = useMemo(() => {
    if (!definition) return null;
    if (layoutDef) {
      return combinePageIntoLayout(layoutDef, definition, {
        navItems,
        logoFallback: projectName ?? '',
        logoHref: projectHomeHref,
      });
    }
    return definition;
  }, [definition, layoutDef, navItems, projectName, projectHomeHref]);

  const fallbackHeader = !useSidebarNav && projectPages.length && (!layoutDef || !layoutHasTopHeader) ? (
    <TopHeader
      className="a1-web-generated-header"
      logo={projectName ? <span className="a1-web-logo">{projectName}</span> : undefined}
      logoHref={projectHomeHref}
      navItems={navItems ?? []}
    />
  ) : null;

  if (!composed) {
    return (
      <ProjectThemeScope
        theme={project?.theme}
        colorMode={colorMode}
        resolvedColorScheme={resolvedColorScheme}
      >
        {fallbackHeader}
        <main>
          <Section padding="md">
            <Paragraph size="sm" color="muted">
              No page definition found. Open this preview from the Editor page.
            </Paragraph>
          </Section>
        </main>
      </ProjectThemeScope>
    );
  }

  // Sidebar navigation: real app-shell chrome (PageLayout + SideNav + TreeMenu)
  // wired directly to navigation — the page renders in the main area (the sidebar
  // is the chrome, so the shared TopHeader/footer layout isn't applied here).
  if (useSidebarNav && tree && definition) {
    return (
      <ProjectThemeScope
        theme={project?.theme}
        colorMode={colorMode}
        resolvedColorScheme={resolvedColorScheme}
      >
        <PageLayout
          viewportHeight
          sidebar={(
            <SideNav header={projectName || 'Project'}>
              <TreeMenu
                items={tree.items}
                selectedId={screenId}
                onSelect={(pageId) => navigateToScreen(pageId)}
                defaultExpandedIds={tree.expandedIds}
                aria-label="Project pages"
              />
            </SideNav>
          )}
        >
          <RenderPageDefinition
            definition={definition}
            itemId={itemId}
            onNavigate={(pageId, opts) => navigateToScreen(pageId, opts?.item ?? null)}
          />
        </PageLayout>
      </ProjectThemeScope>
    );
  }

  return (
    <ProjectThemeScope
      theme={project?.theme}
      colorMode={colorMode}
      resolvedColorScheme={resolvedColorScheme}
    >
      {fallbackHeader}
      <RenderPageDefinition
        definition={composed}
        itemId={itemId}
        onNavigate={(pageId, opts) => navigateToScreen(pageId, opts?.item ?? null)}
      />
    </ProjectThemeScope>
  );
}
