import "./inline.css";

const meta = {
  title: "Components/Typography/Inline",
  tags: ["autodocs"],
};

export default meta;

// ─── All ──────────────────────────────────────────────────────────────────────

export const All = {
  render: () => (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <tbody>
        {[
          ["strong",        <p>The quick <strong>brown fox jumps</strong> over the lazy dog.</p>],
          ["b",             <p>The quick <b>brown fox jumps</b> over the lazy dog.</p>],
          ["em",            <p>The quick <em>brown fox jumps</em> over the lazy dog.</p>],
          ["i",             <p>The quick <i>brown fox jumps</i> over the lazy dog.</p>],
          ["u",             <p>The quick <u>brown fox jumps</u> over the lazy dog.</p>],
          ["s",             <p>The quick <s>brown fox jumps</s> over the lazy dog.</p>],
          ["del",           <p>The quick <del>brown fox jumps</del> over the lazy dog.</p>],
          ["ins",           <p>The quick <ins>brown fox jumps</ins> over the lazy dog.</p>],
          ["mark",          <p>The quick <mark>brown fox jumps</mark> over the lazy dog.</p>],
          ["small",         <p>The quick <small>brown fox jumps</small> over the lazy dog.</p>],
          ["sub",           <p>H<sub>2</sub>O and CO<sub>2</sub> are common chemical formulas.</p>],
          ["sup",           <p>E = mc<sup>2</sup> and (a + b)<sup>n</sup> are well-known expressions.</p>],
          ["abbr",          <p><abbr title="Cascading Style Sheets">CSS</abbr> and <abbr title="HyperText Markup Language">HTML</abbr> are the building blocks of the web.</p>],
          ["cite",          <p>As described in <cite>The Elements of Typographic Style</cite>, good typography is largely invisible.</p>],
          ["q",             <p>She said <q>the system should feel effortless</q> and left it at that.</p>],
          ["time",          <p>The release is scheduled for <time dateTime="2025-09-01">September 1, 2025</time>.</p>],
          ["code",          <p>Set the token value using <code>--semantic-color-text-default</code> in your CSS.</p>],
          ["kbd",           <p>Press <kbd>⌘K</kbd> to open the command palette.</p>],
          ["samp",          <p>The terminal returned <samp>Error: module not found</samp> after the build failed.</p>],
          ["var",           <p>The function takes two arguments: <var>width</var> and <var>height</var>.</p>],
          [".a1-muted",     <p>The quick <span className="a1-muted">brown fox jumps</span> over the lazy dog.</p>],
          [".a1-accent",    <p>The quick <span className="a1-accent">brown fox jumps</span> over the lazy dog.</p>],
        ].map(([tag, example]) => (
          <tr key={tag} style={{ borderBottom: "1px solid var(--semantic-color-border-subtle, #eee)" }}>
            <td style={{ padding: "8px 16px 8px 0", verticalAlign: "middle", width: "96px", fontFamily: "monospace", fontSize: "0.8em", color: "var(--semantic-color-text-muted)", whiteSpace: "nowrap" }}>{tag}</td>
            <td style={{ padding: "8px 0" }}>{example}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

// ─── Bold & emphasis ──────────────────────────────────────────────────────────

export const Strong = {
  render: () => <p>The quick <strong>brown fox jumps</strong> over the lazy dog.</p>,
};

export const B = {
  render: () => <p>The quick <b>brown fox jumps</b> over the lazy dog.</p>,
};

export const Em = {
  render: () => <p>The quick <em>brown fox jumps</em> over the lazy dog.</p>,
};

export const I = {
  render: () => <p>The quick <i>brown fox jumps</i> over the lazy dog.</p>,
};

// ─── Decoration ───────────────────────────────────────────────────────────────

export const U = {
  render: () => <p>The quick <u>brown fox jumps</u> over the lazy dog.</p>,
};

export const S = {
  render: () => <p>The quick <s>brown fox jumps</s> over the lazy dog.</p>,
};

export const Del = {
  render: () => <p>The quick <del>brown fox jumps</del> over the lazy dog.</p>,
};

export const Ins = {
  render: () => <p>The quick <ins>brown fox jumps</ins> over the lazy dog.</p>,
};

export const Mark = {
  render: () => <p>The quick <mark>brown fox jumps</mark> over the lazy dog.</p>,
};

// ─── Size ─────────────────────────────────────────────────────────────────────

export const Small = {
  render: () => <p>The quick <small>brown fox jumps</small> over the lazy dog.</p>,
};

export const Sub = {
  render: () => <p>H<sub>2</sub>O and CO<sub>2</sub> are common chemical formulas.</p>,
};

export const Sup = {
  render: () => <p>E = mc<sup>2</sup> and (a + b)<sup>n</sup> are well-known expressions.</p>,
};

// ─── Semantic inline ──────────────────────────────────────────────────────────

export const Abbr = {
  render: () => <p><abbr title="Cascading Style Sheets">CSS</abbr> and <abbr title="HyperText Markup Language">HTML</abbr> are the building blocks of the web.</p>,
};

export const Cite = {
  render: () => <p>As described in <cite>The Elements of Typographic Style</cite>, good typography is largely invisible.</p>,
};

export const Q = {
  render: () => <p>She said <q>the system should feel effortless</q> and left it at that.</p>,
};

export const Time = {
  render: () => <p>The release is scheduled for <time dateTime="2025-09-01">September 1, 2025</time>.</p>,
};

// ─── Code ─────────────────────────────────────────────────────────────────────

export const Code = {
  render: () => <p>Set the token value using <code>--semantic-color-text-default</code> in your CSS.</p>,
};

export const Kbd = {
  render: () => <p>Press <kbd>⌘K</kbd> to open the command palette.</p>,
};

export const Samp = {
  render: () => <p>The terminal returned <samp>Error: module not found</samp> after the build failed.</p>,
};

export const Var = {
  render: () => <p>The function takes two arguments: <var>width</var> and <var>height</var>.</p>,
};

// ─── Custom utilities ─────────────────────────────────────────────────────────

export const Muted = {
  render: () => <p>The quick <span className="a1-muted">brown fox jumps</span> over the lazy dog.</p>,
};

export const Accent = {
  render: () => <p>The quick <span className="a1-accent">brown fox jumps</span> over the lazy dog.</p>,
};
