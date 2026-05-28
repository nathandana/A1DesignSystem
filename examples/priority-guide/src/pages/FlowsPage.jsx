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
import { exampleFlows } from "../lib/data.jsx";
import { getRoutePath } from "../lib/routing.js";
import { getStoredFlows, loadStoredEditor, saveStoredEditor } from "../lib/storage.js";

export function FlowsPage({ onNavigate }) {
  const [flows, setFlows] = useState(() => getStoredFlows());
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuAnchorRefs = useRef({});

  function addNewFlow() {
    const stored = loadStoredEditor() ?? {};
    const newFlow = {
      id: `flow-${Date.now()}`,
      title: "New flow",
      description: "",
      states: [],
      links: [],
    };
    saveStoredEditor({
      ...stored,
      userFlows: [...(stored.userFlows ?? []), newFlow],
      flowPositions: {
        ...(stored.flowPositions ?? {}),
        [newFlow.id]: { nodes: [], edges: [] },
      },
    });
    onNavigate(null, "flow-editor", { flow: newFlow.id });
  }

  function deleteFlow(flow) {
    const stored = loadStoredEditor() ?? {};
    const userFlows = stored.userFlows ?? [];
    if (!userFlows.some((item) => item.id === flow.id)) {
      setOpenMenuId(null);
      return;
    }
    const flowPositions = { ...(stored.flowPositions ?? {}) };
    delete flowPositions[flow.id];
    saveStoredEditor({
      ...stored,
      userFlows: userFlows.filter((item) => item.id !== flow.id),
      flowPositions,
    });
    setFlows(getStoredFlows());
    setOpenMenuId(null);
  }

  return (
    <main>
      <Section className="priority-guide-flows-page">
        <div className="priority-guide-shell">
          <div className="priority-guide-library-header">
            <div className="priority-guide-section-heading">
              <MessageBadge subtle icon="account_tree">
                Flows
              </MessageBadge>
              <Heading as="h1" type="display" size={{ xs: "lg", md: "xl" }}>
                Connect guides into journeys and states.
              </Heading>
              <Paragraph size="lg" color="muted">
                Flows sit above guides. Use them to see which pages exist, how they connect, and which buttons or links should move someone into another guide.
              </Paragraph>
            </div>
            <Button icon="add" iconPosition="start" onClick={addNewFlow}>
              Add New Flow
            </Button>
          </div>

          <Grid columns={{ xs: 1, md: 2, lg: 3 }} gap="md" className="priority-guide-library-grid">
            {flows.map((flow) => {
              const isExample = exampleFlows.some((item) => item.id === flow.id);
              return (
                <Card key={flow.id} className="priority-guide-library-card">
                  <div className="priority-guide-library-card__header">
                    <a
                      href={getRoutePath("flow-editor", { flow: flow.id })}
                      onClick={(event) => onNavigate(event, "flow-editor", { flow: flow.id })}
                      className="priority-guide-library-card__link"
                    >
                      <Heading as="h2" size="sm">{flow.title}</Heading>
                    </a>
                    <div
                      ref={(node) => {
                        if (node) menuAnchorRefs.current[flow.id] = node;
                        else delete menuAnchorRefs.current[flow.id];
                      }}
                      className="priority-guide-library-card__menu"
                    >
                      <IconButton
                        icon="more_vert"
                        label={`More options for ${flow.title}`}
                        aria-haspopup="dialog"
                        aria-expanded={openMenuId === flow.id}
                        onClick={() => setOpenMenuId((id) => id === flow.id ? null : flow.id)}
                      />
                      <Menu
                        open={openMenuId === flow.id}
                        onClose={() => setOpenMenuId(null)}
                        anchorRef={{ current: menuAnchorRefs.current[flow.id] }}
                        aria-label={`${flow.title} options`}
                      >
                        <MenuSection>
                          <MenuItem
                            icon="edit"
                            href={getRoutePath("flow-editor", { flow: flow.id })}
                            onClick={(event) => {
                              setOpenMenuId(null);
                              onNavigate(event, "flow-editor", { flow: flow.id });
                            }}
                          >
                            Edit
                          </MenuItem>
                        </MenuSection>
                        <MenuSection>
                          {isExample && (
                            <p className="priority-guide-menu-note">
                              Example flows cannot be deleted.
                            </p>
                          )}
                          <MenuItem
                            icon="delete"
                            variant="destructive"
                            disabled={isExample}
                            onClick={() => deleteFlow(flow)}
                          >
                            Delete
                          </MenuItem>
                        </MenuSection>
                      </Menu>
                    </div>
                  </div>
                  <a
                    href={getRoutePath("flow-editor", { flow: flow.id })}
                    onClick={(event) => onNavigate(event, "flow-editor", { flow: flow.id })}
                    className="priority-guide-library-card__body"
                  >
                    <Paragraph size="sm" color="muted">
                      {flow.description || `${flow.states?.length ?? 0} guide${flow.states?.length === 1 ? "" : "s"}`}
                    </Paragraph>
                  </a>
                </Card>
              );
            })}
          </Grid>
        </div>
      </Section>
    </main>
  );
}
