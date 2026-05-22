import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{S as n}from"./iframe-D3ZfI8km.js";import{t as r}from"./jsx-runtime-Cul_R1t-.js";import{n as i,t as a}from"./Button-BIRPEBCL.js";import{n as o,t as s}from"./Heading-BBgH03-K.js";import{n as c,t as l}from"./Paragraph-CrZbx1QP.js";import{n as u,t as d}from"./Dialog-B8GEqotY.js";var f,p,m,h,g,_,v;e((()=>{f=t(n(),1),u(),i(),o(),c(),p=r(),m={title:`Components/Containers/Dialog`,component:d,tags:[`autodocs`],parameters:{layout:`centered`}},h={render:()=>{let[e,t]=(0,f.useState)(!1);return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(a,{onClick:()=>t(!0),children:`Open dialog`}),(0,p.jsx)(d,{open:e,onClose:()=>t(!1),title:`Dialog title`,children:(0,p.jsx)(l,{color:`muted`,children:`This is the dialog body. Use it to present focused content or collect input without navigating away from the current page.`})})]})}},g={name:`With footer actions`,render:()=>{let[e,t]=(0,f.useState)(!1);return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(a,{onClick:()=>t(!0),children:`Open dialog`}),(0,p.jsx)(d,{open:e,onClose:()=>t(!1),title:`Confirm action`,footer:(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(a,{variant:`tertiary`,onClick:()=>t(!1),children:`Cancel`}),(0,p.jsx)(a,{variant:`primary`,onClick:()=>t(!1),children:`Confirm`})]}),children:(0,p.jsx)(l,{color:`muted`,children:`Are you sure you want to continue? This action cannot be undone.`})})]})}},_={name:`With rich content`,render:()=>{let[e,t]=(0,f.useState)(!1);return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(a,{onClick:()=>t(!0),children:`Open dialog`}),(0,p.jsx)(d,{open:e,onClose:()=>t(!1),title:`Project details`,footer:(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(a,{variant:`secondary`,onClick:()=>t(!1),children:`Discard`}),(0,p.jsx)(a,{variant:`primary`,icon:`save`,onClick:()=>t(!1),children:`Save changes`})]}),children:(0,p.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-12)`},children:[(0,p.jsx)(s,{as:`h3`,type:`heading`,size:`xs`,children:`Overview`}),(0,p.jsx)(l,{color:`muted`,size:`sm`,children:`Provide a short description of what this project covers, who it is intended for, and any key constraints or deadlines the team should be aware of.`}),(0,p.jsx)(s,{as:`h3`,type:`heading`,size:`xs`,children:`Notes`}),(0,p.jsx)(l,{color:`muted`,size:`sm`,children:`Add any additional context here. This section is optional but helpful for onboarding new collaborators.`})]})})]})}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = useState(false);
    return <>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <Dialog open={open} onClose={() => setOpen(false)} title="Dialog title">
          <Paragraph color="muted">
            This is the dialog body. Use it to present focused content or collect input without
            navigating away from the current page.
          </Paragraph>
        </Dialog>
      </>;
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: "With footer actions",
  render: () => {
    const [open, setOpen] = useState(false);
    return <>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <Dialog open={open} onClose={() => setOpen(false)} title="Confirm action" footer={<>
              <Button variant="tertiary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setOpen(false)}>Confirm</Button>
            </>}>
          <Paragraph color="muted">
            Are you sure you want to continue? This action cannot be undone.
          </Paragraph>
        </Dialog>
      </>;
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: "With rich content",
  render: () => {
    const [open, setOpen] = useState(false);
    return <>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <Dialog open={open} onClose={() => setOpen(false)} title="Project details" footer={<>
              <Button variant="secondary" onClick={() => setOpen(false)}>Discard</Button>
              <Button variant="primary" icon="save" onClick={() => setOpen(false)}>Save changes</Button>
            </>}>
          <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--base-spacing-12)"
        }}>
            <Heading as="h3" type="heading" size="xs">Overview</Heading>
            <Paragraph color="muted" size="sm">
              Provide a short description of what this project covers, who it is intended for,
              and any key constraints or deadlines the team should be aware of.
            </Paragraph>
            <Heading as="h3" type="heading" size="xs">Notes</Heading>
            <Paragraph color="muted" size="sm">
              Add any additional context here. This section is optional but helpful for
              onboarding new collaborators.
            </Paragraph>
          </div>
        </Dialog>
      </>;
  }
}`,..._.parameters?.docs?.source}}},v=[`Default`,`WithFooter`,`WithRichContent`]}))();export{h as Default,g as WithFooter,_ as WithRichContent,v as __namedExportsOrder,m as default};