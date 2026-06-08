import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./iframe-D8uQ9hre.js";import{n,t as r}from"./Card-D3RcWj2w.js";import{r as i,t as a}from"./Heading-D4Rsl0li.js";import{n as o,t as s}from"./Divider-CCQBerq_.js";import{n as c,t as l}from"./Paragraph-E9JaBz9b.js";import{r as u,t as d}from"./Grid-j_5oiDaR.js";var f,p,m,h,g,_,v,y;e((()=>{o(),n(),u(),i(),c(),f=t(),p={title:`Components/Structure/Divider`,component:s,tags:[`autodocs`],parameters:{layout:`padded`},argTypes:{orientation:{control:`select`,options:[`horizontal`,`vertical`]},variant:{control:`select`,options:[`subtle`,`strong`,`accent`,`dashed`,`dotted`]},size:{control:`select`,options:[`xs`,`sm`,`md`,`lg`]},space:{control:`select`,options:[`none`,`xs`,`sm`,`md`,`lg`,`xl`,`xxl`]},decorative:{control:`boolean`}}},m={args:{orientation:`horizontal`,variant:`subtle`,size:`xs`,space:`sm`,decorative:!0},render:e=>(0,f.jsxs)(r,{shadow:`xs`,style:{maxWidth:560},children:[(0,f.jsx)(a,{as:`h2`,size:`md`,children:`Divider`}),(0,f.jsx)(l,{color:`muted`,children:`Use dividers to separate related groups without creating another container.`}),(0,f.jsx)(s,{...e}),(0,f.jsx)(l,{children:`Adjust orientation, visual weight, style, and spacing from the controls panel.`})]})},h={name:`Horizontal variants`,render:()=>(0,f.jsx)(r,{shadow:`xs`,style:{maxWidth:640},children:[`subtle`,`strong`,`accent`,`dashed`,`dotted`].map(e=>(0,f.jsxs)(`div`,{children:[(0,f.jsx)(l,{size:`sm`,color:`muted`,children:e}),(0,f.jsx)(s,{variant:e,space:`sm`})]},e))})},g={name:`Size scale`,render:()=>(0,f.jsx)(r,{shadow:`xs`,style:{maxWidth:640},children:[`xs`,`sm`,`md`,`lg`].map(e=>(0,f.jsxs)(`div`,{children:[(0,f.jsx)(l,{size:`sm`,color:`muted`,children:e}),(0,f.jsx)(s,{size:e,variant:e===`xs`?`subtle`:`strong`,space:`sm`})]},e))})},_={name:`Responsive orientation`,render:()=>(0,f.jsxs)(r,{shadow:`xs`,style:{display:`flex`,alignItems:`stretch`,maxWidth:640},children:[(0,f.jsxs)(`div`,{style:{flex:1},children:[(0,f.jsx)(a,{as:`h2`,size:`sm`,children:`Left`}),(0,f.jsx)(l,{size:`sm`,color:`muted`,children:`Horizontal on mobile, vertical on wider screens.`})]}),(0,f.jsx)(s,{orientation:{xs:`horizontal`,sm:`vertical`},variant:`subtle`,size:`sm`,space:`md`}),(0,f.jsxs)(`div`,{style:{flex:1},children:[(0,f.jsx)(a,{as:`h3`,size:`sm`,children:`Right`}),(0,f.jsx)(l,{size:`sm`,color:`muted`,children:`Resize the window to see it switch.`})]})]})},v={name:`Vertical dividers`,render:()=>(0,f.jsx)(d,{columns:{xs:1,md:3},gap:`md`,style:{maxWidth:760},children:[`subtle`,`strong`,`accent`].map(e=>(0,f.jsxs)(r,{shadow:`xs`,style:{display:`flex`,alignItems:`stretch`,minHeight:160},children:[(0,f.jsxs)(`div`,{children:[(0,f.jsx)(a,{as:`h2`,size:`sm`,children:e}),(0,f.jsx)(l,{size:`sm`,color:`muted`,children:`Left content`})]}),(0,f.jsx)(s,{orientation:`vertical`,variant:e,size:`sm`,space:`md`}),(0,f.jsxs)(`div`,{children:[(0,f.jsx)(a,{as:`h3`,size:`sm`,children:`Detail`}),(0,f.jsx)(l,{size:`sm`,color:`muted`,children:`Right content`})]})]},e))})},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
  name: "Responsive orientation",
  render: () => <Card shadow="xs" style={{
    display: "flex",
    alignItems: "stretch",
    maxWidth: 640
  }}>
      <div style={{
      flex: 1
    }}>
        <Heading as="h2" size="sm">Left</Heading>
        <Paragraph size="sm" color="muted">Horizontal on mobile, vertical on wider screens.</Paragraph>
      </div>
      <Divider orientation={{
      xs: "horizontal",
      sm: "vertical"
    }} variant="subtle" size="sm" space="md" />
      <div style={{
      flex: 1
    }}>
        <Heading as="h3" size="sm">Right</Heading>
        <Paragraph size="sm" color="muted">Resize the window to see it switch.</Paragraph>
      </div>
    </Card>
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: "Vertical dividers",
  render: () => <Grid columns={{
    xs: 1,
    md: 3
  }} gap="md" style={{
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
}`,...v.parameters?.docs?.source}}},y=[`Configurable`,`HorizontalVariants`,`SizeScale`,`ResponsiveOrientation`,`VerticalDividers`]}))();export{m as Configurable,h as HorizontalVariants,_ as ResponsiveOrientation,g as SizeScale,v as VerticalDividers,y as __namedExportsOrder,p as default};