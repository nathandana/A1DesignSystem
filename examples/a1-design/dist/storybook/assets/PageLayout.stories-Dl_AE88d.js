import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./jsx-runtime-Cul_R1t-.js";import{n,t as r}from"./Heading-BBgH03-K.js";import{n as i,t as a}from"./Paragraph-CrZbx1QP.js";var o=e((()=>{}));function s({header:e,footer:t,sidebar:n,sidebarPlacement:r=`start`,stickyHeader:i=!1,className:a=``,children:o,...s}){return(0,c.jsxs)(`div`,{className:[`a1-page-layout`,i&&`a1-page-layout--sticky-header`,n&&`a1-page-layout--sidebar-${r}`,a].filter(Boolean).join(` `),...s,children:[e&&(0,c.jsx)(`header`,{className:`a1-page-layout__header`,children:e}),(0,c.jsxs)(`div`,{className:`a1-page-layout__body`,children:[n&&(0,c.jsx)(`aside`,{className:`a1-page-layout__sidebar`,children:n}),(0,c.jsx)(`main`,{className:`a1-page-layout__main`,children:o})]}),t&&(0,c.jsx)(`footer`,{className:`a1-page-layout__footer`,children:t})]})}var c,l=e((()=>{o(),c=t(),s.__docgenInfo={description:``,methods:[],displayName:`PageLayout`,props:{sidebarPlacement:{defaultValue:{value:`"start"`,computed:!1},required:!1},stickyHeader:{defaultValue:{value:`false`,computed:!1},required:!1},className:{defaultValue:{value:`""`,computed:!1},required:!1}}}}));function u({label:e,height:t=120}){return(0,d.jsx)(`div`,{style:{height:t,borderRadius:`var(--base-radius-lg)`,background:`var(--semantic-color-surface-raised)`,border:`1px dashed var(--semantic-color-border-subtle)`,display:`flex`,alignItems:`center`,justifyContent:`center`},children:(0,d.jsx)(a,{size:`xs`,color:`muted`,children:e})})}var d,f,p,m,h,g,_,v,y,b,x;e((()=>{l(),n(),i(),d=t(),f={title:`Components/Containers/Page Layout`,component:s,parameters:{layout:`fullscreen`},tags:[`autodocs`],argTypes:{sidebarPlacement:{control:`inline-radio`,options:[`start`,`end`]},stickyHeader:{control:`boolean`}}},p={padding:`var(--base-spacing-16) var(--base-spacing-24)`,background:`var(--semantic-color-surface-panel)`,borderBottom:`1px solid var(--semantic-color-border-subtle)`,display:`flex`,alignItems:`center`,gap:`var(--base-spacing-12)`},m={padding:`var(--base-spacing-24) var(--base-spacing-16)`,background:`var(--semantic-color-surface-panel)`,borderRight:`1px solid var(--semantic-color-border-subtle)`,height:`100%`},h={padding:`var(--base-spacing-16) var(--base-spacing-24)`,background:`var(--semantic-color-surface-panel)`,borderTop:`1px solid var(--semantic-color-border-subtle)`},g={padding:`var(--base-spacing-24)`},_={name:`Header + Footer`,render:()=>(0,d.jsx)(s,{header:(0,d.jsx)(`div`,{style:p,children:(0,d.jsx)(r,{as:`span`,size:`xs`,children:`A1 Design System`})}),footer:(0,d.jsx)(`div`,{style:h,children:(0,d.jsx)(a,{size:`xs`,color:`muted`,children:`© 2026 A1. All rights reserved.`})}),children:(0,d.jsxs)(`div`,{style:g,children:[(0,d.jsx)(a,{style:{marginBottom:`var(--base-spacing-16)`},children:`Main content area.`}),(0,d.jsx)(u,{label:`Content block`,height:200})]})})},v={name:`With Sidebar`,render:()=>(0,d.jsx)(s,{header:(0,d.jsx)(`div`,{style:p,children:(0,d.jsx)(r,{as:`span`,size:`xs`,children:`A1 Design System`})}),footer:(0,d.jsx)(`div`,{style:h,children:(0,d.jsx)(a,{size:`xs`,color:`muted`,children:`Footer`})}),sidebar:(0,d.jsxs)(`div`,{style:m,children:[(0,d.jsx)(r,{as:`p`,size:`xs`,style:{marginBottom:`var(--base-spacing-12)`},children:`Navigation`}),[`Overview`,`Components`,`Foundations`,`Utilities`].map(e=>(0,d.jsx)(a,{size:`sm`,color:`muted`,style:{marginBottom:`var(--base-spacing-8)`},children:e},e))]}),children:(0,d.jsxs)(`div`,{style:g,children:[(0,d.jsx)(a,{style:{marginBottom:`var(--base-spacing-16)`},children:`Main content with sidebar navigation.`}),(0,d.jsx)(u,{label:`Content block`,height:240})]})})},y={name:`Sidebar End`,render:()=>(0,d.jsx)(s,{header:(0,d.jsx)(`div`,{style:p,children:(0,d.jsx)(r,{as:`span`,size:`xs`,children:`A1 Design System`})}),sidebarPlacement:`end`,sidebar:(0,d.jsxs)(`div`,{style:{...m,borderRight:`none`,borderLeft:`1px solid var(--semantic-color-border-subtle)`},children:[(0,d.jsx)(r,{as:`p`,size:`xs`,style:{marginBottom:`var(--base-spacing-8)`},children:`Details`}),(0,d.jsx)(a,{size:`sm`,color:`muted`,children:`Right-side panel`})]}),children:(0,d.jsxs)(`div`,{style:g,children:[(0,d.jsx)(a,{style:{marginBottom:`var(--base-spacing-16)`},children:`Sidebar placed at the end (right side).`}),(0,d.jsx)(u,{label:`Content block`,height:200})]})})},b={name:`Sticky Header`,render:()=>(0,d.jsx)(s,{stickyHeader:!0,header:(0,d.jsxs)(`div`,{style:{...p,boxShadow:`var(--semantic-shadow-sm)`},children:[(0,d.jsx)(r,{as:`span`,size:`xs`,children:`Sticky Header`}),(0,d.jsx)(a,{size:`xs`,color:`muted`,children:`— scroll the page to see it stay fixed`})]}),children:(0,d.jsx)(`div`,{style:g,children:Array.from({length:12},(e,t)=>(0,d.jsx)(`div`,{style:{marginBottom:`var(--base-spacing-16)`},children:(0,d.jsx)(u,{label:`Content block ${t+1}`,height:80})},t))})})},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: "With Sidebar",
  render: () => <PageLayout header={<div style={headerStyle}>
          <Heading as="span" size="xs">A1 Design System</Heading>
        </div>} footer={<div style={footerStyle}>
          <Paragraph size="xs" color="muted">Footer</Paragraph>
        </div>} sidebar={<div style={sidebarStyle}>
          <Heading as="p" size="xs" style={{
      marginBottom: "var(--base-spacing-12)"
    }}>
            Navigation
          </Heading>
          {["Overview", "Components", "Foundations", "Utilities"].map(item => <Paragraph key={item} size="sm" color="muted" style={{
      marginBottom: "var(--base-spacing-8)"
    }}>
              {item}
            </Paragraph>)}
        </div>}>
      <div style={mainStyle}>
        <Paragraph style={{
        marginBottom: "var(--base-spacing-16)"
      }}>
          Main content with sidebar navigation.
        </Paragraph>
        <Placeholder label="Content block" height={240} />
      </div>
    </PageLayout>
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: "Sidebar End",
  render: () => <PageLayout header={<div style={headerStyle}>
          <Heading as="span" size="xs">A1 Design System</Heading>
        </div>} sidebarPlacement="end" sidebar={<div style={{
    ...sidebarStyle,
    borderRight: "none",
    borderLeft: "1px solid var(--semantic-color-border-subtle)"
  }}>
          <Heading as="p" size="xs" style={{
      marginBottom: "var(--base-spacing-8)"
    }}>Details</Heading>
          <Paragraph size="sm" color="muted">Right-side panel</Paragraph>
        </div>}>
      <div style={mainStyle}>
        <Paragraph style={{
        marginBottom: "var(--base-spacing-16)"
      }}>
          Sidebar placed at the end (right side).
        </Paragraph>
        <Placeholder label="Content block" height={200} />
      </div>
    </PageLayout>
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}},x=[`HeaderAndFooter`,`WithSidebar`,`SidebarEnd`,`StickyHeader`]}))();export{_ as HeaderAndFooter,y as SidebarEnd,b as StickyHeader,v as WithSidebar,x as __namedExportsOrder,f as default};