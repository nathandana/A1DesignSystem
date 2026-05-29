import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./iframe-CkqopHIr.js";import{n,t as r}from"./TopHeader-BAvmk_D-.js";var i,a,o,s,c,l,u,d,f,p;e((()=>{n(),i=t(),a=[{id:`home`,label:`Home`,icon:`home`,iconOnly:!0,href:`/`,active:!0},{id:`products`,label:`Products`,icon:`inventory_2`,href:`/products`},{id:`analytics`,label:`Analytics`,icon:`analytics`,items:[{label:`Overview`,href:`/analytics`},{label:`Reports`,href:`/analytics/reports`},{label:`Forecasting`,href:`/analytics/forecast`}]},{id:`docs`,label:`Documentation`,icon:`article`,href:`/docs`}],o=[{id:`notifications`,icon:`notifications`,label:`Notifications`,badge:3,items:[{isHeader:!0,label:`Notifications`},{divider:!0},{label:`New comment on Transform`,icon:`chat_bubble`,href:`#`},{label:`Build passed`,icon:`check_circle`,href:`#`},{label:`Review requested`,icon:`rate_review`,href:`#`},{divider:!0},{label:`See all notifications`,href:`#`}]},{id:`settings`,icon:`settings`,label:`Settings`,items:[{label:`Preferences`,icon:`tune`,href:`#`},{label:`Appearance`,icon:`palette`,href:`#`},{label:`API Keys`,icon:`key`,href:`#`}]},{id:`user`,icon:`account_circle`,label:`Account`,items:[{isHeader:!0,label:`Nathan Dana`,description:`nathan.dana@gmail.com`},{divider:!0},{label:`Profile`,icon:`person`,href:`#`},{label:`Switch account`,icon:`swap_horiz`,href:`#`},{divider:!0},{label:`Sign out`,icon:`logout`,danger:!0,onClick:()=>{}}]}],s=(0,i.jsx)(`div`,{style:{padding:`var(--base-spacing-40) var(--base-spacing-40)`,fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-md)`,color:`var(--semantic-color-text-muted)`},children:`Page content`}),c={title:`Components/Navigation/TopHeader`,component:r,tags:[`autodocs`],parameters:{layout:`fullscreen`},argTypes:{logoText:{control:`text`},logoHref:{control:`text`},loginButton:{control:`boolean`,description:`Show login button`}}},l={name:`Default`,parameters:{controls:{include:[]}},render:()=>(0,i.jsxs)(`div`,{style:{background:`var(--semantic-color-surface-page)`,minHeight:300},children:[(0,i.jsx)(r,{logoText:`A1 Design`,logoHref:`#`,navItems:a,actions:o}),s]})},u={name:`With login button`,parameters:{controls:{include:[]}},render:()=>(0,i.jsxs)(`div`,{style:{background:`var(--semantic-color-surface-page)`,minHeight:300},children:[(0,i.jsx)(r,{logoText:`A1 Design`,logoHref:`#`,navItems:a,actions:[o[0]],loginButton:{label:`Log in`,onClick:()=>{}}}),s]})},d={name:`Nav items without icons`,parameters:{controls:{include:[]}},render:()=>(0,i.jsxs)(`div`,{style:{background:`var(--semantic-color-surface-page)`,minHeight:300},children:[(0,i.jsx)(r,{logoText:`Acme`,logoHref:`#`,navItems:[{id:`home`,label:`Home`,href:`/`,active:!0},{id:`products`,label:`Products`,href:`/products`},{id:`pricing`,label:`Pricing`,href:`/pricing`},{id:`company`,label:`Company`,items:[{label:`About us`,href:`/about`},{label:`Blog`,href:`/blog`},{label:`Careers`,href:`/careers`}]}],actions:o.slice(2)}),s]})},f={name:`Custom logo node`,parameters:{controls:{include:[]}},render:()=>(0,i.jsxs)(`div`,{style:{background:`var(--semantic-color-surface-page)`,minHeight:300},children:[(0,i.jsx)(r,{logo:(0,i.jsxs)(`span`,{style:{fontWeight:900,fontSize:`var(--semantic-font-size-heading-sm)`,letterSpacing:`-0.02em`},children:[`A1`,(0,i.jsx)(`span`,{style:{color:`var(--semantic-color-text-accent)`},children:`.`})]}),logoHref:`#`,navItems:a,actions:o}),s]})},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: "Default",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    background: "var(--semantic-color-surface-page)",
    minHeight: 300
  }}>
      <TopHeader logoText="A1 Design" logoHref="#" navItems={NAV_ITEMS} actions={ACTIONS} />
      {PAGE_CONTENT}
    </div>
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: "With login button",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    background: "var(--semantic-color-surface-page)",
    minHeight: 300
  }}>
      <TopHeader logoText="A1 Design" logoHref="#" navItems={NAV_ITEMS} actions={[ACTIONS[0]]} loginButton={{
      label: "Log in",
      onClick: () => {}
    }} />
      {PAGE_CONTENT}
    </div>
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: "Nav items without icons",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    background: "var(--semantic-color-surface-page)",
    minHeight: 300
  }}>
      <TopHeader logoText="Acme" logoHref="#" navItems={[{
      id: "home",
      label: "Home",
      href: "/",
      active: true
    }, {
      id: "products",
      label: "Products",
      href: "/products"
    }, {
      id: "pricing",
      label: "Pricing",
      href: "/pricing"
    }, {
      id: "company",
      label: "Company",
      items: [{
        label: "About us",
        href: "/about"
      }, {
        label: "Blog",
        href: "/blog"
      }, {
        label: "Careers",
        href: "/careers"
      }]
    }]} actions={ACTIONS.slice(2)} />
      {PAGE_CONTENT}
    </div>
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: "Custom logo node",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    background: "var(--semantic-color-surface-page)",
    minHeight: 300
  }}>
      <TopHeader logo={<span style={{
      fontWeight: 900,
      fontSize: "var(--semantic-font-size-heading-sm)",
      letterSpacing: "-0.02em"
    }}>
            A1
            <span style={{
        color: "var(--semantic-color-text-accent)"
      }}>.</span>
          </span>} logoHref="#" navItems={NAV_ITEMS} actions={ACTIONS} />
      {PAGE_CONTENT}
    </div>
}`,...f.parameters?.docs?.source}}},p=[`Default`,`WithLoginButton`,`NoIcons`,`LogoSlot`]}))();export{l as Default,f as LogoSlot,d as NoIcons,u as WithLoginButton,p as __namedExportsOrder,c as default};