import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{C as n,t as r}from"./iframe-BwSdWSBC.js";import{n as i,t as a}from"./Button-C1gAzzoD.js";import{n as o,t as s}from"./ButtonContainer-CkyQeblS.js";import{n as c,t as l}from"./FieldsetContext-C1VxNv-h.js";import{n as u,t as d}from"./Fieldset-BfhR8Nbv.js";var f=e((()=>{}));function p({label:e,hint:t,error:n,size:r,labelPosition:i,disabled:a=!1,checked:o,defaultChecked:s=!1,onChange:c,id:u,className:d=``,name:f,value:p,...v}){let y=(0,m.useContext)(l),b=(0,m.useId)(),x=u??b,S=`${x}-hint`,C=`${x}-error`,w=g.includes(r)?r:y?.size??`default`,T=_.includes(i)?i:`end`,[E,D]=(0,m.useState)(s),O=o===void 0?E:o;function k(e){o===void 0&&D(e.target.checked),c?.(e.target.checked,e)}let A=[`a1-switch`,`a1-switch--${w}`,e&&`a1-switch--label-${T}`,n&&`a1-switch--error`,a&&`a1-switch--disabled`,d].filter(Boolean).join(` `),j=(0,h.jsx)(`input`,{type:`checkbox`,role:`switch`,id:x,className:`a1-switch__input`,checked:O,disabled:a,onChange:k,"aria-describedby":[n?C:t?S:null].filter(Boolean).join(` `)||void 0,"aria-invalid":n?`true`:void 0,name:f,value:p,...v}),M=(0,h.jsx)(`span`,{className:`a1-switch__track${O?` a1-switch__track--on`:``}`,"aria-hidden":`true`});return(0,h.jsx)(`div`,{className:A,children:e?(0,h.jsxs)(`label`,{className:`a1-switch__row`,children:[j,M,(0,h.jsxs)(`div`,{className:`a1-switch__content`,children:[(0,h.jsx)(`span`,{className:`a1-switch__label`,children:e}),t&&!n&&(0,h.jsx)(`p`,{className:`a1-switch__message a1-switch__message--hint`,id:S,children:t}),n&&(0,h.jsx)(`p`,{className:`a1-switch__message a1-switch__message--error`,id:C,role:`alert`,children:n})]})]}):(0,h.jsxs)(h.Fragment,{children:[(0,h.jsxs)(`label`,{className:`a1-switch__row`,children:[j,M]}),t&&!n&&(0,h.jsx)(`p`,{className:`a1-switch__message a1-switch__message--hint`,id:S,children:t}),n&&(0,h.jsx)(`p`,{className:`a1-switch__message a1-switch__message--error`,id:C,role:`alert`,children:n})]})})}var m,h,g,_,v=e((()=>{m=t(n(),1),c(),f(),h=r(),g=[`comfortable`,`default`,`compact`],_=[`end`,`start`],p.__docgenInfo={description:``,methods:[],displayName:`Switch`,props:{disabled:{defaultValue:{value:`false`,computed:!1},required:!1},defaultChecked:{defaultValue:{value:`false`,computed:!1},required:!1},className:{defaultValue:{value:`""`,computed:!1},required:!1}}}}));function y(){let[e,t]=(0,b.useState)({notifications:!0,marketing:!1,twoFactor:!1}),[n,r]=(0,b.useState)(!1);function i(e){t(t=>({...t,[e]:!t[e]})),r(!1)}return(0,x.jsx)(`form`,{style:{maxWidth:400},onSubmit:e=>{e.preventDefault(),r(!0)},children:(0,x.jsxs)(d,{legend:`Notification settings`,children:[(0,x.jsx)(p,{label:`Email notifications`,hint:`Receive updates directly in your inbox.`,checked:e.notifications,onChange:()=>i(`notifications`)}),(0,x.jsx)(p,{label:`Marketing emails`,hint:`Promotions, tips, and announcements.`,checked:e.marketing,onChange:()=>i(`marketing`)}),(0,x.jsx)(p,{label:`Two-factor authentication`,hint:`Adds an extra layer of security to your account.`,checked:e.twoFactor,onChange:()=>i(`twoFactor`)}),(0,x.jsx)(s,{align:`start`,children:(0,x.jsx)(a,{type:`submit`,variant:`primary`,children:`Save settings`})}),n&&(0,x.jsx)(`p`,{style:{margin:0,fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-sm)`,color:`var(--semantic-color-text-muted)`},children:`Settings saved.`})]})})}var b,x,S,C,w,T,E,D,O,k,A;e((()=>{b=t(n(),1),v(),u(),o(),i(),x=r(),S={title:`Components/Forms/Switch`,component:p,tags:[`autodocs`],parameters:{layout:`padded`},args:{label:`Enable notifications`,size:`default`,labelPosition:`end`,disabled:!1},argTypes:{size:{control:`inline-radio`,options:[`comfortable`,`default`,`compact`]},labelPosition:{control:`inline-radio`,options:[`end`,`start`]},disabled:{control:`boolean`},hint:{control:`text`},error:{control:`text`},label:{control:`text`}}},C={fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,fontWeight:600,color:`var(--semantic-color-text-muted)`,textTransform:`uppercase`,letterSpacing:`0.06em`,marginBottom:`var(--base-spacing-8)`},w={render:e=>(0,x.jsx)(p,{...e})},T={parameters:{controls:{include:[]}},render:()=>(0,x.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-24)`},children:[`comfortable`,`default`,`compact`].map(e=>(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`p`,{style:C,children:e}),(0,x.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-12)`},children:[(0,x.jsx)(p,{size:e,label:`Enable notifications`}),(0,x.jsx)(p,{size:e,label:`Enable notifications`,defaultChecked:!0}),(0,x.jsx)(p,{size:e,label:`Enable notifications`,disabled:!0}),(0,x.jsx)(p,{size:e,label:`Enable notifications`,defaultChecked:!0,disabled:!0})]})]},e))})},E={parameters:{controls:{include:[`size`]}},render:e=>(0,x.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-20)`},children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`p`,{style:C,children:`Default (off)`}),(0,x.jsx)(p,{...e,label:`Enable notifications`})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`p`,{style:C,children:`Default (on)`}),(0,x.jsx)(p,{...e,label:`Enable notifications`,defaultChecked:!0})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`p`,{style:C,children:`With hint`}),(0,x.jsx)(p,{...e,label:`Marketing emails`,hint:`Receive updates about new features and promotions.`})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`p`,{style:C,children:`Error`}),(0,x.jsx)(p,{...e,label:`Accept terms`,error:`You must accept the terms to continue.`})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`p`,{style:C,children:`Disabled (off)`}),(0,x.jsx)(p,{...e,label:`Enable notifications`,disabled:!0})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`p`,{style:C,children:`Disabled (on)`}),(0,x.jsx)(p,{...e,label:`Enable notifications`,defaultChecked:!0,disabled:!0})]})]})},D={parameters:{controls:{include:[`size`]}},render:e=>(0,x.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-20)`},children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`p`,{style:C,children:`Label end (default)`}),(0,x.jsx)(p,{...e,label:`Enable notifications`})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`p`,{style:C,children:`Label start`}),(0,x.jsx)(p,{...e,label:`Enable notifications`,labelPosition:`start`})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`p`,{style:C,children:`Label start — checked`}),(0,x.jsx)(p,{...e,label:`Enable notifications`,labelPosition:`start`,defaultChecked:!0})]})]})},O={name:`Without label`,parameters:{controls:{include:[`size`,`disabled`]}},render:e=>(0,x.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-16)`},children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`p`,{style:C,children:`Standalone (requires aria-label)`}),(0,x.jsxs)(`div`,{style:{display:`flex`,gap:`var(--base-spacing-16)`,alignItems:`center`},children:[(0,x.jsx)(p,{...e,"aria-label":`Enable dark mode`}),(0,x.jsx)(p,{...e,"aria-label":`Enable dark mode`,defaultChecked:!0}),(0,x.jsx)(p,{...e,"aria-label":`Enable dark mode`,disabled:!0})]})]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`p`,{style:C,children:`In a settings row`}),(0,x.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`space-between`,gap:`var(--base-spacing-16)`,padding:`var(--base-spacing-12) var(--base-spacing-16)`,borderRadius:`var(--base-radius-md)`,border:`1px solid var(--semantic-color-border-subtle)`,maxWidth:360},children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`p`,{style:{margin:0,fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-md)`,color:`var(--semantic-color-text-default)`},children:`Dark mode`}),(0,x.jsx)(`p`,{style:{margin:0,fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-sm)`,color:`var(--semantic-color-text-muted)`},children:`Switch between light and dark themes`})]}),(0,x.jsx)(p,{...e,"aria-label":`Toggle dark mode`})]})]})]})},k={name:`In a form`,parameters:{controls:{include:[]}},render:()=>(0,x.jsx)(y,{})},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: args => <Switch {...args} />
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  name: "In a form",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <SettingsForm />
}`,...k.parameters?.docs?.source}}},A=[`Configurable`,`Sizes`,`States`,`LabelPosition`,`WithoutLabel`,`InAForm`]}))();export{w as Configurable,k as InAForm,D as LabelPosition,T as Sizes,E as States,O as WithoutLabel,A as __namedExportsOrder,S as default};