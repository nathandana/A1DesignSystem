const PAGE_SCHEMA_VERSION = '1.1.0';

function definitions(componentTypes) {
  return {
    componentNode: {
      type: 'object',
      required: ['id', 'type'],
      properties: {
        id: { type: 'string', minLength: 1 },
        type: { type: 'string', enum: componentTypes },
        patternVersion: { type: 'string' },
        name: { type: 'string' },
        props: { type: 'object' },
        utilities: { type: 'object' },
        responsive: { type: 'object' },
        visibility: { oneOf: [{ type: 'boolean' }, { type: 'object' }] },
        content: { type: 'object' },
        a11y: { type: 'object' },
        actions: { type: 'object' },
        lock: { type: 'object' },
        patternInstance: { type: 'object' },
        patternNodeId: { type: 'string' },
        repeat: { oneOf: [{ type: 'string' }, { type: 'object' }] },
        collections: { type: 'object' },
        children: { type: 'array', items: { $ref: '#/$defs/componentNode' } },
      },
      additionalProperties: false,
    },
    pageDefinition: {
      type: 'object',
      required: ['schemaVersion', 'page'],
      properties: {
        schemaVersion: { const: PAGE_SCHEMA_VERSION },
        page: {
          type: 'object',
          required: ['id', 'name', 'layout'],
          properties: {
            id: { type: 'string', minLength: 1 },
            name: { type: 'string', minLength: 1 },
            description: { type: 'string' },
            icon: { type: 'string' },
            detailDataset: { type: 'string' },
            detailPreviewId: { type: 'string' },
            layout: {
              type: 'object',
              required: ['type', 'regions'],
              properties: {
                type: { const: 'PageLayout' },
                props: { type: 'object' },
                regions: {
                  type: 'array',
                  minItems: 1,
                  items: {
                    type: 'object',
                    required: ['id', 'nodes'],
                    properties: {
                      id: { type: 'string', minLength: 1 },
                      name: { type: 'string' },
                      nodes: { type: 'array', items: { $ref: '#/$defs/componentNode' } },
                    },
                    additionalProperties: false,
                  },
                },
              },
              additionalProperties: false,
            },
          },
          additionalProperties: false,
        },
      },
      additionalProperties: false,
    },
  };
}

function blankPage(id = 'page', name = 'Untitled') {
  return {
    schemaVersion: PAGE_SCHEMA_VERSION,
    page: {
      id,
      name,
      layout: {
        type: 'PageLayout',
        regions: [{ id: 'main', name: 'Main', nodes: [] }],
      },
    },
  };
}

export function getJsonModel(format, componentTypes) {
  const $defs = definitions(componentTypes);
  const page = blankPage();
  const project = {
    name: 'Untitled project',
    description: '',
    icon: 'web',
    pages: [{ id: 'home', title: 'Home', parentId: null, definition: blankPage('home', 'Home') }],
  };
  const projectSchema = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    type: 'object',
    required: ['name', 'pages'],
    properties: {
      name: { type: 'string', minLength: 1 },
      description: { type: 'string' },
      icon: { type: 'string' },
      theme: { type: 'string' },
      pages: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: ['id', 'title', 'parentId', 'definition'],
          properties: {
            id: { type: 'string', minLength: 1 },
            title: { type: 'string', minLength: 1 },
            icon: { type: 'string' },
            description: { type: 'string' },
            parentId: { type: ['string', 'null'] },
            definition: { $ref: '#/$defs/pageDefinition' },
          },
          additionalProperties: false,
        },
      },
    },
    additionalProperties: false,
    $defs,
  };
  const pageSchema = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $ref: '#/$defs/pageDefinition',
    $defs,
  };

  return {
    format,
    schemaVersion: PAGE_SCHEMA_VERSION,
    schema: format === 'project' ? projectSchema : pageSchema,
    starter: format === 'project' ? project : page,
    guidance: {
      componentProps: 'Call get_component with a component name before authoring its props.',
      patterns: 'Call get_pattern for a formal starter and validate_patterns before returning JSON.',
      fullContract: 'Read a1://docs/page-definition-standard or a1://docs/agent-brief.',
    },
  };
}
