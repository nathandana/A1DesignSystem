import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{C as n,t as r}from"./iframe-CN7ekW17.js";import{n as i}from"./Icon-C8O5iL0V.js";import{n as a,t as o}from"./IconButton-DZBYg8AT.js";var s=e((()=>{}));function c(e,t,n){let r=Math.max(2,e-n),i=Math.min(t-1,e+n),a=[1];r>2&&a.push(`start-ellipsis`);for(let e=r;e<=i;e++)a.push(e);return i<t-1&&a.push(`end-ellipsis`),t>1&&a.push(t),a}function l({page:e,totalPages:t,onChange:n,siblings:r=1,size:i=`md`}){let a=c(e,t,r);return(0,u.jsxs)(`nav`,{"aria-label":`Pagination`,className:`a1-pagination a1-pagination--${i}`,children:[(0,u.jsx)(o,{icon:`chevron_left`,label:`Previous page`,onClick:()=>n?.(e-1),disabled:e<=1,className:`a1-pagination__item`}),a.map(t=>typeof t==`string`?(0,u.jsx)(`span`,{className:`a1-pagination__ellipsis`,"aria-hidden":`true`,children:`…`},t):(0,u.jsx)(`button`,{className:`a1-pagination__item`,onClick:()=>t!==e&&n?.(t),"aria-label":`Page ${t}`,"aria-current":t===e?`page`:void 0,children:t},t)),(0,u.jsx)(o,{icon:`chevron_right`,label:`Next page`,onClick:()=>n?.(e+1),disabled:e>=t,className:`a1-pagination__item`})]})}var u,d=e((()=>{s(),i(),a(),u=r(),l.__docgenInfo={description:``,methods:[],displayName:`Pagination`,props:{siblings:{defaultValue:{value:`1`,computed:!1},required:!1},size:{defaultValue:{value:`"md"`,computed:!1},required:!1}}}})),f,p,m,h,g,_,v,y;e((()=>{f=t(n(),1),d(),p=r(),m={title:`Components/Controls/Pagination`,component:l,tags:[`autodocs`],parameters:{layout:`centered`},argTypes:{page:{control:{type:`number`,min:1}},totalPages:{control:{type:`number`,min:1}},siblings:{control:{type:`number`,min:0,max:3}},size:{control:`inline-radio`,options:[`sm`,`md`]}}},h={render:e=>{let[t,n]=(0,f.useState)(e.page??5);return(0,p.jsx)(l,{...e,page:t,totalPages:e.totalPages??10,onChange:n})}},g={parameters:{controls:{include:[`totalPages`,`siblings`]}},render:e=>{let[t,n]=(0,f.useState)(5),[r,i]=(0,f.useState)(5),a=e.totalPages??10;return(0,p.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-24)`,alignItems:`flex-start`},children:[(0,p.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`var(--base-spacing-16)`},children:[(0,p.jsx)(`span`,{style:{fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,color:`var(--semantic-color-text-muted)`,width:`24px`},children:`md`}),(0,p.jsx)(l,{page:t,totalPages:a,onChange:n,size:`md`,siblings:e.siblings})]}),(0,p.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`var(--base-spacing-16)`},children:[(0,p.jsx)(`span`,{style:{fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-xs)`,color:`var(--semantic-color-text-muted)`,width:`24px`},children:`sm`}),(0,p.jsx)(l,{page:r,totalPages:a,onChange:i,size:`sm`,siblings:e.siblings})]})]})}},_={name:`Ellipsis behaviour`,parameters:{controls:{include:[`siblings`,`size`]}},render:e=>{let t=[1,3,5,8,10],[n,r]=(0,f.useState)(5);return(0,p.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-12)`,alignItems:`flex-start`},children:t.map(t=>(0,p.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`var(--base-spacing-16)`},children:[(0,p.jsxs)(`span`,{style:{fontFamily:`monospace`,fontSize:`var(--semantic-font-size-body-xs)`,color:`var(--semantic-color-text-muted)`,width:`52px`},children:[`page `,t]}),(0,p.jsx)(l,{...e,page:t,totalPages:10,onChange:r})]},t))})}},v={name:`Few pages`,parameters:{controls:{include:[`size`]}},render:e=>{let[t,n]=(0,f.useState)(1);return(0,p.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-12)`,alignItems:`flex-start`},children:[1,2,3,4,5].map(r=>(0,p.jsx)(l,{...e,page:Math.min(t,r),totalPages:r,onChange:n},r))})}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [page, setPage] = useState(args.page ?? 5);
    return <Pagination {...args} page={page} totalPages={args.totalPages ?? 10} onChange={setPage} />;
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}},y=[`Default`,`Sizes`,`Ellipsis`,`FewPages`]}))();export{h as Default,_ as Ellipsis,v as FewPages,g as Sizes,y as __namedExportsOrder,m as default};