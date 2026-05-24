import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{C as n,t as r}from"./iframe-C_HQpeIV.js";import{n as i,t as a}from"./Button-imiHOgNS.js";import{n as o,t as s}from"./Heading-Y_nkG59n.js";import{n as c,t as l}from"./Paragraph-DxqgNv4K.js";import{n as u,t as d}from"./Dialog-BcJEOjFF.js";var f,p,m,h,g,_,v,y,b,x;e((()=>{f=t(n(),1),u(),i(),o(),c(),p=r(),{userEvent:m,within:h,waitFor:g}=__STORYBOOK_MODULE_TEST__,_={title:`Components/Containers/Dialog`,component:d,tags:[`autodocs`],parameters:{layout:`centered`}},v={render:()=>{let[e,t]=(0,f.useState)(!1);return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(a,{onClick:()=>t(!0),children:`Open dialog`}),(0,p.jsx)(d,{open:e,onClose:()=>t(!1),title:`Dialog title`,children:(0,p.jsx)(l,{color:`muted`,children:`This is the dialog body. Use it to present focused content or collect input without navigating away from the current page.`})})]})},play:async({canvasElement:e})=>{let t=h(e);await m.click(t.getByRole(`button`,{name:/open dialog/i})),await g(()=>h(document.body).getByRole(`dialog`))}},y={name:`With footer actions`,render:()=>{let[e,t]=(0,f.useState)(!1);return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(a,{onClick:()=>t(!0),children:`Open dialog`}),(0,p.jsx)(d,{open:e,onClose:()=>t(!1),title:`Confirm action`,footer:(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(a,{variant:`tertiary`,onClick:()=>t(!1),children:`Cancel`}),(0,p.jsx)(a,{variant:`primary`,onClick:()=>t(!1),children:`Confirm`})]}),children:(0,p.jsx)(l,{color:`muted`,children:`Are you sure you want to continue? This action cannot be undone.`})})]})},play:async({canvasElement:e})=>{let t=h(e);await m.click(t.getByRole(`button`,{name:/open dialog/i})),await g(()=>h(document.body).getByRole(`dialog`))}},b={name:`With rich content`,render:()=>{let[e,t]=(0,f.useState)(!1);return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(a,{onClick:()=>t(!0),children:`Open dialog`}),(0,p.jsx)(d,{open:e,onClose:()=>t(!1),title:`Project details`,footer:(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(a,{variant:`secondary`,onClick:()=>t(!1),children:`Discard`}),(0,p.jsx)(a,{variant:`primary`,icon:`save`,onClick:()=>t(!1),children:`Save changes`})]}),children:(0,p.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-12)`},children:[(0,p.jsx)(s,{as:`h3`,type:`heading`,size:`xs`,children:`Overview`}),(0,p.jsx)(l,{color:`muted`,size:`sm`,children:`Provide a short description of what this project covers, who it is intended for, and any key constraints or deadlines the team should be aware of.`}),(0,p.jsx)(s,{as:`h3`,type:`heading`,size:`xs`,children:`Notes`}),(0,p.jsx)(l,{color:`muted`,size:`sm`,children:`Add any additional context here. This section is optional but helpful for onboarding new collaborators.`})]})})]})},play:async({canvasElement:e})=>{let t=h(e);await m.click(t.getByRole(`button`,{name:/open dialog/i})),await g(()=>h(document.body).getByRole(`dialog`))}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", {
      name: /open dialog/i
    }));
    await waitFor(() => within(document.body).getByRole("dialog"));
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", {
      name: /open dialog/i
    }));
    await waitFor(() => within(document.body).getByRole("dialog"));
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", {
      name: /open dialog/i
    }));
    await waitFor(() => within(document.body).getByRole("dialog"));
  }
}`,...b.parameters?.docs?.source}}},x=[`Default`,`WithFooter`,`WithRichContent`]}))();export{v as Default,y as WithFooter,b as WithRichContent,x as __namedExportsOrder,_ as default};