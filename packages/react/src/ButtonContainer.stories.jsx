import { Button } from "./Button.jsx";
import { ButtonContainer } from "./ButtonContainer.jsx";
import { Card } from "./Card.jsx";
import { Heading } from "./Heading.jsx";
import { Paragraph } from "./Paragraph.jsx";

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

export const Alignment = {
  render: () => (
    <div style={{ display: "grid", gap: "24px", maxWidth: 640 }}>
      {["start", "center", "end"].map(align => (
        <Card key={align} shadow="sm">
          <Heading as="h3" size="sm" style={{ marginBottom: "16px" }}>
            {align}
          </Heading>
          <ButtonContainer align={align}>
            <Button variant="primary">Save changes</Button>
            <Button variant="secondary">Cancel</Button>
            <Button variant="tertiary">Reset</Button>
          </ButtonContainer>
        </Card>
      ))}
    </div>
  )
};
