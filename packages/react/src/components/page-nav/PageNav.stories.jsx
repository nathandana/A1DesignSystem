import { PageNav } from "./PageNav.jsx";
import { Heading } from "../heading/Heading.jsx";
import { Paragraph } from "../paragraph/Paragraph.jsx";
import { Stack } from "../stack/Stack.jsx";

const meta = {
  title: "Components/Navigation/PageNav",
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    sections: {
      description: "List of page sections to link to ({ id, label, level? }[]).",
    },
    label: {
      control: "text",
      description: "Accessible label for the nav and the visible heading. Default: \"On this page\".",
    },
  },
};

export default meta;

/* ── Shared sample article ──────────────────────────────────────────────────── */

const SECTIONS = [
  { id: "overview", label: "Overview", level: 1 },
  { id: "installation", label: "Installation", level: 1 },
  { id: "usage", label: "Usage", level: 1 },
  { id: "basic-example", label: "Basic example", level: 2 },
  { id: "advanced-example", label: "Advanced example", level: 2 },
  { id: "accessibility", label: "Accessibility", level: 1 },
  { id: "props", label: "Props", level: 1 },
];

const PARAGRAPHS = {
  overview:
    "PageNav provides in-page navigation for long-form content. It tracks the reader's scroll position, highlights the active section, and shows a reading-progress bar.",
  installation:
    "Add unique ids to each section heading in your content, then pass a matching sections array to PageNav. The component observes those elements with an IntersectionObserver.",
  usage:
    "Place PageNav alongside your article content. As the reader scrolls, the active item updates to reflect the section nearest the top of the viewport.",
  "basic-example":
    "A flat list of top-level sections is the most common pattern — one entry per major heading.",
  "advanced-example":
    "Use level: 2 to indent nested sections under their parent, mirroring the heading hierarchy of the page.",
  accessibility:
    "The nav uses an accessible label, marks the active link with aria-current=\"location\", and remains keyboard operable. Clicking an item smooth-scrolls to the target section.",
  props:
    "sections takes { id, label, level? }[]; label sets the heading and accessible name. See the table below for full details.",
};

function Article({ sections }) {
  return (
    <Stack direction="column" gap="xl">
      {sections.map((section) => (
        <section key={section.id} id={section.id}>
          <Stack direction="column" gap="sm">
            <Heading as={section.level === 2 ? "h3" : "h2"} size={section.level === 2 ? "sm" : "md"}>
              {section.label}
            </Heading>
            {[0, 1, 2].map((i) => (
              <Paragraph key={i} color={i === 0 ? "default" : "muted"}>
                {i === 0
                  ? PARAGRAPHS[section.id]
                  : "Filler paragraph to give the section enough height to scroll through, so the active-section tracking and the reading-progress bar are easy to observe in the story."}
              </Paragraph>
            ))}
          </Stack>
        </section>
      ))}
    </Stack>
  );
}

/* The nav sits in a two-column layout next to the article so scroll tracking and
   the sticky position behave the way they do on a real documentation page. */
function PageNavLayout({ sections, label }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) 16rem",
        gap: "var(--base-spacing-32)",
        alignItems: "start",
        padding: "var(--base-spacing-24)",
      }}
    >
      <Article sections={sections} />
      <div style={{ position: "sticky", top: "var(--base-spacing-24)" }}>
        <PageNav sections={sections} label={label} />
      </div>
    </div>
  );
}

/* ── Default ───────────────────────────────────────────────────────────────── */

export const Default = {
  args: {
    sections: SECTIONS,
    label: "On this page",
  },
  render: (args) => <PageNavLayout sections={args.sections} label={args.label} />,
};

/* ── Flat (top-level only) ─────────────────────────────────────────────────── */

export const FlatSections = {
  name: "Flat sections",
  args: {
    label: "On this page",
    sections: [
      { id: "overview", label: "Overview", level: 1 },
      { id: "usage", label: "Usage", level: 1 },
      { id: "accessibility", label: "Accessibility", level: 1 },
      { id: "props", label: "Props", level: 1 },
    ],
  },
  render: (args) => <PageNavLayout sections={args.sections} label={args.label} />,
};

/* ── Custom label ──────────────────────────────────────────────────────────── */

export const CustomLabel = {
  name: "Custom label",
  args: {
    label: "Contents",
    sections: SECTIONS,
  },
  render: (args) => <PageNavLayout sections={args.sections} label={args.label} />,
};
