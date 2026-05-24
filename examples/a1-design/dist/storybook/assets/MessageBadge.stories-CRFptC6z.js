import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./iframe-CN7ekW17.js";import{i as n,t as r}from"./Message-70DQzp7h.js";var i,a,o,s,c,l;e((()=>{n(),i=t(),a={title:`Components/Messaging/Badge`,component:r,tags:[`autodocs`],parameters:{layout:`centered`},args:{status:`success`,children:`Saved`},argTypes:{status:{control:`inline-radio`,options:[`neutral`,`info`,`success`,`warn`,`error`]},children:{control:`text`,name:`label`},icon:{control:`text`,description:`Override the default status icon`}}},o={},s={parameters:{controls:{include:[]}},render:()=>(0,i.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`var(--base-spacing-12)`,flexWrap:`wrap`},children:[(0,i.jsx)(r,{status:`neutral`,children:`Default`}),(0,i.jsx)(r,{status:`info`,children:`In progress`}),(0,i.jsx)(r,{status:`success`,children:`Complete`}),(0,i.jsx)(r,{status:`warn`,children:`Pending review`}),(0,i.jsx)(r,{status:`error`,children:`Failed`})]})},c={name:`Inline in text`,parameters:{controls:{include:[]}},render:()=>(0,i.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-12)`},children:[{label:`Build passed`,status:`success`},{label:`Review needed`,status:`warn`},{label:`Deploy failed`,status:`error`},{label:`Syncing`,status:`info`},{label:`Draft`,status:`neutral`}].map(({label:e,status:t})=>(0,i.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`var(--base-spacing-12)`,fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-sm)`,color:`var(--semantic-color-text-default)`},children:[(0,i.jsx)(`span`,{style:{color:`var(--semantic-color-text-muted)`,minWidth:`120px`},children:`Pipeline status`}),(0,i.jsx)(r,{status:t,children:e})]},e))})},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...c.parameters?.docs?.source}}},l=[`Configurable`,`Statuses`,`InlineUsage`]}))();export{o as Configurable,c as InlineUsage,s as Statuses,l as __namedExportsOrder,a as default};