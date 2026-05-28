import React from "react";
import clinicGuide from "../../guides/clinic.json";
import libraryGuide from "../../guides/library.json";
import incidentGuide from "../../guides/incident.json";
import trailGuide from "../../guides/trail.json";

export const principles = [
  {
    icon: "flag",
    title: "Goals before screens",
    description:
      "Capture the user goal, business goal, and decision the page needs to support before anyone chooses a layout.",
  },
  {
    icon: "sort",
    title: "Priority before polish",
    description:
      "Sort content and functionality by relevance from top to bottom, using real words instead of empty boxes.",
  },
  {
    icon: "forum",
    title: (
      <>
        <strong>A</strong>l<strong>i</strong>gnment before <strong>AI</strong>
      </>
    ),
    key: "alignment-before-ai",
    description:
      "Give designers, writers, developers, stakeholders, and AI tools the same content hierarchy to work from.",
  },
];

export const workflow = [
  ["01", "Name the page goal", "What should a person understand, decide, or do here?"],
  ["02", "List real content", "Add only content and functionality that helps the user and the business goal."],
  ["03", "Rank the hierarchy", "Move the most critical information to the top and challenge everything below it."],
  ["04", "Annotate behavior", "Capture interactions, states, links, and responsive notes before prototyping."],
];

export const startTips = [
  {
    icon: "flag",
    title: "Lead with the decision",
    description: "Name the choice the page needs to support before listing sections or interface ideas.",
  },
  {
    icon: "groups",
    title: "Include the real audience",
    description: "Describe who is reading, what they already know, and what would make them hesitate.",
  },
  {
    icon: "block",
    title: "Set boundaries early",
    description: "Call out what is out of scope so the generated guide stays focused and reviewable.",
  },
  {
    icon: "edit_note",
    title: "Ask for annotations",
    description: "Request short notes explaining why each element exists, what it links to, or how it behaves.",
  },
];

export const examplePrompt =
  "Create a priority guide for a public library workshop page. The audience is adults deciding whether a free digital skills class is useful and accessible. Include the problem statement, decision needed, out-of-scope items, contributors, prioritized content elements, component types, and side annotations for each element.";

export const exampleGuides = [clinicGuide, libraryGuide, incidentGuide, trailGuide];

export const exampleFlows = [
  {
    id: "appointment-to-program",
    title: "Service discovery to booking",
    description:
      "A direct flow for teams aligning on how public-service pages move someone from reassurance to a confident next action.",
    mode: "linear",
    states: [
      { guideId: "clinic", state: "Reassure and qualify" },
      { guideId: "library", state: "Confirm value and logistics" },
      { guideId: "trail", state: "Show interruption state" },
    ],
    links: [
      { from: "clinic", to: "library", label: "Use registration pattern" },
      { from: "library", to: "trail", label: "Show closure alternative" },
    ],
  },
  {
    id: "operations-review",
    title: "Operations review map",
    description:
      "An organic flow for leadership reviews where a page may branch into an incident state, a public notice, or a follow-up action.",
    mode: "organic",
    states: [
      { guideId: "incident", state: "Current status" },
      { guideId: "trail", state: "Public-facing notice" },
      { guideId: "clinic", state: "Resident support path" },
      { guideId: "library", state: "Community program update" },
    ],
    links: [
      { from: "incident", to: "trail", label: "Publish public impact" },
      { from: "incident", to: "clinic", label: "Route people needing help" },
      { from: "library", to: "trail", label: "Reuse accessibility notice" },
      { from: "clinic", to: "incident", label: "Escalate capacity issue" },
    ],
  },
];

export const sampleGuideJson = JSON.stringify({
  title: "Workshop registration page",
  tab: "Workshop",
  icon: "event",
  pageType: "Landing",
  context: "Public program signup",
  problemStatement: "People need to quickly decide whether this workshop matches their skill level, schedule, and access needs before registering.",
  audience: "Adults exploring a free community workshop.",
  userGoal: "Understand the value, confirm logistics, and register with confidence.",
  businessGoal: "Increase qualified registrations while reducing follow-up questions.",
  contextDetails: [
    { label: "Decision needed", value: "- [ ] Register for the workshop", checkable: true },
    { label: "Out of scope", value: "Payment, member accounts, and post-event surveys." },
    { label: "Contributors", value: "Programs lead, content designer, accessibility reviewer." },
  ],
  items: [
    {
      kind: "group",
      componentType: "Section",
      title: "Decision details",
      content: "The core content someone needs before registering.",
      annotations: ["Group the persuasive and logistical content before the action."],
      children: [
        {
          componentType: "Heading",
          title: "Workshop name and plain-language value",
          content: "Lead with the topic and the practical outcome someone can expect.",
          annotations: ["Keep the title specific enough to distinguish this from other workshops."],
        },
        {
          componentType: "Details",
          title: "Date, time, location, and accessibility notes",
          content: "Show the logistics before the registration action so people can self-qualify.",
          annotations: ["Include virtual or in-person requirements here, not after registration."],
        },
      ],
    },
    {
      componentType: "Button",
      title: "Register",
      content: "Primary action that starts the signup flow.",
      annotations: ["Button opens the registration form for this specific workshop."],
      linkedGuideId: "library",
    },
  ],
}, null, 2);

export const itemComponentOptions = [
  "Alert",
  "Banner",
  "Button",
  "Card",
  "Checklist",
  "Details",
  "Form",
  "Heading",
  "Image",
  "Link",
  "List",
  "Paragraph",
  "Status",
  "Table",
  "Tabs",
  "Timeline",
];

export const containerComponentOptions = [
  "Section",
  "Card",
  "Button container",
];

export const pageTypeOptions = [
  "Home",
  "Landing",
  "Overview",
  "Dashboard",
  "Form",
  "Data detail",
  "Profile",
  "Search results",
  "Confirmation",
  "Error / Empty state",
  "Settings",
  "Article",
  "Onboarding",
];

export const pageIds = ["home", "examples", "start", "flows", "flow-editor", "guides", "new", "editor", "presentation"];
