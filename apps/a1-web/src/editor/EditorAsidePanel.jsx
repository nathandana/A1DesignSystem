import { useEffect, useState } from 'react'
import { Divider, Section, SegmentedControl, Stack } from '@gtivr4/a1-design-system-react'
import { EditorPropsPanel, findNodeInDefinition } from './EditorPropsPanel.jsx'
import { EditorHistoryPanel } from './EditorHistoryPanel.jsx'
import { EditorAddPanel } from './EditorAddPanel.jsx'
import { EditorVersionsPanel } from './EditorVersionsPanel.jsx'
import { EditorChatPanel } from './EditorChatPanel.jsx'
import { EditorImagesPanel } from './EditorImagesPanel.jsx'
import { AI_ENABLED } from '../lib/aiImages.ts'
import { PatternLockControls } from '../patterns/PatternLockControls.jsx'

export function EditorAsidePanel({
  // Configure tab
  selectedNodeId,
  definition,
  onApplyDefinition,
  composeWithAi,
  onAiComposeConsumed,
  projectId,
  pages = [],
  pageLevel,
  availableLevels,
  onSetPageLevel,
  onNodePropsChange,
  activeItem,
  onItemSelect,
  onPageMetadataChange,
  onConvertNode,
  onDuplicatePage,
  onDeletePage,
  patternScope,
  lockEnforced,
  lockAuthoring,
  onSetLock,
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
  patternEntries,
  onAddPattern,
  slotFilter,
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
  // One-shot request to focus the chat input, set when "Make with AI" opens a page.
  const [chatFocusRequest, setChatFocusRequest] = useState(false)

  // Auto-switch to the (component) Add tab when a target is set from canvas/tree.
  useEffect(() => {
    if (addTarget !== null && addTarget !== undefined) setTab('add-component')
  }, [addTarget])

  // Auto-switch to Configure tab when a node is selected in the canvas or tree.
  useEffect(() => {
    if (selectedNodeId !== null && selectedNodeId !== undefined) setTab('configure')
  }, [selectedNodeId])

  // "Make with AI" opened this page — land on the AI tab and focus the prompt,
  // then clear the flag so reopening the page later doesn't re-trigger it.
  useEffect(() => {
    if (!composeWithAi) return
    setTab('ai')
    setChatFocusRequest(true)
    onAiComposeConsumed?.()
  }, [composeWithAi]) // eslint-disable-line react-hooks/exhaustive-deps

  const isAddTab = (t) => t === 'add-component' || t === 'add-pattern'

  function handleTabChange(t) {
    setTab(t)
    if (!isAddTab(t)) onCancelAdd?.()
  }

  // The selected segment shows icon + label, the rest are icon-only — the
  // formal SegmentedControl `labelMode="selected"` pattern.
  const tabOptions = [
    { value: 'configure', label: 'Configure', icon: 'tune' },
    { value: 'add-component', label: 'Component', icon: 'widgets' },
    { value: 'add-pattern', label: 'Pattern', icon: 'dashboard_customize' },
    { value: 'images', label: 'Images', icon: 'photo_library' },
    ...(AI_ENABLED ? [{ value: 'ai', label: 'AI', icon: 'auto_awesome' }] : []),
    { value: 'versions', label: 'Versions', icon: 'commit' },
    { value: 'history', label: 'History', icon: 'history' },
  ]

  return (
    <Section padding="xs">
      <Stack gap="sm">
        <SegmentedControl
          options={tabOptions}
          value={tab}
          onChange={handleTabChange}
          size="sm"
          fullWidth
          labelMode="none"
          aria-label="Editor panel"
        />

        {tab === 'configure' && (
          <div>
            {lockAuthoring && selectedNodeId && definition && (() => {
              const node = findNodeInDefinition(definition, selectedNodeId)
              return node ? (
                <Stack gap="lg">
                  <PatternLockControls node={node} onChange={(lock) => onSetLock?.(selectedNodeId, lock)} />
                  <Divider space="xs" />
                </Stack>
              ) : null
            })()}
            <EditorPropsPanel
              selectedNodeId={selectedNodeId}
              definition={definition}
              projectId={projectId}
              pages={pages}
              pageLevel={pageLevel}
              availableLevels={availableLevels}
              onSetPageLevel={onSetPageLevel}
              onNodePropsChange={onNodePropsChange}
              activeItem={activeItem}
              onItemSelect={onItemSelect}
              onPageMetadataChange={onPageMetadataChange}
              patternScope={patternScope}
              onConvertNode={onConvertNode}
              onDuplicatePage={onDuplicatePage}
              onDeletePage={onDeletePage}
              lockEnforced={lockEnforced}
              lockAuthoring={lockAuthoring}
              onSetLock={onSetLock}
            />
          </div>
        )}

        {tab === 'add-component' && (
          <EditorAddPanel
            kind="components"
            addTarget={addTarget}
            onAdd={onAddNode}
            patternEntries={patternEntries}
            onAddPattern={onAddPattern}
            slotFilter={slotFilter}
          />
        )}

        {tab === 'add-pattern' && (
          <EditorAddPanel
            kind="patterns"
            addTarget={addTarget}
            onAdd={onAddNode}
            patternEntries={patternEntries}
            onAddPattern={onAddPattern}
            slotFilter={slotFilter}
          />
        )}

        {tab === 'images' && (
          <EditorImagesPanel projectId={projectId} />
        )}

        {tab === 'ai' && (
          <EditorChatPanel
            definition={definition}
            onApplyDefinition={onApplyDefinition}
            requestFocus={chatFocusRequest}
            onFocusHandled={() => setChatFocusRequest(false)}
          />
        )}

        {tab === 'versions' && (
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
        )}

        {tab === 'history' && (
          <EditorHistoryPanel
            entries={historyEntries}
            currentIndex={historyIndex}
            onJump={onHistoryJump}
            onRestore={onHistoryRestore}
            onRename={onHistoryRename}
          />
        )}
      </Stack>
    </Section>
  )
}
