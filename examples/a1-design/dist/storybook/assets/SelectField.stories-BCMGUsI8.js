import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{C as n,t as r}from"./iframe-Yj7JQljB.js";import{n as i,t as a}from"./SelectField-D_AIl2tT.js";function o(e){let[t,n]=(0,s.useState)(``),[r,i]=(0,s.useState)(!1);return(0,c.jsxs)(a,{value:t,onChange:e=>n(e.target.value),onFocus:()=>i(!0),onBlur:()=>i(!1),inputOverlay:t&&!r?(0,c.jsx)(`div`,{className:`a1-field__mask-overlay`,"aria-hidden":`true`,children:(0,c.jsx)(`span`,{className:`a1-field__mask-typed`,children:t})}):null,...e,children:[(0,c.jsx)(`option`,{value:``,children:`—`}),l.map(([e,t])=>(0,c.jsxs)(`option`,{value:e,children:[e,` — `,t]},e))]})}var s,c,l,u,d,f,p,m,h,g,_,v,y,b,x;e((()=>{s=t(n(),1),i(),c=r(),l=[[`AL`,`Alabama`],[`AK`,`Alaska`],[`AZ`,`Arizona`],[`AR`,`Arkansas`],[`CA`,`California`],[`CO`,`Colorado`],[`CT`,`Connecticut`],[`DE`,`Delaware`],[`FL`,`Florida`],[`GA`,`Georgia`],[`HI`,`Hawaii`],[`ID`,`Idaho`],[`IL`,`Illinois`],[`IN`,`Indiana`],[`IA`,`Iowa`],[`KS`,`Kansas`],[`KY`,`Kentucky`],[`LA`,`Louisiana`],[`ME`,`Maine`],[`MD`,`Maryland`],[`MA`,`Massachusetts`],[`MI`,`Michigan`],[`MN`,`Minnesota`],[`MS`,`Mississippi`],[`MO`,`Missouri`],[`MT`,`Montana`],[`NE`,`Nebraska`],[`NV`,`Nevada`],[`NH`,`New Hampshire`],[`NJ`,`New Jersey`],[`NM`,`New Mexico`],[`NY`,`New York`],[`NC`,`North Carolina`],[`ND`,`North Dakota`],[`OH`,`Ohio`],[`OK`,`Oklahoma`],[`OR`,`Oregon`],[`PA`,`Pennsylvania`],[`RI`,`Rhode Island`],[`SC`,`South Carolina`],[`SD`,`South Dakota`],[`TN`,`Tennessee`],[`TX`,`Texas`],[`UT`,`Utah`],[`VT`,`Vermont`],[`VA`,`Virginia`],[`WA`,`Washington`],[`WV`,`West Virginia`],[`WI`,`Wisconsin`],[`WY`,`Wyoming`]],u=(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(`option`,{value:``,children:`Select a country`}),(0,c.jsx)(`option`,{value:`au`,children:`Australia`}),(0,c.jsx)(`option`,{value:`ca`,children:`Canada`}),(0,c.jsx)(`option`,{value:`fr`,children:`France`}),(0,c.jsx)(`option`,{value:`de`,children:`Germany`}),(0,c.jsx)(`option`,{value:`jp`,children:`Japan`}),(0,c.jsx)(`option`,{value:`nz`,children:`New Zealand`}),(0,c.jsx)(`option`,{value:`uk`,children:`United Kingdom`}),(0,c.jsx)(`option`,{value:`us`,children:`United States`})]}),d=(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(`option`,{value:``,children:`Select a timezone`}),(0,c.jsxs)(`optgroup`,{label:`Americas`,children:[(0,c.jsx)(`option`,{value:`america/new_york`,children:`Eastern Time (UTC−5)`}),(0,c.jsx)(`option`,{value:`america/chicago`,children:`Central Time (UTC−6)`}),(0,c.jsx)(`option`,{value:`america/denver`,children:`Mountain Time (UTC−7)`}),(0,c.jsx)(`option`,{value:`america/los_angeles`,children:`Pacific Time (UTC−8)`})]}),(0,c.jsxs)(`optgroup`,{label:`Europe`,children:[(0,c.jsx)(`option`,{value:`europe/london`,children:`London (UTC+0)`}),(0,c.jsx)(`option`,{value:`europe/paris`,children:`Paris (UTC+1)`}),(0,c.jsx)(`option`,{value:`europe/helsinki`,children:`Helsinki (UTC+2)`})]}),(0,c.jsxs)(`optgroup`,{label:`Asia Pacific`,children:[(0,c.jsx)(`option`,{value:`asia/tokyo`,children:`Tokyo (UTC+9)`}),(0,c.jsx)(`option`,{value:`australia/sydney`,children:`Sydney (UTC+10)`})]})]}),f={title:`Components/Forms/Select`,component:a,tags:[`autodocs`],parameters:{layout:`padded`},args:{label:`Country`,hint:`Select the country you reside in.`,size:`default`,labelPosition:`above`,required:!1,disabled:!1},argTypes:{size:{control:`inline-radio`,options:[`comfortable`,`default`,`compact`]},labelPosition:{control:`inline-radio`,options:[`above`,`side`]},error:{control:`text`},hint:{control:`text`},label:{control:`text`}}},p={render:e=>(0,c.jsx)(`div`,{style:{maxWidth:480},children:(0,c.jsx)(a,{...e,children:u})})},m={parameters:{controls:{include:[]}},render:()=>(0,c.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-32)`,maxWidth:480},children:[(0,c.jsxs)(`div`,{children:[(0,c.jsx)(`p`,{style:{fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,fontWeight:600,color:`var(--semantic-color-text-muted)`,textTransform:`uppercase`,letterSpacing:`0.06em`,marginBottom:`var(--base-spacing-12)`},children:`Comfortable`}),(0,c.jsx)(a,{size:`comfortable`,label:`Country`,hint:`Select the country you reside in.`,children:u})]}),(0,c.jsxs)(`div`,{children:[(0,c.jsx)(`p`,{style:{fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,fontWeight:600,color:`var(--semantic-color-text-muted)`,textTransform:`uppercase`,letterSpacing:`0.06em`,marginBottom:`var(--base-spacing-12)`},children:`Default`}),(0,c.jsx)(a,{size:`default`,label:`Country`,hint:`Select the country you reside in.`,children:u})]}),(0,c.jsxs)(`div`,{children:[(0,c.jsx)(`p`,{style:{fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,fontWeight:600,color:`var(--semantic-color-text-muted)`,textTransform:`uppercase`,letterSpacing:`0.06em`,marginBottom:`var(--base-spacing-12)`},children:`Compact`}),(0,c.jsx)(a,{size:`compact`,label:`Country`,children:u})]})]})},h={parameters:{controls:{include:[`size`]}},render:e=>(0,c.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-24)`,maxWidth:480},children:[(0,c.jsx)(a,{...e,label:`Default`,hint:`Select your preferred option.`,children:u}),(0,c.jsx)(a,{...e,label:`Required`,hint:`This field must be completed.`,required:!0,children:u}),(0,c.jsx)(a,{...e,label:`Error`,error:`Please select a valid option.`,defaultValue:``,children:u}),(0,c.jsx)(a,{...e,label:`Disabled`,disabled:!0,children:u})]})},g={name:`Label position`,parameters:{controls:{include:[`size`]}},render:e=>(0,c.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-32)`,maxWidth:560},children:[(0,c.jsxs)(`div`,{children:[(0,c.jsx)(`p`,{style:{fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,fontWeight:600,color:`var(--semantic-color-text-muted)`,textTransform:`uppercase`,letterSpacing:`0.06em`,marginBottom:`var(--base-spacing-16)`},children:`Above`}),(0,c.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-16)`},children:[(0,c.jsx)(a,{...e,labelPosition:`above`,label:`Country`,children:u}),(0,c.jsx)(a,{...e,labelPosition:`above`,label:`Timezone`,children:d})]})]}),(0,c.jsxs)(`div`,{children:[(0,c.jsx)(`p`,{style:{fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,fontWeight:600,color:`var(--semantic-color-text-muted)`,textTransform:`uppercase`,letterSpacing:`0.06em`,marginBottom:`var(--base-spacing-16)`},children:`Side`}),(0,c.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-16)`},children:[(0,c.jsx)(a,{...e,labelPosition:`side`,label:`Country`,children:u}),(0,c.jsx)(a,{...e,labelPosition:`side`,label:`Timezone`,children:d})]})]})]})},_={name:`Option groups`,parameters:{controls:{include:[]}},render:()=>(0,c.jsx)(`div`,{style:{maxWidth:480},children:(0,c.jsx)(a,{label:`Timezone`,hint:`All times are shown in the selected timezone.`,children:d})})},v={fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,fontWeight:600,color:`var(--semantic-color-text-muted)`,textTransform:`uppercase`,letterSpacing:`0.06em`,marginBottom:`var(--base-spacing-12)`},y={name:`State select`,parameters:{controls:{include:[]}},render:()=>(0,c.jsxs)(`div`,{style:{display:`flex`,gap:`var(--base-spacing-40)`,flexWrap:`wrap`,alignItems:`flex-start`},children:[(0,c.jsxs)(`div`,{children:[(0,c.jsx)(`p`,{style:v,children:`Abbreviation only`}),(0,c.jsxs)(a,{label:`State`,autoComplete:`address-level1`,style:{minWidth:90},children:[(0,c.jsx)(`option`,{value:``,children:`—`}),l.map(([e])=>(0,c.jsx)(`option`,{value:e,children:e},e))]})]}),(0,c.jsxs)(`div`,{children:[(0,c.jsx)(`p`,{style:v,children:`Combined — abbr when selected`}),(0,c.jsx)(o,{label:`State`,autoComplete:`address-level1`,style:{minWidth:90}}),(0,c.jsx)(`p`,{style:{...v,marginTop:`var(--base-spacing-8)`,textTransform:`none`,letterSpacing:0,fontWeight:400,fontSize:`var(--semantic-font-size-body-xs)`},children:`Dropdown shows "VT — Vermont"; closed shows "VT"`})]}),(0,c.jsxs)(`div`,{children:[(0,c.jsx)(`p`,{style:v,children:`Full name`}),(0,c.jsxs)(a,{label:`State`,autoComplete:`address-level1`,style:{minWidth:180},children:[(0,c.jsx)(`option`,{value:``,children:`—`}),l.map(([e,t])=>(0,c.jsx)(`option`,{value:e,children:t},e))]})]})]})},b={name:`Sizes × states`,parameters:{controls:{include:[]}},render:()=>{let e=[`comfortable`,`default`,`compact`],t=[{label:`Default`},{label:`Required`,required:!0,hint:`Required`},{label:`Error`,error:`Select a valid option.`},{label:`Disabled`,disabled:!0}];return(0,c.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-40)`},children:e.map(e=>(0,c.jsxs)(`div`,{children:[(0,c.jsx)(`p`,{style:{fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,fontWeight:600,color:`var(--semantic-color-text-muted)`,textTransform:`uppercase`,letterSpacing:`0.06em`,marginBottom:`var(--base-spacing-16)`},children:e}),(0,c.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`var(--base-spacing-16)`},children:t.map(t=>(0,c.jsx)(`div`,{style:{flex:`1 1 180px`,minWidth:0},children:(0,c.jsx)(a,{size:e,...t,children:u})},t.label))})]},e))})}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    maxWidth: 480
  }}>
      <SelectField {...args}>{COUNTRIES}</SelectField>
    </div>
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-32)",
    maxWidth: 480
  }}>

      <div>
        <p style={{
        fontFamily: "var(--component-paragraph-font-family)",
        fontSize: "var(--semantic-font-size-body-xs)",
        fontWeight: 600,
        color: "var(--semantic-color-text-muted)",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        marginBottom: "var(--base-spacing-12)"
      }}>Comfortable</p>
        <SelectField size="comfortable" label="Country" hint="Select the country you reside in.">{COUNTRIES}</SelectField>
      </div>

      <div>
        <p style={{
        fontFamily: "var(--component-paragraph-font-family)",
        fontSize: "var(--semantic-font-size-body-xs)",
        fontWeight: 600,
        color: "var(--semantic-color-text-muted)",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        marginBottom: "var(--base-spacing-12)"
      }}>Default</p>
        <SelectField size="default" label="Country" hint="Select the country you reside in.">{COUNTRIES}</SelectField>
      </div>

      <div>
        <p style={{
        fontFamily: "var(--component-paragraph-font-family)",
        fontSize: "var(--semantic-font-size-body-xs)",
        fontWeight: 600,
        color: "var(--semantic-color-text-muted)",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        marginBottom: "var(--base-spacing-12)"
      }}>Compact</p>
        <SelectField size="compact" label="Country">{COUNTRIES}</SelectField>
      </div>

    </div>
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      include: ["size"]
    }
  },
  render: args => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-24)",
    maxWidth: 480
  }}>

      <SelectField {...args} label="Default" hint="Select your preferred option.">{COUNTRIES}</SelectField>

      <SelectField {...args} label="Required" hint="This field must be completed." required>{COUNTRIES}</SelectField>

      <SelectField {...args} label="Error" error="Please select a valid option." defaultValue="">{COUNTRIES}</SelectField>

      <SelectField {...args} label="Disabled" disabled>{COUNTRIES}</SelectField>

    </div>
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: "Label position",
  parameters: {
    controls: {
      include: ["size"]
    }
  },
  render: args => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-32)",
    maxWidth: 560
  }}>

      <div>
        <p style={{
        fontFamily: "var(--component-paragraph-font-family)",
        fontSize: "var(--semantic-font-size-body-xs)",
        fontWeight: 600,
        color: "var(--semantic-color-text-muted)",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        marginBottom: "var(--base-spacing-16)"
      }}>Above</p>
        <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--base-spacing-16)"
      }}>
          <SelectField {...args} labelPosition="above" label="Country">{COUNTRIES}</SelectField>
          <SelectField {...args} labelPosition="above" label="Timezone">{TIMEZONES}</SelectField>
        </div>
      </div>

      <div>
        <p style={{
        fontFamily: "var(--component-paragraph-font-family)",
        fontSize: "var(--semantic-font-size-body-xs)",
        fontWeight: 600,
        color: "var(--semantic-color-text-muted)",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        marginBottom: "var(--base-spacing-16)"
      }}>Side</p>
        <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--base-spacing-16)"
      }}>
          <SelectField {...args} labelPosition="side" label="Country">{COUNTRIES}</SelectField>
          <SelectField {...args} labelPosition="side" label="Timezone">{TIMEZONES}</SelectField>
        </div>
      </div>

    </div>
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: "Option groups",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    maxWidth: 480
  }}>
      <SelectField label="Timezone" hint="All times are shown in the selected timezone.">{TIMEZONES}</SelectField>
    </div>
}`,..._.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: "State select",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    display: "flex",
    gap: "var(--base-spacing-40)",
    flexWrap: "wrap",
    alignItems: "flex-start"
  }}>

      <div>
        <p style={LABEL_STYLE}>Abbreviation only</p>
        <SelectField label="State" autoComplete="address-level1" style={{
        minWidth: 90
      }}>
          <option value="">—</option>
          {US_STATES.map(([abbr]) => <option key={abbr} value={abbr}>{abbr}</option>)}
        </SelectField>
      </div>

      <div>
        <p style={LABEL_STYLE}>Combined — abbr when selected</p>
        <CombinedStateSelect label="State" autoComplete="address-level1" style={{
        minWidth: 90
      }} />
        <p style={{
        ...LABEL_STYLE,
        marginTop: "var(--base-spacing-8)",
        textTransform: "none",
        letterSpacing: 0,
        fontWeight: 400,
        fontSize: "var(--semantic-font-size-body-xs)"
      }}>
          Dropdown shows "VT — Vermont"; closed shows "VT"
        </p>
      </div>

      <div>
        <p style={LABEL_STYLE}>Full name</p>
        <SelectField label="State" autoComplete="address-level1" style={{
        minWidth: 180
      }}>
          <option value="">—</option>
          {US_STATES.map(([abbr, name]) => <option key={abbr} value={abbr}>{name}</option>)}
        </SelectField>
      </div>

    </div>
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: "Sizes × states",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => {
    const sizes = ["comfortable", "default", "compact"];
    const fields = [{
      label: "Default"
    }, {
      label: "Required",
      required: true,
      hint: "Required"
    }, {
      label: "Error",
      error: "Select a valid option."
    }, {
      label: "Disabled",
      disabled: true
    }];
    return <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--base-spacing-40)"
    }}>
        {sizes.map(size => <div key={size}>
            <p style={{
          fontFamily: "var(--component-paragraph-font-family)",
          fontSize: "var(--semantic-font-size-body-xs)",
          fontWeight: 600,
          color: "var(--semantic-color-text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: "var(--base-spacing-16)"
        }}>{size}</p>
            <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--base-spacing-16)"
        }}>
              {fields.map(f => <div key={f.label} style={{
            flex: "1 1 180px",
            minWidth: 0
          }}>
                  <SelectField size={size} {...f}>{COUNTRIES}</SelectField>
                </div>)}
            </div>
          </div>)}
      </div>;
  }
}`,...b.parameters?.docs?.source}}},x=[`Configurable`,`Sizes`,`States`,`LabelPosition`,`OptionGroups`,`StateSelect`,`SizesAndStates`]}))();export{p as Configurable,g as LabelPosition,_ as OptionGroups,m as Sizes,b as SizesAndStates,y as StateSelect,h as States,x as __namedExportsOrder,f as default};