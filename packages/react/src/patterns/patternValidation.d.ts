export interface PatternDiagnostic {
  nodeId: string | null;
  path: string;
  ruleId: string;
  severity: 'error' | 'warning';
  message: string;
  recovery: string;
}
export interface PatternValidationResult { valid: boolean; diagnostics: PatternDiagnostic[] }
export declare function isPatternNavigationTarget(value: unknown): boolean;
export declare function validatePatterns(input: unknown): PatternValidationResult;
export declare function validatePatternEdit(previous: unknown, next: unknown): PatternValidationResult;
export declare function formatPatternDiagnostics(diagnostics: PatternDiagnostic[]): string;
