import React, { useState } from "react";
import {
  Banner,
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
import { isGuideLinkComponent } from "./PriorityGuide.jsx";

export function JsonPanel({ guide, onLoad }) {
  const serialize = (g) => JSON.stringify(g, null, 2);
  const [text, setText] = useState(() => serialize(guide));
  const [error, setError] = useState(null);

  function handleChange(value) {
    setText(value);
    try {
      const parsed = JSON.parse(value);
      setError(null);
      onLoad(parsed);
    } catch (e) {
      setError(e.message);
    }
  }

  function handleCopy() {
    navigator.clipboard?.writeText(text).catch(() => {});
  }

  function handleLoadExternal() {
    try {
      const parsed = JSON.parse(text);
      setError(null);
      onLoad(parsed);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="priority-guide-json-panel">
      <div className="priority-guide-json-panel__header">
        <span className="priority-guide-kicker">JSON</span>
      </div>
      {error && <Banner status="error">{error}</Banner>}
      <textarea
        className="priority-guide-json-textarea"
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        spellCheck={false}
      />
      <Button size="sm" variant="secondary" icon="content_copy" iconPosition="start" onClick={handleCopy} className="priority-guide-json-panel__copy">Copy</Button>
    </div>
  );
}

export function GuideLinkSelect({ item, guides, onChange }) {
  if (!isGuideLinkComponent(item)) return null;

  return (
    <SelectField
      label="Linked guide"
      size="compact"
      value={item.linkedGuideId ?? ""}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">No linked guide</option>
      {guides.map((guide) => (
        <option key={guide.id} value={guide.id}>{guide.title}</option>
      ))}
    </SelectField>
  );
}
