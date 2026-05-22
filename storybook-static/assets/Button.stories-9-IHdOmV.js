import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./jsx-runtime-Cul_R1t-.js";var n=e((()=>{}));function r({as:e=`button`,variant:t=`primary`,state:n,className:r=``,type:s,...c}){let l=a.includes(t)?t:`primary`,u=o.includes(n)?n:null;return(0,i.jsx)(e,{className:[`a1-button`,`a1-button--${l}`,u&&`a1-button--state-${u}`,r].filter(Boolean).join(` `),type:e===`button`?s??`button`:s,...c})}var i,a,o,s=e((()=>{n(),i=t(),a=[`primary`,`secondary`,`tertiary`],o=[`default`,`hover`,`active`],r.__docgenInfo={description:``,methods:[],displayName:`Button`,props:{as:{defaultValue:{value:`"button"`,computed:!1},required:!1},variant:{defaultValue:{value:`"primary"`,computed:!1},required:!1},className:{defaultValue:{value:`""`,computed:!1},required:!1}}}})),c,l,u,d,f,p,m,h;e((()=>{s(),c=t(),l={title:`Components/Button`,component:r,tags:[`autodocs`],args:{as:`button`,children:`Button`,disabled:!1,href:`#`,state:void 0,variant:`primary`},argTypes:{as:{control:`select`,options:[`button`,`a`]},children:{control:`text`,name:`label`},disabled:{control:`boolean`},href:{control:`text`,if:{arg:`as`,eq:`a`}},state:{control:`inline-radio`,options:[void 0,`default`,`hover`,`active`]},variant:{control:`inline-radio`,options:[`primary`,`secondary`,`tertiary`]}},render:({as:e,disabled:t,href:n,...i})=>(0,c.jsx)(r,{...i,"aria-disabled":e===`a`&&t?`true`:void 0,as:e,disabled:e===`button`?t:void 0,href:e===`a`?n:void 0})},u={},d={render:e=>(0,c.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`12px`},children:[(0,c.jsx)(r,{...e,variant:`primary`,children:`Primary`}),(0,c.jsx)(r,{...e,variant:`secondary`,children:`Secondary`}),(0,c.jsx)(r,{...e,variant:`tertiary`,children:`Tertiary`})]})},f={render:e=>(0,c.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`12px`},children:[(0,c.jsx)(r,{...e,state:`default`,variant:`primary`,children:`Default`}),(0,c.jsx)(r,{...e,state:`hover`,variant:`primary`,children:`Hover`}),(0,c.jsx)(r,{...e,state:`active`,variant:`primary`,children:`Active`})]})},p={render:e=>(0,c.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`12px`},children:[(0,c.jsx)(r,{...e,state:`default`,variant:`secondary`,children:`Default`}),(0,c.jsx)(r,{...e,state:`hover`,variant:`secondary`,children:`Hover`}),(0,c.jsx)(r,{...e,state:`active`,variant:`secondary`,children:`Active`})]})},m={render:e=>(0,c.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`12px`},children:[(0,c.jsx)(r,{...e,state:`default`,variant:`tertiary`,children:`Default`}),(0,c.jsx)(r,{...e,state:`hover`,variant:`tertiary`,children:`Hover`}),(0,c.jsx)(r,{...e,state:`active`,variant:`tertiary`,children:`Active`})]})},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "12px"
  }}>
      <Button {...args} variant="primary">
        Primary
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="tertiary">
        Tertiary
      </Button>
    </div>
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "12px"
  }}>
      <Button {...args} state="default" variant="primary">
        Default
      </Button>
      <Button {...args} state="hover" variant="primary">
        Hover
      </Button>
      <Button {...args} state="active" variant="primary">
        Active
      </Button>
    </div>
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "12px"
  }}>
      <Button {...args} state="default" variant="secondary">
        Default
      </Button>
      <Button {...args} state="hover" variant="secondary">
        Hover
      </Button>
      <Button {...args} state="active" variant="secondary">
        Active
      </Button>
    </div>
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "12px"
  }}>
      <Button {...args} state="default" variant="tertiary">
        Default
      </Button>
      <Button {...args} state="hover" variant="tertiary">
        Hover
      </Button>
      <Button {...args} state="active" variant="tertiary">
        Active
      </Button>
    </div>
}`,...m.parameters?.docs?.source}}},h=[`Configurable`,`Variants`,`PrimaryStates`,`SecondaryStates`,`TertiaryStates`]}))();export{u as Configurable,f as PrimaryStates,p as SecondaryStates,m as TertiaryStates,d as Variants,h as __namedExportsOrder,l as default};