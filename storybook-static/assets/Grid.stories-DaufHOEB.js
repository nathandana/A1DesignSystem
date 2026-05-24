import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./iframe-D1JN-_Xq.js";import{n,t as r}from"./Heading-ouMjY5HL.js";import{n as i,t as a}from"./Paragraph-CrxcTh6-.js";import{n as o,r as s,t as c}from"./Grid-LaNJzKBm.js";function l({label:e,height:t=64}){return(0,d.jsx)(`div`,{style:{height:t,display:`flex`,alignItems:`center`,justifyContent:`center`,background:`var(--semantic-color-action-surface)`,border:`1px solid var(--semantic-color-action-border)`,borderRadius:`var(--base-radius-control)`},children:(0,d.jsx)(a,{size:`xs`,style:{fontWeight:`var(--base-font-weight-semibold)`,color:`var(--semantic-color-action-background)`},children:e})})}function u({children:e}){return(0,d.jsx)(a,{size:`xs`,color:`muted`,style:{marginBottom:`var(--base-spacing-8)`},children:e})}var d,f,p,m,h,g,_,v;e((()=>{s(),n(),i(),d=t(),f={title:`Components/Containers/Grid`,component:c,tags:[`autodocs`],parameters:{layout:`padded`},argTypes:{columns:{control:`number`},gap:{control:`select`,options:[4,8,12,16,20,24,32]}}},p={args:{columns:3,gap:16},render:({columns:e,gap:t})=>(0,d.jsx)(c,{columns:e,gap:t,children:Array.from({length:e*2},(e,t)=>(0,d.jsx)(l,{label:`Item ${t+1}`},t))})},m={name:`Column Counts`,render:()=>(0,d.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-32)`},children:[1,2,3,4,6,12].map(e=>(0,d.jsxs)(`div`,{children:[(0,d.jsxs)(u,{children:[`columns=`,e]}),(0,d.jsx)(c,{columns:e,gap:8,children:Array.from({length:e},(e,t)=>(0,d.jsx)(l,{label:String(t+1),height:48},t))})]},e))})},h={name:`Span Items`,render:()=>(0,d.jsxs)(`div`,{children:[(0,d.jsx)(r,{as:`h2`,size:`xs`,style:{marginBottom:`var(--base-spacing-16)`},children:`12-column grid with varying spans`}),(0,d.jsxs)(c,{columns:12,gap:8,children:[(0,d.jsx)(o,{span:12,children:(0,d.jsx)(l,{label:`span 12`})}),(0,d.jsx)(o,{span:6,children:(0,d.jsx)(l,{label:`span 6`})}),(0,d.jsx)(o,{span:6,children:(0,d.jsx)(l,{label:`span 6`})}),(0,d.jsx)(o,{span:4,children:(0,d.jsx)(l,{label:`span 4`})}),(0,d.jsx)(o,{span:4,children:(0,d.jsx)(l,{label:`span 4`})}),(0,d.jsx)(o,{span:4,children:(0,d.jsx)(l,{label:`span 4`})}),(0,d.jsx)(o,{span:3,children:(0,d.jsx)(l,{label:`span 3`})}),(0,d.jsx)(o,{span:3,children:(0,d.jsx)(l,{label:`span 3`})}),(0,d.jsx)(o,{span:3,children:(0,d.jsx)(l,{label:`span 3`})}),(0,d.jsx)(o,{span:3,children:(0,d.jsx)(l,{label:`span 3`})}),(0,d.jsx)(o,{span:`full`,children:(0,d.jsx)(l,{label:`span="full"`})})]})]})},g={name:`Responsive Columns`,render:()=>(0,d.jsxs)(`div`,{children:[(0,d.jsx)(r,{as:`h2`,size:`xs`,style:{marginBottom:`var(--base-spacing-4)`},children:`Responsive columns`}),(0,d.jsx)(a,{size:`sm`,color:`muted`,style:{marginBottom:`var(--base-spacing-16)`},children:`xs:1 → sm:2 → md:3 → lg:4. Resize the preview to see it change.`}),(0,d.jsx)(c,{columns:{xs:1,sm:2,md:3,lg:4},gap:16,children:Array.from({length:8},(e,t)=>(0,d.jsx)(l,{label:`Item ${t+1}`,height:80},t))})]})},_={name:`Gap Scale`,render:()=>(0,d.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-40)`},children:[4,8,16,24,32].map(e=>(0,d.jsxs)(`div`,{children:[(0,d.jsxs)(u,{children:[`gap=`,e]}),(0,d.jsx)(c,{columns:4,gap:e,children:Array.from({length:4},(e,t)=>(0,d.jsx)(l,{label:String(t+1),height:48},t))})]},e))})},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    columns: 3,
    gap: 16
  },
  render: ({
    columns,
    gap
  }) => <Grid columns={columns} gap={gap}>
      {Array.from({
      length: columns * 2
    }, (_, i) => <Cell key={i} label={\`Item \${i + 1}\`} />)}
    </Grid>
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: "Column Counts",
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-32)"
  }}>
      {[1, 2, 3, 4, 6, 12].map(cols => <div key={cols}>
          <Label>columns={cols}</Label>
          <Grid columns={cols} gap={8}>
            {Array.from({
          length: cols
        }, (_, i) => <Cell key={i} label={String(i + 1)} height={48} />)}
          </Grid>
        </div>)}
    </div>
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  name: "Span Items",
  render: () => <div>
      <Heading as="h2" size="xs" style={{
      marginBottom: "var(--base-spacing-16)"
    }}>
        12-column grid with varying spans
      </Heading>
      <Grid columns={12} gap={8}>
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
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
    }} gap={16}>
        {Array.from({
        length: 8
      }, (_, i) => <Cell key={i} label={\`Item \${i + 1}\`} height={80} />)}
      </Grid>
    </div>
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: "Gap Scale",
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-40)"
  }}>
      {[4, 8, 16, 24, 32].map(g => <div key={g}>
          <Label>gap={g}</Label>
          <Grid columns={4} gap={g}>
            {Array.from({
          length: 4
        }, (_, i) => <Cell key={i} label={String(i + 1)} height={48} />)}
          </Grid>
        </div>)}
    </div>
}`,..._.parameters?.docs?.source}}},v=[`Configurable`,`ColumnCounts`,`SpanItems`,`Responsive`,`GapScale`]}))();export{m as ColumnCounts,p as Configurable,_ as GapScale,g as Responsive,h as SpanItems,v as __namedExportsOrder,f as default};