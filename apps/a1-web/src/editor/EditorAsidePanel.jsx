import { useEffect, useRef, useState } from 'react'
import { Divider, Section, SegmentedControl, Stack } from '@gtivr4/a1-design-system-react'
import { EditorPropsPanel, findNodeInDefinition } from './EditorPropsPanel.jsx'
import { useSuppressAutofill } from './useSuppressAutofill.js'
import { EditorHistoryPanel } from './EditorHistoryPanel.jsx'
import { EditorAddPanel } from './EditorAddPanel.jsx'
import { EditorVersionsPanel } from './EditorVersionsPanel.jsx'
import { EditorChatPanel } from './EditorChatPanel.jsx'
import { EditorCodexPanel } from './EditorCodexPanel.jsx'
import { EditorImagesPanel } from './EditorImagesPanel.jsx'
import { EditorDataPanel } from './EditorDataPanel.jsx'
import { AI_ENABLED } from '../lib/aiImages.ts'
import { isLocalBridgeFeatureEnabled } from '../lib/localCodex.ts'
import { PatternLockControls } from '../patterns/PatternLockControls.jsx'
import { useT } from '../labels/useT.js'

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
  onNodeContentKeyChange,
  activeItem,
  onItemSelect,
  onPageMetadataChange,
  onConvertNode,
  onCreatePattern,
  onDetachPattern,
  onDuplicatePage,
  onDeletePage,
  patternScope,
  lockEnforced,
  lockAuthoring,
  onSetLock,
  onSetNodeRepeat,
  onSetNodeCollections,
  onSetNodeUtilities,
  onSetNodeVisibility,
  // History tab
  historyEntries,
  historyIndex,
  onHistoryRestore,
  onHistoryRename,
  onHistoryPreview,
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
  const t = useT()
  const [tab, setTab] = useState('configure')
  const bridgeFeaturesEnabled = isLocalBridgeFeatureEnabled()
  // One-shot request to focus the chat input, set when "Make with AI" opens a page.
  const [chatFocusRequest, setChatFocusRequest] = useState(false)
  // The editor panels are internal tooling — turn off browser/password-manager
  // autofill for every field they render (it otherwise offers your email/address
  // into config fields like a Stat "Description"). Covers later-mounting fields.
  const fieldsRef = useRef(null)
  useSuppressAutofill(fieldsRef)

  // Auto-switch to the (component) Add tab when a target is set from canvas/tree.
  useEffect(() => {
    if (addTarget !== null && addTarget !== undefined) setTab('add-component')
  }, [addTarget])

  // Auto-switch to Configure tab when a node is selected in the canvas or tree.
  useEffect(() => {
    if (selectedNodeId !== null && selectedNodeId !== undefined) setTab('configure')
  }, [selectedNodeId])

  useEffect(() => {
    if (!bridgeFeaturesEnabled && tab === 'codex') setTab('configure')
  }, [bridgeFeaturesEnabled, tab])

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
    { value: 'configure', label: t('app.editor.configureTab', 'Configure'), icon: 'tune' },
    { value: 'add-component', label: t('app.editor.componentTab', 'Component'), icon: 'widgets' },
    { value: 'add-pattern', label: t('app.editor.patternTab', 'Pattern'), icon: 'dashboard_customize' },
    { value: 'images', label: t('app.editor.imagesTab', 'Images'), icon: 'photo_library' },
    { value: 'data', label: t('app.editor.dataTab', 'Data'), icon: 'table_chart' },
    ...(bridgeFeaturesEnabled ? [{ value: 'codex', label: t('app.editor.codexTab', 'Codex'), icon: 'terminal' }] : []),
    ...(AI_ENABLED ? [{ value: 'ai', label: 'AI', icon: 'auto_awesome' }] : []),
    { value: 'versions', label: t('app.editor.versionsTab', 'Versions'), icon: 'commit' },
    { value: 'history', label: t('app.editor.historyTab', 'History'), icon: 'history' },
  ]

  return (
    <Section padding="xs">
      <div ref={fieldsRef}>
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
              onNodeContentKeyChange={onNodeContentKeyChange}
              activeItem={activeItem}
              onItemSelect={onItemSelect}
              onPageMetadataChange={onPageMetadataChange}
              patternScope={patternScope}
              onConvertNode={onConvertNode}
              onCreatePattern={onCreatePattern}
              onDetachPattern={onDetachPattern}
              onDuplicatePage={onDuplicatePage}
              onDeletePage={onDeletePage}
              lockEnforced={lockEnforced}
              lockAuthoring={lockAuthoring}
              onSetLock={onSetLock}
              onSetNodeRepeat={onSetNodeRepeat}
              onSetNodeCollections={onSetNodeCollections}
              onSetNodeUtilities={onSetNodeUtilities}
              onSetNodeVisibility={onSetNodeVisibility}
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

        {tab === 'data' && (
          <EditorDataPanel projectId={projectId} />
        )}

        {bridgeFeaturesEnabled && tab === 'codex' && (
          <EditorCodexPanel definition={definition} />
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
            onRestore={onHistoryRestore}
            onRename={onHistoryRename}
            onPreview={onHistoryPreview}
          />
        )}
      </Stack>
      </div>
    </Section>
  )
}
