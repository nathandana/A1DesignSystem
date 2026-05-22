import { useState } from "react";
import { Button } from "../Button.jsx";
import { Heading } from "../Heading.jsx";
import { IconButton } from "../IconButton.jsx";
import { Link } from "../Link.jsx";
import { MessageBadge } from "../Message.jsx";
import { Paragraph } from "../Paragraph.jsx";

const ruleFiles = import.meta.glob("../../../../system/rules/*.yaml", {
  eager: true,
  query: "?raw",
  import: "default"
});

const styles = {
  page: {
    width: "min(960px, calc(100vw - 48px))",
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-32)"
  },
  intro: {
    maxWidth: "680px",
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-8)"
  },
  group: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-16)"
  },
  ruleList: {
    display: "grid",
    gap: "var(--base-spacing-12)"
  },
  filter: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-8)"
  },
  filterList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "var(--base-spacing-8)"
  },
  filterButton: {
    appearance: "none",
    border: "1px solid var(--semantic-color-border-subtle)",
    borderRadius: "var(--base-radius-control)",
    background: "var(--semantic-color-surface-page)",
    color: "var(--semantic-color-text-muted)",
    cursor: "pointer",
    fontFamily: "var(--component-paragraph-font-family)",
    fontSize: "var(--semantic-font-size-body-sm)",
    padding: "var(--base-spacing-4) var(--base-spacing-8)"
  },
  filterButtonActive: {
    background: "var(--semantic-color-action-background)",
    borderColor: "var(--semantic-color-action-background)",
    color: "var(--semantic-color-action-foreground)"
  },
  rule: {
    padding: "var(--base-spacing-20)",
    border: "1px solid var(--semantic-color-border-subtle)",
    borderRadius: "var(--base-radius-control)",
    background: "var(--semantic-color-surface-panel)"
  },
  meta: {
    display: "flex",
    flexWrap: "wrap",
    gap: "var(--base-spacing-8)",
    marginTop: "var(--base-spacing-12)"
  },
  examples: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "var(--base-spacing-12)",
    marginTop: "var(--base-spacing-16)"
  },
  example: {
    minWidth: 0,
    padding: "var(--base-spacing-12)",
    border: "1px solid var(--semantic-color-border-subtle)",
    borderRadius: "var(--base-radius-control)",
    background: "var(--semantic-color-surface-page)"
  },
  exampleLabelWrap: {
    display: "flex",
    marginBottom: "var(--base-spacing-8)"
  },
  demoRow: {
    display: "flex",
    alignItems: "center",
    gap: "var(--base-spacing-8)",
    flexWrap: "wrap"
  },
  demoColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "var(--base-spacing-8)"
  },
  demoText: {
    margin: 0,
    color: "var(--semantic-color-text-muted)",
    fontFamily: "var(--component-paragraph-font-family)",
    fontSize: "var(--semantic-font-size-body-sm)"
  },
  demoRail: {
    boxSizing: "border-box",
    width: "100%",
    padding: "var(--base-spacing-8)",
    border: "1px dashed var(--semantic-color-border-default)",
    borderRadius: "var(--base-radius-control)"
  },
  tag: {
    padding: "var(--base-spacing-4) var(--base-spacing-8)",
    borderRadius: "var(--base-radius-control)",
    background: "var(--semantic-color-surface-page)",
    color: "var(--semantic-color-text-muted)",
    fontFamily: "monospace",
    fontSize: "var(--semantic-font-size-body-xs)"
  }
};

function parseRuleFile(source, filePath) {
  const lines = source.split("\n");
  const component = getScalar(lines, "component");
  const components = getList(lines, "components");
  const rules = [];

  let currentRule = null;
  let activeListKey = null;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("- id:")) {
      currentRule = {
        id: valueAfterColon(trimmed),
        requirement: "",
        do: "",
        dont: "",
        applies_to: []
      };
      rules.push(currentRule);
      activeListKey = null;
      continue;
    }

    if (!currentRule) continue;

    if (trimmed.startsWith("requirement:")) {
      currentRule.requirement = valueAfterColon(trimmed);
      activeListKey = null;
      continue;
    }

    if (trimmed.startsWith("do:")) {
      currentRule.do = valueAfterColon(trimmed);
      activeListKey = null;
      continue;
    }

    if (trimmed.startsWith("dont:")) {
      currentRule.dont = valueAfterColon(trimmed);
      activeListKey = null;
      continue;
    }

    if (trimmed.endsWith(":")) {
      activeListKey = trimmed.slice(0, -1);
      if (!Array.isArray(currentRule[activeListKey])) {
        currentRule[activeListKey] = [];
      }
      continue;
    }

    if (activeListKey && trimmed.startsWith("- ")) {
      currentRule[activeListKey].push(trimmed.slice(2));
    }
  }

  return {
    filePath,
    components: components.length ? components : [component].filter(Boolean),
    rules
  };
}

function getScalar(lines, key) {
  const match = lines.find((line) => !line.startsWith(" ") && line.trim().startsWith(`${key}:`));
  return match ? valueAfterColon(match.trim()) : "";
}

function getList(lines, key) {
  const inline = getScalar(lines, key);

  if (inline.startsWith("[") && inline.endsWith("]")) {
    return inline
      .slice(1, -1)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  const list = [];
  const startIndex = lines.findIndex((line) => !line.startsWith(" ") && line.trim() === `${key}:`);

  if (startIndex === -1) return list;

  for (const line of lines.slice(startIndex + 1)) {
    const trimmed = line.trim();

    if (!line.startsWith(" ") || trimmed.endsWith(":")) break;
    if (trimmed.startsWith("- ")) list.push(trimmed.slice(2));
  }

  return list;
}

function valueAfterColon(value) {
  return value.slice(value.indexOf(":") + 1).trim().replace(/^["']|["']$/g, "");
}

function groupRulesByComponent(files) {
  return files.reduce((groups, file) => {
    file.rules.forEach((rule) => {
      const ruleComponents = rule.components?.length ? rule.components : file.components;

      ruleComponents.forEach((component) => {
        if (!groups[component]) groups[component] = [];

        groups[component].push({
          ...rule,
          components: ruleComponents,
          filePath: file.filePath
        });
      });
    });

    return groups;
  }, {});
}

function RuleExamples({ rule, componentName }) {
  if (rule.id.startsWith("system-")) {
    return <SystemRuleExamples rule={rule} />;
  }

  if (rule.id.startsWith("badge-")) {
    return <BadgeRuleExamples rule={rule} />;
  }

  if (rule.id.startsWith("button-")) {
    if (componentName === "IconButton") {
      return <IconButtonRuleExamples rule={rule} />;
    }

    return <ButtonRuleExamples rule={rule} />;
  }

  return (
    <div style={styles.examples}>
      <div style={styles.example}>
        <ExampleLabel type="do" />
        <Paragraph size="sm">{rule.do}</Paragraph>
      </div>
      <div style={styles.example}>
        <ExampleLabel type="dont" />
        <Paragraph size="sm">{rule.dont}</Paragraph>
      </div>
    </div>
  );
}

function ExampleLabel({ type }) {
  const isDo = type === "do";

  return (
    <div style={styles.exampleLabelWrap}>
      <MessageBadge status={isDo ? "success" : "error"}>
        {isDo ? "Do" : "Don't"}
      </MessageBadge>
    </div>
  );
}

function SystemRuleExamples({ rule }) {
  const demos = {
    "system-heading-sentence-case": {
      do: <Heading as="h2" size="md">Payment details</Heading>,
      dont: <Heading as="h2" size="md">Payment Details</Heading>
    }
  };
  const demo = demos[rule.id];

  if (!demo) return null;

  return (
    <div style={styles.examples}>
      <div style={styles.example}>
        <ExampleLabel type="do" />
        {demo.do}
      </div>
      <div style={styles.example}>
        <ExampleLabel type="dont" />
        {demo.dont}
      </div>
    </div>
  );
}

function BadgeRuleExamples({ rule }) {
  const demos = {
    "badge-natural-width": {
      do: <MessageBadge status="success">Active</MessageBadge>,
      dont: (
        <div className="a1-rule-demo-badge-fill" style={styles.demoRail}>
          <MessageBadge status="success">Active</MessageBadge>
        </div>
      )
    },
    "badge-short-label": {
      do: <MessageBadge status="info">Beta</MessageBadge>,
      dont: <MessageBadge status="info">This feature is currently in beta testing</MessageBadge>
    },
    "badge-status-clarity": {
      do: <MessageBadge status="warn">Pending</MessageBadge>,
      dont: <MessageBadge status="info">Open settings</MessageBadge>
    },
    "badge-not-actionable-by-default": {
      do: <Button variant="secondary">Filter by status</Button>,
      dont: <MessageBadge status="info" className="a1-rule-demo-clickable-badge">Filter</MessageBadge>
    },
    "badge-color-not-alone": {
      do: <MessageBadge status="error">Error</MessageBadge>,
      dont: <MessageBadge status="error" aria-label="Status" className="a1-rule-demo-color-only-badge"> </MessageBadge>
    },
    "badge-accessible-contrast": {
      do: <MessageBadge status="success">Success</MessageBadge>,
      dont: <MessageBadge status="success" className="a1-rule-demo-low-contrast-badge">Success</MessageBadge>
    },
    "badge-consistent-meaning": {
      do: (
        <div style={styles.demoRow}>
          <MessageBadge status="success">Approved</MessageBadge>
          <MessageBadge status="error">Failed</MessageBadge>
        </div>
      ),
      dont: (
        <div style={styles.demoRow}>
          <MessageBadge status="success">Approved</MessageBadge>
          <MessageBadge status="success">Failed</MessageBadge>
        </div>
      )
    },
    "badge-semantic-variant-before-custom": {
      do: <MessageBadge status="info">Info</MessageBadge>,
      dont: <MessageBadge status="info" className="a1-rule-demo-custom-badge">Launch</MessageBadge>
    },
    "badge-icon-supportive": {
      do: <MessageBadge status="success" icon="check_circle">Verified</MessageBadge>,
      dont: <MessageBadge status="neutral" icon="star">Draft</MessageBadge>
    },
    "badge-icon-not-required-for-status": {
      do: <MessageBadge status="warn" icon="warning">Past due</MessageBadge>,
      dont: <MessageBadge status="warn" icon="warning" aria-label="Past due"> </MessageBadge>
    },
    "badge-readable-type-size": {
      do: <MessageBadge status="neutral">Draft</MessageBadge>,
      dont: <MessageBadge status="neutral" className="a1-rule-demo-tiny-badge">Draft</MessageBadge>
    },
    "badge-stable-height": {
      do: (
        <div style={styles.demoRow}>
          <MessageBadge status="neutral">Draft</MessageBadge>
          <MessageBadge status="success">Active</MessageBadge>
        </div>
      ),
      dont: (
        <div style={styles.demoRow}>
          <MessageBadge status="neutral">Draft</MessageBadge>
          <MessageBadge status="success" className="a1-rule-demo-tall-badge">Active</MessageBadge>
        </div>
      )
    },
    "badge-appropriate-density": {
      do: <MessageBadge status="neutral" className="a1-rule-demo-compact-badge">New</MessageBadge>,
      dont: <MessageBadge status="neutral" className="a1-rule-demo-oversized-badge">New</MessageBadge>
    },
    "badge-inline-alignment": {
      do: (
        <div style={styles.demoRow}>
          <span style={styles.demoText}>Plan</span>
          <MessageBadge status="info">Beta</MessageBadge>
        </div>
      ),
      dont: (
        <div style={{ ...styles.demoRow, justifyContent: "space-between", width: "100%" }}>
          <span style={styles.demoText}>Plan</span>
          <MessageBadge status="info">Beta</MessageBadge>
        </div>
      )
    },
    "badge-count-formatting": {
      do: <MessageBadge status="neutral" icon="notifications">99+</MessageBadge>,
      dont: <MessageBadge status="neutral" icon="notifications">123456789</MessageBadge>
    },
    "badge-overuse-avoidance": {
      do: <MessageBadge status="warn">Past due</MessageBadge>,
      dont: (
        <div style={styles.demoRow}>
          <MessageBadge status="neutral">New</MessageBadge>
          <MessageBadge status="info">Beta</MessageBadge>
          <MessageBadge status="success">Active</MessageBadge>
          <MessageBadge status="warn">Soon</MessageBadge>
        </div>
      )
    },
    "badge-theme-support": {
      do: <MessageBadge status="success">Theme token</MessageBadge>,
      dont: <MessageBadge status="success" className="a1-rule-demo-hardcoded-badge">Hard-coded</MessageBadge>
    },
    "badge-truncation-rules": {
      do: <MessageBadge status="info">Optional</MessageBadge>,
      dont: <MessageBadge status="info">Optional for enterprise administrators only</MessageBadge>
    },
    "badge-localization-support": {
      do: <MessageBadge status="info">In review</MessageBadge>,
      dont: <MessageBadge status="info" className="a1-rule-demo-fixed-badge">Ausstehende Genehmigung</MessageBadge>
    },
    "badge-screen-reader-meaning": {
      do: <MessageBadge status="error">Payment failed</MessageBadge>,
      dont: <MessageBadge status="error" aria-label="Red status">!</MessageBadge>
    }
  };
  const demo = demos[rule.id];

  if (!demo) return null;

  return (
    <div style={styles.examples}>
      <style>
        {`
          .a1-rule-demo-badge-fill .a1-message-badge {
            display: flex;
            width: 100%;
            justify-content: center;
          }
          .a1-rule-demo-clickable-badge {
            cursor: pointer;
            box-shadow: inset 0 0 0 1px currentColor;
          }
          .a1-rule-demo-color-only-badge {
            min-width: 40px;
          }
          .a1-rule-demo-low-contrast-badge {
            background: var(--semantic-color-status-success-surface);
            color: var(--semantic-color-status-success-border);
          }
          .a1-rule-demo-custom-badge {
            background: #f97316;
            color: #fff7ed;
          }
          .a1-rule-demo-tiny-badge {
            font-size: 0.5625rem;
          }
          .a1-rule-demo-tall-badge {
            padding-block: var(--base-spacing-12);
          }
          .a1-rule-demo-compact-badge {
            padding-block: 2px;
            padding-inline: var(--base-spacing-8);
          }
          .a1-rule-demo-oversized-badge {
            padding: var(--base-spacing-16) var(--base-spacing-24);
            font-size: var(--semantic-font-size-body-md);
          }
          .a1-rule-demo-hardcoded-badge {
            background: #22c55e;
            color: #052e16;
          }
          .a1-rule-demo-fixed-badge {
            max-width: 72px;
            overflow: hidden;
            text-overflow: clip;
          }
        `}
      </style>
      <div style={styles.example}>
        <ExampleLabel type="do" />
        {demo.do}
      </div>
      <div style={styles.example}>
        <ExampleLabel type="dont" />
        {demo.dont}
      </div>
    </div>
  );
}

function ButtonRuleExamples({ rule }) {
  const demos = {
    "button-clear-action-label": {
      do: <Button>Save changes</Button>,
      dont: <Button>Submit</Button>
    },
    "button-visual-hierarchy": {
      do: (
        <div style={styles.demoRow}>
          <Button>Save changes</Button>
          <Button variant="secondary">Preview</Button>
          <Button variant="tertiary">Cancel</Button>
        </div>
      ),
      dont: (
        <div style={styles.demoRow}>
          <Button>Save</Button>
          <Button>Preview</Button>
          <Button>Cancel</Button>
        </div>
      )
    },
    "button-single-primary-action": {
      do: (
        <div style={styles.demoRow}>
          <Button>Publish</Button>
          <Button variant="secondary">Save draft</Button>
          <Button variant="tertiary">Cancel</Button>
        </div>
      ),
      dont: (
        <div style={styles.demoRow}>
          <Button>Publish</Button>
          <Button>Save draft</Button>
          <Button>Schedule</Button>
        </div>
      )
    },
    "button-not-color-alone": {
      do: <Button variant="destructive" icon="delete">Delete project</Button>,
      dont: <Button className="a1-rule-demo-red-only">Project</Button>
    },
    "button-destructive-clarity": {
      do: <Button variant="destructive" icon="delete">Delete project</Button>,
      dont: <Button variant="destructive">Confirm</Button>
    },
    "button-appropriate-visual-weight": {
      do: (
        <div style={styles.demoRow}>
          <Button>Invite member</Button>
          <Button variant="tertiary">Remove member</Button>
        </div>
      ),
      dont: (
        <div style={styles.demoRow}>
          <Button>Remove member</Button>
          <Button variant="secondary">Invite member</Button>
        </div>
      )
    },
    "button-short-specific-labels": {
      do: <Button>Download report</Button>,
      dont: <Button>Click here to download the full monthly performance report</Button>
    },
    "button-verb-first-labels": {
      do: <Button>Edit profile</Button>,
      dont: <Button>Profile</Button>
    },
    "button-consistent-placement": {
      do: (
        <div style={styles.demoColumn}>
          <div style={styles.demoRow}><Button variant="tertiary">Cancel</Button><Button>Save changes</Button></div>
          <div style={styles.demoRow}><Button variant="tertiary">Cancel</Button><Button>Create account</Button></div>
        </div>
      ),
      dont: (
        <div style={styles.demoColumn}>
          <div style={styles.demoRow}><Button variant="tertiary">Cancel</Button><Button>Save changes</Button></div>
          <div style={styles.demoRow}><Button>Create account</Button><Button variant="tertiary">Cancel</Button></div>
        </div>
      )
    },
    "button-align-with-content": {
      do: (
        <div style={styles.demoColumn}>
          <p style={styles.demoText}>Project details</p>
          <Button>Edit project</Button>
        </div>
      ),
      dont: (
        <div style={{ ...styles.demoRail, display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--base-spacing-8)" }}>
          <p style={{ ...styles.demoText, alignSelf: "stretch" }}>Project details</p>
          <Button>Edit project</Button>
        </div>
      )
    },
    "button-center-alignment-context": {
      do: (
        <div style={{ ...styles.demoColumn, alignItems: "center", textAlign: "center" }}>
          <p style={styles.demoText}>No reports yet</p>
          <Button>Create report</Button>
        </div>
      ),
      dont: (
        <div style={styles.demoColumn}>
          <p style={styles.demoText}>Reports</p>
          <div style={{ ...styles.demoRail, display: "flex", justifyContent: "center" }}>
            <Button>Create report</Button>
          </div>
        </div>
      )
    },
    "button-right-alignment-contained": {
      do: (
        <div style={{ ...styles.demoRail, display: "flex", justifyContent: "flex-end" }}>
          <Button>Save changes</Button>
        </div>
      ),
      dont: (
        <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", paddingTop: "var(--base-spacing-24)" }}>
          <Button>Save changes</Button>
        </div>
      )
    },
    "button-touch-target-size": {
      do: <IconButton icon="edit" label="Edit item" />,
      dont: <Button className="a1-rule-demo-small-button" icon="edit" aria-label="Edit item" />
    },
    "button-clear-states": {
      do: (
        <div style={styles.demoRow}>
          <Button>Default</Button>
          <Button className="a1-rule-demo-focus">Focus</Button>
          <Button disabled>Disabled</Button>
          <Button icon="sync">Saving...</Button>
        </div>
      ),
      dont: <Button className="a1-rule-demo-no-state" disabled>Save</Button>
    },
    "button-visible-focus": {
      do: <Button className="a1-rule-demo-focus">Save changes</Button>,
      dont: <Button className="a1-rule-demo-no-focus">Save changes</Button>
    },
    "button-disabled-explanation": {
      do: (
        <div style={styles.demoColumn}>
          <Button disabled>Create account</Button>
          <p style={styles.demoText}>Add a valid email address to continue.</p>
        </div>
      ),
      dont: <Button disabled>Create account</Button>
    },
    "button-loading-prevents-duplicates": {
      do: <Button disabled icon="sync">Saving...</Button>,
      dont: (
        <div style={styles.demoRow}>
          <Button>Save</Button>
          <Button>Save</Button>
        </div>
      )
    },
    "button-icon-accessible-label": {
      do: <IconButton icon="close" label="Close dialog" />,
      dont: <Button icon="close" aria-hidden="true" />
    },
    "button-vs-link-usage": {
      do: (
        <div style={styles.demoRow}>
          <Button>Save settings</Button>
          <Link href="#">View documentation</Link>
        </div>
      ),
      dont: <Button as="a" href="#">Documentation</Button>
    },
    "button-limited-variant-set": {
      do: (
        <div style={styles.demoRow}>
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="tertiary">Tertiary</Button>
        </div>
      ),
      dont: (
        <div style={styles.demoRow}>
          <Button className="a1-rule-demo-one-off">Special screen button</Button>
        </div>
      )
    }
  };
  const demo = demos[rule.id];

  if (!demo) return null;

  return (
    <div style={styles.examples}>
      <style>
        {`
          .a1-rule-demo-small-button {
            width: 28px;
            min-width: 28px;
            height: 28px;
            min-height: 28px;
            max-height: 28px;
            padding: 0;
          }
          .a1-rule-demo-focus {
            outline: var(--component-button-focus-ring-width) solid var(--component-button-focus-ring);
            outline-offset: var(--component-button-focus-ring-offset);
          }
          .a1-rule-demo-no-focus:focus,
          .a1-rule-demo-no-focus {
            outline: 0;
          }
          .a1-rule-demo-no-state {
            opacity: 1;
          }
          .a1-rule-demo-one-off {
            border-radius: 999px;
            background: linear-gradient(90deg, #ec4899, #8b5cf6);
            border-color: transparent;
          }
          .a1-rule-demo-red-only {
            background: var(--semantic-color-status-error-background);
            border-color: var(--semantic-color-status-error-background);
            color: var(--semantic-color-status-error-foreground);
          }
        `}
      </style>
      <div style={styles.example}>
        <ExampleLabel type="do" />
        {demo.do}
      </div>
      <div style={styles.example}>
        <ExampleLabel type="dont" />
        {demo.dont}
      </div>
    </div>
  );
}

function IconButtonRuleExamples({ rule }) {
  const demos = {
    "button-clear-action-label": {
      do: <IconButton icon="delete" label="Delete project" />,
      dont: <IconButton icon="delete" label="Delete" />
    },
    "button-visual-hierarchy": {
      do: (
        <div style={styles.demoRow}>
          <IconButton icon="settings" label="Settings" variant="secondary" />
          <IconButton icon="more_vert" label="More options" />
        </div>
      ),
      dont: (
        <div style={styles.demoRow}>
          <IconButton icon="settings" label="Settings" variant="secondary" />
          <IconButton icon="delete" label="Delete" variant="secondary" />
          <IconButton icon="more_vert" label="More options" variant="secondary" />
        </div>
      )
    },
    "button-not-color-alone": {
      do: <IconButton icon="delete" label="Delete project" variant="destructive" />,
      dont: <IconButton icon="more_vert" label="More options" variant="destructive" />
    },
    "button-destructive-clarity": {
      do: <IconButton icon="delete" label="Delete project" variant="destructive" />,
      dont: <IconButton icon="delete" label="Confirm" variant="destructive" />
    },
    "button-appropriate-visual-weight": {
      do: (
        <div style={styles.demoRow}>
          <IconButton icon="edit" label="Edit item" variant="secondary" />
          <IconButton icon="delete" label="Delete item" />
        </div>
      ),
      dont: (
        <div style={styles.demoRow}>
          <IconButton icon="delete" label="Delete item" variant="secondary" />
          <IconButton icon="edit" label="Edit item" />
        </div>
      )
    },
    "button-short-specific-labels": {
      do: <IconButton icon="download" label="Download report" />,
      dont: <IconButton icon="download" label="Click here to download the full monthly performance report" />
    },
    "button-verb-first-labels": {
      do: <IconButton icon="edit" label="Edit profile" />,
      dont: <IconButton icon="person" label="Profile" />
    },
    "button-consistent-placement": {
      do: (
        <div style={styles.demoColumn}>
          <div style={styles.demoRow}><IconButton icon="edit" label="Edit item" /><IconButton icon="delete" label="Delete item" /></div>
          <div style={styles.demoRow}><IconButton icon="edit" label="Edit member" /><IconButton icon="delete" label="Delete member" /></div>
        </div>
      ),
      dont: (
        <div style={styles.demoColumn}>
          <div style={styles.demoRow}><IconButton icon="edit" label="Edit item" /><IconButton icon="delete" label="Delete item" /></div>
          <div style={styles.demoRow}><IconButton icon="delete" label="Delete member" /><IconButton icon="edit" label="Edit member" /></div>
        </div>
      )
    },
    "button-align-with-content": {
      do: (
        <div style={styles.demoColumn}>
          <p style={styles.demoText}>Project details</p>
          <IconButton icon="edit" label="Edit project" />
        </div>
      ),
      dont: (
        <div style={{ ...styles.demoRail, display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--base-spacing-8)" }}>
          <p style={{ ...styles.demoText, alignSelf: "stretch" }}>Project details</p>
          <IconButton icon="edit" label="Edit project" />
        </div>
      )
    },
    "button-center-alignment-context": {
      do: (
        <div style={{ ...styles.demoColumn, alignItems: "center", textAlign: "center" }}>
          <p style={styles.demoText}>No reports yet</p>
          <IconButton icon="add" label="Create report" variant="secondary" />
        </div>
      ),
      dont: (
        <div style={styles.demoColumn}>
          <p style={styles.demoText}>Reports</p>
          <div style={{ ...styles.demoRail, display: "flex", justifyContent: "center" }}>
            <IconButton icon="add" label="Create report" variant="secondary" />
          </div>
        </div>
      )
    },
    "button-right-alignment-contained": {
      do: (
        <div style={{ ...styles.demoRail, display: "flex", justifyContent: "flex-end" }}>
          <IconButton icon="save" label="Save changes" variant="secondary" />
        </div>
      ),
      dont: (
        <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", paddingTop: "var(--base-spacing-24)" }}>
          <IconButton icon="save" label="Save changes" variant="secondary" />
        </div>
      )
    },
    "button-touch-target-size": {
      do: <IconButton icon="edit" label="Edit item" />,
      dont: <IconButton icon="edit" label="Edit item" className="a1-rule-demo-small-icon-button" />
    },
    "button-clear-states": {
      do: (
        <div style={styles.demoRow}>
          <IconButton icon="edit" label="Edit item" />
          <IconButton icon="edit" label="Focused edit item" className="a1-rule-demo-icon-focus" />
          <IconButton icon="edit" label="Edit item unavailable" disabled />
        </div>
      ),
      dont: <IconButton icon="edit" label="Edit item unavailable" disabled className="a1-rule-demo-icon-no-state" />
    },
    "button-visible-focus": {
      do: <IconButton icon="edit" label="Edit item" className="a1-rule-demo-icon-focus" />,
      dont: <IconButton icon="edit" label="Edit item" className="a1-rule-demo-icon-no-focus" />
    },
    "button-disabled-explanation": {
      do: (
        <div style={styles.demoColumn}>
          <IconButton icon="send" label="Send invitation" disabled />
          <p style={styles.demoText}>Add an email address to send an invitation.</p>
        </div>
      ),
      dont: <IconButton icon="send" label="Send invitation" disabled />
    },
    "button-loading-prevents-duplicates": {
      do: <IconButton icon="sync" label="Saving changes" disabled />,
      dont: (
        <div style={styles.demoRow}>
          <IconButton icon="save" label="Save changes" />
          <IconButton icon="save" label="Save changes" />
        </div>
      )
    },
    "button-icon-accessible-label": {
      do: <IconButton icon="close" label="Close dialog" />,
      dont: <button className="a1-icon-button a1-icon-button--tertiary" type="button"><span className="material-symbols-outlined">close</span></button>
    },
    "button-vs-link-usage": {
      do: (
        <div style={styles.demoRow}>
          <IconButton icon="settings" label="Open settings" />
          <Link href="#" icon="open_in_new" iconPosition="end">Docs</Link>
        </div>
      ),
      dont: <a className="a1-icon-button a1-icon-button--tertiary" href="#"><span className="material-symbols-outlined">docs</span></a>
    },
    "button-limited-variant-set": {
      do: (
        <div style={styles.demoRow}>
          <IconButton icon="settings" label="Settings" />
          <IconButton icon="settings" label="Settings" variant="secondary" />
        </div>
      ),
      dont: <IconButton icon="settings" label="Settings" className="a1-rule-demo-one-off-icon-button" />
    }
  };
  const demo = demos[rule.id];

  if (!demo) return null;

  return (
    <div style={styles.examples}>
      <style>
        {`
          .a1-rule-demo-small-icon-button {
            height: 28px;
            width: 28px;
          }
          .a1-rule-demo-icon-focus {
            outline: var(--component-button-focus-ring-width) solid var(--component-button-focus-ring);
            outline-offset: var(--component-icon-button-focus-ring-offset);
          }
          .a1-rule-demo-icon-no-focus:focus,
          .a1-rule-demo-icon-no-focus {
            outline: 0;
          }
          .a1-rule-demo-icon-no-state {
            opacity: 1;
          }
          .a1-rule-demo-one-off-icon-button {
            border-radius: 999px;
            background: linear-gradient(90deg, #ec4899, #8b5cf6);
            border-color: transparent;
            color: white;
          }
        `}
      </style>
      <div style={styles.example}>
        <ExampleLabel type="do" />
        {demo.do}
      </div>
      <div style={styles.example}>
        <ExampleLabel type="dont" />
        {demo.dont}
      </div>
    </div>
  );
}

const parsedRuleFiles = Object.entries(ruleFiles).map(([filePath, source]) =>
  parseRuleFile(source, filePath)
);

const groupedRules = groupRulesByComponent(parsedRuleFiles);

const meta = {
  title: "Rules",
  parameters: {
    layout: "centered",
    controls: { disable: true }
  }
};

export default meta;

function ComponentRulesPage({ componentName, title, source }) {
  const [activeTag, setActiveTag] = useState("all");
  const rules = groupedRules[componentName] ?? [];
  const tags = Array.from(new Set(rules.flatMap((rule) => rule.applies_to ?? []))).sort();
  const tagCounts = tags.reduce((counts, tag) => {
    counts[tag] = rules.filter((rule) => rule.applies_to?.includes(tag)).length;
    return counts;
  }, {});
  const filteredRules = activeTag === "all"
    ? rules
    : rules.filter((rule) => rule.applies_to?.includes(activeTag));

  return (
    <div style={styles.page}>
      <section style={styles.intro}>
        <Heading as="h1" type="display" size="xl">
          {title}
        </Heading>
        <Paragraph color="muted">
          Component rules from {source}. Rules can still identify multiple
          components when a rule spans them.
        </Paragraph>
      </section>

      <section style={styles.group}>
        <div style={styles.filter} aria-label={`${title} tag filter`}>
          <Paragraph size="sm" color="muted">
            Filter by tag
          </Paragraph>
          <div style={styles.filterList}>
            {["all", ...tags].map((tag) => {
              const isActive = activeTag === tag;

              return (
                <button
                  key={tag}
                  type="button"
                  style={{
                    ...styles.filterButton,
                    ...(isActive ? styles.filterButtonActive : {})
                  }}
                  aria-pressed={isActive}
                  onClick={() => setActiveTag(tag)}
                >
                  {tag === "all" ? `All (${rules.length})` : `${tag} (${tagCounts[tag]})`}
                </button>
              );
            })}
          </div>
        </div>

        <div style={styles.ruleList}>
          {filteredRules.map((rule) => (
            <article key={`${rule.filePath}-${rule.id}`} style={styles.rule}>
              <Heading as="h2" size="xs">
                {rule.id}
              </Heading>
              <Paragraph>{rule.requirement}</Paragraph>
              <RuleExamples rule={rule} componentName={componentName} />
              <div style={styles.meta}>
                {rule.components.length > 1 && (
                  <span style={styles.tag}>components: {rule.components.join(", ")}</span>
                )}
                {rule.applies_to?.map((area) => (
                  <span key={area} style={styles.tag}>
                    {area}
                  </span>
                ))}
              </div>
            </article>
          ))}
          {filteredRules.length === 0 && (
            <Paragraph color="muted">
              No rules match this tag.
            </Paragraph>
          )}
        </div>
      </section>
    </div>
  );
}

export const Badge = {
  name: "Badge",
  render: () => (
    <ComponentRulesPage
      componentName="Badge"
      title="Badge Rules"
      source="system/rules/message-badge.yaml"
    />
  )
};

export const SystemRules = {
  name: "System",
  render: () => (
    <ComponentRulesPage
      componentName="System"
      title="System Rules"
      source="system/rules/system.yaml"
    />
  )
};

export const HeadingRules = {
  name: "Heading",
  render: () => (
    <ComponentRulesPage
      componentName="Heading"
      title="Heading Rules"
      source="system/rules/system.yaml"
    />
  )
};

export const IconButtonRules = {
  name: "Icon Button",
  render: () => (
    <ComponentRulesPage
      componentName="IconButton"
      title="Icon Button Rules"
      source="system/rules/button.yaml"
    />
  )
};

export const ButtonRules = {
  name: "Button",
  render: () => (
    <ComponentRulesPage
      componentName="Button"
      title="Button Rules"
      source="system/rules/button.yaml"
    />
  )
};
