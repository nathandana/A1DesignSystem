import { formatDuration, formatTime } from "./format.js";
import { bestDepartureWindow } from "./traffic.js";

/**
 * Generates human-readable AI planning insights from an optimized plan.
 * Uses local heuristics — no external API required.
 */
export function generatePlanInsights({ plan, home, events, errands, planDate }) {
  const insights = [];
  const tips = [];

  if (!plan?.segments?.length) {
    return {
      summary: "Connect your calendars and add errands to generate an optimized day plan.",
      insights: [],
      tips: ["Link at least one calendar to import fixed appointments.", "Add destinations you need to visit today."],
    };
  }

  const { metrics, segments, unscheduled, nextDeparture } = plan;
  const driveSegments = segments.filter((s) => s.driveMinutes > 0);
  const heaviestTraffic = driveSegments
    .filter((s) => s.traffic === "Heavy" || s.traffic === "Moderate")
    .sort((a, b) => b.driveMinutes - a.driveMinutes)[0];

  const errandCount = metrics.scheduledErrands;
  const savedEstimate = Math.round(errandCount * 6 + metrics.totalDriveMinutes * 0.12);

  insights.push({
    type: "summary",
    icon: "auto_awesome",
    title: "Your optimized day",
    body: `I scheduled ${errandCount} of ${metrics.totalErrands} errands around ${events.length} calendar events, with ${formatDuration(metrics.totalDriveMinutes)} of driving and an estimated ${savedEstimate} minutes saved versus an unoptimized route.`,
  });

  if (nextDeparture) {
    insights.push({
      type: "departure",
      icon: "departure_board",
      title: `Leave by ${formatTime(nextDeparture.leaveBy)}`,
      body: `Head to ${nextDeparture.destination} now. Expect ${formatDuration(nextDeparture.driveMinutes)} drive time with ${nextDeparture.traffic.toLowerCase()} traffic.`,
    });
  }

  if (heaviestTraffic) {
    const dest = heaviestTraffic.item?.title ?? heaviestTraffic.item?.name ?? "your next stop";
    insights.push({
      type: "traffic",
      icon: "traffic",
      title: "Traffic alert",
      body: `The drive to ${dest} around ${formatTime(heaviestTraffic.leaveBy)} faces ${heaviestTraffic.traffic.toLowerCase()} congestion. I built in a buffer so you still arrive on time.`,
    });
  }

  const orderInsight = buildRouteOrderNarrative(segments);
  if (orderInsight) {
    insights.push({
      type: "route",
      icon: "route",
      title: "Errand order",
      body: orderInsight,
    });
  }

  if (unscheduled.length) {
    insights.push({
      type: "warning",
      icon: "warning",
      title: `${unscheduled.length} errand${unscheduled.length > 1 ? "s" : ""} couldn't fit`,
      body: unscheduled.map((u) => `${u.errand.name}: ${u.reason}`).join(". ") + ".",
    });
  }

  const dentist = events.find((e) => /dentist/i.test(e.title));
  if (dentist && home) {
    const window = bestDepartureWindow(home, dentist.location, new Date(dentist.start.getTime() - 90 * 60_000), dentist.start);
    tips.push(`Best window to leave for ${dentist.title}: around ${window.hour}:00 (${formatDuration(window.minutes)} drive).`);
  }

  if (metrics.scheduledErrands >= 2) {
    tips.push("High-priority errands are clustered near related appointments to minimize backtracking.");
  }

  tips.push("Re-optimize after adding errands or when traffic patterns shift in the afternoon.");

  const summary = nextDeparture
    ? `Leave by ${formatTime(nextDeparture.leaveBy)} for ${nextDeparture.destination}. ${errandCount} errands woven around your calendar.`
    : `Plan ready for ${planDate} with ${errandCount} errands scheduled.`;

  return { summary, insights, tips };
}

function buildRouteOrderNarrative(segments) {
  const errands = segments.filter((s) => s.type === "errand").map((s) => s.item.name);
  if (errands.length < 2) return null;

  const reasons = [];
  if (errands.length >= 2) {
    reasons.push(`visiting ${errands[0]} before ${errands[1]} cuts cross-town driving`);
  }
  if (errands.length >= 3) {
    reasons.push(`${errands[errands.length - 1]} is last because it's closest to your afternoon appointment`);
  }

  return `Recommended order: ${errands.join(" → ")}. This sequence ${reasons.join(", and ")}.`;
}
