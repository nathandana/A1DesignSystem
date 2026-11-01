// The application boundary returns the same structured result as MCP.
// Translate/format only when presenting diagnostics in an A1 component.
import { validateJson } from '../../../../system/json-model/validate.js';
export { validateJson, formatJsonDiagnostics } from '../../../../system/json-model/validate.js';

export function validateImportJson(document) {
  let parsed = document;
  if (typeof parsed === 'string') {
    try { parsed = JSON.parse(parsed); } catch { /* Shared validator diagnoses malformed JSON. */ }
  }
  return validateJson({ kind: parsed?.page ? 'page' : 'project', document });
}
