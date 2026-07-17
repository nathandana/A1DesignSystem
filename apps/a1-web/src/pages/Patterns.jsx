import { useEffect, useRef, useState } from 'react'
import {
  Button,
  Card,
  ContextMenu,
  DefinitionList,
  Dialog,
  Grid,
  Heading,
  MessageEmptyState,
  Paragraph,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { useT } from '../labels/useT.js'
import { PageTitleArea } from './PageTitleArea.jsx'
import { summarizeLocks } from '../patterns/resolvePattern.js'
import { getPattern } from '../patterns/patterns.js'
import { createBlankPattern, deletePattern, duplicatePattern, getAllPatterns, isUserPattern, savePattern } from '../patterns/patternStore.js'

function importedPatternPayload(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  if (value.pattern && Array.isArray(value.pattern.nodes)) {
    return {
      nodes: value.pattern.nodes,
      name: typeof value.pattern.name === 'string' ? value.pattern.name : 'Imported pattern',
      description: typeof value.pattern.description === 'string' ? value.pattern.description : '',
      category: typeof value.pattern.category === 'string' ? value.pattern.category : 'section',
    }
  }
  if (typeof value.type === 'string') {
    return { nodes: [value], name: value.type === 'Section' ? 'Imported Section' : `Imported ${value.type}`, description: '', category: 'section' }
  }
  if (Array.isArray(value.nodes) && value.nodes.every((node) => node && typeof node === 'object' && typeof node.type === 'string')) {
    return { nodes: value.nodes, name: 'Imported pattern', description: '', category: 'section' }
  }
  return null
}

export function Patterns({ onNavigate }) {
  const t = useT()
  const [, setTick] = useState(0)
  const refresh = () => setTick((t) => t + 1)
  const [menu, setMenu] = useState(null) // { pattern, x, y }
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [importError, setImportError] = useState('')
  const handledImportRef = useRef(false)
  const patterns = getAllPatterns()

  function openPattern(id) { window.location.href = `/editor?pattern=${id}` }

  function handleCreate() {
    const def = createBlankPattern()
    window.location.href = `/editor?pattern=${def.pattern.id}`
  }

  // The Figma bridge opens /patterns?json=<component-or-pattern-json>. Keep
  // this handoff local, generate a fresh user-pattern id, and then use the
  // normal pattern workspace instead of maintaining a second JSON editor.
  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('json')
    if (!raw || handledImportRef.current) return
    handledImportRef.current = true
    try {
      const payload = importedPatternPayload(JSON.parse(raw))
      if (!payload || payload.nodes.length === 0) throw new Error('The JSON does not contain a component node or pattern nodes.')
      const definition = createBlankPattern()
      const imported = {
        ...definition,
        pattern: {
          ...definition.pattern,
          name: payload.name,
          description: payload.description,
          category: payload.category,
          nodes: payload.nodes,
        },
      }
      savePattern(imported)
      onNavigate?.('editor', { path: `/editor?pattern=${encodeURIComponent(imported.pattern.id)}`, replace: true })
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Could not import the supplied pattern JSON.')
      window.history.replaceState({}, '', '/patterns')
    }
  }, [onNavigate])

  return (
    <>
    <PageTitleArea
      headingId="patterns-heading"
      breadcrumbItems={[
        { label: t('app.page.home', 'Home'), href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
        { label: t('app.page.patterns', 'Patterns') },
      ]}
      title={t('app.page.patterns', 'Patterns')}
      description={t('app.patterns.subtitle', 'Reusable, governed compositions — a page header, a footer, or a standardized card. Open one to edit it and lock the parts that should stay consistent.')}
      actions={(
        <>
          <Button variant="secondary" icon="help" onClick={() => onNavigate?.('help')}>
            {t('app.page.help', 'Help')}
          </Button>
          <Button icon="add" onClick={handleCreate}>
            {t('app.patterns.newPattern', 'New pattern')}
          </Button>
        </>
      )}
    />
    <Section padding="sm" aria-labelledby="patterns-heading" contentWidth="xl">
      <Stack direction="column" gap="sm">
        {importError && <Paragraph>Couldn’t import Figma JSON: {importError}</Paragraph>}
        <Stack direction="row" align="start" justify="between" wrap gap="md">
        </Stack>

        {patterns.length === 0 ? (
          <MessageEmptyState
            icon="dashboard_customize"
            title={t('app.patterns.emptyTitle', 'No patterns yet')}
            description={t('app.patterns.emptyDescription', 'Patterns are reusable compositions you can insert into pages and govern with locks.')}
            action={<Button icon="add" onClick={handleCreate}>{t('app.patterns.newPattern', 'New pattern')}</Button>}
          />
        ) : (
          <Grid columns={{ xs: 1, md: 2, lg: 3 }} gap="md">
            {patterns.map((pattern) => {
              const meta = pattern.pattern
              const { lockedComponents, lockedProps, editableFields } = summarizeLocks(meta.nodes, getPattern)
              const scopeValue = meta.projectIds?.length
                ? `${meta.projectIds.length} ${t('app.patterns.scopeProject', 'project')}${meta.projectIds.length > 1 ? t('app.patterns.scopeProjectsPlural', 's') : ''}`
                : t('app.patterns.scopeAll', 'All projects')
              return (
                <div
                  key={meta.id}
                  onContextMenu={(e) => { e.preventDefault(); setMenu({ pattern: meta, x: e.clientX, y: e.clientY }) }}
                >
                  <Card
                    variant="navigation"
                    href={`/editor?pattern=${meta.id}`}
                  >
                    <Stack direction="column" gap="sm">
                      <Heading as="h2" size="sm">{meta.name}</Heading>
                      {meta.description && (
                        <Paragraph size="sm" color="muted">{meta.description}</Paragraph>
                      )}
                      <DefinitionList
                        size="sm"
                        labelWidth="fixed"
                        items={[
                          { label: t('app.patterns.labelCategory', 'Category'), value: meta.category },
                          { label: t('app.patterns.labelLocked', 'Locked'), value: `${lockedComponents} ${t('app.patterns.lockedComponents', 'components')} · ${lockedProps} ${t('app.patterns.lockedProps', 'props')}` },
                          { label: t('app.patterns.labelEditable', 'Editable'), value: `${editableFields} ${t('app.patterns.editableFields', 'fields')}` },
                          { label: t('app.patterns.labelScope', 'Scope'), value: scopeValue },
                        ]}
                      />
                    </Stack>
                  </Card>
                </div>
              )
            })}
          </Grid>
        )}
      </Stack>

      <ContextMenu
        open={!!menu}
        x={menu?.x ?? 0}
        y={menu?.y ?? 0}
        onClose={() => setMenu(null)}
        aria-label={t('app.patterns.contextMenuLabel', 'Pattern actions')}
        items={menu ? [
          { id: 'open', label: t('app.patterns.actionOpen', 'Open'), icon: 'edit', onClick: () => { openPattern(menu.pattern.id); setMenu(null) } },
          { id: 'dup', label: t('app.patterns.actionDuplicate', 'Duplicate'), icon: 'content_copy', onClick: () => { duplicatePattern(menu.pattern.id); setMenu(null); refresh() } },
          ...(isUserPattern(menu.pattern.id)
            ? [{ type: 'divider', id: 'd1' }, { id: 'del', label: t('app.patterns.actionDelete', 'Delete'), icon: 'delete', variant: 'destructive', onClick: () => { setConfirmDelete(menu.pattern); setMenu(null) } }]
            : []),
        ] : []}
      />

      <Dialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title={t('app.patterns.deleteTitle', 'Delete pattern?')}
        status="warn"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDelete(null)}>{t('app.patterns.cancel', 'Cancel')}</Button>
            <Button variant="destructive" icon="delete" onClick={() => { deletePattern(confirmDelete.id); setConfirmDelete(null); refresh() }}>{t('app.patterns.actionDelete', 'Delete')}</Button>
          </>
        }
      >
        <Paragraph>"{confirmDelete?.name}" {t('app.patterns.deleteConfirmSuffix', 'will be removed.')}</Paragraph>
      </Dialog>
    </Section>
    </>
  )
}
