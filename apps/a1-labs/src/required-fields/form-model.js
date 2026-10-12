// Required fields experiment: the form, the six marking variations and
// validation. Pure data and functions (no React), so they are unit-tested.

export const SECTIONS = [
  {
    id: 'contact',
    legend: 'Contact',
    fields: [
      { id: 'firstName', label: 'First name', required: true, autoComplete: 'given-name', missing: 'Enter your first name.' },
      { id: 'lastName', label: 'Last name', required: true, autoComplete: 'family-name', missing: 'Enter your last name.' },
      { id: 'preferredName', addLabel: 'Add a preferred name', label: 'Preferred name', required: false, hint: 'What should we call you?' },
      { id: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email', missing: 'Enter your email address.' },
      { id: 'phone', addLabel: 'Add a phone number', label: 'Phone', type: 'tel', required: false, autoComplete: 'tel' },
    ],
  },
  {
    id: 'shipping',
    legend: 'Shipping address',
    fields: [
      { id: 'street', label: 'Street address', required: true, autoComplete: 'address-line1', missing: 'Enter your street address.' },
      { id: 'unit', addLabel: 'Add an apartment or unit', label: 'Apartment, suite or unit', required: false, autoComplete: 'address-line2' },
      { id: 'city', label: 'City', required: true, autoComplete: 'address-level2', missing: 'Enter your city.' },
      { id: 'state', label: 'State', kind: 'select', required: true, autoComplete: 'address-level1', missing: 'Choose your state.',
        options: [['', 'Choose a state'], ['CA', 'California'], ['NY', 'New York'], ['OR', 'Oregon'], ['TX', 'Texas'], ['WA', 'Washington']] },
      { id: 'zip', label: 'ZIP code', required: true, autoComplete: 'postal-code', missing: 'Enter your ZIP code.' },
    ],
  },
  {
    id: 'preferences',
    legend: 'Preferences',
    fields: [
      { id: 'contactMethod', label: 'How should we contact you?', kind: 'radio', required: true, missing: 'Choose how we should contact you.',
        options: [['email', 'Email'], ['phone', 'Phone call'], ['text', 'Text message']] },
      { id: 'topics', addLabel: 'Choose topics', label: 'Topics you are interested in', kind: 'checkbox', required: false,
        options: [['news', 'Product news'], ['events', 'Events near you'], ['research', 'Research studies']] },
    ],
  },
  {
    id: 'message',
    legend: 'Your message',
    fields: [
      { id: 'subject', label: 'Subject', required: true, missing: 'Enter a subject.' },
      { id: 'details', addLabel: 'Add details', label: 'Details', kind: 'textarea', required: false, hint: 'Anything else we should know.' },
      { id: 'referral', addLabel: 'Tell us how you heard about us', label: 'How did you hear about us?', kind: 'select', required: false,
        options: [['', 'Choose one'], ['friend', 'A friend'], ['search', 'Search'], ['social', 'Social media'], ['other', 'Something else']] },
    ],
  },
  {
    id: 'agreement',
    legend: 'Agreement',
    fields: [
      { id: 'terms', label: 'Terms', kind: 'checkbox', required: true, missing: 'Agree to the terms to continue.',
        options: [['agree', 'I agree to the terms of service']] },
    ],
  },
]

export const FIELDS = SECTIONS.flatMap(section => section.fields.map(field => ({ ...field, section: section.id })))
export const REQUIRED = FIELDS.filter(field => field.required)

/**
 * Five new ways to mark required and optional fields, from subtle to extreme.
 * None reuses A1's asterisk or Required badge. Each also sets how missing
 * required fields are marked when the form is submitted, and where focus goes.
 */
export const VARIANTS = [
  { id: 'tick', name: 'Margin tick', summary: 'A thin line in the margin beside each required field.',
    note: 'Fields with a line beside them are required.', focus: 'field',
    onSubmit: 'Missing fields’ lines thicken and turn red, with a message under each. Focus moves to the first one.' },
  { id: 'ink', name: 'Ink lines', summary: 'Required fields are drawn solid; optional fields are dashed.',
    note: 'Solid fields are required. Dashed fields are optional.', focus: 'field',
    onSubmit: 'Missing fields are redrawn in red with a wavy, spellcheck-style message. Focus moves to the first one.' },
  { id: 'rings', name: 'Completion rings', summary: 'A ring after each required label fills in once answered.',
    note: 'Fields with a ring are required. Each ring fills in when you answer it.', focus: 'field',
    onSubmit: 'Empty rings turn red with an exclamation mark, and each section says how many are still needed.' },
  { id: 'opt-in', name: 'Opt-in extras', summary: 'Only required fields show; optional ones are added on request.',
    note: 'Everything shown is required. Add optional details if you like.', focus: 'checklist',
    onSubmit: 'A “Before you send” checklist appears beside the button, linking to each missing field.' },
  { id: 'rail', name: 'Required rail', summary: 'Required fields are numbered stops on a track; optional ones sit off it.',
    note: 'Numbered stops on the track are required. Fields off the track are optional.', focus: 'field', rows: false,
    onSubmit: 'Missing stops turn red, the track breaks and a sticky bar steps through each missing field.' },
]

export function emptyValues() {
  return Object.fromEntries(FIELDS.map(field => [field.id, field.kind === 'checkbox' ? [] : '']))
}

/** Example answers for every required field (and nothing optional). */
export function requiredExample() {
  return {
    ...emptyValues(),
    firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', street: '12 Analytical Way',
    city: 'Portland', state: 'OR', zip: '97201', contactMethod: 'email', subject: 'Booking a tasting', terms: ['agree'],
  }
}

export const filled = value => (Array.isArray(value) ? value.length > 0 : String(value ?? '').trim() !== '')

/** Errors keyed by field id, in form order. */
export function validate(values) {
  const errors = {}
  for (const field of FIELDS) {
    const value = values[field.id]
    if (field.required && !filled(value)) {
      errors[field.id] = field.missing
    } else if (field.id === 'email' && filled(value) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors[field.id] = 'Enter an email address like name@example.com.'
    } else if (field.id === 'zip' && filled(value) && !/^\d{5}$/.test(String(value).trim())) {
      errors[field.id] = 'Enter a 5-digit ZIP code.'
    } else if (field.id === 'terms' && filled(value) && !value.includes('agree')) {
      errors[field.id] = field.missing
    }
  }
  return errors
}

/** How many required fields are filled in. */
export function requiredProgress(values) {
  return { done: REQUIRED.filter(field => filled(values[field.id])).length, total: REQUIRED.length }
}
