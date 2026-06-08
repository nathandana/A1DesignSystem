import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{T as n,r}from"./iframe-DZoRqkgT.js";import{n as i,t as a}from"./Button-Clq9-j9U.js";import{n as o,t as s}from"./ButtonContainer-DpvY6AWj.js";import{n as c,t as l}from"./Fieldset-BSK4uo-9.js";import{n as u,t as d}from"./Switch-XlcaPS2C.js";function f(){let[e,t]=(0,p.useState)({notifications:!0,marketing:!1,twoFactor:!1}),[n,r]=(0,p.useState)(!1);function i(e){t(t=>({...t,[e]:!t[e]})),r(!1)}return(0,m.jsx)(`form`,{style:{maxWidth:400},onSubmit:e=>{e.preventDefault(),r(!0)},children:(0,m.jsxs)(l,{legend:`Notification settings`,children:[(0,m.jsx)(d,{label:`Email notifications`,hint:`Receive updates directly in your inbox.`,checked:e.notifications,onChange:()=>i(`notifications`)}),(0,m.jsx)(d,{label:`Marketing emails`,hint:`Promotions, tips, and announcements.`,checked:e.marketing,onChange:()=>i(`marketing`)}),(0,m.jsx)(d,{label:`Two-factor authentication`,hint:`Adds an extra layer of security to your account.`,checked:e.twoFactor,onChange:()=>i(`twoFactor`)}),(0,m.jsx)(s,{align:`start`,children:(0,m.jsx)(a,{type:`submit`,variant:`primary`,children:`Save settings`})}),n&&(0,m.jsx)(`p`,{style:{margin:0,fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-sm)`,color:`var(--semantic-color-text-muted)`},children:`Settings saved.`})]})})}var p,m,h,g,_,v,y,b,x,S,C;e((()=>{p=t(n(),1),u(),c(),o(),i(),m=r(),h={title:`Components/Forms/Switch`,component:d,tags:[`autodocs`],parameters:{layout:`padded`},args:{label:`Enable notifications`,size:`default`,labelPosition:`end`,disabled:!1},argTypes:{size:{control:`inline-radio`,options:[`comfortable`,`default`,`compact`]},labelPosition:{control:`inline-radio`,options:[`end`,`start`]},disabled:{control:`boolean`},hint:{control:`text`},error:{control:`text`},label:{control:`text`}}},g={fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,fontWeight:600,color:`var(--semantic-color-text-muted)`,textTransform:`uppercase`,letterSpacing:`0.06em`,marginBottom:`var(--base-spacing-8)`},_={render:e=>(0,m.jsx)(d,{...e})},v={parameters:{controls:{include:[]}},render:()=>(0,m.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-24)`},children:[`comfortable`,`default`,`compact`].map(e=>(0,m.jsxs)(`div`,{children:[(0,m.jsx)(`p`,{style:g,children:e}),(0,m.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-12)`},children:[(0,m.jsx)(d,{size:e,label:`Enable notifications`}),(0,m.jsx)(d,{size:e,label:`Enable notifications`,defaultChecked:!0}),(0,m.jsx)(d,{size:e,label:`Enable notifications`,disabled:!0}),(0,m.jsx)(d,{size:e,label:`Enable notifications`,defaultChecked:!0,disabled:!0})]})]},e))})},y={parameters:{controls:{include:[`size`]}},render:e=>(0,m.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-20)`},children:[(0,m.jsxs)(`div`,{children:[(0,m.jsx)(`p`,{style:g,children:`Default (off)`}),(0,m.jsx)(d,{...e,label:`Enable notifications`})]}),(0,m.jsxs)(`div`,{children:[(0,m.jsx)(`p`,{style:g,children:`Default (on)`}),(0,m.jsx)(d,{...e,label:`Enable notifications`,defaultChecked:!0})]}),(0,m.jsxs)(`div`,{children:[(0,m.jsx)(`p`,{style:g,children:`With hint`}),(0,m.jsx)(d,{...e,label:`Marketing emails`,hint:`Receive updates about new features and promotions.`})]}),(0,m.jsxs)(`div`,{children:[(0,m.jsx)(`p`,{style:g,children:`Error`}),(0,m.jsx)(d,{...e,label:`Accept terms`,error:`You must accept the terms to continue.`})]}),(0,m.jsxs)(`div`,{children:[(0,m.jsx)(`p`,{style:g,children:`Disabled (off)`}),(0,m.jsx)(d,{...e,label:`Enable notifications`,disabled:!0})]}),(0,m.jsxs)(`div`,{children:[(0,m.jsx)(`p`,{style:g,children:`Disabled (on)`}),(0,m.jsx)(d,{...e,label:`Enable notifications`,defaultChecked:!0,disabled:!0})]})]})},b={parameters:{controls:{include:[`size`]}},render:e=>(0,m.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-20)`},children:[(0,m.jsxs)(`div`,{children:[(0,m.jsx)(`p`,{style:g,children:`Label end (default)`}),(0,m.jsx)(d,{...e,label:`Enable notifications`})]}),(0,m.jsxs)(`div`,{children:[(0,m.jsx)(`p`,{style:g,children:`Label start`}),(0,m.jsx)(d,{...e,label:`Enable notifications`,labelPosition:`start`})]}),(0,m.jsxs)(`div`,{children:[(0,m.jsx)(`p`,{style:g,children:`Label start — checked`}),(0,m.jsx)(d,{...e,label:`Enable notifications`,labelPosition:`start`,defaultChecked:!0})]})]})},x={name:`Without label`,parameters:{controls:{include:[`size`,`disabled`]}},render:e=>(0,m.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-16)`},children:[(0,m.jsxs)(`div`,{children:[(0,m.jsx)(`p`,{style:g,children:`Standalone (requires aria-label)`}),(0,m.jsxs)(`div`,{style:{display:`flex`,gap:`var(--base-spacing-16)`,alignItems:`center`},children:[(0,m.jsx)(d,{...e,"aria-label":`Enable dark mode`}),(0,m.jsx)(d,{...e,"aria-label":`Enable dark mode`,defaultChecked:!0}),(0,m.jsx)(d,{...e,"aria-label":`Enable dark mode`,disabled:!0})]})]}),(0,m.jsxs)(`div`,{children:[(0,m.jsx)(`p`,{style:g,children:`In a settings row`}),(0,m.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`space-between`,gap:`var(--base-spacing-16)`,padding:`var(--base-spacing-12) var(--base-spacing-16)`,borderRadius:`var(--base-radius-md)`,border:`1px solid var(--semantic-color-border-subtle)`,maxWidth:360},children:[(0,m.jsxs)(`div`,{children:[(0,m.jsx)(`p`,{style:{margin:0,fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-md)`,color:`var(--semantic-color-text-default)`},children:`Dark mode`}),(0,m.jsx)(`p`,{style:{margin:0,fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-sm)`,color:`var(--semantic-color-text-muted)`},children:`Switch between light and dark themes`})]}),(0,m.jsx)(d,{...e,"aria-label":`Toggle dark mode`})]})]})]})},S={name:`In a form`,parameters:{controls:{include:[]}},render:()=>(0,m.jsx)(f,{})},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: args => <Switch {...args} />
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-24)"
  }}>
      {["comfortable", "default", "compact"].map(sz => <div key={sz}>
          <p style={LABEL}>{sz}</p>
          <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--base-spacing-12)"
      }}>
            <Switch size={sz} label="Enable notifications" />
            <Switch size={sz} label="Enable notifications" defaultChecked />
            <Switch size={sz} label="Enable notifications" disabled />
            <Switch size={sz} label="Enable notifications" defaultChecked disabled />
          </div>
        </div>)}
    </div>
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      include: ["size"]
    }
  },
  render: args => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-20)"
  }}>

      <div>
        <p style={LABEL}>Default (off)</p>
        <Switch {...args} label="Enable notifications" />
      </div>

      <div>
        <p style={LABEL}>Default (on)</p>
        <Switch {...args} label="Enable notifications" defaultChecked />
      </div>

      <div>
        <p style={LABEL}>With hint</p>
        <Switch {...args} label="Marketing emails" hint="Receive updates about new features and promotions." />
      </div>

      <div>
        <p style={LABEL}>Error</p>
        <Switch {...args} label="Accept terms" error="You must accept the terms to continue." />
      </div>

      <div>
        <p style={LABEL}>Disabled (off)</p>
        <Switch {...args} label="Enable notifications" disabled />
      </div>

      <div>
        <p style={LABEL}>Disabled (on)</p>
        <Switch {...args} label="Enable notifications" defaultChecked disabled />
      </div>

    </div>
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      include: ["size"]
    }
  },
  render: args => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-20)"
  }}>

      <div>
        <p style={LABEL}>Label end (default)</p>
        <Switch {...args} label="Enable notifications" />
      </div>

      <div>
        <p style={LABEL}>Label start</p>
        <Switch {...args} label="Enable notifications" labelPosition="start" />
      </div>

      <div>
        <p style={LABEL}>Label start — checked</p>
        <Switch {...args} label="Enable notifications" labelPosition="start" defaultChecked />
      </div>

    </div>
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: "Without label",
  parameters: {
    controls: {
      include: ["size", "disabled"]
    }
  },
  render: args => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-16)"
  }}>

      <div>
        <p style={LABEL}>Standalone (requires aria-label)</p>
        <div style={{
        display: "flex",
        gap: "var(--base-spacing-16)",
        alignItems: "center"
      }}>
          <Switch {...args} aria-label="Enable dark mode" />
          <Switch {...args} aria-label="Enable dark mode" defaultChecked />
          <Switch {...args} aria-label="Enable dark mode" disabled />
        </div>
      </div>

      <div>
        <p style={LABEL}>In a settings row</p>
        <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--base-spacing-16)",
        padding: "var(--base-spacing-12) var(--base-spacing-16)",
        borderRadius: "var(--base-radius-md)",
        border: "1px solid var(--semantic-color-border-subtle)",
        maxWidth: 360
      }}>
          <div>
            <p style={{
            margin: 0,
            fontFamily: "var(--component-paragraph-font-family)",
            fontSize: "var(--semantic-font-size-body-md)",
            color: "var(--semantic-color-text-default)"
          }}>
              Dark mode
            </p>
            <p style={{
            margin: 0,
            fontFamily: "var(--component-paragraph-font-family)",
            fontSize: "var(--semantic-font-size-body-sm)",
            color: "var(--semantic-color-text-muted)"
          }}>
              Switch between light and dark themes
            </p>
          </div>
          <Switch {...args} aria-label="Toggle dark mode" />
        </div>
      </div>

    </div>
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  name: "In a form",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <SettingsForm />
}`,...S.parameters?.docs?.source}}},C=[`Configurable`,`Sizes`,`States`,`LabelPosition`,`WithoutLabel`,`InAForm`]}))();export{_ as Configurable,S as InAForm,b as LabelPosition,v as Sizes,y as States,x as WithoutLabel,C as __namedExportsOrder,h as default};