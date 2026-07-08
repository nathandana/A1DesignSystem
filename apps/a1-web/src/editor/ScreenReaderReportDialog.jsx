import { useMemo } from 'react'
import {
  Banner,
  Button,
  ButtonContainer,
  DataTable,
  Dialog,
  Grid,
  Heading,
  MessageBadge,
  Paragraph,
  Stack,
  Stat,
} from '@gtivr4/a1-design-system-react'
import { useT } from '../labels/useT.js'
import { createScreenReaderReport } from './screenReaderReport.ts'

const STATUS_TONE = {
  ok: 'success',
  review: 'warn',
  issue: 'error',
}

export function ScreenReaderReportDialog({ open, onClose, definition }) {
  const t = useT()
  const dialogTitle = t('app.editor.screenReaderReportTitle', 'Screen reader report')
  const report = useMemo(
    () => (definition ? createScreenReaderReport(definition) : null),
    [definition],
  )

  const statusLabels = useMemo(() => ({
    ok: t('app.editor.screenReaderReportStatusOk', 'Pass'),
    review: t('app.editor.screenReaderReportStatusReview', 'Review'),
    issue: t('app.editor.screenReaderReportStatusIssue', 'Issue'),
  }), [t])

  const columns = useMemo(() => [
    {
      key: 'depth',
      label: t('app.editor.screenReaderReportColumnDepth', 'Level'),
      width: '4rem',
      align: 'end',
      sortable: true,
    },
    {
      key: 'element',
      label: t('app.editor.screenReaderReportColumnElement', 'Element'),
      searchable: true,
    },
    {
      key: 'role',
      label: t('app.editor.screenReaderReportColumnRole', 'Role'),
      searchable: true,
    },
    {
      key: 'announcement',
      label: t('app.editor.screenReaderReportColumnAnnouncement', 'Likely announcement'),
      searchable: true,
    },
    {
      key: 'status',
      label: t('app.editor.screenReaderReportColumnStatus', 'Status'),
      type: 'badge',
      filterable: true,
      renderCell: ({ row }) => (
        <MessageBadge status={STATUS_TONE[row.rawStatus] ?? 'neutral'} subtle size="sm">
          {statusLabels[row.rawStatus] ?? row.status}
        </MessageBadge>
      ),
    },
    {
      key: 'notes',
      label: t('app.editor.screenReaderReportColumnNotes', 'Notes'),
      searchable: true,
    },
  ], [t, statusLabels])

  const rows = useMemo(() => (report?.items ?? []).map((item) => ({
    id: item.id,
    depth: item.depth,
    element: `${item.type} (${item.region})`,
    role: item.role,
    announcement: item.announcement,
    status: statusLabels[item.status] ?? item.status,
    rawStatus: item.status,
    notes: item.notes.length ? item.notes.join(' ') : '-',
  })), [report, statusLabels])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="lg"
      title={dialogTitle}
      aria-label={dialogTitle}
      footer={(
        <ButtonContainer>
          <Button variant="secondary" onClick={onClose}>
            {t('app.editor.screenReaderReportClose', 'Close')}
          </Button>
        </ButtonContainer>
      )}
    >
      {report && (
        <Stack gap="md">
          <Stack gap="xs">
            <Paragraph size="sm" color="muted">
              {t('app.editor.screenReaderReportDescription', 'A heuristic outline of the current page structure and the labels most screen readers are likely to announce. Use it to catch unlabeled icon buttons, missing field labels, heading jumps, and image-alt issues before manual assistive-technology testing.')}
            </Paragraph>
            <Paragraph size="sm" color="muted">
              {report.pageName}
            </Paragraph>
          </Stack>

          <Banner status="info" variant="inline">
            <Stack gap="xs">
              <Heading as="h3" size="xs">
                {t('app.editor.screenReaderReportScopeTitle', 'Manual verification still matters')}
              </Heading>
              <Paragraph size="sm">
                {t('app.editor.screenReaderReportScopeBody', 'This report reads the page definition, not a live screen reader transcript. Confirm focus order, dynamic announcements, and final wording in VoiceOver, NVDA, or another assistive technology before release.')}
              </Paragraph>
            </Stack>
          </Banner>

          <Grid
            columns={{ xs: 2, md: 4 }}
            gap="sm"
            aria-label={t('app.editor.screenReaderReportSummaryLabel', 'Screen reader report summary')}
          >
            <Stat
              title={t('app.editor.screenReaderReportItemsReviewed', 'Items reviewed')}
              value={report.itemCount}
              size="sm"
            />
            <Stat
              title={t('app.editor.screenReaderReportHeadings', 'Headings')}
              value={report.headingCount}
              size="sm"
            />
            <Stat
              title={t('app.editor.screenReaderReportControls', 'Controls')}
              value={report.interactiveCount}
              size="sm"
            />
            <Stat
              title={t('app.editor.screenReaderReportIssues', 'Issues')}
              value={report.issueCount}
              description={`${report.reviewCount} ${statusLabels.review.toLowerCase()}`}
              size="sm"
            />
          </Grid>

          <Stack gap="xs">
            <Heading as="h3" size="md">
              {t('app.editor.screenReaderReportStructureHeading', 'Reading structure')}
            </Heading>
            <DataTable
              columns={columns}
              rows={rows}
              size="compact"
              caption={t('app.editor.screenReaderReportTableCaption', 'Screen reader structure report')}
              getRowId={(row) => row.id}
              defaultPageSize={12}
              pageSizeOptions={[12, 24, 48]}
              emptyTitle={t('app.editor.screenReaderReportNoRowsTitle', 'No readable items')}
              emptyDescription={t('app.editor.screenReaderReportNoRowsDescription', 'This page does not have any component nodes to inspect.')}
            />
          </Stack>
        </Stack>
      )}
    </Dialog>
  )
}
