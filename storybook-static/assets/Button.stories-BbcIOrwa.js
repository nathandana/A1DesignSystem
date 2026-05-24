import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./iframe-DGQSYM4W.js";import{n,t as r}from"./Button-C3mTF-_Y.js";var i,a,o,s,c,l,u,d,f;e((()=>{n(),i=t(),a={title:`Components/Controls/Button`,component:r,tags:[`autodocs`],args:{as:`button`,children:`Button`,disabled:!1,href:`#`,icon:void 0,iconPosition:`start`,size:`md`,variant:`primary`},argTypes:{as:{control:`select`,options:[`button`,`a`]},children:{control:`text`,name:`label`},disabled:{control:`boolean`},href:{control:`text`,if:{arg:`as`,eq:`a`}},icon:{control:`text`,description:`Material Symbols icon name (e.g. "add", "arrow_forward")`},iconPosition:{control:`inline-radio`,options:[`start`,`end`]},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]},variant:{control:`inline-radio`,options:[`primary`,`secondary`,`tertiary`,`destructive`,`success`]}},render:({as:e,disabled:t,href:n,...a})=>(0,i.jsx)(r,{...a,"aria-disabled":e===`a`&&t?`true`:void 0,as:e,disabled:e===`button`?t:void 0,href:e===`a`?n:void 0})},o={},s={render:e=>(0,i.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`12px`},children:[(0,i.jsx)(r,{...e,variant:`primary`,children:`Primary`}),(0,i.jsx)(r,{...e,variant:`secondary`,children:`Secondary`}),(0,i.jsx)(r,{...e,variant:`tertiary`,children:`Tertiary`}),(0,i.jsx)(r,{...e,variant:`destructive`,children:`Destructive`}),(0,i.jsx)(r,{...e,variant:`success`,children:`Success`})]})},c={fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,color:`var(--semantic-color-text-muted)`,width:`80px`},l={parameters:{controls:{include:[]}},render:()=>{let e=[`primary`,`secondary`,`tertiary`,`destructive`,`success`];return(0,i.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`16px`},children:[`sm`,`md`,`lg`].map(t=>(0,i.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`12px`},children:[(0,i.jsx)(`span`,{style:c,children:t}),e.map(e=>(0,i.jsx)(r,{size:t,variant:e,children:e.charAt(0).toUpperCase()+e.slice(1)},e))]},t))})}},u={name:`Icon — Start`,render:e=>(0,i.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`12px`},children:[(0,i.jsx)(r,{...e,variant:`primary`,icon:`add`,children:`Add item`}),(0,i.jsx)(r,{...e,variant:`secondary`,icon:`download`,children:`Download`}),(0,i.jsx)(r,{...e,variant:`tertiary`,icon:`settings`,children:`Settings`}),(0,i.jsx)(r,{...e,variant:`destructive`,icon:`delete`,children:`Delete`}),(0,i.jsx)(r,{...e,variant:`success`,icon:`check`,children:`Approve`})]})},d={name:`Icon — End`,render:e=>(0,i.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`12px`},children:[(0,i.jsx)(r,{...e,variant:`primary`,icon:`arrow_forward`,iconPosition:`end`,children:`Continue`}),(0,i.jsx)(r,{...e,variant:`secondary`,icon:`open_in_new`,iconPosition:`end`,children:`Open link`}),(0,i.jsx)(r,{...e,variant:`tertiary`,icon:`chevron_right`,iconPosition:`end`,children:`See more`}),(0,i.jsx)(r,{...e,variant:`destructive`,icon:`delete`,iconPosition:`end`,children:`Delete`}),(0,i.jsx)(r,{...e,variant:`success`,icon:`check`,iconPosition:`end`,children:`Approve`})]})},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "12px"
  }}>
      <Button {...args} variant="primary">Primary</Button>
      <Button {...args} variant="secondary">Secondary</Button>
      <Button {...args} variant="tertiary">Tertiary</Button>
      <Button {...args} variant="destructive">Destructive</Button>
      <Button {...args} variant="success">Success</Button>
    </div>
}`,...s.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => {
    const variants = ["primary", "secondary", "tertiary", "destructive", "success"];
    const sizes = ["sm", "md", "lg"];
    return <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "16px"
    }}>
        {sizes.map(size => <div key={size} style={{
        display: "flex",
        alignItems: "center",
        gap: "12px"
      }}>
            <span style={labelStyle}>{size}</span>
            {variants.map(variant => <Button key={variant} size={size} variant={variant}>
                {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </Button>)}
          </div>)}
      </div>;
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: "Icon — Start",
  render: args => <div style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "12px"
  }}>
      <Button {...args} variant="primary" icon="add">Add item</Button>
      <Button {...args} variant="secondary" icon="download">Download</Button>
      <Button {...args} variant="tertiary" icon="settings">Settings</Button>
      <Button {...args} variant="destructive" icon="delete">Delete</Button>
      <Button {...args} variant="success" icon="check">Approve</Button>
    </div>
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: "Icon — End",
  render: args => <div style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "12px"
  }}>
      <Button {...args} variant="primary" icon="arrow_forward" iconPosition="end">Continue</Button>
      <Button {...args} variant="secondary" icon="open_in_new" iconPosition="end">Open link</Button>
      <Button {...args} variant="tertiary" icon="chevron_right" iconPosition="end">See more</Button>
      <Button {...args} variant="destructive" icon="delete" iconPosition="end">Delete</Button>
      <Button {...args} variant="success" icon="check" iconPosition="end">Approve</Button>
    </div>
}`,...d.parameters?.docs?.source}}},f=[`Configurable`,`Variants`,`Sizes`,`WithIconStart`,`WithIconEnd`]}))();export{o as Configurable,l as Sizes,s as Variants,d as WithIconEnd,u as WithIconStart,f as __namedExportsOrder,a as default};