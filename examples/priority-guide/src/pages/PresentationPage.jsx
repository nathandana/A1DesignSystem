import React, { useState } from "react";
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
import { getRoutePath } from "../lib/routing.js";
import { getStoredGuide, getStoredGuides } from "../lib/storage.js";
import { PriorityGuideDocument } from "../components/PriorityGuide.jsx";
import { GuideOutline } from "../components/GuideOutline.jsx";

export function PresentationPage({ activeGuide, onNavigate }) {
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [viewMode, setViewMode] = useState("preview");
  const [copied, setCopied] = useState(false);
  const guide = getStoredGuide(activeGuide);
  const allGuides = getStoredGuides();
  const guideId = guide.id || activeGuide;
  const presentationUrl = new URL(getRoutePath("presentation", { guide: guideId }), window.location.origin).href;

  function copyPresentationUrl() {
    if (!navigator.clipboard) {
      window.prompt("Presentation URL", presentationUrl);
      return;
    }

    navigator.clipboard.writeText(presentationUrl).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <main className="priority-guide-presentation" aria-label="Priority guide presentation">
      <div className="priority-guide-presentation__heading">
        <Heading as="h1" type="display" size={{ xs: "lg", md: "xl" }}>
          {guide.title}
        </Heading>
      </div>
      <div className="priority-guide-presentation__canvas">
        {viewMode === "preview" ? (
          <PriorityGuideDocument guide={guide} guides={allGuides} showAnnotations={showAnnotations} />
        ) : (
          <GuideOutline guide={guide} />
        )}
      </div>
      <div className="priority-guide-presentation__toolbar" role="toolbar" aria-label="Presentation controls">
        <Button
          as="a"
          size="sm"
          variant="secondary"
          icon="close"
          iconPosition="start"
          href={getRoutePath("editor", { guide: guideId })}
          onClick={(event) => onNavigate(event, "editor", { guide: guideId })}
        >
          Exit
        </Button>
        <Button
          size="sm"
          variant="secondary"
          icon={copied ? "check" : "content_copy"}
          iconPosition="start"
          onClick={copyPresentationUrl}
        >
          {copied ? "Copied" : "Copy presentation URL"}
        </Button>
        {viewMode === "preview" && (
          <Switch
            size="compact"
            label="Annotations"
            checked={showAnnotations}
            onChange={setShowAnnotations}
          />
        )}
        <SegmentedControl
          options={[{ value: "preview", icon: "grid_view", label: "Preview" }, { value: "outline", icon: "format_list_bulleted", label: "Outline" }]}
          value={viewMode}
          onChange={setViewMode}
        />
      </div>
    </main>
  );
}
