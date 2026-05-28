import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./iframe-Yj7JQljB.js";import{n,t as r}from"./Fieldset-CkDPn5Ws.js";import{n as i,t as a}from"./TextField-pPoIMvBu.js";import{n as o,t as s}from"./FieldRow-BqPdNiLi.js";import{n as c,t as l}from"./SelectField-D_AIl2tT.js";import{a as u,i as d,n as f,t as p}from"./PhoneField-D1PA7kdt.js";import{n as m,t as h}from"./DateField-B0GofVgZ.js";var g,_,v,y,b,x,S,C;e((()=>{o(),n(),i(),c(),u(),f(),m(),g=t(),_=[[`AL`,`Alabama`],[`AK`,`Alaska`],[`AZ`,`Arizona`],[`AR`,`Arkansas`],[`CA`,`California`],[`CO`,`Colorado`],[`CT`,`Connecticut`],[`DE`,`Delaware`],[`FL`,`Florida`],[`GA`,`Georgia`],[`HI`,`Hawaii`],[`ID`,`Idaho`],[`IL`,`Illinois`],[`IN`,`Indiana`],[`IA`,`Iowa`],[`KS`,`Kansas`],[`KY`,`Kentucky`],[`LA`,`Louisiana`],[`ME`,`Maine`],[`MD`,`Maryland`],[`MA`,`Massachusetts`],[`MI`,`Michigan`],[`MN`,`Minnesota`],[`MS`,`Mississippi`],[`MO`,`Missouri`],[`MT`,`Montana`],[`NE`,`Nebraska`],[`NV`,`Nevada`],[`NH`,`New Hampshire`],[`NJ`,`New Jersey`],[`NM`,`New Mexico`],[`NY`,`New York`],[`NC`,`North Carolina`],[`ND`,`North Dakota`],[`OH`,`Ohio`],[`OK`,`Oklahoma`],[`OR`,`Oregon`],[`PA`,`Pennsylvania`],[`RI`,`Rhode Island`],[`SC`,`South Carolina`],[`SD`,`South Dakota`],[`TN`,`Tennessee`],[`TX`,`Texas`],[`UT`,`Utah`],[`VT`,`Vermont`],[`VA`,`Virginia`],[`WA`,`Washington`],[`WV`,`West Virginia`],[`WI`,`Wisconsin`],[`WY`,`Wyoming`]],v={title:`Components/Forms/Field Row`,component:s,tags:[`autodocs`],parameters:{layout:`padded`}},y={fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,fontWeight:600,color:`var(--semantic-color-text-muted)`,textTransform:`uppercase`,letterSpacing:`0.06em`,marginBottom:`var(--base-spacing-12)`},b={name:`Label above`,parameters:{controls:{include:[]}},render:()=>(0,g.jsxs)(`div`,{style:{maxWidth:800,display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-24)`},children:[(0,g.jsxs)(`div`,{children:[(0,g.jsx)(`p`,{style:y,children:`Two fields`}),(0,g.jsx)(r,{children:(0,g.jsxs)(s,{children:[(0,g.jsx)(a,{label:`First name`,autoComplete:`given-name`,required:!0}),(0,g.jsx)(a,{label:`Last name`,autoComplete:`family-name`,required:!0})]})})]}),(0,g.jsxs)(`div`,{children:[(0,g.jsx)(`p`,{style:y,children:`Three fields`}),(0,g.jsx)(r,{children:(0,g.jsxs)(s,{children:[(0,g.jsx)(a,{label:`City`,autoComplete:`address-level2`,required:!0}),(0,g.jsxs)(l,{label:`State`,autoComplete:`address-level1`,children:[(0,g.jsx)(`option`,{value:``,children:`—`}),_.map(([e,t])=>(0,g.jsxs)(`option`,{value:e,children:[e,` — `,t]},e))]}),(0,g.jsx)(d,{label:`ZIP`,autoComplete:`postal-code`})]})})]}),(0,g.jsxs)(`div`,{children:[(0,g.jsx)(`p`,{style:y,children:`Fixed-width alongside flexible`}),(0,g.jsx)(r,{children:(0,g.jsxs)(s,{children:[(0,g.jsx)(a,{label:`Card number`,inputMode:`numeric`}),(0,g.jsx)(h,{label:`Expiry`}),(0,g.jsx)(a,{label:`CVV`,inputMode:`numeric`,style:{maxWidth:90}})]})})]})]})},x={name:`Label side — auto-stacks`,parameters:{controls:{include:[]}},render:()=>(0,g.jsx)(`div`,{style:{maxWidth:800,display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-40)`},children:(0,g.jsxs)(`div`,{children:[(0,g.jsx)(`p`,{style:y,children:`FieldRow inside a side-label fieldset stacks automatically`}),(0,g.jsxs)(r,{legend:`Billing address`,labelPosition:`side`,children:[(0,g.jsx)(a,{label:`Street address`,autoComplete:`street-address`}),(0,g.jsxs)(s,{children:[(0,g.jsx)(a,{label:`City`,autoComplete:`address-level2`,required:!0}),(0,g.jsxs)(l,{label:`State`,autoComplete:`address-level1`,children:[(0,g.jsx)(`option`,{value:``,children:`—`}),_.map(([e,t])=>(0,g.jsxs)(`option`,{value:e,children:[e,` — `,t]},e))]}),(0,g.jsx)(d,{label:`ZIP`,autoComplete:`postal-code`})]}),(0,g.jsx)(p,{label:`Phone`,autoComplete:`tel`})]})]})})},S={parameters:{controls:{include:[]}},render:()=>(0,g.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-48)`},children:[`comfortable`,`default`,`compact`].map(e=>(0,g.jsxs)(`div`,{children:[(0,g.jsx)(`p`,{style:y,children:e}),(0,g.jsxs)(r,{size:e,style:{maxWidth:800},children:[(0,g.jsxs)(s,{children:[(0,g.jsx)(a,{label:`First name`,autoComplete:`given-name`,required:!0}),(0,g.jsx)(a,{label:`Last name`,autoComplete:`family-name`,required:!0})]}),(0,g.jsxs)(s,{children:[(0,g.jsx)(a,{label:`City`,autoComplete:`address-level2`}),(0,g.jsxs)(l,{label:`State`,autoComplete:`address-level1`,children:[(0,g.jsx)(`option`,{value:``,children:`—`}),_.slice(0,8).map(([e,t])=>(0,g.jsxs)(`option`,{value:e,children:[e,` — `,t]},e))]}),(0,g.jsx)(d,{label:`ZIP`,autoComplete:`postal-code`})]})]})]},e))})},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: "Label above",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    maxWidth: 800,
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-24)"
  }}>

      <div>
        <p style={LABEL}>Two fields</p>
        <Fieldset>
          <FieldRow>
            <TextField label="First name" autoComplete="given-name" required />
            <TextField label="Last name" autoComplete="family-name" required />
          </FieldRow>
        </Fieldset>
      </div>

      <div>
        <p style={LABEL}>Three fields</p>
        <Fieldset>
          <FieldRow>
            <TextField label="City" autoComplete="address-level2" required />
            <SelectField label="State" autoComplete="address-level1">
              <option value="">—</option>
              {US_STATES.map(([abbr, name]) => <option key={abbr} value={abbr}>{abbr} — {name}</option>)}
            </SelectField>
            <ZipField label="ZIP" autoComplete="postal-code" />
          </FieldRow>
        </Fieldset>
      </div>

      <div>
        <p style={LABEL}>Fixed-width alongside flexible</p>
        <Fieldset>
          <FieldRow>
            <TextField label="Card number" inputMode="numeric" />
            <DateField label="Expiry" />
            <TextField label="CVV" inputMode="numeric" style={{
            maxWidth: 90
          }} />
          </FieldRow>
        </Fieldset>
      </div>

    </div>
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: "Label side — auto-stacks",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    maxWidth: 800,
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-40)"
  }}>

      <div>
        <p style={LABEL}>FieldRow inside a side-label fieldset stacks automatically</p>
        <Fieldset legend="Billing address" labelPosition="side">
          <TextField label="Street address" autoComplete="street-address" />
          <FieldRow>
            <TextField label="City" autoComplete="address-level2" required />
            <SelectField label="State" autoComplete="address-level1">
              <option value="">—</option>
              {US_STATES.map(([abbr, name]) => <option key={abbr} value={abbr}>{abbr} — {name}</option>)}
            </SelectField>
            <ZipField label="ZIP" autoComplete="postal-code" />
          </FieldRow>
          <PhoneField label="Phone" autoComplete="tel" />
        </Fieldset>
      </div>

    </div>
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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
          <p style={LABEL}>{size}</p>
          <Fieldset size={size} style={{
        maxWidth: 800
      }}>
            <FieldRow>
              <TextField label="First name" autoComplete="given-name" required />
              <TextField label="Last name" autoComplete="family-name" required />
            </FieldRow>
            <FieldRow>
              <TextField label="City" autoComplete="address-level2" />
              <SelectField label="State" autoComplete="address-level1">
                <option value="">—</option>
                {US_STATES.slice(0, 8).map(([abbr, name]) => <option key={abbr} value={abbr}>{abbr} — {name}</option>)}
              </SelectField>
              <ZipField label="ZIP" autoComplete="postal-code" />
            </FieldRow>
          </Fieldset>
        </div>)}
    </div>
}`,...S.parameters?.docs?.source}}},C=[`LabelAbove`,`LabelSide`,`Sizes`]}))();export{b as LabelAbove,x as LabelSide,S as Sizes,C as __namedExportsOrder,v as default};