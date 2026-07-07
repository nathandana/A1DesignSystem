import { useState } from 'react'
import { Banner, Button, ButtonContainer, Dialog, Paragraph, SelectField, Stack, TextField, TextareaField } from '@gtivr4/a1-design-system-react'
import { IconSelect } from '../pages/components/detail/IconSelect.jsx'
import { describeError, formatUsage, AI_ENABLED } from '../lib/aiImages.ts'
import { suggestImageStyle } from '../lib/aiProjectStyle.ts'
import { themeOptions } from '../lib/appThemes.ts'

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
  const [theme, setTheme] = useState(initial?.theme ?? 'a1Light')
  const [imageStyle, setImageStyle] = useState(initial?.meta?.imageStyle ?? '')
  const [suggesting, setSuggesting] = useState(false)
  const [error, setError] = useState('')
  const [styleUsage, setStyleUsage] = useState(null)

  const title = mode === 'create' ? 'New project' : 'Project settings'
  const submitLabel = mode === 'create' ? 'Create project' : 'Save changes'

  async function suggest() {
    setSuggesting(true)
    setError('')
    try {
      const { style, usage } = await suggestImageStyle({ projectName: name, projectDescription: description })
      if (style) setImageStyle(style)
      setStyleUsage(usage)
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
      theme: theme === 'a1Light' ? undefined : theme,
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
        <SelectField
          label="Project theme"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        >
          {themeOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </SelectField>

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
          {AI_ENABLED && styleUsage && !suggesting && <Paragraph size="xs" color="muted">{formatUsage(styleUsage)}</Paragraph>}
          {AI_ENABLED && error && <Banner status="error" variant="inline" onDismiss={() => setError('')}>{error}</Banner>}
        </Stack>
      </Stack>
    </Dialog>
  )
}
