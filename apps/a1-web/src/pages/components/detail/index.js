import * as generic from './generic.jsx'
import * as heading from './heading.jsx'
import * as paragraph from './paragraph.jsx'
import * as blockquote from './blockquote.jsx'
import * as code from './code.jsx'
import * as divider from './divider.jsx'
import * as inline from './inline.jsx'
import * as link from './link.jsx'
import * as breadcrumb from './breadcrumb.jsx'
import * as buttonContainer from './button-container.jsx'
import * as calendar from './calendar.jsx'
import * as card from './card.jsx'
import * as list from './list.jsx'
import * as sideNav from './side-nav.jsx'
import * as topHeader from './top-header.jsx'
import * as tabs from './tabs.jsx'
import * as pageNav from './page-nav.jsx'
import * as button from './button.jsx'
import * as iconButton from './icon-button.jsx'
import * as switchControl from './switch.jsx'
import * as segmentedControl from './segmented-control.jsx'
import * as textField from './text-field.jsx'
import * as numberField from './number-field.jsx'
import * as dateField from './date-field.jsx'
import * as timeField from './time-field.jsx'
import * as phoneField from './phone-field.jsx'
import * as zipField from './zip-field.jsx'
import * as creditCardField from './credit-card-field.jsx'
import * as textarea from './textarea.jsx'
import * as select from './select.jsx'
import * as checkboxGroup from './checkbox-group.jsx'
import * as radioGroup from './radio-group.jsx'
import * as choiceGroup from './choice-group.jsx'
import * as fieldset from './fieldset.jsx'
import * as fieldRow from './field-row.jsx'
import * as inlineEditable from './inline-editable.jsx'
import * as banner from './banner.jsx'
import * as badge from './badge.jsx'
import * as notification from './notification.jsx'
import * as snackbar from './snackbar.jsx'
import * as emptyState from './empty-state.jsx'
import * as statusBar from './status-bar.jsx'
import * as circularProgress from './circular-progress.jsx'
import * as stepTracker from './step-tracker.jsx'
import * as definitionList from './definition-list.jsx'
import * as section from './section.jsx'
import * as stack from './stack.jsx'

// Registry of per-component detail modules. A component only needs an entry when
// it requires bespoke preview, controls, snippet, or default config. Anything
// not provided by a module falls back to the generic implementation.
const REGISTRY = {
  heading,
  paragraph,
  blockquote,
  code,
  divider,
  inline,
  link,
  breadcrumb,
  'button-container': buttonContainer,
  calendar,
  card,
  list,
  'side-nav': sideNav,
  'top-header': topHeader,
  tabs,
  'page-nav': pageNav,
  button,
  'icon-button': iconButton,
  switch: switchControl,
  'segmented-control': segmentedControl,
  'text-field': textField,
  'number-field': numberField,
  'date-field': dateField,
  'time-field': timeField,
  'phone-field': phoneField,
  'zip-field': zipField,
  'credit-card-field': creditCardField,
  textarea,
  select,
  'checkbox-group': checkboxGroup,
  'radio-group': radioGroup,
  'choice-group': choiceGroup,
  fieldset,
  'field-row': fieldRow,
  'inline-editable': inlineEditable,
  banner,
  badge,
  notification,
  snackbar,
  'empty-state': emptyState,
  'status-bar': statusBar,
  'circular-progress': circularProgress,
  'step-tracker': stepTracker,
  'definition-list': definitionList,
  section,
  stack,
}

export function getDetailModule(componentId) {
  const specific = REGISTRY[componentId] ?? {}
  return {
    getDefaultConfig: specific.getDefaultConfig ?? generic.getDefaultConfig,
    Preview: specific.Preview ?? generic.Preview,
    Controls: specific.Controls ?? generic.Controls,
    Snippet: specific.Snippet ?? generic.Snippet,
    // When true, the preview owns its own surface/height and is rendered without
    // the wrapping Section. The Display tab hides the Section-related controls.
    bareDisplay: specific.bareDisplay ?? false,
  }
}
