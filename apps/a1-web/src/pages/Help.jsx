/**
 * Editor help — searchable, categorized documentation of every editor feature.
 *
 * ▶ To maintain: this page is driven entirely by the `HELP` array below. When an
 *   editor feature is added, changed, or removed, update the relevant article (or
 *   add/remove one). Each article has an `id`, `title`, `keywords` (used for
 *   search), and a `body` (JSX). Keep `keywords` generous so search finds it.
 */
import { useMemo, useState } from 'react'
import {
  Accordion,
  Banner,
  Breadcrumb,
  Button,
  ButtonContainer,
  Cluster,
  Code,
  DefinitionList,
  Heading,
  Icon,
  Link,
  List,
  ListItem,
  MessageBadge,
  MessageEmptyState,
  Paragraph,
  Section,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { MOD, ALT, SHIFT, DEL } from '../editor/shortcuts.ts'

// Small helpers for article bodies ------------------------------------------------

const P = (props) => <Paragraph size="sm" {...props} />
const Steps = ({ items }) => (
  <List as="ol" variant="ordered" size="sm">
    {items.map((it, i) => <ListItem key={i}>{it}</ListItem>)}
  </List>
)
const Bullets = ({ items }) => (
  <List variant="unordered" size="sm">
    {items.map((it, i) => <ListItem key={i}>{it}</ListItem>)}
  </List>
)
const Kbd = ({ children }) => <Code variant="inline">{children}</Code>

// ── Content ────────────────────────────────────────────────────────────────────

const HELP = [
  {
    id: 'overview',
    title: 'Getting started',
    icon: 'rocket_launch',
    articles: [
      {
        id: 'what-is-editor',
        title: 'What the editor is',
        keywords: 'overview intro json page builder projects pages components prototype what is',
        body: (
          <Stack gap="sm">
            <P>
              The editor is a layout-first page builder. You arrange real A1 components on a
              canvas, configure their properties, and the result is stored as a JSON page
              definition — the same format that drives the live prototype and future site builder.
            </P>
            <P>The structure is three levels:</P>
            <Bullets items={[
              <><strong>Projects</strong> — an isolated set of pages with its own navigation.</>,
              <><strong>Pages</strong> — each page is one screen, arranged in a hierarchy.</>,
              <><strong>Components</strong> — the elements on each page (Sections, Stacks, Headings, Buttons…).</>,
            ]} />
          </Stack>
        ),
      },
      {
        id: 'open-editor',
        title: 'Opening the editor',
        keywords: 'open editor projects home start navigate top nav',
        body: (
          <Stack gap="sm">
            <P>Open <strong>Editor</strong> from the top navigation. You land on the <strong>Projects</strong> list — your home base. From there, open a project to edit its pages, or create a new one.</P>
            <P>The top-nav <strong>Editor</strong> menu also lists every project for a one-click jump straight into it.</P>
          </Stack>
        ),
      },
    ],
  },

  {
    id: 'projects',
    title: 'Projects',
    icon: 'folder',
    articles: [
      {
        id: 'create-project',
        title: 'Creating a project',
        keywords: 'create new project name description icon dialog add',
        body: (
          <Stack gap="sm">
            <P>On the Projects list, choose <strong>New project</strong>. Give it a name, an optional description, and an icon. The project opens to its page overview, ready for its first page.</P>
          </Stack>
        ),
      },
      {
        id: 'manage-projects',
        title: 'Opening, renaming, duplicating & deleting projects',
        keywords: 'open rename duplicate delete project card right click context menu manage kebab',
        body: (
          <Stack gap="sm">
            <P>Each project is a card showing its icon, description, page count, and last-updated date.</P>
            <Bullets items={[
              <><strong>Open</strong> — click the card’s Open button (or right-click → Open).</>,
              <><strong>Rename / Duplicate / Delete</strong> — right-click a card for the options menu. Delete asks for confirmation and removes the project and its pages.</>,
            ]} />
            <P>The <Link href="/?page=editor&project=proj-ember-oak" onClick={(e) => e.preventDefault()}>Ember &amp; Oak</Link> sample project is bundled as a complete worked example — explore it to see the features in context.</P>
          </Stack>
        ),
      },
      {
        id: 'project-isolation',
        title: 'Projects are isolated',
        keywords: 'isolation isolated separate scope links page link selector cross project',
        body: <P>A project’s pages, navigation, and in-page links only ever reference pages <em>within the same project</em>. When you link a Button or Link to a page, only that project’s pages appear in the selector.</P>,
      },
    ],
  },

  {
    id: 'pages',
    title: 'Pages & navigation',
    icon: 'description',
    articles: [
      {
        id: 'page-tree',
        title: 'The page tree (Pages tab)',
        keywords: 'page tree sidebar pages tab add edit duplicate delete page right click context menu',
        body: (
          <Stack gap="sm">
            <P>Inside a project, the sidebar’s <strong>Pages</strong> tab lists every page. Right-click a page (or use <strong>Add page</strong> in the footer) to:</P>
            <Bullets items={[
              <><strong>Add subpage</strong> / <strong>Add page below</strong></>,
              <><strong>Edit</strong> — selects the page so you can change its metadata</>,
              <><strong>Duplicate</strong> — copies the page and its content</>,
              <><strong>Delete</strong> — with confirmation (also removes any subpages)</>,
            ]} />
            <P>Click a page to open it in the editor. The other sidebar tab, <strong>Layers</strong>, shows the component tree of the open page.</P>
          </Stack>
        ),
      },
      {
        id: 'page-hierarchy',
        title: 'Hierarchy & page levels (1–3)',
        keywords: 'hierarchy level depth nest drag drop reparent parent child 1 2 3 reorder',
        body: (
          <Stack gap="sm">
            <P><strong>Drag and drop</strong> pages in the tree to nest them. A page’s <strong>level</strong> is its depth in the tree (1 = top level), capped at 3 — the hierarchy is the source of truth.</P>
            <P>You can also set the level directly: select a page and change <strong>Level</strong> in its metadata; it re-parents to match. Levels that aren’t reachable from a page’s position are disabled.</P>
          </Stack>
        ),
      },
      {
        id: 'page-metadata',
        title: 'Page metadata: title, icon, description, level',
        keywords: 'page metadata title icon description level edit settings name',
        body: <P>With a page open and nothing selected on the canvas, the <strong>Configure</strong> panel shows the page settings: <strong>title</strong>, <strong>icon</strong>, <strong>description</strong>, and <strong>level</strong>. These drive the page’s entry in the auto-generated navigation.</P>,
      },
      {
        id: 'auto-nav',
        title: 'Auto-generated TopHeader',
        keywords: 'auto navigation topheader top header menu dropdown level 2 3 generated nav',
        body: (
          <Stack gap="sm">
            <P>A <strong>TopHeader</strong> is generated automatically from the page hierarchy and rendered above every page — in the edit canvas, preview, and the launched prototype.</P>
            <Bullets items={[
              'Level-1 pages become top-level nav items.',
              'Level-2 pages appear in a dropdown under their parent.',
              'Level-3 pages nest one level deeper in the menu.',
            ]} />
            <P>It updates live as you rename pages, change icons, or re-nest the tree.</P>
          </Stack>
        ),
      },
      {
        id: 'all-pages',
        title: 'See all pages',
        keywords: 'all pages overview grid open breadcrumb edit delete project',
        body: <P>A project’s home view lists every page as a card (with its level), so you can browse and open any page. A breadcrumb (Home › Projects › Project) and project-level <strong>Edit</strong> / <strong>Delete</strong> actions sit at the top.</P>,
      },
      {
        id: 'linking',
        title: 'Linking buttons, links & cards to pages',
        keywords: 'link button page navigation prototype href page link selector connect screens card navigation card icon button',
        body: (
          <Stack gap="sm">
            <P>Select a <strong>Button</strong>, <strong>Link</strong>, <strong>Icon Button</strong>, or a <strong>navigation Card</strong> (a Card with <strong>Variant: Navigation</strong>) and use the <strong>Link to page</strong> selector to point it at any page in the project. In the prototype, clicking it navigates there.</P>
            <P>Behind the scenes this stores an <Kbd>{'/?page=<id>'}</Kbd> href that the prototype resolves.</P>
          </Stack>
        ),
      },
    ],
  },

  {
    id: 'editing',
    title: 'Selecting & editing',
    icon: 'edit',
    articles: [
      {
        id: 'select',
        title: 'Selecting elements',
        keywords: 'select click element innermost canvas layers tree highlight selection',
        body: (
          <Stack gap="sm">
            <P>Click any element on the canvas to select it — the innermost element under the cursor wins. The matching node highlights in the <strong>Layers</strong> tree, and vice-versa.</P>
            <P>Selecting nothing (clicking empty space) shows the page settings in the Configure panel.</P>
          </Stack>
        ),
      },
      {
        id: 'edit-text',
        title: 'Editing text inline',
        keywords: 'text inline edit heading paragraph button label type content markdown',
        body: (
          <Stack gap="sm">
            <P>Click a heading, paragraph, or button label and type to edit it in place. Paragraphs support inline markdown — <Kbd>**bold**</Kbd>, <Kbd>*italic*</Kbd>, <Kbd>~~strike~~</Kbd>, <Kbd>==mark==</Kbd>, and <Kbd>`code`</Kbd>.</P>
            <P>Rich headings (with highlight/underline marks) and complex content are edited from the Configure panel instead.</P>
          </Stack>
        ),
      },
      {
        id: 'configure',
        title: 'The Configure (properties) panel',
        keywords: 'configure properties panel props variant size color padding gap edit settings aside',
        body: <P>The right-hand <strong>Configure</strong> tab shows controls for the selected component — variant, size, color, spacing, surface, and everything else that component supports. Changes apply to the canvas immediately and are written back into the page JSON.</P>,
      },
    ],
  },

  {
    id: 'components',
    title: 'Adding & arranging components',
    icon: 'widgets',
    articles: [
      {
        id: 'add',
        title: 'Adding components',
        keywords: 'add component catalog plus button drag drop insert new element',
        body: (
          <Stack gap="sm">
            <P>Add components in a few ways:</P>
            <Bullets items={[
              <>The <strong>Add</strong> tab in the right panel — pick from the catalog; it inserts at the current target.</>,
              <>The <strong>+ Add component</strong> button in the Layers footer, or a container’s <strong>+</strong> on the canvas.</>,
              <>Right-click an element → <strong>Add inside</strong> / <strong>Add below</strong>.</>,
              <>Drag a component from the Add panel onto the canvas.</>,
            ]} />
          </Stack>
        ),
      },
      {
        id: 'arrange',
        title: 'Moving, reordering & grouping',
        keywords: 'move reorder drag tree alt arrow up down group stack ungroup nest arrange',
        body: (
          <Stack gap="sm">
            <Bullets items={[
              <><strong>Reorder / re-nest</strong> — drag elements in the Layers tree.</>,
              <><strong>Move up / down</strong> — <Kbd>{`${ALT}↑`}</Kbd> / <Kbd>{`${ALT}↓`}</Kbd> among siblings.</>,
              <><strong>Group as Stack</strong> — <Kbd>{`${MOD}G`}</Kbd> wraps the selection in a Stack.</>,
              <><strong>Ungroup</strong> — <Kbd>{`${MOD}${SHIFT}G`}</Kbd> promotes a container’s children into its parent.</>,
            ]} />
          </Stack>
        ),
      },
      {
        id: 'duplicate-delete-convert',
        title: 'Duplicate, delete & convert',
        keywords: 'duplicate delete convert change type remove copy element context menu',
        body: (
          <Stack gap="sm">
            <Bullets items={[
              <><strong>Duplicate</strong> — <Kbd>{`${MOD}D`}</Kbd> or the context menu.</>,
              <><strong>Delete</strong> — <Kbd>{DEL}</Kbd> (an undo snackbar appears).</>,
              <><strong>Convert to</strong> — the context menu offers compatible types to switch a component into (e.g. Heading → Paragraph), carrying over what props match.</>,
            ]} />
            <P>Both the <strong>canvas right-click menu</strong> and the <strong>Layers tree menu</strong> offer these actions.</P>
          </Stack>
        ),
      },
    ],
  },

  {
    id: 'reuse',
    title: 'Reuse & restyling',
    icon: 'auto_fix_high',
    articles: [
      {
        id: 'copy-pattern',
        title: 'Copy pattern (restyle by style transfer)',
        keywords: 'copy pattern paste style restyle properties transfer cmd opt alt c v subtree match defaults',
        body: (
          <Stack gap="sm">
            <P>Copy the <strong>look</strong> of one element and apply it to others — a fast way to restyle many items.</P>
            <Steps items={[
              <>Select an element and press <Kbd>{`${MOD}${ALT}C`}</Kbd> (or right-click → <strong>Copy pattern</strong>).</>,
              <>Select another element and press <Kbd>{`${MOD}${ALT}V`}</Kbd> (or right-click → <strong>Paste pattern</strong>).</>,
            ]} />
            <Bullets items={[
              'Only visual props travel (variant, size, color, padding, gap, surface, gradient, radius, align…). Content, links, data, and state are left alone.',
              'It captures the whole subtree: paste a styled Card and its heading/paragraph/button styles transfer to another Card’s children too — every matching element by type.',
              'It captures each element’s effective style, including defaults, so the target ends up looking exactly like the source (not a partial blend).',
              'If nothing matches, a snackbar explains why.',
            ]} />
            <Banner status="info" variant="inline" title="Why ⌥ and not ⇧">
              The shortcuts use Option/Alt because the browser reserves ⌘⇧C for “Inspect Element”.
            </Banner>
          </Stack>
        ),
      },
      {
        id: 'versions',
        title: 'Versions',
        keywords: 'versions variants switch create rename delete a b compare branch alternatives',
        body: (
          <Stack gap="sm">
            <P>The <strong>Versions</strong> tab keeps named variants of a page side by side — useful for A/B exploration. Create a version, switch between them, and rename or delete them. Each version has its own working state.</P>
          </Stack>
        ),
      },
      {
        id: 'history',
        title: 'History, undo & redo',
        keywords: 'history undo redo jump restore rename timeline steps revert',
        body: (
          <Stack gap="sm">
            <P>Every change is a history step. Use <Kbd>{`${MOD}Z`}</Kbd> / <Kbd>{`${MOD}${SHIFT}Z`}</Kbd> to undo and redo, or the <strong>History</strong> tab to jump to, restore, or rename any step. History persists per page.</P>
          </Stack>
        ),
      },
    ],
  },

  {
    id: 'media',
    title: 'Media & AI',
    icon: 'image',
    articles: [
      {
        id: 'figure',
        title: 'Figure: aspect ratio & crop',
        keywords: 'figure image aspect ratio 16:9 1:1 crop focal point object position cover',
        body: (
          <Stack gap="sm">
            <P>The Figure component can lock an image to a fixed <strong>aspect ratio</strong> (16:9 or 1:1), filling and cropping it to fit. The <strong>crop</strong> control sets the focal point on a 3×3 grid (center, top-left, …), so faces and subjects stay in frame.</P>
          </Stack>
        ),
      },
      {
        id: 'image-library',
        title: 'Image library',
        keywords: 'image library upload local images figure indexeddb store browser drag drop photo picker',
        body: (
          <Stack gap="sm">
            <P>The <strong>Image library</strong> (open it from the Editor menu or the <Icon name="photo_library" size="sm" /> button on the Projects home) holds images you upload. They’re stored locally in this browser and shared across every project.</P>
            <Steps items={[
              'Upload images with the button or by dragging files onto the page; large images are downscaled automatically.',
              'In a Figure, click the photo_library button next to the Image URL to choose an image from the library (or upload one inline).',
              'Rename or delete images from the library page — deletes leave a missing image on any Figure that used them.',
            ]} />
            <Banner status="info" variant="inline" title="Stored locally">
              Like everything else in the editor, the library lives in this browser (in IndexedDB). It isn’t uploaded anywhere, and it doesn’t travel with an exported project to another device.
            </Banner>
          </Stack>
        ),
      },
      {
        id: 'ai-images',
        title: 'AI image finder',
        keywords: 'ai image finder unsplash claude api key describe suggestions thumbnails caption generate',
        body: (
          <Stack gap="sm">
            <P>Next to a Figure’s <strong>Image URL</strong>, the <Icon name="auto_awesome" size="sm" /> button opens an AI image finder.</P>
            <Steps items={[
              'Describe the image you want.',
              'Claude returns three Unsplash thumbnails — select one, ask for three more, or re-prompt.',
              'Add an optional caption and apply it to the Figure.',
            ]} />
            <Banner status="warn" variant="inline" title="API key">
              You provide an Anthropic API key the first time; it’s stored only in this browser. Fine for local prototyping — don’t use this pattern in a public production build (proxy the call through a backend there).
            </Banner>
          </Stack>
        ),
      },
      {
        id: 'ai-page-editor',
        title: 'AI page editor (chat)',
        keywords: 'ai page editor chat claude describe change whole page json generate modify instruction undo opus make with ai add page split button',
        body: (
          <Stack gap="sm">
            <P>The <strong>AI</strong> tab in the right-hand panel lets you edit the whole page by describing the change in plain language. Claude is sent the current page plus A1’s component and format reference, so it knows which components, props, and values are allowed.</P>
            <P>To start a brand-new page this way, open the <strong>Add page</strong> split button (the caret) in the Pages sidebar footer and choose <strong>Make with AI</strong> — it creates the page and drops you straight into the AI tab with the prompt focused.</P>
            <Steps items={[
              'Open the AI tab and type an instruction — e.g. “Add a hero section with a heading and a primary call-to-action”, or “Turn the three cards into a grid”.',
              'Press Enter (Shift+Enter for a new line). Claude returns a short summary and the updated page.',
              'The change is applied to the canvas automatically as a single step — press Cmd/Ctrl+Z to undo the whole edit.',
            ]} />
            <P>It’s conversational — follow-ups like “now make the heading larger” build on the previous turn, and it always works from the live canvas (so manual edits in between are respected).</P>
            <Banner status="warn" variant="inline" title="API key">
              Uses the same in-browser Anthropic API key as the AI image and icon tools, stored only in this browser. Fine for local prototyping — don’t ship the in-browser key to a public production build.
            </Banner>
          </Stack>
        ),
      },
    ],
  },

  {
    id: 'preview',
    title: 'Preview & prototype',
    icon: 'visibility',
    articles: [
      {
        id: 'views',
        title: 'Edit, Preview & Code views',
        keywords: 'edit preview code snippet json tabs view live render',
        body: (
          <Stack gap="sm">
            <Bullets items={[
              <><strong>Edit</strong> — the interactive canvas.</>,
              <><strong>Preview</strong> — a read-only render of the current page.</>,
              <><strong>Code snippet</strong> — the raw JSON, editable directly; the preview updates on every keystroke and invalid JSON shows the parse error inline.</>,
            ]} />
          </Stack>
        ),
      },
      {
        id: 'prototype',
        title: 'Launching the prototype',
        keywords: 'prototype launch standalone share url navigate screens live sync open in new tab',
        body: (
          <Stack gap="sm">
            <P>Launch the prototype (the <Icon name="open_in_new" size="sm" /> action) to open the project in a new tab with no editor chrome — the generated navigation and in-page links work like a real multi-page site, and the address bar holds a shareable link to the current screen.</P>
            <P>While the prototype is open, edits you make in the editor live-sync to the screen on display.</P>
          </Stack>
        ),
      },
    ],
  },

  {
    id: 'storage',
    title: 'Saving, export & storage',
    icon: 'save',
    articles: [
      {
        id: 'autosave',
        title: 'Where your work is saved',
        keywords: 'save storage localstorage autosave persist browser local device',
        body: (
          <Stack gap="sm">
            <P>Everything is saved automatically in your browser’s local storage — projects, the page tree, and each page’s content and history. There’s no save button; your work persists across reloads.</P>
            <Banner status="info" variant="inline" title="Stored locally">
              Because content lives in this browser, a shared editor link only opens the page on the device where it was created. Use Export to move work between machines.
            </Banner>
          </Stack>
        ),
      },
      {
        id: 'export-import',
        title: 'Export & import (backup)',
        keywords: 'export import backup download upload file projects pages restore transfer',
        body: <P>From <strong>Settings → Editor</strong>, <strong>Export all pages</strong> downloads every project and page as one text file; <strong>Import pages</strong> restores them. Use it as a backup or to move work to another browser or machine.</P>,
      },
    ],
  },

  {
    id: 'shortcuts',
    title: 'Keyboard shortcuts',
    icon: 'keyboard',
    articles: [
      {
        id: 'shortcuts-list',
        title: 'All keyboard shortcuts',
        keywords: 'keyboard shortcuts keys hotkeys undo redo delete duplicate group ungroup move copy paste pattern cmd ctrl',
        body: (
          <Stack gap="sm">
            <P>Press <Kbd>{`${MOD}K`}</Kbd> any time in the editor to see this list.</P>
            <DefinitionList
              size="sm"
              labelWidth="fixed"
              items={[
                { label: 'Undo', value: `${MOD}Z` },
                { label: 'Redo', value: `${MOD}${SHIFT}Z` },
                { label: 'Delete element', value: DEL },
                { label: 'Duplicate element', value: `${MOD}D` },
                { label: 'Group as Stack', value: `${MOD}G` },
                { label: 'Ungroup element', value: `${MOD}${SHIFT}G` },
                { label: 'Move element up', value: `${ALT}↑` },
                { label: 'Move element down', value: `${ALT}↓` },
                { label: 'Copy pattern (style)', value: `${MOD}${ALT}C` },
                { label: 'Paste pattern (style)', value: `${MOD}${ALT}V` },
                { label: 'Keyboard shortcuts', value: `${MOD}K` },
              ]}
            />
          </Stack>
        ),
      },
    ],
  },
]

// ── Search ───────────────────────────────────────────────────────────────────────

function articleHaystack(category, article) {
  return `${category.title} ${article.title} ${article.keywords}`.toLowerCase()
}

function matchArticle(category, article, tokens) {
  if (!tokens.length) return true
  const hay = articleHaystack(category, article)
  return tokens.every((t) => hay.includes(t))
}

// ── Page ──────────────────────────────────────────────────────────────────────────

export function Help({ onNavigate }) {
  const [query, setQuery] = useState('')
  const [openIds, setOpenIds] = useState(() => new Set())

  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  const searching = tokens.length > 0

  const filtered = useMemo(
    () =>
      HELP.map((category) => ({
        ...category,
        articles: category.articles.filter((a) => matchArticle(category, a, tokens)),
      })).filter((category) => category.articles.length > 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query],
  )

  const resultCount = filtered.reduce((sum, c) => sum + c.articles.length, 0)

  function toggle(id) {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <>
      <Section padding="xs" contentWidth="xl" surface="panel" borderSize="sm" borderVariant="accent" borderSides="bottom">
        <Stack direction="column" gap="xs">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
              { label: 'Editor help' },
            ]}
          />
          <Heading as="h1" id="help-heading" size={{ xs: 'lg', md: 'xxl' }}>
            Editor help
          </Heading>
          <Paragraph size="sm" color="muted">
            How every editor feature works — search or browse by category.
          </Paragraph>
          <TextField
            label="Search help"
            type="search"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="lg" aria-labelledby="help-heading">
        <Stack direction="column" gap="lg">

        {!searching && (
          <Cluster gap="xs">
            {HELP.map((category) => (
              <Button
                key={category.id}
                as="a"
                href={`#help-${category.id}`}
                variant="secondary"
                size="sm"
                icon={category.icon}
              >
                {category.title}
              </Button>
            ))}
          </Cluster>
        )}

        {searching && (
          <Paragraph size="sm" color="muted">
            {resultCount} {resultCount === 1 ? 'result' : 'results'} for “{query.trim()}”
          </Paragraph>
        )}

        {filtered.length === 0 ? (
          <MessageEmptyState
            icon="search_off"
            title="No matching help"
            description="Try a different word — e.g. “drag”, “prototype”, “shortcut”, or a component name."
            action={<Button variant="secondary" onClick={() => setQuery('')}>Clear search</Button>}
          />
        ) : (
          filtered.map((category) => (
            <Stack key={category.id} direction="column" gap="sm">
              <Stack direction="row" gap="xs" align="center">
                <Icon name={category.icon} color="accent" />
                <Heading as="h2" size="md" id={`help-${category.id}`}>{category.title}</Heading>
              </Stack>
              {category.articles.map((article) => (
                <Accordion
                  key={article.id}
                  label={article.title}
                  open={searching ? true : openIds.has(article.id)}
                  onChange={() => toggle(article.id)}
                >
                  {article.body}
                </Accordion>
              ))}
            </Stack>
          ))
        )}

        <Section padding="md" surface="panel" radius="md" gap="sm">
          <Heading as="h2" size="sm">Ready to build?</Heading>
          <Paragraph size="sm" color="muted">Jump into the editor and try these features on the sample project.</Paragraph>
          <ButtonContainer align="start">
            <Button icon="arrow_forward" onClick={() => onNavigate?.('editor')}>Open the editor</Button>
          </ButtonContainer>
        </Section>
      </Stack>
      </Section>
    </>
  )
}
