/**
 * Shared conversion map for the editor's "Convert to" feature.
 *
 * Imported by EditorPropsPanel (controls panel), EditorSelectionBoundary
 * (canvas right-click menu), and EditorSidebar (tree right-click menu).
 */

export const CONVERSION_MAP: Record<string, string[]> = {
  // Typography
  Heading:        ['Paragraph', 'Blockquote'],
  Paragraph:      ['Heading', 'Blockquote'],
  Blockquote:     ['Heading', 'Paragraph'],
  Code:           ['Paragraph'],
  // Layout
  Stack:          ['Grid', 'Section', 'Card'],
  Grid:           ['Stack'],
  Card:           ['Stack', 'Section'],
  Section:        ['Stack'],
  Inset:          ['Bleed'],
  Bleed:          ['Inset'],
  // Actions
  Button:         ['Link', 'IconButton'],
  Link:           ['Button'],
  IconButton:     ['Button', 'Link'],
  // Text inputs
  TextField:      ['NumberField', 'PhoneField', 'ZipField', 'CreditCardField', 'DateField', 'TimeField', 'TextareaField', 'SelectField'],
  NumberField:    ['TextField', 'PhoneField', 'ZipField', 'CreditCardField'],
  PhoneField:     ['TextField', 'NumberField', 'ZipField'],
  ZipField:       ['TextField', 'NumberField', 'PhoneField'],
  CreditCardField:['TextField', 'NumberField'],
  DateField:      ['TextField', 'TimeField'],
  TimeField:      ['TextField', 'DateField'],
  TextareaField:  ['TextField'],
  SelectField:    ['RadioGroup', 'CheckboxGroup', 'TextField'],
  // Choice inputs
  CheckboxGroup:  ['RadioGroup', 'SelectField'],
  RadioGroup:     ['CheckboxGroup', 'SelectField'],
};

const TYPOGRAPHY = new Set(['Heading', 'Paragraph', 'Blockquote', 'Code']);
const ACTIONS    = new Set(['Button', 'Link', 'IconButton']);

// Shared field props preserved across all text-input field conversions.
const FIELD_SHARED = ['label', 'hint', 'error', 'size', 'labelPosition', 'required', 'disabled', 'readOnly', 'autoComplete'] as const;
// Fields in the text-input family (single-line).
const TEXT_INPUT_FAMILY = new Set(['TextField', 'NumberField', 'PhoneField', 'ZipField', 'CreditCardField', 'DateField', 'TimeField', 'TextareaField', 'SelectField']);
// Fields in the choice group family.
const CHOICE_FAMILY = new Set(['CheckboxGroup', 'RadioGroup']);

export function getConvertedProps(
  fromType: string,
  toType: string,
  props: Record<string, unknown> | null | undefined,
): Record<string, unknown> {
  if (TYPOGRAPHY.has(fromType) && TYPOGRAPHY.has(toType)) {
    const result: Record<string, unknown> = {};
    if (props?.color) result.color = props.color;
    if (props?.align) result.align = props.align;
    if (toType === 'Heading') Object.assign(result, { as: 'h2', size: 'md' });
    return result;
  }

  if (ACTIONS.has(fromType) && ACTIONS.has(toType)) {
    const result: Record<string, unknown> = {};
    if (props?.icon) result.icon = props.icon;
    if (props?.iconPosition) result.iconPosition = props.iconPosition;
    if (toType === 'Button') Object.assign(result, { variant: 'primary', size: 'md' });
    if (toType === 'Link') result.href = '#';
    if (toType === 'IconButton') Object.assign(result, { icon: props?.icon || 'help', label: 'Action', variant: 'tertiary' });
    return result;
  }

  // Text-input family ↔ text-input family: preserve shared field props.
  if (TEXT_INPUT_FAMILY.has(fromType) && TEXT_INPUT_FAMILY.has(toType)) {
    const result: Record<string, unknown> = {};
    for (const key of FIELD_SHARED) {
      if (props?.[key] !== undefined) result[key] = props[key];
    }
    // Apply target-specific defaults not present in the source.
    if (toType === 'NumberField' && !result.label) result.label = 'Amount';
    if (toType === 'PhoneField')     result.autoComplete = result.autoComplete ?? 'tel';
    if (toType === 'ZipField')       result.autoComplete = result.autoComplete ?? 'postal-code';
    if (toType === 'CreditCardField') result.autoComplete = result.autoComplete ?? 'cc-number';
    return result;
  }

  // SelectField → choice group: map label/hint/error/size/required/disabled.
  if (fromType === 'SelectField' && CHOICE_FAMILY.has(toType)) {
    const result: Record<string, unknown> = {};
    for (const key of ['label', 'hint', 'error', 'size', 'required', 'disabled'] as const) {
      if (props?.[key] !== undefined) result[key] = props[key];
    }
    result.options = [
      { value: 'option-1', label: 'Option 1' },
      { value: 'option-2', label: 'Option 2' },
    ];
    return result;
  }

  // Choice group ↔ choice group or → SelectField: preserve group-level props + options.
  if (CHOICE_FAMILY.has(fromType) && (CHOICE_FAMILY.has(toType) || toType === 'SelectField')) {
    const result: Record<string, unknown> = {};
    for (const key of ['label', 'hint', 'error', 'size', 'required', 'disabled', 'inline'] as const) {
      if (props?.[key] !== undefined) result[key] = props[key];
    }
    if (toType !== 'SelectField' && Array.isArray(props?.options)) {
      result.options = props.options;
    }
    return result;
  }

  if ((fromType === 'Stack' && toType === 'Grid') || (fromType === 'Grid' && toType === 'Stack')) {
    const result: Record<string, unknown> = {};
    if (props?.gap !== undefined) result.gap = props.gap;
    if (toType === 'Stack') result.direction = 'row';
    if (toType === 'Grid') result.columns = 2;
    return result;
  }

  if ((fromType === 'Inset' && toType === 'Bleed') || (fromType === 'Bleed' && toType === 'Inset')) {
    return { space: (props?.space as number) ?? 16 };
  }

  if (toType === 'Section') return { padding: 'md' };
  if (toType === 'Stack') return { direction: 'column', gap: 'md' };
  return {};
}
