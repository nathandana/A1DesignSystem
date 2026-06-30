import { vehicles } from "../data/vehicles.js";

function flattenVehicle(vehicle) {
  const parts = [
    vehicle.year,
    vehicle.make,
    vehicle.model,
    vehicle.trim,
    vehicle.tagline,
    vehicle.summary,
    vehicle.bodyStyle,
    vehicle.layout,
    vehicle.engine?.designation,
    vehicle.engine?.configuration,
    vehicle.engine?.displacement,
    vehicle.engine?.power,
    vehicle.engine?.torque,
    vehicle.transmission?.type,
    vehicle.transmission?.model,
    vehicle.wheels?.boltPattern,
    vehicle.wheels?.lugThread,
    vehicle.wheels?.hubBore,
    vehicle.wheels?.offset,
    vehicle.wheels?.frontSize,
    vehicle.wheels?.rearSize,
    vehicle.wheels?.notes,
    vehicle.chassis?.frontSuspension,
    vehicle.chassis?.rearSuspension,
    vehicle.chassis?.steering,
    vehicle.performance?.zeroToSixty,
    vehicle.performance?.topSpeed,
    vehicle.identifiers?.vinPrefix,
    vehicle.identifiers?.engineCode,
    ...(vehicle.colors?.map((c) => c.name) ?? []),
    ...(vehicle.highlights ?? []),
    ...(vehicle.options ?? []),
  ];

  return parts.filter(Boolean).join(" ").toLowerCase();
}

const searchIndex = vehicles.map((vehicle) => ({
  vehicle,
  haystack: flattenVehicle(vehicle),
}));

export function searchVehicles(query, filters = {}) {
  const normalized = query.trim().toLowerCase();
  const tokens = normalized.split(/\s+/).filter(Boolean);

  return searchIndex
    .filter(({ vehicle, haystack }) => {
      if (filters.make && vehicle.make !== filters.make) return false;
      if (filters.era && vehicle.era !== filters.era) return false;
      if (tokens.length === 0) return true;
      return tokens.every((token) => haystack.includes(token));
    })
    .map(({ vehicle }) => vehicle)
    .sort((a, b) => {
      if (tokens.length === 0) return b.year - a.year;
      const aTitle = `${a.year} ${a.make} ${a.model}`.toLowerCase();
      const bTitle = `${b.year} ${b.make} ${b.model}`.toLowerCase();
      const aExact = aTitle.includes(normalized) ? 1 : 0;
      const bExact = bTitle.includes(normalized) ? 1 : 0;
      if (aExact !== bExact) return bExact - aExact;
      return b.year - a.year;
    });
}

export function getSearchSuggestions(query) {
  const results = searchVehicles(query).slice(0, 6);
  return results.map((v) => ({
    id: v.id,
    label: `${v.year} ${v.make} ${v.model} ${v.trim}`,
    subtitle: v.wheels?.boltPattern ? `Bolt pattern: ${v.wheels.boltPattern}` : v.bodyStyle,
  }));
}

export const popularSearches = [
  "Miata bolt pattern",
  "4×100",
  "Porsche 911",
  "M3",
  "GT3 RS",
  "Mustang 289",
  "NSX",
  "Tesla Performance",
  "5×114.3",
  "W123 diesel",
];
