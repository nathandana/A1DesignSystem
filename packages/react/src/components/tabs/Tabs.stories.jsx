import { useState } from "react";
import { Tabs, TabList, Tab, TabPanel } from "./Tabs.jsx";
import { Heading } from "../heading/Heading.jsx";
import { Paragraph } from "../paragraph/Paragraph.jsx";

const meta = {
  title: "Components/Controls/Tabs",
  parameters: { layout: "padded" },
};

export default meta;

/* ── Shared sample content ──────────────────────────────────────────────── */

function SamplePanel({ title }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-8)" }}>
      <Heading as="h3" type="heading" size="xs">{title}</Heading>
      <Paragraph color="muted" size="sm">
        This is the content area for the <strong>{title}</strong> tab. Add any components
        or markup here — it will only render when this tab is active.
      </Paragraph>
    </div>
  );
}

/* ── Line variant ─────────────────────────────────────────────────────────── */

export const Line = {
  name: "Line (standard)",
  render: () => {
    const [active, setActive] = useState("overview");
    return (
      <Tabs value={active} onChange={setActive} variant="line">
        <TabList>
          <Tab value="overview">Overview</Tab>
          <Tab value="activity">Activity</Tab>
          <Tab value="settings">Settings</Tab>
          <Tab value="members">Members</Tab>
        </TabList>
        <TabPanel value="overview"><SamplePanel title="Overview" /></TabPanel>
        <TabPanel value="activity"><SamplePanel title="Activity" /></TabPanel>
        <TabPanel value="settings"><SamplePanel title="Settings" /></TabPanel>
        <TabPanel value="members"><SamplePanel title="Members" /></TabPanel>
      </Tabs>
    );
  },
};

/* ── With count badges ────────────────────────────────────────────────────── */

export const WithCount = {
  name: "With count badges",
  render: () => {
    const [active, setActive] = useState("inbox");
    return (
      <Tabs value={active} onChange={setActive} variant="line">
        <TabList>
          <Tab value="inbox" count={12}>Inbox</Tab>
          <Tab value="sent" count={0}>Sent</Tab>
          <Tab value="drafts" count={3}>Drafts</Tab>
          <Tab value="archived">Archived</Tab>
        </TabList>
        <TabPanel value="inbox"><SamplePanel title="Inbox" /></TabPanel>
        <TabPanel value="sent"><SamplePanel title="Sent" /></TabPanel>
        <TabPanel value="drafts"><SamplePanel title="Drafts" /></TabPanel>
        <TabPanel value="archived"><SamplePanel title="Archived" /></TabPanel>
      </Tabs>
    );
  },
};

/* ── With inline icons ────────────────────────────────────────────────────── */

export const WithIconInline = {
  name: "With icons — inline",
  render: () => {
    const [active, setActive] = useState("home");
    return (
      <Tabs value={active} onChange={setActive} variant="line">
        <TabList>
          <Tab value="home" icon="home">Home</Tab>
          <Tab value="explore" icon="explore">Explore</Tab>
          <Tab value="notifications" icon="notifications" count={5}>Alerts</Tab>
          <Tab value="settings" icon="settings" iconPosition="end">Settings</Tab>
        </TabList>
        <TabPanel value="home"><SamplePanel title="Home" /></TabPanel>
        <TabPanel value="explore"><SamplePanel title="Explore" /></TabPanel>
        <TabPanel value="notifications"><SamplePanel title="Alerts" /></TabPanel>
        <TabPanel value="settings"><SamplePanel title="Settings" /></TabPanel>
      </Tabs>
    );
  },
};

/* ── With icons above ─────────────────────────────────────────────────────── */

export const WithIconAbove = {
  name: "With icons — above",
  render: () => {
    const [active, setActive] = useState("home");
    return (
      <Tabs value={active} onChange={setActive} variant="line">
        <TabList>
          <Tab value="home" icon="home" iconPosition="above">Home</Tab>
          <Tab value="explore" icon="explore" iconPosition="above">Explore</Tab>
          <Tab value="notifications" icon="notifications" iconPosition="above" count={5}>Alerts</Tab>
          <Tab value="profile" icon="person" iconPosition="above">Profile</Tab>
          <Tab value="settings" icon="settings" iconPosition="above">Settings</Tab>
        </TabList>
        <TabPanel value="home"><SamplePanel title="Home" /></TabPanel>
        <TabPanel value="explore"><SamplePanel title="Explore" /></TabPanel>
        <TabPanel value="notifications"><SamplePanel title="Alerts" /></TabPanel>
        <TabPanel value="profile"><SamplePanel title="Profile" /></TabPanel>
        <TabPanel value="settings"><SamplePanel title="Settings" /></TabPanel>
      </Tabs>
    );
  },
};

/* ── Overflow scroll ──────────────────────────────────────────────────────── */

export const Overflow = {
  name: "Overflow (many tabs)",
  render: () => {
    const [active, setActive] = useState("general");
    const tabs = [
      "General", "Appearance", "Security", "Notifications", "Billing",
      "Integrations", "API", "Webhooks", "Members", "Roles",
      "Audit log", "Advanced",
    ];
    return (
      <div style={{ maxWidth: 480 }}>
        <Tabs value={active} onChange={setActive} variant="line">
          <TabList>
            {tabs.map(t => (
              <Tab key={t} value={t.toLowerCase().replace(" ", "-")}>{t}</Tab>
            ))}
          </TabList>
          {tabs.map(t => (
            <TabPanel key={t} value={t.toLowerCase().replace(" ", "-")}>
              <SamplePanel title={t} />
            </TabPanel>
          ))}
        </Tabs>
      </div>
    );
  },
};

/* ── Folder variant ───────────────────────────────────────────────────────── */

export const Folder = {
  name: "Folder (browser tab)",
  render: () => {
    const [active, setActive] = useState("general");
    return (
      <Tabs value={active} onChange={setActive} variant="folder">
        <TabList>
          <Tab value="general">General</Tab>
          <Tab value="appearance">Appearance</Tab>
          <Tab value="security">Security</Tab>
          <Tab value="billing">Billing</Tab>
        </TabList>
        <TabPanel value="general"><SamplePanel title="General" /></TabPanel>
        <TabPanel value="appearance"><SamplePanel title="Appearance" /></TabPanel>
        <TabPanel value="security"><SamplePanel title="Security" /></TabPanel>
        <TabPanel value="billing"><SamplePanel title="Billing" /></TabPanel>
      </Tabs>
    );
  },
};

/* ── Folder + nested line ─────────────────────────────────────────────────── */

export const FolderNested = {
  name: "Folder with nested line",
  render: () => {
    const [primary, setPrimary] = useState("files");
    const [secondary, setSecondary] = useState("all");

    return (
      <Tabs value={primary} onChange={setPrimary} variant="folder" level={1}>
        <TabList>
          <Tab value="files">Files</Tab>
          <Tab value="history">History</Tab>
          <Tab value="shared">Shared</Tab>
        </TabList>

        <TabPanel value="files">
          <Tabs value={secondary} onChange={setSecondary} variant="line" level={2}>
            <TabList>
              <Tab value="all">All files</Tab>
              <Tab value="images">Images</Tab>
              <Tab value="documents">Documents</Tab>
              <Tab value="other">Other</Tab>
            </TabList>
            <TabPanel value="all"><SamplePanel title="All files" /></TabPanel>
            <TabPanel value="images"><SamplePanel title="Images" /></TabPanel>
            <TabPanel value="documents"><SamplePanel title="Documents" /></TabPanel>
            <TabPanel value="other"><SamplePanel title="Other" /></TabPanel>
          </Tabs>
        </TabPanel>

        <TabPanel value="history"><SamplePanel title="History" /></TabPanel>
        <TabPanel value="shared"><SamplePanel title="Shared" /></TabPanel>
      </Tabs>
    );
  },
};

/* ── Progress variant ─────────────────────────────────────────────────────── */

export const Progress = {
  name: "Progress (stepper)",
  render: () => {
    const [active, setActive] = useState("details");

    const steps = [
      { value: "account",  label: "Account",  status: "completed" },
      { value: "plan",     label: "Plan",      status: "completed" },
      { value: "details",  label: "Details",   status: "in-progress" },
      { value: "review",   label: "Review",    status: "todo" },
      { value: "confirm",  label: "Confirm",   status: "todo" },
    ];

    const current = steps.find(s => s.value === active);

    const statusLabel = {
      "completed":   "Completed",
      "in-progress": "In progress",
      "todo":        "Not started",
    };

    return (
      <Tabs value={active} onChange={setActive} variant="progress">
        <TabList>
          {steps.map(s => (
            <Tab key={s.value} value={s.value} status={s.status}>
              {s.label}
            </Tab>
          ))}
        </TabList>
        {steps.map(s => (
          <TabPanel key={s.value} value={s.value}>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-8)" }}>
              <Heading as="h3" type="heading" size="xs">
                Step {steps.indexOf(s) + 1}: {s.label}
              </Heading>
              <Paragraph color="muted" size="sm">
                Status: <strong>{statusLabel[s.status]}</strong>. Fill in the required
                information for this step before continuing to the next.
              </Paragraph>
            </div>
          </TabPanel>
        ))}
      </Tabs>
    );
  },
};
