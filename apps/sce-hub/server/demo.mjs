export function seedDemo(store) {
  if (
    store.db.prepare("SELECT 1 FROM records WHERE dataset='demo' LIMIT 1").get()
  )
    return;
  const actor = "Demo curator (fictional)",
    dataset = "demo";
  const records = [
    {
      id: "demo-guideline",
      kind: "guideline",
      title: "Give every checkbox a clear label",
      original: "Checkboxes should be easy to understand.",
      proposed:
        "Give each checkbox a visible label that describes the option. Associate the label with its checkbox.",
      rationale:
        "Fictional wording review demonstrating an explicit, testable relationship.",
      tags: [
        "Components:Checkbox",
        "Patterns/tasks:Forms",
        "Topics:Accessibility",
        "Platforms/contexts:Mobile",
        "Platforms/contexts:Web",
      ],
      readiness: [
        "Human guidance",
        "Agent instruction",
        "Automatically testable rule",
      ],
      enforcement: "Proposed: a label-association test. No test is connected.",
      owner: actor,
      status: null,
      comments: [],
      decisions: [],
      links: ["demo-component"],
    },
    ...[
      ["demo-tokens", "Token source", "Core tokens", 120, 190],
      ["demo-figma", "Figma variables", "Figma variables", 360, 90],
      ["demo-react", "React library", "React library", 360, 290],
      ["demo-component", "React component", "Checkbox", 600, 190],
      ["demo-product", "Product", "Example account", 840, 190],
      ["demo-team", "Team/owner", "Example team", 600, 390],
    ].map(([id, type, title, x, y]) => ({
      id,
      kind: "node",
      type,
      title,
      x,
      y,
      owner: actor,
      summary: "Fictional demonstration asset.",
      links: id === "demo-component" ? ["demo-guideline"] : [],
    })),
    ...[
      ["demo-tokens", "demo-figma", "feeds"],
      ["demo-tokens", "demo-react", "feeds"],
      ["demo-react", "demo-component", "feeds"],
      ["demo-product", "demo-react", "consumes"],
      ["demo-team", "demo-component", "owns"],
    ].map(([from, to, relation], i) => ({
      id: `demo-edge-${i}`,
      kind: "edge",
      title: relation,
      from,
      to,
      relation,
      confidence: "Proposed",
    })),
    {
      id: "demo-weekly",
      kind: "weekly",
      title: "An example weekly summary",
      summary: "Fictional demonstration of traceable reporting.",
      body: "Work: reviewed the checkbox wording.\nDecision: needs further discussion.\nEvidence: see the linked guideline.\nBlocker: no enforcement test is connected.\nNext step: agree on acceptance criteria.\nOutcomes: none measured.",
      links: ["demo-guideline"],
      status: "Draft",
      owner: actor,
    },
  ];
  for (const r of records)
    store.save(
      { ...r, dataset },
      actor,
      "Fictional demonstration data.",
      "demo created",
    );
  const g = store.get("demo-guideline");
  store.save(
    {
      ...g,
      status: "Needs further discussion",
      decisions: [
        {
          status: "Needs further discussion",
          actor,
          at: new Date().toISOString(),
          reason: "Agree on acceptance criteria before approval.",
          revision: g.revision,
        },
      ],
    },
    actor,
    "Agree on acceptance criteria before approval.",
    "decision",
  );
}
