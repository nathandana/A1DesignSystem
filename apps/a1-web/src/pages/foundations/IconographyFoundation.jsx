import {
  Breadcrumb,
  DataTable,
  Heading,
  Icon,
  Paragraph,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'
import tokens from '../../../../../build/json/tokens.json'

function TokenCode({ children }) {
  return <code className="a1-web-token-code">{children}</code>
}

const iconSizingColumns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'token', label: 'Token', sortable: true, sortAccessor: (r) => r.tokenText },
  { key: 'value', label: 'Value' },
]

const iconSizingRows = [
  {
    id: 'optical-size',
    name: 'Optical size',
    token: <TokenCode>--base-icon-optical-size</TokenCode>,
    tokenText: '--base-icon-optical-size',
    value: String(tokens.base.icon.opticalSize),
  },
]

const ICON_GROUPS = [
  {
    label: 'Navigation',
    icons: ['arrow_back', 'arrow_forward', 'chevron_left', 'chevron_right', 'home', 'menu', 'more_vert', 'more_horiz', 'close', 'open_in_new'],
  },
  {
    label: 'Actions',
    icons: ['add', 'edit', 'delete', 'save', 'search', 'filter_list', 'download', 'upload', 'share', 'settings'],
  },
  {
    label: 'Status',
    icons: ['check', 'check_circle', 'info', 'warning', 'error', 'cancel', 'help', 'visibility', 'visibility_off', 'lock'],
  },
  {
    label: 'Content',
    icons: ['folder', 'description', 'image', 'code', 'data_object', 'table_chart', 'bar_chart', 'layers', 'widgets', 'token'],
  },
  {
    label: 'Communication',
    icons: ['mail', 'notifications', 'person', 'people', 'star', 'favorite', 'bookmark', 'flag', 'chat', 'forum'],
  },
]

// ── Component ─────────────────────────────────────────────────────────────────

export function IconographyFoundationPage({ onNavigate }) {
  return (
    <>
      <Section
        padding="sm"
        surface="panel"
        gradient="accent"
        gradientPosition="top-right"
        contentWidth="lg"
        gap="lg"
        aria-labelledby="iconography-heading"
      >
        <Stack direction="column" gap="xs">
          <Breadcrumb
            items={[
              { href: '/', label: 'Home' },
              { href: '?page=foundations', label: 'Foundations' },
              { label: 'Iconography' },
            ]}
          />
          <Heading as="h1" id="iconography-heading" type="display" size={{ xs: 'xl', md: 'xxl' }} textWrap="balance">
            Iconography
          </Heading>
          <Paragraph size="sm" color="muted">
            A1 uses Material Symbols Outlined exclusively. Icons are passed by ligature name through the <code className="a1-web-token-code">icon</code> prop or rendered via the <code className="a1-web-token-code">Icon</code> component. No inline SVGs.
          </Paragraph>
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="lg" aria-labelledby="icon-token-heading">
        <Stack gap="xl">

          <Stack gap="lg">
            <Stack direction="column" gap="sm">
              <Heading as="h2" id="icon-token-heading" type="display" size={{ xs: 'lg', md: 'xl' }}>
                Sizing tokens.
              </Heading>
              <Paragraph size="sm" color="muted">
                The optical size token controls the Material Symbols variable font axis for crisp rendering at small sizes.
              </Paragraph>
            </Stack>
            <DataTable
              columns={iconSizingColumns}
              rows={iconSizingRows}
              getRowId={(r) => r.id}
              density="compact"
              scrollable
              caption="Icon sizing tokens"
            />
          </Stack>

          <Stack gap="lg">
            <Stack direction="column" gap="sm">
              <Heading as="h2" type="display" size={{ xs: 'lg', md: 'xl' }}>
                Icon library.
              </Heading>
              <Paragraph size="sm" color="muted">
                A selection of commonly used Material Symbols icons. Pass the icon name as a string to any <code className="a1-web-token-code">icon</code> prop in the system.
              </Paragraph>
            </Stack>

            <Stack gap="xl">
              {ICON_GROUPS.map((group) => (
                <Stack key={group.label} gap="md">
                  <Heading as="h3" size="sm">{group.label}</Heading>
                  <div className="a1-web-icon-grid">
                    {group.icons.map((name) => (
                      <div key={name} className="a1-web-icon-cell">
                        <Icon name={name} />
                        <span className="a1-web-icon-cell__name">{name}</span>
                      </div>
                    ))}
                  </div>
                </Stack>
              ))}
            </Stack>
          </Stack>

        </Stack>
      </Section>
    </>
  )
}
