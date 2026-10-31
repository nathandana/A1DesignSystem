import React, { Children, isValidElement, useId, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Stack,
  Heading,
  Paragraph,
  List,
  Link,
  Code,
  Blockquote,
  Divider,
  DataTable,
} from "@gtivr4/a1-design-system-react";

const elements = (children) =>
  Children.toArray(children).filter(isValidElement);
const plainText = (node) =>
  typeof node === "string"
    ? node
    : Array.isArray(node)
      ? node.map(plainText).join("")
      : node?.props
        ? plainText(node.props.children)
        : "";
const slug = (text) =>
  text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");

function MarkdownTable({ children }) {
  const sections = elements(children);
  const cells = (row) => elements(row?.props.children);
  const header = cells(
    elements(sections.find((s) => s.type === "thead")?.props.children)[0],
  );
  const rows = elements(
    sections.find((s) => s.type === "tbody")?.props.children,
  ).map((row, id) => ({
    id,
    cells: cells(row).map((cell) => cell.props.children),
  }));
  return (
    <DataTable
      caption="Source table"
      mobileLayout="table"
      columns={header.map((cell, index) => ({
        key: String(index),
        label: cell.props.children,
        renderCell: ({ row }) => row.cells[index],
      }))}
      rows={rows}
    />
  );
}
// Static document tables reuse A1 table styling without data-management controls.
function DocumentTable({ children }) {
  return (
    <div
      className="a1-data-table-scroll a1-data-table-scroll--scrollable"
      role="region"
      aria-label="Scrollable audit table"
      tabIndex={0}
    >
      <table className="a1-data-table" aria-label="Audit evidence table">
        {children}
      </table>
    </div>
  );
}

/** Render source Markdown as React elements; raw HTML never executes. */
export function Markdown({
  children,
  sourcePath = "",
  records = [],
  headingLevel = 2,
  document = false,
}) {
  const prefix = useId(),
    container = useRef(null);
  const headings = new Map();
  const components = {
    p: ({ children }) => <Paragraph>{children}</Paragraph>,
    ul: ({ children }) => <List>{children}</List>,
    ol: ({ children, start }) => (
      <List
        as="ol"
        start={start}
        style={start ? { counterReset: `a1-list ${start - 1}` } : undefined}
      >
        {children}
      </List>
    ),
    // A block container keeps nested lists and paragraphs valid within each li.
    li: ({ children }) => (
      <li className="a1-list-item">
        <span className="a1-list-item__marker" aria-hidden="true" />
        <Stack gap="sm" className="a1-list-item__content">
          {children}
        </Stack>
      </li>
    ),
    blockquote: ({ children }) => (
      <Blockquote>
        <Stack gap="sm">{children}</Stack>
      </Blockquote>
    ),
    hr: () => <Divider />,
    code: ({ children }) => <Code>{children}</Code>,
    pre: ({ children }) => (
      <Code variant="block" wrapping copyCode>
        {plainText(children).replace(/\n$/, "")}
      </Code>
    ),
    table: document ? DocumentTable : MarkdownTable,
    th: ({ children }) => <th scope="col">{children}</th>,
    input: ({ checked }) => (
      <input
        type="checkbox"
        checked={Boolean(checked)}
        disabled
        aria-label={checked ? "Completed task" : "Incomplete task"}
      />
    ),
    // Do not fetch arbitrary remote images embedded in imported documents.
    img: ({ alt }) => <span>{alt ? `[Image: ${alt}]` : "[Image]"}</span>,
    a: ({ href, children, title }) => {
      if (!href) return <span>{children}</span>;
      if (href.startsWith("#"))
        return (
          <Link
            href={href}
            onClick={(event) => {
              event.preventDefault();
              let anchor;
              try {
                anchor = decodeURIComponent(href.slice(1));
              } catch {
                return;
              }
              const target = Array.from(
                container.current?.querySelectorAll("[data-md-anchor]") || [],
              ).find((node) => node.dataset.mdAnchor === anchor);
              target?.scrollIntoView({ block: "start" });
              target?.focus({ preventScroll: true });
            }}
          >
            {children}
          </Link>
        );
      if (/^https?:\/\//i.test(href))
        return (
          <Link href={href} title={title} target="_blank" rel="noreferrer">
            {children}
          </Link>
        );
      // Resolve relative export links only to records in the current collection.
      try {
        const target = new URL(
          href,
          `https://sce-source.invalid/${sourcePath}`,
        );
        const record =
          target.origin === "https://sce-source.invalid" &&
          records.find(
            (r) =>
              r.kind === "source" &&
              r.localPath === decodeURIComponent(target.pathname.slice(1)),
          );
        if (record)
          return <Link href={`#record/${record.id}`}>{children}</Link>;
      } catch {
        /* Invalid or unavailable source link remains readable text. */
      }
      return (
        <span title="Source link unavailable in this workspace">
          {children}
        </span>
      );
    },
  };
  for (let level = 1; level <= 6; level++)
    components[`h${level}`] = ({ children }) => {
      const base = slug(plainText(children)),
        count = headings.get(base) || 0;
      headings.set(base, count + 1);
      const anchor = `${base}${count ? `-${count}` : ""}`;
      return (
        <Heading
          as={`h${Math.min(6, headingLevel + level - 1)}`}
          size={level === 1 ? "md" : "sm"}
          id={`${prefix}-${anchor}`}
          data-md-anchor={anchor}
          tabIndex={-1}
        >
          {children}
        </Heading>
      );
    };
  if (!children) return null;
  return (
    <Stack ref={container} gap="md" className="a1-sce-markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {String(children)}
      </ReactMarkdown>
    </Stack>
  );
}
