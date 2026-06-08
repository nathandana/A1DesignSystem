import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./iframe-D8uQ9hre.js";import{r as n,t as r}from"./Message-DlfnnbVY.js";var i,a,o,s,c,l,u,d;e((()=>{n(),i=t(),a={title:`Components/Messaging/Badge`,component:r,tags:[`autodocs`],parameters:{layout:`centered`},args:{status:`success`,subtle:!1,children:`Saved`},argTypes:{status:{control:`inline-radio`,options:[`neutral`,`info`,`success`,`warn`,`error`]},size:{control:`inline-radio`,options:[`md`,`lg`],description:`Badge size`},subtle:{control:`boolean`},children:{control:`text`,name:`label`},icon:{control:`text`,description:`Override the default status icon`}}},o={},s={name:`Bold — all statuses`,parameters:{controls:{include:[]}},render:()=>(0,i.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`var(--base-spacing-12)`,flexWrap:`wrap`},children:[(0,i.jsx)(r,{status:`neutral`,children:`Default`}),(0,i.jsx)(r,{status:`info`,children:`In progress`}),(0,i.jsx)(r,{status:`success`,children:`Complete`}),(0,i.jsx)(r,{status:`warn`,children:`Pending review`}),(0,i.jsx)(r,{status:`error`,children:`Failed`})]})},c={name:`Subtle — all statuses`,parameters:{controls:{include:[]}},render:()=>(0,i.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`var(--base-spacing-12)`,flexWrap:`wrap`},children:[(0,i.jsx)(r,{status:`neutral`,subtle:!0,children:`Default`}),(0,i.jsx)(r,{status:`info`,subtle:!0,children:`In progress`}),(0,i.jsx)(r,{status:`success`,subtle:!0,children:`Complete`}),(0,i.jsx)(r,{status:`warn`,subtle:!0,children:`Pending review`}),(0,i.jsx)(r,{status:`error`,subtle:!0,children:`Failed`})]})},l={name:`Sizes`,parameters:{controls:{include:[]}},render:()=>(0,i.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`var(--base-spacing-16)`,flexWrap:`wrap`},children:[(0,i.jsx)(r,{status:`success`,size:`md`,children:`Medium`}),(0,i.jsx)(r,{status:`success`,size:`lg`,children:`Large`}),(0,i.jsx)(r,{status:`success`,subtle:!0,size:`md`,children:`Medium subtle`}),(0,i.jsx)(r,{status:`success`,subtle:!0,size:`lg`,children:`Large subtle`})]})},u={name:`Inline in text`,parameters:{controls:{include:[]}},render:()=>(0,i.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-12)`},children:[{label:`Build passed`,status:`success`},{label:`Review needed`,status:`warn`},{label:`Deploy failed`,status:`error`},{label:`Syncing`,status:`info`},{label:`Draft`,status:`neutral`}].map(({label:e,status:t})=>(0,i.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`var(--base-spacing-12)`,fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-sm)`,color:`var(--semantic-color-text-default)`},children:[(0,i.jsx)(`span`,{style:{color:`var(--semantic-color-text-muted)`,minWidth:`120px`},children:`Pipeline status`}),(0,i.jsx)(r,{status:t,children:e})]},e))})},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: "Bold — all statuses",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    display: "flex",
    alignItems: "center",
    gap: "var(--base-spacing-12)",
    flexWrap: "wrap"
  }}>
      <MessageBadge status="neutral">Default</MessageBadge>
      <MessageBadge status="info">In progress</MessageBadge>
      <MessageBadge status="success">Complete</MessageBadge>
      <MessageBadge status="warn">Pending review</MessageBadge>
      <MessageBadge status="error">Failed</MessageBadge>
    </div>
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: "Subtle — all statuses",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    display: "flex",
    alignItems: "center",
    gap: "var(--base-spacing-12)",
    flexWrap: "wrap"
  }}>
      <MessageBadge status="neutral" subtle>Default</MessageBadge>
      <MessageBadge status="info" subtle>In progress</MessageBadge>
      <MessageBadge status="success" subtle>Complete</MessageBadge>
      <MessageBadge status="warn" subtle>Pending review</MessageBadge>
      <MessageBadge status="error" subtle>Failed</MessageBadge>
    </div>
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: "Sizes",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    display: "flex",
    alignItems: "center",
    gap: "var(--base-spacing-16)",
    flexWrap: "wrap"
  }}>
      <MessageBadge status="success" size="md">Medium</MessageBadge>
      <MessageBadge status="success" size="lg">Large</MessageBadge>
      <MessageBadge status="success" subtle size="md">Medium subtle</MessageBadge>
      <MessageBadge status="success" subtle size="lg">Large subtle</MessageBadge>
    </div>
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: "Inline in text",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-12)"
  }}>
      {[{
      label: "Build passed",
      status: "success"
    }, {
      label: "Review needed",
      status: "warn"
    }, {
      label: "Deploy failed",
      status: "error"
    }, {
      label: "Syncing",
      status: "info"
    }, {
      label: "Draft",
      status: "neutral"
    }].map(({
      label,
      status
    }) => <div key={label} style={{
      display: "flex",
      alignItems: "center",
      gap: "var(--base-spacing-12)",
      fontFamily: "var(--component-paragraph-font-family)",
      fontSize: "var(--semantic-font-size-body-sm)",
      color: "var(--semantic-color-text-default)"
    }}>
          <span style={{
        color: "var(--semantic-color-text-muted)",
        minWidth: "120px"
      }}>Pipeline status</span>
          <MessageBadge status={status}>{label}</MessageBadge>
        </div>)}
    </div>
}`,...u.parameters?.docs?.source}}},d=[`Configurable`,`Statuses`,`Subtle`,`Sizes`,`InlineUsage`]}))();export{o as Configurable,u as InlineUsage,l as Sizes,s as Statuses,c as Subtle,d as __namedExportsOrder,a as default};