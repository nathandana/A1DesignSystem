import { useMemo } from "react";
import {
  Button,
  Card,
  Heading,
  Paragraph,
  Section,
  Stack,
} from "../../../../packages/react/src/index.js";
import { LeaveByCard } from "../components/LeaveByCard.jsx";
import { MetricsBar } from "../components/MetricsBar.jsx";
import { PlanSummary } from "../components/PlanSummary.jsx";
import { TimelineView } from "../components/TimelineView.jsx";
import { generatePlanInsights } from "../lib/aiPlanner.js";
import { formatDate } from "../lib/format.js";
import { optimizeDay } from "../lib/optimizer.js";

export function DashboardPage({ state, onOptimize, optimizing }) {
  const plan = useMemo(
    () => optimizeDay(state),
    [state.home, state.events, state.errands, state.planDate],
  );

  const aiPlan = useMemo(
    () => generatePlanInsights({ plan, ...state }),
    [plan, state],
  );

  return (
    <Stack gap="lg">
      <Section>
        <Stack gap="sm">
          <Heading as="h1" size="lg">Today&apos;s plan</Heading>
          <Paragraph color="muted">
            {formatDate(state.planDate)} · AI-optimized around your calendars, errands, and live traffic patterns.
          </Paragraph>
          <Button icon="route" onClick={onOptimize} disabled={optimizing}>
            {optimizing ? "Re-optimizing…" : "Re-optimize day"}
          </Button>
        </Stack>
      </Section>

      <LeaveByCard nextDeparture={plan.nextDeparture} />
      <MetricsBar metrics={plan.metrics} />

      <div className="dayflow-dashboard-grid">
        <div>
          <Heading as="h2" size="md">Timeline</Heading>
          <TimelineView segments={plan.segments} />
        </div>
        <div>
          <Heading as="h2" size="md">AI insights</Heading>
          <PlanSummary aiPlan={aiPlan} />
        </div>
      </div>

      {state.events.length === 0 ? (
        <Card>
          <Paragraph>Connect a calendar to import appointments and unlock departure-time recommendations.</Paragraph>
        </Card>
      ) : null}
    </Stack>
  );
}
