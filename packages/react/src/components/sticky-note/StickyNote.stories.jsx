import { useState } from "react";
import { StickyNote } from "./StickyNote.jsx";
import { Card } from "../card/Card.jsx";
import { Grid } from "../grid/Grid.jsx";
import { Heading } from "../heading/Heading.jsx";
import { Paragraph } from "../paragraph/Paragraph.jsx";
import { Section } from "../section/Section.jsx";
import { Stack } from "../stack/Stack.jsx";

const COLORS = ["yellow", "orange", "green", "blue", "pink", "purple", "grey"];
const SIZES = ["auto", "xs", "sm", "md", "lg", "xl"];

const meta = {
  title: "Components/Feedback/Sticky Note",
  component: StickyNote,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    title: "Check the hero copy",
    author: "Priya",
    color: "yellow",
    width: "md",
    height: "auto",
    resizable: false,
    placement: "inline",
    titleAs: "h3",
    children: "The headline still says “Spring sale”. Swap it for the autumn campaign before Friday's review.",
  },
  argTypes: {
    color: { control: "select", options: COLORS },
    width: { control: "inline-radio", options: SIZES },
    height: { control: "inline-radio", options: SIZES },
    resizable: { control: "boolean" },
    placement: { control: "inline-radio", options: ["inline", "floating"] },
    anchor: {
      control: "inline-radio",
      options: ["top-start", "top-end", "bottom-start", "bottom-end"],
    },
    titleAs: { control: "select", options: ["h2", "h3", "h4", "h5", "h6", "p"] },
    movable: { control: "boolean" },
    markdown: { control: "boolean" },
    editing: { control: "boolean" },
  },
};

export default meta;

export const Default = {};

export const Colors = {
  render: (args) => (
    <Grid columns={{ xs: 1, md: 3, lg: 4 }} gap="lg">
      {COLORS.map((color) => (
        <StickyNote key={color} {...args} color={color} width="auto" title={`${color.charAt(0).toUpperCase()}${color.slice(1)} note`}>
          Paper colours come from the theme's ramps, and text meets WCAG AA on every one.
        </StickyNote>
      ))}
    </Grid>
  ),
};

export const Widths = {
  render: (args) => (
    <Stack direction="column" gap="lg">
      {SIZES.map((width) => (
        <StickyNote key={width} {...args} width={width} title={`Width: ${width}`}>
          A short reminder.
        </StickyNote>
      ))}
    </Stack>
  ),
};

export const FixedHeight = {
  args: {
    title: "Launch checklist",
    height: "xs",
    children: (
      <Stack direction="column" gap="xs">
        <Paragraph size="sm">Confirm the press release embargo time with comms.</Paragraph>
        <Paragraph size="sm">Ask support for the updated help centre links.</Paragraph>
        <Paragraph size="sm">Schedule the newsletter for 9am in each region.</Paragraph>
        <Paragraph size="sm">Check the pricing page in every supported locale.</Paragraph>
      </Stack>
    ),
  },
};

export const Resizable = {
  args: {
    title: "Drag the corner",
    resizable: true,
    height: "xs",
    children: "Resizable notes behave like a textarea: drag the bottom corner to change the height. Content scrolls when it doesn't fit, and the note is focusable so it can be scrolled from the keyboard.",
  },
};

export const WithoutTitle = {
  args: {
    title: undefined,
    author: "Sam",
    color: "green",
    children: "Untitled notes are named “Sticky note” for assistive technology.",
  },
};

export const ContentOnly = {
  args: {
    title: undefined,
    author: undefined,
    color: "blue",
    width: "sm",
    children: "Bring the updated wireframes.",
  },
};

export const FloatingOverContent = {
  args: {
    placement: "floating",
    anchor: "top-end",
    width: "sm",
    color: "pink",
    title: "Needs a decision",
    author: "Jordan",
    children: "Do we keep the annual plan toggle?",
  },
  render: (args) => (
    // A floating note positions in its nearest positioned ancestor. The
    // story's own wrapper supplies that context.
    <div style={{ position: "relative" }}>
      <Card>
        <Stack direction="column" gap="sm">
          <Heading as="h2" size="md">Pricing</Heading>
          <Paragraph>
            Choose the plan that fits your team. Every plan includes unlimited projects,
            version history and the A1 component library.
          </Paragraph>
          <Paragraph>
            Annual billing saves two months compared with paying monthly. You can change
            plans at any time from your workspace settings.
          </Paragraph>
          <Paragraph>
            Need something custom? Talk to our team about enterprise options.
          </Paragraph>
        </Stack>
      </Card>
      <StickyNote {...args} />
    </div>
  ),
};

export const Markdown = {
  args: {
    title: "Launch notes",
    author: "Sam",
    color: "green",
    width: "lg",
    children: [
      "Ship the **pricing page** before *Friday*. ~~Monday~~ is too early.",
      "",
      "- Update the [release notes](https://a1design.app)",
      "- Check `--semantic-color-text-default` in every theme",
      "- Ask support about the FAQ",
      "",
      "1. Draft",
      "2. Review",
      "",
      "Unsafe links stay as text: [click me](javascript:alert(1)). Literal 5 * 3 and snake_case stay as written.",
    ].join("\n"),
  },
};

// Editing in place: the title and Markdown content become text fields. Leaving
// the note (or Escape) ends editing; double-click the note to edit it again.
export const Editable = {
  render: function EditableStory(args) {
    const [title, setTitle] = useState("Check the hero copy");
    const [content, setContent] = useState("Swap the headline for the **autumn campaign**.");
    const [editing, setEditing] = useState(true);
    return (
      <Stack direction="column" gap="md">
        <StickyNote
          {...args}
          title={title}
          editing={editing}
          onTitleChange={setTitle}
          onContentChange={setContent}
          onEditingChange={setEditing}
          onDoubleClick={() => setEditing(true)}
        >
          {content}
        </StickyNote>
        <Paragraph size="sm" color="muted">{editing ? "Editing — click outside or press Escape to finish." : "Double-click the note to edit it."}</Paragraph>
      </Stack>
    );
  },
};

export const MarkdownOff = {
  args: {
    title: "Literal text",
    markdown: false,
    children: "With markdown off, **these asterisks** show as typed.",
  },
};

export const Movable = {
  args: {
    ...FloatingOverContent.args,
    movable: true,
    color: "orange",
    title: "Drag me",
    author: "Alex",
    children: "Use the handle to drag this note, or focus it and use the arrow keys.",
  },
  render: FloatingOverContent.render,
};

export const InverseAndDark = {
  render: (args) => (
    <Section inverse padding="md">
      <Stack direction="column" gap="lg">
        <Paragraph>Notes keep light paper and dark text in inverse and dark contexts.</Paragraph>
        <StickyNote {...args} />
        <StickyNote {...args} color="purple" title="Second note" />
      </Stack>
    </Section>
  ),
};
