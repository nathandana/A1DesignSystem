import { Button } from "../button/Button.jsx";
import { ButtonContainer } from "./ButtonContainer.jsx";
import { Card } from "../card/Card.jsx";
import { Heading } from "../heading/Heading.jsx";
import { Link } from "../link/Link.jsx";
import { Paragraph } from "../paragraph/Paragraph.jsx";

const meta = {
  title: "Components/Controls/Button Container",
  component: ButtonContainer,
  tags: ["autodocs"],
  parameters: {
    layout: "padded"
  },
  args: {
    align: "start"
  },
  argTypes: {
    align: {
      control: "inline-radio",
      options: ["start", "center", "end"]
    }
  },
  render: args => (
    <ButtonContainer {...args} style={{ maxWidth: 560 }}>
      <Button variant="primary">Save changes</Button>
      <Button variant="secondary">Cancel</Button>
    </ButtonContainer>
  )
};

export default meta;

export const Configurable = {};

/* ── Card widths ──────────────────────────────────────────────────────────── */

const examples = [
  {
    width: 320,
    title: "Narrow card",
    description: "Two actions stack and fill the available width.",
    buttons: [
      <Button key="save" variant="primary">Save changes</Button>,
      <Button key="cancel" variant="secondary">Cancel</Button>
    ]
  },
  {
    width: 420,
    title: "Compact card",
    description: "Three actions remain stacked below the container threshold.",
    buttons: [
      <Button key="approve" variant="success">Approve</Button>,
      <Button key="review" variant="secondary">Review</Button>,
      <Button key="delete" variant="destructive">Delete</Button>
    ]
  },
  {
    width: 480,
    title: "Standard card",
    description: "At 480px, buttons return to their natural content width.",
    buttons: [
      <Button key="create" variant="primary">Create project</Button>,
      <Button key="template" variant="secondary">Use template</Button>
    ]
  },
  {
    width: 640,
    title: "Wide card",
    description: "A wider action area can hold multiple natural-width buttons.",
    buttons: [
      <Button key="publish" variant="primary">Publish</Button>,
      <Button key="preview" variant="secondary">Preview</Button>,
      <Button key="archive" variant="tertiary">Archive</Button>
    ]
  }
];

function ExampleCard({ width, title, description, buttons }) {
  return (
    <Card shadow="sm" style={{ width, maxWidth: "100%" }}>
      <Heading as="h3" size="sm" style={{ marginBottom: "8px" }}>
        {title}
      </Heading>
      <Paragraph color="muted" style={{ marginBottom: "20px" }}>
        {description}
      </Paragraph>
      <ButtonContainer>{buttons}</ButtonContainer>
    </Card>
  );
}

export const CardWidths = {
  name: "Card widths",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: "24px" }}>
      {examples.map(example => (
        <ExampleCard key={example.title} {...example} />
      ))}
    </div>
  )
};

/* ── Alignment & ordering ─────────────────────────────────────────────────── */

export const Alignment = {
  name: "Alignment & button order",
  render: () => (
    <div style={{ display: "grid", gap: "24px", maxWidth: 640 }}>

      <Card shadow="sm">
        <Heading as="h3" size="sm" style={{ marginBottom: "6px" }}>start</Heading>
        <Paragraph size="sm" color="muted" style={{ marginBottom: "16px" }}>
          Primary leads — DOM order: primary → secondary → tertiary.
        </Paragraph>
        <ButtonContainer align="start">
          <Button variant="primary">Save</Button>
          <Button variant="secondary">Cancel</Button>
          <Button variant="tertiary">Reset</Button>
        </ButtonContainer>
      </Card>

      <Card shadow="sm">
        <Heading as="h3" size="sm" style={{ marginBottom: "6px" }}>center</Heading>
        <Paragraph size="sm" color="muted" style={{ marginBottom: "16px" }}>
          Primary leads — same DOM order as start.
        </Paragraph>
        <ButtonContainer align="center">
          <Button variant="primary">Save</Button>
          <Button variant="secondary">Cancel</Button>
          <Button variant="tertiary">Reset</Button>
        </ButtonContainer>
      </Card>

      <Card shadow="sm">
        <Heading as="h3" size="sm" style={{ marginBottom: "6px" }}>end</Heading>
        <Paragraph size="sm" color="muted" style={{ marginBottom: "16px" }}>
          Primary lands rightmost — write DOM order primary → secondary → tertiary and
          the layout reverses it visually to tertiary → secondary → primary.
        </Paragraph>
        <ButtonContainer align="end">
          <Button variant="primary">Save</Button>
          <Button variant="secondary">Cancel</Button>
          <Button variant="tertiary">Reset</Button>
        </ButtonContainer>
      </Card>

    </div>
  )
};

/* ── With inline link ─────────────────────────────────────────────────────── */

export const WithLink = {
  name: "With inline link",
  render: () => (
    <div style={{ display: "grid", gap: "24px", maxWidth: 640 }}>

      <Card shadow="sm">
        <Heading as="h3" size="sm" style={{ marginBottom: "6px" }}>
          Start — link follows buttons
        </Heading>
        <Paragraph size="sm" color="muted" style={{ marginBottom: "16px" }}>
          DOM order: primary → secondary → link. Link appears after the action buttons.
        </Paragraph>
        <ButtonContainer align="start">
          <Button variant="primary">Submit</Button>
          <Button variant="secondary">Cancel</Button>
          <Link href="#">Learn more</Link>
        </ButtonContainer>
      </Card>

      <Card shadow="sm">
        <Heading as="h3" size="sm" style={{ marginBottom: "6px" }}>
          End — link shifts to the left
        </Heading>
        <Paragraph size="sm" color="muted" style={{ marginBottom: "16px" }}>
          Same DOM order: primary → secondary → link. The end-alignment reversal pushes
          the link to the far left and the primary action to the far right.
        </Paragraph>
        <ButtonContainer align="end">
          <Button variant="primary">Save changes</Button>
          <Button variant="secondary">Discard</Button>
          <Link href="#">View documentation</Link>
        </ButtonContainer>
      </Card>

      <Card shadow="sm">
        <Heading as="h3" size="sm" style={{ marginBottom: "6px" }}>
          Confirmation dialog footer
        </Heading>
        <Paragraph size="sm" color="muted" style={{ marginBottom: "16px" }}>
          A common pattern: destructive primary action right, link as a low-emphasis
          escape hatch on the left.
        </Paragraph>
        <ButtonContainer align="end">
          <Button variant="destructive">Delete account</Button>
          <Button variant="secondary">Keep account</Button>
          <Link href="#">What gets deleted?</Link>
        </ButtonContainer>
      </Card>

    </div>
  )
};
