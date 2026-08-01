import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Banner,
  Button,
  Card,
  CircularProgress,
  DataTable,
  Heading,
  Paragraph,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'
import {
  formatVisitDateTime,
  formatVisitDuration,
  VisitDetailsDialog,
} from '../admin/VisitDetailsDialog.jsx'
import {
  getVisitAnalyticsDetails,
  listVisitAnalytics,
} from '../admin/userAdminApi.js'
import { useAuth } from '../lib/AuthContext.jsx'
import { useT } from '../labels/useT.js'
import { PageTitleArea } from './PageTitleArea.jsx'

export function AdminAnalytics({ onNavigate }) {
  const t = useT()
  const { configured } = useAuth()
  const [visits, setVisits] = useState([])
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
  const anonymousLabel = t('app.access.anonymousVisitor', 'Anonymous visitor')
  const visitRows = visits.map((entry) => {
    const paths = Array.isArray(entry.pages)
      ? entry.pages.map((view) => view?.path || view?.page).filter(Boolean)
      : []
    return {
      id: entry.session_id,
      ipAddresses: Array.isArray(entry.ip_addresses) ? entry.ip_addresses.join(', ') : '',
      visitor: entry.user_email ?? anonymousLabel,
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
        description={t('app.access.visitAnalyticsDescription', 'Review first-party visit IP addresses, pages viewed and approximate visit length.')}
      />
      <Section padding="sm" contentWidth="lg" aria-labelledby="admin-analytics-heading">
        {!configured ? (
          <Banner
            status="info"
            title={t('app.access.analyticsUnavailable', 'Visit analytics is unavailable')}
          >
            {t('app.access.analyticsUnavailableDescription', 'Configure Supabase and the server-only service key to review recorded visits.')}
          </Banner>
        ) : (
          <Card>
            <Stack gap="md">
              <Stack direction="row" gap="md" align="center" justify="between" wrap>
                <Stack gap="xs">
                  <Heading as="h2" size="sm">
                    {t('app.access.recordedVisitsTitle', 'Recorded visits')}
                  </Heading>
                  <Paragraph size="sm" color="muted">
                    {t('app.access.recordedVisitsDescription', 'Open a session to review its full timeline and approximate IP location and network details.')}
                  </Paragraph>
                </Stack>
                <Button variant="secondary" icon="refresh" onClick={loadVisits} loading={loading}>
                  {t('app.access.refreshAnalytics', 'Refresh analytics')}
                </Button>
              </Stack>

              {error && (
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

              {loading && !visits.length ? (
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
              ) : (
                <DataTable
                  caption={t('app.access.visitAnalyticsCaption', 'Recorded A1 site visits')}
                  columns={visitColumns}
                  rows={visitRows}
                  getRowId={(row) => row.id}
                  searchableColumns={[
                    { key: 'ipAddresses', label: t('app.access.ipAddress', 'IP address') },
                    { key: 'visitor', label: t('app.access.visitor', 'Visitor') },
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
              )}
            </Stack>
          </Card>
        )}
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
