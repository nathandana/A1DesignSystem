export type A1PageNodeType =
  | 'Accordion'
  | 'Banner'
  | 'Blockquote'
  | 'Breadcrumb'
  | 'Button'
  | 'ButtonContainer'
  | 'Card'
  | 'CheckboxGroup'
  | 'ChipGroup'
  | 'ChoiceGroup'
  | 'Code'
  | 'DataTable'
  | 'DefinitionList'
  | 'Dialog'
  | 'Divider'
  | 'Figure'
  | 'Grid'
  | 'GridItem'
  | 'Heading'
  | 'Icon'
  | 'IconButton'
  | 'Inline'
  | 'Link'
  | 'Menu'
  | 'MessageBadge'
  | 'MessageEmptyState'
  | 'PageLayout'
  | 'PageNav'
  | 'Pagination'
  | 'Paragraph'
  | 'RadioGroup'
  | 'SearchField'
  | 'Section'
  | 'SegmentedControl'
  | 'SelectField'
  | 'Stack'
  | 'Switch'
  | 'Tabs'
  | 'TextareaField'
  | 'TextField'
  | 'Tooltip'
  | 'TopHeader'
  | 'TreeMenu';

export interface A1PageNodeContent {
  fallback?: string;
  inlineLinks?: unknown[];
  [key: string]: unknown;
}

export interface A1PageNode {
  id?: string;
  type: A1PageNodeType;
  props?: Record<string, unknown>;
  content?: A1PageNodeContent;
  children?: A1PageNode[];
  nodes?: A1PageNode[];
  regions?: unknown[];
}

export interface A1PageDefinition {
  schemaVersion?: string;
  page?: unknown;
  nodes?: A1PageNode[];
}
