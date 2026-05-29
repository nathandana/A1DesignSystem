import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./iframe-CkqopHIr.js";var n=e((()=>{}));function r({variant:e=`border`,cite:t,citeUrl:n,className:r=``,children:o,...s}){return(0,i.jsxs)(`figure`,{className:[`a1-blockquote`,`a1-blockquote--${a.includes(e)?e:`border`}`,r].filter(Boolean).join(` `),...s,children:[(0,i.jsx)(`blockquote`,{className:`a1-blockquote__quote`,children:o}),t&&(0,i.jsx)(`figcaption`,{className:`a1-blockquote__cite`,children:n?(0,i.jsx)(`a`,{href:n,className:`a1-blockquote__cite-link`,children:t}):t})]})}var i,a,o=e((()=>{n(),i=t(),a=[`border`,`filled`,`feature`,`minimal`],r.__docgenInfo={description:``,methods:[],displayName:`Blockquote`,props:{variant:{defaultValue:{value:`"border"`,computed:!1},required:!1},className:{defaultValue:{value:`""`,computed:!1},required:!1}}}})),s,c,l,u,d,f,p,m,h;e((()=>{o(),s=t(),c=`Design is not just what it looks like and feels like. Design is how it works.`,l=`I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.`,u={title:`Components/Messaging/Blockquote`,component:r,tags:[`autodocs`],parameters:{layout:`padded`},args:{variant:`border`,cite:`Steve Jobs`,children:c},argTypes:{variant:{control:`inline-radio`,options:[`border`,`filled`,`feature`,`minimal`],description:`Visual style of the blockquote`},cite:{control:`text`,description:`Attribution name or source`},citeUrl:{control:`text`,description:`Optional URL — wraps cite in a link`},children:{control:`text`,name:`quote`}}},d={},f={name:`All variants`,parameters:{controls:{include:[]}},render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-48, 3rem)`,maxWidth:640},children:[(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`p`,{style:{fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,fontWeight:600,textTransform:`uppercase`,letterSpacing:`0.06em`,color:`var(--semantic-color-text-muted)`,marginBottom:`var(--base-spacing-16)`},children:`border (default)`}),(0,s.jsx)(r,{variant:`border`,cite:`Steve Jobs`,children:c})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`p`,{style:{fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,fontWeight:600,textTransform:`uppercase`,letterSpacing:`0.06em`,color:`var(--semantic-color-text-muted)`,marginBottom:`var(--base-spacing-16)`},children:`filled`}),(0,s.jsx)(r,{variant:`filled`,cite:`Maya Angelou`,children:l})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`p`,{style:{fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,fontWeight:600,textTransform:`uppercase`,letterSpacing:`0.06em`,color:`var(--semantic-color-text-muted)`,marginBottom:`var(--base-spacing-16)`},children:`feature`}),(0,s.jsx)(r,{variant:`feature`,cite:`Dieter Rams`,children:`Good design is as little design as possible.`})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`p`,{style:{fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,fontWeight:600,textTransform:`uppercase`,letterSpacing:`0.06em`,color:`var(--semantic-color-text-muted)`,marginBottom:`var(--base-spacing-16)`},children:`minimal`}),(0,s.jsx)(r,{variant:`minimal`,cite:`Charles Eames`,children:`The details are not the details. They make the design.`})]})]})},p={name:`Without citation`,parameters:{controls:{include:[]}},render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-40)`,maxWidth:560},children:[(0,s.jsx)(r,{variant:`border`,children:c}),(0,s.jsx)(r,{variant:`filled`,children:c}),(0,s.jsx)(r,{variant:`feature`,children:c}),(0,s.jsx)(r,{variant:`minimal`,children:c})]})},m={name:`With linked citation`,parameters:{controls:{include:[]}},render:()=>(0,s.jsx)(`div`,{style:{maxWidth:560},children:(0,s.jsx)(r,{variant:`border`,cite:`A1 Design System docs`,citeUrl:`#`,children:`Consistent, accessible components let teams ship better products faster.`})})},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: "All variants",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-48, 3rem)",
    maxWidth: 640
  }}>
      <div>
        <p style={{
        fontFamily: "var(--component-paragraph-font-family)",
        fontSize: "var(--semantic-font-size-body-xs)",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: "var(--semantic-color-text-muted)",
        marginBottom: "var(--base-spacing-16)"
      }}>border (default)</p>
        <Blockquote variant="border" cite="Steve Jobs">
          {QUOTE_SHORT}
        </Blockquote>
      </div>

      <div>
        <p style={{
        fontFamily: "var(--component-paragraph-font-family)",
        fontSize: "var(--semantic-font-size-body-xs)",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: "var(--semantic-color-text-muted)",
        marginBottom: "var(--base-spacing-16)"
      }}>filled</p>
        <Blockquote variant="filled" cite="Maya Angelou">
          {QUOTE_LONG}
        </Blockquote>
      </div>

      <div>
        <p style={{
        fontFamily: "var(--component-paragraph-font-family)",
        fontSize: "var(--semantic-font-size-body-xs)",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: "var(--semantic-color-text-muted)",
        marginBottom: "var(--base-spacing-16)"
      }}>feature</p>
        <Blockquote variant="feature" cite="Dieter Rams">
          Good design is as little design as possible.
        </Blockquote>
      </div>

      <div>
        <p style={{
        fontFamily: "var(--component-paragraph-font-family)",
        fontSize: "var(--semantic-font-size-body-xs)",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: "var(--semantic-color-text-muted)",
        marginBottom: "var(--base-spacing-16)"
      }}>minimal</p>
        <Blockquote variant="minimal" cite="Charles Eames">
          The details are not the details. They make the design.
        </Blockquote>
      </div>
    </div>
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: "Without citation",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-40)",
    maxWidth: 560
  }}>
      <Blockquote variant="border">{QUOTE_SHORT}</Blockquote>
      <Blockquote variant="filled">{QUOTE_SHORT}</Blockquote>
      <Blockquote variant="feature">{QUOTE_SHORT}</Blockquote>
      <Blockquote variant="minimal">{QUOTE_SHORT}</Blockquote>
    </div>
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: "With linked citation",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    maxWidth: 560
  }}>
      <Blockquote variant="border" cite="A1 Design System docs" citeUrl="#">
        Consistent, accessible components let teams ship better products faster.
      </Blockquote>
    </div>
}`,...m.parameters?.docs?.source}}},h=[`Configurable`,`AllVariants`,`WithoutCite`,`WithCiteLink`]}))();export{f as AllVariants,d as Configurable,m as WithCiteLink,p as WithoutCite,h as __namedExportsOrder,u as default};