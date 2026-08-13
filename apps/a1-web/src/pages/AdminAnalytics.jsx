import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Banner,
  BarChart,
  Button,
  Card,
  CircularProgress,
  DataTable,
  Grid,
  GridItem,
  Heading,
  Paragraph,
  PieChart,
  Section,
  Stack,
  Stat,
} from '@gtivr4/a1-design-system-react'
import { sampleVisitAnalytics } from '../admin/sampleVisitAnalytics.js'
import {
  formatVisitDateTime,
  formatVisitDuration,
  VisitDetailsDialog,
} from '../admin/VisitDetailsDialog.jsx'
import { buildVisitAnalyticsSummary } from '../admin/visitAnalyticsSummary.js'
import { VisitMap } from '../admin/VisitMap.jsx'
import {
  getVisitAnalyticsDetails,
  listVisitAnalytics,
} from '../admin/userAdminApi.js'
import { useAuth } from '../lib/AuthContext.jsx'
import { useT } from '../labels/useT.js'
import { PageTitleArea } from './PageTitleArea.jsx'

function formatDurationSeconds(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0s'
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
}

export function AdminAnalytics({ onNavigate }) {
  const t = useT()
  const { configured } = useAuth()
  const [visits, setVisits] = useState([])
  const [showSampleData, setShowSampleData] = useState(false)
  const [loading, setLoading] = useState(configured)
  const [error, setError] = useState('')
  const [selectedVisit, setSelectedVisit] = useState(null)
  const [visitDetails, setVisitDetails] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [detailsError, setDetailsError] = useState('')
  const detailsRequestRef = useRef(0)

  const loadVisits = useCallback(async () => {
    if (!configured) return
    setLoading(true)
    setError('')
    try {
      const result = await listVisitAnalytics()
      setVisits(result.visits ?? [])
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setLoading(false)
    }
  }, [configured])

  useEffect(() => {
    loadVisits()
  }, [loadVisits])

  const loadDetails = useCallback(async (visit) => {
    if (visit.sample) {
      setVisitDetails({ visit, ipLookups: visit.sampleIpLookups ?? [] })
      setDetailsLoading(false)
      setDetailsError('')
      return
    }

    const requestId = detailsRequestRef.current + 1
    detailsRequestRef.current = requestId
    setDetailsLoading(true)
    setDetailsError('')
    try {
      const result = await getVisitAnalyticsDetails(visit.session_id)
      if (detailsRequestRef.current !== requestId) return
      setVisitDetails(result)
    } catch (loadError) {
      if (detailsRequestRef.current !== requestId) return
      setDetailsError(loadError.message)
    } finally {
      if (detailsRequestRef.current === requestId) setDetailsLoading(false)
    }
  }, [])

  function openDetails(visit) {
    setSelectedVisit(visit)
    setVisitDetails(null)
    loadDetails(visit)
  }

  function closeDetails() {
    detailsRequestRef.current += 1
    setSelectedVisit(null)
    setVisitDetails(null)
    setDetailsError('')
  }

  const neverLabel = t('app.access.never', 'Never')
  const unavailableLabel = t('app.access.notProvided', 'Not provided')
  const anonymousLabel = t('app.access.anonymousVisitor', 'Anonymous visitor')
  const displayVisits = showSampleData ? sampleVisitAnalytics : visits
  const summary = useMemo(() => buildVisitAnalyticsSummary(displayVisits), [displayVisits])
  const deviceLabels = {
    desktop: t('app.access.deviceDesktop', 'Desktop'),
    mobile: t('app.access.deviceMobile', 'Mobile'),
    tablet: t('app.access.deviceTablet', 'Tablet'),
    automated: t('app.access.deviceAutomated', 'Automated'),
    unknown: t('app.access.deviceUnknown', 'Unknown'),
  }
  const deviceRows = summary.devices.map((entry) => ({
    ...entry,
    name: deviceLabels[entry.name] ?? entry.name,
  }))
  const visitRows = displayVisits.map((entry) => {
    const paths = Array.isArray(entry.pages)
      ? entry.pages.map((view) => view?.path || view?.page).filter(Boolean)
      : []
    const context = entry.visitor_context ?? {}
    const location = [context.geo?.city, context.geo?.countryName].filter(Boolean).join(', ')
    const device = context.device?.type
    return {
      id: entry.session_id,
      ipAddresses: Array.isArray(entry.ip_addresses) ? entry.ip_addresses.join(', ') : '',
      visitor: entry.user_email ?? anonymousLabel,
      device: deviceLabels[device] ?? device ?? unavailableLabel,
      location: location || unavailableLabel,
      pages: paths.length ? paths.join(' → ') : neverLabel,
      pageViews: paths.length,
      duration: formatVisitDuration(entry.started_at, entry.ended_at ?? entry.last_seen_at, neverLabel),
      started: formatVisitDateTime(entry.started_at, neverLabel),
      startedAt: entry.started_at,
      action: (
        <Button size="sm" variant="secondary" onClick={() => openDetails(entry)}>
          {t('app.access.viewVisitDetails', 'View details')}
        </Button>
      ),
    }
  })

  const visitColumns = [
    {
      key: 'ipAddresses',
      label: t('app.access.ipAddress', 'IP address'),
      sortable: true,
      searchable: true,
    },
    {
      key: 'visitor',
      label: t('app.access.visitor', 'Visitor'),
      sortable: true,
      searchable: true,
    },
    {
      key: 'device',
      label: t('app.access.device', 'Device'),
      sortable: true,
      searchable: true,
    },
    {
      key: 'location',
      label: t('app.access.location', 'Location'),
      sortable: true,
      searchable: true,
    },
    {
      key: 'pages',
      label: t('app.access.pagesVisited', 'Pages visited'),
      searchable: true,
    },
    {
      key: 'pageViews',
      label: t('app.access.pageViews', 'Page views'),
      sortable: true,
      type: 'number',
    },
    {
      key: 'duration',
      label: t('app.access.visitLength', 'Visit length'),
    },
    {
      key: 'started',
      label: t('app.access.visitStarted', 'Started'),
      sortable: true,
      sortAccessor: (row) => row.startedAt,
    },
    {
      key: 'action',
      label: t('app.access.userActions', 'Actions'),
      type: 'actions',
    },
  ]

  const locationRows = summary.locations.map((location) => ({
    id: `${location.name}-${location.coordinates.join('-')}`,
    location: location.name,
    visits: location.value,
  }))
  const locationColumns = [
    { key: 'location', label: t('app.access.location', 'Location'), sortable: true },
    { key: 'visits', label: t('app.access.totalVisits', 'Visits'), sortable: true, type: 'number' },
  ]
  const mapSummary = summary.locations.length
    ? summary.locations.map((location) => `${location.name}: ${location.value}`).join('; ')
    : t('app.access.noLocationData', 'No location data recorded')

  const showAnalytics = configured || showSampleData

  return (
    <>
      <PageTitleArea
        contentWidth="lg"
        headingId="admin-analytics-heading"
        breadcrumbItems={[
          {
            label: t('app.page.home', 'Home'),
            href: '/',
            onClick: (event) => {
              event.preventDefault()
              onNavigate?.('home')
            },
          },
          {
            label: t('app.page.admin', 'Administration'),
            href: '/admin',
            onClick: (event) => {
              event.preventDefault()
              onNavigate?.('admin')
            },
          },
          { label: t('app.access.visitAnalyticsTitle', 'Visit analytics') },
        ]}
        title={t('app.access.visitAnalyticsTitle', 'Visit analytics')}
        description={t('app.access.visitAnalyticsDescription', 'Review first-party visits, device context, pages viewed, locations and approximate visit length.')}
      />
      <Section padding="sm" contentWidth="lg" aria-labelledby="admin-analytics-heading">
        <Stack gap="lg">
          <Stack direction="row" gap="sm" align="center" justify="end" wrap>
            {configured && !showSampleData && (
              <Button variant="secondary" icon="refresh" onClick={loadVisits} loading={loading}>
                {t('app.access.refreshAnalytics', 'Refresh analytics')}
              </Button>
            )}
            <Button
              variant="secondary"
              icon={showSampleData ? 'database' : 'science'}
              onClick={() => setShowSampleData((current) => !current)}
            >
              {showSampleData
                ? t('app.access.showLiveData', 'Show live data')
                : t('app.access.showSampleData', 'Show sample data')}
            </Button>
          </Stack>

          {!configured && !showSampleData && (
            <Banner
              status="info"
              title={t('app.access.analyticsUnavailable', 'Visit analytics is unavailable')}
            >
              {t('app.access.analyticsUnavailableDescription', 'Configure Supabase and the server-only service key to review recorded visits.')}
            </Banner>
          )}

          {showSampleData && (
            <Banner
              status="info"
              title={t('app.access.sampleDataTitle', 'Sample analytics data')}
            >
              {t('app.access.sampleDataDescription', 'This synthetic data is shown only in your browser. It is not saved and does not affect live metrics.')}
            </Banner>
          )}

          {error && !showSampleData && (
            <Banner
              status="error"
              variant="inline"
              action={(
                <Button size="sm" variant="secondary" icon="refresh" onClick={loadVisits}>
                  {t('app.access.retryAnalytics', 'Retry analytics')}
                </Button>
              )}
            >
              {error}
            </Banner>
          )}

          {showAnalytics && loading && !visits.length && !showSampleData ? (
            <Stack direction="row" gap="sm" align="center">
              <CircularProgress
                size="xs"
                indeterminate
                aria-label={t('app.access.loadingAnalytics', 'Loading analytics')}
              />
              <Paragraph size="sm" color="muted">
                {t('app.access.loadingAnalytics', 'Loading analytics')}
              </Paragraph>
            </Stack>
          ) : showAnalytics && (
            <>
              <Grid columns={{ xs: 1, sm: 2, lg: 4 }} gap="md">
                <Card><Stat title={t('app.access.totalVisits', 'Visits')} value={summary.visits} icon="monitoring" size="lg" /></Card>
                <Card><Stat title={t('app.access.uniqueIpAddresses', 'Unique IP addresses')} value={summary.uniqueIps} icon="language" size="lg" /></Card>
                <Card><Stat title={t('app.access.pageViews', 'Page views')} value={summary.pageViews} icon="web" size="lg" /></Card>
                <Card><Stat title={t('app.access.averageVisitLength', 'Average visit length')} value={formatDurationSeconds(summary.averageDurationSeconds)} icon="timer" size="lg" format="none" /></Card>
              </Grid>

              <Grid columns={{ xs: 1, lg: 2 }} gap="md">
                <Card>
                  <BarChart
                    title={t('app.access.visitsOverTime', 'Visits over time')}
                    description={t('app.access.visitsOverTimeDescription', 'Recorded sessions during the last 14 days.')}
                    data={summary.visitsByDay}
                    xKey="name"
                    series={[{ key: 'visits', label: t('app.access.totalVisits', 'Visits'), tone: 'accent' }]}
                    height="sm"
                    showLegend={false}
                    aria-label={t('app.access.visitsOverTime', 'Visits over time')}
                  />
                </Card>
                <Card>
                  <PieChart
                    title={t('app.access.deviceBreakdown', 'Device breakdown')}
                    description={t('app.access.deviceBreakdownDescription', 'Device type inferred from Netlify and browser-reported request headers.')}
                    data={deviceRows}
                    height="sm"
                    aria-label={t('app.access.deviceBreakdown', 'Device breakdown')}
                  />
                </Card>
                <GridItem span="full">
                  <Card>
                    <BarChart
                      title={t('app.access.topPages', 'Top pages')}
                      description={t('app.access.topPagesDescription', 'Most-viewed routes in the selected dataset.')}
                      data={summary.topPages}
                      xKey="name"
                      series={[{ key: 'value', label: t('app.access.pageViews', 'Page views'), tone: 'info' }]}
                      height="sm"
                      showLegend={false}
                      aria-label={t('app.access.topPages', 'Top pages')}
                    />
                  </Card>
                </GridItem>
                <GridItem span="full">
                  <Card>
                    <Stack gap="md">
                      <Stack gap="xs">
                        <Heading as="h2" size="sm">
                          {t('app.access.visitorMap', 'Visitor map')}
                        </Heading>
                        <Paragraph size="sm" color="muted">
                          {t('app.access.visitorMapDescription', 'Approximate locations supplied by Netlify. A visit appears after coordinates are recorded.')}
                        </Paragraph>
                      </Stack>
                      {summary.locations.length ? (
                        <>
                          <VisitMap
                            locations={summary.locations}
                            label={`${t('app.access.visitorMap', 'Visitor map')}. ${mapSummary}`}
                          />
                          <DataTable
                            caption={t('app.access.visitorLocationsCaption', 'Visitor locations and visit counts')}
                            columns={locationColumns}
                            rows={locationRows}
                            getRowId={(row) => row.id}
                            size="compact"
                            defaultSort={{ key: 'visits', direction: 'desc' }}
                          />
                        </>
                      ) : (
                        <Banner status="info" variant="inline">
                          {t('app.access.noLocationData', 'No location data recorded')}
                        </Banner>
                      )}
                    </Stack>
                  </Card>
                </GridItem>
              </Grid>

              <Card>
                <Stack gap="md">
                  <Stack gap="xs">
                    <Heading as="h2" size="sm">
                      {t('app.access.recordedVisitsTitle', 'Recorded visits')}
                    </Heading>
                    <Paragraph size="sm" color="muted">
                      {t('app.access.recordedVisitsDescription', 'Open a session to review its full timeline, device context and approximate location and network details.')}
                    </Paragraph>
                  </Stack>
                  <DataTable
                    caption={t('app.access.visitAnalyticsCaption', 'Recorded A1 site visits')}
                    columns={visitColumns}
                    rows={visitRows}
                    getRowId={(row) => row.id}
                    searchableColumns={[
                      { key: 'ipAddresses', label: t('app.access.ipAddress', 'IP address') },
                      { key: 'visitor', label: t('app.access.visitor', 'Visitor') },
                      { key: 'device', label: t('app.access.device', 'Device') },
                      { key: 'location', label: t('app.access.location', 'Location') },
                      { key: 'pages', label: t('app.access.pagesVisited', 'Pages visited') },
                    ]}
                    defaultSort={{ key: 'started', direction: 'desc' }}
                    defaultPageSize={25}
                    pageSizeOptions={[25, 50, 100]}
                    emptyTitle={t('app.access.noVisitsTitle', 'No visits recorded')}
                    emptyDescription={t('app.access.noVisitsDescription', 'Visits recorded after analytics was enabled will appear here.')}
                    emptyIcon="monitoring"
                    scrollable
                  />
                </Stack>
              </Card>
            </>
          )}
        </Stack>
      </Section>

      <VisitDetailsDialog
        open={!!selectedVisit}
        visit={visitDetails?.visit ?? selectedVisit}
        ipLookups={visitDetails?.ipLookups ?? []}
        loading={detailsLoading}
        error={detailsError}
        onClose={closeDetails}
        onRetry={() => selectedVisit && loadDetails(selectedVisit)}
      />
    </>
  )
}
