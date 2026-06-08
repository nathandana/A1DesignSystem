import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{C as n,t as r}from"./iframe-D8uQ9hre.js";import{n as i,t as a}from"./Button-Ceq8Bvz0.js";import{n as o,t as s}from"./ButtonContainer--21A6PPu.js";import{n as c,t as l}from"./Card-D3RcWj2w.js";import{r as u,t as d}from"./Heading-D4Rsl0li.js";import{n as f,t as p}from"./Link-Cd5DxWjU.js";import{n as m,t as h}from"./Paragraph-E9JaBz9b.js";function g({title:e,preview:t,full:n}){let[r,i]=(0,_.useState)(!1);return(0,v.jsxs)(l,{style:{width:300},children:[(0,v.jsx)(d,{as:`h3`,size:`sm`,style:{marginBottom:`var(--base-spacing-8)`},children:e}),(0,v.jsx)(h,{size:`sm`,color:`muted`,style:{marginBottom:`var(--base-spacing-16)`},children:r?n:t}),(0,v.jsx)(a,{variant:`tertiary`,size:`sm`,icon:r?`expand_less`:`expand_more`,iconPosition:`end`,onClick:()=>i(e=>!e),children:r?`Show less`:`Read more`})]})}var _,v,y,b,x,S,C,w,T,E,D,O,k;e((()=>{_=t(n(),1),c(),i(),o(),u(),f(),m(),v=r(),y={title:`Components/Containers/Card`,component:l,tags:[`autodocs`],parameters:{layout:`padded`},args:{bare:!1,variant:`default`,icon:void 0,heroIcon:void 0,heroColor:`action`},argTypes:{as:{control:`select`,options:[`div`,`article`,`section`]},variant:{control:`select`,options:[`default`,`navigation`],description:`Use navigation when the whole card links to another page. Do not place buttons or links inside navigation cards.`},bare:{control:`boolean`,description:`Removes all visual chrome and padding`},icon:{control:`text`,description:`Small icon in the card header (Material Symbols name)`},heroIcon:{control:`text`,description:`Full-bleed hero icon at the top of the card (Material Symbols name)`},heroColor:{control:`select`,options:[`action`,`neutral`,`info`,`success`,`warn`,`error`],description:`Background color of the hero icon area`}},render:({bare:e,variant:t,icon:n,heroIcon:r,heroColor:i})=>(0,v.jsxs)(l,{bare:e,variant:t,href:t===`navigation`?`#`:void 0,icon:n,heroIcon:r,heroColor:i,style:{width:320},children:[(0,v.jsx)(d,{as:`h3`,size:`sm`,style:{marginBottom:`8px`},children:`Card title`}),(0,v.jsx)(h,{color:`muted`,children:`Supporting text describing the card content.`})]})},b={},x={name:`With small icon`,parameters:{controls:{include:[]}},render:()=>(0,v.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`24px`},children:[(0,v.jsxs)(l,{icon:`bolt`,style:{width:280},children:[(0,v.jsx)(d,{as:`h3`,size:`sm`,style:{marginBottom:`8px`},children:`Performance`}),(0,v.jsx)(h,{color:`muted`,children:`Built for speed with optimised rendering throughout.`})]}),(0,v.jsxs)(l,{icon:`shield`,style:{width:280},children:[(0,v.jsx)(d,{as:`h3`,size:`sm`,style:{marginBottom:`8px`},children:`Security`}),(0,v.jsx)(h,{color:`muted`,children:`Enterprise-grade security baked in from the ground up.`})]}),(0,v.jsxs)(l,{icon:`star`,style:{width:280},children:[(0,v.jsx)(d,{as:`h3`,size:`sm`,style:{marginBottom:`8px`},children:`Quality`}),(0,v.jsx)(h,{color:`muted`,children:`Every token and component reviewed against design standards.`})]})]})},S={name:`Navigation`,parameters:{controls:{include:[]}},render:()=>(0,v.jsxs)(`div`,{style:{display:`grid`,gap:`var(--base-spacing-16)`},children:[(0,v.jsxs)(l,{variant:`navigation`,href:`#`,icon:`palette`,children:[(0,v.jsx)(d,{as:`h3`,size:`sm`,style:{marginBottom:`var(--base-spacing-8)`},children:`Color foundation`}),(0,v.jsx)(h,{color:`muted`,children:`Navigate to the color foundation page. Navigation cards must not contain nested buttons or links.`})]}),(0,v.jsxs)(l,{variant:`navigation`,href:`#`,icon:`widgets`,children:[(0,v.jsx)(d,{as:`h3`,size:`sm`,style:{marginBottom:`var(--base-spacing-8)`},children:`Components`}),(0,v.jsx)(h,{color:`muted`,children:`Use the whole card as one target when the card represents a single destination.`})]})]})},C=[{heroIcon:`bolt`,heroColor:`action`,label:`Performance`,body:`Optimised rendering keeps every interaction snappy at any scale.`},{heroIcon:`shield`,heroColor:`success`,label:`Security`,body:`Enterprise-grade protections baked in from the ground up.`},{heroIcon:`warning`,heroColor:`warn`,label:`Monitoring`,body:`Alerts surface issues before they affect your end users.`},{heroIcon:`star`,heroColor:`error`,label:`Quality`,body:`Every component reviewed against the full design standard.`}],w={name:`Big icon`,parameters:{controls:{include:[]}},render:()=>(0,v.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`24px`,alignItems:`flex-start`},children:C.map(({heroIcon:e,heroColor:t,label:n,body:r})=>(0,v.jsxs)(l,{heroIcon:e,heroColor:t,style:{width:240},children:[(0,v.jsx)(d,{as:`h3`,size:`sm`,style:{marginBottom:`var(--base-spacing-8)`},children:n}),(0,v.jsx)(h,{size:`sm`,color:`muted`,children:r})]},n))})},T={name:`With actions`,parameters:{controls:{include:[]}},render:()=>(0,v.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`24px`,alignItems:`flex-start`},children:[(0,v.jsxs)(l,{style:{width:320},children:[(0,v.jsx)(d,{as:`h3`,size:`sm`,style:{marginBottom:`var(--base-spacing-8)`},children:`Confirm action`}),(0,v.jsx)(h,{color:`muted`,style:{marginBottom:`var(--base-spacing-20)`},children:`Are you sure you want to proceed? This cannot be undone.`}),(0,v.jsxs)(s,{align:`end`,children:[(0,v.jsx)(a,{variant:`primary`,icon:`check`,children:`Confirm`}),(0,v.jsx)(a,{variant:`secondary`,children:`Cancel`})]})]}),(0,v.jsxs)(l,{style:{width:320},children:[(0,v.jsx)(d,{as:`h3`,size:`sm`,style:{marginBottom:`var(--base-spacing-8)`},children:`Upgrade plan`}),(0,v.jsx)(h,{color:`muted`,style:{marginBottom:`var(--base-spacing-20)`},children:`Unlock unlimited exports, priority support, and advanced analytics.`}),(0,v.jsxs)(s,{align:`start`,children:[(0,v.jsx)(a,{variant:`primary`,children:`Upgrade now`}),(0,v.jsx)(p,{href:`#`,children:`Compare plans`})]})]})]})},E=[{title:`What is a design token?`,preview:`Design tokens are the atomic values that underpin your visual language — spacing, colour, and type all in one place.`,full:`Design tokens are the atomic values that underpin your visual language — spacing, colour, and type all in one place. They replace hardcoded values like #2563eb or 16px with named references like color.action.background and spacing.16, which can be swapped across platforms without touching component code. A single token change ripples consistently across web, iOS, and Android simultaneously.`},{title:`Component anatomy`,preview:`Every component is built from tokens, making it straightforward to update a single value and see it ripple across the system.`,full:`Every component is built from tokens, making it straightforward to update a single value and see it ripple across the system. A button's background, padding, border-radius, and focus ring are all token references. Swap a brand colour in the token file and every button, link, and badge updates automatically — no find-and-replace required.`},{title:`Contributing guidelines`,preview:`Learn how to propose new components, raise token changes, and get your work reviewed by the design systems team.`,full:`Learn how to propose new components, raise token changes, and get your work reviewed by the design systems team. Start by opening a discussion in the #design-system Slack channel, then follow the RFC template to describe the problem, proposed API, and accessibility considerations. All contributions require a Storybook story and a passing accessibility audit before merging.`}],D={name:`Read more`,parameters:{controls:{include:[]}},render:()=>(0,v.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`24px`,alignItems:`flex-start`},children:E.map(e=>(0,v.jsx)(g,{...e},e.title))})},O={name:`Bare (no chrome)`,parameters:{controls:{include:[]}},render:()=>(0,v.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`40px`,alignItems:`flex-start`},children:[(0,v.jsxs)(`div`,{children:[(0,v.jsx)(h,{size:`xs`,color:`muted`,style:{marginBottom:`var(--base-spacing-8)`,textTransform:`uppercase`,letterSpacing:`0.05em`},children:`Default`}),(0,v.jsxs)(l,{style:{width:280},children:[(0,v.jsx)(d,{as:`h3`,size:`sm`,style:{marginBottom:`var(--base-spacing-8)`},children:`Standard card`}),(0,v.jsx)(h,{color:`muted`,children:`Full border, shadow and padding.`})]})]}),(0,v.jsxs)(`div`,{children:[(0,v.jsx)(h,{size:`xs`,color:`muted`,style:{marginBottom:`var(--base-spacing-8)`,textTransform:`uppercase`,letterSpacing:`0.05em`},children:`Bare`}),(0,v.jsxs)(l,{bare:!0,style:{width:280},children:[(0,v.jsx)(d,{as:`h3`,size:`sm`,style:{marginBottom:`var(--base-spacing-8)`},children:`Bare card`}),(0,v.jsx)(h,{color:`muted`,children:`No border, shadow or padding — just structure.`})]})]})]})},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: "With small icon",
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
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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
}`,...S.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  name: "Big icon",
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
      heroIcon,
      heroColor,
      label,
      body
    }) => <Card key={label} heroIcon={heroIcon} heroColor={heroColor} style={{
      width: 240
    }}>
          <Heading as="h3" size="sm" style={{
        marginBottom: "var(--base-spacing-8)"
      }}>{label}</Heading>
          <Paragraph size="sm" color="muted">{body}</Paragraph>
        </Card>)}
    </div>
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}},k=[`Configurable`,`WithSmallIcon`,`Navigation`,`BigIcon`,`WithActions`,`ReadMore`,`Bare`]}))();export{O as Bare,w as BigIcon,b as Configurable,S as Navigation,D as ReadMore,T as WithActions,x as WithSmallIcon,k as __namedExportsOrder,y as default};