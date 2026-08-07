const LOCATIONS = {
  newYork: { city: 'New York', countryCode: 'US', countryName: 'United States', latitude: 40.7128, longitude: -74.006, subdivisionName: 'New York', postalCode: '10001', timezone: 'America/New_York' },
  london: { city: 'London', countryCode: 'GB', countryName: 'United Kingdom', latitude: 51.5072, longitude: -0.1276, subdivisionName: 'England', postalCode: 'EC1A', timezone: 'Europe/London' },
  tokyo: { city: 'Tokyo', countryCode: 'JP', countryName: 'Japan', latitude: 35.6762, longitude: 139.6503, subdivisionName: 'Tokyo', postalCode: '100-0001', timezone: 'Asia/Tokyo' },
  sydney: { city: 'Sydney', countryCode: 'AU', countryName: 'Australia', latitude: -33.8688, longitude: 151.2093, subdivisionName: 'New South Wales', postalCode: '2000', timezone: 'Australia/Sydney' },
  toronto: { city: 'Toronto', countryCode: 'CA', countryName: 'Canada', latitude: 43.6532, longitude: -79.3832, subdivisionName: 'Ontario', postalCode: 'M5H', timezone: 'America/Toronto' },
  berlin: { city: 'Berlin', countryCode: 'DE', countryName: 'Germany', latitude: 52.52, longitude: 13.405, subdivisionName: 'Berlin', postalCode: '10115', timezone: 'Europe/Berlin' },
  saoPaulo: { city: 'São Paulo', countryCode: 'BR', countryName: 'Brazil', latitude: -23.5505, longitude: -46.6333, subdivisionName: 'São Paulo', postalCode: '01000-000', timezone: 'America/Sao_Paulo' },
}

const DEVICES = {
  desktopChrome: { type: 'desktop', browser: 'Chrome', platform: 'Windows' },
  desktopSafari: { type: 'desktop', browser: 'Safari', platform: 'macOS' },
  mobileSafari: { type: 'mobile', browser: 'Safari', platform: 'iOS', reportedMobile: true },
  mobileChrome: { type: 'mobile', browser: 'Chrome', platform: 'Android', reportedMobile: true },
  tabletSafari: { type: 'tablet', browser: 'Safari', platform: 'iOS', reportedMobile: true },
  automated: { type: 'automated', browser: 'Other', platform: 'Linux' },
}

const USER_AGENTS = {
  Chrome: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/127.0.0.0 Safari/537.36',
  Safari: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Version/17.5 Mobile/15E148 Safari/604.1',
  Other: 'ExampleBot/1.0 (+https://example.invalid/bot)',
}

const SAMPLE_DEFINITIONS = [
  ['2026-07-20T13:05:00Z', 185, '203.0.113.10', LOCATIONS.newYork, DEVICES.desktopChrome, ['/', '/components', '/components/button']],
  ['2026-07-21T09:12:00Z', 72, '198.51.100.20', LOCATIONS.london, DEVICES.mobileSafari, ['/', '/get-started']],
  ['2026-07-22T22:44:00Z', 420, '192.0.2.30', LOCATIONS.tokyo, DEVICES.desktopSafari, ['/', '/foundations/color', '/components/card', '/components/dialog']],
  ['2026-07-24T01:18:00Z', 98, '203.0.113.40', LOCATIONS.sydney, DEVICES.mobileChrome, ['/', '/components/data-table']],
  ['2026-07-25T16:31:00Z', 256, '198.51.100.50', LOCATIONS.toronto, DEVICES.tabletSafari, ['/', '/components', '/components/chart']],
  ['2026-07-26T07:52:00Z', 33, '192.0.2.60', LOCATIONS.berlin, DEVICES.automated, ['/releases']],
  ['2026-07-27T18:04:00Z', 614, '203.0.113.11', LOCATIONS.newYork, DEVICES.desktopSafari, ['/', '/blog', '/components/chart', '/accessibility']],
  ['2026-07-28T11:47:00Z', 147, '198.51.100.21', LOCATIONS.london, DEVICES.desktopChrome, ['/', '/components/button']],
  ['2026-07-29T14:26:00Z', 302, '192.0.2.31', LOCATIONS.tokyo, DEVICES.mobileSafari, ['/', '/get-started', '/components']],
  ['2026-07-30T20:09:00Z', 89, '203.0.113.70', LOCATIONS.saoPaulo, DEVICES.mobileChrome, ['/', '/foundations/type']],
  ['2026-07-31T10:15:00Z', 521, '198.51.100.51', LOCATIONS.toronto, DEVICES.desktopChrome, ['/', '/components/chart', '/components/data-table', '/components/dialog']],
  ['2026-08-01T12:38:00Z', 208, '192.0.2.61', LOCATIONS.berlin, DEVICES.desktopSafari, ['/', '/components', '/components/card']],
]

function addSeconds(value, seconds) {
  return new Date(new Date(value).getTime() + seconds * 1000).toISOString()
}

function sampleLookup(ip, geo) {
  return {
    ip,
    available: true,
    network: `${ip}/32`,
    version: 'IPv4',
    city: geo.city,
    region: geo.subdivisionName,
    regionCode: null,
    country: geo.countryName,
    countryCode: geo.countryCode,
    postalCode: geo.postalCode,
    latitude: geo.latitude,
    longitude: geo.longitude,
    timeZone: geo.timezone,
    utcOffset: null,
    asn: 'AS65551',
    organization: 'Example network (sample data)',
  }
}

export const sampleVisitAnalytics = SAMPLE_DEFINITIONS.map(([
  startedAt,
  duration,
  ip,
  geo,
  device,
  paths,
], index) => ({
  session_id: `018f25f4-8c0a-7cd5-b8fa-a64db2912e${String(index + 1).padStart(2, '0')}`,
  user_id: index === 6 ? 'sample-user-id' : null,
  user_email: index === 6 ? 'sample@example.com' : null,
  ip_addresses: [ip],
  pages: paths.map((path, pageIndex) => ({
    page: path === '/' ? 'home' : path.slice(1).replaceAll('/', '-'),
    path,
    viewed_at: addSeconds(startedAt, pageIndex * 47),
  })),
  visitor_context: {
    device,
    browser: {
      userAgent: USER_AGENTS[device.browser],
      acceptLanguage: `${geo.countryCode.toLowerCase()},en;q=0.9`,
      mobile: device.reportedMobile ? '?1' : '?0',
      platform: `"${device.platform}"`,
    },
    geo,
    netlify: {
      requestId: `01J4SAMPLE${String(index + 1).padStart(2, '0')}`,
      agentCategory: device.type === 'automated' ? 'crawler;search-engine' : 'browser',
      serverRegion: index % 2 ? 'eu-west-2' : 'us-east-1',
      deployContext: 'production',
      deployPublished: true,
      siteName: 'a1design',
      siteUrl: 'https://a1design.app',
    },
  },
  started_at: startedAt,
  last_seen_at: addSeconds(startedAt, Math.max(0, duration - 10)),
  ended_at: addSeconds(startedAt, duration),
  sample: true,
  sampleIpLookups: [sampleLookup(ip, geo)],
}))
