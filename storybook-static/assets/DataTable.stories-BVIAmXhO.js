import{i as e,s as t}from"./preload-helper-Cs4UwXAW.js";import{C as n,t as r}from"./iframe-CkqopHIr.js";import{n as i,t as a}from"./Icon-CIthktPB.js";import{n as o,t as s}from"./Button-DBF41v8C.js";import{n as c,t as l}from"./Card-BTPwcwi8.js";import{r as u,t as d}from"./Heading-CMylqen6.js";import{n as f,t as ee}from"./Link-CeZEM3UJ.js";import{i as te,n as ne,r as p,t as m}from"./Menu-Bz_v0ESF.js";import{n as h,r as g,t as _}from"./Message-CUg0qUZd.js";import{n as v,t as y}from"./Paragraph-BhXhxuLC.js";import{n as re,t as ie}from"./Pagination-BlhbA3CL.js";import{n as ae,t as oe}from"./PageNav-B5oX4p86.js";import{n as se,t as ce}from"./SelectField-WL3EAppL.js";var le=e((()=>{}));function ue(e,t){return e.reduce((e,n)=>e+(n.width?parseFloat(n.width)||C.text:C[n.type]??C.text)+w[t],0)}function de(e){return e?.key?{key:e.key,direction:e.direction===`desc`?`desc`:`asc`}:null}function fe(e,t){let n=typeof t.sortAccessor==`function`?t.sortAccessor(e):e[t.key];if(n==null||n===``)return null;if(t.type===`number`||t.type===`currency`||t.numeric){let e=typeof n==`number`?n:parseFloat(String(n).replace(/[^0-9.-]/g,``));return Number.isNaN(e)?n:e}if(t.type===`date`){let e=n instanceof Date?n.getTime():Date.parse(n);return Number.isNaN(e)?n:e}return n}function pe(e,t){return e==null&&t==null?0:e==null?1:t==null?-1:typeof e==`number`&&typeof t==`number`?e-t:String(e).localeCompare(String(t),void 0,{numeric:!0,sensitivity:`base`})}function me(e,t){return e.id??e.key??e.name??t}function he(e){return(e??[]).map(e=>String(e))}function ge(e){return e.type===`link`||e.type===`actions`}function _e(e){return Array.isArray(e)?e.length>0:e!=null&&e!==``}function ve({checked:e,indeterminate:t=!1,label:n,onChange:r}){let i=(0,x.useRef)(null);return(0,x.useEffect)(()=>{i.current&&(i.current.indeterminate=t)},[t]),(0,S.jsx)(`input`,{ref:i,type:`checkbox`,className:`a1-data-table__checkbox`,checked:e,"aria-label":n,onChange:e=>r(e.target.checked)})}function b({columns:e=[],rows:t=[],density:n=`default`,zebra:r=!1,scrollable:i=!1,caption:o,page:c,totalPages:l,totalRows:u,onPageChange:d,sort:f,defaultSort:te,onSortChange:ne,selectable:p=!1,selectedRowIds:m,defaultSelectedRowIds:g=[],onSelectedRowIdsChange:v,onDeleteSelected:y,getRowId:re=me,emptyTitle:ae=`No results`,emptyDescription:oe,emptyIcon:se=`inbox`,className:le=``,...b}){let C=(0,x.useRef)(null),[w,ye]=(0,x.useState)(`default`),[be,xe]=(0,x.useState)(()=>de(te)),[Se,Ce]=(0,x.useState)(()=>he(g)),T=n===`auto`,we=f!==void 0,E=m!==void 0,D=T?w:n,O=we?de(f):be,k=E?he(m):Se,A=new Set(k);(0,x.useEffect)(()=>{if(!T)return;let t=C.current;if(!t)return;let n=ue(e,`comfortable`),r=ue(e,`default`),i=e=>e>=n?`comfortable`:e>=r?`default`:`compact`,a=new ResizeObserver(([e])=>{ye(i(e.contentRect.width))});return a.observe(t),()=>a.disconnect()},[T,e]);let j=[`a1-data-table`,D!==`default`&&`a1-data-table--${D}`,r&&`a1-data-table--zebra`,le].filter(Boolean).join(` `),M=l!=null&&l>1,N=c==null?1:(c-1)*t.length+1,Te=c==null?t.length:N+t.length-1,P=u??(M?l*t.length:t.length),F=e.filter(e=>e.sortable),I=(O?[...t].sort((t,n)=>{let r=e.find(e=>e.key===O.key);if(!r)return 0;let i=pe(fe(t,r),fe(n,r));return O.direction===`desc`?-i:i}):t).map((t,n)=>({row:t,index:n,id:String(re(t,n)),supportsRowClickSelection:p&&!e.some(e=>ge(e)&&_e(t[e.key]))})),L=I.filter(e=>A.has(e.id)).map(e=>e.row),R=k.length,z=I.length>0&&I.every(e=>A.has(e.id)),B=I.some(e=>A.has(e.id));function V(e){we||xe(e),ne?.(e)}function H(e){let t=he(e);E||Ce(t),v?.(t)}function U(e){let t=O?.key===e.key&&O.direction===`asc`?`desc`:`asc`;V({key:e.key,direction:t})}function W(e){let t=e.target.value;if(!t){V(null);return}let[n,r]=t.split(`:`);V({key:n,direction:r})}function G(e,t){H(t?[...new Set([...k,e])]:k.filter(t=>t!==e))}function K(e){let t=I.map(e=>e.id);H(e?[...new Set([...k,...t])]:k.filter(e=>!t.includes(e)))}function q(){y?.(L,k),H([])}function J(e,t,n){t&&(n.target.closest(`a, button, input, select, textarea, label`)||G(e,!A.has(e)))}function Y(e,t){if(t==null||t===``)return`—`;switch(e.type){case`avatar`:return(0,S.jsxs)(`span`,{className:`a1-data-table__avatar-cell`,children:[(0,S.jsx)(`span`,{className:`a1-data-table__avatar`,"aria-hidden":`true`,children:String(t).split(` `).slice(0,2).map(e=>e[0]).join(``).toUpperCase()}),(0,S.jsx)(`span`,{children:t})]});case`badge`:{let n=e.statusMap?.[t]??`neutral`,r=D===`compact`;return(0,S.jsx)(_,{status:n,subtle:!0,size:r?`sm`:void 0,icon:r?null:void 0,children:t})}case`link`:{let e=typeof t==`object`?t:{href:t,label:t},n=e.href??`#`;return(0,S.jsx)(ee,{href:n,icon:e.icon,iconPosition:e.iconPosition??`end`,target:e.target,rel:e.rel??(e.target===`_blank`?`noreferrer`:void 0),children:e.label??n})}case`actions`:return(0,S.jsx)(`span`,{className:`a1-data-table__actions`,children:(Array.isArray(t)?t:[t]).filter(Boolean).map((e,t)=>(0,S.jsx)(s,{variant:`tertiary`,size:`sm`,icon:e.icon,iconPosition:e.iconPosition??`start`,disabled:e.disabled,onClick:e.onClick,children:e.label},`${e.label??e.icon??`action`}-${t}`))});case`currency`:{let n=e.currencySymbol??`$`,r=typeof t==`number`?t:parseFloat(String(t).replace(/[^0-9.-]/g,``));return isNaN(r)?t:`${n}${r.toLocaleString(`en-US`,{minimumFractionDigits:0,maximumFractionDigits:0})}`}case`number`:{let e=typeof t==`number`?t:parseFloat(t);return isNaN(e)?t:e.toLocaleString(`en-US`)}default:return t}}function X(e){return e.align?e.align:e.type===`number`||e.type===`currency`||e.numeric?`end`:`start`}function Z(e){return O?.key===e.key?O.direction===`desc`?`arrow_downward`:`arrow_upward`:`unfold_more`}function Q(e){if(e.sortable)return O?.key===e.key?O.direction===`desc`?`descending`:`ascending`:`none`}return(0,S.jsxs)(`div`,{ref:C,className:`a1-data-table-wrapper`,...b,children:[p&&R>0&&(0,S.jsxs)(`div`,{className:`a1-data-table-bulk-actions`,role:`region`,"aria-label":`Bulk actions`,children:[(0,S.jsxs)(`span`,{className:`a1-data-table-bulk-actions__count`,children:[R,` selected`]}),(0,S.jsxs)(`div`,{className:`a1-data-table-bulk-actions__controls`,children:[(0,S.jsx)(s,{variant:`tertiary`,size:`sm`,onClick:()=>H([]),children:`Clear`}),y&&(0,S.jsx)(s,{variant:`destructive`,size:`sm`,icon:`delete`,onClick:q,children:`Delete`})]})]}),F.length>0&&(0,S.jsx)(`div`,{className:`a1-data-table-sort`,children:(0,S.jsxs)(ce,{label:`Sort`,size:`compact`,value:O?`${O.key}:${O.direction}`:``,onChange:W,children:[(0,S.jsx)(`option`,{value:``,children:`No sorting`}),F.flatMap(e=>[(0,S.jsxs)(`option`,{value:`${e.key}:asc`,children:[e.label,` ascending`]},`${e.key}:asc`),(0,S.jsxs)(`option`,{value:`${e.key}:desc`,children:[e.label,` descending`]},`${e.key}:desc`)])]})}),(0,S.jsx)(`div`,{className:[`a1-data-table-scroll`,i&&`a1-data-table-scroll--scrollable`].filter(Boolean).join(` `),children:t.length===0?(0,S.jsx)(`div`,{className:`a1-data-table__empty`,children:(0,S.jsx)(h,{scale:`card`,icon:se,title:ae,description:oe})}):(0,S.jsxs)(`table`,{className:j,children:[o&&(0,S.jsx)(`caption`,{children:o}),(0,S.jsx)(`thead`,{children:(0,S.jsxs)(`tr`,{children:[p&&(0,S.jsx)(`th`,{scope:`col`,className:`a1-data-table__select-header`,children:(0,S.jsx)(ve,{checked:z,indeterminate:B&&!z,label:z?`Deselect all rows`:`Select all rows`,onChange:K})}),e.map(e=>(0,S.jsx)(`th`,{scope:`col`,"aria-sort":Q(e),"data-align":X(e),style:e.width?{width:e.width}:void 0,children:e.sortable?(0,S.jsxs)(`button`,{type:`button`,className:`a1-data-table__sort-button`,onClick:()=>U(e),children:[(0,S.jsx)(`span`,{children:e.label}),(0,S.jsx)(a,{name:Z(e),className:`a1-data-table__sort-icon`})]}):e.label},e.key))]})}),(0,S.jsx)(`tbody`,{children:I.map(({row:t,index:n,id:r,supportsRowClickSelection:i})=>{let a=A.has(r);return(0,S.jsxs)(`tr`,{"data-selected":a?`true`:void 0,"data-selectable-row":i?`true`:void 0,onClick:e=>J(r,i,e),children:[p&&(0,S.jsx)(`td`,{className:`a1-data-table__select-cell`,"data-label":`Select`,children:(0,S.jsx)(ve,{checked:a,label:`Select row ${n+1}`,onChange:e=>G(r,e)})}),e.map(e=>(0,S.jsx)(`td`,{"data-label":e.label,"data-align":X(e),children:Y(e,t[e.key])},e.key))]},r)})})]})}),(M||t.length>0)&&(0,S.jsxs)(`div`,{className:`a1-data-table-footer`,children:[(0,S.jsx)(`span`,{className:`a1-data-table-footer__count`,children:M?`Showing ${N}–${Te} of ${P} results`:`${t.length} ${t.length===1?`result`:`results`}`}),M&&(0,S.jsx)(ie,{page:c,totalPages:l,onChange:d,size:`sm`})]})]})}var x,S,C,w,ye=e((()=>{x=t(n(),1),o(),se(),i(),f(),g(),re(),le(),S=r(),C={avatar:160,date:110,actions:120,link:120,text:120,badge:95,currency:85,number:75},w={comfortable:40,default:32,compact:24},b.__docgenInfo={description:``,methods:[],displayName:`DataTable`,props:{columns:{defaultValue:{value:`[]`,computed:!1},required:!1},rows:{defaultValue:{value:`[]`,computed:!1},required:!1},density:{defaultValue:{value:`"default"`,computed:!1},required:!1},zebra:{defaultValue:{value:`false`,computed:!1},required:!1},scrollable:{defaultValue:{value:`false`,computed:!1},required:!1},selectable:{defaultValue:{value:`false`,computed:!1},required:!1},defaultSelectedRowIds:{defaultValue:{value:`[]`,computed:!1},required:!1},getRowId:{defaultValue:{value:`function defaultGetRowId(row, index) {
  return row.id ?? row.key ?? row.name ?? index;
}`,computed:!1},required:!1},emptyTitle:{defaultValue:{value:`"No results"`,computed:!1},required:!1},emptyIcon:{defaultValue:{value:`"inbox"`,computed:!1},required:!1},className:{defaultValue:{value:`""`,computed:!1},required:!1}}}})),be=e((()=>{}));function xe(e,t){if(e.type===`multi`){let n=Array.isArray(t)?t:[];return n.length===0?null:n.length===1?e.options.find(e=>e.value===n[0])?.label??n[0]:`${n.length} selected`}return t?e.options.find(e=>e.value===t)?.label??t:null}function Se(e,t){return e.type===`multi`?Array.isArray(t)&&t.length>0:!!t}function Ce(e){return e?`radio_button_checked`:`radio_button_unchecked`}function T(e){return e?`check_box`:`check_box_outline_blank`}function we({filter:e,selected:t,onSet:n}){let[r,i]=(0,D.useState)(!1),o=(0,D.useRef)(null),s=e.type===`multi`,c=s?Array.isArray(t)?t:[]:null,l=xe(e,t),u=Se(e,t);function d(e){s?n(c.includes(e)?c.filter(t=>t!==e):[...c,e]):(n(t===e?``:e),i(!1))}return(0,O.jsxs)(`div`,{className:`a1-dt-filters__chip-wrap`,children:[(0,O.jsxs)(`button`,{ref:o,type:`button`,className:[`a1-dt-filters__chip`,u&&`a1-dt-filters__chip--active`].filter(Boolean).join(` `),onClick:()=>i(e=>!e),"aria-expanded":r,"aria-haspopup":`listbox`,children:[(0,O.jsx)(`span`,{children:e.label}),l&&(0,O.jsxs)(O.Fragment,{children:[(0,O.jsx)(`span`,{className:`a1-dt-filters__chip-sep`,"aria-hidden":`true`,children:`:`}),(0,O.jsx)(`span`,{className:`a1-dt-filters__chip-value`,children:l})]}),(0,O.jsx)(a,{name:r?`expand_less`:`expand_more`,className:`a1-dt-filters__chip-icon`})]}),u&&(0,O.jsx)(`button`,{type:`button`,className:`a1-dt-filters__chip-clear`,"aria-label":`Clear ${e.label} filter`,onClick:()=>n(s?[]:``),children:(0,O.jsx)(a,{name:`close`})}),(0,O.jsx)(m,{open:r,anchorRef:o,onClose:()=>i(!1),"aria-label":e.label,children:e.options.map(e=>{let n=s?c.includes(e.value):t===e.value;return(0,O.jsx)(ne,{icon:s?T(n):Ce(n),className:n?`a1-dt-filters__item--on`:``,onClick:()=>d(e.value),children:e.label},e.value)})})]})}function E({filters:e=[],value:t={},onChange:n,searchValue:r=``,onSearchChange:i,searchColumn:o=``,onSearchColumnChange:c,searchableColumns:l,className:u=``}){let[d,f]=(0,D.useState)(!1),ee=(0,D.useRef)(null),te=!!i,h=e.filter(e=>Se(e,t[e.key])).length,g=h>0||!!r;function _(e,r){n?.({...t,[e]:r})}function v(){let t={};e.forEach(e=>{t[e.key]=e.type===`multi`?[]:``}),n?.(t),i?.(``)}let y=te&&(0,O.jsxs)(`div`,{className:`a1-dt-filters__search-wrap`,children:[(0,O.jsx)(a,{name:`search`,className:`a1-dt-filters__search-icon`}),(0,O.jsx)(`input`,{type:`search`,className:`a1-dt-filters__search-input`,value:r,onChange:e=>i(e.target.value),placeholder:`Search…`,"aria-label":o?`Search in ${l?.find(e=>e.key===o)?.label??o}`:`Search all fields`}),l?.length>0&&(0,O.jsxs)(`div`,{className:`a1-dt-filters__scope-wrap`,children:[(0,O.jsxs)(`select`,{className:`a1-dt-filters__scope-select`,value:o,onChange:e=>c?.(e.target.value),"aria-label":`Search in field`,children:[(0,O.jsx)(`option`,{value:``,children:`All fields`}),l.map(e=>(0,O.jsx)(`option`,{value:e.key,children:e.label},e.key))]}),(0,O.jsx)(a,{name:`expand_more`,className:`a1-dt-filters__scope-icon`})]})]});return(0,O.jsxs)(`div`,{className:[`a1-dt-filters`,u].filter(Boolean).join(` `),children:[(0,O.jsxs)(`div`,{className:`a1-dt-filters__desktop`,children:[y,e.length>0&&(0,O.jsxs)(O.Fragment,{children:[(0,O.jsx)(`span`,{className:`a1-dt-filters__label`,children:`Filters`}),(0,O.jsx)(`div`,{className:`a1-dt-filters__chips`,children:e.map(e=>(0,O.jsx)(we,{filter:e,selected:t[e.key]??(e.type===`multi`?[]:``),onSet:t=>_(e.key,t)},e.key))})]}),g&&(0,O.jsx)(`button`,{type:`button`,className:`a1-dt-filters__clear-all`,onClick:v,children:`Clear all`})]}),(0,O.jsxs)(`div`,{className:`a1-dt-filters__mobile`,children:[y,e.length>0&&(0,O.jsx)(`div`,{ref:ee,className:`a1-dt-filters__mobile-trigger`,children:(0,O.jsxs)(s,{variant:`secondary`,size:`sm`,icon:`filter_list`,onClick:()=>f(!0),children:[`Filters`,h>0&&(0,O.jsx)(`span`,{className:`a1-dt-filters__mobile-count`,"aria-label":`${h} active`,children:h})]})}),g&&(0,O.jsx)(`button`,{type:`button`,className:`a1-dt-filters__clear-all`,onClick:v,children:`Clear all`}),e.length>0&&(0,O.jsxs)(m,{open:d,anchorRef:ee,onClose:()=>f(!1),"aria-label":`Filters`,children:[e.map(e=>{let n=e.type===`multi`,r=t[e.key],i=n?Array.isArray(r)?r:[]:null;return(0,O.jsx)(p,{label:e.label,children:e.options.map(t=>{let a=n?i.includes(t.value):r===t.value;return(0,O.jsx)(ne,{icon:n?T(a):Ce(a),className:a?`a1-dt-filters__item--on`:``,onClick:()=>{if(n){let n=i.includes(t.value)?i.filter(e=>e!==t.value):[...i,t.value];_(e.key,n)}else _(e.key,r===t.value?``:t.value)},children:t.label},t.value)})},e.key)}),g&&(0,O.jsx)(`div`,{className:`a1-dt-filters__menu-clear`,children:(0,O.jsx)(s,{variant:`tertiary`,size:`sm`,onClick:()=>{v(),f(!1)},children:`Clear all filters`})})]})]})]})}var D,O,k=e((()=>{D=t(n(),1),o(),i(),te(),be(),O=r(),E.__docgenInfo={description:``,methods:[],displayName:`DataTableFilters`,props:{filters:{defaultValue:{value:`[]`,computed:!1},required:!1},value:{defaultValue:{value:`{}`,computed:!1},required:!1},searchValue:{defaultValue:{value:`""`,computed:!1},required:!1},searchColumn:{defaultValue:{value:`""`,computed:!1},required:!1},className:{defaultValue:{value:`""`,computed:!1},required:!1}}}}));function A(e,t,n,r){let i=e;if(i=i.filter(e=>L.every(n=>{let r=t[n.key];return!r||Array.isArray(r)&&r.length===0?!0:Array.isArray(r)?r.includes(e[n.key]):e[n.key]===r})),n){let e=n.toLowerCase();i=i.filter(t=>r?String(t[r]??``).toLowerCase().includes(e):P.some(n=>String(t[n.key]??``).toLowerCase().includes(e)))}return i}function j({children:e,muted:t=!1}){return(0,N.jsx)(`code`,{style:{fontFamily:`monospace`,fontSize:12,color:t?`var(--semantic-color-text-muted)`:`var(--semantic-color-action-background)`},children:e})}var M,N,Te,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q,Ee,De,Oe,$,ke;e((()=>{M=t(n(),1),c(),u(),g(),ae(),v(),ye(),k(),N=r(),Te={title:`Components/DataTable`,component:b,parameters:{layout:`padded`}},P=[{key:`name`,label:`Name`,type:`avatar`},{key:`department`,label:`Department`},{key:`role`,label:`Role`},{key:`location`,label:`Location`,type:`badge`,statusMap:{Remote:`info`,Hybrid:`neutral`,Office:`success`}},{key:`status`,label:`Status`,type:`badge`,statusMap:{Active:`success`,Inactive:`neutral`,"On leave":`warn`}},{key:`salary`,label:`Salary`,type:`currency`}],F=P.map(e=>({...e,sortable:[`name`,`department`,`role`,`status`,`salary`].includes(e.key)})),I=[{name:`Aria Chen`,department:`Design`,role:`Product Designer`,location:`Remote`,status:`Active`,salary:92e3},{name:`Marcus Webb`,department:`Engineering`,role:`Engineering Lead`,location:`Hybrid`,status:`Active`,salary:148e3},{name:`Priya Nair`,department:`Data`,role:`Data Analyst`,location:`Office`,status:`On leave`,salary:88e3},{name:`Tom Erikson`,department:`Sales`,role:`Account Manager`,location:`Remote`,status:`Active`,salary:95e3},{name:`Leila Fontaine`,department:`Design`,role:`UX Researcher`,location:`Hybrid`,status:`Inactive`,salary:82e3},{name:`Devon Park`,department:`Engineering`,role:`Frontend Engineer`,location:`Remote`,status:`Active`,salary:118e3},{name:`Yuki Tanaka`,department:`Marketing`,role:`Brand Strategist`,location:`Office`,status:`Active`,salary:87e3},{name:`Omar Hassan`,department:`Sales`,role:`Sales Director`,location:`Hybrid`,status:`Active`,salary:165e3},{name:`Stella Bowen`,department:`Marketing`,role:`Content Writer`,location:`Remote`,status:`Inactive`,salary:72e3},{name:`James Ortega`,department:`Engineering`,role:`DevOps Engineer`,location:`Hybrid`,status:`Active`,salary:132e3},{name:`Nina Kovac`,department:`Product`,role:`Product Manager`,location:`Office`,status:`Active`,salary:125e3},{name:`Carlos Reyes`,department:`Engineering`,role:`QA Engineer`,location:`Remote`,status:`Active`,salary:98e3},{name:`Maya Johnson`,department:`Design`,role:`Visual Designer`,location:`Hybrid`,status:`Active`,salary:85e3},{name:`Raj Patel`,department:`Data`,role:`Data Scientist`,location:`Remote`,status:`Active`,salary:142e3},{name:`Sofia Torres`,department:`Product`,role:`Product Analyst`,location:`Office`,status:`On leave`,salary:95e3},{name:`Leo Nakamura`,department:`Engineering`,role:`Backend Engineer`,location:`Remote`,status:`Active`,salary:125e3},{name:`Anna Dubois`,department:`Marketing`,role:`Marketing Manager`,location:`Hybrid`,status:`Active`,salary:105e3},{name:`Kevin Osei`,department:`Sales`,role:`Sales Representative`,location:`Office`,status:`Active`,salary:78e3},{name:`Ingrid Larsen`,department:`Design`,role:`Design Lead`,location:`Hybrid`,status:`Active`,salary:118e3},{name:`Mike Chen`,department:`Engineering`,role:`Staff Engineer`,location:`Remote`,status:`Active`,salary:168e3}],L=[{key:`department`,label:`Department`,type:`multi`,options:[{value:`Design`,label:`Design`},{value:`Engineering`,label:`Engineering`},{value:`Product`,label:`Product`},{value:`Marketing`,label:`Marketing`},{value:`Sales`,label:`Sales`},{value:`Data`,label:`Data`}]},{key:`status`,label:`Status`,type:`single`,options:[{value:`Active`,label:`Active`},{value:`Inactive`,label:`Inactive`},{value:`On leave`,label:`On leave`}]},{key:`location`,label:`Location`,type:`single`,options:[{value:`Remote`,label:`Remote`},{value:`Hybrid`,label:`Hybrid`},{value:`Office`,label:`Office`}]}],R=[{key:`name`,label:`Name`},{key:`role`,label:`Role`},{key:`department`,label:`Department`}],z=6,B={args:{density:`default`,zebra:!1,scrollable:!1,caption:``,emptyTitle:`No results`,emptyDescription:``,emptyIcon:`inbox`,rowCount:8},argTypes:{density:{control:`select`,options:[`compact`,`default`,`comfortable`,`auto`],description:`"auto" switches density based on available container width`},zebra:{control:`boolean`},scrollable:{control:`boolean`,description:`Enable horizontal scrolling when content overflows`},caption:{control:`text`},emptyTitle:{control:`text`},emptyDescription:{control:`text`},emptyIcon:{control:`text`,description:`Material symbol name`},rowCount:{control:{type:`range`,min:0,max:20},description:`Rows to display — set to 0 to preview the empty state`}},render:({rowCount:e,...t})=>(0,N.jsx)(b,{...t,columns:P,rows:I.slice(0,e)})},V={render:()=>{let[e,t]=(0,M.useState)({}),[n,r]=(0,M.useState)(``),[i,a]=(0,M.useState)(``),[o,s]=(0,M.useState)(1),c=A(I,e,n,i),l=Math.ceil(c.length/z),u=c.slice((o-1)*z,o*z);function d(){s(1)}return(0,N.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:12},children:[(0,N.jsx)(E,{filters:L,value:e,onChange:e=>{t(e),d()},searchValue:n,onSearchChange:e=>{r(e),d()},searchColumn:i,onSearchColumnChange:e=>{a(e),d()},searchableColumns:R}),(0,N.jsx)(b,{columns:P,rows:u,page:o,totalPages:l>1?l:void 0,totalRows:c.length,onPageChange:s,emptyTitle:`No matching team members`,emptyDescription:`Try adjusting your search or clearing some filters.`,emptyIcon:`person_search`})]})}},H={render:()=>(0,N.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:40},children:[`comfortable`,`default`,`compact`].map(e=>(0,N.jsxs)(`div`,{children:[(0,N.jsx)(`p`,{style:{fontFamily:`sans-serif`,fontSize:12,color:`#888`,marginBottom:8,textTransform:`capitalize`},children:e}),(0,N.jsx)(b,{columns:P,rows:I.slice(0,4),density:e})]},e))})},U={parameters:{layout:`fullscreen`},render:()=>(0,N.jsxs)(`div`,{style:{padding:24},children:[(0,N.jsx)(`p`,{style:{fontFamily:`sans-serif`,fontSize:13,color:`#888`,marginBottom:16},children:`Resize the Storybook canvas — the table automatically switches between comfortable, default, and compact density based on the available container width and column type estimates.`}),(0,N.jsx)(b,{columns:P,rows:I.slice(0,8),density:`auto`,zebra:!0,caption:`Team directory — auto density`})]})},W={render:()=>(0,N.jsx)(b,{columns:P,rows:I.slice(0,8),zebra:!0,caption:`Team members`})},G={render:()=>{let[e,t]=(0,M.useState)(1),n=Math.ceil(I.length/z);return(0,N.jsx)(b,{columns:P,rows:I.slice((e-1)*z,e*z),page:e,totalPages:n,totalRows:I.length,onPageChange:t,zebra:!0,caption:`All team members`})}},K={render:()=>{let[e,t]=(0,M.useState)({key:`name`,direction:`asc`});return(0,N.jsx)(b,{columns:F,rows:I.slice(0,10),sort:e,onSortChange:t,zebra:!0,caption:`Sortable team directory`})}},q={render:()=>{let[e,t]=(0,M.useState)(I.slice(0,10)),[n,r]=(0,M.useState)([]);function i(e,n){t(e=>e.filter((e,t)=>{let r=String(e.id??e.key??e.name??t);return!n.includes(r)}))}return(0,N.jsx)(b,{columns:F,rows:e,selectable:!0,selectedRowIds:n,onSelectedRowIdsChange:r,onDeleteSelected:i,defaultSort:{key:`name`,direction:`asc`},zebra:!0,caption:`Selectable team directory`})}},J={render:()=>(0,N.jsx)(b,{columns:P,rows:[],emptyTitle:`No team members found`,emptyDescription:`Try adjusting your filters or search term.`,emptyIcon:`person_search`})},Y=[{key:`name`,label:`Name`,type:`avatar`},{key:`score`,label:`Score`,type:`number`,align:`end`},{key:`budget`,label:`Budget`,type:`currency`},{key:`status`,label:`Status`,type:`badge`,statusMap:{Approved:`success`,Pending:`warn`,Rejected:`error`,Draft:`neutral`}},{key:`brief`,label:`Brief`,type:`link`},{key:`updated`,label:`Updated`,type:`date`},{key:`notes`,label:`Notes`},{key:`actions`,label:`Actions`,type:`actions`,align:`end`}],X=[{name:`Aria Chen`,score:9821,budget:45e3,status:`Approved`,brief:{href:`#aria-chen`,label:`Open brief`,icon:`open_in_new`},updated:`May 20, 2026`,notes:`Q2 review complete`,actions:[{label:`View`,icon:`visibility`,onClick:()=>{}}]},{name:`Marcus Webb`,score:7403,budget:12e4,status:`Pending`,brief:{href:`#marcus-webb`,label:`Open brief`,icon:`open_in_new`},updated:`May 18, 2026`,notes:`Awaiting sign-off`,actions:[{label:`Review`,icon:`rate_review`,onClick:()=>{}}]},{name:`Priya Nair`,score:5190,budget:22500,status:`Draft`,brief:{href:`#priya-nair`,label:`Open brief`,icon:`open_in_new`},updated:`May 15, 2026`,notes:``,actions:[{label:`Edit`,icon:`edit`,onClick:()=>{}}]},{name:`Tom Erikson`,score:11204,budget:88e3,status:`Rejected`,brief:{href:`#tom-erikson`,label:`Open brief`,icon:`open_in_new`},updated:`May 10, 2026`,notes:`See attached brief`,actions:[{label:`Resolve`,icon:`task_alt`,onClick:()=>{}}]},{name:`Leila F.`,score:3051,budget:15e3,status:`Approved`,brief:{href:`#leila-f`,label:`Open brief`,icon:`open_in_new`},updated:`Apr 30, 2026`,notes:``,actions:[{label:`View`,icon:`visibility`,onClick:()=>{}}]}],Z={render:()=>(0,N.jsx)(b,{columns:Y,rows:X,caption:`All column types — avatar, number, currency, badge, link, date, text, actions`,scrollable:!0})},Q={render:()=>(0,N.jsxs)(`div`,{style:{maxWidth:500},children:[(0,N.jsx)(`p`,{style:{fontFamily:`sans-serif`,fontSize:13,color:`#888`,marginBottom:12},children:`Container constrained to 500px — scrollable prop enables horizontal overflow.`}),(0,N.jsx)(b,{columns:P,rows:I.slice(0,5),scrollable:!0})]})},Ee=[{id:`dt-overview`,label:`Overview`},{id:`dt-columns`,label:`Columns`},{id:`dt-density`,label:`Density`},{id:`dt-filtering`,label:`Filtering`},{id:`dt-responsive`,label:`Responsive`},{id:`dt-props`,label:`Props`}],De=[{key:`name`,label:`Prop`,width:`150px`},{key:`type`,label:`Type`,width:`280px`},{key:`defaultVal`,label:`Default`,width:`120px`},{key:`description`,label:`Description`}],Oe=[{name:(0,N.jsx)(j,{children:`columns`}),type:(0,N.jsx)(j,{children:`Column[]`}),defaultVal:(0,N.jsx)(j,{muted:!0,children:`[]`}),description:`Column definitions — key, label, type, align, width, statusMap`},{name:(0,N.jsx)(j,{children:`rows`}),type:(0,N.jsx)(j,{children:`Record<string,any>[]`}),defaultVal:(0,N.jsx)(j,{muted:!0,children:`[]`}),description:`Row data — keys must match column keys`},{name:(0,N.jsx)(j,{children:`sort`}),type:(0,N.jsx)(j,{children:`{ key: string, direction: "asc"|"desc" }`}),defaultVal:(0,N.jsx)(j,{muted:!0,children:`—`}),description:`Controlled sort state`},{name:(0,N.jsx)(j,{children:`defaultSort`}),type:(0,N.jsx)(j,{children:`{ key: string, direction: "asc"|"desc" }`}),defaultVal:(0,N.jsx)(j,{muted:!0,children:`—`}),description:`Initial sort state for uncontrolled tables`},{name:(0,N.jsx)(j,{children:`onSortChange`}),type:(0,N.jsx)(j,{children:`(sort: Sort | null) => void`}),defaultVal:(0,N.jsx)(j,{muted:!0,children:`—`}),description:`Called when a sortable header or mobile sort select changes`},{name:(0,N.jsx)(j,{children:`selectable`}),type:(0,N.jsx)(j,{children:`boolean`}),defaultVal:(0,N.jsx)(j,{muted:!0,children:`false`}),description:`Adds row selection checkboxes and a select-all header control`},{name:(0,N.jsx)(j,{children:`selectedRowIds`}),type:(0,N.jsx)(j,{children:`Array<string|number>`}),defaultVal:(0,N.jsx)(j,{muted:!0,children:`—`}),description:`Controlled selected row ids`},{name:(0,N.jsx)(j,{children:`defaultSelectedRowIds`}),type:(0,N.jsx)(j,{children:`Array<string|number>`}),defaultVal:(0,N.jsx)(j,{muted:!0,children:`[]`}),description:`Initial selected row ids for uncontrolled tables`},{name:(0,N.jsx)(j,{children:`onSelectedRowIdsChange`}),type:(0,N.jsx)(j,{children:`(ids: string[]) => void`}),defaultVal:(0,N.jsx)(j,{muted:!0,children:`—`}),description:`Called when row selection changes`},{name:(0,N.jsx)(j,{children:`onDeleteSelected`}),type:(0,N.jsx)(j,{children:`(rows: Row[], ids: string[]) => void`}),defaultVal:(0,N.jsx)(j,{muted:!0,children:`—`}),description:`Shows a destructive Delete bulk action and calls back with selected rows and ids`},{name:(0,N.jsx)(j,{children:`getRowId`}),type:(0,N.jsx)(j,{children:`(row, index) => string|number`}),defaultVal:(0,N.jsx)(j,{muted:!0,children:`—`}),description:`Returns each row's stable id. Defaults to id, key, name, then index`},{name:(0,N.jsx)(j,{children:`density`}),type:(0,N.jsx)(j,{children:`"compact"|"default"|"comfortable"|"auto"`}),defaultVal:(0,N.jsx)(j,{muted:!0,children:`"default"`}),description:`Cell spacing. auto picks density from container width`},{name:(0,N.jsx)(j,{children:`zebra`}),type:(0,N.jsx)(j,{children:`boolean`}),defaultVal:(0,N.jsx)(j,{muted:!0,children:`false`}),description:`Alternate row background shading`},{name:(0,N.jsx)(j,{children:`scrollable`}),type:(0,N.jsx)(j,{children:`boolean`}),defaultVal:(0,N.jsx)(j,{muted:!0,children:`false`}),description:`Enable horizontal overflow scrolling`},{name:(0,N.jsx)(j,{children:`caption`}),type:(0,N.jsx)(j,{children:`string`}),defaultVal:(0,N.jsx)(j,{muted:!0,children:`—`}),description:`Accessible table caption (renders above header)`},{name:(0,N.jsx)(j,{children:`page`}),type:(0,N.jsx)(j,{children:`number`}),defaultVal:(0,N.jsx)(j,{muted:!0,children:`—`}),description:`Current page (1-indexed). Enables pagination footer`},{name:(0,N.jsx)(j,{children:`totalPages`}),type:(0,N.jsx)(j,{children:`number`}),defaultVal:(0,N.jsx)(j,{muted:!0,children:`—`}),description:`Total number of pages`},{name:(0,N.jsx)(j,{children:`totalRows`}),type:(0,N.jsx)(j,{children:`number`}),defaultVal:(0,N.jsx)(j,{muted:!0,children:`—`}),description:`Total row count across all pages (for footer text)`},{name:(0,N.jsx)(j,{children:`onPageChange`}),type:(0,N.jsx)(j,{children:`(page: number) => void`}),defaultVal:(0,N.jsx)(j,{muted:!0,children:`—`}),description:`Called when the user changes page`},{name:(0,N.jsx)(j,{children:`emptyTitle`}),type:(0,N.jsx)(j,{children:`string`}),defaultVal:(0,N.jsx)(j,{muted:!0,children:`"No results"`}),description:`Heading shown when rows is empty`},{name:(0,N.jsx)(j,{children:`emptyDescription`}),type:(0,N.jsx)(j,{children:`string`}),defaultVal:(0,N.jsx)(j,{muted:!0,children:`—`}),description:`Body text in the empty state`},{name:(0,N.jsx)(j,{children:`emptyIcon`}),type:(0,N.jsx)(j,{children:`string`}),defaultVal:(0,N.jsx)(j,{muted:!0,children:`"inbox"`}),description:`Material symbol name for the empty state icon`}],$={parameters:{layout:`fullscreen`},render:()=>(0,N.jsx)(`div`,{style:{background:`var(--semantic-color-surface-page)`,minHeight:`100vh`},children:(0,N.jsx)(`div`,{style:{maxWidth:1100,margin:`0 auto`,padding:`48px 24px`},children:(0,N.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`minmax(0,2fr) 220px`,gap:48,alignItems:`start`},children:[(0,N.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:48},children:[(0,N.jsxs)(`div`,{children:[(0,N.jsx)(_,{status:`info`,subtle:!0,style:{marginBottom:12},children:`Component`}),(0,N.jsx)(d,{as:`h1`,size:`lg`,style:{marginBottom:8},children:`DataTable`}),(0,N.jsx)(y,{size:`lg`,color:`muted`,children:`Displays tabular data with configurable density, sorting, filtering, pagination, and responsive card-flip layout for narrow viewports.`})]}),(0,N.jsxs)(`section`,{id:`dt-overview`,children:[(0,N.jsx)(d,{as:`h2`,size:`xs`,style:{marginBottom:16},children:`Overview`}),(0,N.jsxs)(y,{style:{marginBottom:20},children:[`DataTable accepts a `,(0,N.jsx)(`code`,{style:{fontFamily:`monospace`},children:`columns`}),` definition and `,(0,N.jsx)(`code`,{style:{fontFamily:`monospace`},children:`rows`}),` array. Each column specifies a `,(0,N.jsx)(`code`,{style:{fontFamily:`monospace`},children:`type`}),` that controls rendering — text, number, currency, date, badge, or avatar. Mark columns as `,(0,N.jsx)(`code`,{style:{fontFamily:`monospace`},children:`sortable`}),` to add header controls and a mobile sort selector. Enable `,(0,N.jsx)(`code`,{style:{fontFamily:`monospace`},children:`selectable`}),` to add row checkboxes and bulk actions. Pair it with `,(0,N.jsx)(`code`,{style:{fontFamily:`monospace`},children:`DataTableFilters`}),` for interactive filtering and search.`]}),(0,N.jsx)(b,{columns:F,rows:I.slice(0,5),zebra:!0,caption:`Team members`,defaultSort:{key:`name`,direction:`asc`}})]}),(0,N.jsxs)(`section`,{id:`dt-columns`,children:[(0,N.jsx)(d,{as:`h2`,size:`xs`,style:{marginBottom:8},children:`Columns`}),(0,N.jsxs)(y,{style:{marginBottom:20},children:[`The `,(0,N.jsx)(`code`,{style:{fontFamily:`monospace`},children:`type`}),` prop controls cell rendering. Numeric types (`,(0,N.jsx)(`code`,{style:{fontFamily:`monospace`},children:`number`}),`, `,(0,N.jsx)(`code`,{style:{fontFamily:`monospace`},children:`currency`}),`) are automatically right-aligned with tabular numerals. Use `,(0,N.jsx)(`code`,{style:{fontFamily:`monospace`},children:`align`}),` to override alignment. `,(0,N.jsx)(`code`,{style:{fontFamily:`monospace`},children:`badge`}),` uses a `,(0,N.jsx)(`code`,{style:{fontFamily:`monospace`},children:`statusMap`}),` to color-code values.`]}),(0,N.jsx)(b,{columns:Y,rows:X})]}),(0,N.jsxs)(`section`,{id:`dt-density`,children:[(0,N.jsx)(d,{as:`h2`,size:`xs`,style:{marginBottom:8},children:`Density`}),(0,N.jsxs)(y,{style:{marginBottom:20},children:[`Three densities — `,(0,N.jsx)(`strong`,{children:`compact`}),`, `,(0,N.jsx)(`strong`,{children:`default`}),`, and `,(0,N.jsx)(`strong`,{children:`comfortable`}),` — adjust cell padding and font size. Compact mode also switches badges to the `,(0,N.jsx)(`code`,{style:{fontFamily:`monospace`},children:`sm`}),` size and hides their icons. Set `,(0,N.jsx)(`code`,{style:{fontFamily:`monospace`},children:`density="auto"`}),` to let the table choose based on available container width.`]}),(0,N.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:24},children:[`comfortable`,`default`,`compact`].map(e=>(0,N.jsxs)(`div`,{children:[(0,N.jsx)(`p`,{style:{fontFamily:`sans-serif`,fontSize:11,color:`#aaa`,textTransform:`uppercase`,letterSpacing:`0.06em`,marginBottom:6},children:e}),(0,N.jsx)(b,{columns:P,rows:I.slice(0,3),density:e})]},e))})]}),(0,N.jsxs)(`section`,{id:`dt-filtering`,children:[(0,N.jsx)(d,{as:`h2`,size:`xs`,style:{marginBottom:8},children:`Filtering`}),(0,N.jsxs)(y,{style:{marginBottom:20},children:[(0,N.jsx)(`code`,{style:{fontFamily:`monospace`},children:`DataTableFilters`}),` renders a chip row on wider screens and collapses into a single menu button at the xs breakpoint (≤480px). Filters support `,(0,N.jsx)(`strong`,{children:`single-select`}),` (radio buttons) and `,(0,N.jsx)(`strong`,{children:`multi-select`}),` (checkboxes). A search input with an optional column-scope selector is included.`]}),(()=>{let[e,t]=(0,M.useState)({}),[n,r]=(0,M.useState)(``),[i,a]=(0,M.useState)(``),o=A(I,e,n,i);return(0,N.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:12},children:[(0,N.jsx)(E,{filters:L,value:e,onChange:t,searchValue:n,onSearchChange:r,searchColumn:i,onSearchColumnChange:a,searchableColumns:R}),(0,N.jsx)(b,{columns:P,rows:o.slice(0,6),emptyTitle:`No matching team members`,emptyDescription:`Try adjusting your search or filters.`,emptyIcon:`person_search`})]})})()]}),(0,N.jsxs)(`section`,{id:`dt-responsive`,children:[(0,N.jsx)(d,{as:`h2`,size:`xs`,style:{marginBottom:8},children:`Responsive`}),(0,N.jsxs)(y,{style:{marginBottom:20},children:[`Below 640px, each row flips to a labeled card layout using CSS `,(0,N.jsx)(`code`,{style:{fontFamily:`monospace`},children:`display: block`}),` and `,(0,N.jsx)(`code`,{style:{fontFamily:`monospace`},children:`data-label`}),` attributes. No JavaScript required. Horizontal scrolling is off by default — enable it with `,(0,N.jsx)(`code`,{style:{fontFamily:`monospace`},children:`scrollable`}),` for tables that must preserve column widths.`]}),(0,N.jsxs)(l,{style:{padding:16,background:`var(--semantic-color-surface-panel)`},children:[(0,N.jsx)(`p`,{style:{fontFamily:`sans-serif`,fontSize:12,color:`#888`,marginBottom:12},children:`Card-flip preview (simulated at 400px max-width)`}),(0,N.jsx)(`div`,{style:{maxWidth:400},children:(0,N.jsx)(b,{columns:P.slice(0,4),rows:I.slice(0,3)})})]})]}),(0,N.jsxs)(`section`,{id:`dt-props`,children:[(0,N.jsx)(d,{as:`h2`,size:`xs`,style:{marginBottom:16},children:`Props`}),(0,N.jsx)(b,{columns:De,rows:Oe,density:`compact`,scrollable:!0})]})]}),(0,N.jsx)(`div`,{style:{position:`sticky`,top:32,maxHeight:`calc(100vh - 64px)`,overflowY:`auto`},children:(0,N.jsx)(oe,{sections:Ee,label:`On this page`})})]})})})},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    density: "default",
    zebra: false,
    scrollable: false,
    caption: "",
    emptyTitle: "No results",
    emptyDescription: "",
    emptyIcon: "inbox",
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
      control: "text",
      description: "Material symbol name"
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
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [filters, setFilters] = useState({});
    const [searchValue, setSearchValue] = useState("");
    const [searchColumn, setSearchColumn] = useState("");
    const [page, setPage] = useState(1);
    const filtered = applyFiltersAndSearch(ALL_ROWS, filters, searchValue, searchColumn);
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    function reset() {
      setPage(1);
    }
    return <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 12
    }}>
        <DataTableFilters filters={FILTER_DEFS} value={filters} onChange={v => {
        setFilters(v);
        reset();
      }} searchValue={searchValue} onSearchChange={v => {
        setSearchValue(v);
        reset();
      }} searchColumn={searchColumn} onSearchColumnChange={v => {
        setSearchColumn(v);
        reset();
      }} searchableColumns={SEARCH_COLS} />
        <DataTable columns={COLUMNS} rows={pageRows} page={page} totalPages={totalPages > 1 ? totalPages : undefined} totalRows={filtered.length} onPageChange={setPage} emptyTitle="No matching team members" emptyDescription="Try adjusting your search or clearing some filters." emptyIcon="person_search" />
      </div>;
  }
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: 40
  }}>
      {["comfortable", "default", "compact"].map(density => <div key={density}>
          <p style={{
        fontFamily: "sans-serif",
        fontSize: 12,
        color: "#888",
        marginBottom: 8,
        textTransform: "capitalize"
      }}>
            {density}
          </p>
          <DataTable columns={COLUMNS} rows={ALL_ROWS.slice(0, 4)} density={density} />
        </div>)}
    </div>
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  parameters: {
    layout: "fullscreen"
  },
  render: () => <div style={{
    padding: 24
  }}>
      <p style={{
      fontFamily: "sans-serif",
      fontSize: 13,
      color: "#888",
      marginBottom: 16
    }}>
        Resize the Storybook canvas — the table automatically switches between comfortable,
        default, and compact density based on the available container width and column type estimates.
      </p>
      <DataTable columns={COLUMNS} rows={ALL_ROWS.slice(0, 8)} density="auto" zebra caption="Team directory — auto density" />
    </div>
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  render: () => <DataTable columns={COLUMNS} rows={ALL_ROWS.slice(0, 8)} zebra caption="Team members" />
}`,...W.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(ALL_ROWS.length / PAGE_SIZE);
    const pageRows = ALL_ROWS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    return <DataTable columns={COLUMNS} rows={pageRows} page={page} totalPages={totalPages} totalRows={ALL_ROWS.length} onPageChange={setPage} zebra caption="All team members" />;
  }
}`,...G.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [sort, setSort] = useState({
      key: "name",
      direction: "asc"
    });
    return <DataTable columns={SORTABLE_COLUMNS} rows={ALL_ROWS.slice(0, 10)} sort={sort} onSortChange={setSort} zebra caption="Sortable team directory" />;
  }
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
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
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  render: () => <DataTable columns={COLUMNS} rows={[]} emptyTitle="No team members found" emptyDescription="Try adjusting your filters or search term." emptyIcon="person_search" />
}`,...J.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  render: () => <DataTable columns={TYPE_COLUMNS} rows={TYPE_ROWS} caption="All column types — avatar, number, currency, badge, link, date, text, actions" scrollable />
}`,...Z.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    maxWidth: 500
  }}>
      <p style={{
      fontFamily: "sans-serif",
      fontSize: 13,
      color: "#888",
      marginBottom: 12
    }}>
        Container constrained to 500px — scrollable prop enables horizontal overflow.
      </p>
      <DataTable columns={COLUMNS} rows={ALL_ROWS.slice(0, 5)} scrollable />
    </div>
}`,...Q.parameters?.docs?.source}}},$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
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
                Pair it with <code style={{
                fontFamily: "monospace"
              }}>DataTableFilters</code> for interactive filtering and search.
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
                  color: "#aaa",
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
              }}>DataTableFilters</code> renders a chip row on wider screens and collapses into a single menu button at the xs breakpoint (≤480px).
                Filters support <strong>single-select</strong> (radio buttons) and <strong>multi-select</strong> (checkboxes).
                A search input with an optional column-scope selector is included.
              </Paragraph>
              {(() => {
              const [filters, setFilters] = useState({});
              const [search, setSearch] = useState("");
              const [col, setCol] = useState("");
              const rows = applyFiltersAndSearch(ALL_ROWS, filters, search, col);
              return <div style={{
                display: "flex",
                flexDirection: "column",
                gap: 12
              }}>
                    <DataTableFilters filters={FILTER_DEFS} value={filters} onChange={setFilters} searchValue={search} onSearchChange={setSearch} searchColumn={col} onSearchColumnChange={setCol} searchableColumns={SEARCH_COLS} />
                    <DataTable columns={COLUMNS} rows={rows.slice(0, 6)} emptyTitle="No matching team members" emptyDescription="Try adjusting your search or filters." emptyIcon="person_search" />
                  </div>;
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
                color: "#888",
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
}`,...$.parameters?.docs?.source}}},ke=[`Configurable`,`WithFilters`,`DensityComparison`,`ResponsiveDensity`,`ZebraStriping`,`WithPagination`,`Sortable`,`SelectableRows`,`EmptyState`,`ColumnTypes`,`HorizontalScroll`,`Documentation`]}))();export{Z as ColumnTypes,B as Configurable,H as DensityComparison,$ as Documentation,J as EmptyState,Q as HorizontalScroll,U as ResponsiveDensity,q as SelectableRows,K as Sortable,V as WithFilters,G as WithPagination,W as ZebraStriping,ke as __namedExportsOrder,Te as default};