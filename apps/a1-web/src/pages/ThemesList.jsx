import { useEffect, useState } from 'react'
import { useT } from '../labels/useT.js'
import {
  Breadcrumb,
  Button,
  ButtonContainer,
  Card,
  ContextMenu,
  Dialog,
  Grid,
  Heading,
  MessageEmptyState,
  Paragraph,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { createTheme, deleteTheme, duplicateTheme, listThemes, subscribeThemes } from '../lib/themeStore.ts'

const CHIP_RAMPS = ['accent', 'info', 'success', 'warn', 'error']

export function ThemesList({ onOpenTheme, onNavigateHome }) {
  const t = useT()
  const [themes, setThemes] = useState(() => listThemes())
  const [menu, setMenu] = useState(null) // { theme, x, y }
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => subscribeThemes(() => setThemes(listThemes())), [])

  function newTheme() {
    const t = createTheme()
    onOpenTheme?.(t.id)
  }

  return (
    <>
      <Section padding="xs" contentWidth="xl" surface="panel" borderSize="sm" borderVariant="accent" borderSides="bottom">
        <Stack direction="column" gap="xs">
        <Breadcrumb
          items={[
            { label: t('app.theme.breadcrumbHome', 'Home'), href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigateHome?.() } },
            { label: t('app.page.theme', 'Theme') },
          ]}
        />
          <Heading as="h1" id="themes-heading" size={{ xs: 'lg', md: 'xxl' }}>{t('app.page.theme', 'Theme')}</Heading>
          <Paragraph size="sm" color="muted">{t('app.theme.pageDescription', 'Build a theme with AI or by hand — colours, type, and shape. Open one to edit it.')}</Paragraph>
          <ButtonContainer align='left'>
          <Button icon="add" onClick={newTheme}>{t('app.theme.newTheme', 'New theme')}</Button>
          </ButtonContainer>
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="xl" aria-labelledby="themes-heading">
        <Stack direction="column" gap="md">

        {themes.length === 0 ? (
          <MessageEmptyState
            icon="palette"
            title={t('app.theme.emptyTitle', 'No themes yet')}
            description={t('app.theme.emptyDescription', 'Create your first theme to start designing.')}
            action={<Button icon="add" onClick={newTheme}>{t('app.theme.newTheme', 'New theme')}</Button>}
          />
        ) : (
          <Grid columns={{ xs: 1, sm: 2, lg: 3 }} gap="md">
            {themes.map((theme) => (
              <div
                key={theme.id}
                onContextMenu={(e) => { e.preventDefault(); setMenu({ theme, x: e.clientX, y: e.clientY }) }}
              >
                <Card variant="navigation" onClick={() => onOpenTheme?.(theme.id)}>
                  <Stack gap="sm">
                    <Stack direction="row" gap="xs">
                      {CHIP_RAMPS.map((r) => (
                        <span key={r} className="a1-web-theme-card-chip" style={{ background: theme.ramps?.[r]?.[500] }} aria-hidden="true" />
                      ))}
                    </Stack>
                    <Heading as="h2" size="sm">{theme.name}</Heading>
                    {theme.description && <Paragraph size="sm" color="muted">{theme.description}</Paragraph>}
                    <Paragraph size="xs" color="muted">{theme.fonts?.heading} · {theme.fonts?.body}</Paragraph>
                  </Stack>
                </Card>
              </div>
            ))}
          </Grid>
        )}
      </Stack>

      <ContextMenu
        open={!!menu}
        x={menu?.x ?? 0}
        y={menu?.y ?? 0}
        onClose={() => setMenu(null)}
        aria-label={t('app.theme.contextMenuLabel', 'Theme actions')}
        items={menu ? [
          { id: 'open', label: t('app.theme.menuOpen', 'Open'), icon: 'edit', onClick: () => { onOpenTheme?.(menu.theme.id); setMenu(null) } },
          { id: 'dup', label: t('app.theme.menuDuplicate', 'Duplicate'), icon: 'content_copy', onClick: () => { duplicateTheme(menu.theme.id); setMenu(null) } },
          { type: 'divider', id: 'd1' },
          { id: 'del', label: t('app.theme.menuDelete', 'Delete'), icon: 'delete', variant: 'destructive', onClick: () => { setConfirmDelete(menu.theme); setMenu(null) } },
        ] : []}
      />

      <Dialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title={t('app.theme.deleteTitle', 'Delete theme?')}
        status="warn"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDelete(null)}>{t('app.theme.deleteCancel', 'Cancel')}</Button>
            <Button variant="destructive" icon="delete" onClick={() => { deleteTheme(confirmDelete.id); setConfirmDelete(null) }}>{t('app.theme.menuDelete', 'Delete')}</Button>
          </>
        }
      >
        <Paragraph>"{confirmDelete?.name}" {t('app.theme.deleteConfirmSuffix', 'will be removed.')}</Paragraph>
      </Dialog>
      </Section>
    </>
  )
}
