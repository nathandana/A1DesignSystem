import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{C as n,t as r}from"./iframe-Yj7JQljB.js";import{n as i,t as a}from"./IconButton-Dpr-cvDt.js";import{n as o,t as s}from"./Button-CfiQA4bX.js";import{n as c,t as l}from"./Card-dB5Reugj.js";import{n as u,t as d}from"./Heading-CB6vmpLF.js";import{i as f,n as p,r as m,t as h}from"./Menu-B2nYaloC.js";import{n as g,t as _}from"./Paragraph-B7CzrLxz.js";function v({children:e,label:t=`Open menu`}){let[n,r]=(0,b.useState)(!1);return(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(s,{icon:`more_vert`,iconPosition:`end`,onClick:()=>r(!0),"aria-haspopup":`dialog`,"aria-expanded":n,children:t}),(0,x.jsx)(h,{open:n,onClose:()=>r(!1),"aria-label":t,children:e({close:()=>r(!1)})})]})}function y({title:e,description:t}){let[n,r]=(0,b.useState)(!1),i=(0,b.useRef)(null);return(0,x.jsxs)(l,{style:{position:`relative`},children:[(0,x.jsxs)(`div`,{style:{display:`flex`,alignItems:`flex-start`,justifyContent:`space-between`,gap:`var(--base-spacing-8)`},children:[(0,x.jsx)(d,{as:`h3`,size:`sm`,children:e}),(0,x.jsxs)(`div`,{ref:i,style:{flexShrink:0,marginTop:`-4px`,marginRight:`-4px`},children:[(0,x.jsx)(a,{icon:`more_vert`,label:`More options`,"aria-haspopup":`dialog`,"aria-expanded":n,onClick:()=>r(!0)}),(0,x.jsxs)(h,{open:n,onClose:()=>r(!1),anchorRef:i,"aria-label":`Card options`,children:[(0,x.jsxs)(m,{children:[(0,x.jsx)(p,{icon:`edit`,onClick:()=>r(!1),children:`Edit`}),(0,x.jsx)(p,{icon:`open_in_new`,onClick:()=>r(!1),children:`Open in full view`}),(0,x.jsx)(p,{icon:`content_copy`,onClick:()=>r(!1),children:`Duplicate`})]}),(0,x.jsx)(m,{children:(0,x.jsx)(p,{icon:`delete`,variant:`destructive`,onClick:()=>r(!1),children:`Delete`})})]})]})]}),(0,x.jsx)(_,{size:`sm`,color:`muted`,style:{marginTop:`var(--base-spacing-8)`},children:t})]})}var b,x,S,C,w,T,E,D,O,k,A,j,M,N;e((()=>{b=t(n(),1),o(),c(),u(),i(),g(),f(),x=r(),{userEvent:S,waitFor:C,within:w}=__STORYBOOK_MODULE_TEST__,T={title:`Components/Navigation/Menu`,component:h,subcomponents:{MenuSection:m,MenuItem:p},tags:[`autodocs`],parameters:{layout:`padded`}},E={name:`Account menu`,render:()=>(0,x.jsx)(v,{label:`Open account menu`,children:({close:e})=>(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)(m,{label:`Account`,children:[(0,x.jsx)(p,{icon:`person`,onClick:e,children:`Profile`}),(0,x.jsx)(p,{icon:`tune`,onClick:e,children:`Preferences`}),(0,x.jsx)(p,{icon:`keyboard`,shortcut:`⌘K`,onClick:e,children:`Command palette`})]}),(0,x.jsxs)(m,{label:`Workspace`,children:[(0,x.jsx)(p,{icon:`group`,onClick:e,children:`Team settings`}),(0,x.jsx)(p,{icon:`credit_card`,onClick:e,children:`Billing`}),(0,x.jsx)(p,{icon:`help`,disabled:!0,children:`Help center`})]}),(0,x.jsx)(m,{children:(0,x.jsx)(p,{icon:`logout`,variant:`destructive`,onClick:e,children:`Sign out`})})]})}),play:async({canvasElement:e})=>{let t=w(e);await S.click(t.getByRole(`button`,{name:/open account menu/i})),await C(()=>w(document.body).getByRole(`dialog`,{name:/open account menu/i}))}},D={render:()=>(0,x.jsx)(v,{label:`Open sectioned menu`,children:({close:e})=>(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)(m,{label:`Create`,children:[(0,x.jsx)(p,{icon:`add`,onClick:e,children:`New project`}),(0,x.jsx)(p,{icon:`upload`,onClick:e,children:`Import file`})]}),(0,x.jsxs)(m,{label:`Manage`,children:[(0,x.jsx)(p,{icon:`edit`,shortcut:`E`,onClick:e,children:`Rename`}),(0,x.jsx)(p,{icon:`content_copy`,shortcut:`D`,onClick:e,children:`Duplicate`}),(0,x.jsx)(p,{icon:`archive`,onClick:e,children:`Archive`})]})]})})},O={name:`Item states`,render:()=>(0,x.jsx)(v,{label:`Open item states menu`,children:({close:e})=>(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)(m,{label:`Default`,children:[(0,x.jsx)(p,{icon:`visibility`,onClick:e,children:`Preview`}),(0,x.jsx)(p,{icon:`open_in_new`,href:`https://example.com`,children:`Open external link`}),(0,x.jsx)(p,{icon:`keyboard`,shortcut:`⌘/`,onClick:e,children:`Show shortcuts`})]}),(0,x.jsx)(m,{label:`Unavailable`,children:(0,x.jsx)(p,{icon:`lock`,disabled:!0,children:`Locked option`})}),(0,x.jsx)(m,{label:`Danger zone`,children:(0,x.jsx)(p,{icon:`delete`,variant:`destructive`,onClick:e,children:`Delete project`})})]})})},k={name:`With nearby content`,render:()=>(0,x.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-16)`,maxWidth:`520px`},children:[(0,x.jsx)(_,{color:`muted`,children:`Menus expose contextual actions without moving the user away from the current surface. Use clear item labels and reserve destructive actions for the final section.`}),(0,x.jsx)(v,{label:`Open actions`,children:({close:e})=>(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)(m,{children:[(0,x.jsx)(p,{icon:`edit`,onClick:e,children:`Edit details`}),(0,x.jsx)(p,{icon:`share`,onClick:e,children:`Share`}),(0,x.jsx)(p,{icon:`download`,onClick:e,children:`Download`})]}),(0,x.jsx)(m,{children:(0,x.jsx)(p,{icon:`delete`,variant:`destructive`,onClick:e,children:`Delete`})})]})})]})},A=`Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.`,j={name:`Viewport alignment`,parameters:{layout:`padded`},render:()=>(0,x.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-24)`,maxWidth:`640px`},children:[(0,x.jsxs)(_,{color:`muted`,children:[A,` `,A]}),(0,x.jsxs)(_,{color:`muted`,children:[A,` `,A]}),(0,x.jsx)(_,{color:`muted`,children:A}),(0,x.jsx)(`div`,{style:{display:`flex`,justifyContent:`center`},children:(0,x.jsx)(v,{label:`Open menu`,children:({close:e})=>(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)(m,{label:`Actions`,children:[(0,x.jsx)(p,{icon:`edit`,shortcut:`E`,onClick:e,children:`Rename`}),(0,x.jsx)(p,{icon:`content_copy`,shortcut:`D`,onClick:e,children:`Duplicate`}),(0,x.jsx)(p,{icon:`share`,onClick:e,children:`Share`}),(0,x.jsx)(p,{icon:`download`,onClick:e,children:`Download`}),(0,x.jsx)(p,{icon:`archive`,onClick:e,children:`Archive`})]}),(0,x.jsx)(m,{children:(0,x.jsx)(p,{icon:`delete`,variant:`destructive`,onClick:e,children:`Delete`})})]})})}),(0,x.jsx)(_,{color:`muted`,children:A}),(0,x.jsxs)(_,{color:`muted`,children:[A,` `,A]}),(0,x.jsxs)(_,{color:`muted`,children:[A,` `,A]}),(0,x.jsx)(_,{color:`muted`,children:A}),(0,x.jsxs)(_,{color:`muted`,children:[A,` `,A]})]})},M={name:`Card context menu`,parameters:{layout:`padded`},render:()=>(0,x.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(260px, 1fr))`,gap:`var(--base-spacing-16)`,maxWidth:`860px`},children:[(0,x.jsx)(y,{title:`Q3 Brand Refresh`,description:`Update the color palette and typographic scale across all marketing surfaces.`}),(0,x.jsx)(y,{title:`Component Audit`,description:`Review all 48 components for accessibility compliance against WCAG 2.1 AA.`}),(0,x.jsx)(y,{title:`Token Migration`,description:`Move legacy hardcoded values to semantic design tokens before the v2 release.`}),(0,x.jsx)(y,{title:`Dark Mode QA`,description:`Test every screen in the Heritage and Accessible themes under dark mode conditions.`})]})},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  name: "Viewport alignment",
  parameters: {
    layout: "padded"
  },
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-24)",
    maxWidth: "640px"
  }}>
      <Paragraph color="muted">{LOREM} {LOREM}</Paragraph>
      <Paragraph color="muted">{LOREM} {LOREM}</Paragraph>
      <Paragraph color="muted">{LOREM}</Paragraph>

      <div style={{
      display: "flex",
      justifyContent: "center"
    }}>
        <MenuTrigger label="Open menu">
          {({
          close
        }) => <>
              <MenuSection label="Actions">
                <MenuItem icon="edit" shortcut="E" onClick={close}>Rename</MenuItem>
                <MenuItem icon="content_copy" shortcut="D" onClick={close}>Duplicate</MenuItem>
                <MenuItem icon="share" onClick={close}>Share</MenuItem>
                <MenuItem icon="download" onClick={close}>Download</MenuItem>
                <MenuItem icon="archive" onClick={close}>Archive</MenuItem>
              </MenuSection>
              <MenuSection>
                <MenuItem icon="delete" variant="destructive" onClick={close}>Delete</MenuItem>
              </MenuSection>
            </>}
        </MenuTrigger>
      </div>

      <Paragraph color="muted">{LOREM}</Paragraph>
      <Paragraph color="muted">{LOREM} {LOREM}</Paragraph>
      <Paragraph color="muted">{LOREM} {LOREM}</Paragraph>
      <Paragraph color="muted">{LOREM}</Paragraph>
      <Paragraph color="muted">{LOREM} {LOREM}</Paragraph>
    </div>
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  name: "Card context menu",
  parameters: {
    layout: "padded"
  },
  render: () => <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "var(--base-spacing-16)",
    maxWidth: "860px"
  }}>
      <CardMenu title="Q3 Brand Refresh" description="Update the color palette and typographic scale across all marketing surfaces." />
      <CardMenu title="Component Audit" description="Review all 48 components for accessibility compliance against WCAG 2.1 AA." />
      <CardMenu title="Token Migration" description="Move legacy hardcoded values to semantic design tokens before the v2 release." />
      <CardMenu title="Dark Mode QA" description="Test every screen in the Heritage and Accessible themes under dark mode conditions." />
    </div>
}`,...M.parameters?.docs?.source}}},N=[`AccountMenu`,`Sections`,`ItemStates`,`WithIntroText`,`ViewportAlignment`,`CardContextMenu`]}))();export{E as AccountMenu,M as CardContextMenu,O as ItemStates,D as Sections,j as ViewportAlignment,k as WithIntroText,N as __namedExportsOrder,T as default};