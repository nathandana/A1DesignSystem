import { PLACE_CATALOG } from "./locations.js";
import { parseTimeOnDate, todayDateString } from "./format.js";

const today = todayDateString();

export const DEFAULT_CALENDARS = [
  { id: "google-work", provider: "google", name: "Work (Google)", connected: true, color: "#4285F4", lastSynced: new Date().toISOString() },
  { id: "apple-personal", provider: "apple", name: "Personal (Apple)", connected: true, color: "#FF3B30", lastSynced: new Date().toISOString() },
  { id: "outlook-family", provider: "outlook", name: "Family (Outlook)", connected: false, color: "#0078D4", lastSynced: null },
];

export const SAMPLE_EVENTS = [
  {
    id: "evt-standup",
    title: "Team standup",
    start: parseTimeOnDate(today, "09:00"),
    end: parseTimeOnDate(today, "09:30"),
    location: PLACE_CATALOG["salesforce-tower"],
    calendarId: "google-work",
    isFixed: true,
  },
  {
    id: "evt-lunch",
    title: "Lunch with Alex",
    start: parseTimeOnDate(today, "12:30"),
    end: parseTimeOnDate(today, "13:30"),
    location: PLACE_CATALOG["blue-bottle"],
    calendarId: "apple-personal",
    isFixed: true,
  },
  {
    id: "evt-dentist",
    title: "Dentist appointment",
    start: parseTimeOnDate(today, "15:00"),
    end: parseTimeOnDate(today, "15:45"),
    location: PLACE_CATALOG["dr-chen"],
    calendarId: "apple-personal",
    isFixed: true,
  },
];

export const SAMPLE_ERRANDS = [
  {
    id: "err-grocery",
    name: "Grocery run",
    location: PLACE_CATALOG["whole-foods"],
    durationMinutes: 25,
    priority: "high",
    timeWindow: { earliest: "10:00", latest: "14:00" },
    notes: "Need milk and eggs",
  },
  {
    id: "err-post",
    name: "Mail package",
    location: PLACE_CATALOG["usps-mission"],
    durationMinutes: 12,
    priority: "medium",
    timeWindow: null,
    notes: "Return label printed",
  },
  {
    id: "err-target",
    name: "Pick up prescription",
    location: PLACE_CATALOG["target-mission"],
    durationMinutes: 15,
    priority: "high",
    timeWindow: { earliest: "11:00", latest: "16:00" },
    notes: "",
  },
  {
    id: "err-library",
    name: "Return library books",
    location: PLACE_CATALOG["sfpl-main"],
    durationMinutes: 8,
    priority: "low",
    timeWindow: null,
    notes: "Due today",
  },
];

export const DEFAULT_HOME = PLACE_CATALOG.home;
