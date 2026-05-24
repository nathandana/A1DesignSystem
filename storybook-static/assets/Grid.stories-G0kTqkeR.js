import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./iframe-DGQSYM4W.js";import{n,t as r}from"./Heading-B-e_yNFm.js";import{n as i,t as a}from"./Paragraph-BY7bSblY.js";var o=e((()=>{}));function s(e){if(e==null)return;let t=Number(e);return d.includes(t)?`var(--base-spacing-${t})`:void 0}function c({columns:e,gap:t,rowGap:n,columnGap:r,className:i=``,children:a,...o}){let c=[`a1-grid`],l;if(typeof e==`number`)l=e;else if(e&&typeof e==`object`)for(let[t,n]of Object.entries(e))c.push(`a1-grid--${t}-${n}`);i&&c.push(i);let d=s(t),f=s(n)??d,p=s(r)??d,m={...l==null?{}:{"--a1-grid-cols":l},...f?{rowGap:f}:{},...p?{columnGap:p}:{},...o.style};return(0,u.jsx)(`div`,{className:c.join(` `),style:m,...o,children:a})}function l({span:e,rowSpan:t,className:n=``,children:r,...i}){let a=[`a1-grid-item`];return e===`full`?a.push(`a1-grid-item--span-full`):typeof e==`number`&&a.push(`a1-grid-item--span-${e}`),typeof t==`number`&&a.push(`a1-grid-item--row-span-${t}`),n&&a.push(n),(0,u.jsx)(`div`,{className:a.join(` `),...i,children:r})}var u,d,f=e((()=>{o(),u=t(),d=[1,2,4,6,8,12,16,20,24,32,40,64,96,128],c.__docgenInfo={description:``,methods:[],displayName:`Grid`,props:{className:{defaultValue:{value:`""`,computed:!1},required:!1}}},l.__docgenInfo={description:``,methods:[],displayName:`GridItem`,props:{className:{defaultValue:{value:`""`,computed:!1},required:!1}}}}));function p({label:e,height:t=64}){return(0,h.jsx)(`div`,{style:{height:t,display:`flex`,alignItems:`center`,justifyContent:`center`,background:`var(--semantic-color-action-surface)`,border:`1px solid var(--semantic-color-action-border)`,borderRadius:`var(--base-radius-control)`},children:(0,h.jsx)(a,{size:`xs`,style:{fontWeight:`var(--base-font-weight-semibold)`,color:`var(--semantic-color-action-background)`},children:e})})}function m({children:e}){return(0,h.jsx)(a,{size:`xs`,color:`muted`,style:{marginBottom:`var(--base-spacing-8)`},children:e})}var h,g,_,v,y,b,x,S;e((()=>{f(),n(),i(),h=t(),g={title:`Components/Containers/Grid`,component:c,tags:[`autodocs`],parameters:{layout:`padded`},argTypes:{columns:{control:`number`},gap:{control:`select`,options:[4,8,12,16,20,24,32]}}},_={args:{columns:3,gap:16},render:({columns:e,gap:t})=>(0,h.jsx)(c,{columns:e,gap:t,children:Array.from({length:e*2},(e,t)=>(0,h.jsx)(p,{label:`Item ${t+1}`},t))})},v={name:`Column Counts`,render:()=>(0,h.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-32)`},children:[1,2,3,4,6,12].map(e=>(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(m,{children:[`columns=`,e]}),(0,h.jsx)(c,{columns:e,gap:8,children:Array.from({length:e},(e,t)=>(0,h.jsx)(p,{label:String(t+1),height:48},t))})]},e))})},y={name:`Span Items`,render:()=>(0,h.jsxs)(`div`,{children:[(0,h.jsx)(r,{as:`h2`,size:`xs`,style:{marginBottom:`var(--base-spacing-16)`},children:`12-column grid with varying spans`}),(0,h.jsxs)(c,{columns:12,gap:8,children:[(0,h.jsx)(l,{span:12,children:(0,h.jsx)(p,{label:`span 12`})}),(0,h.jsx)(l,{span:6,children:(0,h.jsx)(p,{label:`span 6`})}),(0,h.jsx)(l,{span:6,children:(0,h.jsx)(p,{label:`span 6`})}),(0,h.jsx)(l,{span:4,children:(0,h.jsx)(p,{label:`span 4`})}),(0,h.jsx)(l,{span:4,children:(0,h.jsx)(p,{label:`span 4`})}),(0,h.jsx)(l,{span:4,children:(0,h.jsx)(p,{label:`span 4`})}),(0,h.jsx)(l,{span:3,children:(0,h.jsx)(p,{label:`span 3`})}),(0,h.jsx)(l,{span:3,children:(0,h.jsx)(p,{label:`span 3`})}),(0,h.jsx)(l,{span:3,children:(0,h.jsx)(p,{label:`span 3`})}),(0,h.jsx)(l,{span:3,children:(0,h.jsx)(p,{label:`span 3`})}),(0,h.jsx)(l,{span:`full`,children:(0,h.jsx)(p,{label:`span="full"`})})]})]})},b={name:`Responsive Columns`,render:()=>(0,h.jsxs)(`div`,{children:[(0,h.jsx)(r,{as:`h2`,size:`xs`,style:{marginBottom:`var(--base-spacing-4)`},children:`Responsive columns`}),(0,h.jsx)(a,{size:`sm`,color:`muted`,style:{marginBottom:`var(--base-spacing-16)`},children:`xs:1 → sm:2 → md:3 → lg:4. Resize the preview to see it change.`}),(0,h.jsx)(c,{columns:{xs:1,sm:2,md:3,lg:4},gap:16,children:Array.from({length:8},(e,t)=>(0,h.jsx)(p,{label:`Item ${t+1}`,height:80},t))})]})},x={name:`Gap Scale`,render:()=>(0,h.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-40)`},children:[4,8,16,24,32].map(e=>(0,h.jsxs)(`div`,{children:[(0,h.jsxs)(m,{children:[`gap=`,e]}),(0,h.jsx)(c,{columns:4,gap:e,children:Array.from({length:4},(e,t)=>(0,h.jsx)(p,{label:String(t+1),height:48},t))})]},e))})},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}},S=[`Configurable`,`ColumnCounts`,`SpanItems`,`Responsive`,`GapScale`]}))();export{v as ColumnCounts,_ as Configurable,x as GapScale,b as Responsive,y as SpanItems,S as __namedExportsOrder,g as default};