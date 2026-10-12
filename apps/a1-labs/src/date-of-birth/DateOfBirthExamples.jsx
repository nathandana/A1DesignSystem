import React, { useRef, useState } from 'react'
import { Card, DateField, FieldRow, Fieldset, Heading, NumberField, Paragraph, SelectField, Stack, TextField } from '@gtivr4/a1-design-system-react'

export const DATE_OF_BIRTH_EXPERIMENTS = [
  {
    id: 'dob-native-date',
    icon: 'calendar_month',
    titleKey: 'app.labs.dobNativeDateTitle',
    title: 'Existing date input',
    summaryKey: 'app.labs.dobNativeDateSummary',
    summary: 'Use the current A1 DateField and the browser date picker as the baseline.',
    render: NativeDateExperiment,
  },
  {
    id: 'dob-selects',
    icon: 'list_alt',
    titleKey: 'app.labs.dobSelectsTitle',
    title: 'Month, day, and year selects',
    summaryKey: 'app.labs.dobSelectsSummary',
    summary: 'Use three selects so every value is constrained before submission.',
    render: SelectsExperiment,
  },
  {
    id: 'dob-numeric-fields',
    icon: 'pin',
    titleKey: 'app.labs.dobNumericFieldsTitle',
    title: 'Numeric month, day, and year',
    summaryKey: 'app.labs.dobNumericFieldsSummary',
    summary: 'Use three compact numeric fields for fast keyboard entry.',
    render: NumericExperiment,
  },
  {
    id: 'dob-numeric-auto-advance',
    icon: 'keyboard_tab',
    titleKey: 'app.labs.dobNumericAutoAdvanceTitle',
    title: 'Numeric fields with auto-advance',
    summaryKey: 'app.labs.dobNumericAutoAdvanceSummary',
    summary: 'Move focus to the next date part once month or day has enough digits.',
    render: NumericAutoAdvanceExperiment,
  },
  {
    id: 'dob-mixed-fields',
    icon: 'view_column',
    titleKey: 'app.labs.dobMixedFieldsTitle',
    title: 'Month select with numeric day and year',
    summaryKey: 'app.labs.dobMixedFieldsSummary',
    summary: 'Constrain the month while keeping day and year quick to type.',
    render: MixedExperiment,
  },
  {
    id: 'dob-autoformat',
    icon: 'auto_fix_high',
    titleKey: 'app.labs.dobAutoformatTitle',
    title: 'Single autoformatting input',
    summaryKey: 'app.labs.dobAutoformatSummary',
    summary: 'Let people type naturally and format digits into month, day, and year as they go.',
    render: AutoformatExperiment,
  },
  {
    id: 'dob-autoformat-fields',
    icon: 'view_week',
    titleKey: 'app.labs.dobAutoformatFieldsTitle',
    title: 'Autoformatting month, day, and year',
    summaryKey: 'app.labs.dobAutoformatFieldsSummary',
    summary: 'Use three separate fields that normalize short month, day, and year values.',
    render: AutoformatFieldsExperiment,
  },
]

const MONTHS = [
  ['01', 'January'],
  ['02', 'February'],
  ['03', 'March'],
  ['04', 'April'],
  ['05', 'May'],
  ['06', 'June'],
  ['07', 'July'],
  ['08', 'August'],
  ['09', 'September'],
  ['10', 'October'],
  ['11', 'November'],
  ['12', 'December'],
]

const DOB_FORMAT = 'MM/DD/YYYY'

function ExperimentShell({ t, children, focus, watch, description }) {
  return (
    <Stack direction="column" gap="md">
      <Card>
        <Stack direction="column" gap="sm">
          <Heading as="h3" size="sm">
            {t('app.labs.prototypeTitle', 'Prototype')}
          </Heading>
          {children}
        </Stack>
      </Card>
      {description && <Paragraph size="sm" color="muted">{description}</Paragraph>}
      <Stack direction="row" gap="md" wrap>
        <Card>
          <Stack direction="column" gap="xs">
            <Heading as="h3" size="sm">
              {t('app.labs.testingFocusTitle', 'Testing focus')}
            </Heading>
            <Paragraph size="sm" color="muted">{focus}</Paragraph>
          </Stack>
        </Card>
        <Card>
          <Stack direction="column" gap="xs">
            <Heading as="h3" size="sm">
              {t('app.labs.watchForTitle', 'Watch for')}
            </Heading>
            <Paragraph size="sm" color="muted">{watch}</Paragraph>
          </Stack>
        </Card>
      </Stack>
    </Stack>
  )
}

function NativeDateExperiment({ t, description }) {
  return (
    <ExperimentShell
      t={t}
      description={description}
      focus={t('app.labs.dobNativeDateFocus', 'How well the browser picker supports keyboard entry, screen readers, and older birth years.')}
      watch={t('app.labs.dobNativeDateWatch', 'Whether people recognize the expected format before the native picker opens.')}
    >
      <DateField
        label={t('app.labs.dobFieldLabel', 'Date of birth')}
        hint={t('app.labs.dobNativeDateHint', 'Baseline: current A1 DateField behavior.')}
        autoComplete="bday"
      />
    </ExperimentShell>
  )
}

function MonthOptions({ t }) {
  return (
    <>
      <option value="" aria-label={t('app.labs.monthLabel', 'Month')}></option>
      {MONTHS.map(([value, label]) => (
        <option key={value} value={value}>{label}</option>
      ))}
    </>
  )
}

function DayOptions({ t }) {
  return (
    <>
      <option value="" aria-label={t('app.labs.dayLabel', 'Day')}></option>
      {Array.from({ length: 31 }, (_, index) => {
        const day = String(index + 1)
        return <option key={day} value={day}>{day}</option>
      })}
    </>
  )
}

function YearOptions({ t }) {
  const currentYear = new Date().getFullYear()
  return (
    <>
      <option value="" aria-label={t('app.labs.yearLabel', 'Year')}></option>
      {Array.from({ length: 110 }, (_, index) => {
        const year = String(currentYear - index)
        return <option key={year} value={year}>{year}</option>
      })}
    </>
  )
}

function SelectsExperiment({ t, description }) {
  return (
    <ExperimentShell
      t={t}
      description={description}
      focus={t('app.labs.dobSelectsFocus', 'Whether constrained choices reduce entry errors without making older years tedious.')}
      watch={t('app.labs.dobSelectsWatch', 'How quickly people can move through three menus on touch and keyboard.')}
    >
      <Fieldset legend={t('app.labs.dobFieldLabel', 'Date of birth')}>
        <FieldRow>
          <SelectField label={t('app.labs.monthLabel', 'Month')} autoComplete="bday-month">
            <MonthOptions t={t} />
          </SelectField>
          <SelectField label={t('app.labs.dayLabel', 'Day')} autoComplete="bday-day">
            <DayOptions t={t} />
          </SelectField>
          <SelectField label={t('app.labs.yearLabel', 'Year')} autoComplete="bday-year">
            <YearOptions t={t} />
          </SelectField>
        </FieldRow>
      </Fieldset>
    </ExperimentShell>
  )
}

function NumericExperiment({ t, description }) {
  return (
    <ExperimentShell
      t={t}
      description={description}
      focus={t('app.labs.dobNumericFieldsFocus', 'Whether separate numeric fields feel faster while keeping each part understandable.')}
      watch={t('app.labs.dobNumericFieldsWatch', 'Whether people type leading zeroes, jump between fields naturally, and avoid invalid ranges.')}
    >
      <Fieldset legend={t('app.labs.dobFieldLabel', 'Date of birth')}>
        <FieldRow>
          <NumberField label={t('app.labs.monthLabel', 'Month')} min="1" max="12" inputMode="numeric" autoComplete="bday-month" />
          <NumberField label={t('app.labs.dayLabel', 'Day')} min="1" max="31" inputMode="numeric" autoComplete="bday-day" />
          <NumberField label={t('app.labs.yearLabel', 'Year')} min="1900" max={new Date().getFullYear()} inputMode="numeric" autoComplete="bday-year" />
        </FieldRow>
      </Fieldset>
    </ExperimentShell>
  )
}

function focusNextFieldWhenComplete(nextRef, maxLength) {
  return (event) => {
    const digits = event.target.value.replace(/\D/g, '')
    if (digits.length >= maxLength) {
      nextRef.current?.focus()
      nextRef.current?.select?.()
    }
  }
}

function NumericAutoAdvanceExperiment({ t, description }) {
  const dayRef = useRef(null)
  const yearRef = useRef(null)

  return (
    <ExperimentShell
      t={t}
      description={description}
      focus={t('app.labs.dobNumericAutoAdvanceFocus', 'Whether automatic focus movement makes numeric entry faster or feels unexpected.')}
      watch={t('app.labs.dobNumericAutoAdvanceWatch', 'Whether people can correct month and day values easily after focus moves forward.')}
    >
      <Fieldset legend={t('app.labs.dobFieldLabel', 'Date of birth')}>
        <FieldRow>
          <NumberField
            label={t('app.labs.monthLabel', 'Month')}
            min="1"
            max="12"
            inputMode="numeric"
            autoComplete="bday-month"
            onChange={focusNextFieldWhenComplete(dayRef, 2)}
          />
          <NumberField
            ref={dayRef}
            label={t('app.labs.dayLabel', 'Day')}
            min="1"
            max="31"
            inputMode="numeric"
            autoComplete="bday-day"
            onChange={focusNextFieldWhenComplete(yearRef, 2)}
          />
          <NumberField
            ref={yearRef}
            label={t('app.labs.yearLabel', 'Year')}
            min="1900"
            max={new Date().getFullYear()}
            inputMode="numeric"
            autoComplete="bday-year"
          />
        </FieldRow>
      </Fieldset>
    </ExperimentShell>
  )
}

function MixedExperiment({ t, description }) {
  return (
    <ExperimentShell
      t={t}
      description={description}
      focus={t('app.labs.dobMixedFieldsFocus', 'Whether choosing the month removes ambiguity while day and year stay quick to enter.')}
      watch={t('app.labs.dobMixedFieldsWatch', 'Whether the mixed control types feel coherent or interrupt the entry rhythm.')}
    >
      <Fieldset legend={t('app.labs.dobFieldLabel', 'Date of birth')}>
        <FieldRow>
          <SelectField label={t('app.labs.monthLabel', 'Month')} autoComplete="bday-month">
            <MonthOptions t={t} />
          </SelectField>
          <NumberField label={t('app.labs.dayLabel', 'Day')} min="1" max="31" inputMode="numeric" autoComplete="bday-day" />
          <NumberField label={t('app.labs.yearLabel', 'Year')} min="1900" max={new Date().getFullYear()} inputMode="numeric" autoComplete="bday-year" />
        </FieldRow>
      </Fieldset>
    </ExperimentShell>
  )
}

function formatDobInput(value, { finalizeYear = false } = {}) {
  const digits = String(value ?? '').replace(/\D/g, '').slice(0, 8)
  if (!digits) return ''

  let month = digits.slice(0, 2)
  let rest = digits.slice(2)
  if (digits.length === 1 && Number(digits) > 1) {
    month = `0${digits}`
    rest = ''
  } else if (digits.length >= 5 && Number(digits.slice(0, 2)) > 12) {
    month = `0${digits.slice(0, 1)}`
    rest = digits.slice(1)
  }

  const day = rest.slice(0, 2)
  const yearDigits = rest.slice(2, 6)
  const year = expandDobYear(yearDigits, { finalizeYear })
  return [month, day, year].filter(Boolean).join('/')
}

function expandDobYear(yearDigits, { finalizeYear = false } = {}) {
  if (yearDigits.length !== 2) return yearDigits
  if (!finalizeYear && (yearDigits === '19' || yearDigits === '20')) return yearDigits

  const currentYear = new Date().getFullYear()
  const currentCentury = Math.floor(currentYear / 100) * 100
  const previousCentury = currentCentury - 100
  const year = Number(yearDigits)
  const pivot = currentYear % 100
  return String((year <= pivot ? currentCentury : previousCentury) + year)
}

function formatDobPart(value, { maxLength, max, finalize = false } = {}) {
  const digits = String(value ?? '').replace(/\D/g, '').slice(0, maxLength)
  if (!digits) return ''
  if (digits.length === 1 && (finalize || Number(digits) > Math.floor(max / 10))) {
    return `0${digits}`
  }
  return digits
}

function DobPartMask({ value, format }) {
  return (
    <div className="a1-field__mask-overlay" aria-hidden="true">
      <span className="a1-field__mask-typed">{value}</span>
      <span className="a1-field__mask-placeholder">{format.slice(value.length)}</span>
    </div>
  )
}

function AutoformatExperiment({ t, description }) {
  const [value, setValue] = useState('')

  return (
    <ExperimentShell
      t={t}
      description={description}
      focus={t('app.labs.dobAutoformatFocus', 'Whether people can type naturally without needing leading zeroes or separate fields.')}
      watch={t('app.labs.dobAutoformatWatch', 'Whether auto-inserted slashes and month detection help or surprise people.')}
    >
      <TextField
        label={t('app.labs.dobFieldLabel', 'Date of birth')}
        hint={t('app.labs.dobAutoformatHint', 'Type digits only. For example, 61279 becomes 06/12/1979 and 61211 becomes 06/12/2011.')}
        inputMode="numeric"
        autoComplete="bday"
        value={value}
        inputOverlay={(
          <div className="a1-field__mask-overlay" aria-hidden="true">
            <span className="a1-field__mask-typed">{value}</span>
            <span className="a1-field__mask-placeholder">{DOB_FORMAT.slice(value.length)}</span>
          </div>
        )}
        onChange={(event) => setValue(formatDobInput(event.target.value))}
        onBlur={(event) => setValue(formatDobInput(event.target.value, { finalizeYear: true }))}
      />
      <Paragraph size="sm" color="muted">
        {t('app.labs.normalizedValueLabel', 'Normalized value')}: {value || t('app.labs.emptyValue', 'No value yet')}
      </Paragraph>
    </ExperimentShell>
  )
}

function AutoformatFieldsExperiment({ t, description }) {
  const [month, setMonth] = useState('')
  const [day, setDay] = useState('')
  const [year, setYear] = useState('')
  const dayRef = useRef(null)
  const yearRef = useRef(null)
  const normalizedValue = [month, day, year].filter(Boolean).join('/')

  function handleMonthChange(event) {
    const nextMonth = formatDobPart(event.target.value, { maxLength: 2, max: 12 })
    setMonth(nextMonth)
    if (nextMonth.length === 2) {
      dayRef.current?.focus()
      dayRef.current?.select?.()
    }
  }

  function handleDayChange(event) {
    const nextDay = formatDobPart(event.target.value, { maxLength: 2, max: 31 })
    setDay(nextDay)
    if (nextDay.length === 2) {
      yearRef.current?.focus()
      yearRef.current?.select?.()
    }
  }

  return (
    <ExperimentShell
      t={t}
      description={description}
      focus={t('app.labs.dobAutoformatFieldsFocus', 'Whether separate fields keep the clarity of labels while preserving fast, forgiving date entry.')}
      watch={t('app.labs.dobAutoformatFieldsWatch', 'Whether automatic zero-padding, focus movement, and year expansion feel helpful or too active.')}
    >
      <Fieldset legend={t('app.labs.dobFieldLabel', 'Date of birth')}>
        <FieldRow>
          <TextField
            label={t('app.labs.monthLabel', 'Month')}
            inputMode="numeric"
            autoComplete="bday-month"
            value={month}
            inputOverlay={<DobPartMask value={month} format="MM" />}
            onChange={handleMonthChange}
            onBlur={(event) => setMonth(formatDobPart(event.target.value, { maxLength: 2, max: 12, finalize: true }))}
          />
          <TextField
            ref={dayRef}
            label={t('app.labs.dayLabel', 'Day')}
            inputMode="numeric"
            autoComplete="bday-day"
            value={day}
            inputOverlay={<DobPartMask value={day} format="DD" />}
            onChange={handleDayChange}
            onBlur={(event) => setDay(formatDobPart(event.target.value, { maxLength: 2, max: 31, finalize: true }))}
          />
          <TextField
            ref={yearRef}
            label={t('app.labs.yearLabel', 'Year')}
            inputMode="numeric"
            autoComplete="bday-year"
            value={year}
            inputOverlay={<DobPartMask value={year} format="YYYY" />}
            onChange={(event) => setYear(expandDobYear(event.target.value.replace(/\D/g, '').slice(0, 4)))}
            onBlur={(event) => setYear(expandDobYear(event.target.value.replace(/\D/g, '').slice(0, 4), { finalizeYear: true }))}
          />
        </FieldRow>
      </Fieldset>
      <Paragraph size="sm" color="muted">
        {t('app.labs.normalizedValueLabel', 'Normalized value')}: {normalizedValue || t('app.labs.emptyValue', 'No value yet')}
      </Paragraph>
    </ExperimentShell>
  )
}
