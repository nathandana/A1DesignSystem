import { useState } from 'react'
import { Banner, Button, ButtonContainer, Dialog, Stack, TextField, TextareaField } from '@gtivr4/a1-design-system-react'
import { IconSelect } from '../pages/components/detail/IconSelect.jsx'
import { describeError, AI_ENABLED } from '../lib/aiImages.ts'
import { suggestImageStyle } from '../lib/aiProjectStyle.ts'

/**
 * Create / rename a project. Shared by the Projects list and a project's home
 * view. The parent remounts this via a `key` per open, so the fields seed from
 * `initial` on mount. Also captures the project's image & illustration style
 * (with an AI suggestion based on the project + active theme), stored in
 * `meta.imageStyle` and used to seed Figure "Generate with AI" prompts.
 */
export function ProjectDialog({ open, mode = 'create', initial, onCancel, onSubmit }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [icon, setIcon] = useState(initial?.icon ?? 'folder')
  const [imageStyle, setImageStyle] = useState(initial?.meta?.imageStyle ?? '')
  const [suggesting, setSuggesting] = useState(false)
  const [error, setError] = useState('')

  const title = mode === 'create' ? 'New project' : 'Project settings'
  const submitLabel = mode === 'create' ? 'Create project' : 'Save changes'

  async function suggest() {
    setSuggesting(true)
    setError('')
    try {
      const result = await suggestImageStyle({ projectName: name, projectDescription: description })
      if (result) setImageStyle(result)
    } catch (err) {
      setError(describeError(err))
    } finally {
      setSuggesting(false)
    }
  }

  function submit() {
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      icon,
      meta: { ...(initial?.meta ?? {}), imageStyle: imageStyle.trim() || undefined },
    })
  }

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button disabled={!name.trim()} onClick={submit}>{submitLabel}</Button>
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

        <Stack gap="xs">
          <TextareaField
            label="Image & illustration style"
            hint="Describes the illustration and photography style for this project. Used to guide AI-generated image prompts."
            rows="md"
            value={imageStyle}
            onChange={(e) => setImageStyle(e.target.value)}
          />
          {AI_ENABLED && (
            <ButtonContainer>
              <Button
                size="sm"
                variant="secondary"
                icon="auto_awesome"
                loading={suggesting}
                onClick={suggest}
              >
                {imageStyle ? 'Re-suggest with AI' : 'Suggest with AI'}
              </Button>
            </ButtonContainer>
          )}
          {AI_ENABLED && error && <Banner status="error" variant="inline" onDismiss={() => setError('')}>{error}</Banner>}
        </Stack>
      </Stack>
    </Dialog>
  )
}
