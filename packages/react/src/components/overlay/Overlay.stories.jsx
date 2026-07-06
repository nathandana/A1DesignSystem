import { useState } from "react";
import { Button } from "../button/Button.jsx";
import { ButtonContainer } from "../button-container/ButtonContainer.jsx";
import { Paragraph } from "../paragraph/Paragraph.jsx";
import { Stack } from "../stack/Stack.jsx";
import { Overlay } from "./Overlay.jsx";

const statuses = ["neutral", "info", "success", "warn", "error"];

function OverlayDemo(args) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open overlay</Button>
      <Overlay
        {...args}
        open={open}
        onClose={() => setOpen(false)}
        actions={
          <ButtonContainer align="center">
            <Button variant="secondary" onClick={() => setOpen(false)}>Continue</Button>
            <Button variant="tertiary" icon="replay" onClick={() => setOpen(false)}>Replay</Button>
          </ButtonContainer>
        }
      />
    </>
  );
}

const meta = {
  title: "Components/Overlay/Overlay",
  component: Overlay,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    status: "success",
    icon: undefined,
    title: "Level complete",
    body: "You cleared the challenge and unlocked the next round.",
  },
  argTypes: {
    open: { control: "boolean" },
    onClose: { control: false },
    status: { control: "inline-radio", options: statuses },
    icon: { control: "text" },
    title: { control: "text" },
    body: { control: "text" },
    actions: { control: false },
    children: { control: false },
    dismissLabel: { control: "text" },
  },
  render: OverlayDemo,
};

export default meta;

export const Configurable = {};

export const Statuses = {
  parameters: { controls: { include: [] } },
  render: () => {
    const [openStatus, setOpenStatus] = useState(null);
    return (
      <Stack direction="row" gap="md" wrap>
        {statuses.map((status) => (
          <Button key={status} variant="secondary" onClick={() => setOpenStatus(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
        {statuses.map((status) => (
          <Overlay
            key={status}
            open={openStatus === status}
            onClose={() => setOpenStatus(null)}
            status={status}
            title={`${status.charAt(0).toUpperCase() + status.slice(1)} overlay`}
            body="Use a short message that explains the state and the next best action."
            actions={<Button variant="secondary" onClick={() => setOpenStatus(null)}>Dismiss</Button>}
          />
        ))}
      </Stack>
    );
  },
};

export const WithCustomContent = {
  name: "With custom content",
  parameters: { controls: { include: [] } },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Show reward</Button>
        <Overlay
          open={open}
          onClose={() => setOpen(false)}
          status="success"
          icon="workspace_premium"
          title="New badge earned"
          body="You completed every task in the streak."
          actions={<Button variant="secondary" onClick={() => setOpen(false)}>Claim reward</Button>}
        >
          <Paragraph size="lg">Streak master</Paragraph>
        </Overlay>
      </>
    );
  },
};
