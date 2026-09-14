"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([["2184"],{73099(e,r,t){t.r(r),t.d(r,{default:()=>d});var o=t(20923),n=t(32184),a=t(18123),l=t(98105);let i={class:"h-full p-20px"},c=["src"],s=(0,a.defineComponent)({__name:"index",setup(e){let r=(0,a.ref)(`${window.location.origin}${l.Cu?"/api":""}/rspamd/`);return(e,t)=>{let l=(0,a.resolveComponent)("router-link"),s=n.A,d=o.Ay;return(0,a.openBlock)(),(0,a.createElementBlock)("div",i,[(0,a.createVNode)(d,{class:"mb-16px"},{default:(0,a.withCtx)(()=>[(0,a.createVNode)(s,null,{default:(0,a.withCtx)(()=>[(0,a.createVNode)(l,{to:"/settings"},{default:(0,a.withCtx)(()=>[(0,a.createTextVNode)((0,a.toDisplayString)(e.$t("layout.menu.settings")),1)]),_:1})]),_:1}),(0,a.createVNode)(s,null,{default:(0,a.withCtx)(()=>[(0,a.createVNode)(l,{to:"/settings/service"},{default:(0,a.withCtx)(()=>[(0,a.createTextVNode)((0,a.toDisplayString)(e.$t("layout.menu.service")),1)]),_:1})]),_:1}),(0,a.createVNode)(s,null,{default:(0,a.withCtx)(()=>[...t[0]||(t[0]=[(0,a.createTextVNode)("Rspamd",-1)])]),_:1})]),_:1}),(0,a.createElementVNode)("iframe",{class:"w-full",src:(0,a.unref)(r)},null,8,c)])}}}),d=(0,t(31765).default)(s,[["__scopeId","data-v-8cf9b823"]])},20923(e,r,t){t.d(r,{s7:()=>u,Ay:()=>v});var o=t(18123),n=t(12894),a=t(91945),l=t(47580),i=t(98667),c=t(81125),s=t(26005);let d=(0,s.cB)("breadcrumb",`
 white-space: nowrap;
 cursor: default;
 line-height: var(--n-item-line-height);
`,[(0,s.c)("ul",`
 list-style: none;
 padding: 0;
 margin: 0;
 `),(0,s.c)("a",`
 color: inherit;
 text-decoration: inherit;
 `),(0,s.cB)("breadcrumb-item",`
 font-size: var(--n-font-size);
 transition: color .3s var(--n-bezier);
 display: inline-flex;
 align-items: center;
 `,[(0,s.cB)("icon",`
 font-size: 18px;
 vertical-align: -.2em;
 transition: color .3s var(--n-bezier);
 color: var(--n-item-text-color);
 `),(0,s.c)("&:not(:last-child)",[(0,s.cM)("clickable",[(0,s.cE)("link",`
 cursor: pointer;
 `,[(0,s.c)("&:hover",`
 background-color: var(--n-item-color-hover);
 `),(0,s.c)("&:active",`
 background-color: var(--n-item-color-pressed); 
 `)])])]),(0,s.cE)("link",`
 padding: 4px;
 border-radius: var(--n-item-border-radius);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 color: var(--n-item-text-color);
 position: relative;
 `,[(0,s.c)("&:hover",`
 color: var(--n-item-text-color-hover);
 `,[(0,s.cB)("icon",`
 color: var(--n-item-text-color-hover);
 `)]),(0,s.c)("&:active",`
 color: var(--n-item-text-color-pressed);
 `,[(0,s.cB)("icon",`
 color: var(--n-item-text-color-pressed);
 `)])]),(0,s.cE)("separator",`
 margin: 0 8px;
 color: var(--n-separator-color);
 transition: color .3s var(--n-bezier);
 user-select: none;
 -webkit-user-select: none;
 `),(0,s.c)("&:last-child",[(0,s.cE)("link",`
 font-weight: var(--n-font-weight-active);
 cursor: unset;
 color: var(--n-item-text-color-active);
 `,[(0,s.cB)("icon",`
 color: var(--n-item-text-color-active);
 `)]),(0,s.cE)("separator",`
 display: none;
 `)])])]),u=(0,i.D)("n-breadcrumb"),m=Object.assign(Object.assign({},n.A.props),{separator:{type:String,default:"/"}}),v=(0,o.defineComponent)({name:"Breadcrumb",props:m,setup(e){let{mergedClsPrefixRef:r,inlineThemeDisabled:t}=(0,a.Ay)(e),i=(0,n.A)("Breadcrumb","-breadcrumb",d,c.A,e,r);(0,o.provide)(u,{separatorRef:(0,o.toRef)(e,"separator"),mergedClsPrefixRef:r});let s=(0,o.computed)(()=>{let{common:{cubicBezierEaseInOut:e},self:{separatorColor:r,itemTextColor:t,itemTextColorHover:o,itemTextColorPressed:n,itemTextColorActive:a,fontSize:l,fontWeightActive:c,itemBorderRadius:s,itemColorHover:d,itemColorPressed:u,itemLineHeight:m}}=i.value;return{"--n-font-size":l,"--n-bezier":e,"--n-item-text-color":t,"--n-item-text-color-hover":o,"--n-item-text-color-pressed":n,"--n-item-text-color-active":a,"--n-separator-color":r,"--n-item-color-hover":d,"--n-item-color-pressed":u,"--n-item-border-radius":s,"--n-font-weight-active":c,"--n-item-line-height":m}}),m=t?(0,l.R)("breadcrumb",void 0,s,e):void 0;return{mergedClsPrefix:r,cssVars:t?void 0:s,themeClass:null==m?void 0:m.themeClass,onRender:null==m?void 0:m.onRender}},render(){var e;return null==(e=this.onRender)||e.call(this),(0,o.h)("nav",{class:[`${this.mergedClsPrefix}-breadcrumb`,this.themeClass],style:this.cssVars,"aria-label":"Breadcrumb"},(0,o.h)("ul",null,this.$slots))}})},32184(e,r,t){t.d(r,{A:()=>i});var o=t(18123),n=t(80224),a=t(12221),l=t(20923);let i=(0,o.defineComponent)({name:"BreadcrumbItem",props:{separator:String,href:String,clickable:{type:Boolean,default:!0},onClick:Function},slots:Object,setup(e,{slots:r}){let t=(0,o.inject)(l.s7,null);if(!t)return()=>null;let{separatorRef:i,mergedClsPrefixRef:c}=t,s=function(e=a.B?window:null){let r=()=>{let{hash:r,host:t,hostname:o,href:n,origin:a,pathname:l,port:i,protocol:c,search:s}=(null==e?void 0:e.location)||{};return{hash:r,host:t,hostname:o,href:n,origin:a,pathname:l,port:i,protocol:c,search:s}},t=(0,o.ref)(r()),n=()=>{t.value=r()};return(0,o.onMounted)(()=>{e&&(e.addEventListener("popstate",n),e.addEventListener("hashchange",n))}),(0,o.onUnmounted)(()=>{e&&(e.removeEventListener("popstate",n),e.removeEventListener("hashchange",n))}),t}(),d=(0,o.computed)(()=>e.href?"a":"span"),u=(0,o.computed)(()=>s.value.href===e.href?"location":null);return()=>{let{value:t}=c;return(0,o.h)("li",{class:[`${t}-breadcrumb-item`,e.clickable&&`${t}-breadcrumb-item--clickable`]},(0,o.h)(d.value,{class:`${t}-breadcrumb-item__link`,"aria-current":u.value,href:e.href,onClick:e.onClick},r),(0,o.h)("span",{class:`${t}-breadcrumb-item__separator`,"aria-hidden":"true"},(0,n.Nj)(r.separator,()=>{var r;return[null!=(r=e.separator)?r:i.value]})))}}})}}]);