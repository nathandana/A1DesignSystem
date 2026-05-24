import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./iframe-D1JN-_Xq.js";import{n,t as r}from"./Button-Drjb0R59.js";import{n as i,t as a}from"./ButtonContainer-fPLqJHd5.js";import{n as o,t as s}from"./Card-agHV441k.js";import{n as c,t as l}from"./Heading-ouMjY5HL.js";import{n as u,t as d}from"./Paragraph-CrxcTh6-.js";function f({width:e,title:t,description:n,buttons:r}){return(0,p.jsxs)(s,{shadow:`sm`,style:{width:e,maxWidth:`100%`},children:[(0,p.jsx)(l,{as:`h3`,size:`sm`,style:{marginBottom:`8px`},children:t}),(0,p.jsx)(d,{color:`muted`,style:{marginBottom:`20px`},children:n}),(0,p.jsx)(a,{children:r})]})}var p,m,h,g,_,v,y;e((()=>{n(),i(),o(),c(),u(),p=t(),m={title:`Components/Controls/Button Container`,component:a,tags:[`autodocs`],parameters:{layout:`padded`},args:{align:`start`},argTypes:{align:{control:`inline-radio`,options:[`start`,`center`,`end`]}},render:e=>(0,p.jsxs)(a,{...e,style:{maxWidth:560},children:[(0,p.jsx)(r,{variant:`primary`,children:`Save changes`}),(0,p.jsx)(r,{variant:`secondary`,children:`Cancel`})]})},h={},g=[{width:320,title:`Narrow card`,description:`Two actions stack and fill the available width.`,buttons:[(0,p.jsx)(r,{variant:`primary`,children:`Save changes`},`save`),(0,p.jsx)(r,{variant:`secondary`,children:`Cancel`},`cancel`)]},{width:420,title:`Compact card`,description:`Three actions remain stacked below the container threshold.`,buttons:[(0,p.jsx)(r,{variant:`success`,children:`Approve`},`approve`),(0,p.jsx)(r,{variant:`secondary`,children:`Review`},`review`),(0,p.jsx)(r,{variant:`destructive`,children:`Delete`},`delete`)]},{width:480,title:`Standard card`,description:`At 480px, buttons return to their natural content width.`,buttons:[(0,p.jsx)(r,{variant:`primary`,children:`Create project`},`create`),(0,p.jsx)(r,{variant:`secondary`,children:`Use template`},`template`)]},{width:640,title:`Wide card`,description:`A wider action area can hold multiple natural-width buttons.`,buttons:[(0,p.jsx)(r,{variant:`primary`,children:`Publish`},`publish`),(0,p.jsx)(r,{variant:`secondary`,children:`Preview`},`preview`),(0,p.jsx)(r,{variant:`tertiary`,children:`Archive`},`archive`)]}],_={name:`Card widths`,render:()=>(0,p.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,alignItems:`flex-start`,gap:`24px`},children:g.map(e=>(0,p.jsx)(f,{...e},e.title))})},v={render:()=>(0,p.jsx)(`div`,{style:{display:`grid`,gap:`24px`,maxWidth:640},children:[`start`,`center`,`end`].map(e=>(0,p.jsxs)(s,{shadow:`sm`,children:[(0,p.jsx)(l,{as:`h3`,size:`sm`,style:{marginBottom:`16px`},children:e}),(0,p.jsxs)(a,{align:e,children:[(0,p.jsx)(r,{variant:`primary`,children:`Save changes`}),(0,p.jsx)(r,{variant:`secondary`,children:`Cancel`}),(0,p.jsx)(r,{variant:`tertiary`,children:`Reset`})]})]},e))})},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{}`,...h.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: "Card widths",
  render: () => <div style={{
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-start",
    gap: "24px"
  }}>
      {examples.map(example => <ExampleCard key={example.title} {...example} />)}
    </div>
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}},y=[`Configurable`,`CardWidths`,`Alignment`]}))();export{v as Alignment,_ as CardWidths,h as Configurable,y as __namedExportsOrder,m as default};