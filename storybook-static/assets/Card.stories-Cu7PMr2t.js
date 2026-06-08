import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{T as n,r}from"./iframe-DZoRqkgT.js";import{n as i,t as a}from"./Button-Clq9-j9U.js";import{n as o,t as s}from"./ButtonContainer-DpvY6AWj.js";import{n as c,t as l}from"./Card-CP5t58sT.js";import{r as u,t as d}from"./Heading-Cv0veVz5.js";import{n as f,t as p}from"./Link-JV1UW1fo.js";import{n as m,t as h}from"./Paragraph-CcdcQtLu.js";import{n as g,r as _}from"./icon-controls-BKzEgQc5.js";function v({title:e,preview:t,full:n}){let[r,i]=(0,y.useState)(!1);return(0,b.jsxs)(l,{style:{width:300},children:[(0,b.jsx)(d,{as:`h3`,size:`sm`,style:{marginBottom:`var(--base-spacing-8)`},children:e}),(0,b.jsx)(h,{size:`sm`,color:`muted`,style:{marginBottom:`var(--base-spacing-16)`},children:r?n:t}),(0,b.jsx)(a,{variant:`tertiary`,size:`sm`,icon:r?`expand_less`:`expand_more`,iconPosition:`end`,onClick:()=>i(e=>!e),children:r?`Show less`:`Read more`})]})}var y,b,x,S,C,w,T,E,D,O,k,A,j,M,N;e((()=>{y=t(n(),1),c(),i(),o(),u(),f(),m(),_(),b=r(),x=[`action`,`neutral`,`info`,`success`,`warn`,`error`],S={title:`Components/Containers/Card`,component:l,tags:[`autodocs`],parameters:{layout:`padded`},args:{bare:!1,variant:`default`,icon:void 0,iconDisplay:`default`,heroColor:`action`},argTypes:{as:{control:`select`,options:[`div`,`article`,`section`]},variant:{control:`select`,options:[`default`,`navigation`],description:`Use navigation when the whole card links to another page. Do not place buttons or links inside navigation cards.`},bare:{control:`boolean`,description:`Removes all visual chrome and padding`},icon:{...g(`Material Symbols icon name`)},iconDisplay:{control:`inline-radio`,options:[`none`,`default`,`hero`],description:`How the icon is rendered. default = small block above content (scales with container). hero = full-bleed coloured header.`},heroColor:{control:`select`,options:x,description:`Background colour of the hero area (only used when iconDisplay="hero")`}},render:({bare:e,variant:t,icon:n,iconDisplay:r,heroColor:i})=>(0,b.jsxs)(l,{bare:e,variant:t,href:t===`navigation`?`#`:void 0,icon:n,iconDisplay:r,heroColor:i,children:[(0,b.jsx)(d,{as:`h3`,size:`sm`,style:{marginBottom:`8px`},children:`Card title`}),(0,b.jsx)(h,{color:`muted`,children:`Supporting text describing the card content.`})]})},C={},w={name:`Default icon — responsive (resize to see steps)`,parameters:{controls:{include:[]}},render:()=>(0,b.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`24px`},children:[(0,b.jsx)(h,{size:`sm`,color:`muted`,children:`Drag the card width or resize the window. At ≥ 320 px the icon grows one step, at ≥ 480 px the box expands, at ≥ 640 px the icon shifts left alongside the content.`}),(0,b.jsx)(`div`,{style:{resize:`horizontal`,overflow:`hidden`,minWidth:200,maxWidth:900,border:`1px dashed var(--semantic-color-border-subtle)`,padding:8},children:(0,b.jsxs)(l,{icon:`bolt`,children:[(0,b.jsx)(d,{as:`h3`,size:`sm`,style:{marginBottom:`8px`},children:`Responsive icon`}),(0,b.jsx)(h,{color:`muted`,children:`This card responds to its own width via container queries.`})]})})]})},T={name:`With icon (default display)`,parameters:{controls:{include:[]}},render:()=>(0,b.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`24px`},children:[(0,b.jsxs)(l,{icon:`bolt`,style:{width:280},children:[(0,b.jsx)(d,{as:`h3`,size:`sm`,style:{marginBottom:`8px`},children:`Performance`}),(0,b.jsx)(h,{color:`muted`,children:`Built for speed with optimised rendering throughout.`})]}),(0,b.jsxs)(l,{icon:`shield`,style:{width:280},children:[(0,b.jsx)(d,{as:`h3`,size:`sm`,style:{marginBottom:`8px`},children:`Security`}),(0,b.jsx)(h,{color:`muted`,children:`Enterprise-grade security baked in from the ground up.`})]}),(0,b.jsxs)(l,{icon:`star`,style:{width:280},children:[(0,b.jsx)(d,{as:`h3`,size:`sm`,style:{marginBottom:`8px`},children:`Quality`}),(0,b.jsx)(h,{color:`muted`,children:`Every token and component reviewed against design standards.`})]})]})},E={name:`Navigation`,parameters:{controls:{include:[]}},render:()=>(0,b.jsxs)(`div`,{style:{display:`grid`,gap:`var(--base-spacing-16)`},children:[(0,b.jsxs)(l,{variant:`navigation`,href:`#`,icon:`palette`,children:[(0,b.jsx)(d,{as:`h3`,size:`sm`,style:{marginBottom:`var(--base-spacing-8)`},children:`Color foundation`}),(0,b.jsx)(h,{color:`muted`,children:`Navigate to the color foundation page. Navigation cards must not contain nested buttons or links.`})]}),(0,b.jsxs)(l,{variant:`navigation`,href:`#`,icon:`widgets`,children:[(0,b.jsx)(d,{as:`h3`,size:`sm`,style:{marginBottom:`var(--base-spacing-8)`},children:`Components`}),(0,b.jsx)(h,{color:`muted`,children:`Use the whole card as one target when the card represents a single destination.`})]})]})},D=[{icon:`bolt`,heroColor:`action`,label:`Performance`,body:`Optimised rendering keeps every interaction snappy at any scale.`},{icon:`shield`,heroColor:`success`,label:`Security`,body:`Enterprise-grade protections baked in from the ground up.`},{icon:`warning`,heroColor:`warn`,label:`Monitoring`,body:`Alerts surface issues before they affect your end users.`},{icon:`star`,heroColor:`error`,label:`Quality`,body:`Every component reviewed against the full design standard.`}],O={name:`Hero icon`,parameters:{controls:{include:[]}},render:()=>(0,b.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`24px`,alignItems:`flex-start`},children:D.map(({icon:e,heroColor:t,label:n,body:r})=>(0,b.jsxs)(l,{icon:e,iconDisplay:`hero`,heroColor:t,style:{width:240},children:[(0,b.jsx)(d,{as:`h3`,size:`sm`,style:{marginBottom:`var(--base-spacing-8)`},children:n}),(0,b.jsx)(h,{size:`sm`,color:`muted`,children:r})]},n))})},k={name:`With actions`,parameters:{controls:{include:[]}},render:()=>(0,b.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`24px`,alignItems:`flex-start`},children:[(0,b.jsxs)(l,{style:{width:320},children:[(0,b.jsx)(d,{as:`h3`,size:`sm`,style:{marginBottom:`var(--base-spacing-8)`},children:`Confirm action`}),(0,b.jsx)(h,{color:`muted`,style:{marginBottom:`var(--base-spacing-20)`},children:`Are you sure you want to proceed? This cannot be undone.`}),(0,b.jsxs)(s,{align:`end`,children:[(0,b.jsx)(a,{variant:`primary`,icon:`check`,children:`Confirm`}),(0,b.jsx)(a,{variant:`secondary`,children:`Cancel`})]})]}),(0,b.jsxs)(l,{style:{width:320},children:[(0,b.jsx)(d,{as:`h3`,size:`sm`,style:{marginBottom:`var(--base-spacing-8)`},children:`Upgrade plan`}),(0,b.jsx)(h,{color:`muted`,style:{marginBottom:`var(--base-spacing-20)`},children:`Unlock unlimited exports, priority support, and advanced analytics.`}),(0,b.jsxs)(s,{align:`start`,children:[(0,b.jsx)(a,{variant:`primary`,children:`Upgrade now`}),(0,b.jsx)(p,{href:`#`,children:`Compare plans`})]})]})]})},A=[{title:`What is a design token?`,preview:`Design tokens are the atomic values that underpin your visual language — spacing, colour, and type all in one place.`,full:`Design tokens are the atomic values that underpin your visual language — spacing, colour, and type all in one place. They replace hardcoded values like #2563eb or 16px with named references like color.action.background and spacing.16, which can be swapped across platforms without touching component code. A single token change ripples consistently across web, iOS, and Android simultaneously.`},{title:`Component anatomy`,preview:`Every component is built from tokens, making it straightforward to update a single value and see it ripple across the system.`,full:`Every component is built from tokens, making it straightforward to update a single value and see it ripple across the system. A button's background, padding, border-radius, and focus ring are all token references. Swap a brand colour in the token file and every button, link, and badge updates automatically — no find-and-replace required.`},{title:`Contributing guidelines`,preview:`Learn how to propose new components, raise token changes, and get your work reviewed by the design systems team.`,full:`Learn how to propose new components, raise token changes, and get your work reviewed by the design systems team. Start by opening a discussion in the #design-system Slack channel, then follow the RFC template to describe the problem, proposed API, and accessibility considerations. All contributions require a Storybook story and a passing accessibility audit before merging.`}],j={name:`Read more`,parameters:{controls:{include:[]}},render:()=>(0,b.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`24px`,alignItems:`flex-start`},children:A.map(e=>(0,b.jsx)(v,{...e},e.title))})},M={name:`Bare (no chrome)`,parameters:{controls:{include:[]}},render:()=>(0,b.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`40px`,alignItems:`flex-start`},children:[(0,b.jsxs)(`div`,{children:[(0,b.jsx)(h,{size:`xs`,color:`muted`,style:{marginBottom:`var(--base-spacing-8)`,textTransform:`uppercase`,letterSpacing:`0.05em`},children:`Default`}),(0,b.jsxs)(l,{style:{width:280},children:[(0,b.jsx)(d,{as:`h3`,size:`sm`,style:{marginBottom:`var(--base-spacing-8)`},children:`Standard card`}),(0,b.jsx)(h,{color:`muted`,children:`Full border, shadow and padding.`})]})]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(h,{size:`xs`,color:`muted`,style:{marginBottom:`var(--base-spacing-8)`,textTransform:`uppercase`,letterSpacing:`0.05em`},children:`Bare`}),(0,b.jsxs)(l,{bare:!0,style:{width:280},children:[(0,b.jsx)(d,{as:`h3`,size:`sm`,style:{marginBottom:`var(--base-spacing-8)`},children:`Bare card`}),(0,b.jsx)(h,{color:`muted`,children:`No border, shadow or padding — just structure.`})]})]})]})},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  name: "Default icon — responsive (resize to see steps)",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  }}>
      <Paragraph size="sm" color="muted">
        Drag the card width or resize the window. At ≥ 320 px the icon grows one step, at ≥ 480 px the box expands, at ≥ 640 px the icon shifts left alongside the content.
      </Paragraph>
      <div style={{
      resize: "horizontal",
      overflow: "hidden",
      minWidth: 200,
      maxWidth: 900,
      border: "1px dashed var(--semantic-color-border-subtle)",
      padding: 8
    }}>
        <Card icon="bolt">
          <Heading as="h3" size="sm" style={{
          marginBottom: "8px"
        }}>Responsive icon</Heading>
          <Paragraph color="muted">This card responds to its own width via container queries.</Paragraph>
        </Card>
      </div>
    </div>
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  name: "With icon (default display)",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "24px"
  }}>
      <Card icon="bolt" style={{
      width: 280
    }}>
        <Heading as="h3" size="sm" style={{
        marginBottom: "8px"
      }}>Performance</Heading>
        <Paragraph color="muted">Built for speed with optimised rendering throughout.</Paragraph>
      </Card>
      <Card icon="shield" style={{
      width: 280
    }}>
        <Heading as="h3" size="sm" style={{
        marginBottom: "8px"
      }}>Security</Heading>
        <Paragraph color="muted">Enterprise-grade security baked in from the ground up.</Paragraph>
      </Card>
      <Card icon="star" style={{
      width: 280
    }}>
        <Heading as="h3" size="sm" style={{
        marginBottom: "8px"
      }}>Quality</Heading>
        <Paragraph color="muted">Every token and component reviewed against design standards.</Paragraph>
      </Card>
    </div>
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  name: "Navigation",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    display: "grid",
    gap: "var(--base-spacing-16)"
  }}>
      <Card variant="navigation" href="#" icon="palette">
        <Heading as="h3" size="sm" style={{
        marginBottom: "var(--base-spacing-8)"
      }}>
          Color foundation
        </Heading>
        <Paragraph color="muted">
          Navigate to the color foundation page. Navigation cards must not contain nested buttons or links.
        </Paragraph>
      </Card>
      <Card variant="navigation" href="#" icon="widgets">
        <Heading as="h3" size="sm" style={{
        marginBottom: "var(--base-spacing-8)"
      }}>
          Components
        </Heading>
        <Paragraph color="muted">
          Use the whole card as one target when the card represents a single destination.
        </Paragraph>
      </Card>
    </div>
}`,...E.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  name: "Hero icon",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "24px",
    alignItems: "flex-start"
  }}>
      {ICON_CARDS.map(({
      icon,
      heroColor,
      label,
      body
    }) => <Card key={label} icon={icon} iconDisplay="hero" heroColor={heroColor} style={{
      width: 240
    }}>
          <Heading as="h3" size="sm" style={{
        marginBottom: "var(--base-spacing-8)"
      }}>{label}</Heading>
          <Paragraph size="sm" color="muted">{body}</Paragraph>
        </Card>)}
    </div>
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  name: "With actions",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "24px",
    alignItems: "flex-start"
  }}>
      <Card style={{
      width: 320
    }}>
        <Heading as="h3" size="sm" style={{
        marginBottom: "var(--base-spacing-8)"
      }}>Confirm action</Heading>
        <Paragraph color="muted" style={{
        marginBottom: "var(--base-spacing-20)"
      }}>
          Are you sure you want to proceed? This cannot be undone.
        </Paragraph>
        <ButtonContainer align="end">
          <Button variant="primary" icon="check">Confirm</Button>
          <Button variant="secondary">Cancel</Button>
        </ButtonContainer>
      </Card>

      <Card style={{
      width: 320
    }}>
        <Heading as="h3" size="sm" style={{
        marginBottom: "var(--base-spacing-8)"
      }}>Upgrade plan</Heading>
        <Paragraph color="muted" style={{
        marginBottom: "var(--base-spacing-20)"
      }}>
          Unlock unlimited exports, priority support, and advanced analytics.
        </Paragraph>
        <ButtonContainer align="start">
          <Button variant="primary">Upgrade now</Button>
          <Link href="#">Compare plans</Link>
        </ButtonContainer>
      </Card>
    </div>
}`,...k.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  name: "Read more",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "24px",
    alignItems: "flex-start"
  }}>
      {EXPANDABLE_CARDS.map(card => <ExpandableCard key={card.title} {...card} />)}
    </div>
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  name: "Bare (no chrome)",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => <div style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "40px",
    alignItems: "flex-start"
  }}>
      <div>
        <Paragraph size="xs" color="muted" style={{
        marginBottom: "var(--base-spacing-8)",
        textTransform: "uppercase",
        letterSpacing: "0.05em"
      }}>Default</Paragraph>
        <Card style={{
        width: 280
      }}>
          <Heading as="h3" size="sm" style={{
          marginBottom: "var(--base-spacing-8)"
        }}>Standard card</Heading>
          <Paragraph color="muted">Full border, shadow and padding.</Paragraph>
        </Card>
      </div>
      <div>
        <Paragraph size="xs" color="muted" style={{
        marginBottom: "var(--base-spacing-8)",
        textTransform: "uppercase",
        letterSpacing: "0.05em"
      }}>Bare</Paragraph>
        <Card bare style={{
        width: 280
      }}>
          <Heading as="h3" size="sm" style={{
          marginBottom: "var(--base-spacing-8)"
        }}>Bare card</Heading>
          <Paragraph color="muted">No border, shadow or padding — just structure.</Paragraph>
        </Card>
      </div>
    </div>
}`,...M.parameters?.docs?.source}}},N=[`Configurable`,`IconDefaultResponsive`,`WithIcon`,`Navigation`,`HeroIcon`,`WithActions`,`ReadMore`,`Bare`]}))();export{M as Bare,C as Configurable,O as HeroIcon,w as IconDefaultResponsive,E as Navigation,j as ReadMore,k as WithActions,T as WithIcon,N as __namedExportsOrder,S as default};