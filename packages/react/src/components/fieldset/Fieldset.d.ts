import * as React from "react";

export interface FieldsetProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  /** `<legend>` text for the field group */
  legend?: string;
  /**
   * Size density applied to all child fields via context.
   * Individual fields can override this.
   */
  size?: "comfortable" | "default" | "compact";
  /**
   * Label position applied to all child fields via context.
   * Individual fields can override this.
   */
  labelPosition?: "above" | "side";
  /**
   * Show a "* Required field" note below the legend.
   * Only shown for "default" and "compact" sizes (comfortable fields show inline badges).
   * Default: false
   */
  markRequired?: boolean;
  /** Add a subtle surface background to the fieldset. Default: false */
  surface?: boolean;
  children?: React.ReactNode;
}

export declare function Fieldset(props: FieldsetProps): React.ReactElement;
