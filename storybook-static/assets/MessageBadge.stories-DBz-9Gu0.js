import{i as e}from"./preload-helper-Cs4UwXAW.js";import{r as t}from"./iframe-DZoRqkgT.js";import{r as n,t as r}from"./Message-Ph28UWWh.js";import{n as i,r as a}from"./icon-controls-BKzEgQc5.js";var o,s,c,l,u,d,f,p;e((()=>{n(),a(),o=t(),s={title:`Components/Messaging/Badge`,component:r,tags:[`autodocs`],parameters:{layout:`centered`},args:{status:`success`,subtle:!1,children:`Saved`},argTypes:{status:{control:`inline-radio`,options:[`neutral`,`info`,`success`,`warn`,`error`]},size:{control:`inline-radio`,options:[`md`,`lg`],description:`Badge size`},subtle:{control:`boolean`},children:{control:`text`,name:`label`},icon:{...i(`Override the default status icon`)}}},c={},l={name:`Bold — all statuses`,parameters:{controls:{include:[]}},render:()=>(0,o.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`var(--base-spacing-12)`,flexWrap:`wrap`},children:[(0,o.jsx)(r,{status:`neutral`,children:`Default`}),(0,o.jsx)(r,{status:`info`,children:`In progress`}),(0,o.jsx)(r,{status:`success`,children:`Complete`}),(0,o.jsx)(r,{status:`warn`,children:`Pending review`}),(0,o.jsx)(r,{status:`error`,children:`Failed`})]})},u={name:`Subtle — all statuses`,parameters:{controls:{include:[]}},render:()=>(0,o.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`var(--base-spacing-12)`,flexWrap:`wrap`},children:[(0,o.jsx)(r,{status:`neutral`,subtle:!0,children:`Default`}),(0,o.jsx)(r,{status:`info`,subtle:!0,children:`In progress`}),(0,o.jsx)(r,{status:`success`,subtle:!0,children:`Complete`}),(0,o.jsx)(r,{status:`warn`,subtle:!0,children:`Pending review`}),(0,o.jsx)(r,{status:`error`,subtle:!0,children:`Failed`})]})},d={name:`Sizes`,parameters:{controls:{include:[]}},render:()=>(0,o.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`var(--base-spacing-16)`,flexWrap:`wrap`},children:[(0,o.jsx)(r,{status:`success`,size:`md`,children:`Medium`}),(0,o.jsx)(r,{status:`success`,size:`lg`,children:`Large`}),(0,o.jsx)(r,{status:`success`,subtle:!0,size:`md`,children:`Medium subtle`}),(0,o.jsx)(r,{status:`success`,subtle:!0,size:`lg`,children:`Large subtle`})]})},f={name:`Inline in text`,parameters:{controls:{include:[]}},render:()=>(0,o.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-12)`},children:[{label:`Build passed`,status:`success`},{label:`Review needed`,status:`warn`},{label:`Deploy failed`,status:`error`},{label:`Syncing`,status:`info`},{label:`Draft`,status:`neutral`}].map(({label:e,status:t})=>(0,o.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`var(--base-spacing-12)`,fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-sm)`,color:`var(--semantic-color-text-default)`},children:[(0,o.jsx)(`span`,{style:{color:`var(--semantic-color-text-muted)`,minWidth:`120px`},children:`Pipeline status`}),(0,o.jsx)(r,{status:t,children:e})]},e))})},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...f.parameters?.docs?.source}}},p=[`Configurable`,`Statuses`,`Subtle`,`Sizes`,`InlineUsage`]}))();export{c as Configurable,f as InlineUsage,d as Sizes,l as Statuses,u as Subtle,p as __namedExportsOrder,s as default};