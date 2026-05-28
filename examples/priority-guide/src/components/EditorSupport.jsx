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
  InlineEditable,
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
import { getGuideItemRenderKey, getItemComponentType, isGuideGroup } from "./PriorityGuide.jsx";
import { pageTypeOptions } from "../lib/data.jsx";

export function getTreeItemLabel(item) {
  const text = String(item.content || item.title || getItemComponentType(item) || "Untitled item").trim();
  return text.length > 52 ? `${text.slice(0, 49)}...` : text;
}

export function GuideItemTree({ items, activeIndex, activeChildIndex, expandedGroups, onToggleGroup, onSelectItem, onSelectChild }) {
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
          <li key={getGuideItemRenderKey(item, `tree-${index}`)} className="priority-guide-tree__item">
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
                className={`priority-guide-tree__button${activeIndex === index && activeChildIndex === null ? " priority-guide-tree__button--active" : ""}`}
                onClick={() => onSelectItem(index)}
              >
                <span className="priority-guide-tree__type">{getItemComponentType(item)}</span>
                <span className="priority-guide-tree__label">{getTreeItemLabel(item)}</span>
              </button>
            </div>
            {isGroup && expanded && (
              <ol className="priority-guide-tree__children">
                {(item.children ?? []).map((child, childIndex) => (
                  <li key={getGuideItemRenderKey(child, `tree-child-${childIndex}`)}>
                    <button
                      type="button"
                      className={`priority-guide-tree__button priority-guide-tree__button--child${activeIndex === index && activeChildIndex === childIndex ? " priority-guide-tree__button--active" : ""}`}
                      onClick={() => onSelectChild(index, childIndex)}
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

export function EditorOverviewList({ draft, onFieldChange, onContextChange }) {
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
    <ol className="priority-guide-overview-list" aria-label="Guide overview">
      {fields.map((field) => {
        const value = field.isContext ? field.value : (draft[field.key] ?? "");
        const handleChange = field.isContext
          ? (v) => onContextChange(field.contextIndex, v)
          : (v) => onFieldChange(field.key, v);
        return (
          <li key={field.key} className="priority-guide-overview-list__item">
            <span className="priority-guide-overview-list__label">{field.label}</span>
            <InlineEditable value={value} onChange={handleChange} multiline={field.multiline} inputClassName="priority-guide-overview-list__input" aria-label={`Edit ${field.label}`}>
              <p className="priority-guide-overview-list__value">
                {value || <span className="priority-guide-overview-list__empty">Add {field.label.toLowerCase()}...</span>}
              </p>
            </InlineEditable>
          </li>
        );
      })}
    </ol>
  );
}

export function EditorOverviewFields({ draft, onFieldChange, onContextChange }) {
  return (
    <div className="priority-guide-overview-fields">
      <SelectField
        label="Page type"
        size="compact"
        value={draft.pageType ?? ""}
        onChange={(e) => onFieldChange("pageType", e.target.value)}
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
        onChange={(e) => onFieldChange("title", e.target.value)}
      />
      <TextareaField
        label="Problem statement"
        size="compact"
        rows="md"
        value={draft.problemStatement ?? ""}
        onChange={(e) => onFieldChange("problemStatement", e.target.value)}
      />
      <TextareaField
        label="Audience"
        size="compact"
        rows="sm"
        value={draft.audience ?? ""}
        onChange={(e) => onFieldChange("audience", e.target.value)}
      />
      <TextareaField
        label="User goal"
        size="compact"
        rows="sm"
        value={draft.userGoal ?? ""}
        onChange={(e) => onFieldChange("userGoal", e.target.value)}
      />
      <TextareaField
        label="Business goal"
        size="compact"
        rows="sm"
        value={draft.businessGoal ?? ""}
        onChange={(e) => onFieldChange("businessGoal", e.target.value)}
      />
      {(draft.contextDetails ?? []).map((item, index) => (
        <TextareaField
          key={`${item.label}-${index}`}
          label={item.label}
          size="compact"
          rows="sm"
          value={item.value ?? ""}
          onChange={(e) => onContextChange(index, e.target.value)}
        />
      ))}
    </div>
  );
}
