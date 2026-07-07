import { Heading, IconButton, SideNav, Stack, TreeMenu } from '@gtivr4/a1-design-system-react'
import { RAMP_LABELS, RAMP_NAMES } from '../lib/themeColors.ts'
import { useT } from '../labels/useT.js'

/**
 * The theme editor sidebar while a theme is open: a SideNav (same shell as the
 * project editor) whose header carries a back link to the Themes list and the
 * theme name, and whose body is the category tree (Color — with a child per
 * ramp — Typography, Shape, JSON).
 */
export function ThemeWorkspaceSidebar({ themeName, category, onSelectCategory, onBackToThemes, open, onClose }) {
  const t = useT()

  const header = (
    <Stack direction="row" align="center" gap="xs">
      <IconButton icon="grid_view" label={t('app.theme.backToThemes', 'Back to themes')} size="md" variant="tertiary" onClick={onBackToThemes} />
      <Heading as="h2" size="xs" className="a1-web-workspace-sidebar__title">
        {themeName ?? t('app.page.theme', 'Theme')}
      </Heading>
    </Stack>
  )

  return (
    <SideNav header={header} collapseButtonPlacement="footer" open={open} onClose={onClose}>
      <TreeMenu
        aria-label={t('app.theme.categoriesLabel', 'Theme categories')}
        selectedId={category}
        defaultExpandedIds={['color']}
        onSelect={onSelectCategory}
        items={[
          { id: 'details', label: t('app.theme.categoryDetails', 'Details'), icon: 'info' },
          {
            id: 'color',
            label: t('app.theme.categoryColor', 'Color'),
            icon: 'palette',
            children: RAMP_NAMES.map((r) => ({ id: `color:${r}`, label: RAMP_LABELS[r] })),
          },
          { id: 'semantic', label: t('app.theme.categorySemantic', 'Semantic'), icon: 'contrast' },
          {
            id: 'typography',
            label: t('app.theme.categoryTypography', 'Typography'),
            icon: 'title',
            children: [
              { id: 'typography:display', label: t('app.theme.typographyDisplay', 'Display') },
              { id: 'typography:heading', label: t('app.theme.typographyHeading', 'Heading') },
              { id: 'typography:body', label: t('app.theme.typographyBody', 'Body') },
            ],
          },
          { id: 'shape', label: t('app.theme.categoryShape', 'Shape'), icon: 'rounded_corner' },
          { id: 'icons', label: t('app.theme.categoryIcons', 'Icons'), icon: 'interests' },
          { id: 'code', label: t('app.theme.categoryCode', 'JSON'), icon: 'code' },
        ]}
      />
    </SideNav>
  )
}
