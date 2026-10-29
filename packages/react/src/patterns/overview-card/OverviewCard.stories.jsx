import { OverviewCard } from "./OverviewCard.jsx";
import { Button } from "../../components/button/Button.jsx";
import { Grid } from "../../components/grid/Grid.jsx";
import { IconButton } from "../../components/icon-button/IconButton.jsx";
import { Paragraph } from "../../components/paragraph/Paragraph.jsx";
import { StatusBar } from "../../components/status-bar/StatusBar.jsx";
import { Section } from "../../components/section/Section.jsx";

const DETAILS = [
  { label: "Plan", value: "Enterprise" },
  { label: "Seats", value: "24 of 50" },
  { label: "Renews", value: "June 30, 2026" },
];

const ACTIONS = [
  { id: "manage", label: "Manage plan" },
  { id: "details", label: "View details", variant: "tertiary", icon: "arrow_forward", iconPosition: "end" },
];

const meta = {
  title: "Patterns/Overview card",
  component: OverviewCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    icon: "account_circle",
    title: "Account overview",
    details: DETAILS,
    actions: ACTIONS,
  },
  argTypes: {
    titleAs: { control: "inline-radio", options: ["h2", "h3", "h4"] },
    status: { control: "inline-radio", options: ["neutral", "info", "success", "warn", "error"] },
  },
};

export default meta;

// The host owns the width; InAGrid demonstrates a constrained parent layout.
export const Default = {};

// Status shows only with its label, so it's never colour-only.
export const WithStatus = {
  args: { status: "info", statusLabel: "In progress" },
};

export const DetailsOnly = {
  args: { actions: undefined, title: "Storage", icon: "cloud", details: [{ label: "Used", value: "38 GB" }, { label: "Limit", value: "100 GB" }] },
};

// Composed actions follow the same rule: a Button with no variant (primary by
// default) becomes a small secondary button; icon buttons are made small.
export const ComposedActions = {
  args: {
    actions: (
      <>
        <Button size="lg">Manage plan</Button>
        <IconButton icon="more_horiz" label="More options" variant="destructive" size="lg" />
      </>
    ),
  },
};

export const ActionKinds = {
  args: {
    actions: [
      { id: "billing", kind: "link", label: "Billing history", href: "#billing", icon: "arrow_forward", iconPosition: "end" },
      { id: "more", kind: "icon-button", label: "More account options", icon: "more_horiz" },
    ],
  },
};

export const TitleOnly = {
  args: { details: [], actions: undefined },
};

// The content area sits between the details and the actions.
export const WithContent = {
  render: (args) => (
    <OverviewCard {...args}>
      <StatusBar label="Seats used" value={24} max={50} size="sm" />
      <Paragraph size="sm" color="muted">Add seats before your team grows past 50.</Paragraph>
    </OverviewCard>
  ),
};

// Cards in a set read the same: the surface, icon block and layout are fixed.
export const InAGrid = {
  parameters: { layout: "fullscreen" },
  render: (args) => (
    <Section padding="sm" contentWidth="xl">
    <Grid columns={{ xs: 1, md: 2, lg: 3 }} gap="md">
      <OverviewCard {...args} />
      <OverviewCard {...args} icon="group" title="Team" details={[{ label: "Members", value: "18" }, { label: "Admins", value: "3" }]} status="success" statusLabel="Active" />
      <OverviewCard {...args} icon="receipt_long" title="Billing" details={[{ label: "Balance", value: "$0.00" }, { label: "Next invoice", value: "July 1, 2026" }]} />
    </Grid>
    </Section>
  ),
};
