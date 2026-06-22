import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Banner,
  Button,
  ButtonContainer,
  Dialog,
  Figure,
  Icon,
  IconButton,
  MessageBadge,
  Paragraph,
  SegmentedControl,
  SelectField,
  Stack,
  TextareaField,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { addImage, resolveSrc, toImageRef } from '../lib/imageLibrary'
import { findSimilar, similarityLabel, similarityTone } from '../services/backlog/similarity'
import {
  COMPLEXITIES, COMPLEXITY_LABELS, PRIORITIES, PRIORITY_LABELS, SCOPE_KINDS,
  SCOPE_LABELS, TYPE_LABELS, TYPES, ticketRef,
} from '../services/backlog/types'
import { ScopeBadge } from './TicketBadges'

const TYPE_OPTIONS = TYPES.map((value) => ({ value, label: TYPE_LABELS[value] }))

/**
 * The shared "Report a bug / request a feature" form. Presentational: it owns the
 * form state and calls `onSubmit(input)` — the BacklogProvider wires that to the
 * store and toasts the new A1-<n>. `scope` pre-fills (and locks) the scope when the
 * dialog is opened from a scoped surface (a component page, the editor, a theme…).
 */
export function CreateTicketDialog({ open, scope, existingItems = [], onClose, onSubmit }) {
  const preScoped = !!(scope && scope.kind && scope.kind !== 'general')

  const [type, setType] = useState('feature')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('')
  const [complexity, setComplexity] = useState('')
  const [scopeKind, setScopeKind] = useState('general')
  const [attachments, setAttachments] = useState([]) // a1img:// refs
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  useEffect(() => {
    if (!open) return
    setType('feature'); setTitle(''); setDescription(''); setPriority(''); setComplexity('')
    setScopeKind(preScoped ? scope.kind : 'general')
    setAttachments([]); setBusy(false); setError('')
  }, [open, preScoped, scope])

  // Catch likely duplicates as the user types — "lots are going to be similar or the same"
  // (A1-161). Local finder, so it runs live with no API call. Needs a meaningful title.
  const possibleDuplicates = useMemo(() => {
    const t = title.trim()
    if (t.length < 4 || !existingItems.length) return []
    return findSimilar(
      { title: t, description, type, scopeKind, scopeRef: scope?.ref ?? null, scopeLabel: scope?.label ?? null },
      existingItems,
      { limit: 3, threshold: 0.2 },
    )
  }, [title, description, type, scopeKind, scope?.ref, scope?.label, existingItems])

  async function handleFiles(e) {
    const files = Array.from(e.target.files || [])
    if (fileRef.current) fileRef.current.value = ''
    for (const file of files) {
      try {
        const meta = await addImage(file)
        setAttachments((prev) => [...prev, toImageRef(meta.id)])
      } catch {
        setError('Could not attach an image.')
      }
    }
  }

  async function handleSubmit() {
    const trimmed = title.trim()
    if (!trimmed || busy) return
    setBusy(true); setError('')
    try {
      await onSubmit({
        title: trimmed,
        description,
        type,
        priority: priority || null,
        complexity: complexity || null,
        scope: { kind: scopeKind, ref: scope?.ref ?? null, label: scope?.label ?? null },
        attachmentRefs: attachments,
      })
      onClose?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create the ticket.')
      setBusy(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="New ticket"
      footer={(
        <ButtonContainer>
          <Button variant="secondary" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button icon="add" loading={busy} disabled={!title.trim()} onClick={handleSubmit}>
            Create ticket
          </Button>
        </ButtonContainer>
      )}
    >
      <Stack gap="md">
        {error && <Banner status="error" variant="inline">{error}</Banner>}

        <Stack gap="xs">
          <Paragraph as="span" size="xs" color="muted">Type</Paragraph>
          <SegmentedControl options={TYPE_OPTIONS} value={type} onChange={setType} aria-label="Ticket type" />
        </Stack>

        <TextField
          label="Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoComplete="off"
        />

        <TextareaField
          label="Description"
          hint="What's the problem or idea? Steps to reproduce, expected vs actual, links."
          rows="md"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {possibleDuplicates.length > 0 && (
          <Banner status="info" variant="inline">
            <Stack gap="xs">
              <Stack direction="row" gap="xs" align="center">
                <Icon name="join_inner" size="sm" />
                <Paragraph as="span" size="sm">
                  This looks similar to existing tickets — already tracked? Consider voting on one instead.
                </Paragraph>
              </Stack>
              <Stack gap="xs">
                {possibleDuplicates.map(({ item, score }) => (
                  <Stack key={item.id} direction="row" gap="xs" align="center" wrap>
                    <MessageBadge status={similarityTone(score)} subtle size="sm" icon="join_inner">
                      {similarityLabel(score)}
                    </MessageBadge>
                    <Paragraph as="span" size="sm">{ticketRef(item.number)} · {item.title}</Paragraph>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Banner>
        )}

        <Stack direction="row" gap="md" wrap>
          <SelectField label="Suggested priority" size="compact" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="">No suggestion</option>
            {PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
          </SelectField>
          <SelectField label="Suggested complexity" size="compact" value={complexity} onChange={(e) => setComplexity(e.target.value)}>
            <option value="">No suggestion</option>
            {COMPLEXITIES.map((c) => <option key={c} value={c}>{COMPLEXITY_LABELS[c]}</option>)}
          </SelectField>
        </Stack>

        {preScoped ? (
          <Stack gap="xs">
            <Paragraph as="span" size="xs" color="muted">Scope</Paragraph>
            <div><ScopeBadge scopeKind={scope.kind} scopeLabel={scope.label} size="md" /></div>
          </Stack>
        ) : (
          <SelectField label="Scope" size="compact" value={scopeKind} onChange={(e) => setScopeKind(e.target.value)}>
            {SCOPE_KINDS.map((k) => <option key={k} value={k}>{SCOPE_LABELS[k]}</option>)}
          </SelectField>
        )}

        <Stack gap="xs">
          <Paragraph as="span" size="xs" color="muted">Screenshots</Paragraph>
          {attachments.length > 0 && (
            <Stack direction="row" gap="sm" wrap>
              {attachments.map((ref) => (
                <div key={ref} className="a1-backlog-attach">
                  <Figure src={resolveSrc(ref)} alt="Attachment" size="2xs" radius="sm" aspectRatio="1:1" />
                  <IconButton
                    size="sm"
                    variant="secondary"
                    icon="close"
                    aria-label="Remove attachment"
                    onClick={() => setAttachments((prev) => prev.filter((r) => r !== ref))}
                  />
                </div>
              ))}
            </Stack>
          )}
          <div>
            <Button size="sm" variant="secondary" icon="image" onClick={() => fileRef.current?.click()}>
              Add screenshot
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleFiles}
            />
          </div>
        </Stack>
      </Stack>
    </Dialog>
  )
}
