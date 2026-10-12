import React from 'react'
import { Button, Inset, Paragraph, Slider, Stack, Toolbar, ToolbarGroup } from '@gtivr4/a1-design-system-react'

function FrameSlider({ label, sizes, value, onChange }) {
  // Zero removes rounding; A1's spacing scale starts at 1, not 0.
  const options = ['', ...sizes.map(size => size === 0 ? '0' : `var(--base-spacing-${size})`)]
  return (
    <Slider
      label={label}
      variant="subtle"
      value={options.indexOf(value)}
      onChange={index => onChange(options[index])}
      detents={[
        { value: 0, label: 'Theme default', icon: 'settings_backup_restore' },
        ...sizes.map((size, index) => ({ value: index + 1, label: String(size) })),
      ]}
      formatValue={index => index === 0 ? 'Theme default' : `${sizes[index - 1]} pixels`}
      bubbleLabel={index => index === 0 ? 'Theme default' : `${sizes[index - 1]} px`}
    />
  )
}

export function Configuration({ ratio, setRatio, duration, setDuration, animationStyle, setAnimationStyle, borderRadius, setBorderRadius, borderWidth, setBorderWidth, paused, setPaused, phase, replay }) {
  return (
    <Inset space={16}>
      <Stack gap={24}>
        <Toolbar label="Animation style">
          <ToolbarGroup
            aria-label="Animation style"
            showLabels
            value={animationStyle}
            onChange={setAnimationStyle}
            options={[
              { value: 'discs', label: 'Discs' },
              { value: 'blob', label: 'Glowing Blob' },
            ]}
          />
        </Toolbar>
        <Toolbar label="Aspect ratio" >
          <ToolbarGroup
            aria-label="Aspect ratio"
            showLabels
            value={ratio}
            onChange={setRatio}
            options={[
              { value: '4 / 3', label: '4:3' },
              { value: '1 / 1', label: '1:1' },
              { value: '16 / 9', label: '16:9' },
              { value: '3 / 4', label: '3:4' },
            ]}
          />
        </Toolbar>
        <FrameSlider label="Border radius" sizes={[0, 4, 8, 16, 24]} value={borderRadius} onChange={setBorderRadius} />
        <FrameSlider label="Border width" sizes={[1, 2, 4, 8]} value={borderWidth} onChange={setBorderWidth} />
        <Slider
          label="Duration"
          variant="subtle"
          value={duration}
          onChange={setDuration}
          detents={[
            { value: 2000, label: '2 sec' },
            { value: 5000, label: '5 sec' },
            { value: 15000, label: '15 sec' },
            { value: 30000, label: '30 sec' },
          ]}
          formatValue={value => `${value / 1000} seconds`}
        />
        <Paragraph size="sm" color="muted">
          The border tracks progress clockwise from the top. The image reveals after the border completes, then the border disappears.
        </Paragraph>
        <Stack gap={8}>
          <Button icon="replay" onClick={replay} fullWidth>Replay animation</Button>
          <Button
            variant="secondary"
            icon={paused ? 'play_arrow' : 'pause'}
            onClick={() => setPaused(!paused)}
            disabled={['loading', 'complete', 'error'].includes(phase)}
            fullWidth
          >{paused ? 'Resume' : 'Pause'}</Button>
        </Stack>
      </Stack>
    </Inset>
  )
}
