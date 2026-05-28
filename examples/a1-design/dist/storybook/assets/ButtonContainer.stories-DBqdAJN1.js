import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./iframe-Yj7JQljB.js";import{n,t as r}from"./Button-CfiQA4bX.js";import{n as i,t as a}from"./ButtonContainer-Cop-Cm49.js";import{n as o,t as s}from"./Card-dB5Reugj.js";import{n as c,t as l}from"./Heading-CB6vmpLF.js";import{n as u,t as d}from"./Link-CNPF3275.js";import{n as f,t as p}from"./Paragraph-B7CzrLxz.js";function m({width:e,title:t,description:n,buttons:r}){return(0,h.jsxs)(s,{shadow:`sm`,style:{width:e,maxWidth:`100%`},children:[(0,h.jsx)(l,{as:`h3`,size:`sm`,style:{marginBottom:`8px`},children:t}),(0,h.jsx)(p,{color:`muted`,style:{marginBottom:`20px`},children:n}),(0,h.jsx)(a,{children:r})]})}var h,g,_,v,y,b,x,S;e((()=>{n(),i(),o(),c(),u(),f(),h=t(),g={title:`Components/Controls/Button Container`,component:a,tags:[`autodocs`],parameters:{layout:`padded`},args:{align:`start`},argTypes:{align:{control:`inline-radio`,options:[`start`,`center`,`end`]}},render:e=>(0,h.jsxs)(a,{...e,style:{maxWidth:560},children:[(0,h.jsx)(r,{variant:`primary`,children:`Save changes`}),(0,h.jsx)(r,{variant:`secondary`,children:`Cancel`})]})},_={},v=[{width:320,title:`Narrow card`,description:`Two actions stack and fill the available width.`,buttons:[(0,h.jsx)(r,{variant:`primary`,children:`Save changes`},`save`),(0,h.jsx)(r,{variant:`secondary`,children:`Cancel`},`cancel`)]},{width:420,title:`Compact card`,description:`Three actions remain stacked below the container threshold.`,buttons:[(0,h.jsx)(r,{variant:`success`,children:`Approve`},`approve`),(0,h.jsx)(r,{variant:`secondary`,children:`Review`},`review`),(0,h.jsx)(r,{variant:`destructive`,children:`Delete`},`delete`)]},{width:480,title:`Standard card`,description:`At 480px, buttons return to their natural content width.`,buttons:[(0,h.jsx)(r,{variant:`primary`,children:`Create project`},`create`),(0,h.jsx)(r,{variant:`secondary`,children:`Use template`},`template`)]},{width:640,title:`Wide card`,description:`A wider action area can hold multiple natural-width buttons.`,buttons:[(0,h.jsx)(r,{variant:`primary`,children:`Publish`},`publish`),(0,h.jsx)(r,{variant:`secondary`,children:`Preview`},`preview`),(0,h.jsx)(r,{variant:`tertiary`,children:`Archive`},`archive`)]}],y={name:`Card widths`,render:()=>(0,h.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,alignItems:`flex-start`,gap:`24px`},children:v.map(e=>(0,h.jsx)(m,{...e},e.title))})},b={name:`Alignment & button order`,render:()=>(0,h.jsxs)(`div`,{style:{display:`grid`,gap:`24px`,maxWidth:640},children:[(0,h.jsxs)(s,{shadow:`sm`,children:[(0,h.jsx)(l,{as:`h3`,size:`sm`,style:{marginBottom:`6px`},children:`start`}),(0,h.jsx)(p,{size:`sm`,color:`muted`,style:{marginBottom:`16px`},children:`Primary leads — DOM order: primary → secondary → tertiary.`}),(0,h.jsxs)(a,{align:`start`,children:[(0,h.jsx)(r,{variant:`primary`,children:`Save`}),(0,h.jsx)(r,{variant:`secondary`,children:`Cancel`}),(0,h.jsx)(r,{variant:`tertiary`,children:`Reset`})]})]}),(0,h.jsxs)(s,{shadow:`sm`,children:[(0,h.jsx)(l,{as:`h3`,size:`sm`,style:{marginBottom:`6px`},children:`center`}),(0,h.jsx)(p,{size:`sm`,color:`muted`,style:{marginBottom:`16px`},children:`Primary leads — same DOM order as start.`}),(0,h.jsxs)(a,{align:`center`,children:[(0,h.jsx)(r,{variant:`primary`,children:`Save`}),(0,h.jsx)(r,{variant:`secondary`,children:`Cancel`}),(0,h.jsx)(r,{variant:`tertiary`,children:`Reset`})]})]}),(0,h.jsxs)(s,{shadow:`sm`,children:[(0,h.jsx)(l,{as:`h3`,size:`sm`,style:{marginBottom:`6px`},children:`end`}),(0,h.jsx)(p,{size:`sm`,color:`muted`,style:{marginBottom:`16px`},children:`Primary lands rightmost — write DOM order primary → secondary → tertiary and the layout reverses it visually to tertiary → secondary → primary.`}),(0,h.jsxs)(a,{align:`end`,children:[(0,h.jsx)(r,{variant:`primary`,children:`Save`}),(0,h.jsx)(r,{variant:`secondary`,children:`Cancel`}),(0,h.jsx)(r,{variant:`tertiary`,children:`Reset`})]})]})]})},x={name:`With inline link`,render:()=>(0,h.jsxs)(`div`,{style:{display:`grid`,gap:`24px`,maxWidth:640},children:[(0,h.jsxs)(s,{shadow:`sm`,children:[(0,h.jsx)(l,{as:`h3`,size:`sm`,style:{marginBottom:`6px`},children:`Start — link follows buttons`}),(0,h.jsx)(p,{size:`sm`,color:`muted`,style:{marginBottom:`16px`},children:`DOM order: primary → secondary → link. Link appears after the action buttons.`}),(0,h.jsxs)(a,{align:`start`,children:[(0,h.jsx)(r,{variant:`primary`,children:`Submit`}),(0,h.jsx)(r,{variant:`secondary`,children:`Cancel`}),(0,h.jsx)(d,{href:`#`,children:`Learn more`})]})]}),(0,h.jsxs)(s,{shadow:`sm`,children:[(0,h.jsx)(l,{as:`h3`,size:`sm`,style:{marginBottom:`6px`},children:`End — link shifts to the left`}),(0,h.jsx)(p,{size:`sm`,color:`muted`,style:{marginBottom:`16px`},children:`Same DOM order: primary → secondary → link. The end-alignment reversal pushes the link to the far left and the primary action to the far right.`}),(0,h.jsxs)(a,{align:`end`,children:[(0,h.jsx)(r,{variant:`primary`,children:`Save changes`}),(0,h.jsx)(r,{variant:`secondary`,children:`Discard`}),(0,h.jsx)(d,{href:`#`,children:`View documentation`})]})]}),(0,h.jsxs)(s,{shadow:`sm`,children:[(0,h.jsx)(l,{as:`h3`,size:`sm`,style:{marginBottom:`6px`},children:`Confirmation dialog footer`}),(0,h.jsx)(p,{size:`sm`,color:`muted`,style:{marginBottom:`16px`},children:`A common pattern: destructive primary action right, link as a low-emphasis escape hatch on the left.`}),(0,h.jsxs)(a,{align:`end`,children:[(0,h.jsx)(r,{variant:`destructive`,children:`Delete account`}),(0,h.jsx)(r,{variant:`secondary`,children:`Keep account`}),(0,h.jsx)(d,{href:`#`,children:`What gets deleted?`})]})]})]})},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{}`,..._.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: "Card widths",
  render: () => <div style={{
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-start",
    gap: "24px"
  }}>
      {examples.map(example => <ExampleCard key={example.title} {...example} />)}
    </div>
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: "Alignment & button order",
  render: () => <div style={{
    display: "grid",
    gap: "24px",
    maxWidth: 640
  }}>

      <Card shadow="sm">
        <Heading as="h3" size="sm" style={{
        marginBottom: "6px"
      }}>start</Heading>
        <Paragraph size="sm" color="muted" style={{
        marginBottom: "16px"
      }}>
          Primary leads — DOM order: primary → secondary → tertiary.
        </Paragraph>
        <ButtonContainer align="start">
          <Button variant="primary">Save</Button>
          <Button variant="secondary">Cancel</Button>
          <Button variant="tertiary">Reset</Button>
        </ButtonContainer>
      </Card>

      <Card shadow="sm">
        <Heading as="h3" size="sm" style={{
        marginBottom: "6px"
      }}>center</Heading>
        <Paragraph size="sm" color="muted" style={{
        marginBottom: "16px"
      }}>
          Primary leads — same DOM order as start.
        </Paragraph>
        <ButtonContainer align="center">
          <Button variant="primary">Save</Button>
          <Button variant="secondary">Cancel</Button>
          <Button variant="tertiary">Reset</Button>
        </ButtonContainer>
      </Card>

      <Card shadow="sm">
        <Heading as="h3" size="sm" style={{
        marginBottom: "6px"
      }}>end</Heading>
        <Paragraph size="sm" color="muted" style={{
        marginBottom: "16px"
      }}>
          Primary lands rightmost — write DOM order primary → secondary → tertiary and
          the layout reverses it visually to tertiary → secondary → primary.
        </Paragraph>
        <ButtonContainer align="end">
          <Button variant="primary">Save</Button>
          <Button variant="secondary">Cancel</Button>
          <Button variant="tertiary">Reset</Button>
        </ButtonContainer>
      </Card>

    </div>
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: "With inline link",
  render: () => <div style={{
    display: "grid",
    gap: "24px",
    maxWidth: 640
  }}>

      <Card shadow="sm">
        <Heading as="h3" size="sm" style={{
        marginBottom: "6px"
      }}>
          Start — link follows buttons
        </Heading>
        <Paragraph size="sm" color="muted" style={{
        marginBottom: "16px"
      }}>
          DOM order: primary → secondary → link. Link appears after the action buttons.
        </Paragraph>
        <ButtonContainer align="start">
          <Button variant="primary">Submit</Button>
          <Button variant="secondary">Cancel</Button>
          <Link href="#">Learn more</Link>
        </ButtonContainer>
      </Card>

      <Card shadow="sm">
        <Heading as="h3" size="sm" style={{
        marginBottom: "6px"
      }}>
          End — link shifts to the left
        </Heading>
        <Paragraph size="sm" color="muted" style={{
        marginBottom: "16px"
      }}>
          Same DOM order: primary → secondary → link. The end-alignment reversal pushes
          the link to the far left and the primary action to the far right.
        </Paragraph>
        <ButtonContainer align="end">
          <Button variant="primary">Save changes</Button>
          <Button variant="secondary">Discard</Button>
          <Link href="#">View documentation</Link>
        </ButtonContainer>
      </Card>

      <Card shadow="sm">
        <Heading as="h3" size="sm" style={{
        marginBottom: "6px"
      }}>
          Confirmation dialog footer
        </Heading>
        <Paragraph size="sm" color="muted" style={{
        marginBottom: "16px"
      }}>
          A common pattern: destructive primary action right, link as a low-emphasis
          escape hatch on the left.
        </Paragraph>
        <ButtonContainer align="end">
          <Button variant="destructive">Delete account</Button>
          <Button variant="secondary">Keep account</Button>
          <Link href="#">What gets deleted?</Link>
        </ButtonContainer>
      </Card>

    </div>
}`,...x.parameters?.docs?.source}}},S=[`Configurable`,`CardWidths`,`Alignment`,`WithLink`]}))();export{b as Alignment,y as CardWidths,_ as Configurable,x as WithLink,S as __namedExportsOrder,g as default};