import { useEffect, useMemo, useState } from 'react'
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
import { createContrastReport } from './contrastCheck.ts'

const STATUS_TONE = {
  pass: 'success',
  review: 'warn',
}

export function ContrastCheckDialog({ open, onClose, containerRef, scopeNodeId, scopeLabel }) {
  const t = useT()
  const dialogTitle = t('app.editor.contrastCheckTitle', 'Contrast check')
  const [report, setReport] = useState(null)
  const [runToken, setRunToken] = useState(0)

  const resolvedScopeLabel = scopeLabel ?? t('app.editor.contrastCheckScopeWhole', 'Whole page')

  useEffect(() => {
    if (!open) { setReport(null); return }
    const root = containerRef?.current
    if (!root) { setReport(null); return }
    setReport(createContrastReport(root, scopeNodeId ?? null, resolvedScopeLabel))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, runToken, scopeNodeId])

  const statusLabels = useMemo(() => ({
    pass: t('app.editor.contrastCheckStatusPass', 'Pass'),
    review: t('app.editor.contrastCheckStatusReview', 'Review'),
  }), [t])

  const columns = useMemo(() => [
    {
      key: 'element',
      label: t('app.editor.contrastCheckColumnElement', 'Element'),
      searchable: true,
    },
    {
      key: 'text',
      label: t('app.editor.contrastCheckColumnText', 'Text'),
      searchable: true,
    },
    {
      key: 'ratio',
      label: t('app.editor.contrastCheckColumnRatio', 'Ratio'),
      align: 'end',
      sortable: true,
    },
    {
      key: 'threshold',
      label: t('app.editor.contrastCheckColumnThreshold', 'AA minimum'),
      align: 'end',
    },
    {
      key: 'status',
      label: t('app.editor.contrastCheckColumnStatus', 'Status'),
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
      label: t('app.editor.contrastCheckColumnNotes', 'Notes'),
      searchable: true,
    },
  ], [t, statusLabels])

  const rows = useMemo(() => (report?.items ?? []).map((item) => ({
    id: item.id,
    element: `${item.type}${item.large ? ' (large text)' : ''}`,
    text: item.text || '—',
    ratio: item.ratioLabel,
    threshold: `${item.minimum}:1`,
    status: statusLabels[item.status] ?? item.status,
    rawStatus: item.status,
    notes: item.note,
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
          <Button
            variant="secondary"
            icon="refresh"
            onClick={() => setRunToken((token) => token + 1)}
          >
            {t('app.editor.contrastCheckRerun', 'Re-run')}
          </Button>
          <Button variant="secondary" onClick={onClose}>
            {t('app.editor.contrastCheckClose', 'Close')}
          </Button>
        </ButtonContainer>
      )}
    >
      {report && (
        <Stack gap="md">
          <Stack gap="xs">
            <Paragraph size="sm" color="muted">
              {t(
                'app.editor.contrastCheckDescription',
                'Checks the color contrast of the current page, or a selected element and its contents, against the WCAG AA text-contrast minimums. Reads live rendered colors, so it reflects the current theme, color mode, and any overrides exactly as painted.',
              )}
            </Paragraph>
            <Paragraph size="sm" color="muted">
              {report.scopeLabel}
            </Paragraph>
          </Stack>

          <Banner status="info" variant="inline">
            <Stack gap="xs">
              <Heading as="h3" size="xs">
                {t('app.editor.contrastCheckScopeTitle', 'Text contrast only, current view')}
              </Heading>
              <Paragraph size="sm">
                {t(
                  'app.editor.contrastCheckScopeBody',
                  'This checks text contrast in the theme, color mode, and viewport currently shown in the editor canvas — re-run it after switching any of those. Non-text contrast (borders, focus rings, icon-only controls) is not covered yet and still needs manual review.',
                )}
              </Paragraph>
            </Stack>
          </Banner>

          <Grid
            columns={{ xs: 2, md: 3 }}
            gap="sm"
            aria-label={t('app.editor.contrastCheckSummaryLabel', 'Contrast check summary')}
          >
            <Stat
              title={t('app.editor.contrastCheckElementsChecked', 'Elements checked')}
              value={report.itemCount}
              size="sm"
            />
            <Stat
              title={t('app.editor.contrastCheckPassing', 'Passing')}
              value={report.passCount}
              size="sm"
            />
            <Stat
              title={t('app.editor.contrastCheckNeedsReview', 'Needs review')}
              value={report.reviewCount}
              size="sm"
            />
          </Grid>

          <Stack gap="xs">
            <Heading as="h3" size="md">
              {t('app.editor.contrastCheckTableHeading', 'Elements checked')}
            </Heading>
            <DataTable
              columns={columns}
              rows={rows}
              size="compact"
              caption={t('app.editor.contrastCheckTableCaption', 'Contrast check findings')}
              getRowId={(row) => row.id}
              defaultPageSize={12}
              pageSizeOptions={[12, 24, 48]}
              emptyTitle={t('app.editor.contrastCheckNoRowsTitle', 'No text elements found')}
              emptyDescription={t(
                'app.editor.contrastCheckNoRowsDescription',
                'This page or selection does not have any visible text to check.',
              )}
            />
          </Stack>
        </Stack>
      )}
    </Dialog>
  )
}
