import * as React from "react";

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Person's name. Used to derive initials and as the default accessible name. */
  name: string;
  /** Optional image source. A missing or failed image falls back to initials. */
  src?: string;
  /** Image alternative text. Defaults to `name`; pass an empty string when decorative. */
  alt?: string;
  /** Initials override. When omitted, the first letters of the first and last name are used. */
  initials?: string;
  /** Avatar size. Default: "md" */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export declare function Avatar(props: AvatarProps): React.ReactElement;
