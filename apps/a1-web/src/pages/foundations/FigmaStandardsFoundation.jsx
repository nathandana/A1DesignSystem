import {
  Code,
  Heading,
  List,
  ListItem,
  Paragraph,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { PageTitleArea } from '../PageTitleArea.jsx'
import { getFoundationBreadcrumbItems } from './utils.js'

export function FigmaStandardsFoundationPage({ onNavigate }) {
  return (
    <>
      <PageTitleArea
        headingId="figma-standards-heading"
        breadcrumbItems={getFoundationBreadcrumbItems('Figma standards', onNavigate)}
        title="Building resilient Figma components"
        description="Best practices for creating Figma components that people can use confidently and automated systems can reliably translate into code."
      />

      <Section padding="sm" contentWidth="sm" aria-labelledby="figma-standards-article-heading">
        <Stack gap="xl">
          <Stack gap="md">
            <Heading as="h2" id="figma-standards-article-heading" type="display" size={{ xs: 'lg', md: 'xl' }}>
              Best practices for human and AI workflows
            </Heading>
            <Paragraph>
              A reliable component library depends on consistent structure, naming and property management. Predictable components are easier for designers to find and use, and easier for automated systems to parse and translate into code.
            </Paragraph>
            <Paragraph color="muted">
              Use this guidance whenever you build or update a Figma component.
            </Paragraph>
          </Stack>

          <Stack gap="md">
            <Heading as="h2" size={{ xs: 'lg', md: 'xl' }}>Organization and naming</Heading>
            <Paragraph>
              How a component is placed and named determines how easily it can be discovered in the Assets panel and referenced by code integrations.
            </Paragraph>
            <List icon="check" size="md">
              <ListItem><strong>Keep components at the root level.</strong> Place every public component or component set as a direct child of its Figma page. Do not nest it inside frames or sections, which creates unintended hierarchy in the Figma Assets menu.</ListItem>
              <ListItem><strong>Use flat, straightforward naming.</strong> Name every public component or component set with only its base name, such as <Code variant="inline">Button</Code> or <Code variant="inline">Checkbox Group</Code>. Do not add page names, status prefixes such as <Code variant="inline">POC</Code>, or slash separators such as <Code variant="inline">Form/Button</Code>. This allows for a clean assets brwowsing experience for users in Figma.</ListItem>
              <ListItem><strong>Rely on stable keys for resolution.</strong> Flat naming can create collisions. Integration adapters should use the component’s stable published key, not a more complicated naming convention, to distinguish assets.</ListItem>
            </List>
          </Stack>

          <Stack gap="md">
            <Heading as="h2" size={{ xs: 'lg', md: 'xl' }}>Visual presentation and layout</Heading>
            <Paragraph>
              Keep a reusable component separate from the labels and frames that present it neatly on the canvas.
            </Paragraph>
            <List icon="check" size="md">
              <ListItem><strong>Separate presentation from the asset.</strong> Pair a top-level asset visually with an Auto Layout presentation frame, but do not make that frame its parent. Use a locked, transparent placement area behind the asset to keep it aligned without nesting it.</ListItem>
              <ListItem><strong>Arrange variants systematically.</strong> Organize variants into a readable grid. Add locked text labels outside the reusable component for every variant axis, such as Size or State, so they are never inserted with an instance.</ListItem>
              <ListItem><strong>Standardize presentation styling.</strong> Bind presentation backgrounds to designated surface color variables, borders to subtle border variables and border widths to established spacing variables. Use the approved 8px dash pattern.</ListItem>
              <ListItem><strong>Scale spacing proportionally.</strong> Use established spacing variables for grid gaps and outer padding. Smaller components need tighter spacing, while larger components need more breathing room.</ListItem>
            </List>
          </Stack>

          <Stack gap="md">
            <Heading as="h2" size={{ xs: 'lg', md: 'xl' }}>Icons and nested elements</Heading>
            <Paragraph>
              Consistent nested-component handling, especially for icons, prevents detached instances and broken design-to-code pipelines.
            </Paragraph>
            <List icon="check" size="md">
              <ListItem><strong>Enforce strict icon attachment.</strong> Use attached instances from the official icon library for every icon. Never use copied vectors, redrawn glyphs, text glyphs or detached icon instances inside a component.</ListItem>
              <ListItem><strong>Expose preferred icon swaps.</strong> When the developed API supports icon selection, expose replaceable icons through an instance-swap property and restrict it to approved preferred values.</ListItem>
              <ListItem><strong>Restrict bounded content slots.</strong> Set preferred instances to the exact approved child component sets. For example, a Checkbox Group slot should prefer only Checkbox Item variants.</ListItem>
              <ListItem><strong>Define explicit slot layouts.</strong> Set every content slot’s Auto Layout direction and wrapping behavior explicitly. Match that direction to the developed layout property.</ListItem>
              <ListItem><strong>Seed slots with clean defaults.</strong> Populate every slot with useful child components using their native defaults. Do not override a child’s text, state, size or selection properties within the parent.</ListItem>
              <ListItem><strong>Expose nested properties intentionally.</strong> Reuse established nested components instead of redrawing them. Expose nested properties only when the developed parent API delegates that configuration. Never expose both a parent control and a duplicate nested control for the same setting.</ListItem>
            </List>
          </Stack>

          <Stack gap="md">
            <Heading as="h2" size={{ xs: 'lg', md: 'xl' }}>Properties, states and interactions</Heading>
            <Paragraph>
              Interactive states and properties must mirror the engineered component’s capabilities.
            </Paragraph>
            <List icon="check" size="md">
              <ListItem><strong>Consolidate Required form treatments.</strong> For a field with a <Code variant="inline">required</Code> prop, use a shared Boolean property instead of distinct variants. Use the established blue asterisk at compact/default sizes or an inline Required Badge at comfortable size, without exposing the Badge’s nested properties.</ListItem>
              <ListItem><strong>Standardize interactive states.</strong> Include default, hover, active and disabled states when they apply. Use <Code variant="inline">active</Code> rather than adding a duplicate pressed state so terminology matches the codebase.</ListItem>
              <ListItem><strong>Isolate the loading state.</strong> Treat loading as mutually exclusive when it replaces another visual. A Button loading indicator and its standard icon must never appear together.</ListItem>
              <ListItem><strong>Separate the focus ring.</strong> Add Focus ring as a Boolean property on every interactive component. Do not use it as a variant axis. Bind focus layers to the established offset and size variables so they scale predictably.</ListItem>
              <ListItem><strong>Align prototype motion with code.</strong> Connect applicable variants with transient hover and press interactions and supplied return behavior. Match developed duration and easing; do not invent motion or add activation interactions to disabled or loading variants.</ListItem>
              <ListItem><strong>Wire properties comprehensively.</strong> Create component properties at the component-set level and wire every applicable descendant across sizes and variants. Recheck every cloned variant because Figma can drop descendant property references during duplication.</ListItem>
            </List>
          </Stack>

          <Stack gap="md">
            <Heading as="h2" size={{ xs: 'lg', md: 'xl' }}>Validation and handoff</Heading>
            <Paragraph>
              Before publishing, validate the component against the runtime environment so design and code remain in sync.
            </Paragraph>
            <List icon="check" size="md">
              <ListItem><strong>Synchronize with the API.</strong> Compare final Figma properties against the developed API. Update design-to-code adapters, aliases, component keys, contract hashes and JSON fixtures when the implemented contract changes.</ListItem>
              <ListItem><strong>Respect runtime boundaries.</strong> Figma documents the visual contract. React owns semantics and runtime behavior, including IDs, ARIA roles, callbacks and controlled state, unless the workflow explicitly maps them.</ListItem>
              <ListItem><strong>Run a final validation check.</strong> Validate the JSON contract, confirm variables are bound, verify that instances are attached and review light and dark mode rendering before completion.</ListItem>
            </List>
          </Stack>
        </Stack>
      </Section>
    </>
  )
}
