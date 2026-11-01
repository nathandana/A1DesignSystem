// Canonical full-text resources, exposed verbatim so MCP and package consumers
// receive the same setup and authoring instructions.

import fs from 'node:fs';
import { repoPath } from './paths.mjs';

const DOC_SOURCES = [
  {
    uri: 'a1://docs/design',
    title: 'A1 design language',
    description: 'Generated DESIGN.md-format tokens and rationale: hierarchy, layout, components, accessibility and React/JSON authoring.',
    file: 'design.md',
  },
  {
    uri: 'a1://docs/react-setup',
    title: 'A1 React library setup',
    description: 'Install the React library from npm; configure CSS, themes, fonts, PostCSS, Vite/Next.js and providers, with a minimal usage example.',
    file: 'packages/react/guidelines/setup.md',
  },
  {
    uri: 'a1://docs/json-validation',
    title: 'A1 JSON validation',
    description: 'Page/project validation inputs, outputs, repair workflow, contract sources and limits.',
    file: 'packages/react/ai/json-validation.md',
  },
  {
    uri: 'a1://docs/pattern-contracts',
    title: 'A1 formal pattern contracts',
    description: 'Generated formal pattern areas and rules; structured manifests are available through get_pattern.',
    file: 'packages/react/ai/pattern-contracts.generated.md',
  },
  {
    uri: 'a1://docs/agent-brief',
    title: 'A1 Agent Brief',
    description:
      'Self-contained brief for generating A1 page/project JSON: page-definition + project-bundle shapes, the full component type registry, value vocabularies, rules, and worked examples.',
    file: 'packages/react/ai/a1-agent-brief.md',
  },
  {
    uri: 'a1://docs/page-definition-standard',
    title: 'A1 Page-Definition JSON Standard',
    description:
      'The canonical, AI-readable standard for the A1 page-definition JSON feed rendered by the a1-web Editor.',
    file: 'packages/react/ai/page-definition-standard.md',
  },
];

export function parseDocs() {
  return DOC_SOURCES.map((doc) => ({
    ...doc,
    text: fs.readFileSync(repoPath(doc.file), 'utf8'),
  }));
}
