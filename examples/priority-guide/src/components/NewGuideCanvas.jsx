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
import { examplePrompt, sampleGuideJson } from "../lib/data.jsx";

export function NewGuideCanvas({ onCreateGuide, onCancel }) {
  const [tab, setTab] = useState("scratch");
  const [name, setName] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [aiPrompt, setAiPrompt] = useState(examplePrompt);
  const [jsonText, setJsonText] = useState("");
  const [jsonError, setJsonError] = useState(null);
  const [sampleCopied, setSampleCopied] = useState(false);

  function createGuide(source) {
    const title = source.title?.trim() || source.tab?.trim() || "Untitled guide";
    const contextDetails = Array.isArray(source.contextDetails) && source.contextDetails.length
      ? source.contextDetails
      : [
          { label: "Decision needed", value: "- [ ] ", checkable: true },
          { label: "Out of scope", value: "" },
          { label: "Contributors", value: "" },
        ];

    onCreateGuide({
      id: source.id || `user-${Date.now()}`,
      tab: source.tab || title,
      icon: source.icon || "description",
      title,
      context: source.context || "",
      problemStatement: source.problemStatement || "",
      audience: source.audience || "",
      userGoal: source.userGoal || "",
      businessGoal: source.businessGoal || "",
      contextDetails,
      items: Array.isArray(source.items) ? source.items : [],
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    createGuide({
      title: name.trim(),
      problemStatement: problemStatement.trim(),
    });
  }

  function handlePromptSubmit(e) {
    e.preventDefault();
    createGuide({
      title: "AI prompt draft",
      context: "Prompt-generated starting point",
      problemStatement: aiPrompt.trim(),
      contextDetails: [
        { label: "Decision needed", value: "- [ ] Review the generated guide", checkable: true },
        { label: "Out of scope", value: "Visual design, layout decisions, and production copy polish." },
        { label: "Contributors", value: "" },
      ],
    });
  }

  function handleJsonSubmit(e) {
    e.preventDefault();
    try {
      const parsed = JSON.parse(jsonText);
      setJsonError(null);
      createGuide(parsed);
    } catch (error) {
      setJsonError(error.message);
    }
  }

  function copySampleJson() {
    navigator.clipboard?.writeText(sampleGuideJson).then(() => {
      setSampleCopied(true);
      window.setTimeout(() => setSampleCopied(false), 1800);
    });
  }

  return (
    <div className="priority-guide-new-guide">
      <Heading as="h1" size="md">New guide</Heading>
      <Paragraph size="md" color="muted">
        Start from a blank structure, an AI prompt, or an existing guide JSON file.
      </Paragraph>
      <div className="priority-guide-new-guide__tabs">
        <Tabs value={tab} onChange={setTab} variant="line">
          <TabList>
            <Tab value="scratch" icon="edit_note">From scratch</Tab>
            <Tab value="prompt" icon="auto_awesome">AI prompt</Tab>
            <Tab value="json" icon="data_object">JSON</Tab>
          </TabList>
          <TabPanel value="scratch">
            <form className="priority-guide-new-guide__form" onSubmit={handleSubmit}>
              <TextField
                label="Guide name"
                size="comfortable"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Checkout confirmation page"
                required
              />
              <TextareaField
                label="Problem statement"
                size="comfortable"
                rows="sm"
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                hint="Optional. Describe the challenge this guide should address."
              />
              <ButtonContainer>
                <Button
                  type="submit"
                  icon="arrow_forward"
                  iconPosition="end"
                  disabled={!name.trim()}
                >
                  Create guide
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </ButtonContainer>
            </form>
          </TabPanel>
          <TabPanel value="prompt">
            <form className="priority-guide-new-guide__form" onSubmit={handlePromptSubmit}>
              <TextareaField
                label="AI prompt"
                size="comfortable"
                rows="lg"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                hint="Include the audience, decision, desired outcome, out-of-scope items, and any known content."
              />
              <ButtonContainer>
                <Button
                  type="submit"
                  icon="arrow_forward"
                  iconPosition="end"
                  disabled={!aiPrompt.trim()}
                >
                  Create prompt draft
                </Button>
                <Button type="button" variant="secondary" onClick={onCancel}>
                  Cancel
                </Button>
              </ButtonContainer>
            </form>
          </TabPanel>
          <TabPanel value="json">
            <form className="priority-guide-new-guide__form" onSubmit={handleJsonSubmit}>
              {jsonError && (
                <div className="priority-guide-json-error" role="alert">
                  <Icon name="error" className="priority-guide-json-error__icon" />
                  <span>{jsonError}</span>
                </div>
              )}
              <TextareaField
                label="Guide JSON"
                size="comfortable"
                rows="lg"
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                hint="Paste a guide object with title, goals, context details, and items."
              />
              <ButtonContainer>
                <Button
                  type="submit"
                  icon="arrow_forward"
                  iconPosition="end"
                  disabled={!jsonText.trim()}
                >
                  Create from JSON
                </Button>
                <Button type="button" variant="secondary" onClick={onCancel}>
                  Cancel
                </Button>
              </ButtonContainer>
              <div className="priority-guide-sample-json">
                <Heading as="h2" size="xs">Sample JSON</Heading>
                <pre>{sampleGuideJson}</pre>
                <div className="priority-guide-sample-json__actions">
                  <Button
                    type="button"
                    size="sm"
                    variant="tertiary"
                    icon={sampleCopied ? "check" : "content_copy"}
                    iconPosition="start"
                    onClick={copySampleJson}
                  >
                    {sampleCopied ? "Copied" : "Copy example"}
                  </Button>
                </div>
              </div>
            </form>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}
