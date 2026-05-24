import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./iframe-CN7ekW17.js";import{n,t as r}from"./Heading-uUxCaLV9.js";import{n as i,t as a}from"./Inverse-D6mlwkEn.js";var o,s,c,l,u,d,f,p,m;e((()=>{n(),i(),o=t(),s={title:`Foundations/Typography/Heading`,component:r,tags:[`autodocs`],args:{children:`The quick brown fox`,type:`heading`,color:`default`},argTypes:{as:{control:`select`,options:[`h1`,`h2`,`h3`,`h4`,`h5`,`h6`]},type:{control:`inline-radio`,options:[`heading`,`display`]},size:{control:`select`,options:[`xl`,`lg`,`md`,`sm`,`xs`,`xxl`,`jumbo`,`xJumbo`]},color:{control:`inline-radio`,options:[`default`,`muted`,`accent`]}}},c={},l={name:`Heading Scale`,render:()=>(0,o.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`16px`},children:[{as:`h1`,size:`xl`},{as:`h2`,size:`lg`},{as:`h3`,size:`md`},{as:`h4`,size:`sm`},{as:`h5`,size:`xs`},{as:`h6`,size:`xs`}].map(({as:e,size:t})=>(0,o.jsxs)(`div`,{style:{display:`flex`,alignItems:`baseline`,gap:`16px`},children:[(0,o.jsx)(`span`,{style:{width:`28px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`,flexShrink:0},children:e}),(0,o.jsx)(r,{as:e,size:t,children:`The quick brown fox`})]},e))})},u={name:`Decoupled Semantic vs Visual Size`,render:()=>(0,o.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`16px`},children:[(0,o.jsx)(r,{as:`h1`,size:`xs`,children:`h1 rendered at xs size`}),(0,o.jsx)(r,{as:`h6`,size:`xl`,children:`h6 rendered at xl size`}),(0,o.jsx)(r,{as:`h3`,size:`lg`,children:`h3 rendered at lg size`})]})},d={name:`Display Scale`,render:()=>(0,o.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`16px`},children:[`sm`,`md`,`lg`,`xl`,`xxl`,`jumbo`,`xJumbo`].map(e=>(0,o.jsxs)(`div`,{style:{display:`flex`,alignItems:`baseline`,gap:`16px`},children:[(0,o.jsx)(`span`,{style:{width:`52px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`,flexShrink:0},children:e}),(0,o.jsx)(r,{as:`h2`,type:`display`,size:e,children:`Display`})]},e))})},f={name:`Responsive Size`,render:()=>(0,o.jsx)(`div`,{style:{maxWidth:`760px`},children:(0,o.jsx)(r,{as:`h1`,type:`display`,size:{xs:`lg`,md:`jumbo`,lg:`xJumbo`},children:`Resize the preview`})})},p={render:()=>(0,o.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`12px`},children:[(0,o.jsx)(r,{as:`h2`,color:`default`,children:`Default heading color`}),(0,o.jsx)(r,{as:`h2`,color:`muted`,children:`Muted heading color`}),(0,o.jsx)(r,{as:`h2`,color:`accent`,children:`Accent heading color`}),(0,o.jsx)(a,{style:{padding:`16px`,borderRadius:`6px`},children:(0,o.jsx)(r,{as:`h2`,children:`Inverse surface heading`})})]})},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: "Heading Scale",
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  }}>
      {[{
      as: "h1",
      size: "xl"
    }, {
      as: "h2",
      size: "lg"
    }, {
      as: "h3",
      size: "md"
    }, {
      as: "h4",
      size: "sm"
    }, {
      as: "h5",
      size: "xs"
    }, {
      as: "h6",
      size: "xs"
    }].map(({
      as,
      size
    }) => <div key={as} style={{
      display: "flex",
      alignItems: "baseline",
      gap: "16px"
    }}>
          <span style={{
        width: "28px",
        fontSize: "0.75rem",
        color: "var(--semantic-color-text-muted)",
        flexShrink: 0
      }}>
            {as}
          </span>
          <Heading as={as} size={size}>
            The quick brown fox
          </Heading>
        </div>)}
    </div>
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: "Decoupled Semantic vs Visual Size",
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  }}>
      <Heading as="h1" size="xs">h1 rendered at xs size</Heading>
      <Heading as="h6" size="xl">h6 rendered at xl size</Heading>
      <Heading as="h3" size="lg">h3 rendered at lg size</Heading>
    </div>
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: "Display Scale",
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  }}>
      {["sm", "md", "lg", "xl", "xxl", "jumbo", "xJumbo"].map(size => <div key={size} style={{
      display: "flex",
      alignItems: "baseline",
      gap: "16px"
    }}>
          <span style={{
        width: "52px",
        fontSize: "0.75rem",
        color: "var(--semantic-color-text-muted)",
        flexShrink: 0
      }}>
            {size}
          </span>
          <Heading as="h2" type="display" size={size}>
            Display
          </Heading>
        </div>)}
    </div>
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: "Responsive Size",
  render: () => <div style={{
    maxWidth: "760px"
  }}>
      <Heading as="h1" type="display" size={{
      xs: "lg",
      md: "jumbo",
      lg: "xJumbo"
    }}>
        Resize the preview
      </Heading>
    </div>
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  }}>
      <Heading as="h2" color="default">Default heading color</Heading>
      <Heading as="h2" color="muted">Muted heading color</Heading>
      <Heading as="h2" color="accent">Accent heading color</Heading>
      <Inverse style={{
      padding: "16px",
      borderRadius: "6px"
    }}>
        <Heading as="h2">Inverse surface heading</Heading>
      </Inverse>
    </div>
}`,...p.parameters?.docs?.source}}},m=[`Configurable`,`HeadingScale`,`DecoupledSize`,`DisplayScale`,`ResponsiveSize`,`Colors`]}))();export{p as Colors,c as Configurable,u as DecoupledSize,d as DisplayScale,l as HeadingScale,f as ResponsiveSize,m as __namedExportsOrder,s as default};