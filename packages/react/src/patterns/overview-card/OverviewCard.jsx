"use client";

import { normalizePatternReactItems, normalizePatternActionData } from "../patternReact.jsx";
import { getPatternManifest } from "../patternPolicies.js";
import { Button } from "../../components/button/Button.jsx";
import { ButtonContainer } from "../../components/button-container/ButtonContainer.jsx";
import { Card } from "../../components/card/Card.jsx";
import { DefinitionList } from "../../components/definition-list/DefinitionList.jsx";
import { Heading } from "../../components/heading/Heading.jsx";
import { IconButton } from "../../components/icon-button/IconButton.jsx";
import { Link } from "../../components/link/Link.jsx";
import { Stack } from "../../components/stack/Stack.jsx";

const manifest = getPatternManifest("OverviewCard");
const TITLE_LEVELS = manifest.propsSchema.properties.titleAs.enum;
const STATUSES = manifest.propsSchema.properties.status.enum;

function isActionList(actions) {
  return Array.isArray(actions) && actions.every((action) => action && typeof action === "object" && "label" in action && !("$$typeof" in action));
}

/**
 * The card-action rule, applied to the data form: buttons and icon buttons are
 * small and never primary — a card repeats in a grid, so a primary in every card
 * would compete. A button's primary (or unset) variant becomes secondary, an
 * icon button's becomes tertiary; links pass through.
 */
export function normalizeOverviewCardActions(actions) {
  return normalizePatternActionData("OverviewCard", actions);
}

function renderAction(action, index) {
  const key = action.id ?? index;
  if (action.kind === "icon-button") {
    return (
      <IconButton
        key={key}
        icon={action.icon || "more_horiz"}
        label={typeof action.label === "string" ? action.label : "Action"}
        variant={action.variant}
        size="sm"
        as={action.href ? "a" : undefined}
        href={action.href}
        disabled={action.disabled}
        onClick={action.onClick}
      />
    );
  }
  if (action.kind === "link") {
    return (
      <Link key={key} href={action.href ?? "#"} icon={action.icon || undefined} iconPosition={action.iconPosition} onClick={action.onClick}>
        {action.label}
      </Link>
    );
  }
  return (
    <Button
      key={key}
      as={action.href ? "a" : undefined}
      href={action.href}
      variant={action.variant}
      size="sm"
      icon={action.icon || undefined}
      iconPosition={action.iconPosition}
      disabled={action.disabled}
      onClick={action.onClick}
    >
      {action.label}
    </Button>
  );
}

/**
 * OverviewCard — a summary of one thing: an icon, a heading, a definition list
 * of key details, a content area and an optional action row, with an optional
 * labelled status. A pattern: it composes Card, Heading, DefinitionList and
 * ButtonContainer with props only, and keeps its presentation locked — default
 * card surface, the standard icon block, a md heading, row details with fixed
 * labels and small, non-primary actions — so every overview in a set reads the
 * same.
 */
export function OverviewCard({
  icon = "account_circle",
  title,
  titleAs = "h3",
  status,
  statusLabel,
  details = [],
  actions,
  className = "",
  children,
  ...rest
}) {
  // Status is never colour-only: the stripe shows only with its label.
  const hasStatus = !!statusLabel && STATUSES.includes(status ?? "neutral");
  const actionNodes = isActionList(actions)
    ? normalizeOverviewCardActions(actions).map(renderAction)
    : normalizePatternReactItems("OverviewCard", "actions", actions);

  return (
    <Card
      {...rest}
      {...manifest.lockedProps}
      icon={icon || "account_circle"}
      status={hasStatus ? status ?? "neutral" : undefined}
      statusLabel={hasStatus ? statusLabel : undefined}
      className={["a1-overview-card", className].filter(Boolean).join(" ")}
    >
      <Stack direction="column" gap="sm">
        <Heading as={TITLE_LEVELS.includes(titleAs) ? titleAs : "h3"} size="md">
          {title}
        </Heading>
        {Array.isArray(details) && details.length ? (
          <DefinitionList direction="row" size="sm" labelWidth="fixed" items={details} />
        ) : null}
        {children}
        {actionNodes.length > 0 ? <ButtonContainer align="start">{actionNodes}</ButtonContainer> : null}
      </Stack>
    </Card>
  );
}
