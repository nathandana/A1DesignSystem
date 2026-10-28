"use client";

import { Children, Fragment, cloneElement, isValidElement } from "react";
import { Breadcrumb } from "../../components/breadcrumb/Breadcrumb.jsx";
import { Button } from "../../components/button/Button.jsx";
import { ButtonContainer } from "../../components/button-container/ButtonContainer.jsx";
import { Heading } from "../../components/heading/Heading.jsx";
import { IconButton } from "../../components/icon-button/IconButton.jsx";
import { Link } from "../../components/link/Link.jsx";
import { MessageBadge } from "../../components/message/Message.jsx";
import { Paragraph } from "../../components/paragraph/Paragraph.jsx";
import { Section } from "../../components/section/Section.jsx";
import { SplitButton } from "../../components/split-button/SplitButton.jsx";
import { Stack } from "../../components/stack/Stack.jsx";

const CONTENT_WIDTHS = ["xs", "sm", "md", "lg", "xl", "2xl"];
// Locked presentation: the band sits on the panel surface, the title is always
// the page's h1 and steps from lg (xs) to xxl (md+) so long titles wrap well.
const TITLE_SIZE = { xs: "lg", md: "xxl" };

function isBadgeData(item) {
  return !!item && typeof item === "object" && !Array.isArray(item) && "label" in item && !("$$typeof" in item);
}

// The metadata row: badge data (one or a list) or composed nodes.
function renderMeta(meta) {
  const list = isBadgeData(meta) ? [meta] : meta;
  if (Array.isArray(list) && list.length && list.every(isBadgeData)) {
    return list.map((badge, index) => (
      <MessageBadge key={badge.id ?? index} status={badge.status} icon={badge.icon} subtle size="sm">
        {badge.label}
      </MessageBadge>
    ));
  }
  return Array.isArray(meta) && meta.length === 0 ? null : meta;
}

const ACTION_KINDS = ["button", "link", "icon-button"];
const ICON_BUTTON_VARIANTS = ["tertiary", "secondary", "destructive", "success"];

function actionKind(action) {
  return ACTION_KINDS.includes(action.kind) ? action.kind : "button";
}

// Only a Button can be the primary action; links and icon buttons never are.
function isPrimaryAction(action) {
  return actionKind(action) === "button" && action.variant === "primary";
}

function isActionList(actions) {
  return Array.isArray(actions) && actions.every((action) => action && typeof action === "object" && "label" in action && !("$$typeof" in action));
}

/**
 * The page-action rule, applied to the data form: at most one primary action,
 * always last. The first primary is kept and moved to the end; any further
 * primaries become secondary; the other actions keep their order.
 */
export function normalizePageTitleActions(actions) {
  let primary = null;
  const rest = [];
  for (const action of actions) {
    if (isPrimaryAction(action)) {
      if (primary) rest.push({ ...action, variant: "secondary" });
      else primary = action;
    } else {
      rest.push(action);
    }
  }
  return primary ? [...rest, primary] : rest;
}

// One action descriptor → the matching A1 control.
function renderAction(action, index) {
  const key = action.id ?? index;
  const kind = actionKind(action);
  if (kind === "link") {
    return (
      <Link key={key} href={action.href ?? "#"} icon={action.icon || undefined} onClick={action.onClick}>
        {action.label}
      </Link>
    );
  }
  if (kind === "icon-button") {
    return (
      <IconButton
        key={key}
        icon={action.icon || "more_horiz"}
        label={typeof action.label === "string" ? action.label : "Action"}
        variant={ICON_BUTTON_VARIANTS.includes(action.variant) ? action.variant : "tertiary"}
        as={action.href ? "a" : undefined}
        href={action.href}
        disabled={action.disabled}
        onClick={action.onClick}
      />
    );
  }
  return (
    <Button
      key={key}
      as={action.href ? "a" : undefined}
      href={action.href}
      variant={action.variant ?? "secondary"}
      icon={action.icon || undefined}
      disabled={action.disabled}
      onClick={action.onClick}
    >
      {action.label}
    </Button>
  );
}

function flattenNodes(nodes) {
  return Children.toArray(nodes).flatMap((child) =>
    isValidElement(child) && child.type === Fragment ? flattenNodes(child.props.children) : [child],
  );
}

// Button and SplitButton are primary unless told otherwise, so a composed
// action with no `variant` counts as the primary one. Links, icon buttons,
// toolbars and segmented controls never do.
const DEFAULT_PRIMARY_TYPES = new Set([Button, SplitButton]);

function isPrimaryNode(child) {
  if (!isValidElement(child) || child.type === Link || child.type === IconButton) return false;
  const variant = child.props?.variant;
  return variant === undefined ? DEFAULT_PRIMARY_TYPES.has(child.type) : variant === "primary";
}

const demote = (child) => cloneElement(child, { variant: "secondary" });

// The same rule for composed actions. A ButtonContainer is a button group: it
// stays together, the rule applies inside it (its primary moves to its end)
// and the group holding the primary is shown last.
function normalizeActionNodes(actions) {
  let primary = null;
  const rest = [];
  for (const child of flattenNodes(actions)) {
    if (isValidElement(child) && child.type === ButtonContainer) {
      let groupPrimary = null;
      const groupRest = [];
      for (const item of flattenNodes(child.props.children)) {
        if (!isPrimaryNode(item)) groupRest.push(item);
        else if (primary || groupPrimary) groupRest.push(demote(item));
        else groupPrimary = item;
      }
      if (groupPrimary) primary = cloneElement(child, { children: [...groupRest, groupPrimary] });
      else rest.push(cloneElement(child, { children: groupRest }));
    } else if (isPrimaryNode(child)) {
      if (primary) rest.push(demote(child));
      else primary = child;
    } else {
      rest.push(child);
    }
  }
  return primary ? [...rest, primary] : rest;
}

/**
 * PageTitle — the standard top band of a page: an optional breadcrumb and
 * eyebrow, the page's h1, an optional metadata row of badges directly below it,
 * a short description and the page actions. A pattern: it composes Section,
 * Breadcrumb, Heading, Paragraph, MessageBadge and ButtonContainer with props
 * only, and keeps its presentation locked — panel surface, fixed title scale,
 * h1, metadata below the title — so every page top is the same. Only the content and the content width are configurable.
 */
export function PageTitle({
  breadcrumb,
  backLabel,
  eyebrow,
  title,
  titleId,
  description,
  meta,
  actions,
  contentWidth = "xl",
  className = "",
  children,
  ...rest
}) {
  const resolvedContentWidth = CONTENT_WIDTHS.includes(contentWidth) ? contentWidth : "xl";

  // The metadata row always sits directly below the title, so badges keep one
  // place however long the title runs.
  const metaNode = renderMeta(meta);

  // Actions are composed controls (Button, SplitButton, Link, IconButton, a
  // ButtonContainer group, Toolbar or SegmentedControl) or a data list. Both
  // follow the one-primary-last rule and sit in a ButtonContainer, so they
  // stack on narrow containers like every other action row.
  const actionNodes = isActionList(actions)
    ? normalizePageTitleActions(actions).map(renderAction)
    : normalizeActionNodes(actions);

  return (
    <Section
      as="header"
      padding="xs"
      surface="panel"
      contentWidth={resolvedContentWidth}
      borderSize="sm"
      borderVariant="accent"
      borderSides="bottom"
      className={["a1-page-title", className].filter(Boolean).join(" ")}
      {...rest}
    >
      <Stack direction="column" gap="xs">
        {Array.isArray(breadcrumb) && breadcrumb.length ? <Breadcrumb items={breadcrumb} backLabel={backLabel} /> : null}
        {eyebrow ? (
          <Paragraph as="span" size="xs" color="muted">
            {eyebrow}
          </Paragraph>
        ) : null}
        <Heading as="h1" id={titleId} size={TITLE_SIZE}>
          {title}
        </Heading>
        {metaNode ? (
          <Stack direction="row" gap="xs" align="center" wrap>
            {metaNode}
          </Stack>
        ) : null}
        {description ? (
          <Paragraph size="md" color="muted">
            {description}
          </Paragraph>
        ) : null}
        {actionNodes.length > 0 ? <ButtonContainer align="start">{actionNodes}</ButtonContainer> : null}
        {children}
      </Stack>
    </Section>
  );
}
