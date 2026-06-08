import{i as e}from"./preload-helper-Cs4UwXAW.js";import{t}from"./iframe-D8uQ9hre.js";import{n,t as r}from"./Bleed-rMuXT7sr.js";var i=e((()=>{}));function a({src:e,alt:t=``,caption:n,captionSrOnly:i=!1,captionPosition:a=`start`,radius:f,size:p,align:m,marginTop:h,marginBottom:g,bleed:_,className:v=``,imgClassName:y=``,style:b,imgStyle:x,...S}){let C=[`a1-figure`,f!=null&&s.includes(f)&&`a1-figure--rounded-${f}`,c.includes(a)&&a!==`start`&&`a1-figure--caption-${a}`,u.includes(p)&&`a1-figure--${p}`,d.includes(m)&&m!==`start`&&`a1-figure--align-${m}`,l.includes(h)&&`a1-figure--mt-${h}`,l.includes(g)&&`a1-figure--mb-${g}`,v].filter(Boolean).join(` `),w=[i?`a1-sr-only`:`a1-figure__caption`].join(` `),T=(0,o.jsxs)(`figure`,{className:C,style:b,...S,children:[(0,o.jsx)(`img`,{src:e,alt:t,className:[`a1-figure__img`,y].filter(Boolean).join(` `),style:x}),n&&(0,o.jsx)(`figcaption`,{className:w,children:n})]});return _?(0,o.jsx)(r,{inline:_===!0?void 0:_,children:T}):T}var o,s,c,l,u,d,f=e((()=>{i(),n(),o=t(),s=[`none`,`sm`,`md`,`lg`],c=[`start`,`center`],l=[`sm`,`md`,`lg`],u=[`xs`,`sm`,`md`,`lg`],d=[`start`,`center`,`end`],a.__docgenInfo={description:``,methods:[],displayName:`Figure`,props:{alt:{defaultValue:{value:`""`,computed:!1},required:!1},captionSrOnly:{defaultValue:{value:`false`,computed:!1},required:!1},captionPosition:{defaultValue:{value:`"start"`,computed:!1},required:!1},className:{defaultValue:{value:`""`,computed:!1},required:!1},imgClassName:{defaultValue:{value:`""`,computed:!1},required:!1}}}})),p,m,h,g,_,v,y,b,x,S;e((()=>{f(),p=t(),m=`https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80`,h=`https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80`,g={title:`Components/Media/Figure`,component:a,tags:[`autodocs`],parameters:{layout:`padded`},argTypes:{caption:{control:`text`},alt:{control:`text`},radius:{control:`select`,options:[`none`,`sm`,`md`,`lg`,void 0]},captionPosition:{control:`inline-radio`,options:[`start`,`center`]},size:{control:`select`,options:[`xs`,`sm`,`md`,`lg`,void 0]},align:{control:`inline-radio`,options:[`start`,`center`,`end`]}}},_={name:`Figure`,args:{src:m,alt:`Mountain landscape at sunset`,caption:`A scenic mountain landscape photographed at golden hour.`,radius:void 0,captionPosition:`start`},render:e=>(0,p.jsx)(`div`,{style:{maxWidth:640},children:(0,p.jsx)(a,{...e})})},v={name:`Without caption`,render:()=>(0,p.jsx)(`div`,{style:{maxWidth:640},children:(0,p.jsx)(a,{src:m,alt:`Mountain landscape`})})},y={name:`Caption — centered`,render:()=>(0,p.jsx)(`div`,{style:{maxWidth:640},children:(0,p.jsx)(a,{src:m,alt:`Mountain landscape`,caption:`Centered captions work well under full-width editorial images.`,captionPosition:`center`})})},b={name:`Radius scale`,render:()=>(0,p.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:32,maxWidth:480},children:[`none`,`sm`,`md`,`lg`].map(e=>(0,p.jsx)(a,{src:h,alt:`Office workspace`,caption:`radius="${e}"`,radius:e},e))})},x={name:`Size scale`,render:()=>(0,p.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:32},children:[`xs`,`sm`,`md`,`lg`].map(e=>(0,p.jsx)(a,{src:m,alt:`Mountain landscape`,caption:`size="${e}"`,size:e},e))})},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: "Figure",
  args: {
    src: SAMPLE_IMG,
    alt: "Mountain landscape at sunset",
    caption: "A scenic mountain landscape photographed at golden hour.",
    radius: undefined,
    captionPosition: "start"
  },
  render: args => <div style={{
    maxWidth: 640
  }}>
      <Figure {...args} />
    </div>
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: "Without caption",
  render: () => <div style={{
    maxWidth: 640
  }}>
      <Figure src={SAMPLE_IMG} alt="Mountain landscape" />
    </div>
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: "Caption — centered",
  render: () => <div style={{
    maxWidth: 640
  }}>
      <Figure src={SAMPLE_IMG} alt="Mountain landscape" caption="Centered captions work well under full-width editorial images." captionPosition="center" />
    </div>
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: "Radius scale",
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: 32,
    maxWidth: 480
  }}>
      {["none", "sm", "md", "lg"].map(r => <Figure key={r} src={SAMPLE_PORTRAIT} alt="Office workspace" caption={\`radius="\${r}"\`} radius={r} />)}
    </div>
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: "Size scale",
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: 32
  }}>
      {["xs", "sm", "md", "lg"].map(s => <Figure key={s} src={SAMPLE_IMG} alt="Mountain landscape" caption={\`size="\${s}"\`} size={s} />)}
    </div>
}`,...x.parameters?.docs?.source}}},S=[`Default`,`WithoutCaption`,`CaptionCentered`,`RadiusScale`,`SizeScale`]}))();export{y as CaptionCentered,_ as Default,b as RadiusScale,x as SizeScale,v as WithoutCaption,S as __namedExportsOrder,g as default};