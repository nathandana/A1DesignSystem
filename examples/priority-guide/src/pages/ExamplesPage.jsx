import React from "react";
import {
  Button,
  ButtonContainer,
  Card,
  Dialog,
  Grid,
  Heading,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuItem,
  MenuSection,
  MessageBadge,
  PageLayout,
  Paragraph,
  Section,
  SegmentedControl,
  SelectField,
  SideNav,
  SideNavItem,
  Snackbar,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextareaField,
  TextField,
} from "../../../../packages/react/src/index.js";
import { exampleGuides } from "../lib/data.jsx";
import { ExampleGuides } from "../components/PriorityGuide.jsx";

export function ExamplesPage({ activeGuide, onGuideChange }) {
  return (
    <main>
      <Section className="priority-guide-examples-page">
        <div className="priority-guide-shell">
          <div className="priority-guide-section-heading">
            <MessageBadge subtle icon="view_list">
              Example guides
            </MessageBadge>
            <Heading as="h1" type="display" size={{ xs: "lg", md: "xl" }}>
              Same structure, very different content problems.
            </Heading>
            <Paragraph size="lg" color="muted">
              A priority guide should flex across domains while preserving the same useful questions: who is this for, what do they need, what does the organization need, and what content or behavior earns its place?
            </Paragraph>
          </div>
          <div className="priority-guide-tabs">
            <ExampleGuides activeGuide={activeGuide} onGuideChange={onGuideChange} />
          </div>
        </div>
      </Section>
    </main>
  );
}
