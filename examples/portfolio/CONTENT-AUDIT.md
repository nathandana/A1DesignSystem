# Portfolio content and credibility audit

**Prepared:** Sept. 24, 2026

**Scope:** The live homepage, About, Process, Résumé, Testimonials and Contact pages; both résumé variants; all seven routed case studies; homepage cards and shared content data. Archived and unrouted duplicates were inspected for context but are not treated as published content.

## Overall assessment

The portfolio has a credible core. The strongest material names real products, explains Nathan's role, shows artifacts and describes specific design-system decisions. Transform's team formation, Fondue's component inventory, Composer's research methods and the working A1 repository give a reviewer useful evidence.

The current version should not be sent to employers without a credibility pass. The live Fondue study contains two statistics that the source itself marks as unverified. The résumé contains two unusually precise outcome percentages with no methodology. The Member Menu study contains an unattributed user quotation. Several other outcome statements turn plausible work into asserted results without showing how those results were measured.

The writing also carries many of the patterns in the supplied **AI Writing Tropes to Watch For** checklist. Across the live content sources, there are 48 em dashes. More consequentially, the portfolio repeatedly uses "not X, but Y" constructions, abstract claims about scale and impact, tidy lists of three and repeated conclusions. These patterns are concentrated in Process, Filter and the concluding half of A1.

The best revision strategy is to remove the unsupported material first, then replace broad claims with evidence: a count, a before-and-after workflow, an artifact, a research finding or a named decision. The portfolio does not need a more polished voice. It needs more of Nathan's actual voice and more proof.

## Publication blockers

These items carry the greatest risk in an interview or reference check.

| Priority | Location | Current issue | Why it matters | Recommended action |
| --- | --- | --- | --- | --- |
| Remove now | `studies/FondueStudy.jsx:45-51` | The page displays **25 product teams** and **40% less time**, while the source comment says both figures are unverified. | A precise statistic reads as measured fact. The code documents that the evidence is missing. | Remove both statistics until the source, population, baseline and method are available. Do not replace them with softer invented numbers. |
| Verify or remove | `data/resumeVersions.js:169` | The UX résumé claims **48% less user fatigue** and **72% better workflow efficiency**. | The measures are unusually precise, but the portfolio gives no study, sample, task, baseline or date. An interviewer is likely to ask how each was calculated. | Add the study context and use the metric only if the underlying report can be produced. Otherwise replace the bullet with the actual design change and what was observed. |
| Verify or paraphrase | `studies/MemberMenuStudy.jsx:50` | An unnamed user allegedly said, **"This is the first time I feel like I can move freely through the system."** | A polished, unattributed quotation is a common invented-case-study tell. It cannot be assessed without a research note, recording or report. | If the quote is verbatim, identify the research context without exposing the participant, such as "A care manager in moderated testing." If it is reconstructed, remove quotation marks and describe the observed behavior. |
| Correct attribution | `data/testimonials.js` | Twelve quotations are attributed mostly by first name only. At least the Jessica entry combines sentences from separate parts of a much longer LinkedIn recommendation without an ellipsis. | Quotation marks imply verbatim, contiguous wording. Edited testimonials can look manufactured even when the source is real. First names provide weak social proof. | Compare every quote with LinkedIn. Use a short verbatim excerpt, add ellipses where text is removed and show full name, role and working relationship with permission. If a testimonial is paraphrased, remove quotation marks and label it a summary. |
| Reconcile dates | `studies/FondueStudy.jsx:33` and `data/resumeVersions.js:10,165` | Fondue says **2023–present**, while both résumés say Centene employment ended in June 2026. | As of September 2026, "present" implies continuing responsibility after the listed employment ended. | Use `2023–2026` unless Nathan continued the work independently and can explain that relationship. |
| Add the promised source or remove the attribution | `studies/FondueStudy.jsx:63-65` | The code says Nate Bauer's historical summary is "linked below," but the rendered paragraph has no link. | The paragraph borrows another person's framing and figures. Missing attribution makes it look careless and prevents date checking. | Link the specific source and state its date, or replace the paragraph with a dated Centene primary source. |

## Fact and evidence ledger

Public company facts can support scale. They cannot prove Nathan's individual impact. Internal product counts, adoption, accessibility and efficiency claims need internal artifacts or a careful description of how Nathan knows them.

| Claim | Location | Assessment | Evidence needed or safer treatment |
| --- | --- | --- | --- |
| Centene serves more than 20 million members/customers | Résumé and Transform | Publicly supportable as company context. Centene reported 27.6 million members as of Dec. 31, 2025. | Cite or date the company context. Prefer "Centene reported 27.6 million members at the end of 2025" over an undated, rounded claim. Source: [Centene 2025 results](https://investors.centene.com/2026-02-06-CENTENE-CORPORATION-REPORTS-2025-RESULTS-AND-ANNOUNCES-2026-GUIDANCE). |
| Centene was a Fortune 25 company / No. 22 | Homepage, résumé, Transform and Fondue | Supported as historical context, not a timeless rank. Centene's 2024 annual report states No. 22. | Add the year the first time the rank appears. Source: [Centene 2024 annual report and 2025 proxy](https://www.centene.com/content/dam/centenedotcom/investor_docs/CNC-2025-Proxy-2024-Annual-Report.pdf). |
| Centene had more than 74,000 employees | Fondue | Presented as a secondary historical claim from another case study. The named source is missing. | Add the original link and year. Do not mix that historical count with a current company description. |
| Transform had 20,000 daily users | Homepage, About, résumé and Transform | Repeated consistently, but repetition is not corroboration. The public Centene member count does not prove internal active use. | Keep only if product analytics, an internal deck or an approved product fact supports "daily." Otherwise say "built for an internal workforce of roughly 20,000" and state the source period. |
| Transform integrated 16+ applications | Transform | Plausible internal adoption metric with no supporting context. | Record the date, definition of "integrated" and list or internal inventory. If partial implementations counted, say so. |
| Transform maintained 40+ components | Transform | Plausible and readily documentable. | Link or retain an inventory screenshot/export with date and version. |
| Transform grew to an 11-person team | Transform | The narrative enumerates the roles and totals 11, which makes this claim internally coherent. | Confirm whether Nathan led the whole team, led design within the team or helped form it. Use the precise leadership scope. |
| Transform supported 30 designers | Transform | Plausible internal community count. | Identify whether 30 was peak active users, all designers in a business unit or people assigned to liaisons. Date it. |
| Full component library achieved WCAG 2.2 AA compliance | Transform | High-risk absolute claim. WCAG conformance depends on scope, version, states and audit method. | Name the audit, date, library version, tested environments and whether the conclusion came from an accessibility team. Consider "passed the organization's WCAG 2.2 AA component audit" if that is the exact result. |
| Transform continues to be used without dedicated design support | `TransformStudy.jsx:385-389` | Current-state assertion made after Nathan left the company. | Verify with a current owner or phrase it as of Nathan's departure. |
| Fondue contains 46 components | Fondue | Internally supported by the rendered inventory: 16 inputs, eight navigation items, 15 content items and seven feedback items. The total includes a proposed AEM-only Carousel. | State **45 released components plus one proposed AEM-only component** unless the Carousel shipped. This is more transparent than a headline total of 46. |
| Fondue supports 25 product teams | Fondue | Explicitly marked unverified. | Remove pending evidence. |
| Fondue reduced assembly time by 40% | Fondue | Explicitly marked unverified; no baseline or method. | Remove pending evidence. A time-on-task comparison would be required to make this claim credible. |
| Fondue is central, trusted, robust and minimally adopted before Nathan | Fondue | These may be true, but the study provides no adoption data, survey, support volume or release history to show the change. | Replace adjectives with the actions and evidence already available: reorganized components, documentation examples, office hours, accessibility reviews, recipes, templates and changelog. |
| Dealer.com supported 15,000+ sites | Résumé and Car Shopper | A primary Dealer.com page describing the 2019–2020 redesign says 13,000 websites, not 15,000. A Cox 2020 deck also says 13,000+. | Locate a dated internal or public source for 15,000. Otherwise use 13,000 and cite the period. Sources: [Dealer.com data-driven design](https://www.dealer.com/solutions/websites/experience/) and [Cox Automotive 2020 industry deck](https://www.coxautoinc.com/wp-content/uploads/2020/01/2020-Industry-Insights-Breakfast-Presentation-Jan-13-2020-.pdf). |
| Dealer.com experiences were used by millions each month | About | Public scale is plausible: Cox reported 43 million monthly unique visitors across 13,000+ Dealer.com sites, using 2017 internal data. The current copy can imply that Nathan personally designed every experience used by those visitors. | Attribute the scale to the platform and date it. Do not convert platform reach into a personal outcome. |
| Member Menu reduced click paths to a "single-click experience" | Homepage card | The case study says workflows previously spanned three or more pages but supplies no before/after task path. Some destinations may be one click away; the entire workflow is not shown as one click. | Name one representative task and its before/after steps. Otherwise say the menu exposed member tasks from the persistent header. |
| Filter was adopted by dozens of teams and produced clear ROI | Filter | Broad outcome with no adoption count, period, support data or saved effort. | Supply an adoption report or replace it with the exact implementation model and one named use case. |
| Composer produced a tangible improvement and dramatically reduced cognitive overhead | Composer | The screenshots are labeled proposed, while the conclusion reads as shipped impact. | State what shipped, what remained a proposal and what evidence came from research. Avoid outcome verbs for an unshipped concept. |
| A1 reduces AI token use, rework and operating cost | Homepage and résumé | The repository shows an MCP server and structured system context, but no benchmark in the portfolio measures token or cost reduction. | Describe the mechanism. Use reduction language only after a repeatable comparison with model, task, prompt/context size and result quality. |
| A1 exports production-ready code from Figma | A1 | Strong capability claim. The study describes a plugin that rebuilds pages into strict structures, then says export becomes more direct. | Demonstrate one round trip or narrow the copy to what the current plugin actually exports. "Production-ready" should require build, accessibility and review evidence. |

## AI-writing trope audit

### Em-dash dependence

The live content sources contain 48 em dashes. Process alone contains 11; About and Filter contain eight each; Member Menu and Composer contain five each. Fondue contains two, both used as functional "Before" and "After" labels in image captions. Transform no longer contains em dashes. The issue is not the punctuation by itself. Many dashes introduce a predictable reinterpretation, aside or three-part list.

Representative examples:

- "Accessibility isn't a checklist item — it's a design constraint..." (`AboutPage.jsx:21`)
- "I'm not a visual artist — and that's a strength, not a limitation." (`ProcessPage.jsx:46`)
- "Research isn't a checkpoint — it's an ongoing rhythm." (`ProcessPage.jsx:70`)
- "This wasn't just a menu—it was architectural glue." (`MemberMenuStudy.jsx:34`)
- "It not only ensured consistency...it also gave users..." (`FilterStudy.jsx:61`)

**Recommendation:** Keep an em dash only when the pause changes the meaning. Most examples above should become one direct sentence. Apply the A1 spacing convention when a dash remains: a space on each side.

### Manufactured contrast

The strongest AI tell appears repeatedly in A1:

- "The goal is not to generate more UI. The goal is to generate better decisions." (`A1Study.jsx:164`)
- "A1 is not really about building another design system. It is about designing a system that AI can participate in safely." (`A1Study.jsx:407-408`)
- "The future is not design-first or engineering-first. It is structure-first." (`A1Study.jsx:418`)
- "The important part is not that every rule is perfect. The important part is that every important decision has a definition." (`A1Study.jsx:445-446`)

Member Menu, Filter, Composer, About and Process repeat the same device. One such line can provide emphasis. Repetition makes the voice sound generated and turns concrete work into a manifesto.

**Recommendation:** State the useful half directly. For example:

- Replace "The goal is not to generate more UI..." with **"A1 gives agents explicit rules for making and evaluating interface decisions."**
- Replace "A1 is not really about..." with **"A1 lets AI agents use the same component rules, tokens and accessibility guidance as designers and developers."**
- Replace "This wasn't just a menu..." with **"The menu became the persistent entry point for member-specific work."**

### Abstract corporate language

The most repeated abstractions are **scalable**, **shared foundation**, **alignment**, **cohesive**, **robust**, **meaningful**, **high-quality**, **trusted**, **seamless** and **better outcomes**. These words often stand where the reader needs a fact.

Examples:

- "a scalable UX framework for future work" (`ComposerStudy.jsx:109`)
- "a predictable, scalable experience" (`FilterStudy.jsx:61`)
- "a cohesive, well-documented, and inclusive design system" (`FondueStudy.jsx:78`)
- "robust governance, and strong cross-functional collaboration" (`TransformStudy.jsx:106-107`)
- "ship something meaningful quickly" (`MemberMenuStudy.jsx:54`)

**Recommendation:** Replace the adjective with the observable behavior. "Scalable" might mean configurable filters, a component API used in 16 applications, a liaison supporting 30 designers or tokens shared across three implementations. Use the actual meaning.

### Lists of three and excessive symmetry

The portfolio frequently gives every sentence three or four balanced parts. The résumé is especially uniform: nearly every bullet begins with an outcome verb, follows with "by," then ends in a long list of activities. The five Process phases use the same structure: aphoristic heading, dense paragraph and polished quotation. Fondue ends with four lesson headings that each restate the paragraph below.

**Recommendation:** Let sections take different forms. A phase with a useful story can have a short example. A phase without a strong example can be one sentence. Résumé bullets should vary according to the evidence: scope, decision, artifact, measured result or leadership responsibility.

### Repeated conclusions

Fondue states several times that Nathan introduced structure, rebuilt relationships and integrated accessibility (`FondueStudy.jsx:76-92`, `231-255`, `331-344`, `368-372`). Filter's last two paragraphs both conclude that the reusable component created consistency and saved time (`FilterStudy.jsx:60-64`). Transform's final two paragraphs restate scale, consistency, accessibility and relationships after those topics already received full sections (`TransformStudy.jsx:380-396`).

**Recommendation:** Give each case study one conclusion. Use it for evidence and reflection rather than a fourth summary.

### Inflated significance

Examples include "signal of architectural maturity," "turning point," "vital tool," "the hardest design problem...and the most important" and "ahead...by years." These claims invite skepticism because the artifact or result is smaller than the conclusion.

**Recommendation:** Retain confidence but reduce the implied historical importance. Explain the decision, who used it and what changed.

## Page-by-page recommendations

### Homepage

**What works:** The page is brief, surfaces the portfolio quickly and gives A1, Transform and Fondue priority.

**Suggested changes:**

1. Fix the visible heading at `HomePage.jsx:24`: it has two spaces before "Systems" and uses title case. Suggested heading: **"Bridging AI and design systems"**.
2. Replace the abstract lead at `HomePage.jsx:26` with a sentence that names Nathan's actual work. Suggested copy: **"I build enterprise design systems across Figma and code, then structure their rules so AI agents can use them."**
3. Make the three cards distinct. "AI-assisted workflows" and "AI in the system" currently overlap. One card should explain the technical mechanism; another should explain the product-design use case.
4. Remove outcome language about fewer tokens, less rework and lower operating cost unless A1 has benchmarks.
5. Change the Member Menu card's "single-click experience" claim to a factual description of the persistent menu until a before/after task path is documented.

### About

**What works:** The chronological structure and the design-systems quotation feel personal. The line about making the next decision easier is memorable and should be preserved.

**Suggested changes:**

1. Replace **"Designing at the edge of what's possible"** with a role- and outcome-specific heading. Suggested copy: **"I design systems for complex products"** or **"Design systems, enterprise UX and AI workflows"**.
2. Reconcile "over 20 years" with "late 1990s." A late-1990s start means roughly 26–29 years in 2026, while LinkedIn and both résumés say 20 years. Pick the accurate career start and use it everywhere.
3. Change "automotive research space" to the actual business context, likely automotive retail technology or dealership websites.
4. Date and attribute the platform-scale claims about millions of shoppers and 20,000 daily users.
5. Remove **"It's the hardest design problem I've encountered, and the most important."** It is inflated and unsupported. Explain which AI design problem Nathan is working on now.
6. Rewrite the four belief cards as short examples. Each currently follows the same claim-and-explanation pattern and three use an em dash.

### Process

**What works:** The Sharpie/Post-it preference, triangle/pyramid line, CodePen example and `project-final-37.psd` comment sound distinctive. Keep that personality.

**Suggested changes:**

1. Cut the introductory paragraph to one direct sentence. Current phrases such as "curiosity to craft," "combining empathy with execution" and the four-value list are generic.
2. Replace one abstract claim in every phase with a real example from a case study. For discovery, the Composer interviews are stronger than "asking bold questions." For validation, the Car Shopper "Included" test is stronger than "feedback is fuel."
3. Remove the repeated `X isn't Y — it's Z` structures.
4. Shorten each phase. Five equally structured sections make the page feel templated.
5. Reconsider **"Capital in – capital out."** The metaphor can sound transactional, and the copy then says relationships are not transactional. Suggested heading: **"Trust makes difficult work possible."** Follow with one example of when an established relationship helped resolve a disagreement.
6. `data/processSteps.js` duplicates the page copy but is not used by `ProcessPage.jsx`. Keep one source if this page is revised later so the two versions do not drift.

### Résumé

**What works:** Two targeted variants are useful. The case-study links help a recruiter move from claims to work samples.

**Suggested changes:**

1. Remove or substantiate the 48% and 72% metrics before sharing the UX version.
2. Verify employment chronology. The systems version says Dealer.com began in August 2010; the UX version says 2011. hmc² ends in 2011, creating either a real overlap or an inconsistency. Explain concurrent work or align the dates.
3. Align the Dealer.com company and role names across variants unless the variation is intentional: `Dealer.com` versus `Dealer.com / Cox Automotive`, and `Senior User Experience Designer` versus `Senior User Experience Designer – Interactive`.
4. Verify the exact education credentials. A recruiter may check degree type and program wording; use the institution's official credential names.
5. Reduce the repeated "Improved/Reduced/Enabled/Scaled ... by ..." formula. It sounds optimized for applicant tracking rather than written by a practitioner.
6. Replace unmeasured causal verbs with ownership and shipped artifacts. Strong A1 bullets could say:
   - **Built a token-driven component system across React, HTML/CSS and React Native, with shared documentation and accessibility rules.**
   - **Published component metadata and system rules through an MCP server so AI agents can query them directly.**
   - **Built structured JSON page definitions and an editor that renders them with A1 components.**
7. Calibrate broad skill claims. "React and Angular," "WCAG 2.2 AA," "ADA and Section 508 compliance" and "AI agents and agentic workflows" may be accurate, but the résumé should make Nathan's proficiency level clear enough to survive a technical interview.
8. Use the same date punctuation throughout. `March 2020 - June 2026` should use an en dash.

### Testimonials

**What works:** Recommendations are valuable external evidence, and LinkedIn publicly confirms that Nathan has received recommendations. Jessica's full recommendation strongly supports Nathan's design-systems leadership.

**Suggested changes:**

1. Preserve the recommenders' words even when they contain AI-like phrasing. Authenticity takes precedence over stylistic cleanup.
2. Do not combine separated sentences into a single contiguous quotation. Use ellipses or select one passage.
3. Add full name, title, company and relationship when permission allows. Example: **Jessica Delli Carpini · colleague on the Centene design systems team**.
4. Link each quote to its recommendation when the platform permits. A single generic profile link makes verification harder.
5. Consider six strong, well-attributed recommendations instead of 12 lightly attributed ones. Credibility is more useful than volume.

### Contact

No placeholder or invented content was found. The copy is direct. Confirm that the public phone number, email address and location are intentionally published.

### A1 Design System case study

**What works:** This is the most differentiated project. It has real implementation detail, visible artifacts, an accessible repository structure and a clear personal role. The "Next" labels appropriately distinguish future work.

**Suggested changes:**

1. Cut one-third of the manifesto language. The study repeats "shared language," "structure," "decisions" and "rules" without always adding a new fact.
2. Replace the four manufactured-contrast lines identified above with direct descriptions.
3. Distinguish current capabilities from design intent. Verify automatic icon packaging, Figma export, real-component prototyping, MCP access and JSON page generation against a working demo, then link the relevant artifact.
4. Replace the three counts at the top with more persuasive scope if available. Three platforms and three token tiers are descriptive; they are not outcomes. Component count, test coverage, supported themes, generated pages or agent task results may be stronger if verified.
5. Add one end-to-end example: prompt or requirement, system context retrieved, generated page, accessibility/design review and correction. That would show why the architecture matters better than another principle statement.
6. End with what was learned from building and using A1. Remove the prediction about which teams will succeed unless it is framed as Nathan's point of view rather than an outcome.

### Transform case study

**What works:** The staffing story, liaison model, adoption strategy and reflection on component-first adoption show mature systems leadership. The study acknowledges an approach that did not work as well as hoped, which increases trust.

**Suggested changes:**

1. Create a source note for all six impact bullets. Keep only the claims Nathan can explain and defend.
2. Narrow the WCAG claim to the audited scope and date.

### Fondue case study

**What works:** The component inventory, before/after Button property panels, Accordion documentation, token diagram, recipes, template and changelog are concrete evidence. These artifacts should carry the story.

**Suggested changes:**

1. Remove the unverified statistics immediately.
2. Change the date to 2023–2026 unless there is a documented reason for "present."
3. Fix the Centene source attribution and date its figures.
4. Use the revised challenge, process, relationships, accessibility, documentation and conclusion sections as the model for the rest of the study: name the intervention, explain what changed and let the screenshots provide evidence.
5. Replace **"46 components"** with **"45 released components and one proposed AEM Carousel"** if that reflects the inventory accurately.

### Member Menu case study

**What works:** The study explains the navigation problem, proactive concept work, MVP scope and core behavior clearly.

**Suggested changes:**

1. Verify or remove the user quote.
2. Show one workflow before and after. This would support the homepage's click-path claim.
3. Replace "architectural glue," "signal of architectural maturity," "seamless" and "designed with intent" with the actual navigation model.
4. If available, add task success, time, clicks, resumed-work rate or qualitative themes from observation. If none exist, state what shipped without claiming significant reduction.

### Filtering Component case study

**What works:** The configurable filter model, accessibility requirement and StackBlitz prototyping are useful technical details.

**Suggested changes:**

1. This is the most trope-heavy case study for its length: eight em dashes in seven body paragraphs, several three-part lists and two `not X, but Y` conclusions. Rewrite in shorter factual sentences.
2. Replace "dozens of teams" with a dated count or remove it.
3. Remove "the ROI became clear" unless ROI was calculated.
4. Replace "Additional filters can easily be added with no limits" with the actual supported configuration. "No limits" is an unsafe absolute.
5. The same `filter-group.png` appears twice near the start. Use the first occurrence for a different artifact or remove the duplicate so each image contributes evidence.
6. Combine the final two paragraphs into a short outcome that says where the component shipped and how teams configured it.

### Composer Architecture case study

**What works:** The two-day research description, four-department scope and concrete dropdown-to-checkbox example establish a real process.

**Suggested changes:**

1. Clarify whether the Third-Party Integration Manager shipped, was validated or remained a proposal. The image alt text says "Proposed," but the Impact section implies a delivered result.
2. Replace "dramatically reduces cognitive overhead" with a tested result or a neutral design rationale.
3. Replace the generic Impact paragraph with what changed in the backlog, implementation or user test.
4. Shorten the ten principles or show which two materially changed the design. A long, perfectly parallel list feels generic.
5. Replace "not just visually, but behaviorally" and "leveraging" with direct language.

### Car Shopper UX case study

**What works:** The candid critique of the final visual design, the "Included" test and the explanation that some concepts did not ship feel human. Preserve that honesty.

**Suggested changes:**

1. Update past work to past tense. Phrases such as "During my tenure," "we use" and "has been" make a 2019–2020 study sound copied from an older portfolio without review.
2. Verify 15,000 dealerships against the public 13,000-site figure for the same era.
3. Replace "added a lot of clarity" with the actual test observation, participant count or decision.
4. Remove "delve deep," "ultimately" and the claim about being ahead of an organization by years. The underlying lesson about organizational constraints is stronger without inflation.
5. Use "website" as one word and change headings to sentence case.
6. Explain Nathan's ownership within "we". The page describes team activity but does not always separate Nathan's decisions from the broader product effort.

## Editorial and consistency corrections

These are lower risk than fabricated or unsupported content, but fixing them will make the portfolio feel carefully maintained.

- Apply sentence case to headings and labels. Examples include "Design Systems," "Product & Experience Design," "The Vehicle Details Page," "Strategic Framing" and "Lessons Learned."
- Use `and` instead of `&` except in official names or genuinely constrained labels, following the A1 content standard.
- Use spaced em dashes where one remains. The portfolio currently mixes spaced and unspaced forms.
- Use en dashes for date ranges consistently.
- Use **website**, not **web site**.
- Remove the double space in "and  Systems."
- Replace generic image alt text beginning with "Image of" with a description of the useful content.
- Review acronyms on first use, including AEM, OEM, SRP, VDP, CMS, MCP and ROI. Recruiters outside the immediate domain may not know them.
- Decide whether the public title is Principal Designer, Design Systems Leader, Senior UX Designer or UX Architect. Targeted variants are reasonable, but the relationship among these titles should be clear.
- Keep employment, project and education names identical across About, résumé variants and case-study metadata.

## Content worth preserving

Not every polished line should be flattened. These details sound specific and create a memorable candidate:

- The triangle-versus-pyramid clarification in Process.
- The preference for Sharpies, small Post-its and coded prototypes when Figma is insufficient.
- The `project-final-37.psd` aside.
- Transform's honest component-first versus app-first reflection.
- Composer's two-day research scope and dropdown-to-checkbox example.
- Car Shopper's candid admission that some concepts did not ship and that the final visual design involved compromise.
- A1's explicit separation of shipped work from items labeled "Next."
- Fondue's actual component inventory, documentation images, recipes and changelog.

These details help because they could not be pasted into 100 unrelated portfolios unchanged.

## Recommended revision order

1. Remove Fondue's two unverified statistics.
2. Remove or substantiate the 48% and 72% résumé metrics.
3. Audit all testimonials against the original LinkedIn recommendations and improve attribution.
4. Verify the Member Menu quote and every Transform impact number.
5. Reconcile dates, titles, employer names, education credentials and career length.
6. Separate shipped work from proposed concepts in Composer, A1 and Fondue.
7. Rewrite Process, Filter and Fondue for concrete evidence and fewer repeated conclusions.
8. Tighten A1 and Transform after the credibility work is complete.
9. Apply sentence case, punctuation and terminology corrections across the final copy.

## Evidence packet to assemble

Keep a private folder for interview preparation. It does not all need to appear publicly.

- Analytics or an approved source for Transform's daily users and integrated applications.
- Component inventories and version dates for Transform and Fondue.
- Team roster or planning artifact supporting the 11-person team.
- Liaison roster or community record supporting 30 designers.
- Accessibility audit summary with scope, date and WCAG version.
- Study report behind the 48% and 72% résumé metrics.
- Research notes for the Member Menu quotation and before/after task flow.
- Adoption data for the filtering component.
- Release or validation status for the Composer redesign.
- Original LinkedIn recommendation text and permission for full attribution.
- A dated source for Dealer.com site scale.
- A repeatable A1 demonstration showing input, generated output, review findings and correction.

With that packet, the portfolio can make strong claims without sounding inflated. More important, Nathan will be ready when an interviewer asks the best possible follow-up: "How do you know?"
