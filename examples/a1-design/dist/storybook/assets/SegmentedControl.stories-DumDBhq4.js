import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{S as n}from"./iframe-D3ZfI8km.js";import{t as r}from"./jsx-runtime-Cul_R1t-.js";import{n as i,t as a}from"./Icon-BOLnzRwX.js";var o=e((()=>{}));function s(e){return typeof e==`string`?{value:e,label:e}:e}function c({options:e=[],value:t,onChange:n,size:r=`md`,fullWidth:i=!1}){let o=u.includes(r)?r:`md`,c=e.map(s);return(0,l.jsx)(`div`,{role:`radiogroup`,className:[`a1-segmented`,i&&`a1-segmented--full-width`].filter(Boolean).join(` `),onKeyDown:e=>{let t=Array.from(e.currentTarget.querySelectorAll(`[role="radio"]`)),r=t.indexOf(document.activeElement);if(r===-1)return;let i=-1;e.key===`ArrowRight`||e.key===`ArrowDown`?i=(r+1)%t.length:e.key===`ArrowLeft`||e.key===`ArrowUp`?i=(r-1+t.length)%t.length:e.key===`Home`?i=0:e.key===`End`&&(i=t.length-1),i!==-1&&(e.preventDefault(),t[i].focus(),n?.(c[i].value))},children:c.map(e=>{let r=!!e.icon&&!e.label,i=t===e.value;return(0,l.jsxs)(`button`,{role:`radio`,type:`button`,"aria-checked":i,"aria-label":r?e.ariaLabel??e.value:void 0,tabIndex:i?0:-1,className:[`a1-segment`,`a1-segment--${o}`,r&&`a1-segment--icon-only`].filter(Boolean).join(` `),onClick:()=>n?.(e.value),children:[e.icon&&(0,l.jsx)(a,{name:e.icon,className:`a1-segment__icon`}),e.label]},e.value)})})}var l,u,d=e((()=>{o(),i(),l=r(),u=[`sm`,`md`],c.__docgenInfo={description:``,methods:[],displayName:`SegmentedControl`,props:{options:{defaultValue:{value:`[]`,computed:!1},required:!1},size:{defaultValue:{value:`"md"`,computed:!1},required:!1},fullWidth:{defaultValue:{value:`false`,computed:!1},required:!1}}}})),f,p,m,h,g,_,v,y,b;e((()=>{f=t(n(),1),d(),p=r(),m={title:`Components/Controls/Segmented Control`,component:c,tags:[`autodocs`],parameters:{layout:`centered`},argTypes:{size:{control:`inline-radio`,options:[`sm`,`md`]},fullWidth:{control:`boolean`}}},h={render:e=>{let[t,n]=(0,f.useState)(`week`);return(0,p.jsx)(c,{...e,value:t,onChange:n,options:[`Day`,`Week`,`Month`,`Year`].map(e=>({value:e.toLowerCase(),label:e}))})}},g={name:`With icons`,render:e=>{let[t,n]=(0,f.useState)(`list`);return(0,p.jsx)(c,{...e,value:t,onChange:n,options:[{value:`list`,label:`List`,icon:`view_list`},{value:`grid`,label:`Grid`,icon:`grid_view`},{value:`dashboard`,label:`Dashboard`,icon:`dashboard`}]})}},_={name:`Icon only`,render:e=>{let[t,n]=(0,f.useState)(`left`);return(0,p.jsx)(c,{...e,value:t,onChange:n,options:[{value:`left`,icon:`format_align_left`,ariaLabel:`Align left`},{value:`center`,icon:`format_align_center`,ariaLabel:`Align center`},{value:`right`,icon:`format_align_right`,ariaLabel:`Align right`},{value:`justify`,icon:`format_align_justify`,ariaLabel:`Justify`}]})}},v={parameters:{controls:{include:[]}},render:()=>{let[e,t]=(0,f.useState)(`b`),[n,r]=(0,f.useState)(`b`),i=[{value:`a`,label:`Option A`},{value:`b`,label:`Option B`},{value:`c`,label:`Option C`}];return(0,p.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-16)`,alignItems:`flex-start`},children:[(0,p.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`var(--base-spacing-16)`},children:[(0,p.jsx)(`span`,{style:{fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,color:`var(--semantic-color-text-muted)`,width:`24px`},children:`sm`}),(0,p.jsx)(c,{size:`sm`,value:e,onChange:t,options:i})]}),(0,p.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`var(--base-spacing-16)`},children:[(0,p.jsx)(`span`,{style:{fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,color:`var(--semantic-color-text-muted)`,width:`24px`},children:`md`}),(0,p.jsx)(c,{size:`md`,value:n,onChange:r,options:i})]})]})}},y={name:`Full width`,parameters:{layout:`padded`},render:e=>{let[t,n]=(0,f.useState)(`personal`);return(0,p.jsx)(`div`,{style:{width:`400px`},children:(0,p.jsx)(c,{...e,fullWidth:!0,value:t,onChange:n,options:[{value:`personal`,label:`Personal`},{value:`team`,label:`Team`},{value:`org`,label:`Organization`}]})})}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [value, setValue] = useState("week");
    return <SegmentedControl {...args} value={value} onChange={setValue} options={["Day", "Week", "Month", "Year"].map(s => ({
      value: s.toLowerCase(),
      label: s
    }))} />;
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: "With icons",
  render: args => {
    const [value, setValue] = useState("list");
    return <SegmentedControl {...args} value={value} onChange={setValue} options={[{
      value: "list",
      label: "List",
      icon: "view_list"
    }, {
      value: "grid",
      label: "Grid",
      icon: "grid_view"
    }, {
      value: "dashboard",
      label: "Dashboard",
      icon: "dashboard"
    }]} />;
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: "Icon only",
  render: args => {
    const [value, setValue] = useState("left");
    return <SegmentedControl {...args} value={value} onChange={setValue} options={[{
      value: "left",
      icon: "format_align_left",
      ariaLabel: "Align left"
    }, {
      value: "center",
      icon: "format_align_center",
      ariaLabel: "Align center"
    }, {
      value: "right",
      icon: "format_align_right",
      ariaLabel: "Align right"
    }, {
      value: "justify",
      icon: "format_align_justify",
      ariaLabel: "Justify"
    }]} />;
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => {
    const [sm, setSm] = useState("b");
    const [md, setMd] = useState("b");
    const options = [{
      value: "a",
      label: "Option A"
    }, {
      value: "b",
      label: "Option B"
    }, {
      value: "c",
      label: "Option C"
    }];
    return <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--base-spacing-16)",
      alignItems: "flex-start"
    }}>
        <div style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--base-spacing-16)"
      }}>
          <span style={{
          fontFamily: "var(--component-paragraph-font-family)",
          fontSize: "var(--semantic-font-size-body-xs)",
          color: "var(--semantic-color-text-muted)",
          width: "24px"
        }}>sm</span>
          <SegmentedControl size="sm" value={sm} onChange={setSm} options={options} />
        </div>
        <div style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--base-spacing-16)"
      }}>
          <span style={{
          fontFamily: "var(--component-paragraph-font-family)",
          fontSize: "var(--semantic-font-size-body-xs)",
          color: "var(--semantic-color-text-muted)",
          width: "24px"
        }}>md</span>
          <SegmentedControl size="md" value={md} onChange={setMd} options={options} />
        </div>
      </div>;
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: "Full width",
  parameters: {
    layout: "padded"
  },
  render: args => {
    const [value, setValue] = useState("personal");
    return <div style={{
      width: "400px"
    }}>
        <SegmentedControl {...args} fullWidth value={value} onChange={setValue} options={[{
        value: "personal",
        label: "Personal"
      }, {
        value: "team",
        label: "Team"
      }, {
        value: "org",
        label: "Organization"
      }]} />
      </div>;
  }
}`,...y.parameters?.docs?.source}}},b=[`Default`,`WithIcons`,`IconOnly`,`Sizes`,`FullWidth`]}))();export{h as Default,y as FullWidth,_ as IconOnly,v as Sizes,g as WithIcons,b as __namedExportsOrder,m as default};