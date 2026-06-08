import {
  Button,
  Card,
  Heading,
  Icon,
  Paragraph,
  Stack,
  Switch,
} from "../../../../packages/react/src/index.js";
import { getProviderMeta } from "../lib/calendars.js";
import { formatTime } from "../lib/format.js";

export function CalendarConnect({ calendars, onConnect, onDisconnect, onSync, syncing }) {
  return (
    <Stack gap="md">
      {calendars.map((calendar) => {
        const meta = getProviderMeta(calendar.provider);
        return (
          <Card key={calendar.id} className="dayflow-calendar-card">
            <div className="dayflow-calendar-card__row">
              <div className="dayflow-calendar-card__info">
                <span className="dayflow-calendar-card__swatch" style={{ background: calendar.color }} aria-hidden="true" />
                <div>
                  <Heading as="h4" size="sm">{calendar.name}</Heading>
                  <Paragraph size="sm" color="muted">
                    <Icon name={meta.icon} size="sm" /> {meta.label}
                    {calendar.lastSynced ? ` · Synced ${formatTime(new Date(calendar.lastSynced))}` : ""}
                  </Paragraph>
                </div>
              </div>
              <Switch
                label={calendar.connected ? "Connected" : "Disconnected"}
                checked={calendar.connected}
                onChange={(checked) => (checked ? onConnect(calendar) : onDisconnect(calendar))}
              />
            </div>
          </Card>
        );
      })}
      <Button variant="secondary" icon="sync" onClick={onSync} disabled={syncing}>
        {syncing ? "Syncing calendars…" : "Sync all calendars"}
      </Button>
    </Stack>
  );
}
