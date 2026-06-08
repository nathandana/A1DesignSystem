import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./iframe-D8uQ9hre.js";import{n,t as r}from"./Paragraph-E9JaBz9b.js";import{n as i,t as a}from"./Inverse-BUtc9lwX.js";var o,s,c,l,u,d,f,p;e((()=>{n(),i(),o=t(),s={title:`Components/Typography/Paragraph`,component:r,tags:[`autodocs`],args:{children:`The quick brown fox jumps over the lazy dog.`,size:`md`,color:`default`},argTypes:{as:{control:`select`,options:[`p`,`span`,`div`,`li`]},size:{control:`inline-radio`,options:[`xs`,`sm`,`md`,`lg`,`xl`]},color:{control:`inline-radio`,options:[`default`,`muted`,`inverse`]},textWrap:{control:`inline-radio`,options:[`balance`,void 0]},align:{control:`inline-radio`,options:[`left`,`center`,`right`,void 0]}}},c={},l={render:()=>(0,o.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`16px`},children:[`xs`,`sm`,`md`,`lg`,`xl`].map(e=>(0,o.jsxs)(`div`,{style:{display:`flex`,alignItems:`baseline`,gap:`16px`},children:[(0,o.jsx)(`span`,{style:{width:`28px`,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`,flexShrink:0},children:e}),(0,o.jsx)(r,{size:e,children:`The quick brown fox jumps over the lazy dog.`})]},e))})},u={name:`Text wrap — balance`,render:()=>(0,o.jsxs)(`div`,{style:{display:`grid`,gap:`32px`,maxWidth:`480px`},children:[(0,o.jsxs)(`div`,{children:[(0,o.jsx)(`p`,{style:{fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`,marginBottom:`8px`},children:`Without textWrap`}),(0,o.jsx)(r,{size:`lg`,children:`A token-driven, multi-platform design system built for consistent, accessible interfaces.`})]}),(0,o.jsxs)(`div`,{children:[(0,o.jsx)(`p`,{style:{fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`,marginBottom:`8px`},children:`textWrap="balance"`}),(0,o.jsx)(r,{size:`lg`,textWrap:`balance`,children:`A token-driven, multi-platform design system built for consistent, accessible interfaces.`})]})]})},d={name:`Alignment`,render:()=>(0,o.jsx)(`div`,{style:{display:`grid`,gap:`24px`},children:[`left`,`center`,`right`].map(e=>(0,o.jsxs)(`div`,{children:[(0,o.jsxs)(`p`,{style:{fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`,marginBottom:`8px`},children:[`align="`,e,`"`]}),(0,o.jsx)(r,{align:e,children:`The quick brown fox jumps over the lazy dog.`})]},e))})},f={render:()=>(0,o.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`12px`},children:[(0,o.jsx)(r,{color:`default`,children:`Default — primary text color for body copy.`}),(0,o.jsx)(r,{color:`muted`,children:`Muted — secondary text for captions and supporting copy.`}),(0,o.jsx)(a,{style:{padding:`12px`,borderRadius:`6px`},children:(0,o.jsx)(r,{children:`Inverse surface — text color adapts automatically.`})})]})},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
  name: "Text wrap — balance",
  render: () => <div style={{
    display: "grid",
    gap: "32px",
    maxWidth: "480px"
  }}>
      <div>
        <p style={{
        fontSize: "0.75rem",
        color: "var(--semantic-color-text-muted)",
        marginBottom: "8px"
      }}>Without textWrap</p>
        <Paragraph size="lg">
          A token-driven, multi-platform design system built for consistent, accessible interfaces.
        </Paragraph>
      </div>
      <div>
        <p style={{
        fontSize: "0.75rem",
        color: "var(--semantic-color-text-muted)",
        marginBottom: "8px"
      }}>textWrap="balance"</p>
        <Paragraph size="lg" textWrap="balance">
          A token-driven, multi-platform design system built for consistent, accessible interfaces.
        </Paragraph>
      </div>
    </div>
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: "Alignment",
  render: () => <div style={{
    display: "grid",
    gap: "24px"
  }}>
      {["left", "center", "right"].map(align => <div key={align}>
          <p style={{
        fontSize: "0.75rem",
        color: "var(--semantic-color-text-muted)",
        marginBottom: "8px"
      }}>
            align="{align}"
          </p>
          <Paragraph align={align}>
            The quick brown fox jumps over the lazy dog.
          </Paragraph>
        </div>)}
    </div>
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
}`,...f.parameters?.docs?.source}}},p=[`Configurable`,`SizeScale`,`TextWrap`,`Alignment`,`Colors`]}))();export{d as Alignment,f as Colors,c as Configurable,l as SizeScale,u as TextWrap,p as __namedExportsOrder,s as default};