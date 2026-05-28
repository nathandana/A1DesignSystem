import { useState } from "react";
import { Accordion } from "./Accordion.jsx";
import { Button } from "../button/Button.jsx";
import { Paragraph } from "../paragraph/Paragraph.jsx";

const LOREM = "Consequat anim esse aliqua magna esse officia proident exercitation. Amet ullamco commodo laborum Lorem aliqua eu aliquip duis elit. Exercitation nostrud cupidatat aliqua labore aliquip.";

const meta = {
  title: "Components/Controls/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    label: "Accordion item",
    size: "md",
    disabled: false,
    defaultOpen: false,
    children: LOREM,
  },
  argTypes: {
    label: { control: "text" },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
    },
    disabled: { control: "boolean" },
    defaultOpen: { control: "boolean" },
    open: { control: "boolean", description: "Controlled open state" },
  },
};

export default meta;

export const Configurable = {};

export const Sizes = {
  name: "Sizes",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-4)", maxWidth: 560 }}>
      <Accordion label="Small" size="sm">
        <Paragraph size="sm" color="muted" style={{ padding: "var(--base-spacing-8) var(--base-spacing-16) var(--base-spacing-16)" }}>
          {LOREM}
        </Paragraph>
      </Accordion>
      <Accordion label="Medium (default)" size="md">
        <Paragraph size="md" color="muted" style={{ padding: "var(--base-spacing-12) var(--base-spacing-20) var(--base-spacing-20)" }}>
          {LOREM}
        </Paragraph>
      </Accordion>
      <Accordion label="Large" size="lg">
        <Paragraph size="lg" color="muted" style={{ padding: "var(--base-spacing-16) var(--base-spacing-24) var(--base-spacing-24)" }}>
          {LOREM}
        </Paragraph>
      </Accordion>
    </div>
  ),
};

export const DefaultOpen = {
  name: "Default open",
  args: {
    label: "This starts open",
    defaultOpen: true,
    children: LOREM,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 560 }}>
        <Story />
      </div>
    ),
  ],
};

export const Controlled = {
  name: "Controlled",
  parameters: { controls: { include: [] } },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)", maxWidth: 560 }}>
        <div style={{ display: "flex", gap: "var(--base-spacing-8)" }}>
          <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>Expand</Button>
          <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>Collapse</Button>
        </div>
        <Accordion label="Controlled accordion" open={open} onChange={setOpen}>
          <Paragraph color="muted" style={{ padding: "var(--base-spacing-12) var(--base-spacing-20) var(--base-spacing-20)" }}>
            {LOREM}
          </Paragraph>
        </Accordion>
      </div>
    );
  },
};

export const Disabled = {
  name: "Disabled",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-4)", maxWidth: 560 }}>
      <Accordion label="Enabled item">
        <Paragraph color="muted" style={{ padding: "var(--base-spacing-12) var(--base-spacing-20) var(--base-spacing-20)" }}>
          {LOREM}
        </Paragraph>
      </Accordion>
      <Accordion label="Disabled item" disabled>
        <Paragraph color="muted" style={{ padding: "var(--base-spacing-12) var(--base-spacing-20) var(--base-spacing-20)" }}>
          {LOREM}
        </Paragraph>
      </Accordion>
      <Accordion label="Disabled and open" disabled defaultOpen>
        <Paragraph color="muted" style={{ padding: "var(--base-spacing-12) var(--base-spacing-20) var(--base-spacing-20)" }}>
          {LOREM}
        </Paragraph>
      </Accordion>
    </div>
  ),
};

const FAQ = [
  {
    q: "What is a design system?",
    a: "A design system is a collection of reusable components, guided by clear standards, that can be assembled to build any number of applications.",
  },
  {
    q: "How do I install the package?",
    a: "Run npm install @a1/react in your project, then import the components you need. Make sure to load the token CSS at your app root.",
  },
  {
    q: "Can I use the components without React?",
    a: "The core tokens and CSS are framework-agnostic. The React package provides pre-built components, but you can use the token CSS with any framework.",
  },
  {
    q: "How are tokens structured?",
    a: "Tokens follow a three-tier model: base (raw values), semantic (contextual intent), and component (component-specific overrides). This separation makes theming predictable.",
  },
];

export const Group = {
  name: "FAQ group",
  parameters: { controls: { include: [] } },
  render: () => {
    const [openId, setOpenId] = useState(null);
    return (
      <div
        style={{
          maxWidth: 560,
          border: "1px solid var(--semantic-color-border-subtle)",
          borderRadius: "var(--base-radius-lg)",
          overflow: "hidden",
        }}
      >
        {FAQ.map((item, i) => (
          <div
            key={item.q}
            style={{
              borderBottom: i < FAQ.length - 1
                ? "1px solid var(--semantic-color-border-subtle)"
                : undefined,
            }}
          >
            <Accordion
              label={item.q}
              open={openId === i}
              onChange={(next) => setOpenId(next ? i : null)}
            >
              <Paragraph
                color="muted"
                style={{ padding: "var(--base-spacing-4) var(--base-spacing-20) var(--base-spacing-20)" }}
              >
                {item.a}
              </Paragraph>
            </Accordion>
          </div>
        ))}
      </div>
    );
  },
};
