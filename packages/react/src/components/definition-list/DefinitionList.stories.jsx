import { DefinitionList } from "./DefinitionList.jsx";
import { Section } from "../section/Section.jsx";
import { Stack } from "../stack/Stack.jsx";

const accountItems = [
  { label: "Plan", value: "Enterprise" },
  { label: "Account ID", value: "A1-849204", copyValue: true },
  { label: "Renewal", value: "June 30, 2026" },
  { label: "Owner", value: "Nathan Dana" },
];

const meta = {
  title: "Components/Data/Definition List",
  component: DefinitionList,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    items: accountItems,
    direction: "row",
    size: "md",
    labelWidth: "auto",
  },
  argTypes: {
    direction: {
      control: "inline-radio",
      options: ["row", "column"],
      description: "Label/value pair direction.",
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
      description: "Spacing and body text size.",
    },
    labelWidth: {
      control: "inline-radio",
      options: ["auto", "fixed"],
      description: "Row label sizing. Fixed aligns values using a responsive label column.",
    },
    copyValue: {
      control: "boolean",
      description: "Show copy buttons for copyable text values.",
    },
    copyLabel: {
      control: "text",
      description: "Accessible label for copy buttons.",
    },
    copiedLabel: {
      control: "text",
      description: "Accessible label after a copy succeeds.",
    },
    valueHeadingProps: {
      control: false,
      description: "Heading props used to render values with Heading typography.",
    },
    items: { control: false },
  },
};

export default meta;

export const Default = {};

export const Column = {
  args: {
    direction: "column",
    items: [
      { label: "Contact", value: "support@example.com", copyValue: true },
      { label: "Address", value: "100 Main Street, Suite 400, Portland, OR 97205" },
      { label: "Notes", value: "Use column direction when values need more vertical reading room." },
    ],
  },
};

export const RowFixedLabels = {
  name: "Row with fixed labels",
  args: {
    direction: "row",
    labelWidth: "fixed",
    items: [
      { label: "Created by", value: "Design systems team" },
      { label: "Last published", value: "June 9, 2026" },
      { label: "Documentation owner", value: "Platform experience" },
      { label: "Repository", value: "a1-design-system", copyValue: true },
    ],
  },
};

export const HeadingValues = {
  name: "Heading values",
  args: {
    direction: "column",
    size: "sm",
    valueHeadingProps: { as: "p", type: "display", size: "lg", color: "accent" },
    items: [
      { label: "Monthly recurring revenue", value: "$128,400", copyText: "128400", copyValue: true },
      { label: "Active accounts", value: "4,812" },
      { label: "Retention", value: "98.6%" },
    ],
  },
};

export const PerItemHeadingValues = {
  name: "Per-item heading values",
  render: () => (
    <DefinitionList
      direction="row"
      labelWidth="fixed"
      items={[
        {
          label: "Invoice total",
          value: "$8,420.00",
          copyText: "8420.00",
          copyValue: true,
          valueHeadingProps: { as: "p", type: "heading", size: "lg" },
        },
        { label: "Due date", value: "June 30, 2026" },
        { label: "Status", value: "Pending approval" },
      ]}
    />
  ),
};

export const ResponsiveFixedWidth = {
  name: "Responsive fixed label width",
  render: () => (
    <Stack direction="column" gap="md">
      <Section padding="sm" surface="panel">
        <DefinitionList
          direction="row"
          labelWidth="fixed"
          items={[
            { label: "Short", value: "Fixed labels align values in roomy containers." },
            { label: "Longer label", value: "The label column uses container width and collapses at narrow sizes." },
            { label: "Identifier", value: "META-2026-0609", copyValue: true },
          ]}
        />
      </Section>
      <Section padding="sm" surface="panel" contentWidth="xs">
        <DefinitionList
          direction="row"
          labelWidth="fixed"
          items={[
            { label: "Short", value: "Narrow containers stack each pair." },
            { label: "Longer label", value: "Values keep full readable width." },
          ]}
        />
      </Section>
    </Stack>
  ),
};
