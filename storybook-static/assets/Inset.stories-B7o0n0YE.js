import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./iframe-BeAWTq30.js";import{n,t as r}from"./Card-O6GlBPB8.js";import{n as i,t as a}from"./Heading-ChaijyaD.js";import{n as o,t as s}from"./Paragraph-l5EsZ55n.js";import{n as c,t as l}from"./Inset-x33Xr5oi.js";import{n as u,t as d}from"./Stack-D6DiMfta.js";var f,p,m,h,g;e((()=>{c(),n(),i(),o(),u(),f=t(),p={title:`Components/Structure/Inset`,component:l,tags:[`autodocs`],parameters:{layout:`padded`},argTypes:{space:{control:`select`,options:[0,4,8,12,16,24,32,40]},block:{control:`select`,options:[void 0,0,4,8,12,16,24,32,40]},inline:{control:`select`,options:[void 0,0,4,8,12,16,24,32,40]}}},m={args:{space:24},render:e=>(0,f.jsx)(r,{shadow:`xs`,style:{maxWidth:560,padding:0},children:(0,f.jsx)(l,{...e,children:(0,f.jsxs)(d,{gap:12,children:[(0,f.jsx)(a,{as:`h2`,size:`md`,children:`Inset`}),(0,f.jsx)(s,{color:`muted`,children:`Inset applies consistent internal padding to a region.`})]})})})},h={name:`Asymmetric inset`,render:()=>(0,f.jsx)(r,{shadow:`xs`,style:{maxWidth:560,padding:0},children:(0,f.jsx)(l,{block:16,inline:32,children:(0,f.jsxs)(d,{gap:8,children:[(0,f.jsx)(a,{as:`h2`,size:`md`,children:`Compact block, roomy inline`}),(0,f.jsx)(s,{color:`muted`,children:`Use separate block and inline values when the content needs different breathing room by axis.`})]})})})},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    space: 24
  },
  render: args => <Card shadow="xs" style={{
    maxWidth: 560,
    padding: 0
  }}>
      <Inset {...args}>
        <Stack gap={12}>
          <Heading as="h2" size="md">Inset</Heading>
          <Paragraph color="muted">
            Inset applies consistent internal padding to a region.
          </Paragraph>
        </Stack>
      </Inset>
    </Card>
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  name: "Asymmetric inset",
  render: () => <Card shadow="xs" style={{
    maxWidth: 560,
    padding: 0
  }}>
      <Inset block={16} inline={32}>
        <Stack gap={8}>
          <Heading as="h2" size="md">Compact block, roomy inline</Heading>
          <Paragraph color="muted">
            Use separate block and inline values when the content needs different breathing room by axis.
          </Paragraph>
        </Stack>
      </Inset>
    </Card>
}`,...h.parameters?.docs?.source}}},g=[`Configurable`,`AsymmetricInset`]}))();export{h as AsymmetricInset,m as Configurable,g as __namedExportsOrder,p as default};