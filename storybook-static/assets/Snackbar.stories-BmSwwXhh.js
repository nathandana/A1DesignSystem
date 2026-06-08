import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{T as n,r}from"./iframe-DZoRqkgT.js";import{n as i,t as a}from"./IconButton-Btx-EITG.js";import{n as o,t as s}from"./Button-Clq9-j9U.js";var c=e((()=>{}));function l({open:e=!1,children:t,actionLabel:n,onAction:r,onClose:i,variant:o=`default`,position:c=`bottom`,inverse:l=!0,role:p,className:m=``,...h}){if(!e)return null;let g=d.includes(o)?o:`default`,_=f.includes(c)?c:`bottom`;return(0,u.jsxs)(`div`,{className:[`a1-snackbar`,l&&`a1-inverse`,`a1-snackbar--${g}`,`a1-snackbar--${_}`,m].filter(Boolean).join(` `),role:p??(g===`error`?`alert`:`status`),"aria-live":g===`error`?`assertive`:`polite`,...h,children:[(0,u.jsx)(`div`,{className:`a1-snackbar__content`,children:t}),n&&r&&(0,u.jsx)(s,{size:`sm`,variant:`tertiary`,onClick:r,children:n}),i&&(0,u.jsx)(a,{icon:`close`,label:`Dismiss`,variant:`tertiary`,onClick:i})]})}var u,d,f,p=e((()=>{c(),o(),i(),u=r(),d=[`default`,`success`,`info`,`warn`,`error`],f=[`bottom`,`bottom-left`,`bottom-right`,`top`,`top-left`,`top-right`],l.__docgenInfo={description:``,methods:[],displayName:`Snackbar`,props:{open:{defaultValue:{value:`false`,computed:!1},required:!1},variant:{defaultValue:{value:`"default"`,computed:!1},required:!1},position:{defaultValue:{value:`"bottom"`,computed:!1},required:!1},inverse:{defaultValue:{value:`true`,computed:!1},required:!1},className:{defaultValue:{value:`""`,computed:!1},required:!1}}}})),m,h,g,_,v,y,b;e((()=>{m=t(n(),1),o(),p(),h=r(),g={title:`Components/Messaging/Snackbar`,component:l,parameters:{layout:`padded`},argTypes:{variant:{control:`inline-radio`,options:[`default`,`success`,`info`,`warn`,`error`]},position:{control:`select`,options:[`bottom`,`bottom-left`,`bottom-right`,`top`,`top-left`,`top-right`]},actionLabel:{control:`text`},children:{control:`text`}}},_={args:{open:!0,children:`Guide deleted.`,actionLabel:`Undo`,variant:`default`,position:`bottom`},render:e=>(0,h.jsx)(`div`,{style:{minHeight:120},children:(0,h.jsx)(l,{...e,onAction:()=>{},onClose:()=>{}})})},v={name:`Live demo`,parameters:{controls:{include:[]}},render:()=>{let[e,t]=(0,m.useState)(!1);return(0,h.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-16)`,alignItems:`flex-start`,minHeight:200},children:[(0,h.jsx)(s,{variant:`primary`,onClick:()=>t(!0),disabled:e,children:`Delete guide`}),(0,h.jsx)(l,{open:e,actionLabel:`Undo`,onAction:()=>t(!1),onClose:()=>t(!1),children:`Guide deleted.`})]})}},y={name:`Variants`,parameters:{controls:{include:[]}},render:()=>(0,h.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-12)`,maxWidth:420},children:[`default`,`success`,`info`,`warn`,`error`].map(e=>(0,h.jsxs)(l,{open:!0,variant:e,position:`bottom-left`,style:{position:`static`,width:`100%`,transform:`none`},onClose:()=>{},children:[e.charAt(0).toUpperCase()+e.slice(1),` message content`]},e))})},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    open: true,
    children: "Guide deleted.",
    actionLabel: "Undo",
    variant: "default",
    position: "bottom"
  },
  render: args => <div style={{
    minHeight: 120
  }}>
      <Snackbar {...args} onAction={() => {}} onClose={() => {}} />
    </div>
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: "Live demo",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => {
    const [open, setOpen] = useState(false);
    return <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--base-spacing-16)",
      alignItems: "flex-start",
      minHeight: 200
    }}>
        <Button variant="primary" onClick={() => setOpen(true)} disabled={open}>
          Delete guide
        </Button>
        <Snackbar open={open} actionLabel="Undo" onAction={() => setOpen(false)} onClose={() => setOpen(false)}>
          Guide deleted.
        </Snackbar>
      </div>;
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: "Variants",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-12)",
    maxWidth: 420
  }}>
      {["default", "success", "info", "warn", "error"].map(variant => <Snackbar key={variant} open variant={variant} position="bottom-left" style={{
      position: "static",
      width: "100%",
      transform: "none"
    }} onClose={() => {}}>
          {variant.charAt(0).toUpperCase() + variant.slice(1)} message content
        </Snackbar>)}
    </div>
}`,...y.parameters?.docs?.source}}},b=[`Configurable`,`Demo`,`Variants`]}))();export{_ as Configurable,v as Demo,y as Variants,b as __namedExportsOrder,g as default};