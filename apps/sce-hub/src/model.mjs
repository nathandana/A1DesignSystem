export const statuses = ["Approved", "Rejected", "Needs further discussion"];
export const readiness = [
  "Human guidance",
  "Agent instruction",
  "Automatically testable rule",
];
export const groups = [
  "Components",
  "Patterns/tasks",
  "Topics",
  "Platforms/contexts",
];
export const nodeTypes = [
  "Token source",
  "Figma variables",
  "Figma library",
  "Figma component",
  "React library",
  "React component",
  "Pattern",
  "Documentation",
  "Guideline",
  "Team/owner",
  "Product",
  "Business area",
];
export const relationships = [
  "feeds",
  "implements",
  "consumes",
  "owns",
  "documents",
  "affects",
];
export const kinds = [
  "guideline",
  "source",
  "node",
  "edge",
  "report",
  "finding",
  "weekly",
  "initiative",
  "view",
];
export const textOf = (r) =>
  [
    r.title,
    r.original,
    r.proposed,
    r.rationale,
    r.owner,
    r.summary,
    r.body,
    r.recommendation,
    r.type,
    r.relation,
    r.from,
    r.to,
    r.sourceUrl,
    r.sourceVersion,
    r.nodeRef,
    r.severity,
    r.confidence,
    r.enforcement,
    ...(r.tags || []),
    ...(r.readiness || []),
    ...(r.links || []),
    ...(r.comments || []).map((c) => c.text),
    ...(r.decisions || []).map((d) => `${d.status} ${d.reason} ${d.actor}`),
    ...(r.pages || []).map((p) => p.text),
  ]
    .filter(Boolean)
    .join("\n");
export function safeUrl(value) {
  try {
    const u = new URL(value);
    return ["https:", "http:"].includes(u.protocol) ? u.href : null;
  } catch {
    return null;
  }
}
export function parseCSV(input) {
  const rows = [];
  let row = [],
    cell = "",
    quoted = false;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c === '"') {
      if (quoted && input[i + 1] === '"') {
        cell += '"';
        i++;
      } else quoted = !quoted;
    } else if (c === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if (c === "\n" && !quoted) {
      row.push(cell.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  if (quoted) throw new Error("CSV has an unclosed quoted field.");
  if (cell || row.length) {
    row.push(cell.replace(/\r$/, ""));
    rows.push(row);
  }
  const headers = rows.shift()?.map((x) => x.trim()) || [];
  if (!headers.includes("title") || !headers.includes("original"))
    throw new Error("CSV needs title and original columns.");
  return rows
    .filter((r) => r.some(Boolean))
    .map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i] || ""])));
}
export function parseImport(input, format = "json") {
  let rows;
  if (format === "csv") rows = parseCSV(input);
  else if (format === "text")
    rows = [
      {
        title: input.trim().split("\n")[0].slice(0, 160),
        original: input.trim(),
      },
    ];
  else {
    const parsed = JSON.parse(input);
    rows = Array.isArray(parsed) ? parsed : parsed.records;
  }
  if (!Array.isArray(rows) || !rows.length || rows.length > 2000)
    throw new Error("Import 1–2,000 records at a time.");
  return rows.map((r, i) => {
    if (
      !r ||
      typeof r.title !== "string" ||
      !r.title.trim() ||
      typeof r.original !== "string" ||
      !r.original.trim()
    )
      throw new Error(`Row ${i + 1} needs a title and original text.`);
    if (r.title.length > 500 || r.original.length > 100000)
      throw new Error(`Row ${i + 1} exceeds the text limit.`);
    if (r.sourceUrl && !safeUrl(r.sourceUrl))
      throw new Error(`Row ${i + 1} has an invalid source URL.`);
    const tags = Array.isArray(r.tags)
      ? r.tags
      : String(r.tags || "")
          .split("|")
          .filter(Boolean);
    if (
      tags.some(
        (t) =>
          typeof t !== "string" || !groups.some((g) => t.startsWith(`${g}:`)),
      )
    )
      throw new Error(
        `Row ${i + 1}: prefix tags with a supported group, such as Components:Checkbox.`,
      );
    return {
      kind: "guideline",
      title: r.title.trim(),
      original: r.original,
      proposed: String(r.proposed || ""),
      rationale: String(r.rationale || ""),
      sourceUrl: String(r.sourceUrl || ""),
      nodeRef: String(r.nodeRef || ""),
      sourceVersion: String(r.sourceVersion || ""),
      externalId: String(r.id || r.externalId || ""),
      tags,
      owner: String(r.owner || ""),
      readiness: [],
      status: null,
      comments: [],
      decisions: [],
      links: [],
    };
  });
}
export function reachable(id, edges, direction = "downstream") {
  // A consumer/implementation/owner points at its dependency in the stored graph.
  // Impact travels from that dependency back to the consumer, implementation or owner.
  edges = edges.map((edge) =>
    ["consumes", "implements", "documents", "owns"].includes(edge.relation)
      ? { ...edge, from: edge.to, to: edge.from }
      : edge,
  );
  const seen = new Set([id]),
    queue = [id];
  while (queue.length) {
    const current = queue.shift();
    for (const e of edges) {
      const a = direction === "upstream" ? e.to : e.from;
      const b = direction === "upstream" ? e.from : e.to;
      if (a === current && !seen.has(b)) {
        seen.add(b);
        queue.push(b);
      }
    }
  }
  seen.delete(id);
  return [...seen];
}
export function nyDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
export function weekDates(input) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input))
    throw new Error("Choose a valid week date.");
  const d = new Date(`${input}T12:00:00Z`);
  if (!Number.isFinite(+d) || d.toISOString().slice(0, 10) !== input)
    throw new Error("Choose a valid week date.");
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  const start = d.toISOString().slice(0, 10);
  d.setUTCDate(d.getUTCDate() + 7);
  return { start, end: d.toISOString().slice(0, 10) };
}
