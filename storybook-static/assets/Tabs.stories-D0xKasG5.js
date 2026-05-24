import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{C as n,t as r}from"./iframe-D1JN-_Xq.js";import{n as i,t as a}from"./Heading-ouMjY5HL.js";import{n as o,t as s}from"./Paragraph-CrxcTh6-.js";import{a as c,i as l,n as u,r as d,t as f}from"./Tabs-CTpdJSFO.js";function p({title:e}){return(0,h.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-8)`},children:[(0,h.jsx)(a,{as:`h3`,type:`heading`,size:`xs`,children:e}),(0,h.jsxs)(s,{color:`muted`,size:`sm`,children:[`This is the content area for the `,(0,h.jsx)(`strong`,{children:e}),` tab. Add any components or markup here — it will only render when this tab is active.`]})]})}var m,h,g,_,v,y,b;e((()=>{m=t(n(),1),c(),i(),o(),h=r(),g={title:`Components/Controls/Tabs`,parameters:{layout:`padded`}},_={name:`Line (standard)`,render:()=>{let[e,t]=(0,m.useState)(`overview`);return(0,h.jsxs)(l,{value:e,onChange:t,variant:`line`,children:[(0,h.jsxs)(u,{children:[(0,h.jsx)(f,{value:`overview`,children:`Overview`}),(0,h.jsx)(f,{value:`activity`,children:`Activity`}),(0,h.jsx)(f,{value:`settings`,children:`Settings`}),(0,h.jsx)(f,{value:`members`,children:`Members`})]}),(0,h.jsx)(d,{value:`overview`,children:(0,h.jsx)(p,{title:`Overview`})}),(0,h.jsx)(d,{value:`activity`,children:(0,h.jsx)(p,{title:`Activity`})}),(0,h.jsx)(d,{value:`settings`,children:(0,h.jsx)(p,{title:`Settings`})}),(0,h.jsx)(d,{value:`members`,children:(0,h.jsx)(p,{title:`Members`})})]})}},v={name:`Folder (browser tab)`,render:()=>{let[e,t]=(0,m.useState)(`general`);return(0,h.jsxs)(l,{value:e,onChange:t,variant:`folder`,children:[(0,h.jsxs)(u,{children:[(0,h.jsx)(f,{value:`general`,children:`General`}),(0,h.jsx)(f,{value:`appearance`,children:`Appearance`}),(0,h.jsx)(f,{value:`security`,children:`Security`}),(0,h.jsx)(f,{value:`billing`,children:`Billing`})]}),(0,h.jsx)(d,{value:`general`,children:(0,h.jsx)(p,{title:`General`})}),(0,h.jsx)(d,{value:`appearance`,children:(0,h.jsx)(p,{title:`Appearance`})}),(0,h.jsx)(d,{value:`security`,children:(0,h.jsx)(p,{title:`Security`})}),(0,h.jsx)(d,{value:`billing`,children:(0,h.jsx)(p,{title:`Billing`})})]})}},y={name:`Folder with nested line`,render:()=>{let[e,t]=(0,m.useState)(`files`),[n,r]=(0,m.useState)(`all`);return(0,h.jsxs)(l,{value:e,onChange:t,variant:`folder`,level:1,children:[(0,h.jsxs)(u,{children:[(0,h.jsx)(f,{value:`files`,children:`Files`}),(0,h.jsx)(f,{value:`history`,children:`History`}),(0,h.jsx)(f,{value:`shared`,children:`Shared`})]}),(0,h.jsx)(d,{value:`files`,children:(0,h.jsxs)(l,{value:n,onChange:r,variant:`line`,level:2,children:[(0,h.jsxs)(u,{children:[(0,h.jsx)(f,{value:`all`,children:`All files`}),(0,h.jsx)(f,{value:`images`,children:`Images`}),(0,h.jsx)(f,{value:`documents`,children:`Documents`}),(0,h.jsx)(f,{value:`other`,children:`Other`})]}),(0,h.jsx)(d,{value:`all`,children:(0,h.jsx)(p,{title:`All files`})}),(0,h.jsx)(d,{value:`images`,children:(0,h.jsx)(p,{title:`Images`})}),(0,h.jsx)(d,{value:`documents`,children:(0,h.jsx)(p,{title:`Documents`})}),(0,h.jsx)(d,{value:`other`,children:(0,h.jsx)(p,{title:`Other`})})]})}),(0,h.jsx)(d,{value:`history`,children:(0,h.jsx)(p,{title:`History`})}),(0,h.jsx)(d,{value:`shared`,children:(0,h.jsx)(p,{title:`Shared`})})]})}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}},b=[`Line`,`Folder`,`FolderNested`]}))();export{v as Folder,y as FolderNested,_ as Line,b as __namedExportsOrder,g as default};