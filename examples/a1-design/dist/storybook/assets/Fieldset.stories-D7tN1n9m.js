import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{C as n,t as r}from"./iframe-Yj7JQljB.js";import{n as i,t as a}from"./Button-CfiQA4bX.js";import{n as o,t as s}from"./ButtonContainer-Cop-Cm49.js";import{n as c,t as l}from"./Divider-BNRV8sjv.js";import{n as u,t as d}from"./Banner-CWc1vcbG.js";import{n as f,t as p}from"./Fieldset-CkDPn5Ws.js";import{n as m,t as h}from"./TextField-pPoIMvBu.js";import{n as g,t as _}from"./FieldRow-BqPdNiLi.js";import{n as v,t as y}from"./SelectField-D_AIl2tT.js";import{a as b,i as x,n as S,t as C}from"./PhoneField-D1PA7kdt.js";function w(){let e={"err-name":{empty:`Full name is required.`},"err-email":{empty:`Email address is required.`,invalid:`Enter a valid email address.`},"err-city":{empty:`City is required.`}},[t,n]=(0,T.useState)({"err-name":e[`err-name`].empty,"err-email":e[`err-email`].empty,"err-city":e[`err-city`].empty});function r(t){let n={},r=t.elements[`err-name`]?.value?.trim(),i=t.elements[`err-email`]?.value?.trim(),a=t.elements[`err-city`]?.value?.trim();return r||(n[`err-name`]=e[`err-name`].empty),i?i.includes(`@`)||(n[`err-email`]=e[`err-email`].invalid):n[`err-email`]=e[`err-email`].empty,a||(n[`err-city`]=e[`err-city`].empty),n}function i(e){e.preventDefault();let t=r(e.target);n(t),Object.keys(t).length===0&&alert(`Form submitted successfully.`)}let o=Object.entries(t);return(0,E.jsxs)(`form`,{style:{maxWidth:800,display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-16)`},onSubmit:i,onReset:()=>n({}),children:[o.length>0&&(0,E.jsx)(d,{status:`error`,title:`Please fix the following errors before submitting.`,children:(0,E.jsx)(`span`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-4)`},children:o.map(([e,t])=>(0,E.jsx)(`a`,{href:`#${e}`,style:{color:`inherit`,textDecoration:`underline`},onClick:t=>{t.preventDefault(),document.getElementById(e)?.focus()},children:t},e))})}),(0,E.jsxs)(p,{legend:`Contact information`,markRequired:!0,children:[(0,E.jsx)(h,{id:`err-name`,name:`err-name`,label:`Full name`,autoComplete:`name`,required:!0,error:t[`err-name`]}),(0,E.jsx)(h,{id:`err-email`,name:`err-email`,label:`Email address`,type:`email`,autoComplete:`email`,required:!0,error:t[`err-email`]}),(0,E.jsxs)(_,{children:[(0,E.jsx)(h,{id:`err-city`,name:`err-city`,label:`City`,autoComplete:`address-level2`,required:!0,error:t[`err-city`]}),(0,E.jsx)(x,{label:`ZIP`,autoComplete:`postal-code`})]}),(0,E.jsxs)(s,{align:`start`,children:[(0,E.jsx)(a,{type:`submit`,variant:`primary`,children:`Submit`}),(0,E.jsx)(a,{type:`reset`,variant:`secondary`,children:`Reset`})]})]})]})}var T,E,D,O,k,A,j,M,N,P;e((()=>{T=t(n(),1),f(),g(),m(),v(),b(),S(),c(),o(),i(),u(),E=r(),D=[[`AL`,`Alabama`],[`AK`,`Alaska`],[`AZ`,`Arizona`],[`AR`,`Arkansas`],[`CA`,`California`],[`CO`,`Colorado`],[`CT`,`Connecticut`],[`DE`,`Delaware`],[`FL`,`Florida`],[`GA`,`Georgia`],[`HI`,`Hawaii`],[`ID`,`Idaho`],[`IL`,`Illinois`],[`IN`,`Indiana`],[`IA`,`Iowa`],[`KS`,`Kansas`],[`KY`,`Kentucky`],[`LA`,`Louisiana`],[`ME`,`Maine`],[`MD`,`Maryland`],[`MA`,`Massachusetts`],[`MI`,`Michigan`],[`MN`,`Minnesota`],[`MS`,`Mississippi`],[`MO`,`Missouri`],[`MT`,`Montana`],[`NE`,`Nebraska`],[`NV`,`Nevada`],[`NH`,`New Hampshire`],[`NJ`,`New Jersey`],[`NM`,`New Mexico`],[`NY`,`New York`],[`NC`,`North Carolina`],[`ND`,`North Dakota`],[`OH`,`Ohio`],[`OK`,`Oklahoma`],[`OR`,`Oregon`],[`PA`,`Pennsylvania`],[`RI`,`Rhode Island`],[`SC`,`South Carolina`],[`SD`,`South Dakota`],[`TN`,`Tennessee`],[`TX`,`Texas`],[`UT`,`Utah`],[`VT`,`Vermont`],[`VA`,`Virginia`],[`WA`,`Washington`],[`WV`,`West Virginia`],[`WI`,`Wisconsin`],[`WY`,`Wyoming`]],O={title:`Components/Forms/Fieldset`,component:p,tags:[`autodocs`],parameters:{layout:`padded`},args:{legend:`Contact information`,markRequired:!1},argTypes:{size:{control:`inline-radio`,options:[`comfortable`,`default`,`compact`]},labelPosition:{control:`inline-radio`,options:[`above`,`side`]},markRequired:{control:`boolean`},surface:{control:`boolean`},legend:{control:`text`}}},k={name:`Contact form`,parameters:{controls:{include:[`size`,`labelPosition`,`markRequired`]}},render:e=>(0,E.jsx)(`form`,{style:{maxWidth:800},onSubmit:e=>e.preventDefault(),children:(0,E.jsxs)(p,{legend:`Contact information`,markRequired:e.markRequired,size:e.size,labelPosition:e.labelPosition,children:[(0,E.jsx)(h,{label:`Full name`,autoComplete:`name`,required:!0}),(0,E.jsx)(h,{label:`Street address`,autoComplete:`street-address`}),(0,E.jsxs)(_,{children:[(0,E.jsx)(h,{label:`City`,autoComplete:`address-level2`,required:!0}),(0,E.jsxs)(y,{label:`State`,autoComplete:`address-level1`,children:[(0,E.jsx)(`option`,{value:``,children:`—`}),D.map(([e,t])=>(0,E.jsxs)(`option`,{value:e,children:[e,` — `,t]},e))]}),(0,E.jsx)(x,{label:`ZIP`,autoComplete:`postal-code`})]}),(0,E.jsx)(l,{space:`none`}),(0,E.jsx)(h,{label:`Email address`,type:`email`,autoComplete:`email`,required:!0}),(0,E.jsx)(l,{space:`none`}),(0,E.jsx)(C,{label:`Phone number`,hint:`Optional — for account notifications only.`}),(0,E.jsxs)(s,{align:`start`,children:[(0,E.jsx)(a,{type:`submit`,variant:`primary`,children:`Submit`}),(0,E.jsx)(a,{type:`reset`,variant:`secondary`,children:`Reset`})]})]})})},A={name:`With errors`,parameters:{controls:{include:[]}},render:()=>(0,E.jsx)(w,{})},j={name:`Size cascade`,parameters:{controls:{include:[]}},render:()=>(0,E.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-48)`},children:[`comfortable`,`default`,`compact`].map(e=>(0,E.jsxs)(`div`,{children:[(0,E.jsx)(`p`,{style:{fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,fontWeight:600,color:`var(--semantic-color-text-muted)`,textTransform:`uppercase`,letterSpacing:`0.06em`,marginBottom:`var(--base-spacing-16)`},children:e}),(0,E.jsxs)(p,{legend:`Account details`,size:e,markRequired:!0,style:{maxWidth:800},children:[(0,E.jsxs)(_,{children:[(0,E.jsx)(h,{label:`First name`,required:!0}),(0,E.jsx)(h,{label:`Last name`,required:!0})]}),(0,E.jsx)(h,{label:`Email address`,type:`email`,required:!0}),(0,E.jsx)(C,{label:`Phone number`})]})]},e))})},M={name:`No legend`,parameters:{controls:{include:[]}},render:()=>(0,E.jsx)(`div`,{style:{maxWidth:800},children:(0,E.jsxs)(p,{children:[(0,E.jsx)(h,{label:`Username`,autoComplete:`username`,required:!0}),(0,E.jsx)(h,{label:`Password`,type:`password`,autoComplete:`new-password`,required:!0}),(0,E.jsx)(h,{label:`Confirm password`,type:`password`,autoComplete:`new-password`,required:!0})]})})},N={name:`Surface`,parameters:{controls:{include:[`size`,`labelPosition`]}},render:e=>(0,E.jsxs)(`div`,{style:{maxWidth:800,display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-24)`},children:[(0,E.jsxs)(p,{legend:`Account details`,surface:!0,markRequired:!0,size:e.size,labelPosition:e.labelPosition,children:[(0,E.jsxs)(_,{children:[(0,E.jsx)(h,{label:`First name`,autoComplete:`given-name`,required:!0}),(0,E.jsx)(h,{label:`Last name`,autoComplete:`family-name`,required:!0})]}),(0,E.jsx)(h,{label:`Email address`,type:`email`,autoComplete:`email`,required:!0})]}),(0,E.jsxs)(p,{legend:`Billing address`,surface:!0,size:e.size,labelPosition:e.labelPosition,children:[(0,E.jsx)(h,{label:`Street address`,autoComplete:`street-address`}),(0,E.jsxs)(_,{children:[(0,E.jsx)(h,{label:`City`,autoComplete:`address-level2`,required:!0}),(0,E.jsxs)(y,{label:`State`,autoComplete:`address-level1`,children:[(0,E.jsx)(`option`,{value:``,children:`—`}),D.map(([e,t])=>(0,E.jsxs)(`option`,{value:e,children:[e,` — `,t]},e))]}),(0,E.jsx)(x,{label:`ZIP`,autoComplete:`postal-code`})]})]}),(0,E.jsxs)(p,{legend:`Payment`,surface:!0,size:e.size,labelPosition:e.labelPosition,children:[(0,E.jsx)(h,{label:`Name on card`,autoComplete:`cc-name`,required:!0}),(0,E.jsxs)(_,{children:[(0,E.jsx)(h,{label:`Card number`,autoComplete:`cc-number`,required:!0}),(0,E.jsx)(h,{label:`Expiry`,autoComplete:`cc-exp`,style:{maxWidth:120},required:!0}),(0,E.jsx)(h,{label:`CVV`,autoComplete:`cc-csc`,style:{maxWidth:90},required:!0})]})]})]})},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  name: "Contact form",
  parameters: {
    controls: {
      include: ["size", "labelPosition", "markRequired"]
    }
  },
  render: args => <form style={{
    maxWidth: 800
  }} onSubmit={e => e.preventDefault()}>
      <Fieldset legend="Contact information" markRequired={args.markRequired} size={args.size} labelPosition={args.labelPosition}>
        <TextField label="Full name" autoComplete="name" required />

        <TextField label="Street address" autoComplete="street-address" />

        <FieldRow>
          <TextField label="City" autoComplete="address-level2" required />
          <SelectField label="State" autoComplete="address-level1">
            <option value="">—</option>
            {US_STATES.map(([abbr, name]) => <option key={abbr} value={abbr}>{abbr} — {name}</option>)}
          </SelectField>
          <ZipField label="ZIP" autoComplete="postal-code" />
        </FieldRow>

        <Divider space="none" />

        <TextField label="Email address" type="email" autoComplete="email" required />

        <Divider space="none" />

        <PhoneField label="Phone number" hint="Optional — for account notifications only." />

        <ButtonContainer align="start">
          <Button type="submit" variant="primary">Submit</Button>
          <Button type="reset" variant="secondary">Reset</Button>
        </ButtonContainer>
      </Fieldset>
    </form>
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  name: "With errors",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <ErrorForm />
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  name: "Size cascade",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-48)"
  }}>
      {["comfortable", "default", "compact"].map(size => <div key={size}>
          <p style={{
        fontFamily: "var(--component-paragraph-font-family)",
        fontSize: "var(--semantic-font-size-body-xs)",
        fontWeight: 600,
        color: "var(--semantic-color-text-muted)",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        marginBottom: "var(--base-spacing-16)"
      }}>
            {size}
          </p>
          <Fieldset legend="Account details" size={size} markRequired style={{
        maxWidth: 800
      }}>
            <FieldRow>
              <TextField label="First name" required />
              <TextField label="Last name" required />
            </FieldRow>
            <TextField label="Email address" type="email" required />
            <PhoneField label="Phone number" />
          </Fieldset>
        </div>)}
    </div>
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  name: "No legend",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    maxWidth: 800
  }}>
      <Fieldset>
        <TextField label="Username" autoComplete="username" required />
        <TextField label="Password" type="password" autoComplete="new-password" required />
        <TextField label="Confirm password" type="password" autoComplete="new-password" required />
      </Fieldset>
    </div>
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  name: "Surface",
  parameters: {
    controls: {
      include: ["size", "labelPosition"]
    }
  },
  render: args => <div style={{
    maxWidth: 800,
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-24)"
  }}>

      <Fieldset legend="Account details" surface markRequired size={args.size} labelPosition={args.labelPosition}>
        <FieldRow>
          <TextField label="First name" autoComplete="given-name" required />
          <TextField label="Last name" autoComplete="family-name" required />
        </FieldRow>
        <TextField label="Email address" type="email" autoComplete="email" required />
      </Fieldset>

      <Fieldset legend="Billing address" surface size={args.size} labelPosition={args.labelPosition}>
        <TextField label="Street address" autoComplete="street-address" />
        <FieldRow>
          <TextField label="City" autoComplete="address-level2" required />
          <SelectField label="State" autoComplete="address-level1">
            <option value="">—</option>
            {US_STATES.map(([abbr, name]) => <option key={abbr} value={abbr}>{abbr} — {name}</option>)}
          </SelectField>
          <ZipField label="ZIP" autoComplete="postal-code" />
        </FieldRow>
      </Fieldset>

      <Fieldset legend="Payment" surface size={args.size} labelPosition={args.labelPosition}>
        <TextField label="Name on card" autoComplete="cc-name" required />
        <FieldRow>
          <TextField label="Card number" autoComplete="cc-number" required />
          <TextField label="Expiry" autoComplete="cc-exp" style={{
          maxWidth: 120
        }} required />
          <TextField label="CVV" autoComplete="cc-csc" style={{
          maxWidth: 90
        }} required />
        </FieldRow>
      </Fieldset>

    </div>
}`,...N.parameters?.docs?.source}}},P=[`ContactForm`,`WithErrors`,`SizeCascade`,`NoLegend`,`Surface`]}))();export{k as ContactForm,M as NoLegend,j as SizeCascade,N as Surface,A as WithErrors,P as __namedExportsOrder,O as default};