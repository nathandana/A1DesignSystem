"use client";

import { normalizePatternReactItems, normalizePatternActionData } from "../patternReact.jsx";
import { getPatternManifest } from "../patternPolicies.js";
import { Breadcrumb } from "../../components/breadcrumb/Breadcrumb.jsx";
import { Button } from "../../components/button/Button.jsx";
import { ButtonContainer } from "../../components/button-container/ButtonContainer.jsx";
import { Heading } from "../../components/heading/Heading.jsx";
import { IconButton } from "../../components/icon-button/IconButton.jsx";
import { Link } from "../../components/link/Link.jsx";
import { MessageBadge } from "../../components/message/Message.jsx";
import { Paragraph } from "../../components/paragraph/Paragraph.jsx";
import { Section } from "../../components/section/Section.jsx";
import { Stack } from "../../components/stack/Stack.jsx";

const manifest = getPatternManifest("PageTitle");
const CONTENT_WIDTHS = manifest.propsSchema.properties.contentWidth.enum;
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
  return normalizePatternReactItems("PageTitle", "meta", meta);
}

const ACTION_KINDS = ["button", "link", "icon-button"];
const ICON_BUTTON_VARIANTS = manifest.areas.find(area => area.id === "actions").policies.variants.IconButton.allow;

function actionKind(action) {
  return ACTION_KINDS.includes(action.kind) ? action.kind : "button";
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
  return normalizePatternActionData("PageTitle", actions);
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
    : normalizePatternReactItems("PageTitle", "actions", actions);

  return (
    <Section
      {...rest}
      {...manifest.lockedProps}
      contentWidth={resolvedContentWidth}
      className={["a1-page-title", className].filter(Boolean).join(" ")}
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
