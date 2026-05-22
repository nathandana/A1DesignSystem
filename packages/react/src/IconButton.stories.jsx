import { IconButton } from "./IconButton.jsx";

const meta = {
  title: "Components/Controls/Icon Button",
  component: IconButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    icon: "settings",
    label: "Settings",
    variant: "default",
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["default", "filled"],
    },
    icon:     { control: "text" },
    label:    { control: "text" },
    disabled: { control: "boolean" },
  },
};

export default meta;

export const Configurable = {};

export const Variants = {
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--base-spacing-16)" }}>
      <IconButton icon="close"    label="Close"    />
      <IconButton icon="settings" label="Settings" variant="filled" />
    </div>
  ),
};

export const CommonIcons = {
  name: "Common uses",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-24)" }}>
      <div>
        <p style={{ margin: "0 0 var(--base-spacing-8)", fontFamily: "monospace", fontSize: "var(--semantic-font-size-body-xs)", color: "var(--semantic-color-text-muted)" }}>default</p>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--base-spacing-12)" }}>
          <IconButton icon="close"         label="Close"          />
          <IconButton icon="more_vert"     label="More options"   />
          <IconButton icon="edit"          label="Edit"           />
          <IconButton icon="delete"        label="Delete"         />
          <IconButton icon="search"        label="Search"         />
          <IconButton icon="notifications" label="Notifications"  />
        </div>
      </div>
      <div>
        <p style={{ margin: "0 0 var(--base-spacing-8)", fontFamily: "monospace", fontSize: "var(--semantic-font-size-body-xs)", color: "var(--semantic-color-text-muted)" }}>variant="filled"</p>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--base-spacing-12)" }}>
          <IconButton icon="close"         label="Close"          variant="filled" />
          <IconButton icon="more_vert"     label="More options"   variant="filled" />
          <IconButton icon="edit"          label="Edit"           variant="filled" />
          <IconButton icon="delete"        label="Delete"         variant="filled" />
          <IconButton icon="search"        label="Search"         variant="filled" />
          <IconButton icon="notifications" label="Notifications"  variant="filled" />
        </div>
      </div>
      <div>
        <p style={{ margin: "0 0 var(--base-spacing-8)", fontFamily: "monospace", fontSize: "var(--semantic-font-size-body-xs)", color: "var(--semantic-color-text-muted)" }}>disabled</p>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--base-spacing-12)" }}>
          <IconButton icon="edit"   label="Edit"   disabled />
          <IconButton icon="delete" label="Delete" disabled variant="filled" />
        </div>
      </div>
    </div>
  ),
};
