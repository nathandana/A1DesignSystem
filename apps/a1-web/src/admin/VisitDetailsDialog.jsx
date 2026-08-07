import {
  Banner,
  Button,
  ButtonContainer,
  CircularProgress,
  Code,
  DataTable,
  DefinitionList,
  Dialog,
  Heading,
  Paragraph,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { useT } from '../labels/useT.js'

export function formatVisitDateTime(value, fallback) {
  if (!value) return fallback
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value))
  } catch {
    return fallback
  }
}

export function formatVisitDuration(startedAt, endedAt, fallback) {
  const milliseconds = new Date(endedAt).getTime() - new Date(startedAt).getTime()
  if (!Number.isFinite(milliseconds) || milliseconds < 0) return fallback
  const seconds = Math.floor(milliseconds / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ${minutes % 60}m`
}

function joinDetails(values, fallback) {
  const details = values.filter(Boolean)
  return details.length ? details.join(', ') : fallback
}

function coordinates(lookup, fallback) {
  if (!Number.isFinite(lookup?.latitude) || !Number.isFinite(lookup?.longitude)) return fallback
  const formatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 4 })
  return `${formatter.format(lookup.latitude)}, ${formatter.format(lookup.longitude)}`
}

export function VisitDetailsDialog({
  open,
  visit,
  ipLookups,
  loading,
  error,
  onClose,
  onRetry,
}) {
  const t = useT()
  const neverLabel = t('app.access.never', 'Never')
  const unavailableLabel = t('app.access.notProvided', 'Not provided')
  const activeLabel = t('app.access.visitActive', 'Active')
  const anonymousLabel = t('app.access.anonymousVisitor', 'Anonymous visitor')
  const pages = Array.isArray(visit?.pages) ? visit.pages : []
  const ipAddresses = Array.isArray(visit?.ip_addresses) ? visit.ip_addresses : []
  const visitorContext = visit?.visitor_context ?? {}
  const device = visitorContext.device ?? {}
  const browser = visitorContext.browser ?? {}
  const geo = visitorContext.geo ?? {}
  const netlify = visitorContext.netlify ?? {}
  const deviceTypeLabels = {
    desktop: t('app.access.deviceDesktop', 'Desktop'),
    mobile: t('app.access.deviceMobile', 'Mobile'),
    tablet: t('app.access.deviceTablet', 'Tablet'),
    automated: t('app.access.deviceAutomated', 'Automated'),
    unknown: t('app.access.deviceUnknown', 'Unknown'),
  }
  const lookupByIp = new Map((ipLookups ?? []).map((lookup) => [lookup.ip, lookup]))
  const pageRows = pages.map((view, index) => ({
    id: `${visit?.session_id}-${index}`,
    page: view?.page || unavailableLabel,
    path: view?.path || unavailableLabel,
    viewed: formatVisitDateTime(view?.viewed_at, neverLabel),
    viewedAt: view?.viewed_at,
  }))

  const pageColumns = [
    { key: 'page', label: t('app.access.pageIdentifier', 'A1 page'), sortable: true },
    { key: 'path', label: t('app.access.pagePath', 'Path'), sortable: true },
    {
      key: 'viewed',
      label: t('app.access.viewedAt', 'Viewed'),
      sortable: true,
      sortAccessor: (row) => row.viewedAt,
    },
  ]

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('app.access.visitDetailsTitle', 'Session details')}
      size="xl"
      footer={(
        <ButtonContainer align="end">
          <Button variant="secondary" onClick={onClose}>
            {t('app.access.close', 'Close')}
          </Button>
        </ButtonContainer>
      )}
    >
      <Stack gap="lg">
        {loading && (
          <Stack direction="row" gap="sm" align="center">
            <CircularProgress
              size="xs"
              indeterminate
              aria-label={t('app.access.loadingVisitDetails', 'Loading session details')}
            />
            <Paragraph size="sm" color="muted">
              {t('app.access.loadingVisitDetails', 'Loading session details')}
            </Paragraph>
          </Stack>
        )}

        {error && (
          <Banner
            status="error"
            variant="inline"
            action={(
              <Button size="sm" variant="secondary" icon="refresh" onClick={onRetry}>
                {t('app.access.retryVisitDetails', 'Retry session details')}
              </Button>
            )}
          >
            {error}
          </Banner>
        )}

        {visit && (
          <>
            <Stack gap="md">
              <Heading as="h3" size="sm">
                {t('app.access.visitSummaryTitle', 'Session summary')}
              </Heading>
              <DefinitionList
                items={[
                  { label: t('app.access.visitSessionId', 'Session ID'), value: visit.session_id },
                  { label: t('app.access.visitor', 'Visitor'), value: visit.user_email || anonymousLabel },
                  { label: t('app.access.userId', 'User ID'), value: visit.user_id || unavailableLabel },
                  { label: t('app.access.ipAddress', 'IP address'), value: ipAddresses.length ? ipAddresses.join(', ') : unavailableLabel },
                  { label: t('app.access.visitStarted', 'Started'), value: formatVisitDateTime(visit.started_at, neverLabel) },
                  { label: t('app.access.visitLastSeen', 'Last activity'), value: formatVisitDateTime(visit.last_seen_at, neverLabel) },
                  { label: t('app.access.visitEnded', 'Ended'), value: visit.ended_at ? formatVisitDateTime(visit.ended_at, neverLabel) : activeLabel },
                  { label: t('app.access.visitLength', 'Visit length'), value: formatVisitDuration(visit.started_at, visit.ended_at ?? visit.last_seen_at, neverLabel) },
                  { label: t('app.access.pageViews', 'Page views'), value: pages.length },
                ]}
              />
            </Stack>

            <Stack gap="md">
              <Stack gap="xs">
                <Heading as="h3" size="sm">
                  {t('app.access.deviceAndRequestTitle', 'Device and request context')}
                </Heading>
                <Paragraph size="sm" color="muted">
                  {t('app.access.deviceAndRequestDescription', 'Netlify supplies request and approximate location fields. Device and browser values are inferred from optional, browser-reported headers and can be missing or spoofed.')}
                </Paragraph>
              </Stack>
              <DefinitionList
                items={[
                  { label: t('app.access.device', 'Device'), value: deviceTypeLabels[device.type] ?? device.type ?? unavailableLabel },
                  { label: t('app.access.browser', 'Browser'), value: device.browser || unavailableLabel },
                  { label: t('app.access.platform', 'Platform'), value: device.platform || unavailableLabel },
                  { label: t('app.access.userAgent', 'User agent'), value: browser.userAgent ? <Code wrapping>{browser.userAgent}</Code> : unavailableLabel },
                  { label: t('app.access.acceptLanguage', 'Accepted languages'), value: browser.acceptLanguage || unavailableLabel },
                  { label: t('app.access.clientHintBrands', 'Browser brands'), value: browser.brands ? <Code wrapping>{browser.brands}</Code> : unavailableLabel },
                  { label: t('app.access.clientHintModel', 'Device model'), value: browser.model ? <Code wrapping>{browser.model}</Code> : unavailableLabel },
                  { label: t('app.access.clientHintPlatformVersion', 'Platform version'), value: browser.platformVersion ? <Code wrapping>{browser.platformVersion}</Code> : unavailableLabel },
                ]}
              />
            </Stack>

            <Stack gap="md">
              <Heading as="h3" size="sm">
                {t('app.access.netlifyContextTitle', 'Netlify context')}
              </Heading>
              <DefinitionList
                items={[
                  {
                    label: t('app.access.approximateLocation', 'Approximate location'),
                    value: joinDetails([
                      geo.city,
                      geo.subdivisionName,
                      geo.countryCode ? `${geo.countryName} (${geo.countryCode})` : geo.countryName,
                    ], unavailableLabel),
                  },
                  { label: t('app.access.postalCode', 'Postal code'), value: geo.postalCode || unavailableLabel },
                  { label: t('app.access.coordinates', 'Coordinates'), value: coordinates(geo, unavailableLabel) },
                  { label: t('app.access.timeZone', 'Time zone'), value: geo.timezone || unavailableLabel },
                  { label: t('app.access.netlifyAgentCategory', 'Netlify agent category'), value: netlify.agentCategory || unavailableLabel },
                  { label: t('app.access.netlifyRequestId', 'Netlify request ID'), value: netlify.requestId ? <Code wrapping>{netlify.requestId}</Code> : unavailableLabel },
                  { label: t('app.access.netlifyServerRegion', 'Netlify server region'), value: netlify.serverRegion || unavailableLabel },
                  { label: t('app.access.netlifyDeployContext', 'Netlify deploy context'), value: netlify.deployContext || unavailableLabel },
                  { label: t('app.access.netlifySite', 'Netlify site'), value: netlify.siteName || netlify.siteUrl ? <Code wrapping>{joinDetails([netlify.siteName, netlify.siteUrl], unavailableLabel)}</Code> : unavailableLabel },
                ]}
              />
            </Stack>

            <Stack gap="md">
              <Stack gap="xs">
                <Heading as="h3" size="sm">
                  {t('app.access.ipLookupTitle', 'IP lookup')}
                </Heading>
                <Paragraph size="sm" color="muted">
                  {t('app.access.ipLookupDescription', 'Location and network data are approximate and fetched from ipapi.co when this dialog opens.')}
                </Paragraph>
              </Stack>

              {ipAddresses.map((ip) => {
                const lookup = lookupByIp.get(ip)
                return (
                  <Stack key={ip} gap="sm">
                    <Heading as="h4" size="xs">{ip}</Heading>
                    {lookup?.available ? (
                      <DefinitionList
                        size="sm"
                        items={[
                          {
                            label: t('app.access.approximateLocation', 'Approximate location'),
                            value: joinDetails([
                              lookup.city,
                              lookup.region,
                              lookup.countryCode ? `${lookup.country} (${lookup.countryCode})` : lookup.country,
                            ], unavailableLabel),
                          },
                          { label: t('app.access.postalCode', 'Postal code'), value: lookup.postalCode || unavailableLabel },
                          { label: t('app.access.coordinates', 'Coordinates'), value: coordinates(lookup, unavailableLabel) },
                          { label: t('app.access.timeZone', 'Time zone'), value: joinDetails([lookup.timeZone, lookup.utcOffset], unavailableLabel) },
                          { label: t('app.access.networkOrganization', 'Organization'), value: lookup.organization || unavailableLabel },
                          { label: t('app.access.autonomousSystemNumber', 'ASN'), value: lookup.asn || unavailableLabel },
                          { label: t('app.access.networkRange', 'Network'), value: lookup.network || unavailableLabel },
                          { label: t('app.access.ipVersion', 'IP version'), value: lookup.version || unavailableLabel },
                        ]}
                      />
                    ) : !loading && (
                      <Banner status="info" variant="inline">
                        {t('app.access.ipLookupUnavailable', 'Location and network details are unavailable for this IP address.')}
                      </Banner>
                    )}
                  </Stack>
                )
              })}
            </Stack>

            <Stack gap="md">
              <Stack gap="xs">
                <Heading as="h3" size="sm">
                  {t('app.access.pageTimelineTitle', 'Page timeline')}
                </Heading>
                <Paragraph size="sm" color="muted">
                  {t('app.access.pageTimelineDescription', 'Routes are shown in the order they were recorded during this browser-tab session.')}
                </Paragraph>
              </Stack>
              <DataTable
                caption={t('app.access.pageTimelineCaption', 'Recorded pages for this session')}
                columns={pageColumns}
                rows={pageRows}
                getRowId={(row) => row.id}
                size="compact"
                emptyTitle={t('app.access.noPagesRecorded', 'No pages recorded')}
                emptyDescription={t('app.access.noPagesRecordedDescription', 'This session does not include a recorded page view.')}
                emptyIcon="web_asset_off"
              />
            </Stack>
          </>
        )}
      </Stack>
    </Dialog>
  )
}
