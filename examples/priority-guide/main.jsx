import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Button,
  ButtonContainer,
  Card,
  Divider,
  Grid,
  Heading,
  Icon,
  Link,
  MessageBadge,
  PageLayout,
  Paragraph,
  Section,
  SelectField,
  SideNav,
  SideNavItem,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextareaField,
  TextField,
} from "../../packages/react/src/index.js";
import "./styles.css";
import { componentThumbnailMap } from "../../packages/react/src/illustrations/ComponentThumbnails.jsx";
import clinicGuide from "./guides/clinic.json";
import libraryGuide from "./guides/library.json";
import incidentGuide from "./guides/incident.json";
import trailGuide from "./guides/trail.json";

const principles = [
  {
    icon: "flag",
    title: "Goals before screens",
    description:
      "Capture the user goal, business goal, and decision the page needs to support before anyone chooses a layout.",
  },
  {
    icon: "sort",
    title: "Priority before polish",
    description:
      "Sort content and functionality by relevance from top to bottom, using real words instead of empty boxes.",
  },
  {
    icon: "forum",
    title: (
      <>
        <strong>A</strong>l<strong>i</strong>gnment before <strong>AI</strong>
      </>
    ),
    key: "alignment-before-ai",
    description:
      "Give designers, writers, developers, stakeholders, and AI tools the same content hierarchy to work from.",
  },
];

const workflow = [
  ["01", "Name the page goal", "What should a person understand, decide, or do here?"],
  ["02", "List real content", "Add only content and functionality that helps the user and the business goal."],
  ["03", "Rank the hierarchy", "Move the most critical information to the top and challenge everything below it."],
  ["04", "Annotate behavior", "Capture interactions, states, links, and responsive notes before prototyping."],
];

const startTips = [
  {
    icon: "flag",
    title: "Lead with the decision",
    description: "Name the choice the page needs to support before listing sections or interface ideas.",
  },
  {
    icon: "groups",
    title: "Include the real audience",
    description: "Describe who is reading, what they already know, and what would make them hesitate.",
  },
  {
    icon: "block",
    title: "Set boundaries early",
    description: "Call out what is out of scope so the generated guide stays focused and reviewable.",
  },
  {
    icon: "edit_note",
    title: "Ask for annotations",
    description: "Request short notes explaining why each element exists, what it links to, or how it behaves.",
  },
];

const examplePrompt =
  "Create a priority guide for a public library workshop page. The audience is adults deciding whether a free digital skills class is useful and accessible. Include the problem statement, decision needed, out-of-scope items, contributors, prioritized content elements, component types, and side annotations for each element.";

const exampleGuides = [clinicGuide, libraryGuide, incidentGuide, trailGuide];

const itemComponentOptions = [
  "Alert",
  "Banner",
  "Button",
  "Card",
  "Checklist",
  "Details",
  "Form",
  "Heading",
  "Image",
  "Link",
  "List",
  "Paragraph",
  "Status",
  "Table",
  "Tabs",
  "Timeline",
];

const pageIds = ["home", "examples", "start", "editor"];

function getRouteBase(pathname = window.location.pathname) {
  return pathname.startsWith("/examples/priority-guide") ? "/examples/priority-guide" : "";
}

function getRoute(pathname = window.location.pathname, search = window.location.search, hash = window.location.hash) {
  const params = new URLSearchParams(search);
  const pageParam = params.get("page");
  const page = pageIds.includes(pageParam) ? pageParam : "home";
  const guide = params.get("guide");

  return {
    page,
    guide: exampleGuides.some((item) => item.id === guide) ? guide : exampleGuides[0].id,
    hash: hash.replace(/^#/, ""),
  };
}

function getRoutePath(page = "home", { guide, hash } = {}) {
  const base = getRouteBase();
  const pagePath = base ? `${base}/` : "/";
  const params = new URLSearchParams();

  if (page === "examples") {
    params.set("page", "examples");

    if (guide && guide !== exampleGuides[0].id) {
      params.set("guide", guide);
    }
  } else if (page === "start") {
    params.set("page", "start");
  } else if (page === "editor") {
    params.set("page", "editor");
  }

  const query = params.toString();

  return `${pagePath}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
}

function isPlainLeftClick(event) {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.shiftKey
  );
}

function InlineEditable({ value, onChange, multiline = false, inputClassName = "", children }) {
  const [editing, setEditing] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      ref.current.select?.();
    }
  }, [editing]);

  if (editing) {
    return multiline ? (
      <textarea
        ref={ref}
        className={`priority-guide-inline-input ${inputClassName}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setEditing(false)}
        onKeyDown={(e) => { if (e.key === "Escape") setEditing(false); }}
      />
    ) : (
      <input
        ref={ref}
        type="text"
        className={`priority-guide-inline-input ${inputClassName}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setEditing(false)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") setEditing(false); }}
      />
    );
  }

  return (
    <div
      className="priority-guide-inline-editable"
      onClick={() => setEditing(true)}
      onKeyDown={(e) => { if (e.key === "Enter") setEditing(true); }}
      tabIndex={0}
      role="button"
      aria-label="Click to edit"
    >
      {children}
    </div>
  );
}

function PriorityGuideMeta({ label, value, onChange }) {
  return (
    <div className="priority-guide-meta">
      <dt>{label}</dt>
      <dd>
        {onChange ? (
          <InlineEditable value={value} onChange={onChange}>{value}</InlineEditable>
        ) : value}
      </dd>
    </div>
  );
}

function parseCheckboxLines(text) {
  return text.split("\n").map((l) => l.trim()).filter(Boolean).map((line) => {
    const match = line.match(/^-\s*\[(x|X|\s*)\]\s*(.*)$/);
    if (match) return { checked: match[1].trim().toLowerCase() === "x", text: match[2] };
    return { checked: false, text: line.replace(/^-\s+/, "") };
  });
}

function PriorityGuideContext({ label, value, onChange, checkable }) {
  if (checkable) {
    const lines = parseCheckboxLines(value);
    const listContent = (
      <ul className="priority-guide-context__checklist">
        {lines.map((item, i) => (
          <li key={i} className={item.checked ? "priority-guide-context__item--done" : ""}>
            {item.text}
          </li>
        ))}
      </ul>
    );

    return (
      <div className="priority-guide-context">
        <dt>{label}</dt>
        <dd>
          {onChange ? (
            <InlineEditable value={value} onChange={onChange}>{listContent}</InlineEditable>
          ) : listContent}
        </dd>
      </div>
    );
  }

  const content = onChange
    ? <InlineEditable value={value} onChange={onChange}>{value}</InlineEditable>
    : value;

  return (
    <div className="priority-guide-context">
      <dt>{label}</dt>
      <dd>{content}</dd>
    </div>
  );
}

function EditableRank({ index, total, onMoveTo }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    if (editing) {
      setVal(String(index + 1));
      ref.current?.focus();
      ref.current?.select();
    }
  }, [editing, index]);

  function commit() {
    const n = parseInt(val, 10);
    if (!isNaN(n) && n >= 1 && n <= total && n - 1 !== index) {
      onMoveTo(n - 1);
    }
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        ref={ref}
        type="number"
        min="1"
        max={total}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); commit(); }
          if (e.key === "Escape") setEditing(false);
        }}
        onClick={(e) => e.stopPropagation()}
        className="priority-guide-document__rank-input"
        aria-label="Change priority order"
      />
    );
  }

  return (
    <div
      className="priority-guide-document__rank priority-guide-document__rank--editable"
      aria-label={`Priority ${index + 1}, click to change`}
      title="Click to change order"
      onClick={(e) => { e.stopPropagation(); setEditing(true); }}
    >
      {index + 1}
    </div>
  );
}

function PriorityGuideItem({ item, index, onSelect, onMove, total, onFieldChange }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const classNames = [
    "priority-guide-document__item",
    onSelect ? "priority-guide-document__item--interactive" : "",
    onMove ? "priority-guide-document__item--draggable" : "",
    isDragOver ? "priority-guide-document__item--drag-over" : "",
  ].filter(Boolean).join(" ");

  return (
    <li
      className={classNames}
      onClick={onSelect}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={onSelect ? (e) => { if (e.key === "Enter" || e.key === " ") onSelect(); } : undefined}
      draggable={!!onMove}
      onDragStart={onMove ? (e) => {
        e.dataTransfer.setData("text/plain", String(index));
        e.dataTransfer.effectAllowed = "move";
      } : undefined}
      onDragOver={onMove ? (e) => { e.preventDefault(); setIsDragOver(true); } : undefined}
      onDragLeave={onMove ? () => setIsDragOver(false) : undefined}
      onDragEnd={onMove ? () => setIsDragOver(false) : undefined}
      onDrop={onMove ? (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const from = parseInt(e.dataTransfer.getData("text/plain"), 10);
        if (!isNaN(from) && from !== index) onMove(from, index);
      } : undefined}
    >
      {onMove ? (
        <EditableRank index={index} total={total} onMoveTo={(to) => onMove(index, to)} />
      ) : (
        <div className="priority-guide-document__rank" aria-label={`Priority ${index + 1}`}>
          {index + 1}
        </div>
      )}
      <div className="priority-guide-document__item-body">
        <div className="priority-guide-document__element-meta">
          <div className="priority-guide-document__element-meta-labels">
            <span className="priority-guide-kicker">{item.type}</span>
            {item.componentType && (
              <span className="priority-guide-document__element-type">{item.componentType}</span>
            )}
          </div>
          {componentThumbnailMap[item.componentType] && (() => {
            const Thumb = componentThumbnailMap[item.componentType];
            return <Thumb className="priority-guide-document__component-thumb" />;
          })()}
        </div>
        {onFieldChange ? (
          <InlineEditable value={item.title} onChange={(v) => onFieldChange("title", v)}>
            <Heading as="h3" size="sm">{item.title}</Heading>
          </InlineEditable>
        ) : (
          <Heading as="h3" size="sm">{item.title}</Heading>
        )}
        {onFieldChange ? (
          <InlineEditable value={item.content} onChange={(v) => onFieldChange("content", v)} multiline>
            <Paragraph size="md" color="muted">{item.content}</Paragraph>
          </InlineEditable>
        ) : (
          <Paragraph size="md" color="muted">{item.content}</Paragraph>
        )}
      </div>
      {item.annotations?.filter(Boolean).length > 0 && (
        <aside className="priority-guide-document__annotations" aria-label={`Annotations for ${item.title}`}>
          <ul>
            {item.annotations.filter(Boolean).map((annotation, i) => (
              <li key={i}>{annotation}</li>
            ))}
          </ul>
        </aside>
      )}
    </li>
  );
}

function PriorityGuideDocument({ guide, compact = false, onFieldChange, onContextChange, overviewOpen = true, onOverviewToggle, onItemSelect, onItemMove, onAddItem }) {
  const headingId = `${guide.title.replace(/\W+/g, "-")}-problem`;

  return (
    <article className={`priority-guide-document${compact ? " priority-guide-document--compact" : ""}`}>
      <div className="priority-guide-document__header">
        <div>
          <span className="priority-guide-kicker">{guide.context}</span>
          <Heading as="h2" size={compact ? "sm" : "md"}>
            {guide.title}
          </Heading>
        </div>
      </div>
      <div
        className={`priority-guide-document__overview-header${onOverviewToggle ? " priority-guide-document__overview-header--interactive" : ""}`}
        onClick={onOverviewToggle}
        role={onOverviewToggle ? "button" : undefined}
        tabIndex={onOverviewToggle ? 0 : undefined}
        onKeyDown={onOverviewToggle ? (e) => { if (e.key === "Enter" || e.key === " ") onOverviewToggle(); } : undefined}
        aria-expanded={onOverviewToggle ? overviewOpen : undefined}
      >
        {onOverviewToggle && (
          <Icon name={overviewOpen ? "expand_less" : "expand_more"} className="priority-guide-collapse-icon" />
        )}
        <span className="priority-guide-kicker">Overview</span>
      </div>
      {overviewOpen && <div className="priority-guide-document__brief">
        <section className="priority-guide-document__problem" aria-labelledby={headingId}>
          <span className="priority-guide-kicker">Problem statement</span>
          {onFieldChange ? (
            <InlineEditable
              value={guide.problemStatement}
              onChange={(v) => onFieldChange("problemStatement", v)}
              multiline
            >
              <Paragraph size="md" id={headingId}>{guide.problemStatement}</Paragraph>
            </InlineEditable>
          ) : (
            <Paragraph size="md" id={headingId}>{guide.problemStatement}</Paragraph>
          )}
        </section>
        {guide.contextDetails?.length > 0 && (
          <dl className="priority-guide-document__context" aria-label="Additional context">
            {guide.contextDetails.map((item, index) => (
              <PriorityGuideContext
                key={item.label}
                label={item.label}
                value={item.value}
                onChange={onContextChange ? (v) => onContextChange(index, v) : undefined}
                checkable={item.checkable}
              />
            ))}
          </dl>
        )}
        <dl className="priority-guide-document__meta">
          <PriorityGuideMeta
            label="Audience"
            value={guide.audience}
            onChange={onFieldChange ? (v) => onFieldChange("audience", v) : undefined}
          />
          <PriorityGuideMeta
            label="User goal"
            value={guide.userGoal}
            onChange={onFieldChange ? (v) => onFieldChange("userGoal", v) : undefined}
          />
          {!compact && (
            <PriorityGuideMeta
              label="Business goal"
              value={guide.businessGoal}
              onChange={onFieldChange ? (v) => onFieldChange("businessGoal", v) : undefined}
            />
          )}
        </dl>
      </div>}
      <ol className="priority-guide-document__list" aria-label="Prioritized content elements">
        {guide.items.map((item, index) => (
          <PriorityGuideItem
            key={item.title || index}
            item={item}
            index={index}
            onSelect={onItemSelect ? () => onItemSelect(index) : undefined}
            onMove={onItemMove}
            total={guide.items.length}
          />
        ))}
      </ol>
      {onAddItem && (
        <div className="priority-guide-document__add">
          <button className="priority-guide-document__add-btn" onClick={onAddItem}>
            <Icon name="add" />
            Add item
          </button>
        </div>
      )}
    </article>
  );
}

function ItemDetailCanvas({ item, index, onFieldChange }) {
  return (
    <article className="priority-guide-document priority-guide-document--detail">
      <ol className="priority-guide-document__list" aria-label="Item detail">
        <PriorityGuideItem item={item} index={index} onFieldChange={onFieldChange} />
      </ol>
    </article>
  );
}

function ExampleGuides({ activeGuide, onGuideChange }) {
  return (
    <Tabs value={activeGuide} onChange={onGuideChange} variant="line">
      <TabList>
        {exampleGuides.map((guide) => (
          <Tab key={guide.id} value={guide.id} icon={guide.icon}>
            {guide.tab}
          </Tab>
        ))}
      </TabList>
      {exampleGuides.map((guide) => (
        <TabPanel key={guide.id} value={guide.id}>
          <PriorityGuideDocument guide={guide} />
        </TabPanel>
      ))}
    </Tabs>
  );
}

function LandingPage({ onNavigate }) {
  return (
    <main>
      <Section className="priority-guide-hero" padding="none" inverse>
        <div className="priority-guide-shell priority-guide-hero__inner">
          <MessageBadge subtle icon="edit_note">
            Content-first alignment
          </MessageBadge>
          <div className="priority-guide-hero__copy">
            <Heading as="h1" type="display" size={{ xs: "xl", md: "xxl", lg: "jumbo" }}>
              Priority Guide
            </Heading>
            <Paragraph size="xl">
              A tool for aligning teams on real content, user goals, and functional priority before wireframes, high fidelity prototypes, or AI prompts set the shape too early.
            </Paragraph>
          </div>
          <ButtonContainer className="priority-guide-actions" align="center">
            <Button
              as="a"
              size="lg"
              href={getRoutePath("start")}
              icon="arrow_forward"
              iconPosition="end"
              onClick={(event) => onNavigate(event, "start")}
            >
              Start a guide
            </Button>
            <Button
              as="a"
              size="lg"
              href={getRoutePath("examples")}
              variant="secondary"
              icon="view_list"
              iconPosition="end"
              onClick={(event) => onNavigate(event, "examples")}
            >
              View examples
            </Button>
          </ButtonContainer>
        </div>
      </Section>

      <Section id="overview" surface="panel" className="priority-guide-overview">
        <div className="priority-guide-shell">
          <div className="priority-guide-section-heading">
            <MessageBadge subtle icon="hub">
              Why it matters
            </MessageBadge>
            <Heading as="h2" type="display" size={{ xs: "lg", md: "xl" }}>
              A shared brief for human and AI design work.
            </Heading>
            <Paragraph size="lg" color="muted">
              Priority guides keep the conversation on what the screen must communicate and how it should behave. They make the first artifact useful to writers, product partners, designers, developers, testers, and the AI tools that increasingly help teams move from intent to interface.
            </Paragraph>
          </div>
          <Grid columns={{ xs: 1, md: 3 }} gap="md" className="priority-guide-principles">
            {principles.map((principle) => (
              <Card key={principle.key ?? principle.title} as="article" icon={principle.icon} className="priority-guide-principle">
                <Heading as="h3" size="sm">
                  {principle.title}
                </Heading>
                <Paragraph size="md" color="muted">
                  {principle.description}
                </Paragraph>
              </Card>
            ))}
          </Grid>
        </div>
      </Section>

      <Section surface="raised" className="priority-guide-future">
        <div className="priority-guide-shell priority-guide-future__inner">
          <Icon name="auto_awesome" />
          <div>
            <Heading as="h2" size="md">
              Next: guide components, an editor, and AI-assisted flows.
            </Heading>
            <Paragraph size="md" color="muted">
              Future pages can turn this landing page into a working content system: reusable guide blocks, collaborative editing, AI-generated first drafts, critique prompts, and flow maps that connect guides across an experience.
            </Paragraph>
          </div>
          <Link href={getRoutePath("examples")} onClick={(event) => onNavigate(event, "examples")}>
            Explore example guides
          </Link>
        </div>
      </Section>
    </main>
  );
}

function StartPage({ onNavigate }) {
  return (
    <main>
      <Section className="priority-guide-start-hero" padding="none" inverse>
        <div className="priority-guide-shell priority-guide-start-hero__inner">
          <div className="priority-guide-start-hero__copy">
            <Heading as="h1" type="display" size={{ xs: "md", md: "lg" }}>
              Start with the page, not the pixels.
            </Heading>
            <Paragraph size="lg" color="muted">
              Describe the page, audience, decision, and constraints. The clearer the prompt, the easier it is to turn the response into a useful priority guide.
            </Paragraph>
          </div>
          <form className="priority-guide-prompt" role="search" aria-label="Create a priority guide with AI">
            <TextareaField
              label="AI prompt"
              size="comfortable"
              rows="lg"
              defaultValue={examplePrompt}
              hint="Include the audience, decision, desired outcome, out-of-scope items, and any known content."
            />
            <ButtonContainer align="center">
              <Button
                as="a"
                size="lg"
                href={getRoutePath("editor")}
                icon="arrow_forward"
                iconPosition="end"
                onClick={(e) => onNavigate(e, "editor")}
              >
                Generate guide
              </Button>
            </ButtonContainer>
          </form>
        </div>
      </Section>

      <Section className="priority-guide-start-tips">
        <div className="priority-guide-shell">
          <div className="priority-guide-section-heading">
            <MessageBadge subtle icon="tips_and_updates">
              Best practices
            </MessageBadge>
            <Heading as="h2" type="display" size={{ xs: "lg", md: "xl" }}>
              Prompt for alignment, not layout.
            </Heading>
            <Paragraph size="lg" color="muted">
              A good prompt gives AI enough context to prioritize content without jumping straight into wireframe decisions.
            </Paragraph>
          </div>

          <Grid columns={{ xs: 1, md: 2 }} gap="md" className="priority-guide-tip-grid">
            {startTips.map((tip) => (
              <Card key={tip.title} as="article" icon={tip.icon} className="priority-guide-tip">
                <Heading as="h3" size="sm">
                  {tip.title}
                </Heading>
                <Paragraph size="md" color="muted">
                  {tip.description}
                </Paragraph>
              </Card>
            ))}
          </Grid>

          <div className="priority-guide-workflow-heading">
            <MessageBadge subtle icon="low_priority">
              Workflow
            </MessageBadge>
            <Heading as="h2" size="lg">
              Shape the guide in four passes.
            </Heading>
          </div>

          <ol className="priority-guide-workflow priority-guide-start-workflow">
            {workflow.map(([number, title, description]) => (
              <li key={number}>
                <span>{number}</span>
                <div>
                  <Heading as="h3" size="xs">
                    {title}
                  </Heading>
                  <Paragraph size="sm" color="muted">
                    {description}
                  </Paragraph>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>
    </main>
  );
}

function NewGuideCanvas({ onCreateGuide, onCancel }) {
  const [name, setName] = useState("");
  const [problemStatement, setProblemStatement] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onCreateGuide({
      id: `user-${Date.now()}`,
      tab: name.trim(),
      icon: "description",
      title: name.trim(),
      context: "",
      problemStatement: problemStatement.trim(),
      audience: "",
      userGoal: "",
      businessGoal: "",
      contextDetails: [
        { label: "Decision needed", value: "- [ ] ", checkable: true },
        { label: "Out of scope", value: "" },
        { label: "Contributors", value: "" },
      ],
      items: [],
    });
  }

  return (
    <div className="priority-guide-new-guide">
      <Heading as="h1" size="md">New guide</Heading>
      <Paragraph size="md" color="muted">
        Name your guide and add a brief problem statement. You can fill in the rest from the editor.
      </Paragraph>
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
    </div>
  );
}

function JsonPanel({ guide, onLoad }) {
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

  return (
    <div className="priority-guide-json-panel">
      <div className="priority-guide-json-panel__header">
        <span className="priority-guide-kicker">JSON</span>
      </div>
      {error && (
        <div className="priority-guide-json-error" role="alert">
          <Icon name="error" className="priority-guide-json-error__icon" />
          <span>{error}</span>
        </div>
      )}
      <textarea
        className="priority-guide-json-textarea"
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        spellCheck={false}
      />
      <Button size="sm" variant="secondary" icon="content_copy" iconPosition="start" onClick={handleCopy} style={{ width: "100%", marginTop: "var(--base-spacing-8)" }}>Copy</Button>
    </div>
  );
}

const STORAGE_KEY = "priority-guide-editor-v1";

function loadStoredEditor() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveStoredEditor(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

function makeDraft(source) {
  return {
    title: source.title,
    problemStatement: source.problemStatement,
    audience: source.audience,
    userGoal: source.userGoal,
    businessGoal: source.businessGoal,
    contextDetails: source.contextDetails.map((d) => ({ ...d })),
    items: source.items.map((item) => ({ ...item })),
  };
}

function EditorPage() {
  const [userGuides, setUserGuides] = useState(() => loadStoredEditor()?.userGuides ?? []);
  const [drafts, setDrafts] = useState(() => loadStoredEditor()?.drafts ?? {});
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [activeGuideId, setActiveGuideId] = useState(() => {
    const stored = loadStoredEditor();
    const id = stored?.activeGuideId;
    if (!id) return exampleGuides[0].id;
    const allStored = [...(stored?.userGuides ?? []), ...exampleGuides];
    return allStored.some((g) => g.id === id) ? id : exampleGuides[0].id;
  });
  const [overviewOpen, setOverviewOpen] = useState(true);
  const [activeItemIndex, setActiveItemIndex] = useState(null);
  const [rightPanelTab, setRightPanelTab] = useState("guide");

  const allGuides = [...userGuides, ...exampleGuides];
  const seed = allGuides.find((g) => g.id === activeGuideId) ?? exampleGuides[0];
  const draft = drafts[activeGuideId] ?? makeDraft(seed);

  useEffect(() => {
    saveStoredEditor({ userGuides, drafts, activeGuideId });
  }, [userGuides, drafts, activeGuideId]);

  function updateDraft(updater) {
    setDrafts((prev) => ({
      ...prev,
      [activeGuideId]: updater(prev[activeGuideId] ?? makeDraft(seed)),
    }));
  }

  function switchToGuide(guideId) {
    const found = allGuides.find((g) => g.id === guideId) ?? exampleGuides[0];
    setActiveGuideId(found.id);
    setActiveItemIndex(null);
    setIsCreatingNew(false);
  }

  function handleCreateGuide(newGuide) {
    setUserGuides((prev) => [...prev, newGuide]);
    setDrafts((prev) => ({ ...prev, [newGuide.id]: makeDraft(newGuide) }));
    setActiveGuideId(newGuide.id);
    setActiveItemIndex(null);
    setIsCreatingNew(false);
  }

  function setField(key, value) {
    updateDraft((d) => ({ ...d, [key]: value }));
  }

  function setContextDetail(index, value) {
    updateDraft((d) => ({
      ...d,
      contextDetails: d.contextDetails.map((item, i) => (i === index ? { ...item, value } : item)),
    }));
  }

  function setItemField(itemIndex, key, value) {
    updateDraft((d) => ({
      ...d,
      items: d.items.map((item, i) => (i === itemIndex ? { ...item, [key]: value } : item)),
    }));
  }

  function setItemAnnotations(itemIndex, rawText) {
    updateDraft((d) => ({
      ...d,
      items: d.items.map((item, i) =>
        i === itemIndex ? { ...item, annotations: rawText.split("\n") } : item
      ),
    }));
  }

  function moveItem(fromIndex, toIndex) {
    updateDraft((d) => {
      const items = [...d.items];
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      return { ...d, items };
    });
  }

  function addItem() {
    const newIndex = draft.items.length;
    updateDraft((d) => ({
      ...d,
      items: [
        ...d.items,
        { type: "", componentType: "", title: "New item", content: "", annotations: [] },
      ],
    }));
    setActiveItemIndex(newIndex);
  }

  const guide = { ...seed, ...draft };
  const activeItem = activeItemIndex !== null ? guide.items[activeItemIndex] : null;
  const isUserGuide = userGuides.some((g) => g.id === activeGuideId);

  function deleteGuide() {
    const nextGuide =
      [...userGuides.filter((g) => g.id !== activeGuideId), ...exampleGuides][0] ?? exampleGuides[0];
    setUserGuides((prev) => prev.filter((g) => g.id !== activeGuideId));
    setDrafts((prev) => { const d = { ...prev }; delete d[activeGuideId]; return d; });
    setActiveGuideId(nextGuide.id);
    setActiveItemIndex(null);
  }

  function resetGuide() {
    setDrafts((prev) => { const d = { ...prev }; delete d[activeGuideId]; return d; });
  }

  function loadFromJson(parsed) {
    setDrafts((prev) => ({
      ...prev,
      [activeGuideId]: makeDraft({
        title: parsed.title ?? "",
        problemStatement: parsed.problemStatement ?? "",
        audience: parsed.audience ?? "",
        userGoal: parsed.userGoal ?? "",
        businessGoal: parsed.businessGoal ?? "",
        contextDetails: parsed.contextDetails ?? [],
        items: parsed.items ?? [],
      }),
    }));
  }

  function duplicateGuide() {
    const newGuide = {
      ...seed,
      id: `user-${Date.now()}`,
      tab: `${draft.title} (copy)`,
      title: `${draft.title} (copy)`,
      icon: "description",
    };
    setUserGuides((prev) => [...prev, newGuide]);
    setDrafts((prev) => ({ ...prev, [newGuide.id]: makeDraft({ ...draft, title: newGuide.title }) }));
    setActiveGuideId(newGuide.id);
    setActiveItemIndex(null);
  }

  function duplicateItem(itemIndex) {
    const newIndex = itemIndex + 1;
    updateDraft((d) => {
      const items = [...d.items];
      items.splice(newIndex, 0, { ...d.items[itemIndex] });
      return { ...d, items };
    });
    setActiveItemIndex(newIndex);
  }

  function deleteItem(itemIndex) {
    updateDraft((d) => ({
      ...d,
      items: d.items.filter((_, i) => i !== itemIndex),
    }));
    setActiveItemIndex(null);
  }

  return (
    <main className="priority-guide-editor">
      <SideNav
        header={<Heading as="h2" size="xs">Guides</Heading>}
        footer={
          isCreatingNew ? undefined : (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-8)" }}>
              <Button
                size="sm"
                variant="secondary"
                icon="add"
                iconPosition="start"
                onClick={() => { setIsCreatingNew(true); setActiveItemIndex(null); }}
                style={{ width: "100%" }}
              >
                New Guide
              </Button>
              <Button
                size="sm"
                variant="secondary"
                icon="content_copy"
                iconPosition="start"
                onClick={duplicateGuide}
                style={{ width: "100%" }}
              >
                Duplicate guide
              </Button>
              <Button
                size="sm"
                variant="destructive"
                icon={isUserGuide ? "delete" : "refresh"}
                iconPosition="start"
                onClick={isUserGuide ? deleteGuide : resetGuide}
                style={{ width: "100%" }}
              >
                {isUserGuide ? "Delete guide" : "Reset guide"}
              </Button>
            </div>
          )
        }
      >
        {isCreatingNew && (
          <SideNavItem
            as="button"
            icon="edit_note"
            label="New guide"
            active={true}
          />
        )}
        {userGuides.length > 0 && (
          <>
            {userGuides.map((item) => (
              <SideNavItem
                key={item.id}
                as="button"
                icon={item.icon || "description"}
                label={item.tab}
                active={!isCreatingNew && item.id === activeGuideId}
                onClick={() => switchToGuide(item.id)}
              />
            ))}
            <Divider />
          </>
        )}
        {exampleGuides.map((item) => (
          <SideNavItem
            key={item.id}
            as="button"
            icon={item.icon}
            label={item.tab}
            active={!isCreatingNew && item.id === activeGuideId}
            onClick={() => switchToGuide(item.id)}
          />
        ))}
      </SideNav>

      <section className="priority-guide-editor-canvas" aria-label={isCreatingNew ? "New guide" : activeItem ? "Item preview" : "Guide preview"}>
        <div className="priority-guide-editor-canvas__toolbar">
          {isCreatingNew ? (
            <Heading as="h1" size="md">New guide</Heading>
          ) : activeItem ? (
            <nav className="priority-guide-breadcrumb" aria-label="Breadcrumb">
              <button className="priority-guide-breadcrumb__back" onClick={() => setActiveItemIndex(null)}>
                <Icon name="arrow_back" />
                {guide.title}
              </button>
              <span className="priority-guide-breadcrumb__sep" aria-hidden="true">/</span>
              <span className="priority-guide-breadcrumb__current">{activeItem.title}</span>
            </nav>
          ) : (
            <Heading as="h1" size="md">{guide.title}</Heading>
          )}
        </div>
        <div className="priority-guide-editor-canvas__guide">
          {isCreatingNew ? (
            <NewGuideCanvas onCreateGuide={handleCreateGuide} onCancel={() => switchToGuide(activeGuideId)} />
          ) : activeItem ? (
            <ItemDetailCanvas
              item={activeItem}
              index={activeItemIndex}
              onFieldChange={(key, value) => setItemField(activeItemIndex, key, value)}
            />
          ) : (
            <PriorityGuideDocument
              guide={guide}
              onFieldChange={setField}
              onContextChange={setContextDetail}
              overviewOpen={overviewOpen}
              onOverviewToggle={() => setOverviewOpen((v) => !v)}
              onItemSelect={setActiveItemIndex}
              onItemMove={moveItem}
              onAddItem={addItem}
            />
          )}
        </div>
      </section>

      <aside className="priority-guide-editor-panel" aria-label={isCreatingNew ? "New guide info" : activeItem ? "Item controls" : "Guide controls"}>
        {isCreatingNew ? (
          <div className="priority-guide-editor-panel__empty">
            <Paragraph size="sm" color="muted">Name your guide and add a problem statement, then click <strong>Create guide</strong> to start editing.</Paragraph>
          </div>
        ) : activeItem ? (
          <>
            <div className="priority-guide-editor-panel__header">
              <Heading as="h2" size="sm">Item brief</Heading>
            </div>
            <div className="priority-guide-editor-fields">
              <TextField
                label="Title"
                size="compact"
                value={activeItem.title}
                onChange={(e) => setItemField(activeItemIndex, "title", e.target.value)}
              />
              <TextareaField
                label="Content"
                size="compact"
                rows="sm"
                value={activeItem.content}
                onChange={(e) => setItemField(activeItemIndex, "content", e.target.value)}
              />
              <SelectField
                label="Component type"
                size="compact"
                value={activeItem.componentType ?? ""}
                onChange={(e) => setItemField(activeItemIndex, "componentType", e.target.value)}
              >
                <option value="">— select —</option>
                {itemComponentOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
                {activeItem.componentType && !itemComponentOptions.includes(activeItem.componentType) && (
                  <option value={activeItem.componentType}>{activeItem.componentType}</option>
                )}
              </SelectField>
              <TextareaField
                label="Annotations"
                size="compact"
                rows="sm"
                value={(activeItem.annotations ?? []).join("\n")}
                onChange={(e) => setItemAnnotations(activeItemIndex, e.target.value)}
              />
            </div>
            <div className="priority-guide-editor-panel__footer">
              <Button
                size="sm"
                icon="check"
                iconPosition="start"
                onClick={() => setActiveItemIndex(null)}
                style={{ width: "100%" }}
              >
                Done
              </Button>
              <Button
                size="sm"
                variant="secondary"
                icon="content_copy"
                iconPosition="start"
                onClick={() => duplicateItem(activeItemIndex)}
                style={{ width: "100%" }}
              >
                Duplicate item
              </Button>
              <Button
                size="sm"
                variant="destructive"
                icon="delete"
                iconPosition="start"
                onClick={() => deleteItem(activeItemIndex)}
                style={{ width: "100%" }}
              >
                Delete item
              </Button>
            </div>
          </>
        ) : (
          <Tabs
            value={rightPanelTab}
            onChange={setRightPanelTab}
            variant="line"
            className="priority-guide-panel-tabs"
          >
            <TabList>
              <Tab value="guide">Guide</Tab>
              <Tab value="json">JSON</Tab>
            </TabList>
            <TabPanel value="guide">
              <div className="priority-guide-editor-fields">
                <TextField
                  label="Guide name"
                  size="compact"
                  value={draft.title}
                  onChange={(e) => setField("title", e.target.value)}
                />
                <TextareaField
                  label="Problem statement"
                  size="compact"
                  rows="sm"
                  value={draft.problemStatement}
                  onChange={(e) => setField("problemStatement", e.target.value)}
                />
                {draft.contextDetails.map((item, index) => (
                  <TextareaField
                    key={item.label}
                    label={item.label}
                    size="compact"
                    rows="sm"
                    value={item.value}
                    onChange={(e) => setContextDetail(index, e.target.value)}
                  />
                ))}
                <TextareaField
                  label="Audience"
                  size="compact"
                  rows="sm"
                  value={draft.audience}
                  onChange={(e) => setField("audience", e.target.value)}
                />
                <TextareaField
                  label="User goal"
                  size="compact"
                  rows="sm"
                  value={draft.userGoal}
                  onChange={(e) => setField("userGoal", e.target.value)}
                />
                <TextareaField
                  label="Business goal"
                  size="compact"
                  rows="sm"
                  value={draft.businessGoal}
                  onChange={(e) => setField("businessGoal", e.target.value)}
                />
              </div>
            </TabPanel>
            <TabPanel value="json">
              <JsonPanel key={activeGuideId} guide={guide} onLoad={loadFromJson} />
            </TabPanel>
          </Tabs>
        )}
      </aside>
    </main>
  );
}

function ExamplesPage({ activeGuide, onGuideChange }) {
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

function App() {
  const [route, setRoute] = useState(() => getRoute());

  useEffect(() => {
    document.documentElement.classList.add("a1-theme-heritage");

    return () => {
      document.documentElement.classList.remove("a1-theme-heritage");
    };
  }, []);

  useEffect(() => {
    const pageTitles = {
      examples: "Examples | Priority Guide",
      start: "Start | Priority Guide",
      editor: "Editor | Priority Guide",
    };
    const title = pageTitles[route.page] ?? "Priority Guide";
    document.title = title;
  }, [route.page]);

  useEffect(() => {
    window.history.replaceState(getRoute(), "", window.location.href);

    const onPopState = () => {
      setRoute(getRoute());
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (route.page !== "home") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    if (!route.hash) return;

    window.requestAnimationFrame(() => {
      const target = document.getElementById(route.hash);
      target?.scrollIntoView();
    });
  }, [route.page, route.hash]);

  function navigate(page, { guide = route.guide, hash } = {}) {
    const nextRoute = {
      page: pageIds.includes(page) ? page : "home",
      guide: exampleGuides.some((item) => item.id === guide) ? guide : exampleGuides[0].id,
      hash: hash ?? "",
    };
    const nextPath = getRoutePath(nextRoute.page, { guide: nextRoute.guide, hash });
    const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    if (nextPath !== currentPath) {
      window.history.pushState(nextRoute, "", nextPath);
    }

    setRoute(nextRoute);
  }

  function handleRouteClick(event, page, options) {
    if (!isPlainLeftClick(event)) return;

    event.preventDefault();
    navigate(page, options);
  }

  function handleGuideChange(guide) {
    navigate("examples", { guide });
  }

  const header = (
    <header className="priority-guide-header">
      <a
        className="priority-guide-logo"
        href={getRoutePath("home")}
        onClick={(event) => handleRouteClick(event, "home")}
        aria-current={route.page === "home" && !route.hash ? "page" : undefined}
      >
        Priority Guide
      </a>
      <nav aria-label="Primary navigation">
        <a
          className={route.page === "home" ? "priority-guide-nav-link--active" : ""}
          href={getRoutePath("home", { hash: "overview" })}
          onClick={(event) => handleRouteClick(event, "home", { hash: "overview" })}
        >
          Overview
        </a>
        <a
          className={route.page === "examples" ? "priority-guide-nav-link--active" : ""}
          href={getRoutePath("examples", { guide: route.guide })}
          onClick={(event) => handleRouteClick(event, "examples")}
          aria-current={route.page === "examples" ? "page" : undefined}
        >
          Examples
        </a>
        <a
          className={route.page === "start" ? "priority-guide-nav-link--active" : ""}
          href={getRoutePath("start")}
          onClick={(event) => handleRouteClick(event, "start")}
          aria-current={route.page === "start" ? "page" : undefined}
        >
          Start
        </a>
        <a
          className={route.page === "editor" ? "priority-guide-nav-link--active" : ""}
          href={getRoutePath("editor")}
          onClick={(event) => handleRouteClick(event, "editor")}
          aria-current={route.page === "editor" ? "page" : undefined}
        >
          Editor
        </a>
      </nav>
    </header>
  );

  return (
    <PageLayout stickyHeader header={header}>
      {route.page === "examples" ? (
        <ExamplesPage activeGuide={route.guide} onGuideChange={handleGuideChange} />
      ) : route.page === "start" ? (
        <StartPage onNavigate={handleRouteClick} />
      ) : route.page === "editor" ? (
        <EditorPage />
      ) : (
        <LandingPage onNavigate={handleRouteClick} />
      )}
    </PageLayout>
  );
}

createRoot(document.getElementById("root")).render(<App />);
