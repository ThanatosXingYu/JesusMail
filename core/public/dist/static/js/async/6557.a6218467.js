"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([["6557"],{95352(e,t,r){r.d(t,{A:()=>i});var n=r(18123);let i=(0,n.defineComponent)({name:"Add",render:()=>(0,n.h)("svg",{width:"512",height:"512",viewBox:"0 0 512 512",fill:"none",xmlns:"http://www.w3.org/2000/svg"},(0,n.h)("path",{d:"M256 112V400M400 256H112",stroke:"currentColor","stroke-width":"32","stroke-linecap":"round","stroke-linejoin":"round"}))})},11436(e,t,r){r.d(t,{A:()=>en});var n=r(73321),i=r(11307),o=r(18123),l=r(12894),a=r(91945),s=r(12469),u=r(71811),d=r(47580),c=r(83032),p=r(75569),h=r(81270),f=r(54553),g=r(30560),v=r(7801),m=r(26005);let y=(0,m.c)([(0,m.cB)("upload","width: 100%;",[(0,m.cM)("dragger-inside",[(0,m.cB)("upload-trigger",`
 display: block;
 `)]),(0,m.cM)("drag-over",[(0,m.cB)("upload-dragger",`
 border: var(--n-dragger-border-hover);
 `)])]),(0,m.cB)("upload-dragger",`
 cursor: pointer;
 box-sizing: border-box;
 width: 100%;
 text-align: center;
 border-radius: var(--n-border-radius);
 padding: 24px;
 opacity: 1;
 transition:
 opacity .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 background-color: var(--n-dragger-color);
 border: var(--n-dragger-border);
 `,[(0,m.c)("&:hover",`
 border: var(--n-dragger-border-hover);
 `),(0,m.cM)("disabled",`
 cursor: not-allowed;
 `)]),(0,m.cB)("upload-trigger",`
 display: inline-block;
 box-sizing: border-box;
 opacity: 1;
 transition: opacity .3s var(--n-bezier);
 `,[(0,m.c)("+",[(0,m.cB)("upload-file-list","margin-top: 8px;")]),(0,m.cM)("disabled",`
 opacity: var(--n-item-disabled-opacity);
 cursor: not-allowed;
 `),(0,m.cM)("image-card",`
 width: 96px;
 height: 96px;
 `,[(0,m.cB)("base-icon",`
 font-size: 24px;
 `),(0,m.cB)("upload-dragger",`
 padding: 0;
 height: 100%;
 width: 100%;
 display: flex;
 align-items: center;
 justify-content: center;
 `)])]),(0,m.cB)("upload-file-list",`
 line-height: var(--n-line-height);
 opacity: 1;
 transition: opacity .3s var(--n-bezier);
 `,[(0,m.c)("a, img","outline: none;"),(0,m.cM)("disabled",`
 opacity: var(--n-item-disabled-opacity);
 cursor: not-allowed;
 `,[(0,m.cB)("upload-file","cursor: not-allowed;")]),(0,m.cM)("grid",`
 display: grid;
 grid-template-columns: repeat(auto-fill, 96px);
 grid-gap: 8px;
 margin-top: 0;
 `),(0,m.cB)("upload-file",`
 display: block;
 box-sizing: border-box;
 cursor: default;
 padding: 0px 12px 0 6px;
 transition: background-color .3s var(--n-bezier);
 border-radius: var(--n-border-radius);
 `,[(0,g._)(),(0,m.cB)("progress",[(0,g._)({foldPadding:!0})]),(0,m.c)("&:hover",`
 background-color: var(--n-item-color-hover);
 `,[(0,m.cB)("upload-file-info",[(0,m.cE)("action",`
 opacity: 1;
 `)])]),(0,m.cM)("image-type",`
 border-radius: var(--n-border-radius);
 text-decoration: underline;
 text-decoration-color: #0000;
 `,[(0,m.cB)("upload-file-info",`
 padding-top: 0px;
 padding-bottom: 0px;
 width: 100%;
 height: 100%;
 display: flex;
 justify-content: space-between;
 align-items: center;
 padding: 6px 0;
 `,[(0,m.cB)("progress",`
 padding: 2px 0;
 margin-bottom: 0;
 `),(0,m.cE)("name",`
 padding: 0 8px;
 `),(0,m.cE)("thumbnail",`
 width: 32px;
 height: 32px;
 font-size: 28px;
 display: flex;
 justify-content: center;
 align-items: center;
 `,[(0,m.c)("img",`
 width: 100%;
 `)])])]),(0,m.cM)("text-type",[(0,m.cB)("progress",`
 box-sizing: border-box;
 padding-bottom: 6px;
 margin-bottom: 6px;
 `)]),(0,m.cM)("image-card-type",`
 position: relative;
 width: 96px;
 height: 96px;
 border: var(--n-item-border-image-card);
 border-radius: var(--n-border-radius);
 padding: 0;
 display: flex;
 align-items: center;
 justify-content: center;
 transition: border-color .3s var(--n-bezier), background-color .3s var(--n-bezier);
 border-radius: var(--n-border-radius);
 overflow: hidden;
 `,[(0,m.cB)("progress",`
 position: absolute;
 left: 8px;
 bottom: 8px;
 right: 8px;
 width: unset;
 `),(0,m.cB)("upload-file-info",`
 padding: 0;
 width: 100%;
 height: 100%;
 `,[(0,m.cE)("thumbnail",`
 width: 100%;
 height: 100%;
 display: flex;
 flex-direction: column;
 align-items: center;
 justify-content: center;
 font-size: 36px;
 `,[(0,m.c)("img",`
 width: 100%;
 `)])]),(0,m.c)("&::before",`
 position: absolute;
 z-index: 1;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 border-radius: inherit;
 opacity: 0;
 transition: opacity .2s var(--n-bezier);
 content: "";
 `),(0,m.c)("&:hover",[(0,m.c)("&::before","opacity: 1;"),(0,m.cB)("upload-file-info",[(0,m.cE)("thumbnail","opacity: .12;")])])]),(0,m.cM)("error-status",[(0,m.c)("&:hover",`
 background-color: var(--n-item-color-hover-error);
 `),(0,m.cB)("upload-file-info",[(0,m.cE)("name","color: var(--n-item-text-color-error);"),(0,m.cE)("thumbnail","color: var(--n-item-text-color-error);")]),(0,m.cM)("image-card-type",`
 border: var(--n-item-border-image-card-error);
 `)]),(0,m.cM)("with-url",`
 cursor: pointer;
 `,[(0,m.cB)("upload-file-info",[(0,m.cE)("name",`
 color: var(--n-item-text-color-success);
 text-decoration-color: var(--n-item-text-color-success);
 `,[(0,m.c)("a",`
 text-decoration: underline;
 `)])])]),(0,m.cB)("upload-file-info",`
 position: relative;
 padding-top: 6px;
 padding-bottom: 6px;
 display: flex;
 flex-wrap: nowrap;
 `,[(0,m.cE)("thumbnail",`
 font-size: 18px;
 opacity: 1;
 transition: opacity .2s var(--n-bezier);
 color: var(--n-item-icon-color);
 `,[(0,m.cB)("base-icon",`
 margin-right: 2px;
 vertical-align: middle;
 transition: color .3s var(--n-bezier);
 `)]),(0,m.cE)("action",`
 padding-top: inherit;
 padding-bottom: inherit;
 position: absolute;
 right: 0;
 top: 0;
 bottom: 0;
 width: 80px;
 display: flex;
 align-items: center;
 transition: opacity .2s var(--n-bezier);
 justify-content: flex-end;
 opacity: 0;
 `,[(0,m.cB)("button",[(0,m.c)("&:not(:last-child)",{marginRight:"4px"}),(0,m.cB)("base-icon",[(0,m.c)("svg",[(0,v.N)()])])]),(0,m.cM)("image-type",`
 position: relative;
 max-width: 80px;
 width: auto;
 `),(0,m.cM)("image-card-type",`
 z-index: 2;
 position: absolute;
 width: 100%;
 height: 100%;
 left: 0;
 right: 0;
 bottom: 0;
 top: 0;
 display: flex;
 justify-content: center;
 align-items: center;
 `)]),(0,m.cE)("name",`
 color: var(--n-item-text-color);
 flex: 1;
 display: flex;
 justify-content: center;
 text-overflow: ellipsis;
 overflow: hidden;
 flex-direction: column;
 text-decoration-color: #0000;
 font-size: var(--n-font-size);
 transition:
 color .3s var(--n-bezier),
 text-decoration-color .3s var(--n-bezier); 
 `,[(0,m.c)("a",`
 color: inherit;
 text-decoration: underline;
 `)])])])]),(0,m.cB)("upload-file-input",`
 display: none;
 width: 0;
 height: 0;
 opacity: 0;
 `)]);var b=r(82777),w=r(38161),x=r(17150),R=r(93529),B=r(64272),C=r(53370),k=r(63834);let P=(0,k.l)("attach",()=>(0,o.h)("svg",{viewBox:"0 0 16 16",version:"1.1",xmlns:"http://www.w3.org/2000/svg"},(0,o.h)("g",{stroke:"none","stroke-width":"1",fill:"none","fill-rule":"evenodd"},(0,o.h)("g",{fill:"currentColor","fill-rule":"nonzero"},(0,o.h)("path",{d:"M3.25735931,8.70710678 L7.85355339,4.1109127 C8.82986412,3.13460197 10.4127766,3.13460197 11.3890873,4.1109127 C12.365398,5.08722343 12.365398,6.67013588 11.3890873,7.64644661 L6.08578644,12.9497475 C5.69526215,13.3402718 5.06209717,13.3402718 4.67157288,12.9497475 C4.28104858,12.5592232 4.28104858,11.9260582 4.67157288,11.5355339 L9.97487373,6.23223305 C10.1701359,6.0369709 10.1701359,5.72038841 9.97487373,5.52512627 C9.77961159,5.32986412 9.4630291,5.32986412 9.26776695,5.52512627 L3.96446609,10.8284271 C3.18341751,11.6094757 3.18341751,12.8758057 3.96446609,13.6568542 C4.74551468,14.4379028 6.01184464,14.4379028 6.79289322,13.6568542 L12.0961941,8.35355339 C13.4630291,6.98671837 13.4630291,4.77064094 12.0961941,3.40380592 C10.7293591,2.0369709 8.51328163,2.0369709 7.14644661,3.40380592 L2.55025253,8 C2.35499039,8.19526215 2.35499039,8.51184464 2.55025253,8.70710678 C2.74551468,8.90236893 3.06209717,8.90236893 3.25735931,8.70710678 Z"})))));var A=r(94254);let T=(0,k.l)("trash",()=>(0,o.h)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 512 512"},(0,o.h)("path",{d:"M432,144,403.33,419.74A32,32,0,0,1,371.55,448H140.46a32,32,0,0,1-31.78-28.26L80,144",style:"fill: none; stroke: currentcolor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 32px;"}),(0,o.h)("rect",{x:"32",y:"64",width:"448",height:"80",rx:"16",ry:"16",style:"fill: none; stroke: currentcolor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 32px;"}),(0,o.h)("line",{x1:"312",y1:"240",x2:"200",y2:"352",style:"fill: none; stroke: currentcolor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 32px;"}),(0,o.h)("line",{x1:"312",y1:"352",x2:"200",y2:"240",style:"fill: none; stroke: currentcolor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 32px;"}))),L=(0,k.l)("cancel",()=>(0,o.h)("svg",{viewBox:"0 0 16 16",version:"1.1",xmlns:"http://www.w3.org/2000/svg"},(0,o.h)("g",{stroke:"none","stroke-width":"1",fill:"none","fill-rule":"evenodd"},(0,o.h)("g",{fill:"currentColor","fill-rule":"nonzero"},(0,o.h)("path",{d:"M2.58859116,2.7156945 L2.64644661,2.64644661 C2.82001296,2.47288026 3.08943736,2.45359511 3.2843055,2.58859116 L3.35355339,2.64644661 L8,7.293 L12.6464466,2.64644661 C12.8417088,2.45118446 13.1582912,2.45118446 13.3535534,2.64644661 C13.5488155,2.84170876 13.5488155,3.15829124 13.3535534,3.35355339 L8.707,8 L13.3535534,12.6464466 C13.5271197,12.820013 13.5464049,13.0894374 13.4114088,13.2843055 L13.3535534,13.3535534 C13.179987,13.5271197 12.9105626,13.5464049 12.7156945,13.4114088 L12.6464466,13.3535534 L8,8.707 L3.35355339,13.3535534 C3.15829124,13.5488155 2.84170876,13.5488155 2.64644661,13.3535534 C2.45118446,13.1582912 2.45118446,12.8417088 2.64644661,12.6464466 L7.293,8 L2.64644661,3.35355339 C2.47288026,3.17998704 2.45359511,2.91056264 2.58859116,2.7156945 L2.64644661,2.64644661 L2.58859116,2.7156945 Z"}))))),j=(0,k.l)("retry",()=>(0,o.h)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 512 512"},(0,o.h)("path",{d:"M320,146s24.36-12-64-12A160,160,0,1,0,416,294",style:"fill: none; stroke: currentcolor; stroke-linecap: round; stroke-miterlimit: 10; stroke-width: 32px;"}),(0,o.h)("polyline",{points:"256 58 336 138 256 218",style:"fill: none; stroke: currentcolor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 32px;"})));var O=r(5375),U=r(29925),D=r(48209),F=r(92134);function z(){return(0,o.h)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 28 28"},(0,o.h)("g",{fill:"none"},(0,o.h)("path",{d:"M21.75 3A3.25 3.25 0 0 1 25 6.25v15.5A3.25 3.25 0 0 1 21.75 25H6.25A3.25 3.25 0 0 1 3 21.75V6.25A3.25 3.25 0 0 1 6.25 3h15.5zm.583 20.4l-7.807-7.68a.75.75 0 0 0-.968-.07l-.084.07l-7.808 7.68c.183.065.38.1.584.1h15.5c.204 0 .4-.035.583-.1l-7.807-7.68l7.807 7.68zM21.75 4.5H6.25A1.75 1.75 0 0 0 4.5 6.25v15.5c0 .208.036.408.103.593l7.82-7.692a2.25 2.25 0 0 1 3.026-.117l.129.117l7.82 7.692c.066-.185.102-.385.102-.593V6.25a1.75 1.75 0 0 0-1.75-1.75zm-3.25 3a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5zm0 1.5a1 1 0 1 0 0 2a1 1 0 0 0 0-2z",fill:"currentColor"})))}function E(){return(0,o.h)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 28 28"},(0,o.h)("g",{fill:"none"},(0,o.h)("path",{d:"M6.4 2A2.4 2.4 0 0 0 4 4.4v19.2A2.4 2.4 0 0 0 6.4 26h15.2a2.4 2.4 0 0 0 2.4-2.4V11.578c0-.729-.29-1.428-.805-1.944l-6.931-6.931A2.4 2.4 0 0 0 14.567 2H6.4zm-.9 2.4a.9.9 0 0 1 .9-.9H14V10a2 2 0 0 0 2 2h6.5v11.6a.9.9 0 0 1-.9.9H6.4a.9.9 0 0 1-.9-.9V4.4zm16.44 6.1H16a.5.5 0 0 1-.5-.5V4.06l6.44 6.44z",fill:"currentColor"})))}var M=r(17766);let $=(0,o.defineComponent)({name:"UploadProgress",props:{show:Boolean,percentage:{type:Number,required:!0},status:{type:String,required:!0}},setup:()=>({mergedTheme:(0,o.inject)(f.u).mergedThemeRef}),render(){return(0,o.h)(w.A,null,{default:()=>this.show?(0,o.h)(M.A,{type:"line",showIndicator:!1,percentage:this.percentage,status:this.status,height:2,theme:this.mergedTheme.peers.Progress,themeOverrides:this.mergedTheme.peerOverrides.Progress}):null})}});var S=r(12221),_=function(e,t,r,n){return new(r||(r=Promise))(function(i,o){function l(e){try{s(n.next(e))}catch(e){o(e)}}function a(e){try{s(n.throw(e))}catch(e){o(e)}}function s(e){var t;e.done?i(e.value):((t=e.value)instanceof r?t:new r(function(e){e(t)})).then(l,a)}s((n=n.apply(e,t||[])).next())})};function H(e){return e.includes("image/")}function q(e=""){let t=e.split("/"),r=t[t.length-1].split(/#|\?/)[0];return(/\.[^./\\]*$/.exec(r)||[""])[0]}let I=/(webp|svg|png|gif|jpg|jpeg|jfif|bmp|dpg|ico)$/i,V=e=>{if(e.type)return H(e.type);let t=q(e.name||"");if(I.test(t))return!0;let r=e.thumbnailUrl||e.url||"",n=q(r);return!!(/^data:image\//.test(r)||I.test(n))},X=S.B&&window.FileReader&&window.File;function G(e){let{id:t,name:r,percentage:n,status:i,url:o,file:l,thumbnailUrl:a,type:s,fullPath:u,batchId:d}=e;return{id:t,name:r,percentage:null!=n?n:null,status:i,url:null!=o?o:null,file:null!=l?l:null,thumbnailUrl:null!=a?a:null,type:null!=s?s:null,fullPath:null!=u?u:null,batchId:null!=d?d:null}}var N=function(e,t,r,n){return new(r||(r=Promise))(function(i,o){function l(e){try{s(n.next(e))}catch(e){o(e)}}function a(e){try{s(n.throw(e))}catch(e){o(e)}}function s(e){var t;e.done?i(e.value):((t=e.value)instanceof r?t:new r(function(e){e(t)})).then(l,a)}s((n=n.apply(e,t||[])).next())})};let W={paddingMedium:"0 3px",heightMedium:"24px",iconSizeMedium:"18px"},Z=(0,o.defineComponent)({name:"UploadFile",props:{clsPrefix:{type:String,required:!0},file:{type:Object,required:!0},listType:{type:String,required:!0},index:{type:Number,required:!0}},setup(e){let t=(0,o.inject)(f.u),r=(0,o.ref)(null),n=(0,o.ref)(""),i=(0,o.computed)(()=>{let{file:t}=e;return"finished"===t.status?"success":"error"===t.status?"error":"info"}),l=(0,o.computed)(()=>{let{file:t}=e;if("error"===t.status)return"error"}),a=(0,o.computed)(()=>{let{file:t}=e;return"uploading"===t.status}),s=(0,o.computed)(()=>{if(!t.showCancelButtonRef.value)return!1;let{file:r}=e;return["uploading","pending","error"].includes(r.status)}),u=(0,o.computed)(()=>{if(!t.showRemoveButtonRef.value)return!1;let{file:r}=e;return["finished"].includes(r.status)}),d=(0,o.computed)(()=>{if(!t.showDownloadButtonRef.value)return!1;let{file:r}=e;return["finished"].includes(r.status)}),p=(0,o.computed)(()=>{if(!t.showRetryButtonRef.value)return!1;let{file:r}=e;return["error"].includes(r.status)}),h=(0,R.A)(()=>n.value||e.file.thumbnailUrl||e.file.url),g=(0,o.computed)(()=>{if(!t.showPreviewButtonRef.value)return!1;let{file:{status:r},listType:n}=e;return["finished"].includes(r)&&h.value&&"image-card"===n});function v(r){let{xhrMap:n,doChange:i,onRemoveRef:{value:o},mergedFileListRef:{value:l}}=t;Promise.resolve(!o||o({file:Object.assign({},r),fileList:l,index:e.index})).then(e=>{if(!1===e)return;let t=Object.assign({},r,{status:"removed"});n.delete(r.id),i(t,void 0,{remove:!0})})}let m=()=>N(this,void 0,void 0,function*(){let{listType:r}=e;("image"===r||"image-card"===r)&&t.shouldUseThumbnailUrlRef.value(e.file)&&(n.value=yield t.getFileThumbnailUrlResolver(e.file))});return(0,o.watchEffect)(()=>{m()}),{mergedTheme:t.mergedThemeRef,progressStatus:i,buttonType:l,showProgress:a,disabled:t.mergedDisabledRef,showCancelButton:s,showRemoveButton:u,showDownloadButton:d,showRetryButton:p,showPreviewButton:g,mergedThumbnailUrl:h,shouldUseThumbnailUrl:t.shouldUseThumbnailUrlRef,renderIcon:t.renderIconRef,imageRef:r,handleRemoveOrCancelClick:function(r){r.preventDefault();let{file:n}=e;["finished","pending","error"].includes(n.status)?v(n):["uploading"].includes(n.status)?function(e){let{xhrMap:r}=t,n=r.get(e.id);null==n||n.abort(),v(Object.assign({},e))}(n):(0,c.R8)("upload","The button clicked type is unknown.")},handleDownloadClick:function(r){r.preventDefault(),function(e){let{onDownloadRef:{value:r},customDownloadRef:{value:n}}=t;Promise.resolve(!r||r(Object.assign({},e))).then(t=>{!1!==t&&(n?n(Object.assign({},e)):(0,U.R)(e.url,e.name))})}(e.file)},handleRetryClick:function(){return N(this,void 0,void 0,function*(){let r=t.onRetryRef.value;r&&!1===(yield r({file:e.file}))||t.submit(e.file.id)})},handlePreviewClick:function(n){let{onPreviewRef:{value:i}}=t;if(i)i(e.file,{event:n});else if("image-card"===e.listType){let{value:e}=r;if(!e)return;e.showPreview()}}}},render(){let e,{clsPrefix:t,mergedTheme:r,listType:n,file:i,renderIcon:l}=this,a="image"===n;e=a||"image-card"===n?this.shouldUseThumbnailUrl(i)&&this.mergedThumbnailUrl?(0,o.h)("a",{rel:"noopener noreferer",target:"_blank",href:i.url||void 0,class:`${t}-upload-file-info__thumbnail`,onClick:this.handlePreviewClick},"image-card"===n?(0,o.h)(F.A,{src:this.mergedThumbnailUrl||void 0,previewSrc:i.url||void 0,alt:i.name,ref:"imageRef"}):(0,o.h)("img",{src:this.mergedThumbnailUrl||void 0,alt:i.name})):(0,o.h)("span",{class:`${t}-upload-file-info__thumbnail`},l?l(i):V(i)?(0,o.h)(B.A,{clsPrefix:t},{default:z}):(0,o.h)(B.A,{clsPrefix:t},{default:E})):(0,o.h)("span",{class:`${t}-upload-file-info__thumbnail`},l?l(i):(0,o.h)(B.A,{clsPrefix:t},{default:()=>(0,o.h)(P,null)}));let s=(0,o.h)($,{show:this.showProgress,percentage:i.percentage||0,status:this.progressStatus});return(0,o.h)("div",{class:[`${t}-upload-file`,`${t}-upload-file--${this.progressStatus}-status`,i.url&&"error"!==i.status&&"image-card"!==n&&`${t}-upload-file--with-url`,`${t}-upload-file--${n}-type`]},(0,o.h)("div",{class:`${t}-upload-file-info`},e,(0,o.h)("div",{class:`${t}-upload-file-info__name`},("text"===n||"image"===n)&&(i.url&&"error"!==i.status?(0,o.h)("a",{rel:"noopener noreferer",target:"_blank",href:i.url||void 0,onClick:this.handlePreviewClick},i.name):(0,o.h)("span",{onClick:this.handlePreviewClick},i.name)),a&&s),(0,o.h)("div",{class:[`${t}-upload-file-info__action`,`${t}-upload-file-info__action--${n}-type`]},this.showPreviewButton?(0,o.h)(D.Ay,{key:"preview",quaternary:!0,type:this.buttonType,onClick:this.handlePreviewClick,theme:r.peers.Button,themeOverrides:r.peerOverrides.Button,builtinThemeOverrides:W},{icon:()=>(0,o.h)(B.A,{clsPrefix:t},{default:()=>(0,o.h)(A.A,null)})}):null,(this.showRemoveButton||this.showCancelButton)&&!this.disabled&&(0,o.h)(D.Ay,{key:"cancelOrTrash",theme:r.peers.Button,themeOverrides:r.peerOverrides.Button,quaternary:!0,builtinThemeOverrides:W,type:this.buttonType,onClick:this.handleRemoveOrCancelClick},{icon:()=>(0,o.h)(C.A,null,{default:()=>this.showRemoveButton?(0,o.h)(B.A,{clsPrefix:t,key:"trash"},{default:()=>(0,o.h)(T,null)}):(0,o.h)(B.A,{clsPrefix:t,key:"cancel"},{default:()=>(0,o.h)(L,null)})})}),this.showRetryButton&&!this.disabled&&(0,o.h)(D.Ay,{key:"retry",quaternary:!0,type:this.buttonType,onClick:this.handleRetryClick,theme:r.peers.Button,themeOverrides:r.peerOverrides.Button,builtinThemeOverrides:W},{icon:()=>(0,o.h)(B.A,{clsPrefix:t},{default:()=>(0,o.h)(j,null)})}),this.showDownloadButton?(0,o.h)(D.Ay,{key:"download",quaternary:!0,type:this.buttonType,onClick:this.handleDownloadClick,theme:r.peers.Button,themeOverrides:r.peerOverrides.Button,builtinThemeOverrides:W},{icon:()=>(0,o.h)(B.A,{clsPrefix:t},{default:()=>(0,o.h)(O.A,null)})}):null)),!a&&s)}});var J=r(95352),K=r(80224);let Q=(0,o.defineComponent)({name:"UploadTrigger",props:{abstract:Boolean},slots:Object,setup(e,{slots:t}){let r=(0,o.inject)(f.u,null);r||(0,c.$8)("upload-trigger","`n-upload-trigger` must be placed inside `n-upload`.");let{mergedClsPrefixRef:n,mergedDisabledRef:i,maxReachedRef:l,listTypeRef:a,dragOverRef:s,openOpenFileDialog:u,draggerInsideRef:d,handleFileAddition:p,mergedDirectoryDndRef:h,triggerClassRef:g,triggerStyleRef:v}=r,m=(0,o.computed)(()=>"image-card"===a.value);function y(){i.value||l.value||u()}function w(e){e.preventDefault(),s.value=!0}function x(e){e.preventDefault(),s.value=!0}function R(e){e.preventDefault(),s.value=!1}function C(e){var t;if(e.preventDefault(),!d.value||i.value||l.value){s.value=!1;return}let r=null==(t=e.dataTransfer)?void 0:t.items;(null==r?void 0:r.length)?(function(e,t){return _(this,void 0,void 0,function*(){let r=[];return yield function e(n){return _(this,void 0,void 0,function*(){for(let i of n)if(i){if(t&&i.isDirectory){let t,r=i.createReader(),n=[];try{do t=yield new Promise((e,t)=>{r.readEntries(e,t)}),n=n.concat(t);while(t.length>0)}catch(e){(0,c.z3)("upload","error happens when handling directory upload",e)}yield e(n)}else if(i.isFile)try{let e=yield new Promise((e,t)=>{i.file(e,t)});r.push({file:e,entry:i,source:"dnd"})}catch(e){(0,c.z3)("upload","error happens when handling file upload",e)}}})}(e),r})})(Array.from(r).map(e=>e.webkitGetAsEntry()),h.value).then(e=>{p(e)}).finally(()=>{s.value=!1}):s.value=!1}return()=>{var r;let{value:a}=n;return e.abstract?null==(r=t.default)?void 0:r.call(t,{handleClick:y,handleDrop:C,handleDragOver:w,handleDragEnter:x,handleDragLeave:R}):(0,o.h)("div",{class:[`${a}-upload-trigger`,(i.value||l.value)&&`${a}-upload-trigger--disabled`,m.value&&`${a}-upload-trigger--image-card`,g.value],style:v.value,onClick:y,onDrop:C,onDragover:w,onDragenter:x,onDragleave:R},m.value?(0,o.h)(b.A,null,{default:()=>(0,K.Nj)(t.default,()=>[(0,o.h)(B.A,{clsPrefix:a},{default:()=>(0,o.h)(J.A,null)})])}):t)}}}),Y=(0,o.defineComponent)({name:"UploadFileList",setup(e,{slots:t}){let r=(0,o.inject)(f.u,null);r||(0,c.$8)("upload-file-list","`n-upload-file-list` must be placed inside `n-upload`.");let{abstractRef:n,mergedClsPrefixRef:i,listTypeRef:l,mergedFileListRef:a,fileListClassRef:s,fileListStyleRef:u,cssVarsRef:d,themeClassRef:p,maxReachedRef:h,showTriggerRef:g,imageGroupPropsRef:v}=r,m=(0,o.computed)(()=>"image-card"===l.value),y=()=>a.value.map((e,t)=>(0,o.h)(Z,{clsPrefix:i.value,key:e.id,file:e,index:t,listType:l.value}));return()=>{let{value:e}=i,{value:r}=n;return(0,o.h)("div",{class:[`${e}-upload-file-list`,m.value&&`${e}-upload-file-list--grid`,r?null==p?void 0:p.value:void 0,s.value],style:[r&&d?d.value:"",u.value]},m.value?(0,o.h)(x.Ay,Object.assign({},v.value),{default:y}):(0,o.h)(w.A,{group:!0},{default:y}),g.value&&!h.value&&m.value&&(0,o.h)(Q,null,t))}}});var ee=function(e,t,r,n){return new(r||(r=Promise))(function(i,o){function l(e){try{s(n.next(e))}catch(e){o(e)}}function a(e){try{s(n.throw(e))}catch(e){o(e)}}function s(e){var t;e.done?i(e.value):((t=e.value)instanceof r?t:new r(function(e){e(t)})).then(l,a)}s((n=n.apply(e,t||[])).next())})};function et(e,t){return"function"==typeof e?e({file:t}):e||{}}let er=Object.assign(Object.assign({},l.A.props),{name:{type:String,default:"file"},accept:String,action:String,customRequest:Function,directory:Boolean,directoryDnd:{type:Boolean,default:void 0},method:{type:String,default:"POST"},multiple:Boolean,showFileList:{type:Boolean,default:!0},data:[Object,Function],headers:[Object,Function],withCredentials:Boolean,responseType:{type:String,default:""},disabled:{type:Boolean,default:void 0},onChange:Function,onRemove:Function,onFinish:Function,onError:Function,onRetry:Function,onBeforeUpload:Function,isErrorState:Function,onDownload:Function,customDownload:Function,defaultUpload:{type:Boolean,default:!0},fileList:Array,"onUpdate:fileList":[Function,Array],onUpdateFileList:[Function,Array],fileListClass:String,fileListStyle:[String,Object],defaultFileList:{type:Array,default:()=>[]},showCancelButton:{type:Boolean,default:!0},showRemoveButton:{type:Boolean,default:!0},showDownloadButton:Boolean,showRetryButton:{type:Boolean,default:!0},showPreviewButton:{type:Boolean,default:!0},listType:{type:String,default:"text"},onPreview:Function,shouldUseThumbnailUrl:{type:Function,default:e=>!!X&&V(e)},createThumbnailUrl:Function,abstract:Boolean,max:Number,showTrigger:{type:Boolean,default:!0},imageGroupProps:Object,inputProps:Object,triggerClass:String,triggerStyle:[String,Object],renderIcon:Function}),en=(0,o.defineComponent)({name:"Upload",props:er,setup(e){e.abstract&&"image-card"===e.listType&&(0,c.$8)("upload","when the list-type is image-card, abstract is not supported.");let{mergedClsPrefixRef:t,inlineThemeDisabled:r,mergedRtlRef:g}=(0,a.Ay)(e),v=(0,l.A)("Upload","-upload",y,h.A,e,t),m=(0,s.I)("Upload",g,t),b=(0,u.A)(e),w=(0,o.ref)(e.defaultFileList),x=(0,o.toRef)(e,"fileList"),R=(0,o.ref)(null),B={value:!1},C=(0,o.ref)(!1),k=new Map,P=(0,i.A)(x,w),A=(0,o.computed)(()=>P.value.map(G)),T=(0,o.computed)(()=>{let{max:t}=e;return void 0!==t&&A.value.length>=t});function L(){var e;null==(e=R.value)||e.click()}let j=(0,o.computed)(()=>e.multiple||e.directory),O=(t,r,n={append:!1,remove:!1})=>{let{append:i,remove:o}=n,l=Array.from(A.value),a=l.findIndex(e=>e.id===t.id);if(i||o||~a){i?l.push(t):o?l.splice(a,1):l.splice(a,1,t);let{onChange:n}=e;n&&n({file:t,fileList:l,event:r}),function(t){let{"onUpdate:fileList":r,onUpdateFileList:n}=e;r&&(0,p.T)(r,t),n&&(0,p.T)(n,t),w.value=t}(l)}};function U(t,r){if(!t||0===t.length)return;let{onBeforeUpload:i}=e;t=j.value?t:[t[0]];let{max:l,accept:a}=e;t=t.filter(({file:e,source:t})=>{var r,n,i;return!("dnd"===t&&(null==a?void 0:a.trim()))||(r=e.name,n=e.type,i=a,r=r.toLowerCase(),n=n.toLocaleLowerCase(),(i=i.toLocaleLowerCase()).split(",").map(e=>e.trim()).filter(Boolean).some(e=>{if(e.startsWith(".")){if(r.endsWith(e))return!0}else{if(!e.includes("/"))return!0;let[t,r]=n.split("/"),[i,o]=e.split("/");if(("*"===i||t&&i&&i===t)&&("*"===o||r&&o&&o===r))return!0}return!1}))}),l&&(t=t.slice(0,l-A.value.length));let s=(0,n.sX)();Promise.all(t.map(e=>ee(this,[e],void 0,function*({file:e,entry:t}){var r;let o={id:(0,n.sX)(),batchId:s,name:e.name,status:"pending",percentage:0,file:e,url:null,type:e.type,thumbnailUrl:null,fullPath:null!=(r=null==t?void 0:t.fullPath)?r:`/${e.webkitRelativePath||e.name}`};return i&&(yield i({file:o,fileList:A.value}))===!1?null:o}))).then(e=>ee(this,void 0,void 0,function*(){let t=Promise.resolve();e.forEach(e=>{t=t.then(o.nextTick).then(()=>{e&&O(e,r,{append:!0})})}),yield t})).then(()=>{e.defaultUpload&&D()})}function D(t){let{method:r,action:n,withCredentials:i,headers:o,data:l,name:a}=e,s=void 0!==t?A.value.filter(e=>e.id===t):A.value,u=void 0!==t;s.forEach(t=>{let{status:s}=t;("pending"===s||"error"===s&&u)&&(e.customRequest?function(e){let{inst:t,file:r,data:n,headers:i,withCredentials:o,action:l,customRequest:a}=e,{doChange:s}=e.inst,u=0;a({file:r,data:n,headers:i,withCredentials:o,action:l,onProgress(e){let t=Object.assign({},r,{status:"uploading"}),n=e.percent;t.percentage=n,u=n,s(t)},onFinish(){var e;let n=Object.assign({},r,{status:"finished",percentage:u});s(n=G((null==(e=t.onFinish)?void 0:e.call(t,{file:n}))||n))},onError(){var e;let n=Object.assign({},r,{status:"error",percentage:u});s(n=G((null==(e=t.onError)?void 0:e.call(t,{file:n}))||n))}})}({inst:{doChange:O,xhrMap:k,onFinish:e.onFinish,onError:e.onError},file:t,action:n,withCredentials:i,headers:o,data:l,customRequest:e.customRequest}):function(e,t,r,{method:n,action:i,withCredentials:o,responseType:l,headers:a,data:s}){let u,d,c=new XMLHttpRequest;c.responseType=l,e.xhrMap.set(r.id,c),c.withCredentials=o;let p=new FormData;if((u=et(s,r))&&Object.keys(u).forEach(e=>{p.append(e,u[e])}),null!==r.file&&p.append(t,r.file),d=function(e,t,r){let{doChange:n,xhrMap:i}=e,o=0;function l(r){var l;let a=Object.assign({},t,{status:"error",percentage:o});i.delete(t.id),n(a=G((null==(l=e.onError)?void 0:l.call(e,{file:a,event:r}))||a),r)}return{handleXHRLoad:function(a){var s;if(e.isErrorState){if(e.isErrorState(r))return void l(a)}else if(r.status<200||r.status>=300)return void l(a);let u=Object.assign({},t,{status:"finished",percentage:o});i.delete(t.id),n(u=G((null==(s=e.onFinish)?void 0:s.call(e,{file:u,event:a}))||u),a)},handleXHRError:l,handleXHRAbort(e){let r=Object.assign({},t,{status:"removed",file:null,percentage:o});i.delete(t.id),n(r,e)},handleXHRProgress(e){let r=Object.assign({},t,{status:"uploading"});if(e.lengthComputable){let t=Math.ceil(e.loaded/e.total*100);r.percentage=t,o=t}n(r,e)}}}(e,r,c),c.onabort=d.handleXHRAbort,c.onerror=d.handleXHRError,c.onload=d.handleXHRLoad,c.upload&&(c.upload.onprogress=d.handleXHRProgress),void 0!==i){let t;c.open(n.toUpperCase(),i),(t=et(a,r))&&Object.keys(t).forEach(e=>{c.setRequestHeader(e,t[e])}),c.send(p);let o=Object.assign({},r,{status:"uploading"});e.doChange(o)}}({doChange:O,xhrMap:k,onFinish:e.onFinish,onError:e.onError,isErrorState:e.isErrorState},a,t,{method:r,action:n,withCredentials:i,responseType:e.responseType,headers:o,data:l}))})}let F=(0,o.computed)(()=>{let{common:{cubicBezierEaseInOut:e},self:{draggerColor:t,draggerBorder:r,draggerBorderHover:n,itemColorHover:i,itemColorHoverError:o,itemTextColorError:l,itemTextColorSuccess:a,itemTextColor:s,itemIconColor:u,itemDisabledOpacity:d,lineHeight:c,borderRadius:p,fontSize:h,itemBorderImageCardError:f,itemBorderImageCard:g}}=v.value;return{"--n-bezier":e,"--n-border-radius":p,"--n-dragger-border":r,"--n-dragger-border-hover":n,"--n-dragger-color":t,"--n-font-size":h,"--n-item-color-hover":i,"--n-item-color-hover-error":o,"--n-item-disabled-opacity":d,"--n-item-icon-color":u,"--n-item-text-color":s,"--n-item-text-color-error":l,"--n-item-text-color-success":a,"--n-line-height":c,"--n-item-border-image-card-error":f,"--n-item-border-image-card":g}}),z=r?(0,d.R)("upload",void 0,F,e):void 0;return(0,o.provide)(f.u,{mergedClsPrefixRef:t,mergedThemeRef:v,showCancelButtonRef:(0,o.toRef)(e,"showCancelButton"),showDownloadButtonRef:(0,o.toRef)(e,"showDownloadButton"),showRemoveButtonRef:(0,o.toRef)(e,"showRemoveButton"),showRetryButtonRef:(0,o.toRef)(e,"showRetryButton"),onRemoveRef:(0,o.toRef)(e,"onRemove"),onDownloadRef:(0,o.toRef)(e,"onDownload"),customDownloadRef:(0,o.toRef)(e,"customDownload"),mergedFileListRef:A,triggerClassRef:(0,o.toRef)(e,"triggerClass"),triggerStyleRef:(0,o.toRef)(e,"triggerStyle"),shouldUseThumbnailUrlRef:(0,o.toRef)(e,"shouldUseThumbnailUrl"),renderIconRef:(0,o.toRef)(e,"renderIcon"),xhrMap:k,submit:D,doChange:O,showPreviewButtonRef:(0,o.toRef)(e,"showPreviewButton"),onPreviewRef:(0,o.toRef)(e,"onPreview"),getFileThumbnailUrlResolver:function(t){var r;if(t.thumbnailUrl)return t.thumbnailUrl;let{createThumbnailUrl:n}=e;return n?null!=(r=n(t.file,t))?r:t.url||"":t.url?t.url:t.file?function(e){return _(this,void 0,void 0,function*(){return yield new Promise(t=>{t(e.type&&H(e.type)?window.URL.createObjectURL(e):"")})})}(t.file):""},listTypeRef:(0,o.toRef)(e,"listType"),dragOverRef:C,openOpenFileDialog:L,draggerInsideRef:B,handleFileAddition:U,mergedDisabledRef:b.mergedDisabledRef,maxReachedRef:T,fileListClassRef:(0,o.toRef)(e,"fileListClass"),fileListStyleRef:(0,o.toRef)(e,"fileListStyle"),abstractRef:(0,o.toRef)(e,"abstract"),acceptRef:(0,o.toRef)(e,"accept"),cssVarsRef:r?void 0:F,themeClassRef:null==z?void 0:z.themeClass,onRender:null==z?void 0:z.onRender,showTriggerRef:(0,o.toRef)(e,"showTrigger"),imageGroupPropsRef:(0,o.toRef)(e,"imageGroupProps"),mergedDirectoryDndRef:(0,o.computed)(()=>{var t;return null!=(t=e.directoryDnd)?t:e.directory}),onRetryRef:(0,o.toRef)(e,"onRetry")}),Object.assign({mergedClsPrefix:t,draggerInsideRef:B,rtlEnabled:m,inputElRef:R,mergedTheme:v,dragOver:C,mergedMultiple:j,cssVars:r?void 0:F,themeClass:null==z?void 0:z.themeClass,onRender:null==z?void 0:z.onRender,handleFileInputChange:function(e){let t=e.target;U(t.files?Array.from(t.files).map(e=>({file:e,entry:null,source:"input"})):null,e),t.value=""}},{clear:()=>{w.value=[]},submit:D,openOpenFileDialog:L})},render(){var e,t;let{draggerInsideRef:r,mergedClsPrefix:n,$slots:i,directory:l,onRender:a}=this;if(i.default&&!this.abstract){let t=i.default()[0];(null==(e=null==t?void 0:t.type)?void 0:e[b.P])&&(r.value=!0)}let s=(0,o.h)("input",Object.assign({},this.inputProps,{ref:"inputElRef",type:"file",class:`${n}-upload-file-input`,accept:this.accept,multiple:this.mergedMultiple,onChange:this.handleFileInputChange,webkitdirectory:l||void 0,directory:l||void 0}));return this.abstract?(0,o.h)(o.Fragment,null,null==(t=i.default)?void 0:t.call(i),(0,o.h)(o.Teleport,{to:"body"},s)):(null==a||a(),(0,o.h)("div",{class:[`${n}-upload`,this.rtlEnabled&&`${n}-upload--rtl`,r.value&&`${n}-upload--dragger-inside`,this.dragOver&&`${n}-upload--drag-over`,this.themeClass],style:this.cssVars},s,this.showTrigger&&"image-card"!==this.listType&&(0,o.h)(Q,null,i),this.showFileList&&(0,o.h)(Y,null,i)))}})},82777(e,t,r){r.d(t,{A:()=>a,P:()=>l});var n=r(18123),i=r(83032),o=r(54553);let l="__UPLOAD_DRAGGER__",a=(0,n.defineComponent)({name:"UploadDragger",[l]:!0,setup(e,{slots:t}){let r=(0,n.inject)(o.u,null);return r||(0,i.$8)("upload-dragger","`n-upload-dragger` must be placed inside `n-upload`."),()=>{let{mergedClsPrefixRef:{value:e},mergedDisabledRef:{value:i},maxReachedRef:{value:o}}=r;return(0,n.h)("div",{class:[`${e}-upload-dragger`,(i||o)&&`${e}-upload-dragger--disabled`]},t)}}})},54553(e,t,r){r.d(t,{u:()=>n});let n=(0,r(98667).D)("n-upload")}}]);