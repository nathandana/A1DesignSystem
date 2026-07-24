import { useState } from 'react'
import {
  Button,
  ButtonContainer,
  ChoiceGroup,
  Icon,
  Paragraph,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'

function when(iso) {
  try { return new Date(iso).toLocaleString() } catch { return '' }
}

const KIND_ICON = { question: 'help', answer: 'reply', activity: 'history', comment: 'chat' }
const OTHER_VALUE = '__other__'

export function QuestionChoices({ options, allowOther, onAnswer, submitLabel = 'Submit answer' }) {
  const [selected, setSelected] = useState(null)
  const [other, setOther] = useState('')
  const [busy, setBusy] = useState(false)
  const isOther = selected === OTHER_VALUE
  const choiceOptions = [
    ...options.map((opt) => ({ value: opt, label: opt })),
    ...(allowOther ? [{ value: OTHER_VALUE, label: 'Something else…', icon: 'edit' }] : []),
  ]
  const text = isOther ? other.trim() : selected
  const canSubmit = !busy && !!selected && (!isOther || !!other.trim())

  async function submit() {
    if (!canSubmit) return
    setBusy(true)
    try { await onAnswer(text, isOther ? 'Other' : selected) } finally { setBusy(false) }
  }

  return (
    <Stack gap="xs">
      <ChoiceGroup
        size="compact"
        label="Your answer"
        options={choiceOptions}
        value={selected}
        onChange={setSelected}
      />
      {isOther && (
        <TextField
          label="Other answer"
          value={other}
          onChange={(e) => setOther(e.target.value)}
          autoComplete="off"
        />
      )}
      <ButtonContainer align="start">
        <Button size="sm" icon="reply" loading={busy} disabled={!canSubmit} onClick={submit}>
          {submitLabel}
        </Button>
      </ButtonContainer>
    </Stack>
  )
}

/** Shared discussion entry used by Activity and the Virtual PO review surface. */
export function ThreadEntry({ entry, answered, onAnswer }) {
  const isActivity = entry.kind === 'activity'
  const persona = entry.meta?.persona
  const author = persona ? (entry.meta?.personaName || entry.userEmail) : (entry.userEmail || 'Someone')
  const options = entry.kind === 'question' && Array.isArray(entry.meta?.options) ? entry.meta.options : null

  return (
    <Stack direction="row" gap="sm" align="start">
      <Icon name={persona ? 'smart_toy' : (KIND_ICON[entry.kind] || 'chat')} size="sm" color={persona ? 'accent' : 'muted'} />
      <Stack gap="xs">
        <Paragraph size="xs" color="muted">
          {author}
          {persona && ' · virtual'}
          {entry.kind === 'question' && ' · asked the requester'}
          {entry.kind === 'answer' && ' · answered'}
          {' · '}{when(entry.createdAt)}
        </Paragraph>
        <Paragraph size="sm" color={isActivity ? 'muted' : undefined}>{entry.body}</Paragraph>
        {options && !answered && onAnswer && (
          <QuestionChoices
            options={options}
            allowOther={!!entry.meta?.allowOther}
            onAnswer={(text, choice) => onAnswer(entry.id, text, choice)}
          />
        )}
      </Stack>
    </Stack>
  )
}
