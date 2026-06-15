import * as generic from './generic.jsx'
import * as heading from './heading.jsx'
import * as paragraph from './paragraph.jsx'
import * as blockquote from './blockquote.jsx'
import * as definitionList from './definition-list.jsx'

// Registry of per-component detail modules. A component only needs an entry when
// it requires bespoke preview, controls, snippet, or default config. Anything
// not provided by a module falls back to the generic implementation.
const REGISTRY = {
  heading,
  paragraph,
  blockquote,
  'definition-list': definitionList,
}

export function getDetailModule(componentId) {
  const specific = REGISTRY[componentId] ?? {}
  return {
    getDefaultConfig: specific.getDefaultConfig ?? generic.getDefaultConfig,
    Preview: specific.Preview ?? generic.Preview,
    Controls: specific.Controls ?? generic.Controls,
    Snippet: specific.Snippet ?? generic.Snippet,
  }
}
