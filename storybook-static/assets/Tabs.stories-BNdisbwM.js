import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{C as n,t as r}from"./iframe-DGQSYM4W.js";import{n as i,t as a}from"./Heading-B-e_yNFm.js";import{n as o,t as s}from"./Paragraph-BY7bSblY.js";var c=e((()=>{}));function l({children:e,value:t,onChange:n,variant:r=`line`,level:i=1}){let a=(0,p.useId)();return(0,m.jsx)(h.Provider,{value:{value:t,onChange:n,variant:r,level:i,uid:a},children:(0,m.jsx)(`div`,{className:`a1-tabs a1-tabs--level-${i}`,children:e})})}function u({children:e}){let{variant:t}=(0,p.useContext)(h);return(0,m.jsx)(`div`,{role:`tablist`,className:`a1-tab-list a1-tab-list--${t}`,onKeyDown:e=>{let t=Array.from(e.currentTarget.querySelectorAll(`[role="tab"]:not([disabled])`)),n=t.indexOf(document.activeElement);if(n===-1)return;let r=-1;e.key===`ArrowRight`||e.key===`ArrowDown`?r=(n+1)%t.length:e.key===`ArrowLeft`||e.key===`ArrowUp`?r=(n-1+t.length)%t.length:e.key===`Home`?r=0:e.key===`End`&&(r=t.length-1),r!==-1&&(e.preventDefault(),t[r].focus(),t[r].click())},children:e})}function d({children:e,value:t}){let{value:n,onChange:r,variant:i,uid:a}=(0,p.useContext)(h),o=n===t;return(0,m.jsx)(`button`,{role:`tab`,type:`button`,id:`${a}-tab-${t}`,"aria-selected":o,"aria-controls":`${a}-panel-${t}`,tabIndex:o?0:-1,className:`a1-tab a1-tab--${i}`,onClick:()=>r?.(t),children:e})}function f({children:e,value:t}){let{value:n,variant:r,uid:i}=(0,p.useContext)(h);return n===t?(0,m.jsx)(`div`,{role:`tabpanel`,id:`${i}-panel-${t}`,"aria-labelledby":`${i}-tab-${t}`,className:`a1-tab-panel a1-tab-panel--${r}`,children:e}):null}var p,m,h,g=e((()=>{p=t(n(),1),c(),m=r(),h=(0,p.createContext)(null),l.__docgenInfo={description:``,methods:[],displayName:`Tabs`,props:{variant:{defaultValue:{value:`"line"`,computed:!1},required:!1},level:{defaultValue:{value:`1`,computed:!1},required:!1}}},u.__docgenInfo={description:``,methods:[],displayName:`TabList`},d.__docgenInfo={description:``,methods:[],displayName:`Tab`},f.__docgenInfo={description:``,methods:[],displayName:`TabPanel`}}));function _({title:e}){return(0,y.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-8)`},children:[(0,y.jsx)(a,{as:`h3`,type:`heading`,size:`xs`,children:e}),(0,y.jsxs)(s,{color:`muted`,size:`sm`,children:[`This is the content area for the `,(0,y.jsx)(`strong`,{children:e}),` tab. Add any components or markup here — it will only render when this tab is active.`]})]})}var v,y,b,x,S,C,w;e((()=>{v=t(n(),1),g(),i(),o(),y=r(),b={title:`Components/Controls/Tabs`,parameters:{layout:`padded`}},x={name:`Line (standard)`,render:()=>{let[e,t]=(0,v.useState)(`overview`);return(0,y.jsxs)(l,{value:e,onChange:t,variant:`line`,children:[(0,y.jsxs)(u,{children:[(0,y.jsx)(d,{value:`overview`,children:`Overview`}),(0,y.jsx)(d,{value:`activity`,children:`Activity`}),(0,y.jsx)(d,{value:`settings`,children:`Settings`}),(0,y.jsx)(d,{value:`members`,children:`Members`})]}),(0,y.jsx)(f,{value:`overview`,children:(0,y.jsx)(_,{title:`Overview`})}),(0,y.jsx)(f,{value:`activity`,children:(0,y.jsx)(_,{title:`Activity`})}),(0,y.jsx)(f,{value:`settings`,children:(0,y.jsx)(_,{title:`Settings`})}),(0,y.jsx)(f,{value:`members`,children:(0,y.jsx)(_,{title:`Members`})})]})}},S={name:`Folder (browser tab)`,render:()=>{let[e,t]=(0,v.useState)(`general`);return(0,y.jsxs)(l,{value:e,onChange:t,variant:`folder`,children:[(0,y.jsxs)(u,{children:[(0,y.jsx)(d,{value:`general`,children:`General`}),(0,y.jsx)(d,{value:`appearance`,children:`Appearance`}),(0,y.jsx)(d,{value:`security`,children:`Security`}),(0,y.jsx)(d,{value:`billing`,children:`Billing`})]}),(0,y.jsx)(f,{value:`general`,children:(0,y.jsx)(_,{title:`General`})}),(0,y.jsx)(f,{value:`appearance`,children:(0,y.jsx)(_,{title:`Appearance`})}),(0,y.jsx)(f,{value:`security`,children:(0,y.jsx)(_,{title:`Security`})}),(0,y.jsx)(f,{value:`billing`,children:(0,y.jsx)(_,{title:`Billing`})})]})}},C={name:`Folder with nested line`,render:()=>{let[e,t]=(0,v.useState)(`files`),[n,r]=(0,v.useState)(`all`);return(0,y.jsxs)(l,{value:e,onChange:t,variant:`folder`,level:1,children:[(0,y.jsxs)(u,{children:[(0,y.jsx)(d,{value:`files`,children:`Files`}),(0,y.jsx)(d,{value:`history`,children:`History`}),(0,y.jsx)(d,{value:`shared`,children:`Shared`})]}),(0,y.jsx)(f,{value:`files`,children:(0,y.jsxs)(l,{value:n,onChange:r,variant:`line`,level:2,children:[(0,y.jsxs)(u,{children:[(0,y.jsx)(d,{value:`all`,children:`All files`}),(0,y.jsx)(d,{value:`images`,children:`Images`}),(0,y.jsx)(d,{value:`documents`,children:`Documents`}),(0,y.jsx)(d,{value:`other`,children:`Other`})]}),(0,y.jsx)(f,{value:`all`,children:(0,y.jsx)(_,{title:`All files`})}),(0,y.jsx)(f,{value:`images`,children:(0,y.jsx)(_,{title:`Images`})}),(0,y.jsx)(f,{value:`documents`,children:(0,y.jsx)(_,{title:`Documents`})}),(0,y.jsx)(f,{value:`other`,children:(0,y.jsx)(_,{title:`Other`})})]})}),(0,y.jsx)(f,{value:`history`,children:(0,y.jsx)(_,{title:`History`})}),(0,y.jsx)(f,{value:`shared`,children:(0,y.jsx)(_,{title:`Shared`})})]})}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...C.parameters?.docs?.source}}},w=[`Line`,`Folder`,`FolderNested`]}))();export{S as Folder,C as FolderNested,x as Line,w as __namedExportsOrder,b as default};