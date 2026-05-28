import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{C as n,t as r}from"./iframe-BwSdWSBC.js";import{r as i,t as a}from"./Heading-D0Pp0q-v.js";import{n as o,t as s}from"./Paragraph-CS8wKw09.js";import{a as c,i as l,n as u,r as d,t as f}from"./Tabs-CqrTfQ5q.js";function p({title:e}){return(0,h.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-8)`},children:[(0,h.jsx)(a,{as:`h3`,type:`heading`,size:`xs`,children:e}),(0,h.jsxs)(s,{color:`muted`,size:`sm`,children:[`This is the content area for the `,(0,h.jsx)(`strong`,{children:e}),` tab. Add any components or markup here — it will only render when this tab is active.`]})]})}var m,h,g,_,v,y,b,x,S,C,w,T;e((()=>{m=t(n(),1),c(),i(),o(),h=r(),g={title:`Components/Controls/Tabs`,parameters:{layout:`padded`}},_={name:`Line (standard)`,render:()=>{let[e,t]=(0,m.useState)(`overview`);return(0,h.jsxs)(l,{value:e,onChange:t,variant:`line`,children:[(0,h.jsxs)(u,{children:[(0,h.jsx)(f,{value:`overview`,children:`Overview`}),(0,h.jsx)(f,{value:`activity`,children:`Activity`}),(0,h.jsx)(f,{value:`settings`,children:`Settings`}),(0,h.jsx)(f,{value:`members`,children:`Members`})]}),(0,h.jsx)(d,{value:`overview`,children:(0,h.jsx)(p,{title:`Overview`})}),(0,h.jsx)(d,{value:`activity`,children:(0,h.jsx)(p,{title:`Activity`})}),(0,h.jsx)(d,{value:`settings`,children:(0,h.jsx)(p,{title:`Settings`})}),(0,h.jsx)(d,{value:`members`,children:(0,h.jsx)(p,{title:`Members`})})]})}},v={name:`With count badges`,render:()=>{let[e,t]=(0,m.useState)(`inbox`);return(0,h.jsxs)(l,{value:e,onChange:t,variant:`line`,children:[(0,h.jsxs)(u,{children:[(0,h.jsx)(f,{value:`inbox`,count:12,children:`Inbox`}),(0,h.jsx)(f,{value:`sent`,count:0,children:`Sent`}),(0,h.jsx)(f,{value:`drafts`,count:3,children:`Drafts`}),(0,h.jsx)(f,{value:`archived`,children:`Archived`})]}),(0,h.jsx)(d,{value:`inbox`,children:(0,h.jsx)(p,{title:`Inbox`})}),(0,h.jsx)(d,{value:`sent`,children:(0,h.jsx)(p,{title:`Sent`})}),(0,h.jsx)(d,{value:`drafts`,children:(0,h.jsx)(p,{title:`Drafts`})}),(0,h.jsx)(d,{value:`archived`,children:(0,h.jsx)(p,{title:`Archived`})})]})}},y={name:`With icons — inline`,render:()=>{let[e,t]=(0,m.useState)(`home`);return(0,h.jsxs)(l,{value:e,onChange:t,variant:`line`,children:[(0,h.jsxs)(u,{children:[(0,h.jsx)(f,{value:`home`,icon:`home`,children:`Home`}),(0,h.jsx)(f,{value:`explore`,icon:`explore`,children:`Explore`}),(0,h.jsx)(f,{value:`notifications`,icon:`notifications`,count:5,children:`Alerts`}),(0,h.jsx)(f,{value:`settings`,icon:`settings`,iconPosition:`end`,children:`Settings`})]}),(0,h.jsx)(d,{value:`home`,children:(0,h.jsx)(p,{title:`Home`})}),(0,h.jsx)(d,{value:`explore`,children:(0,h.jsx)(p,{title:`Explore`})}),(0,h.jsx)(d,{value:`notifications`,children:(0,h.jsx)(p,{title:`Alerts`})}),(0,h.jsx)(d,{value:`settings`,children:(0,h.jsx)(p,{title:`Settings`})})]})}},b={name:`With icons — above`,render:()=>{let[e,t]=(0,m.useState)(`home`);return(0,h.jsxs)(l,{value:e,onChange:t,variant:`line`,children:[(0,h.jsxs)(u,{children:[(0,h.jsx)(f,{value:`home`,icon:`home`,iconPosition:`above`,children:`Home`}),(0,h.jsx)(f,{value:`explore`,icon:`explore`,iconPosition:`above`,children:`Explore`}),(0,h.jsx)(f,{value:`notifications`,icon:`notifications`,iconPosition:`above`,count:5,children:`Alerts`}),(0,h.jsx)(f,{value:`profile`,icon:`person`,iconPosition:`above`,children:`Profile`}),(0,h.jsx)(f,{value:`settings`,icon:`settings`,iconPosition:`above`,children:`Settings`})]}),(0,h.jsx)(d,{value:`home`,children:(0,h.jsx)(p,{title:`Home`})}),(0,h.jsx)(d,{value:`explore`,children:(0,h.jsx)(p,{title:`Explore`})}),(0,h.jsx)(d,{value:`notifications`,children:(0,h.jsx)(p,{title:`Alerts`})}),(0,h.jsx)(d,{value:`profile`,children:(0,h.jsx)(p,{title:`Profile`})}),(0,h.jsx)(d,{value:`settings`,children:(0,h.jsx)(p,{title:`Settings`})})]})}},x={name:`Overflow (many tabs)`,render:()=>{let[e,t]=(0,m.useState)(`general`),n=[`General`,`Appearance`,`Security`,`Notifications`,`Billing`,`Integrations`,`API`,`Webhooks`,`Members`,`Roles`,`Audit log`,`Advanced`];return(0,h.jsx)(`div`,{style:{maxWidth:480},children:(0,h.jsxs)(l,{value:e,onChange:t,variant:`line`,children:[(0,h.jsx)(u,{children:n.map(e=>(0,h.jsx)(f,{value:e.toLowerCase().replace(` `,`-`),children:e},e))}),n.map(e=>(0,h.jsx)(d,{value:e.toLowerCase().replace(` `,`-`),children:(0,h.jsx)(p,{title:e})},e))]})})}},S={name:`Folder (browser tab)`,render:()=>{let[e,t]=(0,m.useState)(`general`);return(0,h.jsxs)(l,{value:e,onChange:t,variant:`folder`,children:[(0,h.jsxs)(u,{children:[(0,h.jsx)(f,{value:`general`,children:`General`}),(0,h.jsx)(f,{value:`appearance`,children:`Appearance`}),(0,h.jsx)(f,{value:`security`,children:`Security`}),(0,h.jsx)(f,{value:`billing`,children:`Billing`})]}),(0,h.jsx)(d,{value:`general`,children:(0,h.jsx)(p,{title:`General`})}),(0,h.jsx)(d,{value:`appearance`,children:(0,h.jsx)(p,{title:`Appearance`})}),(0,h.jsx)(d,{value:`security`,children:(0,h.jsx)(p,{title:`Security`})}),(0,h.jsx)(d,{value:`billing`,children:(0,h.jsx)(p,{title:`Billing`})})]})}},C={name:`Folder with nested line`,render:()=>{let[e,t]=(0,m.useState)(`files`),[n,r]=(0,m.useState)(`all`);return(0,h.jsxs)(l,{value:e,onChange:t,variant:`folder`,level:1,children:[(0,h.jsxs)(u,{children:[(0,h.jsx)(f,{value:`files`,children:`Files`}),(0,h.jsx)(f,{value:`history`,children:`History`}),(0,h.jsx)(f,{value:`shared`,children:`Shared`})]}),(0,h.jsx)(d,{value:`files`,children:(0,h.jsxs)(l,{value:n,onChange:r,variant:`line`,level:2,children:[(0,h.jsxs)(u,{children:[(0,h.jsx)(f,{value:`all`,children:`All files`}),(0,h.jsx)(f,{value:`images`,children:`Images`}),(0,h.jsx)(f,{value:`documents`,children:`Documents`}),(0,h.jsx)(f,{value:`other`,children:`Other`})]}),(0,h.jsx)(d,{value:`all`,children:(0,h.jsx)(p,{title:`All files`})}),(0,h.jsx)(d,{value:`images`,children:(0,h.jsx)(p,{title:`Images`})}),(0,h.jsx)(d,{value:`documents`,children:(0,h.jsx)(p,{title:`Documents`})}),(0,h.jsx)(d,{value:`other`,children:(0,h.jsx)(p,{title:`Other`})})]})}),(0,h.jsx)(d,{value:`history`,children:(0,h.jsx)(p,{title:`History`})}),(0,h.jsx)(d,{value:`shared`,children:(0,h.jsx)(p,{title:`Shared`})})]})}},w={name:`Progress (stepper)`,render:()=>{let[e,t]=(0,m.useState)(`details`),n=[{value:`account`,label:`Account`,status:`completed`},{value:`plan`,label:`Plan`,status:`completed`},{value:`details`,label:`Details`,status:`in-progress`},{value:`review`,label:`Review`,status:`todo`},{value:`confirm`,label:`Confirm`,status:`todo`}];n.find(t=>t.value===e);let r={completed:`Completed`,"in-progress":`In progress`,todo:`Not started`};return(0,h.jsxs)(l,{value:e,onChange:t,variant:`progress`,children:[(0,h.jsx)(u,{children:n.map(e=>(0,h.jsx)(f,{value:e.value,status:e.status,children:e.label},e.value))}),n.map(e=>(0,h.jsx)(d,{value:e.value,children:(0,h.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-8)`},children:[(0,h.jsxs)(a,{as:`h3`,type:`heading`,size:`xs`,children:[`Step `,n.indexOf(e)+1,`: `,e.label]}),(0,h.jsxs)(s,{color:`muted`,size:`sm`,children:[`Status: `,(0,h.jsx)(`strong`,{children:r[e.status]}),`. Fill in the required information for this step before continuing to the next.`]})]})},e.value))]})}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: "Line (standard)",
  render: () => {
    const [active, setActive] = useState("overview");
    return <Tabs value={active} onChange={setActive} variant="line">
        <TabList>
          <Tab value="overview">Overview</Tab>
          <Tab value="activity">Activity</Tab>
          <Tab value="settings">Settings</Tab>
          <Tab value="members">Members</Tab>
        </TabList>
        <TabPanel value="overview"><SamplePanel title="Overview" /></TabPanel>
        <TabPanel value="activity"><SamplePanel title="Activity" /></TabPanel>
        <TabPanel value="settings"><SamplePanel title="Settings" /></TabPanel>
        <TabPanel value="members"><SamplePanel title="Members" /></TabPanel>
      </Tabs>;
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: "With count badges",
  render: () => {
    const [active, setActive] = useState("inbox");
    return <Tabs value={active} onChange={setActive} variant="line">
        <TabList>
          <Tab value="inbox" count={12}>Inbox</Tab>
          <Tab value="sent" count={0}>Sent</Tab>
          <Tab value="drafts" count={3}>Drafts</Tab>
          <Tab value="archived">Archived</Tab>
        </TabList>
        <TabPanel value="inbox"><SamplePanel title="Inbox" /></TabPanel>
        <TabPanel value="sent"><SamplePanel title="Sent" /></TabPanel>
        <TabPanel value="drafts"><SamplePanel title="Drafts" /></TabPanel>
        <TabPanel value="archived"><SamplePanel title="Archived" /></TabPanel>
      </Tabs>;
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: "With icons — inline",
  render: () => {
    const [active, setActive] = useState("home");
    return <Tabs value={active} onChange={setActive} variant="line">
        <TabList>
          <Tab value="home" icon="home">Home</Tab>
          <Tab value="explore" icon="explore">Explore</Tab>
          <Tab value="notifications" icon="notifications" count={5}>Alerts</Tab>
          <Tab value="settings" icon="settings" iconPosition="end">Settings</Tab>
        </TabList>
        <TabPanel value="home"><SamplePanel title="Home" /></TabPanel>
        <TabPanel value="explore"><SamplePanel title="Explore" /></TabPanel>
        <TabPanel value="notifications"><SamplePanel title="Alerts" /></TabPanel>
        <TabPanel value="settings"><SamplePanel title="Settings" /></TabPanel>
      </Tabs>;
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: "With icons — above",
  render: () => {
    const [active, setActive] = useState("home");
    return <Tabs value={active} onChange={setActive} variant="line">
        <TabList>
          <Tab value="home" icon="home" iconPosition="above">Home</Tab>
          <Tab value="explore" icon="explore" iconPosition="above">Explore</Tab>
          <Tab value="notifications" icon="notifications" iconPosition="above" count={5}>Alerts</Tab>
          <Tab value="profile" icon="person" iconPosition="above">Profile</Tab>
          <Tab value="settings" icon="settings" iconPosition="above">Settings</Tab>
        </TabList>
        <TabPanel value="home"><SamplePanel title="Home" /></TabPanel>
        <TabPanel value="explore"><SamplePanel title="Explore" /></TabPanel>
        <TabPanel value="notifications"><SamplePanel title="Alerts" /></TabPanel>
        <TabPanel value="profile"><SamplePanel title="Profile" /></TabPanel>
        <TabPanel value="settings"><SamplePanel title="Settings" /></TabPanel>
      </Tabs>;
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: "Overflow (many tabs)",
  render: () => {
    const [active, setActive] = useState("general");
    const tabs = ["General", "Appearance", "Security", "Notifications", "Billing", "Integrations", "API", "Webhooks", "Members", "Roles", "Audit log", "Advanced"];
    return <div style={{
      maxWidth: 480
    }}>
        <Tabs value={active} onChange={setActive} variant="line">
          <TabList>
            {tabs.map(t => <Tab key={t} value={t.toLowerCase().replace(" ", "-")}>{t}</Tab>)}
          </TabList>
          {tabs.map(t => <TabPanel key={t} value={t.toLowerCase().replace(" ", "-")}>
              <SamplePanel title={t} />
            </TabPanel>)}
        </Tabs>
      </div>;
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  name: "Folder (browser tab)",
  render: () => {
    const [active, setActive] = useState("general");
    return <Tabs value={active} onChange={setActive} variant="folder">
        <TabList>
          <Tab value="general">General</Tab>
          <Tab value="appearance">Appearance</Tab>
          <Tab value="security">Security</Tab>
          <Tab value="billing">Billing</Tab>
        </TabList>
        <TabPanel value="general"><SamplePanel title="General" /></TabPanel>
        <TabPanel value="appearance"><SamplePanel title="Appearance" /></TabPanel>
        <TabPanel value="security"><SamplePanel title="Security" /></TabPanel>
        <TabPanel value="billing"><SamplePanel title="Billing" /></TabPanel>
      </Tabs>;
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  name: "Folder with nested line",
  render: () => {
    const [primary, setPrimary] = useState("files");
    const [secondary, setSecondary] = useState("all");
    return <Tabs value={primary} onChange={setPrimary} variant="folder" level={1}>
        <TabList>
          <Tab value="files">Files</Tab>
          <Tab value="history">History</Tab>
          <Tab value="shared">Shared</Tab>
        </TabList>

        <TabPanel value="files">
          <Tabs value={secondary} onChange={setSecondary} variant="line" level={2}>
            <TabList>
              <Tab value="all">All files</Tab>
              <Tab value="images">Images</Tab>
              <Tab value="documents">Documents</Tab>
              <Tab value="other">Other</Tab>
            </TabList>
            <TabPanel value="all"><SamplePanel title="All files" /></TabPanel>
            <TabPanel value="images"><SamplePanel title="Images" /></TabPanel>
            <TabPanel value="documents"><SamplePanel title="Documents" /></TabPanel>
            <TabPanel value="other"><SamplePanel title="Other" /></TabPanel>
          </Tabs>
        </TabPanel>

        <TabPanel value="history"><SamplePanel title="History" /></TabPanel>
        <TabPanel value="shared"><SamplePanel title="Shared" /></TabPanel>
      </Tabs>;
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  name: "Progress (stepper)",
  render: () => {
    const [active, setActive] = useState("details");
    const steps = [{
      value: "account",
      label: "Account",
      status: "completed"
    }, {
      value: "plan",
      label: "Plan",
      status: "completed"
    }, {
      value: "details",
      label: "Details",
      status: "in-progress"
    }, {
      value: "review",
      label: "Review",
      status: "todo"
    }, {
      value: "confirm",
      label: "Confirm",
      status: "todo"
    }];
    const current = steps.find(s => s.value === active);
    const statusLabel = {
      "completed": "Completed",
      "in-progress": "In progress",
      "todo": "Not started"
    };
    return <Tabs value={active} onChange={setActive} variant="progress">
        <TabList>
          {steps.map(s => <Tab key={s.value} value={s.value} status={s.status}>
              {s.label}
            </Tab>)}
        </TabList>
        {steps.map(s => <TabPanel key={s.value} value={s.value}>
            <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--base-spacing-8)"
        }}>
              <Heading as="h3" type="heading" size="xs">
                Step {steps.indexOf(s) + 1}: {s.label}
              </Heading>
              <Paragraph color="muted" size="sm">
                Status: <strong>{statusLabel[s.status]}</strong>. Fill in the required
                information for this step before continuing to the next.
              </Paragraph>
            </div>
          </TabPanel>)}
      </Tabs>;
  }
}`,...w.parameters?.docs?.source}}},T=[`Line`,`WithCount`,`WithIconInline`,`WithIconAbove`,`Overflow`,`Folder`,`FolderNested`,`Progress`]}))();export{S as Folder,C as FolderNested,_ as Line,x as Overflow,w as Progress,v as WithCount,b as WithIconAbove,y as WithIconInline,T as __namedExportsOrder,g as default};