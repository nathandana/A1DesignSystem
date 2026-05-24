import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./iframe-D1JN-_Xq.js";import{n,t as r}from"./Link-D5C59SWC.js";import{n as i,t as a}from"./Paragraph-CrxcTh6-.js";var o,s,c,l,u,d,f,p;e((()=>{n(),i(),o=t(),s={title:`Components/Controls/Link`,component:r,tags:[`autodocs`],args:{children:`Link text`,href:`#`,size:void 0,weight:void 0,icon:void 0,iconPosition:`start`},argTypes:{as:{control:`select`,options:[`a`,`button`,`span`]},size:{control:`select`,options:[void 0,`xs`,`sm`,`md`,`lg`,`xl`],description:`Font size — omit to inherit from parent`},weight:{control:`select`,options:[void 0,`normal`,`medium`,`semibold`,`bold`],description:`Font weight — omit to inherit from parent`},icon:{control:`text`,description:`Material Symbols icon name (e.g. "open_in_new", "arrow_forward")`},iconPosition:{control:`inline-radio`,options:[`start`,`end`]}}},c={},l={parameters:{controls:{include:[`weight`,`icon`,`iconPosition`]}},render:e=>(0,o.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-12)`},children:[`xs`,`sm`,`md`,`lg`,`xl`].map(t=>(0,o.jsxs)(r,{...e,size:t,href:`#`,children:[t,` — Link text`]},t))})},u={parameters:{controls:{include:[`size`,`icon`,`iconPosition`]}},render:e=>(0,o.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-12)`,fontSize:`var(--semantic-font-size-body-md)`},children:[(0,o.jsx)(r,{...e,href:`#`,children:`Inherited weight (default)`}),[`normal`,`medium`,`semibold`,`bold`].map(t=>(0,o.jsxs)(r,{...e,weight:t,href:`#`,children:[t.charAt(0).toUpperCase()+t.slice(1),` weight`]},t))]})},d={args:{size:`xl`,weight:`bold`},name:`With icons`,parameters:{controls:{include:[`size`,`weight`]}},render:e=>(0,o.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-12)`},children:[(0,o.jsx)(r,{...e,icon:`arrow_forward`,iconPosition:`end`,href:`#`,children:`Continue reading`}),(0,o.jsx)(r,{...e,icon:`open_in_new`,iconPosition:`end`,href:`#`,children:`Open in new tab`}),(0,o.jsx)(r,{...e,icon:`download`,iconPosition:`start`,href:`#`,children:`Download file`}),(0,o.jsx)(r,{...e,icon:`arrow_back`,iconPosition:`start`,href:`#`,children:`Go back`})]})},f={name:`Inline in text`,parameters:{controls:{include:[]}},render:()=>(0,o.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-16)`},children:[(0,o.jsxs)(a,{children:[`You can read more about this in our `,(0,o.jsx)(r,{href:`#`,children:`documentation`}),`, or`,` `,(0,o.jsx)(r,{href:`#`,children:`contact support`}),` if you need help.`]}),(0,o.jsxs)(a,{size:`sm`,children:[`By continuing you agree to our`,` `,(0,o.jsx)(r,{href:`#`,weight:`medium`,children:`Terms of Service`}),` and`,` `,(0,o.jsx)(r,{href:`#`,weight:`medium`,children:`Privacy Policy`}),`.`]}),(0,o.jsx)(a,{size:`lg`,children:(0,o.jsx)(r,{href:`#`,icon:`open_in_new`,iconPosition:`end`,children:`View the full changelog`})})]})},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
}`,...f.parameters?.docs?.source}}},p=[`Configurable`,`Sizes`,`Weights`,`WithIcons`,`InlineText`]}))();export{c as Configurable,f as InlineText,l as Sizes,u as Weights,d as WithIcons,p as __namedExportsOrder,s as default};