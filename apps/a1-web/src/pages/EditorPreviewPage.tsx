import { useCallback, useEffect, useMemo, useState } from 'react';
import { Paragraph, Section, TopHeader } from '@gtivr4/a1-design-system-react';
import { RenderPageDefinition } from '../editor/pageRenderer';
import { EDITOR_EXAMPLES, BLANK_PAGE } from '../editor/examples/index.ts';
import { decompress, readStored } from '../editor/storage';
import { buildProjectNav } from '../projects/projectNav';
import { loadPages, loadProjects } from '../projects/projectStore';
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
function screenIdFromUrl(): string | null {
  return new URLSearchParams(window.location.search).get('screen');
}

/** Build a shareable URL for a given screen id, preserving standalone mode and
 *  the owning project so the generated nav survives in-prototype navigation. */
function urlForScreen(pageId: string): string {
  const project = new URLSearchParams(window.location.search).get('project');
  const projectParam = project ? `&project=${encodeURIComponent(project)}` : '';
  // Built manually so `standalone` stays a bare flag (no trailing "=").
  return `${window.location.pathname}?page=editor-preview&standalone&screen=${encodeURIComponent(pageId)}${projectParam}`;
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

  // The owning project (from the launch URL) drives the auto-generated TopHeader.
  const projectId = useMemo(() => new URLSearchParams(window.location.search).get('project'), []);
  const projectPages = useMemo(() => (projectId ? loadPages(projectId) : []), [projectId]);
  const projectName = useMemo(
    () => (projectId ? loadProjects().find((p) => p.id === projectId)?.name : undefined),
    [projectId],
  );

  // Navigate to another prototype screen: swap the definition AND update the URL
  // so the address bar always holds a unique, shareable link to the current page.
  const navigateToScreen = useCallback((pageId: string, pushHistory = true) => {
    const json = resolvePageJson(pageId);
    if (!json) return;
    setCurrentJson(json);
    setScreenId(pageId);
    if (pushHistory) {
      window.history.pushState({ screen: pageId }, '', urlForScreen(pageId));
    }
  }, []);

  // Back/forward buttons move between visited screens.
  useEffect(() => {
    function onPop() {
      const screen = screenIdFromUrl();
      if (screen) navigateToScreen(screen, false);
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

  const generatedHeader = projectPages.length ? (
    <TopHeader
      className="a1-web-generated-header"
      logo={projectName ? <span className="a1-web-logo">{projectName}</span> : undefined}
      navItems={buildProjectNav(projectPages, {
        activePageId: screenId,
        onNavigate: (pageId) => navigateToScreen(pageId),
        hrefFor: (pageId) => urlForScreen(pageId),
      })}
    />
  ) : null;

  if (!definition) {
    return (
      <>
        {generatedHeader}
        <Section padding="md">
          <Paragraph size="sm" color="muted">
            No page definition found. Open this preview from the Editor page.
          </Paragraph>
        </Section>
      </>
    );
  }

  return (
    <>
      {generatedHeader}
      <RenderPageDefinition
        definition={definition}
        onNavigate={(pageId) => navigateToScreen(pageId)}
      />
    </>
  );
}
