/**
 * Component showcase — one example of every registered A1 component.
 *
 * Organized into sections matching the editor catalog categories:
 * Typography · Layout · Actions · Feedback · Inputs · Data · Disclosure
 */
import type { PageDefinition } from '../pageTypes';

export const editorExamplePage: PageDefinition = {
  schemaVersion: '0.1.0',
  page: {
    id: 'component-showcase',
    name: 'Component showcase',
    description: 'One example of every registered A1 component, organized by category.',
    layout: {
      type: 'PageLayout',
      props: {},
      regions: [
        {
          id: 'main',
          name: 'Main',
          nodes: [

            // ── Hero ──────────────────────────────────────────────────────
            {
              id: 'hero',
              type: 'Section',
              props: { padding: 'lg', surface: 'panel', gradient: 'accent', gradientPosition: 'top-right', contentWidth: 'lg', gap: 'sm' },
              children: [
                { id: 'hero-h1', type: 'Heading', props: { as: 'h1', size: 'xl' }, content: { fallback: 'A1 component showcase' } },
                { id: 'hero-p', type: 'Paragraph', props: { size: 'lg', color: 'muted' }, content: { fallback: 'One example of every registered A1 component. Click any element to configure it.' } },
              ],
            },

            // ── Typography ────────────────────────────────────────────────
            {
              id: 'typography-section',
              type: 'Section',
              props: { padding: 'lg', contentWidth: 'lg', gap: 'md' },
              children: [
                { id: 'typo-heading', type: 'Heading', props: { as: 'h2', size: 'lg' }, content: { fallback: 'Typography' } },
                { id: 'typo-divider', type: 'Divider', props: { space: 'md' } },
                { id: 'typo-stack', type: 'Stack', props: { gap: 'md', direction: 'column' }, children: [
                  { id: 'typo-h-xl', type: 'Heading', props: { as: 'h1', size: 'xl' }, content: { fallback: 'Heading xl' } },
                  { id: 'typo-h-lg', type: 'Heading', props: { as: 'h2', size: 'lg' }, content: { fallback: 'Heading lg' } },
                  { id: 'typo-h-md', type: 'Heading', props: { as: 'h3', size: 'md' }, content: { fallback: 'Heading md' } },
                  { id: 'typo-h-sm', type: 'Heading', props: { as: 'h4', size: 'sm' }, content: { fallback: 'Heading sm' } },
                  { id: 'typo-para', type: 'Paragraph', props: {}, content: { fallback: 'Paragraph — body text that flows naturally across lines and adapts to the reading context. Use size, color, and align props to fine-tune.' } },
                  { id: 'typo-blockquote', type: 'Blockquote', props: { variant: 'border' }, content: { fallback: 'A thoughtful pull quote that emphasizes an important idea in the surrounding content.' } },
                  { id: 'typo-code', type: 'Code', props: { variant: 'block', wrapping: true, copyCode: true }, content: { fallback: 'const greeting = "Hello from A1!";' } },
                  {
                    id: 'typo-list',
                    type: 'List',
                    props: { as: 'ul', variant: 'unordered', size: 'md' },
                    children: [
                      { id: 'li-1', type: 'ListItem', content: { fallback: 'First list item' } },
                      { id: 'li-2', type: 'ListItem', content: { fallback: 'Second list item' } },
                      { id: 'li-3', type: 'ListItem', content: { fallback: 'Third list item' } },
                    ],
                  },
                  {
                    id: 'typo-icon-row',
                    type: 'Stack',
                    props: { direction: 'row', gap: 'md', align: 'center' },
                    children: [
                      { id: 'icon-xs', type: 'Icon', props: { name: 'star', size: 'xs', color: 'accent' } },
                      { id: 'icon-sm', type: 'Icon', props: { name: 'star', size: 'sm', color: 'accent' } },
                      { id: 'icon-md', type: 'Icon', props: { name: 'star', size: 'md', color: 'accent' } },
                      { id: 'icon-lg', type: 'Icon', props: { name: 'star', size: 'lg', color: 'accent' } },
                      { id: 'icon-xl', type: 'Icon', props: { name: 'star', size: 'xl', color: 'accent' } },
                      { id: 'icon-jumbo', type: 'Icon', props: { name: 'star', size: 'jumbo', color: 'accent' } },
                    ],
                  },
                  {
                    id: 'typo-figure',
                    type: 'Figure',
                    props: {
                      src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop',
                      alt: 'Mountain lake landscape',
                      caption: 'Photo by Samantha Gades on Unsplash',
                      radius: 'md',
                    },
                  },
                ]},
              ],
            },

            // ── Layout ────────────────────────────────────────────────────
            {
              id: 'layout-section',
              type: 'Section',
              props: { padding: 'lg', surface: 'panel', contentWidth: 'lg', gap: 'md' },
              children: [
                { id: 'layout-heading', type: 'Heading', props: { as: 'h2', size: 'lg' }, content: { fallback: 'Layout' } },
                { id: 'layout-divider', type: 'Divider', props: { space: 'md' } },
                {
                  id: 'layout-grid',
                  type: 'Grid',
                  props: { columns: 3, gap: 'md' },
                  children: [
                    {
                      id: 'lcard-1', type: 'Card', props: { icon: 'crop_free' }, children: [
                        { id: 'lcard-1-h', type: 'Heading', props: { as: 'h3', size: 'sm' }, content: { fallback: 'Section' } },
                        { id: 'lcard-1-p', type: 'Paragraph', props: { size: 'sm', color: 'muted' }, content: { fallback: 'Full-width page region with padding, surface, and gradient.' } },
                      ],
                    },
                    {
                      id: 'lcard-2', type: 'Card', props: { icon: 'view_agenda' }, children: [
                        { id: 'lcard-2-h', type: 'Heading', props: { as: 'h3', size: 'sm' }, content: { fallback: 'Stack' } },
                        { id: 'lcard-2-p', type: 'Paragraph', props: { size: 'sm', color: 'muted' }, content: { fallback: 'Vertical or horizontal layout with configurable gap.' } },
                      ],
                    },
                    {
                      id: 'lcard-3', type: 'Card', props: { icon: 'grid_view' }, children: [
                        { id: 'lcard-3-h', type: 'Heading', props: { as: 'h3', size: 'sm' }, content: { fallback: 'Grid' } },
                        { id: 'lcard-3-p', type: 'Paragraph', props: { size: 'sm', color: 'muted' }, content: { fallback: 'Multi-column responsive grid with configurable columns and gap.' } },
                      ],
                    },
                    {
                      id: 'lcard-4', type: 'Card', props: { icon: 'article' }, children: [
                        { id: 'lcard-4-h', type: 'Heading', props: { as: 'h3', size: 'sm' }, content: { fallback: 'Card' } },
                        { id: 'lcard-4-p', type: 'Paragraph', props: { size: 'sm', color: 'muted' }, content: { fallback: 'Bounded content container with optional icon or hero area.' } },
                      ],
                    },
                    {
                      id: 'lcard-5', type: 'Card', props: { icon: 'padding' }, children: [
                        { id: 'lcard-5-h', type: 'Heading', props: { as: 'h3', size: 'sm' }, content: { fallback: 'Inset' } },
                        { id: 'lcard-5-p', type: 'Paragraph', props: { size: 'sm', color: 'muted' }, content: { fallback: 'Uniform padding wrapper for any content block.' } },
                      ],
                    },
                    {
                      id: 'lcard-6', type: 'Card', props: { icon: 'view_week' }, children: [
                        { id: 'lcard-6-h', type: 'Heading', props: { as: 'h3', size: 'sm' }, content: { fallback: 'ButtonContainer' } },
                        { id: 'lcard-6-p', type: 'Paragraph', props: { size: 'sm', color: 'muted' }, content: { fallback: 'Responsive row of action buttons with fill and alignment.' } },
                      ],
                    },
                  ],
                },
                {
                  id: 'layout-inset-example',
                  type: 'Inset',
                  props: { space: 24 },
                  children: [
                    { id: 'layout-inset-p', type: 'Paragraph', props: { color: 'muted' }, content: { fallback: 'This content is wrapped in an Inset (24px) — it adds internal padding without a visible background.' } },
                  ],
                },
                { id: 'layout-spacer-label', type: 'Paragraph', props: { size: 'sm', color: 'muted' }, content: { fallback: 'Spacer (xl) below:' } },
                { id: 'layout-spacer', type: 'Spacer', props: { size: 'xl' } },
                {
                  id: 'layout-btn-container',
                  type: 'ButtonContainer',
                  props: { align: 'end' },
                  children: [
                    { id: 'layout-btn-cancel', type: 'Button', props: { variant: 'secondary' }, content: { fallback: 'Cancel' } },
                    { id: 'layout-btn-save', type: 'Button', props: { variant: 'primary' }, content: { fallback: 'Save changes' } },
                  ],
                },
              ],
            },

            // ── Actions ───────────────────────────────────────────────────
            {
              id: 'actions-section',
              type: 'Section',
              props: { padding: 'lg', contentWidth: 'lg', gap: 'md' },
              children: [
                { id: 'actions-heading', type: 'Heading', props: { as: 'h2', size: 'lg' }, content: { fallback: 'Actions' } },
                { id: 'actions-divider', type: 'Divider', props: { space: 'md' } },
                { id: 'actions-stack', type: 'Stack', props: { gap: 'lg', direction: 'column' }, children: [
                  {
                    id: 'btn-row',
                    type: 'Stack',
                    props: { direction: 'row', gap: 'sm', wrap: true, align: 'center' },
                    children: [
                      { id: 'btn-primary', type: 'Button', props: { variant: 'primary', icon: 'add', iconPosition: 'start' }, content: { fallback: 'Primary' } },
                      { id: 'btn-secondary', type: 'Button', props: { variant: 'secondary' }, content: { fallback: 'Secondary' } },
                      { id: 'btn-tertiary', type: 'Button', props: { variant: 'tertiary', icon: 'download', iconPosition: 'start' }, content: { fallback: 'Download report' } },
                      { id: 'btn-danger', type: 'Button', props: { variant: 'danger' }, content: { fallback: 'Delete' } },
                    ],
                  },
                  {
                    id: 'iconbtn-row',
                    type: 'Stack',
                    props: { direction: 'row', gap: 'sm', align: 'center' },
                    children: [
                      { id: 'iconbtn-edit', type: 'IconButton', props: { icon: 'edit', label: 'Edit', variant: 'tertiary' } },
                      { id: 'iconbtn-delete', type: 'IconButton', props: { icon: 'delete', label: 'Delete', variant: 'tertiary' } },
                      { id: 'iconbtn-share', type: 'IconButton', props: { icon: 'share', label: 'Share', variant: 'secondary' } },
                      { id: 'iconbtn-settings', type: 'IconButton', props: { icon: 'settings', label: 'Settings', variant: 'primary' } },
                    ],
                  },
                  { id: 'link-example', type: 'Link', props: { href: '#', icon: 'arrow_forward', iconPosition: 'end' }, content: { fallback: 'Navigation link' } },
                  { id: 'switch-example', type: 'Switch', props: { label: 'Enable notifications', size: 'default' } },
                  { id: 'segmented-example', type: 'SegmentedControl', props: { size: 'md', options: [
                    { value: 'day', label: 'Day' },
                    { value: 'week', label: 'Week' },
                    { value: 'month', label: 'Month' },
                  ]}},
                ]},
              ],
            },

            // ── Feedback ──────────────────────────────────────────────────
            {
              id: 'feedback-section',
              type: 'Section',
              props: { padding: 'lg', surface: 'panel', contentWidth: 'lg', gap: 'md' },
              children: [
                { id: 'feedback-heading', type: 'Heading', props: { as: 'h2', size: 'lg' }, content: { fallback: 'Feedback' } },
                { id: 'feedback-divider', type: 'Divider', props: { space: 'md' } },
                { id: 'feedback-stack', type: 'Stack', props: { gap: 'lg', direction: 'column' }, children: [
                  { id: 'banner-example', type: 'Banner', props: { status: 'info', title: 'Heads up', variant: 'inline' }, content: { fallback: 'This is an informational banner message displayed inline on the page.' } },
                  {
                    id: 'badge-row',
                    type: 'Stack',
                    props: { direction: 'row', gap: 'sm', wrap: true, align: 'center' },
                    children: [
                      { id: 'badge-neutral', type: 'MessageBadge', props: { status: 'neutral', size: 'md' }, content: { fallback: 'Neutral' } },
                      { id: 'badge-info', type: 'MessageBadge', props: { status: 'info', size: 'md' }, content: { fallback: 'Info' } },
                      { id: 'badge-success', type: 'MessageBadge', props: { status: 'success', size: 'md' }, content: { fallback: 'Success' } },
                      { id: 'badge-warn', type: 'MessageBadge', props: { status: 'warn', size: 'md' }, content: { fallback: 'Warning' } },
                      { id: 'badge-error', type: 'MessageBadge', props: { status: 'error', size: 'md' }, content: { fallback: 'Error' } },
                    ],
                  },
                  { id: 'statusbar-example', type: 'StatusBar', props: { value: 65, max: 100, label: 'Uploading files…', size: 'md' } },
                  {
                    id: 'circ-row',
                    type: 'Stack',
                    props: { direction: 'row', gap: 'xl', align: 'center' },
                    children: [
                      { id: 'circ-sm', type: 'CircularProgress', props: { value: 25, max: 100, size: 'sm' }, a11y: { label: '25% complete' } },
                      { id: 'circ-md', type: 'CircularProgress', props: { value: 65, max: 100, size: 'md' }, a11y: { label: '65% complete' } },
                      { id: 'circ-lg', type: 'CircularProgress', props: { value: 90, max: 100, size: 'lg' }, a11y: { label: '90% complete' } },
                      { id: 'circ-spin', type: 'CircularProgress', props: { size: 'md', indeterminate: true }, a11y: { label: 'Loading' } },
                    ],
                  },
                  { id: 'steptracker-example', type: 'StepTracker', props: { steps: 5, currentStep: 2, align: 'left' } },
                  { id: 'emptystate-example', type: 'MessageEmptyState', props: { scale: 'card', icon: 'folder_open', title: 'No files yet', description: 'Upload a file to get started.' } },
                ]},
              ],
            },

            // ── Inputs ────────────────────────────────────────────────────
            {
              id: 'inputs-section',
              type: 'Section',
              props: { padding: 'lg', contentWidth: 'md', gap: 'md' },
              children: [
                { id: 'inputs-heading', type: 'Heading', props: { as: 'h2', size: 'lg' }, content: { fallback: 'Inputs' } },
                { id: 'inputs-divider', type: 'Divider', props: { space: 'md' } },
                { id: 'inputs-stack', type: 'Stack', props: { gap: 'lg', direction: 'column' }, children: [
                  { id: 'textfield-example', type: 'TextField', props: { label: 'Email address', type: 'email', size: 'default' } },
                  { id: 'textareafield-example', type: 'TextareaField', props: { label: 'Message', size: 'default', rows: 'md' } },
                  { id: 'checkbox-example', type: 'CheckboxGroup', props: { label: 'Notifications', size: 'default', options: [
                    { value: 'email', label: 'Email' },
                    { value: 'sms', label: 'SMS' },
                    { value: 'push', label: 'Push notifications' },
                  ]}},
                  { id: 'radio-example', type: 'RadioGroup', props: { label: 'Plan', size: 'default', options: [
                    { value: 'starter', label: 'Starter' },
                    { value: 'pro', label: 'Professional' },
                    { value: 'enterprise', label: 'Enterprise' },
                  ]}},
                ]},
              ],
            },

            // ── Data ──────────────────────────────────────────────────────
            {
              id: 'data-section',
              type: 'Section',
              props: { padding: 'lg', surface: 'panel', contentWidth: 'lg', gap: 'md' },
              children: [
                { id: 'data-heading', type: 'Heading', props: { as: 'h2', size: 'lg' }, content: { fallback: 'Data' } },
                { id: 'data-divider', type: 'Divider', props: { space: 'md' } },
                { id: 'deflist-example', type: 'DefinitionList', props: { direction: 'row', size: 'md', labelWidth: 'fixed', items: [
                  { label: 'Account ID', value: 'A1-849204', copyValue: true },
                  { label: 'Plan', value: 'Enterprise' },
                  { label: 'Renewal', value: 'June 30, 2026' },
                  { label: 'Status', value: 'Active' },
                ]}},
                { id: 'data-spacer', type: 'Spacer', props: { size: 'md' } },
                { id: 'pagination-example', type: 'Pagination', props: { totalPages: 10, siblings: 1, size: 'md' } },
              ],
            },

            // ── Disclosure ────────────────────────────────────────────────
            {
              id: 'disclosure-section',
              type: 'Section',
              props: { padding: 'lg', contentWidth: 'lg', gap: 'md' },
              children: [
                { id: 'disclosure-heading', type: 'Heading', props: { as: 'h2', size: 'lg' }, content: { fallback: 'Disclosure' } },
                { id: 'disclosure-divider', type: 'Divider', props: { space: 'md' } },
                { id: 'accordion-1', type: 'Accordion', props: { label: 'What is A1?', defaultOpen: true }, children: [
                  { id: 'accordion-1-p', type: 'Paragraph', props: { color: 'muted' }, content: { fallback: 'A1 is a multi-platform design system covering React, HTML/CSS, and React Native. It is token-driven and component-first.' } },
                ]},
                { id: 'accordion-2', type: 'Accordion', props: { label: 'How are components organized?' }, children: [
                  { id: 'accordion-2-p', type: 'Paragraph', props: { color: 'muted' }, content: { fallback: 'Components are organized into categories: Layout, Typography, Actions, Feedback, Inputs, Data, and Disclosure.' } },
                ]},
                { id: 'accordion-3', type: 'Accordion', props: { label: 'Can I use this without React?' }, children: [
                  { id: 'accordion-3-p', type: 'Paragraph', props: { color: 'muted' }, content: { fallback: 'Yes — A1 also ships HTML/CSS classes via the a1-pure and a1-base packages for framework-free use.' } },
                ]},
              ],
            },

          ],
        },
      ],
    },
  },
};
