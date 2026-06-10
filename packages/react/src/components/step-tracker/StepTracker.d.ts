import * as React from "react";

export interface StepTrackerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Total number of steps. */
  steps: number;
  /** 1-indexed position of the current step. Default: 1. */
  currentStep?: number;
  /**
   * Horizontal alignment of the tracker within its container.
   * "left" | "center" | "right" — groups items together.
   * "full" — active pill expands to fill remaining space.
   * Default: "left".
   */
  align?: "left" | "center" | "right" | "full";
}

export declare function StepTracker(props: StepTrackerProps): React.ReactElement;
