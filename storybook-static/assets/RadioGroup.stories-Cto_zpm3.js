import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{C as n,t as r}from"./iframe-BwSdWSBC.js";import{n as i,t as a}from"./Button-C1gAzzoD.js";import{n as o,t as s}from"./ButtonContainer-CkyQeblS.js";import{r as c,t as l}from"./Message-C54hr4wI.js";import{n as u,r as d}from"./field-C6Sh5Gdd.js";import{n as f,t as p}from"./FieldsetContext-C1VxNv-h.js";import{n as m,t as h}from"./Fieldset-BfhR8Nbv.js";import{n as g,t as _}from"./TextField-Dvl2R4k6.js";var v=e((()=>{}));function y({label:e,hint:t,error:n,size:r,required:i=!1,disabled:a=!1,inline:o=!1,name:s,options:c=[],value:u,defaultValue:f=null,onChange:m,id:h,className:g=``,..._}){let v=(0,b.useContext)(p),y=(0,b.useId)(),C=h??y,w=`${C}-hint`,T=`${C}-error`,E=S.includes(r)?r:v?.size??`default`,[D,O]=(0,b.useState)(f),k=u===void 0?D:u;function A(e){u===void 0&&O(e),m?.(e)}let j=[`a1-radio-group`,`a1-radio-group--${E}`,o&&`a1-radio-group--inline`,n&&`a1-radio-group--error`,i&&`a1-radio-group--required`,a&&`a1-radio-group--disabled`,g].filter(Boolean).join(` `),M=[n?T:t?w:null].filter(Boolean).join(` `)||void 0,N=d(`field.required`,`Required`),P=s??C;return(0,x.jsxs)(`fieldset`,{className:j,"aria-describedby":M,..._,children:[e&&(0,x.jsx)(`legend`,{className:`a1-radio-group__legend`,children:(0,x.jsxs)(`span`,{className:`a1-radio-group__legend-inner`,children:[e,i&&E===`comfortable`?(0,x.jsx)(l,{status:`info`,subtle:!0,children:N}):i?(0,x.jsx)(`span`,{className:`a1-field__asterisk`,"aria-hidden":`true`,children:` *`}):null]})}),t&&!n&&(0,x.jsx)(`p`,{className:`a1-radio-group__message a1-radio-group__message--hint`,id:w,children:t}),(0,x.jsx)(`div`,{className:`a1-radio-group__items`,children:c.map(e=>{let t=k===e.value,n=a||e.disabled,r=`${C}-${e.value}`;return(0,x.jsxs)(`label`,{className:[`a1-radio-item`,n&&`a1-radio-item--disabled`].filter(Boolean).join(` `),children:[(0,x.jsx)(`input`,{type:`radio`,id:r,className:`a1-radio-item__input`,name:P,value:e.value,checked:t,disabled:n,onChange:()=>A(e.value)}),(0,x.jsxs)(`span`,{className:`a1-radio-item__content`,children:[(0,x.jsx)(`span`,{className:`a1-radio-item__label`,children:e.label}),e.hint&&(0,x.jsx)(`span`,{className:`a1-radio-item__hint`,children:e.hint})]})]},e.value)})}),n&&(0,x.jsx)(`p`,{className:`a1-radio-group__message a1-radio-group__message--error`,id:T,role:`alert`,children:n})]})}var b,x,S,C=e((()=>{b=t(n(),1),u(),c(),f(),v(),x=r(),S=[`comfortable`,`default`,`compact`],y.__docgenInfo={description:``,methods:[],displayName:`RadioGroup`,props:{required:{defaultValue:{value:`false`,computed:!1},required:!1},disabled:{defaultValue:{value:`false`,computed:!1},required:!1},inline:{defaultValue:{value:`false`,computed:!1},required:!1},options:{defaultValue:{value:`[]`,computed:!1},required:!1},defaultValue:{defaultValue:{value:`null`,computed:!1},required:!1},className:{defaultValue:{value:`""`,computed:!1},required:!1}}}}));function w(){let[e,t]=(0,T.useState)(null),[n,r]=(0,T.useState)(!1),[i,o]=(0,T.useState)(null);function c(t){if(t.preventDefault(),!e){o(`Select a plan to continue.`);return}o(null),r(!0)}return n?(0,E.jsxs)(`p`,{style:{fontFamily:`var(--component-paragraph-font-family)`,color:`var(--semantic-color-text-default)`},children:[`Signed up for: `,e,`.`,` `,(0,E.jsx)(`button`,{style:{background:`none`,border:`none`,padding:0,color:`inherit`,textDecoration:`underline`,cursor:`pointer`,fontFamily:`inherit`,fontSize:`inherit`},onClick:()=>{r(!1),t(null)},children:`Change`})]}):(0,E.jsx)(`form`,{style:{maxWidth:560},onSubmit:c,onReset:()=>{t(null),o(null)},children:(0,E.jsxs)(h,{legend:`Sign up`,markRequired:!0,children:[(0,E.jsx)(_,{label:`Full name`,autoComplete:`name`,required:!0}),(0,E.jsx)(y,{label:`Subscription plan`,hint:`You can change your plan at any time.`,error:i,required:!0,value:e,onChange:e=>{t(e),e&&o(null)},options:k}),(0,E.jsxs)(s,{align:`start`,children:[(0,E.jsx)(a,{type:`submit`,variant:`primary`,children:`Continue`}),(0,E.jsx)(a,{type:`reset`,variant:`secondary`,children:`Reset`})]})]})})}var T,E,D,O,k,A,j,M,N,P,F,I,L;e((()=>{T=t(n(),1),C(),m(),g(),o(),i(),E=r(),D={title:`Components/Forms/Radio Group`,component:y,tags:[`autodocs`],parameters:{layout:`padded`},args:{label:`Options`,size:`default`,required:!1,disabled:!1,inline:!1},argTypes:{size:{control:`inline-radio`,options:[`comfortable`,`default`,`compact`]},required:{control:`boolean`},disabled:{control:`boolean`},inline:{control:`boolean`},hint:{control:`text`},error:{control:`text`},label:{control:`text`}}},O={fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,fontWeight:600,color:`var(--semantic-color-text-muted)`,textTransform:`uppercase`,letterSpacing:`0.06em`,marginBottom:`var(--base-spacing-12)`},k=[{value:`starter`,label:`Starter`,hint:`Up to 3 users · 5 GB storage`},{value:`professional`,label:`Professional`,hint:`Up to 25 users · 50 GB storage`},{value:`enterprise`,label:`Enterprise`,hint:`Unlimited users · 1 TB storage`},{value:`legacy`,label:`Legacy plan`,disabled:!0}],A=[{value:`a`,label:`Option A`},{value:`b`,label:`Option B`},{value:`c`,label:`Option C`}],j={args:{options:A,defaultValue:`a`},render:e=>(0,E.jsx)(`div`,{style:{maxWidth:400},children:(0,E.jsx)(y,{...e})})},M={name:`Options`,parameters:{controls:{include:[`size`]}},render:e=>(0,E.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-32)`,maxWidth:400},children:[(0,E.jsxs)(`div`,{children:[(0,E.jsx)(`p`,{style:O,children:`With hints`}),(0,E.jsx)(y,{...e,label:`Subscription plan`,hint:`Choose the plan that fits your team.`,defaultValue:`professional`,options:k})]}),(0,E.jsxs)(`div`,{children:[(0,E.jsx)(`p`,{style:O,children:`No hints`}),(0,E.jsx)(y,{...e,label:`Delivery method`,defaultValue:`standard`,options:[{value:`standard`,label:`Standard shipping`},{value:`express`,label:`Express shipping`},{value:`overnight`,label:`Overnight shipping`},{value:`pickup`,label:`In-store pickup`}]})]})]})},N={parameters:{controls:{include:[`size`]}},render:e=>(0,E.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-32)`,maxWidth:400},children:[(0,E.jsxs)(`div`,{children:[(0,E.jsx)(`p`,{style:O,children:`Default`}),(0,E.jsx)(y,{...e,label:`Subscription plan`,hint:`Choose the plan that fits your team.`,defaultValue:`professional`,options:k})]}),(0,E.jsxs)(`div`,{children:[(0,E.jsx)(`p`,{style:O,children:`Required`}),(0,E.jsx)(y,{...e,label:`Subscription plan`,hint:`You must select a plan to continue.`,required:!0,options:k})]}),(0,E.jsxs)(`div`,{children:[(0,E.jsx)(`p`,{style:O,children:`Error`}),(0,E.jsx)(y,{...e,label:`Subscription plan`,error:`Select a plan to continue.`,options:k})]}),(0,E.jsxs)(`div`,{children:[(0,E.jsx)(`p`,{style:O,children:`Disabled`}),(0,E.jsx)(y,{...e,label:`Subscription plan`,hint:`Plan changes are locked during your trial.`,disabled:!0,defaultValue:`professional`,options:k})]})]})},P={parameters:{controls:{include:[]}},render:()=>(0,E.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-40)`,maxWidth:400},children:[`comfortable`,`default`,`compact`].map(e=>(0,E.jsxs)(`div`,{children:[(0,E.jsx)(`p`,{style:O,children:e}),(0,E.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-20)`},children:[(0,E.jsx)(y,{size:e,label:`Subscription plan`,hint:`Choose the plan that fits your team.`,defaultValue:`professional`,options:k}),(0,E.jsx)(y,{size:e,label:`Subscription plan`,required:!0,options:A}),(0,E.jsx)(y,{size:e,label:`Subscription plan`,error:`Select a plan to continue.`,options:A})]})]},e))})},F={parameters:{controls:{include:[`size`]}},render:e=>(0,E.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-32)`,maxWidth:560},children:[(0,E.jsxs)(`div`,{children:[(0,E.jsx)(`p`,{style:O,children:`Default`}),(0,E.jsx)(y,{...e,inline:!0,label:`Delivery method`,defaultValue:`standard`,options:[{value:`standard`,label:`Standard`},{value:`express`,label:`Express`},{value:`overnight`,label:`Overnight`}]})]}),(0,E.jsxs)(`div`,{children:[(0,E.jsx)(`p`,{style:O,children:`With hints`}),(0,E.jsx)(y,{...e,inline:!0,label:`Subscription plan`,defaultValue:`professional`,options:k})]}),(0,E.jsxs)(`div`,{children:[(0,E.jsx)(`p`,{style:O,children:`Required`}),(0,E.jsx)(y,{...e,inline:!0,required:!0,label:`Subscription plan`,options:A})]}),(0,E.jsxs)(`div`,{children:[(0,E.jsx)(`p`,{style:O,children:`Error`}),(0,E.jsx)(y,{...e,inline:!0,label:`Subscription plan`,error:`Select a plan to continue.`,options:A})]}),(0,E.jsxs)(`div`,{children:[(0,E.jsx)(`p`,{style:O,children:`Disabled`}),(0,E.jsx)(y,{...e,inline:!0,disabled:!0,label:`Subscription plan`,defaultValue:`professional`,options:k})]})]})},I={name:`In a form`,parameters:{controls:{include:[]}},render:()=>(0,E.jsx)(w,{})},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    options: SIMPLE_OPTIONS,
    defaultValue: "a"
  },
  render: args => <div style={{
    maxWidth: 400
  }}>
      <RadioGroup {...args} />
    </div>
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  name: "Options",
  parameters: {
    controls: {
      include: ["size"]
    }
  },
  render: args => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-32)",
    maxWidth: 400
  }}>

      <div>
        <p style={LABEL}>With hints</p>
        <RadioGroup {...args} label="Subscription plan" hint="Choose the plan that fits your team." defaultValue="professional" options={PLAN_OPTIONS} />
      </div>

      <div>
        <p style={LABEL}>No hints</p>
        <RadioGroup {...args} label="Delivery method" defaultValue="standard" options={[{
        value: "standard",
        label: "Standard shipping"
      }, {
        value: "express",
        label: "Express shipping"
      }, {
        value: "overnight",
        label: "Overnight shipping"
      }, {
        value: "pickup",
        label: "In-store pickup"
      }]} />
      </div>

    </div>
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      include: ["size"]
    }
  },
  render: args => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-32)",
    maxWidth: 400
  }}>

      <div>
        <p style={LABEL}>Default</p>
        <RadioGroup {...args} label="Subscription plan" hint="Choose the plan that fits your team." defaultValue="professional" options={PLAN_OPTIONS} />
      </div>

      <div>
        <p style={LABEL}>Required</p>
        <RadioGroup {...args} label="Subscription plan" hint="You must select a plan to continue." required options={PLAN_OPTIONS} />
      </div>

      <div>
        <p style={LABEL}>Error</p>
        <RadioGroup {...args} label="Subscription plan" error="Select a plan to continue." options={PLAN_OPTIONS} />
      </div>

      <div>
        <p style={LABEL}>Disabled</p>
        <RadioGroup {...args} label="Subscription plan" hint="Plan changes are locked during your trial." disabled defaultValue="professional" options={PLAN_OPTIONS} />
      </div>

    </div>
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-40)",
    maxWidth: 400
  }}>
      {["comfortable", "default", "compact"].map(sz => <div key={sz}>
          <p style={LABEL}>{sz}</p>
          <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--base-spacing-20)"
      }}>
            <RadioGroup size={sz} label="Subscription plan" hint="Choose the plan that fits your team." defaultValue="professional" options={PLAN_OPTIONS} />
            <RadioGroup size={sz} label="Subscription plan" required options={SIMPLE_OPTIONS} />
            <RadioGroup size={sz} label="Subscription plan" error="Select a plan to continue." options={SIMPLE_OPTIONS} />
          </div>
        </div>)}
    </div>
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
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
        <p style={LABEL}>Default</p>
        <RadioGroup {...args} inline label="Delivery method" defaultValue="standard" options={[{
        value: "standard",
        label: "Standard"
      }, {
        value: "express",
        label: "Express"
      }, {
        value: "overnight",
        label: "Overnight"
      }]} />
      </div>

      <div>
        <p style={LABEL}>With hints</p>
        <RadioGroup {...args} inline label="Subscription plan" defaultValue="professional" options={PLAN_OPTIONS} />
      </div>

      <div>
        <p style={LABEL}>Required</p>
        <RadioGroup {...args} inline required label="Subscription plan" options={SIMPLE_OPTIONS} />
      </div>

      <div>
        <p style={LABEL}>Error</p>
        <RadioGroup {...args} inline label="Subscription plan" error="Select a plan to continue." options={SIMPLE_OPTIONS} />
      </div>

      <div>
        <p style={LABEL}>Disabled</p>
        <RadioGroup {...args} inline disabled label="Subscription plan" defaultValue="professional" options={PLAN_OPTIONS} />
      </div>

    </div>
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  name: "In a form",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <PlanForm />
}`,...I.parameters?.docs?.source}}},L=[`Configurable`,`Options`,`States`,`Sizes`,`Inline`,`InAForm`]}))();export{j as Configurable,I as InAForm,F as Inline,M as Options,P as Sizes,N as States,L as __namedExportsOrder,D as default};