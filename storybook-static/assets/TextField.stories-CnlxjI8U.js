import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{C as n,t as r}from"./iframe-BwSdWSBC.js";import{n as i,t as a}from"./TextField-Dvl2R4k6.js";import{a as o,c as s,i as c,l,n as u,o as d,r as f,s as p,t as m,u as h}from"./PhoneField-CP78Vnpr.js";var g=e((()=>{}));function _(e){return x.find(t=>t.pattern.test(e))??null}function v({value:e,defaultValue:t,onChange:n,onKeyDown:r,onFocus:i,onClick:o,className:s=``,...c}){let[u,f]=(0,y.useState)(()=>e==null?t==null?``:p(String(t)).slice(0,16):p(String(e)).slice(0,16)),m=(0,y.useRef)(null),g=(0,y.useRef)(null),v=e==null?u:p(String(e)).slice(0,16),x=v.length>0?_(v):null,C=x?.mask??S,w=l(C),T=v.slice(0,w),E=d(T,C);(0,y.useLayoutEffect)(()=>{if(g.current!==null&&m.current){let e=g.current;m.current.setSelectionRange(e,e),g.current=null}});function D(t){let r=(t.length>0?_(t):null)?.mask??S,i=t.slice(0,l(r));e??f(i),n?.({target:{value:d(i,r)}}),g.current=h(i.length,r)}function O(e){if(e.key>=`0`&&e.key<=`9`){e.preventDefault();let{selectionStart:t,selectionEnd:n}=e.target,r=t===n?v.slice(0,w):``;r.length<w&&D(r+e.key)}else if(e.key===`Backspace`||e.key===`Delete`){e.preventDefault();let{selectionStart:t,selectionEnd:n}=e.target;t===n?v.length>0&&D(v.slice(0,-1)):D(``)}r?.(e)}function k(e){D(p(e.target.value).slice(0,16))}function A(e){let t=h(T.length,C);requestAnimationFrame(()=>{m.current?.setSelectionRange(t,t)}),i?.(e)}function j(e){let t=h(T.length,C);requestAnimationFrame(()=>{m.current?.setSelectionRange(t,t)}),o?.(e)}let M=h(T.length,C);return(0,b.jsx)(a,{ref:m,type:`tel`,inputMode:`numeric`,autoComplete:`cc-number`,value:E,onChange:k,onKeyDown:O,onFocus:A,onClick:j,inputOverlay:(0,b.jsxs)(b.Fragment,{children:[(0,b.jsxs)(`div`,{className:`a1-field__mask-overlay`,"aria-hidden":`true`,children:[(0,b.jsx)(`span`,{className:`a1-field__mask-typed`,children:E.slice(0,M)}),(0,b.jsx)(`span`,{className:`a1-field__mask-placeholder`,children:E.slice(M)})]}),x&&(0,b.jsx)(`span`,{className:`a1-credit-card__badge`,"aria-hidden":`true`,children:x.label})]}),className:[`a1-credit-card`,x&&`a1-credit-card--detected`,s].filter(Boolean).join(` `).trim(),...c})}var y,b,x,S,C=e((()=>{y=t(n(),1),i(),s(),g(),b=r(),x=[{type:`amex`,label:`Amex`,pattern:/^3[47]/,mask:`#### ###### #####`},{type:`mastercard`,label:`MC`,pattern:/^(5[1-5]|2[2-7])/,mask:`#### #### #### ####`},{type:`discover`,label:`Disc`,pattern:/^6(?:011|22|4[4-9]|5)/,mask:`#### #### #### ####`},{type:`visa`,label:`Visa`,pattern:/^4/,mask:`#### #### #### ####`}],S=`#### #### #### ####`,v.__docgenInfo={description:``,methods:[],displayName:`CreditCardField`,props:{className:{defaultValue:{value:`""`,computed:!1},required:!1}}}}));function w({className:e=``,...t}){return(0,T.jsx)(a,{type:`number`,className:e,...t})}var T,E=e((()=>{i(),T=r(),w.__docgenInfo={description:``,methods:[],displayName:`NumberField`,props:{className:{defaultValue:{value:`""`,computed:!1},required:!1}}}}));function D({className:e=``,...t}){return(0,O.jsx)(a,{type:`time`,className:`a1-field--fit ${e}`.trim(),...t})}var O,k=e((()=>{i(),O=r(),D.__docgenInfo={description:``,methods:[],displayName:`TimeField`,props:{className:{defaultValue:{value:`""`,computed:!1},required:!1}}}})),A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G;e((()=>{i(),u(),o(),C(),E(),k(),A=r(),j={title:`Components/Forms/Input Text`,component:a,tags:[`autodocs`],parameters:{layout:`padded`},args:{label:`Email address`,hint:`We'll only use this to send you account notifications.`,size:`default`,labelPosition:`above`,required:!1,disabled:!1,readOnly:!1},argTypes:{size:{control:`inline-radio`,options:[`comfortable`,`default`,`compact`]},labelPosition:{control:`inline-radio`,options:[`above`,`side`]},error:{control:`text`},hint:{control:`text`},label:{control:`text`}}},M={render:e=>(0,A.jsx)(`div`,{style:{maxWidth:480},children:(0,A.jsx)(a,{...e})})},N={parameters:{controls:{include:[]}},render:()=>(0,A.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-32)`,maxWidth:480},children:[(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`p`,{style:{fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,fontWeight:600,color:`var(--semantic-color-text-muted)`,textTransform:`uppercase`,letterSpacing:`0.06em`,marginBottom:`var(--base-spacing-12)`},children:`Comfortable`}),(0,A.jsx)(a,{size:`comfortable`,label:`Full name`,hint:`As it appears on your ID.`})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`p`,{style:{fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,fontWeight:600,color:`var(--semantic-color-text-muted)`,textTransform:`uppercase`,letterSpacing:`0.06em`,marginBottom:`var(--base-spacing-12)`},children:`Default`}),(0,A.jsx)(a,{size:`default`,label:`Full name`,hint:`As it appears on your ID.`})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`p`,{style:{fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,fontWeight:600,color:`var(--semantic-color-text-muted)`,textTransform:`uppercase`,letterSpacing:`0.06em`,marginBottom:`var(--base-spacing-12)`},children:`Compact`}),(0,A.jsx)(a,{size:`compact`,label:`Full name`,hint:`As it appears on your ID.`})]})]})},P={parameters:{controls:{include:[`size`]}},render:e=>(0,A.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-24)`,maxWidth:480},children:[(0,A.jsx)(a,{...e,label:`Default`,hint:`Hint text provides additional context.`}),(0,A.jsx)(a,{...e,label:`Required`,hint:`This field must be completed before submitting.`,required:!0}),(0,A.jsx)(a,{...e,label:`Error`,defaultValue:`not-an-email`,error:`Enter a valid email address.`}),(0,A.jsx)(a,{...e,label:`Read-only`,value:`jane.smith@example.com`,readOnly:!0,hint:`Contact your administrator to change this.`,onChange:()=>{}}),(0,A.jsx)(a,{...e,label:`Disabled`,hint:`This field is not available right now.`,disabled:!0})]})},F={name:`Label position`,parameters:{controls:{include:[`size`]}},render:e=>(0,A.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-32)`,maxWidth:560},children:[(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`p`,{style:{fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,fontWeight:600,color:`var(--semantic-color-text-muted)`,textTransform:`uppercase`,letterSpacing:`0.06em`,marginBottom:`var(--base-spacing-16)`},children:`Above`}),(0,A.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-16)`},children:[(0,A.jsx)(a,{...e,labelPosition:`above`,label:`First name`}),(0,A.jsx)(a,{...e,labelPosition:`above`,label:`Last name`}),(0,A.jsx)(a,{...e,labelPosition:`above`,label:`Email`,hint:`We'll never share your email.`,required:!0})]})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`p`,{style:{fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,fontWeight:600,color:`var(--semantic-color-text-muted)`,textTransform:`uppercase`,letterSpacing:`0.06em`,marginBottom:`var(--base-spacing-16)`},children:`Side`}),(0,A.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-16)`},children:[(0,A.jsx)(a,{...e,labelPosition:`side`,label:`First name`}),(0,A.jsx)(a,{...e,labelPosition:`side`,label:`Last name`}),(0,A.jsx)(a,{...e,labelPosition:`side`,label:`Email`,hint:`We'll never share your email.`,required:!0})]})]})]})},I={name:`Hint messages`,parameters:{controls:{include:[]}},render:()=>(0,A.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-20)`,maxWidth:480},children:[(0,A.jsx)(a,{label:`Username`,hint:`3–20 characters. Letters, numbers and underscores only.`}),(0,A.jsx)(a,{label:`Password`,type:`password`,hint:`Minimum 8 characters with at least one number and symbol.`}),(0,A.jsx)(a,{label:`Date of birth`,hint:`You must be 18 or older to register.`}),(0,A.jsx)(a,{label:`Phone number`,hint:`Include your country code for international numbers.`}),(0,A.jsx)(a,{label:`Promo code`,hint:`Optional. Applied at checkout.`})]})},L={name:`Required badge`,parameters:{controls:{include:[]}},render:()=>(0,A.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-24)`,maxWidth:480},children:[(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`p`,{style:{fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,fontWeight:600,color:`var(--semantic-color-text-muted)`,textTransform:`uppercase`,letterSpacing:`0.06em`,marginBottom:`var(--base-spacing-12)`},children:`Comfortable — badge`}),(0,A.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-16)`},children:[(0,A.jsx)(a,{size:`comfortable`,label:`Full name`,hint:`As it appears on your ID.`,required:!0}),(0,A.jsx)(a,{size:`comfortable`,label:`Email address`,hint:`We'll use this to contact you.`,required:!0})]})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`p`,{style:{fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,fontWeight:600,color:`var(--semantic-color-text-muted)`,textTransform:`uppercase`,letterSpacing:`0.06em`,marginBottom:`var(--base-spacing-12)`},children:`Default — asterisk`}),(0,A.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-16)`},children:[(0,A.jsx)(a,{size:`default`,label:`Full name`,hint:`As it appears on your ID.`,required:!0}),(0,A.jsx)(a,{size:`compact`,label:`Email address`,required:!0})]})]})]})},R={fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,fontWeight:600,color:`var(--semantic-color-text-muted)`,textTransform:`uppercase`,letterSpacing:`0.06em`,marginBottom:`var(--base-spacing-12)`},z={name:`Phone number`,parameters:{controls:{include:[]}},render:()=>(0,A.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-32)`,maxWidth:480},children:[(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`p`,{style:R,children:`Default US format`}),(0,A.jsx)(m,{label:`Phone number`,hint:`Include your country code.`})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`p`,{style:R,children:`States`}),(0,A.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-16)`},children:[(0,A.jsx)(m,{label:`Default`,hint:`Include your country code.`}),(0,A.jsx)(m,{label:`Required`,hint:`We'll only use this for account alerts.`,required:!0}),(0,A.jsx)(m,{label:`Error`,defaultValue:`123`,error:`Enter a complete phone number.`}),(0,A.jsx)(m,{label:`Disabled`,disabled:!0})]})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`p`,{style:R,children:`Country formats`}),(0,A.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-16)`},children:[(0,A.jsx)(m,{label:`United States`,hint:`e.g. 1-800-555-1234`,mask:`#-###-###-####`}),(0,A.jsx)(m,{label:`United Kingdom`,hint:`e.g. 07700 900123`,mask:`##### ######`}),(0,A.jsx)(m,{label:`Australia`,hint:`e.g. 0412 345 678`,mask:`#### ### ###`}),(0,A.jsx)(m,{label:`Brazil`,hint:`e.g. (11) 98765-4321`,mask:`(##) #####-####`}),(0,A.jsx)(m,{label:`Germany`,hint:`e.g. 030 12345678`,mask:`### ########`})]})]})]})},B={name:`ZIP code`,parameters:{controls:{include:[]}},render:()=>(0,A.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-32)`},children:[(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`p`,{style:R,children:`Formats`}),(0,A.jsxs)(`div`,{style:{display:`flex`,gap:`var(--base-spacing-24)`,flexWrap:`wrap`},children:[(0,A.jsx)(c,{label:`5-digit ZIP`,mask:f.zip5,hint:`e.g. 90210`}),(0,A.jsx)(c,{label:`ZIP+4`,mask:f.zip9,hint:`e.g. 90210-1234`})]})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`p`,{style:R,children:`States`}),(0,A.jsxs)(`div`,{style:{display:`flex`,gap:`var(--base-spacing-24)`,flexWrap:`wrap`},children:[(0,A.jsx)(c,{label:`Default`}),(0,A.jsx)(c,{label:`Required`,required:!0}),(0,A.jsx)(c,{label:`Error`,defaultValue:`123`,error:`Enter a valid ZIP code.`}),(0,A.jsx)(c,{label:`Disabled`,disabled:!0})]})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`p`,{style:R,children:`In a form row`}),(0,A.jsxs)(`div`,{style:{display:`flex`,gap:`var(--base-spacing-16)`,flexWrap:`wrap`,alignItems:`flex-start`,maxWidth:560},children:[(0,A.jsx)(`div`,{style:{flex:`1 1 200px`},children:(0,A.jsx)(a,{label:`City`,required:!0})}),(0,A.jsx)(c,{label:`ZIP code`,required:!0})]})]})]})},V={name:`Credit card`,parameters:{controls:{include:[]}},render:()=>(0,A.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-32)`,maxWidth:480},children:[(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`p`,{style:R,children:`Card number`}),(0,A.jsx)(v,{label:`Card number`,hint:`Start typing to detect your card type.`})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`p`,{style:R,children:`Card types`}),(0,A.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-16)`},children:[(0,A.jsx)(v,{label:`Visa`,defaultValue:`4111111111111111`,hint:`Starts with 4`}),(0,A.jsx)(v,{label:`Mastercard`,defaultValue:`5500000000000004`,hint:`Starts with 51–55 or 2221–2720`}),(0,A.jsx)(v,{label:`Amex`,defaultValue:`371449635398431`,hint:`Starts with 34 or 37 — 15 digits`}),(0,A.jsx)(v,{label:`Discover`,defaultValue:`6011111111111117`,hint:`Starts with 6011, 622, 644–649 or 65`})]})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`p`,{style:R,children:`States`}),(0,A.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-16)`},children:[(0,A.jsx)(v,{label:`Default`}),(0,A.jsx)(v,{label:`Required`,required:!0,hint:`Required to complete your purchase.`}),(0,A.jsx)(v,{label:`Error`,defaultValue:`1234`,error:`Enter a valid card number.`}),(0,A.jsx)(v,{label:`Disabled`,disabled:!0})]})]})]})},H={name:`Number`,parameters:{controls:{include:[]}},render:()=>(0,A.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-32)`,maxWidth:480},children:[(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`p`,{style:R,children:`Basic`}),(0,A.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-16)`},children:[(0,A.jsx)(w,{label:`Quantity`,hint:`How many units?`,min:1,max:99,defaultValue:1}),(0,A.jsx)(w,{label:`Price`,hint:`USD`,min:0,step:.01,defaultValue:9.99})]})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`p`,{style:R,children:`States`}),(0,A.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-16)`},children:[(0,A.jsx)(w,{label:`Default`,hint:`Enter a number.`,min:0}),(0,A.jsx)(w,{label:`Required`,hint:`This field must be completed.`,min:1,required:!0}),(0,A.jsx)(w,{label:`Error`,defaultValue:-5,min:0,error:`Value must be 0 or greater.`}),(0,A.jsx)(w,{label:`Disabled`,defaultValue:42,disabled:!0})]})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`p`,{style:R,children:`Sizes`}),(0,A.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-16)`},children:[(0,A.jsx)(w,{size:`comfortable`,label:`Quantity`,min:1,defaultValue:1}),(0,A.jsx)(w,{size:`default`,label:`Quantity`,min:1,defaultValue:1}),(0,A.jsx)(w,{size:`compact`,label:`Quantity`,min:1,defaultValue:1})]})]})]})},U={name:`Time`,parameters:{controls:{include:[]}},render:()=>(0,A.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-32)`},children:[(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`p`,{style:R,children:`Basic`}),(0,A.jsxs)(`div`,{style:{display:`flex`,gap:`var(--base-spacing-16)`,flexWrap:`wrap`},children:[(0,A.jsx)(D,{label:`Start time`,hint:`HH:MM`,defaultValue:`09:00`}),(0,A.jsx)(D,{label:`End time`,hint:`HH:MM`,defaultValue:`17:00`})]})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`p`,{style:R,children:`With range constraint`}),(0,A.jsx)(D,{label:`Appointment time`,hint:`Available 8 am – 6 pm.`,min:`08:00`,max:`18:00`})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`p`,{style:R,children:`States`}),(0,A.jsxs)(`div`,{style:{display:`flex`,gap:`var(--base-spacing-16)`,flexWrap:`wrap`,alignItems:`flex-start`},children:[(0,A.jsx)(D,{label:`Default`,hint:`Select a time.`}),(0,A.jsx)(D,{label:`Required`,required:!0}),(0,A.jsx)(D,{label:`Error`,error:`Select a valid time.`}),(0,A.jsx)(D,{label:`Disabled`,defaultValue:`09:00`,disabled:!0})]})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`p`,{style:R,children:`Sizes`}),(0,A.jsxs)(`div`,{style:{display:`flex`,gap:`var(--base-spacing-16)`,flexWrap:`wrap`,alignItems:`flex-start`},children:[(0,A.jsx)(D,{size:`comfortable`,label:`Start time`,defaultValue:`09:00`}),(0,A.jsx)(D,{size:`default`,label:`Start time`,defaultValue:`09:00`}),(0,A.jsx)(D,{size:`compact`,label:`Start time`,defaultValue:`09:00`})]})]})]})},W={name:`Sizes × states`,parameters:{controls:{include:[]}},render:()=>{let e=[`comfortable`,`default`,`compact`],t=[{label:`Default`},{label:`Required`,required:!0,hint:`Required field`},{label:`Error`,defaultValue:`bad-value`,error:`Enter a valid value.`},{label:`Read-only`,value:`jane@example.com`,readOnly:!0,onChange:()=>{}},{label:`Disabled`,disabled:!0}];return(0,A.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-40)`},children:e.map(e=>(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`p`,{style:{fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,fontWeight:600,color:`var(--semantic-color-text-muted)`,textTransform:`uppercase`,letterSpacing:`0.06em`,marginBottom:`var(--base-spacing-16)`},children:e}),(0,A.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`var(--base-spacing-16)`},children:t.map(t=>(0,A.jsx)(`div`,{style:{flex:`1 1 180px`,minWidth:0},children:(0,A.jsx)(a,{size:e,...t})},t.label))})]},e))})}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    maxWidth: 480
  }}>
      <TextField {...args} />
    </div>
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
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
        <TextField size="comfortable" label="Full name" hint="As it appears on your ID." />
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
        <TextField size="default" label="Full name" hint="As it appears on your ID." />
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
        <TextField size="compact" label="Full name" hint="As it appears on your ID." />
      </div>

    </div>
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
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

      <TextField {...args} label="Default" hint="Hint text provides additional context." />

      <TextField {...args} label="Required" hint="This field must be completed before submitting." required />

      <TextField {...args} label="Error" defaultValue="not-an-email" error="Enter a valid email address." />

      <TextField {...args} label="Read-only" value="jane.smith@example.com" readOnly hint="Contact your administrator to change this." onChange={() => {}} />

      <TextField {...args} label="Disabled" hint="This field is not available right now." disabled />

    </div>
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
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
          <TextField {...args} labelPosition="above" label="First name" />
          <TextField {...args} labelPosition="above" label="Last name" />
          <TextField {...args} labelPosition="above" label="Email" hint="We'll never share your email." required />
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
          <TextField {...args} labelPosition="side" label="First name" />
          <TextField {...args} labelPosition="side" label="Last name" />
          <TextField {...args} labelPosition="side" label="Email" hint="We'll never share your email." required />
        </div>
      </div>

    </div>
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  name: "Hint messages",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-20)",
    maxWidth: 480
  }}>
      <TextField label="Username" hint="3–20 characters. Letters, numbers and underscores only." />
      <TextField label="Password" type="password" hint="Minimum 8 characters with at least one number and symbol." />
      <TextField label="Date of birth" hint="You must be 18 or older to register." />
      <TextField label="Phone number" hint="Include your country code for international numbers." />
      <TextField label="Promo code" hint="Optional. Applied at checkout." />
    </div>
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  name: "Required badge",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-24)",
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
      }}>Comfortable — badge</p>
        <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--base-spacing-16)"
      }}>
          <TextField size="comfortable" label="Full name" hint="As it appears on your ID." required />
          <TextField size="comfortable" label="Email address" hint="We'll use this to contact you." required />
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
        marginBottom: "var(--base-spacing-12)"
      }}>Default — asterisk</p>
        <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--base-spacing-16)"
      }}>
          <TextField size="default" label="Full name" hint="As it appears on your ID." required />
          <TextField size="compact" label="Email address" required />
        </div>
      </div>

    </div>
}`,...L.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  name: "Phone number",
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
        <p style={LABEL_STYLE}>Default US format</p>
        <PhoneField label="Phone number" hint="Include your country code." />
      </div>

      <div>
        <p style={LABEL_STYLE}>States</p>
        <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--base-spacing-16)"
      }}>
          <PhoneField label="Default" hint="Include your country code." />
          <PhoneField label="Required" hint="We'll only use this for account alerts." required />
          <PhoneField label="Error" defaultValue="123" error="Enter a complete phone number." />
          <PhoneField label="Disabled" disabled />
        </div>
      </div>

      <div>
        <p style={LABEL_STYLE}>Country formats</p>
        <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--base-spacing-16)"
      }}>
          <PhoneField label="United States" hint="e.g. 1-800-555-1234" mask="#-###-###-####" />
          <PhoneField label="United Kingdom" hint="e.g. 07700 900123" mask="##### ######" />
          <PhoneField label="Australia" hint="e.g. 0412 345 678" mask="#### ### ###" />
          <PhoneField label="Brazil" hint="e.g. (11) 98765-4321" mask="(##) #####-####" />
          <PhoneField label="Germany" hint="e.g. 030 12345678" mask="### ########" />
        </div>
      </div>

    </div>
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  name: "ZIP code",
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
        <p style={LABEL_STYLE}>Formats</p>
        <div style={{
        display: "flex",
        gap: "var(--base-spacing-24)",
        flexWrap: "wrap"
      }}>
          <ZipField label="5-digit ZIP" mask={ZIP_MASKS.zip5} hint="e.g. 90210" />
          <ZipField label="ZIP+4" mask={ZIP_MASKS.zip9} hint="e.g. 90210-1234" />
        </div>
      </div>

      <div>
        <p style={LABEL_STYLE}>States</p>
        <div style={{
        display: "flex",
        gap: "var(--base-spacing-24)",
        flexWrap: "wrap"
      }}>
          <ZipField label="Default" />
          <ZipField label="Required" required />
          <ZipField label="Error" defaultValue="123" error="Enter a valid ZIP code." />
          <ZipField label="Disabled" disabled />
        </div>
      </div>

      <div>
        <p style={LABEL_STYLE}>In a form row</p>
        <div style={{
        display: "flex",
        gap: "var(--base-spacing-16)",
        flexWrap: "wrap",
        alignItems: "flex-start",
        maxWidth: 560
      }}>
          <div style={{
          flex: "1 1 200px"
        }}>
            <TextField label="City" required />
          </div>
          <ZipField label="ZIP code" required />
        </div>
      </div>

    </div>
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  name: "Credit card",
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
        <p style={LABEL_STYLE}>Card number</p>
        <CreditCardField label="Card number" hint="Start typing to detect your card type." />
      </div>

      <div>
        <p style={LABEL_STYLE}>Card types</p>
        <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--base-spacing-16)"
      }}>
          <CreditCardField label="Visa" defaultValue="4111111111111111" hint="Starts with 4" />
          <CreditCardField label="Mastercard" defaultValue="5500000000000004" hint="Starts with 51–55 or 2221–2720" />
          <CreditCardField label="Amex" defaultValue="371449635398431" hint="Starts with 34 or 37 — 15 digits" />
          <CreditCardField label="Discover" defaultValue="6011111111111117" hint="Starts with 6011, 622, 644–649 or 65" />
        </div>
      </div>

      <div>
        <p style={LABEL_STYLE}>States</p>
        <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--base-spacing-16)"
      }}>
          <CreditCardField label="Default" />
          <CreditCardField label="Required" required hint="Required to complete your purchase." />
          <CreditCardField label="Error" defaultValue="1234" error="Enter a valid card number." />
          <CreditCardField label="Disabled" disabled />
        </div>
      </div>

    </div>
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  name: "Number",
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
        <p style={LABEL_STYLE}>Basic</p>
        <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--base-spacing-16)"
      }}>
          <NumberField label="Quantity" hint="How many units?" min={1} max={99} defaultValue={1} />
          <NumberField label="Price" hint="USD" min={0} step={0.01} defaultValue={9.99} />
        </div>
      </div>

      <div>
        <p style={LABEL_STYLE}>States</p>
        <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--base-spacing-16)"
      }}>
          <NumberField label="Default" hint="Enter a number." min={0} />
          <NumberField label="Required" hint="This field must be completed." min={1} required />
          <NumberField label="Error" defaultValue={-5} min={0} error="Value must be 0 or greater." />
          <NumberField label="Disabled" defaultValue={42} disabled />
        </div>
      </div>

      <div>
        <p style={LABEL_STYLE}>Sizes</p>
        <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--base-spacing-16)"
      }}>
          <NumberField size="comfortable" label="Quantity" min={1} defaultValue={1} />
          <NumberField size="default" label="Quantity" min={1} defaultValue={1} />
          <NumberField size="compact" label="Quantity" min={1} defaultValue={1} />
        </div>
      </div>

    </div>
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  name: "Time",
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
        <p style={LABEL_STYLE}>Basic</p>
        <div style={{
        display: "flex",
        gap: "var(--base-spacing-16)",
        flexWrap: "wrap"
      }}>
          <TimeField label="Start time" hint="HH:MM" defaultValue="09:00" />
          <TimeField label="End time" hint="HH:MM" defaultValue="17:00" />
        </div>
      </div>

      <div>
        <p style={LABEL_STYLE}>With range constraint</p>
        <TimeField label="Appointment time" hint="Available 8 am – 6 pm." min="08:00" max="18:00" />
      </div>

      <div>
        <p style={LABEL_STYLE}>States</p>
        <div style={{
        display: "flex",
        gap: "var(--base-spacing-16)",
        flexWrap: "wrap",
        alignItems: "flex-start"
      }}>
          <TimeField label="Default" hint="Select a time." />
          <TimeField label="Required" required />
          <TimeField label="Error" error="Select a valid time." />
          <TimeField label="Disabled" defaultValue="09:00" disabled />
        </div>
      </div>

      <div>
        <p style={LABEL_STYLE}>Sizes</p>
        <div style={{
        display: "flex",
        gap: "var(--base-spacing-16)",
        flexWrap: "wrap",
        alignItems: "flex-start"
      }}>
          <TimeField size="comfortable" label="Start time" defaultValue="09:00" />
          <TimeField size="default" label="Start time" defaultValue="09:00" />
          <TimeField size="compact" label="Start time" defaultValue="09:00" />
        </div>
      </div>

    </div>
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
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
      hint: "Required field"
    }, {
      label: "Error",
      defaultValue: "bad-value",
      error: "Enter a valid value."
    }, {
      label: "Read-only",
      value: "jane@example.com",
      readOnly: true,
      onChange: () => {}
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
                  <TextField size={size} {...f} />
                </div>)}
            </div>
          </div>)}
      </div>;
  }
}`,...W.parameters?.docs?.source}}},G=[`Configurable`,`Sizes`,`States`,`LabelPosition`,`HintMessages`,`RequiredBadge`,`PhoneNumber`,`ZipCode`,`CreditCard`,`NumberInput`,`TimeInput`,`SizesAndStates`]}))();export{M as Configurable,V as CreditCard,I as HintMessages,F as LabelPosition,H as NumberInput,z as PhoneNumber,L as RequiredBadge,N as Sizes,W as SizesAndStates,P as States,U as TimeInput,B as ZipCode,G as __namedExportsOrder,j as default};