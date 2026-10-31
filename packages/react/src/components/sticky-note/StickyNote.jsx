"use client";

import { useEffect, useId, useRef, useState } from "react";
import "./sticky-note.css";
import { Heading } from "../heading/Heading.jsx";
import { IconButton } from "../icon-button/IconButton.jsx";
import { InlineEditable } from "../inline-editable/InlineEditable.jsx";
import { useLabel } from "../labels/Labels.jsx";
import { MessageBadge } from "../message/Message.jsx";
import { Paragraph } from "../paragraph/Paragraph.jsx";
import { renderNoteMarkdown } from "./noteMarkdown.jsx";

const COLORS = ["yellow", "orange", "green", "blue", "pink", "purple", "grey"];
const SIZES = ["auto", "xs", "sm", "md", "lg", "xl"];
const PLACEMENTS = ["inline", "floating"];
const ANCHORS = ["top-start", "top-end", "bottom-start", "bottom-end"];
const TITLE_LEVELS = ["h2", "h3", "h4", "h5", "h6", "p"];
// Arrow-key move steps for a movable note, matching base.spacing.8 / .32.
const MOVE_STEP = 8;
const MOVE_STEP_LARGE = 32;
const ORIGIN = { x: 0, y: 0 };

/**
 * StickyNote — a post-it style note with an optional title, author badge and
 * content. Paper colours come from the theme's colour ramps and stay light in
 * dark mode, with text that meets WCAG AA on every colour. Notes sit inline or
 * float over content (placement="floating", positioned in the nearest
 * positioned ancestor) on the content z-layer, below sticky chrome and popovers.
 * A floating note can be `movable`: a move handle drags it (pointer) or nudges it
 * (arrow keys), offset from its anchor and kept inside its positioned parent.
 * String content is read as basic Markdown (bold, italics, links, code,
 * lists) unless `markdown` is false. With `editing`, the title and content are
 * edited in place (the content as Markdown source); leaving the note or
 * pressing Escape calls `onEditingChange(false)`.
 */
export function StickyNote({
  title,
  author,
  color = "yellow",
  width = "md",
  height = "auto",
  resizable = false,
  placement = "inline",
  anchor = "top-end",
  titleAs = "h3",
  markdown = true,
  editing = false,
  onTitleChange,
  onContentChange,
  onEditingChange,
  movable = false,
  position,
  defaultPosition = ORIGIN,
  onMove,
  className = "",
  style,
  children,
  ...rest
}) {
  const titleId = useId();
  const authorLabel = useLabel("stickyNote.author", "Author");
  const noteLabel = useLabel("stickyNote.note", "Sticky note");
  const moveLabel = useLabel("stickyNote.move", "Move note");
  const moveHint = useLabel("stickyNote.moveHint", "Drag, or use the arrow keys. Hold Shift to move further.");
  const moveHintId = useId();
  const titlePlaceholder = useLabel("stickyNote.titlePlaceholder", "Title");
  const contentPlaceholder = useLabel("stickyNote.contentPlaceholder", "Write a note");
  const titleFieldLabel = useLabel("stickyNote.titleField", "Note title");
  const contentFieldLabel = useLabel("stickyNote.contentField", "Note content");
  const noteRef = useRef(null);
  const dragRef = useRef(null);
  const [internalPosition, setInternalPosition] = useState(defaultPosition);

  const resolvedColor = COLORS.includes(color) ? color : "yellow";
  const resolvedWidth = SIZES.includes(width) ? width : "md";
  const resolvedHeight = SIZES.includes(height) ? height : "auto";
  const resolvedPlacement = PLACEMENTS.includes(placement) ? placement : "inline";
  const resolvedAnchor = ANCHORS.includes(anchor) ? anchor : "top-end";
  const resolvedTitleAs = TITLE_LEVELS.includes(titleAs) ? titleAs : "h3";
  // A fixed or resizable height can clip content, so the note scrolls — and is
  // focusable so keyboard users can scroll it.
  const scrolls = resizable || resolvedHeight !== "auto";
  // Entering edit mode puts the caret at the end of the content.
  useEffect(() => {
    if (!editing) return;
    const field = noteRef.current?.querySelector(".a1-sticky-note__body [contenteditable]");
    if (!field) return;
    field.focus({ preventScroll: true });
    const selection = field.ownerDocument.getSelection?.();
    if (selection) {
      selection.selectAllChildren(field);
      selection.collapseToEnd();
    }
  }, [editing]);

  // Leaving the note (focus moves outside it) ends editing.
  function handleBlur(event) {
    if (editing && !event.currentTarget.contains(event.relatedTarget)) onEditingChange?.(false);
  }

  // Moving only applies to floating notes: an inline note stays in the flow.
  const canMove = movable && resolvedPlacement === "floating";
  const offset = position ?? internalPosition ?? ORIGIN;

  // Keep the whole note inside its positioned parent. The note's resting box
  // is its current box minus the applied offset.
  function clampToParent(next) {
    const note = noteRef.current;
    const parent = note?.offsetParent;
    if (!note || !parent) return next;
    const rect = note.getBoundingClientRect();
    const bounds = parent.getBoundingClientRect();
    const restLeft = rect.left - offset.x;
    const restTop = rect.top - offset.y;
    const minX = bounds.left + parent.clientLeft - restLeft;
    const minY = bounds.top + parent.clientTop - restTop;
    const maxX = Math.max(minX, minX + parent.clientWidth - rect.width);
    const maxY = Math.max(minY, minY + parent.clientHeight - rect.height);
    // Round inward so a fractional edge never pushes the note past its parent.
    return {
      x: Math.min(Math.floor(maxX), Math.max(Math.ceil(minX), Math.round(next.x))),
      y: Math.min(Math.floor(maxY), Math.max(Math.ceil(minY), Math.round(next.y))),
    };
  }

  function moveTo(next) {
    const clamped = clampToParent(next);
    if (position === undefined) setInternalPosition(clamped);
    onMove?.(clamped);
  }

  function handlePointerDown(event) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragRef.current = { pointerX: event.clientX, pointerY: event.clientY, start: offset };
  }

  function handlePointerMove(event) {
    const drag = dragRef.current;
    if (!drag) return;
    moveTo({ x: drag.start.x + event.clientX - drag.pointerX, y: drag.start.y + event.clientY - drag.pointerY });
  }

  function endDrag(event) {
    if (!dragRef.current) return;
    dragRef.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  }

  function handleMoveKeyDown(event) {
    // Escape during a drag returns the note to where the drag started.
    if (event.key === "Escape" && dragRef.current) {
      moveTo(dragRef.current.start);
      dragRef.current = null;
      return;
    }
    const step = event.shiftKey ? MOVE_STEP_LARGE : MOVE_STEP;
    const delta = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    }[event.key];
    if (!delta) return;
    event.preventDefault();
    moveTo({ x: offset.x + delta[0], y: offset.y + delta[1] });
  }

  const classes = [
    "a1-sticky-note",
    `a1-sticky-note--${resolvedColor}`,
    `a1-sticky-note--width-${resolvedWidth}`,
    `a1-sticky-note--height-${resolvedHeight}`,
    scrolls && "a1-sticky-note--scrolls",
    resizable && "a1-sticky-note--resizable",
    resolvedPlacement === "floating" && `a1-sticky-note--floating a1-sticky-note--${resolvedAnchor}`,
    canMove && "a1-sticky-note--movable",
    editing && "a1-sticky-note--editing",
    className,
  ].filter(Boolean).join(" ");

  return (
    <aside
      ref={noteRef}
      className={classes}
      style={canMove ? { ...style, "--a1-sticky-note-offset-x": `${offset.x}px`, "--a1-sticky-note-offset-y": `${offset.y}px` } : style}
      aria-labelledby={title && !editing ? titleId : undefined}
      aria-label={title && !editing ? undefined : noteLabel}
      tabIndex={scrolls ? 0 : undefined}
      onBlur={handleBlur}
      {...rest}
    >
      {(title || author || canMove || editing) && (
        <div className="a1-sticky-note__header">
          {canMove && (
            <>
              <IconButton
                icon="drag_indicator"
                label={moveLabel}
                size="sm"
                className="a1-sticky-note__move"
                aria-describedby={moveHintId}
                aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onKeyDown={handleMoveKeyDown}
              />
              <span id={moveHintId} className="a1-sticky-note__visually-hidden">{moveHint}</span>
            </>
          )}
          {editing ? (
            <Heading as={resolvedTitleAs} size="xs" id={titleId} className="a1-sticky-note__title">
              <InlineEditable
                seamless
                value={typeof title === "string" ? title : ""}
                onChange={(value) => onTitleChange?.(value)}
                placeholder={titlePlaceholder}
                aria-label={titleFieldLabel}
              />
            </Heading>
          ) : title && (
            <Heading as={resolvedTitleAs} size="xs" id={titleId} className="a1-sticky-note__title">
              {title}
            </Heading>
          )}
          {author && (
            <MessageBadge status="neutral" subtle size="sm" icon="person" className="a1-sticky-note__author">
              <span className="a1-sticky-note__visually-hidden">{authorLabel}: </span>
              {author}
            </MessageBadge>
          )}
        </div>
      )}
      {editing ? (
        <div className="a1-sticky-note__body">
          <Paragraph size="sm">
            <InlineEditable
              seamless
              multiline
              value={typeof children === "string" ? children : ""}
              onChange={(value) => onContentChange?.(value)}
              placeholder={contentPlaceholder}
              aria-label={contentFieldLabel}
            />
          </Paragraph>
        </div>
      ) : children != null && children !== false && children !== "" && (
        <div className="a1-sticky-note__body">
          {typeof children !== "string"
            ? children
            : markdown
              ? renderNoteMarkdown(children)
              : <Paragraph size="sm">{children}</Paragraph>}
        </div>
      )}
    </aside>
  );
}
