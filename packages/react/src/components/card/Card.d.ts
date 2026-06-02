import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  /** Underlying element. Default: "div" */
  as?: React.ElementType;
  /** Remove the card border and background. Default: false */
  bare?: boolean;
  /** Material Symbols icon shown in the card body area */
  icon?: string;
  /** Material Symbols icon shown in a coloured hero block at the top of the card */
  heroIcon?: string;
  /**
   * Background colour of the hero block.
   * Accepts a semantic colour role or any valid CSS colour value.
   * Default: "action"
   */
  heroColor?: "action" | "neutral" | "info" | "success" | "warn" | "error" | (string & {});
  children?: React.ReactNode;
}

export declare function Card(props: CardProps): React.ReactElement;
