import React, { useEffect, useRef, useState } from 'react'
import {
  Button, ChoiceGroup, ContextMenu, InlineEditable, Inset, Menu, MenuSection, Section, SelectField, Stack,
  Switch, TextField, Toolbar, ToolbarButton, ToolbarDivider, ToolbarGroup,
  ToolbarMenu, ToolbarToggle,
} from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import './button-configurator-menu.css'

const variants = ['primary', 'secondary', 'tertiary', 'destructive', 'success']
const variantIcons = {
  primary: 'star',
  secondary: 'star_half',
  tertiary: 'star_outline',
  destructive: 'delete',
  success: 'check_circle',
}
const sizes = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Default' },
  { value: 'lg', label: 'Large' },
]
const icons = ['', 'check', 'save', 'download', 'arrow_forward', 'add']
const toolbarItems = (values, labels = {}) => values.map(value => {
  const fallback = value ? value.replaceAll('_', ' ') : 'None'
  return { value, label: labels[value] ?? (fallback[0].toUpperCase() + fallback.slice(1)) }
})
const defaults = {
  label: 'Save changes', variant: 'primary', size: 'md', icon: 'save',
  iconPosition: 'start', href: '', fullWidth: false, loading: false, disabled: false,
}

export function ButtonConfiguratorMenuExperiment({ experiment, onOpenSettings }) {
  const [config, setConfig] = useState(defaults)
  const [open, setOpen] = useState(false)
  const [presentation, setPresentation] = useState('menu')
  const [inlineLabel, setInlineLabel] = useState(false)
  const [contextMenu, setContextMenu] = useState(null)
  const [contextSubmenu, setContextSubmenu] = useState(null)
  const [menuAnchor, setMenuAnchor] = useState(null)
  const menuAnchorRef = useRef(null)
  const toolbarRootRef = useRef(null)
  const update = patch => setConfig(current => ({ ...current, ...patch }))
  const contextPresentation = presentation.startsWith('context')
  const consolidatedContext = presentation === 'context-consolidated'
  const usesInlineLabel = inlineLabel || contextPresentation
  const sizeIndex = sizes.findIndex(item => item.value === config.size)
  const stepSize = direction => update({ size: sizes[Math.max(0, Math.min(sizes.length - 1, sizeIndex + direction))].value })

  function openConfigurator(event) {
    event.preventDefault()
    if (contextPresentation) return
    if (presentation === 'menu') {
      const rect = event.currentTarget.getBoundingClientRect()
      const menuWidth = 320
      const x = rect.right + 8 + menuWidth <= window.innerWidth ? rect.right + 8 : rect.left - menuWidth - 8
      setMenuAnchor({ x, y: rect.top - 8 })
    }
    setOpen(true)
  }

  function openContextConfigurator(event) {
    if (!contextPresentation) return
    event.preventDefault()
    setContextSubmenu(null)
    setContextMenu({ x: event.clientX, y: event.clientY })
  }

  function adjacentPosition(item) {
    const rect = item.getBoundingClientRect()
    const submenuWidth = 240
    const gap = 4
    const x = rect.right + gap + submenuWidth <= window.innerWidth - 16
      ? rect.right + gap
      : rect.left - submenuWidth - gap
    return { x, y: rect.top - 4 }
  }
  function openContextSubmenu(kind, item) {
    setContextSubmenu({ kind, ...adjacentPosition(item) })
  }
  const contextItems = [
    { type: 'group', id: 'appearance', label: 'Appearance' },
    { id: 'variant', label: 'Variant', icon: 'palette', shortcut: '›', keepOpen: true, onHover: item => openContextSubmenu('variant', item), onClick: item => openContextSubmenu('variant', item) },
    ...(consolidatedContext ? [{
      type: 'custom', id: 'size-controls', label: 'Size', children: (
        <Toolbar aria-label="Size">
          <ToolbarGroup
            aria-label="Size"
            value={config.size}
            onChange={size => update({ size })}
            options={[
              { value: 'sm', label: 'Small', icon: 'text_decrease' },
              { value: 'md', label: 'Default', icon: 'text_fields' },
              { value: 'lg', label: 'Large', icon: 'text_increase' },
            ]}
          />
        </Toolbar>
      ),
    }] : [{ id: 'size', label: 'Size', icon: 'format_size', shortcut: '›', keepOpen: true, onHover: item => openContextSubmenu('size', item), onClick: item => openContextSubmenu('size', item) }]),
    { id: 'icon', label: 'Icon', icon: config.icon || 'block', shortcut: '›', keepOpen: true, onHover: item => openContextSubmenu('icon', item), onClick: item => openContextSubmenu('icon', item) },
    ...(consolidatedContext ? [{
      type: 'custom', id: 'icon-position-controls', label: 'Icon position', children: (
        <Toolbar aria-label="Icon position">
          <ToolbarGroup
            aria-label="Icon position"
            disabled={!config.icon}
            value={config.iconPosition}
            onChange={iconPosition => update({ iconPosition })}
            options={[{ value: 'start', label: 'Start', icon: 'align_horizontal_left' }, { value: 'end', label: 'End', icon: 'align_horizontal_right' }]}
          />
        </Toolbar>
      ),
    }] : [{ id: 'icon-position', label: 'Icon position', icon: 'swap_horiz', shortcut: '›', keepOpen: true, disabled: !config.icon, onHover: item => openContextSubmenu('icon-position', item), onClick: item => openContextSubmenu('icon-position', item) }]),
    { type: 'divider', id: 'state-divider' },
    { type: 'group', id: 'state', label: 'State' },
    { id: 'full-width', label: 'Full width', icon: 'width_full', shortcut: config.fullWidth ? 'On' : 'Off', keepOpen: true, onClick: () => update({ fullWidth: !config.fullWidth }) },
    { id: 'loading', label: 'Loading', icon: 'progress_activity', shortcut: config.loading ? 'On' : 'Off', keepOpen: true, onClick: () => update({ loading: !config.loading }) },
    { id: 'disabled', label: 'Disabled', icon: 'block', shortcut: config.disabled ? 'On' : 'Off', keepOpen: true, onClick: () => update({ disabled: !config.disabled }) },
  ]

  const contextSubmenuItems = {
    variant: variants.map(value => ({ id: value, label: value[0].toUpperCase() + value.slice(1), active: config.variant === value, onClick: () => update({ variant: value }) })),
    size: sizes.map(item => ({ id: item.value, label: item.label, active: config.size === item.value, onClick: () => update({ size: item.value }) })),
    icon: icons.map(value => ({ id: value || 'none', label: value ? value.replaceAll('_', ' ') : 'None', icon: value || 'block', active: config.icon === value, onClick: () => update({ icon: value }) })),
    'icon-position': [{ id: 'start', label: 'Start', active: config.iconPosition === 'start', onClick: () => update({ iconPosition: 'start' }) }, { id: 'end', label: 'End', active: config.iconPosition === 'end', onClick: () => update({ iconPosition: 'end' }) }],
  }[contextSubmenu?.kind] ?? []

  useEffect(() => {
    if (!open || !presentation.startsWith('toolbar')) return undefined
    function dismiss(event) {
      if (event.target.closest?.('.a1-menu')) return
      if (!toolbarRootRef.current?.contains(event.target)) setOpen(false)
    }
    function escape(event) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', dismiss)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('mousedown', dismiss)
      document.removeEventListener('keydown', escape)
    }
  }, [open, presentation])

  useEffect(() => {
    if (!open || presentation !== 'menu') return
    const trigger = toolbarRootRef.current?.querySelector('[data-configurator-trigger="true"]')
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    const menuWidth = 320
    const x = rect.right + 8 + menuWidth <= window.innerWidth ? rect.right + 8 : rect.left - menuWidth - 8
    setMenuAnchor({ x, y: rect.top - 8 })
    requestAnimationFrame(() => window.dispatchEvent(new Event('resize')))
  }, [config, open, presentation])

  const configuration = (
    <Inset space={16}>
      <Stack gap="lg">
        <ChoiceGroup
          label="Configurator presentation"
          columns={1}
          size="compact"
          value={presentation}
          onChange={value => { setOpen(false); setContextMenu(null); setContextSubmenu(null); setPresentation(value) }}
          options={[
            { value: 'menu', label: 'Menu', secondaryLabel: 'Full configuration form' },
            { value: 'toolbar', label: 'Toolbar', secondaryLabel: 'Compact editing controls' },
            { value: 'toolbar-extended', label: 'Extended toolbar', secondaryLabel: 'Direct variant and size controls' },
            { value: 'context', label: 'Context menu', secondaryLabel: 'Right-click editing actions' },
            { value: 'context-consolidated', label: 'Consolidated context menu', secondaryLabel: 'Inline size and position controls' },
          ]}
        />
        <Switch
          label="Edit label inline"
          checked={usesInlineLabel}
          disabled={contextPresentation}
          onChange={value => { setInlineLabel(value); setOpen(false); setContextMenu(null); setContextSubmenu(null) }}
        />
      </Stack>
    </Inset>
  )

  return (
    <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
      <Section padding={{ xs: 'lg', md: 'xl' }} contentWidth="sm">
        <Stack ref={toolbarRootRef} align="center" gap="lg" className="a1-button-configurator-menu">
          <span
            className={`a1-button-configurator-menu__trigger${config.fullWidth ? ' a1-button-configurator-menu__trigger--full-width' : ''}`}
            data-context-trigger="true"
            onContextMenu={openContextConfigurator}
          >
            <Button
              as={contextPresentation ? 'span' : config.href ? 'a' : 'button'}
              role={contextPresentation ? 'button' : undefined}
              href={config.href || undefined}
              variant={config.variant}
              size={config.size}
              icon={config.icon || undefined}
              iconPosition={config.iconPosition}
              fullWidth={config.fullWidth}
              loading={config.loading}
              disabled={config.disabled}
              aria-haspopup={contextPresentation ? 'menu' : presentation === 'menu' ? 'dialog' : undefined}
              aria-expanded={contextPresentation ? !!contextMenu : open}
              data-configurator-trigger="true"
              onClick={openConfigurator}
              onDoubleClick={usesInlineLabel ? () => { setOpen(false); setContextMenu(null) } : undefined}
            >
              {usesInlineLabel ? (
                <InlineEditable
                  seamless
                  editOnDoubleClick
                  value={config.label}
                  onChange={label => update({ label })}
                  aria-label="Edit button label"
                />
              ) : (config.label || 'Button')}
            </Button>
          </span>

          {presentation === 'toolbar' && open && (
            <div className="a1-button-configurator-menu__toolbar">
              <Toolbar aria-label="Button configuration" overlay overflow>
                <ToolbarMenu icon="palette" label="Variant" value={config.variant} onChange={variant => update({ variant })} items={toolbarItems(variants)} />
                <ToolbarMenu icon="format_size" label="Size" value={config.size} onChange={size => update({ size })} items={sizes} />
                <ToolbarMenu icon={config.icon || 'block'} label="Icon" value={config.icon} onChange={icon => update({ icon })} items={toolbarItems(icons)} />
                <ToolbarGroup aria-label="Icon position" value={config.iconPosition} onChange={iconPosition => update({ iconPosition })}
                  disabled={!config.icon} options={[{ value: 'start', label: 'Start', icon: 'align_horizontal_left' }, { value: 'end', label: 'End', icon: 'align_horizontal_right' }]} />
                <ToolbarDivider />
                <ToolbarToggle icon="width_full" label="Full width" pressed={config.fullWidth} onChange={fullWidth => update({ fullWidth })} />
                <ToolbarToggle icon="progress_activity" label="Loading" pressed={config.loading} onChange={loading => update({ loading })} />
                <ToolbarToggle icon="block" label="Disabled" pressed={config.disabled} onChange={disabled => update({ disabled })} />
                {!inlineLabel && <ToolbarDivider />}
                {!inlineLabel && <TextField aria-label="Label" size="compact" className="a1-button-configurator-menu__label" value={config.label} onChange={event => update({ label: event.target.value })} />}
              </Toolbar>
            </div>
          )}

          {presentation === 'toolbar-extended' && open && (
            <div className="a1-button-configurator-menu__toolbar a1-button-configurator-menu__toolbar--extended">
              <Toolbar aria-label="Extended button configuration" overlay overflow>
                {!inlineLabel && <TextField aria-label="Label" size="compact" className="a1-button-configurator-menu__label" value={config.label} onChange={event => update({ label: event.target.value })} />}
                <ToolbarGroup
                  aria-label="Variant"
                  value={config.variant}
                  onChange={variant => update({ variant })}
                  options={variants.map(value => ({ value, label: value[0].toUpperCase() + value.slice(1), icon: variantIcons[value] }))}
                />
                <ToolbarDivider />
                <ToolbarButton icon="remove" label="Decrease size" disabled={sizeIndex === 0} onClick={() => stepSize(-1)} />
                <ToolbarButton icon="add" label="Increase size" disabled={sizeIndex === sizes.length - 1} onClick={() => stepSize(1)} />
                <ToolbarDivider />
                <ToolbarMenu icon={config.icon || 'block'} label="Icon" value={config.icon} onChange={icon => update({ icon })} items={toolbarItems(icons)} />
                <ToolbarGroup aria-label="Icon position" value={config.iconPosition} onChange={iconPosition => update({ iconPosition })}
                  disabled={!config.icon} options={[{ value: 'start', label: 'Start', icon: 'align_horizontal_left' }, { value: 'end', label: 'End', icon: 'align_horizontal_right' }]} />
                <ToolbarDivider />
                <ToolbarToggle icon="width_full" label="Full width" pressed={config.fullWidth} onChange={fullWidth => update({ fullWidth })} />
                <ToolbarToggle icon="progress_activity" label="Loading" pressed={config.loading} onChange={loading => update({ loading })} />
                <ToolbarToggle icon="block" label="Disabled" pressed={config.disabled} onChange={disabled => update({ disabled })} />
              </Toolbar>
            </div>
          )}

          {open && presentation === 'menu' && menuAnchor && (
            <span
              ref={menuAnchorRef}
              className="a1-button-configurator-menu__flyout-anchor"
              style={{ left: menuAnchor.x, top: menuAnchor.y }}
              aria-hidden="true"
            />
          )}
          <Menu open={open && presentation === 'menu'} onClose={() => setOpen(false)} anchorRef={menuAnchorRef} aria-label="Configure button" padding={16}>
            <MenuSection label="Content">
              <Stack gap="md">
                {!inlineLabel && <TextField label="Label" size="compact" value={config.label} onChange={event => update({ label: event.target.value })} />}
                <TextField label="Link destination" size="compact" value={config.href} placeholder="https://example.com" onChange={event => update({ href: event.target.value })} />
              </Stack>
            </MenuSection>
            <MenuSection label="Appearance">
              <Stack gap="md">
                <Toolbar label="Variant">
                  <ToolbarGroup
                    aria-label="Variant"
                    value={config.variant}
                    onChange={variant => update({ variant })}
                    labelMode="selected"
                    options={variants.map(value => ({
                      value,
                      label: value[0].toUpperCase() + value.slice(1),
                      icon: variantIcons[value],
                    }))}
                  />
                </Toolbar>
                <Toolbar label="Size">
                  <ToolbarGroup aria-label="Size" showLabels value={config.size} onChange={size => update({ size })} options={sizes} />
                </Toolbar>
                <SelectField label="Icon" size="compact" value={config.icon} onChange={event => update({ icon: event.target.value })}>
                  {icons.map(value => <option key={value || 'none'} value={value}>{value ? value.replaceAll('_', ' ') : 'None'}</option>)}
                </SelectField>
                {config.icon && (
                  <Toolbar label="Icon position">
                    <ToolbarGroup
                      aria-label="Icon position"
                      showLabels
                      options={[{ value: 'start', label: 'Start', icon: 'align_horizontal_left' }, { value: 'end', label: 'End', icon: 'align_horizontal_right' }]}
                      value={config.iconPosition}
                      onChange={iconPosition => update({ iconPosition })}
                    />
                  </Toolbar>
                )}
              </Stack>
            </MenuSection>
            <MenuSection label="State">
              <Toolbar aria-label="State">
                <ToolbarToggle icon="width_full" label="Full width" pressed={config.fullWidth} onChange={fullWidth => update({ fullWidth })} />
                <ToolbarToggle icon="progress_activity" label="Loading" pressed={config.loading} onChange={loading => update({ loading })} />
                <ToolbarToggle icon="block" label="Disabled" pressed={config.disabled} onChange={disabled => update({ disabled })} />
              </Toolbar>
            </MenuSection>
          </Menu>
          <ContextMenu
            open={!!contextMenu}
            x={contextMenu?.x ?? 0}
            y={contextMenu?.y ?? 0}
            items={contextItems}
            onClose={() => setContextMenu(null)}
            keepOpenForSubmenus
            aria-label="Configure button"
          />
          <ContextMenu
            open={!!contextSubmenu}
            x={contextSubmenu?.x ?? 0}
            y={contextSubmenu?.y ?? 0}
            items={contextSubmenuItems}
            onClose={() => setContextSubmenu(null)}
            aria-label={contextSubmenu?.kind ? `Button ${contextSubmenu.kind}` : 'Button property values'}
          />
        </Stack>
      </Section>
    </ExperimentLayout>
  )
}
