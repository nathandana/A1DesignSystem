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
    title: "A1 Design System",
    tags: ["Design Systems", "AI Design"],
    cardImage: "/img/a1-cover.png",
    cardImageStyle: { backgroundColor: "white" },
    description: "Building a rules-driven design system for AI-assisted product creation — where structure guides both humans and machines toward better decisions.",
    badge: "AI",
    component: A1Study,
  },
  {
    id: "transform",
    title: "Transform",
    tags: ["Design Systems", "Enterprise UX"],
    cardImage: "/img/transform/Transform-Logo.png",
    cardImageStyle: { backgroundColor: "white" },
    description: "Transform grew from a small design library into a vital internal system used daily by 20,000+ employees at a Fortune 25 enterprise.",
    component: TransformStudy,
    badge: "Design System",
  },
  {
    id: "fondue",
    title: "Fondue",
    tags: ["Design Systems", "Enterprise UX"],
    cardImage: "/img/fondue-logo.png",
    cardImageStyle: { backgroundColor: "white" },
    description: "How I rebuilt Fondue into a structured, accessible, and trusted enterprise design system.",
    component: FondueStudy,
    badge: "Design System",
  },
  {
    id: "member-menu",
    title: "Member Menu",
    tags: ["UX Architecture", "Navigation"],
    cardImage: "/img/mega-menu-final.png",
    cardImageStyle: {},
    description: "A persistent navigation menu that streamlined access to member-related tasks, reducing multi-page workflows into a single-click experience.",
    badge: "IA",
    component: MemberMenuStudy,
  },
  {
    id: "carshopper",
    title: "Car Shopper UX",
    tags: ["UX Design", "Consumer-facing"],
    cardImage: "/img/desktop-vdp.png",
    cardImageStyle: {},
    description: "From concept to deep execution on search and details pages. A look at the process and results.",
    component: CarShopperStudy,
    badge: "B2 Mini",
  },
  {
    id: "filter",
    title: "Filtering Component",
    tags: ["Design Systems", "UX Architecture"],
    cardImage: "/img/filter-panel.png",
    cardImageStyle: {},
    description: "A flexible, scalable filtering component designed to unify and simplify complex data workflows across TruCare Cloud.",
    badge: "B2B Mini",
    component: FilterStudy,
  },
  {
    id: "composer",
    title: "Composer Architecture",
    tags: ["UX Design", "CMS"],
    cardImage: "/img/composer-ui-sm.png",
    cardImageStyle: { objectPosition: "top left" },
    description: "Architecture and UX design for users to update and configure their dealership web site.",
    badge: "B2B Mini",
    component: ComposerStudy,
  },
];
