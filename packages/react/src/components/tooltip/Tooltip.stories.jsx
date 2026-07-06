import { Button } from "../button/Button.jsx";
import { IconButton } from "../icon-button/IconButton.jsx";
import { Link } from "../link/Link.jsx";
import { Stack } from "../stack/Stack.jsx";
import { Tooltip } from "./Tooltip.jsx";

const meta = {
  title: "Components/Overlay/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    content: "Helpful context for this action.",
    delay: 400,
    disabled: false,
    placement: "top",
  },
  argTypes: {
    content: { control: "text" },
    delay: { control: { type: "range", min: 0, max: 1500, step: 100 } },
    disabled: { control: "boolean" },
    placement: {
      control: "inline-radio",
      options: ["top", "right", "bottom", "left"],
    },
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button>Hover or focus me</Button>
    </Tooltip>
  ),
};

export default meta;

export const Configurable = {};

export const Placements = {
  parameters: { controls: { include: [] } },
  render: () => (
    <Stack direction="row" gap="lg" align="center">
      {["top", "right", "bottom", "left"].map((placement) => (
        <Tooltip key={placement} placement={placement} content={`${placement} tooltip`} delay={0}>
          <Button variant="secondary">{placement}</Button>
        </Tooltip>
      ))}
    </Stack>
  ),
};

export const IconButtonTrigger = {
  name: "IconButton trigger",
  parameters: { controls: { include: [] } },
  render: () => (
    <Tooltip content="Refresh dashboard" delay={0}>
      <IconButton icon="refresh" aria-label="Refresh dashboard" />
    </Tooltip>
  ),
};

export const TriggerComponents = {
  name: "Trigger components",
  parameters: { controls: { include: [] } },
  render: () => (
    <Stack direction="row" gap="lg" align="center">
      <Tooltip content="Button trigger" delay={0}>
        <Button variant="secondary">Button</Button>
      </Tooltip>
      <Tooltip content="Icon button trigger" delay={0}>
        <IconButton icon="info" aria-label="More information" />
      </Tooltip>
      <Tooltip content="Link trigger" delay={0}>
        <Link href="#" onClick={(event) => event.preventDefault()}>Link</Link>
      </Tooltip>
    </Stack>
  ),
};

export const Delayed = {
  parameters: { controls: { include: [] } },
  render: () => (
    <Tooltip content="This tooltip waits before appearing." delay={800}>
      <Button>Slow tooltip</Button>
    </Tooltip>
  ),
};
