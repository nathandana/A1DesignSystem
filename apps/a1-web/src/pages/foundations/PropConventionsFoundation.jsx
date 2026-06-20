import {
  Breadcrumb,
  DataTable,
  Heading,
  MessageBadge,
  Paragraph,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'

function Code({ children }) {
  return <code className="a1-web-token-code">{children}</code>
}

// ── Convention tables ─────────────────────────────────────────────────────────

const conventionColumns = [
  { key: 'prop', label: 'Prop name', width: '160px' },
  { key: 'values', label: 'Accepted values' },
  { key: 'components', label: 'Components' },
]

const SIZE_ROWS = [
  {
    id: 'size-sm-lg',
    prop: <Code>size</Code>,
    values: <><Code>"sm"</Code> · <Code>"md"</Code> · <Code>"lg"</Code></>,
    components: 'Accordion, Button, ButtonContainer, MessageBadge, Pagination, StatusBar',
  },
  {
    id: 'size-field',
    prop: <Code>size</Code>,
    values: <><Code>"compact"</Code> · <Code>"default"</Code> · <Code>"comfortable"</Code></>,
    components: 'CheckboxGroup, ChoiceGroup, DataTable, Fieldset, RadioGroup, Switch, TextField, SelectField, TextareaField, TokenSelect',
  },
  {
    id: 'size-xs-xl',
    prop: <Code>size</Code>,
    values: <><Code>"xs"</Code> · <Code>"sm"</Code> · <Code>"md"</Code> · <Code>"lg"</Code> · <Code>"xl"</Code></>,
    components: 'Divider, Figure, Link, List, Paragraph, Spacer',
  },
]

const STATUS_ROWS = [
  {
    id: 'status',
    prop: <Code>status</Code>,
    values: <><Code>"neutral"</Code> · <Code>"info"</Code> · <Code>"success"</Code> · <Code>"warn"</Code> · <Code>"error"</Code></>,
    components: 'Banner, MessageBadge, Notification, Snackbar, StatusBar',
  },
]

const VARIANT_ROWS = [
  {
    id: 'variant-button',
    prop: <Code>variant</Code>,
    values: <><Code>"primary"</Code> · <Code>"secondary"</Code> · <Code>"tertiary"</Code> · <Code>"destructive"</Code> · <Code>"success"</Code></>,
    components: 'Button (all five), IconButton (secondary · tertiary · destructive · success)',
  },
]

const ALIGN_ROWS = [
  {
    id: 'align-logical',
    prop: <Code>align</Code>,
    values: <><Code>"start"</Code> · <Code>"center"</Code> · <Code>"end"</Code> · <Code>"stretch"</Code> · <Code>"baseline"</Code></>,
    components: 'Cluster, Stack — cross-axis alignment (logical, RTL-safe)',
  },
  {
    id: 'justify',
    prop: <Code>justify</Code>,
    values: <><Code>"start"</Code> · <Code>"center"</Code> · <Code>"end"</Code> · <Code>"between"</Code> · <Code>"around"</Code> · <Code>"evenly"</Code></>,
    components: 'Cluster, Stack — main-axis distribution',
  },
  {
    id: 'align-text',
    prop: <Code>align</Code>,
    values: <><Code>"left"</Code> · <Code>"center"</Code> · <Code>"right"</Code> · <Code>"start"</Code> · <Code>"end"</Code></>,
    components: 'Heading, Paragraph — text alignment. Directional ("left"/"right") and logical ("start"/"end") both accepted.',
  },
  {
    id: 'align-section',
    prop: <Code>align</Code>,
    values: <><Code>"left"</Code> · <Code>"center"</Code> · <Code>"right"</Code></>,
    components: 'Section — child layout alignment',
  },
]

const PLACEMENT_ROWS = [
  {
    id: 'placement-logical',
    prop: <Code>placement</Code>,
    values: <><Code>"start"</Code> · <Code>"end"</Code></>,
    components: 'PageLayout (sidebarPlacement, asidePlacement), SideNav',
  },
  {
    id: 'icon-position',
    prop: <Code>iconPosition</Code>,
    values: <><Code>"start"</Code> · <Code>"end"</Code></>,
    components: 'Button, Link',
  },
  {
    id: 'label-position',
    prop: <Code>labelPosition</Code>,
    values: <><Code>"above"</Code> · <Code>"before"</Code></>,
    components: 'TextField, SelectField, TextareaField, Fieldset — form inputs',
  },
  {
    id: 'label-position-switch',
    prop: <Code>labelPosition</Code>,
    values: <><Code>"start"</Code> · <Code>"end"</Code></>,
    components: 'Switch',
  },
]

const SPACING_ROWS = [
  {
    id: 'gap-semantic',
    prop: <Code>gap</Code>,
    values: <><Code>"xs"</Code> · <Code>"sm"</Code> · <Code>"md"</Code> · <Code>"lg"</Code></>,
    components: 'Section, Stack (also accepts numeric). Grid extends with "xl" and "xxl".',
  },
  {
    id: 'gap-numeric',
    prop: <Code>gap</Code>,
    values: <Code>1 · 2 · 4 · 6 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 64 · 96 · 128</Code>,
    components: 'Bleed, Cluster, Inset, Stack (numeric spacing token values)',
  },
]

const CONTROLLED_ROWS = [
  {
    id: 'controlled',
    prop: <><Code>value</Code> + <Code>defaultValue</Code> + <Code>onChange</Code></>,
    values: 'Pass value + onChange for controlled mode. Pass defaultValue only for uncontrolled. Omit both for fully uncontrolled.',
    components: 'CheckboxGroup, ChoiceGroup, DataTable (sort, filter, search, selection), RadioGroup, SegmentedControl, Tabs',
  },
  {
    id: 'open',
    prop: <><Code>open</Code> + <Code>defaultOpen</Code> + <Code>onChange</Code></>,
    values: 'Same pattern applied to open/close state.',
    components: 'Accordion, Dialog, Menu, SideNav, SideNavGroup',
  },
]

const RESPONSIVE_ROWS = [
  {
    id: 'responsive',
    prop: 'Responsive prop',
    values: <Code>{'Partial<Record<"xs"|"sm"|"md"|"lg"|"xl", T>>'}</Code>,
    components: 'ChoiceGroup (columns), Divider (orientation), Grid (columns), GridItem (span, rowSpan), Heading (size), List (size), Paragraph (size), Section (align, padding), Stack (direction, justify)',
  },
]

const FORM_ROWS = [
  {
    id: 'form-messages',
    prop: <><Code>hint</Code> · <Code>error</Code> · <Code>success</Code></>,
    values: 'String messages below the input. error takes priority over success; both suppress hint.',
    components: 'CheckboxGroup, ChoiceGroup, RadioGroup, Switch, TextField, SelectField, TextareaField',
  },
  {
    id: 'required',
    prop: <Code>required</Code>,
    values: <Code>boolean</Code>,
    components: 'CheckboxGroup, ChoiceGroup, Fieldset, RadioGroup, TextField, SelectField, TextareaField',
  },
  {
    id: 'disabled',
    prop: <Code>disabled</Code>,
    values: <Code>boolean</Code>,
    components: 'All interactive components that can be unavailable',
  },
]

const POLY_ROWS = [
  {
    id: 'as',
    prop: <Code>as</Code>,
    values: 'Any valid React element type or HTML tag string',
    components: 'Bleed, Card, Cluster, Heading, Inset, Inverse, List, Paragraph, Section, Stack',
  },
]

// ── Inconsistency table ───────────────────────────────────────────────────────

const issueColumns = [
  { key: 'area', label: 'Area', width: '160px' },
  { key: 'issue', label: 'Inconsistency' },
  { key: 'status', label: '', width: '120px' },
]

const ISSUE_ROWS = [
  {
    id: 'align-direction',
    area: 'align values',
    issue: 'Stack, Cluster, and Figure use align="start"|"end" (logical, RTL-safe). Heading and Paragraph now support both directional ("left"|"right") and logical ("start"|"end") aliases. Consider deprecating directional values in a future major version.',
    status: <MessageBadge status="neutral">By design</MessageBadge>,
  },
  {
    id: 'tab-icon-position',
    area: 'Tab.iconPosition',
    issue: 'Tab accepts iconPosition="above" in addition to the standard "start"|"end". No other component supports "above" as an icon position.',
    status: <MessageBadge status="neutral">Intentional extension</MessageBadge>,
  },
  {
    id: 'gap-scale',
    area: 'gap semantic scale',
    issue: 'Stack supports "xs"–"lg". Grid supports "xs"–"xxl". Section supports "xs"–"lg" (no "xl"/"xxl"). The Grid scale extends beyond the others — consider whether "xl" and "xxl" should be available on Section and Stack.',
    status: <MessageBadge status="neutral">Audit needed</MessageBadge>,
  },
]

// ── Page ──────────────────────────────────────────────────────────────────────

export function PropConventionsFoundationPage({ onNavigate }) {
  return (
    <>
      <Section
        padding="xs"
        contentWidth="xl"
        surface="panel"
        borderSize="sm"
        borderVariant="accent"
        borderSides="bottom"
      >
        <Stack direction="column" gap="xs">
          <Breadcrumb
            items={[
              { href: '/', label: 'Home', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
              { href: '?page=foundations', label: 'Foundations', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('foundations') } },
              { label: 'Prop conventions' },
            ]}
          />
          <Heading as="h1" id="prop-conventions-heading" size={{ xs: 'lg', md: 'xxl' }}>
            Prop conventions
          </Heading>
          <Paragraph size="sm" color="muted">
            Shared prop names and value sets used consistently across A1 components. When building or extending a component, use these contracts — do not introduce synonyms or alternative scales.
          </Paragraph>
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="xl" gap="lg" aria-labelledby="size-heading">
        <Stack gap="lg">
          <Stack gap="xs">
            <Heading as="h2" id="size-heading" size="md">Size</Heading>
            <Paragraph size="sm" color="muted">
              Three overlapping scales depending on component family. Do not mix them — a field-family component uses compact/default/comfortable, not sm/md/lg.
            </Paragraph>
          </Stack>
          <DataTable columns={conventionColumns} rows={SIZE_ROWS} getRowId={(r) => r.id} size="compact" />
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="xl" gap="lg" aria-labelledby="status-heading">
        <Stack gap="lg">
          <Stack gap="xs">
            <Heading as="h2" id="status-heading" size="md">Status</Heading>
            <Paragraph size="sm" color="muted">
              The five status values are a closed set. Use status, not variant, when the prop controls a contextual state. Note: Tab incorrectly uses "warning" — this is a known inconsistency.
            </Paragraph>
          </Stack>
          <DataTable columns={conventionColumns} rows={STATUS_ROWS} getRowId={(r) => r.id} size="compact" />
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="xl" gap="lg" aria-labelledby="variant-heading">
        <Stack gap="lg">
          <Stack gap="xs">
            <Heading as="h2" id="variant-heading" size="md">Variant</Heading>
            <Paragraph size="sm" color="muted">
              variant controls the primary structural or visual style of a component — not its status. The action-verb scale below is shared by Button and IconButton.
            </Paragraph>
          </Stack>
          <DataTable columns={conventionColumns} rows={VARIANT_ROWS} getRowId={(r) => r.id} size="compact" />
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="xl" gap="lg" aria-labelledby="align-heading">
        <Stack gap="lg">
          <Stack gap="xs">
            <Heading as="h2" id="align-heading" size="md">Alignment and distribution</Heading>
            <Paragraph size="sm" color="muted">
              Layout components use logical values (start/end) for RTL safety. Typography components use directional values (left/right) because text alignment is always directional — this is intentional, not an error.
            </Paragraph>
          </Stack>
          <DataTable columns={conventionColumns} rows={ALIGN_ROWS} getRowId={(r) => r.id} size="compact" />
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="xl" gap="lg" aria-labelledby="placement-heading">
        <Stack gap="lg">
          <Stack gap="xs">
            <Heading as="h2" id="placement-heading" size="md">Placement and position</Heading>
            <Paragraph size="sm" color="muted">
              Use logical values (start/end) for inline-axis positions. Physical positions (top/bottom/left/right) are only used when describing absolute screen coordinates such as toast placement.
            </Paragraph>
          </Stack>
          <DataTable columns={conventionColumns} rows={PLACEMENT_ROWS} getRowId={(r) => r.id} size="compact" />
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="xl" gap="lg" aria-labelledby="spacing-heading">
        <Stack gap="lg">
          <Stack gap="xs">
            <Heading as="h2" id="spacing-heading" size="md">Spacing</Heading>
            <Paragraph size="sm" color="muted">
              Two parallel gap scales: semantic T-shirt names and raw numeric token values. Both map to the same underlying token grid. Use semantic names where a component supports them.
            </Paragraph>
          </Stack>
          <DataTable columns={conventionColumns} rows={SPACING_ROWS} getRowId={(r) => r.id} size="compact" />
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="xl" gap="lg" aria-labelledby="state-heading">
        <Stack gap="lg">
          <Stack gap="xs">
            <Heading as="h2" id="state-heading" size="md">Controlled state</Heading>
            <Paragraph size="sm" color="muted">
              All stateful components use the same controlled/uncontrolled contract. Provide value + onChange for controlled mode; defaultValue only for uncontrolled. Never provide both value and defaultValue.
            </Paragraph>
          </Stack>
          <DataTable columns={conventionColumns} rows={CONTROLLED_ROWS} getRowId={(r) => r.id} size="compact" />
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="xl" gap="lg" aria-labelledby="responsive-heading">
        <Stack gap="lg">
          <Stack gap="xs">
            <Heading as="h2" id="responsive-heading" size="md">Responsive props</Heading>
            <Paragraph size="sm" color="muted">
              Props that accept a breakpoint object follow one pattern. The object keys are the five viewport breakpoints; the values are whatever the scalar type of the prop is. Omitted breakpoints inherit the previous value.
            </Paragraph>
          </Stack>
          <DataTable columns={conventionColumns} rows={RESPONSIVE_ROWS} getRowId={(r) => r.id} size="compact" />
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="xl" gap="lg" aria-labelledby="form-heading">
        <Stack gap="lg">
          <Stack gap="xs">
            <Heading as="h2" id="form-heading" size="md">Form input props</Heading>
            <Paragraph size="sm" color="muted">
              All form input components share this set of structural props. Use them consistently — never invent synonyms such as "errorMessage" or "helpText".
            </Paragraph>
          </Stack>
          <DataTable columns={conventionColumns} rows={FORM_ROWS} getRowId={(r) => r.id} size="compact" />
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="xl" gap="lg" aria-labelledby="polymorphic-heading">
        <Stack gap="lg">
          <Stack gap="xs">
            <Heading as="h2" id="polymorphic-heading" size="md">Polymorphic rendering</Heading>
            <Paragraph size="sm" color="muted">
              Layout and typography components accept an as prop to change the rendered HTML element. This preserves styling while keeping semantics correct.
            </Paragraph>
          </Stack>
          <DataTable columns={conventionColumns} rows={POLY_ROWS} getRowId={(r) => r.id} size="compact" />
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="xl" gap="lg" aria-labelledby="issues-heading">
        <Stack gap="lg">
          <Stack gap="xs">
            <Heading as="h2" id="issues-heading" size="md">Known inconsistencies</Heading>
            <Paragraph size="sm" color="muted">
              The following deviations from the conventions above exist in the current component set. Breaking items must be resolved in the next major version. Items marked "rename needed" or "audit needed" should be tracked and addressed.
            </Paragraph>
          </Stack>
          <DataTable columns={issueColumns} rows={ISSUE_ROWS} getRowId={(r) => r.id} size="comfortable" />
        </Stack>
      </Section>
    </>
  )
}
