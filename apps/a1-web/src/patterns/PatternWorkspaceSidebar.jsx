/**
 * PatternWorkspaceSidebar — the main editor's left sidebar while authoring a
 * pattern. A `SideNav` whose header carries a back link to the Patterns list,
 * the pattern name, and a Patterns/Layers `SegmentedControl`; the body switches
 * between **Patterns** (all patterns, each expandable to its top-level
 * structure; selecting one opens it) and **Layers** (the current pattern's
 * component tree, reusing the editor's `ComponentTreePanel`). Wired to the same
 * editor state the project sidebar uses.
 */
import { useState } from 'react'
import { Heading, IconButton, SegmentedControl, SideNav, Stack, TreeMenu } from '@gtivr4/a1-design-system-react'
import { ComponentTreePanel } from '../editor/EditorSidebar.jsx'
import { getAllPatterns } from './patternStore.js'

export function PatternWorkspaceSidebar({
  patternId,
  definition,
  selectedNodeId,
  onSelectNode,
  onRequestAdd,
  onNodeAction,
  onNodeMove,
  onConvertNode,
  open,
  onClose,
}) {
  const [tab, setTab] = useState('layers')
  const patterns = getAllPatterns()
  const patternName = patterns.find((p) => p.pattern.id === patternId)?.pattern.name ?? 'Pattern'

  // Just list the patterns — no child structure. Selecting one opens it.
  const patternItems = patterns.map((p) => ({
    id: p.pattern.id,
    label: p.pattern.name,
    icon: 'dashboard_customize',
  }))

  function handlePatternSelect(id) {
    const [pid, nodeId] = id.split('::')
    if (pid !== patternId) {
      window.location.href = `/editor?pattern=${pid}`
      return
    }
    // Already editing this pattern — selecting a structure node selects it on the
    // canvas (pattern node ids are preserved into the wrapped definition).
    if (nodeId) onSelectNode?.(nodeId)
  }

  const header = (
    <Stack direction="column" gap="sm">
      <Stack direction="row" align="center" gap="xs">
        <IconButton icon="arrow_back" label="Back to patterns" size="md" variant="tertiary" as="a" href="/patterns" />
        <Heading as="h2" size="xs" className="a1-web-workspace-sidebar__title">{patternName}</Heading>
      </Stack>
      <SegmentedControl
        value={tab}
        onChange={setTab}
        aria-label="Sidebar view"
        size="sm"
        fullWidth
        options={[
          { value: 'patterns', label: 'Patterns', icon: 'dashboard_customize' },
          { value: 'layers', label: 'Layers', icon: 'account_tree' },
        ]}
      />
    </Stack>
  )

  return (
    <SideNav header={header} collapseButtonPlacement="footer" open={open} onClose={onClose}>
      {tab === 'patterns' ? (
        <TreeMenu
          items={patternItems}
          selectedId={patternId}
          defaultExpandedIds={[patternId]}
          onSelect={handlePatternSelect}
          aria-label="All patterns"
        />
      ) : (
        definition ? (
          <ComponentTreePanel
            definition={definition}
            selectedNodeId={selectedNodeId}
            onSelectNode={onSelectNode}
            onRequestAdd={onRequestAdd}
            onNodeAction={onNodeAction}
            onNodeMove={onNodeMove}
            onConvertNode={onConvertNode}
          />
        ) : null
      )}
    </SideNav>
  )
}
