import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{T as n,r}from"./iframe-DZoRqkgT.js";import{n as i,t as a}from"./Icon-L8cqvGUg.js";import{i as o,r as s,t as c}from"./icon-controls-BKzEgQc5.js";var l,u,d,f,p,m,h,g,_,v;e((()=>{l=t(n(),1),i(),s(),u=r(),d={weight:{control:{type:`range`,min:100,max:700,step:100},description:`Stroke weight (100–700)`},grade:{control:{type:`range`,min:-50,max:200,step:25},description:`Grade — fine-tunes weight without affecting space (-50–200)`},opticalSize:{control:{type:`select`},options:[20,24,40,48],description:`Optical size — should match rendered px size for sharpest rendering`},fill:{control:`select`,options:[null,0,1],labels:{null:`Theme default`,0:`Outlined (0)`,1:`Filled (1)`},description:`Fill — null lets the active theme decide (a1Light=outlined, a1Accessible=filled)`}},f={title:`Foundations/Icon`,component:a,tags:[`autodocs`],args:{name:`star`,weight:400,grade:0,opticalSize:24,fill:null},argTypes:{name:{...o(`A1 icon registry name`)},...d}},p={},m={parameters:{controls:{include:[`weight`,`grade`,`opticalSize`,`fill`]}},render:({weight:e,grade:t,opticalSize:n,fill:r})=>{let[i,o]=(0,l.useState)(``),[s,d]=(0,l.useState)(`star`),f=i?c.filter(e=>e.includes(i.toLowerCase().replace(/\s+/g,`_`))):c;return(0,u.jsxs)(`div`,{style:{width:680},children:[(0,u.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`12px`,marginBottom:`16px`},children:[(0,u.jsxs)(`div`,{style:{position:`relative`,flex:1},children:[(0,u.jsx)(`span`,{style:{position:`absolute`,left:`10px`,top:`50%`,transform:`translateY(-50%)`,fontSize:`18px`,color:`var(--semantic-color-text-muted)`,pointerEvents:`none`},children:(0,u.jsx)(a,{name:`search`,opticalSize:20})}),(0,u.jsx)(`input`,{type:`text`,value:i,onChange:e=>o(e.target.value),placeholder:`Search icons…`,style:{width:`100%`,boxSizing:`border-box`,height:`36px`,padding:`0 12px 0 36px`,border:`1px solid var(--semantic-color-border-default)`,borderRadius:`var(--base-radius-control)`,fontFamily:`var(--component-paragraph-font-family)`,fontSize:`var(--semantic-font-size-body-sm)`,color:`var(--semantic-color-text-default)`,background:`var(--semantic-color-surface-page)`,outline:`none`}})]}),(0,u.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`,padding:`6px 12px`,border:`1px solid var(--semantic-color-border-subtle)`,borderRadius:`var(--base-radius-control)`,background:`var(--semantic-color-surface-panel)`,flexShrink:0},children:[(0,u.jsx)(`span`,{style:{fontSize:`28px`,color:`var(--semantic-color-action-background)`},children:(0,u.jsx)(a,{name:s,weight:e,grade:t,opticalSize:n,fill:r})}),(0,u.jsx)(`span`,{style:{fontSize:`var(--semantic-font-size-body-xs)`,color:`var(--semantic-color-text-muted)`,fontFamily:`monospace`},children:s})]})]}),(0,u.jsxs)(`p`,{style:{margin:`0 0 12px`,fontSize:`var(--semantic-font-size-body-xs)`,color:`var(--semantic-color-text-muted)`},children:[f.length,` icon`,f.length===1?``:`s`,i?` matching "${i}"`:``]}),(0,u.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(76px, 1fr))`,gap:`4px`,maxHeight:`480px`,overflowY:`auto`},children:f.map(i=>(0,u.jsxs)(`button`,{type:`button`,onClick:()=>d(i),style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:`6px`,padding:`10px 6px`,border:`1px solid`,borderColor:i===s?`var(--semantic-color-action-background)`:`transparent`,borderRadius:`var(--base-radius-control)`,background:i===s?`var(--semantic-color-action-surface)`:`transparent`,cursor:`pointer`,color:`var(--semantic-color-text-default)`},children:[(0,u.jsx)(`span`,{style:{fontSize:`24px`},children:(0,u.jsx)(a,{name:i,weight:e,grade:t,opticalSize:n,fill:r})}),(0,u.jsx)(`span`,{style:{fontSize:`9px`,color:`var(--semantic-color-text-muted)`,textAlign:`center`,wordBreak:`break-all`,lineHeight:1.3,fontFamily:`monospace`},children:i})]},i))})]})}},h={name:`Font Variations`,parameters:{controls:{include:[]}},render:()=>{let e=(e,t)=>(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`8px`,marginBottom:`24px`},children:[(0,u.jsx)(`span`,{style:{fontSize:`var(--semantic-font-size-body-xs)`,color:`var(--semantic-color-text-muted)`,fontFamily:`var(--component-paragraph-font-family)`},children:e}),(0,u.jsx)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`4px`},children:t.map(({label:e,...t})=>(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:`4px`,minWidth:`52px`},children:[(0,u.jsx)(`span`,{style:{fontSize:`32px`},children:(0,u.jsx)(a,{name:`star`,...t})}),(0,u.jsx)(`span`,{style:{fontSize:`10px`,color:`var(--semantic-color-text-muted)`,fontFamily:`monospace`},children:e})]},e))})]});return(0,u.jsxs)(`div`,{style:{padding:`8px 0`},children:[e(`Weight (wght)`,[100,200,300,400,500,600,700].map(e=>({label:String(e),weight:e,opticalSize:32}))),e(`Grade (GRAD)`,[-50,-25,0,50,100,150,200].map(e=>({label:String(e),grade:e,opticalSize:32}))),e(`Fill (FILL)`,[{label:`0 (outlined)`,fill:0,opticalSize:32},{label:`1 (filled)`,fill:1,opticalSize:32}]),e(`Optical Size (opsz)`,[20,24,40,48].map(e=>({label:`${e}px`,opticalSize:e})))]})}},g={name:`Size — inherits from parent`,parameters:{controls:{include:[`weight`,`grade`,`fill`]}},render:({weight:e,grade:t,fill:n})=>(0,u.jsx)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`24px`},children:[16,20,24,32,40,48].map(r=>(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:`6px`},children:[(0,u.jsx)(`span`,{style:{fontSize:r},children:(0,u.jsx)(a,{name:`star`,weight:e,grade:t,opticalSize:r,fill:n})}),(0,u.jsxs)(`span`,{style:{fontSize:`11px`,color:`var(--semantic-color-text-muted)`},children:[r,`px`]})]},r))})},_={name:`Color — inherits from parent`,parameters:{controls:{include:[`weight`,`grade`,`opticalSize`,`fill`]}},render:({weight:e,grade:t,opticalSize:n,fill:r})=>(0,u.jsx)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`20px`,fontSize:`32px`},children:[{color:`var(--semantic-color-text-default)`,label:`default`},{color:`var(--semantic-color-text-muted)`,label:`muted`},{color:`var(--semantic-color-action-background)`,label:`action`},{color:`var(--semantic-color-status-error-background)`,label:`error`},{color:`var(--semantic-color-status-success-background)`,label:`success`},{color:`var(--semantic-color-status-warn-background)`,label:`warn`}].map(({color:i,label:o})=>(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:`6px`},children:[(0,u.jsx)(`span`,{style:{color:i},children:(0,u.jsx)(a,{name:`favorite`,weight:e,grade:t,opticalSize:n,fill:r})}),(0,u.jsx)(`span`,{style:{fontSize:`11px`,color:`var(--semantic-color-text-muted)`},children:o})]},o))})},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      include: ["weight", "grade", "opticalSize", "fill"]
    }
  },
  render: ({
    weight,
    grade,
    opticalSize,
    fill
  }) => {
    const [query, setQuery] = useState("");
    const [active, setActive] = useState("star");
    const filtered = query ? ICON_OPTIONS.filter(n => n.includes(query.toLowerCase().replace(/\\s+/g, "_"))) : ICON_OPTIONS;
    return <div style={{
      width: 680
    }}>
        {/* Search bar + preview */}
        <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "16px"
      }}>
          <div style={{
          position: "relative",
          flex: 1
        }}>
            <span style={{
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "18px",
            color: "var(--semantic-color-text-muted)",
            pointerEvents: "none"
          }}>
              <Icon name="search" opticalSize={20} />
            </span>
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search icons…" style={{
            width: "100%",
            boxSizing: "border-box",
            height: "36px",
            padding: "0 12px 0 36px",
            border: "1px solid var(--semantic-color-border-default)",
            borderRadius: "var(--base-radius-control)",
            fontFamily: "var(--component-paragraph-font-family)",
            fontSize: "var(--semantic-font-size-body-sm)",
            color: "var(--semantic-color-text-default)",
            background: "var(--semantic-color-surface-page)",
            outline: "none"
          }} />
          </div>
          <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 12px",
          border: "1px solid var(--semantic-color-border-subtle)",
          borderRadius: "var(--base-radius-control)",
          background: "var(--semantic-color-surface-panel)",
          flexShrink: 0
        }}>
            <span style={{
            fontSize: "28px",
            color: "var(--semantic-color-action-background)"
          }}>
              <Icon name={active} weight={weight} grade={grade} opticalSize={opticalSize} fill={fill} />
            </span>
            <span style={{
            fontSize: "var(--semantic-font-size-body-xs)",
            color: "var(--semantic-color-text-muted)",
            fontFamily: "monospace"
          }}>
              {active}
            </span>
          </div>
        </div>

        {/* Results count */}
        <p style={{
        margin: "0 0 12px",
        fontSize: "var(--semantic-font-size-body-xs)",
        color: "var(--semantic-color-text-muted)"
      }}>
          {filtered.length} icon{filtered.length !== 1 ? "s" : ""}
          {query ? \` matching "\${query}"\` : ""}
        </p>

        {/* Icon grid */}
        <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(76px, 1fr))",
        gap: "4px",
        maxHeight: "480px",
        overflowY: "auto"
      }}>
          {filtered.map(name => <button key={name} type="button" onClick={() => setActive(name)} style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          padding: "10px 6px",
          border: "1px solid",
          borderColor: name === active ? "var(--semantic-color-action-background)" : "transparent",
          borderRadius: "var(--base-radius-control)",
          background: name === active ? "var(--semantic-color-action-surface)" : "transparent",
          cursor: "pointer",
          color: "var(--semantic-color-text-default)"
        }}>
              <span style={{
            fontSize: "24px"
          }}>
                <Icon name={name} weight={weight} grade={grade} opticalSize={opticalSize} fill={fill} />
              </span>
              <span style={{
            fontSize: "9px",
            color: "var(--semantic-color-text-muted)",
            textAlign: "center",
            wordBreak: "break-all",
            lineHeight: 1.3,
            fontFamily: "monospace"
          }}>
                {name}
              </span>
            </button>)}
        </div>
      </div>;
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  name: "Font Variations",
  parameters: {
    controls: {
      include: []
    }
  },
  render: () => {
    const icon = "star";
    const row = (label, icons) => <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      marginBottom: "24px"
    }}>
        <span style={{
        fontSize: "var(--semantic-font-size-body-xs)",
        color: "var(--semantic-color-text-muted)",
        fontFamily: "var(--component-paragraph-font-family)"
      }}>
          {label}
        </span>
        <div style={{
        display: "flex",
        alignItems: "center",
        gap: "4px"
      }}>
          {icons.map(({
          label: l,
          ...props
        }) => <div key={l} style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          minWidth: "52px"
        }}>
              <span style={{
            fontSize: "32px"
          }}>
                <Icon name={icon} {...props} />
              </span>
              <span style={{
            fontSize: "10px",
            color: "var(--semantic-color-text-muted)",
            fontFamily: "monospace"
          }}>{l}</span>
            </div>)}
        </div>
      </div>;
    return <div style={{
      padding: "8px 0"
    }}>
        {row("Weight (wght)", [100, 200, 300, 400, 500, 600, 700].map(w => ({
        label: String(w),
        weight: w,
        opticalSize: 32
      })))}
        {row("Grade (GRAD)", [-50, -25, 0, 50, 100, 150, 200].map(g => ({
        label: String(g),
        grade: g,
        opticalSize: 32
      })))}
        {row("Fill (FILL)", [{
        label: "0 (outlined)",
        fill: 0,
        opticalSize: 32
      }, {
        label: "1 (filled)",
        fill: 1,
        opticalSize: 32
      }])}
        {row("Optical Size (opsz)", [20, 24, 40, 48].map(o => ({
        label: \`\${o}px\`,
        opticalSize: o
      })))}
      </div>;
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: "Size — inherits from parent",
  parameters: {
    controls: {
      include: ["weight", "grade", "fill"]
    }
  },
  render: ({
    weight,
    grade,
    fill
  }) => <div style={{
    display: "flex",
    alignItems: "center",
    gap: "24px"
  }}>
      {[16, 20, 24, 32, 40, 48].map(size => <div key={size} style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "6px"
    }}>
          <span style={{
        fontSize: size
      }}>
            <Icon name="star" weight={weight} grade={grade} opticalSize={size} fill={fill} />
          </span>
          <span style={{
        fontSize: "11px",
        color: "var(--semantic-color-text-muted)"
      }}>{size}px</span>
        </div>)}
    </div>
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: "Color — inherits from parent",
  parameters: {
    controls: {
      include: ["weight", "grade", "opticalSize", "fill"]
    }
  },
  render: ({
    weight,
    grade,
    opticalSize,
    fill
  }) => <div style={{
    display: "flex",
    alignItems: "center",
    gap: "20px",
    fontSize: "32px"
  }}>
      {[{
      color: "var(--semantic-color-text-default)",
      label: "default"
    }, {
      color: "var(--semantic-color-text-muted)",
      label: "muted"
    }, {
      color: "var(--semantic-color-action-background)",
      label: "action"
    }, {
      color: "var(--semantic-color-status-error-background)",
      label: "error"
    }, {
      color: "var(--semantic-color-status-success-background)",
      label: "success"
    }, {
      color: "var(--semantic-color-status-warn-background)",
      label: "warn"
    }].map(({
      color,
      label
    }) => <div key={label} style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "6px"
    }}>
          <span style={{
        color
      }}>
            <Icon name="favorite" weight={weight} grade={grade} opticalSize={opticalSize} fill={fill} />
          </span>
          <span style={{
        fontSize: "11px",
        color: "var(--semantic-color-text-muted)"
      }}>{label}</span>
        </div>)}
    </div>
}`,..._.parameters?.docs?.source}}},v=[`Configurable`,`Explorer`,`FontVariations`,`SizeInheritance`,`ColorInheritance`]}))();export{_ as ColorInheritance,p as Configurable,m as Explorer,h as FontVariations,g as SizeInheritance,v as __namedExportsOrder,f as default};