import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./iframe-BwSdWSBC.js";import{n,t as r}from"./DateField-Ba4_mMRX.js";var i,a,o,s,c,l,u;e((()=>{n(),i=t(),a={title:`Components/Forms/Input Date`,component:r,tags:[`autodocs`],parameters:{layout:`padded`},args:{label:`Date of birth`,hint:`You must be 18 or older to register.`,size:`default`,labelPosition:`above`,required:!1,disabled:!1},argTypes:{size:{control:`inline-radio`,options:[`comfortable`,`default`,`compact`]},labelPosition:{control:`inline-radio`,options:[`above`,`side`]},error:{control:`text`},hint:{control:`text`},label:{control:`text`}}},o={render:e=>(0,i.jsx)(r,{...e})},s={parameters:{controls:{include:[]}},render:()=>(0,i.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-32)`},children:[(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`p`,{style:{fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,fontWeight:600,color:`var(--semantic-color-text-muted)`,textTransform:`uppercase`,letterSpacing:`0.06em`,marginBottom:`var(--base-spacing-12)`},children:`Comfortable`}),(0,i.jsx)(r,{size:`comfortable`,label:`Date of birth`,hint:`DD / MM / YYYY`})]}),(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`p`,{style:{fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,fontWeight:600,color:`var(--semantic-color-text-muted)`,textTransform:`uppercase`,letterSpacing:`0.06em`,marginBottom:`var(--base-spacing-12)`},children:`Default`}),(0,i.jsx)(r,{size:`default`,label:`Date of birth`,hint:`DD / MM / YYYY`})]}),(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`p`,{style:{fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,fontWeight:600,color:`var(--semantic-color-text-muted)`,textTransform:`uppercase`,letterSpacing:`0.06em`,marginBottom:`var(--base-spacing-12)`},children:`Compact`}),(0,i.jsx)(r,{size:`compact`,label:`Date of birth`})]})]})},c={parameters:{controls:{include:[`size`]}},render:e=>(0,i.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-24)`},children:[(0,i.jsx)(r,{...e,label:`Default`,hint:`Select a date.`}),(0,i.jsx)(r,{...e,label:`Required`,hint:`This field must be completed.`,required:!0}),(0,i.jsx)(r,{...e,label:`Error`,error:`Enter a valid date.`,defaultValue:`2099-99-99`}),(0,i.jsx)(r,{...e,label:`Disabled`,disabled:!0})]})},l={name:`In a form row`,parameters:{controls:{include:[]}},render:()=>(0,i.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-20)`,maxWidth:560},children:[(0,i.jsxs)(`div`,{style:{display:`flex`,gap:`var(--base-spacing-16)`,flexWrap:`wrap`},children:[(0,i.jsx)(r,{label:`Start date`,hint:`Inclusive`,required:!0}),(0,i.jsx)(r,{label:`End date`,hint:`Inclusive`})]}),(0,i.jsx)(r,{label:`Date of birth`,hint:`You must be 18 or older.`,required:!0})]})},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: args => <DateField {...args} />
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-32)"
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
        <DateField size="comfortable" label="Date of birth" hint="DD / MM / YYYY" />
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
        <DateField size="default" label="Date of birth" hint="DD / MM / YYYY" />
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
        <DateField size="compact" label="Date of birth" />
      </div>

    </div>
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      include: ["size"]
    }
  },
  render: args => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-24)"
  }}>

      <DateField {...args} label="Default" hint="Select a date." />

      <DateField {...args} label="Required" hint="This field must be completed." required />

      <DateField {...args} label="Error" error="Enter a valid date." defaultValue="2099-99-99" />

      <DateField {...args} label="Disabled" disabled />

    </div>
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: "In a form row",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-20)",
    maxWidth: 560
  }}>
      <div style={{
      display: "flex",
      gap: "var(--base-spacing-16)",
      flexWrap: "wrap"
    }}>
        <DateField label="Start date" hint="Inclusive" required />
        <DateField label="End date" hint="Inclusive" />
      </div>
      <DateField label="Date of birth" hint="You must be 18 or older." required />
    </div>
}`,...l.parameters?.docs?.source}}},u=[`Configurable`,`Sizes`,`States`,`InFormRow`]}))();export{o as Configurable,l as InFormRow,s as Sizes,c as States,u as __namedExportsOrder,a as default};