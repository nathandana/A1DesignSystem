import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{C as n,t as r}from"./iframe-BwSdWSBC.js";import{n as i,t as a}from"./Icon-XRhQqhD4.js";import{n as o,t as s}from"./Inverse-LRal80BC.js";var c=e((()=>{}));function l({as:e=`ul`,size:t=`md`,color:n=`default`,icon:r=null,className:i=``,...a}){let o=p.includes(t)?t:`md`,s=m.includes(n)?n:`default`,c=e===`ol`?`ordered`:r==null?`unordered`:`icon`,l=[`a1-list`,`a1-list--${o}`,`a1-list--${c}`,s!==`default`&&`a1-list--${s}`,i].filter(Boolean).join(` `);return(0,f.jsx)(h.Provider,{value:{icon:r,as:e},children:(0,f.jsx)(e,{className:l,...a})})}function u({icon:e,className:t=``,children:n,...r}){let{icon:i}=(0,d.useContext)(h),o=e===void 0?i:e;return(0,f.jsxs)(`li`,{className:[`a1-list-item`,t].filter(Boolean).join(` `),...r,children:[o==null?(0,f.jsx)(`span`,{className:`a1-list-item__marker`,"aria-hidden":`true`}):(0,f.jsx)(a,{name:o,className:`a1-list-item__marker`}),(0,f.jsx)(`span`,{className:`a1-list-item__content`,children:n})]})}var d,f,p,m,h,g=e((()=>{d=t(n(),1),c(),i(),f=r(),p=[`xs`,`sm`,`md`,`lg`,`xl`],m=[`default`,`muted`],h=(0,d.createContext)({icon:null,as:`ul`}),l.__docgenInfo={description:``,methods:[],displayName:`List`,props:{as:{defaultValue:{value:`"ul"`,computed:!1},required:!1},size:{defaultValue:{value:`"md"`,computed:!1},required:!1},color:{defaultValue:{value:`"default"`,computed:!1},required:!1},icon:{defaultValue:{value:`null`,computed:!1},required:!1},className:{defaultValue:{value:`""`,computed:!1},required:!1}}},u.__docgenInfo={description:``,methods:[],displayName:`ListItem`,props:{className:{defaultValue:{value:`""`,computed:!1},required:!1}}}})),_,v,y,b,x,S,C,w,T,E,D,O,k,A;e((()=>{g(),o(),_=r(),v={title:`Components/Typography/List`,component:l,tags:[`autodocs`],args:{size:`md`,color:`default`},argTypes:{as:{control:`inline-radio`,options:[`ul`,`ol`]},size:{control:`inline-radio`,options:[`xs`,`sm`,`md`,`lg`,`xl`]},color:{control:`inline-radio`,options:[`default`,`muted`]},icon:{control:`text`,description:`Material Symbol name — switches to icon variant when set`}}},y=[`Design tokens ensure visual consistency.`,`Semantic color roles adapt to light and dark mode.`,`All components meet WCAG 2.1 AA contrast requirements.`],b=[`Design tokens form the shared language between designers and engineers — every color, spacing value, radius, and motion duration is a named contract that any theme can override without touching component code.`,`Semantic color roles like surface-page, text-default, and border-subtle automatically resolve to the correct value in light mode, dark mode, and any custom theme, so components never need to know which context they're in.`,`All interactive components are keyboard-navigable and include visible focus indicators that meet WCAG 2.1 AA requirements across every color theme, including the high-contrast accessible theme.`,`Motion primitives respect the prefers-reduced-motion media query by collapsing duration tokens to 0ms, so users who are sensitive to animation get instant state changes without any special component logic.`],x={render:e=>(0,_.jsx)(l,{...e,children:y.map(e=>(0,_.jsx)(u,{children:e},e))})},S={render:()=>(0,_.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`32px`,maxWidth:`600px`},children:[`xs`,`sm`,`md`,`lg`,`xl`].map(e=>(0,_.jsxs)(`div`,{style:{display:`flex`,alignItems:`flex-start`,gap:`16px`},children:[(0,_.jsx)(`span`,{style:{width:`28px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`,flexShrink:0,paddingTop:`2px`},children:e}),(0,_.jsx)(l,{size:e,children:y.map(e=>(0,_.jsx)(u,{children:e},e))})]},e))})},C={render:()=>(0,_.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`32px`,maxWidth:`600px`},children:[`xs`,`sm`,`md`,`lg`,`xl`].map(e=>(0,_.jsxs)(`div`,{style:{display:`flex`,alignItems:`flex-start`,gap:`16px`},children:[(0,_.jsx)(`span`,{style:{width:`28px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`,flexShrink:0,paddingTop:`2px`},children:e}),(0,_.jsx)(l,{as:`ol`,size:e,children:y.map(e=>(0,_.jsx)(u,{children:e},e))})]},e))})},w={render:()=>(0,_.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`40px`,maxWidth:`600px`},children:[(0,_.jsxs)(`div`,{children:[(0,_.jsx)(`p`,{style:{margin:`0 0 12px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`},children:`check_circle — feature list`}),(0,_.jsxs)(l,{icon:`check_circle`,children:[(0,_.jsx)(u,{children:`Unlimited design tokens with full theme support`}),(0,_.jsx)(u,{children:`Dark mode out of the box, driven by semantic tokens`}),(0,_.jsx)(u,{children:`Accessible components tested against WCAG 2.1 AA`}),(0,_.jsx)(u,{children:`Motion primitives that respect reduced-motion preferences`})]})]}),(0,_.jsxs)(`div`,{children:[(0,_.jsx)(`p`,{style:{margin:`0 0 12px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`},children:`Size scale with check icon`}),(0,_.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`24px`},children:[`xs`,`sm`,`md`,`lg`,`xl`].map(e=>(0,_.jsxs)(`div`,{style:{display:`flex`,alignItems:`flex-start`,gap:`16px`},children:[(0,_.jsx)(`span`,{style:{width:`28px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`,flexShrink:0,paddingTop:`2px`},children:e}),(0,_.jsxs)(l,{icon:`check`,size:e,children:[(0,_.jsx)(u,{children:`Design tokens ensure visual consistency.`}),(0,_.jsx)(u,{children:`Dark mode adapts automatically.`})]})]},e))})]})]})},T={render:()=>(0,_.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`40px`,maxWidth:`520px`},children:[(0,_.jsxs)(`div`,{children:[(0,_.jsx)(`p`,{style:{margin:`0 0 12px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`},children:`Unordered — long items`}),(0,_.jsx)(l,{children:b.map(e=>(0,_.jsx)(u,{children:e},e))})]}),(0,_.jsxs)(`div`,{children:[(0,_.jsx)(`p`,{style:{margin:`0 0 12px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`},children:`Ordered — long items`}),(0,_.jsx)(l,{as:`ol`,children:b.map(e=>(0,_.jsx)(u,{children:e},e))})]}),(0,_.jsxs)(`div`,{children:[(0,_.jsx)(`p`,{style:{margin:`0 0 12px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`},children:`Icon — long items`}),(0,_.jsx)(l,{icon:`check_circle`,children:b.map(e=>(0,_.jsx)(u,{children:e},e))})]})]})},E={render:()=>(0,_.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`48px`,maxWidth:`560px`},children:[(0,_.jsxs)(`div`,{children:[(0,_.jsx)(`p`,{style:{margin:`0 0 12px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`},children:`Unordered — 4 levels (disc → circle → square → bordered square)`}),(0,_.jsxs)(l,{children:[(0,_.jsxs)(u,{children:[`Design system layers`,(0,_.jsxs)(l,{size:`sm`,children:[(0,_.jsxs)(u,{children:[`Tokens`,(0,_.jsxs)(l,{size:`sm`,children:[(0,_.jsxs)(u,{children:[`Base tokens`,(0,_.jsxs)(l,{size:`sm`,children:[(0,_.jsx)(u,{children:`color-blue-500`}),(0,_.jsx)(u,{children:`spacing-4`}),(0,_.jsx)(u,{children:`radius-md`})]})]}),(0,_.jsx)(u,{children:`Semantic tokens`}),(0,_.jsx)(u,{children:`Component tokens`})]})]}),(0,_.jsx)(u,{children:`Components`}),(0,_.jsx)(u,{children:`Themes`})]})]}),(0,_.jsx)(u,{children:`Documentation`})]})]}),(0,_.jsxs)(`div`,{children:[(0,_.jsx)(`p`,{style:{margin:`0 0 12px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`},children:`Ordered → ordered (2 levels)`}),(0,_.jsxs)(l,{as:`ol`,children:[(0,_.jsxs)(u,{children:[`Install the package`,(0,_.jsxs)(l,{as:`ol`,size:`sm`,children:[(0,_.jsxs)(u,{children:[`Run `,(0,_.jsx)(`code`,{children:`npm install @a1/react`})]}),(0,_.jsx)(u,{children:`Import the tokens CSS into your app entry point`}),(0,_.jsx)(u,{children:`Wrap your root with a theme provider if needed`})]})]}),(0,_.jsxs)(u,{children:[`Configure your theme`,(0,_.jsxs)(l,{as:`ol`,size:`sm`,children:[(0,_.jsx)(u,{children:`Copy the base theme JSON as a starting point`}),(0,_.jsx)(u,{children:`Override semantic tokens to match your brand`})]})]}),(0,_.jsx)(u,{children:`Use components directly — no additional setup required`})]})]}),(0,_.jsxs)(`div`,{children:[(0,_.jsx)(`p`,{style:{margin:`0 0 12px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`},children:`Ordered → unordered (2 levels)`}),(0,_.jsxs)(l,{as:`ol`,children:[(0,_.jsxs)(u,{children:[`Choose a variant`,(0,_.jsxs)(l,{size:`sm`,children:[(0,_.jsx)(u,{children:`Unordered for non-sequential content`}),(0,_.jsx)(u,{children:`Ordered for steps and ranked items`}),(0,_.jsx)(u,{children:`Icon for feature lists and status items`})]})]}),(0,_.jsxs)(u,{children:[`Pick a size to match surrounding body text`,(0,_.jsxs)(l,{size:`sm`,children:[(0,_.jsx)(u,{children:`xs and sm for compact UIs and sidebars`}),(0,_.jsx)(u,{children:`md for standard body copy contexts`}),(0,_.jsx)(u,{children:`lg and xl for editorial and marketing layouts`})]})]}),(0,_.jsx)(u,{children:`Nest sparingly — two levels is the practical maximum`})]})]})]})},D={render:()=>(0,_.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`48px`,maxWidth:`560px`},children:[(0,_.jsxs)(`div`,{children:[(0,_.jsx)(`p`,{style:{margin:`0 0 12px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`},children:`Per-item icon override — status list`}),(0,_.jsxs)(l,{icon:`check_circle`,children:[(0,_.jsx)(u,{children:`All semantic color tokens defined`}),(0,_.jsx)(u,{children:`Dark mode verified on every component`}),(0,_.jsx)(u,{icon:`warning`,children:`Motion audit incomplete — SideNav needs review`}),(0,_.jsx)(u,{icon:`cancel`,children:`Figma Code Connect not yet configured`}),(0,_.jsx)(u,{icon:`radio_button_unchecked`,children:`Accessibility testing in progress`})]})]}),(0,_.jsxs)(`div`,{children:[(0,_.jsx)(`p`,{style:{margin:`0 0 12px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`},children:`Icon list → unordered sub-list`}),(0,_.jsxs)(l,{icon:`folder`,children:[(0,_.jsxs)(u,{children:[`Tokens`,(0,_.jsxs)(l,{size:`sm`,children:[(0,_.jsx)(u,{children:`base/color-ramp.json`}),(0,_.jsx)(u,{children:`base/spacing.json`}),(0,_.jsx)(u,{children:`semantic/motion.json`})]})]}),(0,_.jsxs)(u,{children:[`Components`,(0,_.jsxs)(l,{size:`sm`,children:[(0,_.jsx)(u,{children:`button/button.css`}),(0,_.jsx)(u,{children:`list/list.css`}),(0,_.jsx)(u,{children:`side-nav/side-nav.css`})]})]}),(0,_.jsxs)(u,{children:[`Themes`,(0,_.jsxs)(l,{size:`sm`,children:[(0,_.jsx)(u,{children:`a1-light/theme.json`}),(0,_.jsx)(u,{children:`heritage/theme.json`}),(0,_.jsx)(u,{children:`accessible/theme.json`})]})]})]})]}),(0,_.jsxs)(`div`,{children:[(0,_.jsx)(`p`,{style:{margin:`0 0 12px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`},children:`Unordered → icon sub-list`}),(0,_.jsxs)(l,{children:[(0,_.jsxs)(u,{children:[`Bundled primitives`,(0,_.jsxs)(l,{icon:`check`,size:`sm`,children:[(0,_.jsx)(u,{children:`Spacing scale (1–128px)`}),(0,_.jsx)(u,{children:`Type scale (xs–xl body, heading, display)`}),(0,_.jsx)(u,{children:`Motion duration and easing tokens`}),(0,_.jsx)(u,{children:`Semantic shadow tokens`})]})]}),(0,_.jsxs)(u,{children:[`Not included by default`,(0,_.jsxs)(l,{icon:`close`,size:`sm`,children:[(0,_.jsx)(u,{children:`Custom illustration assets`}),(0,_.jsx)(u,{children:`Data visualization color scales`})]})]})]})]})]})},O={render:()=>(0,_.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`40px`,maxWidth:`560px`},children:[(0,_.jsxs)(`div`,{children:[(0,_.jsx)(`p`,{style:{margin:`0 0 12px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`},children:`Bold, italic, and inline code`}),(0,_.jsxs)(l,{children:[(0,_.jsxs)(u,{children:[`Use `,(0,_.jsx)(`strong`,{children:`semantic color tokens`}),` — never hardcode hex values in components.`]}),(0,_.jsxs)(u,{children:[`Wrap the app root with `,(0,_.jsx)(`code`,{children:`<ThemeProvider>`}),` to enable theme switching at runtime.`]}),(0,_.jsxs)(u,{children:[`Motion durations are defined as `,(0,_.jsx)(`em`,{children:`named scale steps`}),`, not raw millisecond values.`]}),(0,_.jsxs)(u,{children:[(0,_.jsx)(`strong`,{children:`Dark mode`}),` is handled automatically via `,(0,_.jsx)(`code`,{children:`prefers-color-scheme`}),` — no extra logic needed.`]}),(0,_.jsxs)(u,{children:[`The `,(0,_.jsx)(`em`,{children:`expressive`}),` easing curve is `,(0,_.jsx)(`strong`,{children:`reserved for infrequent, high-delight moments`}),` only.`]})]})]}),(0,_.jsxs)(`div`,{children:[(0,_.jsx)(`p`,{style:{margin:`0 0 12px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`},children:`Ordered with inline formatting`}),(0,_.jsxs)(l,{as:`ol`,children:[(0,_.jsxs)(u,{children:[`Run `,(0,_.jsx)(`code`,{children:`npm install @a1/react`}),` to add the package.`]}),(0,_.jsxs)(u,{children:[`Import `,(0,_.jsx)(`code`,{children:`tokens.css`}),` at your `,(0,_.jsx)(`strong`,{children:`app entry point`}),` — this must come before any component styles.`]}),(0,_.jsxs)(u,{children:[`Use `,(0,_.jsx)(`em`,{children:`semantic tokens`}),` like `,(0,_.jsx)(`code`,{children:`--semantic-color-text-default`}),` rather than base tokens in component CSS.`]}),(0,_.jsxs)(u,{children:[`Override `,(0,_.jsx)(`strong`,{children:`only the tokens you need`}),` — the default theme covers all required values.`]})]})]})]})},k={render:()=>(0,_.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`24px`,maxWidth:`560px`},children:[(0,_.jsx)(l,{color:`default`,children:y.map(e=>(0,_.jsx)(u,{children:e},e))}),(0,_.jsx)(l,{color:`muted`,children:y.map(e=>(0,_.jsx)(u,{children:e},e))}),(0,_.jsx)(s,{style:{padding:`16px`,borderRadius:`8px`},children:(0,_.jsx)(l,{children:y.map(e=>(0,_.jsx)(u,{children:e},e))})})]})},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: args => <List {...args}>
      {SHORT.map(item => <ListItem key={item}>{item}</ListItem>)}
    </List>
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
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
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}},A=[`Configurable`,`SizeScale`,`Ordered`,`IconVariant`,`Wrapping`,`Nested`,`Mixed`,`Formatting`,`Colors`]}))();export{k as Colors,x as Configurable,O as Formatting,w as IconVariant,D as Mixed,E as Nested,C as Ordered,S as SizeScale,T as Wrapping,A as __namedExportsOrder,v as default};