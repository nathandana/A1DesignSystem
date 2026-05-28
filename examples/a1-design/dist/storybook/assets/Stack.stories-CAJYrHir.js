import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./iframe-Yj7JQljB.js";import{n,t as r}from"./Button-CfiQA4bX.js";import{n as i,t as a}from"./Card-dB5Reugj.js";import{n as o,t as s}from"./Heading-CB6vmpLF.js";import{n as c,t as l}from"./Paragraph-B7CzrLxz.js";import{n as u,t as d}from"./Stack-CEDZXdC2.js";var f,p,m,h,g;e((()=>{u(),n(),i(),o(),c(),f=t(),p={title:`Components/Structure/Stack`,component:d,tags:[`autodocs`],parameters:{layout:`padded`},argTypes:{direction:{control:`select`,options:[`column`,`column-reverse`,`row`,`row-reverse`]},gap:{control:`select`,options:[0,2,4,8,12,16,24,32,40]},align:{control:`select`,options:[`stretch`,`start`,`center`,`end`,`baseline`]},justify:{control:`select`,options:[`start`,`center`,`end`,`between`,`around`,`evenly`]},wrap:{control:`boolean`}}},m={args:{direction:`column`,gap:16,align:`stretch`,justify:`start`,wrap:!1},render:e=>(0,f.jsx)(a,{shadow:`xs`,style:{maxWidth:560},children:(0,f.jsxs)(d,{...e,children:[(0,f.jsx)(s,{as:`h2`,size:`md`,children:`Stack`}),(0,f.jsx)(l,{color:`muted`,children:`Stack arranges children in a single axis with token-based spacing.`}),(0,f.jsx)(r,{variant:`secondary`,children:`Secondary action`}),(0,f.jsx)(r,{children:`Primary action`})]})})},h={name:`Content stack`,render:()=>(0,f.jsx)(a,{shadow:`xs`,style:{maxWidth:560},children:(0,f.jsxs)(d,{gap:12,children:[(0,f.jsx)(s,{as:`h2`,size:`md`,children:`Release checklist`}),(0,f.jsx)(l,{color:`muted`,children:`Use smaller gaps for tightly related text and larger gaps when moving between groups.`}),(0,f.jsxs)(d,{gap:8,children:[(0,f.jsx)(l,{children:`Validate component states`}),(0,f.jsx)(l,{children:`Run visual review`}),(0,f.jsx)(l,{children:`Publish Storybook`})]})]})})},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    direction: "column",
    gap: 16,
    align: "stretch",
    justify: "start",
    wrap: false
  },
  render: args => <Card shadow="xs" style={{
    maxWidth: 560
  }}>
      <Stack {...args}>
        <Heading as="h2" size="md">Stack</Heading>
        <Paragraph color="muted">
          Stack arranges children in a single axis with token-based spacing.
        </Paragraph>
        <Button variant="secondary">Secondary action</Button>
        <Button>Primary action</Button>
      </Stack>
    </Card>
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  name: "Content stack",
  render: () => <Card shadow="xs" style={{
    maxWidth: 560
  }}>
      <Stack gap={12}>
        <Heading as="h2" size="md">Release checklist</Heading>
        <Paragraph color="muted">
          Use smaller gaps for tightly related text and larger gaps when moving between groups.
        </Paragraph>
        <Stack gap={8}>
          <Paragraph>Validate component states</Paragraph>
          <Paragraph>Run visual review</Paragraph>
          <Paragraph>Publish Storybook</Paragraph>
        </Stack>
      </Stack>
    </Card>
}`,...h.parameters?.docs?.source}}},g=[`Configurable`,`ContentStack`]}))();export{m as Configurable,h as ContentStack,g as __namedExportsOrder,p as default};