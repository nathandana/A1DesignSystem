import { useState } from "react";
import { Pagination } from "./Pagination.jsx";

const meta = {
  title: "Components/Controls/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    page:       { control: { type: "number", min: 1 } },
    totalPages: { control: { type: "number", min: 1 } },
    siblings:   { control: { type: "number", min: 0, max: 3 } },
    size:       { control: "inline-radio", options: ["sm", "md"] },
  },
};

export default meta;

export const Default = {
  render: (args) => {
    const [page, setPage] = useState(args.page ?? 5);
    return (
      <Pagination
        {...args}
        page={page}
        totalPages={args.totalPages ?? 10}
        onChange={setPage}
      />
    );
  },
};

export const Sizes = {
  parameters: { controls: { include: ["totalPages", "siblings"] } },
  render: (args) => {
    const [mdPage, setMdPage] = useState(5);
    const [smPage, setSmPage] = useState(5);
    const total = args.totalPages ?? 10;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-24)", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--base-spacing-16)" }}>
          <span style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-xs)", color: "var(--semantic-color-text-muted)", width: "24px" }}>md</span>
          <Pagination page={mdPage} totalPages={total} onChange={setMdPage} size="md" siblings={args.siblings} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--base-spacing-16)" }}>
          <span style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-xs)", color: "var(--semantic-color-text-muted)", width: "24px" }}>sm</span>
          <Pagination page={smPage} totalPages={total} onChange={setSmPage} size="sm" siblings={args.siblings} />
        </div>
      </div>
    );
  },
};

export const Ellipsis = {
  name: "Ellipsis behaviour",
  parameters: { controls: { include: ["siblings", "size"] } },
  render: (args) => {
    const pages = [1, 3, 5, 8, 10];
    const [current, setCurrent] = useState(5);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-12)", alignItems: "flex-start" }}>
        {pages.map((p) => (
          <div key={p} style={{ display: "flex", alignItems: "center", gap: "var(--base-spacing-16)" }}>
            <span style={{ fontFamily: "monospace", fontSize: "var(--semantic-font-size-body-xs)", color: "var(--semantic-color-text-muted)", width: "52px" }}>
              page {p}
            </span>
            <Pagination {...args} page={p} totalPages={10} onChange={setCurrent} />
          </div>
        ))}
      </div>
    );
  },
};

export const FewPages = {
  name: "Few pages",
  parameters: { controls: { include: ["size"] } },
  render: (args) => {
    const [page, setPage] = useState(1);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-12)", alignItems: "flex-start" }}>
        {[1, 2, 3, 4, 5].map((total) => (
          <Pagination key={total} {...args} page={Math.min(page, total)} totalPages={total} onChange={setPage} />
        ))}
      </div>
    );
  },
};
