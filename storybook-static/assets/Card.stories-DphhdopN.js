import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./iframe-DGQSYM4W.js";import{n,t as r}from"./Button-C3mTF-_Y.js";import{n as i,t as a}from"./Card-BA8g4Js7.js";import{n as o,t as s}from"./Heading-B-e_yNFm.js";import{n as c,t as l}from"./Paragraph-BY7bSblY.js";var u,d,f,p,m,h,g;e((()=>{i(),n(),o(),c(),u=t(),d={title:`Components/Containers/Card`,component:a,tags:[`autodocs`],args:{shadow:`sm`,icon:void 0},argTypes:{as:{control:`select`,options:[`div`,`article`,`section`]},icon:{control:`text`,description:`Material Symbols icon name (e.g. "star", "bolt", "shield")`},shadow:{control:`inline-radio`,options:[`none`,`xs`,`sm`,`md`,`lg`,`xl`]}},render:({shadow:e,icon:t})=>(0,u.jsxs)(a,{shadow:e,icon:t,style:{width:320},children:[(0,u.jsx)(s,{as:`h3`,size:`sm`,style:{marginBottom:`8px`},children:`Card title`}),(0,u.jsx)(l,{color:`muted`,children:`Supporting text describing the card content.`})]})},f={},p={name:`With Icon`,render:()=>(0,u.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`24px`},children:[(0,u.jsxs)(a,{shadow:`sm`,icon:`bolt`,style:{width:280},children:[(0,u.jsx)(s,{as:`h3`,size:`sm`,style:{marginBottom:`8px`},children:`Performance`}),(0,u.jsx)(l,{color:`muted`,children:`Built for speed with optimised rendering throughout.`})]}),(0,u.jsxs)(a,{shadow:`sm`,icon:`shield`,style:{width:280},children:[(0,u.jsx)(s,{as:`h3`,size:`sm`,style:{marginBottom:`8px`},children:`Security`}),(0,u.jsx)(l,{color:`muted`,children:`Enterprise-grade security baked in from the ground up.`})]}),(0,u.jsxs)(a,{shadow:`sm`,icon:`star`,style:{width:280},children:[(0,u.jsx)(s,{as:`h3`,size:`sm`,style:{marginBottom:`8px`},children:`Quality`}),(0,u.jsx)(l,{color:`muted`,children:`Every token and component reviewed against design standards.`})]})]})},m={render:()=>(0,u.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`24px`,padding:`32px`,background:`var(--semantic-color-surface-page)`},children:[`none`,`xs`,`sm`,`md`,`lg`,`xl`].map(e=>(0,u.jsxs)(a,{shadow:e,style:{width:160},children:[(0,u.jsx)(s,{as:`h4`,size:`xs`,style:{marginBottom:`4px`},children:e}),(0,u.jsxs)(l,{size:`xs`,color:`muted`,children:[`shadow="`,e,`"`]})]},e))})},h={render:()=>(0,u.jsxs)(a,{shadow:`sm`,icon:`check_circle`,style:{width:320},children:[(0,u.jsx)(s,{as:`h3`,size:`sm`,style:{marginBottom:`8px`},children:`Confirm action`}),(0,u.jsx)(l,{color:`muted`,style:{marginBottom:`20px`},children:`Cards can contain any content including action buttons.`}),(0,u.jsxs)(`div`,{style:{display:`flex`,gap:`8px`},children:[(0,u.jsx)(r,{variant:`primary`,icon:`check`,iconPosition:`start`,children:`Confirm`}),(0,u.jsx)(r,{variant:`secondary`,children:`Cancel`})]})]})},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: "With Icon",
  render: () => <div style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "24px"
  }}>
      <Card shadow="sm" icon="bolt" style={{
      width: 280
    }}>
        <Heading as="h3" size="sm" style={{
        marginBottom: "8px"
      }}>Performance</Heading>
        <Paragraph color="muted">Built for speed with optimised rendering throughout.</Paragraph>
      </Card>
      <Card shadow="sm" icon="shield" style={{
      width: 280
    }}>
        <Heading as="h3" size="sm" style={{
        marginBottom: "8px"
      }}>Security</Heading>
        <Paragraph color="muted">Enterprise-grade security baked in from the ground up.</Paragraph>
      </Card>
      <Card shadow="sm" icon="star" style={{
      width: 280
    }}>
        <Heading as="h3" size="sm" style={{
        marginBottom: "8px"
      }}>Quality</Heading>
        <Paragraph color="muted">Every token and component reviewed against design standards.</Paragraph>
      </Card>
    </div>
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "24px",
    padding: "32px",
    background: "var(--semantic-color-surface-page)"
  }}>
      {["none", "xs", "sm", "md", "lg", "xl"].map(shadow => <Card key={shadow} shadow={shadow} style={{
      width: 160
    }}>
          <Heading as="h4" size="xs" style={{
        marginBottom: "4px"
      }}>{shadow}</Heading>
          <Paragraph size="xs" color="muted">shadow="{shadow}"</Paragraph>
        </Card>)}
    </div>
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <Card shadow="sm" icon="check_circle" style={{
    width: 320
  }}>
      <Heading as="h3" size="sm" style={{
      marginBottom: "8px"
    }}>Confirm action</Heading>
      <Paragraph color="muted" style={{
      marginBottom: "20px"
    }}>
        Cards can contain any content including action buttons.
      </Paragraph>
      <div style={{
      display: "flex",
      gap: "8px"
    }}>
        <Button variant="primary" icon="check" iconPosition="start">Confirm</Button>
        <Button variant="secondary">Cancel</Button>
      </div>
    </Card>
}`,...h.parameters?.docs?.source}}},g=[`Configurable`,`WithIcon`,`ShadowScale`,`WithActions`]}))();export{f as Configurable,m as ShadowScale,h as WithActions,p as WithIcon,g as __namedExportsOrder,d as default};