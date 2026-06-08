import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{T as n,r}from"./iframe-DZoRqkgT.js";import{n as i,t as a}from"./Button-Clq9-j9U.js";import{n as o,t as s}from"./Card-CP5t58sT.js";import{n as c,r as l}from"./Message-Ph28UWWh.js";import{i as u,r as d}from"./icon-controls-BKzEgQc5.js";import{n as f,t as p}from"./Dialog-BEiUT3bt.js";var m,h,g,_,v,y,b;e((()=>{l(),i(),o(),f(),m=t(n(),1),d(),h=r(),g={title:`Components/Messaging/Empty State`,component:c,tags:[`autodocs`],parameters:{layout:`padded`},args:{icon:`inbox`,title:`Nothing here yet`,description:`Content will appear here once it's available.`,scale:`section`},argTypes:{scale:{control:`inline-radio`,options:[`page`,`section`,`card`]},icon:{...u(`A1 icon registry name`)},title:{control:`text`},description:{control:`text`}}},_={render:e=>(0,h.jsx)(c,{...e,action:e.scale===`card`?void 0:(0,h.jsx)(a,{variant:e.scale===`page`?`primary`:`secondary`,children:`Get started`})})},v={name:`All scales`,parameters:{controls:{include:[]}},render:()=>(0,h.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-64)`},children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`p`,{style:{margin:`0 0 var(--base-spacing-16)`,fontFamily:`monospace`,fontSize:`var(--semantic-font-size-body-xs)`,color:`var(--semantic-color-text-muted)`},children:`scale="page"`}),(0,h.jsx)(`div`,{style:{border:`1px dashed var(--semantic-color-border-subtle)`,borderRadius:`var(--base-radius-lg)`},children:(0,h.jsx)(c,{scale:`page`,icon:`folder`,title:`No projects yet`,description:`Create your first project to start organising your work and collaborating with your team.`,action:(0,h.jsx)(a,{variant:`primary`,icon:`add`,children:`New project`})})})]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`p`,{style:{margin:`0 0 var(--base-spacing-16)`,fontFamily:`monospace`,fontSize:`var(--semantic-font-size-body-xs)`,color:`var(--semantic-color-text-muted)`},children:`scale="section"`}),(0,h.jsx)(`div`,{style:{border:`1px dashed var(--semantic-color-border-subtle)`,borderRadius:`var(--base-radius-lg)`},children:(0,h.jsx)(c,{scale:`section`,icon:`notifications_off`,title:`No notifications`,description:`You're all caught up. We'll let you know when something needs your attention.`,action:(0,h.jsx)(a,{variant:`secondary`,children:`Manage preferences`})})})]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`p`,{style:{margin:`0 0 var(--base-spacing-16)`,fontFamily:`monospace`,fontSize:`var(--semantic-font-size-body-xs)`,color:`var(--semantic-color-text-muted)`},children:`scale="card"`}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:`var(--base-spacing-16)`,flexWrap:`wrap`},children:[(0,h.jsx)(s,{style:{width:`220px`},children:(0,h.jsx)(c,{scale:`card`,icon:`bar_chart`,title:`No data yet`,description:`Data will appear once activity is recorded.`})}),(0,h.jsx)(s,{style:{width:`220px`},children:(0,h.jsx)(c,{scale:`card`,icon:`people`,title:`No members`,description:`Invite people to get started.`,action:(0,h.jsx)(a,{variant:`tertiary`,size:`sm`,children:`Invite`})})})]})]})]})},y={name:`In a dialog`,parameters:{controls:{include:[]}},render:()=>{let[e,t]=(0,m.useState)(!1);return(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(a,{onClick:()=>t(!0),children:`Open dialog`}),(0,h.jsx)(p,{open:e,onClose:()=>t(!1),title:`Recent activity`,children:(0,h.jsx)(c,{scale:`card`,icon:`history`,title:`No activity`,description:`Actions will appear here as they happen.`})})]})}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: args => <MessageEmptyState {...args} action={args.scale !== "card" ? <Button variant={args.scale === "page" ? "primary" : "secondary"}>Get started</Button> : undefined} />
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
          <MessageEmptyState scale="page" icon="folder" title="No projects yet" description="Create your first project to start organising your work and collaborating with your team." action={<Button variant="primary" icon="add">New project</Button>} />
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
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}},b=[`Configurable`,`Scales`,`InDialog`]}))();export{_ as Configurable,y as InDialog,v as Scales,b as __namedExportsOrder,g as default};