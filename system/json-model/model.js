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
export function getJsonModel(format = 'page') {
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
    guidance: {
      componentProps: 'Call get_component for the React API and JSON prop schema, including editor adapter differences.',
      patterns: 'Call get_pattern for a formal starter and its governed areas.',
      validation: 'Call validate_json with kind and document. Repair errors at their JSON Pointer paths and revalidate. Warnings are advisory. Validation never changes or saves the document; rendered layout and runtime accessibility require separate checks.',
      fullContract: 'Read a1://docs/page-definition-standard or a1://docs/agent-brief.',
    },
  };
}

export function getJsonPropsSchema(type) {
  const schema = contract.components[type];
  if (!schema) return null;
  return { $schema: 'http://json-schema.org/draft-07/schema#', ...schema, definitions: referencedDefinitions(schema) };
}
