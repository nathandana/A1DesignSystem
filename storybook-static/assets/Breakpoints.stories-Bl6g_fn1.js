import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{C as n,t as r}from"./iframe-D1JN-_Xq.js";function i(){if(typeof window>`u`)return 0;let[e,t]=d.useState(window.innerWidth);return d.useEffect(()=>{let e=()=>t(window.innerWidth);return window.addEventListener(`resize`,e),()=>window.removeEventListener(`resize`,e)},[]),e}function a(e){return e<=480?`xs`:e<=640?`sm`:e<=1024?`md`:e<=1440?`lg`:`xl`}function o({viewportWidth:e}){let t=a(e);return(0,u.jsx)(`div`,{style:{display:`flex`,borderRadius:`10px`,overflow:`hidden`,height:`56px`,border:`1px solid var(--semantic-color-border-subtle)`},children:p.map((e,n)=>{let r=e.max?(Math.min(e.max,m)-e.min)/m*100:(m-e.min)/m*100,i=t===e.name;return(0,u.jsx)(`div`,{style:{width:`${r}%`,minWidth:0,background:i?g[n]:h[n],display:`flex`,alignItems:`center`,justifyContent:`center`,transition:`background 0.15s`,borderRight:n<p.length-1?`1px solid var(--semantic-color-border-subtle)`:`none`},children:(0,u.jsx)(`span`,{style:{fontSize:`0.75rem`,fontWeight:i?700:500,color:i?`var(--semantic-color-surface-page)`:`var(--semantic-color-text-muted)`,overflow:`hidden`,whiteSpace:`nowrap`},children:e.name})},e.name)})})}function s({viewportWidth:e}){let t=a(e);return(0,u.jsxs)(`div`,{style:{display:`inline-flex`,alignItems:`center`,gap:`10px`,background:`var(--semantic-color-surface-panel)`,border:`1px solid var(--semantic-color-border-subtle)`,borderRadius:`8px`,padding:`10px 16px`,marginBottom:`20px`},children:[(0,u.jsx)(`span`,{style:{fontSize:`0.8125rem`,color:`var(--semantic-color-text-muted)`},children:`Viewport`}),(0,u.jsxs)(`span`,{style:{fontFamily:`monospace`,fontSize:`0.875rem`,fontWeight:700,color:`var(--semantic-color-text-default)`},children:[e,`px`]}),(0,u.jsx)(`span`,{style:{fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`},children:`→`}),(0,u.jsx)(`span`,{style:{fontFamily:`monospace`,fontSize:`0.8125rem`,fontWeight:700,background:`var(--semantic-color-action-background)`,color:`var(--semantic-color-action-foreground)`,borderRadius:`4px`,padding:`2px 8px`},children:t})]})}function c({bp:e}){let t=e.min&&e.max?`(min-width: ${e.min}px) and (max-width: ${e.max}px)`:e.max?`(max-width: ${e.max}px)`:`(min-width: ${e.min}px)`,n=`(min-width: ${e.min}px)`,r=e.max?`(max-width: ${e.max}px)`:null;return(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`4px`},children:[(0,u.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,alignItems:`baseline`},children:[(0,u.jsx)(`span`,{style:{..._.mono,color:`var(--semantic-color-text-muted)`,width:`72px`,flexShrink:0},children:`only`}),(0,u.jsx)(`code`,{style:{..._.mono,color:`var(--semantic-color-text-default)`},children:t})]}),e.min>0&&(0,u.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,alignItems:`baseline`},children:[(0,u.jsx)(`span`,{style:{..._.mono,color:`var(--semantic-color-text-muted)`,width:`72px`,flexShrink:0},children:`up`}),(0,u.jsx)(`code`,{style:{..._.mono,color:`var(--semantic-color-text-default)`},children:n})]}),r&&(0,u.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,alignItems:`baseline`},children:[(0,u.jsx)(`span`,{style:{..._.mono,color:`var(--semantic-color-text-muted)`,width:`72px`,flexShrink:0},children:`down`}),(0,u.jsx)(`code`,{style:{..._.mono,color:`var(--semantic-color-text-default)`},children:r})]})]})}function l({bp:e}){let t=[];return e.min&&e.max?t.push(`--bp-${e.name}`,`--bp-${e.name}-up`,`--bp-${e.name}-down`):e.max?t.push(`--bp-${e.name}`,`--bp-${e.name}-down`):t.push(`--bp-${e.name}`,`--bp-${e.name}-up`),(0,u.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`3px`},children:t.map(e=>(0,u.jsxs)(`code`,{style:{..._.mono,color:`var(--semantic-color-action-background)`},children:[`@media (`,e,`)`]},e))})}var u,d,f,p,m,h,g,_,v,y;e((()=>{u=r(),d=t(n(),1),f={title:`Foundations/Breakpoints`,parameters:{layout:`fullscreen`,controls:{disable:!0}}},p=[{name:`xs`,min:0,max:480,minVar:null,maxVar:`--breakpoint-xs-max`},{name:`sm`,min:481,max:640,minVar:`--breakpoint-sm-min`,maxVar:`--breakpoint-sm-max`},{name:`md`,min:641,max:1024,minVar:`--breakpoint-md-min`,maxVar:`--breakpoint-md-max`},{name:`lg`,min:1025,max:1440,minVar:`--breakpoint-lg-min`,maxVar:`--breakpoint-lg-max`},{name:`xl`,min:1441,max:null,minVar:`--breakpoint-xl-min`,maxVar:null}],m=1600,h=[`var(--semantic-color-action-surface)`,`var(--semantic-color-status-info-surface)`,`var(--semantic-color-status-success-surface)`,`var(--semantic-color-status-warn-surface)`,`var(--semantic-color-status-error-surface)`],g=[`var(--semantic-color-action-border)`,`var(--semantic-color-status-info-border)`,`var(--semantic-color-status-success-border)`,`var(--semantic-color-status-warn-border)`,`var(--semantic-color-status-error-border)`],_={page:{padding:`40px 48px`,fontFamily:`Inter, ui-sans-serif, system-ui, sans-serif`,background:`var(--semantic-color-surface-page)`,color:`var(--semantic-color-text-default)`,minHeight:`100vh`},h1:{margin:`0 0 8px`,fontSize:`1.75rem`,fontWeight:700},lead:{margin:`0 0 40px`,fontSize:`0.875rem`,color:`var(--semantic-color-text-muted)`},h2:{margin:`0 0 4px`,fontSize:`0.75rem`,fontWeight:700,color:`var(--semantic-color-text-muted)`},divider:{margin:`8px 0 20px`,border:`none`,borderTop:`1px solid var(--semantic-color-border-subtle)`},section:{marginBottom:`48px`},table:{width:`100%`,borderCollapse:`collapse`,fontSize:`0.8125rem`},th:{padding:`8px 12px`,textAlign:`left`,fontWeight:600,fontSize:`0.75rem`,color:`var(--semantic-color-text-muted)`,borderBottom:`1px solid var(--semantic-color-border-subtle)`,background:`var(--semantic-color-surface-panel)`},td:{padding:`9px 12px`,borderBottom:`1px solid var(--semantic-color-border-subtle)`,verticalAlign:`middle`},mono:{fontFamily:`monospace`,fontSize:`0.75rem`}},v={name:`Breakpoints`,render:()=>{let e=i();return(0,u.jsxs)(`div`,{style:_.page,children:[(0,u.jsx)(`h1`,{style:_.h1,children:`Breakpoints`}),(0,u.jsxs)(`p`,{style:_.lead,children:[`Five viewport ranges defined as CSS custom properties and `,(0,u.jsx)(`code`,{style:_.mono,children:`@custom-media`}),` rules. CSS vars are in `,(0,u.jsx)(`code`,{style:_.mono,children:`tokens.css`}),`; `,(0,u.jsx)(`code`,{style:_.mono,children:`@custom-media`}),` rules are in `,(0,u.jsx)(`code`,{style:_.mono,children:`breakpoints.css`}),` (requires postcss-custom-media). Resize the Storybook preview to see the active breakpoint update.`]}),(0,u.jsxs)(`div`,{style:_.section,children:[(0,u.jsx)(`h2`,{style:_.h2,children:`Live viewport`}),(0,u.jsx)(`hr`,{style:_.divider}),(0,u.jsx)(s,{viewportWidth:e}),(0,u.jsx)(o,{viewportWidth:e})]}),(0,u.jsxs)(`div`,{style:_.section,children:[(0,u.jsx)(`h2`,{style:_.h2,children:`Reference`}),(0,u.jsx)(`hr`,{style:_.divider}),(0,u.jsxs)(`table`,{style:_.table,children:[(0,u.jsx)(`thead`,{children:(0,u.jsxs)(`tr`,{children:[(0,u.jsx)(`th`,{style:{..._.th,width:`60px`},children:`Name`}),(0,u.jsx)(`th`,{style:_.th,children:`Range`}),(0,u.jsx)(`th`,{style:_.th,children:`CSS custom properties`}),(0,u.jsx)(`th`,{style:_.th,children:`Raw media query`}),(0,u.jsx)(`th`,{style:_.th,children:`@custom-media name`})]})}),(0,u.jsx)(`tbody`,{children:p.map((e,t)=>(0,u.jsxs)(`tr`,{style:{background:t%2==0?`transparent`:`var(--semantic-color-surface-panel)`},children:[(0,u.jsx)(`td`,{style:_.td,children:(0,u.jsx)(`code`,{style:{..._.mono,fontWeight:700},children:e.name})}),(0,u.jsx)(`td`,{style:_.td,children:(0,u.jsxs)(`span`,{style:{..._.mono,color:`var(--semantic-color-text-muted)`},children:[e.min,`px – `,e.max?`${e.max}px`:`∞`]})}),(0,u.jsx)(`td`,{style:_.td,children:(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`3px`},children:[e.minVar&&(0,u.jsx)(`code`,{style:{..._.mono,color:`var(--semantic-color-text-default)`},children:e.minVar}),e.maxVar&&(0,u.jsx)(`code`,{style:{..._.mono,color:`var(--semantic-color-text-default)`},children:e.maxVar})]})}),(0,u.jsx)(`td`,{style:_.td,children:(0,u.jsx)(c,{bp:e})}),(0,u.jsx)(`td`,{style:_.td,children:(0,u.jsx)(l,{bp:e})})]},e.name))})]})]}),(0,u.jsxs)(`div`,{style:_.section,children:[(0,u.jsx)(`h2`,{style:_.h2,children:`Usage`}),(0,u.jsx)(`hr`,{style:_.divider}),(0,u.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:`24px`},children:[(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`p`,{style:{margin:`0 0 8px`,fontSize:`0.8125rem`,fontWeight:600,color:`var(--semantic-color-text-default)`},children:`CSS (with postcss-custom-media)`}),(0,u.jsx)(`pre`,{style:{margin:0,padding:`16px`,borderRadius:`8px`,background:`var(--semantic-color-surface-panel)`,border:`1px solid var(--semantic-color-border-subtle)`,fontSize:`0.75rem`,fontFamily:`monospace`,color:`var(--semantic-color-text-default)`,overflowX:`auto`},children:`@media (--bp-md-up) {
  .container { max-width: 1024px; }
}

@media (--bp-xs) {
  .sidebar { display: none; }
}`})]}),(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`p`,{style:{margin:`0 0 8px`,fontSize:`0.8125rem`,fontWeight:600,color:`var(--semantic-color-text-default)`},children:`JavaScript`}),(0,u.jsx)(`pre`,{style:{margin:0,padding:`16px`,borderRadius:`8px`,background:`var(--semantic-color-surface-panel)`,border:`1px solid var(--semantic-color-border-subtle)`,fontSize:`0.75rem`,fontFamily:`monospace`,color:`var(--semantic-color-text-default)`,overflowX:`auto`},children:`const mdMin = getComputedStyle(document.documentElement)
  .getPropertyValue("--breakpoint-md-min");
// → "641px"

const isMd = window.matchMedia(
  \`(min-width: \${mdMin})\`
).matches;`})]})]})]})]})}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: "Breakpoints",
  render: () => {
    const vw = useViewportWidth();
    return <div style={S.page}>
        <h1 style={S.h1}>Breakpoints</h1>
        <p style={S.lead}>
          Five viewport ranges defined as CSS custom properties and <code style={S.mono}>@custom-media</code> rules.
          CSS vars are in <code style={S.mono}>tokens.css</code>; <code style={S.mono}>@custom-media</code> rules are in <code style={S.mono}>breakpoints.css</code> (requires postcss-custom-media).
          Resize the Storybook preview to see the active breakpoint update.
        </p>

        {/* Live indicator */}
        <div style={S.section}>
          <h2 style={S.h2}>Live viewport</h2>
          <hr style={S.divider} />
          <ViewportIndicator viewportWidth={vw} />
          <ScaleBar viewportWidth={vw} />
        </div>

        {/* Reference table */}
        <div style={S.section}>
          <h2 style={S.h2}>Reference</h2>
          <hr style={S.divider} />
          <table style={S.table}>
            <thead>
              <tr>
                <th style={{
                ...S.th,
                width: "60px"
              }}>Name</th>
                <th style={S.th}>Range</th>
                <th style={S.th}>CSS custom properties</th>
                <th style={S.th}>Raw media query</th>
                <th style={S.th}>@custom-media name</th>
              </tr>
            </thead>
            <tbody>
              {BREAKPOINTS.map((bp, i) => <tr key={bp.name} style={{
              background: i % 2 === 0 ? "transparent" : "var(--semantic-color-surface-panel)"
            }}>
                  <td style={S.td}>
                    <code style={{
                  ...S.mono,
                  fontWeight: 700
                }}>{bp.name}</code>
                  </td>
                  <td style={S.td}>
                    <span style={{
                  ...S.mono,
                  color: "var(--semantic-color-text-muted)"
                }}>
                      {bp.min}px – {bp.max ? \`\${bp.max}px\` : "∞"}
                    </span>
                  </td>
                  <td style={S.td}>
                    <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "3px"
                }}>
                      {bp.minVar && <code style={{
                    ...S.mono,
                    color: "var(--semantic-color-text-default)"
                  }}>{bp.minVar}</code>}
                      {bp.maxVar && <code style={{
                    ...S.mono,
                    color: "var(--semantic-color-text-default)"
                  }}>{bp.maxVar}</code>}
                    </div>
                  </td>
                  <td style={S.td}>
                    <MediaQueryCell bp={bp} />
                  </td>
                  <td style={S.td}>
                    <CustomMediaCell bp={bp} />
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>

        {/* Usage note */}
        <div style={S.section}>
          <h2 style={S.h2}>Usage</h2>
          <hr style={S.divider} />
          <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px"
        }}>
            <div>
              <p style={{
              margin: "0 0 8px",
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "var(--semantic-color-text-default)"
            }}>
                CSS (with postcss-custom-media)
              </p>
              <pre style={{
              margin: 0,
              padding: "16px",
              borderRadius: "8px",
              background: "var(--semantic-color-surface-panel)",
              border: "1px solid var(--semantic-color-border-subtle)",
              fontSize: "0.75rem",
              fontFamily: "monospace",
              color: "var(--semantic-color-text-default)",
              overflowX: "auto"
            }}>{\`@media (--bp-md-up) {
  .container { max-width: 1024px; }
}

@media (--bp-xs) {
  .sidebar { display: none; }
}\`}</pre>
            </div>
            <div>
              <p style={{
              margin: "0 0 8px",
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "var(--semantic-color-text-default)"
            }}>
                JavaScript
              </p>
              <pre style={{
              margin: 0,
              padding: "16px",
              borderRadius: "8px",
              background: "var(--semantic-color-surface-panel)",
              border: "1px solid var(--semantic-color-border-subtle)",
              fontSize: "0.75rem",
              fontFamily: "monospace",
              color: "var(--semantic-color-text-default)",
              overflowX: "auto"
            }}>{\`const mdMin = getComputedStyle(document.documentElement)
  .getPropertyValue("--breakpoint-md-min");
// → "641px"

const isMd = window.matchMedia(
  \\\`(min-width: \\\${mdMin})\\\`
).matches;\`}</pre>
            </div>
          </div>
        </div>
      </div>;
  }
}`,...v.parameters?.docs?.source}}},y=[`Breakpoints`]}))();export{v as Breakpoints,y as __namedExportsOrder,f as default};