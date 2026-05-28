import React, { useRef, useState } from "react";
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
import { getRoutePath } from "../lib/routing.js";
import { getStoredFlows, getStoredGuides, loadStoredEditor, saveStoredEditor, makeDraft } from "../lib/storage.js";

export function GuideLibraryPage({ onNavigate }) {
  const [guides, setGuides] = useState(() => getStoredGuides());
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deletedGuide, setDeletedGuide] = useState(null);
  const menuAnchorRefs = useRef({});

  function duplicateGuide(guide) {
    const stored = loadStoredEditor() ?? {};
    const userGuides = stored.userGuides ?? [];
    const drafts = stored.drafts ?? {};
    const newGuide = {
      ...guide,
      id: `user-${Date.now()}`,
      tab: `${guide.tab || guide.title} copy`,
      title: `${guide.title} copy`,
      icon: guide.icon || "description",
    };
    const newDraft = makeDraft({ ...guide, title: newGuide.title });
    const nextUserGuides = [...userGuides, newGuide];
    const nextDrafts = { ...drafts, [newGuide.id]: newDraft };

    saveStoredEditor({ ...stored, userGuides: nextUserGuides, drafts: nextDrafts, activeGuideId: newGuide.id });
    setGuides(getStoredGuides());
    setOpenMenuId(null);
  }

  function deleteGuide(guide) {
    const stored = loadStoredEditor() ?? {};
    const userGuides = stored.userGuides ?? [];
    const removedGuide = userGuides.find((item) => item.id === guide.id);

    if (!removedGuide) {
      setOpenMenuId(null);
      return;
    }

    const nextDrafts = { ...(stored.drafts ?? {}) };
    const removedDraft = nextDrafts[guide.id] ?? makeDraft(guide);
    delete nextDrafts[guide.id];
    saveStoredEditor({
      ...stored,
      userGuides: userGuides.filter((item) => item.id !== guide.id),
      drafts: nextDrafts,
      activeGuideId: exampleGuides[0].id,
    });
    setGuides(getStoredGuides());
    setOpenMenuId(null);
    setDeletedGuide({ guide: removedGuide, draft: removedDraft, previousActiveGuideId: stored.activeGuideId });
  }

  function undoDeleteGuide() {
    if (!deletedGuide) return;

    const stored = loadStoredEditor() ?? {};
    const userGuides = stored.userGuides ?? [];
    const nextUserGuides = userGuides.some((guide) => guide.id === deletedGuide.guide.id)
      ? userGuides
      : [...userGuides, deletedGuide.guide];

    saveStoredEditor({
      ...stored,
      userGuides: nextUserGuides,
      drafts: { ...(stored.drafts ?? {}), [deletedGuide.guide.id]: deletedGuide.draft },
      activeGuideId: deletedGuide.previousActiveGuideId ?? deletedGuide.guide.id,
    });
    setGuides(getStoredGuides());
    setDeletedGuide(null);
  }

  const flows = getStoredFlows();
  const guideToFlows = {};
  for (const flow of flows) {
    for (const state of flow.states ?? []) {
      if (!guideToFlows[state.guideId]) guideToFlows[state.guideId] = [];
      if (!guideToFlows[state.guideId].includes(flow.id)) guideToFlows[state.guideId].push(flow.id);
    }
  }
  const flowSections = flows.map((flow) => ({
    flow,
    guides: guides.filter((g) => (guideToFlows[g.id] ?? []).includes(flow.id)),
  })).filter((s) => s.guides.length > 0);
  const ungrouped = guides.filter((g) => !guideToFlows[g.id]);

  function renderGuideCard(guide) {
    const isExampleGuide = exampleGuides.some((item) => item.id === guide.id);
    return (
      <Card key={guide.id} className="priority-guide-library-card">
        <div className="priority-guide-library-card__header">
          <a
            href={getRoutePath("editor", { guide: guide.id })}
            onClick={(event) => onNavigate(event, "editor", { guide: guide.id })}
            className="priority-guide-library-card__link"
          >
            <Heading as="h2" size="sm">{guide.title}</Heading>
          </a>
          <div
            ref={(node) => {
              if (node) menuAnchorRefs.current[guide.id] = node;
              else delete menuAnchorRefs.current[guide.id];
            }}
            className="priority-guide-library-card__menu"
          >
            <IconButton
              icon="more_vert"
              label={`More options for ${guide.title}`}
              aria-haspopup="dialog"
              aria-expanded={openMenuId === guide.id}
              onClick={() => setOpenMenuId((id) => id === guide.id ? null : guide.id)}
            />
            <Menu
              open={openMenuId === guide.id}
              onClose={() => setOpenMenuId(null)}
              anchorRef={{ current: menuAnchorRefs.current[guide.id] }}
              aria-label={`${guide.title} options`}
            >
              <MenuSection>
                <MenuItem icon="content_copy" onClick={() => duplicateGuide(guide)}>Duplicate</MenuItem>
                <MenuItem
                  icon="edit"
                  href={getRoutePath("editor", { guide: guide.id })}
                  onClick={(event) => { setOpenMenuId(null); onNavigate(event, "editor", { guide: guide.id }); }}
                >
                  Edit
                </MenuItem>
              </MenuSection>
              <MenuSection>
                {isExampleGuide && (
                  <p className="priority-guide-menu-note">Example guides are included as references and cannot be deleted.</p>
                )}
                <MenuItem icon="delete" variant="destructive" disabled={isExampleGuide} onClick={() => deleteGuide(guide)}>
                  Delete
                </MenuItem>
              </MenuSection>
            </Menu>
          </div>
        </div>
        <a
          href={getRoutePath("editor", { guide: guide.id })}
          onClick={(event) => onNavigate(event, "editor", { guide: guide.id })}
          className="priority-guide-library-card__body"
        >
          <Paragraph size="sm" color="muted">{guide.problemStatement || "No problem statement yet."}</Paragraph>
        </a>
      </Card>
    );
  }

  return (
    <main>
      <Section className="priority-guide-library-page">
        <div className="priority-guide-shell">
          <div className="priority-guide-library-header">
            <div className="priority-guide-section-heading">
              <MessageBadge subtle icon="folder_open">
                Pages
              </MessageBadge>
              <Heading as="h1" type="display" size={{ xs: "lg", md: "xl" }}>
                Your priority guides.
              </Heading>
              <Paragraph size="lg" color="muted">
                Open a guide to edit the hierarchy, group related content, and prepare a presentation view.
              </Paragraph>
            </div>
            <Button
              as="a"
              href={getRoutePath("new")}
              icon="add"
              iconPosition="start"
              onClick={(event) => onNavigate(event, "new")}
            >
              Add New Guide
            </Button>
          </div>

          {flowSections.map(({ flow, guides: flowGuides }) => (
            <div key={flow.id} className="priority-guide-pages-section">
              <div className="priority-guide-pages-section__header">
                <Icon name="account_tree" />
                <a
                  href={getRoutePath("flow-editor", { flow: flow.id })}
                  onClick={(e) => onNavigate(e, "flow-editor", { flow: flow.id })}
                  className="priority-guide-pages-section__flow-link"
                >
                  {flow.title}
                </a>
              </div>
              <Grid columns={{ xs: 1, md: 2, lg: 3 }} gap="md" className="priority-guide-library-grid">
                {flowGuides.map(renderGuideCard)}
              </Grid>
            </div>
          ))}

          {ungrouped.length > 0 && (
            <div className="priority-guide-pages-section">
              {flowSections.length > 0 && (
                <div className="priority-guide-pages-section__header">
                  <Icon name="folder_open" />
                  <span>Not in a flow</span>
                </div>
              )}
              <Grid columns={{ xs: 1, md: 2, lg: 3 }} gap="md" className="priority-guide-library-grid">
                {ungrouped.map(renderGuideCard)}
              </Grid>
            </div>
          )}

          {guides.length === 0 && (
            <Grid columns={{ xs: 1, md: 2, lg: 3 }} gap="md" className="priority-guide-library-grid">
              {[].map(renderGuideCard)}
            </Grid>
          )}
        </div>
      </Section>
      <Snackbar
        open={!!deletedGuide}
        actionLabel="Undo"
        onAction={undoDeleteGuide}
        onClose={() => setDeletedGuide(null)}
      >
        Guide deleted.
      </Snackbar>
    </main>
  );
}
