import { addMinutes, minutesBetween, parseTimeOnDate } from "./format.js";
import { estimateDriveMinutes, getTrafficCondition } from "./traffic.js";

const PRIORITY_WEIGHT = { high: 3, medium: 2, low: 1 };

function loc(item) {
  return item.location ?? item;
}

function sortEvents(events) {
  return [...events].sort((a, b) => a.start - b.start);
}

function nearestNeighborOrder(stops, startPoint, departAt) {
  if (stops.length <= 1) return [...stops];

  const remaining = [...stops];
  const ordered = [];
  let current = startPoint;
  let time = new Date(departAt);

  while (remaining.length) {
    let bestIdx = 0;
    let bestScore = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const stop = remaining[i];
      const drive = estimateDriveMinutes(current, loc(stop), time);
      const priorityPenalty = (4 - (PRIORITY_WEIGHT[stop.priority] ?? 2)) * 6;
      const score = drive + priorityPenalty;
      if (score < bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    }

    const next = remaining.splice(bestIdx, 1)[0];
    ordered.push(next);
    const drive = estimateDriveMinutes(current, loc(next), time);
    time = addMinutes(time, drive + next.durationMinutes);
    current = loc(next);
  }

  return ordered;
}

function twoOptImprove(route, startPoint, departAt) {
  if (route.length < 3) return route;

  const totalDuration = (r) => {
    let total = 0;
    let current = startPoint;
    let time = new Date(departAt);
    for (const stop of r) {
      const drive = estimateDriveMinutes(current, loc(stop), time);
      total += drive + stop.durationMinutes;
      time = addMinutes(time, drive + stop.durationMinutes);
      current = loc(stop);
    }
    return total;
  };

  let bestRoute = [...route];
  let best = totalDuration(bestRoute);
  let improved = true;

  while (improved) {
    improved = false;
    for (let i = 0; i < bestRoute.length - 1; i++) {
      for (let j = i + 1; j < bestRoute.length; j++) {
        const candidate = [
          ...bestRoute.slice(0, i),
          ...bestRoute.slice(i, j + 1).reverse(),
          ...bestRoute.slice(j + 1),
        ];
        const cost = totalDuration(candidate);
        if (cost < best) {
          best = cost;
          bestRoute = candidate;
          improved = true;
        }
      }
    }
  }

  return bestRoute;
}

function fitsWindow(errand, arriveAt, planDate) {
  if (!errand.timeWindow) return true;
  const earliest = parseTimeOnDate(planDate, errand.timeWindow.earliest);
  const latest = parseTimeOnDate(planDate, errand.timeWindow.latest);
  return arriveAt >= earliest && arriveAt <= latest;
}

function segment(fields) {
  return fields;
}

export function optimizeDay({ home, events, errands, planDate }) {
  const fixedEvents = sortEvents(events);
  const dayStart = parseTimeOnDate(planDate, "08:00");
  const segments = [];
  const unscheduled = [];
  let totalDriveMinutes = 0;
  let totalErrandMinutes = 0;

  const scheduledIds = new Set();
  let cursor = home;
  let cursorTime = dayStart;

  function scheduleErrandsInGap(gapEnd, nextEventLocation) {
    const remaining = errands.filter((e) => !scheduledIds.has(e.id));
    if (!remaining.length) return;
    if (minutesBetween(cursorTime, gapEnd) < 15) return;

    let ordered = nearestNeighborOrder(remaining, cursor, cursorTime);
    ordered = twoOptImprove(ordered, cursor, cursorTime);

    let simLoc = cursor;
    let simTime = new Date(cursorTime);

    for (const errand of ordered) {
      const driveMinutes = estimateDriveMinutes(simLoc, loc(errand), simTime);
      const arrive = addMinutes(simTime, driveMinutes);
      const depart = addMinutes(arrive, errand.durationMinutes);
      const driveToNext = estimateDriveMinutes(loc(errand), nextEventLocation, depart);
      const finish = addMinutes(depart, driveToNext);

      if (finish > gapEnd || !fitsWindow(errand, arrive, planDate)) {
        unscheduled.push({
          errand,
          reason: finish > gapEnd ? "Not enough time before next commitment" : "Outside preferred time window",
        });
        continue;
      }

      const leaveBy = addMinutes(arrive, -driveMinutes);
      const traffic = getTrafficCondition(leaveBy.getHours());

      segments.push(
        segment({
          type: "drive-to-errand",
          item: errand,
          from: simLoc,
          to: loc(errand),
          arrive,
          depart: arrive,
          driveMinutes,
          leaveBy,
          traffic: traffic.label,
        }),
      );

      segments.push(
        segment({
          type: "errand",
          item: errand,
          from: loc(errand),
          to: loc(errand),
          arrive,
          depart,
          driveMinutes: 0,
          leaveBy: arrive,
          traffic: "—",
        }),
      );

      scheduledIds.add(errand.id);
      totalDriveMinutes += driveMinutes;
      totalErrandMinutes += errand.durationMinutes;
      simLoc = loc(errand);
      simTime = depart;
      cursor = simLoc;
      cursorTime = depart;
    }
  }

  for (const evt of fixedEvents) {
    scheduleErrandsInGap(evt.start, loc(evt));

    const driveMinutes = estimateDriveMinutes(cursor, loc(evt), cursorTime);
    const leaveBy = addMinutes(evt.start, -driveMinutes);
    const traffic = getTrafficCondition(leaveBy.getHours());

    segments.push(
      segment({
        type: "drive-to-event",
        item: evt,
        from: cursor,
        to: loc(evt),
        arrive: evt.start,
        depart: evt.start,
        driveMinutes,
        leaveBy,
        traffic: traffic.label,
        notes: `Arrive for ${evt.title}`,
      }),
    );

    segments.push(
      segment({
        type: "event",
        item: evt,
        from: loc(evt),
        to: loc(evt),
        arrive: evt.start,
        depart: evt.end,
        driveMinutes: 0,
        leaveBy: evt.start,
        traffic: "—",
      }),
    );

    totalDriveMinutes += driveMinutes;
    cursor = loc(evt);
    cursorTime = evt.end;
  }

  const dayEnd = parseTimeOnDate(planDate, "19:00");
  scheduleErrandsInGap(dayEnd, home);

  if (cursor !== home && minutesBetween(cursorTime, dayEnd) > 10) {
    const driveMinutes = estimateDriveMinutes(cursor, home, cursorTime);
    const arrive = addMinutes(cursorTime, driveMinutes);
    if (arrive <= dayEnd) {
      segments.push(
        segment({
          type: "drive-home",
          item: { name: "Home" },
          from: cursor,
          to: home,
          arrive,
          depart: arrive,
          driveMinutes,
          leaveBy: cursorTime,
          traffic: getTrafficCondition(cursorTime.getHours()).label,
        }),
      );
      totalDriveMinutes += driveMinutes;
    }
  }

  const leaveNow = segments.find((s) => s.type.startsWith("drive-"));
  const metrics = {
    totalDriveMinutes,
    totalErrandMinutes,
    scheduledErrands: scheduledIds.size,
    totalErrands: errands.length,
    unscheduledCount: unscheduled.length,
  };

  return {
    segments,
    unscheduled,
    metrics,
    nextDeparture: leaveNow
      ? {
          leaveBy: leaveNow.leaveBy,
          destination: leaveNow.item?.title ?? leaveNow.item?.name ?? "destination",
          driveMinutes: leaveNow.driveMinutes,
          traffic: leaveNow.traffic,
        }
      : null,
    generatedAt: new Date(),
  };
}
