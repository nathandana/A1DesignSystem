import { Stat } from "./Stat.jsx";
import { Card } from "../card/Card.jsx";
import { Grid } from "../grid/Grid.jsx";
import { Stack } from "../stack/Stack.jsx";

const meta = {
  title: "Components/Data/Stat",
  component: Stat,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    title: "Active projects",
    value: 1284,
    description: "Across all workspaces",
    format: "number",
    size: "md",
    align: "start",
  },
  argTypes: {
    badgeStatus: {
      control: "inline-radio",
      options: ["neutral", "info", "success", "warn", "error"],
    },
    badgeSize: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
    },
    format: {
      control: "inline-radio",
      options: ["none", "number", "percent"],
    },
    size: {
      control: "inline-radio",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    align: {
      control: "inline-radio",
      options: ["start", "center", "end"],
    },
    precision: { control: { type: "number", min: 0, max: 4 } },
    groupSeparator: { control: "text" },
    decimalSeparator: { control: "text" },
  },
};

export default meta;

export const Default = {};

export const WithAffixes = {
  args: {
    title: "Conversion rate",
    value: 7.42,
    prefix: "",
    suffix: "%",
    precision: 2,
    description: "Last 30 days",
    badge: "Healthy",
    badgeStatus: "success",
  },
};

export const InCards = {
  render: () => (
    <Grid columns={{ xs: 1, md: 3 }} gap="md">
      <Card>
        <Stat title="Revenue" value={84200} prefix="$" description="Month to date" badge="On track" badgeStatus="success" />
      </Card>
      <Card>
        <Stat title="Open issues" value={37} description="Needs triage" badge="Review" badgeStatus="warn" />
      </Card>
      <Card>
        <Stat title="Deploys" value={18} description="This week" badge="Stable" badgeStatus="info" />
      </Card>
    </Grid>
  ),
};

export const Sizes = {
  render: () => (
    <Stack direction="row" gap="lg" align="end">
      <Stat title="Extra small" value={248} size="xs" />
      <Stat title="Small" value={248} size="sm" />
      <Stat title="Medium" value={248} size="md" />
      <Stat title="Large" value={248} size="lg" />
      <Stat title="Extra large" value={248} size="xl" />
    </Stack>
  ),
};

export const Percent = {
  args: {
    title: "Completion",
    value: 87.5,
    format: "percent",
    precision: 1,
    description: "Project delivery target",
    badge: "On pace",
    badgeStatus: "success",
  },
};

export const NumericFormatting = {
  args: {
    title: "Average response",
    value: 12492.783,
    suffix: " ms",
    precision: 1,
    description: "Formatted with Intl.NumberFormat",
  },
};
