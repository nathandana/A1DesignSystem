import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./iframe-BwSdWSBC.js";import{n,r,t as i}from"./Heading-D0Pp0q-v.js";import{n as a,t as o}from"./Inverse-LRal80BC.js";var s,c,l,u,d,f,p,m,h,g;e((()=>{r(),a(),s=t(),c={title:`Components/Typography/Heading`,component:i,tags:[`autodocs`],args:{children:`The quick brown fox`,type:`heading`,color:`default`},argTypes:{as:{control:`select`,options:[`h1`,`h2`,`h3`,`h4`,`h5`,`h6`]},type:{control:`inline-radio`,options:[`heading`,`display`]},size:{control:`select`,options:[`xl`,`lg`,`md`,`sm`,`xs`,`xxl`,`jumbo`,`xJumbo`]},color:{control:`inline-radio`,options:[`default`,`muted`,`accent`]}}},l={},u={name:`Heading Scale`,render:()=>(0,s.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`16px`},children:[{as:`h1`,size:`xl`},{as:`h2`,size:`lg`},{as:`h3`,size:`md`},{as:`h4`,size:`sm`},{as:`h5`,size:`xs`},{as:`h6`,size:`xs`}].map(({as:e,size:t})=>(0,s.jsxs)(`div`,{style:{display:`flex`,alignItems:`baseline`,gap:`16px`},children:[(0,s.jsx)(`span`,{style:{width:`28px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`,flexShrink:0},children:e}),(0,s.jsx)(i,{as:e,size:t,children:`The quick brown fox`})]},e))})},d={name:`Decoupled Semantic vs Visual Size`,render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`16px`},children:[(0,s.jsx)(i,{as:`h1`,size:`xs`,children:`h1 rendered at xs size`}),(0,s.jsx)(i,{as:`h6`,size:`xl`,children:`h6 rendered at xl size`}),(0,s.jsx)(i,{as:`h3`,size:`lg`,children:`h3 rendered at lg size`})]})},f={name:`Display Scale`,render:()=>(0,s.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`16px`},children:[`sm`,`md`,`lg`,`xl`,`xxl`,`jumbo`,`xJumbo`].map(e=>(0,s.jsxs)(`div`,{style:{display:`flex`,alignItems:`baseline`,gap:`16px`},children:[(0,s.jsx)(`span`,{style:{width:`52px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`,flexShrink:0},children:e}),(0,s.jsx)(i,{as:`h2`,type:`display`,size:e,children:`Display`})]},e))})},p={name:`Responsive Size`,render:()=>(0,s.jsx)(`div`,{style:{maxWidth:`760px`},children:(0,s.jsx)(i,{as:`h1`,type:`display`,size:{xs:`lg`,md:`jumbo`,lg:`xJumbo`},children:`Resize the preview`})})},m={render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`12px`},children:[(0,s.jsx)(i,{as:`h2`,color:`default`,children:`Default heading color`}),(0,s.jsx)(i,{as:`h2`,color:`muted`,children:`Muted heading color`}),(0,s.jsx)(i,{as:`h2`,color:`accent`,children:`Accent heading color`}),(0,s.jsx)(o,{style:{padding:`16px`,borderRadius:`6px`},children:(0,s.jsx)(i,{as:`h2`,children:`Inverse surface heading`})})]})},h={name:`Expressive Marks`,render:()=>(0,s.jsxs)(`div`,{style:{display:`grid`,gap:`32px`,maxWidth:`980px`},children:[(0,s.jsxs)(i,{as:`h1`,type:`display`,size:{xs:`lg`,md:`xxl`},children:[`Build `,(0,s.jsx)(n,{children:`alignment`}),` before the interface.`]}),(0,s.jsxs)(i,{as:`h2`,type:`display`,size:`xl`,children:[`Make the moment `,(0,s.jsx)(n,{variant:`underline`,children:`impossible to miss`}),`.`]}),(0,s.jsxs)(`div`,{style:{display:`grid`,gap:`18px`},children:[(0,s.jsxs)(i,{as:`h3`,size:`lg`,children:[`Swoop underline for `,(0,s.jsx)(n,{variant:`underline`,underlineStyle:`swoop`,children:`editorial emphasis`})]}),(0,s.jsxs)(i,{as:`h3`,size:`lg`,children:[`Wave underline for `,(0,s.jsx)(n,{variant:`underline`,underlineStyle:`wave`,children:`energetic emphasis`})]}),(0,s.jsxs)(i,{as:`h3`,size:`lg`,children:[`Sketch underline for `,(0,s.jsx)(n,{variant:`underline`,underlineStyle:`sketch`,children:`rough-draft emphasis`})]})]})]})},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  name: "Expressive Marks",
  render: () => <div style={{
    display: "grid",
    gap: "32px",
    maxWidth: "980px"
  }}>
      <Heading as="h1" type="display" size={{
      xs: "lg",
      md: "xxl"
    }}>
        Build <HeadingMark>alignment</HeadingMark> before the interface.
      </Heading>

      <Heading as="h2" type="display" size="xl">
        Make the moment <HeadingMark variant="underline">impossible to miss</HeadingMark>.
      </Heading>

      <div style={{
      display: "grid",
      gap: "18px"
    }}>
        <Heading as="h3" size="lg">
          Swoop underline for <HeadingMark variant="underline" underlineStyle="swoop">editorial emphasis</HeadingMark>
        </Heading>
        <Heading as="h3" size="lg">
          Wave underline for <HeadingMark variant="underline" underlineStyle="wave">energetic emphasis</HeadingMark>
        </Heading>
        <Heading as="h3" size="lg">
          Sketch underline for <HeadingMark variant="underline" underlineStyle="sketch">rough-draft emphasis</HeadingMark>
        </Heading>
      </div>
    </div>
}`,...h.parameters?.docs?.source}}},g=[`Configurable`,`HeadingScale`,`DecoupledSize`,`DisplayScale`,`ResponsiveSize`,`Colors`,`ExpressiveMarks`]}))();export{m as Colors,l as Configurable,d as DecoupledSize,f as DisplayScale,h as ExpressiveMarks,u as HeadingScale,p as ResponsiveSize,g as __namedExportsOrder,c as default};