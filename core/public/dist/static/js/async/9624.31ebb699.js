"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([["9624"],{24216(e,t,r){r.d(t,{d:()=>o});function o(e,t){let{target:r}=e;for(;r;){if(r.dataset&&void 0!==r.dataset[t])return!0;r=r.parentElement}return!1}},66947(e,t,r){r.d(t,{Io:()=>d,S1:()=>l,cj:()=>a,kw:()=>i,wI:()=>s,y_:()=>u,zU:()=>n});var o=r(12189);let a=e=>o.K.post("/public/activation/activate",e),i=()=>o.K.get("/activation/stats"),n=e=>o.K.get("/activation/list",{params:e}),l=e=>o.K.post("/activation/generate",e,{fetchOptions:{successMessage:!0}}),d=e=>o.K.post("/activation/set_group",e,{fetchOptions:{successMessage:!0}}),s=e=>o.K.post("/activation/delete",e,{fetchOptions:{successMessage:!0}}),u=e=>o.K.post("/activation/clear_binding",e,{fetchOptions:{successMessage:!0}})},52283(e,t,r){r.r(t),r.d(t,{default:()=>A});var o=r(90655),a=r(65605),i=r(95234),n=r(2579),l=r(121),d=r(24396),s=r(25719),u=r(48209),c=r(18123),p=r(417),m=r(5758),b=r(56187),g=r(42878),f=r(66947);let h={class:"activate-page"},v={key:0,class:"brand"},w={key:1,class:"success-box"},C={class:"email"},y={class:"w-full"},x={class:"expiry-tip"},k={class:"foot"},I=(0,c.defineComponent)({__name:"index",setup(e){let t=(0,c.ref)(null),r=(0,c.ref)(!1),I=(0,c.ref)(""),A=(0,c.reactive)({key:"",prefix:"",password:"",password2:"",duration_days:30}),N=()=>(0,m.o)(new Date),B=(0,c.ref)((0,b.f)(N(),A.duration_days).getTime()),V=e=>(0,g.m)(e,N()),M=e=>{let t=V(e);return t<1||t>31},z=e=>{if(null===e)return;let t=V(e);t<1||t>31||(B.value=(0,m.o)(e).getTime(),A.duration_days=t)},L={key:[{required:!0,pattern:/^(?:JESUSMAIL|QLU)-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/,message:"请输入正确格式的激活密钥",trigger:["blur","input"]}],prefix:[{required:!0,pattern:/^[a-z0-9][a-z0-9._-]{1,28}[a-z0-9]$/,message:"请输入 3-30 位合法邮箱前缀",trigger:["blur","input"]}],password:[{required:!0,min:8,max:64,validator:(e,t)=>/[A-Za-z]/.test(t)&&/\d/.test(t),message:"密码需 8-64 位且同时包含字母和数字",trigger:["blur","input"]}],password2:[{required:!0,validator:(e,t)=>t===A.password,message:"两次输入的密码不一致",trigger:["blur","input"]}],duration_days:[{required:!0,validator:(e,t)=>Number.isInteger(t)&&t>=1&&t<=31,message:"邮箱有效期必须为 1-31 天",trigger:["change"]}]},_=async()=>{var e;await (null==(e=t.value)?void 0:e.validate()),r.value=!0;try{I.value=(await (0,f.cj)({key:A.key,prefix:A.prefix,password:A.password,duration_days:A.duration_days})).email}finally{r.value=!1}};return(e,m)=>{let b=u.Ay,g=s.A,f=d.Ay,N=l.A,V=n.A,Z=i.A,E=a.A,S=(0,c.resolveComponent)("router-link"),D=o.Ay;return(0,c.openBlock)(),(0,c.createElementBlock)("div",h,[(0,c.createVNode)(D,{class:"activate-card",bordered:!1},{default:(0,c.withCtx)(()=>[(0,c.unref)(I)?(0,c.createCommentVNode)("",!0):((0,c.openBlock)(),(0,c.createElementBlock)("div",v,[...m[6]||(m[6]=[(0,c.createElementVNode)("img",{src:p,alt:"JesusMail"},null,-1),(0,c.createElementVNode)("h1",null,"JesusMail",-1),(0,c.createElementVNode)("p",null,"使用激活密钥开通你的邮箱",-1)])])),(0,c.unref)(I)?((0,c.openBlock)(),(0,c.createElementBlock)("div",w,[m[8]||(m[8]=(0,c.createElementVNode)("div",{class:"success-icon"},"✓",-1)),m[9]||(m[9]=(0,c.createElementVNode)("h2",null,"你的邮箱已就绪",-1)),(0,c.createElementVNode)("div",C,(0,c.toDisplayString)((0,c.unref)(I)),1),m[10]||(m[10]=(0,c.createElementVNode)("p",null,"登录密码为你刚才设置的密码，请妥善保管。本次激活密钥已作废，请勿重复使用。",-1)),(0,c.createVNode)(b,{type:"primary",size:"large",block:"",tag:"a",href:"/roundcube/"},{default:(0,c.withCtx)(()=>[...m[7]||(m[7]=[(0,c.createTextVNode)("前往登录邮箱",-1)])]),_:1})])):((0,c.openBlock)(),(0,c.createBlock)(E,{key:2,ref_key:"formRef",ref:t,model:(0,c.unref)(A),rules:L,"label-placement":"top",onSubmit:(0,c.withModifiers)(_,["prevent"])},{default:(0,c.withCtx)(()=>[(0,c.createVNode)(f,{label:"激活密钥",path:"key"},{default:(0,c.withCtx)(()=>[(0,c.createVNode)(g,{value:(0,c.unref)(A).key,"onUpdate:value":[m[0]||(m[0]=e=>(0,c.unref)(A).key=e),m[1]||(m[1]=e=>(0,c.unref)(A).key=(0,c.unref)(A).key.toUpperCase())],maxlength:"24",placeholder:"JESUSMAIL-XXXX-XXXX-XXXX"},null,8,["value"])]),_:1}),(0,c.createVNode)(f,{label:"邮箱前缀",path:"prefix"},{default:(0,c.withCtx)(()=>[(0,c.createVNode)(V,null,{default:(0,c.withCtx)(()=>[(0,c.createVNode)(g,{value:(0,c.unref)(A).prefix,"onUpdate:value":[m[2]||(m[2]=e=>(0,c.unref)(A).prefix=e),m[3]||(m[3]=e=>(0,c.unref)(A).prefix=(0,c.unref)(A).prefix.toLowerCase())],maxlength:"30",placeholder:"3-30 位字母、数字或 . _ -"},null,8,["value"]),(0,c.createVNode)(N,null,{default:(0,c.withCtx)(()=>[...m[11]||(m[11]=[(0,c.createTextVNode)("@mail.qlu.edu.kg",-1)])]),_:1})]),_:1})]),_:1}),(0,c.createVNode)(f,{label:"设置密码",path:"password"},{default:(0,c.withCtx)(()=>[(0,c.createVNode)(g,{value:(0,c.unref)(A).password,"onUpdate:value":m[4]||(m[4]=e=>(0,c.unref)(A).password=e),type:"password","show-password-on":"click",maxlength:"64",placeholder:"8-64 位，须同时包含字母和数字"},null,8,["value"])]),_:1}),(0,c.createVNode)(f,{label:"确认密码",path:"password2"},{default:(0,c.withCtx)(()=>[(0,c.createVNode)(g,{value:(0,c.unref)(A).password2,"onUpdate:value":m[5]||(m[5]=e=>(0,c.unref)(A).password2=e),type:"password","show-password-on":"click",maxlength:"64",placeholder:"再次输入密码",onKeyup:(0,c.withKeys)(_,["enter"])},null,8,["value"])]),_:1}),(0,c.createVNode)(f,{label:"邮箱有效期",path:"duration_days"},{default:(0,c.withCtx)(()=>[(0,c.createElementVNode)("div",y,[(0,c.createVNode)(Z,{value:(0,c.unref)(B),type:"date",format:"yyyy-MM-dd",clearable:!1,"is-date-disabled":M,class:"w-full","onUpdate:value":z},null,8,["value"]),(0,c.createElementVNode)("div",x," 当前有效期 "+(0,c.toDisplayString)((0,c.unref)(A).duration_days)+" 天；到期后邮箱账号与邮件将进入 30 天回收期。 ",1)])]),_:1}),(0,c.createVNode)(b,{type:"primary",size:"large",block:"",loading:(0,c.unref)(r),"attr-type":"submit"},{default:(0,c.withCtx)(()=>[...m[12]||(m[12]=[(0,c.createTextVNode)("立即开通邮箱",-1)])]),_:1},8,["loading"])]),_:1},8,["model"])),(0,c.createElementVNode)("div",k,[(0,c.createVNode)(S,{to:"/login"},{default:(0,c.withCtx)(()=>[...m[13]||(m[13]=[(0,c.createTextVNode)("管理员登录",-1)])]),_:1})])]),_:1})])}}}),A=(0,r(31765).default)(I,[["__scopeId","data-v-fb3321ea"]])},75946(e,t,r){r.d(t,{A:()=>n});var o=r(18123),a=r(80283),i=r(62768);function n(e={},t){let r=(0,o.reactive)({ctrl:!1,command:!1,win:!1,shift:!1,tab:!1}),{keydown:l,keyup:d}=e,s=e=>{switch(e.key){case"Control":r.ctrl=!0;break;case"Meta":r.command=!0,r.win=!0;break;case"Shift":r.shift=!0;break;case"Tab":r.tab=!0}void 0!==l&&Object.keys(l).forEach(t=>{if(t!==e.key)return;let r=l[t];if("function"==typeof r)r(e);else{let{stop:t=!1,prevent:o=!1}=r;t&&e.stopPropagation(),o&&e.preventDefault(),r.handler(e)}})},u=e=>{switch(e.key){case"Control":r.ctrl=!1;break;case"Meta":r.command=!1,r.win=!1;break;case"Shift":r.shift=!1;break;case"Tab":r.tab=!1}void 0!==d&&Object.keys(d).forEach(t=>{if(t!==e.key)return;let r=d[t];if("function"==typeof r)r(e);else{let{stop:t=!1,prevent:o=!1}=r;t&&e.stopPropagation(),o&&e.preventDefault(),r.handler(e)}})},c=()=>{(void 0===t||t.value)&&((0,a.on)("keydown",document,s),(0,a.on)("keyup",document,u)),void 0!==t&&(0,o.watch)(t,e=>{e?((0,a.on)("keydown",document,s),(0,a.on)("keyup",document,u)):((0,a.A)("keydown",document,s),(0,a.A)("keyup",document,u))})};return(0,i.a)()?((0,o.onBeforeMount)(c),(0,o.onBeforeUnmount)(()=>{(void 0===t||t.value)&&((0,a.A)("keydown",document,s),(0,a.A)("keyup",document,u))})):c(),(0,o.readonly)(r)}},417(e){e.exports="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjggMTI4Ij4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0icWx1LWciIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjMWU2ZmQ5Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzBhYTJjMCIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3QgeD0iNiIgeT0iMjIiIHdpZHRoPSIxMTYiIGhlaWdodD0iODQiIHJ4PSIxNiIgZmlsbD0idXJsKCNxbHUtZykiLz4KICA8cGF0aCBkPSJNMTggMzggTDY0IDc0IEwxMTAgMzgiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI5IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg=="},98336(e,t,r){r.d(t,{A:()=>a});var o=r(18123);let a=(0,o.defineComponent)({name:"Backward",render:()=>(0,o.h)("svg",{viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg"},(0,o.h)("path",{d:"M12.2674 15.793C11.9675 16.0787 11.4927 16.0672 11.2071 15.7673L6.20572 10.5168C5.9298 10.2271 5.9298 9.7719 6.20572 9.48223L11.2071 4.23177C11.4927 3.93184 11.9675 3.92031 12.2674 4.206C12.5673 4.49169 12.5789 4.96642 12.2932 5.26634L7.78458 9.99952L12.2932 14.7327C12.5789 15.0326 12.5673 15.5074 12.2674 15.793Z",fill:"currentColor"}))})},20134(e,t,r){r.d(t,{A:()=>a});var o=r(18123);let a=(0,o.defineComponent)({name:"FastBackward",render:()=>(0,o.h)("svg",{viewBox:"0 0 20 20",version:"1.1",xmlns:"http://www.w3.org/2000/svg"},(0,o.h)("g",{stroke:"none","stroke-width":"1",fill:"none","fill-rule":"evenodd"},(0,o.h)("g",{fill:"currentColor","fill-rule":"nonzero"},(0,o.h)("path",{d:"M8.73171,16.7949 C9.03264,17.0795 9.50733,17.0663 9.79196,16.7654 C10.0766,16.4644 10.0634,15.9897 9.76243,15.7051 L4.52339,10.75 L17.2471,10.75 C17.6613,10.75 17.9971,10.4142 17.9971,10 C17.9971,9.58579 17.6613,9.25 17.2471,9.25 L4.52112,9.25 L9.76243,4.29275 C10.0634,4.00812 10.0766,3.53343 9.79196,3.2325 C9.50733,2.93156 9.03264,2.91834 8.73171,3.20297 L2.31449,9.27241 C2.14819,9.4297 2.04819,9.62981 2.01448,9.8386 C2.00308,9.89058 1.99707,9.94459 1.99707,10 C1.99707,10.0576 2.00356,10.1137 2.01585,10.1675 C2.05084,10.3733 2.15039,10.5702 2.31449,10.7254 L8.73171,16.7949 Z"}))))})},79036(e,t,r){r.d(t,{A:()=>a});var o=r(18123);let a=(0,o.defineComponent)({name:"FastForward",render:()=>(0,o.h)("svg",{viewBox:"0 0 20 20",version:"1.1",xmlns:"http://www.w3.org/2000/svg"},(0,o.h)("g",{stroke:"none","stroke-width":"1",fill:"none","fill-rule":"evenodd"},(0,o.h)("g",{fill:"currentColor","fill-rule":"nonzero"},(0,o.h)("path",{d:"M11.2654,3.20511 C10.9644,2.92049 10.4897,2.93371 10.2051,3.23464 C9.92049,3.53558 9.93371,4.01027 10.2346,4.29489 L15.4737,9.25 L2.75,9.25 C2.33579,9.25 2,9.58579 2,10.0000012 C2,10.4142 2.33579,10.75 2.75,10.75 L15.476,10.75 L10.2346,15.7073 C9.93371,15.9919 9.92049,16.4666 10.2051,16.7675 C10.4897,17.0684 10.9644,17.0817 11.2654,16.797 L17.6826,10.7276 C17.8489,10.5703 17.9489,10.3702 17.9826,10.1614 C17.994,10.1094 18,10.0554 18,10.0000012 C18,9.94241 17.9935,9.88633 17.9812,9.83246 C17.9462,9.62667 17.8467,9.42976 17.6826,9.27455 L11.2654,3.20511 Z"}))))})},22082(e,t,r){r.d(t,{A:()=>a});var o=r(18123);let a=(0,o.defineComponent)({name:"Forward",render:()=>(0,o.h)("svg",{viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg"},(0,o.h)("path",{d:"M7.73271 4.20694C8.03263 3.92125 8.50737 3.93279 8.79306 4.23271L13.7944 9.48318C14.0703 9.77285 14.0703 10.2281 13.7944 10.5178L8.79306 15.7682C8.50737 16.0681 8.03263 16.0797 7.73271 15.794C7.43279 15.5083 7.42125 15.0336 7.70694 14.7336L12.2155 10.0005L7.70694 5.26729C7.42125 4.96737 7.43279 4.49264 7.73271 4.20694Z",fill:"currentColor"}))})},2579(e,t,r){r.d(t,{A:()=>d});var o=r(18123),a=r(91945),i=r(88718),n=r(26005);let l=(0,n.cB)("input-group",`
 display: inline-flex;
 width: 100%;
 flex-wrap: nowrap;
 vertical-align: bottom;
`,[(0,n.c)(">",[(0,n.cB)("input",[(0,n.c)("&:not(:last-child)",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `),(0,n.c)("&:not(:first-child)",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 margin-left: -1px!important;
 `)]),(0,n.cB)("button",[(0,n.c)("&:not(:last-child)",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `,[(0,n.cE)("state-border, border",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `)]),(0,n.c)("&:not(:first-child)",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `,[(0,n.cE)("state-border, border",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `)])]),(0,n.c)("*",[(0,n.c)("&:not(:last-child)",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `,[(0,n.c)(">",[(0,n.cB)("input",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `),(0,n.cB)("base-selection",[(0,n.cB)("base-selection-label",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `),(0,n.cB)("base-selection-tags",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `),(0,n.cE)("box-shadow, border, state-border",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `)])])]),(0,n.c)("&:not(:first-child)",`
 margin-left: -1px!important;
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `,[(0,n.c)(">",[(0,n.cB)("input",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `),(0,n.cB)("base-selection",[(0,n.cB)("base-selection-label",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `),(0,n.cB)("base-selection-tags",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `),(0,n.cE)("box-shadow, border, state-border",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `)])])])])])]),d=(0,o.defineComponent)({name:"InputGroup",props:{},setup(e){let{mergedClsPrefixRef:t}=(0,a.Ay)(e);return(0,i.A)("-input-group",l,t),{mergedClsPrefix:t}},render(){let{mergedClsPrefix:e}=this;return(0,o.h)("div",{class:`${e}-input-group`},this.$slots)}})},121(e,t,r){r.d(t,{A:()=>p});var o=r(18123),a=r(12894),i=r(91945),n=r(71811),l=r(47580),d=r(26005),s=r(19289);let u=(0,d.cB)("input-group-label",`
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
`,[(0,d.cE)("border",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 border-radius: inherit;
 border: var(--n-group-label-border);
 transition: border-color .3s var(--n-bezier);
 `)]),c=Object.assign(Object.assign({},a.A.props),{size:String,bordered:{type:Boolean,default:void 0}}),p=(0,o.defineComponent)({name:"InputGroupLabel",props:c,setup(e){let{mergedBorderedRef:t,mergedClsPrefixRef:r,inlineThemeDisabled:c}=(0,i.Ay)(e),{mergedSizeRef:p}=(0,n.A)(e),m=(0,a.A)("Input","-input-group-label",u,s.A,e,r),b=(0,o.computed)(()=>{let{value:e}=p,{common:{cubicBezierEaseInOut:t},self:{groupLabelColor:r,borderRadius:o,groupLabelTextColor:a,lineHeight:i,groupLabelBorder:n,[(0,d.cF)("fontSize",e)]:l,[(0,d.cF)("height",e)]:s}}=m.value;return{"--n-bezier":t,"--n-group-label-color":r,"--n-group-label-border":n,"--n-border-radius":o,"--n-group-label-text-color":a,"--n-font-size":l,"--n-line-height":i,"--n-height":s}}),g=c?(0,l.R)("input-group-label",(0,o.computed)(()=>{let{value:e}=p;return e[0]}),b,e):void 0;return{mergedClsPrefix:r,mergedBordered:t,cssVars:c?void 0:b,themeClass:null==g?void 0:g.themeClass,onRender:null==g?void 0:g.onRender}},render(){var e,t,r;let{mergedClsPrefix:a}=this;return null==(e=this.onRender)||e.call(this),(0,o.h)("div",{class:[`${a}-input-group-label`,this.themeClass],style:this.cssVars},null==(r=(t=this.$slots).default)?void 0:r.call(t),this.mergedBordered?(0,o.h)("div",{class:`${a}-input-group-label__border`}):null)}})}}]);