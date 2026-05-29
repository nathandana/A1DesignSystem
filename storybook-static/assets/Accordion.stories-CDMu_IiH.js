import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{C as n,t as r}from"./iframe-CkqopHIr.js";import{n as i,t as a}from"./Button-DBF41v8C.js";import{n as o,t as s}from"./Paragraph-BhXhxuLC.js";import{n as c,t as l}from"./Accordion-CjBPc6Cq.js";var u,d,f,p,m,h,g,_,v,y,b,x;e((()=>{u=t(n(),1),c(),i(),o(),d=r(),f=`Consequat anim esse aliqua magna esse officia proident exercitation. Amet ullamco commodo laborum Lorem aliqua eu aliquip duis elit. Exercitation nostrud cupidatat aliqua labore aliquip.`,p={title:`Components/Controls/Accordion`,component:l,tags:[`autodocs`],parameters:{layout:`padded`},args:{label:`Accordion item`,size:`md`,disabled:!1,defaultOpen:!1,children:f},argTypes:{label:{control:`text`},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]},disabled:{control:`boolean`},defaultOpen:{control:`boolean`},open:{control:`boolean`,description:`Controlled open state`}}},m={},h={name:`Sizes`,parameters:{controls:{include:[]}},render:()=>(0,d.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-4)`,maxWidth:560},children:[(0,d.jsx)(l,{label:`Small`,size:`sm`,children:(0,d.jsx)(s,{size:`sm`,color:`muted`,style:{padding:`var(--base-spacing-8) var(--base-spacing-16) var(--base-spacing-16)`},children:f})}),(0,d.jsx)(l,{label:`Medium (default)`,size:`md`,children:(0,d.jsx)(s,{size:`md`,color:`muted`,style:{padding:`var(--base-spacing-12) var(--base-spacing-20) var(--base-spacing-20)`},children:f})}),(0,d.jsx)(l,{label:`Large`,size:`lg`,children:(0,d.jsx)(s,{size:`lg`,color:`muted`,style:{padding:`var(--base-spacing-16) var(--base-spacing-24) var(--base-spacing-24)`},children:f})})]})},g={name:`Default open`,args:{label:`This starts open`,defaultOpen:!0,children:f},decorators:[e=>(0,d.jsx)(`div`,{style:{maxWidth:560},children:(0,d.jsx)(e,{})})]},_={name:`Controlled`,parameters:{controls:{include:[]}},render:()=>{let[e,t]=(0,u.useState)(!1);return(0,d.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-16)`,maxWidth:560},children:[(0,d.jsxs)(`div`,{style:{display:`flex`,gap:`var(--base-spacing-8)`},children:[(0,d.jsx)(a,{size:`sm`,variant:`secondary`,onClick:()=>t(!0),children:`Expand`}),(0,d.jsx)(a,{size:`sm`,variant:`secondary`,onClick:()=>t(!1),children:`Collapse`})]}),(0,d.jsx)(l,{label:`Controlled accordion`,open:e,onChange:t,children:(0,d.jsx)(s,{color:`muted`,style:{padding:`var(--base-spacing-12) var(--base-spacing-20) var(--base-spacing-20)`},children:f})})]})}},v={name:`Disabled`,parameters:{controls:{include:[]}},render:()=>(0,d.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-4)`,maxWidth:560},children:[(0,d.jsx)(l,{label:`Enabled item`,children:(0,d.jsx)(s,{color:`muted`,style:{padding:`var(--base-spacing-12) var(--base-spacing-20) var(--base-spacing-20)`},children:f})}),(0,d.jsx)(l,{label:`Disabled item`,disabled:!0,children:(0,d.jsx)(s,{color:`muted`,style:{padding:`var(--base-spacing-12) var(--base-spacing-20) var(--base-spacing-20)`},children:f})}),(0,d.jsx)(l,{label:`Disabled and open`,disabled:!0,defaultOpen:!0,children:(0,d.jsx)(s,{color:`muted`,style:{padding:`var(--base-spacing-12) var(--base-spacing-20) var(--base-spacing-20)`},children:f})})]})},y=[{q:`What is a design system?`,a:`A design system is a collection of reusable components, guided by clear standards, that can be assembled to build any number of applications.`},{q:`How do I install the package?`,a:`Run npm install @a1/react in your project, then import the components you need. Make sure to load the token CSS at your app root.`},{q:`Can I use the components without React?`,a:`The core tokens and CSS are framework-agnostic. The React package provides pre-built components, but you can use the token CSS with any framework.`},{q:`How are tokens structured?`,a:`Tokens follow a three-tier model: base (raw values), semantic (contextual intent), and component (component-specific overrides). This separation makes theming predictable.`}],b={name:`FAQ group`,parameters:{controls:{include:[]}},render:()=>{let[e,t]=(0,u.useState)(null);return(0,d.jsx)(`div`,{style:{maxWidth:560,border:`1px solid var(--semantic-color-border-subtle)`,borderRadius:`var(--base-radius-lg)`,overflow:`hidden`},children:y.map((n,r)=>(0,d.jsx)(`div`,{style:{borderBottom:r<y.length-1?`1px solid var(--semantic-color-border-subtle)`:void 0},children:(0,d.jsx)(l,{label:n.q,open:e===r,onChange:e=>t(e?r:null),children:(0,d.jsx)(s,{color:`muted`,style:{padding:`var(--base-spacing-4) var(--base-spacing-20) var(--base-spacing-20)`},children:n.a})})},n.q))})}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}},x=[`Configurable`,`Sizes`,`DefaultOpen`,`Controlled`,`Disabled`,`Group`]}))();export{m as Configurable,_ as Controlled,g as DefaultOpen,v as Disabled,b as Group,h as Sizes,x as __namedExportsOrder,p as default};