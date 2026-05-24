import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./iframe-CN7ekW17.js";import{n,t as r}from"./Button-CyEQecRR.js";import{n as i,t as a}from"./Icon-C8O5iL0V.js";var o=e((()=>{}));function s(e,t){return e>=1e6?+(e/1e6).toFixed(1)+`M`:e>=1e3?+(e/1e3).toFixed(1)+`k`:e>t?`${t}+`:String(e)}function c({children:e,count:t,label:n,dot:r=!1,variant:i=`default`,position:a=`top-right`,max:o=99}){let c=u.includes(i)?i:`default`,f=d.includes(a)?a:`top-right`,p=r||t===void 0&&n===void 0,m=null;return p||(m=t===void 0?n:s(t,o)),(0,l.jsxs)(`span`,{className:`a1-notification-root`,children:[e,(0,l.jsx)(`span`,{className:[`a1-notification`,`a1-notification--${c}`,`a1-notification--${f}`,p&&`a1-notification--dot`].filter(Boolean).join(` `),"aria-label":t===void 0?void 0:`${t} notifications`,children:m})]})}var l,u,d,f=e((()=>{o(),l=t(),u=[`default`,`error`,`success`,`warn`,`info`],d=[`top-right`,`top-left`,`bottom-right`,`bottom-left`],c.__docgenInfo={description:``,methods:[],displayName:`Notification`,props:{dot:{defaultValue:{value:`false`,computed:!1},required:!1},variant:{defaultValue:{value:`"default"`,computed:!1},required:!1},position:{defaultValue:{value:`"top-right"`,computed:!1},required:!1},max:{defaultValue:{value:`99`,computed:!1},required:!1}}}})),p,m,h,g,_,v,y,b,x;e((()=>{f(),n(),i(),p=t(),m={title:`Components/Messaging/Notification`,component:c,tags:[`autodocs`],args:{count:5,variant:`error`,position:`top-right`,max:99,dot:!1},argTypes:{count:{control:{type:`number`},description:`Numeric count — takes priority over label`},label:{control:`text`,description:`Short text label — used when count is not set`},dot:{control:`boolean`,description:`Show a dot with no content`},variant:{control:`inline-radio`,options:[`default`,`error`,`success`,`warn`,`info`]},position:{control:`select`,options:[`top-right`,`top-left`,`bottom-right`,`bottom-left`]},max:{control:{type:`number`},description:`Count above this value shows as {max}+`}},render:e=>(0,p.jsx)(`div`,{style:{padding:`var(--base-spacing-24)`},children:(0,p.jsx)(c,{...e,children:(0,p.jsx)(`span`,{style:{fontSize:`28px`,display:`inline-flex`},children:(0,p.jsx)(a,{name:`notifications`,opticalSize:24})})})})},h={},g={name:`On icon`,parameters:{controls:{include:[`variant`,`position`,`dot`,`max`]}},render:e=>(0,p.jsxs)(`div`,{style:{display:`flex`,gap:`var(--base-spacing-64)`,alignItems:`center`,padding:`var(--base-spacing-40)`},children:[(0,p.jsx)(c,{...e,count:3,children:(0,p.jsx)(`span`,{style:{fontSize:`28px`,display:`inline-flex`},children:(0,p.jsx)(a,{name:`notifications`,opticalSize:24})})}),(0,p.jsx)(c,{...e,count:12,children:(0,p.jsx)(`span`,{style:{fontSize:`28px`,display:`inline-flex`},children:(0,p.jsx)(a,{name:`mail`,opticalSize:24})})}),(0,p.jsx)(c,{...e,count:128,children:(0,p.jsx)(`span`,{style:{fontSize:`28px`,display:`inline-flex`},children:(0,p.jsx)(a,{name:`chat`,opticalSize:24})})}),(0,p.jsx)(c,{...e,dot:!0,children:(0,p.jsx)(`span`,{style:{fontSize:`28px`,display:`inline-flex`},children:(0,p.jsx)(a,{name:`account_circle`,opticalSize:24})})})]})},_={name:`On button`,parameters:{controls:{include:[`variant`,`position`,`dot`,`max`]}},render:e=>(0,p.jsxs)(`div`,{style:{display:`flex`,gap:`var(--base-spacing-40)`,alignItems:`center`,padding:`var(--base-spacing-40)`,flexWrap:`wrap`},children:[(0,p.jsx)(c,{...e,count:4,children:(0,p.jsx)(r,{variant:`secondary`,icon:`notifications`,children:`Notifications`})}),(0,p.jsx)(c,{...e,count:21,children:(0,p.jsx)(r,{variant:`secondary`,icon:`mail`,children:`Messages`})}),(0,p.jsx)(c,{...e,dot:!0,children:(0,p.jsx)(r,{variant:`primary`,children:`Updates`})})]})},v={parameters:{controls:{include:[`count`,`position`,`dot`,`max`]}},render:e=>(0,p.jsx)(`div`,{style:{display:`flex`,gap:`var(--base-spacing-64)`,alignItems:`center`,padding:`var(--base-spacing-40)`,flexWrap:`wrap`},children:[`default`,`error`,`success`,`warn`,`info`].map(t=>(0,p.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:`var(--base-spacing-12)`},children:[(0,p.jsx)(c,{...e,variant:t,children:(0,p.jsx)(`span`,{style:{fontSize:`28px`,display:`inline-flex`},children:(0,p.jsx)(a,{name:`notifications`,opticalSize:24})})}),(0,p.jsx)(`span`,{style:{fontSize:`var(--semantic-font-size-body-xs)`,color:`var(--semantic-color-text-muted)`,fontFamily:`var(--component-paragraph-font-family)`},children:t})]},t))})},y={name:`Count overflow`,parameters:{controls:{include:[`variant`,`max`]}},render:e=>(0,p.jsx)(`div`,{style:{display:`flex`,gap:`var(--base-spacing-64)`,alignItems:`center`,padding:`var(--base-spacing-40)`,flexWrap:`wrap`},children:[1,42,99,100,1e3,1500,1e4,1e6,99e6].map(t=>(0,p.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:`var(--base-spacing-12)`},children:[(0,p.jsx)(c,{...e,count:t,children:(0,p.jsx)(`span`,{style:{fontSize:`28px`,display:`inline-flex`},children:(0,p.jsx)(a,{name:`notifications`,opticalSize:24})})}),(0,p.jsx)(`span`,{style:{fontSize:`var(--semantic-font-size-body-xs)`,color:`var(--semantic-color-text-muted)`,fontFamily:`var(--component-paragraph-font-family)`},children:t})]},t))})},b={parameters:{controls:{include:[`variant`,`count`,`dot`]}},render:e=>(0,p.jsx)(`div`,{style:{display:`flex`,gap:`var(--base-spacing-64)`,alignItems:`center`,padding:`var(--base-spacing-40)`,flexWrap:`wrap`},children:[`top-right`,`top-left`,`bottom-right`,`bottom-left`].map(t=>(0,p.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:`var(--base-spacing-12)`},children:[(0,p.jsx)(c,{...e,position:t,children:(0,p.jsx)(`span`,{style:{fontSize:`28px`,display:`inline-flex`},children:(0,p.jsx)(a,{name:`star`,opticalSize:24})})}),(0,p.jsx)(`span`,{style:{fontSize:`var(--semantic-font-size-body-xs)`,color:`var(--semantic-color-text-muted)`,fontFamily:`var(--component-paragraph-font-family)`},children:t})]},t))})},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: "On icon",
  parameters: {
    controls: {
      include: ["variant", "position", "dot", "max"]
    }
  },
  render: args => <div style={{
    display: "flex",
    gap: "var(--base-spacing-64)",
    alignItems: "center",
    padding: "var(--base-spacing-40)"
  }}>
      <Notification {...args} count={3}>
        <span style={{
        fontSize: "28px",
        display: "inline-flex"
      }}>
          <Icon name="notifications" opticalSize={24} />
        </span>
      </Notification>
      <Notification {...args} count={12}>
        <span style={{
        fontSize: "28px",
        display: "inline-flex"
      }}>
          <Icon name="mail" opticalSize={24} />
        </span>
      </Notification>
      <Notification {...args} count={128}>
        <span style={{
        fontSize: "28px",
        display: "inline-flex"
      }}>
          <Icon name="chat" opticalSize={24} />
        </span>
      </Notification>
      <Notification {...args} dot>
        <span style={{
        fontSize: "28px",
        display: "inline-flex"
      }}>
          <Icon name="account_circle" opticalSize={24} />
        </span>
      </Notification>
    </div>
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: "On button",
  parameters: {
    controls: {
      include: ["variant", "position", "dot", "max"]
    }
  },
  render: args => <div style={{
    display: "flex",
    gap: "var(--base-spacing-40)",
    alignItems: "center",
    padding: "var(--base-spacing-40)",
    flexWrap: "wrap"
  }}>
      <Notification {...args} count={4}>
        <Button variant="secondary" icon="notifications">Notifications</Button>
      </Notification>
      <Notification {...args} count={21}>
        <Button variant="secondary" icon="mail">Messages</Button>
      </Notification>
      <Notification {...args} dot>
        <Button variant="primary">Updates</Button>
      </Notification>
    </div>
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      include: ["count", "position", "dot", "max"]
    }
  },
  render: args => <div style={{
    display: "flex",
    gap: "var(--base-spacing-64)",
    alignItems: "center",
    padding: "var(--base-spacing-40)",
    flexWrap: "wrap"
  }}>
      {["default", "error", "success", "warn", "info"].map(variant => <div key={variant} style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "var(--base-spacing-12)"
    }}>
          <Notification {...args} variant={variant}>
            <span style={{
          fontSize: "28px",
          display: "inline-flex"
        }}>
              <Icon name="notifications" opticalSize={24} />
            </span>
          </Notification>
          <span style={{
        fontSize: "var(--semantic-font-size-body-xs)",
        color: "var(--semantic-color-text-muted)",
        fontFamily: "var(--component-paragraph-font-family)"
      }}>
            {variant}
          </span>
        </div>)}
    </div>
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: "Count overflow",
  parameters: {
    controls: {
      include: ["variant", "max"]
    }
  },
  render: args => <div style={{
    display: "flex",
    gap: "var(--base-spacing-64)",
    alignItems: "center",
    padding: "var(--base-spacing-40)",
    flexWrap: "wrap"
  }}>
      {[1, 42, 99, 100, 1000, 1500, 10000, 1000000, 99000000].map(count => <div key={count} style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "var(--base-spacing-12)"
    }}>
          <Notification {...args} count={count}>
            <span style={{
          fontSize: "28px",
          display: "inline-flex"
        }}>
              <Icon name="notifications" opticalSize={24} />
            </span>
          </Notification>
          <span style={{
        fontSize: "var(--semantic-font-size-body-xs)",
        color: "var(--semantic-color-text-muted)",
        fontFamily: "var(--component-paragraph-font-family)"
      }}>
            {count}
          </span>
        </div>)}
    </div>
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      include: ["variant", "count", "dot"]
    }
  },
  render: args => <div style={{
    display: "flex",
    gap: "var(--base-spacing-64)",
    alignItems: "center",
    padding: "var(--base-spacing-40)",
    flexWrap: "wrap"
  }}>
      {["top-right", "top-left", "bottom-right", "bottom-left"].map(position => <div key={position} style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "var(--base-spacing-12)"
    }}>
          <Notification {...args} position={position}>
            <span style={{
          fontSize: "28px",
          display: "inline-flex"
        }}>
              <Icon name="star" opticalSize={24} />
            </span>
          </Notification>
          <span style={{
        fontSize: "var(--semantic-font-size-body-xs)",
        color: "var(--semantic-color-text-muted)",
        fontFamily: "var(--component-paragraph-font-family)"
      }}>
            {position}
          </span>
        </div>)}
    </div>
}`,...b.parameters?.docs?.source}}},x=[`Configurable`,`OnIcon`,`OnButton`,`Variants`,`Overflow`,`Positions`]}))();export{h as Configurable,_ as OnButton,g as OnIcon,y as Overflow,b as Positions,v as Variants,x as __namedExportsOrder,m as default};