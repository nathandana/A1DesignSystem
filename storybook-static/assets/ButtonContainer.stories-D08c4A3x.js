import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./iframe-CN7ekW17.js";import{n,t as r}from"./Button-CyEQecRR.js";import{n as i,t as a}from"./Card-vST3IuKY.js";import{n as o,t as s}from"./Heading-uUxCaLV9.js";import{n as c,t as l}from"./Paragraph-Dwbf6qHs.js";var u=e((()=>{}));function d({align:e=`start`,className:t=``,children:n,...r}){return(0,f.jsx)(`div`,{className:[`a1-button-container`,`a1-button-container--${p.includes(e)?e:`start`}`,t].filter(Boolean).join(` `),...r,children:(0,f.jsx)(`div`,{className:`a1-button-container__inner`,children:n})})}var f,p,m=e((()=>{u(),f=t(),p=[`start`,`center`,`end`],d.__docgenInfo={description:``,methods:[],displayName:`ButtonContainer`,props:{align:{defaultValue:{value:`"start"`,computed:!1},required:!1},className:{defaultValue:{value:`""`,computed:!1},required:!1}}}}));function h({width:e,title:t,description:n,buttons:r}){return(0,g.jsxs)(a,{shadow:`sm`,style:{width:e,maxWidth:`100%`},children:[(0,g.jsx)(s,{as:`h3`,size:`sm`,style:{marginBottom:`8px`},children:t}),(0,g.jsx)(l,{color:`muted`,style:{marginBottom:`20px`},children:n}),(0,g.jsx)(d,{children:r})]})}var g,_,v,y,b,x,S;e((()=>{n(),m(),i(),o(),c(),g=t(),_={title:`Components/Controls/Button Container`,component:d,tags:[`autodocs`],parameters:{layout:`padded`},args:{align:`start`},argTypes:{align:{control:`inline-radio`,options:[`start`,`center`,`end`]}},render:e=>(0,g.jsxs)(d,{...e,style:{maxWidth:560},children:[(0,g.jsx)(r,{variant:`primary`,children:`Save changes`}),(0,g.jsx)(r,{variant:`secondary`,children:`Cancel`})]})},v={},y=[{width:320,title:`Narrow card`,description:`Two actions stack and fill the available width.`,buttons:[(0,g.jsx)(r,{variant:`primary`,children:`Save changes`},`save`),(0,g.jsx)(r,{variant:`secondary`,children:`Cancel`},`cancel`)]},{width:420,title:`Compact card`,description:`Three actions remain stacked below the container threshold.`,buttons:[(0,g.jsx)(r,{variant:`success`,children:`Approve`},`approve`),(0,g.jsx)(r,{variant:`secondary`,children:`Review`},`review`),(0,g.jsx)(r,{variant:`destructive`,children:`Delete`},`delete`)]},{width:480,title:`Standard card`,description:`At 480px, buttons return to their natural content width.`,buttons:[(0,g.jsx)(r,{variant:`primary`,children:`Create project`},`create`),(0,g.jsx)(r,{variant:`secondary`,children:`Use template`},`template`)]},{width:640,title:`Wide card`,description:`A wider action area can hold multiple natural-width buttons.`,buttons:[(0,g.jsx)(r,{variant:`primary`,children:`Publish`},`publish`),(0,g.jsx)(r,{variant:`secondary`,children:`Preview`},`preview`),(0,g.jsx)(r,{variant:`tertiary`,children:`Archive`},`archive`)]}],b={name:`Card widths`,render:()=>(0,g.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,alignItems:`flex-start`,gap:`24px`},children:y.map(e=>(0,g.jsx)(h,{...e},e.title))})},x={render:()=>(0,g.jsx)(`div`,{style:{display:`grid`,gap:`24px`,maxWidth:640},children:[`start`,`center`,`end`].map(e=>(0,g.jsxs)(a,{shadow:`sm`,children:[(0,g.jsx)(s,{as:`h3`,size:`sm`,style:{marginBottom:`16px`},children:e}),(0,g.jsxs)(d,{align:e,children:[(0,g.jsx)(r,{variant:`primary`,children:`Save changes`}),(0,g.jsx)(r,{variant:`secondary`,children:`Cancel`}),(0,g.jsx)(r,{variant:`tertiary`,children:`Reset`})]})]},e))})},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{}`,...v.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: "Card widths",
  render: () => <div style={{
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-start",
    gap: "24px"
  }}>
      {examples.map(example => <ExampleCard key={example.title} {...example} />)}
    </div>
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "grid",
    gap: "24px",
    maxWidth: 640
  }}>
      {["start", "center", "end"].map(align => <Card key={align} shadow="sm">
          <Heading as="h3" size="sm" style={{
        marginBottom: "16px"
      }}>
            {align}
          </Heading>
          <ButtonContainer align={align}>
            <Button variant="primary">Save changes</Button>
            <Button variant="secondary">Cancel</Button>
            <Button variant="tertiary">Reset</Button>
          </ButtonContainer>
        </Card>)}
    </div>
}`,...x.parameters?.docs?.source}}},S=[`Configurable`,`CardWidths`,`Alignment`]}))();export{x as Alignment,b as CardWidths,v as Configurable,S as __namedExportsOrder,_ as default};