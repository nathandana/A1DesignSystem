import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./iframe-D1JN-_Xq.js";import{n,t as r}from"./Button-Drjb0R59.js";import{n as i,t as a}from"./Card-agHV441k.js";import{n as o,t as s}from"./Heading-ouMjY5HL.js";import{i as c,t as l}from"./Message-DvE45yqB.js";import{n as u,t as d}from"./Paragraph-CrxcTh6-.js";import{n as f,t as p}from"./Section-Cwyx_54C.js";import{n as m,t as h}from"./Inverse-rhcxkKPx.js";function g(){return(0,_.jsxs)(_.Fragment,{children:[(0,_.jsx)(s,{as:`h3`,size:`sm`,style:{marginBottom:`var(--base-spacing-8)`},children:`Surface heading`}),(0,_.jsx)(d,{size:`sm`,color:`muted`,style:{marginBottom:`var(--base-spacing-16)`},children:`Text, borders, and component colors all adapt to whichever color scheme is active on this surface.`}),(0,_.jsxs)(`div`,{style:{display:`flex`,gap:`var(--base-spacing-8)`,flexWrap:`wrap`},children:[(0,_.jsx)(r,{variant:`primary`,children:`Primary`}),(0,_.jsx)(r,{variant:`secondary`,children:`Secondary`}),(0,_.jsx)(r,{variant:`tertiary`,children:`Tertiary`})]})]})}var _,v,y,b,x,S;e((()=>{m(),f(),o(),u(),n(),i(),c(),_=t(),v={title:`Components/Containers/Inverse`,component:h,tags:[`autodocs`],parameters:{layout:`padded`},argTypes:{as:{control:`text`}}},y={name:`Inverse card`,render:()=>(0,_.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-24)`},children:[(0,_.jsxs)(d,{size:`sm`,color:`muted`,children:[`The card below uses `,(0,_.jsx)(`code`,{children:`as="article"`}),` so it renders semantic markup while applying the inverse color set.`]}),(0,_.jsx)(a,{shadow:`lg`,children:(0,_.jsxs)(h,{as:`article`,style:{padding:`var(--base-spacing-32)`},children:[(0,_.jsx)(l,{status:`info`,children:`Highlighted`}),(0,_.jsx)(s,{as:`h2`,size:`md`,style:{margin:`var(--base-spacing-12) 0 var(--base-spacing-8)`},children:`Featured announcement`}),(0,_.jsx)(d,{style:{marginBottom:`var(--base-spacing-20)`},children:`This entire card interior renders in the opposite color scheme from the surrounding page — dark in light mode, light in dark mode.`}),(0,_.jsx)(r,{variant:`primary`,icon:`arrow_forward`,iconPosition:`end`,children:`Learn more`})]})})]})},b={name:`Nested inverse`,render:()=>(0,_.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-4)`},children:[(0,_.jsxs)(`div`,{style:{padding:`var(--base-spacing-32)`,background:`var(--semantic-color-surface-page)`,border:`1px solid var(--semantic-color-border-subtle)`,borderRadius:`var(--base-radius-lg) var(--base-radius-lg) 0 0`},children:[(0,_.jsx)(d,{size:`xs`,color:`muted`,style:{marginBottom:`var(--base-spacing-4)`},children:`Current theme surface`}),(0,_.jsx)(g,{})]}),(0,_.jsxs)(h,{style:{padding:`var(--base-spacing-32)`,display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-4)`},children:[(0,_.jsx)(d,{size:`xs`,color:`muted`,style:{marginBottom:`var(--base-spacing-4)`},children:`Inverse surface`}),(0,_.jsx)(g,{}),(0,_.jsxs)(h,{style:{padding:`var(--base-spacing-32)`,marginTop:`var(--base-spacing-16)`,borderRadius:`var(--base-radius-md)`},children:[(0,_.jsx)(d,{size:`xs`,color:`muted`,style:{marginBottom:`var(--base-spacing-4)`},children:`Double-inverse (original scheme)`}),(0,_.jsx)(g,{})]})]})]})},x={name:`Inverse vs Section`,parameters:{layout:`fullscreen`},render:()=>(0,_.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-4)`},children:[(0,_.jsxs)(`div`,{style:{padding:`var(--base-spacing-8) var(--base-spacing-16)`,background:`var(--semantic-color-surface-raised)`,fontSize:12,color:`var(--semantic-color-text-muted)`},children:[`Use `,(0,_.jsx)(`strong`,{children:`Section inverse`}),` for full-width page bands ↓`]}),(0,_.jsxs)(p,{padding:`md`,inverse:!0,children:[(0,_.jsx)(s,{as:`h2`,size:`lg`,style:{marginBottom:`var(--base-spacing-8)`},children:`Section — full-width band`}),(0,_.jsxs)(d,{color:`muted`,children:[(0,_.jsx)(`code`,{children:`<Section padding="md" inverse>`}),` — handles padding, width, and color-scheme in one component. Use for hero sections, CTAs, and page-level bands.`]})]}),(0,_.jsxs)(`div`,{style:{padding:`var(--base-spacing-8) var(--base-spacing-16)`,background:`var(--semantic-color-surface-raised)`,fontSize:12,color:`var(--semantic-color-text-muted)`},children:[`Use `,(0,_.jsx)(`strong`,{children:`Inverse`}),` for inline elements within a surface ↓`]}),(0,_.jsx)(`div`,{style:{padding:`var(--base-spacing-32)`},children:(0,_.jsx)(a,{shadow:`md`,children:(0,_.jsxs)(h,{as:`article`,style:{padding:`var(--base-spacing-24)`},children:[(0,_.jsx)(s,{as:`h3`,size:`sm`,style:{marginBottom:`var(--base-spacing-8)`},children:`Inverse — inline element`}),(0,_.jsxs)(d,{size:`sm`,color:`muted`,children:[(0,_.jsx)(`code`,{children:`<Inverse as="article">`}),` — flips the color scheme on a contained element without touching padding or width. Use inside cards, callouts, or modals.`]})]})})})]})},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
        padding: "var(--base-spacing-32)"
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
}`,...y.parameters?.docs?.source},description:{story:"Use the `Section` component (`Components/Containers/Section`) for full-width page bands.\n`Inverse` is best suited for inline elements: cards, articles, or any contained region\nwithin a larger surface that should flip its color scheme.",...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: "Nested inverse",
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-4)"
  }}>

      <div style={{
      padding: "var(--base-spacing-32)",
      background: "var(--semantic-color-surface-page)",
      border: "1px solid var(--semantic-color-border-subtle)",
      borderRadius: "var(--base-radius-lg) var(--base-radius-lg) 0 0"
    }}>
        <Paragraph size="xs" color="muted" style={{
        marginBottom: "var(--base-spacing-4)"
      }}>Current theme surface</Paragraph>
        <SampleContent />
      </div>

      <Inverse style={{
      padding: "var(--base-spacing-32)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--base-spacing-4)"
    }}>
        <Paragraph size="xs" color="muted" style={{
        marginBottom: "var(--base-spacing-4)"
      }}>Inverse surface</Paragraph>
        <SampleContent />

        <Inverse style={{
        padding: "var(--base-spacing-32)",
        marginTop: "var(--base-spacing-16)",
        borderRadius: "var(--base-radius-md)"
      }}>
          <Paragraph size="xs" color="muted" style={{
          marginBottom: "var(--base-spacing-4)"
        }}>Double-inverse (original scheme)</Paragraph>
          <SampleContent />
        </Inverse>
      </Inverse>

    </div>
}`,...b.parameters?.docs?.source},description:{story:"Inverse sections nest: a second `Inverse` inside the first flips back to the original\nscheme. This works at any depth and across any theme.",...b.parameters?.docs?.description}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: "Inverse vs Section",
  parameters: {
    layout: "fullscreen"
  },
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-4)"
  }}>
      <div style={{
      padding: "var(--base-spacing-8) var(--base-spacing-16)",
      background: "var(--semantic-color-surface-raised)",
      fontSize: 12,
      color: "var(--semantic-color-text-muted)"
    }}>
        Use <strong>Section inverse</strong> for full-width page bands ↓
      </div>
      <Section padding="md" inverse>
        <Heading as="h2" size="lg" style={{
        marginBottom: "var(--base-spacing-8)"
      }}>Section — full-width band</Heading>
        <Paragraph color="muted">
          <code>{'<Section padding="md" inverse>'}</code> — handles padding, width, and color-scheme in one component.
          Use for hero sections, CTAs, and page-level bands.
        </Paragraph>
      </Section>

      <div style={{
      padding: "var(--base-spacing-8) var(--base-spacing-16)",
      background: "var(--semantic-color-surface-raised)",
      fontSize: 12,
      color: "var(--semantic-color-text-muted)"
    }}>
        Use <strong>Inverse</strong> for inline elements within a surface ↓
      </div>
      <div style={{
      padding: "var(--base-spacing-32)"
    }}>
        <Card shadow="md">
          <Inverse as="article" style={{
          padding: "var(--base-spacing-24)"
        }}>
            <Heading as="h3" size="sm" style={{
            marginBottom: "var(--base-spacing-8)"
          }}>Inverse — inline element</Heading>
            <Paragraph size="sm" color="muted">
              <code>{'<Inverse as="article">'}</code> — flips the color scheme on a contained element
              without touching padding or width. Use inside cards, callouts, or modals.
            </Paragraph>
          </Inverse>
        </Card>
      </div>
    </div>
}`,...x.parameters?.docs?.source},description:{story:"For full-width page bands and hero sections, prefer `Section` with `inverse` prop.\nThis story shows both side by side to illustrate the relationship.",...x.parameters?.docs?.description}}},S=[`InCard`,`NestedInverse`,`VsSection`]}))();export{y as InCard,b as NestedInverse,x as VsSection,S as __namedExportsOrder,v as default};