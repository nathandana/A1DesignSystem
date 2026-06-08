import{i as e}from"./preload-helper-Cs4UwXAW.js";import{r as t}from"./iframe-DZoRqkgT.js";import{n,t as r}from"./Link-JV1UW1fo.js";import{n as i,t as a}from"./Paragraph-CcdcQtLu.js";import{n as o,r as s}from"./icon-controls-BKzEgQc5.js";var c,l,u,d,f,p,m,h;e((()=>{n(),i(),s(),c=t(),l={title:`Components/Controls/Link`,component:r,tags:[`autodocs`],args:{children:`Link text`,href:`#`,size:void 0,weight:void 0,icon:void 0,iconPosition:`start`},argTypes:{size:{control:`select`,options:[void 0,`xs`,`sm`,`md`,`lg`,`xl`],description:`Font size — omit to inherit from parent`},weight:{control:`select`,options:[void 0,`normal`,`medium`,`semibold`,`bold`],description:`Font weight — omit to inherit from parent`},icon:{...o(`A1 icon registry name`)},iconPosition:{control:`inline-radio`,options:[`start`,`end`]}}},u={},d={parameters:{controls:{include:[`weight`,`icon`,`iconPosition`]}},render:e=>(0,c.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-12)`},children:[`xs`,`sm`,`md`,`lg`,`xl`].map(t=>(0,c.jsxs)(r,{...e,size:t,href:`#`,children:[t,` — Link text`]},t))})},f={parameters:{controls:{include:[`size`,`icon`,`iconPosition`]}},render:e=>(0,c.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-12)`,fontSize:`var(--semantic-font-size-body-md)`},children:[(0,c.jsx)(r,{...e,href:`#`,children:`Inherited weight (default)`}),[`normal`,`medium`,`semibold`,`bold`].map(t=>(0,c.jsxs)(r,{...e,weight:t,href:`#`,children:[t.charAt(0).toUpperCase()+t.slice(1),` weight`]},t))]})},p={args:{size:`xl`,weight:`bold`},name:`With icons`,parameters:{controls:{include:[`size`,`weight`]}},render:e=>(0,c.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-12)`},children:[(0,c.jsx)(r,{...e,icon:`arrow_forward`,iconPosition:`end`,href:`#`,children:`Continue reading`}),(0,c.jsx)(r,{...e,icon:`open_in_new`,iconPosition:`end`,href:`#`,children:`Open in new tab`}),(0,c.jsx)(r,{...e,icon:`download`,iconPosition:`start`,href:`#`,children:`Download file`}),(0,c.jsx)(r,{...e,icon:`arrow_back`,iconPosition:`start`,href:`#`,children:`Go back`})]})},m={name:`Inline in text`,parameters:{controls:{include:[]}},render:()=>(0,c.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-16)`},children:[(0,c.jsxs)(a,{children:[`You can read more about this in our `,(0,c.jsx)(r,{href:`#`,children:`documentation`}),`, or`,` `,(0,c.jsx)(r,{href:`#`,children:`contact support`}),` if you need help.`]}),(0,c.jsxs)(a,{size:`sm`,children:[`By continuing you agree to our`,` `,(0,c.jsx)(r,{href:`#`,weight:`medium`,children:`Terms of Service`}),` and`,` `,(0,c.jsx)(r,{href:`#`,weight:`medium`,children:`Privacy Policy`}),`.`]}),(0,c.jsx)(a,{size:`lg`,children:(0,c.jsx)(r,{href:`#`,icon:`open_in_new`,iconPosition:`end`,children:`View the full changelog`})})]})},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      include: ["weight", "icon", "iconPosition"]
    }
  },
  render: args => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-12)"
  }}>
      {["xs", "sm", "md", "lg", "xl"].map(size => <Link key={size} {...args} size={size} href="#">
          {size} — Link text
        </Link>)}
    </div>
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      include: ["size", "icon", "iconPosition"]
    }
  },
  render: args => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-12)",
    fontSize: "var(--semantic-font-size-body-md)"
  }}>
      <Link {...args} href="#">Inherited weight (default)</Link>
      {["normal", "medium", "semibold", "bold"].map(weight => <Link key={weight} {...args} weight={weight} href="#">
          {weight.charAt(0).toUpperCase() + weight.slice(1)} weight
        </Link>)}
    </div>
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    size: "xl",
    weight: "bold"
  },
  name: "With icons",
  parameters: {
    controls: {
      include: ["size", "weight"]
    }
  },
  render: args => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-12)"
  }}>
      <Link {...args} icon="arrow_forward" iconPosition="end" href="#">Continue reading</Link>
      <Link {...args} icon="open_in_new" iconPosition="end" href="#">Open in new tab</Link>
      <Link {...args} icon="download" iconPosition="start" href="#">Download file</Link>
      <Link {...args} icon="arrow_back" iconPosition="start" href="#">Go back</Link>
    </div>
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: "Inline in text",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-16)"
  }}>
      <Paragraph>
        You can read more about this in our <Link href="#">documentation</Link>, or{" "}
        <Link href="#">contact support</Link> if you need help.
      </Paragraph>
      <Paragraph size="sm">
        By continuing you agree to our{" "}
        <Link href="#" weight="medium">Terms of Service</Link> and{" "}
        <Link href="#" weight="medium">Privacy Policy</Link>.
      </Paragraph>
      <Paragraph size="lg">
        <Link href="#" icon="open_in_new" iconPosition="end">View the full changelog</Link>
      </Paragraph>
    </div>
}`,...m.parameters?.docs?.source}}},h=[`Configurable`,`Sizes`,`Weights`,`WithIcons`,`InlineText`]}))();export{u as Configurable,m as InlineText,d as Sizes,f as Weights,p as WithIcons,h as __namedExportsOrder,l as default};