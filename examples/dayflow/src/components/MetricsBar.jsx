import { Card, Paragraph, Stack } from "../../../../packages/react/src/index.js";
import { formatDuration } from "../lib/format.js";

export function MetricsBar({ metrics }) {
  if (!metrics) return null;

  const items = [
    { label: "Errands scheduled", value: `${metrics.scheduledErrands}/${metrics.totalErrands}` },
    { label: "Driving", value: formatDuration(metrics.totalDriveMinutes) },
    { label: "At destinations", value: formatDuration(metrics.totalErrandMinutes) },
    { label: "Unscheduled", value: metrics.unscheduledCount },
  ];

  return (
    <div className="dayflow-metrics">
      {items.map((item) => (
        <Card key={item.label} className="dayflow-metrics__item">
          <Stack gap="xs">
            <Paragraph size="sm" color="muted">{item.label}</Paragraph>
            <Paragraph size="lg"><strong>{item.value}</strong></Paragraph>
          </Stack>
        </Card>
      ))}
    </div>
  );
}
