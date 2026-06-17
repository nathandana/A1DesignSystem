import { useEffect, useState } from 'react'
import { Button, Heading, IconButton, SegmentedControl, SideNav, Stack } from '@gtivr4/a1-design-system-react'
import { ProjectPagesPanel } from './ProjectPagesPanel.jsx'
import { ComponentTreePanel } from '../editor/EditorSidebar.jsx'

/**
 * The editor sidebar while inside a project: a SideNav whose body switches
 * between the project **Pages** tree and the current page's **Layers**
 * (component) tree. The header carries a back link to the Projects list and the
 * Pages/Layers switch; the footer holds the contextual add action.
 */
export function ProjectWorkspaceSidebar({
  project,
  onBackToProjects,
  // Pages tab
  pages,
  activePageId,
  hasOpenPage,
  onSelectPage,
  onAddPage,
  onDuplicatePage,
  onDeletePage,
  onMovePage,
  // Layers tab
  definition,
  selectedNodeId,
  onSelectNode,
  onNodeMove,
  onRequestAdd,
  onNodeAction,
  onConvertNode,
}) {
  const [tab, setTab] = useState('pages')

  // Opening a page jumps to Layers (to edit its components); returning to the
  // project home (no page open) goes back to Pages. Manual toggles in between
  // stick until the open page changes.
  useEffect(() => {
    setTab(activePageId ? 'layers' : 'pages')
  }, [activePageId])

  const header = (
    <Stack direction="column" gap="sm">
      <Stack direction="row" align="center" gap="xs">
        <IconButton icon="apps" label="Back to projects" size="md" variant="tertiary" onClick={onBackToProjects} />
        <Heading as="h2" size="xs" className="a1-web-workspace-sidebar__title">
          {project?.name ?? 'Project'}
        </Heading>
      </Stack>
      <SegmentedControl
        value={tab}
        onChange={setTab}
        aria-label="Sidebar view"
        size="sm"
        fullWidth
        options={[
          { value: 'pages', label: 'Pages', icon: 'description' },
          { value: 'layers', label: 'Layers', icon: 'account_tree' },
        ]}
      />
    </Stack>
  )

  const footer = tab === 'pages'
    ? (
      <Button size="sm" variant="secondary" icon="add" fullWidth onClick={() => onAddPage?.({})}>
        Add page
      </Button>
    )
    : (
      <Button
        size="sm"
        variant="secondary"
        icon="add"
        fullWidth
        disabled={!hasOpenPage}
        onClick={() => onRequestAdd?.({ targetId: selectedNodeId ?? null, position: 'after' })}
      >
        Add component
      </Button>
    )

  return (
    <SideNav header={header} footer={footer} collapseButtonPlacement="footer">
      {tab === 'pages' ? (
        <ProjectPagesPanel
          pages={pages}
          activePageId={activePageId}
          onSelectPage={onSelectPage}
          onAddPage={onAddPage}
          onDuplicatePage={onDuplicatePage}
          onDeletePage={onDeletePage}
          onMovePage={onMovePage}
        />
      ) : (
        <ComponentTreePanel
          definition={hasOpenPage ? definition : null}
          selectedNodeId={selectedNodeId}
          onSelectNode={onSelectNode}
          onNodeMove={onNodeMove}
          onRequestAdd={onRequestAdd}
          onNodeAction={onNodeAction}
          onConvertNode={onConvertNode}
        />
      )}
    </SideNav>
  )
}
