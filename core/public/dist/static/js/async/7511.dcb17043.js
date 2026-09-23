"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([["7511"],{66947(e,t,r){r.d(t,{Io:()=>d,S1:()=>s,cj:()=>i,kw:()=>l,lw:()=>a,wI:()=>u,y_:()=>p,zU:()=>n});var o=r(12189);let a=()=>o.K.get("/public/activation/config"),i=e=>o.K.post("/public/activation/activate",e),l=()=>o.K.get("/activation/stats"),n=e=>o.K.get("/activation/list",{params:e}),s=e=>o.K.post("/activation/generate",e,{fetchOptions:{successMessage:!0}}),d=e=>o.K.post("/activation/set_group",e,{fetchOptions:{successMessage:!0}}),u=e=>o.K.post("/activation/delete",e,{fetchOptions:{successMessage:!0}}),p=e=>o.K.post("/activation/clear_binding",e,{fetchOptions:{successMessage:!0}})},16046(e,t,r){r.r(t),r.d(t,{default:()=>v});var o=r(90655),a=r(65605),i=r(2579),l=r(121),n=r(24396),s=r(25719),d=r(48209),u=r(18123),p=r(82806),c=r(66947);let b={class:"activate-page"},f={key:0,class:"brand"},m={key:1,class:"success-box"},h={class:"email"},g=(0,u.defineComponent)({__name:"index",setup(e){let t=(0,u.ref)(null),r=(0,u.ref)(!1),g=(0,u.ref)(""),v=(0,u.ref)(""),w=(0,u.reactive)({key:"",prefix:"",password:"",password2:""}),x=(0,u.computed)(()=>v.value?`@${v.value}`:"@..."),y=async()=>{try{let e=await (0,c.lw)();(null==e?void 0:e.domain)&&(v.value=e.domain)}catch{}};(0,u.onMounted)(y);let A={key:[{required:!0,pattern:/^(?:JESUSMAIL|QLU)-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/,message:"请输入正确格式的激活密钥",trigger:["blur","input"]}],prefix:[{required:!0,pattern:/^[a-z0-9][a-z0-9._-]{1,28}[a-z0-9]$/,message:"请输入 3-30 位合法邮箱前缀",trigger:["blur","input"]}],password:[{required:!0,min:8,max:64,validator:(e,t)=>/[A-Za-z]/.test(t)&&/\d/.test(t),message:"密码需 8-64 位且同时包含字母和数字",trigger:["blur","input"]}],password2:[{required:!0,validator:(e,t)=>t===w.password,message:"两次输入的密码不一致",trigger:["blur","input"]}]},k=async()=>{var e;await (null==(e=t.value)?void 0:e.validate()),r.value=!0;try{let e=await (0,c.cj)({key:w.key,prefix:w.prefix,password:w.password});g.value=e.email,e.email.includes("@")&&(v.value=e.email.slice(e.email.indexOf("@")+1))}finally{r.value=!1}};return(e,c)=>{let v=d.Ay,y=s.A,V=n.Ay,N=l.A,C=i.A,B=a.A,_=o.Ay;return(0,u.openBlock)(),(0,u.createElementBlock)("div",b,[(0,u.createVNode)(_,{class:"activate-card",bordered:!1},{default:(0,u.withCtx)(()=>[(0,u.unref)(g)?(0,u.createCommentVNode)("",!0):((0,u.openBlock)(),(0,u.createElementBlock)("div",f,[...c[6]||(c[6]=[(0,u.createElementVNode)("img",{src:p,alt:"JesusMail"},null,-1),(0,u.createElementVNode)("h1",null,"JesusMail",-1),(0,u.createElementVNode)("p",null,"使用激活密钥开通你的邮箱",-1)])])),(0,u.unref)(g)?((0,u.openBlock)(),(0,u.createElementBlock)("div",m,[c[8]||(c[8]=(0,u.createElementVNode)("div",{class:"success-icon"},"✓",-1)),c[9]||(c[9]=(0,u.createElementVNode)("h2",null,"你的邮箱已就绪",-1)),(0,u.createElementVNode)("div",h,(0,u.toDisplayString)((0,u.unref)(g)),1),c[10]||(c[10]=(0,u.createElementVNode)("p",null,"登录密码为你刚才设置的密码，请妥善保管。邮箱永久有效，不会过期。本次激活密钥已作废，请勿重复使用。",-1)),(0,u.createVNode)(v,{type:"primary",size:"large",block:"",tag:"a",href:"/roundcube/"},{default:(0,u.withCtx)(()=>[...c[7]||(c[7]=[(0,u.createTextVNode)("前往登录邮箱",-1)])]),_:1})])):((0,u.openBlock)(),(0,u.createBlock)(B,{key:2,ref_key:"formRef",ref:t,model:(0,u.unref)(w),rules:A,"label-placement":"top",onSubmit:(0,u.withModifiers)(k,["prevent"])},{default:(0,u.withCtx)(()=>[(0,u.createVNode)(V,{label:"激活密钥",path:"key"},{default:(0,u.withCtx)(()=>[(0,u.createVNode)(y,{value:(0,u.unref)(w).key,"onUpdate:value":[c[0]||(c[0]=e=>(0,u.unref)(w).key=e),c[1]||(c[1]=e=>(0,u.unref)(w).key=(0,u.unref)(w).key.toUpperCase())],maxlength:"24",placeholder:"JESUSMAIL-XXXX-XXXX-XXXX"},null,8,["value"])]),_:1}),(0,u.createVNode)(V,{label:"邮箱前缀",path:"prefix"},{default:(0,u.withCtx)(()=>[(0,u.createVNode)(C,null,{default:(0,u.withCtx)(()=>[(0,u.createVNode)(y,{value:(0,u.unref)(w).prefix,"onUpdate:value":[c[2]||(c[2]=e=>(0,u.unref)(w).prefix=e),c[3]||(c[3]=e=>(0,u.unref)(w).prefix=(0,u.unref)(w).prefix.toLowerCase())],maxlength:"30",placeholder:"3-30 位字母、数字或 . _ -"},null,8,["value"]),(0,u.createVNode)(N,null,{default:(0,u.withCtx)(()=>[(0,u.createTextVNode)((0,u.toDisplayString)((0,u.unref)(x)),1)]),_:1})]),_:1})]),_:1}),(0,u.createVNode)(V,{label:"设置密码",path:"password"},{default:(0,u.withCtx)(()=>[(0,u.createVNode)(y,{value:(0,u.unref)(w).password,"onUpdate:value":c[4]||(c[4]=e=>(0,u.unref)(w).password=e),type:"password","show-password-on":"click",maxlength:"64",placeholder:"8-64 位，须同时包含字母和数字"},null,8,["value"])]),_:1}),(0,u.createVNode)(V,{label:"确认密码",path:"password2"},{default:(0,u.withCtx)(()=>[(0,u.createVNode)(y,{value:(0,u.unref)(w).password2,"onUpdate:value":c[5]||(c[5]=e=>(0,u.unref)(w).password2=e),type:"password","show-password-on":"click",maxlength:"64",placeholder:"再次输入密码",onKeyup:(0,u.withKeys)(k,["enter"])},null,8,["value"])]),_:1}),(0,u.createVNode)(V,{label:"邮箱有效期"},{default:(0,u.withCtx)(()=>[...c[11]||(c[11]=[(0,u.createElementVNode)("div",{class:"expiry-tip"},"永久有效：激活成功后邮箱不会过期，可长期使用。",-1)])]),_:1}),(0,u.createVNode)(v,{type:"primary",size:"large",block:"",loading:(0,u.unref)(r),"attr-type":"submit"},{default:(0,u.withCtx)(()=>[...c[12]||(c[12]=[(0,u.createTextVNode)("立即开通邮箱",-1)])]),_:1},8,["loading"])]),_:1},8,["model"])),c[13]||(c[13]=(0,u.createElementVNode)("div",{class:"foot"},[(0,u.createElementVNode)("a",{href:"/roundcube/",rel:"noopener"},"用户登录")],-1))]),_:1})])}}}),v=(0,r(31765).default)(g,[["__scopeId","data-v-d8ea606d"]])},82806(e,t,r){e.exports=r.p+"static/image/logo.d6fdff7a.png"},18293(e,t,r){r.d(t,{A:()=>i});var o=r(61204),a=r(19206);let i=function(e,t){t=(0,o.A)(t,e);for(var r=0,i=t.length;null!=e&&r<i;)e=e[(0,a.A)(t[r++])];return r&&r==i?e:void 0}},61204(e,t,r){r.d(t,{A:()=>b});var o,a,i=r(11504),l=r(23033),n=r(67711);function s(e,t){if("function"!=typeof e||null!=t&&"function"!=typeof t)throw TypeError("Expected a function");var r=function(){var o=arguments,a=t?t.apply(this,o):o[0],i=r.cache;if(i.has(a))return i.get(a);var l=e.apply(this,o);return r.cache=i.set(a,l)||i,l};return r.cache=new(s.Cache||n.A),r}s.Cache=n.A;var d=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,u=/\\(\\)?/g,p=(a=(o=s(function(e){var t=[];return 46===e.charCodeAt(0)&&t.push(""),e.replace(d,function(e,r,o,a){t.push(o?a.replace(u,"$1"):r||e)}),t},function(e){return 500===a.size&&a.clear(),e})).cache,o),c=r(46632);let b=function(e,t){return(0,i.A)(e)?e:(0,l.A)(e,t)?[e]:p((0,c.A)(e))}},23033(e,t,r){r.d(t,{A:()=>n});var o=r(11504),a=r(69581),i=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,l=/^\w*$/;let n=function(e,t){if((0,o.A)(e))return!1;var r=typeof e;return!!("number"==r||"symbol"==r||"boolean"==r||null==e||(0,a.A)(e))||l.test(e)||!i.test(e)||null!=t&&e in Object(t)}},19206(e,t,r){r.d(t,{A:()=>i});var o=r(69581),a=1/0;let i=function(e){if("string"==typeof e||(0,o.A)(e))return e;var t=e+"";return"0"==t&&1/e==-a?"-0":t}},18365(e,t,r){r.d(t,{A:()=>a});var o=r(18293);let a=function(e,t,r){var a=null==e?void 0:(0,o.A)(e,t);return void 0===a?r:a}},2579(e,t,r){r.d(t,{A:()=>s});var o=r(18123),a=r(91945),i=r(88718),l=r(26005);let n=(0,l.cB)("input-group",`
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
 `)])])])])])]),s=(0,o.defineComponent)({name:"InputGroup",props:{},setup(e){let{mergedClsPrefixRef:t}=(0,a.Ay)(e);return(0,i.A)("-input-group",n,t),{mergedClsPrefix:t}},render(){let{mergedClsPrefix:e}=this;return(0,o.h)("div",{class:`${e}-input-group`},this.$slots)}})},121(e,t,r){r.d(t,{A:()=>c});var o=r(18123),a=r(12894),i=r(91945),l=r(71811),n=r(47580),s=r(26005),d=r(19289);let u=(0,s.cB)("input-group-label",`
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
 `)]),p=Object.assign(Object.assign({},a.A.props),{size:String,bordered:{type:Boolean,default:void 0}}),c=(0,o.defineComponent)({name:"InputGroupLabel",props:p,setup(e){let{mergedBorderedRef:t,mergedClsPrefixRef:r,inlineThemeDisabled:p}=(0,i.Ay)(e),{mergedSizeRef:c}=(0,l.A)(e),b=(0,a.A)("Input","-input-group-label",u,d.A,e,r),f=(0,o.computed)(()=>{let{value:e}=c,{common:{cubicBezierEaseInOut:t},self:{groupLabelColor:r,borderRadius:o,groupLabelTextColor:a,lineHeight:i,groupLabelBorder:l,[(0,s.cF)("fontSize",e)]:n,[(0,s.cF)("height",e)]:d}}=b.value;return{"--n-bezier":t,"--n-group-label-color":r,"--n-group-label-border":l,"--n-border-radius":o,"--n-group-label-text-color":a,"--n-font-size":n,"--n-line-height":i,"--n-height":d}}),m=p?(0,n.R)("input-group-label",(0,o.computed)(()=>{let{value:e}=c;return e[0]}),f,e):void 0;return{mergedClsPrefix:r,mergedBordered:t,cssVars:p?void 0:f,themeClass:null==m?void 0:m.themeClass,onRender:null==m?void 0:m.onRender}},render(){var e,t,r;let{mergedClsPrefix:a}=this;return null==(e=this.onRender)||e.call(this),(0,o.h)("div",{class:[`${a}-input-group-label`,this.themeClass],style:this.cssVars},null==(r=(t=this.$slots).default)?void 0:r.call(t),this.mergedBordered?(0,o.h)("div",{class:`${a}-input-group-label__border`}):null)}})}}]);