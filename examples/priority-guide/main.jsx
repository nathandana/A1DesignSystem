import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
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

const exampleFlows = [
  {
    id: "appointment-to-program",
    title: "Service discovery to booking",
    description:
      "A direct flow for teams aligning on how public-service pages move someone from reassurance to a confident next action.",
    mode: "linear",
    states: [
      { guideId: "clinic", state: "Reassure and qualify" },
      { guideId: "library", state: "Confirm value and logistics" },
      { guideId: "trail", state: "Show interruption state" },
    ],
    links: [
      { from: "clinic", to: "library", label: "Use registration pattern" },
      { from: "library", to: "trail", label: "Show closure alternative" },
    ],
  },
  {
    id: "operations-review",
    title: "Operations review map",
    description:
      "An organic flow for leadership reviews where a page may branch into an incident state, a public notice, or a follow-up action.",
    mode: "organic",
    states: [
      { guideId: "incident", state: "Current status" },
      { guideId: "trail", state: "Public-facing notice" },
      { guideId: "clinic", state: "Resident support path" },
      { guideId: "library", state: "Community program update" },
    ],
    links: [
      { from: "incident", to: "trail", label: "Publish public impact" },
      { from: "incident", to: "clinic", label: "Route people needing help" },
      { from: "library", to: "trail", label: "Reuse accessibility notice" },
      { from: "clinic", to: "incident", label: "Escalate capacity issue" },
    ],
  },
];

const sampleGuideJson = JSON.stringify({
  title: "Workshop registration page",
  tab: "Workshop",
  icon: "event",
  pageType: "Landing",
  context: "Public program signup",
  problemStatement: "People need to quickly decide whether this workshop matches their skill level, schedule, and access needs before registering.",
  audience: "Adults exploring a free community workshop.",
  userGoal: "Understand the value, confirm logistics, and register with confidence.",
  businessGoal: "Increase qualified registrations while reducing follow-up questions.",
  contextDetails: [
    { label: "Decision needed", value: "- [ ] Register for the workshop", checkable: true },
    { label: "Out of scope", value: "Payment, member accounts, and post-event surveys." },
    { label: "Contributors", value: "Programs lead, content designer, accessibility reviewer." },
  ],
  items: [
    {
      kind: "group",
      componentType: "Section",
      title: "Decision details",
      content: "The core content someone needs before registering.",
      annotations: ["Group the persuasive and logistical content before the action."],
      children: [
        {
          componentType: "Heading",
          title: "Workshop name and plain-language value",
          content: "Lead with the topic and the practical outcome someone can expect.",
          annotations: ["Keep the title specific enough to distinguish this from other workshops."],
        },
        {
          componentType: "Details",
          title: "Date, time, location, and accessibility notes",
          content: "Show the logistics before the registration action so people can self-qualify.",
          annotations: ["Include virtual or in-person requirements here, not after registration."],
        },
      ],
    },
    {
      componentType: "Button",
      title: "Register",
      content: "Primary action that starts the signup flow.",
      annotations: ["Button opens the registration form for this specific workshop."],
      linkedGuideId: "library",
    },
  ],
}, null, 2);

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

const containerComponentOptions = [
  "Section",
  "Card",
  "Button container",
];

const pageTypeOptions = [
  "Home",
  "Landing",
  "Overview",
  "Dashboard",
  "Form",
  "Data detail",
  "Profile",
  "Search results",
  "Confirmation",
  "Error / Empty state",
  "Settings",
  "Article",
  "Onboarding",
];

const pageIds = ["home", "examples", "start", "flows", "flow-editor", "guides", "new", "editor", "presentation"];

function getRouteBase(pathname = window.location.pathname) {
  return pathname.startsWith("/examples/priority-guide") ? "/examples/priority-guide" : "";
}

function getRoute(pathname = window.location.pathname, search = window.location.search, hash = window.location.hash) {
  const params = new URLSearchParams(search);
  const pageParam = params.get("page");
  const page = pageIds.includes(pageParam)
    ? pageParam
    : (!hash && hasLocalGuides() ? "guides" : "home");
  const guide = params.get("guide");

  return {
    page,
    guide: guide || exampleGuides[0].id,
    flow: params.get("flow") || exampleFlows[0].id,
    hash: hash.replace(/^#/, ""),
  };
}

function getRoutePath(page = "home", { guide, flow, hash } = {}) {
  const base = getRouteBase();
  const pagePath = base ? `${base}/` : "/";
  const params = new URLSearchParams();

  if (page === "examples") {
    params.set("page", "examples");
    if (guide) {
      params.set("guide", guide);
    }
  } else if (page === "start") {
    params.set("page", "start");
  } else if (page === "flows") {
    params.set("page", "flows");
    if (flow) {
      params.set("flow", flow);
    }
  } else if (page === "flow-editor") {
    params.set("page", "flow-editor");
    if (flow) {
      params.set("flow", flow);
    }
  } else if (page === "guides") {
    params.set("page", "guides");
  } else if (page === "new") {
    params.set("page", "new");
  } else if (page === "editor") {
    params.set("page", "editor");
    if (guide) {
      params.set("guide", guide);
    }
  } else if (page === "presentation") {
    params.set("page", "presentation");
    if (guide) {
      params.set("guide", guide);
    }
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

function isMissingOverviewValue(value) {
  return !String(value ?? "")
    .replace(/^-\s*\[\s*\]\s*/gm, "")
    .trim();
}

function MissingOverviewValue({ label }) {
  return (
    <span className="priority-guide-overview-missing">
      Add {label.toLowerCase()}
    </span>
  );
}

function PriorityGuideMeta({ label, value, onChange }) {
  const missing = isMissingOverviewValue(value);
  const content = missing ? <MissingOverviewValue label={label} /> : value;

  return (
    <div className="priority-guide-meta">
      <dt>{label}</dt>
      <dd>
        {onChange ? (
          <InlineEditable value={value ?? ""} onChange={onChange}>{content}</InlineEditable>
        ) : content}
      </dd>
    </div>
  );
}

function parseCheckboxLines(text) {
  return String(text ?? "").split("\n").map((l) => l.trim()).filter(Boolean).map((line) => {
    const match = line.match(/^-\s*\[(x|X|\s*)\]\s*(.*)$/);
    if (match) return { checked: match[1].trim().toLowerCase() === "x", text: match[2] };
    return { checked: false, text: line.replace(/^-\s+/, "") };
  });
}

function PriorityGuideContext({ label, value, onChange, checkable }) {
  const missing = isMissingOverviewValue(value);

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
            <InlineEditable value={value ?? ""} onChange={onChange}>
              {missing ? <MissingOverviewValue label={label} /> : listContent}
            </InlineEditable>
          ) : missing ? <MissingOverviewValue label={label} /> : listContent}
        </dd>
      </div>
    );
  }

  const content = onChange
    ? (
      <InlineEditable value={value ?? ""} onChange={onChange}>
        {missing ? <MissingOverviewValue label={label} /> : value}
      </InlineEditable>
    )
    : missing ? <MissingOverviewValue label={label} /> : value;

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

function isGuideGroup(item) {
  return item?.kind === "group" || Array.isArray(item?.children);
}

function getItemComponentType(item) {
  return item.componentType || (isGuideGroup(item) ? "Section" : "Element");
}

function isGuideLinkComponent(item) {
  return /\b(button|link)\b/i.test(getItemComponentType(item));
}

function getGuideTitleById(guides, guideId) {
  return guides.find((guide) => guide.id === guideId)?.title ?? guideId;
}

function getListItems(content) {
  return String(content ?? "")
    .split(/\n|;/)
    .map((line) => line.replace(/^[-*]\s+/, "").trim())
    .filter(Boolean);
}

function isListComponent(item) {
  return /list|checklist/i.test(getItemComponentType(item));
}

function isParagraphComponent(item) {
  return /paragraph|body|copy/i.test(getItemComponentType(item));
}

function isHeadingComponent(item) {
  return /heading|headline|title|subheading/i.test(getItemComponentType(item));
}

function GuideItemContent({ item }) {
  const componentType = getItemComponentType(item);

  if (isListComponent(item)) {
    const listItems = getListItems(item.content);

    return (
      <ul className="priority-guide-document__content-list">
        {listItems.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    );
  }

  if (isHeadingComponent(item)) {
    return (
      <Heading as="h4" size="sm">
        {item.content}
      </Heading>
    );
  }

  if (isParagraphComponent(item)) {
    return <Paragraph size="sm">{item.content}</Paragraph>;
  }

  return (
    <p className="priority-guide-document__component-text">
      {item.content}
    </p>
  );
}

function PriorityGuideItem({
  item,
  index,
  guides = exampleGuides,
  onSelect,
  onMove,
  total,
  onFieldChange,
  showAnnotations = true,
  selected = false,
  onToggleSelected,
  allowSelection = false,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [groupOpen, setGroupOpen] = useState(true);
  const isGroup = isGuideGroup(item);
  const annotations = item.annotations?.filter(Boolean) ?? [];
  const linkedGuide = isGuideLinkComponent(item) && item.linkedGuideId
    ? guides.find((guide) => guide.id === item.linkedGuideId)
    : null;

  const classNames = [
    "priority-guide-document__item",
    isGroup ? "priority-guide-document__item--group" : "",
    onSelect ? "priority-guide-document__item--interactive" : "",
    onMove ? "priority-guide-document__item--draggable" : "",
    isDragOver ? "priority-guide-document__item--drag-over" : "",
    selected ? "priority-guide-document__item--selected" : "",
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
            {allowSelection && (
              <input
                type="checkbox"
                className="priority-guide-document__select"
                checked={selected}
                onChange={(e) => onToggleSelected?.(index, e.target.checked)}
                onClick={(e) => e.stopPropagation()}
                aria-label={`Select ${item.title}`}
              />
            )}
            <MessageBadge icon="edit_note" status="info">
              {getItemComponentType(item)}
            </MessageBadge>
            {isGroup && (
              <button
                type="button"
                className="priority-guide-document__group-toggle"
                aria-expanded={groupOpen}
                onClick={(e) => {
                  e.stopPropagation();
                  setGroupOpen((open) => !open);
                }}
              >
                <Icon name={groupOpen ? "expand_less" : "expand_more"} />
                {groupOpen ? "Collapse" : "Expand"}
              </button>
            )}
          </div>
        </div>
        {onFieldChange ? (
          <InlineEditable value={item.content} onChange={(v) => onFieldChange("content", v)} multiline>
            <GuideItemContent item={item} />
          </InlineEditable>
        ) : (
          <GuideItemContent item={item} />
        )}
        {isGroup && groupOpen && (
          <ol className="priority-guide-document__group-children" aria-label={`${item.title} children`}>
            {(item.children ?? []).map((child, childIndex) => (
              <PriorityGuideItem
                key={child.title || childIndex}
                item={child}
                index={childIndex}
                guides={guides}
                showAnnotations={false}
              />
            ))}
          </ol>
        )}
        {linkedGuide && (
          <Link
            href={getRoutePath("editor", { guide: linkedGuide.id })}
            className="priority-guide-document__linked-guide"
            onClick={(e) => e.stopPropagation()}
          >
            <Icon name="call_split" />
            Linked guide: {linkedGuide.title}
          </Link>
        )}
      </div>
      {showAnnotations && annotations.length > 0 && (
        <aside className="priority-guide-document__annotations" aria-label={`Annotations for ${item.title}`}>
          <ul>
            {annotations.map((annotation, i) => (
              <li key={i}>{annotation}</li>
            ))}
          </ul>
        </aside>
      )}
    </li>
  );
}

function PriorityGuideDocument({
  guide,
  guides = exampleGuides,
  compact = false,
  onFieldChange,
  onContextChange,
  overviewOpen = true,
  onOverviewToggle,
  onItemSelect,
  onItemMove,
  onAddItem,
  showAnnotations = true,
  selectedIndexes = [],
  onToggleItemSelected,
  hideOverview = false,
}) {
  const headingId = `${guide.title.replace(/\W+/g, "-")}-problem`;
  const overviewId = `${guide.title.replace(/\W+/g, "-")}-overview`;
  const [internalOverviewOpen, setInternalOverviewOpen] = useState(true);
  const isOverviewOpen = onOverviewToggle ? overviewOpen : internalOverviewOpen;
  const toggleOverview = onOverviewToggle ?? (() => setInternalOverviewOpen((open) => !open));
  const classNames = [
    "priority-guide-document",
    compact ? "priority-guide-document--compact" : "",
    !showAnnotations ? "priority-guide-document--annotations-hidden" : "",
  ].filter(Boolean).join(" ");

  return (
    <article className={classNames}>
      {(guide.pageType || onFieldChange) && (
        <div className="priority-guide-document__page-type">
          <span className="priority-guide-kicker">Page type</span>
          {onFieldChange ? (
            <select
              className="priority-guide-page-type-select"
              value={guide.pageType ?? ""}
              onChange={(e) => onFieldChange("pageType", e.target.value)}
              aria-label="Page type"
            >
              <option value="">— select —</option>
              {pageTypeOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
              {guide.pageType && !pageTypeOptions.includes(guide.pageType) && (
                <option value={guide.pageType}>{guide.pageType}</option>
              )}
            </select>
          ) : (
            <span className="priority-guide-page-type-badge">{guide.pageType}</span>
          )}
        </div>
      )}
      {!hideOverview && (
        <section className="priority-guide-document__overview" aria-labelledby={`${overviewId}-toggle`}>
          <button
            type="button"
            id={`${overviewId}-toggle`}
            className="priority-guide-document__overview-header priority-guide-document__overview-header--interactive"
            onClick={toggleOverview}
            aria-expanded={isOverviewOpen}
            aria-controls={overviewId}
          >
            <Icon name={isOverviewOpen ? "expand_less" : "expand_more"} className="priority-guide-collapse-icon" />
            <span className="priority-guide-kicker">Overview</span>
          </button>
          {isOverviewOpen && <div id={overviewId} className="priority-guide-document__brief">
            <section className="priority-guide-document__problem" aria-labelledby={headingId}>
              <span className="priority-guide-kicker">Problem statement</span>
              {(() => {
                const missing = isMissingOverviewValue(guide.problemStatement);
                const content = missing ? <MissingOverviewValue label="problem statement" /> : (
                  <Paragraph size="md" id={headingId}>{guide.problemStatement}</Paragraph>
                );

                return onFieldChange ? (
                  <InlineEditable
                    value={guide.problemStatement ?? ""}
                    onChange={(v) => onFieldChange("problemStatement", v)}
                    multiline
                  >
                    {content}
                  </InlineEditable>
                ) : content;
              })()}
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
        </section>
      )}
      <ol className="priority-guide-document__list" aria-label="Prioritized content elements">
        {guide.items.map((item, index) => (
          <PriorityGuideItem
            key={item.title || index}
            item={item}
            index={index}
            guides={guides}
            onSelect={onItemSelect ? () => onItemSelect(index) : undefined}
            onMove={onItemMove}
            total={guide.items.length}
            showAnnotations={showAnnotations}
            selected={selectedIndexes.includes(index)}
            onToggleSelected={onToggleItemSelected}
            allowSelection={!!onToggleItemSelected}
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

function ItemDetailCanvas({ item, index, guides = exampleGuides, onFieldChange, showAnnotations = true }) {
  return (
    <article className="priority-guide-document priority-guide-document--detail">
      <ol className="priority-guide-document__list" aria-label="Item detail">
        <PriorityGuideItem item={item} index={index} guides={guides} onFieldChange={onFieldChange} showAnnotations={showAnnotations} />
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
          <MessageBadge status="info" icon="auto_awesome">
            Align before AI
          </MessageBadge>
          <div className="priority-guide-hero__copy">
            <Heading as="h1" type="display" size={{ xs: "xl", md: "xxl", lg: "jumbo" }}>
              The Priority Guide
            </Heading>
            <Paragraph size="xl">
              When you align together on content, the rest flows. Use this tool to create and manage priority guides for your application.
            </Paragraph>
          </div>
          <ButtonContainer className="priority-guide-actions" align="center">
            <Button
              as="a"
              size="lg"
              href={getRoutePath("examples")}
              variant="secondary"
              icon="view_list"
              iconPosition="start"
              onClick={(event) => onNavigate(event, "examples")}
            >
              View examples
            </Button>
            <Button
              as="a"
              size="lg"
              href={getRoutePath("start")}
              icon="arrow_forward"
              iconPosition="end"
              onClick={(event) => onNavigate(event, "start")}
            >
              Start your guide
            </Button>
          </ButtonContainer>
        </div>
      </Section>

      <Section id="overview" surface="panel" className="priority-guide-overview">
        <div className="priority-guide-shell">
          <div className="priority-guide-section-heading">
            <MessageBadge status="success" icon="hub">
              Why it matters
            </MessageBadge>
            <Heading as="h2" type="display" size={{ xs: "lg", md: "xl" }}>
              A shared brief for collaboration.
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
          <Link href={getRoutePath("examples")} onClick={(event) => onNavigate(event, "examples")}>
            Explore example guides
          </Link>
          </div>
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

function GuideLinkSelect({ item, guides, onChange }) {
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

function hasLocalGuides() {
  return (loadStoredEditor()?.userGuides ?? []).length > 0;
}

function getStoredGuide(guideId) {
  const stored = loadStoredEditor();
  const allGuides = [...(stored?.userGuides ?? []), ...exampleGuides];
  const seed = allGuides.find((guide) => guide.id === guideId) ?? exampleGuides[0];
  const draft = stored?.drafts?.[seed.id];

  return { ...seed, ...(draft ?? {}) };
}

function getStoredGuides() {
  const stored = loadStoredEditor();
  return [...(stored?.userGuides ?? []), ...exampleGuides].map((guide) => ({
    ...guide,
    ...(stored?.drafts?.[guide.id] ?? {}),
  }));
}

function getStoredFlows() {
  const stored = loadStoredEditor();
  return [...exampleFlows, ...(stored?.userFlows ?? [])];
}

function saveStoredFlowState(flowId, nodes, edges) {
  const stored = loadStoredEditor() ?? {};
  const flowPositions = {
    ...(stored.flowPositions ?? {}),
    [flowId]: { nodes, edges },
  };
  const userFlows = (stored.userFlows ?? []).map((flow) => (
    flow.id === flowId
      ? {
          ...flow,
          states: nodes.map(({ guideId, state }) => ({ guideId, state: state ?? "" })),
          links: edges.map(({ from, to, label }) => ({ from, to, label: label ?? "" })),
        }
      : flow
  ));

  saveStoredEditor({ ...stored, userFlows, flowPositions });
}

function makeDraft(source) {
  return {
    pageType: source.pageType ?? "",
    title: source.title,
    problemStatement: source.problemStatement,
    audience: source.audience,
    userGoal: source.userGoal,
    businessGoal: source.businessGoal,
    contextDetails: source.contextDetails.map((d) => ({ ...d })),
    items: source.items.map((item) => ({
      ...item,
      children: item.children?.map((child) => ({ ...child })),
    })),
  };
}

function storeCreatedGuide(newGuide) {
  const stored = loadStoredEditor() ?? {};
  const userGuides = [...(stored.userGuides ?? []), newGuide];
  const drafts = { ...(stored.drafts ?? {}), [newGuide.id]: makeDraft(newGuide) };
  saveStoredEditor({ ...stored, userGuides, drafts, activeGuideId: newGuide.id });
}

function getTreeItemLabel(item) {
  const text = String(item.content || item.title || getItemComponentType(item) || "Untitled item").trim();
  return text.length > 52 ? `${text.slice(0, 49)}...` : text;
}

function GuideItemTree({ items, activeIndex, expandedGroups, onToggleGroup, onSelectItem }) {
  if (!items.length) {
    return (
      <div className="priority-guide-tree-empty">
        <Paragraph size="sm" color="muted">No items yet.</Paragraph>
      </div>
    );
  }

  return (
    <ol className="priority-guide-tree" aria-label="Guide item tree">
      {items.map((item, index) => {
        const isGroup = isGuideGroup(item);
        const expanded = expandedGroups.includes(index);

        return (
          <li key={item.title || index} className="priority-guide-tree__item">
            <div className="priority-guide-tree__row">
              {isGroup ? (
                <button
                  type="button"
                  className="priority-guide-tree__toggle"
                  aria-label={expanded ? "Collapse group" : "Expand group"}
                  aria-expanded={expanded}
                  onClick={() => onToggleGroup(index)}
                >
                  <Icon name={expanded ? "expand_more" : "chevron_right"} />
                </button>
              ) : (
                <span className="priority-guide-tree__spacer" aria-hidden="true" />
              )}
              <button
                type="button"
                className={`priority-guide-tree__button${activeIndex === index ? " priority-guide-tree__button--active" : ""}`}
                onClick={() => onSelectItem(index)}
              >
                <span className="priority-guide-tree__type">{getItemComponentType(item)}</span>
                <span className="priority-guide-tree__label">{getTreeItemLabel(item)}</span>
              </button>
            </div>
            {isGroup && expanded && (
              <ol className="priority-guide-tree__children">
                {(item.children ?? []).map((child, childIndex) => (
                  <li key={child.title || childIndex}>
                    <button
                      type="button"
                      className="priority-guide-tree__button priority-guide-tree__button--child"
                      onClick={() => onSelectItem(index)}
                    >
                      <span className="priority-guide-tree__type">{getItemComponentType(child)}</span>
                      <span className="priority-guide-tree__label">{getTreeItemLabel(child)}</span>
                    </button>
                  </li>
                ))}
              </ol>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function EditorOverviewBar({ draft, onFieldChange, onContextChange }) {
  const fields = [
    { key: "problemStatement", label: "Problem statement", multiline: true },
    { key: "audience", label: "Audience", multiline: true },
    { key: "userGoal", label: "User goal", multiline: true },
    { key: "businessGoal", label: "Business goal", multiline: true },
    ...(draft.contextDetails ?? []).map((item, i) => ({
      key: `ctx-${i}`,
      label: item.label,
      multiline: true,
      isContext: true,
      contextIndex: i,
      value: item.value,
    })),
  ];

  return (
    <div className="priority-guide-overview-bar" aria-label="Guide overview">
      {fields.map((field) => {
        const value = field.isContext ? field.value : (draft[field.key] ?? "");
        const handleChange = field.isContext
          ? (v) => onContextChange(field.contextIndex, v)
          : (v) => onFieldChange(field.key, v);
        return (
          <div key={field.key} className="priority-guide-overview-bar__cell">
            <span className="priority-guide-overview-bar__label">{field.label}</span>
            <InlineEditable value={value} onChange={handleChange} multiline={field.multiline} inputClassName="priority-guide-overview-bar__input">
              <p className="priority-guide-overview-bar__value">
                {value || <span className="priority-guide-overview-bar__empty">Add {field.label.toLowerCase()}…</span>}
              </p>
            </InlineEditable>
          </div>
        );
      })}
    </div>
  );
}

function EditorPage({ onNavigate, activeGuide, startNew = false }) {
  const [userGuides, setUserGuides] = useState(() => loadStoredEditor()?.userGuides ?? []);
  const [drafts, setDrafts] = useState(() => loadStoredEditor()?.drafts ?? {});
  const [isCreatingNew, setIsCreatingNew] = useState(startNew);
  const [activeGuideId, setActiveGuideId] = useState(() => {
    const stored = loadStoredEditor();
    const allStored = [...(stored?.userGuides ?? []), ...exampleGuides];
    if (activeGuide && allStored.some((g) => g.id === activeGuide)) return activeGuide;
    const id = stored?.activeGuideId;
    if (!id) return exampleGuides[0].id;
    return allStored.some((g) => g.id === id) ? id : exampleGuides[0].id;
  });
  const [activeItemIndex, setActiveItemIndex] = useState(null);
  const [selectedItemIndexes, setSelectedItemIndexes] = useState([]);
  const [expandedTreeGroups, setExpandedTreeGroups] = useState([]);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [rightPanelTab, setRightPanelTab] = useState("guide");
  const [deletedGuide, setDeletedGuide] = useState(null);

  const allGuides = [...userGuides, ...exampleGuides];
  const seed = allGuides.find((g) => g.id === activeGuideId) ?? exampleGuides[0];
  const draft = drafts[activeGuideId] ?? makeDraft(seed);

  useEffect(() => {
    if (startNew) {
      setIsCreatingNew(true);
      setActiveItemIndex(null);
      setSelectedItemIndexes([]);
      setExpandedTreeGroups([]);
    }
  }, [startNew]);

  useEffect(() => {
    if (!startNew && activeGuide && allGuides.some((g) => g.id === activeGuide) && activeGuide !== activeGuideId) {
      setActiveGuideId(activeGuide);
      setActiveItemIndex(null);
      setSelectedItemIndexes([]);
      setExpandedTreeGroups([]);
      setIsCreatingNew(false);
    }
  }, [activeGuide, activeGuideId, allGuides, startNew]);

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
    setSelectedItemIndexes([]);
    setExpandedTreeGroups([]);
    setIsCreatingNew(false);
  }

  function changeGuide(guideId) {
    switchToGuide(guideId);
    onNavigate(null, "editor", { guide: guideId });
  }

  function toggleTreeGroup(index) {
    setExpandedTreeGroups((prev) => (
      prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index].sort((a, b) => a - b)
    ));
  }

  function toggleAllTreeGroups() {
    setExpandedTreeGroups(allTreeGroupsExpanded ? [] : groupIndexes);
  }

  function handleCreateGuide(newGuide) {
    setUserGuides((prev) => [...prev, newGuide]);
    setDrafts((prev) => ({ ...prev, [newGuide.id]: makeDraft(newGuide) }));
    setActiveGuideId(newGuide.id);
    setActiveItemIndex(null);
    setSelectedItemIndexes([]);
    setExpandedTreeGroups([]);
    setIsCreatingNew(false);
    onNavigate(null, "editor", { guide: newGuide.id });
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

  function setGroupChildField(groupIndex, childIndex, key, value) {
    updateDraft((d) => ({
      ...d,
      items: d.items.map((item, i) => (
        i === groupIndex
          ? {
              ...item,
              children: (item.children ?? []).map((child, c) => (
                c === childIndex ? { ...child, [key]: value } : child
              )),
            }
          : item
      )),
    }));
  }

  function addChildToGroup(groupIndex) {
    updateDraft((d) => ({
      ...d,
      items: d.items.map((item, i) => (
        i === groupIndex
          ? {
              ...item,
              children: [
                ...(item.children ?? []),
                { type: "", componentType: "Paragraph", title: "New child item", content: "", annotations: [] },
              ],
            }
          : item
      )),
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
    setSelectedItemIndexes([]);
  }

  function toggleItemSelected(index, checked) {
    setSelectedItemIndexes((prev) => {
      const current = new Set(prev);
      if (checked) current.add(index);
      else current.delete(index);
      return [...current].sort((a, b) => a - b);
    });
  }

  function groupSelectedItems() {
    const groupable = selectedItemIndexes
      .filter((index) => guide.items[index] && !isGuideGroup(guide.items[index]))
      .sort((a, b) => a - b);

    if (groupable.length < 2) return;

    const firstIndex = groupable[0];
    updateDraft((d) => {
      const selected = new Set(groupable);
      const children = groupable.map((index) => ({ ...d.items[index] }));
      const group = {
        kind: "group",
        componentType: "Section",
        title: "New group",
        content: "Grouped priority items",
        annotations: [],
        children,
      };
      const items = d.items.filter((_, index) => !selected.has(index));
      items.splice(firstIndex, 0, group);
      return { ...d, items };
    });
    setSelectedItemIndexes([]);
    setActiveItemIndex(firstIndex);
  }

  const guide = { ...seed, ...draft };
  const activeItem = activeItemIndex !== null ? guide.items[activeItemIndex] : null;
  const isUserGuide = userGuides.some((g) => g.id === activeGuideId);
  const groupIndexes = guide.items.map((item, index) => isGuideGroup(item) ? index : null).filter((index) => index !== null);
  const allTreeGroupsExpanded = groupIndexes.length > 0 && expandedTreeGroups.length === groupIndexes.length;

  function deleteGuide() {
    const removedGuide = userGuides.find((g) => g.id === activeGuideId);
    if (!removedGuide) return;

    const removedDraft = drafts[activeGuideId] ?? makeDraft(removedGuide);
    const nextGuide =
      [...userGuides.filter((g) => g.id !== activeGuideId), ...exampleGuides][0] ?? exampleGuides[0];
    setUserGuides((prev) => prev.filter((g) => g.id !== activeGuideId));
    setDrafts((prev) => { const d = { ...prev }; delete d[activeGuideId]; return d; });
    setActiveGuideId(nextGuide.id);
    setActiveItemIndex(null);
    setDeletedGuide({ guide: removedGuide, draft: removedDraft, previousActiveGuideId: activeGuideId });
    onNavigate(null, "editor", { guide: nextGuide.id });
  }

  function undoDeleteGuide() {
    if (!deletedGuide) return;

    setUserGuides((prev) => {
      if (prev.some((guide) => guide.id === deletedGuide.guide.id)) return prev;
      return [...prev, deletedGuide.guide];
    });
    setDrafts((prev) => ({ ...prev, [deletedGuide.guide.id]: deletedGuide.draft }));
    setActiveGuideId(deletedGuide.previousActiveGuideId);
    setActiveItemIndex(null);
    setDeletedGuide(null);
    onNavigate(null, "editor", { guide: deletedGuide.previousActiveGuideId });
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
    setSelectedItemIndexes([]);
    onNavigate(null, "editor", { guide: newGuide.id });
  }

  function duplicateItem(itemIndex) {
    const newIndex = itemIndex + 1;
    updateDraft((d) => {
      const items = [...d.items];
      const source = d.items[itemIndex];
      items.splice(newIndex, 0, {
        ...source,
        children: source.children?.map((child) => ({ ...child })),
      });
      return { ...d, items };
    });
    setActiveItemIndex(newIndex);
    setSelectedItemIndexes([]);
  }

  function deleteItem(itemIndex) {
    updateDraft((d) => ({
      ...d,
      items: d.items.filter((_, i) => i !== itemIndex),
    }));
    setActiveItemIndex(null);
    setSelectedItemIndexes([]);
  }

  return (
    <main className="priority-guide-editor">
      <SideNav
        collapseButtonPlacement="footer"
        header={
          <div className="priority-guide-editor-nav-header">
            <SelectField
              label="Guide"
              size="compact"
              value={activeGuideId}
              onChange={(e) => changeGuide(e.target.value)}
            >
              {allGuides.map((item) => (
                <option key={item.id} value={item.id}>{item.tab || item.title}</option>
              ))}
            </SelectField>
            <IconButton
              icon={allTreeGroupsExpanded ? "unfold_less" : "unfold_more"}
              label={allTreeGroupsExpanded ? "Collapse all groups" : "Expand all groups"}
              onClick={toggleAllTreeGroups}
              disabled={groupIndexes.length === 0 || isCreatingNew}
            />
          </div>
        }
        footer={
          isCreatingNew ? undefined : (
            <div className="priority-guide-editor-nav-actions">
              <IconButton
                icon="add"
                label="New Guide"
                variant="secondary"
                onClick={() => {
                  onNavigate(null, "new");
                  setIsCreatingNew(true);
                  setActiveItemIndex(null);
                }}
              />
              <IconButton
                icon="content_copy"
                label="Duplicate guide"
                variant="secondary"
                onClick={duplicateGuide}
              />
              <IconButton
                icon={isUserGuide ? "delete" : "refresh"}
                label={isUserGuide ? "Delete guide" : "Reset guide"}
                variant="destructive"
                onClick={isUserGuide ? deleteGuide : resetGuide}
              />
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
        {!isCreatingNew && (
          <GuideItemTree
            items={guide.items}
            activeIndex={activeItemIndex}
            expandedGroups={expandedTreeGroups}
            onToggleGroup={toggleTreeGroup}
            onSelectItem={setActiveItemIndex}
          />
        )}
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
          {!isCreatingNew && (
            <div className="priority-guide-editor-actions">
              <Button
                size="sm"
                variant="secondary"
                icon="inventory_2"
                iconPosition="start"
                onClick={groupSelectedItems}
                disabled={selectedItemIndexes.filter((index) => guide.items[index] && !isGuideGroup(guide.items[index])).length < 2}
              >
                Group selected
              </Button>
              <Button
                as="a"
                size="sm"
                variant="secondary"
                href={getRoutePath("presentation", { guide: activeGuideId })}
                onClick={(event) => onNavigate(event, "presentation", { guide: activeGuideId })}
              >
                Presentation view
              </Button>
              <Switch
                size="compact"
                label="Annotations"
                checked={showAnnotations}
                onChange={setShowAnnotations}
              />
            </div>
          )}
        </div>
        {!isCreatingNew && !activeItem && (
          <EditorOverviewBar
            draft={draft}
            onFieldChange={setField}
            onContextChange={setContextDetail}
          />
        )}
        <div className="priority-guide-editor-canvas__guide">
          {isCreatingNew ? (
            <NewGuideCanvas
              onCreateGuide={handleCreateGuide}
              onCancel={() => {
                switchToGuide(activeGuideId);
                onNavigate(null, "editor", { guide: activeGuideId });
              }}
            />
          ) : activeItem ? (
            <ItemDetailCanvas
              item={activeItem}
              index={activeItemIndex}
              guides={allGuides}
              onFieldChange={(key, value) => setItemField(activeItemIndex, key, value)}
              showAnnotations={showAnnotations}
            />
          ) : (
            <PriorityGuideDocument
              guide={guide}
              guides={allGuides}
              onFieldChange={setField}
              onContextChange={setContextDetail}
              onItemSelect={setActiveItemIndex}
              onItemMove={moveItem}
              onAddItem={addItem}
              showAnnotations={showAnnotations}
              selectedIndexes={selectedItemIndexes}
              onToggleItemSelected={toggleItemSelected}
              hideOverview
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
              <Heading as="h2" size="sm">{isGuideGroup(activeItem) ? "Group brief" : "Item brief"}</Heading>
            </div>
            <div className="priority-guide-editor-fields">
              <SelectField
                label={isGuideGroup(activeItem) ? "Container type" : "Component type"}
                size="compact"
                value={activeItem.componentType ?? ""}
                onChange={(e) => setItemField(activeItemIndex, "componentType", e.target.value)}
              >
                <option value="">— select —</option>
                {(isGuideGroup(activeItem) ? containerComponentOptions : itemComponentOptions).map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
                {activeItem.componentType && !(isGuideGroup(activeItem) ? containerComponentOptions : itemComponentOptions).includes(activeItem.componentType) && (
                  <option value={activeItem.componentType}>{activeItem.componentType}</option>
                )}
              </SelectField>
              <GuideLinkSelect
                item={activeItem}
                guides={allGuides.filter((guide) => guide.id !== activeGuideId)}
                onChange={(value) => setItemField(activeItemIndex, "linkedGuideId", value)}
              />
              <TextareaField
                label="Content"
                size="compact"
                rows="sm"
                value={activeItem.content}
                onChange={(e) => setItemField(activeItemIndex, "content", e.target.value)}
              />
              <TextareaField
                label="Annotations"
                size="compact"
                rows="sm"
                value={(activeItem.annotations ?? []).join("\n")}
                onChange={(e) => setItemAnnotations(activeItemIndex, e.target.value)}
              />
              {isGuideGroup(activeItem) && (
                <div className="priority-guide-group-children-editor">
                  <div className="priority-guide-editor-panel__header">
                    <Heading as="h3" size="xs">Children</Heading>
                  </div>
                  {(activeItem.children ?? []).map((child, childIndex) => (
                    <div key={childIndex} className="priority-guide-group-child-editor">
                      <TextField
                        label={`Child ${childIndex + 1} title`}
                        size="compact"
                        value={child.title ?? ""}
                        onChange={(e) => setGroupChildField(activeItemIndex, childIndex, "title", e.target.value)}
                      />
                      <TextareaField
                        label="Content"
                        size="compact"
                        rows="sm"
                        value={child.content ?? ""}
                        onChange={(e) => setGroupChildField(activeItemIndex, childIndex, "content", e.target.value)}
                      />
                      <SelectField
                        label="Component type"
                        size="compact"
                        value={child.componentType ?? ""}
                        onChange={(e) => setGroupChildField(activeItemIndex, childIndex, "componentType", e.target.value)}
                      >
                        <option value="">— select —</option>
                        {itemComponentOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </SelectField>
                      <GuideLinkSelect
                        item={child}
                        guides={allGuides.filter((guide) => guide.id !== activeGuideId)}
                        onChange={(value) => setGroupChildField(activeItemIndex, childIndex, "linkedGuideId", value)}
                      />
                    </div>
                  ))}
                  <Button
                    size="sm"
                    variant="secondary"
                    icon="add"
                    iconPosition="start"
                    onClick={() => addChildToGroup(activeItemIndex)}
                    style={{ width: "100%" }}
                  >
                    Add child item
                  </Button>
                </div>
              )}
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
                <SelectField
                  label="Page type"
                  size="compact"
                  value={draft.pageType ?? ""}
                  onChange={(e) => setField("pageType", e.target.value)}
                >
                  <option value="">— select —</option>
                  {pageTypeOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                  {draft.pageType && !pageTypeOptions.includes(draft.pageType) && (
                    <option value={draft.pageType}>{draft.pageType}</option>
                  )}
                </SelectField>
                <TextField
                  label="Guide name"
                  size="compact"
                  value={draft.title}
                  onChange={(e) => setField("title", e.target.value)}
                />
              </div>
            </TabPanel>
            <TabPanel value="json">
              <JsonPanel key={activeGuideId} guide={guide} onLoad={loadFromJson} />
            </TabPanel>
          </Tabs>
        )}
      </aside>
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

function GuideOutlineItem({ item, depth = 0 }) {
  const prefix = depth === 0 ? null : "—";
  return (
    <li className={`priority-guide-outline__item priority-guide-outline__item--depth-${depth}`}>
      <div className="priority-guide-outline__item-header">
        {prefix && <span className="priority-guide-outline__dash">{prefix}</span>}
        <span className="priority-guide-outline__type">{item.type}</span>
        <span className="priority-guide-outline__title">{item.title}</span>
      </div>
      {item.content && (
        <p className="priority-guide-outline__content">{item.content}</p>
      )}
      {item.children?.length > 0 && (
        <ul className="priority-guide-outline__children">
          {item.children.map((child, i) => (
            <GuideOutlineItem key={i} item={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

function GuideOutline({ guide }) {
  return (
    <div className="priority-guide-outline">
      <div className="priority-guide-outline__meta">
        {guide.pageType && <span className="priority-guide-outline__page-type">{guide.pageType}</span>}
      </div>

      {guide.problemStatement && (
        <div className="priority-guide-outline__section">
          <p className="priority-guide-outline__section-label">Problem statement</p>
          <p className="priority-guide-outline__section-value">{guide.problemStatement}</p>
        </div>
      )}

      <dl className="priority-guide-outline__fields">
        {guide.audience && (
          <>
            <dt>Audience</dt>
            <dd>{guide.audience}</dd>
          </>
        )}
        {guide.userGoal && (
          <>
            <dt>User goal</dt>
            <dd>{guide.userGoal}</dd>
          </>
        )}
        {guide.businessGoal && (
          <>
            <dt>Business goal</dt>
            <dd>{guide.businessGoal}</dd>
          </>
        )}
      </dl>

      <hr className="priority-guide-outline__rule" />

      <p className="priority-guide-outline__section-label">Content hierarchy</p>
      <ol className="priority-guide-outline__list">
        {guide.items.map((item, i) => (
          <GuideOutlineItem key={i} item={item} depth={0} />
        ))}
      </ol>
    </div>
  );
}

function PresentationPage({ activeGuide, onNavigate }) {
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

function NewGuidePage({ onNavigate }) {
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

const FLOW_NODE_W = 220;
const FLOW_NODE_H = 120;
const ZOOM_STEP = 0.25;
const ZOOM_MIN = 0.25;
const ZOOM_MAX = 3;

function getEdgeRoute(fromNode, toNode) {
  const fcx = fromNode.x + FLOW_NODE_W / 2;
  const fcy = fromNode.y + FLOW_NODE_H / 2;
  const tcx = toNode.x + FLOW_NODE_W / 2;
  const tcy = toNode.y + FLOW_NODE_H / 2;
  const dx = tcx - fcx;
  const dy = tcy - fcy;
  let x1, y1, x2, y2;
  if (Math.abs(dx) >= Math.abs(dy)) {
    if (dx >= 0) {
      x1 = fromNode.x + FLOW_NODE_W; y1 = fcy;
      x2 = toNode.x; y2 = tcy;
    } else {
      x1 = fromNode.x; y1 = fcy;
      x2 = toNode.x + FLOW_NODE_W; y2 = tcy;
    }
    const cx = Math.max(Math.abs(x2 - x1) * 0.5, 60);
    return { x1, y1, x2, y2, d: `M ${x1} ${y1} C ${x1 + Math.sign(x2 - x1) * cx} ${y1}, ${x2 - Math.sign(x2 - x1) * cx} ${y2}, ${x2} ${y2}` };
  } else {
    if (dy >= 0) {
      x1 = fcx; y1 = fromNode.y + FLOW_NODE_H;
      x2 = tcx; y2 = toNode.y;
    } else {
      x1 = fcx; y1 = fromNode.y;
      x2 = tcx; y2 = toNode.y + FLOW_NODE_H;
    }
    const cy = Math.max(Math.abs(y2 - y1) * 0.5, 60);
    return { x1, y1, x2, y2, d: `M ${x1} ${y1} C ${x1} ${y1 + Math.sign(y2 - y1) * cy}, ${x2} ${y2 - Math.sign(y2 - y1) * cy}, ${x2} ${y2}` };
  }
}

function getDefaultFlowPositions(states) {
  return (states ?? []).map((state, index) => ({
    guideId: state.guideId,
    state: state.state,
    x: 60 + (index % 3) * (FLOW_NODE_W + 80),
    y: 60 + Math.floor(index / 3) * (FLOW_NODE_H + 80),
  }));
}

function FlowEditorPage({ flowId, onNavigate }) {
  const flow = getStoredFlows().find((f) => f.id === flowId);
  const [flowTitle, setFlowTitle] = useState(() => flow?.title ?? "Flow");

  const [nodes, setNodes] = useState(() => {
    if (!flow) return [];
    const saved = loadStoredEditor()?.flowPositions?.[flowId];
    return saved?.nodes ?? getDefaultFlowPositions(flow.states ?? []);
  });

  const [edges, setEdges] = useState(() => {
    if (!flow) return [];
    const saved = loadStoredEditor()?.flowPositions?.[flowId];
    return saved?.edges ?? (flow.links ?? []).map((l) => ({ from: l.from, to: l.to, label: l.label ?? "" }));
  });

  const [dragging, setDragging] = useState(null);
  const [connecting, setConnecting] = useState(null);
  const [panning, setPanning] = useState(null);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [nodeForm, setNodeForm] = useState(null);
  const [activeEdgeIndex, setActiveEdgeIndex] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const ctxMenuAnchorRef = useRef(null);
  const dragMoved = useRef(false);
  const panMoved = useRef(false);
  const svgRef = useRef(null);
  const panOffsetRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(1);
  panOffsetRef.current = panOffset;
  zoomRef.current = zoom;

  useEffect(() => {
    setFlowTitle(flow?.title ?? "Flow");
  }, [flowId, flow?.title]);

  useEffect(() => {
    if (!flow) return;
    saveStoredFlowState(flowId, nodes, edges);
  }, [nodes, edges, flowId]);

  // Load guide data when selected node changes
  useEffect(() => {
    if (!activeNodeId) { setNodeForm(null); return; }
    const guide = getStoredGuide(activeNodeId);
    setNodeForm({
      title: guide.title ?? "",
      pageType: guide.pageType ?? "",
      problemStatement: guide.problemStatement ?? "",
    });
  }, [activeNodeId]);

  useEffect(() => {
    if (!activeNodeId || !nodeForm) return;

    function onKeyDown(e) {
      if (e.key !== "Enter" && e.key !== "Escape") return;
      e.preventDefault();
      setActiveNodeId(null);
    }

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [activeNodeId, nodeForm]);

  useEffect(() => {
    if (!dragging) return;
    function onMove(e) {
      dragMoved.current = true;
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      const pan = panOffsetRef.current;
      const z = zoomRef.current;
      setNodes((prev) => prev.map((n) => n.guideId !== dragging.nodeId ? n : {
        ...n,
        x: (e.clientX - rect.left - pan.x) / z - dragging.offsetX,
        y: (e.clientY - rect.top - pan.y) / z - dragging.offsetY,
      }));
    }
    function onUp() { setDragging(null); }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
  }, [dragging]);

  useEffect(() => {
    if (!connecting) return;
    function onMove(e) {
      updateConnectingFromEvent(e);
    }
    function onUp() { setConnecting(null); }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
  }, [!!connecting]);

  useEffect(() => {
    if (!panning) return;
    function onMove(e) {
      panMoved.current = true;
      setPanOffset({ x: panning.startPanX + e.clientX - panning.startX, y: panning.startPanY + e.clientY - panning.startY });
    }
    function onUp() { setPanning(null); }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
  }, [panning]);

  if (!flow) {
    return (
      <main>
        <Section>
          <div className="priority-guide-shell">
            <Paragraph>Flow not found.</Paragraph>
            <Button onClick={() => onNavigate(null, "flows")}>Back to flows</Button>
          </div>
        </Section>
      </main>
    );
  }

  const guides = getStoredGuides();
  const isLocalFlow = (loadStoredEditor()?.userFlows ?? []).some((item) => item.id === flowId);
  const flowJson = JSON.stringify({
    ...(flow ?? {}),
    title: flowTitle,
    states: nodes.map(({ guideId, state }) => ({ guideId, state: state ?? "" })),
    links: edges.map(({ from, to, label }) => ({ from, to, label: label ?? "" })),
    positions: { nodes, edges },
  }, null, 2);

  const connectTarget = connecting
    ? nodes.find((n) =>
        n.guideId !== connecting.fromId &&
        connecting.x >= n.x && connecting.x <= n.x + FLOW_NODE_W &&
        connecting.y >= n.y && connecting.y <= n.y + FLOW_NODE_H
      )?.guideId ?? null
    : null;

  function saveNodeField(key, value) {
    setNodeForm((prev) => ({ ...prev, [key]: value }));
    const stored = loadStoredEditor() ?? {};
    const seed = getStoredGuide(activeNodeId);
    const draft = stored.drafts?.[activeNodeId] ?? makeDraft(seed);
    saveStoredEditor({ ...stored, drafts: { ...(stored.drafts ?? {}), [activeNodeId]: { ...draft, [key]: value } } });
  }

  function saveFlowTitle(value) {
    setFlowTitle(value);
    const stored = loadStoredEditor() ?? {};
    const userFlows = (stored.userFlows ?? []).map((item) => (
      item.id === flowId ? { ...item, title: value } : item
    ));
    saveStoredEditor({ ...stored, userFlows });
  }

  function deleteActiveNode() {
    setNodes((prev) => prev.filter((n) => n.guideId !== activeNodeId));
    setEdges((prev) => prev.filter((e) => e.from !== activeNodeId && e.to !== activeNodeId));
    setActiveNodeId(null);
  }

  function closeNodeEditor() {
    setActiveNodeId(null);
  }

  function handleNodeEditorKeyDown(e) {
    if (e.key !== "Enter" && e.key !== "Escape") return;
    e.preventDefault();
    closeNodeEditor();
  }

  function handleNodeEditorClick(e) {
    if (e.target !== e.currentTarget) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const isInsideDialog =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;

    if (!isInsideDialog) {
      closeNodeEditor();
    }
  }

  function createBlankGuide(x, y) {
    const newGuide = {
      id: `user-${Date.now()}`,
      tab: "New guide",
      icon: "description",
      title: "New guide",
      pageType: "",
      context: "",
      problemStatement: "",
      audience: "",
      userGoal: "",
      businessGoal: "",
      contextDetails: [
        { label: "Decision needed", value: "- [ ] ", checkable: true },
        { label: "Out of scope", value: "" },
        { label: "Contributors", value: "" },
      ],
      items: [],
    };
    storeCreatedGuide(newGuide);
    const newNode = { guideId: newGuide.id, state: "", x, y };
    setNodes((prev) => [...prev, newNode]);
    setActiveNodeId(newGuide.id);
    return newGuide;
  }

  function addBlankGuide() {
    const col = nodes.length % 3;
    const row = Math.floor(nodes.length / 3);
    createBlankGuide(60 + col * (FLOW_NODE_W + 80), 60 + row * (FLOW_NODE_H + 80));
  }

  function duplicateNode(guideId) {
    const originalGuide = getStoredGuide(guideId);
    const originalNode = nodes.find((n) => n.guideId === guideId);
    if (!originalNode) return;
    const newGuide = { ...originalGuide, id: `user-${Date.now()}`, tab: `${originalGuide.tab || originalGuide.title} copy`, title: `${originalGuide.title} copy` };
    storeCreatedGuide(newGuide);
    setNodes((prev) => [...prev, { guideId: newGuide.id, state: "", x: originalNode.x + 40, y: originalNode.y + 40 }]);
    setContextMenu(null);
  }

  function deleteNodeById(guideId) {
    setNodes((prev) => prev.filter((n) => n.guideId !== guideId));
    setEdges((prev) => prev.filter((e) => e.from !== guideId && e.to !== guideId));
    if (activeNodeId === guideId) setActiveNodeId(null);
    setContextMenu(null);
  }

  function handleNodeMouseDown(e, guideId) {
    if (e.button !== 0 || connecting) return;
    e.stopPropagation();
    dragMoved.current = false;
    const node = nodes.find((n) => n.guideId === guideId);
    const rect = svgRef.current?.getBoundingClientRect();
    if (!node || !rect) return;
    const pan = panOffsetRef.current;
    const z = zoomRef.current;
    setDragging({ nodeId: guideId, offsetX: (e.clientX - rect.left - pan.x) / z - node.x, offsetY: (e.clientY - rect.top - pan.y) / z - node.y });
  }

  function handleNodeClick(e, guideId) {
    if (connecting || dragMoved.current) return;
    e.stopPropagation();
    setActiveEdgeIndex(null);
    setActiveNodeId((prev) => prev === guideId ? null : guideId);
  }

  function handleConnectStart(e, fromId) {
    if (e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pan = panOffsetRef.current;
    const z = zoomRef.current;
    setConnecting({ fromId, x: (e.clientX - rect.left - pan.x) / z, y: (e.clientY - rect.top - pan.y) / z });
  }

  function updateConnectingFromEvent(e) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pan = panOffsetRef.current;
    const z = zoomRef.current;
    const x = (e.clientX - rect.left - pan.x) / z;
    const y = (e.clientY - rect.top - pan.y) / z;
    setConnecting((prev) => prev ? { ...prev, x, y } : null);
  }

  function handleSvgMouseMove(e) {
    if (!connecting) return;
    updateConnectingFromEvent(e);
  }

  function handleCanvasContextMenu(e) {
    e.preventDefault();
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pan = panOffsetRef.current;
    const z = zoomRef.current;
    const worldX = (e.clientX - rect.left - pan.x) / z;
    const worldY = (e.clientY - rect.top - pan.y) / z;
    setContextMenu({ type: "canvas", worldX, worldY, x: e.clientX, y: e.clientY });
  }

  function handleNodeContextMenu(e, guideId) {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ type: "node", guideId, x: e.clientX, y: e.clientY });
  }

  function handleSvgMouseDown(e) {
    if (e.button !== 0 || dragging || connecting) return;
    const isBg = e.target === svgRef.current || e.target.classList.contains("priority-guide-flow-bg");
    if (!isBg) return;
    panMoved.current = false;
    setPanning({ startX: e.clientX, startY: e.clientY, startPanX: panOffset.x, startPanY: panOffset.y });
  }

  function handleSvgMouseUp(e) {
    if (connecting) {
      if (connectTarget && !edges.some((edge) => edge.from === connecting.fromId && edge.to === connectTarget)) {
        setEdges((prev) => [...prev, { from: connecting.fromId, to: connectTarget, label: "" }]);
      }
      setConnecting(null);
      return;
    }
    const isBg = e.target === svgRef.current || e.target.classList.contains("priority-guide-flow-bg");
    if (isBg && !panMoved.current) {
      setActiveNodeId(null);
      setActiveEdgeIndex(null);
    }
  }

  const activeEdge = activeEdgeIndex !== null ? edges[activeEdgeIndex] : null;

  return (
    <main className="priority-guide-flow-editor-page">
      <SideNav
        defaultCollapsed
        className="priority-guide-flow-inspector"
        header={(collapsed) => collapsed ? null : (
          <Heading as="h2" size="xs">Flow settings</Heading>
        )}
      >
        <div className="priority-guide-flow-inspector__content">
          <TextField
            label="Flow name"
            size="compact"
            value={flowTitle}
            disabled={!isLocalFlow}
            onChange={(e) => saveFlowTitle(e.target.value)}
          />
          <TextareaField
            label="JSON"
            size="compact"
            rows="lg"
            value={flowJson}
            readOnly
            className="priority-guide-flow-inspector__json"
          />
        </div>
      </SideNav>

      <div className="priority-guide-flow-editor-workspace">
        <div className="priority-guide-flow-editor-toolbar">
          <Link href={getRoutePath("flows")} onClick={(e) => onNavigate(e, "flows")} icon="arrow_back" iconPosition="start">
            Flows
          </Link>
          <Heading as="h1" size="sm" className="priority-guide-flow-editor-toolbar__title">{flowTitle}</Heading>
          <Button icon="add" iconPosition="start" onClick={addBlankGuide}>
            Add guide
          </Button>
        </div>

        <div className={`priority-guide-flow-editor-canvas${panning ? " priority-guide-flow-editor-canvas--panning" : ""}`}>
        <svg
          ref={svgRef}
          className={`priority-guide-flow-editor-svg${connecting ? " priority-guide-flow-editor-svg--connecting" : ""}`}
          onMouseDown={handleSvgMouseDown}
          onMouseMove={handleSvgMouseMove}
          onMouseUp={handleSvgMouseUp}
          onContextMenu={handleCanvasContextMenu}
        >
          <defs>
            <marker id="flow-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" className="priority-guide-flow-arrowhead" />
            </marker>
            <marker id="flow-arrow-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" className="priority-guide-flow-arrowhead--active" />
            </marker>
          </defs>

          <rect x="0" y="0" width="100%" height="100%" fill="transparent" className="priority-guide-flow-bg" />

          {nodes.length === 0 && (
            <text x="50%" y="50%" className="priority-guide-flow-empty-text" textAnchor="middle" dominantBaseline="middle">
              Right-click or use "Add guide" to start.
            </text>
          )}

          <g transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoom})`}>
            {edges.map((edge, i) => {
              const from = nodes.find((n) => n.guideId === edge.from);
              const to = nodes.find((n) => n.guideId === edge.to);
              if (!from || !to) return null;
              const { x1, y1, x2, y2, d } = getEdgeRoute(from, to);
              const isActive = activeEdgeIndex === i;
              return (
                <g key={`${edge.from}-${edge.to}-${i}`} onClick={() => { setActiveNodeId(null); setActiveEdgeIndex(isActive ? null : i); }} style={{ cursor: "pointer" }}>
                  <path d={d} fill="none" stroke="transparent" strokeWidth="12" />
                  <path d={d} className={`priority-guide-flow-edge${isActive ? " priority-guide-flow-edge--active" : ""}`} markerEnd={`url(#flow-arrow${isActive ? "-active" : ""})`} />
                  {edge.label && (
                    <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 6} className="priority-guide-flow-edge-label" textAnchor="middle">
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}

            {connecting && (() => {
              const from = nodes.find((n) => n.guideId === connecting.fromId);
              if (!from) return null;
              const { x1, y1 } = getEdgeRoute(from, { x: connecting.x - FLOW_NODE_W / 2, y: connecting.y - FLOW_NODE_H / 2 });
              const toNode = connectTarget ? nodes.find((n) => n.guideId === connectTarget) : null;
              const endX = toNode ? toNode.x + FLOW_NODE_W / 2 : connecting.x;
              const endY = toNode ? toNode.y + FLOW_NODE_H / 2 : connecting.y;
              const dx = Math.max(Math.abs(endX - x1) * 0.5, 60) * Math.sign(endX - x1 || 1);
              return (
                <path
                  d={`M ${x1} ${y1} C ${x1 + dx} ${y1}, ${endX - dx} ${endY}, ${endX} ${endY}`}
                  className="priority-guide-flow-edge--connecting"
                  markerEnd="url(#flow-arrow-active)"
                />
              );
            })()}

            {nodes.map((node) => {
              const guide = guides.find((g) => g.id === node.guideId);
              const isActive = activeNodeId === node.guideId;
              const isTarget = connectTarget === node.guideId;
              const isSource = connecting?.fromId === node.guideId;
              return (
                <g
                  key={node.guideId}
                  transform={`translate(${node.x}, ${node.y})`}
                  onMouseDown={(e) => handleNodeMouseDown(e, node.guideId)}
                  onClick={(e) => handleNodeClick(e, node.guideId)}
                  onContextMenu={(e) => handleNodeContextMenu(e, node.guideId)}
                  style={{ cursor: connecting ? "default" : dragging?.nodeId === node.guideId ? "grabbing" : "grab" }}
                >
                  <rect
                    width={FLOW_NODE_W}
                    height={FLOW_NODE_H}
                    rx="4"
                    className={[
                      "priority-guide-flow-node__rect",
                      isActive ? "priority-guide-flow-node__rect--active" : "",
                      isTarget ? "priority-guide-flow-node__rect--target" : "",
                      isSource ? "priority-guide-flow-node__rect--source" : "",
                    ].filter(Boolean).join(" ")}
                  />
                  <foreignObject width={FLOW_NODE_W} height={FLOW_NODE_H} style={{ pointerEvents: "none" }}>
                    <div xmlns="http://www.w3.org/1999/xhtml" className="priority-guide-flow-node__content">
                      {guide?.pageType && <span className="priority-guide-flow-node__page-type">{guide.pageType}</span>}
                      <span
                        className="priority-guide-flow-node__title priority-guide-flow-node__title--editable"
                        contentEditable
                        suppressContentEditableWarning
                        style={{ pointerEvents: "all" }}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                        onBlur={(e) => {
                          const val = e.currentTarget.textContent.trim();
                          if (val !== (guide?.title || "")) {
                            const stored = loadStoredEditor() ?? {};
                            const seed = getStoredGuide(node.guideId);
                            const draft = stored.drafts?.[node.guideId] ?? makeDraft(seed);
                            saveStoredEditor({ ...stored, drafts: { ...(stored.drafts ?? {}), [node.guideId]: { ...draft, title: val || "New guide" } } });
                            setNodes((prev) => [...prev]);
                          }
                        }}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); e.currentTarget.blur(); } }}
                      >
                        {guide?.title || "New guide"}
                      </span>
                      <span
                        className="priority-guide-flow-node__desc priority-guide-flow-node__desc--editable"
                        contentEditable
                        suppressContentEditableWarning
                        style={{ pointerEvents: "all" }}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                        onBlur={(e) => {
                          const val = e.currentTarget.textContent.trim();
                          if (val !== (guide?.problemStatement || "")) {
                            const stored = loadStoredEditor() ?? {};
                            const seed = getStoredGuide(node.guideId);
                            const draft = stored.drafts?.[node.guideId] ?? makeDraft(seed);
                            saveStoredEditor({ ...stored, drafts: { ...(stored.drafts ?? {}), [node.guideId]: { ...draft, problemStatement: val } } });
                            setNodes((prev) => [...prev]);
                          }
                        }}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); e.currentTarget.blur(); } }}
                        data-placeholder="Add description…"
                      >
                        {guide?.problemStatement || ""}
                      </span>
                    </div>
                  </foreignObject>
                  <circle
                    cx={FLOW_NODE_W}
                    cy={FLOW_NODE_H / 2}
                    r={7}
                    className={`priority-guide-flow-node__handle${connecting ? " priority-guide-flow-node__handle--visible" : ""}`}
                    onMouseDown={(e) => handleConnectStart(e, node.guideId)}
                    style={{ cursor: "crosshair" }}
                  />
                </g>
              );
            })}
          </g>
        </svg>

        {/* Edge popup */}
        {activeEdge && (() => {
          const from = nodes.find((n) => n.guideId === activeEdge.from);
          const to = nodes.find((n) => n.guideId === activeEdge.to);
          if (!from || !to) return null;
          const { x1, y1, x2, y2 } = getEdgeRoute(from, to);
          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;
          return (
            <div className="priority-guide-flow-edge-popup" style={{ left: midX * zoom + panOffset.x, top: midY * zoom + panOffset.y }}>
              <input
                type="text"
                className="priority-guide-flow-edge-popup__input"
                value={activeEdge.label ?? ""}
                placeholder="Add label…"
                onChange={(e) => setEdges((prev) => prev.map((ed, i) => i === activeEdgeIndex ? { ...ed, label: e.target.value } : ed))}
                onClick={(e) => e.stopPropagation()}
              />
              <IconButton
                icon="delete"
                label="Delete connection"
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  setEdges((prev) => prev.filter((_, i) => i !== activeEdgeIndex));
                  setActiveEdgeIndex(null);
                }}
              />
            </div>
          );
        })()}

        {/* Zoom controls */}
        <div className="priority-guide-flow-zoom">
          <button className="priority-guide-flow-zoom__reset" onClick={() => { setPanOffset({ x: 0, y: 0 }); setZoom(1); }} title="Reset view">Reset view</button>
          <div className="priority-guide-flow-zoom__divider" />
          <IconButton icon="remove" label="Zoom out" size="sm" onClick={() => setZoom((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)))} />
          <button className="priority-guide-flow-zoom__value" onClick={() => setZoom(1)}>{Math.round(zoom * 100)}%</button>
          <IconButton icon="add" label="Zoom in" size="sm" onClick={() => setZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)))} />
        </div>
      </div>
      </div>

      {/* Phantom anchor for context menu */}
      <div
        ref={ctxMenuAnchorRef}
        style={{ position: "fixed", left: contextMenu?.x ?? -9999, top: contextMenu?.y ?? -9999, width: 0, height: 0, pointerEvents: "none" }}
      />
      <Menu
        open={!!contextMenu}
        onClose={() => setContextMenu(null)}
        anchorRef={ctxMenuAnchorRef}
        aria-label="Canvas options"
      >
        {contextMenu?.type === "node" ? (
          <>
            <MenuSection>
              <MenuItem icon="edit" onClick={() => { setActiveNodeId(contextMenu.guideId); setContextMenu(null); }}>Edit</MenuItem>
              <MenuItem icon="content_copy" onClick={() => duplicateNode(contextMenu.guideId)}>Duplicate</MenuItem>
            </MenuSection>
            <MenuSection>
              <MenuItem icon="delete" variant="destructive" onClick={() => deleteNodeById(contextMenu.guideId)}>Delete</MenuItem>
            </MenuSection>
          </>
        ) : (
          <MenuSection>
            <MenuItem icon="add" onClick={() => { createBlankGuide(contextMenu.worldX - FLOW_NODE_W / 2, contextMenu.worldY - FLOW_NODE_H / 2); setContextMenu(null); }}>Add guide here</MenuItem>
          </MenuSection>
        )}
      </Menu>

      <Dialog
        open={!!activeNodeId && !!nodeForm}
        onClose={closeNodeEditor}
        onClick={handleNodeEditorClick}
        onKeyDown={handleNodeEditorKeyDown}
        title={nodeForm ? (guides.find((g) => g.id === activeNodeId)?.title || "New guide") : "Guide"}
        footer={
          <>
            <Button onClick={closeNodeEditor}>Done</Button>
            <span style={{ flex: 1 }} />
            <Button variant="destructive" icon="delete" iconPosition="start" onClick={deleteActiveNode}>
              Delete
            </Button>
          </>
        }
      >
        {nodeForm && (
          <div className="priority-guide-flow-node-dialog">
            <TextField
              label="Guide name"
              value={nodeForm.title}
              placeholder="Untitled guide"
              onChange={(e) => saveNodeField("title", e.target.value)}
            />
            <SelectField
              label="Page type"
              value={nodeForm.pageType}
              onChange={(e) => saveNodeField("pageType", e.target.value)}
            >
              <option value="">— select —</option>
              {pageTypeOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </SelectField>
            <TextareaField
              label="Description"
              rows="sm"
              value={nodeForm.problemStatement}
              placeholder="What problem does this page solve?"
              onChange={(e) => saveNodeField("problemStatement", e.target.value)}
            />
            <Link
              href={getRoutePath("editor", { guide: activeNodeId })}
              icon="open_in_new"
              iconPosition="end"
              onClick={(e) => { setActiveNodeId(null); onNavigate(e, "editor", { guide: activeNodeId }); }}
            >
              Open guide
            </Link>
          </div>
        )}
      </Dialog>
    </main>
  );
}

function FlowsPage({ onNavigate }) {
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

function GuideLibraryPage({ onNavigate }) {
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

function loadAppSettings() {
  try { return JSON.parse(localStorage.getItem("priority-guide-settings") ?? "{}"); } catch { return {}; }
}
function saveAppSettings(s) { localStorage.setItem("priority-guide-settings", JSON.stringify(s)); }
function applyTheme(theme) {
  document.documentElement.classList.remove("a1-theme-light", "a1-theme-dark");
  if (theme === "light") document.documentElement.classList.add("a1-theme-light");
  if (theme === "dark") document.documentElement.classList.add("a1-theme-dark");
}

function App() {
  const [route, setRoute] = useState(() => getRoute());
  const [settings, setSettings] = useState(() => loadAppSettings());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsAnchorRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.add("a1-theme-heritage");
    return () => { document.documentElement.classList.remove("a1-theme-heritage"); };
  }, []);

  useEffect(() => { applyTheme(settings.theme ?? "system"); }, [settings.theme]);

  function updateSetting(key, value) {
    const next = { ...settings, [key]: value };
    setSettings(next);
    saveAppSettings(next);
  }

  useEffect(() => {
    const pageTitles = {
      examples: "Examples | Priority Guide",
      start: "Start | Priority Guide",
      flows: "Flows | Priority Guide",
      "flow-editor": "Flow Editor | Priority Guide",
      guides: "Pages | Priority Guide",
      new: "New guide | Priority Guide",
      editor: "Pages | Priority Guide",
      presentation: "Presentation | Priority Guide",
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

  function navigate(page, { guide = route.guide, flow = route.flow, hash } = {}) {
    const nextRoute = {
      page: pageIds.includes(page) ? page : "home",
      guide: guide || exampleGuides[0].id,
      flow: flow || exampleFlows[0].id,
      hash: hash ?? "",
    };
    const nextPath = getRoutePath(nextRoute.page, { guide: nextRoute.guide, flow: nextRoute.flow, hash });
    const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    if (nextPath !== currentPath) {
      window.history.pushState(nextRoute, "", nextPath);
    }

    setRoute(nextRoute);
  }

  function handleRouteClick(event, page, options) {
    if (!event) {
      navigate(page, options);
      return;
    }

    if (!isPlainLeftClick(event)) return;

    event.preventDefault();
    navigate(page, options);
  }

  function handleGuideChange(guide) {
    navigate("examples", { guide });
  }

  const themeOptions = [
    { value: "light", icon: "light_mode", label: "Light" },
    { value: "dark", icon: "dark_mode", label: "Dark" },
    { value: "system", icon: "computer", label: "System" },
  ];
  const currentTheme = settings.theme ?? "system";

  const header = (
    <header className="priority-guide-header">
      <a
        className="priority-guide-logo"
        href={getRoutePath("home")}
        onClick={(event) => handleRouteClick(event, "home")}
        aria-current={route.page === "home" && !route.hash ? "page" : undefined}
      >
        Priority Guide: Align before AI
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
          className={route.page === "flows" || route.page === "flow-editor" ? "priority-guide-nav-link--active" : ""}
          href={getRoutePath("flows", { flow: route.flow })}
          onClick={(event) => handleRouteClick(event, "flows")}
          aria-current={route.page === "flows" || route.page === "flow-editor" ? "page" : undefined}
        >
          Flows
        </a>
        <a
          className={route.page === "guides" || route.page === "editor" || route.page === "new" ? "priority-guide-nav-link--active" : ""}
          href={getRoutePath("guides")}
          onClick={(event) => handleRouteClick(event, "guides")}
          aria-current={route.page === "guides" || route.page === "editor" || route.page === "new" ? "page" : undefined}
        >
          Pages
        </a>
      </nav>
      <div ref={settingsAnchorRef} className="priority-guide-header-settings">
        <IconButton
          icon="settings"
          label="Settings"
          aria-haspopup="dialog"
          aria-expanded={settingsOpen}
          onClick={() => setSettingsOpen((v) => !v)}
        />
        <Menu open={settingsOpen} onClose={() => setSettingsOpen(false)} anchorRef={settingsAnchorRef} aria-label="Settings">
          <div className="priority-guide-settings-menu">
            <p className="priority-guide-settings-menu__label">Theme</p>
            <SegmentedControl
              options={themeOptions}
              value={currentTheme}
              onChange={(v) => updateSetting("theme", v)}
              fullWidth
            />
          </div>
        </Menu>
      </div>
    </header>
  );

  if (route.page === "presentation") {
    return <PresentationPage activeGuide={route.guide} onNavigate={handleRouteClick} />;
  }

  return (
    <PageLayout stickyHeader header={header}>
      {route.page === "examples" ? (
        <ExamplesPage activeGuide={route.guide} onGuideChange={handleGuideChange} />
      ) : route.page === "start" ? (
        <StartPage onNavigate={handleRouteClick} />
      ) : route.page === "flows" ? (
        <FlowsPage onNavigate={handleRouteClick} />
      ) : route.page === "flow-editor" ? (
        <FlowEditorPage flowId={route.flow} onNavigate={handleRouteClick} />
      ) : route.page === "guides" ? (
        <GuideLibraryPage onNavigate={handleRouteClick} />
      ) : route.page === "new" ? (
        <NewGuidePage onNavigate={handleRouteClick} />
      ) : route.page === "editor" ? (
        <EditorPage onNavigate={handleRouteClick} activeGuide={route.guide} />
      ) : (
        <LandingPage onNavigate={handleRouteClick} />
      )}
    </PageLayout>
  );
}

createRoot(document.getElementById("root")).render(<App />);
