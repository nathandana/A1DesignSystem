import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./iframe-D1JN-_Xq.js";import{n,t as r}from"./Card-agHV441k.js";import{n as i,t as a}from"./Heading-ouMjY5HL.js";import{n as o,t as s}from"./Divider-DOZugOh8.js";import{n as c,t as l}from"./Paragraph-CrxcTh6-.js";import{r as u,t as d}from"./Grid-LaNJzKBm.js";var f,p,m,h,g,_,v;e((()=>{o(),n(),u(),i(),c(),f=t(),p={title:`Components/Structure/Divider`,component:s,tags:[`autodocs`],parameters:{layout:`padded`},argTypes:{orientation:{control:`select`,options:[`horizontal`,`vertical`]},variant:{control:`select`,options:[`subtle`,`strong`,`accent`,`dashed`,`dotted`]},size:{control:`select`,options:[`xs`,`sm`,`md`,`lg`]},space:{control:`select`,options:[`none`,`xs`,`sm`,`md`,`lg`]},decorative:{control:`boolean`}}},m={args:{orientation:`horizontal`,variant:`subtle`,size:`xs`,space:`sm`,decorative:!0},render:e=>(0,f.jsxs)(r,{shadow:`xs`,style:{maxWidth:560},children:[(0,f.jsx)(a,{as:`h2`,size:`md`,children:`Divider`}),(0,f.jsx)(l,{color:`muted`,children:`Use dividers to separate related groups without creating another container.`}),(0,f.jsx)(s,{...e}),(0,f.jsx)(l,{children:`Adjust orientation, visual weight, style, and spacing from the controls panel.`})]})},h={name:`Horizontal variants`,render:()=>(0,f.jsx)(r,{shadow:`xs`,style:{maxWidth:640},children:[`subtle`,`strong`,`accent`,`dashed`,`dotted`].map(e=>(0,f.jsxs)(`div`,{children:[(0,f.jsx)(l,{size:`sm`,color:`muted`,children:e}),(0,f.jsx)(s,{variant:e,space:`sm`})]},e))})},g={name:`Size scale`,render:()=>(0,f.jsx)(r,{shadow:`xs`,style:{maxWidth:640},children:[`xs`,`sm`,`md`,`lg`].map(e=>(0,f.jsxs)(`div`,{children:[(0,f.jsx)(l,{size:`sm`,color:`muted`,children:e}),(0,f.jsx)(s,{size:e,variant:e===`xs`?`subtle`:`strong`,space:`sm`})]},e))})},_={name:`Vertical dividers`,render:()=>(0,f.jsx)(d,{columns:{xs:1,md:3},gap:16,style:{maxWidth:760},children:[`subtle`,`strong`,`accent`].map(e=>(0,f.jsxs)(r,{shadow:`xs`,style:{display:`flex`,alignItems:`stretch`,minHeight:160},children:[(0,f.jsxs)(`div`,{children:[(0,f.jsx)(a,{as:`h2`,size:`sm`,children:e}),(0,f.jsx)(l,{size:`sm`,color:`muted`,children:`Left content`})]}),(0,f.jsx)(s,{orientation:`vertical`,variant:e,size:`sm`,space:`md`}),(0,f.jsxs)(`div`,{children:[(0,f.jsx)(a,{as:`h3`,size:`sm`,children:`Detail`}),(0,f.jsx)(l,{size:`sm`,color:`muted`,children:`Right content`})]})]},e))})},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    orientation: "horizontal",
    variant: "subtle",
    size: "xs",
    space: "sm",
    decorative: true
  },
  render: args => <Card shadow="xs" style={{
    maxWidth: 560
  }}>
      <Heading as="h2" size="md">Divider</Heading>
      <Paragraph color="muted">
        Use dividers to separate related groups without creating another container.
      </Paragraph>
      <Divider {...args} />
      <Paragraph>
        Adjust orientation, visual weight, style, and spacing from the controls panel.
      </Paragraph>
    </Card>
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  name: "Horizontal variants",
  render: () => <Card shadow="xs" style={{
    maxWidth: 640
  }}>
      {["subtle", "strong", "accent", "dashed", "dotted"].map(variant => <div key={variant}>
          <Paragraph size="sm" color="muted">{variant}</Paragraph>
          <Divider variant={variant} space="sm" />
        </div>)}
    </Card>
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: "Size scale",
  render: () => <Card shadow="xs" style={{
    maxWidth: 640
  }}>
      {["xs", "sm", "md", "lg"].map(size => <div key={size}>
          <Paragraph size="sm" color="muted">{size}</Paragraph>
          <Divider size={size} variant={size === "xs" ? "subtle" : "strong"} space="sm" />
        </div>)}
    </Card>
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: "Vertical dividers",
  render: () => <Grid columns={{
    xs: 1,
    md: 3
  }} gap={16} style={{
    maxWidth: 760
  }}>
      {["subtle", "strong", "accent"].map(variant => <Card key={variant} shadow="xs" style={{
      display: "flex",
      alignItems: "stretch",
      minHeight: 160
    }}>
          <div>
            <Heading as="h2" size="sm">{variant}</Heading>
            <Paragraph size="sm" color="muted">Left content</Paragraph>
          </div>
          <Divider orientation="vertical" variant={variant} size="sm" space="md" />
          <div>
            <Heading as="h3" size="sm">Detail</Heading>
            <Paragraph size="sm" color="muted">Right content</Paragraph>
          </div>
        </Card>)}
    </Grid>
}`,..._.parameters?.docs?.source}}},v=[`Configurable`,`HorizontalVariants`,`SizeScale`,`VerticalDividers`]}))();export{m as Configurable,h as HorizontalVariants,g as SizeScale,_ as VerticalDividers,v as __namedExportsOrder,p as default};