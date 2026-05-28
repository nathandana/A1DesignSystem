import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./iframe-BwSdWSBC.js";import{n,t as r}from"./Icon-XRhQqhD4.js";import{n as i,t as a}from"./Button-C1gAzzoD.js";import{n as o,t as s}from"./Notification-DRGneXys.js";var c,l,u,d,f,p,m,h,g;e((()=>{o(),i(),n(),c=t(),l={title:`Components/Messaging/Notification`,component:s,tags:[`autodocs`],args:{count:5,variant:`error`,position:`top-right`,max:99,dot:!1},argTypes:{count:{control:{type:`number`},description:`Numeric count — takes priority over label`},label:{control:`text`,description:`Short text label — used when count is not set`},dot:{control:`boolean`,description:`Show a dot with no content`},variant:{control:`inline-radio`,options:[`default`,`error`,`success`,`warn`,`info`]},position:{control:`select`,options:[`top-right`,`top-left`,`bottom-right`,`bottom-left`]},max:{control:{type:`number`},description:`Count above this value shows as {max}+`}},render:e=>(0,c.jsx)(`div`,{style:{padding:`var(--base-spacing-24)`},children:(0,c.jsx)(s,{...e,children:(0,c.jsx)(`span`,{style:{fontSize:`28px`,display:`inline-flex`},children:(0,c.jsx)(r,{name:`notifications`,opticalSize:24})})})})},u={},d={name:`On icon`,parameters:{controls:{include:[`variant`,`position`,`dot`,`max`]}},render:e=>(0,c.jsxs)(`div`,{style:{display:`flex`,gap:`var(--base-spacing-64)`,alignItems:`center`,padding:`var(--base-spacing-40)`},children:[(0,c.jsx)(s,{...e,count:3,children:(0,c.jsx)(`span`,{style:{fontSize:`28px`,display:`inline-flex`},children:(0,c.jsx)(r,{name:`notifications`,opticalSize:24})})}),(0,c.jsx)(s,{...e,count:12,children:(0,c.jsx)(`span`,{style:{fontSize:`28px`,display:`inline-flex`},children:(0,c.jsx)(r,{name:`mail`,opticalSize:24})})}),(0,c.jsx)(s,{...e,count:128,children:(0,c.jsx)(`span`,{style:{fontSize:`28px`,display:`inline-flex`},children:(0,c.jsx)(r,{name:`chat`,opticalSize:24})})}),(0,c.jsx)(s,{...e,dot:!0,children:(0,c.jsx)(`span`,{style:{fontSize:`28px`,display:`inline-flex`},children:(0,c.jsx)(r,{name:`account_circle`,opticalSize:24})})})]})},f={name:`On button`,parameters:{controls:{include:[`variant`,`position`,`dot`,`max`]}},render:e=>(0,c.jsxs)(`div`,{style:{display:`flex`,gap:`var(--base-spacing-40)`,alignItems:`center`,padding:`var(--base-spacing-40)`,flexWrap:`wrap`},children:[(0,c.jsx)(s,{...e,count:4,children:(0,c.jsx)(a,{variant:`secondary`,icon:`notifications`,children:`Notifications`})}),(0,c.jsx)(s,{...e,count:21,children:(0,c.jsx)(a,{variant:`secondary`,icon:`mail`,children:`Messages`})}),(0,c.jsx)(s,{...e,dot:!0,children:(0,c.jsx)(a,{variant:`primary`,children:`Updates`})})]})},p={parameters:{controls:{include:[`count`,`position`,`dot`,`max`]}},render:e=>(0,c.jsx)(`div`,{style:{display:`flex`,gap:`var(--base-spacing-64)`,alignItems:`center`,padding:`var(--base-spacing-40)`,flexWrap:`wrap`},children:[`default`,`error`,`success`,`warn`,`info`].map(t=>(0,c.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:`var(--base-spacing-12)`},children:[(0,c.jsx)(s,{...e,variant:t,children:(0,c.jsx)(`span`,{style:{fontSize:`28px`,display:`inline-flex`},children:(0,c.jsx)(r,{name:`notifications`,opticalSize:24})})}),(0,c.jsx)(`span`,{style:{fontSize:`var(--semantic-font-size-body-xs)`,color:`var(--semantic-color-text-muted)`,fontFamily:`var(--component-paragraph-font-family)`},children:t})]},t))})},m={name:`Count overflow`,parameters:{controls:{include:[`variant`,`max`]}},render:e=>(0,c.jsx)(`div`,{style:{display:`flex`,gap:`var(--base-spacing-64)`,alignItems:`center`,padding:`var(--base-spacing-40)`,flexWrap:`wrap`},children:[1,42,99,100,1e3,1500,1e4,1e6,99e6].map(t=>(0,c.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:`var(--base-spacing-12)`},children:[(0,c.jsx)(s,{...e,count:t,children:(0,c.jsx)(`span`,{style:{fontSize:`28px`,display:`inline-flex`},children:(0,c.jsx)(r,{name:`notifications`,opticalSize:24})})}),(0,c.jsx)(`span`,{style:{fontSize:`var(--semantic-font-size-body-xs)`,color:`var(--semantic-color-text-muted)`,fontFamily:`var(--component-paragraph-font-family)`},children:t})]},t))})},h={parameters:{controls:{include:[`variant`,`count`,`dot`]}},render:e=>(0,c.jsx)(`div`,{style:{display:`flex`,gap:`var(--base-spacing-64)`,alignItems:`center`,padding:`var(--base-spacing-40)`,flexWrap:`wrap`},children:[`top-right`,`top-left`,`bottom-right`,`bottom-left`].map(t=>(0,c.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:`var(--base-spacing-12)`},children:[(0,c.jsx)(s,{...e,position:t,children:(0,c.jsx)(`span`,{style:{fontSize:`28px`,display:`inline-flex`},children:(0,c.jsx)(r,{name:`star`,opticalSize:24})})}),(0,c.jsx)(`span`,{style:{fontSize:`var(--semantic-font-size-body-xs)`,color:`var(--semantic-color-text-muted)`,fontFamily:`var(--component-paragraph-font-family)`},children:t})]},t))})},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}},g=[`Configurable`,`OnIcon`,`OnButton`,`Variants`,`Overflow`,`Positions`]}))();export{u as Configurable,f as OnButton,d as OnIcon,m as Overflow,h as Positions,p as Variants,g as __namedExportsOrder,l as default};