/** Known places in the demo city (San Francisco) for geocoding mock data. */
export const PLACE_CATALOG = {
  home: { name: "Home", address: "742 Evergreen Terrace, San Francisco, CA", lat: 37.7749, lng: -122.4194 },
  "whole-foods": { name: "Whole Foods Market", address: "1765 California St, San Francisco, CA", lat: 37.7897, lng: -122.4242 },
  "usps-mission": { name: "USPS Mission", address: "1380 Valencia St, San Francisco, CA", lat: 37.7515, lng: -122.4212 },
  "target-mission": { name: "Target", address: "789 Mission St, San Francisco, CA", lat: 37.7847, lng: -122.4042 },
  "dr-chen": { name: "Dr. Chen — Dental", address: "450 Sutter St, San Francisco, CA", lat: 37.7895, lng: -122.4078 },
  "sfpl-main": { name: "SF Public Library", address: "100 Larkin St, San Francisco, CA", lat: 37.7793, lng: -122.4158 },
  "blue-bottle": { name: "Blue Bottle Coffee", address: "66 Mint St, San Francisco, CA", lat: 37.7815, lng: -122.4045 },
  "crissy-field": { name: "Crissy Field", address: "1199 E Beach, San Francisco, CA", lat: 37.8024, lng: -122.4662 },
  "salesforce-tower": { name: "Salesforce Tower", address: "415 Mission St, San Francisco, CA", lat: 37.7897, lng: -122.3972 },
  "golden-gate": { name: "Golden Gate Bridge", address: "Golden Gate Bridge, San Francisco, CA", lat: 37.8199, lng: -122.4783 },
};

export function lookupPlace(query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return null;

  const exact = Object.entries(PLACE_CATALOG).find(
    ([key, place]) =>
      key === normalized ||
      place.name.toLowerCase() === normalized ||
      place.address.toLowerCase() === normalized,
  );
  if (exact) return { id: exact[0], ...exact[1] };

  const partial = Object.entries(PLACE_CATALOG).find(
    ([, place]) =>
      place.name.toLowerCase().includes(normalized) ||
      place.address.toLowerCase().includes(normalized),
  );
  if (partial) return { id: partial[0], ...partial[1] };

  return {
    id: `custom-${normalized.slice(0, 24)}`,
    name: query.trim(),
    address: query.trim(),
    lat: 37.7749 + (Math.random() - 0.5) * 0.05,
    lng: -122.4194 + (Math.random() - 0.5) * 0.05,
  };
}

export function haversineKm(a, b) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
