import contract from './contract.generated.json' with { type: 'json' };

const resolve = schema => schema.$ref ? contract.definitions[schema.$ref.split('/').at(-1)] : schema;
function referencedDefinitions(schema) {
  const definitions = {};
  const visit = value => {
    if (!value || typeof value !== 'object') return;
    if (value.$ref) {
      const key = value.$ref.split('/').at(-1);
      if (!Object.hasOwn(definitions, key)) { definitions[key] = contract.definitions[key]; visit(definitions[key]); }
    }
    Object.values(value).forEach(visit);
  };
  visit(schema);
  return definitions;
}
const blankPage = (id = 'page', name = 'Untitled') => ({
  schemaVersion: contract.contractVersion,
  page: { id, name, layout: { type: 'PageLayout', regions: [{ id: 'main', name: 'Main', nodes: [] }] } },
});

/** Discovery and validation consume the same generated declarations. */
export function getJsonModel(format = 'project') {
  const schema = structuredClone(resolve(format === 'project' ? contract.projectSchema : contract.pageSchema));
  if (format === 'project') schema.properties.pages.minItems = 1;
  return {
    format,
    schemaVersion: contract.contractVersion,
    supportedVersions: contract.supportedVersions,
    schema: {
      $schema: 'http://json-schema.org/draft-07/schema#', ...schema,
      definitions: referencedDefinitions(schema),
      $defs: { componentNode: resolve(contract.nodeSchema) },
    },
    starter: format === 'project'
      ? { name: 'Untitled project', description: '', icon: 'web', pages: [{ id: 'home', title: 'Home', parentId: null, definition: blankPage('home', 'Home') }] }
      : blankPage(),
    mandatoryRules: contract.ruleCatalog.map(rule => ({ ruleId: rule.id, requirement: rule.requirement, components: [...rule.components], enforcement: structuredClone(rule.json) ?? { check: 'rendering-or-human-review' } })),
    workflow: [
      'Read and follow mandatoryRules before authoring. A valid schema is not full A1 compliance.',
      'For a website, use format: project and represent meaningful destinations as linked pages. Use page only for an explicitly single-page request; do not silently reduce a site to one scrolling page.',
      'Read get_component and get_pattern before using their props or areas. Prefer A1 patterns and project navigation over guessed props or custom substitutes.',
      'Generate A1 JSON, call validate_json, repair errors and review warnings and coverage. Revalidate the complete project so internal page references can be resolved.',
      'Call create_preview with the validated JSON. Open its A1 /preview/ URL, review responsive layout and accessibility, revise and create a new preview if needed.',
      'Return the A1 preview URL as the primary handoff, with the JSON and any remaining review limitations. Anyone can choose Edit as project from the preview.',
    ],
    guidance: {
      componentProps: 'Call get_component for the React API and JSON prop schema, including editor adapter differences.',
      patterns: 'Call get_pattern for a formal starter and its governed areas.',
      validation: 'Call validate_json with kind and document. Repair error-level rule violations before import or preview. Review warnings and coverage; schema validity is not overall compliance. Then call create_preview and check the rendered result.',
      language: 'Set page.layout.props.lang for the authored language, or props.lang on a subtree. English is the default. Approved acronym/name exceptions are visible in mandatoryRules; page-level bypasses are not supported.',
      composition: 'Use project navigation for page destinations. Use registered PageTitle, Breadcrumb and PageNav patterns/components when appropriate, and compose footer content from supported A1 nodes. A TopHeader inside PageLayout uses role: presentation; keep Sections in the main region. Do not use page navigation actions for guessed anchor targets.',
      react: 'Use get_react_setup when the user specifically asks for React library code or npm installation. The default MCP site workflow is JSON → validation → A1 preview.',
      fullContract: 'Read a1://docs/page-definition-standard or a1://docs/agent-brief.',
    },
  };
}

export function getJsonPropsSchema(type) {
  const schema = contract.components[type];
  if (!schema) return null;
  return { $schema: 'http://json-schema.org/draft-07/schema#', ...schema, definitions: referencedDefinitions(schema) };
}
