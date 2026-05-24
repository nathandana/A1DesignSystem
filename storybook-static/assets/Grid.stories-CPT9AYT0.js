import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./iframe-BeAWTq30.js";import{n,t as r}from"./Card-O6GlBPB8.js";import{n as i,t as a}from"./Heading-ChaijyaD.js";import{i as o,t as s}from"./Message-Bxlp4BtS.js";import{n as c,t as l}from"./Paragraph-l5EsZ55n.js";import{n as u,r as d,t as f}from"./Grid-TiS3xJJR.js";import{n as p,t as m}from"./Stack-D6DiMfta.js";function h({label:e,height:t=64}){return(0,v.jsx)(`div`,{style:{height:t,display:`flex`,alignItems:`center`,justifyContent:`center`,background:`var(--semantic-color-action-surface)`,border:`1px solid var(--semantic-color-action-border)`,borderRadius:`var(--base-radius-control)`},children:(0,v.jsx)(l,{size:`xs`,style:{fontWeight:`var(--base-font-weight-semibold)`,color:`var(--semantic-color-action-background)`},children:e})})}function g({children:e}){return(0,v.jsx)(l,{size:`xs`,color:`muted`,style:{marginBottom:`var(--base-spacing-8)`},children:e})}function _({badge:e,title:t,body:n,tone:i=`neutral`}){return(0,v.jsx)(r,{shadow:`xs`,style:{height:`100%`,background:i===`accent`?`var(--semantic-color-action-surface)`:`var(--semantic-color-surface-panel)`},children:(0,v.jsxs)(m,{gap:12,style:{height:`100%`},children:[(0,v.jsx)(s,{subtle:!0,status:i===`accent`?`info`:`neutral`,children:e}),(0,v.jsx)(a,{as:`h3`,size:`sm`,children:t}),(0,v.jsx)(l,{size:`sm`,color:`muted`,children:n})]})})}var v,y,b,x,S,C,w,T,E;e((()=>{d(),n(),i(),o(),c(),p(),v=t(),y={title:`Components/Containers/Grid`,component:f,tags:[`autodocs`],parameters:{layout:`padded`},argTypes:{columns:{control:`number`},gap:{control:`select`,options:[`sm`,`md`,`lg`]},layout:{control:`select`,options:[`default`,`bento`]}}},b={args:{columns:3,gap:`md`},render:({columns:e,gap:t})=>(0,v.jsx)(f,{columns:e,gap:t,children:Array.from({length:e*2},(e,t)=>(0,v.jsx)(h,{label:`Item ${t+1}`},t))})},x={name:`Column Counts`,render:()=>(0,v.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-32)`},children:[1,2,3,4,6,12].map(e=>(0,v.jsxs)(`div`,{children:[(0,v.jsxs)(g,{children:[`columns=`,e]}),(0,v.jsx)(f,{columns:e,gap:`sm`,children:Array.from({length:e},(e,t)=>(0,v.jsx)(h,{label:String(t+1),height:48},t))})]},e))})},S={name:`Span Items`,render:()=>(0,v.jsxs)(`div`,{children:[(0,v.jsx)(a,{as:`h2`,size:`xs`,style:{marginBottom:`var(--base-spacing-16)`},children:`12-column grid with varying spans`}),(0,v.jsxs)(f,{columns:12,gap:`sm`,children:[(0,v.jsx)(u,{span:12,children:(0,v.jsx)(h,{label:`span 12`})}),(0,v.jsx)(u,{span:6,children:(0,v.jsx)(h,{label:`span 6`})}),(0,v.jsx)(u,{span:6,children:(0,v.jsx)(h,{label:`span 6`})}),(0,v.jsx)(u,{span:4,children:(0,v.jsx)(h,{label:`span 4`})}),(0,v.jsx)(u,{span:4,children:(0,v.jsx)(h,{label:`span 4`})}),(0,v.jsx)(u,{span:4,children:(0,v.jsx)(h,{label:`span 4`})}),(0,v.jsx)(u,{span:3,children:(0,v.jsx)(h,{label:`span 3`})}),(0,v.jsx)(u,{span:3,children:(0,v.jsx)(h,{label:`span 3`})}),(0,v.jsx)(u,{span:3,children:(0,v.jsx)(h,{label:`span 3`})}),(0,v.jsx)(u,{span:3,children:(0,v.jsx)(h,{label:`span 3`})}),(0,v.jsx)(u,{span:`full`,children:(0,v.jsx)(h,{label:`span="full"`})})]})]})},C={name:`Responsive Columns`,render:()=>(0,v.jsxs)(`div`,{children:[(0,v.jsx)(a,{as:`h2`,size:`xs`,style:{marginBottom:`var(--base-spacing-4)`},children:`Responsive columns`}),(0,v.jsx)(l,{size:`sm`,color:`muted`,style:{marginBottom:`var(--base-spacing-16)`},children:`xs:1 → sm:2 → md:3 → lg:4. Resize the preview to see it change.`}),(0,v.jsx)(f,{columns:{xs:1,sm:2,md:3,lg:4},gap:`md`,children:Array.from({length:8},(e,t)=>(0,v.jsx)(h,{label:`Item ${t+1}`,height:80},t))})]})},w={name:`Gap Scale`,render:()=>(0,v.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-40)`},children:[`sm`,`md`,`lg`].map(e=>(0,v.jsxs)(`div`,{children:[(0,v.jsxs)(g,{children:[`gap=`,e]}),(0,v.jsx)(f,{columns:4,gap:e,children:Array.from({length:4},(e,t)=>(0,v.jsx)(h,{label:String(t+1),height:48},t))})]},e))})},T={name:`Bento grid`,render:()=>(0,v.jsxs)(`div`,{children:[(0,v.jsx)(a,{as:`h2`,size:`xs`,style:{marginBottom:`var(--base-spacing-4)`},children:`Bento grid`}),(0,v.jsx)(l,{size:`sm`,color:`muted`,style:{marginBottom:`var(--base-spacing-16)`},children:`Use layout="bento" with responsive column and row spans for editorial dashboards, feature summaries, or mixed-density landing sections.`}),(0,v.jsxs)(f,{layout:`bento`,columns:{xs:1,md:6,lg:12},gap:`md`,autoRows:`minmax(120px, auto)`,children:[(0,v.jsx)(u,{span:{xs:1,md:6,lg:6},rowSpan:{xs:1,md:2},children:(0,v.jsx)(_,{badge:`Overview`,title:`Primary feature area`,body:`A larger tile can hold summary content, metrics, or a preview without leaving the grid system.`,tone:`accent`})}),(0,v.jsx)(u,{span:{xs:1,md:3,lg:3},children:(0,v.jsx)(_,{badge:`Status`,title:`Compact tile`,body:`Short cards stay aligned with the same row rhythm.`})}),(0,v.jsx)(u,{span:{xs:1,md:3,lg:3},children:(0,v.jsx)(_,{badge:`Activity`,title:`Secondary tile`,body:`Dense placement fills open cells as content varies.`})}),(0,v.jsx)(u,{span:{xs:1,md:3,lg:4},children:(0,v.jsx)(_,{badge:`Insight`,title:`Wide supporting tile`,body:`Use medium spans to create visual variety without custom CSS.`})}),(0,v.jsx)(u,{span:{xs:1,md:3,lg:4},children:(0,v.jsx)(_,{badge:`Workflow`,title:`Balanced tile`,body:`Responsive spans keep the pattern usable on smaller screens.`})}),(0,v.jsx)(u,{span:{xs:1,md:6,lg:4},children:(0,v.jsx)(_,{badge:`Detail`,title:`Full-width mobile`,body:`Each item collapses to one column on xs viewports.`})})]})]})},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    columns: 3,
    gap: "md"
  },
  render: ({
    columns,
    gap
  }) => <Grid columns={columns} gap={gap}>
      {Array.from({
      length: columns * 2
    }, (_, i) => <Cell key={i} label={\`Item \${i + 1}\`} />)}
    </Grid>
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: "Column Counts",
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-32)"
  }}>
      {[1, 2, 3, 4, 6, 12].map(cols => <div key={cols}>
          <Label>columns={cols}</Label>
          <Grid columns={cols} gap="sm">
            {Array.from({
          length: cols
        }, (_, i) => <Cell key={i} label={String(i + 1)} height={48} />)}
          </Grid>
        </div>)}
    </div>
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  name: "Span Items",
  render: () => <div>
      <Heading as="h2" size="xs" style={{
      marginBottom: "var(--base-spacing-16)"
    }}>
        12-column grid with varying spans
      </Heading>
      <Grid columns={12} gap="sm">
        <GridItem span={12}><Cell label="span 12" /></GridItem>
        <GridItem span={6}><Cell label="span 6" /></GridItem>
        <GridItem span={6}><Cell label="span 6" /></GridItem>
        <GridItem span={4}><Cell label="span 4" /></GridItem>
        <GridItem span={4}><Cell label="span 4" /></GridItem>
        <GridItem span={4}><Cell label="span 4" /></GridItem>
        <GridItem span={3}><Cell label="span 3" /></GridItem>
        <GridItem span={3}><Cell label="span 3" /></GridItem>
        <GridItem span={3}><Cell label="span 3" /></GridItem>
        <GridItem span={3}><Cell label="span 3" /></GridItem>
        <GridItem span="full"><Cell label='span="full"' /></GridItem>
      </Grid>
    </div>
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  name: "Responsive Columns",
  render: () => <div>
      <Heading as="h2" size="xs" style={{
      marginBottom: "var(--base-spacing-4)"
    }}>
        Responsive columns
      </Heading>
      <Paragraph size="sm" color="muted" style={{
      marginBottom: "var(--base-spacing-16)"
    }}>
        xs:1 → sm:2 → md:3 → lg:4. Resize the preview to see it change.
      </Paragraph>
      <Grid columns={{
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4
    }} gap="md">
        {Array.from({
        length: 8
      }, (_, i) => <Cell key={i} label={\`Item \${i + 1}\`} height={80} />)}
      </Grid>
    </div>
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  name: "Gap Scale",
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-40)"
  }}>
      {["sm", "md", "lg"].map(g => <div key={g}>
          <Label>gap={g}</Label>
          <Grid columns={4} gap={g}>
            {Array.from({
          length: 4
        }, (_, i) => <Cell key={i} label={String(i + 1)} height={48} />)}
          </Grid>
        </div>)}
    </div>
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  name: "Bento grid",
  render: () => <div>
      <Heading as="h2" size="xs" style={{
      marginBottom: "var(--base-spacing-4)"
    }}>
        Bento grid
      </Heading>
      <Paragraph size="sm" color="muted" style={{
      marginBottom: "var(--base-spacing-16)"
    }}>
        Use layout="bento" with responsive column and row spans for editorial dashboards,
        feature summaries, or mixed-density landing sections.
      </Paragraph>
      <Grid layout="bento" columns={{
      xs: 1,
      md: 6,
      lg: 12
    }} gap="md" autoRows="minmax(120px, auto)">
        <GridItem span={{
        xs: 1,
        md: 6,
        lg: 6
      }} rowSpan={{
        xs: 1,
        md: 2
      }}>
          <BentoCard badge="Overview" title="Primary feature area" body="A larger tile can hold summary content, metrics, or a preview without leaving the grid system." tone="accent" />
        </GridItem>
        <GridItem span={{
        xs: 1,
        md: 3,
        lg: 3
      }}>
          <BentoCard badge="Status" title="Compact tile" body="Short cards stay aligned with the same row rhythm." />
        </GridItem>
        <GridItem span={{
        xs: 1,
        md: 3,
        lg: 3
      }}>
          <BentoCard badge="Activity" title="Secondary tile" body="Dense placement fills open cells as content varies." />
        </GridItem>
        <GridItem span={{
        xs: 1,
        md: 3,
        lg: 4
      }}>
          <BentoCard badge="Insight" title="Wide supporting tile" body="Use medium spans to create visual variety without custom CSS." />
        </GridItem>
        <GridItem span={{
        xs: 1,
        md: 3,
        lg: 4
      }}>
          <BentoCard badge="Workflow" title="Balanced tile" body="Responsive spans keep the pattern usable on smaller screens." />
        </GridItem>
        <GridItem span={{
        xs: 1,
        md: 6,
        lg: 4
      }}>
          <BentoCard badge="Detail" title="Full-width mobile" body="Each item collapses to one column on xs viewports." />
        </GridItem>
      </Grid>
    </div>
}`,...T.parameters?.docs?.source}}},E=[`Configurable`,`ColumnCounts`,`SpanItems`,`Responsive`,`GapScale`,`BentoGrid`]}))();export{T as BentoGrid,x as ColumnCounts,b as Configurable,w as GapScale,C as Responsive,S as SpanItems,E as __namedExportsOrder,y as default};