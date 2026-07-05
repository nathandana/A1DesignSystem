/**
 * Component catalog — component definitions organized by category for the
 * editor "Add component" panel.
 *
 * Each entry carries a default node shape (without an `id`). Call
 * `createNodeFromEntry` to stamp a fresh stable id on it before inserting.
 */
import type { ComponentNode, ComponentProps, ComponentType, ContentDefinition } from './pageTypes';

/** A node template with no `id` at any level — ids are stamped by `createNodeFromEntry`. */
export type PartialNode = {
  type: ComponentType;
  props?: ComponentProps;
  content?: ContentDefinition;
  children?: PartialNode[];
};

export interface CatalogEntry {
  type: ComponentType;
  label: string;
  icon: string;
  description: string;
  defaultNode: PartialNode;
}

export interface CatalogCategory {
  id: string;
  label: string;
  icon: string;
  entries: CatalogEntry[];
}

export const COMPONENT_CATALOG: CatalogCategory[] = [
  {
    id: 'layout',
    label: 'Layout',
    icon: 'dashboard',
    entries: [
      {
        type: 'Section',
        label: 'Section',
        icon: 'crop_free',
        description: 'Full-width page section with padding and surface',
        defaultNode: {
          type: 'Section',
          props: { padding: 'md' },
        },
      },
      {
        type: 'Stack',
        label: 'Stack',
        icon: 'view_agenda',
        description: 'Vertical or horizontal child stack with gap',
        defaultNode: {
          type: 'Stack',
          props: { direction: 'column', gap: 'md' },
        },
      },
      {
        type: 'Grid',
        label: 'Grid',
        icon: 'grid_view',
        description: 'Multi-column responsive grid',
        defaultNode: {
          type: 'Grid',
          props: { columns: 2, gap: 'md' },
        },
      },
      {
        type: 'Canvas',
        label: 'Canvas',
        icon: 'polyline',
        description: 'Infinite pan/zoom canvas for node graphs',
        defaultNode: {
          type: 'Canvas',
          props: {
            nodes: [
              { id: 'tokens', label: 'Design tokens', shape: 'circle', color: 'neutral', size: 'md', x: 300, y: 120 },
              { id: 'react', label: 'React', shape: 'circle', color: 'info', size: 'md', x: 140, y: 270 },
              { id: 'native', label: 'React Native', shape: 'circle', color: 'accent', size: 'md', x: 460, y: 270 },
            ],
            edges: [
              { id: 'e1', from: 'tokens', to: 'react', direction: 'to', variant: 'solid', weight: 'normal' },
              { id: 'e2', from: 'tokens', to: 'native', direction: 'to', variant: 'solid', weight: 'normal' },
            ],
            edgeStyle: 'straight',
            selectedId: 'tokens',
            selectedType: 'node',
            activeTab: 'nodes',
          },
        },
      },
      {
        type: 'Card',
        label: 'Card',
        icon: 'article',
        description: 'Bordered card for grouped content',
        defaultNode: {
          type: 'Card',
          props: {},
        },
      },
      {
        type: 'Inset',
        label: 'Inset',
        icon: 'padding',
        description: 'Uniformly padded content inset',
        defaultNode: {
          type: 'Inset',
          props: { space: 16 },
        },
      },
      {
        type: 'Bleed',
        label: 'Bleed',
        icon: 'open_in_full',
        description: 'Reach past the surrounding inset padding',
        defaultNode: {
          type: 'Bleed',
          props: { space: 16 },
        },
      },
      {
        type: 'Spacer',
        label: 'Spacer',
        icon: 'space_bar',
        description: 'Fixed vertical or horizontal spacing',
        defaultNode: {
          type: 'Spacer',
          props: { size: 'md' },
        },
      },
      {
        type: 'ButtonContainer',
        label: 'Button container',
        icon: 'view_week',
        description: 'Responsive row of action buttons',
        defaultNode: {
          type: 'ButtonContainer',
          props: { align: 'end' },
          children: [
            {
              type: 'Button',
              props: { variant: 'secondary' },
              content: { fallback: 'Cancel' },
            },
            {
              type: 'Button',
              props: { variant: 'primary' },
              content: { fallback: 'Save changes' },
            },
          ],
        },
      },
      {
        type: 'PageLayout',
        label: 'Page layout',
        icon: 'space_dashboard',
        description: 'Header, sidebar, aside, main, and footer app shell',
        defaultNode: {
          type: 'PageLayout',
          props: { sidebarPlacement: 'start', asidePlacement: 'end', stickyHeader: false, viewportHeight: false },
        },
      },
      {
        type: 'Slot',
        label: 'Blank area',
        icon: 'select_all',
        description: 'A constrained drop zone — restrict which components or patterns fill it',
        defaultNode: {
          type: 'Slot',
          props: { label: 'Add content here', columns: 2, gap: 'md' },
        },
      },
    ],
  },
  {
    id: 'typography',
    label: 'Typography',
    icon: 'title',
    entries: [
      {
        type: 'Heading',
        label: 'Heading',
        icon: 'title',
        description: 'Section or page heading',
        defaultNode: {
          type: 'Heading',
          props: { as: 'h2', size: 'md' },
          content: { fallback: 'New heading' },
        },
      },
      {
        type: 'Paragraph',
        label: 'Paragraph',
        icon: 'notes',
        description: 'Body text paragraph',
        defaultNode: {
          type: 'Paragraph',
          props: {},
          content: { fallback: 'Add your text here.' },
        },
      },
      {
        type: 'Blockquote',
        label: 'Blockquote',
        icon: 'format_quote',
        description: 'Pull quote with optional citation',
        defaultNode: {
          type: 'Blockquote',
          props: { variant: 'border' },
          content: { fallback: 'A thoughtful quote goes here.' },
        },
      },
      {
        type: 'Code',
        label: 'Code',
        icon: 'code',
        description: 'Inline or block code snippet',
        defaultNode: {
          type: 'Code',
          props: { variant: 'block', wrapping: true },
          content: { fallback: 'const greeting = "Hello, world!";' },
        },
      },
      {
        type: 'Divider',
        label: 'Divider',
        icon: 'horizontal_rule',
        description: 'Horizontal or vertical separator line',
        defaultNode: {
          type: 'Divider',
          props: { space: 'md' },
        },
      },
      {
        type: 'Inline',
        label: 'Inline',
        icon: 'format_size',
        description: 'Semantic inline text treatments',
        defaultNode: {
          type: 'Inline',
          props: {
            inlineElement: 'all',
            children: 'Example paragraph with **bold**, *italic*, `code`, ==marked text==, and [kbd:⌘K].',
          },
        },
      },
      {
        type: 'List',
        label: 'List',
        icon: 'format_list_bulleted',
        description: 'Unordered, ordered, or icon list',
        defaultNode: {
          type: 'List',
          props: { as: 'ul', variant: 'unordered', size: 'md' },
          children: [
            { type: 'ListItem', content: { fallback: 'First item' } },
            { type: 'ListItem', content: { fallback: 'Second item' } },
            { type: 'ListItem', content: { fallback: 'Third item' } },
          ],
        },
      },
      {
        type: 'Icon',
        label: 'Icon',
        icon: 'interests',
        description: 'Material Symbol icon at any size',
        defaultNode: {
          type: 'Icon',
          props: { name: 'star', size: 'lg' },
        },
      },
      {
        type: 'Figure',
        label: 'Figure',
        icon: 'image',
        description: 'Image with optional caption',
        defaultNode: {
          type: 'Figure',
          props: {
            src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop',
            alt: 'Mountain lake landscape',
            caption: 'Photo by Samantha Gades on Unsplash',
            radius: 'md',
          },
        },
      },
    ],
  },
  {
    id: 'actions',
    label: 'Actions',
    icon: 'touch_app',
    entries: [
      {
        type: 'Button',
        label: 'Button',
        icon: 'smart_button',
        description: 'Interactive action button',
        defaultNode: {
          type: 'Button',
          props: { variant: 'primary' },
          content: { fallback: 'Button' },
        },
      },
      {
        type: 'ActionTiles',
        label: 'Action tiles',
        icon: 'apps',
        description: 'Grouped icon-led action surfaces',
        defaultNode: {
          type: 'ActionTiles',
          props: {
            layout: 'grid',
            gap: true,
            iconLayout: 'top',
            columns: { xs: 3, sm: 3, md: 3, lg: 3, xl: 3 },
            interactive: true,
            items: [
              { id: 'patterns', icon: 'palette', title: 'Patterns', subtitle: '', accessoryKind: 'none', footerMode: 'none' },
              { id: 'images', icon: 'imagesmode', title: 'Image library', subtitle: '', accessoryKind: 'none', footerMode: 'none' },
              { id: 'quick', icon: 'bolt', title: 'Quick actions', subtitle: '', accessoryKind: 'none', footerMode: 'none' },
            ],
          },
        },
      },
      {
        type: 'ChipGroup',
        label: 'Chip',
        icon: 'label',
        description: 'Compact selectable chip group',
        defaultNode: {
          type: 'ChipGroup',
          props: {
            behavior: 'multiple',
            size: 'md',
            wrap: true,
            items: [
              { id: 'design', title: 'Design', icon: 'palette', href: '#design' },
              { id: 'code', title: 'Code', icon: 'code', href: '#code' },
              { id: 'docs', title: 'Docs', icon: 'article', href: '#docs' },
            ],
          },
        },
      },
      {
        type: 'Link',
        label: 'Link',
        icon: 'link',
        description: 'Inline navigation link',
        defaultNode: {
          type: 'Link',
          props: { href: '#' },
          content: { fallback: 'Link text' },
        },
      },
      {
        type: 'IconButton',
        label: 'Icon button',
        icon: 'touch_app',
        description: 'Square icon-only action button',
        defaultNode: {
          type: 'IconButton',
          props: { icon: 'settings', label: 'Settings', variant: 'tertiary' },
        },
      },
      {
        type: 'Switch',
        label: 'Switch',
        icon: 'toggle_on',
        description: 'Toggle switch for boolean settings',
        defaultNode: {
          type: 'Switch',
          props: { label: 'Enable notifications', size: 'default' },
        },
      },
      {
        type: 'SegmentedControl',
        label: 'Segmented control',
        icon: 'splitscreen',
        description: 'Compact mutually-exclusive option group',
        defaultNode: {
          type: 'SegmentedControl',
          props: {
            size: 'md',
            options: [
              { value: 'day', label: 'Day' },
              { value: 'week', label: 'Week' },
              { value: 'month', label: 'Month' },
            ],
          },
        },
      },
      {
        type: 'Slider',
        label: 'Slider',
        icon: 'tune',
        description: 'Range input with optional snap detents',
        defaultNode: {
          type: 'Slider',
          props: {
            label: 'Padding',
            detents: [
              { value: 0, label: 'None' },
              { value: 1, label: 'XS' },
              { value: 2, label: 'SM' },
              { value: 3, label: 'MD' },
              { value: 4, label: 'LG' },
            ],
            defaultValue: 2,
          },
        },
      },
      {
        type: 'Toolbar',
        label: 'Toolbar',
        icon: 'build',
        description: 'Compact bar grouping editing controls',
        defaultNode: {
          type: 'Toolbar',
          props: { example: 'text-editor', showLabels: false, showLabel: false, fullWidth: false, disabled: false },
        },
      },
      {
        type: 'Tabs',
        label: 'Tabs',
        icon: 'tab',
        description: 'Tabbed navigation with panels (line, pills, progress…)',
        defaultNode: {
          type: 'Tabs',
          props: {
            variant: 'line',
            size: 'default',
            level: 1,
            items: [
              { id: 'tab-overview', label: 'Overview', icon: '', iconPosition: 'start', count: '', status: 'none' },
              { id: 'tab-activity', label: 'Activity', icon: '', iconPosition: 'start', count: '12', status: 'none' },
              { id: 'tab-settings', label: 'Settings', icon: '', iconPosition: 'start', count: '', status: 'none' },
            ],
          },
        },
      },
    ],
  },
  {
    id: 'feedback',
    label: 'Feedback',
    icon: 'campaign',
    entries: [
      {
        type: 'Banner',
        label: 'Banner',
        icon: 'view_day',
        description: 'Inline status alert or announcement',
        defaultNode: {
          type: 'Banner',
          props: { status: 'info', title: 'Notice', variant: 'inline' },
          content: { fallback: 'Banner message goes here.' },
        },
      },
      {
        type: 'MessageBadge',
        label: 'Badge',
        icon: 'label',
        description: 'Status badge with label',
        defaultNode: {
          type: 'MessageBadge',
          props: { status: 'info', size: 'md' },
          content: { fallback: 'In progress' },
        },
      },
      {
        type: 'MessageEmptyState',
        label: 'Empty state',
        icon: 'inbox',
        description: 'Empty content placeholder with icon and title',
        defaultNode: {
          type: 'MessageEmptyState',
          props: {
            scale: 'section',
            icon: 'inbox',
            title: 'Nothing here yet',
            description: "Content will appear here once it's available.",
          },
        },
      },
      {
        type: 'Notification',
        label: 'Notification',
        icon: 'notifications',
        description: 'Compact count and status indicator',
        defaultNode: {
          type: 'Notification',
          props: { anchor: 'icon', anchorIcon: 'notifications', anchorLabel: 'Notifications', content: 'count', count: 12, label: 'New', status: 'neutral', position: 'top-right', max: 99 },
        },
      },
      {
        type: 'Snackbar',
        label: 'Snackbar',
        icon: 'notification_important',
        description: 'Transient confirmation or alert message',
        defaultNode: {
          type: 'Snackbar',
          props: { children: 'Saved changes.', position: 'bottom', action: true, actionLabel: 'Undo', dismissible: true },
        },
      },
      {
        type: 'StatusBar',
        label: 'Status bar',
        icon: 'linear_scale',
        description: 'Horizontal progress bar with label',
        defaultNode: {
          type: 'StatusBar',
          props: { value: 65, max: 100, label: 'Progress', size: 'md' },
        },
      },
      {
        type: 'CircularProgress',
        label: 'Circular progress',
        icon: 'donut_large',
        description: 'Circular ring progress indicator',
        defaultNode: {
          type: 'CircularProgress',
          props: { value: 65, max: 100, size: 'md' },
          a11y: { label: '65% complete' },
        },
      },
      {
        type: 'StepTracker',
        label: 'Step tracker',
        icon: 'more_horiz',
        description: 'Pill and dot step position indicator',
        defaultNode: {
          type: 'StepTracker',
          props: { steps: 5, currentStep: 2, align: 'left' },
        },
      },
    ],
  },
  {
    id: 'inputs',
    label: 'Inputs',
    icon: 'edit_note',
    entries: [
      {
        type: 'TextField',
        label: 'Text field',
        icon: 'text_fields',
        description: 'Single-line text input with label',
        defaultNode: {
          type: 'TextField',
          props: { label: 'Email address', type: 'email', size: 'default' },
        },
      },
      {
        type: 'SearchField',
        label: 'Search field',
        icon: 'search',
        description: 'Search input with leading icon and clear button',
        defaultNode: {
          type: 'SearchField',
          props: { label: 'Search', defaultValue: '', clearLabel: 'Clear search', size: 'default' },
        },
      },
      {
        type: 'NumberField',
        label: 'Number field',
        icon: 'pin',
        description: 'Numeric input with optional prefix and unit',
        defaultNode: {
          type: 'NumberField',
          props: { label: 'Amount', prefix: '$', size: 'default' },
        },
      },
      {
        type: 'PhoneField',
        label: 'Phone field',
        icon: 'phone',
        description: 'Phone number input with mask',
        defaultNode: {
          type: 'PhoneField',
          props: { label: 'Phone number', autoComplete: 'tel', size: 'default' },
        },
      },
      {
        type: 'ZipField',
        label: 'ZIP field',
        icon: 'local_post_office',
        description: 'ZIP / postal code input with mask',
        defaultNode: {
          type: 'ZipField',
          props: { label: 'ZIP code', autoComplete: 'postal-code', size: 'default' },
        },
      },
      {
        type: 'CreditCardField',
        label: 'Credit card field',
        icon: 'credit_card',
        description: 'Credit card number input with mask',
        defaultNode: {
          type: 'CreditCardField',
          props: { label: 'Card number', autoComplete: 'cc-number', size: 'default' },
        },
      },
      {
        type: 'DateField',
        label: 'Date field',
        icon: 'event',
        description: 'Date input with label',
        defaultNode: {
          type: 'DateField',
          props: { label: 'Start date', size: 'default' },
        },
      },
      {
        type: 'TimeField',
        label: 'Time field',
        icon: 'schedule',
        description: 'Time input with label',
        defaultNode: {
          type: 'TimeField',
          props: { label: 'Start time', size: 'default' },
        },
      },
      {
        type: 'SelectField',
        label: 'Select',
        icon: 'arrow_drop_down_circle',
        description: 'Dropdown select with label',
        defaultNode: {
          type: 'SelectField',
          props: { label: 'Country', size: 'default' },
        },
      },
      {
        type: 'Autocomplete',
        label: 'Autocomplete',
        icon: 'manage_search',
        description: 'Filtering combobox with optional multi-select',
        defaultNode: {
          type: 'Autocomplete',
          props: {
            label: 'Favorite fruit',
            hint: 'Type to filter',
            size: 'default',
            variant: 'default',
            multiple: false,
            allowCreate: false,
            options: [
              { value: 'apple', label: 'Apple' },
              { value: 'banana', label: 'Banana' },
              { value: 'cherry', label: 'Cherry' },
              { value: 'mango', label: 'Mango' },
            ],
          },
        },
      },
      {
        type: 'TextareaField',
        label: 'Textarea',
        icon: 'subject',
        description: 'Multi-line text input with label',
        defaultNode: {
          type: 'TextareaField',
          props: { label: 'Message', size: 'default' },
        },
      },
      {
        type: 'CheckboxGroup',
        label: 'Checkbox group',
        icon: 'check_box',
        description: 'Multi-select checkbox list',
        defaultNode: {
          type: 'CheckboxGroup',
          props: {
            label: 'Notifications',
            size: 'default',
            options: [
              { value: 'email', label: 'Email' },
              { value: 'sms', label: 'SMS' },
              { value: 'push', label: 'Push' },
            ],
          },
        },
      },
      {
        type: 'RadioGroup',
        label: 'Radio group',
        icon: 'radio_button_checked',
        description: 'Single-select radio button list',
        defaultNode: {
          type: 'RadioGroup',
          props: {
            label: 'Plan',
            size: 'default',
            options: [
              { value: 'starter', label: 'Starter' },
              { value: 'pro', label: 'Professional' },
              { value: 'enterprise', label: 'Enterprise' },
            ],
          },
        },
      },
      {
        type: 'ChoiceGroup',
        label: 'Choice group',
        icon: 'dashboard_customize',
        description: 'Selectable tile cards with icon, label, and subtext',
        defaultNode: {
          type: 'ChoiceGroup',
          props: {
            label: 'Plan',
            size: 'default',
            options: [
              { value: 'starter', label: 'Starter', subtext: 'For individuals', icon: 'person' },
              { value: 'team', label: 'Team', subtext: 'For small teams', icon: 'group' },
              { value: 'business', label: 'Business', subtext: 'For organizations', icon: 'apartment' },
            ],
          },
        },
      },
      {
        type: 'Fieldset',
        label: 'Fieldset',
        icon: 'check_box_outline_blank',
        description: 'Groups related form fields under a legend',
        defaultNode: {
          type: 'Fieldset',
          props: { size: 'default' },
          content: { fallback: 'Personal details' },
          children: [
            { type: 'TextField', props: { label: 'First name', size: 'default' } },
            { type: 'TextField', props: { label: 'Last name', size: 'default' } },
          ],
        },
      },
      {
        type: 'FieldRow',
        label: 'Field row',
        icon: 'table_rows',
        description: 'Lays out related fields side by side in equal columns',
        defaultNode: {
          type: 'FieldRow',
          children: [
            { type: 'TextField', props: { label: 'First name', autoComplete: 'given-name', size: 'default' } },
            { type: 'TextField', props: { label: 'Last name', autoComplete: 'family-name', size: 'default' } },
          ],
        },
      },
      {
        type: 'InlineEditable',
        label: 'Inline editable',
        icon: 'edit',
        description: 'Editable text that stays in reading context',
        defaultNode: {
          type: 'InlineEditable',
          props: {
            value: 'Editable text',
            placeholder: 'Add text',
            'aria-label': 'Edit text',
          },
        },
      },
    ],
  },
  {
    id: 'data',
    label: 'Data',
    icon: 'table_chart',
    entries: [
      {
        type: 'DefinitionList',
        label: 'Definition list',
        icon: 'format_list_numbered',
        description: 'Label–value pairs for metadata or records',
        defaultNode: {
          type: 'DefinitionList',
          props: {
            direction: 'row',
            size: 'md',
            labelWidth: 'fixed',
            items: [
              { label: 'Account ID', value: 'A1-849204', copyValue: true },
              { label: 'Plan', value: 'Enterprise' },
              { label: 'Renewal', value: 'June 30, 2026' },
            ],
          },
        },
      },
      {
        type: 'Stat',
        label: 'Stat',
        icon: 'analytics',
        description: 'Single metric display with context',
        defaultNode: {
          type: 'Stat',
          props: {
            title: 'Active projects',
            value: 1284,
            description: 'Across all workspaces',
            format: 'number',
            size: 'md',
            align: 'start',
          },
        },
      },
      {
        type: 'DataTable',
        label: 'Data table',
        icon: 'table_chart',
        description: 'Sortable, filterable table of records',
        defaultNode: {
          type: 'DataTable',
          props: {
            size: 'responsive',
            zebra: false,
            scrollable: false,
            caption: 'Team members',
            sortable: true,
            showSearch: false,
            showFilters: false,
            showPagination: false,
            pageSize: 3,
            selectable: false,
            showDeleteSelected: false,
            emptyTitle: 'No results',
            emptyDescription: '',
            emptyIcon: 'inbox',
          },
        },
      },
      {
        type: 'Pagination',
        label: 'Pagination',
        icon: 'last_page',
        description: 'Page navigation controls',
        defaultNode: {
          type: 'Pagination',
          props: { totalPages: 10, siblings: 1, size: 'md' },
        },
      },
      {
        type: 'Calendar',
        label: 'Calendar',
        icon: 'calendar_month',
        description: 'Month-based date picker display',
        defaultNode: {
          type: 'Calendar',
          props: { variant: 'paginated', monthsToShow: 1 },
        },
      },
      {
        type: 'Node',
        label: 'Node',
        icon: 'circle',
        description: 'Standalone labeled shape component',
        defaultNode: {
          type: 'Node',
          props: {
            id: 'node',
            label: 'Node',
            sublabel: 'Label',
            shape: 'circle',
            color: 'accent',
            size: 'md',
            subtle: false,
          },
        },
      },
    ],
  },
  {
    id: 'navigation',
    label: 'Navigation',
    icon: 'near_me',
    entries: [
      {
        type: 'Breadcrumb',
        label: 'Breadcrumb',
        icon: 'chevron_right',
        description: 'Hierarchical page location trail',
        defaultNode: {
          type: 'Breadcrumb',
          props: {
            items: [
              { id: 'home', label: 'Home', href: '/' },
              { id: 'products', label: 'Products', href: '/products' },
              { id: 'current', label: 'Current page' },
            ],
          },
        },
      },
      {
        type: 'SideNav',
        label: 'Side nav',
        icon: 'view_sidebar',
        description: 'Responsive nested navigation for app shells',
        defaultNode: {
          type: 'SideNav',
          props: {
            header: 'A1 Console',
            items: [
              { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', badge: '', active: true },
              { id: 'projects', label: 'Projects', icon: 'folder', badge: '4', active: false },
              { id: 'settings', label: 'Settings', icon: 'settings', badge: '', active: false },
            ],
            collapsed: false,
            collapseButtonPlacement: 'header',
            placement: 'start',
            footerLabel: 'Sign out',
            footerIcon: 'logout',
            openItems: ['dashboard'],
          },
        },
      },
      {
        type: 'TopHeader',
        label: 'Top header',
        icon: 'web_asset',
        description: 'App top navigation bar with logo and nav items',
        defaultNode: {
          type: 'TopHeader',
          props: {
            logoText: 'My App',
            navItems: [
              { id: 'home', label: 'Home', icon: 'home', href: '/', active: true },
              { id: 'about', label: 'About', icon: 'info', href: '/about' },
            ],
          },
        },
      },
      {
        type: 'BottomDrawer',
        label: 'Bottom drawer',
        icon: 'call_to_action',
        description: 'Fixed bottom navigation bar for mobile',
        defaultNode: {
          type: 'BottomDrawer',
          props: {
            'aria-label': 'App navigation',
            items: [
              { id: 'home', label: 'Home', icon: 'home', active: true },
              { id: 'search', label: 'Search', icon: 'search' },
              { id: 'account', label: 'Account', icon: 'person' },
            ],
          },
        },
      },
      {
        type: 'StickyActions',
        label: 'Sticky actions',
        icon: 'vertical_align_bottom',
        description: 'Fixed bottom action bar for flows and wizards',
        defaultNode: {
          type: 'StickyActions',
          props: { contentWidth: 'md' },
          children: [
            {
              type: 'ButtonContainer',
              props: { align: 'end' },
              children: [
                { type: 'Button', props: { variant: 'secondary' }, content: { fallback: 'Back' } },
                { type: 'Button', props: { variant: 'primary' }, content: { fallback: 'Continue' } },
              ],
            },
          ],
        },
      },
      {
        type: 'PageNav',
        label: 'Page nav',
        icon: 'toc',
        description: 'In-page "on this page" table of contents',
        defaultNode: {
          type: 'PageNav',
          props: {
            label: 'On this page',
            sections: [
              { id: 'overview', label: 'Overview', level: 1 },
              { id: 'usage', label: 'Usage', level: 1 },
              { id: 'examples', label: 'Examples', level: 2 },
              { id: 'props', label: 'Props', level: 1 },
            ],
          },
        },
      },
      {
        type: 'TreeMenu',
        label: 'Tree menu',
        icon: 'account_tree',
        description: 'Hierarchical, collapsible navigation tree',
        defaultNode: {
          type: 'TreeMenu',
          props: {
            variant: 'expanded',
            selectedId: 'invoices',
            expandedIds: ['account', 'billing'],
            showExpandControls: false,
            draggable: false,
            items: [
              {
                id: 'account', label: 'Account', icon: 'manage_accounts', openInPanel: false,
                children: [
                  { id: 'profile', label: 'Profile', icon: 'person', openInPanel: false, children: [] },
                  { id: 'security', label: 'Security', icon: 'lock', openInPanel: false, children: [] },
                  {
                    id: 'billing', label: 'Billing', icon: 'credit_card', openInPanel: false,
                    children: [
                      { id: 'invoices', label: 'Invoices', icon: 'receipt_long', openInPanel: false, children: [] },
                      { id: 'payment', label: 'Payment methods', icon: 'payment', openInPanel: false, children: [] },
                    ],
                  },
                ],
              },
              { id: 'notifications', label: 'Notifications', icon: 'notifications', openInPanel: false, children: [] },
              { id: 'integrations', label: 'Integrations', icon: 'extension', openInPanel: false, children: [] },
            ],
          },
        },
      },
    ],
  },
  {
    id: 'overlay',
    label: 'Overlay',
    icon: 'web_asset',
    entries: [
      {
        type: 'Dialog',
        label: 'Dialog',
        icon: 'picture_in_picture',
        description: 'Modal interaction with focus management',
        defaultNode: {
          type: 'Dialog',
          props: { title: 'Confirm action', size: 'md', showClose: true, status: '', customIcon: false, icon: 'check_circle' },
        },
      },
      {
        type: 'Menu',
        label: 'Menu',
        icon: 'menu',
        description: 'Anchored command and navigation menu',
        defaultNode: {
          type: 'Menu',
          props: {
            items: [
              { id: 'edit', kind: 'item', label: 'Edit', icon: 'edit', shortcut: '', destructive: false },
              { id: 'duplicate', kind: 'item', label: 'Duplicate', icon: 'content_copy', shortcut: '', destructive: false },
              { id: 'divider', kind: 'divider' },
              { id: 'delete', kind: 'item', label: 'Delete', icon: 'delete', shortcut: '', destructive: true },
            ],
          },
        },
      },
      {
        type: 'ContextMenu',
        label: 'Context menu',
        icon: 'more_vert',
        description: 'Right-click command menu',
        defaultNode: {
          type: 'ContextMenu',
          props: {
            items: [
              { id: 'open', kind: 'item', label: 'Open', icon: 'folder_open', shortcut: '', destructive: false },
              { id: 'rename', kind: 'item', label: 'Rename', icon: 'edit', shortcut: 'F2', destructive: false },
              { id: 'divider', kind: 'divider' },
              { id: 'delete', kind: 'item', label: 'Delete', icon: 'delete', shortcut: '', destructive: true },
            ],
          },
        },
      },
      {
        type: 'BottomSheet',
        label: 'Bottom sheet',
        icon: 'swipe_up',
        description: 'Fixed bottom panel with draggable handle',
        defaultNode: {
          type: 'BottomSheet',
          props: { title: 'Filters', defaultDetent: 1 },
        },
      },
    ],
  },
  {
    id: 'disclosure',
    label: 'Disclosure',
    icon: 'unfold_more',
    entries: [
      {
        type: 'Accordion',
        label: 'Accordion',
        icon: 'unfold_more',
        description: 'Collapsible section with trigger label',
        defaultNode: {
          type: 'Accordion',
          props: { label: 'Accordion heading', defaultOpen: true },
        },
      },
    ],
  },
];

// ── Lookup by component id (matches the `data.js` componentCategories ids) ─────
// The Add panel derives its display order, categories, labels, and icons from
// the component registry source of truth (`pages/components/data.js`), and uses
// these maps to resolve each component id back to its addable catalog entry.

const TYPE_TO_ID_ALIASES: Record<string, string> = {
  ActionTiles: 'action-tile',
  ChipGroup: 'chip',
  MessageBadge: 'badge',
  MessageEmptyState: 'empty-state',
  SelectField: 'select',
  TextareaField: 'textarea',
};

/** Map a catalog entry `type` to its `data.js` component id (kebab-case + aliases). */
export function catalogIdForType(type: string): string {
  return TYPE_TO_ID_ALIASES[type] ?? type.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/** Every catalog entry, flattened. */
export const ALL_CATALOG_ENTRIES: CatalogEntry[] = COMPONENT_CATALOG.flatMap((c) => c.entries);

/** Catalog entries keyed by their `data.js` component id. */
export const CATALOG_ENTRIES_BY_ID: Record<string, CatalogEntry> = Object.fromEntries(
  ALL_CATALOG_ENTRIES.map((entry) => [catalogIdForType(entry.type), entry]),
);

/**
 * The most-used components, shown in the Add panel's "Common" set. Everything
 * else is revealed by switching the panel to "All". Ids match the `data.js`
 * component ids.
 */
export const COMMON_COMPONENT_IDS = new Set<string>([
  // Layout & Display
  'section', 'card', 'stack', 'grid',
  // Typography
  'heading', 'paragraph', 'list', 'divider',
  // Actions & controls
  'button', 'action-tile', 'chip', 'link', 'icon-button', 'accordion', 'tabs',
  // Navigation
  'breadcrumb', 'top-header',
  // Inputs
  'text-field', 'search-field', 'textarea', 'select', 'checkbox-group', 'radio-group',
  // Feedback & messaging
  'banner', 'badge',
  // Media and iconography
  'figure', 'icon',
  // Data
  'data-table', 'definition-list', 'pagination',
]);

function freshId(): string {
  return `node-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function stampIds(node: PartialNode): ComponentNode {
  return {
    ...node,
    id: freshId(),
    children: node.children?.map(stampIds),
  } as ComponentNode;
}

export function createNodeFromEntry(entry: CatalogEntry): ComponentNode {
  return stampIds(entry.defaultNode);
}
