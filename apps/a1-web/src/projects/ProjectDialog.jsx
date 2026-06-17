import { useState } from 'react'
import { Button, Dialog, Stack, TextField, TextareaField } from '@gtivr4/a1-design-system-react'
import { IconSelect } from '../pages/components/detail/IconSelect.jsx'

/**
 * Create / rename a project. Shared by the Projects list and a project's home
 * view. The parent remounts this via a `key` per open, so the fields seed from
 * `initial` on mount.
 */
export function ProjectDialog({ open, mode = 'create', initial, onCancel, onSubmit }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [icon, setIcon] = useState(initial?.icon ?? 'folder')

  const title = mode === 'create' ? 'New project' : 'Rename project'
  const submitLabel = mode === 'create' ? 'Create project' : 'Save changes'

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button
            disabled={!name.trim()}
            onClick={() => onSubmit({ name: name.trim(), description: description.trim(), icon })}
          >
            {submitLabel}
          </Button>
        </>
      }
    >
      <Stack gap="md">
        <TextField
          label="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />
        <TextareaField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <IconSelect label="Icon" size="default" value={icon} onChange={setIcon} />
      </Stack>
    </Dialog>
  )
}
