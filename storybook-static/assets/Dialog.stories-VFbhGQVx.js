import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{C as n,t as r}from"./iframe-BwSdWSBC.js";import{n as i,t as a}from"./Button-C1gAzzoD.js";import{r as o,t as s}from"./Heading-D0Pp0q-v.js";import{n as c,t as l}from"./Paragraph-CS8wKw09.js";import{n as u,t as d}from"./Dialog-BLmUwU7h.js";var f,p,m,h,g,_,v,y,b,x,S;e((()=>{f=t(n(),1),u(),i(),o(),c(),p=r(),{userEvent:m,within:h,waitFor:g}=__STORYBOOK_MODULE_TEST__,_={title:`Components/Containers/Dialog`,component:d,tags:[`autodocs`],parameters:{layout:`centered`}},v={render:()=>{let[e,t]=(0,f.useState)(!1);return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(a,{onClick:()=>t(!0),children:`Open dialog`}),(0,p.jsx)(d,{open:e,onClose:()=>t(!1),title:`Dialog title`,children:(0,p.jsx)(l,{color:`muted`,children:`This is the dialog body. Use it to present focused content or collect input without navigating away from the current page.`})})]})},play:async({canvasElement:e})=>{let t=h(e);await m.click(t.getByRole(`button`,{name:/open dialog/i})),await g(()=>h(document.body).getByRole(`dialog`))}},y={name:`With footer actions`,render:()=>{let[e,t]=(0,f.useState)(!1);return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(a,{onClick:()=>t(!0),children:`Open dialog`}),(0,p.jsx)(d,{open:e,onClose:()=>t(!1),title:`Confirm action`,footer:(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(a,{variant:`primary`,onClick:()=>t(!1),children:`Confirm`}),(0,p.jsx)(a,{variant:`secondary`,onClick:()=>t(!1),children:`Cancel`})]}),children:(0,p.jsx)(l,{color:`muted`,children:`Are you sure you want to continue? This action cannot be undone.`})})]})},play:async({canvasElement:e})=>{let t=h(e);await m.click(t.getByRole(`button`,{name:/open dialog/i})),await g(()=>h(document.body).getByRole(`dialog`))}},b={name:`Long content (scroll)`,render:()=>{let[e,t]=(0,f.useState)(!1);return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(a,{onClick:()=>t(!0),children:`Open dialog`}),(0,p.jsx)(d,{open:e,onClose:()=>t(!1),title:`Terms of Service`,footer:(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(a,{variant:`primary`,onClick:()=>t(!1),children:`Accept`}),(0,p.jsx)(a,{variant:`secondary`,onClick:()=>t(!1),children:`Decline`})]}),children:(0,p.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-16)`},children:[{heading:`1. Introduction`,body:`Welcome to our platform. By accessing or using our services, you agree to be bound by these Terms of Service. Please read them carefully before proceeding. If you do not agree to these terms, you may not use our services.`},{heading:`2. Definitions`,body:`In these Terms, "Service" refers to the platform and all associated products, features, and functionality. "User" means any individual or entity that accesses the Service. "Content" means any text, images, data, or other material submitted through the Service.`},{heading:`3. Account Registration`,body:`To access certain features you must create an account. You are responsible for maintaining the confidentiality of your credentials and for all activity that occurs under your account. You must notify us immediately of any unauthorized use.`},{heading:`4. Acceptable Use`,body:`You agree not to use the Service for any unlawful purpose or in any way that could damage, disable, or impair the Service. You may not attempt to gain unauthorized access to any part of the Service or any system connected to it.`},{heading:`5. Intellectual Property`,body:`All content and materials available through the Service, including but not limited to text, graphics, logos, and software, are the property of the company and are protected by applicable intellectual property laws.`},{heading:`6. Privacy`,body:`Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the Service, you consent to the collection and use of your information as described in the Privacy Policy.`},{heading:`7. Termination`,body:`We reserve the right to suspend or terminate your access to the Service at any time, with or without cause, and with or without notice. Upon termination, all licenses granted to you under these Terms will immediately cease.`},{heading:`8. Limitation of Liability`,body:`To the maximum extent permitted by applicable law, the company shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Service.`}].map(({heading:e,body:t})=>(0,p.jsxs)(`div`,{children:[(0,p.jsx)(s,{as:`h3`,type:`heading`,size:`xs`,style:{marginBottom:`var(--base-spacing-8)`},children:e}),(0,p.jsx)(l,{color:`muted`,size:`sm`,children:t})]},e))})})]})},play:async({canvasElement:e})=>{let t=h(e);await m.click(t.getByRole(`button`,{name:/open dialog/i})),await g(()=>h(document.body).getByRole(`dialog`))}},x={name:`With rich content`,render:()=>{let[e,t]=(0,f.useState)(!1);return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(a,{onClick:()=>t(!0),children:`Open dialog`}),(0,p.jsx)(d,{open:e,onClose:()=>t(!1),title:`Project details`,footer:(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(a,{variant:`primary`,icon:`save`,onClick:()=>t(!1),children:`Save changes`}),(0,p.jsx)(a,{variant:`secondary`,onClick:()=>t(!1),children:`Discard`})]}),children:(0,p.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-12)`},children:[(0,p.jsx)(s,{as:`h3`,type:`heading`,size:`xs`,children:`Overview`}),(0,p.jsx)(l,{color:`muted`,size:`sm`,children:`Provide a short description of what this project covers, who it is intended for, and any key constraints or deadlines the team should be aware of.`}),(0,p.jsx)(s,{as:`h3`,type:`heading`,size:`xs`,children:`Notes`}),(0,p.jsx)(l,{color:`muted`,size:`sm`,children:`Add any additional context here. This section is optional but helpful for onboarding new collaborators.`})]})})]})},play:async({canvasElement:e})=>{let t=h(e);await m.click(t.getByRole(`button`,{name:/open dialog/i})),await g(()=>h(document.body).getByRole(`dialog`))}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
              <Button variant="primary" onClick={() => setOpen(false)}>Confirm</Button>
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
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
  name: "Long content (scroll)",
  render: () => {
    const [open, setOpen] = useState(false);
    return <>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <Dialog open={open} onClose={() => setOpen(false)} title="Terms of Service" footer={<>
              <Button variant="primary" onClick={() => setOpen(false)}>Accept</Button>
              <Button variant="secondary" onClick={() => setOpen(false)}>Decline</Button>
            </>}>
          <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--base-spacing-16)"
        }}>
            {[{
            heading: "1. Introduction",
            body: "Welcome to our platform. By accessing or using our services, you agree to be bound by these Terms of Service. Please read them carefully before proceeding. If you do not agree to these terms, you may not use our services."
          }, {
            heading: "2. Definitions",
            body: "In these Terms, \\"Service\\" refers to the platform and all associated products, features, and functionality. \\"User\\" means any individual or entity that accesses the Service. \\"Content\\" means any text, images, data, or other material submitted through the Service."
          }, {
            heading: "3. Account Registration",
            body: "To access certain features you must create an account. You are responsible for maintaining the confidentiality of your credentials and for all activity that occurs under your account. You must notify us immediately of any unauthorized use."
          }, {
            heading: "4. Acceptable Use",
            body: "You agree not to use the Service for any unlawful purpose or in any way that could damage, disable, or impair the Service. You may not attempt to gain unauthorized access to any part of the Service or any system connected to it."
          }, {
            heading: "5. Intellectual Property",
            body: "All content and materials available through the Service, including but not limited to text, graphics, logos, and software, are the property of the company and are protected by applicable intellectual property laws."
          }, {
            heading: "6. Privacy",
            body: "Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the Service, you consent to the collection and use of your information as described in the Privacy Policy."
          }, {
            heading: "7. Termination",
            body: "We reserve the right to suspend or terminate your access to the Service at any time, with or without cause, and with or without notice. Upon termination, all licenses granted to you under these Terms will immediately cease."
          }, {
            heading: "8. Limitation of Liability",
            body: "To the maximum extent permitted by applicable law, the company shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Service."
          }].map(({
            heading,
            body
          }) => <div key={heading}>
                <Heading as="h3" type="heading" size="xs" style={{
              marginBottom: "var(--base-spacing-8)"
            }}>{heading}</Heading>
                <Paragraph color="muted" size="sm">{body}</Paragraph>
              </div>)}
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
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: "With rich content",
  render: () => {
    const [open, setOpen] = useState(false);
    return <>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <Dialog open={open} onClose={() => setOpen(false)} title="Project details" footer={<>
              <Button variant="primary" icon="save" onClick={() => setOpen(false)}>Save changes</Button>
              <Button variant="secondary" onClick={() => setOpen(false)}>Discard</Button>
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
}`,...x.parameters?.docs?.source}}},S=[`Default`,`WithFooter`,`LongContent`,`WithRichContent`]}))();export{v as Default,b as LongContent,y as WithFooter,x as WithRichContent,S as __namedExportsOrder,_ as default};