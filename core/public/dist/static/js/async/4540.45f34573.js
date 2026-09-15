"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([["4540"],{49019(e,t,n){n.d(t,{A:()=>T});var o=n(90368),l=n(24216),i=n(56728),r=n(18123),a=n(85224),s=n(12894),u=n(91945),d=n(12469),c=n(47580),h=n(81650),p=n(80224),v=n(26005),f=n(58994),b=n(91992),g=n(37928),m=n(76616),w=n(48684),y=n(3009),x=n(81021);let C=(0,r.defineComponent)({name:"NBaseSelectGroupHeader",props:{clsPrefix:{type:String,required:!0},tmNode:{type:Object,required:!0}},setup(){let{renderLabelRef:e,renderOptionRef:t,labelFieldRef:n,nodePropsRef:o}=(0,r.inject)(y.H);return{labelField:n,nodeProps:o,renderLabel:e,renderOption:t}},render(){let{clsPrefix:e,renderLabel:t,renderOption:n,nodeProps:o,tmNode:{rawNode:l}}=this,i=null==o?void 0:o(l),a=t?t(l,!1):(0,x.X)(l[this.labelField],l,!1),s=(0,r.h)("div",Object.assign({},i,{class:[`${e}-base-select-group-header`,null==i?void 0:i.class]}),a);return l.render?l.render({node:s,option:l}):n?n({node:s,option:l,selected:!1}):s}});var F=n(93529),z=n(72527),O=n(64272);let B=(0,r.defineComponent)({name:"Checkmark",render:()=>(0,r.h)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 16 16"},(0,r.h)("g",{fill:"none"},(0,r.h)("path",{d:"M14.046 3.486a.75.75 0 0 1-.032 1.06l-7.93 7.474a.85.85 0 0 1-1.188-.022l-2.68-2.72a.75.75 0 1 1 1.068-1.053l2.234 2.267l7.468-7.038a.75.75 0 0 1 1.06.032z",fill:"currentColor"})))}),M=(0,r.defineComponent)({name:"NBaseSelectOption",props:{clsPrefix:{type:String,required:!0},tmNode:{type:Object,required:!0}},setup(e){let{valueRef:t,pendingTmNodeRef:n,multipleRef:o,valueSetRef:l,renderLabelRef:i,renderOptionRef:a,labelFieldRef:s,valueFieldRef:u,showCheckmarkRef:d,nodePropsRef:c,handleOptionClick:h,handleOptionMouseEnter:p}=(0,r.inject)(y.H),v=(0,F.A)(()=>{let{value:t}=n;return!!t&&e.tmNode.key===t.key});return{multiple:o,isGrouped:(0,F.A)(()=>{let{tmNode:t}=e,{parent:n}=t;return n&&"group"===n.rawNode.type}),showCheckmark:d,nodeProps:c,isPending:v,isSelected:(0,F.A)(()=>{let{value:n}=t,{value:i}=o;if(null===n)return!1;let r=e.tmNode.rawNode[u.value];if(!i)return n===r;{let{value:e}=l;return e.has(r)}}),labelField:s,renderLabel:i,renderOption:a,handleMouseMove:function(t){let{tmNode:n}=e,{value:o}=v;n.disabled||o||p(t,n)},handleMouseEnter:function(t){let{tmNode:n}=e;n.disabled||p(t,n)},handleClick:function(t){let{tmNode:n}=e;n.disabled||h(t,n)}}},render(){let{clsPrefix:e,tmNode:{rawNode:t},isSelected:n,isPending:o,isGrouped:l,showCheckmark:i,nodeProps:a,renderOption:s,renderLabel:u,handleClick:d,handleMouseEnter:c,handleMouseMove:h}=this,p=(0,r.h)(r.Transition,{name:"fade-in-scale-up-transition"},{default:()=>n?(0,r.h)(O.A,{clsPrefix:e,class:`${e}-base-select-option__check`},{default:()=>(0,r.h)(B)}):null}),v=u?[u(t,n),i&&p]:[(0,x.X)(t[this.labelField],t,n),i&&p],f=null==a?void 0:a(t),b=(0,r.h)("div",Object.assign({},f,{class:[`${e}-base-select-option`,t.class,null==f?void 0:f.class,{[`${e}-base-select-option--disabled`]:t.disabled,[`${e}-base-select-option--selected`]:n,[`${e}-base-select-option--grouped`]:l,[`${e}-base-select-option--pending`]:o,[`${e}-base-select-option--show-checkmark`]:i}],style:[(null==f?void 0:f.style)||"",t.style||""],onClick:(0,z.u)([d,null==f?void 0:f.onClick]),onMouseenter:(0,z.u)([c,null==f?void 0:f.onMouseenter]),onMousemove:(0,z.u)([h,null==f?void 0:f.onMousemove])}),(0,r.h)("div",{class:`${e}-base-select-option__content`},v));return t.render?t.render({node:b,option:t,selected:n}):s?s({node:b,option:t,selected:n}):b}});var S=n(25472);let k=(0,v.cB)("base-select-menu",`
 line-height: 1.5;
 outline: none;
 z-index: 0;
 position: relative;
 border-radius: var(--n-border-radius);
 transition:
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 background-color: var(--n-color);
`,[(0,v.cB)("scrollbar",`
 max-height: var(--n-height);
 `),(0,v.cB)("virtual-list",`
 max-height: var(--n-height);
 `),(0,v.cB)("base-select-option",`
 min-height: var(--n-option-height);
 font-size: var(--n-option-font-size);
 display: flex;
 align-items: center;
 `,[(0,v.cE)("content",`
 z-index: 1;
 white-space: nowrap;
 text-overflow: ellipsis;
 overflow: hidden;
 `)]),(0,v.cB)("base-select-group-header",`
 min-height: var(--n-option-height);
 font-size: .93em;
 display: flex;
 align-items: center;
 `),(0,v.cB)("base-select-menu-option-wrapper",`
 position: relative;
 width: 100%;
 `),(0,v.cE)("loading, empty",`
 display: flex;
 padding: 12px 32px;
 flex: 1;
 justify-content: center;
 `),(0,v.cE)("loading",`
 color: var(--n-loading-color);
 font-size: var(--n-loading-size);
 `),(0,v.cE)("header",`
 padding: 8px var(--n-option-padding-left);
 font-size: var(--n-option-font-size);
 transition: 
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-action-divider-color);
 color: var(--n-action-text-color);
 `),(0,v.cE)("action",`
 padding: 8px var(--n-option-padding-left);
 font-size: var(--n-option-font-size);
 transition: 
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 border-top: 1px solid var(--n-action-divider-color);
 color: var(--n-action-text-color);
 `),(0,v.cB)("base-select-group-header",`
 position: relative;
 cursor: default;
 padding: var(--n-option-padding);
 color: var(--n-group-header-text-color);
 `),(0,v.cB)("base-select-option",`
 cursor: pointer;
 position: relative;
 padding: var(--n-option-padding);
 transition:
 color .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 box-sizing: border-box;
 color: var(--n-option-text-color);
 opacity: 1;
 `,[(0,v.cM)("show-checkmark",`
 padding-right: calc(var(--n-option-padding-right) + 20px);
 `),(0,v.c)("&::before",`
 content: "";
 position: absolute;
 left: 4px;
 right: 4px;
 top: 0;
 bottom: 0;
 border-radius: var(--n-border-radius);
 transition: background-color .3s var(--n-bezier);
 `),(0,v.c)("&:active",`
 color: var(--n-option-text-color-pressed);
 `),(0,v.cM)("grouped",`
 padding-left: calc(var(--n-option-padding-left) * 1.5);
 `),(0,v.cM)("pending",[(0,v.c)("&::before",`
 background-color: var(--n-option-color-pending);
 `)]),(0,v.cM)("selected",`
 color: var(--n-option-text-color-active);
 `,[(0,v.c)("&::before",`
 background-color: var(--n-option-color-active);
 `),(0,v.cM)("pending",[(0,v.c)("&::before",`
 background-color: var(--n-option-color-active-pending);
 `)])]),(0,v.cM)("disabled",`
 cursor: not-allowed;
 `,[(0,v.C5)("selected",`
 color: var(--n-option-text-color-disabled);
 `),(0,v.cM)("selected",`
 opacity: var(--n-option-opacity-disabled);
 `)]),(0,v.cE)("check",`
 font-size: 16px;
 position: absolute;
 right: calc(var(--n-option-padding-right) - 4px);
 top: calc(50% - 7px);
 color: var(--n-option-check-color);
 transition: color .3s var(--n-bezier);
 `,[(0,S.S)({enterScale:"0.5"})])])]),T=(0,r.defineComponent)({name:"InternalSelectMenu",props:Object.assign(Object.assign({},s.A.props),{clsPrefix:{type:String,required:!0},scrollable:{type:Boolean,default:!0},treeMate:{type:Object,required:!0},multiple:Boolean,size:{type:String,default:"medium"},value:{type:[String,Number,Array],default:null},autoPending:Boolean,virtualScroll:{type:Boolean,default:!0},show:{type:Boolean,default:!0},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},loading:Boolean,focusable:Boolean,renderLabel:Function,renderOption:Function,nodeProps:Function,showCheckmark:{type:Boolean,default:!0},onMousedown:Function,onScroll:Function,onFocus:Function,onBlur:Function,onKeyup:Function,onKeydown:Function,onTabOut:Function,onMouseenter:Function,onMouseleave:Function,onResize:Function,resetMenuOnOptionsChange:{type:Boolean,default:!0},inlineThemeDisabled:Boolean,onToggle:Function}),setup(e){let t,{mergedClsPrefixRef:n,mergedRtlRef:a}=(0,u.Ay)(e),p=(0,d.I)("InternalSelectMenu",a,n),f=(0,s.A)("InternalSelectMenu","-internal-select-menu",k,w.A,e,(0,r.toRef)(e,"clsPrefix")),b=(0,r.ref)(null),g=(0,r.ref)(null),m=(0,r.ref)(null),x=(0,r.computed)(()=>e.treeMate.getFlattenedNodes()),C=(0,r.computed)(()=>(0,i.KU)(x.value)),F=(0,r.ref)(null);function z(){let{value:t}=F;t&&!e.treeMate.getNode(t.key)&&(F.value=null)}(0,r.watch)(()=>e.show,n=>{n?t=(0,r.watch)(()=>e.treeMate,()=>{e.resetMenuOnOptionsChange?(e.autoPending?function(){let{treeMate:t}=e,n=null,{value:o}=e;null===o?n=t.getFirstAvailableNode():(n=e.multiple?t.getNode((o||[])[(o||[]).length-1]):t.getNode(o))&&!n.disabled||(n=t.getFirstAvailableNode()),n?A(n):A(null)}():z(),(0,r.nextTick)(P)):z()},{immediate:!0}):null==t||t()},{immediate:!0}),(0,r.onBeforeUnmount)(()=>{null==t||t()});let O=(0,r.computed)(()=>(0,o.eV)(f.value.self[(0,v.cF)("optionHeight",e.size)])),B=(0,r.computed)(()=>(0,o.Cq)(f.value.self[(0,v.cF)("padding",e.size)])),M=(0,r.computed)(()=>e.multiple&&Array.isArray(e.value)?new Set(e.value):new Set),S=(0,r.computed)(()=>{let e=x.value;return e&&0===e.length});function T(t){let{onScroll:n}=e;n&&n(t)}function A(e,t=!1){F.value=e,t&&P()}function P(){var t,n;let o=F.value;if(!o)return;let l=C.value(o.key);null!==l&&(e.virtualScroll?null==(t=g.value)||t.scrollTo({index:l}):null==(n=m.value)||n.scrollTo({index:l,elSize:O.value}))}(0,r.provide)(y.H,{handleOptionMouseEnter:function(e,t){t.disabled||A(t,!1)},handleOptionClick:function(t,n){n.disabled||function(t){let{onToggle:n}=e;n&&n(t)}(n)},valueSetRef:M,pendingTmNodeRef:F,nodePropsRef:(0,r.toRef)(e,"nodeProps"),showCheckmarkRef:(0,r.toRef)(e,"showCheckmark"),multipleRef:(0,r.toRef)(e,"multiple"),valueRef:(0,r.toRef)(e,"value"),renderLabelRef:(0,r.toRef)(e,"renderLabel"),renderOptionRef:(0,r.toRef)(e,"renderOption"),labelFieldRef:(0,r.toRef)(e,"labelField"),valueFieldRef:(0,r.toRef)(e,"valueField")}),(0,r.provide)(y.v,b),(0,r.onMounted)(()=>{let{value:e}=m;e&&e.sync()});let $=(0,r.computed)(()=>{let{size:t}=e,{common:{cubicBezierEaseInOut:n},self:{height:l,borderRadius:i,color:r,groupHeaderTextColor:a,actionDividerColor:s,optionTextColorPressed:u,optionTextColor:d,optionTextColorDisabled:c,optionTextColorActive:h,optionOpacityDisabled:p,optionCheckColor:b,actionTextColor:g,optionColorPending:m,optionColorActive:w,loadingColor:y,loadingSize:x,optionColorActivePending:C,[(0,v.cF)("optionFontSize",t)]:F,[(0,v.cF)("optionHeight",t)]:z,[(0,v.cF)("optionPadding",t)]:O}}=f.value;return{"--n-height":l,"--n-action-divider-color":s,"--n-action-text-color":g,"--n-bezier":n,"--n-border-radius":i,"--n-color":r,"--n-option-font-size":F,"--n-group-header-text-color":a,"--n-option-check-color":b,"--n-option-color-pending":m,"--n-option-color-active":w,"--n-option-color-active-pending":C,"--n-option-height":z,"--n-option-opacity-disabled":p,"--n-option-text-color":d,"--n-option-text-color-active":h,"--n-option-text-color-disabled":c,"--n-option-text-color-pressed":u,"--n-option-padding":O,"--n-option-padding-left":(0,o.Cq)(O,"left"),"--n-option-padding-right":(0,o.Cq)(O,"right"),"--n-loading-color":y,"--n-loading-size":x}}),{inlineThemeDisabled:R}=e,E=R?(0,c.R)("internal-select-menu",(0,r.computed)(()=>e.size[0]),$,e):void 0;return(0,h.P)(b,e.onResize),Object.assign({mergedTheme:f,mergedClsPrefix:n,rtlEnabled:p,virtualListRef:g,scrollbarRef:m,itemSize:O,padding:B,flattenedNodes:x,empty:S,virtualListContainer(){let{value:e}=g;return null==e?void 0:e.listElRef},virtualListContent(){let{value:e}=g;return null==e?void 0:e.itemsElRef},doScroll:T,handleFocusin:function(t){var n,o;(null==(n=b.value)?void 0:n.contains(t.target))&&(null==(o=e.onFocus)||o.call(e,t))},handleFocusout:function(t){var n,o;(null==(n=b.value)?void 0:n.contains(t.relatedTarget))||null==(o=e.onBlur)||o.call(e,t)},handleKeyUp:function(t){var n;(0,l.d)(t,"action")||null==(n=e.onKeyup)||n.call(e,t)},handleKeyDown:function(t){var n;(0,l.d)(t,"action")||null==(n=e.onKeydown)||n.call(e,t)},handleMouseDown:function(t){var n;null==(n=e.onMousedown)||n.call(e,t),e.focusable||t.preventDefault()},handleVirtualListResize:function(){var e;null==(e=m.value)||e.sync()},handleVirtualListScroll:function(e){var t;null==(t=m.value)||t.sync(),T(e)},cssVars:R?void 0:$,themeClass:null==E?void 0:E.themeClass,onRender:null==E?void 0:E.onRender},{selfRef:b,next:function(){let{value:e}=F;e&&A(e.getNext({loop:!0}),!0)},prev:function(){let{value:e}=F;e&&A(e.getPrev({loop:!0}),!0)},getPendingTmNode:function(){let{value:e}=F;return e||null}})},render(){let{$slots:e,virtualScroll:t,clsPrefix:n,mergedTheme:o,themeClass:l,onRender:i}=this;return null==i||i(),(0,r.h)("div",{ref:"selfRef",tabindex:this.focusable?0:-1,class:[`${n}-base-select-menu`,this.rtlEnabled&&`${n}-base-select-menu--rtl`,l,this.multiple&&`${n}-base-select-menu--multiple`],style:this.cssVars,onFocusin:this.handleFocusin,onFocusout:this.handleFocusout,onKeyup:this.handleKeyUp,onKeydown:this.handleKeyDown,onMousedown:this.handleMouseDown,onMouseenter:this.onMouseenter,onMouseleave:this.onMouseleave},(0,p.iQ)(e.header,e=>e&&(0,r.h)("div",{class:`${n}-base-select-menu__header`,"data-header":!0,key:"header"},e)),this.loading?(0,r.h)("div",{class:`${n}-base-select-menu__loading`},(0,r.h)(g.A,{clsPrefix:n,strokeWidth:20})):this.empty?(0,r.h)("div",{class:`${n}-base-select-menu__empty`,"data-empty":!0},(0,p.Nj)(e.empty,()=>[(0,r.h)(f.A,{theme:o.peers.Empty,themeOverrides:o.peerOverrides.Empty,size:this.size})])):(0,r.h)(m.A,{ref:"scrollbarRef",theme:o.peers.Scrollbar,themeOverrides:o.peerOverrides.Scrollbar,scrollable:this.scrollable,container:t?this.virtualListContainer:void 0,content:t?this.virtualListContent:void 0,onScroll:t?void 0:this.doScroll},{default:()=>t?(0,r.h)(a.A,{ref:"virtualListRef",class:`${n}-virtual-list`,items:this.flattenedNodes,itemSize:this.itemSize,showScrollbar:!1,paddingTop:this.padding.top,paddingBottom:this.padding.bottom,onResize:this.handleVirtualListResize,onScroll:this.handleVirtualListScroll,itemResizable:!0},{default:({item:e})=>e.isGroup?(0,r.h)(C,{key:e.key,clsPrefix:n,tmNode:e}):e.ignored?null:(0,r.h)(M,{clsPrefix:n,key:e.key,tmNode:e})}):(0,r.h)("div",{class:`${n}-base-select-menu-option-wrapper`,style:{paddingTop:this.padding.top,paddingBottom:this.padding.bottom}},this.flattenedNodes.map(e=>e.isGroup?(0,r.h)(C,{key:e.key,clsPrefix:n,tmNode:e}):(0,r.h)(M,{clsPrefix:n,key:e.key,tmNode:e})))}),(0,p.iQ)(e.action,e=>e&&[(0,r.h)("div",{class:`${n}-base-select-menu__action`,"data-action":!0,key:"action"},e),(0,r.h)(b.A,{onFocus:this.onTabOut,key:"focus-detector"})]))}})},81650(e,t,n){n.d(t,{P:()=>i});var o=n(18123),l=n(19200);function i(e,t){t&&((0,o.onMounted)(()=>{let{value:n}=e;n&&l.A.registerHandler(n,t)}),(0,o.watch)(e,(e,t)=>{t&&l.A.unregisterHandler(t)},{deep:!1}),(0,o.onBeforeUnmount)(()=>{let{value:t}=e;t&&l.A.unregisterHandler(t)}))}},72527(e,t,n){n.d(t,{u:()=>o});function o(e){let t=e.filter(e=>void 0!==e);if(0!==t.length)return 1===t.length?t[0]:t=>{e.forEach(e=>{e&&e(t)})}}},58994(e,t,n){n.d(t,{A:()=>v});var o=n(18123),l=n(64272);let i=(0,o.defineComponent)({name:"Empty",render:()=>(0,o.h)("svg",{viewBox:"0 0 28 28",fill:"none",xmlns:"http://www.w3.org/2000/svg"},(0,o.h)("path",{d:"M26 7.5C26 11.0899 23.0899 14 19.5 14C15.9101 14 13 11.0899 13 7.5C13 3.91015 15.9101 1 19.5 1C23.0899 1 26 3.91015 26 7.5ZM16.8536 4.14645C16.6583 3.95118 16.3417 3.95118 16.1464 4.14645C15.9512 4.34171 15.9512 4.65829 16.1464 4.85355L18.7929 7.5L16.1464 10.1464C15.9512 10.3417 15.9512 10.6583 16.1464 10.8536C16.3417 11.0488 16.6583 11.0488 16.8536 10.8536L19.5 8.20711L22.1464 10.8536C22.3417 11.0488 22.6583 11.0488 22.8536 10.8536C23.0488 10.6583 23.0488 10.3417 22.8536 10.1464L20.2071 7.5L22.8536 4.85355C23.0488 4.65829 23.0488 4.34171 22.8536 4.14645C22.6583 3.95118 22.3417 3.95118 22.1464 4.14645L19.5 6.79289L16.8536 4.14645Z",fill:"currentColor"}),(0,o.h)("path",{d:"M25 22.75V12.5991C24.5572 13.0765 24.053 13.4961 23.5 13.8454V16H17.5L17.3982 16.0068C17.0322 16.0565 16.75 16.3703 16.75 16.75C16.75 18.2688 15.5188 19.5 14 19.5C12.4812 19.5 11.25 18.2688 11.25 16.75L11.2432 16.6482C11.1935 16.2822 10.8797 16 10.5 16H4.5V7.25C4.5 6.2835 5.2835 5.5 6.25 5.5H12.2696C12.4146 4.97463 12.6153 4.47237 12.865 4H6.25C4.45507 4 3 5.45507 3 7.25V22.75C3 24.5449 4.45507 26 6.25 26H21.75C23.5449 26 25 24.5449 25 22.75ZM4.5 22.75V17.5H9.81597L9.85751 17.7041C10.2905 19.5919 11.9808 21 14 21L14.215 20.9947C16.2095 20.8953 17.842 19.4209 18.184 17.5H23.5V22.75C23.5 23.7165 22.7165 24.5 21.75 24.5H6.25C5.2835 24.5 4.5 23.7165 4.5 22.75Z",fill:"currentColor"}))});var r=n(12894),a=n(91945),s=n(81461),u=n(47580),d=n(26005),c=n(97961);let h=(0,d.cB)("empty",`
 display: flex;
 flex-direction: column;
 align-items: center;
 font-size: var(--n-font-size);
`,[(0,d.cE)("icon",`
 width: var(--n-icon-size);
 height: var(--n-icon-size);
 font-size: var(--n-icon-size);
 line-height: var(--n-icon-size);
 color: var(--n-icon-color);
 transition:
 color .3s var(--n-bezier);
 `,[(0,d.c)("+",[(0,d.cE)("description",`
 margin-top: 8px;
 `)])]),(0,d.cE)("description",`
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 `),(0,d.cE)("extra",`
 text-align: center;
 transition: color .3s var(--n-bezier);
 margin-top: 12px;
 color: var(--n-extra-text-color);
 `)]),p=Object.assign(Object.assign({},r.A.props),{description:String,showDescription:{type:Boolean,default:!0},showIcon:{type:Boolean,default:!0},size:{type:String,default:"medium"},renderIcon:Function}),v=(0,o.defineComponent)({name:"Empty",props:p,slots:Object,setup(e){let{mergedClsPrefixRef:t,inlineThemeDisabled:n,mergedComponentPropsRef:l}=(0,a.Ay)(e),p=(0,r.A)("Empty","-empty",h,c.A,e,t),{localeRef:v}=(0,s.A)("Empty"),f=(0,o.computed)(()=>{var t,n,o;return null!=(t=e.description)?t:null==(o=null==(n=null==l?void 0:l.value)?void 0:n.Empty)?void 0:o.description}),b=(0,o.computed)(()=>{var e,t;return(null==(t=null==(e=null==l?void 0:l.value)?void 0:e.Empty)?void 0:t.renderIcon)||(()=>(0,o.h)(i,null))}),g=(0,o.computed)(()=>{let{size:t}=e,{common:{cubicBezierEaseInOut:n},self:{[(0,d.cF)("iconSize",t)]:o,[(0,d.cF)("fontSize",t)]:l,textColor:i,iconColor:r,extraTextColor:a}}=p.value;return{"--n-icon-size":o,"--n-font-size":l,"--n-bezier":n,"--n-text-color":i,"--n-icon-color":r,"--n-extra-text-color":a}}),m=n?(0,u.R)("empty",(0,o.computed)(()=>{let t="",{size:n}=e;return t+n[0]}),g,e):void 0;return{mergedClsPrefix:t,mergedRenderIcon:b,localizedDescription:(0,o.computed)(()=>f.value||v.value.description),cssVars:n?void 0:g,themeClass:null==m?void 0:m.themeClass,onRender:null==m?void 0:m.onRender}},render(){let{$slots:e,mergedClsPrefix:t,onRender:n}=this;return null==n||n(),(0,o.h)("div",{class:[`${t}-empty`,this.themeClass],style:this.cssVars},this.showIcon?(0,o.h)("div",{class:`${t}-empty__icon`},e.icon?e.icon():(0,o.h)(l.A,{clsPrefix:t},{default:this.mergedRenderIcon})):null,this.showDescription?(0,o.h)("div",{class:`${t}-empty__description`},e.default?e.default():this.localizedDescription):null,e.extra?(0,o.h)("div",{class:`${t}-empty__extra`},e.extra()):null)}})},8167(e,t,n){n.d(t,{A:()=>V});var o=n(7814),l=n(24216),i=n(41691),r=n(43466),a=n(11307),s=n(1861),u=n(86224),d=n(18123),c=n(43015),h=n(50710),p=n(98e3),v=n(90368),f=n(2969),b=n(12894),g=n(91945),m=n(12469),w=n(47580),y=n(81021),x=n(81650),C=n(26005),F=n(20982);function z(e){switch(typeof e){case"string":return e||void 0;case"number":return String(e);default:return}}var O=n(24645),B=n(4303),M=n(48790),S=n(10196);let k=(0,C.c)([(0,C.cB)("base-selection",`
 --n-padding-single: var(--n-padding-single-top) var(--n-padding-single-right) var(--n-padding-single-bottom) var(--n-padding-single-left);
 --n-padding-multiple: var(--n-padding-multiple-top) var(--n-padding-multiple-right) var(--n-padding-multiple-bottom) var(--n-padding-multiple-left);
 position: relative;
 z-index: auto;
 box-shadow: none;
 width: 100%;
 max-width: 100%;
 display: inline-block;
 vertical-align: bottom;
 border-radius: var(--n-border-radius);
 min-height: var(--n-height);
 line-height: 1.5;
 font-size: var(--n-font-size);
 `,[(0,C.cB)("base-loading",`
 color: var(--n-loading-color);
 `),(0,C.cB)("base-selection-tags","min-height: var(--n-height);"),(0,C.cE)("border, state-border",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 pointer-events: none;
 border: var(--n-border);
 border-radius: inherit;
 transition:
 box-shadow .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `),(0,C.cE)("state-border",`
 z-index: 1;
 border-color: #0000;
 `),(0,C.cB)("base-suffix",`
 cursor: pointer;
 position: absolute;
 top: 50%;
 transform: translateY(-50%);
 right: 10px;
 `,[(0,C.cE)("arrow",`
 font-size: var(--n-arrow-size);
 color: var(--n-arrow-color);
 transition: color .3s var(--n-bezier);
 `)]),(0,C.cB)("base-selection-overlay",`
 display: flex;
 align-items: center;
 white-space: nowrap;
 pointer-events: none;
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;
 padding: var(--n-padding-single);
 transition: color .3s var(--n-bezier);
 `,[(0,C.cE)("wrapper",`
 flex-basis: 0;
 flex-grow: 1;
 overflow: hidden;
 text-overflow: ellipsis;
 `)]),(0,C.cB)("base-selection-placeholder",`
 color: var(--n-placeholder-color);
 `,[(0,C.cE)("inner",`
 max-width: 100%;
 overflow: hidden;
 `)]),(0,C.cB)("base-selection-tags",`
 cursor: pointer;
 outline: none;
 box-sizing: border-box;
 position: relative;
 z-index: auto;
 display: flex;
 padding: var(--n-padding-multiple);
 flex-wrap: wrap;
 align-items: center;
 width: 100%;
 vertical-align: bottom;
 background-color: var(--n-color);
 border-radius: inherit;
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `),(0,C.cB)("base-selection-label",`
 height: var(--n-height);
 display: inline-flex;
 width: 100%;
 vertical-align: bottom;
 cursor: pointer;
 outline: none;
 z-index: auto;
 box-sizing: border-box;
 position: relative;
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 border-radius: inherit;
 background-color: var(--n-color);
 align-items: center;
 `,[(0,C.cB)("base-selection-input",`
 font-size: inherit;
 line-height: inherit;
 outline: none;
 cursor: pointer;
 box-sizing: border-box;
 border:none;
 width: 100%;
 padding: var(--n-padding-single);
 background-color: #0000;
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 caret-color: var(--n-caret-color);
 `,[(0,C.cE)("content",`
 text-overflow: ellipsis;
 overflow: hidden;
 white-space: nowrap; 
 `)]),(0,C.cE)("render-label",`
 color: var(--n-text-color);
 `)]),(0,C.C5)("disabled",[(0,C.c)("&:hover",[(0,C.cE)("state-border",`
 box-shadow: var(--n-box-shadow-hover);
 border: var(--n-border-hover);
 `)]),(0,C.cM)("focus",[(0,C.cE)("state-border",`
 box-shadow: var(--n-box-shadow-focus);
 border: var(--n-border-focus);
 `)]),(0,C.cM)("active",[(0,C.cE)("state-border",`
 box-shadow: var(--n-box-shadow-active);
 border: var(--n-border-active);
 `),(0,C.cB)("base-selection-label","background-color: var(--n-color-active);"),(0,C.cB)("base-selection-tags","background-color: var(--n-color-active);")])]),(0,C.cM)("disabled","cursor: not-allowed;",[(0,C.cE)("arrow",`
 color: var(--n-arrow-color-disabled);
 `),(0,C.cB)("base-selection-label",`
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `,[(0,C.cB)("base-selection-input",`
 cursor: not-allowed;
 color: var(--n-text-color-disabled);
 `),(0,C.cE)("render-label",`
 color: var(--n-text-color-disabled);
 `)]),(0,C.cB)("base-selection-tags",`
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `),(0,C.cB)("base-selection-placeholder",`
 cursor: not-allowed;
 color: var(--n-placeholder-color-disabled);
 `)]),(0,C.cB)("base-selection-input-tag",`
 height: calc(var(--n-height) - 6px);
 line-height: calc(var(--n-height) - 6px);
 outline: none;
 display: none;
 position: relative;
 margin-bottom: 3px;
 max-width: 100%;
 vertical-align: bottom;
 `,[(0,C.cE)("input",`
 font-size: inherit;
 font-family: inherit;
 min-width: 1px;
 padding: 0;
 background-color: #0000;
 outline: none;
 border: none;
 max-width: 100%;
 overflow: hidden;
 width: 1em;
 line-height: inherit;
 cursor: pointer;
 color: var(--n-text-color);
 caret-color: var(--n-caret-color);
 `),(0,C.cE)("mirror",`
 position: absolute;
 left: 0;
 top: 0;
 white-space: pre;
 visibility: hidden;
 user-select: none;
 -webkit-user-select: none;
 opacity: 0;
 `)]),["warning","error"].map(e=>(0,C.cM)(`${e}-status`,[(0,C.cE)("state-border",`border: var(--n-border-${e});`),(0,C.C5)("disabled",[(0,C.c)("&:hover",[(0,C.cE)("state-border",`
 box-shadow: var(--n-box-shadow-hover-${e});
 border: var(--n-border-hover-${e});
 `)]),(0,C.cM)("active",[(0,C.cE)("state-border",`
 box-shadow: var(--n-box-shadow-active-${e});
 border: var(--n-border-active-${e});
 `),(0,C.cB)("base-selection-label",`background-color: var(--n-color-active-${e});`),(0,C.cB)("base-selection-tags",`background-color: var(--n-color-active-${e});`)]),(0,C.cM)("focus",[(0,C.cE)("state-border",`
 box-shadow: var(--n-box-shadow-focus-${e});
 border: var(--n-border-focus-${e});
 `)])])]))]),(0,C.cB)("base-selection-popover",`
 margin-bottom: -3px;
 display: flex;
 flex-wrap: wrap;
 margin-right: -8px;
 `),(0,C.cB)("base-selection-tag-wrapper",`
 max-width: 100%;
 display: inline-flex;
 padding: 0 7px 3px 0;
 `,[(0,C.c)("&:last-child","padding-right: 0;"),(0,C.cB)("tag",`
 font-size: 14px;
 max-width: 100%;
 `,[(0,C.cE)("content",`
 line-height: 1.25;
 text-overflow: ellipsis;
 overflow: hidden;
 `)])])]),T=(0,d.defineComponent)({name:"InternalSelection",props:Object.assign(Object.assign({},b.A.props),{clsPrefix:{type:String,required:!0},bordered:{type:Boolean,default:void 0},active:Boolean,pattern:{type:String,default:""},placeholder:String,selectedOption:{type:Object,default:null},selectedOptions:{type:Array,default:null},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},multiple:Boolean,filterable:Boolean,clearable:Boolean,disabled:Boolean,size:{type:String,default:"medium"},loading:Boolean,autofocus:Boolean,showArrow:{type:Boolean,default:!0},inputProps:Object,focused:Boolean,renderTag:Function,onKeydown:Function,onClick:Function,onBlur:Function,onFocus:Function,onDeleteOption:Function,maxTagCount:[String,Number],ellipsisTagPopoverProps:Object,onClear:Function,onPatternInput:Function,onPatternFocus:Function,onPatternBlur:Function,renderLabel:Function,status:String,inlineThemeDisabled:Boolean,ignoreComposition:{type:Boolean,default:!0},onResize:Function}),setup(e){let{mergedClsPrefixRef:t,mergedRtlRef:n}=(0,g.Ay)(e),o=(0,m.I)("InternalSelection",n,t),l=(0,d.ref)(null),i=(0,d.ref)(null),r=(0,d.ref)(null),a=(0,d.ref)(null),s=(0,d.ref)(null),u=(0,d.ref)(null),c=(0,d.ref)(null),h=(0,d.ref)(null),p=(0,d.ref)(null),f=(0,d.ref)(null),F=(0,d.ref)(!1),z=(0,d.ref)(!1),O=(0,d.ref)(!1),B=(0,b.A)("InternalSelection","-internal-selection",k,S.A,e,(0,d.toRef)(e,"clsPrefix")),M=(0,d.computed)(()=>e.clearable&&!e.disabled&&(O.value||e.active)),T=(0,d.computed)(()=>e.selectedOption?e.renderTag?e.renderTag({option:e.selectedOption,handleClose:()=>{}}):e.renderLabel?e.renderLabel(e.selectedOption,!0):(0,y.X)(e.selectedOption[e.labelField],e.selectedOption,!0):e.placeholder),A=(0,d.computed)(()=>{let t=e.selectedOption;if(t)return t[e.labelField]}),P=(0,d.computed)(()=>e.multiple?!!(Array.isArray(e.selectedOptions)&&e.selectedOptions.length):null!==e.selectedOption);function $(){var t;let{value:n}=l;if(n){let{value:o}=i;o&&(o.style.width=`${n.offsetWidth}px`,"responsive"!==e.maxTagCount&&(null==(t=p.value)||t.sync({showAllItemsBeforeCalculate:!1})))}}function R(t){let{onPatternInput:n}=e;n&&n(t)}function E(t){!function(t){let{onDeleteOption:n}=e;n&&n(t)}(t)}(0,d.watch)((0,d.toRef)(e,"active"),e=>{e||function(){let{value:e}=f;e&&(e.style.display="none")}()}),(0,d.watch)((0,d.toRef)(e,"pattern"),()=>{e.multiple&&(0,d.nextTick)($)});let I=(0,d.ref)(!1),_=null,L=null;function D(){null!==L&&window.clearTimeout(L)}(0,d.watch)(P,e=>{e||(F.value=!1)}),(0,d.onMounted)(()=>{(0,d.watchEffect)(()=>{let t=u.value;t&&(e.disabled?t.removeAttribute("tabindex"):t.tabIndex=z.value?-1:0)})}),(0,x.P)(r,e.onResize);let{inlineThemeDisabled:j}=e,N=(0,d.computed)(()=>{let{size:t}=e,{common:{cubicBezierEaseInOut:n},self:{fontWeight:o,borderRadius:l,color:i,placeholderColor:r,textColor:a,paddingSingle:s,paddingMultiple:u,caretColor:d,colorDisabled:c,textColorDisabled:h,placeholderColorDisabled:p,colorActive:f,boxShadowFocus:b,boxShadowActive:g,boxShadowHover:m,border:w,borderFocus:y,borderHover:x,borderActive:F,arrowColor:z,arrowColorDisabled:O,loadingColor:M,colorActiveWarning:S,boxShadowFocusWarning:k,boxShadowActiveWarning:T,boxShadowHoverWarning:A,borderWarning:P,borderFocusWarning:$,borderHoverWarning:R,borderActiveWarning:E,colorActiveError:I,boxShadowFocusError:_,boxShadowActiveError:L,boxShadowHoverError:D,borderError:j,borderFocusError:N,borderHoverError:V,borderActiveError:K,clearColor:H,clearColorHover:U,clearColorPressed:q,clearSize:W,arrowSize:X,[(0,C.cF)("height",t)]:G,[(0,C.cF)("fontSize",t)]:Z}}=B.value,Q=(0,v.Cq)(s),Y=(0,v.Cq)(u);return{"--n-bezier":n,"--n-border":w,"--n-border-active":F,"--n-border-focus":y,"--n-border-hover":x,"--n-border-radius":l,"--n-box-shadow-active":g,"--n-box-shadow-focus":b,"--n-box-shadow-hover":m,"--n-caret-color":d,"--n-color":i,"--n-color-active":f,"--n-color-disabled":c,"--n-font-size":Z,"--n-height":G,"--n-padding-single-top":Q.top,"--n-padding-multiple-top":Y.top,"--n-padding-single-right":Q.right,"--n-padding-multiple-right":Y.right,"--n-padding-single-left":Q.left,"--n-padding-multiple-left":Y.left,"--n-padding-single-bottom":Q.bottom,"--n-padding-multiple-bottom":Y.bottom,"--n-placeholder-color":r,"--n-placeholder-color-disabled":p,"--n-text-color":a,"--n-text-color-disabled":h,"--n-arrow-color":z,"--n-arrow-color-disabled":O,"--n-loading-color":M,"--n-color-active-warning":S,"--n-box-shadow-focus-warning":k,"--n-box-shadow-active-warning":T,"--n-box-shadow-hover-warning":A,"--n-border-warning":P,"--n-border-focus-warning":$,"--n-border-hover-warning":R,"--n-border-active-warning":E,"--n-color-active-error":I,"--n-box-shadow-focus-error":_,"--n-box-shadow-active-error":L,"--n-box-shadow-hover-error":D,"--n-border-error":j,"--n-border-focus-error":N,"--n-border-hover-error":V,"--n-border-active-error":K,"--n-clear-size":W,"--n-clear-color":H,"--n-clear-color-hover":U,"--n-clear-color-pressed":q,"--n-arrow-size":X,"--n-font-weight":o}}),V=j?(0,w.R)("internal-selection",(0,d.computed)(()=>e.size[0]),N,e):void 0;return{mergedTheme:B,mergedClearable:M,mergedClsPrefix:t,rtlEnabled:o,patternInputFocused:z,filterablePlaceholder:T,label:A,selected:P,showTagsPanel:F,isComposing:I,counterRef:c,counterWrapperRef:h,patternInputMirrorRef:l,patternInputRef:i,selfRef:r,multipleElRef:a,singleElRef:s,patternInputWrapperRef:u,overflowRef:p,inputTagElRef:f,handleMouseDown:function(t){e.active&&e.filterable&&t.target!==i.value&&t.preventDefault()},handleFocusin:function(t){var n;t.relatedTarget&&(null==(n=r.value)?void 0:n.contains(t.relatedTarget))||function(t){let{onFocus:n}=e;n&&n(t)}(t)},handleClear:function(t){!function(t){let{onClear:n}=e;n&&n(t)}(t)},handleMouseEnter:function(){O.value=!0},handleMouseLeave:function(){O.value=!1},handleDeleteOption:E,handlePatternKeyDown:function(t){if("Backspace"===t.key&&!I.value&&!e.pattern.length){let{selectedOptions:t}=e;(null==t?void 0:t.length)&&E(t[t.length-1])}},handlePatternInputInput:function(t){let{value:n}=l;n&&(n.textContent=t.target.value,$()),e.ignoreComposition&&I.value?_=t:R(t)},handlePatternInputBlur:function(t){var n;z.value=!1,null==(n=e.onPatternBlur)||n.call(e,t)},handlePatternInputFocus:function(t){var n;z.value=!0,null==(n=e.onPatternFocus)||n.call(e,t)},handleMouseEnterCounter:function(){e.active||(D(),L=window.setTimeout(()=>{P.value&&(F.value=!0)},100))},handleMouseLeaveCounter:function(){D()},handleFocusout:function(t){var n;null!=(n=r.value)&&n.contains(t.relatedTarget)||function(t){let{onBlur:n}=e;n&&n(t)}(t)},handleCompositionEnd:function(){I.value=!1,e.ignoreComposition&&R(_),_=null},handleCompositionStart:function(){I.value=!0},onPopoverUpdateShow:function(e){e||(D(),F.value=!1)},focus:function(){var t,n,o;e.filterable?(z.value=!1,null==(t=u.value)||t.focus()):e.multiple?null==(n=a.value)||n.focus():null==(o=s.value)||o.focus()},focusInput:function(){let{value:e}=i;e&&(!function(){let{value:e}=f;e&&(e.style.display="inline-block")}(),e.focus())},blur:function(){var t,n;if(e.filterable)z.value=!1,null==(t=u.value)||t.blur(),null==(n=i.value)||n.blur();else if(e.multiple){let{value:e}=a;null==e||e.blur()}else{let{value:e}=s;null==e||e.blur()}},blurInput:function(){let{value:e}=i;e&&e.blur()},updateCounter:function(e){let{value:t}=c;t&&t.setTextContent(`+${e}`)},getCounter:function(){let{value:e}=h;return e},getTail:function(){return i.value},renderLabel:e.renderLabel,cssVars:j?void 0:N,themeClass:null==V?void 0:V.themeClass,onRender:null==V?void 0:V.onRender}},render(){let e,{status:t,multiple:n,size:o,disabled:l,filterable:i,maxTagCount:r,bordered:a,clsPrefix:s,ellipsisTagPopoverProps:u,onRender:c,renderTag:h,renderLabel:p}=this;null==c||c();let v="responsive"===r,b="number"==typeof r,g=v||b,m=(0,d.h)(F.m,null,{default:()=>(0,d.h)(M.A,{clsPrefix:s,loading:this.loading,showArrow:this.showArrow,showClear:this.mergedClearable&&this.selected,onClear:this.handleClear},{default:()=>{var e,t;return null==(t=(e=this.$slots).arrow)?void 0:t.call(e)}})});if(n){let t,{labelField:n}=this,a=e=>(0,d.h)("div",{class:`${s}-base-selection-tag-wrapper`,key:e.value},h?h({option:e,handleClose:()=>{this.handleDeleteOption(e)}}):(0,d.h)(B.Ay,{size:o,closable:!e.disabled,disabled:l,onClose:()=>{this.handleDeleteOption(e)},internalCloseIsButtonTag:!1,internalCloseFocusable:!1},{default:()=>p?p(e,!0):(0,y.X)(e[n],e,!0)})),c=()=>(b?this.selectedOptions.slice(0,r):this.selectedOptions).map(a),w=i?(0,d.h)("div",{class:`${s}-base-selection-input-tag`,ref:"inputTagElRef",key:"__input-tag__"},(0,d.h)("input",Object.assign({},this.inputProps,{ref:"patternInputRef",tabindex:-1,disabled:l,value:this.pattern,autofocus:this.autofocus,class:`${s}-base-selection-input-tag__input`,onBlur:this.handlePatternInputBlur,onFocus:this.handlePatternInputFocus,onKeydown:this.handlePatternKeyDown,onInput:this.handlePatternInputInput,onCompositionstart:this.handleCompositionStart,onCompositionend:this.handleCompositionEnd})),(0,d.h)("span",{ref:"patternInputMirrorRef",class:`${s}-base-selection-input-tag__mirror`},this.pattern)):null,x=v?()=>(0,d.h)("div",{class:`${s}-base-selection-tag-wrapper`,ref:"counterWrapperRef"},(0,d.h)(B.Ay,{size:o,ref:"counterRef",onMouseenter:this.handleMouseEnterCounter,onMouseleave:this.handleMouseLeaveCounter,disabled:l})):void 0;if(b){let e=this.selectedOptions.length-r;e>0&&(t=(0,d.h)("div",{class:`${s}-base-selection-tag-wrapper`,key:"__counter__"},(0,d.h)(B.Ay,{size:o,ref:"counterRef",onMouseenter:this.handleMouseEnterCounter,disabled:l},{default:()=>`+${e}`})))}let C=v?i?(0,d.h)(f.A,{ref:"overflowRef",updateCounter:this.updateCounter,getCounter:this.getCounter,getTail:this.getTail,style:{width:"100%",display:"flex",overflow:"hidden"}},{default:c,counter:x,tail:()=>w}):(0,d.h)(f.A,{ref:"overflowRef",updateCounter:this.updateCounter,getCounter:this.getCounter,style:{width:"100%",display:"flex",overflow:"hidden"}},{default:c,counter:x}):b&&t?c().concat(t):c(),F=g?()=>(0,d.h)("div",{class:`${s}-base-selection-popover`},v?c():this.selectedOptions.map(a)):void 0,z=g?Object.assign({show:this.showTagsPanel,trigger:"hover",overlap:!0,placement:"top",width:"trigger",onUpdateShow:this.onPopoverUpdateShow,theme:this.mergedTheme.peers.Popover,themeOverrides:this.mergedTheme.peerOverrides.Popover},u):null,M=this.selected||this.active&&(this.pattern||this.isComposing)?null:(0,d.h)("div",{class:`${s}-base-selection-placeholder ${s}-base-selection-overlay`},(0,d.h)("div",{class:`${s}-base-selection-placeholder__inner`},this.placeholder)),S=i?(0,d.h)("div",{ref:"patternInputWrapperRef",class:`${s}-base-selection-tags`},C,v?null:w,m):(0,d.h)("div",{ref:"multipleElRef",class:`${s}-base-selection-tags`,tabindex:l?void 0:0},C,m);e=(0,d.h)(d.Fragment,null,g?(0,d.h)(O.Ay,Object.assign({},z,{scrollable:!0,style:"max-height: calc(var(--v-target-height) * 6.6);"}),{trigger:()=>S,default:F}):S,M)}else if(i){let t=this.pattern||this.isComposing,n=this.active?!t:!this.selected,o=!this.active&&this.selected;e=(0,d.h)("div",{ref:"patternInputWrapperRef",class:`${s}-base-selection-label`,title:this.patternInputFocused?void 0:z(this.label)},(0,d.h)("input",Object.assign({},this.inputProps,{ref:"patternInputRef",class:`${s}-base-selection-input`,value:this.active?this.pattern:"",placeholder:"",readonly:l,disabled:l,tabindex:-1,autofocus:this.autofocus,onFocus:this.handlePatternInputFocus,onBlur:this.handlePatternInputBlur,onInput:this.handlePatternInputInput,onCompositionstart:this.handleCompositionStart,onCompositionend:this.handleCompositionEnd})),o?(0,d.h)("div",{class:`${s}-base-selection-label__render-label ${s}-base-selection-overlay`,key:"input"},(0,d.h)("div",{class:`${s}-base-selection-overlay__wrapper`},h?h({option:this.selectedOption,handleClose:()=>{}}):p?p(this.selectedOption,!0):(0,y.X)(this.label,this.selectedOption,!0))):null,n?(0,d.h)("div",{class:`${s}-base-selection-placeholder ${s}-base-selection-overlay`,key:"placeholder"},(0,d.h)("div",{class:`${s}-base-selection-overlay__wrapper`},this.filterablePlaceholder)):null,m)}else e=(0,d.h)("div",{ref:"singleElRef",class:`${s}-base-selection-label`,tabindex:this.disabled?void 0:0},void 0!==this.label?(0,d.h)("div",{class:`${s}-base-selection-input`,title:z(this.label),key:"input"},(0,d.h)("div",{class:`${s}-base-selection-input__content`},h?h({option:this.selectedOption,handleClose:()=>{}}):p?p(this.selectedOption,!0):(0,y.X)(this.label,this.selectedOption,!0))):(0,d.h)("div",{class:`${s}-base-selection-placeholder ${s}-base-selection-overlay`,key:"placeholder"},(0,d.h)("div",{class:`${s}-base-selection-placeholder__inner`},this.placeholder)),m);return(0,d.h)("div",{ref:"selfRef",class:[`${s}-base-selection`,this.rtlEnabled&&`${s}-base-selection--rtl`,this.themeClass,t&&`${s}-base-selection--${t}-status`,{[`${s}-base-selection--active`]:this.active,[`${s}-base-selection--selected`]:this.selected||this.active&&this.pattern,[`${s}-base-selection--disabled`]:this.disabled,[`${s}-base-selection--multiple`]:this.multiple,[`${s}-base-selection--focus`]:this.focused}],style:this.cssVars,onClick:this.onClick,onMouseenter:this.handleMouseEnter,onMouseleave:this.handleMouseLeave,onKeydown:this.onKeydown,onFocusin:this.handleFocusin,onFocusout:this.handleFocusout,onMousedown:this.handleMouseDown},e,a?(0,d.h)("div",{class:`${s}-base-selection__border`}):null,a?(0,d.h)("div",{class:`${s}-base-selection__state-border`}):null)}});var A=n(49019),P=n(81461),$=n(71811),R=n(22250),E=n(75569),I=n(98283),_=n(86579),L=n(25472);let D=(0,C.c)([(0,C.cB)("select",`
 z-index: auto;
 outline: none;
 width: 100%;
 position: relative;
 font-weight: var(--n-font-weight);
 `),(0,C.cB)("select-menu",`
 margin: 4px 0;
 box-shadow: var(--n-menu-box-shadow);
 `,[(0,L.S)({originalTransition:"background-color .3s var(--n-bezier), box-shadow .3s var(--n-bezier)"})])]);var j=n(92808);let N=Object.assign(Object.assign({},b.A.props),{to:R.$.propTo,bordered:{type:Boolean,default:void 0},clearable:Boolean,clearFilterAfterSelect:{type:Boolean,default:!0},options:{type:Array,default:()=>[]},defaultValue:{type:[String,Number,Array],default:null},keyboard:{type:Boolean,default:!0},value:[String,Number,Array],placeholder:String,menuProps:Object,multiple:Boolean,size:String,menuSize:{type:String},filterable:Boolean,disabled:{type:Boolean,default:void 0},remote:Boolean,loading:Boolean,filter:Function,placement:{type:String,default:"bottom-start"},widthMode:{type:String,default:"trigger"},tag:Boolean,onCreate:Function,fallbackOption:{type:[Function,Boolean],default:void 0},show:{type:Boolean,default:void 0},showArrow:{type:Boolean,default:!0},maxTagCount:[Number,String],ellipsisTagPopoverProps:Object,consistentMenuWidth:{type:Boolean,default:!0},virtualScroll:{type:Boolean,default:!0},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},childrenField:{type:String,default:"children"},renderLabel:Function,renderOption:Function,renderTag:Function,"onUpdate:value":[Function,Array],inputProps:Object,nodeProps:Function,ignoreComposition:{type:Boolean,default:!0},showOnFocus:Boolean,onUpdateValue:[Function,Array],onBlur:[Function,Array],onClear:[Function,Array],onFocus:[Function,Array],onScroll:[Function,Array],onSearch:[Function,Array],onUpdateShow:[Function,Array],"onUpdate:show":[Function,Array],displayDirective:{type:String,default:"show"},resetMenuOnOptionsChange:{type:Boolean,default:!0},status:String,showCheckmark:{type:Boolean,default:!0},onChange:[Function,Array],items:Array}),V=(0,d.defineComponent)({name:"Select",props:N,slots:Object,setup(e){let{mergedClsPrefixRef:t,mergedBorderedRef:n,namespaceRef:r,inlineThemeDisabled:c}=(0,g.Ay)(e),h=(0,b.A)("Select","-select",D,_.A,e,t),p=(0,d.ref)(e.defaultValue),v=(0,d.toRef)(e,"value"),f=(0,a.A)(v,p),m=(0,d.ref)(!1),y=(0,d.ref)(""),x=(0,s.A)(e,["items","options"]),C=(0,d.ref)([]),F=(0,d.ref)([]),z=(0,d.computed)(()=>F.value.concat(C.value).concat(x.value)),O=(0,d.computed)(()=>{let{filter:t}=e;if(t)return t;let{labelField:n,valueField:o}=e;return(e,t)=>{if(!t)return!1;let l=t[n];if("string"==typeof l)return(0,j.lT)(e,l);let i=t[o];return"string"==typeof i?(0,j.lT)(e,i):"number"==typeof i&&(0,j.lT)(e,String(i))}}),B=(0,d.computed)(()=>{if(e.remote)return x.value;{let{value:t}=z,{value:n}=y;return n.length&&e.filterable?(0,j.f2)(t,O.value,n,e.childrenField):t}}),M=(0,d.computed)(()=>{let{valueField:t,childrenField:n}=e,o=(0,j.ag)(t,n);return(0,i.G)(B.value,o)}),S=(0,d.computed)(()=>(0,j.Tr)(z.value,e.valueField,e.childrenField)),k=(0,d.ref)(!1),T=(0,a.A)((0,d.toRef)(e,"show"),k),A=(0,d.ref)(null),L=(0,d.ref)(null),N=(0,d.ref)(null),{localeRef:V}=(0,P.A)("Select"),K=(0,d.computed)(()=>{var t;return null!=(t=e.placeholder)?t:V.value.placeholder}),H=[],U=(0,d.ref)(new Map),q=(0,d.computed)(()=>{let{fallbackOption:t}=e;if(void 0===t){let{labelField:t,valueField:n}=e;return e=>({[t]:String(e),[n]:e})}return!1!==t&&(e=>Object.assign(t(e),{value:e}))});function W(t){let n=e.remote,{value:o}=U,{value:l}=S,{value:i}=q,r=[];return t.forEach(e=>{if(l.has(e))r.push(l.get(e));else if(n&&o.has(e))r.push(o.get(e));else if(i){let t=i(e);t&&r.push(t)}}),r}let X=(0,d.computed)(()=>{if(e.multiple){let{value:e}=f;return Array.isArray(e)?W(e):[]}return null}),G=(0,d.computed)(()=>{let{value:t}=f;return e.multiple||Array.isArray(t)?null:null===t?null:W([t])[0]||null}),Z=(0,$.A)(e),{mergedSizeRef:Q,mergedDisabledRef:Y,mergedStatusRef:J}=Z;function ee(t,n){let{onChange:o,"onUpdate:value":l,onUpdateValue:i}=e,{nTriggerFormChange:r,nTriggerFormInput:a}=Z;o&&(0,E.T)(o,t,n),i&&(0,E.T)(i,t,n),l&&(0,E.T)(l,t,n),p.value=t,r(),a()}function et(t){let{onBlur:n}=e,{nTriggerFormBlur:o}=Z;n&&(0,E.T)(n,t),o()}function en(){var t;let{remote:n,multiple:o}=e;if(n){let{value:n}=U;if(o){let{valueField:o}=e;null==(t=X.value)||t.forEach(e=>{n.set(e[o],e)})}else{let t=G.value;t&&n.set(t[e.valueField],t)}}}function eo(t){let{onUpdateShow:n,"onUpdate:show":o}=e;n&&(0,E.T)(n,t),o&&(0,E.T)(o,t),k.value=t}function el(){!Y.value&&(eo(!0),k.value=!0,e.filterable&&ep())}function ei(){eo(!1)}function er(){y.value="",F.value=H}let ea=(0,d.ref)(!1);function es(e){eu(e.rawNode)}function eu(t){if(Y.value)return;let{tag:n,remote:o,clearFilterAfterSelect:l,valueField:i}=e;if(n&&!o){let{value:e}=F,t=e[0]||null;if(t){let e=C.value;e.length?e.push(t):C.value=[t],F.value=H}}if(o&&U.value.set(t[i],t),e.multiple){let r=function(t){if(!Array.isArray(t))return[];if(q.value)return Array.from(t);{let{remote:n}=e,{value:o}=S;if(!n)return t.filter(e=>o.has(e));{let{value:e}=U;return t.filter(t=>o.has(t)||e.has(t))}}}(f.value),a=r.findIndex(e=>e===t[i]);if(~a){if(r.splice(a,1),n&&!o){let e=ed(t[i]);~e&&(C.value.splice(e,1),l&&(y.value=""))}}else r.push(t[i]),l&&(y.value="");ee(r,W(r))}else{if(n&&!o){let e=ed(t[i]);~e?C.value=[C.value[e]]:C.value=H}eh(),ei(),ee(t[i],t)}}function ed(t){return C.value.findIndex(n=>n[e.valueField]===t)}function ec(t){var n,o,l,i,r;if(!e.keyboard)return void t.preventDefault();switch(t.key){case" ":if(e.filterable)break;t.preventDefault();case"Enter":if(!(null==(n=A.value)?void 0:n.isComposing)){if(T.value){let t=null==(o=N.value)?void 0:o.getPendingTmNode();t?es(t):e.filterable||(ei(),eh())}else if(el(),e.tag&&ea.value){let t=F.value[0];if(t){let n=t[e.valueField],{value:o}=f;e.multiple&&Array.isArray(o)&&o.includes(n)||eu(t)}}}t.preventDefault();break;case"ArrowUp":if(t.preventDefault(),e.loading)return;T.value&&(null==(l=N.value)||l.prev());break;case"ArrowDown":if(t.preventDefault(),e.loading)return;T.value?null==(i=N.value)||i.next():el();break;case"Escape":T.value&&((0,I.z)(t),ei()),null==(r=A.value)||r.focus()}}function eh(){var e;null==(e=A.value)||e.focus()}function ep(){var e;null==(e=A.value)||e.focusInput()}en(),(0,d.watch)((0,d.toRef)(e,"options"),en);let ev=(0,d.computed)(()=>{let{self:{menuBoxShadow:e}}=h.value;return{"--n-menu-box-shadow":e}}),ef=c?(0,w.R)("select",void 0,ev,e):void 0;return Object.assign(Object.assign({},{focus:()=>{var e;null==(e=A.value)||e.focus()},focusInput:()=>{var e;null==(e=A.value)||e.focusInput()},blur:()=>{var e;null==(e=A.value)||e.blur()},blurInput:()=>{var e;null==(e=A.value)||e.blurInput()}}),{mergedStatus:J,mergedClsPrefix:t,mergedBordered:n,namespace:r,treeMate:M,isMounted:(0,u.A)(),triggerRef:A,menuRef:N,pattern:y,uncontrolledShow:k,mergedShow:T,adjustedTo:(0,R.$)(e),uncontrolledValue:p,mergedValue:f,followerRef:L,localizedPlaceholder:K,selectedOption:G,selectedOptions:X,mergedSize:Q,mergedDisabled:Y,focused:m,activeWithoutMenuOpen:ea,inlineThemeDisabled:c,onTriggerInputFocus:function(){e.filterable&&(ea.value=!0)},onTriggerInputBlur:function(){e.filterable&&(ea.value=!1,T.value||er())},handleTriggerOrMenuResize:function(){var e;T.value&&(null==(e=L.value)||e.syncPosition())},handleMenuFocus:function(){m.value=!0},handleMenuBlur:function(e){var t;null!=(t=A.value)&&t.$el.contains(e.relatedTarget)||(m.value=!1,et(e),ei())},handleMenuTabOut:function(){var e;null==(e=A.value)||e.focus(),ei()},handleTriggerClick:function(){Y.value||(T.value?e.filterable?ep():ei():el())},handleToggle:es,handleDeleteOption:eu,handlePatternInput:function(t){T.value||el();let{value:n}=t.target;y.value=n;let{tag:o,remote:l}=e;if(!function(t){let{onSearch:n}=e;n&&(0,E.T)(n,t)}(n),o&&!l){if(!n){F.value=H;return}let{onCreate:t}=e,o=t?t(n):{[e.labelField]:n,[e.valueField]:n},{valueField:l,labelField:i}=e;x.value.some(e=>e[l]===o[l]||e[i]===o[i])||C.value.some(e=>e[l]===o[l]||e[i]===o[i])?F.value=H:F.value=[o]}},handleClear:function(t){t.stopPropagation();let{multiple:n}=e;!n&&e.filterable&&ei(),function(){let{onClear:t}=e;t&&(0,E.T)(t)}(),n?ee([],[]):ee(null,null)},handleTriggerBlur:function(e){var t,n;null!=(n=null==(t=N.value)?void 0:t.selfRef)&&n.contains(e.relatedTarget)||(m.value=!1,et(e),ei())},handleTriggerFocus:function(t){!function(t){let{onFocus:n,showOnFocus:o}=e,{nTriggerFormFocus:l}=Z;n&&(0,E.T)(n,t),l(),o&&el()}(t),m.value=!0},handleKeydown:ec,handleMenuAfterLeave:er,handleMenuClickOutside:function(e){var t;!T.value||(null==(t=A.value)?void 0:t.$el.contains((0,o.b)(e)))||ei()},handleMenuScroll:function(t){!function(t){let{onScroll:n}=e;n&&(0,E.T)(n,t)}(t)},handleMenuKeydown:ec,handleMenuMousedown:function(e){(0,l.d)(e,"action")||(0,l.d)(e,"empty")||(0,l.d)(e,"header")||e.preventDefault()},mergedTheme:h,cssVars:c?void 0:ev,themeClass:null==ef?void 0:ef.themeClass,onRender:null==ef?void 0:ef.onRender})},render(){return(0,d.h)("div",{class:`${this.mergedClsPrefix}-select`},(0,d.h)(c.A,null,{default:()=>[(0,d.h)(h.A,null,{default:()=>(0,d.h)(T,{ref:"triggerRef",inlineThemeDisabled:this.inlineThemeDisabled,status:this.mergedStatus,inputProps:this.inputProps,clsPrefix:this.mergedClsPrefix,showArrow:this.showArrow,maxTagCount:this.maxTagCount,ellipsisTagPopoverProps:this.ellipsisTagPopoverProps,bordered:this.mergedBordered,active:this.activeWithoutMenuOpen||this.mergedShow,pattern:this.pattern,placeholder:this.localizedPlaceholder,selectedOption:this.selectedOption,selectedOptions:this.selectedOptions,multiple:this.multiple,renderTag:this.renderTag,renderLabel:this.renderLabel,filterable:this.filterable,clearable:this.clearable,disabled:this.mergedDisabled,size:this.mergedSize,theme:this.mergedTheme.peers.InternalSelection,labelField:this.labelField,valueField:this.valueField,themeOverrides:this.mergedTheme.peerOverrides.InternalSelection,loading:this.loading,focused:this.focused,onClick:this.handleTriggerClick,onDeleteOption:this.handleDeleteOption,onPatternInput:this.handlePatternInput,onClear:this.handleClear,onBlur:this.handleTriggerBlur,onFocus:this.handleTriggerFocus,onKeydown:this.handleKeydown,onPatternBlur:this.onTriggerInputBlur,onPatternFocus:this.onTriggerInputFocus,onResize:this.handleTriggerOrMenuResize,ignoreComposition:this.ignoreComposition},{arrow:()=>{var e,t;return[null==(t=(e=this.$slots).arrow)?void 0:t.call(e)]}})}),(0,d.h)(p.A,{ref:"followerRef",show:this.mergedShow,to:this.adjustedTo,teleportDisabled:this.adjustedTo===R.$.tdkey,containerClass:this.namespace,width:this.consistentMenuWidth?"target":void 0,minWidth:"target",placement:this.placement},{default:()=>(0,d.h)(d.Transition,{name:"fade-in-scale-up-transition",appear:this.isMounted,onAfterLeave:this.handleMenuAfterLeave},{default:()=>{var e,t,n;return this.mergedShow||"show"===this.displayDirective?(null==(e=this.onRender)||e.call(this),(0,d.withDirectives)((0,d.h)(A.A,Object.assign({},this.menuProps,{ref:"menuRef",onResize:this.handleTriggerOrMenuResize,inlineThemeDisabled:this.inlineThemeDisabled,virtualScroll:this.consistentMenuWidth&&this.virtualScroll,class:[`${this.mergedClsPrefix}-select-menu`,this.themeClass,null==(t=this.menuProps)?void 0:t.class],clsPrefix:this.mergedClsPrefix,focusable:!0,labelField:this.labelField,valueField:this.valueField,autoPending:!0,nodeProps:this.nodeProps,theme:this.mergedTheme.peers.InternalSelectMenu,themeOverrides:this.mergedTheme.peerOverrides.InternalSelectMenu,treeMate:this.treeMate,multiple:this.multiple,size:this.menuSize,renderOption:this.renderOption,renderLabel:this.renderLabel,value:this.mergedValue,style:[null==(n=this.menuProps)?void 0:n.style,this.cssVars],onToggle:this.handleToggle,onScroll:this.handleMenuScroll,onFocus:this.handleMenuFocus,onBlur:this.handleMenuBlur,onKeydown:this.handleMenuKeydown,onTabOut:this.handleMenuTabOut,onMousedown:this.handleMenuMousedown,show:this.mergedShow,showCheckmark:this.showCheckmark,resetMenuOnOptionsChange:this.resetMenuOnOptionsChange}),{empty:()=>{var e,t;return[null==(t=(e=this.$slots).empty)?void 0:t.call(e)]},header:()=>{var e,t;return[null==(t=(e=this.$slots).header)?void 0:t.call(e)]},action:()=>{var e,t;return[null==(t=(e=this.$slots).action)?void 0:t.call(e)]}}),"show"===this.displayDirective?[[d.vShow,this.mergedShow],[r.A,this.handleMenuClickOutside,void 0,{capture:!0}]]:[[r.A,this.handleMenuClickOutside,void 0,{capture:!0}]])):null}})})]}))}})},92808(e,t,n){function o(e){return"group"===e.type}function l(e){return"ignored"===e.type}function i(e,t){try{return!!(1+t.toString().toLowerCase().indexOf(e.trim().toLowerCase()))}catch(e){return!1}}function r(e,t){return{getIsGroup:o,getIgnored:l,getKey:t=>o(t)?t.name||t.key||"key-required":t[e],getChildren:e=>e[t]}}function a(e,t,n,i){return t?function e(r){if(!Array.isArray(r))return[];let a=[];for(let s of r)if(o(s)){let t=e(s[i]);t.length&&a.push(Object.assign({},s,{[i]:t}))}else{if(l(s))continue;t(n,s)&&a.push(s)}return a}(e):e}function s(e,t,n){let l=new Map;return e.forEach(e=>{o(e)?e[n].forEach(e=>{l.set(e[t],e)}):l.set(e[t],e)}),l}n.d(t,{Tr:()=>s,ag:()=>r,f2:()=>a,lT:()=>i})}}]);