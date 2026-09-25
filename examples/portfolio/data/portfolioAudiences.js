export const portfolioAudiences = {
  general: {
    title: "Principal Designer",
    headline: "Design systems and product UX.",
    emphasis: "Design systems",
    introduction: "I design enterprise systems and product experiences, connecting user research, interaction design and the tools teams need to build together.",
    order: ["a1", "transform", "fondue", "member-menu", "carshopper", "filter", "composer"],
    cards: [
      { icon: "hub", title: "Design systems", body: "Component architecture, accessibility, documentation and support models that help teams adopt a shared way of working." },
      { icon: "route", title: "Product UX", body: "Research, workshops and prototypes that connect user needs to practical decisions across complex workflows." },
      { icon: "smart_toy", title: "AI workflows", body: "Structuring tokens, components, documentation and rules so AI produces more consistent outputs with less rework, fewer tokens and lower operating cost." },
    ],
  },
  systems: {
    title: "Design Systems Leader",
    headline: "Design systems teams can build on.",
    emphasis: "Design systems",
    introduction: "I build enterprise design systems across Figma and code, grow the teams and practices behind them, and structure their rules for AI-assisted work.",
    order: ["fondue", "transform", "a1", "filter", "member-menu", "carshopper", "composer"],
    cards: [
      { icon: "hub", title: "Component architecture", body: "Tokens, component APIs and composition rules connect design libraries with implementation across product teams." },
      { icon: "groups", title: "Adoption and leadership", body: "Team formation, documentation, office hours and designer liaisons make a shared system usable in everyday work." },
      { icon: "smart_toy", title: "AI in the system", body: "I use A1 to test how explicit contracts, shared context and review guidance help agents work with a design system." },
    ],
  },
  ux: {
    title: "Senior UX Designer",
    headline: "Making complex products easier to use.",
    emphasis: "complex products",
    introduction: "I use research, collaborative workshops and prototypes to improve the way people navigate, make decisions and complete work across healthcare and automotive products.",
    order: ["member-menu", "carshopper", "composer", "filter", "transform", "fondue", "a1"],
    cards: [
      { icon: "search", title: "Research and discovery", body: "Interviews, observation and usability testing uncover where people lose context and what they need to move forward." },
      { icon: "groups", title: "Alignment and workshops", body: "I bring design, product and engineering together around user needs, business priorities and implementation constraints." },
      { icon: "route", title: "Interaction and prototyping", body: "I work through flows, responsive layouts and interface behavior in prototypes, then refine the details with developers." },
    ],
  },
};

export function audienceStudies(studies, audience = "general") {
  const config = portfolioAudiences[audience] ?? portfolioAudiences.general;
  const priority = (id) => {
    const index = config.order.indexOf(id);
    return index === -1 ? config.order.length : index;
  };
  return studies.slice().sort((a, b) => priority(a.id) - priority(b.id));
}
