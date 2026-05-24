import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{C as n,t as r}from"./iframe-DGQSYM4W.js";import{n as i,t as a}from"./Icon-BZjwv2RK.js";var o=e((()=>{}));function s(e){return typeof e==`string`?{value:e,label:e}:e}function c({options:e=[],value:t,onChange:n,fullWidth:r=!1}){let i=e.map(s);return(0,l.jsx)(`div`,{role:`radiogroup`,className:[`a1-segmented`,r&&`a1-segmented--full-width`].filter(Boolean).join(` `),onKeyDown:e=>{let t=Array.from(e.currentTarget.querySelectorAll(`[role="radio"]`)),r=t.indexOf(document.activeElement);if(r===-1)return;let a=-1;e.key===`ArrowRight`||e.key===`ArrowDown`?a=(r+1)%t.length:e.key===`ArrowLeft`||e.key===`ArrowUp`?a=(r-1+t.length)%t.length:e.key===`Home`?a=0:e.key===`End`&&(a=t.length-1),a!==-1&&(e.preventDefault(),t[a].focus(),n?.(i[a].value))},children:i.map(e=>{let r=!!e.icon&&!e.label,i=t===e.value;return(0,l.jsxs)(`button`,{role:`radio`,type:`button`,"aria-checked":i,"aria-label":r?e.ariaLabel??e.value:void 0,tabIndex:i?0:-1,className:[`a1-segment`,r&&`a1-segment--icon-only`].filter(Boolean).join(` `),onClick:()=>n?.(e.value),children:[e.icon&&(0,l.jsx)(a,{name:e.icon,className:`a1-segment__icon`}),e.label]},e.value)})})}var l,u=e((()=>{o(),i(),l=r(),c.__docgenInfo={description:``,methods:[],displayName:`SegmentedControl`,props:{options:{defaultValue:{value:`[]`,computed:!1},required:!1},fullWidth:{defaultValue:{value:`false`,computed:!1},required:!1}}}})),d,f,p,m,h,g,_,v;e((()=>{d=t(n(),1),u(),f=r(),p={title:`Components/Controls/Segmented Control`,component:c,tags:[`autodocs`],parameters:{layout:`centered`},argTypes:{fullWidth:{control:`boolean`}}},m={render:e=>{let[t,n]=(0,d.useState)(`week`);return(0,f.jsx)(c,{...e,value:t,onChange:n,options:[`Day`,`Week`,`Month`,`Year`].map(e=>({value:e.toLowerCase(),label:e}))})}},h={name:`With icons`,render:e=>{let[t,n]=(0,d.useState)(`list`);return(0,f.jsx)(c,{...e,value:t,onChange:n,options:[{value:`list`,label:`List`,icon:`view_list`},{value:`grid`,label:`Grid`,icon:`grid_view`},{value:`dashboard`,label:`Dashboard`,icon:`dashboard`}]})}},g={name:`Icon only`,render:e=>{let[t,n]=(0,d.useState)(`left`);return(0,f.jsx)(c,{...e,value:t,onChange:n,options:[{value:`left`,icon:`format_align_left`,ariaLabel:`Align left`},{value:`center`,icon:`format_align_center`,ariaLabel:`Align center`},{value:`right`,icon:`format_align_right`,ariaLabel:`Align right`},{value:`justify`,icon:`format_align_justify`,ariaLabel:`Justify`}]})}},_={name:`Full width`,parameters:{layout:`padded`},render:e=>{let[t,n]=(0,d.useState)(`personal`);return(0,f.jsx)(`div`,{style:{width:`400px`},children:(0,f.jsx)(c,{...e,fullWidth:!0,value:t,onChange:n,options:[{value:`personal`,label:`Personal`},{value:`team`,label:`Team`},{value:`org`,label:`Organization`}]})})}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [value, setValue] = useState("week");
    return <SegmentedControl {...args} value={value} onChange={setValue} options={["Day", "Week", "Month", "Year"].map(s => ({
      value: s.toLowerCase(),
      label: s
    }))} />;
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}},v=[`Default`,`WithIcons`,`IconOnly`,`FullWidth`]}))();export{m as Default,_ as FullWidth,g as IconOnly,h as WithIcons,v as __namedExportsOrder,p as default};