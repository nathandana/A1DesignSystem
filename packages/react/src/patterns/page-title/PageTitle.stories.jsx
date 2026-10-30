import { PageTitle } from "./PageTitle.jsx";
import { useState } from "react";
import { Button } from "../../components/button/Button.jsx";
import { ButtonContainer } from "../../components/button-container/ButtonContainer.jsx";
import { MessageBadge } from "../../components/message/Message.jsx";
import { Paragraph } from "../../components/paragraph/Paragraph.jsx";
import { SearchField } from "../../components/field/SearchField.jsx";
import { Section } from "../../components/section/Section.jsx";
import { SegmentedControl } from "../../components/segmented-control/SegmentedControl.jsx";
import { SplitButton } from "../../components/split-button/SplitButton.jsx";
import { Stack } from "../../components/stack/Stack.jsx";
import { Toolbar, ToolbarButton } from "../../components/toolbar/Toolbar.jsx";

const BREADCRUMB = [
  { label: "Home", href: "#" },
  { label: "Parent page", href: "#" },
  { label: "Page title" },
];

const ACTIONS = [
  { id: "secondary", label: "Secondary action", variant: "secondary" },
  { id: "primary", label: "Primary action", variant: "primary" },
];

const meta = {
  title: "Patterns/Page title",
  component: PageTitle,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    breadcrumb: BREADCRUMB,
    title: "Page title",
    description: "A short description tells people what this page is for.",
    actions: ACTIONS,
    contentWidth: "xl",
  },
  argTypes: {
    contentWidth: { control: "inline-radio", options: ["xs", "sm", "md", "lg", "xl", "2xl"] },
  },
};

export default meta;

export const Default = {};

// The metadata row always sits directly below the title, as badge data or
// composed badges, however long the title runs.
export const EyebrowAndMetadata = {
  args: {
    eyebrow: "Section",
    meta: [
      { id: "status", label: "Live", status: "success" },
      { id: "owner", label: "Owner: Design systems", status: "neutral", icon: null },
      { id: "updated", label: "Updated today", status: "info" },
    ],
    actions: (
      <>
        <Button variant="secondary">Secondary action</Button>
        <Button variant="primary">Primary action</Button>
      </>
    ),
  },
};

export const ComposedMetadata = {
  args: {
    title: "A longer page title that wraps onto a second line on narrow screens",
    meta: (
      <>
        <MessageBadge status="info" size="sm">In progress</MessageBadge>
        <MessageBadge status="neutral" subtle size="sm">3 comments</MessageBadge>
      </>
    ),
  },
};

export const TitleOnly = {
  args: {
    breadcrumb: undefined,
    description: undefined,
    actions: undefined,
    title: "Settings",
  },
};

// The action rule is enforced by the pattern: the first primary is kept and
// shown last; a second primary becomes secondary.
export const PrimaryAlwaysLast = {
  args: {
    title: "Draft article",
    description: "Declared as primary Publish, secondary Preview, primary Delete — rendered as Preview, Delete (secondary), Publish.",
    actions: [
      { id: "publish", label: "Publish", variant: "primary", icon: "publish" },
      { id: "preview", label: "Preview", variant: "secondary", icon: "visibility" },
      { id: "delete", label: "Delete", variant: "primary", icon: "delete" },
    ],
  },
};

// Actions can be buttons, links or icon buttons; only a button can be primary.
export const ActionKinds = {
  args: {
    title: "Page title",
    actions: [
      { id: "help", kind: "link", label: "Help centre", href: "#", icon: "help" },
      { id: "more", kind: "icon-button", label: "More options", icon: "more_horiz" },
      { id: "preview", label: "Preview", icon: "visibility" },
      { id: "publish", label: "Publish", variant: "primary", icon: "publish" },
    ],
  },
};

function ViewSwitcher() {
  const [view, setView] = useState("board");
  return (
    <SegmentedControl
      aria-label="View"
      value={view}
      onChange={setView}
      options={[
        { value: "board", label: "Board", icon: "view_kanban" },
        { value: "list", label: "List", icon: "list" },
      ]}
    />
  );
}

// Composed action types: a SplitButton (primary by default, so it is shown
// last), a ButtonContainer group that stays together, a Toolbar and a
// SegmentedControl. A primary inside the group would move to the group's end
// and the group would be shown last.
export const ActionTypes = {
  args: {
    title: "Page title",
    actions: (
      <>
        <SplitButton
          icon="add"
          menuLabel="More ways to create"
          toggleLabel="More ways to create"
          actions={[{ id: "import", label: "Import", icon: "upload" }]}
        >
          Create
        </SplitButton>
        <ViewSwitcher />
        <Toolbar aria-label="Page tools">
          <ToolbarButton icon="help" label="Help" showLabel />
          <ToolbarButton icon="download" label="Export" showLabel />
        </Toolbar>
        <ButtonContainer>
          <Button variant="secondary">Archive</Button>
          <Button variant="secondary">Duplicate</Button>
        </ButtonContainer>
      </>
    ),
  },
};

export const WithContentBelow = {
  args: {
    breadcrumb: [{ label: "Home", href: "#" }, { label: "Help" }],
    title: "Help",
    description: "Search guides for the editor, projects, components and themes.",
    actions: undefined,
  },
  render: (args) => (
    <PageTitle {...args}>
      <SearchField label="Search help" size="compact" />
    </PageTitle>
  ),
};

// The band is full-width; the sections after it line up with its content width.
export const OnAPage = {
  render: (args) => (
    <>
      <PageTitle {...args} titleId="page-heading" />
      <Section padding="sm" contentWidth="xl" aria-labelledby="page-heading">
        <Stack direction="column" gap="sm">
          <Paragraph>
            Sections after the title share its content width, so the page reads as one column.
          </Paragraph>
        </Stack>
      </Section>
    </>
  ),
};
