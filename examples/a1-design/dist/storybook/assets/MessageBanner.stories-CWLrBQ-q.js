import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{S as n}from"./iframe-D3ZfI8km.js";import{t as r}from"./jsx-runtime-Cul_R1t-.js";import{i,n as a}from"./Message-BBXJ9OBC.js";var o,s,c,l,u,d,f,p,m,h;e((()=>{o=t(n(),1),i(),s=r(),c=[`neutral`,`info`,`success`,`warn`,`error`],l={title:`Components/Messaging/Banner`,component:a,tags:[`autodocs`],parameters:{layout:`padded`},args:{status:`info`,title:`Banner title`,children:`This is the body of the message, providing additional context about what happened.`},argTypes:{status:{control:`inline-radio`,options:c},title:{control:`text`},children:{control:`text`,name:`body`},icon:{control:`text`,description:`Override the default status icon (Material Symbols name)`}}},u={render:e=>{let[t,n]=(0,o.useState)(!0);return t?(0,s.jsx)(a,{...e,onDismiss:()=>n(!1)}):(0,s.jsx)(`button`,{onClick:()=>n(!0),style:{fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-sm)`,cursor:`pointer`},children:`Show banner`})}},d={parameters:{controls:{include:[]}},render:()=>(0,s.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-12)`},children:c.map(e=>(0,s.jsxs)(a,{status:e,title:`${e.charAt(0).toUpperCase()+e.slice(1)} banner`,children:[`This is an example `,e,` message with some supporting body text.`]},e))})},f={name:`Title only`,parameters:{controls:{include:[`status`,`icon`]}},render:e=>(0,s.jsx)(a,{...e,title:`Your changes have been saved.`})},p={name:`Body only`,parameters:{controls:{include:[`status`,`icon`]}},render:e=>(0,s.jsx)(a,{...e,children:`Your session will expire in 5 minutes. Save your work to avoid losing changes.`})},m={parameters:{controls:{include:[`status`,`title`,`children`]}},render:e=>{let[t,n]=(0,o.useState)(!0);return t?(0,s.jsx)(a,{...e,onDismiss:()=>n(!1)}):(0,s.jsx)(`p`,{style:{fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-sm)`,color:`var(--semantic-color-text-muted)`},children:`Dismissed.`})}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [visible, setVisible] = useState(true);
    if (!visible) return <button onClick={() => setVisible(true)} style={{
      fontFamily: "var(--component-paragraph-font-family)",
      fontSize: "var(--semantic-font-size-body-sm)",
      cursor: "pointer"
    }}>
        Show banner
      </button>;
    return <MessageBanner {...args} onDismiss={() => setVisible(false)} />;
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
      {STATUSES.map(status => <MessageBanner key={status} status={status} title={\`\${status.charAt(0).toUpperCase() + status.slice(1)} banner\`}>
          This is an example {status} message with some supporting body text.
        </MessageBanner>)}
    </div>
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: "Title only",
  parameters: {
    controls: {
      include: ["status", "icon"]
    }
  },
  render: args => <MessageBanner {...args} title="Your changes have been saved." />
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: "Body only",
  parameters: {
    controls: {
      include: ["status", "icon"]
    }
  },
  render: args => <MessageBanner {...args}>
      Your session will expire in 5 minutes. Save your work to avoid losing changes.
    </MessageBanner>
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      include: ["status", "title", "children"]
    }
  },
  render: args => {
    const [open, setOpen] = useState(true);
    return open ? <MessageBanner {...args} onDismiss={() => setOpen(false)} /> : <p style={{
      fontFamily: "var(--component-paragraph-font-family)",
      fontSize: "var(--semantic-font-size-body-sm)",
      color: "var(--semantic-color-text-muted)"
    }}>Dismissed.</p>;
  }
}`,...m.parameters?.docs?.source}}},h=[`Configurable`,`Statuses`,`TitleOnly`,`BodyOnly`,`Dismissable`]}))();export{p as BodyOnly,u as Configurable,m as Dismissable,d as Statuses,f as TitleOnly,h as __namedExportsOrder,l as default};