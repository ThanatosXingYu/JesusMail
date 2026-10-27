"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([["7403"],{66947(e,t,r){r.d(t,{Io:()=>d,S1:()=>s,cj:()=>i,kw:()=>l,lw:()=>o,wI:()=>u,y_:()=>c,zU:()=>n});var a=r(12189);let o=()=>a.K.get("/public/activation/config"),i=e=>a.K.post("/public/activation/activate",e),l=()=>a.K.get("/activation/stats"),n=e=>a.K.get("/activation/list",{params:e}),s=e=>a.K.post("/activation/generate",e,{fetchOptions:{successMessage:!0}}),d=e=>a.K.post("/activation/set_group",e,{fetchOptions:{successMessage:!0}}),u=e=>a.K.post("/activation/delete",e,{fetchOptions:{successMessage:!0}}),c=e=>a.K.post("/activation/clear_binding",e,{fetchOptions:{successMessage:!0}})},37634(e,t,r){r.r(t),r.d(t,{default:()=>g});var a=r(90655),o=r(65605),i=r(2579),l=r(121),n=r(24396),s=r(25719),d=r(48209),u=r(18123),c=r(82806),p=r(66947);let b={class:"activate-page"},m={key:0,class:"brand"},f={key:1,class:"success-box"},h={class:"email"},v=(0,u.defineComponent)({__name:"index",setup(e){let t=(0,u.ref)(null),r=(0,u.ref)(!1),v=(0,u.ref)(""),g=(0,u.ref)(""),y=(0,u.reactive)({key:"",prefix:"",password:"",password2:"",recovery_email:""}),w=(0,u.computed)(()=>g.value?`@${g.value}`:"@..."),x=async()=>{try{let e=await (0,p.lw)();(null==e?void 0:e.domain)&&(g.value=e.domain)}catch{}};(0,u.onMounted)(()=>{document.body.classList.add("activation-page-body"),x()}),(0,u.onBeforeUnmount)(()=>{document.body.classList.remove("activation-page-body")});let A={key:[{required:!0,pattern:/^(?:JESUSMAIL|QLU)-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/,message:"请输入正确格式的激活密钥",trigger:["blur","input"]}],prefix:[{required:!0,pattern:/^[a-z0-9][a-z0-9._-]{1,28}[a-z0-9]$/,message:"请输入3-30位合法邮箱前缀",trigger:["blur","input"]}],password:[{required:!0,min:8,max:64,validator:(e,t)=>/[A-Za-z]/.test(t)&&/\d/.test(t),message:"密码需8-64位且同时包含字母和数字",trigger:["blur","input"]}],password2:[{required:!0,validator:(e,t)=>t===y.password,message:"两次输入的密码不一致",trigger:["blur","input"]}],recovery_email:[{validator:(e,t)=>!t||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t.trim()),message:"请输入正确的备用邮箱地址，或留空",trigger:["blur","input"]}]},k=async()=>{var e;await (null==(e=t.value)?void 0:e.validate()),r.value=!0;try{let e={key:y.key,prefix:y.prefix,password:y.password},t=y.recovery_email.trim();t&&(e.recovery_email=t);let r=await (0,p.cj)(e);v.value=r.email,r.email.includes("@")&&(g.value=r.email.slice(r.email.indexOf("@")+1))}finally{r.value=!1}};return(e,p)=>{let g=d.Ay,x=s.A,V=n.Ay,_=l.A,N=i.A,C=o.A,B=a.Ay;return(0,u.openBlock)(),(0,u.createElementBlock)("div",b,[(0,u.createVNode)(B,{class:"activate-card",bordered:!1},{default:(0,u.withCtx)(()=>[(0,u.unref)(v)?(0,u.createCommentVNode)("",!0):((0,u.openBlock)(),(0,u.createElementBlock)("div",m,[...p[7]||(p[7]=[(0,u.createElementVNode)("img",{src:c,alt:"JesusMail"},null,-1),(0,u.createElementVNode)("h1",null,"JesusMail",-1),(0,u.createElementVNode)("p",null,"使用激活密钥开通你的邮箱",-1)])])),(0,u.unref)(v)?((0,u.openBlock)(),(0,u.createElementBlock)("div",f,[p[9]||(p[9]=(0,u.createElementVNode)("div",{class:"success-icon"},"✓",-1)),p[10]||(p[10]=(0,u.createElementVNode)("h2",null,"你的邮箱已就绪",-1)),(0,u.createElementVNode)("div",h,(0,u.toDisplayString)((0,u.unref)(v)),1),p[11]||(p[11]=(0,u.createElementVNode)("p",null,"登录密码为你刚才设置的密码，请妥善保管。邮箱默认有效期为 7 天，好评后将自动转为永久。本次激活密钥已作废，请勿重复使用。",-1)),(0,u.createVNode)(g,{type:"primary",size:"large",block:"",tag:"a",href:"/roundcube/"},{default:(0,u.withCtx)(()=>[...p[8]||(p[8]=[(0,u.createTextVNode)("前往登录邮箱",-1)])]),_:1})])):((0,u.openBlock)(),(0,u.createBlock)(C,{key:2,ref_key:"formRef",ref:t,model:(0,u.unref)(y),rules:A,"label-placement":"top",onSubmit:(0,u.withModifiers)(k,["prevent"])},{default:(0,u.withCtx)(()=>[(0,u.createVNode)(V,{label:"激活密钥",path:"key"},{default:(0,u.withCtx)(()=>[(0,u.createVNode)(x,{value:(0,u.unref)(y).key,"onUpdate:value":[p[0]||(p[0]=e=>(0,u.unref)(y).key=e),p[1]||(p[1]=e=>(0,u.unref)(y).key=(0,u.unref)(y).key.toUpperCase())],maxlength:"24",placeholder:"JESUSMAIL-XXXX-XXXX-XXXX"},null,8,["value"])]),_:1}),(0,u.createVNode)(V,{label:"邮箱前缀",path:"prefix"},{default:(0,u.withCtx)(()=>[(0,u.createVNode)(N,null,{default:(0,u.withCtx)(()=>[(0,u.createVNode)(x,{value:(0,u.unref)(y).prefix,"onUpdate:value":[p[2]||(p[2]=e=>(0,u.unref)(y).prefix=e),p[3]||(p[3]=e=>(0,u.unref)(y).prefix=(0,u.unref)(y).prefix.toLowerCase())],maxlength:"30",placeholder:"3-30位字母、数字或. _ -"},null,8,["value"]),(0,u.createVNode)(_,null,{default:(0,u.withCtx)(()=>[(0,u.createTextVNode)((0,u.toDisplayString)((0,u.unref)(w)),1)]),_:1})]),_:1})]),_:1}),(0,u.createVNode)(V,{label:"设置密码",path:"password"},{default:(0,u.withCtx)(()=>[(0,u.createVNode)(x,{value:(0,u.unref)(y).password,"onUpdate:value":p[4]||(p[4]=e=>(0,u.unref)(y).password=e),type:"password","show-password-on":"click",maxlength:"64",placeholder:"8-64位，须同时包含字母和数字"},null,8,["value"])]),_:1}),(0,u.createVNode)(V,{label:"确认密码",path:"password2"},{default:(0,u.withCtx)(()=>[(0,u.createVNode)(x,{value:(0,u.unref)(y).password2,"onUpdate:value":p[5]||(p[5]=e=>(0,u.unref)(y).password2=e),type:"password","show-password-on":"click",maxlength:"64",placeholder:"再次输入密码",onKeyup:(0,u.withKeys)(k,["enter"])},null,8,["value"])]),_:1}),(0,u.createVNode)(V,{label:"备用邮箱（选填）",path:"recovery_email"},{default:(0,u.withCtx)(()=>[(0,u.createVNode)(x,{value:(0,u.unref)(y).recovery_email,"onUpdate:value":p[6]||(p[6]=e=>(0,u.unref)(y).recovery_email=e),type:"email",maxlength:"320",placeholder:"填写后将向此邮箱发送邮箱账号和登录密码",onKeyup:(0,u.withKeys)(k,["enter"])},null,8,["value"])]),_:1}),(0,u.createVNode)(V,{label:"邮箱有效期"},{default:(0,u.withCtx)(()=>[...p[12]||(p[12]=[(0,u.createElementVNode)("div",{class:"expiry-tip"},"默认有效期为 7 天，好评后将自动转为永久。",-1)])]),_:1}),(0,u.createVNode)(g,{type:"primary",size:"large",block:"",loading:(0,u.unref)(r),"attr-type":"submit"},{default:(0,u.withCtx)(()=>[...p[13]||(p[13]=[(0,u.createTextVNode)("立即开通邮箱",-1)])]),_:1},8,["loading"])]),_:1},8,["model"])),p[14]||(p[14]=(0,u.createElementVNode)("div",{class:"foot"},[(0,u.createElementVNode)("a",{href:"/roundcube/",rel:"noopener"},"用户登录")],-1))]),_:1})])}}}),g=(0,r(31765).default)(v,[["__scopeId","data-v-cb1fadf0"]])},82806(e,t,r){e.exports=r.p+"static/image/logo.d6fdff7a.png"},18293(e,t,r){r.d(t,{A:()=>i});var a=r(61204),o=r(19206);let i=function(e,t){t=(0,a.A)(t,e);for(var r=0,i=t.length;null!=e&&r<i;)e=e[(0,o.A)(t[r++])];return r&&r==i?e:void 0}},61204(e,t,r){r.d(t,{A:()=>b});var a,o,i=r(11504),l=r(23033),n=r(67711);function s(e,t){if("function"!=typeof e||null!=t&&"function"!=typeof t)throw TypeError("Expected a function");var r=function(){var a=arguments,o=t?t.apply(this,a):a[0],i=r.cache;if(i.has(o))return i.get(o);var l=e.apply(this,a);return r.cache=i.set(o,l)||i,l};return r.cache=new(s.Cache||n.A),r}s.Cache=n.A;var d=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,u=/\\(\\)?/g,c=(o=(a=s(function(e){var t=[];return 46===e.charCodeAt(0)&&t.push(""),e.replace(d,function(e,r,a,o){t.push(a?o.replace(u,"$1"):r||e)}),t},function(e){return 500===o.size&&o.clear(),e})).cache,a),p=r(46632);let b=function(e,t){return(0,i.A)(e)?e:(0,l.A)(e,t)?[e]:c((0,p.A)(e))}},23033(e,t,r){r.d(t,{A:()=>n});var a=r(11504),o=r(69581),i=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,l=/^\w*$/;let n=function(e,t){if((0,a.A)(e))return!1;var r=typeof e;return!!("number"==r||"symbol"==r||"boolean"==r||null==e||(0,o.A)(e))||l.test(e)||!i.test(e)||null!=t&&e in Object(t)}},19206(e,t,r){r.d(t,{A:()=>i});var a=r(69581),o=1/0;let i=function(e){if("string"==typeof e||(0,a.A)(e))return e;var t=e+"";return"0"==t&&1/e==-o?"-0":t}},18365(e,t,r){r.d(t,{A:()=>o});var a=r(18293);let o=function(e,t,r){var o=null==e?void 0:(0,a.A)(e,t);return void 0===o?r:o}},2579(e,t,r){r.d(t,{A:()=>s});var a=r(18123),o=r(91945),i=r(88718),l=r(26005);let n=(0,l.cB)("input-group",`
 display: inline-flex;
 width: 100%;
 flex-wrap: nowrap;
 vertical-align: bottom;
`,[(0,l.c)(">",[(0,l.cB)("input",[(0,l.c)("&:not(:last-child)",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `),(0,l.c)("&:not(:first-child)",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 margin-left: -1px!important;
 `)]),(0,l.cB)("button",[(0,l.c)("&:not(:last-child)",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `,[(0,l.cE)("state-border, border",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `)]),(0,l.c)("&:not(:first-child)",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `,[(0,l.cE)("state-border, border",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `)])]),(0,l.c)("*",[(0,l.c)("&:not(:last-child)",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `,[(0,l.c)(">",[(0,l.cB)("input",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `),(0,l.cB)("base-selection",[(0,l.cB)("base-selection-label",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `),(0,l.cB)("base-selection-tags",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `),(0,l.cE)("box-shadow, border, state-border",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `)])])]),(0,l.c)("&:not(:first-child)",`
 margin-left: -1px!important;
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `,[(0,l.c)(">",[(0,l.cB)("input",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `),(0,l.cB)("base-selection",[(0,l.cB)("base-selection-label",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `),(0,l.cB)("base-selection-tags",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `),(0,l.cE)("box-shadow, border, state-border",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `)])])])])])]),s=(0,a.defineComponent)({name:"InputGroup",props:{},setup(e){let{mergedClsPrefixRef:t}=(0,o.Ay)(e);return(0,i.A)("-input-group",n,t),{mergedClsPrefix:t}},render(){let{mergedClsPrefix:e}=this;return(0,a.h)("div",{class:`${e}-input-group`},this.$slots)}})},121(e,t,r){r.d(t,{A:()=>p});var a=r(18123),o=r(12894),i=r(91945),l=r(71811),n=r(47580),s=r(26005),d=r(19289);let u=(0,s.cB)("input-group-label",`
 position: relative;
 user-select: none;
 -webkit-user-select: none;
 box-sizing: border-box;
 padding: 0 12px;
 display: inline-block;
 border-radius: var(--n-border-radius);
 background-color: var(--n-group-label-color);
 color: var(--n-group-label-text-color);
 font-size: var(--n-font-size);
 line-height: var(--n-height);
 height: var(--n-height);
 flex-shrink: 0;
 white-space: nowrap;
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
`,[(0,s.cE)("border",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 border-radius: inherit;
 border: var(--n-group-label-border);
 transition: border-color .3s var(--n-bezier);
 `)]),c=Object.assign(Object.assign({},o.A.props),{size:String,bordered:{type:Boolean,default:void 0}}),p=(0,a.defineComponent)({name:"InputGroupLabel",props:c,setup(e){let{mergedBorderedRef:t,mergedClsPrefixRef:r,inlineThemeDisabled:c}=(0,i.Ay)(e),{mergedSizeRef:p}=(0,l.A)(e),b=(0,o.A)("Input","-input-group-label",u,d.A,e,r),m=(0,a.computed)(()=>{let{value:e}=p,{common:{cubicBezierEaseInOut:t},self:{groupLabelColor:r,borderRadius:a,groupLabelTextColor:o,lineHeight:i,groupLabelBorder:l,[(0,s.cF)("fontSize",e)]:n,[(0,s.cF)("height",e)]:d}}=b.value;return{"--n-bezier":t,"--n-group-label-color":r,"--n-group-label-border":l,"--n-border-radius":a,"--n-group-label-text-color":o,"--n-font-size":n,"--n-line-height":i,"--n-height":d}}),f=c?(0,n.R)("input-group-label",(0,a.computed)(()=>{let{value:e}=p;return e[0]}),m,e):void 0;return{mergedClsPrefix:r,mergedBordered:t,cssVars:c?void 0:m,themeClass:null==f?void 0:f.themeClass,onRender:null==f?void 0:f.onRender}},render(){var e,t,r;let{mergedClsPrefix:o}=this;return null==(e=this.onRender)||e.call(this),(0,a.h)("div",{class:[`${o}-input-group-label`,this.themeClass],style:this.cssVars},null==(r=(t=this.$slots).default)?void 0:r.call(t),this.mergedBordered?(0,a.h)("div",{class:`${o}-input-group-label__border`}):null)}})}}]);
