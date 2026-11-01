import * as React from "react";

export type StickyNoteColor = "yellow" | "orange" | "green" | "blue" | "pink" | "purple" | "grey";
export type StickyNoteSize = "auto" | "xs" | "sm" | "md" | "lg" | "xl";

export interface StickyNotePosition {
  /** Horizontal offset from the anchor corner, in px (positive = right). */
  x: number;
  /** Vertical offset from the anchor corner, in px (positive = down). */
  y: number;
}

export interface StickyNoteProps extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "color"> {
  /** Note title, shown as a heading and used as the note's accessible name. */
  title?: React.ReactNode;
  /** Author, shown as a badge (announced as "Author: …"). */
  author?: React.ReactNode;
  /**
   * Paper colour from the theme's colour ramps. Text on every colour meets WCAG AA,
   * and paper stays light in dark mode. Default: "yellow".
   */
  color?: StickyNoteColor;
  /** Width: a T-shirt size, or "auto" to fit the container. Default: "md". */
  width?: StickyNoteSize;
  /**
   * Height: a T-shirt size, or "auto" to fit the content. A fixed height scrolls
   * its content (the note becomes focusable so it can be scrolled by keyboard). Default: "auto".
   */
  height?: StickyNoteSize;
  /** Let the user resize the height, like a textarea. Default: false. */
  resizable?: boolean;
  /**
   * "inline" (default) sits in the flow. "floating" places the note over content at a
   * corner (`anchor`) of its nearest positioned ancestor, on the content z-layer:
   * above in-flow content, below sticky chrome and popovers.
   */
  placement?: "inline" | "floating";
  /** Corner for placement="floating". Default: "top-end". */
  anchor?: "top-start" | "top-end" | "bottom-start" | "bottom-end";
  /**
   * Floating notes only: show a move handle so people can drag the note (pointer)
   * or nudge it with the arrow keys (Shift for larger steps). The note stays
   * inside its positioned parent; Escape during a drag returns it. Default: false.
   */
  movable?: boolean;
  /** Controlled offset from the anchor corner for a movable note. */
  position?: StickyNotePosition;
  /** Initial offset for an uncontrolled movable note. Default: { x: 0, y: 0 }. */
  defaultPosition?: StickyNotePosition;
  /** Called with the new (clamped) offset whenever a movable note moves. */
  onMove?: (position: StickyNotePosition) => void;
  /** Heading level for the title. Default: "h3". */
  titleAs?: "h2" | "h3" | "h4" | "h5" | "h6" | "p";
  /**
   * Read string content as basic Markdown: **bold**, *italic*, ~~strikethrough~~,
   * `code`, [links](https://example.com), "- " bulleted and "1. " numbered lists,
   * and paragraphs separated by a blank line. Rendered as A1 Paragraph, List,
   * Link and Code — never as raw HTML; only http(s), mailto, tel and relative
   * links are linked. Set false to show the string literally. Default: true.
   */
  markdown?: boolean;
  /**
   * Edit the title and content in place: both become seamless text fields
   * (the content as Markdown source) and the content field takes focus. The
   * note stays controlled — handle `onTitleChange` / `onContentChange`, and
   * `onEditingChange(false)` when focus leaves the note or Escape is pressed.
   * Default: false.
   */
  editing?: boolean;
  /** Called with the new title as it's typed while `editing`. */
  onTitleChange?: (title: string) => void;
  /** Called with the new Markdown content as it's typed while `editing`. */
  onContentChange?: (content: string) => void;
  /** Called with `false` when editing should end (focus left the note or Escape). */
  onEditingChange?: (editing: boolean) => void;
  /** Note content. A string is read as Markdown (see `markdown`); other nodes render as given. */
  children?: React.ReactNode;
}

export declare function StickyNote(props: StickyNoteProps): React.ReactElement;
