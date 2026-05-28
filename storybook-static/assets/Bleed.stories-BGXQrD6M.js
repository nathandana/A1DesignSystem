import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./iframe-BwSdWSBC.js";import{n,t as r}from"./Card-DKzrDfJl.js";import{r as i,t as a}from"./Heading-D0Pp0q-v.js";import{n as o,t as s}from"./Paragraph-CS8wKw09.js";import{n as c,t as l}from"./structure-utils-S3JSBKrs.js";import{n as u,t as d}from"./Inset-sz21qcvN.js";import{n as f,t as p}from"./Stack-8qDb9RHU.js";var m=e((()=>{}));function h({as:e=`div`,space:t=16,block:n=`none`,inline:r,className:i=``,children:a,...o}){let s={"--a1-bleed-block":c(n)??c(t),"--a1-bleed-inline":c(r)??c(t),...o.style};return(0,g.jsx)(e,{className:[`a1-bleed`,i].filter(Boolean).join(` `),style:s,...o,children:a})}var g,_=e((()=>{m(),l(),g=t(),h.__docgenInfo={description:``,methods:[],displayName:`Bleed`,props:{as:{defaultValue:{value:`"div"`,computed:!1},required:!1},space:{defaultValue:{value:`16`,computed:!1},required:!1},block:{defaultValue:{value:`"none"`,computed:!1},required:!1},className:{defaultValue:{value:`""`,computed:!1},required:!1}}}})),v,y,b,x,S;e((()=>{_(),n(),i(),u(),o(),f(),v=t(),y={title:`Components/Structure/Bleed`,component:h,tags:[`autodocs`],parameters:{layout:`padded`},argTypes:{space:{control:`select`,options:[0,4,8,12,16,24,32,40]},block:{control:`select`,options:[`none`,0,4,8,12,16,24,32,40]},inline:{control:`select`,options:[void 0,0,4,8,12,16,24,32,40]}}},b={args:{space:24,block:`none`},render:e=>(0,v.jsx)(r,{shadow:`xs`,style:{maxWidth:560,padding:0,overflow:`hidden`},children:(0,v.jsx)(d,{space:24,children:(0,v.jsxs)(p,{gap:16,children:[(0,v.jsxs)(p,{gap:8,children:[(0,v.jsx)(a,{as:`h2`,size:`md`,children:`Bleed`}),(0,v.jsx)(s,{color:`muted`,children:`Bleed lets selected content extend through surrounding inset spacing.`})]}),(0,v.jsx)(h,{...e,children:(0,v.jsx)(`div`,{style:{minHeight:120,background:`var(--semantic-color-surface-raised)`}})}),(0,v.jsx)(s,{children:`The visual band reaches the card edge while the text remains inset.`})]})})})},x={name:`Media bleed`,render:()=>(0,v.jsx)(r,{shadow:`xs`,style:{maxWidth:560,padding:0,overflow:`hidden`},children:(0,v.jsx)(d,{space:32,children:(0,v.jsxs)(p,{gap:16,children:[(0,v.jsx)(a,{as:`h2`,size:`md`,children:`Card with edge-to-edge media`}),(0,v.jsx)(h,{space:32,children:(0,v.jsx)(`div`,{style:{minHeight:160,background:`var(--semantic-color-text-accent)`}})}),(0,v.jsx)(s,{color:`muted`,children:`Pair Inset and Bleed when media should reach the container edge but copy should stay comfortably padded.`})]})})})},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}},S=[`Configurable`,`MediaBleed`]}))();export{b as Configurable,x as MediaBleed,S as __namedExportsOrder,y as default};