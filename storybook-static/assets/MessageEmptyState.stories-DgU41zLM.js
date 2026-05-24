import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{C as n,t as r}from"./iframe-DGQSYM4W.js";import{n as i,t as a}from"./Button-C3mTF-_Y.js";import{n as o,t as s}from"./Card-BA8g4Js7.js";import{n as c,t as l}from"./Dialog-DFxfdQ3X.js";import{i as u,r as d}from"./Message-CPsn3YgN.js";var f,p,m,h,g,_,v;e((()=>{u(),i(),o(),c(),f=t(n(),1),p=r(),m={title:`Components/Messaging/Empty State`,component:d,tags:[`autodocs`],parameters:{layout:`padded`},args:{icon:`inbox`,title:`Nothing here yet`,description:`Content will appear here once it's available.`,scale:`section`},argTypes:{scale:{control:`inline-radio`,options:[`page`,`section`,`card`]},icon:{control:`text`},title:{control:`text`},description:{control:`text`}}},h={render:e=>(0,p.jsx)(d,{...e,action:e.scale===`card`?void 0:(0,p.jsx)(a,{variant:e.scale===`page`?`primary`:`secondary`,children:`Get started`})})},g={name:`All scales`,parameters:{controls:{include:[]}},render:()=>(0,p.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-64)`},children:[(0,p.jsxs)(`div`,{children:[(0,p.jsx)(`p`,{style:{margin:`0 0 var(--base-spacing-16)`,fontFamily:`monospace`,fontSize:`var(--semantic-font-size-body-xs)`,color:`var(--semantic-color-text-muted)`},children:`scale="page"`}),(0,p.jsx)(`div`,{style:{border:`1px dashed var(--semantic-color-border-subtle)`,borderRadius:`var(--base-radius-lg)`},children:(0,p.jsx)(d,{scale:`page`,icon:`folder_open`,title:`No projects yet`,description:`Create your first project to start organising your work and collaborating with your team.`,action:(0,p.jsx)(a,{variant:`primary`,icon:`add`,children:`New project`})})})]}),(0,p.jsxs)(`div`,{children:[(0,p.jsx)(`p`,{style:{margin:`0 0 var(--base-spacing-16)`,fontFamily:`monospace`,fontSize:`var(--semantic-font-size-body-xs)`,color:`var(--semantic-color-text-muted)`},children:`scale="section"`}),(0,p.jsx)(`div`,{style:{border:`1px dashed var(--semantic-color-border-subtle)`,borderRadius:`var(--base-radius-lg)`},children:(0,p.jsx)(d,{scale:`section`,icon:`notifications_off`,title:`No notifications`,description:`You're all caught up. We'll let you know when something needs your attention.`,action:(0,p.jsx)(a,{variant:`secondary`,children:`Manage preferences`})})})]}),(0,p.jsxs)(`div`,{children:[(0,p.jsx)(`p`,{style:{margin:`0 0 var(--base-spacing-16)`,fontFamily:`monospace`,fontSize:`var(--semantic-font-size-body-xs)`,color:`var(--semantic-color-text-muted)`},children:`scale="card"`}),(0,p.jsxs)(`div`,{style:{display:`flex`,gap:`var(--base-spacing-16)`,flexWrap:`wrap`},children:[(0,p.jsx)(s,{style:{width:`220px`},children:(0,p.jsx)(d,{scale:`card`,icon:`bar_chart`,title:`No data yet`,description:`Data will appear once activity is recorded.`})}),(0,p.jsx)(s,{style:{width:`220px`},children:(0,p.jsx)(d,{scale:`card`,icon:`people`,title:`No members`,description:`Invite people to get started.`,action:(0,p.jsx)(a,{variant:`tertiary`,size:`sm`,children:`Invite`})})})]})]})]})},_={name:`In a dialog`,parameters:{controls:{include:[]}},render:()=>{let[e,t]=(0,f.useState)(!1);return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(a,{onClick:()=>t(!0),children:`Open dialog`}),(0,p.jsx)(l,{open:e,onClose:()=>t(!1),title:`Recent activity`,children:(0,p.jsx)(d,{scale:`card`,icon:`history`,title:`No activity`,description:`Actions will appear here as they happen.`})})]})}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <MessageEmptyState {...args} action={args.scale !== "card" ? <Button variant={args.scale === "page" ? "primary" : "secondary"}>Get started</Button> : undefined} />
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: "All scales",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-64)"
  }}>

      {/* Page */}
      <div>
        <p style={{
        margin: "0 0 var(--base-spacing-16)",
        fontFamily: "monospace",
        fontSize: "var(--semantic-font-size-body-xs)",
        color: "var(--semantic-color-text-muted)"
      }}>scale="page"</p>
        <div style={{
        border: "1px dashed var(--semantic-color-border-subtle)",
        borderRadius: "var(--base-radius-lg)"
      }}>
          <MessageEmptyState scale="page" icon="folder_open" title="No projects yet" description="Create your first project to start organising your work and collaborating with your team." action={<Button variant="primary" icon="add">New project</Button>} />
        </div>
      </div>

      {/* Section */}
      <div>
        <p style={{
        margin: "0 0 var(--base-spacing-16)",
        fontFamily: "monospace",
        fontSize: "var(--semantic-font-size-body-xs)",
        color: "var(--semantic-color-text-muted)"
      }}>scale="section"</p>
        <div style={{
        border: "1px dashed var(--semantic-color-border-subtle)",
        borderRadius: "var(--base-radius-lg)"
      }}>
          <MessageEmptyState scale="section" icon="notifications_off" title="No notifications" description="You're all caught up. We'll let you know when something needs your attention." action={<Button variant="secondary">Manage preferences</Button>} />
        </div>
      </div>

      {/* Card */}
      <div>
        <p style={{
        margin: "0 0 var(--base-spacing-16)",
        fontFamily: "monospace",
        fontSize: "var(--semantic-font-size-body-xs)",
        color: "var(--semantic-color-text-muted)"
      }}>scale="card"</p>
        <div style={{
        display: "flex",
        gap: "var(--base-spacing-16)",
        flexWrap: "wrap"
      }}>
          <Card style={{
          width: "220px"
        }}>
            <MessageEmptyState scale="card" icon="bar_chart" title="No data yet" description="Data will appear once activity is recorded." />
          </Card>
          <Card style={{
          width: "220px"
        }}>
            <MessageEmptyState scale="card" icon="people" title="No members" description="Invite people to get started." action={<Button variant="tertiary" size="sm">Invite</Button>} />
          </Card>
        </div>
      </div>

    </div>
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: "In a dialog",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => {
    const [open, setOpen] = useState(false);
    return <>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <Dialog open={open} onClose={() => setOpen(false)} title="Recent activity">
          <MessageEmptyState scale="card" icon="history" title="No activity" description="Actions will appear here as they happen." />
        </Dialog>
      </>;
  }
}`,..._.parameters?.docs?.source}}},v=[`Configurable`,`Scales`,`InDialog`]}))();export{h as Configurable,_ as InDialog,g as Scales,v as __namedExportsOrder,m as default};