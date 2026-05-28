import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{C as n,t as r}from"./iframe-BwSdWSBC.js";import{n as i,t as a}from"./Icon-XRhQqhD4.js";import{n as o,t as s}from"./IconButton-B92NxEh7.js";var c=e((()=>{})),l=e((()=>{}));function u({as:e=`a`,icon:t,label:n,active:r,className:i=``,...o}){let s=(0,p.useContext)(h),{collapsed:c}=(0,p.useContext)(g);return(0,m.jsxs)(e,{className:[`a1-side-nav-item`,r&&`a1-side-nav-item--active`,i].filter(Boolean).join(` `),style:{"--a1-side-nav-depth":c?0:s},"aria-current":r?`page`:void 0,title:c?n:void 0,...o,children:[t&&(0,m.jsx)(a,{name:t,className:`a1-side-nav-item__icon`}),(0,m.jsx)(`span`,{className:`a1-side-nav-item__label`,children:n})]})}function d({icon:e,label:t,defaultOpen:n=!1,open:r,onOpenChange:i,children:o,className:s=``,...c}){let l=(0,p.useContext)(h),{collapsed:u,onExpand:d}=(0,p.useContext)(g),f=r!==void 0,[_,v]=(0,p.useState)(n),y=f?r:_;function b(){if(u){d?.();return}f||v(e=>!e),i?.(!y)}let x=[`a1-side-nav-item`,`a1-side-nav-group__trigger`,y&&`a1-side-nav-group__trigger--open`,s].filter(Boolean).join(` `),S=[`a1-side-nav-group__children`,y&&`a1-side-nav-group__children--open`].filter(Boolean).join(` `);return(0,m.jsxs)(`div`,{className:`a1-side-nav-group`,...c,children:[(0,m.jsxs)(`button`,{type:`button`,className:x,style:{"--a1-side-nav-depth":u?0:l},"aria-expanded":u?void 0:y,title:u?t:void 0,onClick:b,children:[e&&(0,m.jsx)(a,{name:e,className:`a1-side-nav-item__icon`}),(0,m.jsx)(`span`,{className:`a1-side-nav-item__label`,children:t}),(0,m.jsx)(a,{name:`chevron_right`,className:`a1-side-nav-group__chevron`})]}),(0,m.jsx)(`div`,{className:S,children:(0,m.jsx)(h.Provider,{value:l+1,children:(0,m.jsx)(`div`,{className:`a1-side-nav-group__children-inner`,children:o})})})]})}function f({header:e,footer:t,children:n,open:r=!1,onClose:i,collapsed:a,defaultCollapsed:o=!1,onCollapsedChange:c,collapseButtonPlacement:l=`header`,placement:u=`start`,className:d=``,...f}){let h=a!==void 0,[_,v]=(0,p.useState)(o),y=h?a:_;function b(){h||v(e=>!e),c?.(!y)}function x(){h||v(!1),c?.(!1)}(0,p.useEffect)(()=>{if(!r)return;let e=e=>{e.key===`Escape`&&i?.()};return document.addEventListener(`keydown`,e),()=>document.removeEventListener(`keydown`,e)},[r,i]);let S=typeof e==`function`?e(y):e,C=typeof t==`function`?t(y):t,w=[`a1-side-nav`,`a1-side-nav--placement-${u}`,l===`footer`&&`a1-side-nav--collapse-footer`,r&&`a1-side-nav--open`,y&&`a1-side-nav--collapsed`,d].filter(Boolean).join(` `),T=u===`end`?y?`chevron_left`:`chevron_right`:y?`chevron_right`:`chevron_left`;return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(`div`,{className:`a1-scrim a1-side-nav__scrim${r?` a1-scrim--visible`:``}`,"aria-hidden":`true`,onClick:i}),(0,m.jsxs)(`nav`,{className:w,...f,children:[(0,m.jsxs)(`div`,{className:`a1-side-nav__header-row`,children:[S&&(0,m.jsx)(`div`,{className:`a1-side-nav__header-content`,children:S}),(0,m.jsx)(s,{icon:`close`,label:`Close navigation`,className:`a1-side-nav__close-btn`,onClick:i}),l===`header`&&(0,m.jsx)(s,{icon:T,label:y?`Expand navigation`:`Collapse navigation`,className:`a1-side-nav__collapse-btn`,onClick:b})]}),(0,m.jsx)(g.Provider,{value:{collapsed:y,onExpand:x},children:(0,m.jsx)(`div`,{className:`a1-side-nav__nav`,children:n})}),(C||l===`footer`)&&(0,m.jsxs)(`div`,{className:`a1-side-nav__footer`,children:[C&&(0,m.jsx)(`div`,{className:`a1-side-nav__footer-content`,children:C}),l===`footer`&&(0,m.jsx)(s,{icon:T,label:y?`Expand navigation`:`Collapse navigation`,className:`a1-side-nav__collapse-btn`,onClick:b})]})]})]})}var p,m,h,g,_=e((()=>{p=t(n(),1),c(),l(),i(),o(),m=r(),h=(0,p.createContext)(0),g=(0,p.createContext)({collapsed:!1,onExpand:null}),u.__docgenInfo={description:`A leaf navigation item — renders an icon and label as a link or button.
In collapsed state (lg+), the label is hidden and used as a native tooltip.
@param {object} props
@param {"a"|"button"|string} [props.as="a"] - Underlying HTML element
@param {string} [props.icon] - Material Symbols icon name (recommended for collapsed nav)
@param {string} props.label - Visible label text
@param {boolean} [props.active] - Marks this item as the current page
@param {string} [props.className]`,methods:[],displayName:`SideNavItem`,props:{as:{defaultValue:{value:`"a"`,computed:!1},required:!1},className:{defaultValue:{value:`""`,computed:!1},required:!1}}},d.__docgenInfo={description:`An expandable group — a trigger that reveals nested SideNavItems or SideNavGroups.
When the sidebar is collapsed (lg+), clicking the trigger expands the sidebar instead.
Supports uncontrolled (\`defaultOpen\`) and controlled (\`open\` + \`onOpenChange\`) usage.
@param {object} props
@param {string} [props.icon] - Material Symbols icon name (recommended for collapsed nav)
@param {string} props.label - Trigger label text
@param {boolean} [props.defaultOpen=false] - Initial expanded state (uncontrolled)
@param {boolean} [props.open] - Controlled expanded state
@param {function} [props.onOpenChange] - Called with next boolean when toggled
@param {React.ReactNode} props.children - Nested SideNavItems or SideNavGroups
@param {string} [props.className]`,methods:[],displayName:`SideNavGroup`,props:{defaultOpen:{defaultValue:{value:`false`,computed:!1},required:!1},className:{defaultValue:{value:`""`,computed:!1},required:!1}}},f.__docgenInfo={description:`Side navigation shell with responsive controls, header, nav area, and footer slots.

Responsive behavior:
- xs (≤480px): full-viewport-width fixed overlay; built-in close (✕) button
- sm/md (481–1024px): fixed-width overlay with scrim; built-in close (✕) button
- lg/xl (≥1025px): persistent in the document flow; built-in collapse (‹/›) toggle

The close button is rendered inline with the header content. The desktop
collapse button can be rendered in the header or footer.

@param {object} props
@param {React.ReactNode | ((collapsed: boolean) => React.ReactNode)} [props.header]
  Header content. Pass a render function to receive the current collapsed state,
  e.g. \`header={(collapsed) => <MyLogo collapsed={collapsed} />}\`.
@param {React.ReactNode} [props.footer] - Below nav items; hidden when collapsed
@param {React.ReactNode} props.children - SideNavItem and SideNavGroup elements
@param {boolean} [props.open=false] - Controls overlay visibility on xs/sm/md
@param {function} [props.onClose] - Called when scrim, Escape, or the close button is triggered
@param {boolean} [props.defaultCollapsed=false] - Initial collapsed state for lg/xl (uncontrolled)
@param {boolean} [props.collapsed] - Controlled collapsed state for lg/xl
@param {function} [props.onCollapsedChange] - Called with next boolean when collapsed state changes
@param {"header"|"footer"} [props.collapseButtonPlacement="header"] - Where the desktop collapse button appears
@param {"start"|"end"} [props.placement="start"] - Side of the viewport/layout where the nav appears
@param {string} [props.className]`,methods:[],displayName:`SideNav`,props:{open:{defaultValue:{value:`false`,computed:!1},required:!1},defaultCollapsed:{defaultValue:{value:`false`,computed:!1},required:!1},collapseButtonPlacement:{defaultValue:{value:`"header"`,computed:!1},required:!1},placement:{defaultValue:{value:`"start"`,computed:!1},required:!1},className:{defaultValue:{value:`""`,computed:!1},required:!1}}}}));export{_ as i,d as n,u as r,f as t};