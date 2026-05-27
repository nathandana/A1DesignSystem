import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{C as n,t as r}from"./iframe-C_HQpeIV.js";import{n as i,t as a}from"./IconButton-CBPTGFYh.js";import{n as o,t as s}from"./Button-imiHOgNS.js";import{n as c,t as l}from"./Heading-Y_nkG59n.js";import{n as u,t as d}from"./Link-Coa02k-j.js";import{i as f,t as p}from"./Message-CPtJtMUX.js";import{n as m,t as h}from"./Paragraph-DxqgNv4K.js";var g,_=e((()=>{g=`component: Button
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

  - id: button-icon-and-verb
    components:
      - Button
    requirement: Tertiary buttons must always include both a visible icon and a verb-led label.
    do: Pair every button with a relevant icon and a verb label so users can identify the action visually and by meaning.
    dont: Use a button with text only or an icon only — an icon adds scannability, and the verb ensures the action is understood without relying on shape alone.
    applies_to:
      - accessibility
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
      - semantics`})),b,x=e((()=>{b=`component: Motion
rules:
  - id: motion-scale-duration-to-size
    components: []
    requirement: Match animation duration to the physical scale of what is moving.
    do: |
      Use shorter durations (quick 100ms, fast 150ms) for small elements like icon state changes,
      tooltips, and badge counts. Use normal (200ms) for mid-size elements like expanding rows or
      inline menus. Use slow (300ms) or slower (500ms) for large panels, full-screen overlays,
      and page-level transitions.
    dont: |
      Apply the same duration to a tiny badge toggle and a full side panel entrance. A large
      panel animating at 100ms feels jerky; a small badge animating at 500ms feels broken.
    applies_to:
      - animation
      - visual-design

  - id: motion-scale-distance-to-duration
    components: []
    requirement: Elements that travel greater distances should take proportionally longer.
    do: |
      A panel sliding in from off-screen (large distance) should use slow (300ms). A row
      expanding in place (small distance) should use normal (200ms) or fast (150ms).
    dont: |
      Animate an element that crosses the full viewport width in the same time as one that
      shifts a few pixels. The physics feel wrong and create a jarring experience.
    applies_to:
      - animation
      - visual-design

  - id: motion-easing-by-direction
    components: []
    requirement: Use enter easing for elements arriving, exit easing for elements leaving, and standard easing for elements transforming in place.
    do: |
      Use --semantic-motion-easing-enter (decelerate) when a panel, dialog, or dropdown opens.
      Use --semantic-motion-easing-exit (accelerate) when it closes. Use
      --semantic-motion-easing-standard for toggles, state changes, and bidirectional transforms.
    dont: |
      Apply the same easing curve to both entering and exiting motion. An element that enters
      fast and leaves slowly creates spatial confusion about where it came from.
    applies_to:
      - animation
      - interaction

  - id: motion-expressive-reserved
    components: []
    requirement: Reserve expressive (springy) easing for high-intent, infrequent moments only.
    do: |
      Use --semantic-motion-easing-expressive for prominent one-time transitions — a
      confirmation success state, a feature introduction, or a modal opening on first use.
    dont: |
      Apply expressive easing to every hover or focus interaction. Repeated springy motion
      becomes distracting and undermines the feeling of a polished product.
    applies_to:
      - animation
      - visual-design
      - usability

  - id: motion-functional-only
    components: []
    requirement: Every animation must serve a functional purpose — it should orient, confirm, or guide.
    do: |
      Animate to show spatial relationships (where a panel came from), confirm an action
      (a checkmark animating in on save), or guide attention (highlighting a newly added item).
    dont: |
      Add animation purely for visual decoration. Animations that have no functional role
      increase cognitive load and slow users down on repeated tasks.
    applies_to:
      - animation
      - usability
      - interaction

  - id: motion-non-blocking
    components: []
    requirement: Animations must never block or delay user interaction.
    do: |
      Make interactive targets (buttons, links, inputs) immediately responsive. If an element
      is animating in, it should be interactive as soon as its hit area is visible — not after
      the animation completes.
    dont: |
      Disable pointer events or delay focus management until an animation finishes. Users
      who click or tab quickly should not be penalized by the animation timeline.
    applies_to:
      - accessibility
      - interaction
      - usability

  - id: motion-reduced-motion
    components: []
    requirement: All animated behavior must respect the prefers-reduced-motion: reduce media query.
    do: |
      Use the --semantic-motion-duration-* tokens for all transitions and animations.
      These tokens are automatically set to 0ms when reduced motion is active. For animations
      driven by JavaScript (GSAP, Framer Motion, etc.) read the media query explicitly and
      skip or replace the animation.
    dont: |
      Hardcode duration values in CSS or JS. Tokens set to 0ms collapse transitions
      transparently; hardcoded values remain active even for users who have requested less motion.
    applies_to:
      - accessibility

  - id: motion-no-infinite-loops
    components: []
    requirement: Do not use infinite or auto-playing animations except for explicit loading states.
    do: |
      Limit looping animations to spinners, skeleton screens, and progress indicators that
      communicate an ongoing async operation. Stop them as soon as the operation completes.
    dont: |
      Animate decorative elements (background gradients, floating particles, pulsing badges)
      in infinite loops. Persistent motion is distracting, drains battery on mobile devices,
      and can trigger vestibular disorders.
    applies_to:
      - accessibility
      - performance

  - id: motion-use-tokens
    components: []
    requirement: Always use --semantic-motion-duration-* and --semantic-motion-easing-* tokens. Never hardcode timing values.
    do: |
      transition: background var(--semantic-motion-duration-fast) var(--semantic-motion-easing-standard);
    dont: |
      transition: background 150ms ease-in-out; — hardcoded values cannot be themed,
      overridden by reduced-motion, or adjusted globally.
    applies_to:
      - animation
      - consistency
      - system-design
`})),S,C=e((()=>{S=`rules:
  - id: page-layout-no-body-gap
    component: PageLayout
    title: No gap between sidebar and main
    description: >
      The \`.a1-page-layout__body\` flex row has no gap property. The sidebar and
      main area are adjacent with zero space between them. Any inset spacing
      must come from padding applied inside the main content — not from the
      layout itself. This ensures sidebar backgrounds and borders extend
      flush to the main area without a visible seam.
    rationale: >
      A gap on the body row creates a bare strip between the sidebar and content
      that cannot be filled by either child, making it impossible to achieve
      a clean edge-to-edge sidebar appearance.
    do:
      - Apply padding to the element placed inside PageLayout children.
      - Use a Section component or a padded wrapper as the first child of main.
    dont:
      - Do not add gap, margin, or padding-inline-start to .a1-page-layout__body.
      - Do not add margin to .a1-page-layout__sidebar or .a1-page-layout__main.
`})),w,T=e((()=>{w=`component: SideNav
rules:
  - id: side-nav-sticky-desktop
    components:
      - SideNav
      - PageLayout
    requirement: At desktop (≥1025px) the sidebar must be sticky — it does not scroll with the page.
    do: Place SideNav as a sibling to the page's main content area in a flex row. The component applies \`position: sticky; top: 0; height: 100vh\` automatically at lg/xl, keeping the sidebar pinned to the viewport top while the page scrolls.
    dont: Wrap the SideNav in a container that has \`overflow: hidden\` or \`overflow: auto\` at desktop — this breaks sticky positioning. Do not apply \`position: fixed\` or \`position: relative\` overrides that interfere with stickiness.
    applies_to:
      - layout
      - responsive
      - behavior

  - id: side-nav-internal-scroll
    components:
      - SideNav
    requirement: Nav items scroll internally. The header and footer slots must remain visible at all times.
    do: Let the nav item list grow naturally — the \`.a1-side-nav__nav\` region scrolls when its content overflows. The header row and footer are outside the scroll region and always stay anchored.
    dont: Place the header or footer content inside the nav item list, and do not set a fixed height on the sidebar that cuts off the header or footer.
    applies_to:
      - layout
      - behavior
      - accessibility

  - id: side-nav-mobile-overlay
    components:
      - SideNav
    requirement: At mobile and tablet (≤1024px) the sidebar is a fixed overlay that slides in from the edge. It must not be persistent.
    do: Control visibility with the \`open\` prop and close it via \`onClose\`. Provide a menu button in the page header to re-open it. The component renders a scrim on sm/md that dismisses the drawer on click.
    dont: Force the sidebar to be permanently visible at mobile widths — it will cover content and break the layout.
    applies_to:
      - layout
      - responsive
      - behavior
`})),E,D=e((()=>{E=`component: System
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
  - id: system-no-uppercase-content
    components:
      - System
      - Heading
      - Paragraph
    requirement: Do not use uppercase transforms on content text.
    do: Write "Submit form" or "Recent activity" — sentence-case content reads clearly for all users.
    dont: Apply text-transform uppercase or write ALL CAPS content, as screen readers may spell out individual characters.
    applies_to:
      - content
      - typography
      - accessibility
`}));function O(e,t){let n=e.split(`
`),r=k(n,`component`),i=A(n,`components`),a=[],o=null,s=null;for(let e of n){let t=e.trim();if(t.startsWith(`- id:`)){o={id:j(t),requirement:``,do:``,dont:``,applies_to:[]},a.push(o),s=null;continue}if(o){if(t.startsWith(`requirement:`)){o.requirement=j(t),s=null;continue}if(t.startsWith(`do:`)){o.do=j(t),s=null;continue}if(t.startsWith(`dont:`)){o.dont=j(t),s=null;continue}if(t.endsWith(`:`)){s=t.slice(0,-1),Array.isArray(o[s])||(o[s]=[]);continue}s&&t.startsWith(`- `)&&o[s].push(t.slice(2))}}return{filePath:t,components:i.length?i:[r].filter(Boolean),rules:a}}function k(e,t){let n=e.find(e=>!e.startsWith(` `)&&e.trim().startsWith(`${t}:`));return n?j(n.trim()):``}function A(e,t){let n=k(e,t);if(n.startsWith(`[`)&&n.endsWith(`]`))return n.slice(1,-1).split(`,`).map(e=>e.trim()).filter(Boolean);let r=[],i=e.findIndex(e=>!e.startsWith(` `)&&e.trim()===`${t}:`);if(i===-1)return r;for(let t of e.slice(i+1)){let e=t.trim();if(!t.startsWith(` `)||e.endsWith(`:`))break;e.startsWith(`- `)&&r.push(e.slice(2))}return r}function j(e){return e.slice(e.indexOf(`:`)+1).trim().replace(/^["']|["']$/g,``)}function M(e){return e.reduce((e,t)=>(t.rules.forEach(n=>{let r=n.components?.length?n.components:t.components;r.forEach(i=>{e[i]||(e[i]=[]),e[i].push({...n,components:r,filePath:t.filePath})})}),e),{})}function N({rule:e,componentName:t}){return e.id.startsWith(`system-`)?(0,V.jsx)(F,{rule:e}):e.id.startsWith(`badge-`)?(0,V.jsx)(I,{rule:e}):e.id.startsWith(`button-`)?t===`IconButton`?(0,V.jsx)(R,{rule:e}):(0,V.jsx)(L,{rule:e}):(0,V.jsxs)(`div`,{style:U.examples,children:[(0,V.jsxs)(`div`,{style:U.example,children:[(0,V.jsx)(P,{type:`do`}),(0,V.jsx)(h,{size:`sm`,children:e.do})]}),(0,V.jsxs)(`div`,{style:U.example,children:[(0,V.jsx)(P,{type:`dont`}),(0,V.jsx)(h,{size:`sm`,children:e.dont})]})]})}function P({type:e}){let t=e===`do`;return(0,V.jsx)(`div`,{style:U.exampleLabelWrap,children:(0,V.jsx)(p,{status:t?`success`:`error`,children:t?`Do`:`Don't`})})}function F({rule:e}){let t={"system-heading-sentence-case":{do:(0,V.jsx)(l,{as:`h2`,size:`md`,children:`Payment details`}),dont:(0,V.jsx)(l,{as:`h2`,size:`md`,children:`Payment Details`})},"system-no-uppercase-content":{do:(0,V.jsx)(l,{as:`h2`,size:`md`,children:`Submit form`}),dont:(0,V.jsx)(l,{as:`h2`,size:`md`,style:{textTransform:`uppercase`},children:`Submit form`})}}[e.id];return t?(0,V.jsxs)(`div`,{style:U.examples,children:[(0,V.jsxs)(`div`,{style:U.example,children:[(0,V.jsx)(P,{type:`do`}),t.do]}),(0,V.jsxs)(`div`,{style:U.example,children:[(0,V.jsx)(P,{type:`dont`}),t.dont]})]}):null}function I({rule:e}){let t={"badge-natural-width":{do:(0,V.jsx)(p,{status:`success`,children:`Active`}),dont:(0,V.jsx)(`div`,{className:`a1-rule-demo-badge-fill`,style:U.demoRail,children:(0,V.jsx)(p,{status:`success`,children:`Active`})})},"badge-short-label":{do:(0,V.jsx)(p,{status:`info`,children:`Beta`}),dont:(0,V.jsx)(p,{status:`info`,children:`This feature is currently in beta testing`})},"badge-status-clarity":{do:(0,V.jsx)(p,{status:`warn`,children:`Pending`}),dont:(0,V.jsx)(p,{status:`info`,children:`Open settings`})},"badge-not-actionable-by-default":{do:(0,V.jsx)(s,{variant:`secondary`,children:`Filter by status`}),dont:(0,V.jsx)(p,{status:`info`,className:`a1-rule-demo-clickable-badge`,children:`Filter`})},"badge-color-not-alone":{do:(0,V.jsx)(p,{status:`error`,children:`Error`}),dont:(0,V.jsx)(p,{status:`error`,"aria-label":`Status`,className:`a1-rule-demo-color-only-badge`,children:` `})},"badge-accessible-contrast":{do:(0,V.jsx)(p,{status:`success`,children:`Success`}),dont:(0,V.jsx)(p,{status:`success`,className:`a1-rule-demo-low-contrast-badge`,children:`Success`})},"badge-consistent-meaning":{do:(0,V.jsxs)(`div`,{style:U.demoRow,children:[(0,V.jsx)(p,{status:`success`,children:`Approved`}),(0,V.jsx)(p,{status:`error`,children:`Failed`})]}),dont:(0,V.jsxs)(`div`,{style:U.demoRow,children:[(0,V.jsx)(p,{status:`success`,children:`Approved`}),(0,V.jsx)(p,{status:`success`,children:`Failed`})]})},"badge-semantic-variant-before-custom":{do:(0,V.jsx)(p,{status:`info`,children:`Info`}),dont:(0,V.jsx)(p,{status:`info`,className:`a1-rule-demo-custom-badge`,children:`Launch`})},"badge-icon-supportive":{do:(0,V.jsx)(p,{status:`success`,icon:`check_circle`,children:`Verified`}),dont:(0,V.jsx)(p,{status:`neutral`,icon:`star`,children:`Draft`})},"badge-icon-not-required-for-status":{do:(0,V.jsx)(p,{status:`warn`,icon:`warning`,children:`Past due`}),dont:(0,V.jsx)(p,{status:`warn`,icon:`warning`,"aria-label":`Past due`,children:` `})},"badge-readable-type-size":{do:(0,V.jsx)(p,{status:`neutral`,children:`Draft`}),dont:(0,V.jsx)(p,{status:`neutral`,className:`a1-rule-demo-tiny-badge`,children:`Draft`})},"badge-stable-height":{do:(0,V.jsxs)(`div`,{style:U.demoRow,children:[(0,V.jsx)(p,{status:`neutral`,children:`Draft`}),(0,V.jsx)(p,{status:`success`,children:`Active`})]}),dont:(0,V.jsxs)(`div`,{style:U.demoRow,children:[(0,V.jsx)(p,{status:`neutral`,children:`Draft`}),(0,V.jsx)(p,{status:`success`,className:`a1-rule-demo-tall-badge`,children:`Active`})]})},"badge-appropriate-density":{do:(0,V.jsx)(p,{status:`neutral`,className:`a1-rule-demo-compact-badge`,children:`New`}),dont:(0,V.jsx)(p,{status:`neutral`,className:`a1-rule-demo-oversized-badge`,children:`New`})},"badge-inline-alignment":{do:(0,V.jsxs)(`div`,{style:U.demoRow,children:[(0,V.jsx)(`span`,{style:U.demoText,children:`Plan`}),(0,V.jsx)(p,{status:`info`,children:`Beta`})]}),dont:(0,V.jsxs)(`div`,{style:{...U.demoRow,justifyContent:`space-between`,width:`100%`},children:[(0,V.jsx)(`span`,{style:U.demoText,children:`Plan`}),(0,V.jsx)(p,{status:`info`,children:`Beta`})]})},"badge-count-formatting":{do:(0,V.jsx)(p,{status:`neutral`,icon:`notifications`,children:`99+`}),dont:(0,V.jsx)(p,{status:`neutral`,icon:`notifications`,children:`123456789`})},"badge-overuse-avoidance":{do:(0,V.jsx)(p,{status:`warn`,children:`Past due`}),dont:(0,V.jsxs)(`div`,{style:U.demoRow,children:[(0,V.jsx)(p,{status:`neutral`,children:`New`}),(0,V.jsx)(p,{status:`info`,children:`Beta`}),(0,V.jsx)(p,{status:`success`,children:`Active`}),(0,V.jsx)(p,{status:`warn`,children:`Soon`})]})},"badge-theme-support":{do:(0,V.jsx)(p,{status:`success`,children:`Theme token`}),dont:(0,V.jsx)(p,{status:`success`,className:`a1-rule-demo-hardcoded-badge`,children:`Hard-coded`})},"badge-truncation-rules":{do:(0,V.jsx)(p,{status:`info`,children:`Optional`}),dont:(0,V.jsx)(p,{status:`info`,children:`Optional for enterprise administrators only`})},"badge-localization-support":{do:(0,V.jsx)(p,{status:`info`,children:`In review`}),dont:(0,V.jsx)(p,{status:`info`,className:`a1-rule-demo-fixed-badge`,children:`Ausstehende Genehmigung`})},"badge-screen-reader-meaning":{do:(0,V.jsx)(p,{status:`error`,children:`Payment failed`}),dont:(0,V.jsx)(p,{status:`error`,"aria-label":`Red status`,children:`!`})}}[e.id];return t?(0,V.jsxs)(`div`,{style:U.examples,children:[(0,V.jsx)(`style`,{children:`
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
        `}),(0,V.jsxs)(`div`,{style:U.example,children:[(0,V.jsx)(P,{type:`do`}),t.do]}),(0,V.jsxs)(`div`,{style:U.example,children:[(0,V.jsx)(P,{type:`dont`}),t.dont]})]}):null}function L({rule:e}){let t={"button-clear-action-label":{do:(0,V.jsx)(s,{children:`Save changes`}),dont:(0,V.jsx)(s,{children:`Submit`})},"button-visual-hierarchy":{do:(0,V.jsxs)(`div`,{style:U.demoRow,children:[(0,V.jsx)(s,{children:`Save changes`}),(0,V.jsx)(s,{variant:`secondary`,children:`Preview`}),(0,V.jsx)(s,{variant:`tertiary`,children:`Cancel`})]}),dont:(0,V.jsxs)(`div`,{style:U.demoRow,children:[(0,V.jsx)(s,{children:`Save`}),(0,V.jsx)(s,{children:`Preview`}),(0,V.jsx)(s,{children:`Cancel`})]})},"button-single-primary-action":{do:(0,V.jsxs)(`div`,{style:U.demoRow,children:[(0,V.jsx)(s,{children:`Publish`}),(0,V.jsx)(s,{variant:`secondary`,children:`Save draft`}),(0,V.jsx)(s,{variant:`tertiary`,children:`Cancel`})]}),dont:(0,V.jsxs)(`div`,{style:U.demoRow,children:[(0,V.jsx)(s,{children:`Publish`}),(0,V.jsx)(s,{children:`Save draft`}),(0,V.jsx)(s,{children:`Schedule`})]})},"button-not-color-alone":{do:(0,V.jsx)(s,{variant:`destructive`,icon:`delete`,children:`Delete project`}),dont:(0,V.jsx)(s,{className:`a1-rule-demo-red-only`,children:`Project`})},"button-destructive-clarity":{do:(0,V.jsx)(s,{variant:`destructive`,icon:`delete`,children:`Delete project`}),dont:(0,V.jsx)(s,{variant:`destructive`,children:`Confirm`})},"button-appropriate-visual-weight":{do:(0,V.jsxs)(`div`,{style:U.demoRow,children:[(0,V.jsx)(s,{children:`Invite member`}),(0,V.jsx)(s,{variant:`tertiary`,children:`Remove member`})]}),dont:(0,V.jsxs)(`div`,{style:U.demoRow,children:[(0,V.jsx)(s,{children:`Remove member`}),(0,V.jsx)(s,{variant:`secondary`,children:`Invite member`})]})},"button-short-specific-labels":{do:(0,V.jsx)(s,{children:`Download report`}),dont:(0,V.jsx)(s,{children:`Click here to download the full monthly performance report`})},"button-verb-first-labels":{do:(0,V.jsx)(s,{children:`Edit profile`}),dont:(0,V.jsx)(s,{children:`Profile`})},"button-icon-and-verb":{do:(0,V.jsx)(s,{variant:`tertiary`,icon:`settings`,children:`Edit settings`}),dont:(0,V.jsx)(s,{variant:`tertiary`,children:`Edit settings`})},"button-consistent-placement":{do:(0,V.jsxs)(`div`,{style:U.demoColumn,children:[(0,V.jsxs)(`div`,{style:U.demoRow,children:[(0,V.jsx)(s,{variant:`tertiary`,children:`Cancel`}),(0,V.jsx)(s,{children:`Save changes`})]}),(0,V.jsxs)(`div`,{style:U.demoRow,children:[(0,V.jsx)(s,{variant:`tertiary`,children:`Cancel`}),(0,V.jsx)(s,{children:`Create account`})]})]}),dont:(0,V.jsxs)(`div`,{style:U.demoColumn,children:[(0,V.jsxs)(`div`,{style:U.demoRow,children:[(0,V.jsx)(s,{variant:`tertiary`,children:`Cancel`}),(0,V.jsx)(s,{children:`Save changes`})]}),(0,V.jsxs)(`div`,{style:U.demoRow,children:[(0,V.jsx)(s,{children:`Create account`}),(0,V.jsx)(s,{variant:`tertiary`,children:`Cancel`})]})]})},"button-align-with-content":{do:(0,V.jsxs)(`div`,{style:U.demoColumn,children:[(0,V.jsx)(`p`,{style:U.demoText,children:`Project details`}),(0,V.jsx)(s,{children:`Edit project`})]}),dont:(0,V.jsxs)(`div`,{style:{...U.demoRail,display:`flex`,flexDirection:`column`,alignItems:`center`,gap:`var(--base-spacing-8)`},children:[(0,V.jsx)(`p`,{style:{...U.demoText,alignSelf:`stretch`},children:`Project details`}),(0,V.jsx)(s,{children:`Edit project`})]})},"button-center-alignment-context":{do:(0,V.jsxs)(`div`,{style:{...U.demoColumn,alignItems:`center`,textAlign:`center`},children:[(0,V.jsx)(`p`,{style:U.demoText,children:`No reports yet`}),(0,V.jsx)(s,{children:`Create report`})]}),dont:(0,V.jsxs)(`div`,{style:U.demoColumn,children:[(0,V.jsx)(`p`,{style:U.demoText,children:`Reports`}),(0,V.jsx)(`div`,{style:{...U.demoRail,display:`flex`,justifyContent:`center`},children:(0,V.jsx)(s,{children:`Create report`})})]})},"button-right-alignment-contained":{do:(0,V.jsx)(`div`,{style:{...U.demoRail,display:`flex`,justifyContent:`flex-end`},children:(0,V.jsx)(s,{children:`Save changes`})}),dont:(0,V.jsx)(`div`,{style:{width:`100%`,display:`flex`,justifyContent:`flex-end`,paddingTop:`var(--base-spacing-24)`},children:(0,V.jsx)(s,{children:`Save changes`})})},"button-touch-target-size":{do:(0,V.jsx)(a,{icon:`edit`,label:`Edit item`}),dont:(0,V.jsx)(s,{className:`a1-rule-demo-small-button`,icon:`edit`,"aria-label":`Edit item`})},"button-clear-states":{do:(0,V.jsxs)(`div`,{style:U.demoRow,children:[(0,V.jsx)(s,{children:`Default`}),(0,V.jsx)(s,{className:`a1-rule-demo-focus`,children:`Focus`}),(0,V.jsx)(s,{disabled:!0,children:`Disabled`}),(0,V.jsx)(s,{icon:`sync`,children:`Saving...`})]}),dont:(0,V.jsx)(s,{className:`a1-rule-demo-no-state`,disabled:!0,children:`Save`})},"button-visible-focus":{do:(0,V.jsx)(s,{className:`a1-rule-demo-focus`,children:`Save changes`}),dont:(0,V.jsx)(s,{className:`a1-rule-demo-no-focus`,children:`Save changes`})},"button-disabled-explanation":{do:(0,V.jsxs)(`div`,{style:U.demoColumn,children:[(0,V.jsx)(s,{disabled:!0,children:`Create account`}),(0,V.jsx)(`p`,{style:U.demoText,children:`Add a valid email address to continue.`})]}),dont:(0,V.jsx)(s,{disabled:!0,children:`Create account`})},"button-loading-prevents-duplicates":{do:(0,V.jsx)(s,{disabled:!0,icon:`sync`,children:`Saving...`}),dont:(0,V.jsxs)(`div`,{style:U.demoRow,children:[(0,V.jsx)(s,{children:`Save`}),(0,V.jsx)(s,{children:`Save`})]})},"button-icon-accessible-label":{do:(0,V.jsx)(a,{icon:`close`,label:`Close dialog`}),dont:(0,V.jsx)(s,{icon:`close`,"aria-hidden":`true`})},"button-vs-link-usage":{do:(0,V.jsxs)(`div`,{style:U.demoRow,children:[(0,V.jsx)(s,{children:`Save settings`}),(0,V.jsx)(d,{href:`#`,children:`View documentation`})]}),dont:(0,V.jsx)(s,{as:`a`,href:`#`,children:`Documentation`})},"button-limited-variant-set":{do:(0,V.jsxs)(`div`,{style:U.demoRow,children:[(0,V.jsx)(s,{children:`Primary`}),(0,V.jsx)(s,{variant:`secondary`,children:`Secondary`}),(0,V.jsx)(s,{variant:`tertiary`,children:`Tertiary`})]}),dont:(0,V.jsx)(`div`,{style:U.demoRow,children:(0,V.jsx)(s,{className:`a1-rule-demo-one-off`,children:`Special screen button`})})}}[e.id];return t?(0,V.jsxs)(`div`,{style:U.examples,children:[(0,V.jsx)(`style`,{children:`
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
        `}),(0,V.jsxs)(`div`,{style:U.example,children:[(0,V.jsx)(P,{type:`do`}),t.do]}),(0,V.jsxs)(`div`,{style:U.example,children:[(0,V.jsx)(P,{type:`dont`}),t.dont]})]}):null}function R({rule:e}){let t={"button-clear-action-label":{do:(0,V.jsx)(a,{icon:`delete`,label:`Delete project`}),dont:(0,V.jsx)(a,{icon:`delete`,label:`Delete`})},"button-visual-hierarchy":{do:(0,V.jsxs)(`div`,{style:U.demoRow,children:[(0,V.jsx)(a,{icon:`settings`,label:`Settings`,variant:`secondary`}),(0,V.jsx)(a,{icon:`more_vert`,label:`More options`})]}),dont:(0,V.jsxs)(`div`,{style:U.demoRow,children:[(0,V.jsx)(a,{icon:`settings`,label:`Settings`,variant:`secondary`}),(0,V.jsx)(a,{icon:`delete`,label:`Delete`,variant:`secondary`}),(0,V.jsx)(a,{icon:`more_vert`,label:`More options`,variant:`secondary`})]})},"button-not-color-alone":{do:(0,V.jsx)(a,{icon:`delete`,label:`Delete project`,variant:`destructive`}),dont:(0,V.jsx)(a,{icon:`more_vert`,label:`More options`,variant:`destructive`})},"button-destructive-clarity":{do:(0,V.jsx)(a,{icon:`delete`,label:`Delete project`,variant:`destructive`}),dont:(0,V.jsx)(a,{icon:`delete`,label:`Confirm`,variant:`destructive`})},"button-appropriate-visual-weight":{do:(0,V.jsxs)(`div`,{style:U.demoRow,children:[(0,V.jsx)(a,{icon:`edit`,label:`Edit item`,variant:`secondary`}),(0,V.jsx)(a,{icon:`delete`,label:`Delete item`})]}),dont:(0,V.jsxs)(`div`,{style:U.demoRow,children:[(0,V.jsx)(a,{icon:`delete`,label:`Delete item`,variant:`secondary`}),(0,V.jsx)(a,{icon:`edit`,label:`Edit item`})]})},"button-short-specific-labels":{do:(0,V.jsx)(a,{icon:`download`,label:`Download report`}),dont:(0,V.jsx)(a,{icon:`download`,label:`Click here to download the full monthly performance report`})},"button-verb-first-labels":{do:(0,V.jsx)(a,{icon:`edit`,label:`Edit profile`}),dont:(0,V.jsx)(a,{icon:`person`,label:`Profile`})},"button-consistent-placement":{do:(0,V.jsxs)(`div`,{style:U.demoColumn,children:[(0,V.jsxs)(`div`,{style:U.demoRow,children:[(0,V.jsx)(a,{icon:`edit`,label:`Edit item`}),(0,V.jsx)(a,{icon:`delete`,label:`Delete item`})]}),(0,V.jsxs)(`div`,{style:U.demoRow,children:[(0,V.jsx)(a,{icon:`edit`,label:`Edit member`}),(0,V.jsx)(a,{icon:`delete`,label:`Delete member`})]})]}),dont:(0,V.jsxs)(`div`,{style:U.demoColumn,children:[(0,V.jsxs)(`div`,{style:U.demoRow,children:[(0,V.jsx)(a,{icon:`edit`,label:`Edit item`}),(0,V.jsx)(a,{icon:`delete`,label:`Delete item`})]}),(0,V.jsxs)(`div`,{style:U.demoRow,children:[(0,V.jsx)(a,{icon:`delete`,label:`Delete member`}),(0,V.jsx)(a,{icon:`edit`,label:`Edit member`})]})]})},"button-align-with-content":{do:(0,V.jsxs)(`div`,{style:U.demoColumn,children:[(0,V.jsx)(`p`,{style:U.demoText,children:`Project details`}),(0,V.jsx)(a,{icon:`edit`,label:`Edit project`})]}),dont:(0,V.jsxs)(`div`,{style:{...U.demoRail,display:`flex`,flexDirection:`column`,alignItems:`center`,gap:`var(--base-spacing-8)`},children:[(0,V.jsx)(`p`,{style:{...U.demoText,alignSelf:`stretch`},children:`Project details`}),(0,V.jsx)(a,{icon:`edit`,label:`Edit project`})]})},"button-center-alignment-context":{do:(0,V.jsxs)(`div`,{style:{...U.demoColumn,alignItems:`center`,textAlign:`center`},children:[(0,V.jsx)(`p`,{style:U.demoText,children:`No reports yet`}),(0,V.jsx)(a,{icon:`add`,label:`Create report`,variant:`secondary`})]}),dont:(0,V.jsxs)(`div`,{style:U.demoColumn,children:[(0,V.jsx)(`p`,{style:U.demoText,children:`Reports`}),(0,V.jsx)(`div`,{style:{...U.demoRail,display:`flex`,justifyContent:`center`},children:(0,V.jsx)(a,{icon:`add`,label:`Create report`,variant:`secondary`})})]})},"button-right-alignment-contained":{do:(0,V.jsx)(`div`,{style:{...U.demoRail,display:`flex`,justifyContent:`flex-end`},children:(0,V.jsx)(a,{icon:`save`,label:`Save changes`,variant:`secondary`})}),dont:(0,V.jsx)(`div`,{style:{width:`100%`,display:`flex`,justifyContent:`flex-end`,paddingTop:`var(--base-spacing-24)`},children:(0,V.jsx)(a,{icon:`save`,label:`Save changes`,variant:`secondary`})})},"button-touch-target-size":{do:(0,V.jsx)(a,{icon:`edit`,label:`Edit item`}),dont:(0,V.jsx)(a,{icon:`edit`,label:`Edit item`,className:`a1-rule-demo-small-icon-button`})},"button-clear-states":{do:(0,V.jsxs)(`div`,{style:U.demoRow,children:[(0,V.jsx)(a,{icon:`edit`,label:`Edit item`}),(0,V.jsx)(a,{icon:`edit`,label:`Focused edit item`,className:`a1-rule-demo-icon-focus`}),(0,V.jsx)(a,{icon:`edit`,label:`Edit item unavailable`,disabled:!0})]}),dont:(0,V.jsx)(a,{icon:`edit`,label:`Edit item unavailable`,disabled:!0,className:`a1-rule-demo-icon-no-state`})},"button-visible-focus":{do:(0,V.jsx)(a,{icon:`edit`,label:`Edit item`,className:`a1-rule-demo-icon-focus`}),dont:(0,V.jsx)(a,{icon:`edit`,label:`Edit item`,className:`a1-rule-demo-icon-no-focus`})},"button-disabled-explanation":{do:(0,V.jsxs)(`div`,{style:U.demoColumn,children:[(0,V.jsx)(a,{icon:`send`,label:`Send invitation`,disabled:!0}),(0,V.jsx)(`p`,{style:U.demoText,children:`Add an email address to send an invitation.`})]}),dont:(0,V.jsx)(a,{icon:`send`,label:`Send invitation`,disabled:!0})},"button-loading-prevents-duplicates":{do:(0,V.jsx)(a,{icon:`sync`,label:`Saving changes`,disabled:!0}),dont:(0,V.jsxs)(`div`,{style:U.demoRow,children:[(0,V.jsx)(a,{icon:`save`,label:`Save changes`}),(0,V.jsx)(a,{icon:`save`,label:`Save changes`})]})},"button-icon-accessible-label":{do:(0,V.jsx)(a,{icon:`close`,label:`Close dialog`}),dont:(0,V.jsx)(`button`,{className:`a1-icon-button a1-icon-button--tertiary`,type:`button`,children:(0,V.jsx)(`span`,{className:`material-symbols-outlined`,children:`close`})})},"button-vs-link-usage":{do:(0,V.jsxs)(`div`,{style:U.demoRow,children:[(0,V.jsx)(a,{icon:`settings`,label:`Open settings`}),(0,V.jsx)(d,{href:`#`,icon:`open_in_new`,iconPosition:`end`,children:`Docs`})]}),dont:(0,V.jsx)(`a`,{className:`a1-icon-button a1-icon-button--tertiary`,href:`#`,children:(0,V.jsx)(`span`,{className:`material-symbols-outlined`,children:`docs`})})},"button-limited-variant-set":{do:(0,V.jsxs)(`div`,{style:U.demoRow,children:[(0,V.jsx)(a,{icon:`settings`,label:`Settings`}),(0,V.jsx)(a,{icon:`settings`,label:`Settings`,variant:`secondary`})]}),dont:(0,V.jsx)(a,{icon:`settings`,label:`Settings`,className:`a1-rule-demo-one-off-icon-button`})}}[e.id];return t?(0,V.jsxs)(`div`,{style:U.examples,children:[(0,V.jsx)(`style`,{children:`
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
        `}),(0,V.jsxs)(`div`,{style:U.example,children:[(0,V.jsx)(P,{type:`do`}),t.do]}),(0,V.jsxs)(`div`,{style:U.example,children:[(0,V.jsx)(P,{type:`dont`}),t.dont]})]}):null}function z({componentName:e,title:t,source:n}){let[r,i]=(0,B.useState)(`all`),a=W[e]??[],o=Array.from(new Set(a.flatMap(e=>e.applies_to??[]))).sort(),s=o.reduce((e,t)=>(e[t]=a.filter(e=>e.applies_to?.includes(t)).length,e),{}),c=r===`all`?a:a.filter(e=>e.applies_to?.includes(r));return(0,V.jsxs)(`div`,{style:U.page,children:[(0,V.jsxs)(`section`,{style:U.intro,children:[(0,V.jsx)(l,{as:`h1`,type:`display`,size:`xl`,children:t}),(0,V.jsxs)(h,{color:`muted`,children:[`Component rules from `,n,`. Rules can still identify multiple components when a rule spans them.`]})]}),(0,V.jsxs)(`section`,{style:U.group,children:[(0,V.jsxs)(`div`,{style:U.filter,"aria-label":`${t} tag filter`,children:[(0,V.jsx)(h,{size:`sm`,color:`muted`,children:`Filter by tag`}),(0,V.jsx)(`div`,{style:U.filterList,children:[`all`,...o].map(e=>{let t=r===e;return(0,V.jsx)(`button`,{type:`button`,style:{...U.filterButton,...t?U.filterButtonActive:{}},"aria-pressed":t,onClick:()=>i(e),children:e===`all`?`All (${a.length})`:`${e} (${s[e]})`},e)})})]}),(0,V.jsxs)(`div`,{style:U.ruleList,children:[c.map(t=>(0,V.jsxs)(`article`,{style:U.rule,children:[(0,V.jsx)(l,{as:`h2`,size:`xs`,children:t.id}),(0,V.jsx)(h,{children:t.requirement}),(0,V.jsx)(N,{rule:t,componentName:e}),(0,V.jsxs)(`div`,{style:U.meta,children:[t.components.length>1&&(0,V.jsxs)(`span`,{style:U.tag,children:[`components: `,t.components.join(`, `)]}),t.applies_to?.map(e=>(0,V.jsx)(`span`,{style:U.tag,children:e},e))]})]},`${t.filePath}-${t.id}`)),c.length===0&&(0,V.jsx)(h,{color:`muted`,children:`No rules match this tag.`})]})]})]})}var B,V,H,U,W,G,K,q,J,Y,X,Z;e((()=>{_(),y(),x(),C(),T(),D(),B=t(n(),1),o(),c(),i(),u(),f(),m(),V=r(),H=Object.assign({"../../../../system/rules/button.yaml":g,"../../../../system/rules/message-badge.yaml":v,"../../../../system/rules/motion.yaml":b,"../../../../system/rules/page-layout.yaml":S,"../../../../system/rules/side-nav.yaml":w,"../../../../system/rules/system.yaml":E}),U={page:{width:`min(960px, calc(100vw - 48px))`,display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-32)`},intro:{maxWidth:`680px`,display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-8)`},group:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-16)`},ruleList:{display:`grid`,gap:`var(--base-spacing-12)`},filter:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-8)`},filterList:{display:`flex`,flexWrap:`wrap`,gap:`var(--base-spacing-8)`},filterButton:{appearance:`none`,border:`1px solid var(--semantic-color-border-subtle)`,borderRadius:`var(--base-radius-control)`,background:`var(--semantic-color-surface-page)`,color:`var(--semantic-color-text-muted)`,cursor:`pointer`,fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-sm)`,padding:`var(--base-spacing-4) var(--base-spacing-8)`},filterButtonActive:{background:`var(--semantic-color-action-background)`,borderColor:`var(--semantic-color-action-background)`,color:`var(--semantic-color-action-foreground)`},rule:{padding:`var(--base-spacing-20)`,border:`1px solid var(--semantic-color-border-subtle)`,borderRadius:`var(--base-radius-control)`,background:`var(--semantic-color-surface-panel)`},meta:{display:`flex`,flexWrap:`wrap`,gap:`var(--base-spacing-8)`,marginTop:`var(--base-spacing-12)`},examples:{display:`grid`,gridTemplateColumns:`repeat(2, minmax(0, 1fr))`,gap:`var(--base-spacing-12)`,marginTop:`var(--base-spacing-16)`},example:{minWidth:0,padding:`var(--base-spacing-12)`,border:`1px solid var(--semantic-color-border-subtle)`,borderRadius:`var(--base-radius-control)`,background:`var(--semantic-color-surface-page)`},exampleLabelWrap:{display:`flex`,marginBottom:`var(--base-spacing-8)`},demoRow:{display:`flex`,alignItems:`center`,gap:`var(--base-spacing-8)`,flexWrap:`wrap`},demoColumn:{display:`flex`,flexDirection:`column`,alignItems:`flex-start`,gap:`var(--base-spacing-8)`},demoText:{margin:0,color:`var(--semantic-color-text-muted)`,fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-sm)`},demoRail:{boxSizing:`border-box`,width:`100%`,padding:`var(--base-spacing-8)`,border:`1px dashed var(--semantic-color-border-default)`,borderRadius:`var(--base-radius-control)`},tag:{padding:`var(--base-spacing-4) var(--base-spacing-8)`,borderRadius:`var(--base-radius-control)`,background:`var(--semantic-color-surface-page)`,color:`var(--semantic-color-text-muted)`,fontFamily:`monospace`,fontSize:`var(--semantic-font-size-body-xs)`}},W=M(Object.entries(H).map(([e,t])=>O(t,e))),G={title:`Rules`,parameters:{layout:`centered`,controls:{disable:!0}}},K={name:`Badge`,render:()=>(0,V.jsx)(z,{componentName:`Badge`,title:`Badge Rules`,source:`system/rules/message-badge.yaml`})},q={name:`System`,render:()=>(0,V.jsx)(z,{componentName:`System`,title:`System Rules`,source:`system/rules/system.yaml`})},J={name:`Heading`,render:()=>(0,V.jsx)(z,{componentName:`Heading`,title:`Heading Rules`,source:`system/rules/system.yaml`})},Y={name:`Icon Button`,render:()=>(0,V.jsx)(z,{componentName:`IconButton`,title:`Icon Button Rules`,source:`system/rules/button.yaml`})},X={name:`Button`,render:()=>(0,V.jsx)(z,{componentName:`Button`,title:`Button Rules`,source:`system/rules/button.yaml`})},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  name: "Badge",
  render: () => <ComponentRulesPage componentName="Badge" title="Badge Rules" source="system/rules/message-badge.yaml" />
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  name: "System",
  render: () => <ComponentRulesPage componentName="System" title="System Rules" source="system/rules/system.yaml" />
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  name: "Heading",
  render: () => <ComponentRulesPage componentName="Heading" title="Heading Rules" source="system/rules/system.yaml" />
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  name: "Icon Button",
  render: () => <ComponentRulesPage componentName="IconButton" title="Icon Button Rules" source="system/rules/button.yaml" />
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  name: "Button",
  render: () => <ComponentRulesPage componentName="Button" title="Button Rules" source="system/rules/button.yaml" />
}`,...X.parameters?.docs?.source}}},Z=[`Badge`,`SystemRules`,`HeadingRules`,`IconButtonRules`,`ButtonRules`]}))();export{K as Badge,X as ButtonRules,J as HeadingRules,Y as IconButtonRules,q as SystemRules,Z as __namedExportsOrder,G as default};