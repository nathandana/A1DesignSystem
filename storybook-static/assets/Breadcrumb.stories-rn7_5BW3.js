import{i as e}from"./preload-helper-Cs4UwXAW.js";import{r as t}from"./iframe-DZoRqkgT.js";import{n,t as r}from"./Icon-L8cqvGUg.js";import{n as i,t as a}from"./Link-JV1UW1fo.js";var o=e((()=>{}));function s({items:e=[],backLabel:t=`Back`,className:n=``,...i}){let o=e.length>=2?e[e.length-2]:null,s=o?.href||o?.onClick?o:null;return(0,c.jsxs)(`nav`,{"aria-label":`Breadcrumb`,className:[`a1-breadcrumb`,n].filter(Boolean).join(` `),...i,children:[(0,c.jsx)(`ol`,{className:`a1-breadcrumb__list`,children:e.map((t,n)=>{let r=n===e.length-1;return(0,c.jsx)(`li`,{className:[`a1-breadcrumb__item`,r&&`a1-breadcrumb__item--current`].filter(Boolean).join(` `),children:r?(0,c.jsx)(`span`,{className:`a1-breadcrumb__current`,"aria-current":`page`,children:t.label}):t.href?(0,c.jsx)(a,{href:t.href,onClick:t.onClick,className:`a1-breadcrumb__link`,children:t.label}):t.onClick?(0,c.jsx)(`button`,{type:`button`,className:`a1-breadcrumb__link`,onClick:t.onClick,children:t.label}):(0,c.jsx)(`span`,{className:`a1-breadcrumb__ancestor`,children:t.label})},n)})}),s&&(s.href?(0,c.jsx)(a,{href:s.href,onClick:s.onClick,icon:`arrow_back`,className:`a1-breadcrumb__back`,children:t}):(0,c.jsxs)(`button`,{type:`button`,className:`a1-breadcrumb__back`,onClick:s.onClick,children:[(0,c.jsx)(r,{name:`arrow_back`,className:`a1-breadcrumb__back-icon`}),(0,c.jsx)(`span`,{className:`a1-breadcrumb__back-label`,children:t})]}))]})}var c,l=e((()=>{o(),n(),i(),c=t(),s.__docgenInfo={description:`Hierarchical navigation breadcrumb.

Pass an \`items\` array where each entry is \`{ label, href?, onClick? }\`.
The last item is always the current page (non-interactive). All others
render as links (anchor when href is set, button when only onClick).

Responsive behavior via container query:
- ≥ 480px: full breadcrumb trail with separators
- < 480px: "← Back" link pointing to the immediate parent item

@param {{ label: string, href?: string, onClick?: function }[]} items`,methods:[],displayName:`Breadcrumb`,props:{items:{defaultValue:{value:`[]`,computed:!1},required:!1},backLabel:{defaultValue:{value:`"Back"`,computed:!1},required:!1},className:{defaultValue:{value:`""`,computed:!1},required:!1}}}})),u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T;e((()=>{l(),u=t(),{userEvent:d,within:f,waitFor:p}=__STORYBOOK_MODULE_TEST__,m={title:`Components/Navigation/Breadcrumb`,component:s,tags:[`autodocs`],parameters:{layout:`padded`},args:{items:[{label:`Home`,href:`#`},{label:`Components`,href:`#`},{label:`Breadcrumb`}],backLabel:`Back`},argTypes:{items:{control:`object`,description:"Ordered list of breadcrumb items. The last item is the current page (non-interactive). Earlier items render as links when `href` is provided, or as buttons when `onClick` is provided."},backLabel:{control:`text`,description:`Label for the back link shown in narrow containers.`}}},h={},g={name:`Two levels`,args:{items:[{label:`Home`,href:`#`},{label:`Documentation`}]}},_={name:`Three levels`,args:{items:[{label:`Home`,href:`#`},{label:`Components`,href:`#`},{label:`Breadcrumb`}]}},v={name:`Four levels`,args:{items:[{label:`Home`,href:`#`},{label:`Design system`,href:`#`},{label:`Components`,href:`#`},{label:`Navigation`}]}},y={name:`Button items (onClick)`,args:{items:[{label:`Home`,onClick:()=>{}},{label:`Settings`,onClick:()=>{}},{label:`Profile`}]}},b={name:`Single item`,args:{items:[{label:`Home`}]}},x={name:`Narrow container (back link)`,decorators:[e=>(0,u.jsx)(`div`,{style:{maxWidth:`320px`},children:(0,u.jsx)(e,{})})],args:{items:[{label:`Home`,href:`#`},{label:`Components`,href:`#`},{label:`Breadcrumb`}]}},S={name:`[A11y] Semantic structure`,tags:[`a11y`,`a11y-required`],parameters:{layout:`padded`},args:{items:[{label:`Home`,href:`#`},{label:`Design System`,href:`#`},{label:`Navigation`,href:`#`},{label:`Breadcrumb`}]},play:async({canvasElement:e})=>{let t=f(e);await p(()=>{if(!t.getByRole(`navigation`,{name:`Breadcrumb`}))throw Error(`Navigation landmark not found`)}),await p(()=>{let t=e.querySelector(`[aria-current='page']`);if(!t)throw Error(`No aria-current=page found`);if(t.tagName!==`SPAN`)throw Error(`Current item should be a non-interactive span`)})}},C={name:`[A11y] High contrast theme`,tags:[`a11y`,`a11y-theme`],globals:{theme:`a1Accessible`},parameters:{layout:`padded`},args:{items:[{label:`Home`,href:`#`},{label:`Components`,href:`#`},{label:`Breadcrumb`}]}},w={name:`[A11y] ⚠ No aria-current (negative example)`,tags:[`a11y`,`a11y-negative-example`],parameters:{layout:`padded`},render:()=>(0,u.jsx)(`nav`,{"aria-label":`Breadcrumb`,children:(0,u.jsxs)(`ol`,{style:{display:`flex`,gap:`8px`,listStyle:`none`,padding:0,margin:0},children:[(0,u.jsx)(`li`,{children:(0,u.jsx)(`a`,{href:`#`,children:`Home`})}),(0,u.jsx)(`li`,{"aria-hidden":`true`,children:`/`}),(0,u.jsx)(`li`,{children:(0,u.jsx)(`a`,{href:`#`,children:`Components`})}),(0,u.jsx)(`li`,{"aria-hidden":`true`,children:`/`}),(0,u.jsx)(`li`,{children:(0,u.jsx)(`a`,{href:`#`,children:`Breadcrumb`})})]})})},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: "Two levels",
  args: {
    items: [{
      label: "Home",
      href: "#"
    }, {
      label: "Documentation"
    }]
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: "Three levels",
  args: {
    items: [{
      label: "Home",
      href: "#"
    }, {
      label: "Components",
      href: "#"
    }, {
      label: "Breadcrumb"
    }]
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: "Four levels",
  args: {
    items: [{
      label: "Home",
      href: "#"
    }, {
      label: "Design system",
      href: "#"
    }, {
      label: "Components",
      href: "#"
    }, {
      label: "Navigation"
    }]
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: "Button items (onClick)",
  args: {
    items: [{
      label: "Home",
      onClick: () => {}
    }, {
      label: "Settings",
      onClick: () => {}
    }, {
      label: "Profile"
    }]
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: "Single item",
  args: {
    items: [{
      label: "Home"
    }]
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: "Narrow container (back link)",
  decorators: [Story => <div style={{
    maxWidth: "320px"
  }}>
        <Story />
      </div>],
  args: {
    items: [{
      label: "Home",
      href: "#"
    }, {
      label: "Components",
      href: "#"
    }, {
      label: "Breadcrumb"
    }]
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  name: "[A11y] Semantic structure",
  tags: ["a11y", "a11y-required"],
  parameters: {
    layout: "padded"
  },
  args: {
    items: [{
      label: "Home",
      href: "#"
    }, {
      label: "Design System",
      href: "#"
    }, {
      label: "Navigation",
      href: "#"
    }, {
      label: "Breadcrumb"
    }]
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    // Verify landmark exists
    await waitFor(() => {
      const nav = canvas.getByRole("navigation", {
        name: "Breadcrumb"
      });
      if (!nav) throw new Error("Navigation landmark not found");
    });
    // Verify current page item
    await waitFor(() => {
      const current = canvasElement.querySelector("[aria-current='page']");
      if (!current) throw new Error("No aria-current=page found");
      if (current.tagName !== "SPAN") throw new Error("Current item should be a non-interactive span");
    });
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  name: "[A11y] High contrast theme",
  tags: ["a11y", "a11y-theme"],
  globals: {
    theme: "a1Accessible"
  },
  parameters: {
    layout: "padded"
  },
  args: {
    items: [{
      label: "Home",
      href: "#"
    }, {
      label: "Components",
      href: "#"
    }, {
      label: "Breadcrumb"
    }]
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  name: "[A11y] ⚠ No aria-current (negative example)",
  tags: ["a11y", "a11y-negative-example"],
  parameters: {
    layout: "padded"
  },
  render: () => <nav aria-label="Breadcrumb">
      <ol style={{
      display: "flex",
      gap: "8px",
      listStyle: "none",
      padding: 0,
      margin: 0
    }}>
        <li><a href="#">Home</a></li>
        <li aria-hidden="true">/</li>
        <li><a href="#">Components</a></li>
        <li aria-hidden="true">/</li>
        {/* Missing aria-current="page" — screen readers treat this as a link, not the current page */}
        <li><a href="#">Breadcrumb</a></li>
      </ol>
    </nav>
}`,...w.parameters?.docs?.source}}},T=[`Configurable`,`TwoLevels`,`ThreeLevels`,`FourLevels`,`ButtonItems`,`SingleItem`,`NarrowContainer`,`A11yStructure`,`A11yHighContrast`,`A11yCurrentPageMissing`]}))();export{w as A11yCurrentPageMissing,C as A11yHighContrast,S as A11yStructure,y as ButtonItems,h as Configurable,v as FourLevels,x as NarrowContainer,b as SingleItem,_ as ThreeLevels,g as TwoLevels,T as __namedExportsOrder,m as default};