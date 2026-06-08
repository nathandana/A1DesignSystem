import { haversineKm } from "./locations.js";

/** Average urban speed in km/h by hour of day (0–23). */
const HOURLY_SPEED_KMH = [
  42, 44, 46, 48, 50, 38, 28, 22, 20, 18, 17, 16,
  16, 17, 18, 20, 24, 30, 28, 26, 30, 36, 40, 42,
];

const TRAFFIC_LABELS = [
  { max: 20, label: "Heavy", color: "var(--semantic-color-status-error-text)" },
  { max: 28, label: "Moderate", color: "var(--semantic-color-status-warning-text)" },
  { max: Infinity, label: "Light", color: "var(--semantic-color-status-success-text)" },
];

export function getTrafficCondition(hour) {
  const speed = HOURLY_SPEED_KMH[hour] ?? 30;
  return TRAFFIC_LABELS.find((t) => speed <= t.max) ?? TRAFFIC_LABELS[2];
}

export function estimateDriveMinutes(from, to, departAt = new Date()) {
  const distanceKm = haversineKm(from, to);
  const hour = departAt.getHours();
  const speedKmh = HOURLY_SPEED_KMH[hour] ?? 30;
  const baseMinutes = (distanceKm / speedKmh) * 60;
  const urbanFactor = 1.15;
  const stoplights = Math.max(2, Math.round(distanceKm * 1.2));
  return Math.max(3, Math.round(baseMinutes * urbanFactor + stoplights));
}

export function compareTrafficAtHours(from, to, hours) {
  return hours.map((hour) => {
    const depart = new Date();
    depart.setHours(hour, 0, 0, 0);
    return {
      hour,
      minutes: estimateDriveMinutes(from, to, depart),
      condition: getTrafficCondition(hour),
    };
  });
}

export function bestDepartureWindow(from, to, earliest, latest) {
  const startHour = earliest.getHours();
  const endHour = latest.getHours();
  const hours = [];
  for (let h = startHour; h <= endHour; h++) hours.push(h);

  const options = compareTrafficAtHours(from, to, hours.length ? hours : [9, 10, 11, 14, 15, 16]);
  return options.reduce((best, current) => (current.minutes < best.minutes ? current : best));
}
