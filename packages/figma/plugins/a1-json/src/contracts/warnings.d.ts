export type WarningSeverity = 'info' | 'warning' | 'error';

export interface PluginWarning {
  message: string;
  severity?: WarningSeverity;
  nodeId?: string;
  componentName?: string;
  jsonType?: string;
}
