import { useState } from 'react'
import {
  Breadcrumb,
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
import { summarizeLocks } from '../patterns/resolvePattern.js'
import { createBlankPattern, deletePattern, duplicatePattern, getAllPatterns, isUserPattern } from '../patterns/patternStore.js'

export function Patterns({ onNavigate }) {
  const t = useT()
  const [, setTick] = useState(0)
  const refresh = () => setTick((t) => t + 1)
  const [menu, setMenu] = useState(null) // { pattern, x, y }
  const [confirmDelete, setConfirmDelete] = useState(null)
  const patterns = getAllPatterns()

  function openPattern(id) { window.location.href = `/editor?pattern=${id}` }

  function handleCreate() {
    const def = createBlankPattern()
    window.location.href = `/editor?pattern=${def.pattern.id}`
  }

  return (
    <>
    <Section padding='xs' contentWidth='xl' surface="panel" borderSize='sm' borderVariant='accent' borderSides='bottom'>
              <Stack direction="column" gap="xs">
<Breadcrumb
          items={[
            { label: t('app.page.home', 'Home'), href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
            { label: t('app.page.patterns', 'Patterns') },
          ]}
        />
            <Heading as="h1" id="patterns-heading"  size={{ xs: 'lg', md: 'xxl' }}>
              {t('app.page.patterns', 'Patterns')}
            </Heading>
            <Paragraph size="sm" color="muted">
              {t('app.patterns.subtitle', 'Reusable, governed compositions — a page header, a footer, or a standardized card. Open one to edit it and lock the parts that should stay consistent.')}
            </Paragraph>
          <Stack direction="row" gap="xs" align="center" wrap>
            <Button variant="secondary" icon="help" onClick={() => onNavigate?.('help')}>
              {t('app.page.help', 'Help')}
            </Button>
            <Button icon="add" onClick={handleCreate}>
              {t('app.patterns.newPattern', 'New pattern')}
            </Button>
          </Stack>
        </Stack>
    </Section>
    <Section padding="sm" aria-labelledby="patterns-heading" contentWidth="xl">
      <Stack direction="column" gap="sm">
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
              const { lockedComponents, lockedProps, editableFields } = summarizeLocks(meta.nodes)
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
