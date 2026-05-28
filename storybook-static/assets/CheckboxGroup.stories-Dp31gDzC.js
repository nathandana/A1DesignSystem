import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{C as n,t as r}from"./iframe-Yj7JQljB.js";import{n as i,t as a}from"./Button-CfiQA4bX.js";import{n as o,t as s}from"./ButtonContainer-Cop-Cm49.js";import{r as c,t as l}from"./Message-BeJfVuC3.js";import{n as u,r as d}from"./field-C4naDCeB.js";import{n as f,t as p}from"./FieldsetContext-CTIa8Kan.js";import{n as m,t as h}from"./Fieldset-CkDPn5Ws.js";import{n as g,t as _}from"./TextField-pPoIMvBu.js";var v=e((()=>{}));function y({label:e,hint:t,error:n,size:r,required:i=!1,disabled:a=!1,inline:o=!1,name:s,options:c=[],value:u,defaultValue:f,onChange:m,id:h,className:g=``,..._}){let v=(0,b.useContext)(p),y=(0,b.useId)(),C=h??y,w=`${C}-hint`,T=`${C}-error`,E=S.includes(r)?r:v?.size??`default`,[D,O]=(0,b.useState)(f??[]),k=u??D;function A(e,t){let n=t?[...k,e]:k.filter(t=>t!==e);u??O(n),m?.(n)}let j=[`a1-checkbox-group`,`a1-checkbox-group--${E}`,o&&`a1-checkbox-group--inline`,n&&`a1-checkbox-group--error`,i&&`a1-checkbox-group--required`,a&&`a1-checkbox-group--disabled`,g].filter(Boolean).join(` `),M=[n?T:t?w:null].filter(Boolean).join(` `)||void 0,N=d(`field.required`,`Required`);return(0,x.jsxs)(`fieldset`,{className:j,"aria-describedby":M,..._,children:[e&&(0,x.jsx)(`legend`,{className:`a1-checkbox-group__legend`,children:(0,x.jsxs)(`span`,{className:`a1-checkbox-group__legend-inner`,children:[e,i&&E===`comfortable`?(0,x.jsx)(l,{status:`info`,subtle:!0,children:N}):i?(0,x.jsx)(`span`,{className:`a1-field__asterisk`,"aria-hidden":`true`,children:` *`}):null]})}),t&&!n&&(0,x.jsx)(`p`,{className:`a1-checkbox-group__message a1-checkbox-group__message--hint`,id:w,children:t}),(0,x.jsx)(`div`,{className:`a1-checkbox-group__items`,children:c.map(e=>{let t=k.includes(e.value),n=a||e.disabled,r=`${C}-${e.value}`;return(0,x.jsxs)(`label`,{className:[`a1-checkbox-item`,n&&`a1-checkbox-item--disabled`].filter(Boolean).join(` `),children:[(0,x.jsx)(`input`,{type:`checkbox`,id:r,className:`a1-checkbox-item__input`,name:s,value:e.value,checked:t,disabled:n,onChange:t=>A(e.value,t.target.checked)}),(0,x.jsxs)(`span`,{className:`a1-checkbox-item__content`,children:[(0,x.jsx)(`span`,{className:`a1-checkbox-item__label`,children:e.label}),e.hint&&(0,x.jsx)(`span`,{className:`a1-checkbox-item__hint`,children:e.hint})]})]},e.value)})}),n&&(0,x.jsx)(`p`,{className:`a1-checkbox-group__message a1-checkbox-group__message--error`,id:T,role:`alert`,children:n})]})}var b,x,S,C=e((()=>{b=t(n(),1),u(),c(),f(),v(),x=r(),S=[`comfortable`,`default`,`compact`],y.__docgenInfo={description:``,methods:[],displayName:`CheckboxGroup`,props:{required:{defaultValue:{value:`false`,computed:!1},required:!1},disabled:{defaultValue:{value:`false`,computed:!1},required:!1},inline:{defaultValue:{value:`false`,computed:!1},required:!1},options:{defaultValue:{value:`[]`,computed:!1},required:!1},className:{defaultValue:{value:`""`,computed:!1},required:!1}}}}));function w(){let[e,t]=(0,T.useState)([`email`]),[n,r]=(0,T.useState)(!1),[i,o]=(0,T.useState)(null);function c(t){if(t.preventDefault(),e.length===0){o(`Select at least one notification method.`);return}o(null),r(!0)}return n?(0,E.jsxs)(`p`,{style:{fontFamily:`var(--component-paragraph-font-family)`,color:`var(--semantic-color-text-default)`},children:[`Saved! Notifications via: `,e.join(`, `),`.`,` `,(0,E.jsx)(`button`,{style:{background:`none`,border:`none`,padding:0,color:`inherit`,textDecoration:`underline`,cursor:`pointer`,fontFamily:`inherit`,fontSize:`inherit`},onClick:()=>r(!1),children:`Edit`})]}):(0,E.jsx)(`form`,{style:{maxWidth:560},onSubmit:c,onReset:()=>{t([`email`]),o(null)},children:(0,E.jsxs)(h,{legend:`Notification preferences`,markRequired:!0,children:[(0,E.jsx)(_,{label:`Email address`,type:`email`,autoComplete:`email`,required:!0}),(0,E.jsx)(y,{label:`Notification channels`,hint:`We'll only contact you through your chosen channels.`,error:i,required:!0,value:e,onChange:e=>{t(e),e.length>0&&o(null)},options:k}),(0,E.jsxs)(s,{align:`start`,children:[(0,E.jsx)(a,{type:`submit`,variant:`primary`,children:`Save preferences`}),(0,E.jsx)(a,{type:`reset`,variant:`secondary`,children:`Reset`})]})]})})}var T,E,D,O,k,A,j,M,N,P,F,I,L;e((()=>{T=t(n(),1),C(),m(),g(),o(),i(),E=r(),D={title:`Components/Forms/Checkbox Group`,component:y,tags:[`autodocs`],parameters:{layout:`padded`},args:{label:`Preferences`,size:`default`,required:!1,disabled:!1,inline:!1},argTypes:{size:{control:`inline-radio`,options:[`comfortable`,`default`,`compact`]},required:{control:`boolean`},disabled:{control:`boolean`},inline:{control:`boolean`},hint:{control:`text`},error:{control:`text`},label:{control:`text`}}},O={fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,fontWeight:600,color:`var(--semantic-color-text-muted)`,textTransform:`uppercase`,letterSpacing:`0.06em`,marginBottom:`var(--base-spacing-12)`},k=[{value:`email`,label:`Email`,hint:`Daily digest at 9 am`},{value:`sms`,label:`SMS`,hint:`Standard rates may apply`},{value:`push`,label:`Push notifications`},{value:`post`,label:`Post mail`,disabled:!0}],A=[{value:`a`,label:`Option A`},{value:`b`,label:`Option B`},{value:`c`,label:`Option C`}],j={args:{options:A,defaultValue:[`a`]},render:e=>(0,E.jsx)(`div`,{style:{maxWidth:400},children:(0,E.jsx)(y,{...e})})},M={name:`Options`,parameters:{controls:{include:[`size`]}},render:e=>(0,E.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-32)`,maxWidth:400},children:[(0,E.jsxs)(`div`,{children:[(0,E.jsx)(`p`,{style:O,children:`With hints`}),(0,E.jsx)(y,{...e,label:`Notification channels`,hint:`Select how you'd like to be contacted.`,defaultValue:[`email`],options:k})]}),(0,E.jsxs)(`div`,{children:[(0,E.jsx)(`p`,{style:O,children:`No hints`}),(0,E.jsx)(y,{...e,label:`Dietary requirements`,defaultValue:[],options:[{value:`veg`,label:`Vegetarian`},{value:`vegan`,label:`Vegan`},{value:`gf`,label:`Gluten-free`},{value:`halal`,label:`Halal`},{value:`kosher`,label:`Kosher`}]})]})]})},N={parameters:{controls:{include:[`size`]}},render:e=>(0,E.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-32)`,maxWidth:400},children:[(0,E.jsxs)(`div`,{children:[(0,E.jsx)(`p`,{style:O,children:`Default`}),(0,E.jsx)(y,{...e,label:`Notification channels`,hint:`Select all that apply.`,defaultValue:[`email`],options:k})]}),(0,E.jsxs)(`div`,{children:[(0,E.jsx)(`p`,{style:O,children:`Required`}),(0,E.jsx)(y,{...e,label:`Notification channels`,hint:`You must select at least one.`,required:!0,defaultValue:[],options:k})]}),(0,E.jsxs)(`div`,{children:[(0,E.jsx)(`p`,{style:O,children:`Error`}),(0,E.jsx)(y,{...e,label:`Notification channels`,error:`Select at least one notification method.`,defaultValue:[],options:k})]}),(0,E.jsxs)(`div`,{children:[(0,E.jsx)(`p`,{style:O,children:`Disabled`}),(0,E.jsx)(y,{...e,label:`Notification channels`,hint:`Not available in your current plan.`,disabled:!0,defaultValue:[`email`],options:k})]})]})},P={parameters:{controls:{include:[]}},render:()=>(0,E.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-40)`,maxWidth:400},children:[`comfortable`,`default`,`compact`].map(e=>(0,E.jsxs)(`div`,{children:[(0,E.jsx)(`p`,{style:O,children:e}),(0,E.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-20)`},children:[(0,E.jsx)(y,{size:e,label:`Notification channels`,hint:`Select all that apply.`,defaultValue:[`email`],options:k}),(0,E.jsx)(y,{size:e,label:`Notification channels`,required:!0,defaultValue:[],options:A}),(0,E.jsx)(y,{size:e,label:`Notification channels`,error:`Select at least one option.`,defaultValue:[],options:A})]})]},e))})},F={parameters:{controls:{include:[`size`]}},render:e=>(0,E.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-32)`,maxWidth:560},children:[(0,E.jsxs)(`div`,{children:[(0,E.jsx)(`p`,{style:O,children:`Default`}),(0,E.jsx)(y,{...e,inline:!0,label:`Dietary requirements`,hint:`Select all that apply.`,defaultValue:[`veg`],options:[{value:`veg`,label:`Vegetarian`},{value:`vegan`,label:`Vegan`},{value:`gf`,label:`Gluten-free`},{value:`halal`,label:`Halal`},{value:`kosher`,label:`Kosher`}]})]}),(0,E.jsxs)(`div`,{children:[(0,E.jsx)(`p`,{style:O,children:`Required`}),(0,E.jsx)(y,{...e,inline:!0,required:!0,label:`Notification channels`,defaultValue:[],options:k})]}),(0,E.jsxs)(`div`,{children:[(0,E.jsx)(`p`,{style:O,children:`Error`}),(0,E.jsx)(y,{...e,inline:!0,label:`Notification channels`,error:`Select at least one notification method.`,defaultValue:[],options:k})]}),(0,E.jsxs)(`div`,{children:[(0,E.jsx)(`p`,{style:O,children:`Disabled`}),(0,E.jsx)(y,{...e,inline:!0,disabled:!0,label:`Notification channels`,defaultValue:[`email`],options:k})]})]})},I={name:`In a form`,parameters:{controls:{include:[]}},render:()=>(0,E.jsx)(w,{})},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    options: SIMPLE_OPTIONS,
    defaultValue: ["a"]
  },
  render: args => <div style={{
    maxWidth: 400
  }}>
      <CheckboxGroup {...args} />
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
        <CheckboxGroup {...args} label="Notification channels" hint="Select how you'd like to be contacted." defaultValue={["email"]} options={CONTACT_OPTIONS} />
      </div>

      <div>
        <p style={LABEL}>No hints</p>
        <CheckboxGroup {...args} label="Dietary requirements" defaultValue={[]} options={[{
        value: "veg",
        label: "Vegetarian"
      }, {
        value: "vegan",
        label: "Vegan"
      }, {
        value: "gf",
        label: "Gluten-free"
      }, {
        value: "halal",
        label: "Halal"
      }, {
        value: "kosher",
        label: "Kosher"
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
        <CheckboxGroup {...args} label="Notification channels" hint="Select all that apply." defaultValue={["email"]} options={CONTACT_OPTIONS} />
      </div>

      <div>
        <p style={LABEL}>Required</p>
        <CheckboxGroup {...args} label="Notification channels" hint="You must select at least one." required defaultValue={[]} options={CONTACT_OPTIONS} />
      </div>

      <div>
        <p style={LABEL}>Error</p>
        <CheckboxGroup {...args} label="Notification channels" error="Select at least one notification method." defaultValue={[]} options={CONTACT_OPTIONS} />
      </div>

      <div>
        <p style={LABEL}>Disabled</p>
        <CheckboxGroup {...args} label="Notification channels" hint="Not available in your current plan." disabled defaultValue={["email"]} options={CONTACT_OPTIONS} />
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
            <CheckboxGroup size={sz} label="Notification channels" hint="Select all that apply." defaultValue={["email"]} options={CONTACT_OPTIONS} />
            <CheckboxGroup size={sz} label="Notification channels" required defaultValue={[]} options={SIMPLE_OPTIONS} />
            <CheckboxGroup size={sz} label="Notification channels" error="Select at least one option." defaultValue={[]} options={SIMPLE_OPTIONS} />
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
        <CheckboxGroup {...args} inline label="Dietary requirements" hint="Select all that apply." defaultValue={["veg"]} options={[{
        value: "veg",
        label: "Vegetarian"
      }, {
        value: "vegan",
        label: "Vegan"
      }, {
        value: "gf",
        label: "Gluten-free"
      }, {
        value: "halal",
        label: "Halal"
      }, {
        value: "kosher",
        label: "Kosher"
      }]} />
      </div>

      <div>
        <p style={LABEL}>Required</p>
        <CheckboxGroup {...args} inline required label="Notification channels" defaultValue={[]} options={CONTACT_OPTIONS} />
      </div>

      <div>
        <p style={LABEL}>Error</p>
        <CheckboxGroup {...args} inline label="Notification channels" error="Select at least one notification method." defaultValue={[]} options={CONTACT_OPTIONS} />
      </div>

      <div>
        <p style={LABEL}>Disabled</p>
        <CheckboxGroup {...args} inline disabled label="Notification channels" defaultValue={["email"]} options={CONTACT_OPTIONS} />
      </div>

    </div>
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  name: "In a form",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <ContactForm />
}`,...I.parameters?.docs?.source}}},L=[`Configurable`,`Options`,`States`,`Sizes`,`Inline`,`InAForm`]}))();export{j as Configurable,I as InAForm,F as Inline,M as Options,P as Sizes,N as States,L as __namedExportsOrder,D as default};