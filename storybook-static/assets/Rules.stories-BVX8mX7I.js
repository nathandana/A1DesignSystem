import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{S as n}from"./iframe-D3ZfI8km.js";import{t as r}from"./jsx-runtime-Cul_R1t-.js";import{n as i,t as a}from"./Button-BIRPEBCL.js";import{n as o,t as s}from"./Heading-BBgH03-K.js";import{n as c,t as l}from"./Paragraph-CrZbx1QP.js";import{n as u,t as d}from"./IconButton-CG9OP9kM.js";import{i as f,t as p}from"./Message-BBXJ9OBC.js";import{n as m,t as h}from"./Link-B4bzwlsd.js";var g,_=e((()=>{g=`component: Button
rules:
  - id: button-clear-action-label
    components:
      - Button
    requirement: Use clear, action-oriented labels that describe what will happen.
    do: Use labels like "Save changes", "Create account", "Download report", or "Cancel order".
    dont: Use vague labels like "Submit", "OK", "Yes", or "Continue" when the action is not obvious.
    applies_to:
      - content
      - usability

  - id: button-visual-hierarchy
    components:
      - Button
    requirement: Use button hierarchy to communicate action priority.
    do: Use primary, secondary, tertiary, destructive, and icon button variants consistently.
    dont: Give multiple unrelated actions the same visual weight.
    applies_to:
      - hierarchy
      - visual-design

  - id: button-single-primary-action
    requirement: Use only one primary button within a single decision area.
    do: Make the main recommended action the only primary button in a form, dialog, or action group.
    dont: Place several primary buttons together and force users to compare competing actions.
    applies_to:
      - hierarchy
      - layout

  - id: button-not-color-alone
    components:
      - Button
      - IconButton
    requirement: Do not rely on color alone to communicate purpose, priority, or risk.
    do: Pair visual treatment with clear labels, icons, helper text, or confirmation patterns when needed.
    dont: Use only red, green, or another color to indicate meaning.
    applies_to:
      - accessibility
      - visual-design

  - id: button-destructive-clarity
    components:
      - Button
      - IconButton
    requirement: Make destructive actions explicit and harder to trigger accidentally.
    do: Use labels like "Delete project" or "Remove member" and add confirmation for high-risk actions.
    dont: Use vague labels like "Confirm" for destructive actions.
    applies_to:
      - safety
      - content
      - interaction

  - id: button-appropriate-visual-weight
    components:
      - Button
      - IconButton
    requirement: Match button emphasis to the importance and risk of the action.
    do: Make the primary action visually strongest and keep secondary actions quieter.
    dont: Make destructive or low-priority actions look like the preferred next step unless context requires it.
    applies_to:
      - hierarchy
      - visual-design

  - id: button-short-specific-labels
    components:
      - Button
      - IconButton
    requirement: Keep button labels short, specific, and scannable.
    do: Use concise labels, usually two to four words.
    dont: Use long sentence-style labels unless necessary for clarity.
    applies_to:
      - content
      - usability

  - id: button-verb-first-labels
    components:
      - Button
      - IconButton
    requirement: Use verbs for action buttons.
    do: Use labels like "Edit profile", "Add payment method", or "Download invoice".
    dont: Use noun-only labels like "Profile", "Payment method", or "Invoice" for actions.
    applies_to:
      - content
      - usability

  - id: button-consistent-placement
    components:
      - Button
      - IconButton
    requirement: Place actions consistently across similar interfaces.
    do: Keep primary, secondary, cancel, and destructive actions in predictable positions.
    dont: Move equivalent actions to different locations across similar screens or dialogs.
    applies_to:
      - layout
      - consistency

  - id: button-align-with-content
    components:
      - Button
      - IconButton
    requirement: Button alignment should match the alignment of the surrounding content.
    do: Align buttons with the content they act on.
    dont: Center or right-align buttons when the related content is left-aligned.
    applies_to:
      - layout
      - consistency
      - usability

  - id: button-center-alignment-context
    components:
      - Button
      - IconButton
    requirement: Only center buttons when the parent content is also centered.
    do: Center buttons in empty states, confirmations, or other centered layouts.
    dont: Center buttons under left-aligned headings, body copy, forms, or settings.
    applies_to:
      - layout
      - visual-design
      - consistency

  - id: button-right-alignment-contained
    components:
      - Button
      - IconButton
    requirement: Right-aligned buttons should only be used when the parent area is clearly defined and does not create a floating button effect.
    do: Right-align buttons inside a clear parent container such as a dialog footer, card, or panel.
    dont: Place a right-aligned button in open space where it appears detached from the content it affects.
    applies_to:
      - layout
      - visual-design
      - usability

  - id: button-touch-target-size
    components:
      - Button
      - IconButton
    requirement: Provide a large enough clickable or tappable target.
    do: Use a minimum target size of 44 by 44 pixels for touch interactions.
    dont: Make buttons or icon buttons difficult to click, tap, or focus.
    applies_to:
      - sizing
      - accessibility
      - interaction

  - id: button-clear-states
    components:
      - Button
      - IconButton
    requirement: Define clear visual states for all button interactions.
    do: Provide default, hover, focus, active, disabled, loading, success, and error states as needed.
    dont: Leave buttons without visible focus, loading, or disabled states.
    applies_to:
      - interaction
      - accessibility
      - visual-design

  - id: button-visible-focus
    components:
      - Button
      - IconButton
    requirement: Provide a clearly visible focus state for keyboard users.
    do: Use a focus indicator that is easy to see and distinct from hover or active states.
    dont: Remove focus outlines without replacing them with an accessible alternative.
    applies_to:
      - accessibility
      - interaction

  - id: button-disabled-explanation
    components:
      - Button
      - IconButton
    requirement: Explain why a button is disabled when the reason is not obvious.
    do: Provide helper text, validation messages, or visible requirements near the button or related fields.
    dont: Disable a button with no explanation and leave users guessing what to fix.
    applies_to:
      - usability
      - accessibility
      - content

  - id: button-loading-prevents-duplicates
    components:
      - Button
      - IconButton
    requirement: Use loading states to prevent duplicate actions.
    do: Show progress with labels like "Saving..." and prevent repeat submissions while the action is processing.
    dont: Allow users to click the same action repeatedly while a request is in progress.
    applies_to:
      - interaction
      - feedback

  - id: button-icon-accessible-label
    components:
      - Button
      - IconButton
    requirement: Icon-only buttons must have accessible names.
    do: Provide an aria-label, tooltip when useful, and a large enough hit area.
    dont: Rely on the icon alone to communicate the action to all users.
    applies_to:
      - accessibility
      - content
      - interaction

  - id: button-vs-link-usage
    components:
      - Button
      - IconButton
    requirement: Use buttons for actions and links for navigation.
    do: Use a button for saving, submitting, deleting, opening a modal, or changing state.
    dont: Use buttons for basic navigation when a link would be semantically correct.
    applies_to:
      - semantics
      - accessibility
      - interaction

  - id: button-limited-variant-set
    components:
      - Button
      - IconButton
    requirement: Keep the button system limited to reusable, purposeful variants.
    do: Provide a standard set such as primary, secondary, tertiary, destructive, text, and icon buttons.
    dont: Create one-off button styles for individual screens or edge cases.
    applies_to:
      - system-design
      - consistency
`})),v,y=e((()=>{v=`component: Badge
rules:
  - id: badge-natural-width
    requirement: Always size badges to the natural width of their content.
    do: Let the badge hug its label and optional icon.
    dont: Stretch badges to fill a parent container, grid column, or full row.
    applies_to:
      - layout
      - sizing

  - id: badge-short-label
    requirement: Keep badge labels short and scannable.
    do: Use concise labels like "New", "Active", "Draft", "Beta", or "Past due".
    dont: Use long phrases or sentence-style labels inside badges.
    applies_to:
      - content
      - usability

  - id: badge-status-clarity
    requirement: Use badges to communicate status, category, count, or metadata.
    do: Use badges for states like "Approved", "Pending", "Error", "Optional", or "Required".
    dont: Use badges for primary actions or navigational controls.
    applies_to:
      - semantics
      - usability

  - id: badge-not-actionable-by-default
    requirement: Do not make badges interactive unless the interaction is explicit and necessary.
    do: Use a button, chip, tag, or link pattern when the element is clickable.
    dont: Make a badge clickable without clear affordance, focus state, or accessible role.
    applies_to:
      - interaction
      - accessibility
      - semantics

  - id: badge-color-not-alone
    requirement: Do not rely on color alone to communicate meaning.
    do: Pair color with text such as "Error", "Success", "Warning", or "Inactive".
    dont: Use only red, green, yellow, or gray to indicate status.
    applies_to:
      - accessibility
      - visual-design

  - id: badge-accessible-contrast
    requirement: Ensure badge text and icons meet contrast requirements against the badge background.
    do: Use color pairings that maintain readable contrast in all themes and states.
    dont: Use pale text on pale backgrounds or saturated combinations that reduce legibility.
    applies_to:
      - accessibility
      - color

  - id: badge-consistent-meaning
    requirement: Use badge colors and variants consistently across the product.
    do: Reserve semantic variants like success, warning, error, info, and neutral for consistent meanings.
    dont: Use the same color to mean different things in different contexts.
    applies_to:
      - consistency
      - visual-design

  - id: badge-semantic-variant-before-custom
    requirement: Prefer semantic variants over one-off custom styles.
    do: Use standard variants such as neutral, brand, info, success, warning, error, and inverse.
    dont: Create screen-specific badge colors unless the system explicitly supports them.
    applies_to:
      - system-design
      - consistency

  - id: badge-icon-supportive
    requirement: Use icons only when they add meaning or improve recognition.
    do: Pair an icon with a label for statuses that benefit from quick recognition.
    dont: Add decorative icons that increase clutter without improving understanding.
    applies_to:
      - iconography
      - usability

  - id: badge-icon-not-required-for-status
    requirement: Do not require icons for badge comprehension.
    do: Make the text label sufficient on its own.
    dont: Depend on an icon as the only way to distinguish badge meaning.
    applies_to:
      - accessibility
      - content
      - iconography

  - id: badge-readable-type-size
    requirement: Use a readable text size for badge labels.
    do: Keep badge text large enough to read comfortably at normal interface scale.
    dont: Use overly small text to make badges feel compact.
    applies_to:
      - typography
      - accessibility

  - id: badge-stable-height
    requirement: Use consistent badge height and vertical alignment.
    do: Align badges visually with adjacent text, headings, table content, or form labels.
    dont: Let badge height vary unpredictably across variants with similar purpose.
    applies_to:
      - layout
      - visual-design

  - id: badge-appropriate-density
    requirement: Match badge padding and spacing to the density of the surrounding UI.
    do: Use compact spacing in tables and denser areas, and more comfortable spacing in cards or page headers.
    dont: Use oversized badges in dense content or cramped badges in prominent areas.
    applies_to:
      - spacing
      - layout

  - id: badge-inline-alignment
    requirement: Align inline badges with the text they support.
    do: Place badges close to the label, title, or item they describe.
    dont: Separate badges so far from their related content that the relationship becomes unclear.
    applies_to:
      - layout
      - usability

  - id: badge-count-formatting
    requirement: Format count badges consistently.
    do: Use predictable count formats such as "3", "12", or "99+".
    dont: Allow large numbers to break the badge layout or create inconsistent widths.
    applies_to:
      - content
      - layout

  - id: badge-overuse-avoidance
    requirement: Use badges sparingly to preserve their signal value.
    do: Apply badges to information that benefits from quick visual scanning.
    dont: Badge every item, label, or attribute on the page.
    applies_to:
      - usability
      - visual-design

  - id: badge-theme-support
    requirement: Ensure badge variants work across supported themes.
    do: Define badge tokens for background, text, border, and icon color across light, dark, and high-contrast modes.
    dont: Hard-code colors that only work in one theme.
    applies_to:
      - theming
      - color
      - system-design

  - id: badge-truncation-rules
    requirement: Define how badges behave when content is too long.
    do: Prefer short controlled labels, or truncate only when the full value is available elsewhere.
    dont: Let long badge labels wrap awkwardly or distort nearby layout.
    applies_to:
      - content
      - layout
      - responsive

  - id: badge-localization-support
    requirement: Account for translated labels that may be longer than the source language.
    do: Test badge layouts with longer localized strings.
    dont: Assume English badge length will represent all languages.
    applies_to:
      - localization
      - responsive
      - content

  - id: badge-screen-reader-meaning
    requirement: Ensure the badge meaning is understandable to assistive technology.
    do: Use clear text labels and add accessible context when the badge alone is ambiguous.
    dont: Expose unexplained visual-only labels or decorative symbols as meaningful content.
    applies_to:
      - accessibility
      - semantics`})),b,x=e((()=>{b=`component: System
rules:
  - id: system-heading-sentence-case
    components:
      - System
      - Heading
    requirement: Use sentence case for headings.
    do: Write headings like "Create account", "Payment details", or "Recent activity".
    dont: Write headings in title case like "Create Account", "Payment Details", or "Recent Activity".
    applies_to:
      - content
      - typography
      - consistency
`}));function S(e,t){let n=e.split(`
`),r=C(n,`component`),i=w(n,`components`),a=[],o=null,s=null;for(let e of n){let t=e.trim();if(t.startsWith(`- id:`)){o={id:T(t),requirement:``,do:``,dont:``,applies_to:[]},a.push(o),s=null;continue}if(o){if(t.startsWith(`requirement:`)){o.requirement=T(t),s=null;continue}if(t.startsWith(`do:`)){o.do=T(t),s=null;continue}if(t.startsWith(`dont:`)){o.dont=T(t),s=null;continue}if(t.endsWith(`:`)){s=t.slice(0,-1),Array.isArray(o[s])||(o[s]=[]);continue}s&&t.startsWith(`- `)&&o[s].push(t.slice(2))}}return{filePath:t,components:i.length?i:[r].filter(Boolean),rules:a}}function C(e,t){let n=e.find(e=>!e.startsWith(` `)&&e.trim().startsWith(`${t}:`));return n?T(n.trim()):``}function w(e,t){let n=C(e,t);if(n.startsWith(`[`)&&n.endsWith(`]`))return n.slice(1,-1).split(`,`).map(e=>e.trim()).filter(Boolean);let r=[],i=e.findIndex(e=>!e.startsWith(` `)&&e.trim()===`${t}:`);if(i===-1)return r;for(let t of e.slice(i+1)){let e=t.trim();if(!t.startsWith(` `)||e.endsWith(`:`))break;e.startsWith(`- `)&&r.push(e.slice(2))}return r}function T(e){return e.slice(e.indexOf(`:`)+1).trim().replace(/^["']|["']$/g,``)}function E(e){return e.reduce((e,t)=>(t.rules.forEach(n=>{let r=n.components?.length?n.components:t.components;r.forEach(i=>{e[i]||(e[i]=[]),e[i].push({...n,components:r,filePath:t.filePath})})}),e),{})}function D({rule:e,componentName:t}){return e.id.startsWith(`system-`)?(0,F.jsx)(k,{rule:e}):e.id.startsWith(`badge-`)?(0,F.jsx)(A,{rule:e}):e.id.startsWith(`button-`)?t===`IconButton`?(0,F.jsx)(M,{rule:e}):(0,F.jsx)(j,{rule:e}):(0,F.jsxs)(`div`,{style:L.examples,children:[(0,F.jsxs)(`div`,{style:L.example,children:[(0,F.jsx)(O,{type:`do`}),(0,F.jsx)(l,{size:`sm`,children:e.do})]}),(0,F.jsxs)(`div`,{style:L.example,children:[(0,F.jsx)(O,{type:`dont`}),(0,F.jsx)(l,{size:`sm`,children:e.dont})]})]})}function O({type:e}){let t=e===`do`;return(0,F.jsx)(`div`,{style:L.exampleLabelWrap,children:(0,F.jsx)(p,{status:t?`success`:`error`,children:t?`Do`:`Don't`})})}function k({rule:e}){let t={"system-heading-sentence-case":{do:(0,F.jsx)(s,{as:`h2`,size:`md`,children:`Payment details`}),dont:(0,F.jsx)(s,{as:`h2`,size:`md`,children:`Payment Details`})}}[e.id];return t?(0,F.jsxs)(`div`,{style:L.examples,children:[(0,F.jsxs)(`div`,{style:L.example,children:[(0,F.jsx)(O,{type:`do`}),t.do]}),(0,F.jsxs)(`div`,{style:L.example,children:[(0,F.jsx)(O,{type:`dont`}),t.dont]})]}):null}function A({rule:e}){let t={"badge-natural-width":{do:(0,F.jsx)(p,{status:`success`,children:`Active`}),dont:(0,F.jsx)(`div`,{className:`a1-rule-demo-badge-fill`,style:L.demoRail,children:(0,F.jsx)(p,{status:`success`,children:`Active`})})},"badge-short-label":{do:(0,F.jsx)(p,{status:`info`,children:`Beta`}),dont:(0,F.jsx)(p,{status:`info`,children:`This feature is currently in beta testing`})},"badge-status-clarity":{do:(0,F.jsx)(p,{status:`warn`,children:`Pending`}),dont:(0,F.jsx)(p,{status:`info`,children:`Open settings`})},"badge-not-actionable-by-default":{do:(0,F.jsx)(a,{variant:`secondary`,children:`Filter by status`}),dont:(0,F.jsx)(p,{status:`info`,className:`a1-rule-demo-clickable-badge`,children:`Filter`})},"badge-color-not-alone":{do:(0,F.jsx)(p,{status:`error`,children:`Error`}),dont:(0,F.jsx)(p,{status:`error`,"aria-label":`Status`,className:`a1-rule-demo-color-only-badge`,children:` `})},"badge-accessible-contrast":{do:(0,F.jsx)(p,{status:`success`,children:`Success`}),dont:(0,F.jsx)(p,{status:`success`,className:`a1-rule-demo-low-contrast-badge`,children:`Success`})},"badge-consistent-meaning":{do:(0,F.jsxs)(`div`,{style:L.demoRow,children:[(0,F.jsx)(p,{status:`success`,children:`Approved`}),(0,F.jsx)(p,{status:`error`,children:`Failed`})]}),dont:(0,F.jsxs)(`div`,{style:L.demoRow,children:[(0,F.jsx)(p,{status:`success`,children:`Approved`}),(0,F.jsx)(p,{status:`success`,children:`Failed`})]})},"badge-semantic-variant-before-custom":{do:(0,F.jsx)(p,{status:`info`,children:`Info`}),dont:(0,F.jsx)(p,{status:`info`,className:`a1-rule-demo-custom-badge`,children:`Launch`})},"badge-icon-supportive":{do:(0,F.jsx)(p,{status:`success`,icon:`check_circle`,children:`Verified`}),dont:(0,F.jsx)(p,{status:`neutral`,icon:`star`,children:`Draft`})},"badge-icon-not-required-for-status":{do:(0,F.jsx)(p,{status:`warn`,icon:`warning`,children:`Past due`}),dont:(0,F.jsx)(p,{status:`warn`,icon:`warning`,"aria-label":`Past due`,children:` `})},"badge-readable-type-size":{do:(0,F.jsx)(p,{status:`neutral`,children:`Draft`}),dont:(0,F.jsx)(p,{status:`neutral`,className:`a1-rule-demo-tiny-badge`,children:`Draft`})},"badge-stable-height":{do:(0,F.jsxs)(`div`,{style:L.demoRow,children:[(0,F.jsx)(p,{status:`neutral`,children:`Draft`}),(0,F.jsx)(p,{status:`success`,children:`Active`})]}),dont:(0,F.jsxs)(`div`,{style:L.demoRow,children:[(0,F.jsx)(p,{status:`neutral`,children:`Draft`}),(0,F.jsx)(p,{status:`success`,className:`a1-rule-demo-tall-badge`,children:`Active`})]})},"badge-appropriate-density":{do:(0,F.jsx)(p,{status:`neutral`,className:`a1-rule-demo-compact-badge`,children:`New`}),dont:(0,F.jsx)(p,{status:`neutral`,className:`a1-rule-demo-oversized-badge`,children:`New`})},"badge-inline-alignment":{do:(0,F.jsxs)(`div`,{style:L.demoRow,children:[(0,F.jsx)(`span`,{style:L.demoText,children:`Plan`}),(0,F.jsx)(p,{status:`info`,children:`Beta`})]}),dont:(0,F.jsxs)(`div`,{style:{...L.demoRow,justifyContent:`space-between`,width:`100%`},children:[(0,F.jsx)(`span`,{style:L.demoText,children:`Plan`}),(0,F.jsx)(p,{status:`info`,children:`Beta`})]})},"badge-count-formatting":{do:(0,F.jsx)(p,{status:`neutral`,icon:`notifications`,children:`99+`}),dont:(0,F.jsx)(p,{status:`neutral`,icon:`notifications`,children:`123456789`})},"badge-overuse-avoidance":{do:(0,F.jsx)(p,{status:`warn`,children:`Past due`}),dont:(0,F.jsxs)(`div`,{style:L.demoRow,children:[(0,F.jsx)(p,{status:`neutral`,children:`New`}),(0,F.jsx)(p,{status:`info`,children:`Beta`}),(0,F.jsx)(p,{status:`success`,children:`Active`}),(0,F.jsx)(p,{status:`warn`,children:`Soon`})]})},"badge-theme-support":{do:(0,F.jsx)(p,{status:`success`,children:`Theme token`}),dont:(0,F.jsx)(p,{status:`success`,className:`a1-rule-demo-hardcoded-badge`,children:`Hard-coded`})},"badge-truncation-rules":{do:(0,F.jsx)(p,{status:`info`,children:`Optional`}),dont:(0,F.jsx)(p,{status:`info`,children:`Optional for enterprise administrators only`})},"badge-localization-support":{do:(0,F.jsx)(p,{status:`info`,children:`In review`}),dont:(0,F.jsx)(p,{status:`info`,className:`a1-rule-demo-fixed-badge`,children:`Ausstehende Genehmigung`})},"badge-screen-reader-meaning":{do:(0,F.jsx)(p,{status:`error`,children:`Payment failed`}),dont:(0,F.jsx)(p,{status:`error`,"aria-label":`Red status`,children:`!`})}}[e.id];return t?(0,F.jsxs)(`div`,{style:L.examples,children:[(0,F.jsx)(`style`,{children:`
          .a1-rule-demo-badge-fill .a1-message-badge {
            display: flex;
            width: 100%;
            justify-content: center;
          }
          .a1-rule-demo-clickable-badge {
            cursor: pointer;
            box-shadow: inset 0 0 0 1px currentColor;
          }
          .a1-rule-demo-color-only-badge {
            min-width: 40px;
          }
          .a1-rule-demo-low-contrast-badge {
            background: var(--semantic-color-status-success-surface);
            color: var(--semantic-color-status-success-border);
          }
          .a1-rule-demo-custom-badge {
            background: #f97316;
            color: #fff7ed;
          }
          .a1-rule-demo-tiny-badge {
            font-size: 0.5625rem;
          }
          .a1-rule-demo-tall-badge {
            padding-block: var(--base-spacing-12);
          }
          .a1-rule-demo-compact-badge {
            padding-block: 2px;
            padding-inline: var(--base-spacing-8);
          }
          .a1-rule-demo-oversized-badge {
            padding: var(--base-spacing-16) var(--base-spacing-24);
            font-size: var(--semantic-font-size-body-md);
          }
          .a1-rule-demo-hardcoded-badge {
            background: #22c55e;
            color: #052e16;
          }
          .a1-rule-demo-fixed-badge {
            max-width: 72px;
            overflow: hidden;
            text-overflow: clip;
          }
        `}),(0,F.jsxs)(`div`,{style:L.example,children:[(0,F.jsx)(O,{type:`do`}),t.do]}),(0,F.jsxs)(`div`,{style:L.example,children:[(0,F.jsx)(O,{type:`dont`}),t.dont]})]}):null}function j({rule:e}){let t={"button-clear-action-label":{do:(0,F.jsx)(a,{children:`Save changes`}),dont:(0,F.jsx)(a,{children:`Submit`})},"button-visual-hierarchy":{do:(0,F.jsxs)(`div`,{style:L.demoRow,children:[(0,F.jsx)(a,{children:`Save changes`}),(0,F.jsx)(a,{variant:`secondary`,children:`Preview`}),(0,F.jsx)(a,{variant:`tertiary`,children:`Cancel`})]}),dont:(0,F.jsxs)(`div`,{style:L.demoRow,children:[(0,F.jsx)(a,{children:`Save`}),(0,F.jsx)(a,{children:`Preview`}),(0,F.jsx)(a,{children:`Cancel`})]})},"button-single-primary-action":{do:(0,F.jsxs)(`div`,{style:L.demoRow,children:[(0,F.jsx)(a,{children:`Publish`}),(0,F.jsx)(a,{variant:`secondary`,children:`Save draft`}),(0,F.jsx)(a,{variant:`tertiary`,children:`Cancel`})]}),dont:(0,F.jsxs)(`div`,{style:L.demoRow,children:[(0,F.jsx)(a,{children:`Publish`}),(0,F.jsx)(a,{children:`Save draft`}),(0,F.jsx)(a,{children:`Schedule`})]})},"button-not-color-alone":{do:(0,F.jsx)(a,{variant:`destructive`,icon:`delete`,children:`Delete project`}),dont:(0,F.jsx)(a,{className:`a1-rule-demo-red-only`,children:`Project`})},"button-destructive-clarity":{do:(0,F.jsx)(a,{variant:`destructive`,icon:`delete`,children:`Delete project`}),dont:(0,F.jsx)(a,{variant:`destructive`,children:`Confirm`})},"button-appropriate-visual-weight":{do:(0,F.jsxs)(`div`,{style:L.demoRow,children:[(0,F.jsx)(a,{children:`Invite member`}),(0,F.jsx)(a,{variant:`tertiary`,children:`Remove member`})]}),dont:(0,F.jsxs)(`div`,{style:L.demoRow,children:[(0,F.jsx)(a,{children:`Remove member`}),(0,F.jsx)(a,{variant:`secondary`,children:`Invite member`})]})},"button-short-specific-labels":{do:(0,F.jsx)(a,{children:`Download report`}),dont:(0,F.jsx)(a,{children:`Click here to download the full monthly performance report`})},"button-verb-first-labels":{do:(0,F.jsx)(a,{children:`Edit profile`}),dont:(0,F.jsx)(a,{children:`Profile`})},"button-consistent-placement":{do:(0,F.jsxs)(`div`,{style:L.demoColumn,children:[(0,F.jsxs)(`div`,{style:L.demoRow,children:[(0,F.jsx)(a,{variant:`tertiary`,children:`Cancel`}),(0,F.jsx)(a,{children:`Save changes`})]}),(0,F.jsxs)(`div`,{style:L.demoRow,children:[(0,F.jsx)(a,{variant:`tertiary`,children:`Cancel`}),(0,F.jsx)(a,{children:`Create account`})]})]}),dont:(0,F.jsxs)(`div`,{style:L.demoColumn,children:[(0,F.jsxs)(`div`,{style:L.demoRow,children:[(0,F.jsx)(a,{variant:`tertiary`,children:`Cancel`}),(0,F.jsx)(a,{children:`Save changes`})]}),(0,F.jsxs)(`div`,{style:L.demoRow,children:[(0,F.jsx)(a,{children:`Create account`}),(0,F.jsx)(a,{variant:`tertiary`,children:`Cancel`})]})]})},"button-align-with-content":{do:(0,F.jsxs)(`div`,{style:L.demoColumn,children:[(0,F.jsx)(`p`,{style:L.demoText,children:`Project details`}),(0,F.jsx)(a,{children:`Edit project`})]}),dont:(0,F.jsxs)(`div`,{style:{...L.demoRail,display:`flex`,flexDirection:`column`,alignItems:`center`,gap:`var(--base-spacing-8)`},children:[(0,F.jsx)(`p`,{style:{...L.demoText,alignSelf:`stretch`},children:`Project details`}),(0,F.jsx)(a,{children:`Edit project`})]})},"button-center-alignment-context":{do:(0,F.jsxs)(`div`,{style:{...L.demoColumn,alignItems:`center`,textAlign:`center`},children:[(0,F.jsx)(`p`,{style:L.demoText,children:`No reports yet`}),(0,F.jsx)(a,{children:`Create report`})]}),dont:(0,F.jsxs)(`div`,{style:L.demoColumn,children:[(0,F.jsx)(`p`,{style:L.demoText,children:`Reports`}),(0,F.jsx)(`div`,{style:{...L.demoRail,display:`flex`,justifyContent:`center`},children:(0,F.jsx)(a,{children:`Create report`})})]})},"button-right-alignment-contained":{do:(0,F.jsx)(`div`,{style:{...L.demoRail,display:`flex`,justifyContent:`flex-end`},children:(0,F.jsx)(a,{children:`Save changes`})}),dont:(0,F.jsx)(`div`,{style:{width:`100%`,display:`flex`,justifyContent:`flex-end`,paddingTop:`var(--base-spacing-24)`},children:(0,F.jsx)(a,{children:`Save changes`})})},"button-touch-target-size":{do:(0,F.jsx)(d,{icon:`edit`,label:`Edit item`}),dont:(0,F.jsx)(a,{className:`a1-rule-demo-small-button`,icon:`edit`,"aria-label":`Edit item`})},"button-clear-states":{do:(0,F.jsxs)(`div`,{style:L.demoRow,children:[(0,F.jsx)(a,{children:`Default`}),(0,F.jsx)(a,{className:`a1-rule-demo-focus`,children:`Focus`}),(0,F.jsx)(a,{disabled:!0,children:`Disabled`}),(0,F.jsx)(a,{icon:`sync`,children:`Saving...`})]}),dont:(0,F.jsx)(a,{className:`a1-rule-demo-no-state`,disabled:!0,children:`Save`})},"button-visible-focus":{do:(0,F.jsx)(a,{className:`a1-rule-demo-focus`,children:`Save changes`}),dont:(0,F.jsx)(a,{className:`a1-rule-demo-no-focus`,children:`Save changes`})},"button-disabled-explanation":{do:(0,F.jsxs)(`div`,{style:L.demoColumn,children:[(0,F.jsx)(a,{disabled:!0,children:`Create account`}),(0,F.jsx)(`p`,{style:L.demoText,children:`Add a valid email address to continue.`})]}),dont:(0,F.jsx)(a,{disabled:!0,children:`Create account`})},"button-loading-prevents-duplicates":{do:(0,F.jsx)(a,{disabled:!0,icon:`sync`,children:`Saving...`}),dont:(0,F.jsxs)(`div`,{style:L.demoRow,children:[(0,F.jsx)(a,{children:`Save`}),(0,F.jsx)(a,{children:`Save`})]})},"button-icon-accessible-label":{do:(0,F.jsx)(d,{icon:`close`,label:`Close dialog`}),dont:(0,F.jsx)(a,{icon:`close`,"aria-hidden":`true`})},"button-vs-link-usage":{do:(0,F.jsxs)(`div`,{style:L.demoRow,children:[(0,F.jsx)(a,{children:`Save settings`}),(0,F.jsx)(h,{href:`#`,children:`View documentation`})]}),dont:(0,F.jsx)(a,{as:`a`,href:`#`,children:`Documentation`})},"button-limited-variant-set":{do:(0,F.jsxs)(`div`,{style:L.demoRow,children:[(0,F.jsx)(a,{children:`Primary`}),(0,F.jsx)(a,{variant:`secondary`,children:`Secondary`}),(0,F.jsx)(a,{variant:`tertiary`,children:`Tertiary`})]}),dont:(0,F.jsx)(`div`,{style:L.demoRow,children:(0,F.jsx)(a,{className:`a1-rule-demo-one-off`,children:`Special screen button`})})}}[e.id];return t?(0,F.jsxs)(`div`,{style:L.examples,children:[(0,F.jsx)(`style`,{children:`
          .a1-rule-demo-small-button {
            width: 28px;
            min-width: 28px;
            height: 28px;
            min-height: 28px;
            max-height: 28px;
            padding: 0;
          }
          .a1-rule-demo-focus {
            outline: var(--component-button-focus-ring-width) solid var(--component-button-focus-ring);
            outline-offset: var(--component-button-focus-ring-offset);
          }
          .a1-rule-demo-no-focus:focus,
          .a1-rule-demo-no-focus {
            outline: 0;
          }
          .a1-rule-demo-no-state {
            opacity: 1;
          }
          .a1-rule-demo-one-off {
            border-radius: 999px;
            background: linear-gradient(90deg, #ec4899, #8b5cf6);
            border-color: transparent;
          }
          .a1-rule-demo-red-only {
            background: var(--semantic-color-status-error-background);
            border-color: var(--semantic-color-status-error-background);
            color: var(--semantic-color-status-error-foreground);
          }
        `}),(0,F.jsxs)(`div`,{style:L.example,children:[(0,F.jsx)(O,{type:`do`}),t.do]}),(0,F.jsxs)(`div`,{style:L.example,children:[(0,F.jsx)(O,{type:`dont`}),t.dont]})]}):null}function M({rule:e}){let t={"button-clear-action-label":{do:(0,F.jsx)(d,{icon:`delete`,label:`Delete project`}),dont:(0,F.jsx)(d,{icon:`delete`,label:`Delete`})},"button-visual-hierarchy":{do:(0,F.jsxs)(`div`,{style:L.demoRow,children:[(0,F.jsx)(d,{icon:`settings`,label:`Settings`,variant:`secondary`}),(0,F.jsx)(d,{icon:`more_vert`,label:`More options`})]}),dont:(0,F.jsxs)(`div`,{style:L.demoRow,children:[(0,F.jsx)(d,{icon:`settings`,label:`Settings`,variant:`secondary`}),(0,F.jsx)(d,{icon:`delete`,label:`Delete`,variant:`secondary`}),(0,F.jsx)(d,{icon:`more_vert`,label:`More options`,variant:`secondary`})]})},"button-not-color-alone":{do:(0,F.jsx)(d,{icon:`delete`,label:`Delete project`,variant:`destructive`}),dont:(0,F.jsx)(d,{icon:`more_vert`,label:`More options`,variant:`destructive`})},"button-destructive-clarity":{do:(0,F.jsx)(d,{icon:`delete`,label:`Delete project`,variant:`destructive`}),dont:(0,F.jsx)(d,{icon:`delete`,label:`Confirm`,variant:`destructive`})},"button-appropriate-visual-weight":{do:(0,F.jsxs)(`div`,{style:L.demoRow,children:[(0,F.jsx)(d,{icon:`edit`,label:`Edit item`,variant:`secondary`}),(0,F.jsx)(d,{icon:`delete`,label:`Delete item`})]}),dont:(0,F.jsxs)(`div`,{style:L.demoRow,children:[(0,F.jsx)(d,{icon:`delete`,label:`Delete item`,variant:`secondary`}),(0,F.jsx)(d,{icon:`edit`,label:`Edit item`})]})},"button-short-specific-labels":{do:(0,F.jsx)(d,{icon:`download`,label:`Download report`}),dont:(0,F.jsx)(d,{icon:`download`,label:`Click here to download the full monthly performance report`})},"button-verb-first-labels":{do:(0,F.jsx)(d,{icon:`edit`,label:`Edit profile`}),dont:(0,F.jsx)(d,{icon:`person`,label:`Profile`})},"button-consistent-placement":{do:(0,F.jsxs)(`div`,{style:L.demoColumn,children:[(0,F.jsxs)(`div`,{style:L.demoRow,children:[(0,F.jsx)(d,{icon:`edit`,label:`Edit item`}),(0,F.jsx)(d,{icon:`delete`,label:`Delete item`})]}),(0,F.jsxs)(`div`,{style:L.demoRow,children:[(0,F.jsx)(d,{icon:`edit`,label:`Edit member`}),(0,F.jsx)(d,{icon:`delete`,label:`Delete member`})]})]}),dont:(0,F.jsxs)(`div`,{style:L.demoColumn,children:[(0,F.jsxs)(`div`,{style:L.demoRow,children:[(0,F.jsx)(d,{icon:`edit`,label:`Edit item`}),(0,F.jsx)(d,{icon:`delete`,label:`Delete item`})]}),(0,F.jsxs)(`div`,{style:L.demoRow,children:[(0,F.jsx)(d,{icon:`delete`,label:`Delete member`}),(0,F.jsx)(d,{icon:`edit`,label:`Edit member`})]})]})},"button-align-with-content":{do:(0,F.jsxs)(`div`,{style:L.demoColumn,children:[(0,F.jsx)(`p`,{style:L.demoText,children:`Project details`}),(0,F.jsx)(d,{icon:`edit`,label:`Edit project`})]}),dont:(0,F.jsxs)(`div`,{style:{...L.demoRail,display:`flex`,flexDirection:`column`,alignItems:`center`,gap:`var(--base-spacing-8)`},children:[(0,F.jsx)(`p`,{style:{...L.demoText,alignSelf:`stretch`},children:`Project details`}),(0,F.jsx)(d,{icon:`edit`,label:`Edit project`})]})},"button-center-alignment-context":{do:(0,F.jsxs)(`div`,{style:{...L.demoColumn,alignItems:`center`,textAlign:`center`},children:[(0,F.jsx)(`p`,{style:L.demoText,children:`No reports yet`}),(0,F.jsx)(d,{icon:`add`,label:`Create report`,variant:`secondary`})]}),dont:(0,F.jsxs)(`div`,{style:L.demoColumn,children:[(0,F.jsx)(`p`,{style:L.demoText,children:`Reports`}),(0,F.jsx)(`div`,{style:{...L.demoRail,display:`flex`,justifyContent:`center`},children:(0,F.jsx)(d,{icon:`add`,label:`Create report`,variant:`secondary`})})]})},"button-right-alignment-contained":{do:(0,F.jsx)(`div`,{style:{...L.demoRail,display:`flex`,justifyContent:`flex-end`},children:(0,F.jsx)(d,{icon:`save`,label:`Save changes`,variant:`secondary`})}),dont:(0,F.jsx)(`div`,{style:{width:`100%`,display:`flex`,justifyContent:`flex-end`,paddingTop:`var(--base-spacing-24)`},children:(0,F.jsx)(d,{icon:`save`,label:`Save changes`,variant:`secondary`})})},"button-touch-target-size":{do:(0,F.jsx)(d,{icon:`edit`,label:`Edit item`}),dont:(0,F.jsx)(d,{icon:`edit`,label:`Edit item`,className:`a1-rule-demo-small-icon-button`})},"button-clear-states":{do:(0,F.jsxs)(`div`,{style:L.demoRow,children:[(0,F.jsx)(d,{icon:`edit`,label:`Edit item`}),(0,F.jsx)(d,{icon:`edit`,label:`Focused edit item`,className:`a1-rule-demo-icon-focus`}),(0,F.jsx)(d,{icon:`edit`,label:`Edit item unavailable`,disabled:!0})]}),dont:(0,F.jsx)(d,{icon:`edit`,label:`Edit item unavailable`,disabled:!0,className:`a1-rule-demo-icon-no-state`})},"button-visible-focus":{do:(0,F.jsx)(d,{icon:`edit`,label:`Edit item`,className:`a1-rule-demo-icon-focus`}),dont:(0,F.jsx)(d,{icon:`edit`,label:`Edit item`,className:`a1-rule-demo-icon-no-focus`})},"button-disabled-explanation":{do:(0,F.jsxs)(`div`,{style:L.demoColumn,children:[(0,F.jsx)(d,{icon:`send`,label:`Send invitation`,disabled:!0}),(0,F.jsx)(`p`,{style:L.demoText,children:`Add an email address to send an invitation.`})]}),dont:(0,F.jsx)(d,{icon:`send`,label:`Send invitation`,disabled:!0})},"button-loading-prevents-duplicates":{do:(0,F.jsx)(d,{icon:`sync`,label:`Saving changes`,disabled:!0}),dont:(0,F.jsxs)(`div`,{style:L.demoRow,children:[(0,F.jsx)(d,{icon:`save`,label:`Save changes`}),(0,F.jsx)(d,{icon:`save`,label:`Save changes`})]})},"button-icon-accessible-label":{do:(0,F.jsx)(d,{icon:`close`,label:`Close dialog`}),dont:(0,F.jsx)(`button`,{className:`a1-icon-button a1-icon-button--tertiary`,type:`button`,children:(0,F.jsx)(`span`,{className:`material-symbols-outlined`,children:`close`})})},"button-vs-link-usage":{do:(0,F.jsxs)(`div`,{style:L.demoRow,children:[(0,F.jsx)(d,{icon:`settings`,label:`Open settings`}),(0,F.jsx)(h,{href:`#`,icon:`open_in_new`,iconPosition:`end`,children:`Docs`})]}),dont:(0,F.jsx)(`a`,{className:`a1-icon-button a1-icon-button--tertiary`,href:`#`,children:(0,F.jsx)(`span`,{className:`material-symbols-outlined`,children:`docs`})})},"button-limited-variant-set":{do:(0,F.jsxs)(`div`,{style:L.demoRow,children:[(0,F.jsx)(d,{icon:`settings`,label:`Settings`}),(0,F.jsx)(d,{icon:`settings`,label:`Settings`,variant:`secondary`})]}),dont:(0,F.jsx)(d,{icon:`settings`,label:`Settings`,className:`a1-rule-demo-one-off-icon-button`})}}[e.id];return t?(0,F.jsxs)(`div`,{style:L.examples,children:[(0,F.jsx)(`style`,{children:`
          .a1-rule-demo-small-icon-button {
            height: 28px;
            width: 28px;
          }
          .a1-rule-demo-icon-focus {
            outline: var(--component-button-focus-ring-width) solid var(--component-button-focus-ring);
            outline-offset: var(--component-icon-button-focus-ring-offset);
          }
          .a1-rule-demo-icon-no-focus:focus,
          .a1-rule-demo-icon-no-focus {
            outline: 0;
          }
          .a1-rule-demo-icon-no-state {
            opacity: 1;
          }
          .a1-rule-demo-one-off-icon-button {
            border-radius: 999px;
            background: linear-gradient(90deg, #ec4899, #8b5cf6);
            border-color: transparent;
            color: white;
          }
        `}),(0,F.jsxs)(`div`,{style:L.example,children:[(0,F.jsx)(O,{type:`do`}),t.do]}),(0,F.jsxs)(`div`,{style:L.example,children:[(0,F.jsx)(O,{type:`dont`}),t.dont]})]}):null}function N({componentName:e,title:t,source:n}){let[r,i]=(0,P.useState)(`all`),a=R[e]??[],o=Array.from(new Set(a.flatMap(e=>e.applies_to??[]))).sort(),c=o.reduce((e,t)=>(e[t]=a.filter(e=>e.applies_to?.includes(t)).length,e),{}),u=r===`all`?a:a.filter(e=>e.applies_to?.includes(r));return(0,F.jsxs)(`div`,{style:L.page,children:[(0,F.jsxs)(`section`,{style:L.intro,children:[(0,F.jsx)(s,{as:`h1`,type:`display`,size:`xl`,children:t}),(0,F.jsxs)(l,{color:`muted`,children:[`Component rules from `,n,`. Rules can still identify multiple components when a rule spans them.`]})]}),(0,F.jsxs)(`section`,{style:L.group,children:[(0,F.jsxs)(`div`,{style:L.filter,"aria-label":`${t} tag filter`,children:[(0,F.jsx)(l,{size:`sm`,color:`muted`,children:`Filter by tag`}),(0,F.jsx)(`div`,{style:L.filterList,children:[`all`,...o].map(e=>{let t=r===e;return(0,F.jsx)(`button`,{type:`button`,style:{...L.filterButton,...t?L.filterButtonActive:{}},"aria-pressed":t,onClick:()=>i(e),children:e===`all`?`All (${a.length})`:`${e} (${c[e]})`},e)})})]}),(0,F.jsxs)(`div`,{style:L.ruleList,children:[u.map(t=>(0,F.jsxs)(`article`,{style:L.rule,children:[(0,F.jsx)(s,{as:`h2`,size:`xs`,children:t.id}),(0,F.jsx)(l,{children:t.requirement}),(0,F.jsx)(D,{rule:t,componentName:e}),(0,F.jsxs)(`div`,{style:L.meta,children:[t.components.length>1&&(0,F.jsxs)(`span`,{style:L.tag,children:[`components: `,t.components.join(`, `)]}),t.applies_to?.map(e=>(0,F.jsx)(`span`,{style:L.tag,children:e},e))]})]},`${t.filePath}-${t.id}`)),u.length===0&&(0,F.jsx)(l,{color:`muted`,children:`No rules match this tag.`})]})]})]})}var P,F,I,L,R,z,B,V,H,U,W,G;e((()=>{_(),y(),x(),P=t(n(),1),i(),o(),u(),m(),f(),c(),F=r(),I=Object.assign({"../../../../system/rules/button.yaml":g,"../../../../system/rules/message-badge.yaml":v,"../../../../system/rules/system.yaml":b}),L={page:{width:`min(960px, calc(100vw - 48px))`,display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-32)`},intro:{maxWidth:`680px`,display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-8)`},group:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-16)`},ruleList:{display:`grid`,gap:`var(--base-spacing-12)`},filter:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-8)`},filterList:{display:`flex`,flexWrap:`wrap`,gap:`var(--base-spacing-8)`},filterButton:{appearance:`none`,border:`1px solid var(--semantic-color-border-subtle)`,borderRadius:`var(--base-radius-control)`,background:`var(--semantic-color-surface-page)`,color:`var(--semantic-color-text-muted)`,cursor:`pointer`,fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-sm)`,padding:`var(--base-spacing-4) var(--base-spacing-8)`},filterButtonActive:{background:`var(--semantic-color-action-background)`,borderColor:`var(--semantic-color-action-background)`,color:`var(--semantic-color-action-foreground)`},rule:{padding:`var(--base-spacing-20)`,border:`1px solid var(--semantic-color-border-subtle)`,borderRadius:`var(--base-radius-control)`,background:`var(--semantic-color-surface-panel)`},meta:{display:`flex`,flexWrap:`wrap`,gap:`var(--base-spacing-8)`,marginTop:`var(--base-spacing-12)`},examples:{display:`grid`,gridTemplateColumns:`repeat(2, minmax(0, 1fr))`,gap:`var(--base-spacing-12)`,marginTop:`var(--base-spacing-16)`},example:{minWidth:0,padding:`var(--base-spacing-12)`,border:`1px solid var(--semantic-color-border-subtle)`,borderRadius:`var(--base-radius-control)`,background:`var(--semantic-color-surface-page)`},exampleLabelWrap:{display:`flex`,marginBottom:`var(--base-spacing-8)`},demoRow:{display:`flex`,alignItems:`center`,gap:`var(--base-spacing-8)`,flexWrap:`wrap`},demoColumn:{display:`flex`,flexDirection:`column`,alignItems:`flex-start`,gap:`var(--base-spacing-8)`},demoText:{margin:0,color:`var(--semantic-color-text-muted)`,fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-sm)`},demoRail:{boxSizing:`border-box`,width:`100%`,padding:`var(--base-spacing-8)`,border:`1px dashed var(--semantic-color-border-default)`,borderRadius:`var(--base-radius-control)`},tag:{padding:`var(--base-spacing-4) var(--base-spacing-8)`,borderRadius:`var(--base-radius-control)`,background:`var(--semantic-color-surface-page)`,color:`var(--semantic-color-text-muted)`,fontFamily:`monospace`,fontSize:`var(--semantic-font-size-body-xs)`}},R=E(Object.entries(I).map(([e,t])=>S(t,e))),z={title:`Rules`,parameters:{layout:`centered`,controls:{disable:!0}}},B={name:`Badge`,render:()=>(0,F.jsx)(N,{componentName:`Badge`,title:`Badge Rules`,source:`system/rules/message-badge.yaml`})},V={name:`System`,render:()=>(0,F.jsx)(N,{componentName:`System`,title:`System Rules`,source:`system/rules/system.yaml`})},H={name:`Heading`,render:()=>(0,F.jsx)(N,{componentName:`Heading`,title:`Heading Rules`,source:`system/rules/system.yaml`})},U={name:`Icon Button`,render:()=>(0,F.jsx)(N,{componentName:`IconButton`,title:`Icon Button Rules`,source:`system/rules/button.yaml`})},W={name:`Button`,render:()=>(0,F.jsx)(N,{componentName:`Button`,title:`Button Rules`,source:`system/rules/button.yaml`})},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  name: "Badge",
  render: () => <ComponentRulesPage componentName="Badge" title="Badge Rules" source="system/rules/message-badge.yaml" />
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  name: "System",
  render: () => <ComponentRulesPage componentName="System" title="System Rules" source="system/rules/system.yaml" />
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  name: "Heading",
  render: () => <ComponentRulesPage componentName="Heading" title="Heading Rules" source="system/rules/system.yaml" />
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  name: "Icon Button",
  render: () => <ComponentRulesPage componentName="IconButton" title="Icon Button Rules" source="system/rules/button.yaml" />
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  name: "Button",
  render: () => <ComponentRulesPage componentName="Button" title="Button Rules" source="system/rules/button.yaml" />
}`,...W.parameters?.docs?.source}}},G=[`Badge`,`SystemRules`,`HeadingRules`,`IconButtonRules`,`ButtonRules`]}))();export{B as Badge,W as ButtonRules,H as HeadingRules,U as IconButtonRules,V as SystemRules,G as __namedExportsOrder,z as default};