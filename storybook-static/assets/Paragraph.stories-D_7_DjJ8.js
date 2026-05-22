import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./jsx-runtime-Cul_R1t-.js";import{n,t as r}from"./Paragraph-CrZbx1QP.js";import{n as i,t as a}from"./Inverse-BFIesrX7.js";var o,s,c,l,u,d;e((()=>{n(),i(),o=t(),s={title:`Foundations/Typography/Paragraph`,component:r,tags:[`autodocs`],args:{children:`The quick brown fox jumps over the lazy dog.`,size:`md`,color:`default`},argTypes:{as:{control:`select`,options:[`p`,`span`,`div`,`li`]},size:{control:`inline-radio`,options:[`xs`,`sm`,`md`,`lg`,`xl`]},color:{control:`inline-radio`,options:[`default`,`muted`,`inverse`]}}},c={},l={render:()=>(0,o.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`16px`},children:[`xs`,`sm`,`md`,`lg`,`xl`].map(e=>(0,o.jsxs)(`div`,{style:{display:`flex`,alignItems:`baseline`,gap:`16px`},children:[(0,o.jsx)(`span`,{style:{width:`28px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`,flexShrink:0},children:e}),(0,o.jsx)(r,{size:e,children:`The quick brown fox jumps over the lazy dog.`})]},e))})},u={render:()=>(0,o.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`12px`},children:[(0,o.jsx)(r,{color:`default`,children:`Default — primary text color for body copy.`}),(0,o.jsx)(r,{color:`muted`,children:`Muted — secondary text for captions and supporting copy.`}),(0,o.jsx)(a,{style:{padding:`12px`,borderRadius:`6px`},children:(0,o.jsx)(r,{children:`Inverse surface — text color adapts automatically.`})})]})},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  }}>
      {["xs", "sm", "md", "lg", "xl"].map(size => <div key={size} style={{
      display: "flex",
      alignItems: "baseline",
      gap: "16px"
    }}>
          <span style={{
        width: "28px",
        fontSize: "0.75rem",
        color: "var(--semantic-color-text-muted)",
        flexShrink: 0
      }}>
            {size}
          </span>
          <Paragraph size={size}>
            The quick brown fox jumps over the lazy dog.
          </Paragraph>
        </div>)}
    </div>
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  }}>
      <Paragraph color="default">Default — primary text color for body copy.</Paragraph>
      <Paragraph color="muted">Muted — secondary text for captions and supporting copy.</Paragraph>
      <Inverse style={{
      padding: "12px",
      borderRadius: "6px"
    }}>
        <Paragraph>Inverse surface — text color adapts automatically.</Paragraph>
      </Inverse>
    </div>
}`,...u.parameters?.docs?.source}}},d=[`Configurable`,`SizeScale`,`Colors`]}))();export{u as Colors,c as Configurable,l as SizeScale,d as __namedExportsOrder,s as default};