import { Heading, Paragraph, Section, ListItem, List, Code } from '@gtivr4/a1-design-system-react'

export function Templates() {
  return (
    <>
    <Section  padding="md" surface="raised" contentWidth="lg" borderStyle="solid" borderVariant="subtle" radius="none">
    <Heading as="h1" type="heading" size="xxl" color="default" align="left">
      Patterns
    </Heading>
    <Paragraph>
      Patterns are reusable chunks of UI that can be inserted into pages, configured within rules, and governed by the design system. They replace Templates and provide a more flexible way to manage reusable layouts, sections, and component compositions.
    </Paragraph>
  </Section>
  <Section as="section" padding="sm" gap="sm" contentWidth="lg" borderStyle="solid" borderVariant="subtle" radius="none">
    <Heading as="h2" size="md" type="heading" color="default" align="left">
      Phase 1: Rename Templates to Patterns
    </Heading>
    <Paragraph as="p" size="md" color="default" align="left">
      Establish Patterns as the new reusable design system concept. Rename all user-facing Template language to Patterns while preserving existing functionality.
    </Paragraph>
    <List as="ul">
      <ListItem>
        Rename navigation, page titles, empty states, buttons, and labels from Templates to Patterns.
      </ListItem>
      <ListItem>
        Keep existing Template behavior intact during the rename.
      </ListItem>
      <ListItem>
        Confirm no user-facing Template language remains.
      </ListItem>
    </List>
  </Section>
  <Section as="section" padding="sm" surface="panel" gap="sm" contentWidth="lg" borderStyle="solid" borderVariant="subtle" radius="none">
    <Heading as="h2" size="md" type="heading" color="default" align="left">
      Phase 2: Pattern Data Model
    </Heading>
    <Paragraph as="p" size="md" color="default" align="left">
      Create the TypeScript and JSON structure needed to describe reusable patterns, editable fields, locked fields, slots, rules, guidance, comments, and instances.
    </Paragraph>
    <List as="ul">
      <ListItem>
        Add Pattern, PatternMetadata, PatternNode, PatternLock, PatternEditableField, PatternSlot, PatternRule, PatternGuidance, PatternComment, and PatternInstance types.
      </ListItem>
      <ListItem>
        Support locked nodes, locked props, locked styling, locked layout, locked children, and locked slot rules.
      </ListItem>
      <ListItem>
        Support editable text, props, actions, media, collections, and slots.
      </ListItem>
    </List>
  </Section>
  <Section padding="sm" as="section" contentWidth="lg" borderStyle="solid" borderVariant="subtle" radius="none" gap="sm">
    <Heading as="h2" size="md" type="heading" color="default" align="left">
      Phase 3: First Pattern — Page Header
    </Heading>
    <Paragraph as="p" size="md" color="default" align="left">
      Build the first complete working pattern: a Page Header with locked Section styling, editable title, editable description, editable breadcrumbs, and an open right-side slot.
    </Paragraph>
    <List as="ul">
      <ListItem>
        Lock Section padding, surface, border, radius, gap, layout, and responsive behavior.
      </ListItem>
      <ListItem>
        Allow the title, description, and breadcrumb items to be edited.
      </ListItem>
      <ListItem>
        Add an open right-side slot for compatible actions, badges, status, menus, or metadata components.
      </ListItem>
    </List>
  </Section>
  <Section as="section" padding="sm" surface="panel" gap="sm" contentWidth="lg" borderStyle="solid" borderVariant="subtle" radius="none">
    <Heading as="h2" size="md" type="heading" color="default" align="left">
      Phase 4: Pattern Library
    </Heading>
    <Paragraph as="p" size="md" color="default" align="left">
      Create the main Patterns page where users can browse, search, filter, preview, and open reusable patterns.
    </Paragraph>
    <List as="ul">
      <ListItem>
        Show pattern cards with rendered previews, names, descriptions, categories, tags, status, version, projects, and last updated date.
      </ListItem>
      <ListItem>
        Add search and filters for category, tag, status, and project.
      </ListItem>
      <ListItem>
        Add quick actions for Preview, Edit, View Code, Duplicate, and Insert into page.
      </ListItem>
    </List>
  </Section>
  <Section padding="sm" as="section" contentWidth="lg" borderStyle="solid" borderVariant="subtle" radius="none" gap="sm">
    <Heading as="h2" size="md" type="heading" color="default" align="left">
      Phase 5: Pattern Detail Page
    </Heading>
    <Paragraph as="p" size="md" color="default" align="left">
      Create a Pattern detail page with Edit, Preview, and Code modes. This should behave like the main Editor, with extra controls for locks, editable fields, slots, guidance, comments, and rules.
    </Paragraph>
    <List as="ul">
      <ListItem>
        Edit mode allows users to select nodes, edit props, lock nodes, lock props, define slots, and add guidance.
      </ListItem>
      <ListItem>
        Preview mode renders the pattern and visually marks locked areas, editable areas, slots, and required fields.
      </ListItem>
      <ListItem>
        Code mode shows editable Pattern JSON with syntax highlighting, schema validation, and useful error messages.
      </ListItem>
    </List>
  </Section>
  <Section as="section" padding="sm" surface="panel" gap="sm" contentWidth="lg" borderStyle="solid" borderVariant="subtle" radius="none">
    <Heading as="h2" size="md" type="heading" color="default" align="left">
      Phase 6: Create Pattern from Editor Selection
    </Heading>
    <Paragraph as="p" size="md" color="default" align="left">
      Allow users to select a node or group of nodes in the main Editor and convert that selection into a reusable Pattern.
    </Paragraph>
    <List as="ul">
      <ListItem>
        Add a Create Pattern from Selection action.
      </ListItem>
      <ListItem>
        Preserve the selected UI tree as Pattern JSON.
      </ListItem>
      <ListItem>
        Ask for pattern name, description, category, tags, projects, and initial status.
      </ListItem>
    </List>
  </Section>
  <Section padding="sm" as="section" contentWidth="lg" borderStyle="solid" borderVariant="subtle" radius="none" gap="sm">
    <Heading as="h2" size="md" type="heading" color="default" align="left">
      Phase 7: Insert Patterns into the Editor
    </Heading>
    <Paragraph as="p" size="md" color="default" align="left">
      Add Patterns to the main Editor so users can drag reusable patterns into pages just like components.
    </Paragraph>
    <List as="ul">
      <ListItem>
        Add a searchable and filterable Patterns panel in the main Editor.
      </ListItem>
      <ListItem>
        Allow users to drag or insert a Pattern into the selected page location.
      </ListItem>
      <ListItem>
        Create Pattern instances that preserve pattern ID, version, edited values, slot contents, lock state, and validation state.
      </ListItem>
    </List>
  </Section>
  <Section as="section" padding="sm" surface="panel" gap="sm" contentWidth="lg" borderStyle="solid" borderVariant="subtle" radius="none">
    <Heading as="h2" size="md" type="heading" color="default" align="left">
      Phase 8: Configurator Support
    </Heading>
    <Paragraph as="p" size="md" color="default" align="left">
      When a Pattern instance is selected in the Editor, the configurator should clearly show what can be edited, what is locked, and what guidance applies.
    </Paragraph>
    <List as="ul">
      <ListItem>
        Show Pattern name, description, status, version, guidance, comments, editable fields, slots, locked fields, and rule warnings.
      </ListItem>
      <ListItem>
        Show locked fields as visible but disabled, with a lock icon and reason.
      </ListItem>
      <ListItem>
        Show editable fields with field-level guidance, validation, and required or optional status.
      </ListItem>
    </List>
  </Section>
  <Section padding="sm" as="section" contentWidth="lg" borderStyle="solid" borderVariant="subtle" radius="none" gap="sm">
    <Heading as="h2" size="md" type="heading" color="default" align="left">
      Phase 9: Rules and Validation
    </Heading>
    <Paragraph as="p" size="md" color="default" align="left">
      Add rules that help patterns enforce design system standards, accessibility expectations, content quality, layout requirements, and component compatibility.
    </Paragraph>
    <List as="ul">
      <ListItem>
        Support rule severity levels: guidance, warning, and error.
      </ListItem>
      <ListItem>
        Support rule categories: accessibility, content, layout, brand, component compatibility, and responsive behavior.
      </ListItem>
      <ListItem>
        Show pattern instance violations in the main Editor configurator.
      </ListItem>
    </List>
  </Section>
  <Section as="section" padding="sm" surface="panel" gap="sm" contentWidth="lg" borderStyle="solid" borderVariant="subtle" radius="none">
    <Heading as="h2" size="md" type="heading" color="default" align="left">
      Phase 10: AI-Generated Starter Rules
    </Heading>
    <Paragraph as="p" size="md" color="default" align="left">
      Add an AI action that inspects the pattern tree, locked props, editable props, slots, existing design system rules, and accessibility requirements to generate starter rules.
    </Paragraph>
    <List as="ul">
      <ListItem>
        Add Generate Starter Rules and Regenerate Rules actions.
      </ListItem>
      <ListItem>
        Allow users to accept, reject, edit, or change severity for individual AI-generated rules.
      </ListItem>
      <ListItem>
        Keep the user in control; AI suggestions should never be saved without review.
      </ListItem>
    </List>
  </Section>
  <Section as="section" padding="sm" surface="panel" gap="sm" contentWidth="lg" borderStyle="solid" borderVariant="subtle" radius="none">
    <Heading as="h2" size="md" type="heading" color="default" align="left">
      Recommended MVP
    </Heading>
    <Paragraph as="p" size="md" color="default" align="left">
      Start with the smallest version that proves the model: one working Page Header pattern with locked styling, editable content, an open slot, guidance, and insertion into the main Editor.
    </Paragraph>
    <List as="ul">
      <ListItem>
        Rename Templates to Patterns.
      </ListItem>
      <ListItem>
        Create the Pattern JSON model and mock data.
      </ListItem>
      <ListItem>
        Build the Page Header Pattern.
      </ListItem>
      <ListItem>
        Build the Pattern Library page.
      </ListItem>
      <ListItem>
        Build the Pattern detail page with Edit, Preview, and Code modes.
      </ListItem>
      <ListItem>
        Allow Pattern insertion into the main Editor.
      </ListItem>
    </List>
  </Section>
  <Section padding="sm" as="section" contentWidth="lg" borderStyle="solid" borderVariant="subtle" radius="none" gap="sm">
    <Heading as="h2" size="md" type="heading" color="default" align="left">
      Suggested Build Order
    </Heading>
    <Code variant="block" wrapping>
      1. Rename Templates to Patterns.
2. Add Pattern TypeScript schema and mock data.
3. Create Page Header Pattern mock.
4. Build Pattern Library page.
5. Build Pattern detail page with Edit, Preview, Code tabs.
6. Add lock metadata to Pattern JSON.
7. Add editable field metadata to Pattern JSON.
8. Add slot metadata to Pattern JSON.
9. Render Pattern preview from JSON.
10. Add Pattern insert panel to main Editor.
11. Allow Pattern drag/drop or insert into page.
12. Add Pattern instance model.
13. Show editable Pattern fields in configurator.
14. Show locked Pattern fields as disabled with lock labels.
15. Add guidance display in configurator.
16. Add basic rule display.
17. Add create Pattern from selected editor node.
18. Add manual Pattern JSON creation.
19. Add comments.
20. Add AI-generated rule suggestions.
    </Code>
  </Section>
  </>
  )
}
