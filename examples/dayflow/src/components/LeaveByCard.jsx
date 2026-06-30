import { Card, Heading, Icon, Paragraph, Stack } from "../../../../packages/react/src/index.js";
import { formatDuration, formatTime } from "../lib/format.js";

export function LeaveByCard({ nextDeparture }) {
  if (!nextDeparture) return null;

  const trafficClass =
    nextDeparture.traffic === "Heavy"
      ? "dayflow-leave-by--heavy"
      : nextDeparture.traffic === "Moderate"
        ? "dayflow-leave-by--moderate"
        : "dayflow-leave-by--light";

  return (
    <Card className={`dayflow-leave-by ${trafficClass}`}>
      <Stack gap="sm">
        <div className="dayflow-leave-by__header">
          <Icon name="departure_board" />
          <Heading as="h3" size="md">Leave by {formatTime(nextDeparture.leaveBy)}</Heading>
        </div>
        <Paragraph>
          Head to <strong>{nextDeparture.destination}</strong> — {formatDuration(nextDeparture.driveMinutes)} drive with {nextDeparture.traffic.toLowerCase()} traffic.
        </Paragraph>
      </Stack>
    </Card>
  );
}
