import type { PatternNode } from './patternPolicies.js';
import type { PatternValidationResult } from './patternValidation.js';
export declare function migratePatternNode<T extends PatternNode>(source: T): PatternValidationResult & { node: T | PatternNode };
