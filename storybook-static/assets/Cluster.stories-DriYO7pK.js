import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./iframe-BeAWTq30.js";import{n,t as r}from"./Button-V2oEBQfD.js";import{n as i,t as a}from"./Card-O6GlBPB8.js";import{n as o,t as s}from"./Heading-ChaijyaD.js";import{i as c,t as l}from"./Message-Bxlp4BtS.js";import{n as u,t as d}from"./Paragraph-l5EsZ55n.js";import{n as f,t as p}from"./structure-utils-C09Y-2aQ.js";var m=e((()=>{}));function h({as:e=`div`,gap:t=8,rowGap:n,columnGap:r,align:i=`center`,justify:a=`start`,className:o=``,children:s,...c}){let l=_.includes(i)?i:`center`,u=v.includes(a)?a:`start`,d=f(t),p={"--a1-cluster-row-gap":f(n)??d,"--a1-cluster-column-gap":f(r)??d,"--a1-cluster-align":y[l],"--a1-cluster-justify":b[u],...c.style};return(0,g.jsx)(e,{className:[`a1-cluster`,o].filter(Boolean).join(` `),style:p,...c,children:s})}var g,_,v,y,b,x=e((()=>{m(),p(),g=t(),_=[`start`,`center`,`end`,`stretch`,`baseline`],v=[`start`,`center`,`end`,`between`,`around`,`evenly`],y={start:`flex-start`,center:`center`,end:`flex-end`,stretch:`stretch`,baseline:`baseline`},b={start:`flex-start`,center:`center`,end:`flex-end`,between:`space-between`,around:`space-around`,evenly:`space-evenly`},h.__docgenInfo={description:``,methods:[],displayName:`Cluster`,props:{as:{defaultValue:{value:`"div"`,computed:!1},required:!1},gap:{defaultValue:{value:`8`,computed:!1},required:!1},align:{defaultValue:{value:`"center"`,computed:!1},required:!1},justify:{defaultValue:{value:`"start"`,computed:!1},required:!1},className:{defaultValue:{value:`""`,computed:!1},required:!1}}}})),S,C,w,T,E;e((()=>{x(),n(),i(),o(),c(),u(),S=t(),C={title:`Components/Structure/Cluster`,component:h,tags:[`autodocs`],parameters:{layout:`padded`},argTypes:{gap:{control:`select`,options:[0,2,4,8,12,16,24,32]},align:{control:`select`,options:[`start`,`center`,`end`,`stretch`,`baseline`]},justify:{control:`select`,options:[`start`,`center`,`end`,`between`,`around`,`evenly`]}}},w={args:{gap:8,align:`center`,justify:`start`},render:e=>(0,S.jsx)(a,{shadow:`xs`,style:{maxWidth:640},children:(0,S.jsxs)(h,{...e,children:[(0,S.jsx)(l,{subtle:!0,status:`success`,children:`Ready`}),(0,S.jsx)(l,{subtle:!0,status:`info`,children:`Docs`}),(0,S.jsx)(l,{subtle:!0,status:`warn`,children:`Review`}),(0,S.jsx)(r,{size:`sm`,variant:`secondary`,children:`Open`}),(0,S.jsx)(r,{size:`sm`,children:`Publish`})]})})},T={name:`Wrapping actions`,render:()=>(0,S.jsxs)(a,{shadow:`xs`,style:{maxWidth:520},children:[(0,S.jsx)(s,{as:`h2`,size:`md`,children:`Cluster`}),(0,S.jsx)(d,{color:`muted`,children:`Cluster wraps inline groups while preserving consistent row and column gaps.`}),(0,S.jsxs)(h,{gap:8,children:[(0,S.jsx)(r,{size:`sm`,variant:`secondary`,children:`Preview`}),(0,S.jsx)(r,{size:`sm`,variant:`secondary`,children:`Duplicate`}),(0,S.jsx)(r,{size:`sm`,variant:`secondary`,children:`Archive`}),(0,S.jsx)(r,{size:`sm`,children:`Share`})]})]})},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    gap: 8,
    align: "center",
    justify: "start"
  },
  render: args => <Card shadow="xs" style={{
    maxWidth: 640
  }}>
      <Cluster {...args}>
        <MessageBadge subtle status="success">Ready</MessageBadge>
        <MessageBadge subtle status="info">Docs</MessageBadge>
        <MessageBadge subtle status="warn">Review</MessageBadge>
        <Button size="sm" variant="secondary">Open</Button>
        <Button size="sm">Publish</Button>
      </Cluster>
    </Card>
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  name: "Wrapping actions",
  render: () => <Card shadow="xs" style={{
    maxWidth: 520
  }}>
      <Heading as="h2" size="md">Cluster</Heading>
      <Paragraph color="muted">
        Cluster wraps inline groups while preserving consistent row and column gaps.
      </Paragraph>
      <Cluster gap={8}>
        <Button size="sm" variant="secondary">Preview</Button>
        <Button size="sm" variant="secondary">Duplicate</Button>
        <Button size="sm" variant="secondary">Archive</Button>
        <Button size="sm">Share</Button>
      </Cluster>
    </Card>
}`,...T.parameters?.docs?.source}}},E=[`Configurable`,`WrappingActions`]}))();export{w as Configurable,T as WrappingActions,E as __namedExportsOrder,C as default};