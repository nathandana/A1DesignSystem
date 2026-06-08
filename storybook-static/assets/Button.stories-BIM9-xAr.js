import{i as e}from"./preload-helper-Cs4UwXAW.js";import{r as t}from"./iframe-DZoRqkgT.js";import{n,t as r}from"./Button-Clq9-j9U.js";import{n as i,r as a}from"./icon-controls-BKzEgQc5.js";var o,s,c,l,u,d,f,p,m,h;e((()=>{n(),a(),o=t(),s={title:`Components/Controls/Button`,component:r,tags:[`autodocs`],args:{as:`button`,children:`Button`,disabled:!1,href:`#`,icon:void 0,iconPosition:`start`,size:`md`,variant:`primary`},argTypes:{as:{control:`select`,options:[`button`,`a`]},children:{control:`text`,name:`label`},disabled:{control:`boolean`},href:{control:`text`,if:{arg:`as`,eq:`a`}},icon:{...i(`A1 icon registry name`)},iconPosition:{control:`inline-radio`,options:[`start`,`end`]},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]},variant:{control:`inline-radio`,options:[`primary`,`secondary`,`tertiary`,`destructive`,`success`]}},render:({as:e,disabled:t,href:n,...i})=>(0,o.jsx)(r,{...i,"aria-disabled":e===`a`&&t?`true`:void 0,as:e,disabled:e===`button`?t:void 0,href:e===`a`?n:void 0})},c={display:`flex`,flexWrap:`wrap`,alignItems:`center`,gap:`12px`},l={fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,color:`var(--semantic-color-text-muted)`,minWidth:`56px`},u={},d={render:e=>(0,o.jsxs)(`div`,{style:c,children:[(0,o.jsx)(r,{...e,variant:`primary`,children:`Primary`}),(0,o.jsx)(r,{...e,variant:`secondary`,children:`Secondary`}),(0,o.jsx)(r,{...e,variant:`tertiary`,children:`Tertiary`}),(0,o.jsx)(r,{...e,variant:`destructive`,children:`Destructive`}),(0,o.jsx)(r,{...e,variant:`success`,children:`Success`})]})},f={parameters:{controls:{include:[]}},render:()=>{let e=[`primary`,`secondary`,`tertiary`,`destructive`,`success`];return(0,o.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`24px`},children:(0,o.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`12px`},children:[`sm`,`md`,`lg`].map(t=>(0,o.jsxs)(`div`,{style:c,children:[(0,o.jsx)(`span`,{style:l,children:t}),e.map(e=>(0,o.jsx)(r,{size:t,variant:e,icon:`add_circle`,children:e.charAt(0).toUpperCase()+e.slice(1)},e))]},t))})})}},p={name:`Icon — Start`,render:e=>(0,o.jsxs)(`div`,{style:c,children:[(0,o.jsx)(r,{...e,variant:`primary`,icon:`add`,children:`Add item`}),(0,o.jsx)(r,{...e,variant:`secondary`,icon:`download`,children:`Download`}),(0,o.jsx)(r,{...e,variant:`tertiary`,icon:`settings`,children:`Settings`}),(0,o.jsx)(r,{...e,variant:`destructive`,icon:`delete`,children:`Delete`}),(0,o.jsx)(r,{...e,variant:`success`,icon:`check`,children:`Approve`})]})},m={name:`Icon — End`,render:e=>(0,o.jsxs)(`div`,{style:c,children:[(0,o.jsx)(r,{...e,variant:`primary`,icon:`arrow_forward`,iconPosition:`end`,children:`Continue`}),(0,o.jsx)(r,{...e,variant:`secondary`,icon:`open_in_new`,iconPosition:`end`,children:`Open link`}),(0,o.jsx)(r,{...e,variant:`tertiary`,icon:`chevron_right`,iconPosition:`end`,children:`See more`}),(0,o.jsx)(r,{...e,variant:`destructive`,icon:`delete`,iconPosition:`end`,children:`Delete`}),(0,o.jsx)(r,{...e,variant:`success`,icon:`check`,iconPosition:`end`,children:`Approve`})]})},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <div style={row}>
      <Button {...args} variant="primary">Primary</Button>
      <Button {...args} variant="secondary">Secondary</Button>
      <Button {...args} variant="tertiary">Tertiary</Button>
      <Button {...args} variant="destructive">Destructive</Button>
      <Button {...args} variant="success">Success</Button>
    </div>
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
      gap: "24px"
    }}>

        <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      }}>
          {sizes.map(size => <div key={size} style={row}>
              <span style={labelStyle}>{size}</span>
              {variants.map(variant => <Button key={variant} size={size} variant={variant} icon="add_circle">
                  {variant.charAt(0).toUpperCase() + variant.slice(1)}
                </Button>)}
            </div>)}
        </div>

      </div>;
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: "Icon — Start",
  render: args => <div style={row}>
      <Button {...args} variant="primary" icon="add">Add item</Button>
      <Button {...args} variant="secondary" icon="download">Download</Button>
      <Button {...args} variant="tertiary" icon="settings">Settings</Button>
      <Button {...args} variant="destructive" icon="delete">Delete</Button>
      <Button {...args} variant="success" icon="check">Approve</Button>
    </div>
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: "Icon — End",
  render: args => <div style={row}>
      <Button {...args} variant="primary" icon="arrow_forward" iconPosition="end">Continue</Button>
      <Button {...args} variant="secondary" icon="open_in_new" iconPosition="end">Open link</Button>
      <Button {...args} variant="tertiary" icon="chevron_right" iconPosition="end">See more</Button>
      <Button {...args} variant="destructive" icon="delete" iconPosition="end">Delete</Button>
      <Button {...args} variant="success" icon="check" iconPosition="end">Approve</Button>
    </div>
}`,...m.parameters?.docs?.source}}},h=[`Configurable`,`Variants`,`Sizes`,`WithIconStart`,`WithIconEnd`]}))();export{u as Configurable,f as Sizes,d as Variants,m as WithIconEnd,p as WithIconStart,h as __namedExportsOrder,s as default};