import {
  Accordion,
  Button,
  Card,
  Code,
  Grid,
  GridItem,
  Heading,
  Paragraph,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { useT } from '../../../labels/useT.js'
import { Choice, ResponsiveControl, responsiveProp } from './configKit.jsx'
import { Controls as GridControls } from './grid.jsx'

export const bareDisplay = true

const SPAN_OPTIONS = [...Array.from({ length: 12 }, (_, index) => index + 1), 'full']
const ITEM_SURFACES = ['accent', 'info', 'success', 'warn', 'error']

function uid() {
  return `grid-item-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

function escapeJsxText(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function propString(name, value, defaultValue) {
  if (value === undefined || value === null || value === defaultValue || value === '') return null
  if (typeof value === 'number') return `${name}={${value}}`
  return `${name}="${String(value).replaceAll('"', '&quot;')}"`
}

function buildGridItemSnippet(config, utilityClass = '') {
  const gridProps = [
    responsiveProp('columns', config.columns, 2),
    propString('gap', config.gap, 'md'),
    propString('layout', config.layout, 'default'),
    propString('alignItems', config.alignItems, 'stretch'),
  ].filter(Boolean).join('\n  ')

  const itemLines = config.items.map((item, index) => {
    const itemProps = [
      index === 0 && utilityClass
        ? `className="${utilityClass.replaceAll('"', '&quot;')}"`
        : null,
      responsiveProp('span', item.span, 1),
    ].filter(Boolean).join('\n    ')

    return `  <GridItem${itemProps ? `\n    ${itemProps}\n  ` : ''}>
    <Card>${escapeJsxText(item.content || `Grid item ${index + 1}`)}</Card>
  </GridItem>`
  }).join('\n')

  return `<Grid${gridProps ? `\n  ${gridProps}\n` : ''}>
${itemLines}
</Grid>`
}

export function getDefaultConfig() {
  return {
    columns: { xs: 1, md: 12 },
    gap: 'md',
    layout: 'default',
    alignItems: 'stretch',
    items: [
      { id: 'grid-item-1', content: 'Primary content', span: { xs: 'full', md: 8 } },
      { id: 'grid-item-2', content: 'Related content', span: { xs: 'full', md: 4 } },
    ],
  }
}

export function Preview({ config, utilityClass = '' }) {
  return (
    <Grid
      columns={config.columns}
      gap={config.gap}
      layout={config.layout}
      alignItems={config.alignItems}
    >
      {config.items.map((item, index) => (
        <GridItem
          key={item.id}
          className={index === 0 && utilityClass ? utilityClass : undefined}
          span={item.span}
        >
          <Card surface={ITEM_SURFACES[index % ITEM_SURFACES.length]}>
            <Stack direction="column" gap="xs">
              <Heading as="h3" size="sm">Grid item {index + 1}</Heading>
              <Paragraph size="sm">{item.content || `Grid item ${index + 1}`}</Paragraph>
            </Stack>
          </Card>
        </GridItem>
      ))}
    </Grid>
  )
}

function spanSummary(span) {
  if (span && typeof span === 'object') {
    return Object.entries(span).map(([breakpoint, value]) => `${breakpoint}: ${value}`).join(', ')
  }
  return span === 'full' ? 'Full width' : `${span || 1} columns`
}

function ItemControls({ index, item, onChange, onRemove, canRemove }) {
  const t = useT()
  return (
    <Accordion
      label={`${t('app.configurator.gridItemLabel', 'Grid item')} ${index + 1}`}
      subtext={spanSummary(item.span)}
      size="sm"
      divider
      defaultOpen={index === 0}
    >
      <Stack direction="column" gap="md">
        <TextField
          label={t('app.configurator.gridItemContent', 'Content')}
          size="compact"
          value={item.content}
          onChange={(event) => onChange({ content: event.target.value })}
        />
        <ResponsiveControl
          prop="span"
          label={t('app.configurator.gridItemColumnSpan', 'Column span')}
          helper={t(
            'app.configurator.gridItemColumnSpanHelp',
            'Choose how many grid columns this item spans at each breakpoint.',
          )}
          value={item.span}
          onChange={(span) => onChange({ span })}
          defaultValue={1}
        >
          {(value, onChange) => (
            <Choice
              value={value}
              onChange={onChange}
              options={SPAN_OPTIONS.map((option) => ({
                value: option,
                label: option === 'full'
                  ? t('app.configurator.gridItemFullSpan', 'Full width')
                  : String(option),
              }))}
            />
          )}
        </ResponsiveControl>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          icon="delete"
          disabled={!canRemove}
          onClick={onRemove}
        >
          {t('app.configurator.gridItemRemove', 'Remove grid item')}
        </Button>
      </Stack>
    </Accordion>
  )
}

export function Controls({ config, setConfig }) {
  const t = useT()
  function updateItem(id, patch) {
    setConfig((current) => ({
      ...current,
      items: current.items.map((item) => item.id === id ? { ...item, ...patch } : item),
    }))
  }

  function addItem() {
    setConfig((current) => ({
      ...current,
      items: [
        ...current.items,
        { id: uid(), content: `Grid item ${current.items.length + 1}`, span: 1 },
      ],
    }))
  }

  function removeItem(id) {
    setConfig((current) => ({
      ...current,
      items: current.items.filter((item) => item.id !== id),
    }))
  }

  return (
    <Stack direction="column" gap="lg">
      <Accordion label="Grid" size="sm" divider defaultOpen>
        <GridControls config={config} setConfig={setConfig} />
      </Accordion>

      <Stack direction="column" gap="sm">
        <Heading as="h3" size="xs">{t('app.configurator.gridItems', 'Grid items')}</Heading>
        {config.items.map((item, index) => (
          <ItemControls
            key={item.id}
            index={index}
            item={item}
            onChange={(patch) => updateItem(item.id, patch)}
            onRemove={() => removeItem(item.id)}
            canRemove={config.items.length > 1}
          />
        ))}
        <Button type="button" variant="secondary" size="sm" icon="add" onClick={addItem}>
          {t('app.configurator.gridItemAdd', 'Add grid item')}
        </Button>
      </Stack>
    </Stack>
  )
}

export function Snippet({ config, utilityClass = '' }) {
  return <Code variant="block" wrapping copyCode>{buildGridItemSnippet(config, utilityClass)}</Code>
}
