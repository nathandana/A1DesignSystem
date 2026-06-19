/**
 * PatternLockControls — element-level governance for the selected pattern node.
 *
 * Locking is metadata for *instances* of the pattern: a locked component can't be
 * removed/moved/replaced, and locked text can't be edited when the pattern is
 * reused. Individual **properties** are locked inline, with the lock icon next to
 * each control in the configurator below. The pattern author still edits
 * everything freely here.
 */
import {
  Heading,
  Icon,
  Stack,
  Switch,
} from '@gtivr4/a1-design-system-react'

export function PatternLockControls({ node, onChange }) {
  const lock = node.lock ?? {}
  const set = (patch) => onChange({ ...lock, ...patch })

  return (
    <Stack gap="md">
      <Stack direction="row" gap="xs" align="center">
        <Icon name="lock" size="sm" color="muted" aria-hidden="true" />
        <Heading as="h3" size="xs" color="muted">Governance</Heading>
      </Stack>

      <Switch
        label="Lock component"
        hint="Instances can't remove, move, or replace this element."
        size="compact"
        checked={!!lock.node}
        onChange={(checked) => set({ node: checked })}
      />

      {node.content && (
        <Switch
          label="Lock text content"
          hint="The text is fixed in instances."
          size="compact"
          checked={!!lock.content}
          onChange={(checked) => set({ content: checked })}
        />
      )}
    </Stack>
  )
}
