"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([["3358"],{55021(e,t,r){r.d(t,{A:()=>K});var o=r(58148),l=r(54071),a=r(7814),i=r(43466),n=r(11307),s=r(86224),u=r(18123),d=r(43015),c=r(50710),p=r(98e3),h=r(12894),b=r(71811),v=r(81461),f=r(91945),g=r(47580),m=r(22250),x=r(75569),k=r(26005),w=r(48209),y=r(62603),C=r(80283);function A(e){return null===e?null:/^ *#/.test(e)?"hex":e.includes("rgb")?"rgb":e.includes("hsl")?"hsl":e.includes("hsv")?"hsv":null}function $(e){let[t,r,o]=e.map(e=>(e/=255)<=.03928?e/12.92:Math.pow((e+.055)/1.055,2.4));return .2126*t+.7152*r+.0722*o}let B={rgb:{hex:e=>(0,o.Lj)((0,o.B3)(e)),hsl(e){let[t,r,a,i]=(0,o.B3)(e);return(0,o.pf)([...(0,l.bV)(t,r,a),i])},hsv(e){let[t,r,a,i]=(0,o.B3)(e);return(0,o.H7)([...(0,l.bi)(t,r,a),i])}},hex:{rgb:e=>(0,o.hh)((0,o.B3)(e)),hsl(e){let[t,r,a,i]=(0,o.B3)(e);return(0,o.pf)([...(0,l.bV)(t,r,a),i])},hsv(e){let[t,r,a,i]=(0,o.B3)(e);return(0,o.H7)([...(0,l.bi)(t,r,a),i])}},hsl:{hex(e){let[t,r,a,i]=(0,o.V$)(e);return(0,o.Lj)([...(0,l.de)(t,r,a),i])},rgb(e){let[t,r,a,i]=(0,o.V$)(e);return(0,o.hh)([...(0,l.de)(t,r,a),i])},hsv(e){let[t,r,a,i]=(0,o.V$)(e);return(0,o.H7)([...(0,l.Nf)(t,r,a),i])}},hsv:{hex(e){let[t,r,a,i]=(0,o.jf)(e);return(0,o.Lj)([...(0,l.hT)(t,r,a),i])},rgb(e){let[t,r,a,i]=(0,o.jf)(e);return(0,o.hh)([...(0,l.hT)(t,r,a),i])},hsl(e){let[t,r,a,i]=(0,o.jf)(e);return(0,o.pf)([...(0,l.nE)(t,r,a),i])}}};function U(e,t,r){return(r=r||A(e))?r===t?e:B[r][t](e):null}let S="12px",V=(0,u.defineComponent)({name:"AlphaSlider",props:{clsPrefix:{type:String,required:!0},rgba:{type:Array,default:null},alpha:{type:Number,default:0},onUpdateAlpha:{type:Function,required:!0},onComplete:Function},setup(e){let t=(0,u.ref)(null);function r(r){var o;let{value:l}=t;if(!l)return;let{width:a,left:i}=l.getBoundingClientRect(),n=(r.clientX-i)/(a-12);e.onUpdateAlpha((o=Math.round(100*(o=n))/100)>1?1:o<0?0:o)}function o(){var t;(0,C.A)("mousemove",document,r),(0,C.A)("mouseup",document,o),null==(t=e.onComplete)||t.call(e)}return{railRef:t,railBackgroundImage:(0,u.computed)(()=>{let{rgba:t}=e;return t?`linear-gradient(to right, rgba(${t[0]}, ${t[1]}, ${t[2]}, 0) 0%, rgba(${t[0]}, ${t[1]}, ${t[2]}, 1) 100%)`:""}),handleMouseDown:function(l){t.value&&e.rgba&&((0,C.on)("mousemove",document,r),(0,C.on)("mouseup",document,o),r(l))}}},render(){let{clsPrefix:e}=this;return(0,u.h)("div",{class:`${e}-color-picker-slider`,ref:"railRef",style:{height:S,borderRadius:"6px"},onMousedown:this.handleMouseDown},(0,u.h)("div",{style:{borderRadius:"6px",position:"absolute",left:0,right:0,top:0,bottom:0,overflow:"hidden"}},(0,u.h)("div",{class:`${e}-color-picker-checkboard`}),(0,u.h)("div",{class:`${e}-color-picker-slider__image`,style:{backgroundImage:this.railBackgroundImage}})),this.rgba&&(0,u.h)("div",{style:{position:"absolute",left:"6px",right:"6px",top:0,bottom:0}},(0,u.h)("div",{class:`${e}-color-picker-handle`,style:{left:`calc(${100*this.alpha}% - 6px)`,borderRadius:"6px",width:S,height:S}},(0,u.h)("div",{class:`${e}-color-picker-handle__fill`,style:{backgroundColor:(0,o.hh)(this.rgba),borderRadius:"6px",width:S,height:S}}))))}});var D=r(2579),z=r(25719);let M=(0,r(98667).D)("n-color-picker"),_={paddingSmall:"0 4px"},P=(0,u.defineComponent)({name:"ColorInputUnit",props:{label:{type:String,required:!0},value:{type:[Number,String],default:null},showAlpha:Boolean,onUpdateValue:{type:Function,required:!0}},setup(e){let t=(0,u.ref)(""),{themeRef:r}=(0,u.inject)(M,null);function o(){let{value:t}=e;if(null===t)return"";let{label:r}=e;return"HEX"===r?t:"A"===r?`${Math.floor(100*t)}%`:String(Math.floor(t))}return(0,u.watchEffect)(()=>{t.value=o()}),{mergedTheme:r,inputValue:t,handleInputChange:function(r){let l;switch(e.label){case"HEX":let a;a=r.trim(),/^#[0-9a-fA-F]+$/.test(a)&&[4,5,7,9].includes(a.length)&&e.onUpdateValue(r),t.value=o();break;case"H":!1===(l=!!/^\d{1,3}\.?\d*$/.test(r.trim())&&Math.max(0,Math.min(Number.parseInt(r),360)))?t.value=o():e.onUpdateValue(l);break;case"S":case"L":case"V":!1===(l=!!/^\d{1,3}\.?\d*$/.test(r.trim())&&Math.max(0,Math.min(Number.parseInt(r),100)))?t.value=o():e.onUpdateValue(l);break;case"A":!1===(l=!!/^\d{1,3}\.?\d*%$/.test(r.trim())&&Math.max(0,Math.min(Number.parseInt(r)/100,100)))?t.value=o():e.onUpdateValue(l);break;case"R":case"G":case"B":!1===(l=!!/^\d{1,3}\.?\d*$/.test(r.trim())&&Math.max(0,Math.min(Number.parseInt(r),255)))?t.value=o():e.onUpdateValue(l)}},handleInputUpdateValue:function(e){t.value=e}}},render(){let{mergedTheme:e}=this;return(0,u.h)(z.A,{size:"small",placeholder:this.label,theme:e.peers.Input,themeOverrides:e.peerOverrides.Input,builtinThemeOverrides:_,value:this.inputValue,onUpdateValue:this.handleInputUpdateValue,onChange:this.handleInputChange,style:"A"===this.label?"flex-grow: 1.25;":""})}}),R=(0,u.defineComponent)({name:"ColorInput",props:{clsPrefix:{type:String,required:!0},mode:{type:String,required:!0},modes:{type:Array,required:!0},showAlpha:{type:Boolean,required:!0},value:{type:String,default:null},valueArr:{type:Array,default:null},onUpdateValue:{type:Function,required:!0},onUpdateMode:{type:Function,required:!0}},setup:e=>({handleUnitUpdateValue(t,r){let l,{showAlpha:a}=e;if("hex"===e.mode)return void e.onUpdateValue((a?o.Lj:o.U5)(r));switch(l=null===e.valueArr?[0,0,0,0]:Array.from(e.valueArr),e.mode){case"hsv":l[t]=r,e.onUpdateValue((a?o.H7:o.Ci)(l));break;case"rgb":l[t]=r,e.onUpdateValue((a?o.hh:o._l)(l));break;case"hsl":l[t]=r,e.onUpdateValue((a?o.pf:o.W3)(l))}}}),render(){let{clsPrefix:e,modes:t}=this;return(0,u.h)("div",{class:`${e}-color-picker-input`},(0,u.h)("div",{class:`${e}-color-picker-input__mode`,onClick:this.onUpdateMode,style:{cursor:1===t.length?"":"pointer"}},this.mode.toUpperCase()+(this.showAlpha?"A":"")),(0,u.h)(D.A,null,{default:()=>{let{mode:e,valueArr:t,showAlpha:r}=this;if("hex"===e){let e=null;try{e=null===t?null:(r?o.Lj:o.U5)(t)}catch(e){}return(0,u.h)(P,{label:"HEX",showAlpha:r,value:e,onUpdateValue:e=>{this.handleUnitUpdateValue(0,e)}})}return(e+(r?"a":"")).split("").map((e,r)=>(0,u.h)(P,{label:e.toUpperCase(),value:null===t?null:t[r],onUpdateValue:e=>{this.handleUnitUpdateValue(r,e)}}))}}))}});var E=r(83032);let j=(0,u.defineComponent)({name:"ColorPickerSwatches",props:{clsPrefix:{type:String,required:!0},mode:{type:String,required:!0},swatches:{type:Array,required:!0},onUpdateColor:{type:Function,required:!0}},setup(e){function t(t){e.onUpdateColor(function(t){let{mode:r}=e,{value:o,mode:l}=t;if(!l)if(l="hex",/^[a-zA-Z]+$/.test(o)){var a;let e;a=o,o=(e=document.createElement("canvas").getContext("2d"))?(e.fillStyle=a,e.fillStyle):"#000000"}else(0,E.R8)("color-picker",`color ${o} in swatches is invalid.`),o="#000000";return l===r?o:U(o,r,l)}(t))}return{parsedSwatchesRef:(0,u.computed)(()=>e.swatches.map(e=>{let t=A(e);return{value:e,mode:t,legalValue:function(e,t){if("hsv"===t){let[t,r,a,i]=(0,o.jf)(e);return(0,o.hh)([...(0,l.hT)(t,r,a),i])}return e}(e,t)}})),handleSwatchSelect:t,handleSwatchKeyDown:function(e,r){"Enter"===e.key&&t(r)}}},render(){let{clsPrefix:e}=this;return(0,u.h)("div",{class:`${e}-color-picker-swatches`},this.parsedSwatchesRef.map(t=>(0,u.h)("div",{class:`${e}-color-picker-swatch`,tabindex:0,onClick:()=>{this.handleSwatchSelect(t)},onKeydown:e=>{this.handleSwatchKeyDown(e,t)}},(0,u.h)("div",{class:`${e}-color-picker-swatch__fill`,style:{background:t.legalValue}}))))}}),q=(0,u.defineComponent)({name:"ColorPickerTrigger",slots:Object,props:{clsPrefix:{type:String,required:!0},value:{type:String,default:null},hsla:{type:Array,default:null},disabled:Boolean,onClick:Function},setup(e){let{colorPickerSlots:t,renderLabelRef:r}=(0,u.inject)(M,null);return()=>{let{hsla:l,value:a,clsPrefix:i,onClick:n,disabled:s}=e,d=t.label||r.value;return(0,u.h)("div",{class:[`${i}-color-picker-trigger`,s&&`${i}-color-picker-trigger--disabled`],onClick:s?void 0:n},(0,u.h)("div",{class:`${i}-color-picker-trigger__fill`},(0,u.h)("div",{class:`${i}-color-picker-checkboard`}),(0,u.h)("div",{style:{position:"absolute",left:0,right:0,top:0,bottom:0,backgroundColor:l?(0,o.pf)(l):""}}),a&&l?(0,u.h)("div",{class:`${i}-color-picker-trigger__value`,style:{color:!function(e,t=[255,255,255],r="AA"){let[l,a,i,n]=(0,o.B3)((0,o.pf)(e));if(1===n){let e=$([l,a,i]),o=$(t);return(Math.max(e,o)+.05)/(Math.min(e,o)+.05)>=("AA"===r?4.5:7)}let s=$([Math.round(l*n+t[0]*(1-n)),Math.round(a*n+t[1]*(1-n)),Math.round(i*n+t[2]*(1-n))]),u=$(t);return(Math.max(s,u)+.05)/(Math.min(s,u)+.05)>=("AA"===r?4.5:7)}(l)?"black":"white"}},d?d(a):a):null))}}}),F=(0,u.defineComponent)({name:"ColorPreview",props:{clsPrefix:{type:String,required:!0},mode:{type:String,required:!0},color:{type:String,default:null,validator:e=>{let t=A(e);return!!(!e||t&&"hsv"!==t)}},onUpdateColor:{type:Function,required:!0}},setup:e=>({handleChange:function(t){var r;let o=t.target.value;null==(r=e.onUpdateColor)||r.call(e,U(o.toUpperCase(),e.mode,"hex")),t.stopPropagation()}}),render(){let{clsPrefix:e}=this;return(0,u.h)("div",{class:`${e}-color-picker-preview__preview`},(0,u.h)("span",{class:`${e}-color-picker-preview__fill`,style:{background:this.color||"#000000"}}),(0,u.h)("input",{class:`${e}-color-picker-preview__input`,type:"color",value:this.color,onChange:this.handleChange}))}}),T="12px",I=(0,u.defineComponent)({name:"HueSlider",props:{clsPrefix:{type:String,required:!0},hue:{type:Number,required:!0},onUpdateHue:{type:Function,required:!0},onComplete:Function},setup(e){let t=(0,u.ref)(null);function r(r){var o;let{value:l}=t;if(!l)return;let{width:a,left:i}=l.getBoundingClientRect(),n=(o=Math.round(o=(r.clientX-i-6)/(a-12)*360))>=360?359:o<0?0:o;e.onUpdateHue(n)}function o(){var t;(0,C.A)("mousemove",document,r),(0,C.A)("mouseup",document,o),null==(t=e.onComplete)||t.call(e)}return{railRef:t,handleMouseDown:function(e){t.value&&((0,C.on)("mousemove",document,r),(0,C.on)("mouseup",document,o),r(e))}}},render(){let{clsPrefix:e}=this;return(0,u.h)("div",{class:`${e}-color-picker-slider`,style:{height:T,borderRadius:"6px"}},(0,u.h)("div",{ref:"railRef",style:{boxShadow:"inset 0 0 2px 0 rgba(0, 0, 0, .24)",boxSizing:"border-box",backgroundImage:"linear-gradient(90deg,red,#ff0 16.66%,#0f0 33.33%,#0ff 50%,#00f 66.66%,#f0f 83.33%,red)",height:T,borderRadius:"6px",position:"relative"},onMousedown:this.handleMouseDown},(0,u.h)("div",{style:{position:"absolute",left:"6px",right:"6px",top:0,bottom:0}},(0,u.h)("div",{class:`${e}-color-picker-handle`,style:{left:`calc((${this.hue}%) / 359 * 100 - 6px)`,borderRadius:"6px",width:T,height:T}},(0,u.h)("div",{class:`${e}-color-picker-handle__fill`,style:{backgroundColor:`hsl(${this.hue}, 100%, 50%)`,borderRadius:"6px",width:T,height:T}})))))}}),H="12px",O=(0,u.defineComponent)({name:"Pallete",props:{clsPrefix:{type:String,required:!0},rgba:{type:Array,default:null},displayedHue:{type:Number,required:!0},displayedSv:{type:Array,required:!0},onUpdateSV:{type:Function,required:!0},onComplete:Function},setup(e){let t=(0,u.ref)(null);function r(r){let{value:o}=t;if(!o)return;let{width:l,height:a,left:i,bottom:n}=o.getBoundingClientRect(),s=(n-r.clientY)/a,u=(r.clientX-i)/l;e.onUpdateSV(100*(u>1?1:u<0?0:u),100*(s>1?1:s<0?0:s))}function o(){var t;(0,C.A)("mousemove",document,r),(0,C.A)("mouseup",document,o),null==(t=e.onComplete)||t.call(e)}return{palleteRef:t,handleColor:(0,u.computed)(()=>{let{rgba:t}=e;return t?`rgb(${t[0]}, ${t[1]}, ${t[2]})`:""}),handleMouseDown:function(e){t.value&&((0,C.on)("mousemove",document,r),(0,C.on)("mouseup",document,o),r(e))}}},render(){let{clsPrefix:e}=this;return(0,u.h)("div",{class:`${e}-color-picker-pallete`,onMousedown:this.handleMouseDown,ref:"palleteRef"},(0,u.h)("div",{class:`${e}-color-picker-pallete__layer`,style:{backgroundImage:`linear-gradient(90deg, white, hsl(${this.displayedHue}, 100%, 50%))`}}),(0,u.h)("div",{class:`${e}-color-picker-pallete__layer ${e}-color-picker-pallete__layer--shadowed`,style:{backgroundImage:"linear-gradient(180deg, rgba(0, 0, 0, 0%), rgba(0, 0, 0, 100%))"}}),this.rgba&&(0,u.h)("div",{class:`${e}-color-picker-handle`,style:{width:H,height:H,borderRadius:"6px",left:`calc(${this.displayedSv[0]}% - 6px)`,bottom:`calc(${this.displayedSv[1]}% - 6px)`}},(0,u.h)("div",{class:`${e}-color-picker-handle__fill`,style:{backgroundColor:this.handleColor,borderRadius:"6px",width:H,height:H}})))}});var L=r(25472);let N=(0,k.c)([(0,k.cB)("color-picker",`
 display: inline-block;
 box-sizing: border-box;
 height: var(--n-height);
 font-size: var(--n-font-size);
 width: 100%;
 position: relative;
 `),(0,k.cB)("color-picker-panel",`
 margin: 4px 0;
 width: 240px;
 font-size: var(--n-panel-font-size);
 color: var(--n-text-color);
 background-color: var(--n-color);
 transition:
 box-shadow .3s var(--n-bezier),
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 border-radius: var(--n-border-radius);
 box-shadow: var(--n-box-shadow);
 `,[(0,L.S)(),(0,k.cB)("input",`
 text-align: center;
 `)]),(0,k.cB)("color-picker-checkboard",`
 background: white; 
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `,[(0,k.c)("&::after",`
 background-image: linear-gradient(45deg, #DDD 25%, #0000 25%), linear-gradient(-45deg, #DDD 25%, #0000 25%), linear-gradient(45deg, #0000 75%, #DDD 75%), linear-gradient(-45deg, #0000 75%, #DDD 75%);
 background-size: 12px 12px;
 background-position: 0 0, 0 6px, 6px -6px, -6px 0px;
 background-repeat: repeat;
 content: "";
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `)]),(0,k.cB)("color-picker-slider",`
 margin-bottom: 8px;
 position: relative;
 box-sizing: border-box;
 `,[(0,k.cE)("image",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `),(0,k.c)("&::after",`
 content: "";
 position: absolute;
 border-radius: inherit;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 box-shadow: inset 0 0 2px 0 rgba(0, 0, 0, .24);
 pointer-events: none;
 `)]),(0,k.cB)("color-picker-handle",`
 z-index: 1;
 box-shadow: 0 0 2px 0 rgba(0, 0, 0, .45);
 position: absolute;
 background-color: white;
 overflow: hidden;
 `,[(0,k.cE)("fill",`
 box-sizing: border-box;
 border: 2px solid white;
 `)]),(0,k.cB)("color-picker-pallete",`
 height: 180px;
 position: relative;
 margin-bottom: 8px;
 cursor: crosshair;
 `,[(0,k.cE)("layer",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `,[(0,k.cM)("shadowed",`
 box-shadow: inset 0 0 2px 0 rgba(0, 0, 0, .24);
 `)])]),(0,k.cB)("color-picker-preview",`
 display: flex;
 `,[(0,k.cE)("sliders",`
 flex: 1 0 auto;
 `),(0,k.cE)("preview",`
 position: relative;
 height: 30px;
 width: 30px;
 margin: 0 0 8px 6px;
 border-radius: 50%;
 box-shadow: rgba(0, 0, 0, .15) 0px 0px 0px 1px inset;
 overflow: hidden;
 `),(0,k.cE)("fill",`
 display: block;
 width: 30px;
 height: 30px;
 `),(0,k.cE)("input",`
 position: absolute;
 top: 0;
 left: 0;
 width: 30px;
 height: 30px;
 opacity: 0;
 z-index: 1;
 `)]),(0,k.cB)("color-picker-input",`
 display: flex;
 align-items: center;
 `,[(0,k.cB)("input",`
 flex-grow: 1;
 flex-basis: 0;
 `),(0,k.cE)("mode",`
 width: 72px;
 text-align: center;
 `)]),(0,k.cB)("color-picker-control",`
 padding: 12px;
 `),(0,k.cB)("color-picker-action",`
 display: flex;
 margin-top: -4px;
 border-top: 1px solid var(--n-divider-color);
 padding: 8px 12px;
 justify-content: flex-end;
 `,[(0,k.cB)("button","margin-left: 8px;")]),(0,k.cB)("color-picker-trigger",`
 border: var(--n-border);
 height: 100%;
 box-sizing: border-box;
 border-radius: var(--n-border-radius);
 transition: border-color .3s var(--n-bezier);
 cursor: pointer;
 `,[(0,k.cE)("value",`
 white-space: nowrap;
 position: relative;
 `),(0,k.cE)("fill",`
 border-radius: var(--n-border-radius);
 position: absolute;
 display: flex;
 align-items: center;
 justify-content: center;
 left: 4px;
 right: 4px;
 top: 4px;
 bottom: 4px;
 `),(0,k.cM)("disabled","cursor: not-allowed"),(0,k.cB)("color-picker-checkboard",`
 border-radius: var(--n-border-radius);
 `,[(0,k.c)("&::after",`
 --n-block-size: calc((var(--n-height) - 8px) / 3);
 background-size: calc(var(--n-block-size) * 2) calc(var(--n-block-size) * 2);
 background-position: 0 0, 0 var(--n-block-size), var(--n-block-size) calc(-1 * var(--n-block-size)), calc(-1 * var(--n-block-size)) 0px; 
 `)])]),(0,k.cB)("color-picker-swatches",`
 display: grid;
 grid-gap: 8px;
 flex-wrap: wrap;
 position: relative;
 grid-template-columns: repeat(auto-fill, 18px);
 margin-top: 10px;
 `,[(0,k.cB)("color-picker-swatch",`
 width: 18px;
 height: 18px;
 background-image: linear-gradient(45deg, #DDD 25%, #0000 25%), linear-gradient(-45deg, #DDD 25%, #0000 25%), linear-gradient(45deg, #0000 75%, #DDD 75%), linear-gradient(-45deg, #0000 75%, #DDD 75%);
 background-size: 8px 8px;
 background-position: 0px 0, 0px 4px, 4px -4px, -4px 0px;
 background-repeat: repeat;
 `,[(0,k.cE)("fill",`
 position: relative;
 width: 100%;
 height: 100%;
 border-radius: 3px;
 box-shadow: rgba(0, 0, 0, .15) 0px 0px 0px 1px inset;
 cursor: pointer;
 `),(0,k.c)("&:focus",`
 outline: none;
 `,[(0,k.cE)("fill",[(0,k.c)("&::after",`
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;
 background: inherit;
 filter: blur(2px);
 content: "";
 `)])])])])]),X=Object.assign(Object.assign({},h.A.props),{value:String,show:{type:Boolean,default:void 0},defaultShow:Boolean,defaultValue:String,modes:{type:Array,default:()=>["rgb","hex","hsl"]},placement:{type:String,default:"bottom-start"},to:m.$.propTo,showAlpha:{type:Boolean,default:!0},showPreview:Boolean,swatches:Array,disabled:{type:Boolean,default:void 0},actions:{type:Array,default:null},internalActions:Array,size:String,renderLabel:Function,onComplete:Function,onConfirm:Function,onClear:Function,"onUpdate:show":[Function,Array],onUpdateShow:[Function,Array],"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array]}),K=(0,u.defineComponent)({name:"ColorPicker",props:X,slots:Object,setup(e,{slots:t}){let r,i,d,c,p,C,$,B,U=(0,u.ref)(null),S=null,D=(0,b.A)(e),{mergedSizeRef:z,mergedDisabledRef:_}=D,{localeRef:P}=(0,v.A)("global"),{mergedClsPrefixRef:E,namespaceRef:q,inlineThemeDisabled:T}=(0,f.Ay)(e),H=(0,h.A)("ColorPicker","-color-picker",N,y.A,e,E);(0,u.provide)(M,{themeRef:H,renderLabelRef:(0,u.toRef)(e,"renderLabel"),colorPickerSlots:t});let L=(0,u.ref)(e.defaultShow),X=(0,n.A)((0,u.toRef)(e,"show"),L);function K(t){let{onUpdateShow:r,"onUpdate:show":o}=e;r&&(0,x.T)(r,t),o&&(0,x.T)(o,t),L.value=t}let{defaultValue:W}=e,G=(0,u.ref)(void 0===W?function(e,t){switch(e[0]){case"hex":return t?"#000000FF":"#000000";case"rgb":return t?"rgba(0, 0, 0, 1)":"rgb(0, 0, 0)";case"hsl":return t?"hsla(0, 0%, 0%, 1)":"hsl(0, 0%, 0%)";case"hsv":return t?"hsva(0, 0%, 0%, 1)":"hsv(0, 0%, 0%)"}return"#000000"}(e.modes,e.showAlpha):W),Y=(0,n.A)((0,u.toRef)(e,"value"),G),Z=(0,u.ref)([Y.value]),J=(0,u.ref)(0),Q=(0,u.computed)(()=>A(Y.value)),{modes:ee}=e,et=(0,u.ref)(A(Y.value)||ee[0]||"rgb");function er(){let{modes:t}=e,{value:r}=et,o=t.findIndex(e=>e===r);~o?et.value=t[(o+1)%t.length]:et.value="rgb"}let eo=(0,u.computed)(()=>{let{value:e}=Y;if(!e)return null;switch(Q.value){case"hsv":return(0,o.jf)(e);case"hsl":return[r,i,d,B]=(0,o.V$)(e),[...(0,l.Nf)(r,i,d),B];case"rgb":case"hex":return[p,C,$,B]=(0,o.B3)(e),[...(0,l.bi)(p,C,$),B]}}),el=(0,u.computed)(()=>{let{value:e}=Y;if(!e)return null;switch(Q.value){case"rgb":case"hex":return(0,o.B3)(e);case"hsv":return[r,i,c,B]=(0,o.jf)(e),[...(0,l.hT)(r,i,c),B];case"hsl":return[r,i,d,B]=(0,o.V$)(e),[...(0,l.de)(r,i,d),B]}}),ea=(0,u.computed)(()=>{let{value:e}=Y;if(!e)return null;switch(Q.value){case"hsl":return(0,o.V$)(e);case"hsv":return[r,i,c,B]=(0,o.jf)(e),[...(0,l.nE)(r,i,c),B];case"rgb":case"hex":return[p,C,$,B]=(0,o.B3)(e),[...(0,l.bV)(p,C,$),B]}}),ei=(0,u.computed)(()=>{switch(et.value){case"rgb":case"hex":return el.value;case"hsv":return eo.value;case"hsl":return ea.value}}),en=(0,u.ref)(0),es=(0,u.ref)(1),eu=(0,u.ref)([0,0]);function ed(t,r){let{value:a}=eo,i=en.value,n=a?a[3]:1;eu.value=[t,r];let{showAlpha:s}=e;switch(et.value){case"hsv":eh((s?o.H7:o.Ci)([i,t,r,n]),"cursor");break;case"hsl":eh((s?o.pf:o.W3)([...(0,l.nE)(i,t,r),n]),"cursor");break;case"rgb":eh((s?o.hh:o._l)([...(0,l.hT)(i,t,r),n]),"cursor");break;case"hex":eh((s?o.Lj:o.U5)([...(0,l.hT)(i,t,r),n]),"cursor")}}function ec(t){en.value=t;let{value:r}=eo;if(!r)return;let[,a,i,n]=r,{showAlpha:s}=e;switch(et.value){case"hsv":eh((s?o.H7:o.Ci)([t,a,i,n]),"cursor");break;case"rgb":eh((s?o.hh:o._l)([...(0,l.hT)(t,a,i),n]),"cursor");break;case"hex":eh((s?o.Lj:o.U5)([...(0,l.hT)(t,a,i),n]),"cursor");break;case"hsl":eh((s?o.pf:o.W3)([...(0,l.nE)(t,a,i),n]),"cursor")}}function ep(e){switch(et.value){case"hsv":[r,i,c]=eo.value,eh((0,o.H7)([r,i,c,e]),"cursor");break;case"rgb":[p,C,$]=el.value,eh((0,o.hh)([p,C,$,e]),"cursor");break;case"hex":[p,C,$]=el.value,eh((0,o.Lj)([p,C,$,e]),"cursor");break;case"hsl":[r,i,d]=ea.value,eh((0,o.pf)([r,i,d,e]),"cursor")}es.value=e}function eh(t,r){S="cursor"===r?t:null;let{nTriggerFormChange:o,nTriggerFormInput:l}=D,{onUpdateValue:a,"onUpdate:value":i}=e;a&&(0,x.T)(a,t),i&&(0,x.T)(i,t),o(),l(),G.value=t}function eb(e){eh(e,"input"),(0,u.nextTick)(ev)}function ev(t=!0){let{value:r}=Y;if(r){let{nTriggerFormChange:o,nTriggerFormInput:l}=D,{onComplete:a}=e;a&&a(r);let{value:i}=Z,{value:n}=J;t&&(i.splice(n+1,i.length,r),J.value=n+1),o(),l()}}function ef(){let{value:e}=J;e-1<0||(eh(Z.value[e-1],"input"),ev(!1),J.value=e-1)}function eg(){let{value:e}=J;e<0||e+1>=Z.value.length||(eh(Z.value[e+1],"input"),ev(!1),J.value=e+1)}function em(){eh(null,"input");let{onClear:t}=e;t&&t(),K(!1)}function ex(){let{value:t}=Y,{onConfirm:r}=e;r&&r(t),K(!1)}let ek=(0,u.computed)(()=>J.value>=1),ew=(0,u.computed)(()=>{let{value:e}=Z;return e.length>1&&J.value<e.length-1});(0,u.watch)(X,e=>{e||(Z.value=[Y.value],J.value=0)}),(0,u.watchEffect)(()=>{if(S&&S===Y.value);else{let{value:e}=eo;e&&(en.value=e[0],es.value=e[3],eu.value=[e[1],e[2]])}S=null});let ey=(0,u.computed)(()=>{let{value:e}=z,{common:{cubicBezierEaseInOut:t},self:{textColor:r,color:o,panelFontSize:l,boxShadow:a,border:i,borderRadius:n,dividerColor:s,[(0,k.cF)("height",e)]:u,[(0,k.cF)("fontSize",e)]:d}}=H.value;return{"--n-bezier":t,"--n-text-color":r,"--n-color":o,"--n-panel-font-size":l,"--n-font-size":d,"--n-box-shadow":a,"--n-border":i,"--n-border-radius":n,"--n-height":u,"--n-divider-color":s}}),eC=T?(0,g.R)("color-picker",(0,u.computed)(()=>z.value[0]),ey,e):void 0;return{mergedClsPrefix:E,namespace:q,selfRef:U,hsla:ea,rgba:el,mergedShow:X,mergedDisabled:_,isMounted:(0,s.A)(),adjustedTo:(0,m.$)(e),mergedValue:Y,handleTriggerClick(){K(!0)},handleClickOutside(e){var t;null!=(t=U.value)&&t.contains((0,a.b)(e))||K(!1)},renderPanel:function(){var r;let{value:l}=el,{value:a}=en,{internalActions:i,modes:n,actions:s}=e,{value:d}=H,{value:c}=E;return(0,u.h)("div",{class:[`${c}-color-picker-panel`,null==eC?void 0:eC.themeClass.value],onDragstart:e=>{e.preventDefault()},style:T?void 0:ey.value},(0,u.h)("div",{class:`${c}-color-picker-control`},(0,u.h)(O,{clsPrefix:c,rgba:l,displayedHue:a,displayedSv:eu.value,onUpdateSV:ed,onComplete:ev}),(0,u.h)("div",{class:`${c}-color-picker-preview`},(0,u.h)("div",{class:`${c}-color-picker-preview__sliders`},(0,u.h)(I,{clsPrefix:c,hue:a,onUpdateHue:ec,onComplete:ev}),e.showAlpha?(0,u.h)(V,{clsPrefix:c,rgba:l,alpha:es.value,onUpdateAlpha:ep,onComplete:ev}):null),e.showPreview?(0,u.h)(F,{clsPrefix:c,mode:et.value,color:el.value&&(0,o.U5)(el.value),onUpdateColor:e=>{eh(e,"input")}}):null),(0,u.h)(R,{clsPrefix:c,showAlpha:e.showAlpha,mode:et.value,modes:n,onUpdateMode:er,value:Y.value,valueArr:ei.value,onUpdateValue:eb}),(null==(r=e.swatches)?void 0:r.length)&&(0,u.h)(j,{clsPrefix:c,mode:et.value,swatches:e.swatches,onUpdateColor:e=>{eh(e,"input")}})),(null==s?void 0:s.length)?(0,u.h)("div",{class:`${c}-color-picker-action`},s.includes("confirm")&&(0,u.h)(w.Ay,{size:"small",onClick:ex,theme:d.peers.Button,themeOverrides:d.peerOverrides.Button},{default:()=>P.value.confirm}),s.includes("clear")&&(0,u.h)(w.Ay,{size:"small",onClick:em,disabled:!Y.value,theme:d.peers.Button,themeOverrides:d.peerOverrides.Button},{default:()=>P.value.clear})):null,t.action?(0,u.h)("div",{class:`${c}-color-picker-action`},{default:t.action}):i?(0,u.h)("div",{class:`${c}-color-picker-action`},i.includes("undo")&&(0,u.h)(w.Ay,{size:"small",onClick:ef,disabled:!ek.value,theme:d.peers.Button,themeOverrides:d.peerOverrides.Button},{default:()=>P.value.undo}),i.includes("redo")&&(0,u.h)(w.Ay,{size:"small",onClick:eg,disabled:!ew.value,theme:d.peers.Button,themeOverrides:d.peerOverrides.Button},{default:()=>P.value.redo})):null)},cssVars:T?void 0:ey,themeClass:null==eC?void 0:eC.themeClass,onRender:null==eC?void 0:eC.onRender}},render(){let{mergedClsPrefix:e,onRender:t}=this;return null==t||t(),(0,u.h)("div",{class:[this.themeClass,`${e}-color-picker`],ref:"selfRef",style:this.cssVars},(0,u.h)(d.A,null,{default:()=>[(0,u.h)(c.A,null,{default:()=>(0,u.h)(q,{clsPrefix:e,value:this.mergedValue,hsla:this.hsla,disabled:this.mergedDisabled,onClick:this.handleTriggerClick})}),(0,u.h)(p.A,{placement:this.placement,show:this.mergedShow,containerClass:this.namespace,teleportDisabled:this.adjustedTo===m.$.tdkey,to:this.adjustedTo},{default:()=>(0,u.h)(u.Transition,{name:"fade-in-scale-up-transition",appear:this.isMounted},{default:()=>this.mergedShow?(0,u.withDirectives)(this.renderPanel(),[[i.A,this.handleClickOutside,void 0,{capture:!0}]]):null})})]}))}})},2579(e,t,r){r.d(t,{A:()=>s});var o=r(18123),l=r(91945),a=r(88718),i=r(26005);let n=(0,i.cB)("input-group",`
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
 `)])])])])])]),s=(0,o.defineComponent)({name:"InputGroup",props:{},setup(e){let{mergedClsPrefixRef:t}=(0,l.Ay)(e);return(0,a.A)("-input-group",n,t),{mergedClsPrefix:t}},render(){let{mergedClsPrefix:e}=this;return(0,o.h)("div",{class:`${e}-input-group`},this.$slots)}})}}]);