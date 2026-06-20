import { useEffect, useState } from 'react'
import {
  Breadcrumb,
  Button,
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
            { label: 'Home', href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigateHome?.() } },
            { label: 'Theme' },
          ]}
        />
          <Heading as="h1" id="themes-heading" size={{ xs: 'lg', md: 'xxl' }}>Theme</Heading>
          <Paragraph size="sm" color="muted">Build a theme with AI or by hand — colours, type, and shape. Open one to edit it.</Paragraph>
          <Button icon="add" onClick={newTheme}>New theme</Button>
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="xl" aria-labelledby="themes-heading">
        <Stack direction="column" gap="md">

        {themes.length === 0 ? (
          <MessageEmptyState
            icon="palette"
            title="No themes yet"
            description="Create your first theme to start designing."
            action={<Button icon="add" onClick={newTheme}>New theme</Button>}
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
        aria-label="Theme actions"
        items={menu ? [
          { id: 'open', label: 'Open', icon: 'edit', onClick: () => { onOpenTheme?.(menu.theme.id); setMenu(null) } },
          { id: 'dup', label: 'Duplicate', icon: 'content_copy', onClick: () => { duplicateTheme(menu.theme.id); setMenu(null) } },
          { type: 'divider', id: 'd1' },
          { id: 'del', label: 'Delete', icon: 'delete', variant: 'destructive', onClick: () => { setConfirmDelete(menu.theme); setMenu(null) } },
        ] : []}
      />

      <Dialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete theme?"
        status="warn"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button variant="destructive" icon="delete" onClick={() => { deleteTheme(confirmDelete.id); setConfirmDelete(null) }}>Delete</Button>
          </>
        }
      >
        <Paragraph>“{confirmDelete?.name}” will be removed.</Paragraph>
      </Dialog>
      </Section>
    </>
  )
}
