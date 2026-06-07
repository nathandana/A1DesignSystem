import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{C as n,t as r}from"./iframe-D8uQ9hre.js";import{n as i,t as a}from"./Button-Ceq8Bvz0.js";import{n as o,t as s}from"./Paragraph-E9JaBz9b.js";import{n as c,t as l}from"./Accordion-D9HnNNVv.js";var u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D;e((()=>{u=t(n(),1),c(),i(),o(),d=r(),{userEvent:f,within:p,waitFor:m}=__STORYBOOK_MODULE_TEST__,h=`Consequat anim esse aliqua magna esse officia proident exercitation. Amet ullamco commodo laborum Lorem aliqua eu aliquip duis elit. Exercitation nostrud cupidatat aliqua labore aliquip.`,g={title:`Components/Controls/Accordion`,component:l,tags:[`autodocs`],parameters:{layout:`padded`},args:{label:`Accordion item`,size:`md`,disabled:!1,defaultOpen:!1,children:h},argTypes:{label:{control:`text`},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]},disabled:{control:`boolean`},defaultOpen:{control:`boolean`},open:{control:`boolean`,description:`Controlled open state`}}},_={},v={name:`Sizes`,parameters:{controls:{include:[]}},render:()=>(0,d.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-4)`,maxWidth:560},children:[(0,d.jsx)(l,{label:`Small`,size:`sm`,children:(0,d.jsx)(s,{size:`sm`,color:`muted`,style:{padding:`var(--base-spacing-8) var(--base-spacing-16) var(--base-spacing-16)`},children:h})}),(0,d.jsx)(l,{label:`Medium (default)`,size:`md`,children:(0,d.jsx)(s,{size:`md`,color:`muted`,style:{padding:`var(--base-spacing-12) var(--base-spacing-20) var(--base-spacing-20)`},children:h})}),(0,d.jsx)(l,{label:`Large`,size:`lg`,children:(0,d.jsx)(s,{size:`lg`,color:`muted`,style:{padding:`var(--base-spacing-16) var(--base-spacing-24) var(--base-spacing-24)`},children:h})})]})},y={name:`Default open`,args:{label:`This starts open`,defaultOpen:!0,children:h},decorators:[e=>(0,d.jsx)(`div`,{style:{maxWidth:560},children:(0,d.jsx)(e,{})})]},b={name:`Controlled`,parameters:{controls:{include:[]}},render:()=>{let[e,t]=(0,u.useState)(!1);return(0,d.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-16)`,maxWidth:560},children:[(0,d.jsxs)(`div`,{style:{display:`flex`,gap:`var(--base-spacing-8)`},children:[(0,d.jsx)(a,{size:`sm`,variant:`secondary`,onClick:()=>t(!0),children:`Expand`}),(0,d.jsx)(a,{size:`sm`,variant:`secondary`,onClick:()=>t(!1),children:`Collapse`})]}),(0,d.jsx)(l,{label:`Controlled accordion`,open:e,onChange:t,children:(0,d.jsx)(s,{color:`muted`,style:{padding:`var(--base-spacing-12) var(--base-spacing-20) var(--base-spacing-20)`},children:h})})]})}},x={name:`Disabled`,parameters:{controls:{include:[]}},render:()=>(0,d.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-4)`,maxWidth:560},children:[(0,d.jsx)(l,{label:`Enabled item`,children:(0,d.jsx)(s,{color:`muted`,style:{padding:`var(--base-spacing-12) var(--base-spacing-20) var(--base-spacing-20)`},children:h})}),(0,d.jsx)(l,{label:`Disabled item`,disabled:!0,children:(0,d.jsx)(s,{color:`muted`,style:{padding:`var(--base-spacing-12) var(--base-spacing-20) var(--base-spacing-20)`},children:h})}),(0,d.jsx)(l,{label:`Disabled and open`,disabled:!0,defaultOpen:!0,children:(0,d.jsx)(s,{color:`muted`,style:{padding:`var(--base-spacing-12) var(--base-spacing-20) var(--base-spacing-20)`},children:h})})]})},S=[{q:`What is a design system?`,a:`A design system is a collection of reusable components, guided by clear standards, that can be assembled to build any number of applications.`},{q:`How do I install the package?`,a:`Run npm install @a1/react in your project, then import the components you need. Make sure to load the token CSS at your app root.`},{q:`Can I use the components without React?`,a:`The core tokens and CSS are framework-agnostic. The React package provides pre-built components, but you can use the token CSS with any framework.`},{q:`How are tokens structured?`,a:`Tokens follow a three-tier model: base (raw values), semantic (contextual intent), and component (component-specific overrides). This separation makes theming predictable.`}],C={name:`FAQ group`,parameters:{controls:{include:[]}},render:()=>{let[e,t]=(0,u.useState)(null);return(0,d.jsx)(`div`,{style:{maxWidth:560,border:`1px solid var(--semantic-color-border-subtle)`,borderRadius:`var(--base-radius-lg)`,overflow:`hidden`},children:S.map((n,r)=>(0,d.jsx)(`div`,{style:{borderBottom:r<S.length-1?`1px solid var(--semantic-color-border-subtle)`:void 0},children:(0,d.jsx)(l,{label:n.q,open:e===r,onChange:e=>t(e?r:null),children:(0,d.jsx)(s,{color:`muted`,style:{padding:`var(--base-spacing-4) var(--base-spacing-20) var(--base-spacing-20)`},children:n.a})})},n.q))})}},w={name:`[A11y] Keyboard toggle`,tags:[`a11y`,`a11y-required`],parameters:{layout:`padded`},args:{label:`Keyboard navigation`,children:`This panel was opened using the keyboard. The trigger button uses aria-expanded and aria-controls to communicate state and relationship to assistive technology.`},play:async({canvasElement:e})=>{let t=p(e).getByRole(`button`,{name:`Keyboard navigation`});await t.focus(),await f.keyboard(`{Enter}`),await m(()=>{if(t.getAttribute(`aria-expanded`)!==`true`)throw Error(`Not expanded`)}),await f.keyboard(` `),await m(()=>{if(t.getAttribute(`aria-expanded`)!==`false`)throw Error(`Not collapsed`)})}},T={name:`[A11y] High contrast theme`,tags:[`a11y`,`a11y-theme`],globals:{theme:`a1Accessible`},parameters:{layout:`padded`},args:{label:`High contrast accordion`,defaultOpen:!0,children:`Verify focus ring, chevron, label, and body text contrast under the Accessible theme.`}},E={name:`[A11y] Disabled state`,tags:[`a11y`,`a11y-edge-case`],parameters:{layout:`padded`},args:{label:`Disabled accordion`,disabled:!0,children:h}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: "Sizes",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-4)",
    maxWidth: 560
  }}>
      <Accordion label="Small" size="sm">
        <Paragraph size="sm" color="muted" style={{
        padding: "var(--base-spacing-8) var(--base-spacing-16) var(--base-spacing-16)"
      }}>
          {LOREM}
        </Paragraph>
      </Accordion>
      <Accordion label="Medium (default)" size="md">
        <Paragraph size="md" color="muted" style={{
        padding: "var(--base-spacing-12) var(--base-spacing-20) var(--base-spacing-20)"
      }}>
          {LOREM}
        </Paragraph>
      </Accordion>
      <Accordion label="Large" size="lg">
        <Paragraph size="lg" color="muted" style={{
        padding: "var(--base-spacing-16) var(--base-spacing-24) var(--base-spacing-24)"
      }}>
          {LOREM}
        </Paragraph>
      </Accordion>
    </div>
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: "Default open",
  args: {
    label: "This starts open",
    defaultOpen: true,
    children: LOREM
  },
  decorators: [Story => <div style={{
    maxWidth: 560
  }}>
        <Story />
      </div>]
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: "Controlled",
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
      maxWidth: 560
    }}>
        <div style={{
        display: "flex",
        gap: "var(--base-spacing-8)"
      }}>
          <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>Expand</Button>
          <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>Collapse</Button>
        </div>
        <Accordion label="Controlled accordion" open={open} onChange={setOpen}>
          <Paragraph color="muted" style={{
          padding: "var(--base-spacing-12) var(--base-spacing-20) var(--base-spacing-20)"
        }}>
            {LOREM}
          </Paragraph>
        </Accordion>
      </div>;
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: "Disabled",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-4)",
    maxWidth: 560
  }}>
      <Accordion label="Enabled item">
        <Paragraph color="muted" style={{
        padding: "var(--base-spacing-12) var(--base-spacing-20) var(--base-spacing-20)"
      }}>
          {LOREM}
        </Paragraph>
      </Accordion>
      <Accordion label="Disabled item" disabled>
        <Paragraph color="muted" style={{
        padding: "var(--base-spacing-12) var(--base-spacing-20) var(--base-spacing-20)"
      }}>
          {LOREM}
        </Paragraph>
      </Accordion>
      <Accordion label="Disabled and open" disabled defaultOpen>
        <Paragraph color="muted" style={{
        padding: "var(--base-spacing-12) var(--base-spacing-20) var(--base-spacing-20)"
      }}>
          {LOREM}
        </Paragraph>
      </Accordion>
    </div>
}`,...x.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  name: "FAQ group",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => {
    const [openId, setOpenId] = useState(null);
    return <div style={{
      maxWidth: 560,
      border: "1px solid var(--semantic-color-border-subtle)",
      borderRadius: "var(--base-radius-lg)",
      overflow: "hidden"
    }}>
        {FAQ.map((item, i) => <div key={item.q} style={{
        borderBottom: i < FAQ.length - 1 ? "1px solid var(--semantic-color-border-subtle)" : undefined
      }}>
            <Accordion label={item.q} open={openId === i} onChange={next => setOpenId(next ? i : null)}>
              <Paragraph color="muted" style={{
            padding: "var(--base-spacing-4) var(--base-spacing-20) var(--base-spacing-20)"
          }}>
                {item.a}
              </Paragraph>
            </Accordion>
          </div>)}
      </div>;
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  name: "[A11y] Keyboard toggle",
  tags: ["a11y", "a11y-required"],
  parameters: {
    layout: "padded"
  },
  args: {
    label: "Keyboard navigation",
    children: "This panel was opened using the keyboard. The trigger button uses aria-expanded and aria-controls to communicate state and relationship to assistive technology."
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", {
      name: "Keyboard navigation"
    });
    await trigger.focus();
    // Enter should open
    await userEvent.keyboard("{Enter}");
    await waitFor(() => {
      if (trigger.getAttribute("aria-expanded") !== "true") throw new Error("Not expanded");
    });
    // Space should close
    await userEvent.keyboard(" ");
    await waitFor(() => {
      if (trigger.getAttribute("aria-expanded") !== "false") throw new Error("Not collapsed");
    });
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  name: "[A11y] High contrast theme",
  tags: ["a11y", "a11y-theme"],
  globals: {
    theme: "a1Accessible"
  },
  parameters: {
    layout: "padded"
  },
  args: {
    label: "High contrast accordion",
    defaultOpen: true,
    children: "Verify focus ring, chevron, label, and body text contrast under the Accessible theme."
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  name: "[A11y] Disabled state",
  tags: ["a11y", "a11y-edge-case"],
  parameters: {
    layout: "padded"
  },
  args: {
    label: "Disabled accordion",
    disabled: true,
    children: LOREM
  }
}`,...E.parameters?.docs?.source}}},D=[`Configurable`,`Sizes`,`DefaultOpen`,`Controlled`,`Disabled`,`Group`,`A11yKeyboardToggle`,`A11yHighContrast`,`A11yDisabledState`]}))();export{E as A11yDisabledState,T as A11yHighContrast,w as A11yKeyboardToggle,_ as Configurable,b as Controlled,y as DefaultOpen,x as Disabled,C as Group,v as Sizes,D as __namedExportsOrder,g as default};