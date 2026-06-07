import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./iframe-D8uQ9hre.js";import{n,t as r}from"./TextareaField-CRuDiant.js";var i,a,o,s,c,l,u,d,f,p;e((()=>{n(),i=t(),a={title:`Components/Forms/Textarea`,component:r,tags:[`autodocs`],parameters:{layout:`padded`},args:{label:`Message`,size:`default`,labelPosition:`above`,rows:`md`,required:!1,disabled:!1,readOnly:!1,showCount:!1},argTypes:{size:{control:`inline-radio`,options:[`comfortable`,`default`,`compact`]},labelPosition:{control:`inline-radio`,options:[`above`,`side`]},rows:{control:`inline-radio`,options:[`sm`,`md`,`lg`,`xl`]},maxLength:{control:`number`},showCount:{control:`boolean`},error:{control:`text`},hint:{control:`text`},label:{control:`text`}}},o={fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,fontWeight:600,color:`var(--semantic-color-text-muted)`,textTransform:`uppercase`,letterSpacing:`0.06em`,marginBottom:`var(--base-spacing-12)`},s={render:e=>(0,i.jsx)(`div`,{style:{maxWidth:560},children:(0,i.jsx)(r,{...e})})},c={name:`Row sizes`,parameters:{controls:{include:[]}},render:()=>(0,i.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-24)`,maxWidth:560},children:[(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`p`,{style:o,children:`sm — 2 rows`}),(0,i.jsx)(r,{label:`Summary`,rows:`sm`,hint:`A brief one-line description.`})]}),(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`p`,{style:o,children:`md — 4 rows (default)`}),(0,i.jsx)(r,{label:`Description`,rows:`md`})]}),(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`p`,{style:o,children:`lg — 8 rows`}),(0,i.jsx)(r,{label:`Notes`,rows:`lg`,hint:`Add any additional notes here.`})]}),(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`p`,{style:o,children:`xl — 12 rows`}),(0,i.jsx)(r,{label:`Cover letter`,rows:`xl`})]})]})},l={name:`Character count`,parameters:{controls:{include:[]}},render:()=>(0,i.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-24)`,maxWidth:560},children:[(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`p`,{style:o,children:`Count only — no limit`}),(0,i.jsx)(r,{label:`Bio`,rows:`sm`,showCount:!0,hint:`Tell us a little about yourself.`})]}),(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`p`,{style:o,children:`With limit`}),(0,i.jsx)(r,{label:`Message`,rows:`md`,maxLength:200,hint:`Keep it brief.`})]}),(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`p`,{style:o,children:`Approaching limit (≥ 80%)`}),(0,i.jsx)(r,{label:`Message`,rows:`sm`,maxLength:50,defaultValue:`This message is getting close to the limit`})]}),(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`p`,{style:o,children:`At limit`}),(0,i.jsx)(r,{label:`Message`,rows:`sm`,maxLength:40,defaultValue:`This message has hit the character limit!!`})]})]})},u={parameters:{controls:{include:[`size`]}},render:e=>(0,i.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-20)`,maxWidth:560},children:[(0,i.jsx)(r,{...e,label:`Default`,rows:`sm`,hint:`Hint text provides additional context.`}),(0,i.jsx)(r,{...e,label:`Required`,rows:`sm`,required:!0,hint:`This field must be completed.`}),(0,i.jsx)(r,{...e,label:`Error`,rows:`sm`,defaultValue:`Bad input`,error:`Your message must be at least 20 characters.`}),(0,i.jsx)(r,{...e,label:`Read-only`,rows:`sm`,value:`This content cannot be edited.`,readOnly:!0,onChange:()=>{}}),(0,i.jsx)(r,{...e,label:`Disabled`,rows:`sm`,disabled:!0,hint:`Not available right now.`})]})},d={parameters:{controls:{include:[]}},render:()=>{let e=[{label:`Default`,hint:`Hint text provides additional context.`},{label:`Required`,required:!0,hint:`This field must be completed.`},{label:`Error`,defaultValue:`Some input`,error:`Your message must be at least 20 characters.`},{label:`Disabled`,disabled:!0}];return(0,i.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-48)`,maxWidth:560},children:[`comfortable`,`default`,`compact`].map(t=>(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`p`,{style:o,children:t}),(0,i.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-16)`},children:e.map(e=>(0,i.jsx)(r,{size:t,rows:`sm`,...e},e.label))})]},t))})}},f={name:`Label position`,parameters:{controls:{include:[`size`]}},render:e=>(0,i.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-32)`,maxWidth:640},children:[(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`p`,{style:o,children:`Above`}),(0,i.jsx)(r,{...e,labelPosition:`above`,label:`Message`,rows:`sm`,hint:`We'll respond within 2 business days.`})]}),(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`p`,{style:o,children:`Side`}),(0,i.jsx)(r,{...e,labelPosition:`side`,label:`Message`,rows:`sm`,hint:`We'll respond within 2 business days.`})]})]})},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    maxWidth: 560
  }}>
      <TextareaField {...args} />
    </div>
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
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
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
}`,...f.parameters?.docs?.source}}},p=[`Configurable`,`RowSizes`,`CharacterCount`,`States`,`Sizes`,`LabelPosition`]}))();export{l as CharacterCount,s as Configurable,f as LabelPosition,c as RowSizes,d as Sizes,u as States,p as __namedExportsOrder,a as default};