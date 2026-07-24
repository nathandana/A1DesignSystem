/**
 * Virtual team registry. Add a persona here and the runner + the dev-only Virtual Team
 * panel pick it up automatically. (Scrum master, designer, leader, developer come next —
 * each its own module implementing the `Persona` contract.)
 */
import { productOwner } from './productOwner';
import type { Persona } from './types';

export const PERSONAS: Persona[] = [
  productOwner,
];

export function getPersona(id: string): Persona | undefined {
  return PERSONAS.find((p) => p.id === id);
}

export type {
  Persona, PersonaVerdict, PersonaQuestion, PersonaRunSummary, PersonaChange, PersonaItemOutcome,
} from './types';
export { runPersona, runPersonaOnItem, runStatusCleanup } from './runPersona';
export { runPersonaOnItemWithCodex, askCodexProductOwnerQuestions } from './codexProductOwner';
export { askCodexEngineer } from './codexEngineer';
