import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./iframe-D8uQ9hre.js";import{n,t as r}from"./Card-D3RcWj2w.js";import{r as i,t as a}from"./Heading-D4Rsl0li.js";import{n as o,t as s}from"./Paragraph-E9JaBz9b.js";import{n as c,t as l}from"./Bleed-rMuXT7sr.js";import{n as u,t as d}from"./Inset-B9fErv70.js";import{n as f,t as p}from"./Stack-DL2770YT.js";var m,h,g,_,v;e((()=>{c(),n(),i(),u(),o(),f(),m=t(),h={title:`Components/Structure/Bleed`,component:l,tags:[`autodocs`],parameters:{layout:`padded`},argTypes:{space:{control:`select`,options:[0,4,8,12,16,24,32,40]},block:{control:`select`,options:[`none`,0,4,8,12,16,24,32,40]},inline:{control:`select`,options:[void 0,0,4,8,12,16,24,32,40]}}},g={args:{space:24,block:`none`},render:e=>(0,m.jsx)(r,{shadow:`xs`,style:{maxWidth:560,padding:0,overflow:`hidden`},children:(0,m.jsx)(d,{space:24,children:(0,m.jsxs)(p,{gap:16,children:[(0,m.jsxs)(p,{gap:8,children:[(0,m.jsx)(a,{as:`h2`,size:`md`,children:`Bleed`}),(0,m.jsx)(s,{color:`muted`,children:`Bleed lets selected content extend through surrounding inset spacing.`})]}),(0,m.jsx)(l,{...e,children:(0,m.jsx)(`div`,{style:{minHeight:120,background:`var(--semantic-color-surface-raised)`}})}),(0,m.jsx)(s,{children:`The visual band reaches the card edge while the text remains inset.`})]})})})},_={name:`Media bleed`,render:()=>(0,m.jsx)(r,{shadow:`xs`,style:{maxWidth:560,padding:0,overflow:`hidden`},children:(0,m.jsx)(d,{space:32,children:(0,m.jsxs)(p,{gap:16,children:[(0,m.jsx)(a,{as:`h2`,size:`md`,children:`Card with edge-to-edge media`}),(0,m.jsx)(l,{space:32,children:(0,m.jsx)(`div`,{style:{minHeight:160,background:`var(--semantic-color-text-accent)`}})}),(0,m.jsx)(s,{color:`muted`,children:`Pair Inset and Bleed when media should reach the container edge but copy should stay comfortably padded.`})]})})})},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    space: 24,
    block: "none"
  },
  render: args => <Card shadow="xs" style={{
    maxWidth: 560,
    padding: 0,
    overflow: "hidden"
  }}>
      <Inset space={24}>
        <Stack gap={16}>
          <Stack gap={8}>
            <Heading as="h2" size="md">Bleed</Heading>
            <Paragraph color="muted">
              Bleed lets selected content extend through surrounding inset spacing.
            </Paragraph>
          </Stack>
          <Bleed {...args}>
            <div style={{
            minHeight: 120,
            background: "var(--semantic-color-surface-raised)"
          }} />
          </Bleed>
          <Paragraph>
            The visual band reaches the card edge while the text remains inset.
          </Paragraph>
        </Stack>
      </Inset>
    </Card>
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: "Media bleed",
  render: () => <Card shadow="xs" style={{
    maxWidth: 560,
    padding: 0,
    overflow: "hidden"
  }}>
      <Inset space={32}>
        <Stack gap={16}>
          <Heading as="h2" size="md">Card with edge-to-edge media</Heading>
          <Bleed space={32}>
            <div style={{
            minHeight: 160,
            background: "var(--semantic-color-text-accent)"
          }} />
          </Bleed>
          <Paragraph color="muted">
            Pair Inset and Bleed when media should reach the container edge but copy should stay comfortably padded.
          </Paragraph>
        </Stack>
      </Inset>
    </Card>
}`,..._.parameters?.docs?.source}}},v=[`Configurable`,`MediaBleed`]}))();export{g as Configurable,_ as MediaBleed,v as __namedExportsOrder,h as default};