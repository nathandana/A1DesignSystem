import { getPageFocus } from "./portfolioFocus.js";
import { A1Study } from "../studies/A1Study.jsx";
import { TransformStudy } from "../studies/TransformStudy.jsx";
import { FondueStudy } from "../studies/FondueStudy.jsx";
import { CarShopperStudy } from "../studies/CarShopperStudy.jsx";
import { FilterStudy } from "../studies/FilterStudy.jsx";
import { MemberMenuStudy } from "../studies/MemberMenuStudy.jsx";
import { ComposerStudy } from "../studies/ComposerStudy.jsx";

export const caseStudies = [
  {
    id: "a1",
    ...getPageFocus("a1"),
    title: "A1 Design System",
    tags: ["Design Systems", "AI Design"],
    cardImage: "/img/a1-cover.png",
    cardImageStyle: { backgroundColor: "white" },
    description: "I built A1 to learn what AI needs from a design system. Using its components to build real tools helped me turn repeated mistakes into clearer contracts, agent guidance and checks across React, Figma, accessibility and localization.",
    badge: "AI",
    component: A1Study,
  },
  {
    id: "transform",
    ...getPageFocus("transform"),
    title: "Transform",
    tags: ["Design Systems", "Enterprise UX"],
    cardImage: "/img/transform/Transform-Logo.png",
    cardImageStyle: { backgroundColor: "white" },
    description: "I grew Transform from a solo effort into an 11-person team and a design system used daily by 20,000+ employees at a Fortune 25 enterprise. The work connected component architecture and accessibility with the documentation, relationships and support teams needed to adopt it.",
    component: TransformStudy,
    badge: "Design System",
  },
  {
    id: "fondue",
    ...getPageFocus("fondue"),
    title: "Fondue",
    tags: ["Design Systems", "Enterprise UX"],
    cardImage: "/img/fondue-logo.png",
    cardImageStyle: { backgroundColor: "white" },
    description: "I rebuilt Fondue’s component structure, documentation and support model, working with design, engineering and accessibility partners. Component APIs, recipes, page templates and release guidance gave teams a clearer way to build and maintain product experiences.",
    component: FondueStudy,
    badge: "Design System",
  },
  {
    id: "member-menu",
    ...getPageFocus("member-menu"),
    title: "Member Menu",
    tags: ["UX research", "Team alignment", "Workshopping"],
    cardImage: "/img/member-menu/member-menu-final.png",
    cardImageStyle: {},
    description: "I used research, stakeholder alignment and collaborative workshops to shape Member Menu across TruCare Cloud. The case study follows how we kept member context and paused work connected, moving an illustrated authorization journey from eight steps to four within existing application constraints.",
    badge: "IA",
    component: MemberMenuStudy,
  },
  {
    id: "carshopper",
    ...getPageFocus("carshopper"),
    title: "Car Shopper UX",
    tags: ["UX Design", "Consumer-facing"],
    cardImage: "/img/desktop-vdp.png",
    cardImageStyle: {},
    description: "I designed vehicle search and details experiences at Dealer.com through workshops, prototyping, user testing and development support. The work balances shopper needs with dealership customization, from clearer packages-and-options wording to responsive layouts and exploratory comparison flows.",
    component: CarShopperStudy,
    badge: "B2 Mini",
  },
  {
    id: "filter",
    ...getPageFocus("filter"),
    title: "Filtering Component",
    tags: ["Design Systems", "UX Architecture"],
    cardImage: "/img/filter-panel.png",
    cardImageStyle: {},
    description: "I brought product, design and engineering together to define a configurable filtering model for TruCare Cloud. Live prototypes helped us test shared filter behavior across toolbars and panels, giving teams reusable logic for different data workflows.",
    badge: "B2B Mini",
    component: FilterStudy,
  },
  {
    id: "composer",
    ...getPageFocus("composer"),
    title: "Composer Architecture",
    tags: ["UX Design", "CMS"],
    cardImage: "/img/composer-ui-sm.png",
    cardImageStyle: { objectPosition: "top left" },
    description: "I led interviews and observation across four departments to understand how people managed dealership websites in Composer. Those findings shaped the UX architecture and a redesigned integration manager that brought search, settings and documentation into one workspace.",
    badge: "B2B Mini",
    component: ComposerStudy,
  },
];
