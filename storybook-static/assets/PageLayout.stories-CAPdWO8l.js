import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{C as n,t as r}from"./iframe-DGQSYM4W.js";import{n as i,t as a}from"./Heading-B-e_yNFm.js";import{n as o,t as s}from"./Paragraph-BY7bSblY.js";import{n as c,t as l}from"./IconButton-CAS16IIw.js";import{i as u,n as d,r as f,t as p}from"./SideNav-CUSorMnj.js";var m=e((()=>{}));function h({header:e,footer:t,sidebar:n,sidebarPlacement:r=`start`,stickyHeader:i=!1,className:a=``,children:o,...s}){return(0,g.jsxs)(`div`,{className:[`a1-page-layout`,i&&`a1-page-layout--sticky-header`,n&&`a1-page-layout--sidebar-${r}`,a].filter(Boolean).join(` `),...s,children:[e&&(0,g.jsx)(`header`,{className:`a1-page-layout__header`,children:e}),(0,g.jsxs)(`div`,{className:`a1-page-layout__body`,children:[n&&(0,g.jsx)(`aside`,{className:`a1-page-layout__sidebar`,children:n}),(0,g.jsx)(`main`,{className:`a1-page-layout__main`,children:o})]}),t&&(0,g.jsx)(`footer`,{className:`a1-page-layout__footer`,children:t})]})}var g,_=e((()=>{m(),g=r(),h.__docgenInfo={description:``,methods:[],displayName:`PageLayout`,props:{sidebarPlacement:{defaultValue:{value:`"start"`,computed:!1},required:!1},stickyHeader:{defaultValue:{value:`false`,computed:!1},required:!1},className:{defaultValue:{value:`""`,computed:!1},required:!1}}}}));function v({label:e,height:t=120}){return(0,C.jsx)(`div`,{style:{height:t,borderRadius:`var(--base-radius-lg)`,background:`var(--semantic-color-surface-raised)`,border:`1px dashed var(--semantic-color-border-subtle)`,display:`flex`,alignItems:`center`,justifyContent:`center`},children:(0,C.jsx)(s,{size:`xs`,color:`muted`,children:e})})}function y({collapsed:e}){return(0,C.jsxs)(a,{as:`div`,type:`heading`,size:`xs`,children:[(0,C.jsx)(`span`,{style:{color:`var(--semantic-color-text-default)`},children:`A1`}),!e&&(0,C.jsxs)(C.Fragment,{children:[(0,C.jsx)(`span`,{style:{color:`var(--semantic-color-text-default)`},children:`:`}),(0,C.jsx)(`span`,{style:{color:`var(--semantic-color-text-accent)`},children:`Design`})]})]})}function b(){return(0,C.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`var(--base-spacing-8)`,padding:`var(--base-spacing-8)`},children:[(0,C.jsx)(`div`,{style:{width:32,height:32,borderRadius:`50%`,background:`var(--semantic-color-text-muted)`,flexShrink:0}}),(0,C.jsxs)(`div`,{style:{minWidth:0},children:[(0,C.jsx)(`div`,{style:{fontSize:13,fontWeight:500,color:`var(--semantic-color-text-default)`,whiteSpace:`nowrap`,overflow:`hidden`,textOverflow:`ellipsis`},children:`Jane Smith`}),(0,C.jsx)(`div`,{style:{fontSize:12,color:`var(--semantic-color-text-muted)`,whiteSpace:`nowrap`,overflow:`hidden`,textOverflow:`ellipsis`},children:`jane@acme.com`})]})]})}function x(){return(0,C.jsxs)(C.Fragment,{children:[(0,C.jsx)(f,{href:`#`,icon:`home`,label:`Dashboard`,active:!0}),(0,C.jsxs)(d,{icon:`folder`,label:`Projects`,defaultOpen:!0,children:[(0,C.jsx)(f,{href:`#`,label:`All Projects`}),(0,C.jsx)(f,{href:`#`,label:`Active`}),(0,C.jsx)(f,{href:`#`,label:`Archived`})]}),(0,C.jsxs)(d,{icon:`people`,label:`Team`,children:[(0,C.jsx)(f,{href:`#`,label:`Members`}),(0,C.jsx)(f,{href:`#`,label:`Roles & Permissions`})]}),(0,C.jsx)(f,{href:`#`,icon:`bar_chart`,label:`Analytics`}),(0,C.jsx)(f,{href:`#`,icon:`settings`,label:`Settings`})]})}var S,C,w,T,E,D,O,k,A,j,M;e((()=>{S=t(n(),1),_(),i(),c(),o(),u(),C=r(),w={title:`Components/Containers/Page Layout`,component:h,parameters:{layout:`fullscreen`},tags:[`autodocs`],argTypes:{sidebarPlacement:{control:`inline-radio`,options:[`start`,`end`]},stickyHeader:{control:`boolean`}}},T={padding:`var(--base-spacing-12) var(--base-spacing-16)`,background:`var(--semantic-color-surface-page)`,borderBottom:`1px solid var(--semantic-color-border-subtle)`,display:`flex`,alignItems:`center`,gap:`var(--base-spacing-12)`},E={padding:`var(--base-spacing-16) var(--base-spacing-24)`,background:`var(--semantic-color-surface-panel)`,borderTop:`1px solid var(--semantic-color-border-subtle)`},D={padding:`var(--base-spacing-24)`},O={name:`Header + Footer`,render:()=>(0,C.jsx)(h,{header:(0,C.jsx)(`div`,{style:T,children:(0,C.jsx)(a,{as:`span`,size:`xs`,children:`A1 Design System`})}),footer:(0,C.jsx)(`div`,{style:E,children:(0,C.jsx)(s,{size:`xs`,color:`muted`,children:`© 2026 A1. All rights reserved.`})}),children:(0,C.jsxs)(`div`,{style:D,children:[(0,C.jsx)(s,{style:{marginBottom:`var(--base-spacing-16)`},children:`Main content area.`}),(0,C.jsx)(v,{label:`Content block`,height:200})]})})},k={name:`With Sidebar`,render:()=>{let[e,t]=(0,S.useState)(!1);return(0,C.jsx)(h,{header:(0,C.jsxs)(`div`,{style:T,children:[(0,C.jsx)(l,{icon:`menu`,label:`Open navigation`,className:`a1-pl-story-menu-btn`,onClick:()=>t(!0)}),(0,C.jsx)(a,{as:`span`,size:`xs`,children:`Dashboard`}),(0,C.jsx)(`style`,{children:`@media (min-width: 1025px) { .a1-pl-story-menu-btn.a1-icon-button { display: none; } }`})]}),footer:(0,C.jsx)(`div`,{style:E,children:(0,C.jsx)(s,{size:`xs`,color:`muted`,children:`© 2026 A1. All rights reserved.`})}),sidebar:(0,C.jsx)(p,{open:e,onClose:()=>t(!1),header:e=>(0,C.jsx)(y,{collapsed:e}),footer:(0,C.jsx)(b,{}),children:(0,C.jsx)(x,{})}),children:(0,C.jsxs)(`div`,{style:D,children:[(0,C.jsx)(s,{style:{marginBottom:`var(--base-spacing-16)`},children:`Main content area. Resize the preview to see the SideNav respond: persistent at lg/xl, overlay at sm/md, full-width at xs.`}),(0,C.jsx)(v,{label:`Content block`,height:240})]})})}},A={name:`With Right SideNav`,render:()=>{let[e,t]=(0,S.useState)(!1);return(0,C.jsx)(h,{sidebarPlacement:`end`,header:(0,C.jsxs)(`div`,{style:T,children:[(0,C.jsx)(a,{as:`span`,size:`xs`,children:`Dashboard`}),(0,C.jsx)(l,{icon:`menu`,label:`Open navigation`,className:`a1-pl-story-menu-btn`,onClick:()=>t(!0),style:{marginInlineStart:`auto`}}),(0,C.jsx)(`style`,{children:`@media (min-width: 1025px) { .a1-pl-story-menu-btn.a1-icon-button { display: none; } }`})]}),footer:(0,C.jsx)(`div`,{style:E,children:(0,C.jsx)(s,{size:`xs`,color:`muted`,children:`© 2026 A1. All rights reserved.`})}),sidebar:(0,C.jsx)(p,{placement:`end`,open:e,onClose:()=>t(!1),header:e=>(0,C.jsx)(y,{collapsed:e}),footer:(0,C.jsx)(b,{}),children:(0,C.jsx)(x,{})}),children:(0,C.jsxs)(`div`,{style:D,children:[(0,C.jsx)(s,{style:{marginBottom:`var(--base-spacing-16)`},children:`Main content area with navigation placed on the right edge.`}),(0,C.jsx)(v,{label:`Content block`,height:240})]})})}},j={name:`Sticky Header`,render:()=>(0,C.jsx)(h,{stickyHeader:!0,header:(0,C.jsxs)(`div`,{style:{...T,boxShadow:`var(--semantic-shadow-sm)`},children:[(0,C.jsx)(a,{as:`span`,size:`xs`,children:`Sticky Header`}),(0,C.jsx)(s,{size:`xs`,color:`muted`,children:`— scroll the page to see it stay fixed`})]}),children:(0,C.jsx)(`div`,{style:D,children:Array.from({length:12},(e,t)=>(0,C.jsx)(`div`,{style:{marginBottom:`var(--base-spacing-16)`},children:(0,C.jsx)(v,{label:`Content block ${t+1}`,height:80})},t))})})},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  name: "Header + Footer",
  render: () => <PageLayout header={<div style={headerStyle}>
          <Heading as="span" size="xs">A1 Design System</Heading>
        </div>} footer={<div style={footerStyle}>
          <Paragraph size="xs" color="muted">© 2026 A1. All rights reserved.</Paragraph>
        </div>}>
      <div style={mainStyle}>
        <Paragraph style={{
        marginBottom: "var(--base-spacing-16)"
      }}>Main content area.</Paragraph>
        <Placeholder label="Content block" height={200} />
      </div>
    </PageLayout>
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  name: "With Sidebar",
  render: () => {
    const [navOpen, setNavOpen] = useState(false);
    return <PageLayout header={<div style={headerStyle}>
            {/* Menu button: hidden at lg+ via compound-class specificity */}
            <IconButton icon="menu" label="Open navigation" className="a1-pl-story-menu-btn" onClick={() => setNavOpen(true)} />
            <Heading as="span" size="xs">Dashboard</Heading>
            <style>{\`@media (min-width: 1025px) { .a1-pl-story-menu-btn.a1-icon-button { display: none; } }\`}</style>
          </div>} footer={<div style={footerStyle}>
            <Paragraph size="xs" color="muted">© 2026 A1. All rights reserved.</Paragraph>
          </div>} sidebar={<SideNav open={navOpen} onClose={() => setNavOpen(false)} header={collapsed => <AppLogo collapsed={collapsed} />} footer={<UserFooter />}>
            <DemoNavItems />
          </SideNav>}>
        <div style={mainStyle}>
          <Paragraph style={{
          marginBottom: "var(--base-spacing-16)"
        }}>
            Main content area. Resize the preview to see the SideNav respond: persistent at lg/xl, overlay at sm/md, full-width at xs.
          </Paragraph>
          <Placeholder label="Content block" height={240} />
        </div>
      </PageLayout>;
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  name: "With Right SideNav",
  render: () => {
    const [navOpen, setNavOpen] = useState(false);
    return <PageLayout sidebarPlacement="end" header={<div style={headerStyle}>
            <Heading as="span" size="xs">Dashboard</Heading>
            {/* Menu button: hidden at lg+ via compound-class specificity */}
            <IconButton icon="menu" label="Open navigation" className="a1-pl-story-menu-btn" onClick={() => setNavOpen(true)} style={{
        marginInlineStart: "auto"
      }} />
            <style>{\`@media (min-width: 1025px) { .a1-pl-story-menu-btn.a1-icon-button { display: none; } }\`}</style>
          </div>} footer={<div style={footerStyle}>
            <Paragraph size="xs" color="muted">© 2026 A1. All rights reserved.</Paragraph>
          </div>} sidebar={<SideNav placement="end" open={navOpen} onClose={() => setNavOpen(false)} header={collapsed => <AppLogo collapsed={collapsed} />} footer={<UserFooter />}>
            <DemoNavItems />
          </SideNav>}>
        <div style={mainStyle}>
          <Paragraph style={{
          marginBottom: "var(--base-spacing-16)"
        }}>
            Main content area with navigation placed on the right edge.
          </Paragraph>
          <Placeholder label="Content block" height={240} />
        </div>
      </PageLayout>;
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  name: "Sticky Header",
  render: () => <PageLayout stickyHeader header={<div style={{
    ...headerStyle,
    boxShadow: "var(--semantic-shadow-sm)"
  }}>
          <Heading as="span" size="xs">Sticky Header</Heading>
          <Paragraph size="xs" color="muted">— scroll the page to see it stay fixed</Paragraph>
        </div>}>
      <div style={mainStyle}>
        {Array.from({
        length: 12
      }, (_, i) => <div key={i} style={{
        marginBottom: "var(--base-spacing-16)"
      }}>
            <Placeholder label={\`Content block \${i + 1}\`} height={80} />
          </div>)}
      </div>
    </PageLayout>
}`,...j.parameters?.docs?.source}}},M=[`HeaderAndFooter`,`WithSidebar`,`WithRightSideNav`,`StickyHeader`]}))();export{O as HeaderAndFooter,j as StickyHeader,A as WithRightSideNav,k as WithSidebar,M as __namedExportsOrder,w as default};