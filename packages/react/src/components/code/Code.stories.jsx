import { Code } from "./Code.jsx";

const meta = {
  title: "Components/Typography/Code",
  component: Code,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    children: "--semantic-color-text-default",
    variant: "inline",
    wrapping: false,
    copyCode: false,
    editable: false,
    rows: 10,
    lineNumbers: false,
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["inline", "block"],
      description: "Presentation mode. Inline is compact for prose; block renders a preformatted code surface.",
    },
    wrapping: {
      control: "boolean",
      description: "Allow long code values to wrap.",
    },
    copyCode: {
      control: "boolean",
      description: "Show a small tertiary copy button below the code block.",
    },
    copyText: {
      control: "text",
      description: "Optional clipboard text override. Defaults to the rendered text children.",
    },
    editable: {
      control: "boolean",
      description: "Render the block as an editable textarea. Only meaningful in block mode.",
    },
    rows: {
      control: { type: "number", min: 1 },
      description: "Visible textarea rows when editable. Default 10.",
    },
    lineNumbers: {
      control: "boolean",
      description: "Show a non-interactive gutter with one number per logical line. Only meaningful in block mode.",
    },
    collapsible: {
      control: "boolean",
      description: "Cap a long read-only block with a fade + Show more/less toggle (block, non-editable).",
    },
    collapsedLines: {
      control: "number",
      description: "Approximate number of lines shown when collapsed. Default 14.",
    },
  },
};

export default meta;

export const Configurable = {};

export const Inline = {
  args: {
    variant: "inline",
    children: "--semantic-color-text-default",
  },
  render: (args) => (
    <p>
      Set the token value using <Code {...args} /> in your CSS.
    </p>
  ),
};

export const Block = {
  args: {
    variant: "block",
    children: `import { Button, Code } from "@gtivr4/a1-design-system-react";

export function Example() {
  return <Button icon="arrow_forward">Continue</Button>;
}`,
  },
};

export const Wrapping = {
  args: {
    variant: "block",
    wrapping: true,
    children: "const veryLongTokenName = \"--semantic-color-action-background-hover-when-focused-and-active\";",
  },
};

export const CopyCode = {
  name: "Copy Code",
  args: {
    variant: "block",
    copyCode: true,
    children: `npm install @gtivr4/a1-design-system-react`,
  },
};

export const Editable = {
  name: "Editable",
  args: {
    variant: "block",
    editable: true,
    copyCode: true,
    children: `import { Button } from "@gtivr4/a1-design-system-react";

export function Example() {
  return <Button icon="arrow_forward">Continue</Button>;
}`,
  },
};

export const LineNumbers = {
  name: "Line numbers",
  args: {
    variant: "block",
    editable: true,
    rows: 4,
    lineNumbers: true,
    children: Array.from(
      { length: 16 },
      (_, index) => `const token${index + 1} = "var(--semantic-color-surface-panel)";`,
    ).join("\n"),
  },
};

export const Collapsible = {
  name: "Collapsible (long block)",
  args: {
    variant: "block",
    collapsible: true,
    collapsedLines: 8,
    copyCode: true,
    children: Array.from(
      { length: 40 },
      (_, i) => `line ${i + 1}: const token${i} = "var(--semantic-color-surface-panel)";`,
    ).join("\n"),
  },
};
