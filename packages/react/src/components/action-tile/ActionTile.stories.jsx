import { ActionTiles } from "./ActionTile.jsx";
import { ActionTile } from "./ActionTile.jsx";
import { Button } from "../button/Button.jsx";
import { IconButton } from "../icon-button/IconButton.jsx";
import { Inset } from "../inset/Inset.jsx";
import { Stack } from "../stack/Stack.jsx";
import { Switch } from "../switch/Switch.jsx";

const meta = {
  title: "Components/Actions & Controls/Action Tiles",
  component: ActionTiles,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    layout: "grid",
    gap: true,
    iconLayout: "auto",
  },
  argTypes: {
    layout: {
      control: "inline-radio",
      options: ["grid", "stack"],
    },
    gap: {
      control: "boolean",
    },
    iconLayout: {
      control: "inline-radio",
      options: ["auto", "top", "side", "none"],
    },
  },
};

export default meta;

export const Default = {
  render: (args) => (
    <ActionTiles {...args}>
      <ActionTile icon="palette" title="Patterns" subtitle="Create, edit, and apply reusable patterns." />
      <ActionTile icon="imagesmode" title="Image library" subtitle="Browse uploaded assets and copy links." />
    </ActionTiles>
  ),
};

export const WithAccessory = {
  render: (args) => (
    <ActionTiles {...args}>
      <ActionTile
        icon="notifications"
        title="Alerts"
        subtitle="Send launch updates to the workspace."
        accessory={<Switch checked aria-label="Launch alerts enabled" onChange={() => {}} />}
      />
      <ActionTile
        icon="security"
        title="Privacy mode"
        subtitle="Limit previews and screenshot sharing."
        accessory={<Switch aria-label="Privacy mode" onChange={() => {}} />}
      />
    </ActionTiles>
  ),
};

export const Interactive = {
  render: (args) => (
    <ActionTiles {...args}>
      <ActionTile
        as="button"
        title="Open image library"
        subtitle="Browse uploaded assets and copy links."
        icon="imagesmode"
        footer={<Button size="sm">Open</Button>}
      />
      <ActionTile
        as="button"
        title="Open patterns"
        subtitle="Jump into reusable building blocks."
        icon="palette"
        accessory={<IconButton icon="more_horiz" label="More actions" />}
      />
    </ActionTiles>
  ),
};

export const StackNoGap = {
  render: (args) => (
    <ActionTiles {...args} layout="stack" gap={false}>
      <ActionTile
        title="Team library"
        subtitle="Shared resources for every project."
        icon="collections_bookmark"
        accessory={<IconButton icon="more_horiz" label="More actions" />}
        footer={
          <>
            <Button size="sm">Open</Button>
            <Button size="sm" variant="secondary">Manage</Button>
          </>
        }
      />
      <ActionTile
        icon="dashboard_customize"
        title="Component sets"
        subtitle="Compose reusable UI building blocks."
      />
    </ActionTiles>
  ),
};

export const ResponsiveContainers = {
  render: () => (
    <Stack gap="md">
      <Inset style={{ maxWidth: "18rem" }}>
        <ActionTiles>
          <ActionTile icon="bolt" title="Narrow group" subtitle="Compact command surface." />
        </ActionTiles>
      </Inset>
      <Inset style={{ maxWidth: "32rem" }}>
        <ActionTiles>
          <ActionTile icon="bolt" title="Medium group" subtitle="Default action surface." />
        </ActionTiles>
      </Inset>
      <Inset style={{ maxWidth: "48rem" }}>
        <ActionTiles>
          <ActionTile
            icon="bolt"
            title="Wide group"
            subtitle="The icon and typography scale up with the container."
            footer={<Button size="sm">Inspect</Button>}
          />
          <ActionTile
            icon="imagesmode"
            title="Second tile"
            subtitle="Inline grid layout appears once space allows it."
          />
        </ActionTiles>
      </Inset>
    </Stack>
  ),
};
