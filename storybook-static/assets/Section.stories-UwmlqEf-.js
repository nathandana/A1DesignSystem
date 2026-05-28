import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./iframe-BwSdWSBC.js";import{n,t as r}from"./Button-C1gAzzoD.js";import{n as i,t as a}from"./ButtonContainer-CkyQeblS.js";import{r as o,t as s}from"./Heading-D0Pp0q-v.js";import{r as c,t as l}from"./Message-C54hr4wI.js";import{n as u,t as d}from"./Paragraph-CS8wKw09.js";import{n as f,t as p}from"./Section-CWe8xnsE.js";function m({badge:e,heading:t,body:n,actions:i=!0}){return(0,h.jsxs)(h.Fragment,{children:[e&&(0,h.jsx)(l,{subtleicon:e.icon,children:e.label}),(0,h.jsx)(s,{as:`h2`,size:{xs:`xl`,md:`xxl`},children:t}),(0,h.jsx)(d,{size:`lg`,color:`muted`,children:n}),i&&(0,h.jsxs)(a,{align:`start`,children:[(0,h.jsx)(r,{variant:`primary`,children:`Get started`}),(0,h.jsx)(r,{variant:`secondary`,children:`Learn more`})]})]})}var h,g,_,v,y,b,x,S,C,w,T,E;e((()=>{f(),o(),u(),n(),i(),c(),h=t(),g={title:`Components/Containers/Section`,component:p,tags:[`autodocs`],parameters:{layout:`fullscreen`},argTypes:{padding:{control:`select`,options:[`lg`,`md`,`sm`,`none`]},surface:{control:`select`,options:[`page`,`panel`,`raised`,void 0]},gap:{control:`select`,options:[`xs`,`sm`,`md`,`lg`,void 0]},gradient:{control:`select`,options:[`accent`,`highlight`,`info`,`success`,`warn`,void 0]},gradientPosition:{control:`select`,options:[`top`,`top-right`,`right`,`bottom-right`,`bottom`,`bottom-left`,`left`,`top-left`,`center`]},inverse:{control:`boolean`},as:{control:`text`}}},_={name:`Section`,args:{padding:`lg`,surface:`page`,gap:void 0,gradient:void 0,gradientPosition:`center`,inverse:!1},render:e=>(0,h.jsx)(p,{...e,children:(0,h.jsx)(m,{badge:{icon:`crop_free`,label:`Section component`},heading:`Configurable section`,body:`Use the controls panel to change padding (lg / md / sm / none), surface (page / panel / raised / inverse), and toggle inverse mode. All values come from design tokens — no hard-coded colors or spacing.`})})},v={name:`Content gap`,render:()=>(0,h.jsx)(h.Fragment,{children:[`xs`,`sm`,`md`,`lg`].map(e=>(0,h.jsxs)(p,{padding:`md`,surface:`panel`,gap:e,children:[(0,h.jsx)(l,{subtle:!0,children:e}),(0,h.jsxs)(s,{as:`h2`,size:`xl`,children:[e.toUpperCase(),` section gap`]}),(0,h.jsx)(d,{size:`lg`,color:`muted`,children:`Section can apply a token-backed t-shirt gap between direct children.`}),(0,h.jsxs)(a,{align:`start`,children:[(0,h.jsx)(r,{variant:`primary`,children:`Primary action`}),(0,h.jsx)(r,{variant:`secondary`,children:`Secondary action`})]})]},e))})},y={name:`Gradient surfaces`,render:()=>(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(p,{padding:`lg`,surface:`page`,gradient:`accent`,gradientPosition:`left`,children:(0,h.jsx)(m,{badge:{icon:`gradient`,label:`Accent · left edge`},heading:`A subtle wash for editorial rhythm`,body:`Gradient washes layer over the selected section surface, using current theme tokens instead of fixed page colors.`})}),(0,h.jsx)(p,{padding:`lg`,surface:`panel`,gradient:`highlight`,gradientPosition:`center`,children:(0,h.jsx)(m,{badge:{icon:`flare`,label:`Highlight · centered`},heading:`Centered emphasis without a hard panel`,body:`Use centered gradients when the content itself is the focal point and the surrounding surface should stay quiet.`})}),(0,h.jsx)(p,{padding:`lg`,surface:`raised`,gradient:`info`,gradientPosition:`right`,children:(0,h.jsx)(m,{badge:{icon:`info`,label:`Info · right edge`},heading:`Edge-attached gradients guide the eye`,body:`Attach the wash to top, right, bottom, or left when the composition needs directional weight.`})}),(0,h.jsx)(p,{padding:`lg`,surface:`page`,inverse:!0,gradient:`success`,gradientPosition:`bottom`,children:(0,h.jsx)(m,{badge:{icon:`dark_mode`,label:`Inverse · bottom edge`},heading:`Inverse sections keep the wash restrained`,body:`In inverse mode the same gradient API uses the dark semantic color scheme and a lower strength token.`})})]})},b={name:`Gradient positions`,render:()=>(0,h.jsx)(h.Fragment,{children:[[`top-left`,`Top left`],[`top`,`Top`],[`top-right`,`Top right`],[`left`,`Left`],[`center`,`Center`],[`right`,`Right`],[`bottom-left`,`Bottom left`],[`bottom`,`Bottom`],[`bottom-right`,`Bottom right`]].map(([e,t])=>(0,h.jsxs)(p,{padding:`md`,surface:`panel`,gradient:`accent`,gradientPosition:e,children:[(0,h.jsx)(l,{subtle:!0,children:t}),(0,h.jsxs)(s,{as:`h2`,size:`xl`,children:[t,` gradient`]}),(0,h.jsxs)(d,{size:`lg`,color:`muted`,children:[`This section anchors the same subtle theme gradient to `,t.toLowerCase(),`.`]})]},e))})},x={name:`Padding — lg / md / sm`,render:()=>(0,h.jsxs)(h.Fragment,{children:[(0,h.jsxs)(p,{padding:`lg`,surface:`panel`,children:[(0,h.jsx)(l,{subtleicon:`zoom_out_map`,children:`lg — large`}),(0,h.jsx)(s,{as:`h2`,size:`xl`,children:`Large padding`}),(0,h.jsx)(d,{size:`lg`,color:`muted`,children:`96px block / 64px inline at desktop, 64/40 at tablet, 40/24 on mobile. Use for hero sections, prominent CTAs, and full-bleed highlights.`})]}),(0,h.jsxs)(p,{padding:`md`,children:[(0,h.jsx)(l,{subtleicon:`crop_free`,children:`md — medium`}),(0,h.jsx)(s,{as:`h2`,size:`xl`,children:`Medium padding`}),(0,h.jsx)(d,{size:`lg`,color:`muted`,children:`64px block / 40px inline at desktop, 40/24 at tablet, 24/16 on mobile. Use for standard content bands and repeating page sections.`})]}),(0,h.jsxs)(p,{padding:`sm`,surface:`raised`,children:[(0,h.jsx)(l,{subtleicon:`compress`,children:`sm — small`}),(0,h.jsx)(s,{as:`h2`,size:`xl`,children:`Small padding`}),(0,h.jsx)(d,{size:`lg`,color:`muted`,children:`32px block / 24px inline at desktop, scales to 24/16 at tablet and 16/12 on mobile. Use for compact bands, banners, or dense product-UI sections.`})]})]})},S={name:`Surface variants`,render:()=>(0,h.jsxs)(h.Fragment,{children:[(0,h.jsxs)(p,{padding:`md`,surface:`page`,children:[(0,h.jsx)(l,{subtle:!0,children:`page`}),(0,h.jsx)(s,{as:`h2`,size:`xl`,children:`Page surface`}),(0,h.jsx)(d,{size:`lg`,color:`muted`,children:`The default page background. Use as a neutral baseline between elevated or panel sections.`})]}),(0,h.jsxs)(p,{padding:`md`,surface:`panel`,children:[(0,h.jsx)(l,{subtle:!0,children:`panel`}),(0,h.jsx)(s,{as:`h2`,size:`xl`,children:`Panel surface`}),(0,h.jsx)(d,{size:`lg`,color:`muted`,children:`A subtle lift from the page. Use for alternating bands, sidebars-as-sections, or grouped content areas.`})]}),(0,h.jsxs)(p,{padding:`md`,surface:`raised`,children:[(0,h.jsx)(l,{subtle:!0,children:`raised`}),(0,h.jsx)(s,{as:`h2`,size:`xl`,children:`Raised surface`}),(0,h.jsx)(d,{size:`lg`,color:`muted`,children:`The most elevated neutral surface. Use sparingly for featured content rows.`})]}),(0,h.jsxs)(p,{padding:`md`,inverse:!0,children:[(0,h.jsx)(l,{subtle:!0,children:`inverse`}),(0,h.jsx)(s,{as:`h2`,size:`xl`,children:`Inverse surface`}),(0,h.jsx)(d,{size:`lg`,color:`muted`,children:`High-contrast dark band. Use the inverse prop to flip the full color scheme — surface tokens (page, panel, raised) resolve to their dark equivalents inside.`})]})]})},C={name:`Inverse — dark band`,render:()=>(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(p,{padding:`lg`,surface:`page`,children:(0,h.jsx)(m,{badge:{icon:`light_mode`,label:`Light section`},heading:`Leading section on a light page`,body:`Standard light-mode section. The inverse band below demonstrates strong visual contrast for a hero or CTA use case.`})}),(0,h.jsx)(p,{padding:`lg`,inverse:!0,children:(0,h.jsx)(m,{badge:{icon:`dark_mode`,label:`Dark section`},heading:`Inverse section — all tokens switch`,body:`Text, buttons, badges, and borders all adapt to the dark color scheme. No hard-coded colors needed.`})}),(0,h.jsx)(p,{padding:`lg`,surface:`page`,children:(0,h.jsx)(m,{badge:{icon:`light_mode`,label:`Back to light`},heading:`Page resumes normal scheme`,body:`Nested inverse sections flip back to light. Chain as many bands as needed.`,actions:!1})})]})},w={name:`Responsive padding — object prop`,render:()=>(0,h.jsx)(p,{padding:{xs:`sm`,md:`md`,lg:`lg`},surface:`panel`,children:(0,h.jsx)(m,{badge:{icon:`devices`,label:`Responsive`},heading:`Per-breakpoint padding`,body:`This section uses padding={{ xs: 'sm', md: 'md', lg: 'lg' }} — sm on mobile, md at tablet, lg at desktop. Resize to see the padding change.`})})},T={name:`Stacked bands — full page`,render:()=>(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(p,{padding:`lg`,inverse:!0,children:(0,h.jsx)(m,{badge:{icon:`rocket_launch`,label:`New`},heading:`Ship faster with A1 Section`,body:`Section handles padding, surface color, and inverse theming in a single prop API. No more juggling className utilities for page bands.`})}),(0,h.jsx)(p,{padding:`lg`,surface:`page`,children:(0,h.jsx)(m,{badge:{icon:`check_circle`,label:`Features`},heading:`Everything a page band needs`,body:`Three padding tiers, four surface tokens, and inverse color-scheme switching. All values come from design tokens — no magic numbers.`})}),(0,h.jsx)(p,{padding:`md`,surface:`panel`,children:(0,h.jsx)(m,{badge:{icon:`palette`,label:`Theming`},heading:`Survives every theme`,body:`Light, dark, accessible, heritage, and inverse contexts all work without overrides. Surface and inverse props resolve against whichever token set is active.`,actions:!1})}),(0,h.jsx)(p,{padding:`lg`,inverse:!0,children:(0,h.jsx)(m,{badge:{icon:`mail`,label:`Ready`},heading:`Start building today`,body:`Drop Section anywhere in your layout and let the token system handle the rest.`})})]})},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: "Section",
  args: {
    padding: "lg",
    surface: "page",
    gap: undefined,
    gradient: undefined,
    gradientPosition: "center",
    inverse: false
  },
  render: args => <Section {...args}>
      <SampleContent badge={{
      icon: "crop_free",
      label: "Section component"
    }} heading="Configurable section" body="Use the controls panel to change padding (lg / md / sm / none), surface (page / panel / raised / inverse), and toggle inverse mode. All values come from design tokens — no hard-coded colors or spacing." />
    </Section>
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: "Content gap",
  render: () => <>
      {["xs", "sm", "md", "lg"].map(gap => <Section key={gap} padding="md" surface="panel" gap={gap}>
          <MessageBadge subtle>{gap}</MessageBadge>
          <Heading as="h2" size="xl">{gap.toUpperCase()} section gap</Heading>
          <Paragraph size="lg" color="muted">
            Section can apply a token-backed t-shirt gap between direct children.
          </Paragraph>
          <ButtonContainer align="start">
            <Button variant="primary">Primary action</Button>
            <Button variant="secondary">Secondary action</Button>
          </ButtonContainer>
        </Section>)}
    </>
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: "Gradient surfaces",
  render: () => <>
      <Section padding="lg" surface="page" gradient="accent" gradientPosition="left">
        <SampleContent badge={{
        icon: "gradient",
        label: "Accent · left edge"
      }} heading="A subtle wash for editorial rhythm" body="Gradient washes layer over the selected section surface, using current theme tokens instead of fixed page colors." />
      </Section>

      <Section padding="lg" surface="panel" gradient="highlight" gradientPosition="center">
        <SampleContent badge={{
        icon: "flare",
        label: "Highlight · centered"
      }} heading="Centered emphasis without a hard panel" body="Use centered gradients when the content itself is the focal point and the surrounding surface should stay quiet." />
      </Section>

      <Section padding="lg" surface="raised" gradient="info" gradientPosition="right">
        <SampleContent badge={{
        icon: "info",
        label: "Info · right edge"
      }} heading="Edge-attached gradients guide the eye" body="Attach the wash to top, right, bottom, or left when the composition needs directional weight." />
      </Section>

      <Section padding="lg" surface="page" inverse gradient="success" gradientPosition="bottom">
        <SampleContent badge={{
        icon: "dark_mode",
        label: "Inverse · bottom edge"
      }} heading="Inverse sections keep the wash restrained" body="In inverse mode the same gradient API uses the dark semantic color scheme and a lower strength token." />
      </Section>
    </>
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: "Gradient positions",
  render: () => <>
      {[["top-left", "Top left"], ["top", "Top"], ["top-right", "Top right"], ["left", "Left"], ["center", "Center"], ["right", "Right"], ["bottom-left", "Bottom left"], ["bottom", "Bottom"], ["bottom-right", "Bottom right"]].map(([position, label]) => <Section key={position} padding="md" surface="panel" gradient="accent" gradientPosition={position}>
          <MessageBadge subtle>{label}</MessageBadge>
          <Heading as="h2" size="xl">{label} gradient</Heading>
          <Paragraph size="lg" color="muted">
            This section anchors the same subtle theme gradient to {label.toLowerCase()}.
          </Paragraph>
        </Section>)}
    </>
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: "Padding — lg / md / sm",
  render: () => <>
      <Section padding="lg" surface="panel">
        <MessageBadge subtleicon="zoom_out_map">lg — large</MessageBadge>
        <Heading as="h2" size="xl">Large padding</Heading>
        <Paragraph size="lg" color="muted">
          96px block / 64px inline at desktop, 64/40 at tablet, 40/24 on mobile.
          Use for hero sections, prominent CTAs, and full-bleed highlights.
        </Paragraph>
      </Section>

      <Section padding="md">
        <MessageBadge subtleicon="crop_free">md — medium</MessageBadge>
        <Heading as="h2" size="xl">Medium padding</Heading>
        <Paragraph size="lg" color="muted">
          64px block / 40px inline at desktop, 40/24 at tablet, 24/16 on mobile.
          Use for standard content bands and repeating page sections.
        </Paragraph>
      </Section>

      <Section padding="sm" surface="raised">
        <MessageBadge subtleicon="compress">sm — small</MessageBadge>
        <Heading as="h2" size="xl">Small padding</Heading>
        <Paragraph size="lg" color="muted">
          32px block / 24px inline at desktop, scales to 24/16 at tablet and 16/12 on mobile.
          Use for compact bands, banners, or dense product-UI sections.
        </Paragraph>
      </Section>
    </>
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  name: "Surface variants",
  render: () => <>
      <Section padding="md" surface="page">
        <MessageBadge subtle>page</MessageBadge>
        <Heading as="h2" size="xl">Page surface</Heading>
        <Paragraph size="lg" color="muted">
          The default page background. Use as a neutral baseline between elevated or panel sections.
        </Paragraph>
      </Section>

      <Section padding="md" surface="panel">
        <MessageBadge subtle>panel</MessageBadge>
        <Heading as="h2" size="xl">Panel surface</Heading>
        <Paragraph size="lg" color="muted">
          A subtle lift from the page. Use for alternating bands, sidebars-as-sections, or grouped content areas.
        </Paragraph>
      </Section>

      <Section padding="md" surface="raised">
        <MessageBadge subtle>raised</MessageBadge>
        <Heading as="h2" size="xl">Raised surface</Heading>
        <Paragraph size="lg" color="muted">
          The most elevated neutral surface. Use sparingly for featured content rows.
        </Paragraph>
      </Section>

      <Section padding="md" inverse>
        <MessageBadge subtle>inverse</MessageBadge>
        <Heading as="h2" size="xl">Inverse surface</Heading>
        <Paragraph size="lg" color="muted">
          High-contrast dark band. Use the inverse prop to flip the full color scheme — surface tokens (page, panel, raised) resolve to their dark equivalents inside.
        </Paragraph>
      </Section>
    </>
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  name: "Inverse — dark band",
  render: () => <>
      <Section padding="lg" surface="page">
        <SampleContent badge={{
        icon: "light_mode",
        label: "Light section"
      }} heading="Leading section on a light page" body="Standard light-mode section. The inverse band below demonstrates strong visual contrast for a hero or CTA use case." />
      </Section>

      <Section padding="lg" inverse>
        <SampleContent badge={{
        icon: "dark_mode",
        label: "Dark section"
      }} heading="Inverse section — all tokens switch" body="Text, buttons, badges, and borders all adapt to the dark color scheme. No hard-coded colors needed." />
      </Section>

      <Section padding="lg" surface="page">
        <SampleContent badge={{
        icon: "light_mode",
        label: "Back to light"
      }} heading="Page resumes normal scheme" body="Nested inverse sections flip back to light. Chain as many bands as needed." actions={false} />
      </Section>
    </>
}`,...C.parameters?.docs?.source},description:{story:'`inverse={true}` applies the `a1-inverse` class, switching ALL semantic color tokens\n(text, borders, buttons, badges) to the dark scheme. Background is automatically set\nvia the base theme rule. Pair with `surface="page"` (or panel/raised) to explicitly set the background within the dark scheme.',...C.parameters?.docs?.description}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  name: "Responsive padding — object prop",
  render: () => <Section padding={{
    xs: "sm",
    md: "md",
    lg: "lg"
  }} surface="panel">
      <SampleContent badge={{
      icon: "devices",
      label: "Responsive"
    }} heading="Per-breakpoint padding" body="This section uses padding={{ xs: 'sm', md: 'md', lg: 'lg' }} — sm on mobile, md at tablet, lg at desktop. Resize to see the padding change." />
    </Section>
}`,...w.parameters?.docs?.source},description:{story:"Pass a breakpoint object to `padding` for per-breakpoint control without built-in auto-scaling.\nUseful when the default scaling doesn't match your layout at a specific breakpoint.",...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  name: "Stacked bands — full page",
  render: () => <>
      <Section padding="lg" inverse>
        <SampleContent badge={{
        icon: "rocket_launch",
        label: "New"
      }} heading="Ship faster with A1 Section" body="Section handles padding, surface color, and inverse theming in a single prop API. No more juggling className utilities for page bands." />
      </Section>

      <Section padding="lg" surface="page">
        <SampleContent badge={{
        icon: "check_circle",
        label: "Features"
      }} heading="Everything a page band needs" body="Three padding tiers, four surface tokens, and inverse color-scheme switching. All values come from design tokens — no magic numbers." />
      </Section>

      <Section padding="md" surface="panel">
        <SampleContent badge={{
        icon: "palette",
        label: "Theming"
      }} heading="Survives every theme" body="Light, dark, accessible, heritage, and inverse contexts all work without overrides. Surface and inverse props resolve against whichever token set is active." actions={false} />
      </Section>

      <Section padding="lg" inverse>
        <SampleContent badge={{
        icon: "mail",
        label: "Ready"
      }} heading="Start building today" body="Drop Section anywhere in your layout and let the token system handle the rest." />
      </Section>
    </>
}`,...T.parameters?.docs?.source}}},E=[`Default`,`Gap`,`GradientSurfaces`,`GradientPositions`,`PaddingScale`,`SurfaceVariants`,`InverseSection`,`ResponsivePadding`,`StackedBands`]}))();export{_ as Default,v as Gap,b as GradientPositions,y as GradientSurfaces,C as InverseSection,x as PaddingScale,w as ResponsivePadding,T as StackedBands,S as SurfaceVariants,E as __namedExportsOrder,g as default};