import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{T as n,r}from"./iframe-DZoRqkgT.js";import{n as i,t as a}from"./Icon-L8cqvGUg.js";import{n as o,t as s}from"./Button-Clq9-j9U.js";import{n as c,t as l}from"./Card-CP5t58sT.js";import{r as u,t as d}from"./Heading-Cv0veVz5.js";import{n as f,t as ee}from"./Link-JV1UW1fo.js";import{i as te,n as p,r as ne,t as re}from"./Menu-CaJURSLs.js";import{n as m,r as h,t as g}from"./Message-Ph28UWWh.js";import{n as _,t as v}from"./Paragraph-CcdcQtLu.js";import{n as ie,t as ae}from"./Pagination-CuasWmxa.js";import{i as oe,r as se}from"./icon-controls-BKzEgQc5.js";import{n as ce,t as le}from"./SelectField-CQaf4KTe.js";import{n as ue,t as de}from"./PageNav-CPQ2eD50.js";var fe=e((()=>{}));function pe(e,t){if(e.type===`multi`){let n=Array.isArray(t)?t:[];return n.length===0?null:n.length===1?e.options.find(e=>e.value===n[0])?.label??n[0]:`${n.length}`}return t?e.options.find(e=>e.value===t)?.label??t:null}function y(e,t){return e.type===`multi`?Array.isArray(t)&&t.length>0:!!t}function b(e){return e?`radio_button_checked`:`radio_button_unchecked`}function me(e){return e?`check_box`:`check_box_outline_blank`}function he({filter:e,selected:t,onSet:n}){let[r,i]=(0,x.useState)(!1),o=(0,x.useRef)(null),c=e.type===`multi`,l=c?Array.isArray(t)?t:[]:null,u=pe(e,t),d=y(e,t);function f(e){c?n(l.includes(e)?l.filter(t=>t!==e):[...l,e]):(n(t===e?``:e),i(!1))}return(0,S.jsxs)(`div`,{className:`a1-dt-filters__chip-wrap`,children:[(0,S.jsxs)(`button`,{ref:o,type:`button`,className:[`a1-dt-filters__chip`,d&&`a1-dt-filters__chip--active`].filter(Boolean).join(` `),onClick:()=>i(e=>!e),"aria-expanded":r,"aria-haspopup":`listbox`,children:[(0,S.jsx)(`span`,{children:e.label}),u&&(0,S.jsxs)(S.Fragment,{children:[(0,S.jsx)(`span`,{className:`a1-dt-filters__chip-sep`,"aria-hidden":`true`,children:`:`}),(0,S.jsx)(`span`,{className:`a1-dt-filters__chip-value`,children:u})]}),(0,S.jsx)(a,{name:r?`expand_less`:`expand_more`,className:`a1-dt-filters__chip-icon`})]}),(0,S.jsxs)(re,{open:r,anchorRef:o,onClose:()=>i(!1),"aria-label":e.label,children:[!c&&(0,S.jsx)(p,{icon:b(!t),className:t?``:`a1-dt-filters__item--on`,onClick:()=>{n(``),i(!1)},children:`All`},`__all__`),e.options.map(e=>{let n=c?l.includes(e.value):t===e.value;return(0,S.jsx)(p,{icon:c?me(n):b(n),className:n?`a1-dt-filters__item--on`:``,onClick:()=>f(e.value),children:e.label},e.value)}),c&&d&&(0,S.jsx)(`div`,{className:`a1-dt-filters__menu-clear`,children:(0,S.jsx)(s,{variant:`tertiary`,size:`sm`,icon:`close`,onClick:()=>{n([]),i(!1)},children:`Clear`})})]})]})}function ge({filters:e=[],value:t={},onChange:n,searchValue:r=``,onSearchChange:i,searchColumn:o=``,onSearchColumnChange:c,searchableColumns:l,className:u=``}){let[d,f]=(0,x.useState)(!1),ee=(0,x.useRef)(null),te=!!i,m=e.filter(e=>y(e,t[e.key])).length,h=m>0||!!r;function g(e,r){n?.({...t,[e]:r})}function _(){let t={};e.forEach(e=>{t[e.key]=e.type===`multi`?[]:``}),n?.(t),i?.(``)}let v=te&&(0,S.jsxs)(`div`,{className:`a1-dt-filters__search-wrap`,children:[(0,S.jsx)(a,{name:`search`,className:`a1-dt-filters__search-icon`}),(0,S.jsx)(`input`,{type:`search`,className:`a1-dt-filters__search-input`,value:r,onChange:e=>i(e.target.value),placeholder:`Search…`,"aria-label":o?`Search in ${l?.find(e=>e.key===o)?.label??o}`:`Search all fields`}),l?.length>0&&(0,S.jsxs)(`div`,{className:`a1-dt-filters__scope-wrap`,children:[(0,S.jsxs)(`select`,{className:`a1-dt-filters__scope-select`,value:o,onChange:e=>c?.(e.target.value),"aria-label":`Search in field`,children:[(0,S.jsx)(`option`,{value:``,children:`All fields`}),l.map(e=>(0,S.jsx)(`option`,{value:e.key,children:e.label},e.key))]}),(0,S.jsx)(a,{name:`expand_more`,className:`a1-dt-filters__scope-icon`})]})]});return(0,S.jsxs)(`div`,{className:[`a1-dt-filters`,u].filter(Boolean).join(` `),children:[(0,S.jsxs)(`div`,{className:`a1-dt-filters__desktop`,children:[v,e.length>0&&(0,S.jsxs)(S.Fragment,{children:[(0,S.jsx)(`span`,{className:`a1-dt-filters__label`,children:`Filters`}),(0,S.jsx)(`div`,{className:`a1-dt-filters__chips`,children:e.map(e=>(0,S.jsx)(he,{filter:e,selected:t[e.key]??(e.type===`multi`?[]:``),onSet:t=>g(e.key,t)},e.key))})]}),h&&(0,S.jsx)(s,{variant:`secondary`,size:`sm`,onClick:_,className:`a1-dt-filters__clear-all`,children:`Clear all`})]}),(0,S.jsxs)(`div`,{className:`a1-dt-filters__mobile`,children:[v,e.length>0&&(0,S.jsx)(`div`,{ref:ee,className:`a1-dt-filters__mobile-trigger`,children:(0,S.jsxs)(s,{variant:`secondary`,size:`sm`,icon:`filter_list`,onClick:()=>f(!0),children:[`Filters`,m>0&&(0,S.jsx)(`span`,{className:`a1-dt-filters__mobile-count`,"aria-label":`${m} active`,children:m})]})}),h&&(0,S.jsx)(s,{variant:`secondary`,size:`sm`,onClick:_,children:`Clear all`}),e.length>0&&(0,S.jsxs)(re,{open:d,anchorRef:ee,onClose:()=>f(!1),"aria-label":`Filters`,children:[e.map(e=>{let n=e.type===`multi`,r=t[e.key],i=n?Array.isArray(r)?r:[]:null;return(0,S.jsxs)(ne,{label:e.label,children:[!n&&(0,S.jsx)(p,{icon:b(!r),className:r?``:`a1-dt-filters__item--on`,onClick:()=>g(e.key,``),children:`All`},`__all__`),e.options.map(t=>{let a=n?i.includes(t.value):r===t.value;return(0,S.jsx)(p,{icon:n?me(a):b(a),className:a?`a1-dt-filters__item--on`:``,onClick:()=>{if(n){let n=i.includes(t.value)?i.filter(e=>e!==t.value):[...i,t.value];g(e.key,n)}else g(e.key,r===t.value?``:t.value)},children:t.label},t.value)})]},e.key)}),h&&(0,S.jsx)(`div`,{className:`a1-dt-filters__menu-clear`,children:(0,S.jsx)(s,{variant:`tertiary`,size:`sm`,onClick:()=>{_(),f(!1)},children:`Clear all filters`})})]})]})]})}var x,S,_e=e((()=>{x=t(n(),1),o(),i(),te(),fe(),S=r(),ge.__docgenInfo={description:``,methods:[],displayName:`DataTableFilters`,props:{filters:{defaultValue:{value:`[]`,computed:!1},required:!1},value:{defaultValue:{value:`{}`,computed:!1},required:!1},searchValue:{defaultValue:{value:`""`,computed:!1},required:!1},searchColumn:{defaultValue:{value:`""`,computed:!1},required:!1},className:{defaultValue:{value:`""`,computed:!1},required:!1}}}})),ve=e((()=>{}));function ye(e,t){return e.reduce((e,n)=>e+(n.width?parseFloat(n.width)||E.text:E[n.type]??E.text)+Me[t],0)}function be(e){return e?.key?{key:e.key,direction:e.direction===`desc`?`desc`:`asc`}:null}function xe(e,t){let n=typeof t.sortAccessor==`function`?t.sortAccessor(e):e[t.key];if(n==null||n===``)return null;if(t.type===`number`||t.type===`currency`||t.numeric){let e=typeof n==`number`?n:parseFloat(String(n).replace(/[^0-9.-]/g,``));return Number.isNaN(e)?n:e}if(t.type===`date`){let e=n instanceof Date?n.getTime():Date.parse(n);return Number.isNaN(e)?n:e}return n}function Se(e,t){return e==null&&t==null?0:e==null?1:t==null?-1:typeof e==`number`&&typeof t==`number`?e-t:String(e).localeCompare(String(t),void 0,{numeric:!0,sensitivity:`base`})}function Ce(e,t){return e.id??e.key??e.name??t}function we(e){return(e??[]).map(e=>String(e))}function Te(e,t={}){return e.reduce((e,n)=>(e[n.key]=t[n.key]??(n.type===`multi`?[]:``),e),{})}function Ee(e,t,n){if(n===`multi`){let n=Array.isArray(t)?t:[];return n.length===0?!0:Array.isArray(e)?n.some(t=>e.includes(t)):n.includes(e)}return t?Array.isArray(e)?e.includes(t):e===t:!0}function De(e,t){return typeof t.searchAccessor==`function`?t.searchAccessor(e):e[t.key]}function Oe(e,t,n,r,i,a,o){let s=e;t.length>0&&(s=s.filter(e=>t.every(t=>Ee(e[t.key],n[t.key],t.type))));let c=String(r??``).trim().toLowerCase().replace(/\s+/g,`_`);if(!c)return s;let l=a?.length>0?a:o.map(e=>({key:e.key,label:e.label}));return s.filter(e=>{if(i){let t=l.find(e=>e.key===i)??{key:i};return String(De(e,t)??``).toLowerCase().includes(c)}return l.some(t=>String(De(e,t)??``).toLowerCase().includes(c))})}function ke(e){return e.type===`link`||e.type===`actions`}function Ae(e){return Array.isArray(e)?e.length>0:e!=null&&e!==``}function je({checked:e,indeterminate:t=!1,label:n,onChange:r}){let i=(0,w.useRef)(null);return(0,w.useEffect)(()=>{i.current&&(i.current.indeterminate=t)},[t]),(0,T.jsx)(`input`,{ref:i,type:`checkbox`,className:`a1-data-table__checkbox`,checked:e,"aria-label":n,onChange:e=>r(e.target.checked)})}function C({columns:e=[],rows:t=[],density:n=`default`,zebra:r=!1,scrollable:i=!1,caption:o,page:c,defaultPage:l=1,pageSize:u,totalPages:d,totalRows:f,onPageChange:te,sort:p,defaultSort:ne,onSortChange:re,filters:h=[],filterValue:_,defaultFilterValue:v={},onFilterChange:ie,searchValue:oe,defaultSearchValue:se=``,onSearchChange:ce,searchColumn:ue,defaultSearchColumn:de=``,onSearchColumnChange:fe,searchableColumns:pe,selectable:y=!1,selectedRowIds:b,defaultSelectedRowIds:me=[],onSelectedRowIdsChange:he,onDeleteSelected:x,getRowId:S=Ce,emptyTitle:_e=`No results`,emptyDescription:ve,emptyIcon:Ee=`inbox`,className:De=``,...C}){let E=(0,w.useRef)(null),[Me,Ne]=(0,w.useState)(`default`),[D,O]=(0,w.useState)(()=>be(ne)),[k,Pe]=(0,w.useState)(l),[A,j]=(0,w.useState)(()=>Te(h,v)),[M,N]=(0,w.useState)(se),[Fe,Ie]=(0,w.useState)(de),[P,F]=(0,w.useState)(()=>we(me)),I=n===`auto`,L=p!==void 0,R=c!==void 0,z=_!==void 0,B=oe!==void 0,V=ue!==void 0,H=b!==void 0,U=I?Me:n,W=L?be(p):D,G=R?c:k,K=z?Te(h,_):Te(h,A),Le=B?oe:M,Re=V?ue:Fe,q=H?we(b):P,J=new Set(q);(0,w.useEffect)(()=>{if(!I)return;let t=E.current;if(!t)return;let n=ye(e,`comfortable`),r=ye(e,`default`),i=e=>e>=n?`comfortable`:e>=r?`default`:`compact`,a=new ResizeObserver(([e])=>{Ne(i(e.contentRect.width))});return a.observe(t),()=>a.disconnect()},[I,e]);let ze=[`a1-data-table`,U!==`default`&&`a1-data-table--${U}`,r&&`a1-data-table--zebra`,De].filter(Boolean).join(` `),Y=Oe(t,h,K,Le,Re,pe,e),Be=e.filter(e=>e.sortable),Ve=W?[...Y].sort((t,n)=>{let r=e.find(e=>e.key===W.key);if(!r)return 0;let i=Se(xe(t,r),xe(n,r));return W.direction===`desc`?-i:i}):Y,X=Number.isFinite(u)&&u>0,Z=X?Math.max(1,Math.ceil(Ve.length/u)):d,Q=Z==null?G:Math.min(Math.max(G??1,1),Z),He=X?Ve.slice((Q-1)*u,Q*u):Ve,Ue=Z!=null&&Z>1,We=X?He.length>0?(Q-1)*u+1:0:c==null?1:(c-1)*Y.length+1,Ge=X?He.length>0?We+He.length-1:0:c==null?Y.length:We+Y.length-1,Ke=X?Ve.length:f??(Ue?d*Y.length:Y.length),$=He.map((t,n)=>({row:t,index:X?(Q-1)*u+n:n,id:String(S(t,X?(Q-1)*u+n:n)),supportsRowClickSelection:y&&!e.some(e=>ke(e)&&Ae(t[e.key]))})),qe=$.filter(e=>J.has(e.id)).map(e=>e.row),Je=q.length,Ye=$.length>0&&$.every(e=>J.has(e.id)),Xe=$.some(e=>J.has(e.id));function Ze(e){let t=Z==null?Math.max(e,1):Math.min(Math.max(e,1),Z);R||Pe(t),te?.(t)}function Qe(){Ze(1)}function $e(e){L||O(e),re?.(e),Qe()}function et(e){let t=Te(h,e);z||j(t),ie?.(t),Qe()}function tt(e){B||N(e),ce?.(e),Qe()}function nt(e){V||Ie(e),fe?.(e),Qe()}function rt(e){let t=we(e);H||F(t),he?.(t)}function it(e){let t=W?.key===e.key&&W.direction===`asc`?`desc`:`asc`;$e({key:e.key,direction:t})}function at(e){let t=e.target.value;if(!t){$e(null);return}let[n,r]=t.split(`:`);$e({key:n,direction:r})}function ot(e,t){rt(t?[...new Set([...q,e])]:q.filter(t=>t!==e))}function st(e){let t=$.map(e=>e.id);rt(e?[...new Set([...q,...t])]:q.filter(e=>!t.includes(e)))}function ct(){x?.(qe,q),rt([])}function lt(e,t,n){t&&(n.target.closest(`a, button, input, select, textarea, label`)||ot(e,!J.has(e)))}function ut(e,t){if(t==null||t===``)return`—`;switch(e.type){case`avatar`:return(0,T.jsxs)(`span`,{className:`a1-data-table__avatar-cell`,children:[(0,T.jsx)(`span`,{className:`a1-data-table__avatar`,"aria-hidden":`true`,children:String(t).split(` `).slice(0,2).map(e=>e[0]).join(``).toUpperCase()}),(0,T.jsx)(`span`,{children:t})]});case`badge`:{let n=e.statusMap?.[t]??`neutral`,r=U===`compact`;return(0,T.jsx)(g,{status:n,subtle:!0,size:r?`sm`:void 0,icon:r?null:void 0,children:t})}case`link`:{let e=typeof t==`object`?t:{href:t,label:t},n=e.href??`#`;return(0,T.jsx)(ee,{href:n,icon:e.icon,iconPosition:e.iconPosition??`end`,target:e.target,rel:e.rel??(e.target===`_blank`?`noreferrer`:void 0),children:e.label??n})}case`actions`:return(0,T.jsx)(`span`,{className:`a1-data-table__actions`,children:(Array.isArray(t)?t:[t]).filter(Boolean).map((e,t)=>(0,T.jsx)(s,{variant:`tertiary`,size:`sm`,icon:e.icon,iconPosition:e.iconPosition??`start`,disabled:e.disabled,onClick:e.onClick,children:e.label},`${e.label??e.icon??`action`}-${t}`))});case`currency`:{let n=e.currencySymbol??`$`,r=typeof t==`number`?t:parseFloat(String(t).replace(/[^0-9.-]/g,``));return isNaN(r)?t:`${n}${r.toLocaleString(`en-US`,{minimumFractionDigits:0,maximumFractionDigits:0})}`}case`number`:{let e=typeof t==`number`?t:parseFloat(t);return isNaN(e)?t:e.toLocaleString(`en-US`)}default:return t}}function dt(e){return e.align?e.align:e.type===`number`||e.type===`currency`||e.numeric?`end`:`start`}function ft(e){return W?.key===e.key?W.direction===`desc`?`arrow_downward`:`arrow_upward`:`unfold_more`}function pt(e){if(e.sortable)return W?.key===e.key?W.direction===`desc`?`descending`:`ascending`:`none`}return(0,T.jsxs)(`div`,{ref:E,className:`a1-data-table-wrapper`,...C,children:[(h.length>0||pe?.length>0||ce||oe!==void 0)&&(0,T.jsx)(ge,{filters:h,value:K,onChange:et,searchValue:Le,onSearchChange:tt,searchColumn:Re,onSearchColumnChange:nt,searchableColumns:pe}),y&&Je>0&&(0,T.jsxs)(`div`,{className:`a1-data-table-bulk-actions`,role:`region`,"aria-label":`Bulk actions`,children:[(0,T.jsxs)(`span`,{className:`a1-data-table-bulk-actions__count`,children:[Je,` selected`]}),(0,T.jsxs)(`div`,{className:`a1-data-table-bulk-actions__controls`,children:[(0,T.jsx)(s,{variant:`tertiary`,size:`sm`,onClick:()=>rt([]),children:`Clear`}),x&&(0,T.jsx)(s,{variant:`destructive`,size:`sm`,icon:`delete`,onClick:ct,children:`Delete`})]})]}),Be.length>0&&(0,T.jsx)(`div`,{className:`a1-data-table-sort`,children:(0,T.jsxs)(le,{label:`Sort`,size:`compact`,value:W?`${W.key}:${W.direction}`:``,onChange:at,children:[(0,T.jsx)(`option`,{value:``,children:`No sorting`}),Be.flatMap(e=>[(0,T.jsxs)(`option`,{value:`${e.key}:asc`,children:[e.label,` ascending`]},`${e.key}:asc`),(0,T.jsxs)(`option`,{value:`${e.key}:desc`,children:[e.label,` descending`]},`${e.key}:desc`)])]})}),(0,T.jsx)(`div`,{className:[`a1-data-table-scroll`,i&&`a1-data-table-scroll--scrollable`].filter(Boolean).join(` `),tabIndex:i?0:void 0,children:Y.length===0?(0,T.jsx)(`div`,{className:`a1-data-table__empty`,children:(0,T.jsx)(m,{scale:`card`,icon:Ee,title:_e,description:ve})}):(0,T.jsxs)(`table`,{className:ze,children:[o&&(0,T.jsx)(`caption`,{children:o}),(0,T.jsx)(`thead`,{children:(0,T.jsxs)(`tr`,{children:[y&&(0,T.jsx)(`th`,{scope:`col`,className:`a1-data-table__select-header`,children:(0,T.jsx)(je,{checked:Ye,indeterminate:Xe&&!Ye,label:Ye?`Deselect all rows`:`Select all rows`,onChange:st})}),e.map(e=>(0,T.jsx)(`th`,{scope:`col`,"aria-sort":pt(e),"data-align":dt(e),style:e.width?{width:e.width}:void 0,children:e.sortable?(0,T.jsxs)(`button`,{type:`button`,className:`a1-data-table__sort-button`,onClick:()=>it(e),children:[(0,T.jsx)(`span`,{children:e.label}),(0,T.jsx)(a,{name:ft(e),className:`a1-data-table__sort-icon`})]}):e.label},e.key))]})}),(0,T.jsx)(`tbody`,{children:$.map(({row:t,index:n,id:r,supportsRowClickSelection:i})=>{let a=J.has(r);return(0,T.jsxs)(`tr`,{"data-selected":a?`true`:void 0,"data-selectable-row":i?`true`:void 0,onClick:e=>lt(r,i,e),children:[y&&(0,T.jsx)(`td`,{className:`a1-data-table__select-cell`,"data-label":`Select`,children:(0,T.jsx)(je,{checked:a,label:`Select row ${n+1}`,onChange:e=>ot(r,e)})}),e.map(e=>(0,T.jsx)(`td`,{"data-label":e.label,"data-align":dt(e),children:ut(e,t[e.key])},e.key))]},r)})})]})}),(Ue||Y.length>0)&&(0,T.jsxs)(`div`,{className:`a1-data-table-footer`,children:[(0,T.jsx)(`span`,{className:`a1-data-table-footer__count`,children:Ue?`Showing ${We}–${Ge} of ${Ke} results`:`${Y.length} ${Y.length===1?`result`:`results`}`}),Ue&&(0,T.jsx)(ae,{page:Q,totalPages:Z,onChange:Ze,size:`sm`})]})]})}var w,T,E,Me,Ne=e((()=>{w=t(n(),1),o(),ce(),i(),f(),h(),ie(),_e(),ve(),T=r(),E={avatar:160,date:110,actions:120,link:120,text:120,badge:95,currency:85,number:75},Me={comfortable:40,default:32,compact:24},C.__docgenInfo={description:``,methods:[],displayName:`DataTable`,props:{columns:{defaultValue:{value:`[]`,computed:!1},required:!1},rows:{defaultValue:{value:`[]`,computed:!1},required:!1},density:{defaultValue:{value:`"default"`,computed:!1},required:!1},zebra:{defaultValue:{value:`false`,computed:!1},required:!1},scrollable:{defaultValue:{value:`false`,computed:!1},required:!1},defaultPage:{defaultValue:{value:`1`,computed:!1},required:!1},filters:{defaultValue:{value:`[]`,computed:!1},required:!1},defaultFilterValue:{defaultValue:{value:`{}`,computed:!1},required:!1},defaultSearchValue:{defaultValue:{value:`""`,computed:!1},required:!1},defaultSearchColumn:{defaultValue:{value:`""`,computed:!1},required:!1},selectable:{defaultValue:{value:`false`,computed:!1},required:!1},defaultSelectedRowIds:{defaultValue:{value:`[]`,computed:!1},required:!1},getRowId:{defaultValue:{value:`function defaultGetRowId(row, index) {
  return row.id ?? row.key ?? row.name ?? index;
}`,computed:!1},required:!1},emptyTitle:{defaultValue:{value:`"No results"`,computed:!1},required:!1},emptyIcon:{defaultValue:{value:`"inbox"`,computed:!1},required:!1},className:{defaultValue:{value:`""`,computed:!1},required:!1}}}}));function D({children:e,muted:t=!1}){return(0,k.jsx)(`code`,{style:{fontFamily:`monospace`,fontSize:12,color:t?`var(--semantic-color-text-muted)`:`var(--semantic-color-action-background)`},children:e})}var O,k,Pe,A,j,M,N,Fe,Ie,P,F,I,L,R,z,B,V,H,U,W,G,K,Le,Re,q,J,ze;e((()=>{O=t(n(),1),c(),u(),h(),ue(),_(),Ne(),se(),k=r(),Pe={title:`Components/DataTable`,component:C,parameters:{layout:`padded`}},A=[{key:`name`,label:`Name`,type:`avatar`},{key:`department`,label:`Department`},{key:`role`,label:`Role`},{key:`location`,label:`Location`,type:`badge`,statusMap:{Remote:`info`,Hybrid:`neutral`,Office:`success`}},{key:`status`,label:`Status`,type:`badge`,statusMap:{Active:`success`,Inactive:`neutral`,"On leave":`warn`}},{key:`salary`,label:`Salary`,type:`currency`}],j=A.map(e=>({...e,sortable:[`name`,`department`,`role`,`status`,`salary`].includes(e.key)})),M=[{name:`Aria Chen`,department:`Design`,role:`Product Designer`,location:`Remote`,status:`Active`,salary:92e3},{name:`Marcus Webb`,department:`Engineering`,role:`Engineering Lead`,location:`Hybrid`,status:`Active`,salary:148e3},{name:`Priya Nair`,department:`Data`,role:`Data Analyst`,location:`Office`,status:`On leave`,salary:88e3},{name:`Tom Erikson`,department:`Sales`,role:`Account Manager`,location:`Remote`,status:`Active`,salary:95e3},{name:`Leila Fontaine`,department:`Design`,role:`UX Researcher`,location:`Hybrid`,status:`Inactive`,salary:82e3},{name:`Devon Park`,department:`Engineering`,role:`Frontend Engineer`,location:`Remote`,status:`Active`,salary:118e3},{name:`Yuki Tanaka`,department:`Marketing`,role:`Brand Strategist`,location:`Office`,status:`Active`,salary:87e3},{name:`Omar Hassan`,department:`Sales`,role:`Sales Director`,location:`Hybrid`,status:`Active`,salary:165e3},{name:`Stella Bowen`,department:`Marketing`,role:`Content Writer`,location:`Remote`,status:`Inactive`,salary:72e3},{name:`James Ortega`,department:`Engineering`,role:`DevOps Engineer`,location:`Hybrid`,status:`Active`,salary:132e3},{name:`Nina Kovac`,department:`Product`,role:`Product Manager`,location:`Office`,status:`Active`,salary:125e3},{name:`Carlos Reyes`,department:`Engineering`,role:`QA Engineer`,location:`Remote`,status:`Active`,salary:98e3},{name:`Maya Johnson`,department:`Design`,role:`Visual Designer`,location:`Hybrid`,status:`Active`,salary:85e3},{name:`Raj Patel`,department:`Data`,role:`Data Scientist`,location:`Remote`,status:`Active`,salary:142e3},{name:`Sofia Torres`,department:`Product`,role:`Product Analyst`,location:`Office`,status:`On leave`,salary:95e3},{name:`Leo Nakamura`,department:`Engineering`,role:`Backend Engineer`,location:`Remote`,status:`Active`,salary:125e3},{name:`Anna Dubois`,department:`Marketing`,role:`Marketing Manager`,location:`Hybrid`,status:`Active`,salary:105e3},{name:`Kevin Osei`,department:`Sales`,role:`Sales Representative`,location:`Office`,status:`Active`,salary:78e3},{name:`Ingrid Larsen`,department:`Design`,role:`Design Lead`,location:`Hybrid`,status:`Active`,salary:118e3},{name:`Mike Chen`,department:`Engineering`,role:`Staff Engineer`,location:`Remote`,status:`Active`,salary:168e3}],N=6,Fe=[{key:`department`,label:`Department`,type:`multi`,options:[{value:`Design`,label:`Design`},{value:`Engineering`,label:`Engineering`},{value:`Product`,label:`Product`},{value:`Marketing`,label:`Marketing`},{value:`Sales`,label:`Sales`},{value:`Data`,label:`Data`}]},{key:`status`,label:`Status`,type:`single`,options:[{value:`Active`,label:`Active`},{value:`Inactive`,label:`Inactive`},{value:`On leave`,label:`On leave`}]},{key:`location`,label:`Location`,type:`single`,options:[{value:`Remote`,label:`Remote`},{value:`Hybrid`,label:`Hybrid`},{value:`Office`,label:`Office`}]}],Ie=[{key:`name`,label:`Name`},{key:`role`,label:`Role`},{key:`department`,label:`Department`}],P={args:{density:`default`,zebra:!1,scrollable:!1,caption:``,emptyTitle:`No results`,emptyDescription:``,emptyIcon:`inbox`,pageSize:void 0,rowCount:8},argTypes:{density:{control:`select`,options:[`compact`,`default`,`comfortable`,`auto`],description:`"auto" switches density based on available container width`},zebra:{control:`boolean`},scrollable:{control:`boolean`,description:`Enable horizontal scrolling when content overflows`},caption:{control:`text`},emptyTitle:{control:`text`},emptyDescription:{control:`text`},emptyIcon:{...oe(`Empty state icon name`)},pageSize:{control:`number`,description:`Rows per page for built-in client-side pagination`},rowCount:{control:{type:`range`,min:0,max:20},description:`Rows to display — set to 0 to preview the empty state`}},render:({rowCount:e,...t})=>(0,k.jsx)(C,{...t,columns:A,rows:M.slice(0,e)})},F={render:()=>{let[e,t]=(0,O.useState)({}),[n,r]=(0,O.useState)(``),[i,a]=(0,O.useState)(``);return(0,k.jsx)(C,{columns:A,rows:M,filters:Fe,filterValue:e,onFilterChange:t,searchValue:n,onSearchChange:r,searchColumn:i,onSearchColumnChange:a,searchableColumns:Ie,pageSize:N,emptyTitle:`No matching team members`,emptyDescription:`Try adjusting your search or clearing some filters.`,emptyIcon:`person_search`})}},I={render:()=>(0,k.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:40},children:[`comfortable`,`default`,`compact`].map(e=>(0,k.jsxs)(`div`,{children:[(0,k.jsx)(`p`,{style:{fontFamily:`sans-serif`,fontSize:12,color:`var(--semantic-color-text-muted)`,marginBottom:8,textTransform:`capitalize`},children:e}),(0,k.jsx)(C,{columns:A,rows:M.slice(0,4),density:e})]},e))})},L={parameters:{layout:`fullscreen`},render:()=>(0,k.jsxs)(`div`,{style:{padding:24},children:[(0,k.jsx)(`p`,{style:{fontFamily:`sans-serif`,fontSize:13,color:`var(--semantic-color-text-muted)`,marginBottom:16},children:`Resize the Storybook canvas — the table automatically switches between comfortable, default, and compact density based on the available container width and column type estimates.`}),(0,k.jsx)(C,{columns:A,rows:M.slice(0,8),density:`auto`,zebra:!0,caption:`Team directory — auto density`})]})},R={render:()=>(0,k.jsx)(C,{columns:A,rows:M.slice(0,8),zebra:!0,caption:`Team members`})},z={render:()=>{let[e,t]=(0,O.useState)(1),n=Math.ceil(M.length/N);return(0,k.jsx)(C,{columns:A,rows:M.slice((e-1)*N,e*N),page:e,totalPages:n,totalRows:M.length,onPageChange:t,zebra:!0,caption:`All team members`})}},B={render:()=>{let[e,t]=(0,O.useState)({key:`name`,direction:`asc`});return(0,k.jsx)(C,{columns:j,rows:M.slice(0,10),sort:e,onSortChange:t,zebra:!0,caption:`Sortable team directory`})}},V={render:()=>{let[e,t]=(0,O.useState)(M.slice(0,10)),[n,r]=(0,O.useState)([]);function i(e,n){t(e=>e.filter((e,t)=>{let r=String(e.id??e.key??e.name??t);return!n.includes(r)}))}return(0,k.jsx)(C,{columns:j,rows:e,selectable:!0,selectedRowIds:n,onSelectedRowIdsChange:r,onDeleteSelected:i,defaultSort:{key:`name`,direction:`asc`},zebra:!0,caption:`Selectable team directory`})}},H={render:()=>(0,k.jsx)(C,{columns:A,rows:[],emptyTitle:`No team members found`,emptyDescription:`Try adjusting your filters or search term.`,emptyIcon:`person_search`})},U=[{key:`name`,label:`Name`,type:`avatar`},{key:`score`,label:`Score`,type:`number`,align:`end`},{key:`budget`,label:`Budget`,type:`currency`},{key:`status`,label:`Status`,type:`badge`,statusMap:{Approved:`success`,Pending:`warn`,Rejected:`error`,Draft:`neutral`}},{key:`brief`,label:`Brief`,type:`link`},{key:`updated`,label:`Updated`,type:`date`},{key:`notes`,label:`Notes`},{key:`actions`,label:`Actions`,type:`actions`,align:`end`}],W=[{name:`Aria Chen`,score:9821,budget:45e3,status:`Approved`,brief:{href:`#aria-chen`,label:`Open brief`,icon:`open_in_new`},updated:`May 20, 2026`,notes:`Q2 review complete`,actions:[{label:`View`,icon:`visibility`,onClick:()=>{}}]},{name:`Marcus Webb`,score:7403,budget:12e4,status:`Pending`,brief:{href:`#marcus-webb`,label:`Open brief`,icon:`open_in_new`},updated:`May 18, 2026`,notes:`Awaiting sign-off`,actions:[{label:`Review`,icon:`rate_review`,onClick:()=>{}}]},{name:`Priya Nair`,score:5190,budget:22500,status:`Draft`,brief:{href:`#priya-nair`,label:`Open brief`,icon:`open_in_new`},updated:`May 15, 2026`,notes:``,actions:[{label:`Edit`,icon:`edit`,onClick:()=>{}}]},{name:`Tom Erikson`,score:11204,budget:88e3,status:`Rejected`,brief:{href:`#tom-erikson`,label:`Open brief`,icon:`open_in_new`},updated:`May 10, 2026`,notes:`See attached brief`,actions:[{label:`Resolve`,icon:`check_circle`,onClick:()=>{}}]},{name:`Leila F.`,score:3051,budget:15e3,status:`Approved`,brief:{href:`#leila-f`,label:`Open brief`,icon:`open_in_new`},updated:`Apr 30, 2026`,notes:``,actions:[{label:`View`,icon:`visibility`,onClick:()=>{}}]}],G={render:()=>(0,k.jsx)(C,{columns:U,rows:W,caption:`All column types — avatar, number, currency, badge, link, date, text, actions`,scrollable:!0})},K={render:()=>(0,k.jsxs)(`div`,{style:{maxWidth:500},children:[(0,k.jsx)(`p`,{style:{fontFamily:`sans-serif`,fontSize:13,color:`var(--semantic-color-text-muted)`,marginBottom:12},children:`Container constrained to 500px — scrollable prop enables horizontal overflow.`}),(0,k.jsx)(C,{columns:A,rows:M.slice(0,5),scrollable:!0})]})},Le=[{id:`dt-overview`,label:`Overview`},{id:`dt-columns`,label:`Columns`},{id:`dt-density`,label:`Density`},{id:`dt-filtering`,label:`Filtering`},{id:`dt-responsive`,label:`Responsive`},{id:`dt-props`,label:`Props`}],Re=[{key:`name`,label:`Prop`,width:`150px`},{key:`type`,label:`Type`,width:`280px`},{key:`defaultVal`,label:`Default`,width:`120px`},{key:`description`,label:`Description`}],q=[{name:(0,k.jsx)(D,{children:`columns`}),type:(0,k.jsx)(D,{children:`Column[]`}),defaultVal:(0,k.jsx)(D,{muted:!0,children:`[]`}),description:`Column definitions — key, label, type, align, width, statusMap`},{name:(0,k.jsx)(D,{children:`rows`}),type:(0,k.jsx)(D,{children:`Record<string,any>[]`}),defaultVal:(0,k.jsx)(D,{muted:!0,children:`[]`}),description:`Row data — keys must match column keys`},{name:(0,k.jsx)(D,{children:`sort`}),type:(0,k.jsx)(D,{children:`{ key: string, direction: "asc"|"desc" }`}),defaultVal:(0,k.jsx)(D,{muted:!0,children:`—`}),description:`Controlled sort state`},{name:(0,k.jsx)(D,{children:`defaultSort`}),type:(0,k.jsx)(D,{children:`{ key: string, direction: "asc"|"desc" }`}),defaultVal:(0,k.jsx)(D,{muted:!0,children:`—`}),description:`Initial sort state for uncontrolled tables`},{name:(0,k.jsx)(D,{children:`onSortChange`}),type:(0,k.jsx)(D,{children:`(sort: Sort | null) => void`}),defaultVal:(0,k.jsx)(D,{muted:!0,children:`—`}),description:`Called when a sortable header or mobile sort select changes`},{name:(0,k.jsx)(D,{children:`selectable`}),type:(0,k.jsx)(D,{children:`boolean`}),defaultVal:(0,k.jsx)(D,{muted:!0,children:`false`}),description:`Adds row selection checkboxes and a select-all header control`},{name:(0,k.jsx)(D,{children:`selectedRowIds`}),type:(0,k.jsx)(D,{children:`Array<string|number>`}),defaultVal:(0,k.jsx)(D,{muted:!0,children:`—`}),description:`Controlled selected row ids`},{name:(0,k.jsx)(D,{children:`defaultSelectedRowIds`}),type:(0,k.jsx)(D,{children:`Array<string|number>`}),defaultVal:(0,k.jsx)(D,{muted:!0,children:`[]`}),description:`Initial selected row ids for uncontrolled tables`},{name:(0,k.jsx)(D,{children:`onSelectedRowIdsChange`}),type:(0,k.jsx)(D,{children:`(ids: string[]) => void`}),defaultVal:(0,k.jsx)(D,{muted:!0,children:`—`}),description:`Called when row selection changes`},{name:(0,k.jsx)(D,{children:`onDeleteSelected`}),type:(0,k.jsx)(D,{children:`(rows: Row[], ids: string[]) => void`}),defaultVal:(0,k.jsx)(D,{muted:!0,children:`—`}),description:`Shows a destructive Delete bulk action and calls back with selected rows and ids`},{name:(0,k.jsx)(D,{children:`getRowId`}),type:(0,k.jsx)(D,{children:`(row, index) => string|number`}),defaultVal:(0,k.jsx)(D,{muted:!0,children:`—`}),description:`Returns each row's stable id. Defaults to id, key, name, then index`},{name:(0,k.jsx)(D,{children:`density`}),type:(0,k.jsx)(D,{children:`"compact"|"default"|"comfortable"|"auto"`}),defaultVal:(0,k.jsx)(D,{muted:!0,children:`"default"`}),description:`Cell spacing. auto picks density from container width`},{name:(0,k.jsx)(D,{children:`zebra`}),type:(0,k.jsx)(D,{children:`boolean`}),defaultVal:(0,k.jsx)(D,{muted:!0,children:`false`}),description:`Alternate row background shading`},{name:(0,k.jsx)(D,{children:`scrollable`}),type:(0,k.jsx)(D,{children:`boolean`}),defaultVal:(0,k.jsx)(D,{muted:!0,children:`false`}),description:`Enable horizontal overflow scrolling`},{name:(0,k.jsx)(D,{children:`caption`}),type:(0,k.jsx)(D,{children:`string`}),defaultVal:(0,k.jsx)(D,{muted:!0,children:`—`}),description:`Accessible table caption (renders above header)`},{name:(0,k.jsx)(D,{children:`page`}),type:(0,k.jsx)(D,{children:`number`}),defaultVal:(0,k.jsx)(D,{muted:!0,children:`—`}),description:`Current page (1-indexed). Enables pagination footer`},{name:(0,k.jsx)(D,{children:`defaultPage`}),type:(0,k.jsx)(D,{children:`number`}),defaultVal:(0,k.jsx)(D,{muted:!0,children:`1`}),description:`Initial page for uncontrolled pagination`},{name:(0,k.jsx)(D,{children:`pageSize`}),type:(0,k.jsx)(D,{children:`number`}),defaultVal:(0,k.jsx)(D,{muted:!0,children:`—`}),description:`Rows per page for built-in client-side pagination`},{name:(0,k.jsx)(D,{children:`totalPages`}),type:(0,k.jsx)(D,{children:`number`}),defaultVal:(0,k.jsx)(D,{muted:!0,children:`—`}),description:`Total number of pages`},{name:(0,k.jsx)(D,{children:`totalRows`}),type:(0,k.jsx)(D,{children:`number`}),defaultVal:(0,k.jsx)(D,{muted:!0,children:`—`}),description:`Total row count across all pages (for footer text)`},{name:(0,k.jsx)(D,{children:`onPageChange`}),type:(0,k.jsx)(D,{children:`(page: number) => void`}),defaultVal:(0,k.jsx)(D,{muted:!0,children:`—`}),description:`Called when the user changes page`},{name:(0,k.jsx)(D,{children:`emptyTitle`}),type:(0,k.jsx)(D,{children:`string`}),defaultVal:(0,k.jsx)(D,{muted:!0,children:`"No results"`}),description:`Heading shown when rows is empty`},{name:(0,k.jsx)(D,{children:`emptyDescription`}),type:(0,k.jsx)(D,{children:`string`}),defaultVal:(0,k.jsx)(D,{muted:!0,children:`—`}),description:`Body text in the empty state`},{name:(0,k.jsx)(D,{children:`emptyIcon`}),type:(0,k.jsx)(D,{children:`string`}),defaultVal:(0,k.jsx)(D,{muted:!0,children:`"inbox"`}),description:`Material symbol name for the empty state icon`}],J={parameters:{layout:`fullscreen`},render:()=>(0,k.jsx)(`div`,{style:{background:`var(--semantic-color-surface-page)`,minHeight:`100vh`},children:(0,k.jsx)(`div`,{style:{maxWidth:1100,margin:`0 auto`,padding:`48px 24px`},children:(0,k.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`minmax(0,2fr) 220px`,gap:48,alignItems:`start`},children:[(0,k.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:48},children:[(0,k.jsxs)(`div`,{children:[(0,k.jsx)(g,{status:`info`,subtle:!0,style:{marginBottom:12},children:`Component`}),(0,k.jsx)(d,{as:`h1`,size:`lg`,style:{marginBottom:8},children:`DataTable`}),(0,k.jsx)(v,{size:`lg`,color:`muted`,children:`Displays tabular data with configurable density, sorting, filtering, pagination, and responsive card-flip layout for narrow viewports.`})]}),(0,k.jsxs)(`section`,{id:`dt-overview`,children:[(0,k.jsx)(d,{as:`h2`,size:`xs`,style:{marginBottom:16},children:`Overview`}),(0,k.jsxs)(v,{style:{marginBottom:20},children:[`DataTable accepts a `,(0,k.jsx)(`code`,{style:{fontFamily:`monospace`},children:`columns`}),` definition and `,(0,k.jsx)(`code`,{style:{fontFamily:`monospace`},children:`rows`}),` array. Each column specifies a `,(0,k.jsx)(`code`,{style:{fontFamily:`monospace`},children:`type`}),` that controls rendering — text, number, currency, date, badge, or avatar. Mark columns as `,(0,k.jsx)(`code`,{style:{fontFamily:`monospace`},children:`sortable`}),` to add header controls and a mobile sort selector. Enable `,(0,k.jsx)(`code`,{style:{fontFamily:`monospace`},children:`selectable`}),` to add row checkboxes and bulk actions. Use the built-in `,(0,k.jsx)(`code`,{style:{fontFamily:`monospace`},children:`filters`}),` and `,(0,k.jsx)(`code`,{style:{fontFamily:`monospace`},children:`searchableColumns`}),` props for interactive filtering and search. Add `,(0,k.jsx)(`code`,{style:{fontFamily:`monospace`},children:`pageSize`}),` for client-side pagination, or control pages externally with `,(0,k.jsx)(`code`,{style:{fontFamily:`monospace`},children:`page`}),`, `,(0,k.jsx)(`code`,{style:{fontFamily:`monospace`},children:`totalPages`}),`, and `,(0,k.jsx)(`code`,{style:{fontFamily:`monospace`},children:`onPageChange`}),`.`]}),(0,k.jsx)(C,{columns:j,rows:M.slice(0,5),zebra:!0,caption:`Team members`,defaultSort:{key:`name`,direction:`asc`}})]}),(0,k.jsxs)(`section`,{id:`dt-columns`,children:[(0,k.jsx)(d,{as:`h2`,size:`xs`,style:{marginBottom:8},children:`Columns`}),(0,k.jsxs)(v,{style:{marginBottom:20},children:[`The `,(0,k.jsx)(`code`,{style:{fontFamily:`monospace`},children:`type`}),` prop controls cell rendering. Numeric types (`,(0,k.jsx)(`code`,{style:{fontFamily:`monospace`},children:`number`}),`, `,(0,k.jsx)(`code`,{style:{fontFamily:`monospace`},children:`currency`}),`) are automatically right-aligned with tabular numerals. Use `,(0,k.jsx)(`code`,{style:{fontFamily:`monospace`},children:`align`}),` to override alignment. `,(0,k.jsx)(`code`,{style:{fontFamily:`monospace`},children:`badge`}),` uses a `,(0,k.jsx)(`code`,{style:{fontFamily:`monospace`},children:`statusMap`}),` to color-code values.`]}),(0,k.jsx)(C,{columns:U,rows:W})]}),(0,k.jsxs)(`section`,{id:`dt-density`,children:[(0,k.jsx)(d,{as:`h2`,size:`xs`,style:{marginBottom:8},children:`Density`}),(0,k.jsxs)(v,{style:{marginBottom:20},children:[`Three densities — `,(0,k.jsx)(`strong`,{children:`compact`}),`, `,(0,k.jsx)(`strong`,{children:`default`}),`, and `,(0,k.jsx)(`strong`,{children:`comfortable`}),` — adjust cell padding and font size. Compact mode also switches badges to the `,(0,k.jsx)(`code`,{style:{fontFamily:`monospace`},children:`sm`}),` size and hides their icons. Set `,(0,k.jsx)(`code`,{style:{fontFamily:`monospace`},children:`density="auto"`}),` to let the table choose based on available container width.`]}),(0,k.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:24},children:[`comfortable`,`default`,`compact`].map(e=>(0,k.jsxs)(`div`,{children:[(0,k.jsx)(`p`,{style:{fontFamily:`sans-serif`,fontSize:11,color:`var(--semantic-color-text-muted)`,textTransform:`uppercase`,letterSpacing:`0.06em`,marginBottom:6},children:e}),(0,k.jsx)(C,{columns:A,rows:M.slice(0,3),density:e})]},e))})]}),(0,k.jsxs)(`section`,{id:`dt-filtering`,children:[(0,k.jsx)(d,{as:`h2`,size:`xs`,style:{marginBottom:8},children:`Filtering`}),(0,k.jsxs)(v,{style:{marginBottom:20},children:[(0,k.jsx)(`code`,{style:{fontFamily:`monospace`},children:`DataTable`}),` renders configured filters as a chip row on wider screens and collapses them into a single menu button at the xs breakpoint (≤480px). Filters support `,(0,k.jsx)(`strong`,{children:`single-select`}),` (radio buttons) and `,(0,k.jsx)(`strong`,{children:`multi-select`}),` (checkboxes). A search input with an optional column-scope selector is included.`]}),(()=>{let[e,t]=(0,O.useState)({}),[n,r]=(0,O.useState)(``),[i,a]=(0,O.useState)(``);return(0,k.jsx)(C,{columns:A,rows:M,filters:Fe,filterValue:e,onFilterChange:t,searchValue:n,onSearchChange:r,searchColumn:i,onSearchColumnChange:a,searchableColumns:Ie,pageSize:N,emptyTitle:`No matching team members`,emptyDescription:`Try adjusting your search or filters.`,emptyIcon:`person_search`})})()]}),(0,k.jsxs)(`section`,{id:`dt-responsive`,children:[(0,k.jsx)(d,{as:`h2`,size:`xs`,style:{marginBottom:8},children:`Responsive`}),(0,k.jsxs)(v,{style:{marginBottom:20},children:[`Below 640px, each row flips to a labeled card layout using CSS `,(0,k.jsx)(`code`,{style:{fontFamily:`monospace`},children:`display: block`}),` and `,(0,k.jsx)(`code`,{style:{fontFamily:`monospace`},children:`data-label`}),` attributes. No JavaScript required. Horizontal scrolling is off by default — enable it with `,(0,k.jsx)(`code`,{style:{fontFamily:`monospace`},children:`scrollable`}),` for tables that must preserve column widths.`]}),(0,k.jsxs)(l,{style:{padding:16,background:`var(--semantic-color-surface-panel)`},children:[(0,k.jsx)(`p`,{style:{fontFamily:`sans-serif`,fontSize:12,color:`var(--semantic-color-text-muted)`,marginBottom:12},children:`Card-flip preview (simulated at 400px max-width)`}),(0,k.jsx)(`div`,{style:{maxWidth:400},children:(0,k.jsx)(C,{columns:A.slice(0,4),rows:M.slice(0,3)})})]})]}),(0,k.jsxs)(`section`,{id:`dt-props`,children:[(0,k.jsx)(d,{as:`h2`,size:`xs`,style:{marginBottom:16},children:`Props`}),(0,k.jsx)(C,{columns:Re,rows:q,density:`compact`,scrollable:!0})]})]}),(0,k.jsx)(`div`,{style:{position:`sticky`,top:32,maxHeight:`calc(100vh - 64px)`,overflowY:`auto`},children:(0,k.jsx)(de,{sections:Le,label:`On this page`})})]})})})},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    density: "default",
    zebra: false,
    scrollable: false,
    caption: "",
    emptyTitle: "No results",
    emptyDescription: "",
    emptyIcon: "inbox",
    pageSize: undefined,
    rowCount: 8
  },
  argTypes: {
    density: {
      control: "select",
      options: ["compact", "default", "comfortable", "auto"],
      description: '"auto" switches density based on available container width'
    },
    zebra: {
      control: "boolean"
    },
    scrollable: {
      control: "boolean",
      description: "Enable horizontal scrolling when content overflows"
    },
    caption: {
      control: "text"
    },
    emptyTitle: {
      control: "text"
    },
    emptyDescription: {
      control: "text"
    },
    emptyIcon: {
      ...requiredIconArgType("Empty state icon name")
    },
    pageSize: {
      control: "number",
      description: "Rows per page for built-in client-side pagination"
    },
    rowCount: {
      control: {
        type: "range",
        min: 0,
        max: 20
      },
      description: "Rows to display — set to 0 to preview the empty state"
    }
  },
  render: ({
    rowCount,
    ...args
  }) => <DataTable {...args} columns={COLUMNS} rows={ALL_ROWS.slice(0, rowCount)} />
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [filters, setFilters] = useState({});
    const [searchValue, setSearchValue] = useState("");
    const [searchColumn, setSearchColumn] = useState("");
    return <DataTable columns={COLUMNS} rows={ALL_ROWS} filters={FILTER_DEFS} filterValue={filters} onFilterChange={setFilters} searchValue={searchValue} onSearchChange={setSearchValue} searchColumn={searchColumn} onSearchColumnChange={setSearchColumn} searchableColumns={SEARCH_COLS} pageSize={PAGE_SIZE} emptyTitle="No matching team members" emptyDescription="Try adjusting your search or clearing some filters." emptyIcon="person_search" />;
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: 40
  }}>
      {["comfortable", "default", "compact"].map(density => <div key={density}>
          <p style={{
        fontFamily: "sans-serif",
        fontSize: 12,
        color: "var(--semantic-color-text-muted)",
        marginBottom: 8,
        textTransform: "capitalize"
      }}>
            {density}
          </p>
          <DataTable columns={COLUMNS} rows={ALL_ROWS.slice(0, 4)} density={density} />
        </div>)}
    </div>
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  parameters: {
    layout: "fullscreen"
  },
  render: () => <div style={{
    padding: 24
  }}>
      <p style={{
      fontFamily: "sans-serif",
      fontSize: 13,
      color: "var(--semantic-color-text-muted)",
      marginBottom: 16
    }}>
        Resize the Storybook canvas — the table automatically switches between comfortable,
        default, and compact density based on the available container width and column type estimates.
      </p>
      <DataTable columns={COLUMNS} rows={ALL_ROWS.slice(0, 8)} density="auto" zebra caption="Team directory — auto density" />
    </div>
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  render: () => <DataTable columns={COLUMNS} rows={ALL_ROWS.slice(0, 8)} zebra caption="Team members" />
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(ALL_ROWS.length / PAGE_SIZE);
    const pageRows = ALL_ROWS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    return <DataTable columns={COLUMNS} rows={pageRows} page={page} totalPages={totalPages} totalRows={ALL_ROWS.length} onPageChange={setPage} zebra caption="All team members" />;
  }
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [sort, setSort] = useState({
      key: "name",
      direction: "asc"
    });
    return <DataTable columns={SORTABLE_COLUMNS} rows={ALL_ROWS.slice(0, 10)} sort={sort} onSortChange={setSort} zebra caption="Sortable team directory" />;
  }
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [rows, setRows] = useState(ALL_ROWS.slice(0, 10));
    const [selectedRowIds, setSelectedRowIds] = useState([]);
    function handleDeleteSelected(_selectedRows, selectedIds) {
      setRows(currentRows => currentRows.filter((row, index) => {
        const rowId = String(row.id ?? row.key ?? row.name ?? index);
        return !selectedIds.includes(rowId);
      }));
    }
    return <DataTable columns={SORTABLE_COLUMNS} rows={rows} selectable selectedRowIds={selectedRowIds} onSelectedRowIdsChange={setSelectedRowIds} onDeleteSelected={handleDeleteSelected} defaultSort={{
      key: "name",
      direction: "asc"
    }} zebra caption="Selectable team directory" />;
  }
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  render: () => <DataTable columns={COLUMNS} rows={[]} emptyTitle="No team members found" emptyDescription="Try adjusting your filters or search term." emptyIcon="person_search" />
}`,...H.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  render: () => <DataTable columns={TYPE_COLUMNS} rows={TYPE_ROWS} caption="All column types — avatar, number, currency, badge, link, date, text, actions" scrollable />
}`,...G.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    maxWidth: 500
  }}>
      <p style={{
      fontFamily: "sans-serif",
      fontSize: 13,
      color: "var(--semantic-color-text-muted)",
      marginBottom: 12
    }}>
        Container constrained to 500px — scrollable prop enables horizontal overflow.
      </p>
      <DataTable columns={COLUMNS} rows={ALL_ROWS.slice(0, 5)} scrollable />
    </div>
}`,...K.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  parameters: {
    layout: "fullscreen"
  },
  render: () => <div style={{
    background: "var(--semantic-color-surface-page)",
    minHeight: "100vh"
  }}>
      <div style={{
      maxWidth: 1100,
      margin: "0 auto",
      padding: "48px 24px"
    }}>
        <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(0,2fr) 220px",
        gap: 48,
        alignItems: "start"
      }}>
          {/* ── Main content ── */}
          <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 48
        }}>

            <div>
              <MessageBadge status="info" subtle style={{
              marginBottom: 12
            }}>Component</MessageBadge>
              <Heading as="h1" size="lg" style={{
              marginBottom: 8
            }}>DataTable</Heading>
              <Paragraph size="lg" color="muted">
                Displays tabular data with configurable density, sorting, filtering, pagination,
                and responsive card-flip layout for narrow viewports.
              </Paragraph>
            </div>

            {/* Overview */}
            <section id="dt-overview">
              <Heading as="h2" size="xs" style={{
              marginBottom: 16
            }}>Overview</Heading>
              <Paragraph style={{
              marginBottom: 20
            }}>
                DataTable accepts a <code style={{
                fontFamily: "monospace"
              }}>columns</code> definition and <code style={{
                fontFamily: "monospace"
              }}>rows</code> array.
                Each column specifies a <code style={{
                fontFamily: "monospace"
              }}>type</code> that controls rendering — text, number, currency, date, badge, or avatar.
                Mark columns as <code style={{
                fontFamily: "monospace"
              }}>sortable</code> to add header controls and a mobile sort selector.
                Enable <code style={{
                fontFamily: "monospace"
              }}>selectable</code> to add row checkboxes and bulk actions.
                Use the built-in <code style={{
                fontFamily: "monospace"
              }}>filters</code> and <code style={{
                fontFamily: "monospace"
              }}>searchableColumns</code> props for interactive filtering and search.
                Add <code style={{
                fontFamily: "monospace"
              }}>pageSize</code> for client-side pagination, or control pages externally with <code style={{
                fontFamily: "monospace"
              }}>page</code>, <code style={{
                fontFamily: "monospace"
              }}>totalPages</code>, and <code style={{
                fontFamily: "monospace"
              }}>onPageChange</code>.
              </Paragraph>
              <DataTable columns={SORTABLE_COLUMNS} rows={ALL_ROWS.slice(0, 5)} zebra caption="Team members" defaultSort={{
              key: "name",
              direction: "asc"
            }} />
            </section>

            {/* Columns */}
            <section id="dt-columns">
              <Heading as="h2" size="xs" style={{
              marginBottom: 8
            }}>Columns</Heading>
              <Paragraph style={{
              marginBottom: 20
            }}>
                The <code style={{
                fontFamily: "monospace"
              }}>type</code> prop controls cell rendering.
                Numeric types (<code style={{
                fontFamily: "monospace"
              }}>number</code>, <code style={{
                fontFamily: "monospace"
              }}>currency</code>) are automatically right-aligned with tabular numerals.
                Use <code style={{
                fontFamily: "monospace"
              }}>align</code> to override alignment. <code style={{
                fontFamily: "monospace"
              }}>badge</code> uses a <code style={{
                fontFamily: "monospace"
              }}>statusMap</code> to color-code values.
              </Paragraph>
              <DataTable columns={TYPE_COLUMNS} rows={TYPE_ROWS} />
            </section>

            {/* Density */}
            <section id="dt-density">
              <Heading as="h2" size="xs" style={{
              marginBottom: 8
            }}>Density</Heading>
              <Paragraph style={{
              marginBottom: 20
            }}>
                Three densities — <strong>compact</strong>, <strong>default</strong>, and <strong>comfortable</strong> — adjust cell padding and font size.
                Compact mode also switches badges to the <code style={{
                fontFamily: "monospace"
              }}>sm</code> size and hides their icons.
                Set <code style={{
                fontFamily: "monospace"
              }}>density="auto"</code> to let the table choose based on available container width.
              </Paragraph>
              <div style={{
              display: "flex",
              flexDirection: "column",
              gap: 24
            }}>
                {["comfortable", "default", "compact"].map(d => <div key={d}>
                    <p style={{
                  fontFamily: "sans-serif",
                  fontSize: 11,
                  color: "var(--semantic-color-text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 6
                }}>{d}</p>
                    <DataTable columns={COLUMNS} rows={ALL_ROWS.slice(0, 3)} density={d} />
                  </div>)}
              </div>
            </section>

            {/* Filtering */}
            <section id="dt-filtering">
              <Heading as="h2" size="xs" style={{
              marginBottom: 8
            }}>Filtering</Heading>
              <Paragraph style={{
              marginBottom: 20
            }}>
                <code style={{
                fontFamily: "monospace"
              }}>DataTable</code> renders configured filters as a chip row on wider screens and collapses them into a single menu button at the xs breakpoint (≤480px).
                Filters support <strong>single-select</strong> (radio buttons) and <strong>multi-select</strong> (checkboxes).
                A search input with an optional column-scope selector is included.
              </Paragraph>
              {(() => {
              const [filters, setFilters] = useState({});
              const [search, setSearch] = useState("");
              const [col, setCol] = useState("");
              return <DataTable columns={COLUMNS} rows={ALL_ROWS} filters={FILTER_DEFS} filterValue={filters} onFilterChange={setFilters} searchValue={search} onSearchChange={setSearch} searchColumn={col} onSearchColumnChange={setCol} searchableColumns={SEARCH_COLS} pageSize={PAGE_SIZE} emptyTitle="No matching team members" emptyDescription="Try adjusting your search or filters." emptyIcon="person_search" />;
            })()}
            </section>

            {/* Responsive */}
            <section id="dt-responsive">
              <Heading as="h2" size="xs" style={{
              marginBottom: 8
            }}>Responsive</Heading>
              <Paragraph style={{
              marginBottom: 20
            }}>
                Below 640px, each row flips to a labeled card layout using CSS <code style={{
                fontFamily: "monospace"
              }}>display: block</code> and <code style={{
                fontFamily: "monospace"
              }}>data-label</code> attributes.
                No JavaScript required. Horizontal scrolling is off by default — enable it with <code style={{
                fontFamily: "monospace"
              }}>scrollable</code> for tables that must preserve column widths.
              </Paragraph>
              <Card style={{
              padding: 16,
              background: "var(--semantic-color-surface-panel)"
            }}>
                <p style={{
                fontFamily: "sans-serif",
                fontSize: 12,
                color: "var(--semantic-color-text-muted)",
                marginBottom: 12
              }}>
                  Card-flip preview (simulated at 400px max-width)
                </p>
                <div style={{
                maxWidth: 400
              }}>
                  <DataTable columns={COLUMNS.slice(0, 4)} rows={ALL_ROWS.slice(0, 3)} />
                </div>
              </Card>
            </section>

            {/* Props */}
            <section id="dt-props">
              <Heading as="h2" size="xs" style={{
              marginBottom: 16
            }}>Props</Heading>
              <DataTable columns={PROP_COLUMNS} rows={PROP_ROWS} density="compact" scrollable />
            </section>

          </div>

          {/* ── Sticky page nav ── */}
          <div style={{
          position: "sticky",
          top: 32,
          maxHeight: "calc(100vh - 64px)",
          overflowY: "auto"
        }}>
            <PageNav sections={DOC_SECTIONS} label="On this page" />
          </div>
        </div>
      </div>
    </div>
}`,...J.parameters?.docs?.source}}},ze=[`Configurable`,`WithFilters`,`DensityComparison`,`ResponsiveDensity`,`ZebraStriping`,`WithPagination`,`Sortable`,`SelectableRows`,`EmptyState`,`ColumnTypes`,`HorizontalScroll`,`Documentation`]}))();export{G as ColumnTypes,P as Configurable,I as DensityComparison,J as Documentation,H as EmptyState,K as HorizontalScroll,L as ResponsiveDensity,V as SelectableRows,B as Sortable,F as WithFilters,z as WithPagination,R as ZebraStriping,ze as __namedExportsOrder,Pe as default};