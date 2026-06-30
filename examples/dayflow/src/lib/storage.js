import {
  DEFAULT_CALENDARS,
  DEFAULT_HOME,
  SAMPLE_ERRANDS,
  SAMPLE_EVENTS,
} from "./sampleData.js";
import { todayDateString } from "./format.js";

const STORAGE_KEY = "dayflow-state-v1";

function reviveDates(state) {
  const revive = (value) => {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
      return new Date(value);
    }
    if (Array.isArray(value)) return value.map(revive);
    if (value && typeof value === "object") {
      return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, revive(v)]));
    }
    return value;
  };
  return revive(state);
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    return reviveDates(JSON.parse(raw));
  } catch {
    return getDefaultState();
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getDefaultState() {
  return {
    planDate: todayDateString(),
    home: DEFAULT_HOME,
    calendars: DEFAULT_CALENDARS,
    events: SAMPLE_EVENTS,
    errands: SAMPLE_ERRANDS,
    lastOptimizedAt: null,
  };
}

export function resetDemoData() {
  const state = getDefaultState();
  saveState(state);
  return state;
}
