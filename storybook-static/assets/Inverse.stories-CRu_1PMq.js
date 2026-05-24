import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./iframe-DGQSYM4W.js";import{n,t as r}from"./Button-C3mTF-_Y.js";import{n as i,t as a}from"./Card-BA8g4Js7.js";import{n as o,t as s}from"./Heading-B-e_yNFm.js";import{n as c,t as l}from"./Paragraph-BY7bSblY.js";import{n as u,t as d}from"./Inverse-D6_vUi9b.js";import{i as f,t as p}from"./Message-CPsn3YgN.js";function m({children:e}){return(0,g.jsx)(l,{size:`xs`,color:`muted`,style:{marginBottom:`var(--base-spacing-4)`},children:e})}function h(){return(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(s,{as:`h3`,size:`sm`,style:{marginBottom:`var(--base-spacing-8)`},children:`Surface heading`}),(0,g.jsx)(l,{size:`sm`,color:`muted`,style:{marginBottom:`var(--base-spacing-16)`},children:`Text, borders, and component colors all adapt to whichever color scheme is active on this surface.`}),(0,g.jsxs)(`div`,{style:{display:`flex`,gap:`var(--base-spacing-8)`,flexWrap:`wrap`},children:[(0,g.jsx)(r,{variant:`primary`,children:`Primary`}),(0,g.jsx)(r,{variant:`secondary`,children:`Secondary`}),(0,g.jsx)(r,{variant:`tertiary`,children:`Tertiary`})]})]})}var g,_,v,y,b,x,S;e((()=>{u(),o(),c(),n(),i(),f(),g=t(),_={title:`Components/Containers/Inverse`,component:d,tags:[`autodocs`],parameters:{layout:`padded`},argTypes:{as:{control:`text`}}},v=`var(--base-spacing-32)`,y={name:`Inverse section`,render:()=>(0,g.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-4)`},children:[(0,g.jsxs)(`div`,{style:{padding:v,background:`var(--semantic-color-surface-page)`,border:`1px solid var(--semantic-color-border-subtle)`,borderRadius:`var(--base-radius-lg) var(--base-radius-lg) 0 0`},children:[(0,g.jsx)(m,{children:`Current theme surface`}),(0,g.jsx)(h,{})]}),(0,g.jsxs)(d,{style:{padding:v,borderRadius:`0 0 var(--base-radius-lg) var(--base-radius-lg)`},children:[(0,g.jsx)(m,{children:`Inverse surface`}),(0,g.jsx)(h,{})]})]})},b={name:`Inverse card`,render:()=>(0,g.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-24)`},children:[(0,g.jsxs)(l,{size:`sm`,color:`muted`,children:[`The card below uses `,(0,g.jsx)(`code`,{children:`as="article"`}),` so it renders semantic markup while applying the inverse color set.`]}),(0,g.jsx)(a,{shadow:`lg`,children:(0,g.jsxs)(d,{as:`article`,style:{padding:v},children:[(0,g.jsx)(p,{status:`info`,children:`Highlighted`}),(0,g.jsx)(s,{as:`h2`,size:`md`,style:{margin:`var(--base-spacing-12) 0 var(--base-spacing-8)`},children:`Featured announcement`}),(0,g.jsx)(l,{style:{marginBottom:`var(--base-spacing-20)`},children:`This entire card interior renders in the opposite color scheme from the surrounding page — dark in light mode, light in dark mode.`}),(0,g.jsx)(r,{variant:`primary`,icon:`arrow_forward`,iconPosition:`end`,children:`Learn more`})]})})]})},x={name:`Nested inverse`,render:()=>(0,g.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-4)`},children:[(0,g.jsxs)(`div`,{style:{padding:v,background:`var(--semantic-color-surface-page)`,border:`1px solid var(--semantic-color-border-subtle)`,borderRadius:`var(--base-radius-lg) var(--base-radius-lg) 0 0`},children:[(0,g.jsx)(m,{children:`Current theme surface`}),(0,g.jsx)(h,{})]}),(0,g.jsxs)(d,{style:{padding:v,display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-4)`},children:[(0,g.jsx)(m,{children:`Inverse surface`}),(0,g.jsx)(h,{}),(0,g.jsxs)(d,{style:{padding:v,marginTop:`var(--base-spacing-16)`,borderRadius:`var(--base-radius-md)`},children:[(0,g.jsx)(m,{children:`Double-inverse (original scheme)`}),(0,g.jsx)(h,{})]})]})]})},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: "Inverse section",
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-4)"
  }}>

      {/* Ambient surface (follows the active theme) */}
      <div style={{
      padding,
      background: "var(--semantic-color-surface-page)",
      border: "1px solid var(--semantic-color-border-subtle)",
      borderRadius: "var(--base-radius-lg) var(--base-radius-lg) 0 0"
    }}>
        <SurfaceLabel>Current theme surface</SurfaceLabel>
        <SampleContent />
      </div>

      {/* Inverse section */}
      <Inverse style={{
      padding,
      borderRadius: "0 0 var(--base-radius-lg) var(--base-radius-lg)"
    }}>
        <SurfaceLabel>Inverse surface</SurfaceLabel>
        <SampleContent />
      </Inverse>

    </div>
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: "Inverse card",
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-24)"
  }}>
      <Paragraph size="sm" color="muted">
        The card below uses <code>as="article"</code> so it renders semantic markup
        while applying the inverse color set.
      </Paragraph>

      <Card shadow="lg">
        <Inverse as="article" style={{
        padding
      }}>
          <MessageBadge status="info">Highlighted</MessageBadge>
          <Heading as="h2" size="md" style={{
          margin: "var(--base-spacing-12) 0 var(--base-spacing-8)"
        }}>
            Featured announcement
          </Heading>
          <Paragraph style={{
          marginBottom: "var(--base-spacing-20)"
        }}>
            This entire card interior renders in the opposite color scheme from the
            surrounding page — dark in light mode, light in dark mode.
          </Paragraph>
          <Button variant="primary" icon="arrow_forward" iconPosition="end">
            Learn more
          </Button>
        </Inverse>
      </Card>
    </div>
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: "Nested inverse",
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-4)"
  }}>

      <div style={{
      padding,
      background: "var(--semantic-color-surface-page)",
      border: "1px solid var(--semantic-color-border-subtle)",
      borderRadius: "var(--base-radius-lg) var(--base-radius-lg) 0 0"
    }}>
        <SurfaceLabel>Current theme surface</SurfaceLabel>
        <SampleContent />
      </div>

      <Inverse style={{
      padding,
      display: "flex",
      flexDirection: "column",
      gap: "var(--base-spacing-4)"
    }}>
        <SurfaceLabel>Inverse surface</SurfaceLabel>
        <SampleContent />

        {/* Second inverse: back to original scheme */}
        <Inverse style={{
        padding,
        marginTop: "var(--base-spacing-16)",
        borderRadius: "var(--base-radius-md)"
      }}>
          <SurfaceLabel>Double-inverse (original scheme)</SurfaceLabel>
          <SampleContent />
        </Inverse>
      </Inverse>

    </div>
}`,...x.parameters?.docs?.source}}},S=[`Default`,`InCard`,`NestedInverse`]}))();export{y as Default,b as InCard,x as NestedInverse,S as __namedExportsOrder,_ as default};