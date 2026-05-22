import { IconButton } from "./IconButton.jsx";

const meta = {
  title: "Components/Controls/Icon Button",
  component: IconButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    icon: "settings",
    label: "Settings",
    variant: "tertiary",
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["tertiary", "secondary", "destructive", "success"],
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
      <IconButton icon="close"    label="Close"    variant="tertiary" />
      <IconButton icon="settings" label="Settings" variant="secondary" />
      <IconButton icon="delete"   label="Delete"   variant="destructive" />
      <IconButton icon="check"    label="Approve"  variant="success" />
    </div>
  ),
};

export const CommonIcons = {
  name: "Common uses",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-24)" }}>
      <div>
        <p style={{ margin: "0 0 var(--base-spacing-8)", fontFamily: "monospace", fontSize: "var(--semantic-font-size-body-xs)", color: "var(--semantic-color-text-muted)" }}>variant="tertiary"</p>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--base-spacing-12)" }}>
          <IconButton icon="close"         label="Close"          variant="tertiary" />
          <IconButton icon="more_vert"     label="More options"   variant="tertiary" />
          <IconButton icon="edit"          label="Edit"           variant="tertiary" />
          <IconButton icon="delete"        label="Delete"         variant="tertiary" />
          <IconButton icon="search"        label="Search"         variant="tertiary" />
          <IconButton icon="notifications" label="Notifications"  variant="tertiary" />
        </div>
      </div>
      <div>
        <p style={{ margin: "0 0 var(--base-spacing-8)", fontFamily: "monospace", fontSize: "var(--semantic-font-size-body-xs)", color: "var(--semantic-color-text-muted)" }}>variant="secondary"</p>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--base-spacing-12)" }}>
          <IconButton icon="close"         label="Close"          variant="secondary" />
          <IconButton icon="more_vert"     label="More options"   variant="secondary" />
          <IconButton icon="edit"          label="Edit"           variant="secondary" />
          <IconButton icon="delete"        label="Delete"         variant="secondary" />
          <IconButton icon="search"        label="Search"         variant="secondary" />
          <IconButton icon="notifications" label="Notifications"  variant="secondary" />
        </div>
      </div>
      <div>
        <p style={{ margin: "0 0 var(--base-spacing-8)", fontFamily: "monospace", fontSize: "var(--semantic-font-size-body-xs)", color: "var(--semantic-color-text-muted)" }}>variant="destructive"</p>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--base-spacing-12)" }}>
          <IconButton icon="delete"        label="Delete"         variant="destructive" />
          <IconButton icon="remove"        label="Remove"         variant="destructive" />
          <IconButton icon="block"         label="Block"          variant="destructive" />
          <IconButton icon="close"         label="Close"          variant="destructive" />
        </div>
      </div>
      <div>
        <p style={{ margin: "0 0 var(--base-spacing-8)", fontFamily: "monospace", fontSize: "var(--semantic-font-size-body-xs)", color: "var(--semantic-color-text-muted)" }}>variant="success"</p>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--base-spacing-12)" }}>
          <IconButton icon="check"         label="Approve"        variant="success" />
          <IconButton icon="done_all"      label="Complete all"   variant="success" />
          <IconButton icon="task_alt"      label="Mark complete"  variant="success" />
          <IconButton icon="thumb_up"      label="Accept"         variant="success" />
        </div>
      </div>
      <div>
        <p style={{ margin: "0 0 var(--base-spacing-8)", fontFamily: "monospace", fontSize: "var(--semantic-font-size-body-xs)", color: "var(--semantic-color-text-muted)" }}>disabled</p>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--base-spacing-12)" }}>
          <IconButton icon="edit"   label="Edit"   disabled />
          <IconButton icon="delete" label="Delete" disabled variant="secondary" />
          <IconButton icon="delete" label="Delete" disabled variant="destructive" />
          <IconButton icon="check"  label="Approve" disabled variant="success" />
        </div>
      </div>
    </div>
  ),
};
