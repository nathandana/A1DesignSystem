import React, { useContext, useMemo, useState } from "react";
import {
  Accordion,
  Banner,
  Breadcrumb,
  Button,
  ButtonContainer,
  Card,
  CheckboxGroup,
  Dialog,
  Divider,
  Heading,
  Icon,
  IconButton,
  Link,
  List,
  ListItem,
  MessageBadge,
  Pagination,
  Paragraph,
  RadioGroup,
  Section,
  SegmentedControl,
  SelectField,
  Snackbar,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextField,
  TextareaField,
} from "../../../../packages/react/src/index.js";
import { DEFAULT_COLORS, generateColorRamp, RAMP_LABELS, RAMP_NAMES, RAMP_STOPS } from "./colorUtils.js";
import { ThemeContext } from "./ThemeContext.js";

// ─── Example helpers ──────────────────────────────────────

function Ex({ label, children }) {
  return (
    <div className="ex-section">
      <span className="ex-section__label">{label}</span>
      <div className="ex-section__body">{children}</div>
    </div>
  );
}

function Row({ children, wrap = true, align = "center", gap = 12 }) {
  return (
    <div
      className="ex-row"
      style={{ flexWrap: wrap ? "wrap" : "nowrap", alignItems: align, gap }}
    >
      {children}
    </div>
  );
}

function Col({ children, gap = 16 }) {
  return <div className="ex-col" style={{ gap }}>{children}</div>;
}

// ─── Foundations ──────────────────────────────────────────

function ColorExample() {
  const { colors, updateColor } = useContext(ThemeContext);

  const ramps = useMemo(() => {
    const result = {};
    for (const [name, hex] of Object.entries(colors)) {
      result[name] = generateColorRamp(hex);
    }
    return result;
  }, [colors]);

  return (
    <div className="color-ramp-editor-list">
      {RAMP_NAMES.map((name) => {
        const ramp = ramps[name];
        const isModified = colors[name] !== DEFAULT_COLORS[name];
        return (
          <div key={name} className="color-ramp-editor">
            <div className="color-ramp-editor__header">
              <label className="color-ramp-editor__name" htmlFor={`ramp-${name}`}>
                {RAMP_LABELS[name]}
              </label>
              <div className="color-ramp-editor__controls">
                <div className="color-ramp-editor__picker-wrap">
                  <input
                    id={`ramp-${name}`}
                    type="color"
                    className="color-ramp-editor__input"
                    value={colors[name]}
                    onChange={(e) => updateColor(name, e.target.value)}
                    onInput={(e) => updateColor(name, e.target.value)}
                  />
                  <span className="color-ramp-editor__stop-badge">500</span>
                </div>
                <span className="color-ramp-editor__hex">{colors[name]}</span>
                {isModified && (
                  <button
                    type="button"
                    className="color-ramp-editor__reset"
                    onClick={() => updateColor(name, DEFAULT_COLORS[name])}
                    title="Reset to default"
                  >
                    ↩
                  </button>
                )}
              </div>
            </div>
            <div className="color-ramp-editor__swatches">
              {RAMP_STOPS.map((stop) => (
                <div
                  key={stop}
                  className="color-ramp-editor__swatch"
                  style={{ background: ramp ? ramp[stop] : `var(--base-color-${name}-${stop})` }}
                  title={`${name}-${stop}: ${ramp?.[stop] ?? ""}`}
                >
                  <span className="color-ramp-editor__swatch-stop">{stop}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TypographyExample() {
  return (
    <div>
      <Ex label="Headings">
        {(["xl", "lg", "md", "sm", "xs"]).map((size) => (
          <div key={size} className="ex-type-row">
            <span className="ex-type-label">heading-{size}</span>
            <Heading as="p" size={size}>The quick brown fox</Heading>
          </div>
        ))}
      </Ex>
      <Ex label="Paragraphs">
        {(["xl", "lg", "md", "sm", "xs"]).map((size) => (
          <div key={size} className="ex-type-row">
            <span className="ex-type-label">body-{size}</span>
            <Paragraph size={size}>
              Waltz, bad nymph, for quick jigs vex.
            </Paragraph>
          </div>
        ))}
      </Ex>
      <Ex label="Link">
        <Row>
          <Link href="#">Default link</Link>
          <Link href="#" icon="arrow_forward">With icon</Link>
          <Link href="#" icon="open_in_new" iconPosition="end">External</Link>
        </Row>
      </Ex>
    </div>
  );
}

// ─── Actions ──────────────────────────────────────────────

const BUTTON_VARIANTS = [
  { variant: undefined, label: "Primary" },
  { variant: "secondary", label: "Secondary" },
  { variant: "tertiary", label: "Tertiary" },
  { variant: "destructive", label: "Destructive" },
];

function ButtonExample() {
  return (
    <div>
      <Ex label="States">
        <div className="ex-button-states">
          <div className="ex-button-states__head">
            <span />
            <span>Default</span>
            <span>Hover</span>
            <span>Active</span>
            <span>Disabled</span>
          </div>
          {BUTTON_VARIANTS.map(({ variant, label }) => (
            <div key={label} className="ex-button-states__row">
              <span className="ex-button-states__label">{label}</span>
              <Button variant={variant}>{label}</Button>
              <Button variant={variant} className="a1-button--state-hover">{label}</Button>
              <Button variant={variant} className="a1-button--state-active">{label}</Button>
              <Button variant={variant} disabled>{label}</Button>
            </div>
          ))}
        </div>
      </Ex>
      <Ex label="Sizes">
        <Row align="center">
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
        </Row>
      </Ex>
      <Ex label="With icon">
        <Row>
          <Button icon="add" iconPosition="start">Add item</Button>
          <Button icon="arrow_forward" iconPosition="end">Continue</Button>
          <Button variant="secondary" icon="download" iconPosition="start">Export</Button>
          <Button variant="destructive" icon="delete" iconPosition="start">Delete</Button>
        </Row>
      </Ex>
    </div>
  );
}

function makeButtonVariantExample(variant, label) {
  return function VariantExample() {
    return (
      <div>
        <Ex label="States">
          <div className="ex-button-states">
            <div className="ex-button-states__head">
              <span />
              <span>Default</span>
              <span>Hover</span>
              <span>Active</span>
              <span>Disabled</span>
            </div>
            <div className="ex-button-states__row">
              <span className="ex-button-states__label">{label}</span>
              <Button variant={variant}>{label}</Button>
              <Button variant={variant} className="a1-button--state-hover">{label}</Button>
              <Button variant={variant} className="a1-button--state-active">{label}</Button>
              <Button variant={variant} disabled>{label}</Button>
            </div>
          </div>
        </Ex>
        <Ex label="With icon">
          <Row>
            <Button variant={variant} icon="add" iconPosition="start">Add item</Button>
            <Button variant={variant} icon="arrow_forward" iconPosition="end">Continue</Button>
          </Row>
        </Ex>
      </div>
    );
  };
}

function ButtonSizesExample() {
  const SIZES = [
    { size: "sm", label: "Sm" },
    { size: undefined, label: "Md" },
    { size: "lg", label: "Lg" },
  ];
  return (
    <div>
      <Ex label="Sizes">
        <div className="ex-button-states">
          <div className="ex-button-states__head">
            <span />
            <span>Default</span>
            <span>Hover</span>
            <span>Active</span>
            <span>Disabled</span>
          </div>
          {SIZES.map(({ size, label }) => (
            <div key={label} className="ex-button-states__row">
              <span className="ex-button-states__label">{label}</span>
              <Button size={size}>Button</Button>
              <Button size={size} className="a1-button--state-hover">Button</Button>
              <Button size={size} className="a1-button--state-active">Button</Button>
              <Button size={size} disabled>Button</Button>
            </div>
          ))}
        </div>
      </Ex>
    </div>
  );
}

function makeBannerVariantExample(status, title) {
  return function BannerVariantExample() {
    return (
      <div>
        <Ex label="Default">
          <Banner status={status} title={title}>Something worth knowing about this action.</Banner>
        </Ex>
        <Ex label="Without title">
          <Banner status={status}>A simple informational note.</Banner>
        </Ex>
        <Ex label="Dismissable">
          <Banner status={status} title={title} onDismiss={() => {}}>This banner can be dismissed.</Banner>
        </Ex>
      </div>
    );
  };
}

function IconButtonExample() {
  return (
    <div>
      <Ex label="Variants">
        <Row>
          <IconButton icon="star" label="Favorite" />
          <IconButton icon="settings" label="Settings" variant="secondary" />
          <IconButton icon="close" label="Close" variant="tertiary" />
          <IconButton icon="delete" label="Delete" variant="destructive" />
        </Row>
      </Ex>
      <Ex label="Sizes">
        <Row align="center">
          <IconButton icon="add" label="Add (small)" size="sm" />
          <IconButton icon="add" label="Add (default)" />
          <IconButton icon="add" label="Add (large)" size="lg" />
        </Row>
      </Ex>
    </div>
  );
}

// ─── Forms ────────────────────────────────────────────────

function TextFieldExample() {
  const [v, setV] = useState("");
  return (
    <div>
      <Ex label="Default">
        <Col>
          <TextField label="Label" placeholder="Placeholder text" value={v} onChange={(e) => setV(e.target.value)} />
          <TextField label="With help" helpText="Some additional guidance for this field." value="" onChange={() => {}} />
          <TextField label="Required" required value="" onChange={() => {}} />
        </Col>
      </Ex>
      <Ex label="States">
        <Col>
          <TextField label="Error" value="Invalid entry" errorMessage="This field has an error." onChange={() => {}} />
          <TextField label="Read only" value="Read-only value" readOnly onChange={() => {}} />
          <TextField label="Disabled" value="Disabled field" disabled onChange={() => {}} />
        </Col>
      </Ex>
      <Ex label="Sizes">
        <Col>
          <TextField label="Compact" size="compact" placeholder="Compact field" value="" onChange={() => {}} />
          <TextField label="Default" placeholder="Default field" value="" onChange={() => {}} />
          <TextField label="Comfortable" size="comfortable" placeholder="Comfortable field" value="" onChange={() => {}} />
        </Col>
      </Ex>
    </div>
  );
}

function SelectFieldExample() {
  const [v, setV] = useState("");
  return (
    <div>
      <Ex label="Default">
        <Col>
          <SelectField label="Select an option" value={v} onChange={(e) => setV(e.target.value)}>
            <option value="">— choose —</option>
            <option value="a">Option A</option>
            <option value="b">Option B</option>
            <option value="c">Option C</option>
          </SelectField>
          <SelectField label="With help" helpText="Pick the best option." value="" onChange={() => {}}>
            <option value="">— choose —</option>
            <option value="a">Option A</option>
          </SelectField>
          <SelectField label="With error" value="" errorMessage="Please select an option." onChange={() => {}}>
            <option value="">— choose —</option>
          </SelectField>
        </Col>
      </Ex>
    </div>
  );
}

function SwitchExample() {
  const [checked1, setChecked1] = useState(true);
  const [checked2, setChecked2] = useState(false);
  return (
    <div>
      <Ex label="States">
        <Col gap={8}>
          <Switch label="Enabled (on)" checked={checked1} onChange={setChecked1} />
          <Switch label="Enabled (off)" checked={checked2} onChange={setChecked2} />
          <Switch label="Disabled (on)" checked disabled onChange={() => {}} />
          <Switch label="Disabled (off)" checked={false} disabled onChange={() => {}} />
        </Col>
      </Ex>
      <Ex label="Sizes">
        <Col gap={8}>
          <Switch label="Compact" size="compact" checked onChange={() => {}} />
          <Switch label="Default" checked onChange={() => {}} />
          <Switch label="Comfortable" size="comfortable" checked onChange={() => {}} />
        </Col>
      </Ex>
    </div>
  );
}

function CheckboxGroupExample() {
  const [v, setV] = useState(["a"]);
  return (
    <div>
      <Ex label="Default">
        <CheckboxGroup
          legend="Preferences"
          options={[
            { value: "a", label: "Option A" },
            { value: "b", label: "Option B" },
            { value: "c", label: "Option C", helpText: "With help text" },
          ]}
          value={v}
          onChange={setV}
        />
      </Ex>
      <Ex label="With error">
        <CheckboxGroup
          legend="Required group"
          options={[
            { value: "x", label: "Choice X" },
            { value: "y", label: "Choice Y" },
          ]}
          value={[]}
          onChange={() => {}}
          errorMessage="Please select at least one option."
        />
      </Ex>
    </div>
  );
}

function RadioGroupExample() {
  const [v, setV] = useState("b");
  return (
    <div>
      <Ex label="Default">
        <RadioGroup
          legend="Choose one"
          options={[
            { value: "a", label: "Option A" },
            { value: "b", label: "Option B" },
            { value: "c", label: "Option C", helpText: "With help text" },
          ]}
          value={v}
          onChange={setV}
        />
      </Ex>
    </div>
  );
}

// ─── Navigation ───────────────────────────────────────────

function TabsExample() {
  const [line, setLine] = useState("tab1");
  const [folder, setFolder] = useState("tab1");
  return (
    <div>
      <Ex label="Line variant">
        <Tabs value={line} onChange={setLine} variant="line">
          <TabList>
            <Tab value="tab1">Overview</Tab>
            <Tab value="tab2">Details</Tab>
            <Tab value="tab3">History</Tab>
          </TabList>
          <TabPanel value="tab1"><Paragraph>Content for the Overview tab.</Paragraph></TabPanel>
          <TabPanel value="tab2"><Paragraph>Content for the Details tab.</Paragraph></TabPanel>
          <TabPanel value="tab3"><Paragraph>Content for the History tab.</Paragraph></TabPanel>
        </Tabs>
      </Ex>
      <Ex label="Folder variant">
        <Tabs value={folder} onChange={setFolder} variant="folder">
          <TabList>
            <Tab value="tab1">Files</Tab>
            <Tab value="tab2">Versions</Tab>
            <Tab value="tab3">Comments</Tab>
          </TabList>
          <TabPanel value="tab1"><Paragraph>Your files appear here.</Paragraph></TabPanel>
          <TabPanel value="tab2"><Paragraph>Version history appears here.</Paragraph></TabPanel>
          <TabPanel value="tab3"><Paragraph>Comments appear here.</Paragraph></TabPanel>
        </Tabs>
      </Ex>
    </div>
  );
}

function BreadcrumbExample() {
  return (
    <div>
      <Ex label="Three levels">
        <Breadcrumb
          items={[
            { label: "Dashboard", onClick: () => {} },
            { label: "Projects", onClick: () => {} },
            { label: "Current project" },
          ]}
        />
      </Ex>
      <Ex label="Two levels">
        <Breadcrumb
          items={[
            { label: "Settings", onClick: () => {} },
            { label: "Notifications" },
          ]}
        />
      </Ex>
      <Ex label="With href">
        <Breadcrumb
          items={[
            { label: "Home", href: "#" },
            { label: "Catalog", href: "#" },
            { label: "Item detail" },
          ]}
        />
      </Ex>
    </div>
  );
}

function PaginationExample() {
  const [page, setPage] = useState(3);
  return (
    <div>
      <Ex label="Default">
        <Pagination page={page} totalPages={12} onChange={setPage} />
      </Ex>
      <Ex label="Few pages">
        <Pagination page={1} totalPages={3} onChange={() => {}} />
      </Ex>
    </div>
  );
}

function SegmentedControlExample() {
  const [v1, setV1] = useState("list");
  const [v2, setV2] = useState("system");
  return (
    <div>
      <Ex label="Default">
        <SegmentedControl
          options={[
            { value: "list", label: "List" },
            { value: "grid", label: "Grid" },
            { value: "board", label: "Board" },
          ]}
          value={v1}
          onChange={setV1}
        />
      </Ex>
      <Ex label="With icons">
        <SegmentedControl
          options={[
            { value: "light", icon: "light_mode", label: "Light" },
            { value: "dark", icon: "dark_mode", label: "Dark" },
            { value: "system", icon: "computer", label: "System" },
          ]}
          value={v2}
          onChange={setV2}
        />
      </Ex>
    </div>
  );
}

// ─── Feedback ─────────────────────────────────────────────

function BannerExample() {
  return (
    <div>
      <Ex label="Inline banners">
        <Col gap={8}>
          <Banner status="info" title="Information">Something worth knowing about this action.</Banner>
          <Banner status="success" title="Success">Your changes have been saved.</Banner>
          <Banner status="warn" title="Warning">This may have unintended side effects.</Banner>
          <Banner status="error" title="Error">Something went wrong. Please try again.</Banner>
        </Col>
      </Ex>
      <Ex label="Without title">
        <Col gap={8}>
          <Banner status="info">A simple informational note.</Banner>
          <Banner status="error">An error occurred.</Banner>
        </Col>
      </Ex>
      <Ex label="Dismissable">
        <Col gap={8}>
          <Banner status="info" title="Dismissable" onDismiss={() => {}}>
            This banner can be dismissed.
          </Banner>
          <Banner status="success" onDismiss={() => {}}>Saved — click to dismiss.</Banner>
        </Col>
      </Ex>
    </div>
  );
}

function DialogExample() {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  return (
    <div>
      <Ex label="Standard dialog">
        <Row>
          <Button onClick={() => setOpen(true)}>Open dialog</Button>
        </Row>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Dialog title"
          description="This is an optional description for the dialog."
          actions={
            <ButtonContainer>
              <Button onClick={() => setOpen(false)}>Confirm</Button>
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            </ButtonContainer>
          }
        >
          <Paragraph>Dialog body content goes here. It can include any layout or components.</Paragraph>
        </Dialog>
      </Ex>
      <Ex label="Destructive confirm">
        <Row>
          <Button variant="destructive" onClick={() => setConfirmOpen(true)}>Delete item</Button>
        </Row>
        <Dialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          title="Delete item?"
          description="This action cannot be undone."
          actions={
            <ButtonContainer>
              <Button variant="destructive" onClick={() => setConfirmOpen(false)}>Delete</Button>
              <Button variant="secondary" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            </ButtonContainer>
          }
        />
      </Ex>
    </div>
  );
}

function SnackbarExample() {
  const [open, setOpen] = useState(false);
  const [undoOpen, setUndoOpen] = useState(false);
  return (
    <div>
      <Ex label="Simple">
        <Row>
          <Button variant="secondary" onClick={() => setOpen(true)}>Show snackbar</Button>
        </Row>
        <Snackbar open={open} onClose={() => setOpen(false)}>Item saved successfully.</Snackbar>
      </Ex>
      <Ex label="With action">
        <Row>
          <Button variant="secondary" onClick={() => setUndoOpen(true)}>Show with action</Button>
        </Row>
        <Snackbar
          open={undoOpen}
          onClose={() => setUndoOpen(false)}
          actionLabel="Undo"
          onAction={() => setUndoOpen(false)}
        >
          Item deleted.
        </Snackbar>
      </Ex>
    </div>
  );
}

// ─── Display ──────────────────────────────────────────────

function CardExample() {
  return (
    <div>
      <Ex label="Default">
        <div className="ex-card-grid">
          <Card>
            <Heading as="h4" size="sm">Basic card</Heading>
            <Paragraph size="sm" color="muted">Card body content goes here.</Paragraph>
          </Card>
          <Card heroIcon="palette" heroColor="action">
            <Heading as="h4" size="sm">With hero icon</Heading>
            <Paragraph size="sm" color="muted">Cards support a coloured hero icon at the top.</Paragraph>
            <ButtonContainer>
              <Button size="sm">Action</Button>
            </ButtonContainer>
          </Card>
          <Card heroIcon="check_circle" heroColor="success">
            <Heading as="h4" size="sm">Success variant</Heading>
            <Paragraph size="sm" color="muted">Each semantic color has a hero variant.</Paragraph>
          </Card>
          <Card heroIcon="error" heroColor="error">
            <Heading as="h4" size="sm">Error variant</Heading>
            <Paragraph size="sm" color="muted">For alerts or destructive actions.</Paragraph>
          </Card>
        </div>
      </Ex>
    </div>
  );
}

function MessageBadgeExample() {
  return (
    <div>
      <Ex label="Badges">
        <Row>
          <MessageBadge status="info">Info</MessageBadge>
          <MessageBadge status="success">Success</MessageBadge>
          <MessageBadge status="warn">Warning</MessageBadge>
          <MessageBadge status="error">Error</MessageBadge>
          <MessageBadge status="neutral">Neutral</MessageBadge>
        </Row>
      </Ex>
    </div>
  );
}

function DividerExample() {
  return (
    <div>
      <Ex label="Horizontal">
        <Col gap={8}>
          <Paragraph size="sm">Content above</Paragraph>
          <Divider />
          <Paragraph size="sm">Content below</Paragraph>
        </Col>
      </Ex>
      <Ex label="With label">
        <Col gap={8}>
          <Paragraph size="sm">Content above</Paragraph>
          <Divider label="or" />
          <Paragraph size="sm">Content below</Paragraph>
        </Col>
      </Ex>
    </div>
  );
}

function AccordionExample() {
  const LOREM = "Waltz, bad nymph, for quick jigs vex. Pack my box with five dozen liquor jugs.";
  return (
    <div>
      <Ex label="Sizes">
        <Col gap={0}>
          {["sm", "md", "lg"].map((size) => (
            <Accordion key={size} label={`Size ${size}`} size={size} defaultOpen={size === "md"}>
              <div style={{ padding: "8px 12px 12px 12px" }}>
                <Paragraph size="sm">{LOREM}</Paragraph>
              </div>
            </Accordion>
          ))}
        </Col>
      </Ex>
      <Ex label="Multiple items">
        <Col gap={0}>
          <Accordion label="Getting started" defaultOpen>
            <div style={{ padding: "8px 12px 12px 12px" }}>
              <Paragraph size="sm">Begin by installing the package and importing the component you need.</Paragraph>
            </div>
          </Accordion>
          <Accordion label="Configuration">
            <div style={{ padding: "8px 12px 12px 12px" }}>
              <Paragraph size="sm">Pass tokens as CSS custom properties to override defaults.</Paragraph>
            </div>
          </Accordion>
          <Accordion label="Advanced usage">
            <div style={{ padding: "8px 12px 12px 12px" }}>
              <Paragraph size="sm">Use the controlled API with <code>open</code> and <code>onChange</code> for multi-panel coordination.</Paragraph>
            </div>
          </Accordion>
        </Col>
      </Ex>
      <Ex label="States">
        <Col gap={0}>
          <Accordion label="Disabled" disabled>
            <div style={{ padding: "8px 12px 12px 12px" }}>
              <Paragraph size="sm">This content is not reachable.</Paragraph>
            </div>
          </Accordion>
        </Col>
      </Ex>
    </div>
  );
}

function HeadingExample() {
  return (
    <div>
      <Ex label="Sizes">
        {["xl", "lg", "md", "sm", "xs"].map((size) => (
          <div key={size} className="ex-type-row">
            <span className="ex-type-label">{size}</span>
            <Heading as="p" size={size}>The quick brown fox jumps over the lazy dog</Heading>
          </div>
        ))}
      </Ex>
      <Ex label="As elements">
        <Col gap={4}>
          <Heading as="h1" size="lg">h1 heading</Heading>
          <Heading as="h2" size="md">h2 heading</Heading>
          <Heading as="h3" size="sm">h3 heading</Heading>
          <Heading as="h4" size="xs">h4 heading</Heading>
        </Col>
      </Ex>
    </div>
  );
}

function ParagraphExample() {
  return (
    <div>
      <Ex label="Sizes">
        {["xl", "lg", "md", "sm", "xs"].map((size) => (
          <div key={size} className="ex-type-row">
            <span className="ex-type-label">{size}</span>
            <Paragraph size={size}>
              The quick brown fox jumps over the lazy dog.
            </Paragraph>
          </div>
        ))}
      </Ex>
      <Ex label="Colors">
        <Col gap={4}>
          <Paragraph>Default text color</Paragraph>
          <Paragraph color="muted">Muted text color</Paragraph>
          <Paragraph color="accent">Accent text color</Paragraph>
        </Col>
      </Ex>
    </div>
  );
}

// ─── Token group definitions ──────────────────────────────

const BUTTON_TOKENS = [
  {
    label: "Shape",
    tokens: [
      { key: "--component-button-border-radius", label: "Border radius", type: "size" },
      { key: "--component-button-small-border-radius", label: "Border radius (sm)", type: "size" },
    ],
  },
  {
    label: "Spacing",
    tokens: [
      { key: "--component-button-padding-inline", label: "Padding inline", type: "size" },
      { key: "--component-button-padding-block", label: "Padding block", type: "size" },
      { key: "--component-button-gap", label: "Icon gap", type: "size" },
    ],
  },
  {
    label: "Height",
    tokens: [
      { key: "--component-button-small-height", label: "Small", type: "size" },
      { key: "--component-button-min-height", label: "Default", type: "size" },
      { key: "--component-button-large-height", label: "Large", type: "size" },
    ],
  },
  {
    label: "Focus ring",
    tokens: [
      { key: "--component-button-focus-ring", label: "Color", type: "color", suggestedRamp: "accent" },
      { key: "--component-button-focus-ring-width", label: "Width", type: "size" },
      { key: "--component-button-focus-ring-offset", label: "Offset", type: "size" },
    ],
  },
];

const PRIMARY_BUTTON_VARIANT_TOKENS = [
  {
    label: "Default",
    tokens: [
      { key: "--component-button-primary-background", label: "Background", type: "color", suggestedRamp: "accent" },
      { key: "--component-button-primary-foreground", label: "Text", type: "color", suggestedRamp: "neutral" },
      { key: "--component-button-primary-border", label: "Border", type: "color", suggestedRamp: "accent" },
    ],
  },
  {
    label: "Hover",
    tokens: [
      { key: "--component-button-primary-background-hover", label: "Background", type: "color", suggestedRamp: "accent" },
      { key: "--component-button-primary-foreground-hover", label: "Text", type: "color", suggestedRamp: "neutral" },
    ],
  },
  {
    label: "Active",
    tokens: [
      { key: "--component-button-primary-background-pressed", label: "Background", type: "color", suggestedRamp: "accent" },
      { key: "--component-button-primary-foreground-pressed", label: "Text", type: "color", suggestedRamp: "neutral" },
    ],
  },
];

const SECONDARY_BUTTON_VARIANT_TOKENS = [
  {
    label: "Default",
    tokens: [
      { key: "--component-button-secondary-background", label: "Background", type: "color", suggestedRamp: "neutral" },
      { key: "--component-button-secondary-foreground", label: "Text", type: "color", suggestedRamp: "accent" },
      { key: "--component-button-secondary-border", label: "Border", type: "color", suggestedRamp: "accent" },
    ],
  },
  {
    label: "Hover",
    tokens: [
      { key: "--component-button-secondary-background-hover", label: "Background", type: "color", suggestedRamp: "neutral" },
      { key: "--component-button-secondary-foreground-hover", label: "Text", type: "color", suggestedRamp: "accent" },
      { key: "--component-button-secondary-border-hover", label: "Border", type: "color", suggestedRamp: "accent" },
    ],
  },
  {
    label: "Active",
    tokens: [
      { key: "--component-button-secondary-background-pressed", label: "Background", type: "color", suggestedRamp: "neutral" },
      { key: "--component-button-secondary-foreground-pressed", label: "Text", type: "color", suggestedRamp: "accent" },
      { key: "--component-button-secondary-border-pressed", label: "Border", type: "color", suggestedRamp: "accent" },
    ],
  },
];

const TERTIARY_BUTTON_VARIANT_TOKENS = [
  {
    label: "Default",
    tokens: [
      { key: "--component-button-tertiary-background", label: "Background", type: "color", suggestedRamp: "neutral" },
      { key: "--component-button-tertiary-foreground", label: "Text", type: "color", suggestedRamp: "accent" },
      { key: "--component-button-tertiary-border", label: "Border", type: "color", suggestedRamp: "neutral" },
    ],
  },
  {
    label: "Hover",
    tokens: [
      { key: "--component-button-tertiary-background-hover", label: "Background", type: "color", suggestedRamp: "neutral" },
      { key: "--component-button-tertiary-foreground-hover", label: "Text", type: "color", suggestedRamp: "accent" },
      { key: "--component-button-tertiary-border-hover", label: "Border", type: "color", suggestedRamp: "neutral" },
    ],
  },
  {
    label: "Active",
    tokens: [
      { key: "--component-button-tertiary-background-pressed", label: "Background", type: "color", suggestedRamp: "neutral" },
      { key: "--component-button-tertiary-foreground-pressed", label: "Text", type: "color", suggestedRamp: "accent" },
      { key: "--component-button-tertiary-border-pressed", label: "Border", type: "color", suggestedRamp: "neutral" },
    ],
  },
];

const DESTRUCTIVE_BUTTON_VARIANT_TOKENS = [
  {
    label: "Default",
    tokens: [
      { key: "--semantic-color-status-error-background", label: "Background", type: "color", suggestedRamp: "error" },
      { key: "--semantic-color-status-error-foreground", label: "Text", type: "color", suggestedRamp: "neutral" },
    ],
  },
];

const BUTTON_SIZES_TOKENS = [
  {
    label: "Small",
    tokens: [
      { key: "--component-button-small-height", label: "Height", type: "size" },
      { key: "--component-button-small-border-radius", label: "Border radius", type: "size" },
    ],
  },
  {
    label: "Default",
    tokens: [
      { key: "--component-button-min-height", label: "Height", type: "size" },
      { key: "--component-button-border-radius", label: "Border radius", type: "size" },
      { key: "--component-button-padding-inline", label: "Padding inline", type: "size" },
    ],
  },
  {
    label: "Large",
    tokens: [{ key: "--component-button-large-height", label: "Height", type: "size" }],
  },
];

const FIELD_TOKENS = [
  {
    label: "Colors",
    tokens: [
      { key: "--component-field-focus-ring-color", label: "Focus ring", type: "color", suggestedRamp: "accent" },
      { key: "--a1-field-hover-background", label: "Hover background", type: "color", suggestedRamp: "neutral" },
      { key: "--a1-field-hover-border-color", label: "Hover border", type: "color", suggestedRamp: "neutral" },
      { key: "--a1-field-active-background", label: "Active background", type: "color", suggestedRamp: "neutral" },
      { key: "--a1-field-active-border-color", label: "Active border", type: "color", suggestedRamp: "neutral" },
      { key: "--semantic-color-border-strong", label: "Default border", type: "color", suggestedRamp: "neutral" },
    ],
  },
  {
    label: "Shape",
    tokens: [
      { key: "--component-field-default-border-radius", label: "Border radius", type: "size" },
      { key: "--component-field-default-height", label: "Default height", type: "size" },
    ],
  },
];

const BANNER_TOKENS = [
  {
    label: "Info",
    tokens: [
      { key: "--semantic-color-status-info-background", label: "Background", type: "color", suggestedRamp: "info" },
      { key: "--semantic-color-status-info-surface", label: "Surface", type: "color", suggestedRamp: "info" },
      { key: "--semantic-color-status-info-border", label: "Border", type: "color", suggestedRamp: "info" },
      { key: "--semantic-color-status-info-foreground", label: "Icon/text", type: "color", suggestedRamp: "info" },
    ],
  },
  {
    label: "Success",
    tokens: [
      { key: "--semantic-color-status-success-background", label: "Background", type: "color", suggestedRamp: "success" },
      { key: "--semantic-color-status-success-surface", label: "Surface", type: "color", suggestedRamp: "success" },
      { key: "--semantic-color-status-success-border", label: "Border", type: "color", suggestedRamp: "success" },
    ],
  },
  {
    label: "Warning",
    tokens: [
      { key: "--semantic-color-status-warn-background", label: "Background", type: "color", suggestedRamp: "warn" },
      { key: "--semantic-color-status-warn-surface", label: "Surface", type: "color", suggestedRamp: "warn" },
      { key: "--semantic-color-status-warn-border", label: "Border", type: "color", suggestedRamp: "warn" },
    ],
  },
  {
    label: "Error",
    tokens: [
      { key: "--semantic-color-status-error-background", label: "Background", type: "color", suggestedRamp: "error" },
      { key: "--semantic-color-status-error-surface", label: "Surface", type: "color", suggestedRamp: "error" },
      { key: "--semantic-color-status-error-border", label: "Border", type: "color", suggestedRamp: "error" },
    ],
  },
];

const INFO_BANNER_VARIANT_TOKENS = [
  { label: "Info", tokens: [
    { key: "--semantic-color-status-info-background", label: "Background", type: "color", suggestedRamp: "info" },
    { key: "--semantic-color-status-info-surface", label: "Surface", type: "color", suggestedRamp: "info" },
    { key: "--semantic-color-status-info-border", label: "Border", type: "color", suggestedRamp: "info" },
    { key: "--semantic-color-status-info-foreground", label: "Icon/text", type: "color", suggestedRamp: "info" },
  ]},
];
const SUCCESS_BANNER_VARIANT_TOKENS = [
  { label: "Success", tokens: [
    { key: "--semantic-color-status-success-background", label: "Background", type: "color", suggestedRamp: "success" },
    { key: "--semantic-color-status-success-surface", label: "Surface", type: "color", suggestedRamp: "success" },
    { key: "--semantic-color-status-success-border", label: "Border", type: "color", suggestedRamp: "success" },
    { key: "--semantic-color-status-success-foreground", label: "Icon/text", type: "color", suggestedRamp: "success" },
  ]},
];
const WARN_BANNER_VARIANT_TOKENS = [
  { label: "Warning", tokens: [
    { key: "--semantic-color-status-warn-background", label: "Background", type: "color", suggestedRamp: "warn" },
    { key: "--semantic-color-status-warn-surface", label: "Surface", type: "color", suggestedRamp: "warn" },
    { key: "--semantic-color-status-warn-border", label: "Border", type: "color", suggestedRamp: "warn" },
    { key: "--semantic-color-status-warn-foreground", label: "Icon/text", type: "color", suggestedRamp: "warn" },
  ]},
];
const ERROR_BANNER_VARIANT_TOKENS = [
  { label: "Error", tokens: [
    { key: "--semantic-color-status-error-background", label: "Background", type: "color", suggestedRamp: "error" },
    { key: "--semantic-color-status-error-surface", label: "Surface", type: "color", suggestedRamp: "error" },
    { key: "--semantic-color-status-error-border", label: "Border", type: "color", suggestedRamp: "error" },
    { key: "--semantic-color-status-error-foreground", label: "Icon/text", type: "color", suggestedRamp: "error" },
  ]},
];

const CARD_TOKENS = [
  {
    label: "Shape",
    tokens: [
      { key: "--component-card-border-radius", label: "Border radius", type: "size" },
      { key: "--component-card-padding", label: "Padding", type: "size" },
    ],
  },
];

const TAB_TOKENS = [
  {
    label: "Active tab",
    tokens: [
      { key: "--semantic-color-action-background", label: "Indicator / active color", type: "color", suggestedRamp: "accent" },
      { key: "--semantic-color-text-accent", label: "Active text", type: "color", suggestedRamp: "accent" },
    ],
  },
  {
    label: "Shape",
    tokens: [
      { key: "--component-tab-padding-block", label: "Padding block", type: "size" },
      { key: "--component-tab-padding-inline", label: "Padding inline", type: "size" },
    ],
  },
];

const SWITCH_TOKENS = [
  {
    label: "Track",
    tokens: [
      { key: "--semantic-color-action-background", label: "On color", type: "color", suggestedRamp: "accent" },
      { key: "--semantic-color-border-default", label: "Off color", type: "color", suggestedRamp: "neutral" },
    ],
  },
  {
    label: "Shape",
    tokens: [
      { key: "--component-switch-track-width", label: "Track width", type: "size" },
      { key: "--component-switch-track-height", label: "Track height", type: "size" },
      { key: "--component-switch-thumb-size", label: "Thumb size", type: "size" },
    ],
  },
];

// ─── Contrast pair definitions ────────────────────────────

const BUTTON_CONTRAST = [
  { label: "Primary", fg: "--component-button-primary-foreground", bg: "--component-button-primary-background" },
  { label: "Secondary", fg: "--component-button-secondary-foreground", bg: "--component-button-secondary-background" },
  { label: "Destructive", fg: "--semantic-color-status-error-foreground", bg: "--semantic-color-status-error-background" },
];

const BANNER_CONTRAST = [
  { label: "Info text", fg: "--semantic-color-status-info-foreground", bg: "--semantic-color-status-info-background" },
  { label: "Success text", fg: "--semantic-color-status-success-foreground", bg: "--semantic-color-status-success-background" },
  { label: "Warning text", fg: "--semantic-color-status-warn-foreground", bg: "--semantic-color-status-warn-background" },
  { label: "Error text", fg: "--semantic-color-status-error-foreground", bg: "--semantic-color-status-error-background" },
];

const FIELD_CONTRAST = [
  { label: "Text on field", fg: "--semantic-color-text-default", bg: "--semantic-color-surface-input" },
  { label: "Label text", fg: "--semantic-color-text-default", bg: "--semantic-color-surface-page" },
];

const PRIMARY_BUTTON_VARIANT_CONTRAST = [
  { label: "Text on primary", fg: "--component-button-primary-foreground", bg: "--component-button-primary-background" },
];
const SECONDARY_BUTTON_VARIANT_CONTRAST = [
  { label: "Text on secondary", fg: "--component-button-secondary-foreground", bg: "--component-button-secondary-background" },
];
const DESTRUCTIVE_BUTTON_VARIANT_CONTRAST = [
  { label: "Text on destructive", fg: "--semantic-color-status-error-foreground", bg: "--semantic-color-status-error-background" },
];
const INFO_BANNER_VARIANT_CONTRAST = [
  { label: "Icon/text on bg", fg: "--semantic-color-status-info-foreground", bg: "--semantic-color-status-info-background" },
];
const SUCCESS_BANNER_VARIANT_CONTRAST = [
  { label: "Icon/text on bg", fg: "--semantic-color-status-success-foreground", bg: "--semantic-color-status-success-background" },
];
const WARN_BANNER_VARIANT_CONTRAST = [
  { label: "Icon/text on bg", fg: "--semantic-color-status-warn-foreground", bg: "--semantic-color-status-warn-background" },
];
const ERROR_BANNER_VARIANT_CONTRAST = [
  { label: "Icon/text on bg", fg: "--semantic-color-status-error-foreground", bg: "--semantic-color-status-error-background" },
];

// ─── Navigation structure ─────────────────────────────────

export const NAV = [
  {
    id: "foundations",
    label: "Foundations",
    items: [
      { id: "color", label: "Color", Example: ColorExample, tokenGroups: [] },
      { id: "typography", label: "Typography", Example: TypographyExample, tokenGroups: [] },
    ],
  },
  {
    id: "actions",
    label: "Actions",
    items: [
      {
        id: "button", label: "Button", Example: ButtonExample, tokenGroups: BUTTON_TOKENS, contrastPairs: BUTTON_CONTRAST,
        variants: [
          { id: "primary", label: "Primary", Example: makeButtonVariantExample(undefined, "Primary"), tokenGroups: PRIMARY_BUTTON_VARIANT_TOKENS, contrastPairs: PRIMARY_BUTTON_VARIANT_CONTRAST },
          { id: "secondary", label: "Secondary", Example: makeButtonVariantExample("secondary", "Secondary"), tokenGroups: SECONDARY_BUTTON_VARIANT_TOKENS, contrastPairs: SECONDARY_BUTTON_VARIANT_CONTRAST },
          { id: "tertiary", label: "Tertiary", Example: makeButtonVariantExample("tertiary", "Tertiary"), tokenGroups: TERTIARY_BUTTON_VARIANT_TOKENS },
          { id: "destructive", label: "Destructive", Example: makeButtonVariantExample("destructive", "Destructive"), tokenGroups: DESTRUCTIVE_BUTTON_VARIANT_TOKENS, contrastPairs: DESTRUCTIVE_BUTTON_VARIANT_CONTRAST },
          { id: "sizes", label: "Sizes", Example: ButtonSizesExample, tokenGroups: BUTTON_SIZES_TOKENS },
        ],
      },
      { id: "icon-button", label: "Icon Button", Example: IconButtonExample, tokenGroups: BUTTON_TOKENS, contrastPairs: BUTTON_CONTRAST },
    ],
  },
  {
    id: "forms",
    label: "Forms",
    items: [
      { id: "text-field", label: "Text Field", Example: TextFieldExample, tokenGroups: FIELD_TOKENS, contrastPairs: FIELD_CONTRAST },
      { id: "select-field", label: "Select Field", Example: SelectFieldExample, tokenGroups: FIELD_TOKENS, contrastPairs: FIELD_CONTRAST },
      { id: "switch", label: "Switch", Example: SwitchExample, tokenGroups: SWITCH_TOKENS },
      { id: "checkbox-group", label: "Checkbox Group", Example: CheckboxGroupExample, tokenGroups: [] },
      { id: "radio-group", label: "Radio Group", Example: RadioGroupExample, tokenGroups: [] },
    ],
  },
  {
    id: "navigation",
    label: "Navigation",
    items: [
      { id: "tabs", label: "Tabs", Example: TabsExample, tokenGroups: TAB_TOKENS },
      { id: "breadcrumb", label: "Breadcrumb", Example: BreadcrumbExample, tokenGroups: [] },
      { id: "pagination", label: "Pagination", Example: PaginationExample, tokenGroups: [] },
      { id: "segmented-control", label: "Segmented Control", Example: SegmentedControlExample, tokenGroups: [] },
    ],
  },
  {
    id: "feedback",
    label: "Feedback",
    items: [
      {
        id: "banner", label: "Banner", Example: BannerExample, tokenGroups: BANNER_TOKENS, contrastPairs: BANNER_CONTRAST,
        variants: [
          { id: "info", label: "Info", Example: makeBannerVariantExample("info", "Information"), tokenGroups: INFO_BANNER_VARIANT_TOKENS, contrastPairs: INFO_BANNER_VARIANT_CONTRAST },
          { id: "success", label: "Success", Example: makeBannerVariantExample("success", "Success"), tokenGroups: SUCCESS_BANNER_VARIANT_TOKENS, contrastPairs: SUCCESS_BANNER_VARIANT_CONTRAST },
          { id: "warning", label: "Warning", Example: makeBannerVariantExample("warn", "Warning"), tokenGroups: WARN_BANNER_VARIANT_TOKENS, contrastPairs: WARN_BANNER_VARIANT_CONTRAST },
          { id: "error", label: "Error", Example: makeBannerVariantExample("error", "Error"), tokenGroups: ERROR_BANNER_VARIANT_TOKENS, contrastPairs: ERROR_BANNER_VARIANT_CONTRAST },
        ],
      },
      { id: "dialog", label: "Dialog", Example: DialogExample, tokenGroups: [] },
      { id: "snackbar", label: "Snackbar", Example: SnackbarExample, tokenGroups: [] },
    ],
  },
  {
    id: "display",
    label: "Display",
    items: [
      { id: "accordion", label: "Accordion", Example: AccordionExample, tokenGroups: [] },
      { id: "card", label: "Card", Example: CardExample, tokenGroups: CARD_TOKENS },
      { id: "message-badge", label: "Message Badge", Example: MessageBadgeExample, tokenGroups: [] },
      { id: "divider", label: "Divider", Example: DividerExample, tokenGroups: [] },
      { id: "heading", label: "Heading", Example: HeadingExample, tokenGroups: [] },
      { id: "paragraph", label: "Paragraph", Example: ParagraphExample, tokenGroups: [] },
    ],
  },
];

export function findEntry(id) {
  for (const section of NAV) {
    const found = section.items.find((item) => item.id === id);
    if (found) return found;
  }
  return null;
}

export function findVariant(componentId, variantId) {
  const component = findEntry(componentId);
  return component?.variants?.find((v) => v.id === variantId) ?? null;
}
