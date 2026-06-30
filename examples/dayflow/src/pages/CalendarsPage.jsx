import { Banner, Heading, Paragraph, Section, Stack } from "../../../../packages/react/src/index.js";
import { CalendarConnect } from "../components/CalendarConnect.jsx";

export function CalendarsPage({
  calendars,
  onConnect,
  onDisconnect,
  onSync,
  syncing,
  syncMessage,
}) {
  const connectedCount = calendars.filter((c) => c.connected).length;

  return (
    <Stack gap="lg">
      <Section>
        <Stack gap="sm">
          <Heading as="h1" size="lg">Calendars</Heading>
          <Paragraph color="muted">
            Connect Google, Apple, and Outlook calendars. Dayflow imports fixed appointments and plans errands around them.
          </Paragraph>
        </Stack>
      </Section>

      {syncMessage ? (
        <Banner status="success">{syncMessage}</Banner>
      ) : null}

      <CalendarConnect
        calendars={calendars}
        onConnect={onConnect}
        onDisconnect={onDisconnect}
        onSync={onSync}
        syncing={syncing}
      />

      <Paragraph size="sm" color="muted">
        {connectedCount} of {calendars.length} calendars connected. Events sync automatically when you optimize your day.
      </Paragraph>
    </Stack>
  );
}
