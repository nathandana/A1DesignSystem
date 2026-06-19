import { BottomSheet } from "./BottomSheet.jsx";
import { Heading } from "../heading/Heading.jsx";
import { Paragraph } from "../paragraph/Paragraph.jsx";
import { Stack } from "../stack/Stack.jsx";

const meta = {
  title: "Components/Overlay/BottomSheet",
  component: BottomSheet,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Fixed bottom panel with no scrim — drag the handle to resize between detents (collapsed → expanded). Only renders at xs and sm breakpoints; preview in a narrow viewport.",
      },
    },
  },
  argTypes: {
    title: { control: "text" },
    detents: { control: "object" },
    defaultDetent: { control: "number" },
  },
};

export default meta;

const PageContent = () => (
  <Stack gap="md" style={{ padding: "var(--base-spacing-16)" }}>
    <Heading as="h1" size="lg">Page content</Heading>
    {Array.from({ length: 20 }).map((_, i) => (
      <Paragraph key={i} color="muted">
        Row {i + 1} — scroll the page; the bottom sheet stays fixed and the page
        can scroll clear of its collapsed footprint.
      </Paragraph>
    ))}
  </Stack>
);

export const Default = {
  args: { title: "Filters", detents: [0.5, 0.92], defaultDetent: 1 },
  render: (args) => (
    <div style={{ minHeight: "100vh" }}>
      <PageContent />
      <BottomSheet {...args}>
        <Stack gap="md">
          {Array.from({ length: 15 }).map((_, i) => (
            <Paragraph key={i}>Sheet content line {i + 1} — this area scrolls.</Paragraph>
          ))}
        </Stack>
      </BottomSheet>
    </div>
  ),
};

export const Collapsed = {
  name: "Starts collapsed",
  args: { title: "Now playing — long title that truncates to one line", detents: [0.6], defaultDetent: 0 },
  render: (args) => (
    <div style={{ minHeight: "100vh" }}>
      <PageContent />
      <BottomSheet {...args}>
        <Stack gap="md">
          {Array.from({ length: 10 }).map((_, i) => (
            <Paragraph key={i}>Detail {i + 1}</Paragraph>
          ))}
        </Stack>
      </BottomSheet>
    </div>
  ),
};
