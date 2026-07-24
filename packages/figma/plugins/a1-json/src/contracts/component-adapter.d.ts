export type ComponentChildrenCapability = 'none' | 'slot' | 'custom';

export interface ComponentAdapterCapabilities {
  update: boolean;
  children: ComponentChildrenCapability;
}

export interface FigmaComponentAdapterEntry {
  name: string;
  aliases?: string[];
  export?: (...args: unknown[]) => unknown;
  apply?: (...args: unknown[]) => unknown;
}

export interface ComponentAdapter {
  jsonType: string;
  import?: (...args: unknown[]) => unknown;
  figma: FigmaComponentAdapterEntry[];
  capabilities: ComponentAdapterCapabilities;
}
