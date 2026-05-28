import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{C as n,t as r}from"./iframe-Yj7JQljB.js";import{n as i,t as a}from"./Button-CfiQA4bX.js";import{n as o,t as s}from"./Heading-CB6vmpLF.js";import{n as c,t as l}from"./Link-CNPF3275.js";import{n as u,t as d}from"./Paragraph-B7CzrLxz.js";import{n as f,t as p}from"./Banner-CWc1vcbG.js";var m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k;e((()=>{m=t(n(),1),f(),i(),c(),o(),u(),h=r(),g=[`neutral`,`info`,`success`,`warn`,`error`],_={neutral:{title:`Scheduled maintenance`,body:`The platform will be unavailable on Sunday from 2–4 AM UTC.`},info:{title:`New feature available`,body:`Dashboard exports are now supported in CSV and PDF formats.`},success:{title:`Migration complete`,body:`All records have been transferred successfully.`},warn:{title:`Action required`,body:`Your billing information is out of date. Update it to avoid service interruption.`},error:{title:`Service disruption`,body:`We are experiencing issues with the payment gateway. Our team is investigating.`}},v={title:`Components/Messaging/Banner`,component:p,tags:[`autodocs`],parameters:{layout:`fullscreen`},args:{variant:`inline`,status:`info`,title:`New feature available`,children:`Dashboard exports are now supported in CSV and PDF formats.`},argTypes:{variant:{control:`inline-radio`,options:[`inline`,`system`]},status:{control:`inline-radio`,options:g},title:{control:`text`},children:{control:`text`,name:`body`},icon:{control:`text`,description:`Override the default status icon (Material Symbols name)`}}},y={parameters:{layout:`padded`},render:e=>{let[t,n]=(0,m.useState)(!0);return t?(0,h.jsx)(p,{...e,action:e.variant===`system`?(0,h.jsx)(a,{variant:`tertiary`,size:`sm`,children:`Take action`}):(0,h.jsx)(l,{href:`#`,children:`Learn more`}),onDismiss:()=>n(!1)}):(0,h.jsxs)(`p`,{style:{fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-sm)`,color:`var(--semantic-color-text-muted)`},children:[`Dismissed.`,` `,(0,h.jsx)(`button`,{onClick:()=>n(!0),style:{fontFamily:`inherit`,fontSize:`inherit`,cursor:`pointer`},children:`Show again`})]})}},b={name:`Inline — all statuses`,parameters:{layout:`padded`,controls:{include:[]}},render:()=>(0,h.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-12)`},children:g.map(e=>(0,h.jsx)(p,{variant:`inline`,status:e,title:_[e].title,children:_[e].body},e))})},x={name:`Inline — with link`,parameters:{layout:`padded`,controls:{include:[]}},render:()=>(0,h.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-12)`},children:g.map(e=>(0,h.jsx)(p,{variant:`inline`,status:e,title:_[e].title,action:(0,h.jsx)(l,{href:`#`,children:`Learn more`}),children:_[e].body},e))})},S={name:`Inline — with button`,parameters:{layout:`padded`,controls:{include:[]}},render:()=>(0,h.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-12)`},children:g.map(e=>(0,h.jsx)(p,{variant:`inline`,status:e,title:_[e].title,action:(0,h.jsx)(a,{variant:`tertiary`,size:`sm`,children:`Take action`}),children:_[e].body},e))})},C={name:`Inline — dismissable`,parameters:{layout:`padded`,controls:{include:[`status`]}},render:e=>{let[t,n]=(0,m.useState)(!0);return t?(0,h.jsx)(p,{...e,variant:`inline`,title:_[e.status??`info`].title,action:(0,h.jsx)(l,{href:`#`,children:`Details`}),onDismiss:()=>n(!1),children:_[e.status??`info`].body}):(0,h.jsx)(`p`,{style:{fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-sm)`,color:`var(--semantic-color-text-muted)`},children:`Dismissed.`})}},w={name:`System — all statuses`,parameters:{controls:{include:[]}},render:()=>(0,h.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`},children:g.map(e=>(0,h.jsx)(p,{variant:`system`,status:e,title:_[e].title,children:_[e].body},e))})},T={name:`System — with link`,parameters:{controls:{include:[]}},render:()=>(0,h.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`},children:g.map(e=>(0,h.jsx)(p,{variant:`system`,status:e,title:_[e].title,action:(0,h.jsx)(l,{href:`#`,children:`Learn more`}),children:_[e].body},e))})},E={name:`System — with button`,parameters:{controls:{include:[]}},render:()=>(0,h.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`},children:g.map(e=>(0,h.jsx)(p,{variant:`system`,status:e,title:_[e].title,action:(0,h.jsx)(a,{variant:`tertiary`,size:`sm`,children:`Take action`}),children:_[e].body},e))})},D={name:`System — dismissable`,parameters:{controls:{include:[`status`]}},render:e=>{let[t,n]=(0,m.useState)([]),r=g.filter(e=>!t.includes(e));return(0,h.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`},children:[r.length===0&&(0,h.jsxs)(`div`,{style:{padding:`var(--base-spacing-24)`,fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-sm)`,color:`var(--semantic-color-text-muted)`},children:[`All dismissed.`,` `,(0,h.jsx)(`button`,{onClick:()=>n([]),style:{fontFamily:`inherit`,fontSize:`inherit`,cursor:`pointer`},children:`Reset`})]}),r.map(e=>(0,h.jsx)(p,{variant:`system`,status:e,title:_[e].title,action:(0,h.jsx)(l,{href:`#`,children:`Details`}),onDismiss:()=>n(t=>[...t,e]),children:_[e].body},e))]})}},O={name:`System — in context`,parameters:{controls:{include:[`status`]}},render:e=>{let[t,n]=(0,m.useState)(!0),r=e.status??`warn`;return(0,h.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,minHeight:`320px`},children:[t&&(0,h.jsx)(p,{variant:`system`,status:r,title:_[r].title,action:(0,h.jsx)(a,{variant:`tertiary`,size:`sm`,children:`Resolve`}),onDismiss:()=>n(!1),children:_[r].body}),(0,h.jsx)(`div`,{style:{display:`flex`,alignItems:`center`,padding:`0 var(--base-spacing-24)`,height:`64px`,borderBottom:`1px solid var(--semantic-color-border-subtle)`,background:`var(--semantic-color-surface-page)`},children:(0,h.jsx)(s,{as:`h1`,size:`sm`,children:`My Application`})}),(0,h.jsx)(`div`,{style:{padding:`var(--base-spacing-32) var(--base-spacing-24)`},children:(0,h.jsx)(d,{color:`muted`,children:`Page content appears here below the header.`})})]})}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  parameters: {
    layout: "padded"
  },
  render: args => {
    const [visible, setVisible] = useState(true);
    if (!visible) return <p style={{
      fontFamily: "var(--component-paragraph-font-family)",
      fontSize: "var(--semantic-font-size-body-sm)",
      color: "var(--semantic-color-text-muted)"
    }}>
        Dismissed.{" "}
        <button onClick={() => setVisible(true)} style={{
        fontFamily: "inherit",
        fontSize: "inherit",
        cursor: "pointer"
      }}>Show again</button>
      </p>;
    return <Banner {...args} action={args.variant === "system" ? <Button variant="tertiary" size="sm">Take action</Button> : <Link href="#">Learn more</Link>} onDismiss={() => setVisible(false)} />;
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: "Inline — all statuses",
  parameters: {
    layout: "padded",
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-12)"
  }}>
      {STATUSES.map(status => <Banner key={status} variant="inline" status={status} title={EXAMPLES[status].title}>
          {EXAMPLES[status].body}
        </Banner>)}
    </div>
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: "Inline — with link",
  parameters: {
    layout: "padded",
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-12)"
  }}>
      {STATUSES.map(status => <Banner key={status} variant="inline" status={status} title={EXAMPLES[status].title} action={<Link href="#">Learn more</Link>}>
          {EXAMPLES[status].body}
        </Banner>)}
    </div>
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  name: "Inline — with button",
  parameters: {
    layout: "padded",
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "var(--base-spacing-12)"
  }}>
      {STATUSES.map(status => <Banner key={status} variant="inline" status={status} title={EXAMPLES[status].title} action={<Button variant="tertiary" size="sm">Take action</Button>}>
          {EXAMPLES[status].body}
        </Banner>)}
    </div>
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  name: "Inline — dismissable",
  parameters: {
    layout: "padded",
    controls: {
      include: ["status"]
    }
  },
  render: args => {
    const [visible, setVisible] = useState(true);
    return visible ? <Banner {...args} variant="inline" title={EXAMPLES[args.status ?? "info"].title} action={<Link href="#">Details</Link>} onDismiss={() => setVisible(false)}>{EXAMPLES[args.status ?? "info"].body}</Banner> : <p style={{
      fontFamily: "var(--component-paragraph-font-family)",
      fontSize: "var(--semantic-font-size-body-sm)",
      color: "var(--semantic-color-text-muted)"
    }}>Dismissed.</p>;
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  name: "System — all statuses",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    display: "flex",
    flexDirection: "column"
  }}>
      {STATUSES.map(status => <Banner key={status} variant="system" status={status} title={EXAMPLES[status].title}>
          {EXAMPLES[status].body}
        </Banner>)}
    </div>
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  name: "System — with link",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    display: "flex",
    flexDirection: "column"
  }}>
      {STATUSES.map(status => <Banner key={status} variant="system" status={status} title={EXAMPLES[status].title} action={<Link href="#">Learn more</Link>}>
          {EXAMPLES[status].body}
        </Banner>)}
    </div>
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  name: "System — with button",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    display: "flex",
    flexDirection: "column"
  }}>
      {STATUSES.map(status => <Banner key={status} variant="system" status={status} title={EXAMPLES[status].title} action={<Button variant="tertiary" size="sm">Take action</Button>}>
          {EXAMPLES[status].body}
        </Banner>)}
    </div>
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  name: "System — dismissable",
  parameters: {
    controls: {
      include: ["status"]
    }
  },
  render: args => {
    const [dismissed, setDismissed] = useState([]);
    const visible = STATUSES.filter(s => !dismissed.includes(s));
    return <div style={{
      display: "flex",
      flexDirection: "column"
    }}>
        {visible.length === 0 && <div style={{
        padding: "var(--base-spacing-24)",
        fontFamily: "var(--component-paragraph-font-family)",
        fontSize: "var(--semantic-font-size-body-sm)",
        color: "var(--semantic-color-text-muted)"
      }}>
            All dismissed.{" "}
            <button onClick={() => setDismissed([])} style={{
          fontFamily: "inherit",
          fontSize: "inherit",
          cursor: "pointer"
        }}>Reset</button>
          </div>}
        {visible.map(status => <Banner key={status} variant="system" status={status} title={EXAMPLES[status].title} action={<Link href="#">Details</Link>} onDismiss={() => setDismissed(d => [...d, status])}>
            {EXAMPLES[status].body}
          </Banner>)}
      </div>;
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  name: "System — in context",
  parameters: {
    controls: {
      include: ["status"]
    }
  },
  render: args => {
    const [visible, setVisible] = useState(true);
    const status = args.status ?? "warn";
    return <div style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "320px"
    }}>
        {visible && <Banner variant="system" status={status} title={EXAMPLES[status].title} action={<Button variant="tertiary" size="sm">Resolve</Button>} onDismiss={() => setVisible(false)}>
            {EXAMPLES[status].body}
          </Banner>}
        <div style={{
        display: "flex",
        alignItems: "center",
        padding: "0 var(--base-spacing-24)",
        height: "64px",
        borderBottom: "1px solid var(--semantic-color-border-subtle)",
        background: "var(--semantic-color-surface-page)"
      }}>
          <Heading as="h1" size="sm">My Application</Heading>
        </div>
        <div style={{
        padding: "var(--base-spacing-32) var(--base-spacing-24)"
      }}>
          <Paragraph color="muted">Page content appears here below the header.</Paragraph>
        </div>
      </div>;
  }
}`,...O.parameters?.docs?.source}}},k=[`Configurable`,`InlineStatuses`,`InlineWithLink`,`InlineWithButton`,`InlineDismissable`,`SystemStatuses`,`SystemWithLink`,`SystemWithButton`,`SystemDismissable`,`SystemInContext`]}))();export{y as Configurable,C as InlineDismissable,b as InlineStatuses,S as InlineWithButton,x as InlineWithLink,D as SystemDismissable,O as SystemInContext,w as SystemStatuses,E as SystemWithButton,T as SystemWithLink,k as __namedExportsOrder,v as default};