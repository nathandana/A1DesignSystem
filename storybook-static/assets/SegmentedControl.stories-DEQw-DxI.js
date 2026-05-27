import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{C as n,t as r}from"./iframe-C_HQpeIV.js";import{n as i,t as a}from"./SegmentedControl-BeU9o0hL.js";var o,s,c,l,u,d,f,p;e((()=>{o=t(n(),1),i(),s=r(),c={title:`Components/Controls/Segmented Control`,component:a,tags:[`autodocs`],parameters:{layout:`centered`},argTypes:{fullWidth:{control:`boolean`}}},l={render:e=>{let[t,n]=(0,o.useState)(`week`);return(0,s.jsx)(a,{...e,value:t,onChange:n,options:[`Day`,`Week`,`Month`,`Year`].map(e=>({value:e.toLowerCase(),label:e}))})}},u={name:`With icons`,render:e=>{let[t,n]=(0,o.useState)(`list`);return(0,s.jsx)(a,{...e,value:t,onChange:n,options:[{value:`list`,label:`List`,icon:`view_list`},{value:`grid`,label:`Grid`,icon:`grid_view`},{value:`dashboard`,label:`Dashboard`,icon:`dashboard`}]})}},d={name:`Icon only`,render:e=>{let[t,n]=(0,o.useState)(`left`);return(0,s.jsx)(a,{...e,value:t,onChange:n,options:[{value:`left`,icon:`format_align_left`,ariaLabel:`Align left`},{value:`center`,icon:`format_align_center`,ariaLabel:`Align center`},{value:`right`,icon:`format_align_right`,ariaLabel:`Align right`},{value:`justify`,icon:`format_align_justify`,ariaLabel:`Justify`}]})}},f={name:`Full width`,parameters:{layout:`padded`},render:e=>{let[t,n]=(0,o.useState)(`personal`);return(0,s.jsx)(`div`,{style:{width:`400px`},children:(0,s.jsx)(a,{...e,fullWidth:!0,value:t,onChange:n,options:[{value:`personal`,label:`Personal`},{value:`team`,label:`Team`},{value:`org`,label:`Organization`}]})})}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [value, setValue] = useState("week");
    return <SegmentedControl {...args} value={value} onChange={setValue} options={["Day", "Week", "Month", "Year"].map(s => ({
      value: s.toLowerCase(),
      label: s
    }))} />;
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
}`,...f.parameters?.docs?.source}}},p=[`Default`,`WithIcons`,`IconOnly`,`FullWidth`]}))();export{l as Default,f as FullWidth,d as IconOnly,u as WithIcons,p as __namedExportsOrder,c as default};