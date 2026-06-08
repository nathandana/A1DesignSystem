import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{T as n,r}from"./iframe-DZoRqkgT.js";import{n as i,t as a}from"./Button-Clq9-j9U.js";import{r as o,t as s}from"./Heading-Cv0veVz5.js";import{n as c,t as l}from"./Link-JV1UW1fo.js";import{n as u,t as d}from"./Paragraph-CcdcQtLu.js";import{n as f,t as p}from"./Banner-CZFai7g2.js";import{n as m,r as h}from"./icon-controls-BKzEgQc5.js";var g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j;e((()=>{g=t(n(),1),f(),i(),c(),o(),u(),h(),_=r(),v=[`neutral`,`info`,`success`,`warn`,`error`],y={neutral:{title:`Scheduled maintenance`,body:`The platform will be unavailable on Sunday from 2–4 AM UTC.`},info:{title:`New feature available`,body:`Dashboard exports are now supported in CSV and PDF formats.`},success:{title:`Migration complete`,body:`All records have been transferred successfully.`},warn:{title:`Action required`,body:`Your billing information is out of date. Update it to avoid service interruption.`},error:{title:`Service disruption`,body:`We are experiencing issues with the payment gateway. Our team is investigating.`}},b={title:`Components/Messaging/Banner`,component:p,tags:[`autodocs`],parameters:{layout:`fullscreen`},args:{variant:`inline`,status:`info`,title:`New feature available`,children:`Dashboard exports are now supported in CSV and PDF formats.`},argTypes:{variant:{control:`inline-radio`,options:[`inline`,`system`]},status:{control:`inline-radio`,options:v},title:{control:`text`},children:{control:`text`,name:`body`},icon:{...m(`Override the default status icon`)}}},x={parameters:{layout:`padded`},render:e=>{let[t,n]=(0,g.useState)(!0);return t?(0,_.jsx)(p,{...e,action:e.variant===`system`?(0,_.jsx)(a,{variant:`tertiary`,size:`sm`,children:`Take action`}):(0,_.jsx)(l,{href:`#`,children:`Learn more`}),onDismiss:()=>n(!1)}):(0,_.jsxs)(`p`,{style:{fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-sm)`,color:`var(--semantic-color-text-muted)`},children:[`Dismissed.`,` `,(0,_.jsx)(`button`,{onClick:()=>n(!0),style:{fontFamily:`inherit`,fontSize:`inherit`,cursor:`pointer`},children:`Show again`})]})}},S={name:`Inline — all statuses`,parameters:{layout:`padded`,controls:{include:[]}},render:()=>(0,_.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-12)`},children:v.map(e=>(0,_.jsx)(p,{variant:`inline`,status:e,title:y[e].title,children:y[e].body},e))})},C={name:`Inline — with link`,parameters:{layout:`padded`,controls:{include:[]}},render:()=>(0,_.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-12)`},children:v.map(e=>(0,_.jsx)(p,{variant:`inline`,status:e,title:y[e].title,action:(0,_.jsx)(l,{href:`#`,children:`Learn more`}),children:y[e].body},e))})},w={name:`Inline — with button`,parameters:{layout:`padded`,controls:{include:[]}},render:()=>(0,_.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--base-spacing-12)`},children:v.map(e=>(0,_.jsx)(p,{variant:`inline`,status:e,title:y[e].title,action:(0,_.jsx)(a,{variant:`tertiary`,size:`sm`,children:`Take action`}),children:y[e].body},e))})},T={name:`Inline — dismissable`,parameters:{layout:`padded`,controls:{include:[`status`]}},render:e=>{let[t,n]=(0,g.useState)(!0);return t?(0,_.jsx)(p,{...e,variant:`inline`,title:y[e.status??`info`].title,action:(0,_.jsx)(l,{href:`#`,children:`Details`}),onDismiss:()=>n(!1),children:y[e.status??`info`].body}):(0,_.jsx)(`p`,{style:{fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-sm)`,color:`var(--semantic-color-text-muted)`},children:`Dismissed.`})}},E={name:`System — all statuses`,parameters:{controls:{include:[]}},render:()=>(0,_.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`},children:v.map(e=>(0,_.jsx)(p,{variant:`system`,status:e,title:y[e].title,children:y[e].body},e))})},D={name:`System — with link`,parameters:{controls:{include:[]}},render:()=>(0,_.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`},children:v.map(e=>(0,_.jsx)(p,{variant:`system`,status:e,title:y[e].title,action:(0,_.jsx)(l,{href:`#`,children:`Learn more`}),children:y[e].body},e))})},O={name:`System — with button`,parameters:{controls:{include:[]}},render:()=>(0,_.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`},children:v.map(e=>(0,_.jsx)(p,{variant:`system`,status:e,title:y[e].title,action:(0,_.jsx)(a,{variant:`tertiary`,size:`sm`,children:`Take action`}),children:y[e].body},e))})},k={name:`System — dismissable`,parameters:{controls:{include:[`status`]}},render:e=>{let[t,n]=(0,g.useState)([]),r=v.filter(e=>!t.includes(e));return(0,_.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`},children:[r.length===0&&(0,_.jsxs)(`div`,{style:{padding:`var(--base-spacing-24)`,fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-sm)`,color:`var(--semantic-color-text-muted)`},children:[`All dismissed.`,` `,(0,_.jsx)(`button`,{onClick:()=>n([]),style:{fontFamily:`inherit`,fontSize:`inherit`,cursor:`pointer`},children:`Reset`})]}),r.map(e=>(0,_.jsx)(p,{variant:`system`,status:e,title:y[e].title,action:(0,_.jsx)(l,{href:`#`,children:`Details`}),onDismiss:()=>n(t=>[...t,e]),children:y[e].body},e))]})}},A={name:`System — in context`,parameters:{controls:{include:[`status`]}},render:e=>{let[t,n]=(0,g.useState)(!0),r=e.status??`warn`;return(0,_.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,minHeight:`320px`},children:[t&&(0,_.jsx)(p,{variant:`system`,status:r,title:y[r].title,action:(0,_.jsx)(a,{variant:`tertiary`,size:`sm`,children:`Resolve`}),onDismiss:()=>n(!1),children:y[r].body}),(0,_.jsx)(`div`,{style:{display:`flex`,alignItems:`center`,padding:`0 var(--base-spacing-24)`,height:`64px`,borderBottom:`1px solid var(--semantic-color-border-subtle)`,background:`var(--semantic-color-surface-page)`},children:(0,_.jsx)(s,{as:`h1`,size:`sm`,children:`My Application`})}),(0,_.jsx)(`div`,{style:{padding:`var(--base-spacing-32) var(--base-spacing-24)`},children:(0,_.jsx)(d,{color:`muted`,children:`Page content appears here below the header.`})})]})}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
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
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...A.parameters?.docs?.source}}},j=[`Configurable`,`InlineStatuses`,`InlineWithLink`,`InlineWithButton`,`InlineDismissable`,`SystemStatuses`,`SystemWithLink`,`SystemWithButton`,`SystemDismissable`,`SystemInContext`]}))();export{x as Configurable,T as InlineDismissable,S as InlineStatuses,w as InlineWithButton,C as InlineWithLink,k as SystemDismissable,A as SystemInContext,E as SystemStatuses,O as SystemWithButton,D as SystemWithLink,j as __namedExportsOrder,b as default};