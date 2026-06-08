import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{T as n,n as r,r as i,t as a}from"./iframe-DZoRqkgT.js";import{n as o,t as s}from"./IconButton-Btx-EITG.js";import{n as c,t as l}from"./Button-Clq9-j9U.js";import{n as u,t as d}from"./SelectField-CQaf4KTe.js";var f=e((()=>{}));function p(e,t,n){let r=t+n,i=e;for(;r<0;)r+=12,i--;for(;r>11;)r-=12,i++;return{year:i,month:r}}function m(e,t){return[...e.slice(t),...e.slice(0,t)]}function h(e,t,n=0){let r=new Date(e,t+1,0).getDate(),i=(new Date(e,t,1).getDay()-n+7)%7,a=[],o=Array(i).fill(null);for(let e=1;e<=r;e++)o.push(e),o.length===7&&(a.push(o),o=[]);if(o.length){for(;o.length<7;)o.push(null);a.push(o)}return a}function g({initialMonth:e,monthsToShow:t=13,highlightToday:n=!0,dimPast:i=!0,variant:a=`scroll`,todayButton:o=!1,className:c=``,...u}){let f=new Date,g=f.getFullYear(),y=f.getMonth(),b=f.getDate(),x=g,S=y;e instanceof Date?(x=e.getFullYear(),S=e.getMonth()):e&&typeof e==`object`&&(x=e.year,S=e.month-1);let[C,w]=(0,_.useState)(x),[T,E]=(0,_.useState)(S),D=(0,_.useRef)(null),O=r(`calendar.month.january`,`January`),k=r(`calendar.month.february`,`February`),A=r(`calendar.month.march`,`March`),j=r(`calendar.month.april`,`April`),M=r(`calendar.month.may`,`May`),ee=r(`calendar.month.june`,`June`),te=r(`calendar.month.july`,`July`),ne=r(`calendar.month.august`,`August`),re=r(`calendar.month.september`,`September`),ie=r(`calendar.month.october`,`October`),ae=r(`calendar.month.november`,`November`),oe=r(`calendar.month.december`,`December`),se=r(`calendar.weekday.sunday.full`,`Sunday`),ce=r(`calendar.weekday.monday.full`,`Monday`),N=r(`calendar.weekday.tuesday.full`,`Tuesday`),P=r(`calendar.weekday.wednesday.full`,`Wednesday`),F=r(`calendar.weekday.thursday.full`,`Thursday`),I=r(`calendar.weekday.friday.full`,`Friday`),L=r(`calendar.weekday.saturday.full`,`Saturday`),R=r(`calendar.weekday.sunday.short`,`Su`),z=r(`calendar.weekday.monday.short`,`Mo`),B=r(`calendar.weekday.tuesday.short`,`Tu`),V=r(`calendar.weekday.wednesday.short`,`We`),H=r(`calendar.weekday.thursday.short`,`Th`),U=r(`calendar.weekday.friday.short`,`Fr`),W=r(`calendar.weekday.saturday.short`,`Sa`),G=r(`calendar.weekday.sunday.letter`,`S`),le=r(`calendar.weekday.monday.letter`,`M`),ue=r(`calendar.weekday.tuesday.letter`,`T`),de=r(`calendar.weekday.wednesday.letter`,`W`),fe=r(`calendar.weekday.thursday.letter`,`T`),pe=r(`calendar.weekday.friday.letter`,`F`),me=r(`calendar.weekday.saturday.letter`,`S`),K=r(`calendar.previousMonth`,`Previous month`),q=r(`calendar.nextMonth`,`Next month`),he=r(`calendar.selectMonth`,`Month`),ge=r(`calendar.selectYear`,`Year`),J=r(`calendar.today`,`Today`),_e=r(`calendar.weekStart`,`0`),Y=r(`calendar.direction`,`ltr`),X=[O,k,A,j,M,ee,te,ne,re,ie,ae,oe],Z=parseInt(_e,10)||0,Q=Y===`rtl`,ve=m([se,ce,N,P,F,I,L],Z),ye=m([R,z,B,V,H,U,W],Z),be=m([G,le,ue,de,fe,pe,me],Z);(0,_.useEffect)(()=>{if(a!==`scroll`)return;let e=D.current;if(!e)return;let t=e.parentElement;for(;t&&t!==document.documentElement;){let e=window.getComputedStyle(t).overflowY;if(e===`auto`||e===`scroll`||e===`overlay`)break;t=t.parentElement}if(!t||t===document.documentElement)return;let n=t.getBoundingClientRect(),r=e.getBoundingClientRect();t.scrollTop+=r.top-n.top},[]);function $(e,t,r){let a=h(e,t,Z);return(0,v.jsxs)(`table`,{className:`a1-calendar__grid`,role:`grid`,"aria-label":`${X[t]} ${e}`,children:[(0,v.jsx)(`thead`,{className:`a1-calendar__thead`,children:(0,v.jsx)(`tr`,{children:ve.map((e,t)=>(0,v.jsxs)(`th`,{className:`a1-calendar__weekday`,scope:`col`,abbr:e,children:[(0,v.jsx)(`span`,{className:`a1-calendar__weekday-label a1-calendar__weekday-label--long`,children:e.slice(0,3)}),(0,v.jsx)(`span`,{className:`a1-calendar__weekday-label a1-calendar__weekday-label--short`,children:ye[t]}),(0,v.jsx)(`span`,{className:`a1-calendar__weekday-label a1-calendar__weekday-label--letter`,children:be[t]})]},e))})}),(0,v.jsx)(`tbody`,{children:a.map((a,o)=>(0,v.jsx)(`tr`,{className:`a1-calendar__week`,children:a.map((a,s)=>{if(a===null)return(0,v.jsx)(`td`,{className:[`a1-calendar__day`,`a1-calendar__day--empty`,o===0&&r&&`a1-calendar__day--past`].filter(Boolean).join(` `),"aria-hidden":`true`},s);let c=n&&e===g&&t===y&&a===b,l=i&&new Date(e,t,a)<new Date(g,y,b);return(0,v.jsx)(`td`,{className:[`a1-calendar__day`,c&&`a1-calendar__day--today`,l&&`a1-calendar__day--past`].filter(Boolean).join(` `),"aria-current":c?`date`:void 0,children:(0,v.jsx)(`span`,{className:`a1-calendar__day-number`,"aria-hidden":`true`,children:a})},s)})},o))})]})}if(a===`paginated`){let e=g-10,t=g+15,n=Array.from({length:t-e+1},(t,n)=>e+n),r=()=>{let e=p(C,T,-1);w(e.year),E(e.month)},a=()=>{let e=p(C,T,1);w(e.year),E(e.month)},f=()=>{w(g),E(y)},m=C===g&&T===y,h=i&&new Date(C,T,1)<=new Date(g,y,b);return(0,v.jsx)(`div`,{className:[`a1-calendar`,`a1-calendar--paginated`,c].filter(Boolean).join(` `),...u,children:(0,v.jsxs)(`div`,{className:`a1-calendar__inner`,children:[(0,v.jsxs)(`div`,{className:`a1-calendar__nav`,children:[(0,v.jsx)(`span`,{className:`a1-calendar__nav-wide`,children:(0,v.jsx)(l,{variant:`tertiary`,size:`sm`,icon:Q?`chevron_right`:`chevron_left`,iconPosition:`start`,onClick:r,children:K})}),(0,v.jsx)(`span`,{className:`a1-calendar__nav-narrow`,children:(0,v.jsx)(s,{icon:Q?`chevron_right`:`chevron_left`,label:K,variant:`tertiary`,onClick:r})}),(0,v.jsxs)(`div`,{className:`a1-calendar__nav-label`,children:[(0,v.jsx)(d,{className:`a1-calendar__nav-field`,size:`compact`,"aria-label":he,value:T,onChange:e=>E(Number(e.target.value)),children:X.map((e,t)=>(0,v.jsx)(`option`,{value:t,children:e},t))}),(0,v.jsx)(d,{className:`a1-calendar__nav-field`,size:`compact`,"aria-label":ge,value:C,onChange:e=>w(Number(e.target.value)),children:n.map(e=>(0,v.jsx)(`option`,{value:e,children:e},e))}),o&&(0,v.jsxs)(`div`,{className:`a1-calendar__nav-today`,children:[(0,v.jsx)(`span`,{className:`a1-calendar__nav-wide`,children:(0,v.jsx)(l,{variant:`secondary`,size:`sm`,onClick:f,disabled:m,children:J})}),(0,v.jsx)(`span`,{className:`a1-calendar__nav-narrow`,children:(0,v.jsx)(s,{icon:`calendar_today`,label:J,variant:`secondary`,onClick:f,disabled:m})})]})]}),(0,v.jsx)(`span`,{className:`a1-calendar__nav-wide`,children:(0,v.jsx)(l,{variant:`tertiary`,size:`sm`,icon:Q?`chevron_left`:`chevron_right`,iconPosition:`end`,onClick:a,children:q})}),(0,v.jsx)(`span`,{className:`a1-calendar__nav-narrow`,children:(0,v.jsx)(s,{icon:Q?`chevron_left`:`chevron_right`,label:q,variant:`tertiary`,onClick:a})})]}),$(C,T,h)]})})}let xe=Math.floor(t/2),Se=Array.from({length:t},(e,t)=>p(x,S,t-xe));return(0,v.jsx)(`div`,{className:[`a1-calendar`,c].filter(Boolean).join(` `),...u,children:(0,v.jsx)(`div`,{className:`a1-calendar__inner`,children:Se.map(({year:e,month:t})=>{let n=e===g&&t===y,r=i&&new Date(e,t,1)<=new Date(g,y,b);return(0,v.jsxs)(`section`,{className:[`a1-calendar__month`,n&&`a1-calendar__month--current`].filter(Boolean).join(` `),ref:n?D:void 0,children:[(0,v.jsxs)(`h2`,{className:`a1-calendar__month-heading`,children:[(0,v.jsx)(`span`,{className:`a1-calendar__month-name`,children:X[t]}),(0,v.jsx)(`span`,{className:`a1-calendar__year`,children:e})]}),$(e,t,r)]},`${e}-${t}`)})})})}var _,v,y=e((()=>{_=t(n(),1),c(),o(),u(),a(),f(),v=i(),g.__docgenInfo={description:``,methods:[],displayName:`Calendar`,props:{monthsToShow:{defaultValue:{value:`13`,computed:!1},required:!1},highlightToday:{defaultValue:{value:`true`,computed:!1},required:!1},dimPast:{defaultValue:{value:`true`,computed:!1},required:!1},variant:{defaultValue:{value:`"scroll"`,computed:!1},required:!1},todayButton:{defaultValue:{value:`false`,computed:!1},required:!1},className:{defaultValue:{value:`""`,computed:!1},required:!1}}}})),b,x,S,C,w,T,E,D,O,k,A,j,M;e((()=>{y(),b=i(),x={title:`Components/Data/Calendar`,component:g,tags:[`autodocs`],parameters:{layout:`padded`},args:{highlightToday:!0,dimPast:!0,monthsToShow:13},argTypes:{variant:{control:`inline-radio`,options:[`scroll`,`paginated`],description:`Display mode: vertical scroll through months, or single-month with prev/next navigation.`},highlightToday:{control:`boolean`,description:`Highlight today's date with the action colour.`},dimPast:{control:`boolean`,description:`Apply a background tint to dates before today.`},todayButton:{control:`boolean`,description:`Show a Today button in the paginated nav that jumps to the current month. Only applies to variant="paginated".`},monthsToShow:{control:{type:`number`,min:1,max:36},description:`Total number of months to render. Applies to scroll variant only.`},initialMonth:{control:!1,description:`Starting month. Accepts a Date or { year, month }.`}}},S={},C={name:`Paginated (single month)`,args:{variant:`paginated`}},w={name:`Paginated — with Today button`,args:{variant:`paginated`,todayButton:!0}},T={name:`Paginated — narrow container (< 480px)`,args:{variant:`paginated`},render:e=>(0,b.jsx)(`div`,{style:{width:`400px`},children:(0,b.jsx)(g,{...e})})},E={name:`No highlight, no fade`,args:{highlightToday:!1,dimPast:!1}},D={name:`Highlight today only`,args:{highlightToday:!0,dimPast:!1}},O={name:`Specific initial month`,args:{initialMonth:{year:2025,month:1},monthsToShow:3}},k={name:`Narrow container (< 480px)`,args:{monthsToShow:3},render:e=>(0,b.jsx)(`div`,{style:{width:`400px`},children:(0,b.jsx)(g,{...e})})},A={name:`Very narrow container (< 320px)`,args:{monthsToShow:3},render:e=>(0,b.jsx)(`div`,{style:{width:`280px`},children:(0,b.jsx)(g,{...e})})},j={name:`Three months only`,args:{monthsToShow:3}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  name: "Paginated (single month)",
  args: {
    variant: "paginated"
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  name: "Paginated — with Today button",
  args: {
    variant: "paginated",
    todayButton: true
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  name: "Paginated — narrow container (< 480px)",
  args: {
    variant: "paginated"
  },
  render: args => <div style={{
    width: "400px"
  }}>
      <Calendar {...args} />
    </div>
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  name: "No highlight, no fade",
  args: {
    highlightToday: false,
    dimPast: false
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  name: "Highlight today only",
  args: {
    highlightToday: true,
    dimPast: false
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  name: "Specific initial month",
  args: {
    initialMonth: {
      year: 2025,
      month: 1
    },
    monthsToShow: 3
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  name: "Narrow container (< 480px)",
  args: {
    monthsToShow: 3
  },
  render: args => <div style={{
    width: "400px"
  }}>
      <Calendar {...args} />
    </div>
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  name: "Very narrow container (< 320px)",
  args: {
    monthsToShow: 3
  },
  render: args => <div style={{
    width: "280px"
  }}>
      <Calendar {...args} />
    </div>
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  name: "Three months only",
  args: {
    monthsToShow: 3
  }
}`,...j.parameters?.docs?.source}}},M=[`Default`,`Paginated`,`PaginatedWithToday`,`PaginatedNarrow`,`NoHighlightNoFade`,`HighlightOnly`,`SpecificMonth`,`Narrow`,`VeryNarrow`,`FewMonths`]}))();export{S as Default,j as FewMonths,D as HighlightOnly,k as Narrow,E as NoHighlightNoFade,C as Paginated,T as PaginatedNarrow,w as PaginatedWithToday,O as SpecificMonth,A as VeryNarrow,M as __namedExportsOrder,x as default};