import{i as e}from"./preload-helper-Cs4UwXAW.js";import{r as t}from"./iframe-DZoRqkgT.js";import{n,t as r}from"./Button-Clq9-j9U.js";import{n as i,t as a}from"./Card-CP5t58sT.js";import{r as o,t as s}from"./Heading-Cv0veVz5.js";import{n as c,t as l}from"./Paragraph-CcdcQtLu.js";import{n as u,t as d}from"./Stack-mhZACoJp.js";var f,p,m,h,g,_,v;e((()=>{u(),n(),i(),o(),c(),f=t(),p={title:`Components/Structure/Stack`,component:d,tags:[`autodocs`],parameters:{layout:`padded`},argTypes:{direction:{control:`select`,options:[`column`,`column-reverse`,`row`,`row-reverse`],description:`Also accepts a breakpoint object: { xs: 'column', md: 'row' }`},gap:{control:`select`,options:[`xs`,`sm`,`md`,`lg`,0,2,4,8,12,16,24,32,40]},align:{control:`select`,options:[`stretch`,`start`,`center`,`end`,`baseline`]},justify:{control:`select`,options:[`start`,`center`,`end`,`between`,`around`,`evenly`]},wrap:{control:`boolean`}}},m={args:{direction:`column`,gap:`md`,align:`stretch`,justify:`start`,wrap:!1},render:e=>(0,f.jsx)(a,{shadow:`xs`,style:{maxWidth:560},children:(0,f.jsxs)(d,{...e,children:[(0,f.jsx)(s,{as:`h2`,size:`md`,children:`Stack`}),(0,f.jsx)(l,{color:`muted`,children:`Stack arranges children in a single axis with token-based spacing.`}),(0,f.jsx)(r,{variant:`secondary`,children:`Secondary action`}),(0,f.jsx)(r,{children:`Primary action`})]})})},h={name:`Responsive direction`,render:()=>(0,f.jsx)(a,{shadow:`xs`,style:{maxWidth:560},children:(0,f.jsxs)(d,{direction:{xs:`column`,sm:`row`},gap:`md`,align:`start`,children:[(0,f.jsx)(s,{as:`h3`,size:`sm`,style:{whiteSpace:`nowrap`},children:`Label`}),(0,f.jsx)(l,{color:`muted`,children:`This stack is column on mobile and switches to row at the sm breakpoint. Resize the viewport to see the layout change.`})]})})},g={name:`Gap scale`,render:()=>(0,f.jsx)(f.Fragment,{children:[`xs`,`sm`,`md`,`lg`].map(e=>(0,f.jsx)(a,{shadow:`xs`,style:{maxWidth:560,marginBottom:16},children:(0,f.jsxs)(d,{gap:e,children:[(0,f.jsxs)(s,{as:`h3`,size:`sm`,children:[`gap="`,e,`"`]}),(0,f.jsx)(l,{color:`muted`,children:`First item in the stack.`}),(0,f.jsx)(l,{color:`muted`,children:`Second item in the stack.`}),(0,f.jsx)(l,{color:`muted`,children:`Third item in the stack.`})]})},e))})},_={name:`Content stack`,render:()=>(0,f.jsx)(a,{shadow:`xs`,style:{maxWidth:560},children:(0,f.jsxs)(d,{gap:12,children:[(0,f.jsx)(s,{as:`h2`,size:`md`,children:`Release checklist`}),(0,f.jsx)(l,{color:`muted`,children:`Use smaller gaps for tightly related text and larger gaps when moving between groups.`}),(0,f.jsxs)(d,{gap:8,children:[(0,f.jsx)(l,{children:`Validate component states`}),(0,f.jsx)(l,{children:`Run visual review`}),(0,f.jsx)(l,{children:`Publish Storybook`})]})]})})},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    direction: "column",
    gap: "md",
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
  name: "Responsive direction",
  render: () => <Card shadow="xs" style={{
    maxWidth: 560
  }}>
      <Stack direction={{
      xs: "column",
      sm: "row"
    }} gap="md" align="start">
        <Heading as="h3" size="sm" style={{
        whiteSpace: "nowrap"
      }}>Label</Heading>
        <Paragraph color="muted">
          This stack is column on mobile and switches to row at the sm breakpoint.
          Resize the viewport to see the layout change.
        </Paragraph>
      </Stack>
    </Card>
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: "Gap scale",
  render: () => <>
      {["xs", "sm", "md", "lg"].map(size => <Card key={size} shadow="xs" style={{
      maxWidth: 560,
      marginBottom: 16
    }}>
          <Stack gap={size}>
            <Heading as="h3" size="sm">gap="{size}"</Heading>
            <Paragraph color="muted">First item in the stack.</Paragraph>
            <Paragraph color="muted">Second item in the stack.</Paragraph>
            <Paragraph color="muted">Third item in the stack.</Paragraph>
          </Stack>
        </Card>)}
    </>
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}},v=[`Configurable`,`ResponsiveDirection`,`GapScale`,`ContentStack`]}))();export{m as Configurable,_ as ContentStack,g as GapScale,h as ResponsiveDirection,v as __namedExportsOrder,p as default};