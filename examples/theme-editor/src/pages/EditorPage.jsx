import React, { useMemo, useState } from "react";
import {
  Banner,
  Button,
  ButtonContainer,
  Card,
  CheckboxGroup,
  Divider,
  Heading,
  Paragraph,
  RadioGroup,
  SelectField,
  Switch,
  TextField,
} from "../../../../packages/react/src/index.js";
import { AppHeader } from "../components/AppHeader.jsx";
import {
  DEFAULT_COLORS,
  RAMP_LABELS,
  RAMP_NAMES,
  RAMP_STOPS,
  allRampsToCssVars,
  generateColorRamp,
  generateCssString,
} from "../lib/colorUtils.js";

function RampEditor({ name, label, hex, onChange }) {
  const ramp = useMemo(() => generateColorRamp(hex), [hex]);

  return (
    <div className="theme-ramp-editor">
      <div className="theme-ramp-editor__header">
        <label className="theme-ramp-editor__label" htmlFor={`color-${name}`}>
          {label}
        </label>
        <div className="theme-ramp-editor__picker-wrap">
          <input
            id={`color-${name}`}
            type="color"
            className="theme-ramp-editor__input"
            value={hex}
            onChange={(e) => onChange(e.target.value)}
            onInput={(e) => onChange(e.target.value)}
          />
          <span className="theme-ramp-editor__hex">{hex}</span>
        </div>
      </div>
      {ramp && (
        <div className="theme-ramp-editor__swatches">
          {RAMP_STOPS.map((stop) => (
            <div
              key={stop}
              className="theme-ramp-editor__swatch"
              style={{ background: ramp[stop] }}
              title={`${name}-${stop}: ${ramp[stop]}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ComponentPreview() {
  const [textValue, setTextValue] = useState("");
  const [selectValue, setSelectValue] = useState("");
  const [switchOn, setSwitchOn] = useState(false);

  return (
    <div className="theme-preview-components">
      <section className="theme-preview-section">
        <Heading as="h3" size="xs" className="theme-preview-section__title">Buttons</Heading>
        <div className="theme-preview-row">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="tertiary">Tertiary</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
        <div className="theme-preview-row">
          <Button size="sm">Small</Button>
          <Button size="sm" variant="secondary" icon="add" iconPosition="start">Add item</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <Divider />

      <section className="theme-preview-section">
        <Heading as="h3" size="xs" className="theme-preview-section__title">Form fields</Heading>
        <div className="theme-preview-fields">
          <TextField
            label="Label"
            placeholder="Enter text…"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
          />
          <SelectField
            label="Select"
            value={selectValue}
            onChange={(e) => setSelectValue(e.target.value)}
          >
            <option value="">— choose —</option>
            <option value="a">Option A</option>
            <option value="b">Option B</option>
            <option value="c">Option C</option>
          </SelectField>
          <TextField
            label="With error"
            value=""
            onChange={() => {}}
            errorMessage="This field is required."
          />
        </div>
      </section>

      <Divider />

      <section className="theme-preview-section">
        <Heading as="h3" size="xs" className="theme-preview-section__title">Controls</Heading>
        <div className="theme-preview-controls">
          <Switch
            label="Enable feature"
            checked={switchOn}
            onChange={setSwitchOn}
          />
          <CheckboxGroup
            legend="Preferences"
            options={[
              { value: "a", label: "Option A" },
              { value: "b", label: "Option B" },
              { value: "c", label: "Option C" },
            ]}
            value={[]}
            onChange={() => {}}
          />
          <RadioGroup
            legend="Priority"
            options={[
              { value: "high", label: "High" },
              { value: "medium", label: "Medium" },
              { value: "low", label: "Low" },
            ]}
            value=""
            onChange={() => {}}
          />
        </div>
      </section>

      <Divider />

      <section className="theme-preview-section">
        <Heading as="h3" size="xs" className="theme-preview-section__title">Banners</Heading>
        <div className="theme-preview-banners">
          <Banner status="info" title="Information">Something you should know about this action.</Banner>
          <Banner status="success" title="Success">Your changes have been saved successfully.</Banner>
          <Banner status="warn" title="Warning">This action may have unintended consequences.</Banner>
          <Banner status="error" title="Error">Something went wrong. Please try again.</Banner>
        </div>
      </section>

      <Divider />

      <section className="theme-preview-section">
        <Heading as="h3" size="xs" className="theme-preview-section__title">Cards</Heading>
        <div className="theme-preview-cards">
          <Card heroIcon="palette" heroColor="action">
            <Heading as="h4" size="sm">Custom themes</Heading>
            <Paragraph size="sm" color="muted">
              Every component adapts automatically when you change a palette color.
            </Paragraph>
            <ButtonContainer>
              <Button size="sm">Learn more</Button>
              <Button size="sm" variant="secondary">Dismiss</Button>
            </ButtonContainer>
          </Card>
          <Card heroIcon="check_circle" heroColor="success">
            <Heading as="h4" size="sm">OKLCH color space</Heading>
            <Paragraph size="sm" color="muted">
              Ramps are generated in perceptual OKLCH so contrast ratios stay consistent
              across hues.
            </Paragraph>
          </Card>
        </div>
      </section>
    </div>
  );
}

export function EditorPage({ onNavigate }) {
  const [colors, setColors] = useState(DEFAULT_COLORS);
  const [copied, setCopied] = useState(false);

  const themeVars = useMemo(() => allRampsToCssVars(colors), [colors]);

  function updateColor(rampName, hex) {
    setColors((prev) => ({ ...prev, [rampName]: hex }));
  }

  function copyCss() {
    const css = generateCssString(colors);
    navigator.clipboard.writeText(css).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="theme-editor">
      <AppHeader page="editor" onNavigate={onNavigate}>
        <Button
          size="sm"
          variant="secondary"
          icon={copied ? "check" : "content_copy"}
          iconPosition="start"
          onClick={copyCss}
        >
          {copied ? "Copied!" : "Copy CSS"}
        </Button>
      </AppHeader>

      <div className="theme-editor__body">
        <aside className="theme-editor__sidebar">
          <div className="theme-editor__sidebar-header">
            <Heading as="h2" size="sm">Color ramps</Heading>
            <Paragraph size="sm" color="muted">
              Set the -500 value for each ramp. The full 12-stop scale generates automatically.
            </Paragraph>
          </div>

          <div className="theme-editor__ramps">
            {RAMP_NAMES.map((name) => (
              <RampEditor
                key={name}
                name={name}
                label={RAMP_LABELS[name]}
                hex={colors[name]}
                onChange={(hex) => updateColor(name, hex)}
              />
            ))}
          </div>
        </aside>

        <main className="theme-editor__preview">
          <div className="theme-editor__preview-header">
            <Heading as="h2" size="sm">Component preview</Heading>
            <Paragraph size="sm" color="muted">
              All components below use your custom theme.
            </Paragraph>
          </div>
          <div style={themeVars} className="theme-editor__preview-canvas">
            <ComponentPreview />
          </div>
        </main>
      </div>
    </div>
  );
}
