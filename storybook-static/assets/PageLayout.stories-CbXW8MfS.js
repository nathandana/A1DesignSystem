import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{C as n,t as r}from"./iframe-D1JN-_Xq.js";import{n as i,t as a}from"./PageLayout-8HzTJJM0.js";import{i as o,n as s,r as c,t as l}from"./SideNav-BkWxeyS8.js";import{n as u,t as d}from"./IconButton-Bs34MGu3.js";import{n as f,t as p}from"./Heading-ouMjY5HL.js";import{n as m,t as h}from"./Paragraph-CrxcTh6-.js";function g({label:e,height:t=120}){return(0,x.jsx)(`div`,{style:{height:t,borderRadius:`var(--base-radius-lg)`,background:`var(--semantic-color-surface-raised)`,border:`1px dashed var(--semantic-color-border-subtle)`,display:`flex`,alignItems:`center`,justifyContent:`center`},children:(0,x.jsx)(h,{size:`xs`,color:`muted`,children:e})})}function _({collapsed:e}){return(0,x.jsxs)(p,{as:`div`,type:`heading`,size:`xs`,children:[(0,x.jsx)(`span`,{style:{color:`var(--semantic-color-text-default)`},children:`A1`}),!e&&(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(`span`,{style:{color:`var(--semantic-color-text-default)`},children:`:`}),(0,x.jsx)(`span`,{style:{color:`var(--semantic-color-text-accent)`},children:`Design`})]})]})}function v(){return(0,x.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`var(--base-spacing-8)`,padding:`var(--base-spacing-8)`},children:[(0,x.jsx)(`div`,{style:{width:32,height:32,borderRadius:`50%`,background:`var(--semantic-color-text-muted)`,flexShrink:0}}),(0,x.jsxs)(`div`,{style:{minWidth:0},children:[(0,x.jsx)(`div`,{style:{fontSize:13,fontWeight:500,color:`var(--semantic-color-text-default)`,whiteSpace:`nowrap`,overflow:`hidden`,textOverflow:`ellipsis`},children:`Jane Smith`}),(0,x.jsx)(`div`,{style:{fontSize:12,color:`var(--semantic-color-text-muted)`,whiteSpace:`nowrap`,overflow:`hidden`,textOverflow:`ellipsis`},children:`jane@acme.com`})]})]})}function y(){return(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(c,{href:`#`,icon:`home`,label:`Dashboard`,active:!0}),(0,x.jsxs)(s,{icon:`folder`,label:`Projects`,defaultOpen:!0,children:[(0,x.jsx)(c,{href:`#`,label:`All Projects`}),(0,x.jsx)(c,{href:`#`,label:`Active`}),(0,x.jsx)(c,{href:`#`,label:`Archived`})]}),(0,x.jsxs)(s,{icon:`people`,label:`Team`,children:[(0,x.jsx)(c,{href:`#`,label:`Members`}),(0,x.jsx)(c,{href:`#`,label:`Roles & Permissions`})]}),(0,x.jsx)(c,{href:`#`,icon:`bar_chart`,label:`Analytics`}),(0,x.jsx)(c,{href:`#`,icon:`settings`,label:`Settings`})]})}var b,x,S,C,w,T,E,D,O,k,A;e((()=>{b=t(n(),1),i(),f(),u(),m(),o(),x=r(),S={title:`Components/Containers/Page Layout`,component:a,parameters:{layout:`fullscreen`},tags:[`autodocs`],argTypes:{sidebarPlacement:{control:`inline-radio`,options:[`start`,`end`]},stickyHeader:{control:`boolean`}}},C={padding:`var(--base-spacing-12) var(--base-spacing-16)`,background:`var(--semantic-color-surface-page)`,borderBottom:`1px solid var(--semantic-color-border-subtle)`,display:`flex`,alignItems:`center`,gap:`var(--base-spacing-12)`},w={padding:`var(--base-spacing-16) var(--base-spacing-24)`,background:`var(--semantic-color-surface-panel)`,borderTop:`1px solid var(--semantic-color-border-subtle)`},T={padding:`var(--base-spacing-24)`},E={name:`Header + Footer`,render:()=>(0,x.jsx)(a,{header:(0,x.jsx)(`div`,{style:C,children:(0,x.jsx)(p,{as:`span`,size:`xs`,children:`A1 Design System`})}),footer:(0,x.jsx)(`div`,{style:w,children:(0,x.jsx)(h,{size:`xs`,color:`muted`,children:`© 2026 A1. All rights reserved.`})}),children:(0,x.jsxs)(`div`,{style:T,children:[(0,x.jsx)(h,{style:{marginBottom:`var(--base-spacing-16)`},children:`Main content area.`}),(0,x.jsx)(g,{label:`Content block`,height:200})]})})},D={name:`With Sidebar`,render:()=>{let[e,t]=(0,b.useState)(!1);return(0,x.jsx)(a,{header:(0,x.jsxs)(`div`,{style:C,children:[(0,x.jsx)(d,{icon:`menu`,label:`Open navigation`,className:`a1-pl-story-menu-btn`,onClick:()=>t(!0)}),(0,x.jsx)(p,{as:`span`,size:`xs`,children:`Dashboard`}),(0,x.jsx)(`style`,{children:`@media (min-width: 1025px) { .a1-pl-story-menu-btn.a1-icon-button { display: none; } }`})]}),footer:(0,x.jsx)(`div`,{style:w,children:(0,x.jsx)(h,{size:`xs`,color:`muted`,children:`© 2026 A1. All rights reserved.`})}),sidebar:(0,x.jsx)(l,{open:e,onClose:()=>t(!1),header:e=>(0,x.jsx)(_,{collapsed:e}),footer:(0,x.jsx)(v,{}),children:(0,x.jsx)(y,{})}),children:(0,x.jsxs)(`div`,{style:T,children:[(0,x.jsx)(h,{style:{marginBottom:`var(--base-spacing-16)`},children:`Main content area. Resize the preview to see the SideNav respond: persistent at lg/xl, overlay at sm/md, full-width at xs.`}),(0,x.jsx)(g,{label:`Content block`,height:240})]})})}},O={name:`With Right SideNav`,render:()=>{let[e,t]=(0,b.useState)(!1);return(0,x.jsx)(a,{sidebarPlacement:`end`,header:(0,x.jsxs)(`div`,{style:C,children:[(0,x.jsx)(p,{as:`span`,size:`xs`,children:`Dashboard`}),(0,x.jsx)(d,{icon:`menu`,label:`Open navigation`,className:`a1-pl-story-menu-btn`,onClick:()=>t(!0),style:{marginInlineStart:`auto`}}),(0,x.jsx)(`style`,{children:`@media (min-width: 1025px) { .a1-pl-story-menu-btn.a1-icon-button { display: none; } }`})]}),footer:(0,x.jsx)(`div`,{style:w,children:(0,x.jsx)(h,{size:`xs`,color:`muted`,children:`© 2026 A1. All rights reserved.`})}),sidebar:(0,x.jsx)(l,{placement:`end`,open:e,onClose:()=>t(!1),header:e=>(0,x.jsx)(_,{collapsed:e}),footer:(0,x.jsx)(v,{}),children:(0,x.jsx)(y,{})}),children:(0,x.jsxs)(`div`,{style:T,children:[(0,x.jsx)(h,{style:{marginBottom:`var(--base-spacing-16)`},children:`Main content area with navigation placed on the right edge.`}),(0,x.jsx)(g,{label:`Content block`,height:240})]})})}},k={name:`Sticky Header`,render:()=>(0,x.jsx)(a,{stickyHeader:!0,header:(0,x.jsxs)(`div`,{style:{...C,boxShadow:`var(--semantic-shadow-sm)`},children:[(0,x.jsx)(p,{as:`span`,size:`xs`,children:`Sticky Header`}),(0,x.jsx)(h,{size:`xs`,color:`muted`,children:`— scroll the page to see it stay fixed`})]}),children:(0,x.jsx)(`div`,{style:T,children:Array.from({length:12},(e,t)=>(0,x.jsx)(`div`,{style:{marginBottom:`var(--base-spacing-16)`},children:(0,x.jsx)(g,{label:`Content block ${t+1}`,height:80})},t))})})},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source},description:{story:`The body row has no gap between sidebar and main. All spacing is owned by
the main content — apply padding directly to the content inside \`children\`.
This keeps the sidebar flush against the main area so its border or
background extends edge-to-edge without a seam.`,...D.parameters?.docs?.description}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}},A=[`HeaderAndFooter`,`WithSidebar`,`WithRightSideNav`,`StickyHeader`]}))();export{E as HeaderAndFooter,k as StickyHeader,O as WithRightSideNav,D as WithSidebar,A as __namedExportsOrder,S as default};