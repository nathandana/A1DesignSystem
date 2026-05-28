import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{C as n,t as r}from"./iframe-BwSdWSBC.js";import{r as i,t as a}from"./Message-C54hr4wI.js";import{n as o,r as s,t as c}from"./field-C6Sh5Gdd.js";import{n as l,t as u}from"./FieldsetContext-C1VxNv-h.js";var d=e((()=>{}));function f(e){return typeof e==`number`?e:_[e]??4}var p,m,h,g,_,v,y=e((()=>{p=t(n(),1),o(),i(),l(),c(),d(),m=r(),h=[`comfortable`,`default`,`compact`],g=[`above`,`side`],_={sm:2,md:4,lg:8,xl:12},v=(0,p.forwardRef)(function({label:e,hint:t,error:n,size:r,labelPosition:i,required:o=!1,disabled:c=!1,readOnly:l=!1,id:d,className:_=``,rows:v=`md`,maxLength:y,showCount:b=!1,value:x,defaultValue:S,onChange:C,...w},T){let E=(0,p.useContext)(u),D=(0,p.useId)(),O=d??D,k=`${O}-hint`,A=`${O}-error`,j=h.includes(r)?r:E?.size??`default`,M=g.includes(i)?i:E?.labelPosition??`above`,N=f(v),[P,F]=(0,p.useState)(()=>x==null?S==null?0:String(S).length:String(x).length),I=x==null?P:String(x).length,L=b||y!=null;function R(e){x??F(e.target.value.length),C?.(e)}let z=y==null?`normal`:I>y?`over`:I/y>=.8?`warning`:`normal`,B=[`a1-field`,`a1-field--${j}`,`a1-field--label-${M}`,n&&`a1-field--error`,o&&`a1-field--required`,c&&`a1-field--disabled`,l&&`a1-field--readonly`,_].filter(Boolean).join(` `),V=[n?A:t?k:null].filter(Boolean).join(` `)||void 0,H=s(`field.required`,`Required`),U=L?(0,m.jsx)(`span`,{className:[`a1-field__char-count`,z===`warning`&&`a1-field__char-count--warning`,z===`over`&&`a1-field__char-count--over`].filter(Boolean).join(` `),"aria-live":`polite`,"aria-atomic":`true`,"aria-label":y==null?`${I} characters`:`${I} of ${y} characters`,children:y==null?I:`${I} / ${y}`}):null,W=n||t||L;return(0,m.jsxs)(`div`,{className:B,children:[e&&(0,m.jsxs)(`label`,{className:`a1-field__label`,htmlFor:O,children:[e,o&&j===`comfortable`?(0,m.jsx)(a,{status:`info`,subtle:!0,children:H}):o?(0,m.jsx)(`span`,{className:`a1-field__asterisk`,"aria-hidden":`true`,children:` *`}):null]}),(0,m.jsx)(`div`,{className:`a1-field__control`,children:(0,m.jsx)(`textarea`,{ref:T,id:O,className:`a1-field__textarea`,rows:N,maxLength:y,required:o,disabled:c,readOnly:l,"aria-describedby":V,"aria-invalid":n?`true`:void 0,value:x,defaultValue:S,onChange:R,...w})}),W&&(0,m.jsxs)(`div`,{className:`a1-field__footer`,children:[(0,m.jsx)(`div`,{className:`a1-field__footer-message`,children:n?(0,m.jsx)(`p`,{className:`a1-field__message a1-field__message--error`,id:A,role:`alert`,children:n}):t?(0,m.jsx)(`p`,{className:`a1-field__message a1-field__message--hint`,id:k,children:t}):null}),U]})]})}),v.__docgenInfo={description:``,methods:[],displayName:`TextareaField`,props:{required:{defaultValue:{value:`false`,computed:!1},required:!1},disabled:{defaultValue:{value:`false`,computed:!1},required:!1},readOnly:{defaultValue:{value:`false`,computed:!1},required:!1},className:{defaultValue:{value:`""`,computed:!1},required:!1},rows:{defaultValue:{value:`"md"`,computed:!1},required:!1},showCount:{defaultValue:{value:`false`,computed:!1},required:!1}}}})),b,x,S,C,w,T,E,D,O,k;e((()=>{y(),b=r(),x={title:`Components/Forms/Textarea`,component:v,tags:[`autodocs`],parameters:{layout:`padded`},args:{label:`Message`,size:`default`,labelPosition:`above`,rows:`md`,required:!1,disabled:!1,readOnly:!1,showCount:!1},argTypes:{size:{control:`inline-radio`,options:[`comfortable`,`default`,`compact`]},labelPosition:{control:`inline-radio`,options:[`above`,`side`]},rows:{control:`inline-radio`,options:[`sm`,`md`,`lg`,`xl`]},maxLength:{control:`number`},showCount:{control:`boolean`},error:{control:`text`},hint:{control:`text`},label:{control:`text`}}},S={fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,fontWeight:600,color:`var(--semantic-color-text-muted)`,textTransform:`uppercase`,letterSpacing:`0.06em`,marginBottom:`var(--base-spacing-12)`},C={render:e=>(0,b.jsx)(`div`,{style:{maxWidth:560},children:(0,b.jsx)(v,{...e})})},w={name:`Row sizes`,parameters:{controls:{include:[]}},render:()=>(0,b.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-24)`,maxWidth:560},children:[(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`p`,{style:S,children:`sm — 2 rows`}),(0,b.jsx)(v,{label:`Summary`,rows:`sm`,hint:`A brief one-line description.`})]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`p`,{style:S,children:`md — 4 rows (default)`}),(0,b.jsx)(v,{label:`Description`,rows:`md`})]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`p`,{style:S,children:`lg — 8 rows`}),(0,b.jsx)(v,{label:`Notes`,rows:`lg`,hint:`Add any additional notes here.`})]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`p`,{style:S,children:`xl — 12 rows`}),(0,b.jsx)(v,{label:`Cover letter`,rows:`xl`})]})]})},T={name:`Character count`,parameters:{controls:{include:[]}},render:()=>(0,b.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-24)`,maxWidth:560},children:[(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`p`,{style:S,children:`Count only — no limit`}),(0,b.jsx)(v,{label:`Bio`,rows:`sm`,showCount:!0,hint:`Tell us a little about yourself.`})]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`p`,{style:S,children:`With limit`}),(0,b.jsx)(v,{label:`Message`,rows:`md`,maxLength:200,hint:`Keep it brief.`})]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`p`,{style:S,children:`Approaching limit (≥ 80%)`}),(0,b.jsx)(v,{label:`Message`,rows:`sm`,maxLength:50,defaultValue:`This message is getting close to the limit`})]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`p`,{style:S,children:`At limit`}),(0,b.jsx)(v,{label:`Message`,rows:`sm`,maxLength:40,defaultValue:`This message has hit the character limit!!`})]})]})},E={parameters:{controls:{include:[`size`]}},render:e=>(0,b.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-20)`,maxWidth:560},children:[(0,b.jsx)(v,{...e,label:`Default`,rows:`sm`,hint:`Hint text provides additional context.`}),(0,b.jsx)(v,{...e,label:`Required`,rows:`sm`,required:!0,hint:`This field must be completed.`}),(0,b.jsx)(v,{...e,label:`Error`,rows:`sm`,defaultValue:`Bad input`,error:`Your message must be at least 20 characters.`}),(0,b.jsx)(v,{...e,label:`Read-only`,rows:`sm`,value:`This content cannot be edited.`,readOnly:!0,onChange:()=>{}}),(0,b.jsx)(v,{...e,label:`Disabled`,rows:`sm`,disabled:!0,hint:`Not available right now.`})]})},D={parameters:{controls:{include:[]}},render:()=>{let e=[{label:`Default`,hint:`Hint text provides additional context.`},{label:`Required`,required:!0,hint:`This field must be completed.`},{label:`Error`,defaultValue:`Some input`,error:`Your message must be at least 20 characters.`},{label:`Disabled`,disabled:!0}];return(0,b.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-48)`,maxWidth:560},children:[`comfortable`,`default`,`compact`].map(t=>(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`p`,{style:S,children:t}),(0,b.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-16)`},children:e.map(e=>(0,b.jsx)(v,{size:t,rows:`sm`,...e},e.label))})]},t))})}},O={name:`Label position`,parameters:{controls:{include:[`size`]}},render:e=>(0,b.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-32)`,maxWidth:640},children:[(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`p`,{style:S,children:`Above`}),(0,b.jsx)(v,{...e,labelPosition:`above`,label:`Message`,rows:`sm`,hint:`We'll respond within 2 business days.`})]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`p`,{style:S,children:`Side`}),(0,b.jsx)(v,{...e,labelPosition:`side`,label:`Message`,rows:`sm`,hint:`We'll respond within 2 business days.`})]})]})},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    maxWidth: 560
  }}>
      <TextareaField {...args} />
    </div>
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  name: "Row sizes",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-24)",
    maxWidth: 560
  }}>
      <div>
        <p style={LABEL}>sm — 2 rows</p>
        <TextareaField label="Summary" rows="sm" hint="A brief one-line description." />
      </div>
      <div>
        <p style={LABEL}>md — 4 rows (default)</p>
        <TextareaField label="Description" rows="md" />
      </div>
      <div>
        <p style={LABEL}>lg — 8 rows</p>
        <TextareaField label="Notes" rows="lg" hint="Add any additional notes here." />
      </div>
      <div>
        <p style={LABEL}>xl — 12 rows</p>
        <TextareaField label="Cover letter" rows="xl" />
      </div>
    </div>
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  name: "Character count",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-24)",
    maxWidth: 560
  }}>
      <div>
        <p style={LABEL}>Count only — no limit</p>
        <TextareaField label="Bio" rows="sm" showCount hint="Tell us a little about yourself." />
      </div>
      <div>
        <p style={LABEL}>With limit</p>
        <TextareaField label="Message" rows="md" maxLength={200} hint="Keep it brief." />
      </div>
      <div>
        <p style={LABEL}>Approaching limit (≥ 80%)</p>
        <TextareaField label="Message" rows="sm" maxLength={50} defaultValue="This message is getting close to the limit" />
      </div>
      <div>
        <p style={LABEL}>At limit</p>
        <TextareaField label="Message" rows="sm" maxLength={40} defaultValue="This message has hit the character limit!!" />
      </div>
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
    gap: "var(--base-spacing-20)",
    maxWidth: 560
  }}>
      <TextareaField {...args} label="Default" rows="sm" hint="Hint text provides additional context." />
      <TextareaField {...args} label="Required" rows="sm" required hint="This field must be completed." />
      <TextareaField {...args} label="Error" rows="sm" defaultValue="Bad input" error="Your message must be at least 20 characters." />
      <TextareaField {...args} label="Read-only" rows="sm" value="This content cannot be edited." readOnly onChange={() => {}} />
      <TextareaField {...args} label="Disabled" rows="sm" disabled hint="Not available right now." />
    </div>
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => {
    const fields = [{
      label: "Default",
      hint: "Hint text provides additional context."
    }, {
      label: "Required",
      required: true,
      hint: "This field must be completed."
    }, {
      label: "Error",
      defaultValue: "Some input",
      error: "Your message must be at least 20 characters."
    }, {
      label: "Disabled",
      disabled: true
    }];
    return <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--base-spacing-48)",
      maxWidth: 560
    }}>
        {["comfortable", "default", "compact"].map(sz => <div key={sz}>
            <p style={LABEL}>{sz}</p>
            <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--base-spacing-16)"
        }}>
              {fields.map(f => <TextareaField key={f.label} size={sz} rows="sm" {...f} />)}
            </div>
          </div>)}
      </div>;
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
    maxWidth: 640
  }}>
      <div>
        <p style={LABEL}>Above</p>
        <TextareaField {...args} labelPosition="above" label="Message" rows="sm" hint="We'll respond within 2 business days." />
      </div>
      <div>
        <p style={LABEL}>Side</p>
        <TextareaField {...args} labelPosition="side" label="Message" rows="sm" hint="We'll respond within 2 business days." />
      </div>
    </div>
}`,...O.parameters?.docs?.source}}},k=[`Configurable`,`RowSizes`,`CharacterCount`,`States`,`Sizes`,`LabelPosition`]}))();export{T as CharacterCount,C as Configurable,O as LabelPosition,w as RowSizes,D as Sizes,E as States,k as __namedExportsOrder,x as default};