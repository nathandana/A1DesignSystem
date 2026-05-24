import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{C as n,t as r}from"./iframe-D1JN-_Xq.js";import{n as i,t as a}from"./Pagination-DzPAeAbv.js";var o,s,c,l,u,d,f,p;e((()=>{o=t(n(),1),i(),s=r(),c={title:`Components/Controls/Pagination`,component:a,tags:[`autodocs`],parameters:{layout:`centered`},argTypes:{page:{control:{type:`number`,min:1}},totalPages:{control:{type:`number`,min:1}},siblings:{control:{type:`number`,min:0,max:3}},size:{control:`inline-radio`,options:[`sm`,`md`]}}},l={render:e=>{let[t,n]=(0,o.useState)(e.page??5);return(0,s.jsx)(a,{...e,page:t,totalPages:e.totalPages??10,onChange:n})}},u={parameters:{controls:{include:[`totalPages`,`siblings`]}},render:e=>{let[t,n]=(0,o.useState)(5),[r,i]=(0,o.useState)(5),c=e.totalPages??10;return(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-24)`,alignItems:`flex-start`},children:[(0,s.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`var(--base-spacing-16)`},children:[(0,s.jsx)(`span`,{style:{fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,color:`var(--semantic-color-text-muted)`,width:`24px`},children:`md`}),(0,s.jsx)(a,{page:t,totalPages:c,onChange:n,size:`md`,siblings:e.siblings})]}),(0,s.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`var(--base-spacing-16)`},children:[(0,s.jsx)(`span`,{style:{fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,color:`var(--semantic-color-text-muted)`,width:`24px`},children:`sm`}),(0,s.jsx)(a,{page:r,totalPages:c,onChange:i,size:`sm`,siblings:e.siblings})]})]})}},d={name:`Ellipsis behaviour`,parameters:{controls:{include:[`siblings`,`size`]}},render:e=>{let t=[1,3,5,8,10],[n,r]=(0,o.useState)(5);return(0,s.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-12)`,alignItems:`flex-start`},children:t.map(t=>(0,s.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`var(--base-spacing-16)`},children:[(0,s.jsxs)(`span`,{style:{fontFamily:`monospace`,fontSize:`var(--semantic-font-size-body-xs)`,color:`var(--semantic-color-text-muted)`,width:`52px`},children:[`page `,t]}),(0,s.jsx)(a,{...e,page:t,totalPages:10,onChange:r})]},t))})}},f={name:`Few pages`,parameters:{controls:{include:[`size`]}},render:e=>{let[t,n]=(0,o.useState)(1);return(0,s.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-12)`,alignItems:`flex-start`},children:[1,2,3,4,5].map(r=>(0,s.jsx)(a,{...e,page:Math.min(t,r),totalPages:r,onChange:n},r))})}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [page, setPage] = useState(args.page ?? 5);
    return <Pagination {...args} page={page} totalPages={args.totalPages ?? 10} onChange={setPage} />;
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      include: ["totalPages", "siblings"]
    }
  },
  render: args => {
    const [mdPage, setMdPage] = useState(5);
    const [smPage, setSmPage] = useState(5);
    const total = args.totalPages ?? 10;
    return <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--base-spacing-24)",
      alignItems: "flex-start"
    }}>
        <div style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--base-spacing-16)"
      }}>
          <span style={{
          fontFamily: "var(--component-paragraph-font-family)",
          fontSize: "var(--semantic-font-size-body-xs)",
          color: "var(--semantic-color-text-muted)",
          width: "24px"
        }}>md</span>
          <Pagination page={mdPage} totalPages={total} onChange={setMdPage} size="md" siblings={args.siblings} />
        </div>
        <div style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--base-spacing-16)"
      }}>
          <span style={{
          fontFamily: "var(--component-paragraph-font-family)",
          fontSize: "var(--semantic-font-size-body-xs)",
          color: "var(--semantic-color-text-muted)",
          width: "24px"
        }}>sm</span>
          <Pagination page={smPage} totalPages={total} onChange={setSmPage} size="sm" siblings={args.siblings} />
        </div>
      </div>;
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: "Ellipsis behaviour",
  parameters: {
    controls: {
      include: ["siblings", "size"]
    }
  },
  render: args => {
    const pages = [1, 3, 5, 8, 10];
    const [current, setCurrent] = useState(5);
    return <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--base-spacing-12)",
      alignItems: "flex-start"
    }}>
        {pages.map(p => <div key={p} style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--base-spacing-16)"
      }}>
            <span style={{
          fontFamily: "monospace",
          fontSize: "var(--semantic-font-size-body-xs)",
          color: "var(--semantic-color-text-muted)",
          width: "52px"
        }}>
              page {p}
            </span>
            <Pagination {...args} page={p} totalPages={10} onChange={setCurrent} />
          </div>)}
      </div>;
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: "Few pages",
  parameters: {
    controls: {
      include: ["size"]
    }
  },
  render: args => {
    const [page, setPage] = useState(1);
    return <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--base-spacing-12)",
      alignItems: "flex-start"
    }}>
        {[1, 2, 3, 4, 5].map(total => <Pagination key={total} {...args} page={Math.min(page, total)} totalPages={total} onChange={setPage} />)}
      </div>;
  }
}`,...f.parameters?.docs?.source}}},p=[`Default`,`Sizes`,`Ellipsis`,`FewPages`]}))();export{l as Default,d as Ellipsis,f as FewPages,u as Sizes,p as __namedExportsOrder,c as default};