# @gtivr4/a1-design-system-react — Agent Update Guide

This file records prop renames, value changes, and removals by version so agents can mechanically update consuming code. Each entry includes the exact find/replace or code transformation needed.

---

## Released — 0.4.1

### Calendar: `selectable` prop required to enable date selection

Date selection is now opt-in. Pass `selectable` to enable click/keyboard interaction on day cells. Without it the calendar is display-only — no click handlers, hover states, or focus management on day cells.

Out-of-range dates (outside `minDate` / `maxDate`) are unconditionally blocked from selection even when `selectable` is true.

```jsx
// Before (broken — clicking had no effect without selectable)
<Calendar variant="paginated" selectedDate={date} onChange={setDate} />

// After
<Calendar variant="paginated" selectable selectedDate={date} onChange={setDate} />
```

---

## Released — 0.4.0

### Tab: `status="warning"` → `status="warn"`

All other components use `"warn"`. Tab incorrectly used `"warning"`.

```
Find:    status="warning"     (on <Tab> elements only)
Replace: status="warn"
```

TypeScript signature change:
```ts
// Before
status?: "completed" | "error" | "warning"
// After
status?: "completed" | "error" | "warn"
```

---

### Section: `alignment` prop → `align`

Every other component uses `align`. Section used `alignment`.

```
Find:    alignment=
Replace: align=
```

TypeScript signature change:
```ts
// Before
alignment?: "left" | "center" | "right" | Partial<Record<...>>
// After
align?: "left" | "center" | "right" | Partial<Record<...>>
```

---

### Notification: `variant` → `status`, `"default"` → `"neutral"`

Notification used `variant` for a concept every other component expresses as `status`. The default value `"default"` is also renamed to `"neutral"` to match the system-wide status vocabulary.

```
Find:    <Notification variant=
Replace: <Notification status=
```

Value mapping:
```
"default"  → "neutral"   ← value rename required
"error"    → "error"
"success"  → "success"
"warn"     → "warn"
"info"     → "info"
```

---

### Heading / Paragraph: `align` now accepts `"start"` and `"end"`

Logical alias values added. No breaking change — `"left"` and `"right"` still work.

```
New valid values: "start" | "end"
```

---

### TextField / TextareaField / SelectField / Fieldset: `labelPosition="side"` → `"before"`

The value `"side"` was renamed to `"before"` to align with the logical direction vocabulary used by StatusBar and Switch.

```
Find:    labelPosition="side"
Replace: labelPosition="before"
```

TypeScript signature change:
```ts
// Before
labelPosition?: "above" | "side"
// After
labelPosition?: "above" | "before"
```

---

### Grid: `gap` now accepts `"xs"`

`"xs"` (4px) was added to the semantic gap scale. No breaking change.

---

### SegmentedControl: `size` typed as `"sm" | "md" | "lg"`

No runtime change. TypeScript-only fix. A `SegmentedControl.d.ts` file is now shipped. Update any `size` prop assignments that relied on the loose `string` type.

---

### StatusBar: pause button replaced with `<Button size="sm" variant="secondary">`

The indeterminate loading animation's pause/play toggle was previously rendered as a bare `<button>` element with custom CSS. It is now a standard `Button` component at `size="sm"` and `variant="secondary"`.

No prop change. The visual change is that the control now shows a text label ("Pause" or "Play") alongside the icon instead of being icon-only.

Labels are sourced from the system label system (`system/labels/status-bar.json`). Pass a `LabelsProvider` with `locale` to translate the button labels. New label keys:

| Key | Default | Purpose |
|-----|---------|---------|
| `statusBar.pause` | "Pause" | Label when the animation is running |
| `statusBar.play`  | "Play"  | Label when the animation is paused |

---

### DataTable: `density` prop → `size`, `"auto"` value removed

`density` was renamed to `size` to match the design system convention. The `"auto"` value (automatic density selection based on container width) is now the **default behavior when `size` is omitted**.

```
Find:    density=
Replace: size=
```

Value mapping:
```
density="auto"        → omit size entirely (auto is now the default)
density="comfortable" → size="comfortable"
density="default"     → size="default"
density="compact"     → size="compact"
```

TypeScript signature change:
```ts
// Before
density?: "auto" | "comfortable" | "default" | "compact"
// After
size?: "comfortable" | "default" | "compact"  // omit for auto
```

---

## Released — 0.3.x

No prop renames in this range.
