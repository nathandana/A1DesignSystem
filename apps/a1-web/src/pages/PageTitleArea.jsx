import {
  Breadcrumb,
  Heading,
  Paragraph,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'

export function PageTitleArea({
  breadcrumbItems,
  title,
  description,
  actions,
  children,
  headingId,
  contentWidth = 'xl',
  titleAccessory,
}) {
  return (
    <Section
      as="header"
      padding="xs"
      contentWidth={contentWidth}
      surface="panel"
      borderSize="sm"
      borderVariant="accent"
      borderSides="bottom"
    >
      <Stack direction="column" gap="xs">
        {breadcrumbItems?.length ? <Breadcrumb items={breadcrumbItems} /> : null}
        {titleAccessory ? (
          <Stack direction="row" gap="sm" align="center" wrap>
            <Heading as="h1" id={headingId} size={{ xs: 'lg', md: 'xxl' }}>
              {title}
            </Heading>
            {titleAccessory}
          </Stack>
        ) : (
          <Heading as="h1" id={headingId} size={{ xs: 'lg', md: 'xxl' }}>
            {title}
          </Heading>
        )}
        {description ? (
          <Paragraph size="sm" color="muted">
            {description}
          </Paragraph>
        ) : null}
        {actions ? (
          <Stack direction="row" gap="xs" align="center" wrap>
            {actions}
          </Stack>
        ) : null}
        {children}
      </Stack>
    </Section>
  )
}
