"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([["9737"],{47399(e,t,a){a.d(t,{FI:()=>p,GA:()=>v,MX:()=>c,VP:()=>m,XZ:()=>s,lC:()=>u,oc:()=>h,p0:()=>f,pS:()=>i,u3:()=>o,vq:()=>d});var r=a(53626),l=a(12189);let{t:n}=r.Ru.global;function o(e){return l.K.get("/batch_mail/task/list",{params:e})}function i(e){return l.K.get("/batch_mail/task/stat_chart",{params:e})}function c(e){return l.K.get("/batch_mail/task/find",{params:e})}function s(e){return l.K.post("/batch_mail/task/create",e,{fetchOptions:{loading:n("market.task.loading.creating"),successMessage:!0}})}function u(e){return l.K.post("/batch_mail/task/update",e,{fetchOptions:{loading:n("market.task.loading.updating"),successMessage:!0}})}function d(e){return l.K.post("/batch_mail/task/delete",e,{fetchOptions:{loading:n("market.task.loading.deleting"),successMessage:!0}})}function v(e){return l.K.post("/batch_mail/task/pause",e,{fetchOptions:{loading:n("market.task.loading.pausing"),successMessage:!0}})}function m(e){return l.K.post("/batch_mail/task/resume",e,{fetchOptions:{loading:n("market.task.loading.resuming"),successMessage:!0}})}function p(e){return l.K.post("/batch_mail/task/send_test",e,{fetchOptions:{loading:n("market.task.loading.sendingTest"),successMessage:!0}})}function f(e){return l.K.get("/batch_mail/tracking/mail_provider",{params:e})}function h(e){return l.K.get("/batch_mail/tracking/logs",{params:e})}},93107(e,t,a){a.r(t),a.d(t,{default:()=>S});var r=a(90655),l=a(95234),n=a(5786),o=a(58181),i=a(18123),c=a(26997),s=a(5758),u=a(56187),d=a(98105);let v={class:"bt-time-range"},m=(0,i.defineComponent)({__name:"index",props:(0,i.mergeModels)({defaultType:{type:String,default:"today"}},{value:{},valueModifiers:{}}),emits:(0,i.mergeModels)(["change"],["update:value"]),setup(e,t){let{emit:a}=t,r=(0,i.useModel)(e,"value"),m=(0,i.ref)(e.defaultType),p=e=>{switch(e){case"today":r.value=(0,d.JZ)();break;case"yesterday":r.value=(0,d.JZ)((0,u.f)(new Date,-1));break;case"last7days":let t,l;t=new Date,l=(0,c.D)(t),r.value=[(0,s.o)((0,u.f)(t,-6)).getTime(),l.getTime()]}a("change")},f=e=>{let t=new Date,a=(0,u.f)(t,-30);return(0,s.o)(a).getTime()>e||(0,c.D)(t).getTime()<e},h=e=>{m.value="custom",r.value=[(0,s.o)(e[0]).getTime(),(0,c.D)(e[1]).getTime()],a("change")};return p(e.defaultType),(e,t)=>{let a=o.A,c=n.A,s=l.A;return(0,i.openBlock)(),(0,i.createElementBlock)("div",v,[(0,i.createVNode)(c,{value:(0,i.unref)(m),"onUpdate:value":[t[0]||(t[0]=e=>(0,i.isRef)(m)?m.value=e:null),p]},{default:(0,i.withCtx)(()=>[(0,i.createVNode)(a,{value:"today"},{default:(0,i.withCtx)(()=>[(0,i.createTextVNode)((0,i.toDisplayString)(e.$t("common.time.today")),1)]),_:1}),(0,i.createVNode)(a,{value:"yesterday"},{default:(0,i.withCtx)(()=>[(0,i.createTextVNode)((0,i.toDisplayString)(e.$t("common.time.yesterday")),1)]),_:1}),(0,i.createVNode)(a,{value:"last7days"},{default:(0,i.withCtx)(()=>[(0,i.createTextVNode)((0,i.toDisplayString)(e.$t("common.time.last7days")),1)]),_:1})]),_:1},8,["value"]),(0,i.createVNode)(s,{value:r.value,type:"daterange","is-date-disabled":f,"onUpdate:value":h},null,8,["value"])])}}});var p=a(31765);let f=(0,p.default)(m,[["__scopeId","data-v-a8143a3f"]]);var h=a(20923),b=a(67083),g=a(32184),k=a(47399),_=a(12435),y=a(51260),x=a(33727),w=a(29311),V=a(93648),C=a(71360);let N={class:"p-20px"},B={class:"flex justify-between items-center mb-20px"},A={class:"font-bold text-basic"},E={class:"metrics-cards"},M={class:"detail-row"},T={class:"rate-charts-card"},D=(0,i.defineComponent)({__name:"analytics",setup(e){let t=(0,V.t)(),{t:a}=(0,C.s9)(),l=(0,i.computed)(()=>(0,d.WZ)(t.params.id||"0")),n=(0,i.ref)((0,d.JZ)()),o=(0,i.ref)([]),c=(0,i.reactive)({delivery_rate:{label:a("overview.delivered"),value:0,unit:"%"},open_rate:{label:a("overview.opened"),value:0,unit:"%"},click_rate:{label:a("overview.clicked"),value:0,unit:"%"},bounce_rate:{label:a("overview.bounced"),value:0,unit:"%"}}),s=(0,i.ref)({column_type:"hourly",dashboard:{delivered:0,delivery_rate:0,failed:0,failure_rate:0,sends:0},data:[]}),u=(0,i.ref)({column_type:"hourly",data:[]}),v=(0,i.ref)({column_type:"hourly",data:[]}),m=(0,i.ref)({column_type:"hourly",data:[]});async function p(){let e=await (0,k.pS)({task_id:l.value,start_time:Math.floor(n.value[0]/1e3),end_time:Math.floor(n.value[1]/1e3)});(0,d.Gv)(e)&&(Object.entries(e.dashboard).forEach(e=>{let[t,a]=e;t in c&&(c[t].value=a)}),o.value=(0,d.cy)(e.mail_providers)?e.mail_providers:[],s.value=e.send_mail_chart,u.value=e.bounce_rate_chart,v.value=e.click_rate_chart,m.value=e.open_rate_chart)}let D=(0,i.ref)("");return(async()=>{let e=await (0,k.MX)({id:l.value});(0,d.Gv)(e)&&(D.value=e.subject)})(),(e,t)=>{let a=(0,i.resolveComponent)("router-link"),l=g.A,d=b.Ay,k=h.Ay,V=r.Ay;return(0,i.openBlock)(),(0,i.createElementBlock)("div",N,[(0,i.createElementVNode)("div",B,[(0,i.createVNode)(k,null,{default:(0,i.withCtx)(()=>[(0,i.createVNode)(l,null,{default:(0,i.withCtx)(()=>[(0,i.createVNode)(a,{to:"/market/task"},{default:(0,i.withCtx)(()=>[(0,i.createTextVNode)((0,i.toDisplayString)(e.$t("market.task.title")),1)]),_:1})]),_:1}),(0,i.createVNode)(l,null,{default:(0,i.withCtx)(()=>[(0,i.createTextVNode)((0,i.toDisplayString)(e.$t("market.task.actions.analytics")),1)]),_:1}),(0,i.createVNode)(l,null,{default:(0,i.withCtx)(()=>[(0,i.createVNode)(d,{style:{"max-width":"300px"}},{default:(0,i.withCtx)(()=>[(0,i.createElementVNode)("span",A,(0,i.toDisplayString)((0,i.unref)(D)||"--"),1)]),_:1})]),_:1})]),_:1}),(0,i.createVNode)(f,{value:(0,i.unref)(n),"onUpdate:value":t[0]||(t[0]=e=>(0,i.isRef)(n)?n.value=e:null),"default-type":"last7days",onChange:p},null,8,["value"])]),(0,i.createElementVNode)("div",E,[((0,i.openBlock)(!0),(0,i.createElementBlock)(i.Fragment,null,(0,i.renderList)((0,i.unref)(c),(e,t)=>((0,i.openBlock)(),(0,i.createBlock)(_.A,{key:t,title:e.label,value:e.value,unit:e.unit},null,8,["title","value","unit"]))),128))]),(0,i.createElementVNode)("div",M,[(0,i.createVNode)(V,{class:"provider-table-card",title:e.$t("overview.mailProviders")},{default:(0,i.withCtx)(()=>[(0,i.createVNode)(y.A,{value:(0,i.unref)(o),"onUpdate:value":t[1]||(t[1]=e=>(0,i.isRef)(o)?o.value=e:null)},null,8,["value"])]),_:1},8,["title"]),(0,i.createVNode)(V,{class:"send-today-card",title:e.$t("overview.sendStats")},{default:(0,i.withCtx)(()=>[(0,i.createVNode)(x.A,{data:(0,i.unref)(s)},null,8,["data"])]),_:1},8,["title"])]),(0,i.createElementVNode)("div",T,[(0,i.createVNode)(w.A,{bounce:(0,i.unref)(u),click:(0,i.unref)(v),open:(0,i.unref)(m)},null,8,["bounce","click","open"])])])}}}),S=(0,p.default)(D,[["__scopeId","data-v-34cf85db"]])},20923(e,t,a){a.d(t,{s7:()=>d,Ay:()=>m});var r=a(18123),l=a(12894),n=a(91945),o=a(47580),i=a(98667),c=a(81125),s=a(26005);let u=(0,s.cB)("breadcrumb",`
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
 `)])])]),d=(0,i.D)("n-breadcrumb"),v=Object.assign(Object.assign({},l.A.props),{separator:{type:String,default:"/"}}),m=(0,r.defineComponent)({name:"Breadcrumb",props:v,setup(e){let{mergedClsPrefixRef:t,inlineThemeDisabled:a}=(0,n.Ay)(e),i=(0,l.A)("Breadcrumb","-breadcrumb",u,c.A,e,t);(0,r.provide)(d,{separatorRef:(0,r.toRef)(e,"separator"),mergedClsPrefixRef:t});let s=(0,r.computed)(()=>{let{common:{cubicBezierEaseInOut:e},self:{separatorColor:t,itemTextColor:a,itemTextColorHover:r,itemTextColorPressed:l,itemTextColorActive:n,fontSize:o,fontWeightActive:c,itemBorderRadius:s,itemColorHover:u,itemColorPressed:d,itemLineHeight:v}}=i.value;return{"--n-font-size":o,"--n-bezier":e,"--n-item-text-color":a,"--n-item-text-color-hover":r,"--n-item-text-color-pressed":l,"--n-item-text-color-active":n,"--n-separator-color":t,"--n-item-color-hover":u,"--n-item-color-pressed":d,"--n-item-border-radius":s,"--n-font-weight-active":c,"--n-item-line-height":v}}),v=a?(0,o.R)("breadcrumb",void 0,s,e):void 0;return{mergedClsPrefix:t,cssVars:a?void 0:s,themeClass:null==v?void 0:v.themeClass,onRender:null==v?void 0:v.onRender}},render(){var e;return null==(e=this.onRender)||e.call(this),(0,r.h)("nav",{class:[`${this.mergedClsPrefix}-breadcrumb`,this.themeClass],style:this.cssVars,"aria-label":"Breadcrumb"},(0,r.h)("ul",null,this.$slots))}})},32184(e,t,a){a.d(t,{A:()=>i});var r=a(18123),l=a(80224),n=a(12221),o=a(20923);let i=(0,r.defineComponent)({name:"BreadcrumbItem",props:{separator:String,href:String,clickable:{type:Boolean,default:!0},onClick:Function},slots:Object,setup(e,{slots:t}){let a=(0,r.inject)(o.s7,null);if(!a)return()=>null;let{separatorRef:i,mergedClsPrefixRef:c}=a,s=function(e=n.B?window:null){let t=()=>{let{hash:t,host:a,hostname:r,href:l,origin:n,pathname:o,port:i,protocol:c,search:s}=(null==e?void 0:e.location)||{};return{hash:t,host:a,hostname:r,href:l,origin:n,pathname:o,port:i,protocol:c,search:s}},a=(0,r.ref)(t()),l=()=>{a.value=t()};return(0,r.onMounted)(()=>{e&&(e.addEventListener("popstate",l),e.addEventListener("hashchange",l))}),(0,r.onUnmounted)(()=>{e&&(e.removeEventListener("popstate",l),e.removeEventListener("hashchange",l))}),a}(),u=(0,r.computed)(()=>e.href?"a":"span"),d=(0,r.computed)(()=>s.value.href===e.href?"location":null);return()=>{let{value:a}=c;return(0,r.h)("li",{class:[`${a}-breadcrumb-item`,e.clickable&&`${a}-breadcrumb-item--clickable`]},(0,r.h)(u.value,{class:`${a}-breadcrumb-item__link`,"aria-current":d.value,href:e.href,onClick:e.onClick},t),(0,r.h)("span",{class:`${a}-breadcrumb-item__separator`,"aria-hidden":"true"},(0,l.Nj)(t.separator,()=>{var t;return[null!=(t=e.separator)?t:i.value]})))}}})}}]);