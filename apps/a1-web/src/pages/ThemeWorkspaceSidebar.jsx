import { Heading, IconButton, SideNav, Stack, TreeMenu } from '@gtivr4/a1-design-system-react'
import { RAMP_LABELS, RAMP_NAMES } from '../lib/themeColors.ts'

/**
 * The theme editor sidebar while a theme is open: a SideNav (same shell as the
 * project editor) whose header carries a back link to the Themes list and the
 * theme name, and whose body is the category tree (Color — with a child per
 * ramp — Typography, Shape, Code).
 */
export function ThemeWorkspaceSidebar({ themeName, category, onSelectCategory, onBackToThemes, open, onClose }) {
  const header = (
    <Stack direction="row" align="center" gap="xs">
      <IconButton icon="grid_view" label="Back to themes" size="md" variant="tertiary" onClick={onBackToThemes} />
      <Heading as="h2" size="xs" className="a1-web-workspace-sidebar__title">
        {themeName ?? 'Theme'}
      </Heading>
    </Stack>
  )

  return (
    <SideNav header={header} collapseButtonPlacement="footer" open={open} onClose={onClose}>
      <TreeMenu
        aria-label="Theme categories"
        selectedId={category}
        defaultExpandedIds={['color']}
        onSelect={onSelectCategory}
        items={[
          { id: 'details', label: 'Details', icon: 'info' },
          {
            id: 'color',
            label: 'Color',
            icon: 'palette',
            children: RAMP_NAMES.map((r) => ({ id: `color:${r}`, label: RAMP_LABELS[r] })),
          },
          { id: 'semantic', label: 'Semantic', icon: 'contrast' },
          {
            id: 'typography',
            label: 'Typography',
            icon: 'title',
            children: [
              { id: 'typography:display', label: 'Display' },
              { id: 'typography:heading', label: 'Heading' },
              { id: 'typography:body', label: 'Body' },
            ],
          },
          { id: 'shape', label: 'Shape', icon: 'rounded_corner' },
          { id: 'icons', label: 'Icons', icon: 'interests' },
          { id: 'code', label: 'Code', icon: 'code' },
        ]}
      />
    </SideNav>
  )
}
