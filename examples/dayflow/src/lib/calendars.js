import { SAMPLE_EVENTS } from "./sampleData.js";
import { parseTimeOnDate } from "./format.js";

const PROVIDER_META = {
  google: { label: "Google Calendar", icon: "event" },
  apple: { label: "Apple Calendar", icon: "calendar_month" },
  outlook: { label: "Outlook", icon: "mail" },
};

export function getProviderMeta(provider) {
  return PROVIDER_META[provider] ?? { label: provider, icon: "event" };
}

/** Simulated OAuth connect — returns after a short delay. */
export async function connectCalendar(calendar) {
  await delay(900);
  return {
    ...calendar,
    connected: true,
    lastSynced: new Date().toISOString(),
  };
}

export async function disconnectCalendar(calendar) {
  await delay(400);
  return { ...calendar, connected: false, lastSynced: null };
}

/** Simulated sync — pulls sample events for newly connected calendars. */
export async function syncCalendars(calendars, planDate, existingEvents) {
  await delay(1200);

  const connected = calendars.filter((c) => c.connected);
  const syncedCalendars = calendars.map((c) =>
    c.connected ? { ...c, lastSynced: new Date().toISOString() } : c,
  );

  const existingIds = new Set(existingEvents.map((e) => e.id));
  const imported = [];

  if (connected.some((c) => c.provider === "outlook")) {
    const familyEvent = {
      id: "evt-school-pickup",
      title: "School pickup",
      start: parseTimeOnDate(planDate, "17:15"),
      end: parseTimeOnDate(planDate, "17:45"),
      location: SAMPLE_EVENTS[0].location,
      calendarId: "outlook-family",
      isFixed: true,
    };
    if (!existingIds.has(familyEvent.id)) imported.push(familyEvent);
  }

  return {
    calendars: syncedCalendars,
    events: [...existingEvents, ...imported],
    importedCount: imported.length,
  };
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
