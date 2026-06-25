import { useMemo, useState } from 'react'
import { Button, ButtonContainer, Dialog, Paragraph, Stack, TextareaField } from '@gtivr4/a1-design-system-react'
import { loadDeclines, declineFinding, undoDecline } from '../services/review/declineStore'

/**
 * Shared "decline a finding" state + dialog for the Virtual reviewers (Designer, Architect).
 *
 * A reviewer's findings can be **filed** as tickets or **declined**. Declines persist (per
 * reviewer `namespace`, in localStorage, keyed by the finding's signature) so a re-run never
 * re-surfaces a dismissed finding, and an optional comment records why. Returns helpers the
 * panel uses to render each finding's state plus a ready-to-mount `<dialog>` element.
 *
 * Usage:
 *   const decisions = useFindingDecisions('designer')
 *   decisions.isDeclined(sig) · decisions.commentFor(sig) · decisions.start(sig, title) · decisions.undo(sig)
 *   …and render {decisions.dialog} once.
 */
export function useFindingDecisions(namespace) {
  const [version, setVersion] = useState(0)
  const declines = useMemo(() => loadDeclines(namespace), [namespace, version])
  const [pending, setPending] = useState(null) // { sig, title } being declined
  const [comment, setComment] = useState('')

  const close = () => setPending(null)
  const confirm = () => {
    if (pending) declineFinding(namespace, pending.sig, comment)
    setPending(null)
    setVersion((v) => v + 1)
  }

  const dialog = (
    <Dialog
      open={!!pending}
      onClose={close}
      title="Decline finding"
      footer={
        <ButtonContainer>
          <Button variant="secondary" onClick={close}>Cancel</Button>
          <Button variant="destructive" icon="block" onClick={confirm}>Decline finding</Button>
        </ButtonContainer>
      }
    >
      <Stack gap="sm">
        <Paragraph size="sm">
          Dismiss <strong>{pending?.title}</strong>? The reviewer will remember this and won't surface it again
          on future runs. You can undo it later.
        </Paragraph>
        <TextareaField
          label="Why (optional)"
          hint="Recorded with the decision — e.g. “intentional”, “covered elsewhere”, “won't fix”."
          rows="sm"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </Stack>
    </Dialog>
  )

  return {
    declines,
    isDeclined: (sig) => !!declines[sig],
    commentFor: (sig) => declines[sig]?.comment,
    /** Open the decline dialog for a finding. */
    start: (sig, title) => { setComment(''); setPending({ sig, title }) },
    /** Forget a decline (the finding becomes actionable again). */
    undo: (sig) => { undoDecline(namespace, sig); setVersion((v) => v + 1) },
    dialog,
  }
}
