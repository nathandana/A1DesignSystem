import { caseStudyAliases } from "./caseStudyAliases.js";
import { SHARED_FOCUS } from "../utils/focus.js";

// Editorial relevance, not access control. Mixed projects intentionally belong to both.
export const pageFocus = {
  home: { focus: SHARED_FOCUS },
  alternate: { focus: SHARED_FOCUS },
  about: { focus: SHARED_FOCUS },
  process: { focus: SHARED_FOCUS },
  resume: { focus: SHARED_FOCUS },
  testimonials: { focus: SHARED_FOCUS },
  contact: { focus: SHARED_FOCUS },
  a1: { focus: ["ds"] },
  transform: { focus: SHARED_FOCUS },
  fondue: { focus: ["ds"] },
  "member-menu": { focus: ["ux"] },
  carshopper: { focus: ["ux"] },
  filter: { focus: SHARED_FOCUS },
  composer: { focus: ["ux"] },
};

export const pageFocusAliases = { ...caseStudyAliases, alternate: "home" };

export function getPageFocus(page) {
  return pageFocus[pageFocusAliases[page] ?? page] ?? { focus: SHARED_FOCUS };
}

// Stable IDs for inline content; tag new sections, figures, links or cards the same way.
export const contentFocus = {
  "alternate-introduction": { focus: ["ds"] },
  "alternate-ai-workflows": { focus: ["ds"] },
  "alternate-enterprise-scale": { focus: SHARED_FOCUS },
  "alternate-ai-system": { focus: ["ds"] },
  "home-featured-quote": { focus: ["ds"] },
};
