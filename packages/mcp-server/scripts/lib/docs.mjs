// Full-text MCP resources. These two docs are already written to be handed
// whole to a zero-context agent, so they're exposed verbatim rather than
// parsed into fields — see packages/react/ai/a1-agent-brief.md's own
// description of itself as "a single self-contained brief."

import fs from 'node:fs';
import { repoPath } from './paths.mjs';

const DOC_SOURCES = [
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
