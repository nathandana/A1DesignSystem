import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{C as n,t as r}from"./iframe-BeAWTq30.js";import{n as i,t as a}from"./Button-V2oEBQfD.js";import{i as o,n as s,r as c,t as l}from"./Menu-DSIaa3LJ.js";import{n as u,t as d}from"./Paragraph-l5EsZ55n.js";function f({children:e,label:t=`Open menu`}){let[n,r]=(0,p.useState)(!1);return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(a,{icon:`more_vert`,iconPosition:`end`,onClick:()=>r(!0),"aria-haspopup":`dialog`,"aria-expanded":n,children:t}),(0,m.jsx)(l,{open:n,onClose:()=>r(!1),"aria-label":t,children:e({close:()=>r(!1)})})]})}var p,m,h,g,_,v,y,b,x,S,C;e((()=>{p=t(n(),1),i(),u(),o(),m=r(),{userEvent:h,waitFor:g,within:_}=__STORYBOOK_MODULE_TEST__,v={title:`Components/Navigation/Menu`,component:l,subcomponents:{MenuSection:c,MenuItem:s},tags:[`autodocs`],parameters:{layout:`padded`}},y={name:`Account menu`,render:()=>(0,m.jsx)(f,{label:`Open account menu`,children:({close:e})=>(0,m.jsxs)(m.Fragment,{children:[(0,m.jsxs)(c,{label:`Account`,children:[(0,m.jsx)(s,{icon:`person`,onClick:e,children:`Profile`}),(0,m.jsx)(s,{icon:`tune`,onClick:e,children:`Preferences`}),(0,m.jsx)(s,{icon:`keyboard`,shortcut:`⌘K`,onClick:e,children:`Command palette`})]}),(0,m.jsxs)(c,{label:`Workspace`,children:[(0,m.jsx)(s,{icon:`group`,onClick:e,children:`Team settings`}),(0,m.jsx)(s,{icon:`credit_card`,onClick:e,children:`Billing`}),(0,m.jsx)(s,{icon:`help`,disabled:!0,children:`Help center`})]}),(0,m.jsx)(c,{children:(0,m.jsx)(s,{icon:`logout`,variant:`destructive`,onClick:e,children:`Sign out`})})]})}),play:async({canvasElement:e})=>{let t=_(e);await h.click(t.getByRole(`button`,{name:/open account menu/i})),await g(()=>_(document.body).getByRole(`dialog`,{name:/open account menu/i}))}},b={render:()=>(0,m.jsx)(f,{label:`Open sectioned menu`,children:({close:e})=>(0,m.jsxs)(m.Fragment,{children:[(0,m.jsxs)(c,{label:`Create`,children:[(0,m.jsx)(s,{icon:`add`,onClick:e,children:`New project`}),(0,m.jsx)(s,{icon:`upload`,onClick:e,children:`Import file`})]}),(0,m.jsxs)(c,{label:`Manage`,children:[(0,m.jsx)(s,{icon:`edit`,shortcut:`E`,onClick:e,children:`Rename`}),(0,m.jsx)(s,{icon:`content_copy`,shortcut:`D`,onClick:e,children:`Duplicate`}),(0,m.jsx)(s,{icon:`archive`,onClick:e,children:`Archive`})]})]})})},x={name:`Item states`,render:()=>(0,m.jsx)(f,{label:`Open item states menu`,children:({close:e})=>(0,m.jsxs)(m.Fragment,{children:[(0,m.jsxs)(c,{label:`Default`,children:[(0,m.jsx)(s,{icon:`visibility`,onClick:e,children:`Preview`}),(0,m.jsx)(s,{icon:`open_in_new`,href:`https://example.com`,children:`Open external link`}),(0,m.jsx)(s,{icon:`keyboard`,shortcut:`⌘/`,onClick:e,children:`Show shortcuts`})]}),(0,m.jsx)(c,{label:`Unavailable`,children:(0,m.jsx)(s,{icon:`lock`,disabled:!0,children:`Locked option`})}),(0,m.jsx)(c,{label:`Danger zone`,children:(0,m.jsx)(s,{icon:`delete`,variant:`destructive`,onClick:e,children:`Delete project`})})]})})},S={name:`With nearby content`,render:()=>(0,m.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-16)`,maxWidth:`520px`},children:[(0,m.jsx)(d,{color:`muted`,children:`Menus expose contextual actions without moving the user away from the current surface. Use clear item labels and reserve destructive actions for the final section.`}),(0,m.jsx)(f,{label:`Open actions`,children:({close:e})=>(0,m.jsxs)(m.Fragment,{children:[(0,m.jsxs)(c,{children:[(0,m.jsx)(s,{icon:`edit`,onClick:e,children:`Edit details`}),(0,m.jsx)(s,{icon:`share`,onClick:e,children:`Share`}),(0,m.jsx)(s,{icon:`download`,onClick:e,children:`Download`})]}),(0,m.jsx)(c,{children:(0,m.jsx)(s,{icon:`delete`,variant:`destructive`,onClick:e,children:`Delete`})})]})})]})},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: "Account menu",
  render: () => <MenuTrigger label="Open account menu">
      {({
      close
    }) => <>
          <MenuSection label="Account">
            <MenuItem icon="person" onClick={close}>Profile</MenuItem>
            <MenuItem icon="tune" onClick={close}>Preferences</MenuItem>
            <MenuItem icon="keyboard" shortcut="⌘K" onClick={close}>Command palette</MenuItem>
          </MenuSection>
          <MenuSection label="Workspace">
            <MenuItem icon="group" onClick={close}>Team settings</MenuItem>
            <MenuItem icon="credit_card" onClick={close}>Billing</MenuItem>
            <MenuItem icon="help" disabled>Help center</MenuItem>
          </MenuSection>
          <MenuSection>
            <MenuItem icon="logout" variant="destructive" onClick={close}>Sign out</MenuItem>
          </MenuSection>
        </>}
    </MenuTrigger>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", {
      name: /open account menu/i
    }));
    await waitFor(() => within(document.body).getByRole("dialog", {
      name: /open account menu/i
    }));
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <MenuTrigger label="Open sectioned menu">
      {({
      close
    }) => <>
          <MenuSection label="Create">
            <MenuItem icon="add" onClick={close}>New project</MenuItem>
            <MenuItem icon="upload" onClick={close}>Import file</MenuItem>
          </MenuSection>
          <MenuSection label="Manage">
            <MenuItem icon="edit" shortcut="E" onClick={close}>Rename</MenuItem>
            <MenuItem icon="content_copy" shortcut="D" onClick={close}>Duplicate</MenuItem>
            <MenuItem icon="archive" onClick={close}>Archive</MenuItem>
          </MenuSection>
        </>}
    </MenuTrigger>
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: "Item states",
  render: () => <MenuTrigger label="Open item states menu">
      {({
      close
    }) => <>
          <MenuSection label="Default">
            <MenuItem icon="visibility" onClick={close}>Preview</MenuItem>
            <MenuItem icon="open_in_new" href="https://example.com">Open external link</MenuItem>
            <MenuItem icon="keyboard" shortcut="⌘/" onClick={close}>Show shortcuts</MenuItem>
          </MenuSection>
          <MenuSection label="Unavailable">
            <MenuItem icon="lock" disabled>Locked option</MenuItem>
          </MenuSection>
          <MenuSection label="Danger zone">
            <MenuItem icon="delete" variant="destructive" onClick={close}>Delete project</MenuItem>
          </MenuSection>
        </>}
    </MenuTrigger>
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  name: "With nearby content",
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-16)",
    maxWidth: "520px"
  }}>
      <Paragraph color="muted">
        Menus expose contextual actions without moving the user away from the current surface.
        Use clear item labels and reserve destructive actions for the final section.
      </Paragraph>
      <MenuTrigger label="Open actions">
        {({
        close
      }) => <>
            <MenuSection>
              <MenuItem icon="edit" onClick={close}>Edit details</MenuItem>
              <MenuItem icon="share" onClick={close}>Share</MenuItem>
              <MenuItem icon="download" onClick={close}>Download</MenuItem>
            </MenuSection>
            <MenuSection>
              <MenuItem icon="delete" variant="destructive" onClick={close}>Delete</MenuItem>
            </MenuSection>
          </>}
      </MenuTrigger>
    </div>
}`,...S.parameters?.docs?.source}}},C=[`AccountMenu`,`Sections`,`ItemStates`,`WithIntroText`]}))();export{y as AccountMenu,x as ItemStates,b as Sections,S as WithIntroText,C as __namedExportsOrder,v as default};