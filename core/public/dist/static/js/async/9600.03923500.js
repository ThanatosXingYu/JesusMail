"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([["9600"],{24216(e,t,r){r.d(t,{d:()=>o});function o(e,t){let{target:r}=e;for(;r;){if(r.dataset&&void 0!==r.dataset[t])return!0;r=r.parentElement}return!1}},66947(e,t,r){r.d(t,{Io:()=>d,S1:()=>l,cj:()=>a,kw:()=>n,wI:()=>s,y_:()=>u,zU:()=>i});var o=r(12189);let a=e=>o.K.post("/public/activation/activate",e),n=()=>o.K.get("/activation/stats"),i=e=>o.K.get("/activation/list",{params:e}),l=e=>o.K.post("/activation/generate",e,{fetchOptions:{successMessage:!0}}),d=e=>o.K.post("/activation/set_group",e,{fetchOptions:{successMessage:!0}}),s=e=>o.K.post("/activation/delete",e,{fetchOptions:{successMessage:!0}}),u=e=>o.K.post("/activation/clear_binding",e,{fetchOptions:{successMessage:!0}})},23467(e,t,r){r.r(t),r.d(t,{default:()=>A});var o=r(90655),a=r(65605),n=r(95234),i=r(2579),l=r(121),d=r(24396),s=r(25719),u=r(48209),p=r(18123),c=r(82806),f=r(5758),b=r(56187),m=r(42878),h=r(66947);let g={class:"activate-page"},v={key:0,class:"brand"},w={key:1,class:"success-box"},y={class:"email"},C={class:"w-full"},k={class:"expiry-tip"},x={class:"foot"},V=(0,p.defineComponent)({__name:"index",setup(e){let t=(0,p.ref)(null),r=(0,p.ref)(!1),V=(0,p.ref)(""),A=(0,p.reactive)({key:"",prefix:"",password:"",password2:"",duration_days:30}),N=()=>(0,f.o)(new Date),_=(0,p.ref)((0,b.f)(N(),A.duration_days).getTime()),B=e=>(0,m.m)(e,N()),L=e=>{let t=B(e);return t<1||t>31},E=e=>{if(null===e)return;let t=B(e);t<1||t>31||(_.value=(0,f.o)(e).getTime(),A.duration_days=t)},z={key:[{required:!0,pattern:/^(?:JESUSMAIL|QLU)-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/,message:"请输入正确格式的激活密钥",trigger:["blur","input"]}],prefix:[{required:!0,pattern:/^[a-z0-9][a-z0-9._-]{1,28}[a-z0-9]$/,message:"请输入 3-30 位合法邮箱前缀",trigger:["blur","input"]}],password:[{required:!0,min:8,max:64,validator:(e,t)=>/[A-Za-z]/.test(t)&&/\d/.test(t),message:"密码需 8-64 位且同时包含字母和数字",trigger:["blur","input"]}],password2:[{required:!0,validator:(e,t)=>t===A.password,message:"两次输入的密码不一致",trigger:["blur","input"]}],duration_days:[{required:!0,validator:(e,t)=>Number.isInteger(t)&&t>=1&&t<=31,message:"邮箱有效期必须为 1-31 天",trigger:["change"]}]},M=async()=>{var e;await (null==(e=t.value)?void 0:e.validate()),r.value=!0;try{V.value=(await (0,h.cj)({key:A.key,prefix:A.prefix,password:A.password,duration_days:A.duration_days})).email}finally{r.value=!1}};return(e,f)=>{let b=u.Ay,m=s.A,h=d.Ay,N=l.A,B=i.A,S=n.A,X=a.A,U=(0,p.resolveComponent)("router-link"),I=o.Ay;return(0,p.openBlock)(),(0,p.createElementBlock)("div",g,[(0,p.createVNode)(I,{class:"activate-card",bordered:!1},{default:(0,p.withCtx)(()=>[(0,p.unref)(V)?(0,p.createCommentVNode)("",!0):((0,p.openBlock)(),(0,p.createElementBlock)("div",v,[...f[6]||(f[6]=[(0,p.createElementVNode)("img",{src:c,alt:"JesusMail"},null,-1),(0,p.createElementVNode)("h1",null,"JesusMail",-1),(0,p.createElementVNode)("p",null,"使用激活密钥开通你的邮箱",-1)])])),(0,p.unref)(V)?((0,p.openBlock)(),(0,p.createElementBlock)("div",w,[f[8]||(f[8]=(0,p.createElementVNode)("div",{class:"success-icon"},"✓",-1)),f[9]||(f[9]=(0,p.createElementVNode)("h2",null,"你的邮箱已就绪",-1)),(0,p.createElementVNode)("div",y,(0,p.toDisplayString)((0,p.unref)(V)),1),f[10]||(f[10]=(0,p.createElementVNode)("p",null,"登录密码为你刚才设置的密码，请妥善保管。本次激活密钥已作废，请勿重复使用。",-1)),(0,p.createVNode)(b,{type:"primary",size:"large",block:"",tag:"a",href:"/roundcube/"},{default:(0,p.withCtx)(()=>[...f[7]||(f[7]=[(0,p.createTextVNode)("前往登录邮箱",-1)])]),_:1})])):((0,p.openBlock)(),(0,p.createBlock)(X,{key:2,ref_key:"formRef",ref:t,model:(0,p.unref)(A),rules:z,"label-placement":"top",onSubmit:(0,p.withModifiers)(M,["prevent"])},{default:(0,p.withCtx)(()=>[(0,p.createVNode)(h,{label:"激活密钥",path:"key"},{default:(0,p.withCtx)(()=>[(0,p.createVNode)(m,{value:(0,p.unref)(A).key,"onUpdate:value":[f[0]||(f[0]=e=>(0,p.unref)(A).key=e),f[1]||(f[1]=e=>(0,p.unref)(A).key=(0,p.unref)(A).key.toUpperCase())],maxlength:"24",placeholder:"JESUSMAIL-XXXX-XXXX-XXXX"},null,8,["value"])]),_:1}),(0,p.createVNode)(h,{label:"邮箱前缀",path:"prefix"},{default:(0,p.withCtx)(()=>[(0,p.createVNode)(B,null,{default:(0,p.withCtx)(()=>[(0,p.createVNode)(m,{value:(0,p.unref)(A).prefix,"onUpdate:value":[f[2]||(f[2]=e=>(0,p.unref)(A).prefix=e),f[3]||(f[3]=e=>(0,p.unref)(A).prefix=(0,p.unref)(A).prefix.toLowerCase())],maxlength:"30",placeholder:"3-30 位字母、数字或 . _ -"},null,8,["value"]),(0,p.createVNode)(N,null,{default:(0,p.withCtx)(()=>[...f[11]||(f[11]=[(0,p.createTextVNode)("@mail.qlu.edu.kg",-1)])]),_:1})]),_:1})]),_:1}),(0,p.createVNode)(h,{label:"设置密码",path:"password"},{default:(0,p.withCtx)(()=>[(0,p.createVNode)(m,{value:(0,p.unref)(A).password,"onUpdate:value":f[4]||(f[4]=e=>(0,p.unref)(A).password=e),type:"password","show-password-on":"click",maxlength:"64",placeholder:"8-64 位，须同时包含字母和数字"},null,8,["value"])]),_:1}),(0,p.createVNode)(h,{label:"确认密码",path:"password2"},{default:(0,p.withCtx)(()=>[(0,p.createVNode)(m,{value:(0,p.unref)(A).password2,"onUpdate:value":f[5]||(f[5]=e=>(0,p.unref)(A).password2=e),type:"password","show-password-on":"click",maxlength:"64",placeholder:"再次输入密码",onKeyup:(0,p.withKeys)(M,["enter"])},null,8,["value"])]),_:1}),(0,p.createVNode)(h,{label:"邮箱有效期",path:"duration_days"},{default:(0,p.withCtx)(()=>[(0,p.createElementVNode)("div",C,[(0,p.createVNode)(S,{value:(0,p.unref)(_),type:"date",format:"yyyy-MM-dd",clearable:!1,"is-date-disabled":L,class:"w-full","onUpdate:value":E},null,8,["value"]),(0,p.createElementVNode)("div",k," 当前有效期 "+(0,p.toDisplayString)((0,p.unref)(A).duration_days)+" 天；到期后邮箱账号与邮件将进入 30 天回收期。 ",1)])]),_:1}),(0,p.createVNode)(b,{type:"primary",size:"large",block:"",loading:(0,p.unref)(r),"attr-type":"submit"},{default:(0,p.withCtx)(()=>[...f[12]||(f[12]=[(0,p.createTextVNode)("立即开通邮箱",-1)])]),_:1},8,["loading"])]),_:1},8,["model"])),(0,p.createElementVNode)("div",x,[(0,p.createVNode)(U,{to:"/login"},{default:(0,p.withCtx)(()=>[...f[13]||(f[13]=[(0,p.createTextVNode)("管理员登录",-1)])]),_:1})])]),_:1})])}}}),A=(0,r(31765).default)(V,[["__scopeId","data-v-87831f01"]])},75946(e,t,r){r.d(t,{A:()=>i});var o=r(18123),a=r(80283),n=r(62768);function i(e={},t){let r=(0,o.reactive)({ctrl:!1,command:!1,win:!1,shift:!1,tab:!1}),{keydown:l,keyup:d}=e,s=e=>{switch(e.key){case"Control":r.ctrl=!0;break;case"Meta":r.command=!0,r.win=!0;break;case"Shift":r.shift=!0;break;case"Tab":r.tab=!0}void 0!==l&&Object.keys(l).forEach(t=>{if(t!==e.key)return;let r=l[t];if("function"==typeof r)r(e);else{let{stop:t=!1,prevent:o=!1}=r;t&&e.stopPropagation(),o&&e.preventDefault(),r.handler(e)}})},u=e=>{switch(e.key){case"Control":r.ctrl=!1;break;case"Meta":r.command=!1,r.win=!1;break;case"Shift":r.shift=!1;break;case"Tab":r.tab=!1}void 0!==d&&Object.keys(d).forEach(t=>{if(t!==e.key)return;let r=d[t];if("function"==typeof r)r(e);else{let{stop:t=!1,prevent:o=!1}=r;t&&e.stopPropagation(),o&&e.preventDefault(),r.handler(e)}})},p=()=>{(void 0===t||t.value)&&((0,a.on)("keydown",document,s),(0,a.on)("keyup",document,u)),void 0!==t&&(0,o.watch)(t,e=>{e?((0,a.on)("keydown",document,s),(0,a.on)("keyup",document,u)):((0,a.A)("keydown",document,s),(0,a.A)("keyup",document,u))})};return(0,n.a)()?((0,o.onBeforeMount)(p),(0,o.onBeforeUnmount)(()=>{(void 0===t||t.value)&&((0,a.A)("keydown",document,s),(0,a.A)("keyup",document,u))})):p(),(0,o.readonly)(r)}},82806(e,t,r){e.exports=r.p+"static/image/logo.d6fdff7a.png"},98336(e,t,r){r.d(t,{A:()=>a});var o=r(18123);let a=(0,o.defineComponent)({name:"Backward",render:()=>(0,o.h)("svg",{viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg"},(0,o.h)("path",{d:"M12.2674 15.793C11.9675 16.0787 11.4927 16.0672 11.2071 15.7673L6.20572 10.5168C5.9298 10.2271 5.9298 9.7719 6.20572 9.48223L11.2071 4.23177C11.4927 3.93184 11.9675 3.92031 12.2674 4.206C12.5673 4.49169 12.5789 4.96642 12.2932 5.26634L7.78458 9.99952L12.2932 14.7327C12.5789 15.0326 12.5673 15.5074 12.2674 15.793Z",fill:"currentColor"}))})},20134(e,t,r){r.d(t,{A:()=>a});var o=r(18123);let a=(0,o.defineComponent)({name:"FastBackward",render:()=>(0,o.h)("svg",{viewBox:"0 0 20 20",version:"1.1",xmlns:"http://www.w3.org/2000/svg"},(0,o.h)("g",{stroke:"none","stroke-width":"1",fill:"none","fill-rule":"evenodd"},(0,o.h)("g",{fill:"currentColor","fill-rule":"nonzero"},(0,o.h)("path",{d:"M8.73171,16.7949 C9.03264,17.0795 9.50733,17.0663 9.79196,16.7654 C10.0766,16.4644 10.0634,15.9897 9.76243,15.7051 L4.52339,10.75 L17.2471,10.75 C17.6613,10.75 17.9971,10.4142 17.9971,10 C17.9971,9.58579 17.6613,9.25 17.2471,9.25 L4.52112,9.25 L9.76243,4.29275 C10.0634,4.00812 10.0766,3.53343 9.79196,3.2325 C9.50733,2.93156 9.03264,2.91834 8.73171,3.20297 L2.31449,9.27241 C2.14819,9.4297 2.04819,9.62981 2.01448,9.8386 C2.00308,9.89058 1.99707,9.94459 1.99707,10 C1.99707,10.0576 2.00356,10.1137 2.01585,10.1675 C2.05084,10.3733 2.15039,10.5702 2.31449,10.7254 L8.73171,16.7949 Z"}))))})},79036(e,t,r){r.d(t,{A:()=>a});var o=r(18123);let a=(0,o.defineComponent)({name:"FastForward",render:()=>(0,o.h)("svg",{viewBox:"0 0 20 20",version:"1.1",xmlns:"http://www.w3.org/2000/svg"},(0,o.h)("g",{stroke:"none","stroke-width":"1",fill:"none","fill-rule":"evenodd"},(0,o.h)("g",{fill:"currentColor","fill-rule":"nonzero"},(0,o.h)("path",{d:"M11.2654,3.20511 C10.9644,2.92049 10.4897,2.93371 10.2051,3.23464 C9.92049,3.53558 9.93371,4.01027 10.2346,4.29489 L15.4737,9.25 L2.75,9.25 C2.33579,9.25 2,9.58579 2,10.0000012 C2,10.4142 2.33579,10.75 2.75,10.75 L15.476,10.75 L10.2346,15.7073 C9.93371,15.9919 9.92049,16.4666 10.2051,16.7675 C10.4897,17.0684 10.9644,17.0817 11.2654,16.797 L17.6826,10.7276 C17.8489,10.5703 17.9489,10.3702 17.9826,10.1614 C17.994,10.1094 18,10.0554 18,10.0000012 C18,9.94241 17.9935,9.88633 17.9812,9.83246 C17.9462,9.62667 17.8467,9.42976 17.6826,9.27455 L11.2654,3.20511 Z"}))))})},22082(e,t,r){r.d(t,{A:()=>a});var o=r(18123);let a=(0,o.defineComponent)({name:"Forward",render:()=>(0,o.h)("svg",{viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg"},(0,o.h)("path",{d:"M7.73271 4.20694C8.03263 3.92125 8.50737 3.93279 8.79306 4.23271L13.7944 9.48318C14.0703 9.77285 14.0703 10.2281 13.7944 10.5178L8.79306 15.7682C8.50737 16.0681 8.03263 16.0797 7.73271 15.794C7.43279 15.5083 7.42125 15.0336 7.70694 14.7336L12.2155 10.0005L7.70694 5.26729C7.42125 4.96737 7.43279 4.49264 7.73271 4.20694Z",fill:"currentColor"}))})},2579(e,t,r){r.d(t,{A:()=>d});var o=r(18123),a=r(91945),n=r(88718),i=r(26005);let l=(0,i.cB)("input-group",`
 display: inline-flex;
 width: 100%;
 flex-wrap: nowrap;
 vertical-align: bottom;
`,[(0,i.c)(">",[(0,i.cB)("input",[(0,i.c)("&:not(:last-child)",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `),(0,i.c)("&:not(:first-child)",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 margin-left: -1px!important;
 `)]),(0,i.cB)("button",[(0,i.c)("&:not(:last-child)",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `,[(0,i.cE)("state-border, border",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `)]),(0,i.c)("&:not(:first-child)",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `,[(0,i.cE)("state-border, border",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `)])]),(0,i.c)("*",[(0,i.c)("&:not(:last-child)",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `,[(0,i.c)(">",[(0,i.cB)("input",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `),(0,i.cB)("base-selection",[(0,i.cB)("base-selection-label",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `),(0,i.cB)("base-selection-tags",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `),(0,i.cE)("box-shadow, border, state-border",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `)])])]),(0,i.c)("&:not(:first-child)",`
 margin-left: -1px!important;
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `,[(0,i.c)(">",[(0,i.cB)("input",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `),(0,i.cB)("base-selection",[(0,i.cB)("base-selection-label",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `),(0,i.cB)("base-selection-tags",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `),(0,i.cE)("box-shadow, border, state-border",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `)])])])])])]),d=(0,o.defineComponent)({name:"InputGroup",props:{},setup(e){let{mergedClsPrefixRef:t}=(0,a.Ay)(e);return(0,n.A)("-input-group",l,t),{mergedClsPrefix:t}},render(){let{mergedClsPrefix:e}=this;return(0,o.h)("div",{class:`${e}-input-group`},this.$slots)}})},121(e,t,r){r.d(t,{A:()=>c});var o=r(18123),a=r(12894),n=r(91945),i=r(71811),l=r(47580),d=r(26005),s=r(19289);let u=(0,d.cB)("input-group-label",`
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
 `)]),p=Object.assign(Object.assign({},a.A.props),{size:String,bordered:{type:Boolean,default:void 0}}),c=(0,o.defineComponent)({name:"InputGroupLabel",props:p,setup(e){let{mergedBorderedRef:t,mergedClsPrefixRef:r,inlineThemeDisabled:p}=(0,n.Ay)(e),{mergedSizeRef:c}=(0,i.A)(e),f=(0,a.A)("Input","-input-group-label",u,s.A,e,r),b=(0,o.computed)(()=>{let{value:e}=c,{common:{cubicBezierEaseInOut:t},self:{groupLabelColor:r,borderRadius:o,groupLabelTextColor:a,lineHeight:n,groupLabelBorder:i,[(0,d.cF)("fontSize",e)]:l,[(0,d.cF)("height",e)]:s}}=f.value;return{"--n-bezier":t,"--n-group-label-color":r,"--n-group-label-border":i,"--n-border-radius":o,"--n-group-label-text-color":a,"--n-font-size":l,"--n-line-height":n,"--n-height":s}}),m=p?(0,l.R)("input-group-label",(0,o.computed)(()=>{let{value:e}=c;return e[0]}),b,e):void 0;return{mergedClsPrefix:r,mergedBordered:t,cssVars:p?void 0:b,themeClass:null==m?void 0:m.themeClass,onRender:null==m?void 0:m.onRender}},render(){var e,t,r;let{mergedClsPrefix:a}=this;return null==(e=this.onRender)||e.call(this),(0,o.h)("div",{class:[`${a}-input-group-label`,this.themeClass],style:this.cssVars},null==(r=(t=this.$slots).default)?void 0:r.call(t),this.mergedBordered?(0,o.h)("div",{class:`${a}-input-group-label__border`}):null)}})}}]);