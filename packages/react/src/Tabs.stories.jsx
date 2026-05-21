import { useState } from "react";
import { Tabs, TabList, Tab, TabPanel } from "./Tabs.jsx";
import { Heading } from "./Heading.jsx";
import { Paragraph } from "./Paragraph.jsx";

const meta = {
  title: "Components/Tabs",
  parameters: { layout: "padded" },
};

export default meta;

/* ── Shared sample content ──────────────────────────────────────────────── */

function SamplePanel({ title }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-xs)" }}>
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
