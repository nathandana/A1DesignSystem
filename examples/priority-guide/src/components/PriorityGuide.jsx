import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  ButtonContainer,
  Card,
  Dialog,
  Divider,
  Grid,
  Heading,
  Icon,
  IconButton,
  InlineEditable,
  Link,
  List,
  ListItem,
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
import { componentThumbnailMap } from "../../../../packages/react/src/illustrations/ComponentThumbnails.jsx";
import { exampleGuides, itemComponentOptions, pageTypeOptions } from "../lib/data.jsx";
import { getRoutePath } from "../lib/routing.js";


export function isMissingOverviewValue(value) {
  return !String(value ?? "")
    .replace(/^-\s*\[\s*\]\s*/gm, "")
    .trim();
}

export function MissingOverviewValue({ label }) {
  return (
    <span className="priority-guide-overview-missing">
      Add {label.toLowerCase()}
    </span>
  );
}

export function PriorityGuideMeta({ label, value, onChange }) {
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

export function parseCheckboxLines(text) {
  return String(text ?? "").split("\n").map((l) => l.trim()).filter(Boolean).map((line) => {
    const match = line.match(/^-\s*\[(x|X|\s*)\]\s*(.*)$/);
    if (match) return { checked: match[1].trim().toLowerCase() === "x", text: match[2] };
    return { checked: false, text: line.replace(/^-\s+/, "") };
  });
}

export function PriorityGuideContext({ label, value, onChange, checkable }) {
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

export function EditableRank({ index, total, onMoveTo }) {
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

export function isGuideGroup(item) {
  return item?.kind === "group" || Array.isArray(item?.children);
}

export function getItemComponentType(item) {
  return item.componentType || (isGuideGroup(item) ? "Section" : "Element");
}

export function isGuideLinkComponent(item) {
  return /\b(button|link)\b/i.test(getItemComponentType(item));
}

export function getGuideTitleById(guides, guideId) {
  return guides.find((guide) => guide.id === guideId)?.title ?? guideId;
}

const guideItemKeys = new WeakMap();
let guideItemKeyCounter = 0;

export function getGuideItemRenderKey(item, fallback = "item") {
  if (!item || typeof item !== "object") return fallback;
  if (!guideItemKeys.has(item)) {
    guideItemKeyCounter += 1;
    guideItemKeys.set(item, `guide-item-${guideItemKeyCounter}`);
  }
  return guideItemKeys.get(item);
}

export function getListItems(content) {
  return String(content ?? "")
    .split(/\n|;/)
    .map((line) => line.replace(/^[-*]\s+/, "").trim())
    .filter(Boolean);
}

export function isListComponent(item) {
  return /list|checklist/i.test(getItemComponentType(item));
}

export function isParagraphComponent(item) {
  return /paragraph|body|copy/i.test(getItemComponentType(item));
}

export function isHeadingComponent(item) {
  return /heading|headline|title|subheading/i.test(getItemComponentType(item));
}

export function GuideItemContent({ item }) {
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

export function PriorityGuideItem({
  item,
  index,
  guides = exampleGuides,
  onSelect,
  onChildSelect,
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
      onClick={onSelect ? (e) => onSelect(e) : undefined}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={onSelect ? (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(e);
        }
      } : undefined}
      draggable={!!onMove}
      onDragStart={onMove ? (e) => {
        e.stopPropagation();
        e.dataTransfer.setData("application/x-priority-guide-index", String(index));
        e.dataTransfer.setData("text/plain", String(index));
        e.dataTransfer.effectAllowed = "move";
      } : undefined}
      onDragOver={onMove ? (e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(true); } : undefined}
      onDragLeave={onMove ? (e) => { e.stopPropagation(); setIsDragOver(false); } : undefined}
      onDragEnd={onMove ? (e) => { e.stopPropagation(); setIsDragOver(false); } : undefined}
      onDrop={onMove ? (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        const from = parseInt(
          e.dataTransfer.getData("application/x-priority-guide-index") || e.dataTransfer.getData("text/plain"),
          10
        );
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
              <Button
                size="sm"
                variant="secondary"
                icon={groupOpen ? "expand_less" : "expand_more"}
                iconPosition="start"
                aria-expanded={groupOpen}
                onClick={(e) => {
                  e.stopPropagation();
                  setGroupOpen((open) => !open);
                }}
              >
                {groupOpen ? "Collapse" : "Expand"}
              </Button>
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
                key={getGuideItemRenderKey(child, `child-${childIndex}`)}
                item={child}
                index={childIndex}
                guides={guides}
                onSelect={onChildSelect ? (e) => {
                  e.stopPropagation();
                  onChildSelect(index, childIndex);
                } : undefined}
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
          <List as="ul" size="sm" color="muted">
            {annotations.map((annotation, i) => (
              <ListItem key={i}>{annotation}</ListItem>
            ))}
          </List>
        </aside>
      )}
    </li>
  );
}

export function PriorityGuideDocument({
  guide,
  guides = exampleGuides,
  compact = false,
  onFieldChange,
  onContextChange,
  overviewOpen = true,
  onOverviewToggle,
  onItemSelect,
  onChildItemSelect,
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
          {onFieldChange ? (
            <SelectField
              label="Page type"
              size="compact"
              value={guide.pageType ?? ""}
              onChange={(e) => onFieldChange("pageType", e.target.value)}
            >
              <option value="">— select —</option>
              {pageTypeOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
              {guide.pageType && !pageTypeOptions.includes(guide.pageType) && (
                <option value={guide.pageType}>{guide.pageType}</option>
              )}
            </SelectField>
          ) : (
            <>
              <span className="priority-guide-kicker">Page type</span>
              <span className="priority-guide-page-type-badge">{guide.pageType}</span>
            </>
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
            key={getGuideItemRenderKey(item, `item-${index}`)}
            item={item}
            index={index}
            guides={guides}
            onSelect={onItemSelect ? () => onItemSelect(index) : undefined}
            onChildSelect={onChildItemSelect}
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
          <Button variant="secondary" icon="add" iconPosition="start" onClick={onAddItem}>
            Add item
          </Button>
        </div>
      )}
    </article>
  );
}

export function ItemDetailCanvas({ item, index, guides = exampleGuides, onFieldChange, showAnnotations = true }) {
  return (
    <article className="priority-guide-document priority-guide-document--detail">
      <ol className="priority-guide-document__list" aria-label="Item detail">
        <PriorityGuideItem item={item} index={index} guides={guides} onFieldChange={onFieldChange} showAnnotations={showAnnotations} />
      </ol>
    </article>
  );
}

export function ExampleGuides({ activeGuide, onGuideChange }) {
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
