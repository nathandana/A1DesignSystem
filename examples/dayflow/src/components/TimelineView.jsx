import { Card, Heading, Icon, Paragraph, Stack } from "../../../../packages/react/src/index.js";
import { formatDuration, formatTime, formatTimeRange } from "../lib/format.js";

const TYPE_META = {
  "drive-to-event": { icon: "directions_car", label: "Drive to appointment" },
  "drive-to-errand": { icon: "directions_car", label: "Drive to errand" },
  "drive-home": { icon: "home", label: "Drive home" },
  event: { icon: "event", label: "Calendar event" },
  errand: { icon: "place", label: "Errand" },
};

export function TimelineView({ segments }) {
  if (!segments?.length) {
    return (
      <Card>
        <Paragraph color="muted">No plan segments yet. Connect calendars, add errands, and optimize your day.</Paragraph>
      </Card>
    );
  }

  return (
    <div className="dayflow-timeline" role="list" aria-label="Optimized day timeline">
      {segments.map((seg, index) => {
        const meta = TYPE_META[seg.type] ?? { icon: "schedule", label: "Activity" };
        const title = seg.item?.title ?? seg.item?.name ?? meta.label;
        const isDrive = seg.type.startsWith("drive-");

        return (
          <div key={`${seg.type}-${title}-${index}`} className="dayflow-timeline__item" role="listitem">
            <div className="dayflow-timeline__rail" aria-hidden="true">
              <span className={`dayflow-timeline__dot ${isDrive ? "dayflow-timeline__dot--drive" : ""}`} />
              {index < segments.length - 1 ? <span className="dayflow-timeline__line" /> : null}
            </div>
            <Card className="dayflow-timeline__card">
              <Stack gap="sm">
                <div className="dayflow-timeline__header">
                  <span className="dayflow-timeline__icon-wrap">
                    <Icon name={meta.icon} size="sm" />
                  </span>
                  <div>
                    <Heading as="h4" size="sm">{title}</Heading>
                    <Paragraph size="sm" color="muted">
                      {isDrive
                        ? `Leave ${formatTime(seg.leaveBy)} · ${formatDuration(seg.driveMinutes)} · ${seg.traffic} traffic`
                        : formatTimeRange(seg.arrive, seg.depart)}
                    </Paragraph>
                  </div>
                </div>
                {isDrive && seg.to?.address ? (
                  <Paragraph size="sm">{seg.to.address}</Paragraph>
                ) : null}
                {seg.type === "errand" && seg.item?.notes ? (
                  <Paragraph size="sm" color="muted">{seg.item.notes}</Paragraph>
                ) : null}
              </Stack>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
