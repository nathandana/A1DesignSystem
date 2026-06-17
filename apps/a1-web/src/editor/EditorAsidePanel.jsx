import { useEffect, useState } from 'react'
import { Section, Tab, TabList, TabPanel, Tabs } from '@gtivr4/a1-design-system-react'
import { EditorPropsPanel } from './EditorPropsPanel.jsx'
import { EditorHistoryPanel } from './EditorHistoryPanel.jsx'
import { EditorAddPanel } from './EditorAddPanel.jsx'
import { EditorVersionsPanel } from './EditorVersionsPanel.jsx'

export function EditorAsidePanel({
  // Configure tab
  selectedNodeId,
  definition,
  pages = [],
  pageLevel,
  availableLevels,
  onSetPageLevel,
  onNodePropsChange,
  onPageMetadataChange,
  onConvertNode,
  onDuplicatePage,
  onDeletePage,
  // History tab
  historyEntries,
  historyIndex,
  onHistoryJump,
  onHistoryRestore,
  onHistoryRename,
  // Add tab
  addTarget,
  onCancelAdd,
  onAddNode,
  // Versions tab
  versions,
  activeVersionId,
  baseDef,
  onSwitchVersion,
  onAddVersion,
  onDeleteVersion,
  onRenameVersion,
}) {
  const [tab, setTab] = useState('configure')

  // Auto-switch to Add tab when a target is set from the canvas or tree.
  useEffect(() => {
    if (addTarget !== null && addTarget !== undefined) setTab('add')
  }, [addTarget])

  // Auto-switch to Configure tab when a node is selected in the canvas or tree.
  useEffect(() => {
    if (selectedNodeId !== null && selectedNodeId !== undefined) setTab('configure')
  }, [selectedNodeId])

  function handleTabChange(t) {
    setTab(t)
    if (t !== 'add') onCancelAdd?.()
  }

  return (
    <Section padding="xs">
      <Tabs value={tab} onChange={handleTabChange} variant="line" size="compact">
        <TabList>
          <Tab value="configure">Configure</Tab>
          <Tab value="add">Add</Tab>
          <Tab value="versions">Versions</Tab>
          <Tab value="history">History</Tab>
        </TabList>

        <TabPanel value="configure">
          <EditorPropsPanel
            selectedNodeId={selectedNodeId}
            definition={definition}
            pages={pages}
            pageLevel={pageLevel}
            availableLevels={availableLevels}
            onSetPageLevel={onSetPageLevel}
            onNodePropsChange={onNodePropsChange}
            onPageMetadataChange={onPageMetadataChange}
            onConvertNode={onConvertNode}
            onDuplicatePage={onDuplicatePage}
            onDeletePage={onDeletePage}
          />
        </TabPanel>

        <TabPanel value="add">
          <EditorAddPanel addTarget={addTarget} onAdd={onAddNode} />
        </TabPanel>

        <TabPanel value="versions">
          <EditorVersionsPanel
            versions={versions ?? []}
            activeVersionId={activeVersionId}
            baseDef={baseDef}
            currentDef={definition}
            onSwitch={onSwitchVersion}
            onAdd={onAddVersion}
            onDelete={onDeleteVersion}
            onRename={onRenameVersion}
          />
        </TabPanel>

        <TabPanel value="history">
          <EditorHistoryPanel
            entries={historyEntries}
            currentIndex={historyIndex}
            onJump={onHistoryJump}
            onRestore={onHistoryRestore}
            onRename={onHistoryRename}
          />
        </TabPanel>
      </Tabs>
    </Section>
  )
}
