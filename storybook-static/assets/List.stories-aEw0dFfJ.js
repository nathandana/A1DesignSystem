import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./iframe-D8uQ9hre.js";import{n,t as r}from"./Inverse-BUtc9lwX.js";import{n as i,r as a,t as o}from"./List-DBAevyBu.js";var s,c,l,u,d,f,p,m,h,g,_,v,y,b,x;e((()=>{a(),n(),s=t(),c={title:`Components/Typography/List`,component:o,tags:[`autodocs`],args:{size:`md`,color:`default`},argTypes:{as:{control:`inline-radio`,options:[`ul`,`ol`]},size:{control:`inline-radio`,options:[`xs`,`sm`,`md`,`lg`,`xl`]},color:{control:`inline-radio`,options:[`default`,`muted`]},variant:{control:`inline-radio`,options:[`unordered`,`ordered`,`icon`,`divider`],description:`List style variant — 'divider' renders items separated by horizontal rules with no bullet`},icon:{control:`text`,description:`Material Symbol name — switches to icon variant when set`}}},l=[`Design tokens ensure visual consistency.`,`Semantic color roles adapt to light and dark mode.`,`All components meet WCAG 2.1 AA contrast requirements.`],u=[`Design tokens form the shared language between designers and engineers — every color, spacing value, radius, and motion duration is a named contract that any theme can override without touching component code.`,`Semantic color roles like surface-page, text-default, and border-subtle automatically resolve to the correct value in light mode, dark mode, and any custom theme, so components never need to know which context they're in.`,`All interactive components are keyboard-navigable and include visible focus indicators that meet WCAG 2.1 AA requirements across every color theme, including the high-contrast accessible theme.`,`Motion primitives respect the prefers-reduced-motion media query by collapsing duration tokens to 0ms, so users who are sensitive to animation get instant state changes without any special component logic.`],d={render:e=>(0,s.jsx)(o,{...e,children:l.map(e=>(0,s.jsx)(i,{children:e},e))})},f={render:()=>(0,s.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`32px`,maxWidth:`600px`},children:[`xs`,`sm`,`md`,`lg`,`xl`].map(e=>(0,s.jsxs)(`div`,{style:{display:`flex`,alignItems:`flex-start`,gap:`16px`},children:[(0,s.jsx)(`span`,{style:{width:`28px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`,flexShrink:0,paddingTop:`2px`},children:e}),(0,s.jsx)(o,{size:e,children:l.map(e=>(0,s.jsx)(i,{children:e},e))})]},e))})},p={name:`Divider Variant`,render:()=>(0,s.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`32px`,maxWidth:`400px`},children:[`xs`,`sm`,`md`,`lg`,`xl`].map(e=>(0,s.jsxs)(`div`,{style:{display:`flex`,alignItems:`flex-start`,gap:`16px`},children:[(0,s.jsx)(`span`,{style:{width:`28px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`,flexShrink:0,paddingTop:`8px`},children:e}),(0,s.jsx)(o,{variant:`divider`,size:e,style:{flex:1},children:l.map(e=>(0,s.jsx)(i,{children:e},e))})]},e))})},m={render:()=>(0,s.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`32px`,maxWidth:`600px`},children:[`xs`,`sm`,`md`,`lg`,`xl`].map(e=>(0,s.jsxs)(`div`,{style:{display:`flex`,alignItems:`flex-start`,gap:`16px`},children:[(0,s.jsx)(`span`,{style:{width:`28px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`,flexShrink:0,paddingTop:`2px`},children:e}),(0,s.jsx)(o,{as:`ol`,size:e,children:l.map(e=>(0,s.jsx)(i,{children:e},e))})]},e))})},h={render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`40px`,maxWidth:`600px`},children:[(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`p`,{style:{margin:`0 0 12px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`},children:`check_circle — feature list`}),(0,s.jsxs)(o,{icon:`check_circle`,children:[(0,s.jsx)(i,{children:`Unlimited design tokens with full theme support`}),(0,s.jsx)(i,{children:`Dark mode out of the box, driven by semantic tokens`}),(0,s.jsx)(i,{children:`Accessible components tested against WCAG 2.1 AA`}),(0,s.jsx)(i,{children:`Motion primitives that respect reduced-motion preferences`})]})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`p`,{style:{margin:`0 0 12px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`},children:`Size scale with check icon`}),(0,s.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`24px`},children:[`xs`,`sm`,`md`,`lg`,`xl`].map(e=>(0,s.jsxs)(`div`,{style:{display:`flex`,alignItems:`flex-start`,gap:`16px`},children:[(0,s.jsx)(`span`,{style:{width:`28px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`,flexShrink:0,paddingTop:`2px`},children:e}),(0,s.jsxs)(o,{icon:`check`,size:e,children:[(0,s.jsx)(i,{children:`Design tokens ensure visual consistency.`}),(0,s.jsx)(i,{children:`Dark mode adapts automatically.`})]})]},e))})]})]})},g={render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`40px`,maxWidth:`520px`},children:[(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`p`,{style:{margin:`0 0 12px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`},children:`Unordered — long items`}),(0,s.jsx)(o,{children:u.map(e=>(0,s.jsx)(i,{children:e},e))})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`p`,{style:{margin:`0 0 12px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`},children:`Ordered — long items`}),(0,s.jsx)(o,{as:`ol`,children:u.map(e=>(0,s.jsx)(i,{children:e},e))})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`p`,{style:{margin:`0 0 12px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`},children:`Icon — long items`}),(0,s.jsx)(o,{icon:`check_circle`,children:u.map(e=>(0,s.jsx)(i,{children:e},e))})]})]})},_={render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`48px`,maxWidth:`560px`},children:[(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`p`,{style:{margin:`0 0 12px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`},children:`Unordered — 4 levels (disc → circle → square → bordered square)`}),(0,s.jsxs)(o,{children:[(0,s.jsxs)(i,{children:[`Design system layers`,(0,s.jsxs)(o,{size:`sm`,children:[(0,s.jsxs)(i,{children:[`Tokens`,(0,s.jsxs)(o,{size:`sm`,children:[(0,s.jsxs)(i,{children:[`Base tokens`,(0,s.jsxs)(o,{size:`sm`,children:[(0,s.jsx)(i,{children:`color-blue-500`}),(0,s.jsx)(i,{children:`spacing-4`}),(0,s.jsx)(i,{children:`radius-md`})]})]}),(0,s.jsx)(i,{children:`Semantic tokens`}),(0,s.jsx)(i,{children:`Component tokens`})]})]}),(0,s.jsx)(i,{children:`Components`}),(0,s.jsx)(i,{children:`Themes`})]})]}),(0,s.jsx)(i,{children:`Documentation`})]})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`p`,{style:{margin:`0 0 12px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`},children:`Ordered → ordered (2 levels)`}),(0,s.jsxs)(o,{as:`ol`,children:[(0,s.jsxs)(i,{children:[`Install the package`,(0,s.jsxs)(o,{as:`ol`,size:`sm`,children:[(0,s.jsxs)(i,{children:[`Run `,(0,s.jsx)(`code`,{children:`npm install @a1/react`})]}),(0,s.jsx)(i,{children:`Import the tokens CSS into your app entry point`}),(0,s.jsx)(i,{children:`Wrap your root with a theme provider if needed`})]})]}),(0,s.jsxs)(i,{children:[`Configure your theme`,(0,s.jsxs)(o,{as:`ol`,size:`sm`,children:[(0,s.jsx)(i,{children:`Copy the base theme JSON as a starting point`}),(0,s.jsx)(i,{children:`Override semantic tokens to match your brand`})]})]}),(0,s.jsx)(i,{children:`Use components directly — no additional setup required`})]})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`p`,{style:{margin:`0 0 12px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`},children:`Ordered → unordered (2 levels)`}),(0,s.jsxs)(o,{as:`ol`,children:[(0,s.jsxs)(i,{children:[`Choose a variant`,(0,s.jsxs)(o,{size:`sm`,children:[(0,s.jsx)(i,{children:`Unordered for non-sequential content`}),(0,s.jsx)(i,{children:`Ordered for steps and ranked items`}),(0,s.jsx)(i,{children:`Icon for feature lists and status items`})]})]}),(0,s.jsxs)(i,{children:[`Pick a size to match surrounding body text`,(0,s.jsxs)(o,{size:`sm`,children:[(0,s.jsx)(i,{children:`xs and sm for compact UIs and sidebars`}),(0,s.jsx)(i,{children:`md for standard body copy contexts`}),(0,s.jsx)(i,{children:`lg and xl for editorial and marketing layouts`})]})]}),(0,s.jsx)(i,{children:`Nest sparingly — two levels is the practical maximum`})]})]})]})},v={render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`48px`,maxWidth:`560px`},children:[(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`p`,{style:{margin:`0 0 12px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`},children:`Per-item icon override — status list`}),(0,s.jsxs)(o,{icon:`check_circle`,children:[(0,s.jsx)(i,{children:`All semantic color tokens defined`}),(0,s.jsx)(i,{children:`Dark mode verified on every component`}),(0,s.jsx)(i,{icon:`warning`,children:`Motion audit incomplete — SideNav needs review`}),(0,s.jsx)(i,{icon:`cancel`,children:`Figma Code Connect not yet configured`}),(0,s.jsx)(i,{icon:`radio_button_unchecked`,children:`Accessibility testing in progress`})]})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`p`,{style:{margin:`0 0 12px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`},children:`Icon list → unordered sub-list`}),(0,s.jsxs)(o,{icon:`folder`,children:[(0,s.jsxs)(i,{children:[`Tokens`,(0,s.jsxs)(o,{size:`sm`,children:[(0,s.jsx)(i,{children:`base/color-ramp.json`}),(0,s.jsx)(i,{children:`base/spacing.json`}),(0,s.jsx)(i,{children:`semantic/motion.json`})]})]}),(0,s.jsxs)(i,{children:[`Components`,(0,s.jsxs)(o,{size:`sm`,children:[(0,s.jsx)(i,{children:`button/button.css`}),(0,s.jsx)(i,{children:`list/list.css`}),(0,s.jsx)(i,{children:`side-nav/side-nav.css`})]})]}),(0,s.jsxs)(i,{children:[`Themes`,(0,s.jsxs)(o,{size:`sm`,children:[(0,s.jsx)(i,{children:`a1-light/theme.json`}),(0,s.jsx)(i,{children:`heritage/theme.json`}),(0,s.jsx)(i,{children:`accessible/theme.json`})]})]})]})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`p`,{style:{margin:`0 0 12px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`},children:`Unordered → icon sub-list`}),(0,s.jsxs)(o,{children:[(0,s.jsxs)(i,{children:[`Bundled primitives`,(0,s.jsxs)(o,{icon:`check`,size:`sm`,children:[(0,s.jsx)(i,{children:`Spacing scale (1–128px)`}),(0,s.jsx)(i,{children:`Type scale (xs–xl body, heading, display)`}),(0,s.jsx)(i,{children:`Motion duration and easing tokens`}),(0,s.jsx)(i,{children:`Semantic shadow tokens`})]})]}),(0,s.jsxs)(i,{children:[`Not included by default`,(0,s.jsxs)(o,{icon:`close`,size:`sm`,children:[(0,s.jsx)(i,{children:`Custom illustration assets`}),(0,s.jsx)(i,{children:`Data visualization color scales`})]})]})]})]})]})},y={render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`40px`,maxWidth:`560px`},children:[(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`p`,{style:{margin:`0 0 12px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`},children:`Bold, italic, and inline code`}),(0,s.jsxs)(o,{children:[(0,s.jsxs)(i,{children:[`Use `,(0,s.jsx)(`strong`,{children:`semantic color tokens`}),` — never hardcode hex values in components.`]}),(0,s.jsxs)(i,{children:[`Wrap the app root with `,(0,s.jsx)(`code`,{children:`<ThemeProvider>`}),` to enable theme switching at runtime.`]}),(0,s.jsxs)(i,{children:[`Motion durations are defined as `,(0,s.jsx)(`em`,{children:`named scale steps`}),`, not raw millisecond values.`]}),(0,s.jsxs)(i,{children:[(0,s.jsx)(`strong`,{children:`Dark mode`}),` is handled automatically via `,(0,s.jsx)(`code`,{children:`prefers-color-scheme`}),` — no extra logic needed.`]}),(0,s.jsxs)(i,{children:[`The `,(0,s.jsx)(`em`,{children:`expressive`}),` easing curve is `,(0,s.jsx)(`strong`,{children:`reserved for infrequent, high-delight moments`}),` only.`]})]})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`p`,{style:{margin:`0 0 12px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`},children:`Ordered with inline formatting`}),(0,s.jsxs)(o,{as:`ol`,children:[(0,s.jsxs)(i,{children:[`Run `,(0,s.jsx)(`code`,{children:`npm install @a1/react`}),` to add the package.`]}),(0,s.jsxs)(i,{children:[`Import `,(0,s.jsx)(`code`,{children:`tokens.css`}),` at your `,(0,s.jsx)(`strong`,{children:`app entry point`}),` — this must come before any component styles.`]}),(0,s.jsxs)(i,{children:[`Use `,(0,s.jsx)(`em`,{children:`semantic tokens`}),` like `,(0,s.jsx)(`code`,{children:`--semantic-color-text-default`}),` rather than base tokens in component CSS.`]}),(0,s.jsxs)(i,{children:[`Override `,(0,s.jsx)(`strong`,{children:`only the tokens you need`}),` — the default theme covers all required values.`]})]})]})]})},b={render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`24px`,maxWidth:`560px`},children:[(0,s.jsx)(o,{color:`default`,children:l.map(e=>(0,s.jsx)(i,{children:e},e))}),(0,s.jsx)(o,{color:`muted`,children:l.map(e=>(0,s.jsx)(i,{children:e},e))}),(0,s.jsx)(r,{style:{padding:`16px`,borderRadius:`8px`},children:(0,s.jsx)(o,{children:l.map(e=>(0,s.jsx)(i,{children:e},e))})})]})},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <List {...args}>
      {SHORT.map(item => <ListItem key={item}>{item}</ListItem>)}
    </List>
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "32px",
    maxWidth: "600px"
  }}>
      {["xs", "sm", "md", "lg", "xl"].map(size => <div key={size} style={{
      display: "flex",
      alignItems: "flex-start",
      gap: "16px"
    }}>
          <span style={{
        width: "28px",
        fontSize: "0.75rem",
        color: "var(--semantic-color-text-muted)",
        flexShrink: 0,
        paddingTop: "2px"
      }}>
            {size}
          </span>
          <List size={size}>
            {SHORT.map(item => <ListItem key={item}>{item}</ListItem>)}
          </List>
        </div>)}
    </div>
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: "Divider Variant",
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "32px",
    maxWidth: "400px"
  }}>
      {["xs", "sm", "md", "lg", "xl"].map(size => <div key={size} style={{
      display: "flex",
      alignItems: "flex-start",
      gap: "16px"
    }}>
          <span style={{
        width: "28px",
        fontSize: "0.75rem",
        color: "var(--semantic-color-text-muted)",
        flexShrink: 0,
        paddingTop: "8px"
      }}>
            {size}
          </span>
          <List variant="divider" size={size} style={{
        flex: 1
      }}>
            {SHORT.map(item => <ListItem key={item}>{item}</ListItem>)}
          </List>
        </div>)}
    </div>
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "32px",
    maxWidth: "600px"
  }}>
      {["xs", "sm", "md", "lg", "xl"].map(size => <div key={size} style={{
      display: "flex",
      alignItems: "flex-start",
      gap: "16px"
    }}>
          <span style={{
        width: "28px",
        fontSize: "0.75rem",
        color: "var(--semantic-color-text-muted)",
        flexShrink: 0,
        paddingTop: "2px"
      }}>
            {size}
          </span>
          <List as="ol" size={size}>
            {SHORT.map(item => <ListItem key={item}>{item}</ListItem>)}
          </List>
        </div>)}
    </div>
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "40px",
    maxWidth: "600px"
  }}>
      <div>
        <p style={{
        margin: "0 0 12px",
        fontSize: "0.75rem",
        color: "var(--semantic-color-text-muted)"
      }}>check_circle — feature list</p>
        <List icon="check_circle">
          <ListItem>Unlimited design tokens with full theme support</ListItem>
          <ListItem>Dark mode out of the box, driven by semantic tokens</ListItem>
          <ListItem>Accessible components tested against WCAG 2.1 AA</ListItem>
          <ListItem>Motion primitives that respect reduced-motion preferences</ListItem>
        </List>
      </div>

      <div>
        <p style={{
        margin: "0 0 12px",
        fontSize: "0.75rem",
        color: "var(--semantic-color-text-muted)"
      }}>Size scale with check icon</p>
        <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px"
      }}>
          {["xs", "sm", "md", "lg", "xl"].map(size => <div key={size} style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "16px"
        }}>
              <span style={{
            width: "28px",
            fontSize: "0.75rem",
            color: "var(--semantic-color-text-muted)",
            flexShrink: 0,
            paddingTop: "2px"
          }}>
                {size}
              </span>
              <List icon="check" size={size}>
                <ListItem>Design tokens ensure visual consistency.</ListItem>
                <ListItem>Dark mode adapts automatically.</ListItem>
              </List>
            </div>)}
        </div>
      </div>
    </div>
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "40px",
    maxWidth: "520px"
  }}>
      <div>
        <p style={{
        margin: "0 0 12px",
        fontSize: "0.75rem",
        color: "var(--semantic-color-text-muted)"
      }}>Unordered — long items</p>
        <List>
          {LONG.map(item => <ListItem key={item}>{item}</ListItem>)}
        </List>
      </div>

      <div>
        <p style={{
        margin: "0 0 12px",
        fontSize: "0.75rem",
        color: "var(--semantic-color-text-muted)"
      }}>Ordered — long items</p>
        <List as="ol">
          {LONG.map(item => <ListItem key={item}>{item}</ListItem>)}
        </List>
      </div>

      <div>
        <p style={{
        margin: "0 0 12px",
        fontSize: "0.75rem",
        color: "var(--semantic-color-text-muted)"
      }}>Icon — long items</p>
        <List icon="check_circle">
          {LONG.map(item => <ListItem key={item}>{item}</ListItem>)}
        </List>
      </div>
    </div>
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "48px",
    maxWidth: "560px"
  }}>

      <div>
        <p style={{
        margin: "0 0 12px",
        fontSize: "0.75rem",
        color: "var(--semantic-color-text-muted)"
      }}>Unordered — 4 levels (disc → circle → square → bordered square)</p>
        <List>
          <ListItem>
            Design system layers
            <List size="sm">
              <ListItem>
                Tokens
                <List size="sm">
                  <ListItem>
                    Base tokens
                    <List size="sm">
                      <ListItem>color-blue-500</ListItem>
                      <ListItem>spacing-4</ListItem>
                      <ListItem>radius-md</ListItem>
                    </List>
                  </ListItem>
                  <ListItem>Semantic tokens</ListItem>
                  <ListItem>Component tokens</ListItem>
                </List>
              </ListItem>
              <ListItem>Components</ListItem>
              <ListItem>Themes</ListItem>
            </List>
          </ListItem>
          <ListItem>Documentation</ListItem>
        </List>
      </div>

      <div>
        <p style={{
        margin: "0 0 12px",
        fontSize: "0.75rem",
        color: "var(--semantic-color-text-muted)"
      }}>Ordered → ordered (2 levels)</p>
        <List as="ol">
          <ListItem>
            Install the package
            <List as="ol" size="sm">
              <ListItem>Run <code>npm install @a1/react</code></ListItem>
              <ListItem>Import the tokens CSS into your app entry point</ListItem>
              <ListItem>Wrap your root with a theme provider if needed</ListItem>
            </List>
          </ListItem>
          <ListItem>
            Configure your theme
            <List as="ol" size="sm">
              <ListItem>Copy the base theme JSON as a starting point</ListItem>
              <ListItem>Override semantic tokens to match your brand</ListItem>
            </List>
          </ListItem>
          <ListItem>Use components directly — no additional setup required</ListItem>
        </List>
      </div>

      <div>
        <p style={{
        margin: "0 0 12px",
        fontSize: "0.75rem",
        color: "var(--semantic-color-text-muted)"
      }}>Ordered → unordered (2 levels)</p>
        <List as="ol">
          <ListItem>
            Choose a variant
            <List size="sm">
              <ListItem>Unordered for non-sequential content</ListItem>
              <ListItem>Ordered for steps and ranked items</ListItem>
              <ListItem>Icon for feature lists and status items</ListItem>
            </List>
          </ListItem>
          <ListItem>
            Pick a size to match surrounding body text
            <List size="sm">
              <ListItem>xs and sm for compact UIs and sidebars</ListItem>
              <ListItem>md for standard body copy contexts</ListItem>
              <ListItem>lg and xl for editorial and marketing layouts</ListItem>
            </List>
          </ListItem>
          <ListItem>Nest sparingly — two levels is the practical maximum</ListItem>
        </List>
      </div>

    </div>
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "48px",
    maxWidth: "560px"
  }}>

      <div>
        <p style={{
        margin: "0 0 12px",
        fontSize: "0.75rem",
        color: "var(--semantic-color-text-muted)"
      }}>Per-item icon override — status list</p>
        <List icon="check_circle">
          <ListItem>All semantic color tokens defined</ListItem>
          <ListItem>Dark mode verified on every component</ListItem>
          <ListItem icon="warning">Motion audit incomplete — SideNav needs review</ListItem>
          <ListItem icon="cancel">Figma Code Connect not yet configured</ListItem>
          <ListItem icon="radio_button_unchecked">Accessibility testing in progress</ListItem>
        </List>
      </div>

      <div>
        <p style={{
        margin: "0 0 12px",
        fontSize: "0.75rem",
        color: "var(--semantic-color-text-muted)"
      }}>Icon list → unordered sub-list</p>
        <List icon="folder">
          <ListItem>
            Tokens
            <List size="sm">
              <ListItem>base/color-ramp.json</ListItem>
              <ListItem>base/spacing.json</ListItem>
              <ListItem>semantic/motion.json</ListItem>
            </List>
          </ListItem>
          <ListItem>
            Components
            <List size="sm">
              <ListItem>button/button.css</ListItem>
              <ListItem>list/list.css</ListItem>
              <ListItem>side-nav/side-nav.css</ListItem>
            </List>
          </ListItem>
          <ListItem>
            Themes
            <List size="sm">
              <ListItem>a1-light/theme.json</ListItem>
              <ListItem>heritage/theme.json</ListItem>
              <ListItem>accessible/theme.json</ListItem>
            </List>
          </ListItem>
        </List>
      </div>

      <div>
        <p style={{
        margin: "0 0 12px",
        fontSize: "0.75rem",
        color: "var(--semantic-color-text-muted)"
      }}>Unordered → icon sub-list</p>
        <List>
          <ListItem>
            Bundled primitives
            <List icon="check" size="sm">
              <ListItem>Spacing scale (1–128px)</ListItem>
              <ListItem>Type scale (xs–xl body, heading, display)</ListItem>
              <ListItem>Motion duration and easing tokens</ListItem>
              <ListItem>Semantic shadow tokens</ListItem>
            </List>
          </ListItem>
          <ListItem>
            Not included by default
            <List icon="close" size="sm">
              <ListItem>Custom illustration assets</ListItem>
              <ListItem>Data visualization color scales</ListItem>
            </List>
          </ListItem>
        </List>
      </div>

    </div>
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "40px",
    maxWidth: "560px"
  }}>

      <div>
        <p style={{
        margin: "0 0 12px",
        fontSize: "0.75rem",
        color: "var(--semantic-color-text-muted)"
      }}>Bold, italic, and inline code</p>
        <List>
          <ListItem>Use <strong>semantic color tokens</strong> — never hardcode hex values in components.</ListItem>
          <ListItem>Wrap the app root with <code>{"<ThemeProvider>"}</code> to enable theme switching at runtime.</ListItem>
          <ListItem>Motion durations are defined as <em>named scale steps</em>, not raw millisecond values.</ListItem>
          <ListItem><strong>Dark mode</strong> is handled automatically via <code>prefers-color-scheme</code> — no extra logic needed.</ListItem>
          <ListItem>The <em>expressive</em> easing curve is <strong>reserved for infrequent, high-delight moments</strong> only.</ListItem>
        </List>
      </div>

      <div>
        <p style={{
        margin: "0 0 12px",
        fontSize: "0.75rem",
        color: "var(--semantic-color-text-muted)"
      }}>Ordered with inline formatting</p>
        <List as="ol">
          <ListItem>Run <code>npm install @a1/react</code> to add the package.</ListItem>
          <ListItem>Import <code>tokens.css</code> at your <strong>app entry point</strong> — this must come before any component styles.</ListItem>
          <ListItem>Use <em>semantic tokens</em> like <code>--semantic-color-text-default</code> rather than base tokens in component CSS.</ListItem>
          <ListItem>Override <strong>only the tokens you need</strong> — the default theme covers all required values.</ListItem>
        </List>
      </div>

    </div>
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    maxWidth: "560px"
  }}>
      <List color="default">
        {SHORT.map(item => <ListItem key={item}>{item}</ListItem>)}
      </List>

      <List color="muted">
        {SHORT.map(item => <ListItem key={item}>{item}</ListItem>)}
      </List>

      <Inverse style={{
      padding: "16px",
      borderRadius: "8px"
    }}>
        <List>
          {SHORT.map(item => <ListItem key={item}>{item}</ListItem>)}
        </List>
      </Inverse>
    </div>
}`,...b.parameters?.docs?.source}}},x=[`Configurable`,`SizeScale`,`DividerVariant`,`Ordered`,`IconVariant`,`Wrapping`,`Nested`,`Mixed`,`Formatting`,`Colors`]}))();export{b as Colors,d as Configurable,p as DividerVariant,y as Formatting,h as IconVariant,v as Mixed,_ as Nested,m as Ordered,f as SizeScale,g as Wrapping,x as __namedExportsOrder,c as default};