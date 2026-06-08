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
import { storeCreatedGuide } from "../lib/storage.js";
import { NewGuideCanvas } from "../components/NewGuideCanvas.jsx";

export function NewGuidePage({ onNavigate }) {
  function handleCreateGuide(newGuide) {
    storeCreatedGuide(newGuide);
    onNavigate(null, "editor", { guide: newGuide.id });
  }

  return (
    <main>
      <Section className="priority-guide-new-page">
        <div className="priority-guide-shell priority-guide-new-page__inner">
          <NewGuideCanvas
            onCreateGuide={handleCreateGuide}
            onCancel={() => onNavigate(null, "guides")}
          />
        </div>
      </Section>
    </main>
  );
}
