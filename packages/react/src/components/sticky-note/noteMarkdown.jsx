"use client";

import { Fragment } from "react";
import { Code } from "../code/Code.jsx";
import { Link } from "../link/Link.jsx";
import { List, ListItem } from "../list/List.jsx";
import { Paragraph } from "../paragraph/Paragraph.jsx";
import { Stack } from "../stack/Stack.jsx";

/*
 * Basic Markdown for StickyNote content, rendered straight to React elements
 * (never through HTML, so authored text can't inject markup).
 *
 * Blocks: paragraphs (separated by a blank line; a single line break is kept),
 * "- " / "* " / "+ " bulleted lists and "1. " / "1) " numbered lists.
 * Inline: **bold** / __bold__, *italic* / _italic_, ~~strikethrough~~,
 * `code` and [links](https://example.com). A backslash escapes a marker.
 * Markers must hug non-space characters, so "5 * 3" stays literal, and
 * underscores inside words (snake_case) are not emphasis.
 */

const BULLET = /^\s*[-*+]\s+(.*)$/;
const NUMBERED = /^\s*\d+[.)]\s+(.*)$/;
const ESCAPABLE = "\\`*_~[]()#+-.!";
// Relative URLs, fragments and these schemes only — never javascript: or data:.
const SAFE_URL = /^(https?:|mailto:|tel:|\/|#|\.{1,2}\/|[^:/?#]*(?:[/?#]|$))/i;

function isSpace(char) {
  return char === undefined || /\s/.test(char);
}

function isWordChar(char) {
  return char !== undefined && /[\p{L}\p{N}]/u.test(char);
}

// Index of the closing delimiter for an opener at `start`, or -1. The closer
// must follow a non-space character; single `*` / `_` skip doubled markers so
// `*a **b** c*` closes on the final asterisk.
function findCloser(text, delimiter, start) {
  let index = text.indexOf(delimiter, start);
  while (index !== -1) {
    const doubled = delimiter.length === 1
      && (text[index + 1] === delimiter || text[index - 1] === delimiter);
    const wordBound = delimiter !== "_" || !isWordChar(text[index + 1]);
    if (!doubled && wordBound && !isSpace(text[index - 1]) && text[index - 1] !== "\\") {
      return index;
    }
    index = text.indexOf(delimiter, index + (doubled ? 2 : 1));
  }
  return -1;
}

function parseInline(text, keys) {
  const nodes = [];
  let buffer = "";
  const flush = () => {
    if (buffer) nodes.push(buffer);
    buffer = "";
  };

  let i = 0;
  while (i < text.length) {
    const char = text[i];

    if (char === "\\" && ESCAPABLE.includes(text[i + 1] ?? "")) {
      buffer += text[i + 1];
      i += 2;
      continue;
    }

    if (char === "`") {
      const end = text.indexOf("`", i + 1);
      if (end > i + 1) {
        flush();
        nodes.push(<Code key={keys.next()} variant="inline">{text.slice(i + 1, end)}</Code>);
        i = end + 1;
        continue;
      }
    }

    if (char === "[") {
      const close = text.indexOf("](", i + 1);
      const end = close === -1 ? -1 : text.indexOf(")", close + 2);
      if (close > i + 1 && end !== -1) {
        const href = text.slice(close + 2, end).trim();
        if (href && SAFE_URL.test(href)) {
          flush();
          nodes.push(
            <Link key={keys.next()} href={href} className="a1-sticky-note__link">
              {parseInline(text.slice(i + 1, close), keys)}
            </Link>,
          );
          i = end + 1;
          continue;
        }
      }
    }

    const pair = text.slice(i, i + 2);
    const delimiter = pair === "**" || pair === "__" || pair === "~~"
      ? pair
      : char === "*" || char === "_"
        ? char
        : null;
    const opens = delimiter
      && !isSpace(text[i + delimiter.length])
      && (delimiter !== "_" || !isWordChar(text[i - 1]));
    if (opens) {
      const end = findCloser(text, delimiter, i + delimiter.length + 1);
      if (end !== -1) {
        const inner = parseInline(text.slice(i + delimiter.length, end), keys);
        const Tag = delimiter === "~~" ? "s" : delimiter.length === 2 ? "strong" : "em";
        flush();
        nodes.push(<Tag key={keys.next()}>{inner}</Tag>);
        i = end + delimiter.length;
        continue;
      }
    }

    buffer += char;
    i += 1;
  }
  flush();
  return nodes;
}

function parseBlocks(text) {
  const blocks = [];
  let current = null;
  for (const line of text.replace(/\r\n?/g, "\n").split("\n")) {
    if (!line.trim()) {
      current = null;
      continue;
    }
    const bullet = line.match(BULLET);
    const numbered = !bullet && line.match(NUMBERED);
    const type = bullet ? "ul" : numbered ? "ol" : "p";
    const content = bullet ? bullet[1] : numbered ? numbered[1] : line.trim();
    if (!current || current.type !== type) {
      current = { type, lines: [] };
      blocks.push(current);
    }
    current.lines.push(content);
  }
  return blocks;
}

/** Render a Markdown string as StickyNote content. */
export function renderNoteMarkdown(text) {
  let count = 0;
  const keys = { next: () => `md-${count++}` };
  const blocks = parseBlocks(text).map((block, index) => {
    if (block.type === "p") {
      return (
        <Paragraph key={index} size="sm">
          {block.lines.map((line, lineIndex) => (
            <Fragment key={lineIndex}>
              {lineIndex > 0 && <br />}
              {parseInline(line, keys)}
            </Fragment>
          ))}
        </Paragraph>
      );
    }
    return (
      <List key={index} as={block.type} size="sm">
        {block.lines.map((line, lineIndex) => (
          <ListItem key={lineIndex}>{parseInline(line, keys)}</ListItem>
        ))}
      </List>
    );
  });
  if (blocks.length === 0) return null;
  if (blocks.length === 1) return blocks[0];
  return <Stack direction="column" gap="sm">{blocks}</Stack>;
}
