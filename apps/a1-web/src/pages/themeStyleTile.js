/**
 * The page definition rendered as the Theme editor's "Preview" style tile — a
 * compact showcase of headings, surfaces, an inverse section, buttons, tabs, and
 * a form, so the whole design language is visible from one preview. Rendered via
 * the editor's RenderPageDefinition inside a wrapper that carries the theme vars.
 */
export const STYLE_TILE_DEFINITION = {
  schemaVersion: '1.0',
  page: {
    id: 'pattern-1781830506003-0',
    name: 'New pattern',
    description: '',
    layout: {
      type: 'PageLayout',
      regions: [
        {
          id: 'pattern',
          nodes: [
            {
              id: 'intro',
              type: 'Section',
              props: {
                as: 'section',
                padding: 'xs',
                surface: 'page',
                gap: 'xs',
                contentWidth: 'lg',
                align: 'center',
                borderStyle: 'solid',
                borderVariant: 'subtle',
                radius: 'none',
              },
              children: [
                {
                  id: 'intro-eyebrow',
                  type: 'Paragraph',
                  props: { size: 'sm', color: 'muted' },
                  content: { fallback: 'Style tile' },
                },
                {
                  id: 'intro-title',
                  type: 'Heading',
                  props: {
                    as: 'h1',
                    type: 'display',
                    size: { xs: 'lg', md: 'xxl' },
                    color: 'default',
                    align: 'left',
                  },
                  content: { fallback: 'Design language overview' },
                },
                {
                  id: 'intro-body',
                  type: 'Paragraph',
                  props: { size: 'lg', color: 'muted' },
                  content: {
                    fallback: 'A showcase of headings, surfaces, buttons, tabs, and forms across the A1 system.',
                  },
                },
              ],
            },
            {
              id: 'surfaces',
              type: 'Section',
              props: {
                as: 'section',
                padding: 'sm',
                surface: 'panel',
                gap: 'xs',
                contentWidth: 'md',
                borderStyle: 'solid',
                borderVariant: 'subtle',
                radius: 'none',
              },
              children: [
                {
                  id: 'surfaces-title',
                  type: 'Heading',
                  props: { as: 'h2', type: 'display', size: 'lg' },
                  content: { fallback: 'Surfaces' },
                },
                {
                  id: 'surfaces-body',
                  type: 'Paragraph',
                  props: { color: 'muted' },
                  content: { fallback: 'Cards and panels establish hierarchy through layered surfaces.' },
                },
                {
                  id: 'surfaces-grid',
                  type: 'Grid',
                  props: { columns: { xs: 1, md: 2, lg: 3 }, gap: 'md' },
                  children: [
                    {
                      id: 'card-1',
                      type: 'Card',
                      props: { as: 'div', variant: 'default', icon: 'palette', iconDisplay: 'hero', heroColor: 'info' },
                      children: [
                        { id: 'card-1-h', type: 'Heading', props: { as: 'h3', size: 'sm' }, content: { fallback: 'Color' } },
                        { id: 'card-1-p', type: 'Paragraph', props: { size: 'sm', color: 'muted' }, content: { fallback: 'Token-based palettes.' } },
                      ],
                    },
                    {
                      id: 'card-2',
                      type: 'Card',
                      props: { as: 'div', variant: 'default', icon: 'format_size', iconDisplay: 'hero', heroColor: 'action' },
                      children: [
                        { id: 'card-2-h', type: 'Heading', props: { as: 'h3', size: 'sm' }, content: { fallback: 'Typography' } },
                        { id: 'card-2-p', type: 'Paragraph', props: { size: 'sm', color: 'muted' }, content: { fallback: 'Consistent type scale.' } },
                      ],
                    },
                    {
                      id: 'card-3',
                      type: 'Card',
                      props: { as: 'div', variant: 'default', icon: 'grid_view', iconDisplay: 'hero', heroColor: 'neutral' },
                      children: [
                        { id: 'card-3-h', type: 'Heading', props: { as: 'h3', size: 'sm' }, content: { fallback: 'Layout' } },
                        { id: 'card-3-p', type: 'Paragraph', props: { size: 'sm', color: 'muted' }, content: { fallback: 'Sections and grids.' } },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: 'inverse',
              type: 'Section',
              props: {
                as: 'section',
                padding: 'sm',
                surface: 'page',
                gap: 'md',
                contentWidth: 'lg',
                align: 'center',
                borderStyle: 'solid',
                borderVariant: 'subtle',
                radius: 'none',
                inverse: true,
              },
              children: [
                {
                  id: 'inverse-title',
                  type: 'Heading',
                  props: { as: 'h2', type: 'display', size: 'lg', color: 'inverse' },
                  content: { fallback: 'Inverse section' },
                },
                {
                  id: 'inverse-body',
                  type: 'Blockquote',
                  props: { variant: 'feature', cite: '- Block quote' },
                  content: { fallback: 'High-contrast areas draw attention to key moments.' },
                },
                {
                  id: 'inverse-actions',
                  type: 'ButtonContainer',
                  props: { align: 'center' },
                  children: [
                    { id: 'btn-primary', type: 'Button', props: { variant: 'primary', icon: 'rocket_launch' }, content: { fallback: 'Get started' } },
                    { id: 'btn-secondary', type: 'Button', props: { variant: 'secondary' }, content: { fallback: 'Learn more' } },
                    { id: 'btn-tertiary', type: 'Button', props: { variant: 'tertiary' }, content: { fallback: 'View docs' } },
                  ],
                },
              ],
            },
            {
              id: 'buttons',
              type: 'Section',
              props: {
                as: 'section',
                padding: 'sm',
                surface: 'page',
                gap: 'md',
                contentWidth: 'lg',
                borderStyle: 'solid',
                borderVariant: 'subtle',
                radius: 'none',
              },
              children: [
                {
                  id: 'buttons-title',
                  type: 'Heading',
                  props: { as: 'h2', size: 'md' },
                  content: { fallback: 'Buttons' },
                },
                {
                  id: 'buttons-row',
                  type: 'ButtonContainer',
                  props: { align: 'start' },
                  children: [
                    { id: 'b-primary', type: 'Button', props: { variant: 'primary' }, content: { fallback: 'Primary' } },
                    { id: 'b-secondary', type: 'Button', props: { variant: 'secondary' }, content: { fallback: 'Secondary' } },
                    { id: 'b-tertiary', type: 'Button', props: { variant: 'tertiary' }, content: { fallback: 'Tertiary' } },
                    { id: 'b-success', type: 'Button', props: { variant: 'success', icon: 'check_circle' }, content: { fallback: 'Success' } },
                    { id: 'b-destructive', type: 'Button', props: { variant: 'destructive', icon: 'delete' }, content: { fallback: 'Delete' } },
                  ],
                },
              ],
            },
            {
              id: 'tabs-section',
              type: 'Section',
              props: {
                as: 'section',
                padding: 'sm',
                surface: 'panel',
                gap: 'md',
                contentWidth: 'lg',
                borderStyle: 'solid',
                borderVariant: 'subtle',
                radius: 'none',
              },
              children: [
                {
                  id: 'tabs-title',
                  type: 'Heading',
                  props: { as: 'h2', size: 'md' },
                  content: { fallback: 'Tabs' },
                },
                {
                  id: 'style-tabs',
                  type: 'Tabs',
                  props: {
                    variant: 'line',
                    value: 'overview',
                    items: [
                      { value: 'overview', label: 'Overview' },
                      { value: 'details', label: 'Details' },
                      { value: 'settings', label: 'Settings' },
                    ],
                  },
                },
              ],
            },
            {
              id: 'form-section',
              type: 'Section',
              props: {
                as: 'section',
                padding: 'sm',
                surface: 'page',
                gap: 'md',
                contentWidth: 'md',
                borderStyle: 'solid',
                borderVariant: 'subtle',
                radius: 'none',
              },
              children: [
                {
                  id: 'form-title',
                  type: 'Heading',
                  props: { as: 'h2', size: 'md' },
                  content: { fallback: 'Form' },
                },
                {
                  id: 'form-fieldset',
                  type: 'Fieldset',
                  props: { legend: 'Contact details' },
                  children: [
                    { id: 'field-name', type: 'TextField', props: { label: 'Full name', type: 'text', required: true } },
                    {
                      id: 'field-email',
                      type: 'TextField',
                      props: { label: 'Email', type: 'email', error: 'Error message', size: 'default', labelPosition: 'above', required: true },
                    },
                    {
                      id: 'field-topic',
                      type: 'SelectField',
                      props: {
                        label: 'Topic',
                        options: [
                          { value: 'general', label: 'General' },
                          { value: 'support', label: 'Support' },
                          { value: 'sales', label: 'Sales' },
                        ],
                      },
                    },
                    { id: 'field-message', type: 'TextareaField', props: { label: 'Message', rows: 4 } },
                  ],
                },
                {
                  id: 'form-actions',
                  type: 'ButtonContainer',
                  props: { align: 'start' },
                  children: [
                    { id: 'form-submit', type: 'Button', props: { variant: 'primary', icon: 'send' }, content: { fallback: 'Submit' } },
                    { id: 'form-cancel', type: 'Button', props: { variant: 'tertiary' }, content: { fallback: 'Cancel' } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
}
