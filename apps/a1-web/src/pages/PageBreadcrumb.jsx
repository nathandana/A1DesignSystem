import { Divider, Link, Paragraph, Stack } from '@gtivr4/a1-design-system-react'

export function PageBreadcrumb({ items }) {
  return (
    <Stack direction="row" gap="xs" align="center">
      {items.flatMap((item, index) => [
        item.href ? (
          <Link key={`breadcrumb-${index}`} href={item.href} iconPosition="start">
            {item.label}
          </Link>
        ) : (
          <Paragraph key={`breadcrumb-${index}`}>{item.label}</Paragraph>
        ),
        index < items.length - 1 ? (
          <Divider
            key={`breadcrumb-divider-${index}`}
            decorative
            orientation="vertical"
            size="xs"
            space="sm"
            variant="strong"
          />
        ) : null,
      ])}
    </Stack>
  )
}
