import { Notification } from "./Notification.jsx";
import { Button } from "./Button.jsx";
import { Icon } from "./Icon.jsx";

const meta = {
  title: "Components/Messaging/Notification",
  component: Notification,
  tags: ["autodocs"],
  args: {
    count: 5,
    variant: "error",
    position: "top-right",
    max: 99,
    dot: false,
  },
  argTypes: {
    count: {
      control: { type: "number" },
      description: "Numeric count — takes priority over label"
    },
    label: {
      control: "text",
      description: "Short text label — used when count is not set"
    },
    dot: {
      control: "boolean",
      description: "Show a dot with no content"
    },
    variant: {
      control: "inline-radio",
      options: ["default", "error", "success", "warn", "info"]
    },
    position: {
      control: "select",
      options: ["top-right", "top-left", "bottom-right", "bottom-left"]
    },
    max: {
      control: { type: "number" },
      description: "Count above this value shows as {max}+"
    }
  },
  render: (args) => (
    <div style={{ padding: "var(--base-spacing-24)" }}>
      <Notification {...args}>
        <span style={{ fontSize: "28px", display: "inline-flex" }}>
          <Icon name="notifications" opticalSize={24} />
        </span>
      </Notification>
    </div>
  )
};

export default meta;

export const Configurable = {};

export const OnIcon = {
  name: "On icon",
  parameters: { controls: { include: ["variant", "position", "dot", "max"] } },
  render: (args) => (
    <div style={{ display: "flex", gap: "var(--base-spacing-64)", alignItems: "center", padding: "var(--base-spacing-40)" }}>
      <Notification {...args} count={3}>
        <span style={{ fontSize: "28px", display: "inline-flex" }}>
          <Icon name="notifications" opticalSize={24} />
        </span>
      </Notification>
      <Notification {...args} count={12}>
        <span style={{ fontSize: "28px", display: "inline-flex" }}>
          <Icon name="mail" opticalSize={24} />
        </span>
      </Notification>
      <Notification {...args} count={128}>
        <span style={{ fontSize: "28px", display: "inline-flex" }}>
          <Icon name="chat" opticalSize={24} />
        </span>
      </Notification>
      <Notification {...args} dot>
        <span style={{ fontSize: "28px", display: "inline-flex" }}>
          <Icon name="account_circle" opticalSize={24} />
        </span>
      </Notification>
    </div>
  )
};

export const OnButton = {
  name: "On button",
  parameters: { controls: { include: ["variant", "position", "dot", "max"] } },
  render: (args) => (
    <div style={{ display: "flex", gap: "var(--base-spacing-40)", alignItems: "center", padding: "var(--base-spacing-40)", flexWrap: "wrap" }}>
      <Notification {...args} count={4}>
        <Button variant="secondary" icon="notifications">Notifications</Button>
      </Notification>
      <Notification {...args} count={21}>
        <Button variant="secondary" icon="mail">Messages</Button>
      </Notification>
      <Notification {...args} dot>
        <Button variant="primary">Updates</Button>
      </Notification>
    </div>
  )
};

export const Variants = {
  parameters: { controls: { include: ["count", "position", "dot", "max"] } },
  render: (args) => (
    <div style={{ display: "flex", gap: "var(--base-spacing-64)", alignItems: "center", padding: "var(--base-spacing-40)", flexWrap: "wrap" }}>
      {["default", "error", "success", "warn", "info"].map(variant => (
        <div key={variant} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--base-spacing-12)" }}>
          <Notification {...args} variant={variant}>
            <span style={{ fontSize: "28px", display: "inline-flex" }}>
              <Icon name="notifications" opticalSize={24} />
            </span>
          </Notification>
          <span style={{ fontSize: "var(--semantic-font-size-body-xs)", color: "var(--semantic-color-text-muted)", fontFamily: "var(--component-paragraph-font-family)" }}>
            {variant}
          </span>
        </div>
      ))}
    </div>
  )
};

export const Overflow = {
  name: "Count overflow",
  parameters: { controls: { include: ["variant", "max"] } },
  render: (args) => (
    <div style={{ display: "flex", gap: "var(--base-spacing-64)", alignItems: "center", padding: "var(--base-spacing-40)", flexWrap: "wrap" }}>
      {[1, 42, 99, 100, 1000, 1500, 10000, 1000000, 99000000].map(count => (
        <div key={count} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--base-spacing-12)" }}>
          <Notification {...args} count={count}>
            <span style={{ fontSize: "28px", display: "inline-flex" }}>
              <Icon name="notifications" opticalSize={24} />
            </span>
          </Notification>
          <span style={{ fontSize: "var(--semantic-font-size-body-xs)", color: "var(--semantic-color-text-muted)", fontFamily: "var(--component-paragraph-font-family)" }}>
            {count}
          </span>
        </div>
      ))}
    </div>
  )
};

export const Positions = {
  parameters: { controls: { include: ["variant", "count", "dot"] } },
  render: (args) => (
    <div style={{ display: "flex", gap: "var(--base-spacing-64)", alignItems: "center", padding: "var(--base-spacing-40)", flexWrap: "wrap" }}>
      {["top-right", "top-left", "bottom-right", "bottom-left"].map(position => (
        <div key={position} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--base-spacing-12)" }}>
          <Notification {...args} position={position}>
            <span style={{ fontSize: "28px", display: "inline-flex" }}>
              <Icon name="star" opticalSize={24} />
            </span>
          </Notification>
          <span style={{ fontSize: "var(--semantic-font-size-body-xs)", color: "var(--semantic-color-text-muted)", fontFamily: "var(--component-paragraph-font-family)" }}>
            {position}
          </span>
        </div>
      ))}
    </div>
  )
};
