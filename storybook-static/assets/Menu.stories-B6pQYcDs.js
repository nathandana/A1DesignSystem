import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{C as n,t as r}from"./iframe-D8uQ9hre.js";import{n as i,t as a}from"./IconButton-CT97Wol-.js";import{n as o,t as s}from"./Button-Ceq8Bvz0.js";import{n as c,t as l}from"./Card-D3RcWj2w.js";import{r as u,t as d}from"./Heading-D4Rsl0li.js";import{i as f,n as p,r as m,t as h}from"./Menu-CrHqULxv.js";import{n as g,t as _}from"./Paragraph-E9JaBz9b.js";function v({children:e,label:t=`Open menu`}){let[n,r]=(0,b.useState)(!1);return(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(s,{icon:`more_vert`,iconPosition:`end`,onClick:()=>r(!0),"aria-haspopup":`dialog`,"aria-expanded":n,children:t}),(0,x.jsx)(h,{open:n,onClose:()=>r(!1),"aria-label":t,children:e({close:()=>r(!1)})})]})}function y({title:e,description:t}){let[n,r]=(0,b.useState)(!1),i=(0,b.useRef)(null);return(0,x.jsxs)(l,{style:{position:`relative`},children:[(0,x.jsxs)(`div`,{style:{display:`flex`,alignItems:`flex-start`,justifyContent:`space-between`,gap:`var(--base-spacing-8)`},children:[(0,x.jsx)(d,{as:`h3`,size:`sm`,children:e}),(0,x.jsxs)(`div`,{ref:i,style:{flexShrink:0,marginTop:`-4px`,marginRight:`-4px`},children:[(0,x.jsx)(a,{icon:`more_vert`,label:`More options`,"aria-haspopup":`dialog`,"aria-expanded":n,onClick:()=>r(!0)}),(0,x.jsxs)(h,{open:n,onClose:()=>r(!1),anchorRef:i,"aria-label":`Card options`,children:[(0,x.jsxs)(m,{children:[(0,x.jsx)(p,{icon:`edit`,onClick:()=>r(!1),children:`Edit`}),(0,x.jsx)(p,{icon:`open_in_new`,onClick:()=>r(!1),children:`Open in full view`}),(0,x.jsx)(p,{icon:`content_copy`,onClick:()=>r(!1),children:`Duplicate`})]}),(0,x.jsx)(m,{children:(0,x.jsx)(p,{icon:`delete`,variant:`destructive`,onClick:()=>r(!1),children:`Delete`})})]})]})]}),(0,x.jsx)(_,{size:`sm`,color:`muted`,style:{marginTop:`var(--base-spacing-8)`},children:t})]})}var b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L;e((()=>{b=t(n(),1),o(),c(),u(),i(),g(),f(),x=r(),{userEvent:S,waitFor:C,within:w}=__STORYBOOK_MODULE_TEST__,T={title:`Components/Navigation/Menu`,component:h,subcomponents:{MenuSection:m,MenuItem:p},tags:[`autodocs`],parameters:{layout:`padded`}},E={name:`Account menu`,render:()=>(0,x.jsx)(v,{label:`Open account menu`,children:({close:e})=>(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)(m,{label:`Account`,children:[(0,x.jsx)(p,{icon:`person`,onClick:e,children:`Profile`}),(0,x.jsx)(p,{icon:`tune`,onClick:e,children:`Preferences`}),(0,x.jsx)(p,{icon:`keyboard`,shortcut:`⌘K`,onClick:e,children:`Command palette`})]}),(0,x.jsxs)(m,{label:`Workspace`,children:[(0,x.jsx)(p,{icon:`group`,onClick:e,children:`Team settings`}),(0,x.jsx)(p,{icon:`credit_card`,onClick:e,children:`Billing`}),(0,x.jsx)(p,{icon:`help`,disabled:!0,children:`Help center`})]}),(0,x.jsx)(m,{children:(0,x.jsx)(p,{icon:`logout`,variant:`destructive`,onClick:e,children:`Sign out`})})]})}),play:async({canvasElement:e})=>{let t=w(e);await S.click(t.getByRole(`button`,{name:/open account menu/i})),await C(()=>w(document.body).getByRole(`dialog`,{name:/open account menu/i}))}},D={render:()=>(0,x.jsx)(v,{label:`Open sectioned menu`,children:({close:e})=>(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)(m,{label:`Create`,children:[(0,x.jsx)(p,{icon:`add`,onClick:e,children:`New project`}),(0,x.jsx)(p,{icon:`upload`,onClick:e,children:`Import file`})]}),(0,x.jsxs)(m,{label:`Manage`,children:[(0,x.jsx)(p,{icon:`edit`,shortcut:`E`,onClick:e,children:`Rename`}),(0,x.jsx)(p,{icon:`content_copy`,shortcut:`D`,onClick:e,children:`Duplicate`}),(0,x.jsx)(p,{icon:`archive`,onClick:e,children:`Archive`})]})]})})},O={name:`Item states`,render:()=>(0,x.jsx)(v,{label:`Open item states menu`,children:({close:e})=>(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)(m,{label:`Default`,children:[(0,x.jsx)(p,{icon:`visibility`,onClick:e,children:`Preview`}),(0,x.jsx)(p,{icon:`open_in_new`,href:`https://example.com`,children:`Open external link`}),(0,x.jsx)(p,{icon:`keyboard`,shortcut:`⌘/`,onClick:e,children:`Show shortcuts`})]}),(0,x.jsx)(m,{label:`Unavailable`,children:(0,x.jsx)(p,{icon:`lock`,disabled:!0,children:`Locked option`})}),(0,x.jsx)(m,{label:`Danger zone`,children:(0,x.jsx)(p,{icon:`delete`,variant:`destructive`,onClick:e,children:`Delete project`})})]})})},k={name:`Overflow content`,render:()=>(0,x.jsx)(v,{label:`Open overflow menu`,children:({close:e})=>(0,x.jsx)(x.Fragment,{children:(0,x.jsxs)(m,{label:`Extremely long section label that should wrap instead of pushing outside the menu`,children:[(0,x.jsx)(p,{icon:`drive_file_rename_outline`,shortcut:`Command+Option+Shift+Control+K`,onClick:e,children:`Rename the component-with-an-exceptionally-long-unbroken-identifier-for-QA`}),(0,x.jsx)(p,{icon:`link`,onClick:e,children:`Copy https://example.com/a/path/with/a/very/long/unbroken/segment/that/still/stays-inside`}),(0,x.jsx)(p,{icon:`delete`,variant:`destructive`,onClick:e,children:`Delete legacy-release-candidate-navigation-snapshot-with-a-long-name`})]})})})},A={name:`With nearby content`,render:()=>(0,x.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-16)`,maxWidth:`520px`},children:[(0,x.jsx)(_,{color:`muted`,children:`Menus expose contextual actions without moving the user away from the current surface. Use clear item labels and reserve destructive actions for the final section.`}),(0,x.jsx)(v,{label:`Open actions`,children:({close:e})=>(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)(m,{children:[(0,x.jsx)(p,{icon:`edit`,onClick:e,children:`Edit details`}),(0,x.jsx)(p,{icon:`share`,onClick:e,children:`Share`}),(0,x.jsx)(p,{icon:`download`,onClick:e,children:`Download`})]}),(0,x.jsx)(m,{children:(0,x.jsx)(p,{icon:`delete`,variant:`destructive`,onClick:e,children:`Delete`})})]})})]})},j=`Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.`,M={name:`Viewport alignment`,parameters:{layout:`padded`},render:()=>(0,x.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-24)`,maxWidth:`640px`},children:[(0,x.jsxs)(_,{color:`muted`,children:[j,` `,j]}),(0,x.jsxs)(_,{color:`muted`,children:[j,` `,j]}),(0,x.jsx)(_,{color:`muted`,children:j}),(0,x.jsx)(`div`,{style:{display:`flex`,justifyContent:`center`},children:(0,x.jsx)(v,{label:`Open menu`,children:({close:e})=>(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)(m,{label:`Actions`,children:[(0,x.jsx)(p,{icon:`edit`,shortcut:`E`,onClick:e,children:`Rename`}),(0,x.jsx)(p,{icon:`content_copy`,shortcut:`D`,onClick:e,children:`Duplicate`}),(0,x.jsx)(p,{icon:`share`,onClick:e,children:`Share`}),(0,x.jsx)(p,{icon:`download`,onClick:e,children:`Download`}),(0,x.jsx)(p,{icon:`archive`,onClick:e,children:`Archive`})]}),(0,x.jsx)(m,{children:(0,x.jsx)(p,{icon:`delete`,variant:`destructive`,onClick:e,children:`Delete`})})]})})}),(0,x.jsx)(_,{color:`muted`,children:j}),(0,x.jsxs)(_,{color:`muted`,children:[j,` `,j]}),(0,x.jsxs)(_,{color:`muted`,children:[j,` `,j]}),(0,x.jsx)(_,{color:`muted`,children:j}),(0,x.jsxs)(_,{color:`muted`,children:[j,` `,j]})]})},N={name:`[A11y] Keyboard navigation`,tags:[`a11y`,`a11y-required`],parameters:{layout:`padded`},render:()=>(0,x.jsx)(v,{label:`Open actions menu`,children:({close:e})=>(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)(m,{label:`Actions`,children:[(0,x.jsx)(p,{icon:`edit`,onClick:e,children:`Rename`}),(0,x.jsx)(p,{icon:`share`,onClick:e,children:`Share`}),(0,x.jsx)(p,{icon:`download`,onClick:e,children:`Download`}),(0,x.jsx)(p,{icon:`lock`,disabled:!0,children:`Restricted action`})]}),(0,x.jsx)(m,{children:(0,x.jsx)(p,{icon:`delete`,variant:`destructive`,onClick:e,children:`Delete`})})]})}),play:async({canvasElement:e})=>{let t=w(e).getByRole(`button`,{name:/open actions menu/i});await S.click(t),await C(()=>w(document.body).getByRole(`dialog`)),await S.keyboard(`{Escape}`),await C(()=>{if(document.querySelector(`[role="dialog"]`))throw Error(`Dialog still open`)})}},P={name:`[A11y] High contrast theme`,tags:[`a11y`,`a11y-theme`],globals:{theme:`a1Accessible`},parameters:{layout:`padded`},render:()=>(0,x.jsx)(v,{label:`Open menu (high contrast)`,children:({close:e})=>(0,x.jsx)(x.Fragment,{children:(0,x.jsxs)(m,{label:`Actions`,children:[(0,x.jsx)(p,{icon:`edit`,onClick:e,children:`Rename`}),(0,x.jsx)(p,{icon:`delete`,variant:`destructive`,onClick:e,children:`Delete`})]})})}),play:async({canvasElement:e})=>{let t=w(e);await S.click(t.getByRole(`button`,{name:/open menu/i})),await C(()=>w(document.body).getByRole(`dialog`))}},F={name:`[A11y] ⚠ Icon trigger missing label (negative example)`,tags:[`a11y`,`a11y-negative-example`],parameters:{layout:`padded`},render:()=>{let[e,t]=(0,b.useState)(!1);return(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(a,{icon:`more_vert`,label:``,onClick:()=>t(!0),"aria-haspopup":`dialog`,"aria-expanded":e}),(0,x.jsx)(h,{open:e,onClose:()=>t(!1),children:()=>(0,x.jsx)(m,{children:(0,x.jsx)(p,{icon:`edit`,onClick:()=>t(!1),children:`Edit`})})})]})}},I={name:`Card context menu`,parameters:{layout:`padded`},render:()=>(0,x.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(260px, 1fr))`,gap:`var(--base-spacing-16)`,maxWidth:`860px`},children:[(0,x.jsx)(y,{title:`Q3 Brand Refresh`,description:`Update the color palette and typographic scale across all marketing surfaces.`}),(0,x.jsx)(y,{title:`Component Audit`,description:`Review all 48 components for accessibility compliance against WCAG 2.1 AA.`}),(0,x.jsx)(y,{title:`Token Migration`,description:`Move legacy hardcoded values to semantic design tokens before the v2 release.`}),(0,x.jsx)(y,{title:`Dark Mode QA`,description:`Test every screen in the Heritage and Accessible themes under dark mode conditions.`})]})},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
  name: "Overflow content",
  render: () => <MenuTrigger label="Open overflow menu">
      {({
      close
    }) => <>
          <MenuSection label="Extremely long section label that should wrap instead of pushing outside the menu">
            <MenuItem icon="drive_file_rename_outline" shortcut="Command+Option+Shift+Control+K" onClick={close}>
              Rename the component-with-an-exceptionally-long-unbroken-identifier-for-QA
            </MenuItem>
            <MenuItem icon="link" onClick={close}>
              Copy https://example.com/a/path/with/a/very/long/unbroken/segment/that/still/stays-inside
            </MenuItem>
            <MenuItem icon="delete" variant="destructive" onClick={close}>
              Delete legacy-release-candidate-navigation-snapshot-with-a-long-name
            </MenuItem>
          </MenuSection>
        </>}
    </MenuTrigger>
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...A.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
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
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  name: "[A11y] Keyboard navigation",
  tags: ["a11y", "a11y-required"],
  parameters: {
    layout: "padded"
  },
  render: () => <MenuTrigger label="Open actions menu">
      {({
      close
    }) => <>
          <MenuSection label="Actions">
            <MenuItem icon="edit" onClick={close}>Rename</MenuItem>
            <MenuItem icon="share" onClick={close}>Share</MenuItem>
            <MenuItem icon="download" onClick={close}>Download</MenuItem>
            <MenuItem icon="lock" disabled>Restricted action</MenuItem>
          </MenuSection>
          <MenuSection>
            <MenuItem icon="delete" variant="destructive" onClick={close}>Delete</MenuItem>
          </MenuSection>
        </>}
    </MenuTrigger>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", {
      name: /open actions menu/i
    });
    await userEvent.click(trigger);
    await waitFor(() => within(document.body).getByRole("dialog"));
    // Press Escape — dialog should close and focus should return to trigger
    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      const dialog = document.querySelector('[role="dialog"]');
      if (dialog) throw new Error("Dialog still open");
    });
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  name: "[A11y] High contrast theme",
  tags: ["a11y", "a11y-theme"],
  globals: {
    theme: "a1Accessible"
  },
  parameters: {
    layout: "padded"
  },
  render: () => <MenuTrigger label="Open menu (high contrast)">
      {({
      close
    }) => <>
          <MenuSection label="Actions">
            <MenuItem icon="edit" onClick={close}>Rename</MenuItem>
            <MenuItem icon="delete" variant="destructive" onClick={close}>Delete</MenuItem>
          </MenuSection>
        </>}
    </MenuTrigger>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", {
      name: /open menu/i
    }));
    await waitFor(() => within(document.body).getByRole("dialog"));
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  name: "[A11y] ⚠ Icon trigger missing label (negative example)",
  tags: ["a11y", "a11y-negative-example"],
  parameters: {
    layout: "padded"
  },
  render: () => {
    const [open, setOpen] = useState(false);
    return <>
        {/* Missing aria-label on icon button — screen reader cannot announce purpose */}
        <IconButton icon="more_vert" label="" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open} />
        <Menu open={open} onClose={() => setOpen(false)}>
          {() => <MenuSection>
              <MenuItem icon="edit" onClick={() => setOpen(false)}>Edit</MenuItem>
            </MenuSection>}
        </Menu>
      </>;
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...I.parameters?.docs?.source}}},L=[`AccountMenu`,`Sections`,`ItemStates`,`OverflowContent`,`WithIntroText`,`ViewportAlignment`,`A11yKeyboardNavigation`,`A11yHighContrast`,`A11yIconTriggerMissingLabel`,`CardContextMenu`]}))();export{P as A11yHighContrast,F as A11yIconTriggerMissingLabel,N as A11yKeyboardNavigation,E as AccountMenu,I as CardContextMenu,O as ItemStates,k as OverflowContent,D as Sections,M as ViewportAlignment,A as WithIntroText,L as __namedExportsOrder,T as default};