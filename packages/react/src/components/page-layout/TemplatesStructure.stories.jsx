import { Code } from "../code/Code.jsx";
import { Paragraph } from "../paragraph/Paragraph.jsx";

export default {
  title: "Templates",
  parameters: { layout: "padded" },
};

const LABEL = {
  fontFamily: "var(--component-paragraph-font-family)",
  fontSize: "var(--semantic-font-size-body-xs)",
  fontWeight: 600,
  color: "var(--semantic-color-text-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: "var(--base-spacing-8)",
};

function Structure({ name, description, code }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-12)" }}>
      <div>
        <p style={LABEL}>{name} — structure</p>
        {description && (
          <Paragraph color="muted" size="sm">{description}</Paragraph>
        )}
      </div>
      <Code variant="block" copyCode>{code}</Code>
    </div>
  );
}

// ── Home ───────────────────────────────────────────────────────────────────────

const HOME_CODE = `const header = (
  <TopHeader
    logoText="A1"
    logoHref="#"
    navItems={[
      { id: "features", label: "Features", href: "#" },
      { id: "pricing",  label: "Pricing",  href: "#" },
      { id: "docs",     label: "Docs",     href: "#" },
    ]}
    loginButton={{ label: "Get started free", onClick: () => {} }}
  />
);

<PageLayout header={header} stickyHeader>

  {/* Hero — full-bleed inverse, gradient accent top-right */}
  <Section padding="lg" inverse surface="page" gradient="accent" gradientPosition="top-right" gap="lg">
    {/* MessageBadge · display Heading (responsive size xs→lg→jumbo) · Paragraph · ButtonContainer */}
  </Section>

  {/* Stats strip — compact panel surface */}
  <Section padding="sm" surface="panel" gradient="highlight" gradientPosition="center">
    {/* 4-column stat grid (display Heading + muted Paragraph per stat) */}
  </Section>

  {/* Feature highlights */}
  <Section padding="lg" gap="lg">
    {/* Centered heading block */}
    {/* <Grid columns={3} gap="lg"> heroIcon Cards </Grid> */}
  </Section>

  {/* Testimonials — inverse, gradient center */}
  <Section padding="lg" inverse surface="page" gradient="accent" gradientPosition="center" gap="lg">
    {/* Centered heading block */}
    {/* <Grid columns={3} gap="md"> bare Cards </Grid> */}
  </Section>

  {/* Call to action */}
  <Section padding="lg" surface="panel" gap="md">
    {/* Centered display Heading · Paragraph · <ButtonContainer align="center"> */}
  </Section>

</PageLayout>`;

export const HomeStructure = {
  name: "Home — structure",
  render: () => (
    <Structure
      name="Home"
      description="Marketing homepage. TopHeader with marketing nav and login CTA. Five full-bleed Sections stacked vertically — hero, stats strip, features, testimonials, and CTA."
      code={HOME_CODE}
    />
  ),
};

// ── Landing ────────────────────────────────────────────────────────────────────

const LANDING_CODE = `const header = (
  <TopHeader
    logoText="A1"
    logoHref="#"
    navItems={[
      { id: "product", label: "Product", href: "#" },
      { id: "pricing", label: "Pricing", href: "#" },
      { id: "blog",    label: "Blog",    href: "#" },
    ]}
    loginButton={{ label: "Sign in", onClick: () => {} }}
  />
);

<PageLayout header={header} stickyHeader>

  {/* Hero — inverse, gradient accent top-left */}
  <Section padding="lg" inverse surface="page" gradient="accent" gradientPosition="top-left" gap="lg">
    {/* MessageBadge · Heading (responsive xs→xxl) · Paragraph · ButtonContainer */}
  </Section>

  {/* Feature highlights */}
  <Section padding="lg" gap="lg">
    {/* Centered heading block */}
    {/* <Grid columns={3} gap="lg"> heroIcon Cards </Grid> */}
  </Section>

  {/* Social proof strip */}
  <Section padding="sm" surface="panel" gradient="info" gradientPosition="center">
    {/* 3-column stat grid */}
  </Section>

  {/* CTA — inverse, gradient bottom */}
  <Section padding="lg" inverse surface="page" gradient="accent" gradientPosition="bottom">
    {/* Centered Heading · Paragraph · ButtonContainer */}
  </Section>

</PageLayout>`;

export const LandingStructure = {
  name: "Landing — structure",
  render: () => (
    <Structure
      name="Landing"
      description="Alternate marketing page. Similar to Home but with a tighter section count — hero, three feature cards, a social proof strip, and a single CTA."
      code={LANDING_CODE}
    />
  ),
};

// ── Details ────────────────────────────────────────────────────────────────────

const DETAILS_CODE = `const header = (
  <TopHeader
    logoText="A1 Platform"
    logoHref="#"
    navItems={[...]}   // app nav
    actions={[...]}    // notification + account menus
  />
);

// Sticky metadata panel rendered in the aside slot
const aside = (
  <div style={{ padding: "var(--base-spacing-24)", ... }}>
    {/* Key–value metadata rows */}
    {/* <Button variant="secondary" size="sm">Edit details</Button> */}
  </div>
);

<PageLayout header={header} aside={aside} stickyHeader>

  {/* Main content column — no contentWidth constraint (aside handles the split) */}
  <Section gap="md">
    {/* Status MessageBadge · Heading h1 · lead Paragraph */}
    {/* Body text sections: h2 headings + Paragraphs */}
  </Section>

</PageLayout>`;

export const DetailsStructure = {
  name: "Details — structure",
  render: () => (
    <Structure
      name="Details"
      description="Article or project detail view. PageLayout aside slot holds a sticky metadata panel. Main area is a single Section with long-form content."
      code={DETAILS_CODE}
    />
  ),
};

// ── Form ───────────────────────────────────────────────────────────────────────

const FORM_CODE = `const header = (
  <TopHeader
    logoText="A1 Platform"
    logoHref="#"
    navItems={[...]}
    actions={[...]}
  />
);

<PageLayout header={header} stickyHeader>

  {/* Constrained-width form — contentWidth="sm" centres a narrow column */}
  <Section contentWidth="sm" padding="lg">

    {/* Page title + description */}
    <Heading as="h1" type="heading" size="lg">New project</Heading>
    <Paragraph color="muted">...</Paragraph>

    {/* Grouped fields */}
    <Fieldset legend="Project information" size="comfortable">
      <FieldRow><TextField label="Project name" required /></FieldRow>
      <FieldRow><TextareaField label="Description" /></FieldRow>
      <FieldRow>
        <SelectField label="Team">...</SelectField>
        <SelectField label="Priority">...</SelectField>
      </FieldRow>
    </Fieldset>

    <Fieldset legend="Timeline" size="comfortable">
      <FieldRow>
        <TextField label="Start date" type="date" />
        <TextField label="Due date"   type="date" />
      </FieldRow>
    </Fieldset>

    <ButtonContainer>
      <Button variant="primary">Create project</Button>
      <Button variant="secondary">Cancel</Button>
    </ButtonContainer>

  </Section>

</PageLayout>`;

export const FormStructure = {
  name: "Form — structure",
  render: () => (
    <Structure
      name="Form"
      description={'Data-entry page. contentWidth="sm" on the Section centres a narrow form column. Fieldsets group related fields; FieldRow handles inline pairing.'}
      code={FORM_CODE}
    />
  ),
};

// ── Editor ─────────────────────────────────────────────────────────────────────

const EDITOR_CODE = `const header = (
  <TopHeader
    logoText="A1 Editor"
    logoHref="#"
    navItems={[
      { id: "file", label: "File", href: "#" },
      { id: "edit", label: "Edit", href: "#" },
      { id: "view", label: "View", href: "#" },
    ]}
    actions={[...]}
  />
);

// Icon-only tool palette — left sidebar
const sidebar = (
  <SideNav open onClose={() => {}}>
    <SideNavItem as="button" icon="near_me"    label="Select"    active />
    <SideNavItem as="button" icon="crop_square" label="Rectangle" />
    <SideNavItem as="button" icon="title"       label="Text" />
    <SideNavGroup icon="layers" label="Layers">
      <SideNavItem as="button" icon="widgets" label="Button group" />
    </SideNavGroup>
  </SideNav>
);

// Accordion-based properties panel — right aside
const aside = (
  <div style={{ width: 260, borderInlineStart: "1px solid var(--semantic-color-border-subtle)", overflowY: "auto" }}>
    <Accordion label="Layout"     size="sm" defaultOpen>...</Accordion>
    <Accordion label="Appearance" size="sm">...</Accordion>
    <Accordion label="Typography" size="sm">...</Accordion>
    <Accordion label="Constraints" size="sm">...</Accordion>
  </div>
);

{/*
  viewportHeight — locks the layout to 100vh so the canvas
  doesn't push the page taller than the viewport.
  sidebar + aside — three-column chrome: tools | canvas | properties.
*/}
<PageLayout header={header} sidebar={sidebar} aside={aside} stickyHeader viewportHeight>
  {/* Canvas / workspace area */}
</PageLayout>`;

export const EditorStructure = {
  name: "Editor — structure",
  render: () => (
    <Structure
      name="Editor"
      description="Three-column app shell: tool palette (sidebar), canvas (main), properties panel (aside). viewportHeight locks the layout to 100vh — the canvas scrolls internally, not the page."
      code={EDITOR_CODE}
    />
  ),
};

// ── Summary — Success ──────────────────────────────────────────────────────────

const SUMMARY_SUCCESS_CODE = `// Minimal header — no nav, no actions (flow is complete)
const header = <TopHeader logoText="A1 Platform" logoHref="#" />;

<PageLayout header={header} stickyHeader>

  {/* Status hero — success gradient, centre-aligned */}
  <Section padding="md" surface="page" gradient="success" gradientPosition="center">
    {/* Large Icon (check_circle) · display Heading · Paragraph · MessageBadge (timestamp) */}
  </Section>

  {/* Submission summary — constrained width */}
  <Section padding="md" gap="lg" contentWidth="sm">
    <Card>
      {/* Section heading + description */}
      {/* Key–value summary rows */}
      <ButtonContainer>
        <Button variant="primary">Go to project</Button>
        <Button variant="secondary">Back to dashboard</Button>
      </ButtonContainer>
    </Card>
  </Section>

</PageLayout>`;

export const SummarySuccessStructure = {
  name: "Summary — Success — structure",
  render: () => (
    <Structure
      name="Summary — Success"
      description="Post-submission confirmation. Two sections: a full-bleed status hero with the success gradient, and a constrained-width Card showing what was submitted."
      code={SUMMARY_SUCCESS_CODE}
    />
  ),
};

// ── Summary — Error ────────────────────────────────────────────────────────────

const SUMMARY_ERROR_CODE = `const header = <TopHeader logoText="A1 Platform" logoHref="#" />;

<PageLayout header={header} stickyHeader>

  {/*
    System-level error Banner sits above all Sections.
    variant="system" pins it to the top of the content area
    (below the sticky header) and spans full width.
  */}
  <Banner variant="system" status="error" title="Submission failed">
    We couldn't create your project. Your data has been saved.
  </Banner>

  {/* Status hero — reuses success gradient intentionally (see design notes) */}
  <Section padding="md" surface="page" gradient="success" gradientPosition="center">
    {/* Large Icon (error) · Heading · Paragraph */}
  </Section>

  {/* Recovery guidance */}
  <Section padding="md" contentWidth="sm">
    <Card>
      {/* Bullet list of recovery steps */}
    </Card>
  </Section>

  {/* Retained form data — no padding preset, manual inline padding */}
  <Section padding="none" style={{ paddingBlockEnd: "var(--base-spacing-64)", paddingInline: "var(--base-spacing-40)" }}>
    {/* "Your saved data" heading + MessageBadge · Card with summary rows */}
    <ButtonContainer>
      <Button variant="primary">Try again</Button>
      <Button variant="secondary">Edit details</Button>
      <Button variant="tertiary" icon="support_agent">Contact support</Button>
    </ButtonContainer>
  </Section>

</PageLayout>`;

export const SummaryErrorStructure = {
  name: "Summary — Error — structure",
  render: () => (
    <Structure
      name="Summary — Error"
      description="Failed-submission state. A system Banner spans the full width above the sections. Three sections follow: error hero, recovery steps, and the preserved form data."
      code={SUMMARY_ERROR_CODE}
    />
  ),
};

// ── Login ──────────────────────────────────────────────────────────────────────

const LOGIN_CODE = `{/*
  No PageLayout — login is a standalone centred form.
  contentWidth="xs" constrains the column; Section handles
  vertical padding and horizontal centering.
*/}
<Section contentWidth="xs">

  {/* Form header */}
  <Heading as="h1" type="heading" size="xl" margin="sm">Sign in to your account</Heading>
  <Paragraph color="muted">Welcome back. Enter your details to continue.</Paragraph>

  <form onSubmit={(e) => e.preventDefault()}>

    <TextField label="Email address" type="email" autoComplete="email" required size="comfortable" />

    {/* Password with show/hide overlay */}
    <TextField
      label="Password"
      type={showPassword ? "text" : "password"}
      size="comfortable"
      inputOverlay={
        <IconButton
          icon={showPassword ? "visibility_off" : "visibility"}
          label={showPassword ? "Hide password" : "Show password"}
          variant="tertiary"
        />
      }
    />

    {/* Remember me + forgot link */}
    <Stack direction="row" justify="between" align="center">
      <Switch label="Remember me" />
      <Link href="#">Forgot password?</Link>
    </Stack>

    {/* Full-width primary submit */}
    <ButtonContainer size="lg">
      <Button variant="primary" type="submit">Sign in</Button>
    </ButtonContainer>

    {/* OR divider */}
    <Stack direction="row" align="center" gap="sm">
      <Divider style={{ flex: 1 }} space="none" />
      <Paragraph size="sm" color="muted">or continue with</Paragraph>
      <Divider style={{ flex: 1 }} space="none" />
    </Stack>

    {/* Social login */}
    <ButtonContainer>
      <Button variant="secondary">Google</Button>
      <Button variant="secondary">GitHub</Button>
    </ButtonContainer>

    <Paragraph size="md" color="muted">
      Don't have an account? <Link href="#">Sign up for free</Link>
    </Paragraph>

  </form>

</Section>`;

export const LoginStructure = {
  name: "Login — structure",
  render: () => (
    <Structure
      name="Login"
      description={'Authentication form. No PageLayout — just a Section with contentWidth="xs". Password field uses inputOverlay for the show/hide toggle. OR divider separates credential and social login paths.'}
      code={LOGIN_CODE}
    />
  ),
};

// ── 404 — Not Found ────────────────────────────────────────────────────────────

const NOT_FOUND_CODE = `const header = (
  <TopHeader
    logoText="A1 Platform"
    logoHref="#"
    navItems={[...]}
    actions={[...]}
  />
);

<PageLayout header={header} stickyHeader>

  {/*
    Single full-viewport Section — minHeight fills the space below the header.
    Centred content block with a decorative ghost "404" and recovery CTAs.
  */}
  <Section
    padding="lg"
    surface="page"
    gradient="accent"
    gradientPosition="center"
    style={{ minHeight: "calc(100vh - 64px)" }}
  >
    {/* Ghost 404 display text (aria-hidden, opacity 0.07) */}
    {/* MessageBadge status="error" · Heading · Paragraph */}
    <ButtonContainer align="center">
      <Button variant="primary">Go to home</Button>
      <Button variant="secondary">Go back</Button>
    </ButtonContainer>
  </Section>

</PageLayout>`;

export const NotFoundStructure = {
  name: "404 — Not Found — structure",
  render: () => (
    <Structure
      name="404 — Not Found"
      description="Error page. Single Section fills the viewport height below the header. The ghost 404 numeral is aria-hidden and decorative only."
      code={NOT_FOUND_CODE}
    />
  ),
};

// ── Documentation ──────────────────────────────────────────────────────────────

const DOCS_CODE = `const header = (
  <TopHeader
    logoText="A1 Docs"
    logoHref="#"
    navItems={[
      { id: "home",       label: "Home",       icon: "home", href: "#", iconOnly: true },
      { id: "components", label: "Components", href: "#", active: true },
      { id: "tokens",     label: "Tokens",     href: "#" },
      { id: "patterns",   label: "Patterns",   href: "#" },
    ]}
    actions={[...]}
  />
);

// Sticky page-nav in the end-side aside — targets section IDs within the content column
const aside = (
  <div style={{ position: "sticky", top: 80, maxHeight: "calc(100vh - 96px)", overflowY: "auto" }}>
    <PageNav
      sections={[
        { id: "overview",      label: "Overview" },
        { id: "anatomy",       label: "Anatomy" },
        { id: "rules",         label: "Usage rules" },
        { id: "accessibility", label: "Accessibility" },
        { id: "properties",    label: "Properties" },
      ]}
    />
  </div>
);

{/*
  asidePlacement="end" — PageNav goes on the right, not the left.
  Content column is width-constrained with a style override (maxWidth: 760)
  rather than contentWidth, so the Section still fills the full layout width
  and the aside has room to breathe.
*/}
<PageLayout header={header} aside={aside} asidePlacement="end" stickyHeader>

  <Section padding="md" gap="lg" style={{ maxWidth: 760 }}>

    {/* Breadcrumb trail */}
    {/* Page title + description */}

    {/* Each doc section: id + scrollMarginTop for PageNav anchor targeting */}
    <section id="overview" style={{ scrollMarginTop: 96 }}>
      <Heading as="h2">Overview</Heading>
      {/* Content */}
    </section>

    <section id="anatomy" style={{ scrollMarginTop: 96 }}>
      <Heading as="h2">Anatomy</Heading>
      {/* Content */}
    </section>

    {/* ...additional sections */}

  </Section>

</PageLayout>`;

export const DocumentationStructure = {
  name: "Documentation — structure",
  render: () => (
    <Structure
      name="Documentation"
      description={'Component docs page. asidePlacement="end" puts the PageNav on the right. Each section has a matching id and scrollMarginTop so PageNav anchor links clear the sticky header.'}
      code={DOCS_CODE}
    />
  ),
};
