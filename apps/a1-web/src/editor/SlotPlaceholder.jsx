import { Icon, Paragraph, Section, Stack } from '@gtivr4/a1-design-system-react'

/**
 * The dashed outline that marks an editable area: the editor's empty blank
 * area or pattern zone, and a pattern's areas in the pattern configurator. One
 * look, so people recognise the same area in both places. It stays quiet — a
 * hairline neutral dash and compact spacing — so it reads as a place to drop
 * something, not as content.
 */
export function SlotPlaceholder({ label, hint, countHint, padding = 'xs', className = '', ...rest }) {
  return (
    <Section
      className={['a1-web-slot', 'a1-web-slot--empty', className].filter(Boolean).join(' ')}
      as="div"
      borderSize="xs"
      borderStyle="dashed"
      borderVariant="strong"
      radius="md"
      padding={padding}
      gap="xs"
      align="center"
      {...rest}
    >
      <Stack direction="row" gap="xs" align="center" justify="center">
        <Icon name="add_circle" size="sm" color="muted" aria-hidden="true" />
        <Paragraph size="sm" color="muted">{label || 'Blank area'}</Paragraph>
      </Stack>
      {hint && <Paragraph size="xs" color="muted">{hint}</Paragraph>}
      {countHint && <Paragraph size="xs" color="muted">{countHint}</Paragraph>}
    </Section>
  )
}
