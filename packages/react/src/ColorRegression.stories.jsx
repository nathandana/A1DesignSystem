import {
  Banner,
  Button,
  Card,
  Grid,
  Heading,
  Inverse,
  MessageBadge,
  Paragraph,
  Stack,
  TextField,
} from "./index.js";

const meta = {
  title: "Foundations/Color regression",
  parameters: {
    layout: "fullscreen",
    controls: { disable: true },
  },
};

export default meta;

function ReferenceFixture() {
  return (
    <main
      data-color-contract="root"
      style={{
        minBlockSize: "100vh",
        padding: "var(--base-spacing-32)",
        background: "var(--semantic-color-surface-page)",
        color: "var(--semantic-color-text-default)",
      }}
    >
      <Stack gap="md">
        <Stack gap="xs">
          <Heading as="h1" size="lg">Color token reference</Heading>
          <Paragraph color="muted">
            Semantic surfaces, text, actions, statuses, fields, and inverse boundaries.
          </Paragraph>
        </Stack>

        <Grid columns={3} gap="md">
          <Card>
            <Stack gap="sm">
              <Heading as="h2" size="sm">Surfaces and text</Heading>
              <div style={{
                padding: "var(--base-spacing-16)",
                background: "var(--semantic-color-surface-panel)",
                border: "var(--component-card-border-width) solid var(--semantic-color-border-subtle)",
                borderRadius: "var(--base-radius-sm)",
              }}>
                <Paragraph>Default text on the panel surface.</Paragraph>
                <Paragraph size="sm" color="muted">Muted supporting text.</Paragraph>
                <Paragraph size="sm" color="accent">Accent text reference.</Paragraph>
              </div>
              <div style={{
                padding: "var(--base-spacing-16)",
                background: "var(--semantic-color-surface-raised)",
                borderRadius: "var(--base-radius-sm)",
              }}>
                <Paragraph size="sm">Raised surface</Paragraph>
              </div>
            </Stack>
          </Card>

          <Card>
            <Stack gap="sm">
              <Heading as="h2" size="sm">Controls and status</Heading>
              <TextField
                label="Reference field"
                size="compact"
                defaultValue="Token value"
                hint="Hover, active, and read-only colors share this contract."
              />
              <Stack direction="row" gap="xs" wrap>
                <Button size="sm" data-color-contract="primary-button">Primary</Button>
                <Button size="sm" variant="secondary">Secondary</Button>
                <Button size="sm" variant="tertiary">Tertiary</Button>
              </Stack>
              <Stack direction="row" gap="xs" wrap>
                <MessageBadge status="info" subtle size="sm">Info</MessageBadge>
                <MessageBadge status="success" subtle size="sm">Success</MessageBadge>
                <MessageBadge status="warn" subtle size="sm">Warning</MessageBadge>
                <MessageBadge status="error" subtle size="sm">Error</MessageBadge>
              </Stack>
              <Banner status="info" inline title="Information">
                Semantic status surface and foreground.
              </Banner>
            </Stack>
          </Card>

          <Card>
            <Inverse data-color-contract="inverse" style={{ padding: "var(--base-spacing-24)" }}>
              <Stack gap="sm">
                <Heading as="h2" size="sm">Inverse boundary</Heading>
                <Paragraph size="sm" color="muted">
                  The first boundary flips relative to the document mode.
                </Paragraph>
                <Stack direction="row" gap="xs" wrap>
                  <Button size="sm">Primary</Button>
                  <Button size="sm" variant="secondary">Secondary</Button>
                </Stack>
                <Inverse data-color-contract="nested-inverse" style={{
                  padding: "var(--base-spacing-16)",
                  borderRadius: "var(--base-radius-sm)",
                }}>
                  <Stack gap="xs">
                    <Heading as="h3" size="xs">Nested inverse</Heading>
                    <Paragraph size="xs" color="muted">
                      Nested boundaries remain opposite the document mode.
                    </Paragraph>
                  </Stack>
                </Inverse>
              </Stack>
            </Inverse>
          </Card>
        </Grid>
      </Stack>
    </main>
  );
}

const light = (theme) => ({
  globals: { theme, colorScheme: "light" },
  render: () => <ReferenceFixture />,
});

const dark = (theme) => ({
  globals: { theme, colorScheme: "dark" },
  render: () => <ReferenceFixture />,
});

export const A1Light = light("a1Light");
export const A1Dark = dark("a1Light");
export const AccessibleLight = light("a1Accessible");
export const AccessibleDark = dark("a1Accessible");
export const ApertureLight = light("a1Aperture");
export const ApertureDark = dark("a1Aperture");
export const CatLympicsLight = light("a1CatLympics");
export const CatLympicsDark = dark("a1CatLympics");
export const CrochetLight = light("a1Crochet");
export const CrochetDark = dark("a1Crochet");
export const FreshLight = light("a1Fresh");
export const FreshDark = dark("a1Fresh");
export const HeritageLight = light("a1Heritage");
export const HeritageDark = dark("a1Heritage");
export const MarshmallowLight = light("a1Marshmallow");
export const MarshmallowDark = dark("a1Marshmallow");
