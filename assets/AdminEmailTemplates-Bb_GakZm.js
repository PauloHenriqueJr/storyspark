import{r as l,ai as fe,bO as ua,j as e,b2 as xa,s as Me,bP as ie,b9 as He,L as ue,C as ga,B as _,b5 as we,as as ha,V as Re,bF as fa,w as Pt,x as De,y as Fe,z as Z,U as Se,F as At,n as zt,ao as J,g as B,h as q,i as W,k as $,a7 as ge,T as Ge,aQ as va,l as Ne,o as ce,e as Mt,a9 as ke,aa as Ce,ab as Te,ac as D,O as Rt,ae as Ye,d as Ze,a8 as ba,a3 as Y,X as ja,aT as ya,aP as wa,_ as Je,$ as Qe,a0 as Xe,a1 as Ke,a2 as O,A as Dt,bE as Ie,aL as A,a4 as Ft}from"./index-B5QlEUYS.js";import{C as Sa}from"./CreateEmailCampaignModal-p1qqE9-u.js";import{waitlistInviteTemplate as et}from"./emailTemplates-CHy5623b.js";import{R as Na}from"./refresh-cw-ClMpKTjr.js";import{E as tt}from"./ellipsis-DSXpi_mw.js";import{S as at}from"./square-pen-Dkd5Sfpl.js";import{U as It}from"./user-plus-BZ6XgY1M.js";import{F as Lt}from"./filter-D8X5dADh.js";import{S as Ut}from"./save-D90YpKsF.js";import"./popover-BciXPy6n.js";import"./chevron-left-CbWhb6cM.js";import"./pt-BR-C__T0yqY.js";function ka(t,r,s){return r in t?Object.defineProperty(t,r,{value:s,enumerable:!0,configurable:!0,writable:!0}):t[r]=s,t}function Vt(t,r){var s=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);r&&(o=o.filter(function(i){return Object.getOwnPropertyDescriptor(t,i).enumerable})),s.push.apply(s,o)}return s}function Bt(t){for(var r=1;r<arguments.length;r++){var s=arguments[r]!=null?arguments[r]:{};r%2?Vt(Object(s),!0).forEach(function(o){ka(t,o,s[o])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(s)):Vt(Object(s)).forEach(function(o){Object.defineProperty(t,o,Object.getOwnPropertyDescriptor(s,o))})}return t}function Ca(t,r){if(t==null)return{};var s={},o=Object.keys(t),i,d;for(d=0;d<o.length;d++)i=o[d],!(r.indexOf(i)>=0)&&(s[i]=t[i]);return s}function Ta(t,r){if(t==null)return{};var s=Ca(t,r),o,i;if(Object.getOwnPropertySymbols){var d=Object.getOwnPropertySymbols(t);for(i=0;i<d.length;i++)o=d[i],!(r.indexOf(o)>=0)&&Object.prototype.propertyIsEnumerable.call(t,o)&&(s[o]=t[o])}return s}function Ea(t,r){return _a(t)||Oa(t,r)||Pa(t,r)||Aa()}function _a(t){if(Array.isArray(t))return t}function Oa(t,r){if(!(typeof Symbol>"u"||!(Symbol.iterator in Object(t)))){var s=[],o=!0,i=!1,d=void 0;try{for(var v=t[Symbol.iterator](),y;!(o=(y=v.next()).done)&&(s.push(y.value),!(r&&s.length===r));o=!0);}catch(k){i=!0,d=k}finally{try{!o&&v.return!=null&&v.return()}finally{if(i)throw d}}return s}}function Pa(t,r){if(t){if(typeof t=="string")return $t(t,r);var s=Object.prototype.toString.call(t).slice(8,-1);if(s==="Object"&&t.constructor&&(s=t.constructor.name),s==="Map"||s==="Set")return Array.from(t);if(s==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(s))return $t(t,r)}}function $t(t,r){(r==null||r>t.length)&&(r=t.length);for(var s=0,o=new Array(r);s<r;s++)o[s]=t[s];return o}function Aa(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function za(t,r,s){return r in t?Object.defineProperty(t,r,{value:s,enumerable:!0,configurable:!0,writable:!0}):t[r]=s,t}function qt(t,r){var s=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);r&&(o=o.filter(function(i){return Object.getOwnPropertyDescriptor(t,i).enumerable})),s.push.apply(s,o)}return s}function Wt(t){for(var r=1;r<arguments.length;r++){var s=arguments[r]!=null?arguments[r]:{};r%2?qt(Object(s),!0).forEach(function(o){za(t,o,s[o])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(s)):qt(Object(s)).forEach(function(o){Object.defineProperty(t,o,Object.getOwnPropertyDescriptor(s,o))})}return t}function Ma(){for(var t=arguments.length,r=new Array(t),s=0;s<t;s++)r[s]=arguments[s];return function(o){return r.reduceRight(function(i,d){return d(i)},o)}}function Ee(t){return function r(){for(var s=this,o=arguments.length,i=new Array(o),d=0;d<o;d++)i[d]=arguments[d];return i.length>=t.length?t.apply(this,i):function(){for(var v=arguments.length,y=new Array(v),k=0;k<v;k++)y[k]=arguments[k];return r.apply(s,[].concat(i,y))}}}function Ve(t){return{}.toString.call(t).includes("Object")}function Ra(t){return!Object.keys(t).length}function Oe(t){return typeof t=="function"}function Da(t,r){return Object.prototype.hasOwnProperty.call(t,r)}function Fa(t,r){return Ve(r)||le("changeType"),Object.keys(r).some(function(s){return!Da(t,s)})&&le("changeField"),r}function Ia(t){Oe(t)||le("selectorType")}function La(t){Oe(t)||Ve(t)||le("handlerType"),Ve(t)&&Object.values(t).some(function(r){return!Oe(r)})&&le("handlersType")}function Ua(t){t||le("initialIsRequired"),Ve(t)||le("initialType"),Ra(t)&&le("initialContent")}function Va(t,r){throw new Error(t[r]||t.default)}var Ba={initialIsRequired:"initial state is required",initialType:"initial state should be an object",initialContent:"initial state shouldn't be an empty object",handlerType:"handler should be an object or a function",handlersType:"all handlers should be a functions",selectorType:"selector should be a function",changeType:"provided value of changes should be an object",changeField:'it seams you want to change a field in the state which is not specified in the "initial" state',default:"an unknown error accured in `state-local` package"},le=Ee(Va)(Ba),Le={changes:Fa,selector:Ia,handler:La,initial:Ua};function $a(t){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};Le.initial(t),Le.handler(r);var s={current:t},o=Ee(Ha)(s,r),i=Ee(Wa)(s),d=Ee(Le.changes)(t),v=Ee(qa)(s);function y(){var C=arguments.length>0&&arguments[0]!==void 0?arguments[0]:function(x){return x};return Le.selector(C),C(s.current)}function k(C){Ma(o,i,d,v)(C)}return[y,k]}function qa(t,r){return Oe(r)?r(t.current):r}function Wa(t,r){return t.current=Wt(Wt({},t.current),r),r}function Ha(t,r,s){return Oe(r)?r(t.current):Object.keys(s).forEach(function(o){var i;return(i=r[o])===null||i===void 0?void 0:i.call(r,t.current[o])}),s}var Ga={create:$a},Ya={paths:{vs:"https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs"}};function Za(t){return function r(){for(var s=this,o=arguments.length,i=new Array(o),d=0;d<o;d++)i[d]=arguments[d];return i.length>=t.length?t.apply(this,i):function(){for(var v=arguments.length,y=new Array(v),k=0;k<v;k++)y[k]=arguments[k];return r.apply(s,[].concat(i,y))}}}function Ja(t){return{}.toString.call(t).includes("Object")}function Qa(t){return t||Ht("configIsRequired"),Ja(t)||Ht("configType"),t.urls?(Xa(),{paths:{vs:t.urls.monacoBase}}):t}function Xa(){console.warn(Yt.deprecation)}function Ka(t,r){throw new Error(t[r]||t.default)}var Yt={configIsRequired:"the configuration object is required",configType:"the configuration object should be an object",default:"an unknown error accured in `@monaco-editor/loader` package",deprecation:`Deprecation warning!
    You are using deprecated way of configuration.

    Instead of using
      monaco.config({ urls: { monacoBase: '...' } })
    use
      monaco.config({ paths: { vs: '...' } })

    For more please check the link https://github.com/suren-atoyan/monaco-loader#config
  `},Ht=Za(Ka)(Yt),er={config:Qa},tr=function(){for(var r=arguments.length,s=new Array(r),o=0;o<r;o++)s[o]=arguments[o];return function(i){return s.reduceRight(function(d,v){return v(d)},i)}};function Zt(t,r){return Object.keys(r).forEach(function(s){r[s]instanceof Object&&t[s]&&Object.assign(r[s],Zt(t[s],r[s]))}),Bt(Bt({},t),r)}var ar={type:"cancelation",msg:"operation is manually canceled"};function rt(t){var r=!1,s=new Promise(function(o,i){t.then(function(d){return r?i(ar):o(d)}),t.catch(i)});return s.cancel=function(){return r=!0},s}var rr=Ga.create({config:Ya,isInitialized:!1,resolve:null,reject:null,monaco:null}),Jt=Ea(rr,2),Pe=Jt[0],Be=Jt[1];function sr(t){var r=er.config(t),s=r.monaco,o=Ta(r,["monaco"]);Be(function(i){return{config:Zt(i.config,o),monaco:s}})}function or(){var t=Pe(function(r){var s=r.monaco,o=r.isInitialized,i=r.resolve;return{monaco:s,isInitialized:o,resolve:i}});if(!t.isInitialized){if(Be({isInitialized:!0}),t.monaco)return t.resolve(t.monaco),rt(st);if(window.monaco&&window.monaco.editor)return Qt(window.monaco),t.resolve(window.monaco),rt(st);tr(nr,cr)(lr)}return rt(st)}function nr(t){return document.body.appendChild(t)}function ir(t){var r=document.createElement("script");return t&&(r.src=t),r}function cr(t){var r=Pe(function(o){var i=o.config,d=o.reject;return{config:i,reject:d}}),s=ir("".concat(r.config.paths.vs,"/loader.js"));return s.onload=function(){return t()},s.onerror=r.reject,s}function lr(){var t=Pe(function(s){var o=s.config,i=s.resolve,d=s.reject;return{config:o,resolve:i,reject:d}}),r=window.require;r.config(t.config),r(["vs/editor/editor.main"],function(s){Qt(s),t.resolve(s)},function(s){t.reject(s)})}function Qt(t){Pe().monaco||Be({monaco:t})}function dr(){return Pe(function(t){var r=t.monaco;return r})}var st=new Promise(function(t,r){return Be({resolve:t,reject:r})}),Xt={config:sr,init:or,__getMonacoInstance:dr},mr={wrapper:{display:"flex",position:"relative",textAlign:"initial"},fullWidth:{width:"100%"},hide:{display:"none"}},ot=mr,pr={container:{display:"flex",height:"100%",width:"100%",justifyContent:"center",alignItems:"center"}},ur=pr;function xr({children:t}){return fe.createElement("div",{style:ur.container},t)}var gr=xr,hr=gr;function fr({width:t,height:r,isEditorReady:s,loading:o,_ref:i,className:d,wrapperProps:v}){return fe.createElement("section",{style:{...ot.wrapper,width:t,height:r},...v},!s&&fe.createElement(hr,null,o),fe.createElement("div",{ref:i,style:{...ot.fullWidth,...!s&&ot.hide},className:d}))}var vr=fr,Kt=l.memo(vr);function br(t){l.useEffect(t,[])}var ea=br;function jr(t,r,s=!0){let o=l.useRef(!0);l.useEffect(o.current||!s?()=>{o.current=!1}:t,r)}var Q=jr;function _e(){}function he(t,r,s,o){return yr(t,o)||wr(t,r,s,o)}function yr(t,r){return t.editor.getModel(ta(t,r))}function wr(t,r,s,o){return t.editor.createModel(r,s,o?ta(t,o):void 0)}function ta(t,r){return t.Uri.parse(r)}function Sr({original:t,modified:r,language:s,originalLanguage:o,modifiedLanguage:i,originalModelPath:d,modifiedModelPath:v,keepCurrentOriginalModel:y=!1,keepCurrentModifiedModel:k=!1,theme:C="light",loading:x="Loading...",options:m={},height:p="100%",width:b="100%",className:T,wrapperProps:P={},beforeMount:te=_e,onMount:ve=_e}){let[U,n]=l.useState(!1),[I,F]=l.useState(!0),L=l.useRef(null),z=l.useRef(null),de=l.useRef(null),V=l.useRef(ve),S=l.useRef(te),me=l.useRef(!1);ea(()=>{let u=Xt.init();return u.then(N=>(z.current=N)&&F(!1)).catch(N=>(N==null?void 0:N.type)!=="cancelation"&&console.error("Monaco initialization: error:",N)),()=>L.current?ee():u.cancel()}),Q(()=>{if(L.current&&z.current){let u=L.current.getOriginalEditor(),N=he(z.current,t||"",o||s||"text",d||"");N!==u.getModel()&&u.setModel(N)}},[d],U),Q(()=>{if(L.current&&z.current){let u=L.current.getModifiedEditor(),N=he(z.current,r||"",i||s||"text",v||"");N!==u.getModel()&&u.setModel(N)}},[v],U),Q(()=>{let u=L.current.getModifiedEditor();u.getOption(z.current.editor.EditorOption.readOnly)?u.setValue(r||""):r!==u.getValue()&&(u.executeEdits("",[{range:u.getModel().getFullModelRange(),text:r||"",forceMoveMarkers:!0}]),u.pushUndoStop())},[r],U),Q(()=>{var u,N;(N=(u=L.current)==null?void 0:u.getModel())==null||N.original.setValue(t||"")},[t],U),Q(()=>{let{original:u,modified:N}=L.current.getModel();z.current.editor.setModelLanguage(u,o||s||"text"),z.current.editor.setModelLanguage(N,i||s||"text")},[s,o,i],U),Q(()=>{var u;(u=z.current)==null||u.editor.setTheme(C)},[C],U),Q(()=>{var u;(u=L.current)==null||u.updateOptions(m)},[m],U);let be=l.useCallback(()=>{var M;if(!z.current)return;S.current(z.current);let u=he(z.current,t||"",o||s||"text",d||""),N=he(z.current,r||"",i||s||"text",v||"");(M=L.current)==null||M.setModel({original:u,modified:N})},[s,r,i,t,o,d,v]),K=l.useCallback(()=>{var u;!me.current&&de.current&&(L.current=z.current.editor.createDiffEditor(de.current,{automaticLayout:!0,...m}),be(),(u=z.current)==null||u.editor.setTheme(C),n(!0),me.current=!0)},[m,C,be]);l.useEffect(()=>{U&&V.current(L.current,z.current)},[U]),l.useEffect(()=>{!I&&!U&&K()},[I,U,K]);function ee(){var N,M,H,ae;let u=(N=L.current)==null?void 0:N.getModel();y||((M=u==null?void 0:u.original)==null||M.dispose()),k||((H=u==null?void 0:u.modified)==null||H.dispose()),(ae=L.current)==null||ae.dispose()}return fe.createElement(Kt,{width:b,height:p,isEditorReady:U,loading:x,_ref:de,className:T,wrapperProps:P})}var Nr=Sr;l.memo(Nr);function kr(t){let r=l.useRef();return l.useEffect(()=>{r.current=t},[t]),r.current}var Cr=kr,Ue=new Map;function Tr({defaultValue:t,defaultLanguage:r,defaultPath:s,value:o,language:i,path:d,theme:v="light",line:y,loading:k="Loading...",options:C={},overrideServices:x={},saveViewState:m=!0,keepCurrentModel:p=!1,width:b="100%",height:T="100%",className:P,wrapperProps:te={},beforeMount:ve=_e,onMount:U=_e,onChange:n,onValidate:I=_e}){let[F,L]=l.useState(!1),[z,de]=l.useState(!0),V=l.useRef(null),S=l.useRef(null),me=l.useRef(null),be=l.useRef(U),K=l.useRef(ve),ee=l.useRef(),u=l.useRef(o),N=Cr(d),M=l.useRef(!1),H=l.useRef(!1);ea(()=>{let j=Xt.init();return j.then(E=>(V.current=E)&&de(!1)).catch(E=>(E==null?void 0:E.type)!=="cancelation"&&console.error("Monaco initialization: error:",E)),()=>S.current?je():j.cancel()}),Q(()=>{var E,R,oe,re;let j=he(V.current,t||o||"",r||i||"",d||s||"");j!==((E=S.current)==null?void 0:E.getModel())&&(m&&Ue.set(N,(R=S.current)==null?void 0:R.saveViewState()),(oe=S.current)==null||oe.setModel(j),m&&((re=S.current)==null||re.restoreViewState(Ue.get(d))))},[d],F),Q(()=>{var j;(j=S.current)==null||j.updateOptions(C)},[C],F),Q(()=>{!S.current||o===void 0||(S.current.getOption(V.current.editor.EditorOption.readOnly)?S.current.setValue(o):o!==S.current.getValue()&&(H.current=!0,S.current.executeEdits("",[{range:S.current.getModel().getFullModelRange(),text:o,forceMoveMarkers:!0}]),S.current.pushUndoStop(),H.current=!1))},[o],F),Q(()=>{var E,R;let j=(E=S.current)==null?void 0:E.getModel();j&&i&&((R=V.current)==null||R.editor.setModelLanguage(j,i))},[i],F),Q(()=>{var j;y!==void 0&&((j=S.current)==null||j.revealLine(y))},[y],F),Q(()=>{var j;(j=V.current)==null||j.editor.setTheme(v)},[v],F);let ae=l.useCallback(()=>{var j;if(!(!me.current||!V.current)&&!M.current){K.current(V.current);let E=d||s,R=he(V.current,o||t||"",r||i||"",E||"");S.current=(j=V.current)==null?void 0:j.editor.create(me.current,{model:R,automaticLayout:!0,...C},x),m&&S.current.restoreViewState(Ue.get(E)),V.current.editor.setTheme(v),y!==void 0&&S.current.revealLine(y),L(!0),M.current=!0}},[t,r,s,o,i,d,C,x,m,v,y]);l.useEffect(()=>{F&&be.current(S.current,V.current)},[F]),l.useEffect(()=>{!z&&!F&&ae()},[z,F,ae]),u.current=o,l.useEffect(()=>{var j,E;F&&n&&((j=ee.current)==null||j.dispose(),ee.current=(E=S.current)==null?void 0:E.onDidChangeModelContent(R=>{H.current||n(S.current.getValue(),R)}))},[F,n]),l.useEffect(()=>{if(F){let j=V.current.editor.onDidChangeMarkers(E=>{var oe;let R=(oe=S.current.getModel())==null?void 0:oe.uri;if(R&&E.find(re=>re.path===R.path)){let re=V.current.editor.getModelMarkers({resource:R});I==null||I(re)}});return()=>{j==null||j.dispose()}}return()=>{}},[F,I]);function je(){var j,E;(j=ee.current)==null||j.dispose(),p?m&&Ue.set(d,S.current.saveViewState()):(E=S.current.getModel())==null||E.dispose(),S.current.dispose()}return fe.createElement(Kt,{width:b,height:T,isEditorReady:F,loading:k,_ref:me,className:P,wrapperProps:te})}var Er=Tr,_r=l.memo(Er),Or=_r;const Gt=({value:t,onChange:r,language:s="html",height:o="300px",className:i,placeholder:d,readOnly:v=!1,minimap:y=!1,lineNumbers:k=!0,wordWrap:C=!0})=>{const{theme:x}=ua(),m=l.useRef(null),p=(T,P)=>{m.current=T,P.editor.defineTheme("storyspark-dark",{base:"vs-dark",inherit:!0,rules:[{token:"comment",foreground:"6A737D"},{token:"keyword",foreground:"F97583"},{token:"string",foreground:"9ECBFF"},{token:"number",foreground:"79B8FF"},{token:"tag",foreground:"85E89D"},{token:"attribute.name",foreground:"FFAB70"},{token:"attribute.value",foreground:"9ECBFF"}],colors:{"editor.background":"#030712","editor.foreground":"#f8fafc","editorLineNumber.foreground":"#64748b","editorLineNumber.activeForeground":"#cbd5e1","editor.selectionBackground":"#334155","editor.inactiveSelectionBackground":"#1e293b","editorIndentGuide.background":"#1e293b","editorIndentGuide.activeBackground":"#334155","editorGutter.background":"#030712","editorWidget.background":"#0f172a","editorWidget.border":"#334155","input.background":"#0f172a","input.border":"#334155","dropdown.background":"#0f172a","dropdown.border":"#334155"}}),P.editor.defineTheme("storyspark-light",{base:"vs",inherit:!0,rules:[{token:"comment",foreground:"6A737D"},{token:"keyword",foreground:"D73A49"},{token:"string",foreground:"032F62"},{token:"number",foreground:"005CC5"},{token:"tag",foreground:"22863A"},{token:"attribute.name",foreground:"E36209"},{token:"attribute.value",foreground:"032F62"}],colors:{"editor.background":"#ffffff","editor.foreground":"#0f172a","editorLineNumber.foreground":"#64748b","editorLineNumber.activeForeground":"#334155","editor.selectionBackground":"#e2e8f0","editor.inactiveSelectionBackground":"#f1f5f9","editorIndentGuide.background":"#e2e8f0","editorIndentGuide.activeBackground":"#cbd5e1","editorGutter.background":"#ffffff","editorWidget.background":"#f8fafc","editorWidget.border":"#e2e8f0","input.background":"#ffffff","input.border":"#e2e8f0","dropdown.background":"#ffffff","dropdown.border":"#e2e8f0"}});const te=x==="dark"?"storyspark-dark":"storyspark-light";P.editor.setTheme(te)},b=T=>{r(T||"")};return l.useEffect(()=>{if(m.current){const T=window.monaco;if(T){const P=x==="dark"?"storyspark-dark":"storyspark-light";T.editor.setTheme(P)}}},[x]),e.jsxs("div",{className:xa("monaco-editor-container",i),children:[e.jsx(Or,{height:o,language:s,value:t,onChange:b,onMount:p,options:{readOnly:v,minimap:{enabled:y},lineNumbers:k?"on":"off",wordWrap:C?"on":"off",scrollBeyondLastLine:!1,automaticLayout:!0,fontSize:14,fontFamily:"Fira Code, Monaco, Consolas, monospace",tabSize:2,insertSpaces:!0,formatOnPaste:!0,formatOnType:!0,suggestOnTriggerCharacters:!0,acceptSuggestionOnEnter:"on",quickSuggestions:{other:!0,comments:!1,strings:!0},parameterHints:{enabled:!0},bracketPairColorization:{enabled:!0},guides:{bracketPairs:!0,indentation:!0},renderWhitespace:"selection",renderControlCharacters:!1,smoothScrolling:!0,cursorBlinking:"smooth",cursorSmoothCaretAnimation:"on",mouseWheelZoom:!0,contextmenu:!0,selectOnLineNumbers:!0,glyphMargin:!1,folding:!0,foldingHighlight:!0,showFoldingControls:"mouseover",matchBrackets:"always",renderLineHighlight:"line",fixedOverflowWidgets:!0,overviewRulerLanes:0,hideCursorInOverviewRuler:!0,scrollbar:{vertical:"auto",horizontal:"auto",verticalScrollbarSize:12,horizontalScrollbarSize:12,useShadows:!1,verticalHasArrows:!1,horizontalHasArrows:!1}},loading:e.jsx("div",{className:"flex items-center justify-center h-full",children:e.jsx("div",{className:"animate-spin rounded-full h-8 w-8 border-b-2 border-primary"})})}),d&&!t&&e.jsx("div",{className:"absolute top-4 left-4 text-muted-foreground pointer-events-none",children:d})]})},Pr=t=>{const r=/\{\{([^}]+)\}\}/g,s=t.match(r)||[];return[...new Set(s.map(o=>o.replace(/[{}]/g,"")))]},Ar=()=>{const[t,r]=l.useState([]),[s,o]=l.useState(!1),[i,d]=l.useState(null),v=l.useCallback(async()=>{try{o(!0),d(null);const{data:x,error:m}=await Me.from("email_templates").select("*").order("created_at",{ascending:!1});if(m)throw console.error("Erro ao carregar templates:",m),m;const p=(x||[]).map(b=>{const T=b.html_content||"",P=Pr(T);return{id:b.id,name:b.name,description:b.description||"",subject:b.subject||b.name,html_content:T,text_content:b.text_content||"",template_variables:b.variables||P,variables:b.variables||P,category:b.category||"Geral",is_active:b.is_active!==!1,usage_count:0,created_at:b.created_at||"",updated_at:b.updated_at||"",workspace_id:b.created_by||"default",metadata:{subject:b.subject||b.name,html_content:T,text_content:b.text_content||""}}});r(p),ie({title:"Templates carregados",description:`${p.length} templates encontrados no banco de dados`})}catch(x){const m=x instanceof Error?x.message:"Erro ao carregar templates";d(m),console.error("Erro ao carregar templates:",x),ie({title:"Erro",description:"Não foi possível carregar os templates",variant:"destructive"})}finally{o(!1)}},[]),y=async x=>{try{o(!0);const m={name:x.name||"Novo Template",description:x.description||"",subject:x.subject||"Assunto",html_content:x.html_content||"",text_content:x.text_content||"",category:x.category||"Geral",variables:x.variables||[],is_active:x.is_active!==!1,created_by:"system"},{data:p,error:b}=await Me.from("email_templates").insert([m]).select().single();if(b)throw b;const T={id:p.id,name:p.name,description:p.description||"",subject:p.subject,html_content:p.html_content,text_content:p.text_content||"",template_variables:p.variables||[],variables:p.variables||[],category:p.category,is_active:p.is_active,usage_count:0,created_at:p.created_at,updated_at:p.updated_at||p.created_at,workspace_id:p.created_by,metadata:{subject:p.subject,html_content:p.html_content,text_content:p.text_content||""}};return r(P=>[T,...P]),ie({title:"Template criado",description:`Template "${T.name}" criado com sucesso`}),{data:T,error:null}}catch(m){const p=m instanceof Error?m.message:"Erro ao criar template";return d(p),ie({title:"Erro",description:"Não foi possível criar o template",variant:"destructive"}),{data:null,error:p}}finally{o(!1)}},k=async(x,m)=>{try{o(!0);const p={name:m.name,description:m.description,subject:m.subject,html_content:m.html_content,text_content:m.text_content,category:m.category,variables:m.variables,is_active:m.is_active,updated_at:new Date().toISOString()};Object.keys(p).forEach(T=>{p[T]===void 0&&delete p[T]});const{error:b}=await Me.from("email_templates").update(p).eq("id",x);if(b)throw b;return r(T=>T.map(P=>P.id===x?{...P,...m,updated_at:new Date().toISOString()}:P)),ie({title:"Template atualizado",description:"Template atualizado com sucesso"}),{data:!0,error:null}}catch(p){const b=p instanceof Error?p.message:"Erro ao atualizar template";return d(b),ie({title:"Erro",description:"Não foi possível atualizar o template",variant:"destructive"}),{data:null,error:b}}finally{o(!1)}},C=async x=>{try{o(!0);const{error:m}=await Me.from("email_templates").delete().eq("id",x);if(m)throw m;return r(p=>p.filter(b=>b.id!==x)),ie({title:"Template removido",description:"Template removido com sucesso"}),{data:!0,error:null}}catch(m){const p=m instanceof Error?m.message:"Erro ao deletar template";return d(p),ie({title:"Erro",description:"Não foi possível remover o template",variant:"destructive"}),{data:null,error:p}}finally{o(!1)}};return l.useEffect(()=>{v()},[v]),{templates:t,loading:s,error:i,loadTemplates:v,createTemplate:y,updateTemplate:k,deleteTemplate:C,refreshTemplates:v}},zr=({headerTitle:t,headerSubtitle:r,content:s,customStyles:o=""})=>`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f8fafc;
    }
    
    .container {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      border: 1px solid #e5e7eb;
    }
    
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #f97316;
    }
    
    .logo {
      font-size: 32px;
      font-weight: 700;
      color: #f97316;
      margin-bottom: 10px;
      letter-spacing: -0.5px;
    }
    
    .header-title {
      font-size: 24px;
      font-weight: 600;
      color: #1f2937;
      margin: 15px 0 8px 0;
    }
    
    .header-subtitle {
      font-size: 16px;
      color: #6b7280;
      margin: 0;
    }
    
    .content {
      color: #374151;
      line-height: 1.7;
    }
    
    .content h1, .content h2, .content h3 {
      color: #1f2937;
      margin-top: 25px;
      margin-bottom: 15px;
    }
    
    .content h1 {
      font-size: 24px;
      font-weight: 600;
    }
    
    .content h2 {
      font-size: 20px;
      font-weight: 600;
    }
    
    .content h3 {
      font-size: 18px;
      font-weight: 600;
    }
    
    .content p {
      margin: 15px 0;
    }
    
    .content a {
      color: #f97316;
      text-decoration: underline;
    }
    
    .content a:hover {
      color: #ea580c;
    }
    
    .cta-container {
      text-align: center;
      margin: 30px 0;
    }
    
    .cta-button {
      display: inline-block;
      background: #f97316;
      color: white !important;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      transition: background-color 0.3s;
      box-shadow: 0 2px 4px rgba(249, 115, 22, 0.2);
    }
    
    .cta-button:hover {
      background: #ea580c;
      color: white !important;
    }
    
    .highlight-box {
      background: #fef3c7;
      border: 1px solid #f59e0b;
      color: #92400e;
      padding: 20px;
      border-radius: 8px;
      margin: 25px 0;
    }
    
    .info-box {
      background: #f0f9ff;
      border: 1px solid #0ea5e9;
      color: #0c4a6e;
      padding: 20px;
      border-radius: 8px;
      margin: 25px 0;
    }
    
    .success-box {
      background: #dcfce7;
      border: 1px solid #16a34a;
      color: #15803d;
      padding: 20px;
      border-radius: 8px;
      margin: 25px 0;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }
    
    .footer-logo {
      font-size: 18px;
      font-weight: 600;
      color: #f97316;
      margin-bottom: 10px;
    }
    
    .footer p {
      margin: 5px 0;
    }
    
    .footer a {
      color: #f97316;
      text-decoration: none;
    }
    
    .social-links {
      margin: 15px 0;
    }
    
    .social-links a {
      color: #6b7280;
      text-decoration: none;
      margin: 0 10px;
      font-size: 14px;
    }
    
    /* Responsividade */
    @media (max-width: 600px) {
      body {
        padding: 10px;
      }
      
      .container {
        padding: 20px;
      }
      
      .logo {
        font-size: 28px;
      }
      
      .header-title {
        font-size: 20px;
      }
      
      .cta-button {
        padding: 12px 24px;
        font-size: 14px;
      }
    }
    
    ${o}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">StorySpark</div>
      <h1 class="header-title">${t}</h1>
      ${r?`<p class="header-subtitle">${r}</p>`:""}
    </div>
    
    ${s}
    
    <div class="footer">
      <div class="footer-logo">StorySpark</div>
      <p>Plataforma de Marketing de Conteúdo com IA</p>
      <p>© ${new Date().getFullYear()} StorySpark. Todos os direitos reservados.</p>
      <div class="social-links">
        <a href="#">Política de Privacidade</a> | 
        <a href="#">Termos de Uso</a> | 
        <a href="#">Cancelar Inscrição</a>
      </div>
    </div>
  </div>
</body>
</html>`,Mr=[{id:"waitlist-invite",name:"Template para convite da waitlist",category:"Marketing",description:"Template para convite da waitlist com código exclusivo",subject:"Seu convite especial chegou! 🎉 - StorySpark",headerTitle:"Bem-vindo à nossa Waitlist! 🎉",headerSubtitle:"Seu lugar está garantido",content:`
      <div class="content">
        <div class="success-box">
          <h3 style="margin: 0 0 10px 0; color: #15803d; font-size: 18px; font-weight: 600;">✅ Convite Confirmado!</h3>
          <p style="margin: 0; color: #15803d;">Você está na posição <strong>#{{waitlistPosition}}</strong> da nossa waitlist</p>
        </div>
        
        <p>Olá <strong>{{userName}}</strong>!</p>
        
        <p>Que ótimo ter você conosco! Você demonstrou interesse em:</p>
        <div class="highlight-box">
          <p style="margin: 0; color: #92400e; font-weight: 600;">{{selectedIdeas}}</p>
        </div>
        
        <p>Seu código de convite exclusivo é:</p>
        <div style="background: #1f2937; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0; font-family: 'Courier New', monospace;">
          <span style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">{{inviteCode}}</span>
        </div>
        
        <div class="cta-container">
          <a href="{{loginUrl}}" class="cta-button">Acessar Plataforma</a>
        </div>
        
        <p>Em breve você receberá mais informações sobre o lançamento e funcionalidades exclusivas!</p>
        
        <p style="margin-top: 30px;">
          Atenciosamente,<br>
          <strong>Equipe StorySpark</strong>
        </p>
      </div>
    `,textContent:`Bem-vindo à nossa Waitlist! 🎉

Olá {{userName}}!

✅ Convite Confirmado!
Você está na posição #{{waitlistPosition}} da nossa waitlist

Você demonstrou interesse em: {{selectedIdeas}}

Seu código de convite exclusivo é: {{inviteCode}}

Acessar Plataforma: {{loginUrl}}

Em breve você receberá mais informações sobre o lançamento e funcionalidades exclusivas!

Atenciosamente,
Equipe StorySpark

© 2024 StorySpark. Todos os direitos reservados.`,customStyles:`
      .invite-code {
        background: #1f2937;
        color: white;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        margin: 25px 0;
        font-family: 'Courier New', monospace;
      }
      
      .invite-code span {
        font-size: 24px;
        font-weight: bold;
        letter-spacing: 2px;
      }
    `},{id:"welcome-email",name:"E-mail de Boas-vindas",category:"Transacional",description:"Email de boas-vindas para novos usuários",subject:"Bem-vindo ao StorySpark! 🚀",headerTitle:"Bem-vindo ao StorySpark! 🚀",headerSubtitle:"Sua jornada para criar copies incríveis começa agora",content:`
      <div class="content">
        <p>Olá <strong>{{userName}}</strong>!</p>
        
        <p>É com grande alegria que damos as boas-vindas ao StorySpark! Você agora faz parte de uma comunidade que está revolucionando a criação de conteúdo com inteligência artificial.</p>
        
        <div class="info-box">
          <h3 style="margin: 0 0 15px 0; color: #0c4a6e; font-size: 18px; font-weight: 600;">🎯 Primeiros Passos</h3>
          <p style="margin: 0; color: #0c4a6e;">
            1. Complete seu perfil<br>
            2. Explore nossos templates<br>
            3. Crie sua primeira copy
          </p>
        </div>
        
        <p>Para começar, acesse sua conta e explore todas as funcionalidades que preparamos para você:</p>
        
        <div class="cta-container">
          <a href="{{accountUrl}}" class="cta-button">Acessar Minha Conta</a>
        </div>
        
        <p>Se você tiver alguma dúvida ou precisar de ajuda, nossa equipe está sempre disponível em <a href="mailto:{{supportEmail}}" style="color: #f97316;">{{supportEmail}}</a>.</p>
        
        <p style="margin-top: 30px;">
          Vamos criar algo incrível juntos!<br>
          <strong>Equipe StorySpark</strong>
        </p>
      </div>
    `,textContent:`Bem-vindo ao StorySpark! 🚀

Olá {{userName}}!

É com grande alegria que damos as boas-vindas ao StorySpark! Você agora faz parte de uma comunidade que está revolucionando a criação de conteúdo com inteligência artificial.

🎯 Primeiros Passos:
1. Complete seu perfil
2. Explore nossos templates  
3. Crie sua primeira copy

Para começar, acesse sua conta: {{accountUrl}}

Se você tiver alguma dúvida ou precisar de ajuda, nossa equipe está sempre disponível em {{supportEmail}}.

Vamos criar algo incrível juntos!
Equipe StorySpark

© 2024 StorySpark. Todos os direitos reservados.`},{id:"newsletter-promocional",name:"Newsletter Promocional",category:"Marketing",description:"Template para newsletters promocionais e ofertas especiais",subject:"🎯 Oferta Especial: {{discountPercentage}} OFF em {{productName}}!",headerTitle:"🎯 Oferta Especial para Você!",headerSubtitle:"Não perca esta oportunidade única",content:`
      <div class="content">
        <p>Olá <strong>{{userName}}</strong>!</p>
        
        <p>Temos uma oferta especial preparada especialmente para você!</p>
        
        <div class="highlight-box">
          <h3 style="margin: 0 0 15px 0; color: #92400e; font-size: 20px; font-weight: 600;">🔥 {{discountPercentage}} OFF</h3>
          <p style="margin: 0; color: #92400e; font-size: 18px; font-weight: 600;">{{productName}}</p>
        </div>
        
        <p><strong>{{productDescription}}</strong></p>
        
        <p>Use o código promocional:</p>
        <div style="background: #f97316; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <span style="font-size: 20px; font-weight: bold; letter-spacing: 1px;">{{discountCode}}</span>
        </div>
        
        <div class="cta-container">
          <a href="{{promotionUrl}}" class="cta-button">Aproveitar Oferta</a>
        </div>
        
        <p style="color: #dc2626; font-weight: 600;">⏰ Oferta válida por tempo limitado!</p>
        
        <p>Não perca esta oportunidade de transformar sua estratégia de conteúdo.</p>
        
        <p style="margin-top: 30px;">
          Atenciosamente,<br>
          <strong>Equipe StorySpark</strong>
        </p>
      </div>
    `,textContent:`🎯 Oferta Especial para Você!

Olá {{userName}}!

Temos uma oferta especial preparada especialmente para você!

🔥 {{discountPercentage}} OFF
{{productName}}

{{productDescription}}

Use o código promocional: {{discountCode}}

Aproveitar oferta: {{promotionUrl}}

⏰ Oferta válida por tempo limitado!

Não perca esta oportunidade de transformar sua estratégia de conteúdo.

Atenciosamente,
Equipe StorySpark

© 2024 StorySpark. Todos os direitos reservados.`},{id:"order-confirmation",name:"Confirmação de Pedido",category:"Transacional",description:"Template para confirmação de pedidos e compras",subject:"Pedido confirmado #{{orderNumber}} - StorySpark",headerTitle:"Pedido Confirmado! ✅",headerSubtitle:"Obrigado pela sua compra",content:`
      <div class="content">
        <div class="success-box">
          <h3 style="margin: 0 0 10px 0; color: #15803d; font-size: 18px; font-weight: 600;">✅ Pedido Confirmado</h3>
          <p style="margin: 0; color: #15803d;">Pedido #{{orderNumber}} confirmado com sucesso!</p>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f97316;">
          <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px; font-weight: 600;">Detalhes do Pedido</h3>
          <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
            <span>Número do Pedido:</span>
            <span><strong>{{orderNumber}}</strong></span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
            <span>Data do Pedido:</span>
            <span>{{orderDate}}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 15px 0 0 0; font-weight: bold; border-top: 2px solid #f97316; margin-top: 10px;">
            <span>Total:</span>
            <span><strong>{{orderTotal}}</strong></span>
          </div>
        </div>
        
        <div class="cta-container">
          <a href="{{orderUrl}}" class="cta-button">Ver Detalhes do Pedido</a>
        </div>
        
        <p>Seu pedido está sendo processado e você receberá uma confirmação em breve.</p>
        
        <p>Se você tiver alguma dúvida sobre seu pedido, entre em contato conosco em <a href="mailto:{{supportEmail}}" style="color: #f97316;">{{supportEmail}}</a>.</p>
        
        <p style="margin-top: 30px;">
          Atenciosamente,<br>
          <strong>Equipe StorySpark</strong>
        </p>
      </div>
    `,textContent:`Pedido Confirmado #{{orderNumber}}

Olá,

Seu pedido foi confirmado com sucesso!

Detalhes do Pedido:
- Número: {{orderNumber}}
- Data: {{orderDate}}
- Total: {{orderTotal}}

Ver detalhes: {{orderUrl}}

Seu pedido está sendo processado e você receberá uma confirmação em breve.

Se você tiver alguma dúvida sobre seu pedido, entre em contato conosco em {{supportEmail}}.

Atenciosamente,
Equipe StorySpark

© 2024 StorySpark. Todos os direitos reservados.`}],Rr=async()=>{console.log("🔄 Iniciando atualização de templates no banco de dados...");for(const t of Mr)try{const r=zr({headerTitle:t.headerTitle,headerSubtitle:t.headerSubtitle,content:t.content,customStyles:t.customStyles}),{data:s,error:o}=await He.from("templates").select("*").eq("name",t.name).eq("type","EMAIL").single();if(o&&o.code!=="PGRST116"){console.error(`Erro ao buscar template ${t.name}:`,o);continue}const i={name:t.name,type:"EMAIL",category:t.category,description:t.description,subject:t.subject,content:r,text_content:t.textContent,is_public:!0,template_variables:Dr(t.content+t.subject),user_id:null,workspace_id:"public",metadata:{email_template_id:t.id,migrated_from_code:!0,migration_date:new Date().toISOString(),uses_branded_template:!0,header_title:t.headerTitle,header_subtitle:t.headerSubtitle,custom_styles:t.customStyles}};if(s){const{error:d}=await He.from("templates").update(i).eq("id",s.id);d?console.error(`Erro ao atualizar template ${t.name}:`,d):console.log(`✅ Template ${t.name} atualizado com sucesso`)}else{const{error:d}=await He.from("templates").insert(i);d?console.error(`Erro ao criar template ${t.name}:`,d):console.log(`✅ Template ${t.name} criado com sucesso`)}}catch(r){console.error(`Erro ao processar template ${t.name}:`,r)}console.log("🎉 Atualização de templates concluída!")},Dr=t=>{const r=/\{\{([^}]+)\}\}/g,s=[];let o;for(;(o=r.exec(t))!==null;){const i=o[1].trim();s.includes(i)||s.push(i)}return s},nt=({html:t,width:r})=>{const s=l.useRef(null);return l.useEffect(()=>{var C;const o=s.current;if(!o)return;const i=o.contentDocument||((C=o.contentWindow)==null?void 0:C.document);if(!i)return;try{i.open(),i.write(t||"<html><head><style>body{margin:0;padding:16px;font-family:system-ui,Segoe UI,Roboto,sans-serif;color:#6b7280;background-color:#ffffff}</style></head><body>Sem conteúdo HTML</body></html>"),i.close()}catch{}const d=()=>{if(!o.contentDocument)return;const x=o.contentDocument.body,m=o.contentDocument.documentElement,p=Math.max((x==null?void 0:x.scrollHeight)||0,(x==null?void 0:x.offsetHeight)||0,(m==null?void 0:m.clientHeight)||0,(m==null?void 0:m.scrollHeight)||0,(m==null?void 0:m.offsetHeight)||0);o.style.height=Math.min(Math.max(p,300),1400)+"px"},v=setTimeout(d,50),y=setTimeout(d,250);let k=null;try{k=new MutationObserver(()=>d()),k.observe(i.documentElement,{childList:!0,subtree:!0,attributes:!0})}catch{}return()=>{clearTimeout(v),clearTimeout(y),k==null||k.disconnect()}},[t]),e.jsx("div",{className:"border rounded-lg overflow-hidden",style:{width:r||"100%",backgroundColor:"transparent"},children:e.jsx("iframe",{ref:s,title:"Email Preview",className:"w-full",style:{height:300,border:"none",backgroundColor:"white"}})})},Zr=()=>{var ft,vt,bt,jt,yt,wt,St,Nt,kt,Ct,Tt,Et,_t;const{templates:t,loading:r,error:s,createTemplate:o,updateTemplate:i,deleteTemplate:d,loadTemplates:v}=Ar(),[y,k]=l.useState(""),[C,x]=l.useState("all"),[m,p]=l.useState("all"),[b,T]=l.useState(!1),[P,te]=l.useState(!1),[ve,U]=l.useState(!1),[n,I]=l.useState(null),[F,L]=l.useState("templates"),[z,de]=l.useState("html"),[V,S]=l.useState(!1),[me,be]=l.useState("templates"),[K,ee]=l.useState({}),[u,N]=l.useState({}),[M,H]=l.useState(""),[ae,je]=l.useState(600),[j,E]=l.useState(600),[R,oe]=l.useState(!1),[re,it]=l.useState(!1),[$e,ct]=l.useState(!1),[qe,lt]=l.useState(!1);l.useEffect(()=>{if(n&&P){const a={};n.variables.forEach(c=>{a[c]=mt(c)}),N(a)}},[n,P]);const[dt]=l.useState([{id:"1",name:"Newsletter Semanal",subject:"Novidades da Semana",status:"sent",recipients:1250,opens:875,clicks:234,sent_at:"2024-01-15T10:00:00Z",template_name:"Newsletter Promocional"},{id:"2",name:"Promoção Black Friday",subject:"Ofertas Imperdíveis - Black Friday",status:"scheduled",recipients:2500,opens:0,clicks:0,scheduled_for:"2024-01-20T09:00:00Z",template_name:"Newsletter Promocional"},{id:"3",name:"Onboarding Novos Usuários",subject:"Bem-vindo à nossa plataforma!",status:"draft",recipients:0,opens:0,clicks:0,template_name:"E-mail de Boas-vindas"}]),[Ae]=l.useState([{id:"1",name:"Lista Principal",description:"Todos os usuários ativos da plataforma",subscribers:1250,createdAt:"2024-01-01T00:00:00Z",status:"active",type:"geral",growthRate:12.5},{id:"2",name:"Novos Usuários",description:"Usuários cadastrados nos últimos 30 dias",subscribers:180,createdAt:"2024-01-10T00:00:00Z",status:"active",type:"segmentada",growthRate:8.3},{id:"3",name:"Usuários Premium",description:"Usuários com planos pagos",subscribers:320,createdAt:"2023-12-15T00:00:00Z",status:"active",type:"premium",growthRate:15.7}]),[xe]=l.useState({totalSent:15420,openRate:24.5,clickRate:3.2,totalSubscribers:1250,recentCampaigns:[{id:"1",name:"Newsletter Semanal",subject:"Novidades desta semana",recipients:1250,opens:356,clicks:51,revenue:2840.5,sentAt:"2024-01-15T10:00:00Z"},{id:"2",name:"Promoção Especial",subject:"Ofertas imperdíveis só hoje!",recipients:2100,opens:674,clicks:122,revenue:4125.75,sentAt:"2024-01-12T14:30:00Z"},{id:"3",name:"Update de Produto",subject:"Novidades da plataforma",recipients:950,opens:183,clicks:20,revenue:890.25,sentAt:"2024-01-10T09:15:00Z"}]}),[h,se]=l.useState({name:"",description:"",subject:"",html_content:"",text_content:"",variables:[],tags:["email"],category:"Sistema"}),aa=async()=>{ct(!0);try{await Rr(),await v(),A.success("Templates atualizados com design StorySpark!")}catch(a){console.error("Erro ao atualizar templates:",a),A.error("Erro ao atualizar templates")}finally{ct(!1)}},ra=[{name:"Convite da Waitlist",category:"Sistema",description:"Template para convites de saída da waitlist com acesso à plataforma",subject:et.subject,html_content:et.html,text_content:et.text},{name:"Confirmação da Waitlist",category:"Sistema",description:"Template de confirmação da waitlist com estilo StorySpark",subject:"Obrigado por se juntar à nossa waitlist! 🎉",html_content:`<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmação da Waitlist - StorySpark</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
            min-height: 100vh;
        }
        
        .container {
            background: white;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #f97316;
        }
        
        .logo {
            font-size: 32px;
            font-weight: 700;
            background: linear-gradient(135deg, #f97316, #fb923c);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        
        .highlight-box {
            background: #f8fafc;
            border: 2px solid #f97316;
            color: #1f2937;
            padding: 25px;
            border-radius: 12px;
            margin: 30px 0;
            text-align: center;
        }
        
        .position-box {
            background: #f8fafc;
            border: 2px solid #f97316;
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            margin: 25px 0;
        }
        
        .cta-button {
            background: linear-gradient(135deg, #f97316, #fb923c);
            color: white;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            display: inline-block;
        }
        
        .footer {
            margin-top: 50px;
            padding: 30px 0 20px 0;
            border-top: 2px solid #e2e8f0;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
        }
        
        .footer-links a {
            color: #f97316;
            text-decoration: none;
            margin: 0 15px;
        }
        
        /* Responsividade para mobile */
        @media only screen and (max-width: 600px) {
            body {
                padding: 10px !important;
            }
            
            .container {
                padding: 20px !important;
            }
            
            .logo {
                font-size: 24px !important;
            }
            
            .header h1 {
                font-size: 20px !important;
            }
            
            .position-box div {
                font-size: 24px !important;
            }
            
            .cta-button {
                padding: 12px 24px !important;
                font-size: 14px !important;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">StorySpark</div>
            <h1>Obrigado por se juntar à nossa waitlist!</h1>
            <p>Você está na nossa lista de espera exclusiva</p>
        </div>
        
        <div>
            <p>Olá <strong>{{name}}</strong>,</p>
            
            <div class="highlight-box">
                <h3>🎉 Você está na lista!</h3>
                <p>Em breve você receberá acesso exclusivo</p>
            </div>
            
            <div class="position-box">
                <p>Sua posição na fila:</p>
                <div style="font-size: 32px; font-weight: 700; color: #f97316; line-height: 1.2;">{{position}}</div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{website_url}}" class="cta-button">Visitar Site</a>
            </div>
            
            <p>Atenciosamente,<br><strong>Equipe StorySpark</strong></p>
        </div>
        
        <div class="footer">
            <div style="font-size: 20px; font-weight: 700; background: linear-gradient(135deg, #f97316, #fb923c); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">StorySpark</div>
            <div style="margin: 20px 0;">
                <a href="https://storyspark.com">Website</a> |
                <a href="https://blog.storyspark.com">Blog</a> |
                <a href="mailto:suporte@storyspark.com">Suporte</a>
            </div>
            <p>© 2024 StorySpark. Todos os direitos reservados.</p>
            <div style="margin-top: 20px; font-size: 12px;">
                <a href="{{unsubscribe_url}}">Cancelar inscrição</a>
            </div>
        </div>
    </div>
</body>
</html>`,text_content:"Obrigado por se juntar à nossa waitlist! Posição: {{position}}. Visite: {{website_url}}"},{name:"Newsletter Promocional",category:"Marketing",description:"Template para campanhas promocionais e ofertas especiais",subject:"🎯 Oferta Especial StorySpark - {{discountPercentage}} de desconto!",html_content:`<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Oferta Especial - StorySpark</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
        }
        .container {
            background: white;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 32px;
            font-weight: 700;
            background: linear-gradient(135deg, #f97316, #fb923c);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        .promo-box {
            background: linear-gradient(135deg, #f97316, #fb923c);
            color: white;
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            margin: 30px 0;
        }
        .discount {
            font-size: 48px;
            font-weight: bold;
            margin: 15px 0;
        }
        .button {
            background: white;
            color: #f97316;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            display: inline-block;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
        }
        .footer a {
            color: #f97316;
            text-decoration: none;
            margin: 0 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">StorySpark</div>
            <p style="color: #6b7280; margin: 0;">Transforme suas ideias em histórias incríveis</p>
        </div>
        
        <h1 style="color: #1f2937; text-align: center;">🎯 Oferta Especial StorySpark</h1>
        
        <p>Olá {{nome}},</p>
        
        <p>Temos uma oferta especial para você! Por tempo limitado, você pode acessar todos os recursos premium do StorySpark com um desconto incrível.</p>
        
        <div class="promo-box">
            <h2 style="margin: 0 0 10px 0;">OFERTA ESPECIAL</h2>
            <div class="discount">{{discountPercentage}}% OFF</div>
            <p style="margin: 0;">Em todos os planos anuais</p>
            <a href="{{offerUrl}}" class="button">APROVEITAR OFERTA</a>
        </div>
        
        <h3>✨ O que você vai ter acesso:</h3>
        <ul style="color: #4b5563;">
            <li>Geração ilimitada de conteúdo com IA</li>
            <li>Templates premium exclusivos</li>
            <li>Análises avançadas de performance</li>
            <li>Suporte prioritário 24/7</li>
            <li>Integração com todas as redes sociais</li>
        </ul>
        
        <p style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
            ⚡ <strong>Atenção:</strong> Esta oferta é válida apenas até {{expirationDate}}. Não perca!
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{offerUrl}}" style="background: linear-gradient(135deg, #f97316, #fb923c); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                🚀 COMEÇAR AGORA
            </a>
        </div>
        
        <p>Tem dúvidas? Entre em contato conosco respondendo este e-mail ou através do nosso suporte.</p>
        
        <p>Atenciosamente,<br>
        <strong>Equipe StorySpark</strong></p>
        
        <div class="footer">
            <div style="font-size: 20px; font-weight: 700; background: linear-gradient(135deg, #f97316, #fb923c); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">StorySpark</div>
            <div style="margin: 20px 0;">
                <a href="https://storyspark.com">Website</a> |
                <a href="https://blog.storyspark.com">Blog</a> |
                <a href="mailto:suporte@storyspark.com">Suporte</a>
            </div>
            <p>© 2024 StorySpark. Todos os direitos reservados.</p>
            <div style="margin-top: 20px; font-size: 12px;">
                <a href="{{unsubscribe_url}}">Cancelar inscrição</a>
            </div>
        </div>
    </div>
</body>
</html>`,text_content:"Oferta especial: {{discountPercentage}}% OFF em todos os planos anuais do StorySpark. Aproveite até {{expirationDate}}!"},{name:"Convite da Waitlist",category:"Sistema",description:"Template para convite de usuários que saíram da waitlist",subject:"Bem-vindo ao StorySpark! Sua conta está pronta 🚀",html_content:`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Bem-vindo ao futuro do marketing! - StorySpark</title>
  <style>
    /* Reset e base */
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    
    /* Estilos da marca StorySpark */
    body {
      margin: 0 !important;
      padding: 0 !important;
      background-color: #f8fafc !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif !important;
      font-size: 16px;
      line-height: 1.6;
      color: #374151 !important;
    }
    
    /* Container principal */
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff !important;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    
    .content-wrapper {
      padding: 40px 30px;
    }
    
    /* Header com marca */
    .brand-header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .brand-logo {
      font-size: 28px;
      font-weight: bold;
      color: #f97316 !important;
      margin-bottom: 10px;
      text-decoration: none;
      display: inline-block;
    }
    
    .brand-title {
      font-size: 24px;
      font-weight: 600;
      color: #1f2937 !important;
      margin: 10px 0;
      line-height: 1.3;
    }
    
    .brand-subtitle {
      color: #6b7280 !important;
      font-size: 16px;
      margin: 0;
    }
    
    /* Elementos de conteúdo */
    .content p {
      margin: 16px 0;
      color: #374151 !important;
    }
    
    .highlight-box {
      background: linear-gradient(135deg, #f97316 0%, #fb923c 100%) !important;
      color: #ffffff !important;
      padding: 25px 20px;
      border-radius: 12px;
      text-align: center;
      margin: 30px 0;
    }
    
    .highlight-box h3 {
      margin: 0 0 10px 0;
      color: #ffffff !important;
      font-size: 20px;
      font-weight: 600;
    }
    
    .highlight-box p {
      margin: 0;
      font-size: 16px;
      color: #ffffff !important;
    }
    
    /* Código de convite/destaque */
    .invite-code {
      font-size: 20px;
      font-weight: bold;
      letter-spacing: 2px;
      margin: 10px 0;
      color: #ffffff !important;
      font-family: 'Courier New', monospace;
    }
    
    /* Botões CTA */
    .cta-container {
      text-align: center;
      margin: 30px 0;
    }
    
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #f97316 0%, #fb923c 100%) !important;
      color: #ffffff !important;
      padding: 16px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
      transition: all 0.3s ease;
    }
    
    /* Seções de features/benefícios */
    .features-section {
      margin: 30px 0;
    }
    
    .feature {
      display: flex;
      align-items: center;
      margin: 15px 0;
      padding: 10px;
      background: #f8fafc !important;
      border-radius: 6px;
    }
    
    .feature-icon {
      width: 20px;
      height: 20px;
      margin-right: 12px;
      color: #f97316 !important;
      font-size: 16px;
    }
    
    /* Rodapé padrão da marca */
    .brand-footer {
      margin-top: 40px;
      padding: 30px;
      background-color: #f7fafc !important;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280 !important;
      font-size: 14px;
    }
    
    .brand-footer p {
      margin: 8px 0;
      color: #6b7280 !important;
    }
    
    .brand-footer a {
      color: #f97316 !important;
      text-decoration: none;
    }
    
    .social-links {
      margin: 20px 0;
    }
    
    .social-links a {
      color: #f97316 !important;
      text-decoration: none;
      margin: 0 10px;
    }
    
    .unsubscribe-text {
      font-size: 12px;
      margin-top: 10px;
      color: #9ca3af !important;
    }
    
    /* Responsive */
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        margin: 10px !important;
      }
      
      .content-wrapper {
        padding: 20px 15px !important;
      }
      
      .brand-title {
        font-size: 20px !important;
      }
      
      .brand-logo {
        font-size: 24px !important;
      }
      
      .cta-button {
        padding: 14px 24px !important;
        font-size: 14px !important;
      }
      
      .highlight-box {
        padding: 20px 15px !important;
      }
      
      .brand-footer {
        padding: 25px 20px !important;
      }
    }
  </style>
</head>
<body>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td style="padding: 20px 0;">
        <table class="email-container" role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
          <tr>
            <td class="content-wrapper">
              <div class="brand-header">
                <div class="brand-logo">StorySpark</div>
                <h1 class="brand-title">Bem-vindo ao futuro do marketing!</h1>
                <p class="brand-subtitle">Sua conta está pronta para criar copies incríveis com IA</p>
              </div>
              
              <div class="content">
                <p>Olá <strong>{{userName}}</strong>,</p>
                
                <p>Estamos muito animados em tê-lo conosco! Você saiu da waitlist e sua conta no StorySpark está oficialmente ativa.</p>
                
                <div class="highlight-box">
                  <p style="margin: 0; font-size: 16px;">Seu código de convite:</p>
                  <div class="invite-code">{{inviteCode}}</div>
                  <p style="margin: 0; font-size: 14px; opacity: 0.9;">Use este código para ativar recursos premium</p>
                </div>
                
                <div class="cta-container">
                  <a href="{{loginUrl}}" class="cta-button">Acessar Minha Conta</a>
                </div>
                
                <div class="features-section">
                  <h3 style="color: #1f2937; margin-bottom: 20px; text-align: center;">O que você pode fazer agora:</h3>
                  
                  <div class="feature">
                    <span class="feature-icon">✨</span>
                    <span>Criar copies persuasivos com IA avançada</span>
                  </div>
                  
                  <div class="feature">
                    <span class="feature-icon">🎯</span>
                    <span>Gerenciar campanhas de marketing digital</span>
                  </div>
                  
                  <div class="feature">
                    <span class="feature-icon">📊</span>
                    <span>Analisar performance e otimizar resultados</span>
                  </div>
                  
                  <div class="feature">
                    <span class="feature-icon">🚀</span>
                    <span>Acessar templates profissionais prontos</span>
                  </div>
                </div>
                
                <p>Se você tiver alguma dúvida ou precisar de ajuda, nossa equipe está sempre disponível em <a href="mailto:{{supportEmail}}" style="color: #f97316;">{{supportEmail}}</a>.</p>
                
                <p>Vamos criar algo incrível juntos!</p>
                
                <p style="margin-top: 30px; text-align: center;">
                  Atenciosamente,<br>
                  <strong>Equipe StorySpark</strong>
                </p>
              </div>
              
              <div class="brand-footer">
                <div class="social-links">
                  <a href="https://storyspark.com">Website</a> |
                  <a href="https://storyspark.com/blog">Blog</a> |
                  <a href="mailto:suporte@storyspark.com">Suporte</a>
                </div>
                <p>© 2024 StorySpark. Todos os direitos reservados.</p>
                <p class="unsubscribe-text">
                  Você está recebendo este e-mail porque se inscreveu em nossa waitlist.
                  <a href="#unsubscribe">Cancelar inscrição</a>
                </p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,text_content:`Bem-vindo ao StorySpark!

Olá {{userName}},

Estamos muito animados em tê-lo conosco! Você saiu da waitlist e sua conta no StorySpark está oficialmente ativa.

Seu código de convite: {{inviteCode}}

Acesse sua conta em: {{loginUrl}}

O que você pode fazer agora:
✨ Criar copies persuasivos com IA avançada
🎯 Gerenciar campanhas de marketing digital
📊 Analisar performance e otimizar resultados
🚀 Acessar templates profissionais prontos

Se você tiver alguma dúvida ou precisar de ajuda, nossa equipe está sempre disponível em {{supportEmail}}.

Vamos criar algo incrível juntos!

Atenciosamente,
Equipe StorySpark

© 2024 StorySpark. Todos os direitos reservados.`},{name:"Newsletter Promocional",category:"Marketing",description:"Template responsivo para newsletters promocionais com design StorySpark",subject:"Oferta especial só para você! 🎉",html_content:`<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Newsletter Promocional - StorySpark</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
        }
        .container {
            background: white;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 32px;
            font-weight: 700;
            background: linear-gradient(135deg, #f97316, #fb923c);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        .highlight-box {
            background: linear-gradient(135deg, #f97316, #fb923c);
            color: white;
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            margin: 30px 0;
        }
        .cta-button {
            background: linear-gradient(135deg, #f97316, #fb923c);
            color: white;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            display: inline-block;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
        }
        .footer a {
            color: #f97316;
            text-decoration: none;
            margin: 0 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">StorySpark</div>
            <h1>Newsletter Promocional</h1>
            <p style="color: #6b7280;">Aproveite nossa promoção exclusiva</p>
        </div>
        
        <p>Olá <strong>{{userName}}</strong>,</p>
        
        <p>{{mainMessage}}</p>
        
        <div class="highlight-box">
            <h3>{{offerTitle}}</h3>
            <p>{{offerDescription}}</p>
        </div>
        
        <div style="text-align: center;">
            <a href="{{ctaUrl}}" class="cta-button">{{ctaText}}</a>
        </div>
        
        <p>{{closingMessage}}</p>
        
        <p style="text-align: center; margin-top: 30px;">
            Atenciosamente,<br>
            <strong>Equipe StorySpark</strong>
        </p>
        
        <div class="footer">
            <div style="font-size: 20px; font-weight: 700; background: linear-gradient(135deg, #f97316, #fb923c); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">StorySpark</div>
            <div style="margin: 20px 0;">
                <a href="https://storyspark.com">Website</a> |
                <a href="https://blog.storyspark.com">Blog</a> |
                <a href="mailto:suporte@storyspark.com">Suporte</a>
            </div>
            <p>© 2024 StorySpark. Todos os direitos reservados.</p>
            <div style="margin-top: 20px; font-size: 12px;">
                <a href="{{unsubscribe_url}}">Cancelar inscrição</a>
            </div>
        </div>
    </div>
</body>
</html>`,text_content:`{{title}}

Olá {{userName}},

{{mainMessage}}

{{offerTitle}}
{{offerDescription}}

{{ctaText}}: {{ctaUrl}}

{{closingMessage}}

Atenciosamente,
{{senderName}}

© 2024 StorySpark. Todos os direitos reservados.

Cancelar inscrição: {{unsubscribeUrl}}
Preferências: {{preferencesUrl}}`},{name:"E-mail de Boas-vindas",category:"Transacional",description:"Template de boas-vindas para novos usuários com design StorySpark",subject:"Bem-vindo(a) ao StorySpark! 🎉",html_content:`<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bem-vindo ao StorySpark</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
        }
        .container {
            background: white;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 32px;
            font-weight: 700;
            background: linear-gradient(135deg, #f97316, #fb923c);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        .welcome-box {
            background: linear-gradient(135deg, #f97316, #fb923c);
            color: white;
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            margin: 30px 0;
        }
        .cta-button {
            background: linear-gradient(135deg, #f97316, #fb923c);
            color: white;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            display: inline-block;
            margin: 20px 0;
        }
        .steps {
            margin: 30px 0;
        }
        .step {
            display: flex;
            align-items: flex-start;
            margin: 20px 0;
            padding: 20px;
            background: #f8fafc;
            border-radius: 12px;
            border-left: 4px solid #f97316;
        }
        .step-number {
            background: #f97316;
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin-right: 15px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
        }
        .footer a {
            color: #f97316;
            text-decoration: none;
            margin: 0 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">StorySpark</div>
            <h1>Bem-vindo(a), {{userName}}! 🎉</h1>
            <p style="color: #6b7280;">{{welcomeMessage}}</p>
        </div>
        
        <div class="welcome-box">
            <h3>🎉 Sua conta está ativa!</h3>
            <p>{{introMessage}}</p>
        </div>
        
        <div style="text-align: center;">
            <a href="{{dashboardUrl}}" class="cta-button">{{ctaText}}</a>
        </div>
        
        <div class="steps">
            <h3 style="color: #1f2937; margin-bottom: 20px; text-align: center;">Primeiros passos:</h3>
            
            <div class="step">
                <div class="step-number">1</div>
                <div>
                    <h4>{{step1Title}}</h4>
                    <p>{{step1Description}}</p>
                </div>
            </div>
            
            <div class="step">
                <div class="step-number">2</div>
                <div>
                    <h4>{{step2Title}}</h4>
                    <p>{{step2Description}}</p>
                </div>
            </div>
            
            <div class="step">
                <div class="step-number">3</div>
                <div>
                    <h4>{{step3Title}}</h4>
                    <p>{{step3Description}}</p>
                </div>
            </div>
        </div>
        
        <p>Se você tiver alguma dúvida, nossa equipe está sempre disponível em <a href="mailto:{{supportEmail}}" style="color: #f97316;">{{supportEmail}}</a>.</p>
        
        <p>Vamos criar algo incrível juntos!</p>
        
        <p style="text-align: center; margin-top: 30px;">
            Atenciosamente,<br>
            <strong>Equipe StorySpark</strong>
        </p>
        
        <div class="footer">
            <div style="font-size: 20px; font-weight: 700; background: linear-gradient(135deg, #f97316, #fb923c); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">StorySpark</div>
            <div style="margin: 20px 0;">
                <a href="https://storyspark.com">Website</a> |
                <a href="https://blog.storyspark.com">Blog</a> |
                <a href="mailto:suporte@storyspark.com">Suporte</a>
            </div>
            <p>© 2024 StorySpark. Todos os direitos reservados.</p>
            <div style="margin-top: 20px; font-size: 12px;">
                <a href="{{unsubscribe_url}}">Cancelar inscrição</a>
            </div>
        </div>
    </div>
</body>
</html>`,text_content:`Bem-vindo(a) ao StorySpark!

Olá {{userName}},

{{introMessage}}

{{ctaText}}: {{dashboardUrl}}

Primeiros passos:
1. {{step1Title}} - {{step1Description}}
2. {{step2Title}} - {{step2Description}}
3. {{step3Title}} - {{step3Description}}

{{supportMessage}} {{supportEmail}}

{{closingMessage}}
{{senderName}}

© 2024 StorySpark. Todos os direitos reservados.`},{name:"Confirmação de Pedido",category:"Transacional",description:"Template para confirmação de pedidos e compras",subject:"Pedido confirmado #{{orderNumber}} - StorySpark",html_content:`<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pedido Confirmado - StorySpark</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
        }
        .container {
            background: white;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 32px;
            font-weight: 700;
            background: linear-gradient(135deg, #f97316, #fb923c);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        .status-box {
            background: #dcfce7;
            border: 1px solid #16a34a;
            color: #15803d;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 25px 0;
        }
        .order-details {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
            border-left: 4px solid #f97316;
        }
        .order-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .cta-button {
            background: linear-gradient(135deg, #f97316, #fb923c);
            color: white;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            display: inline-block;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
        }
        .footer a {
            color: #f97316;
            text-decoration: none;
            margin: 0 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">StorySpark</div>
            <h1>Pedido Confirmado! ✅</h1>
            <p style="color: #6b7280;">Obrigado pela sua compra</p>
        </div>
        
        <div class="status-box">
            <h3>✅ Pedido Confirmado</h3>
            <p>Pedido #{{orderNumber}} confirmado com sucesso!</p>
        </div>
        
        <div class="order-details">
            <h3>Detalhes do Pedido</h3>
            <div class="order-item">
                <span>Número do Pedido:</span>
                <span><strong>{{orderNumber}}</strong></span>
            </div>
            <div class="order-item">
                <span>Data do Pedido:</span>
                <span>{{orderDate}}</span>
            </div>
            <div class="order-item">
                <span>Total:</span>
                <span><strong>{{orderTotal}}</strong></span>
            </div>
        </div>
        
        <div style="text-align: center;">
            <a href="{{orderUrl}}" class="cta-button">Ver Detalhes do Pedido</a>
        </div>
        
        <p>Seu pedido está sendo processado e você receberá uma confirmação em breve.</p>
        
        <p>Se você tiver alguma dúvida sobre seu pedido, entre em contato conosco em <a href="mailto:{{supportEmail}}" style="color: #f97316;">{{supportEmail}}</a>.</p>
        
        <p style="text-align: center; margin-top: 30px;">
            Atenciosamente,<br>
            <strong>Equipe StorySpark</strong>
        </p>
        
        <div class="footer">
            <div style="font-size: 20px; font-weight: 700; background: linear-gradient(135deg, #f97316, #fb923c); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">StorySpark</div>
            <div style="margin: 20px 0;">
                <a href="https://storyspark.com">Website</a> |
                <a href="https://blog.storyspark.com">Blog</a> |
                <a href="mailto:suporte@storyspark.com">Suporte</a>
            </div>
            <p>© 2024 StorySpark. Todos os direitos reservados.</p>
            <div style="margin-top: 20px; font-size: 12px;">
                <a href="{{unsubscribe_url}}">Cancelar inscrição</a>
            </div>
        </div>
    </div>
</body>
</html>`,text_content:`Pedido Confirmado #{{orderNumber}}

Olá,

Seu pedido foi confirmado com sucesso!

Detalhes do Pedido:
- Número: {{orderNumber}}
- Data: {{orderDate}}  
- Total: {{orderTotal}}

Ver detalhes: {{orderUrl}}

Seu pedido está sendo processado e você receberá uma confirmação em breve.

Se você tiver alguma dúvida sobre seu pedido, entre em contato conosco em {{supportEmail}}.

Atenciosamente,
Equipe StorySpark

© 2024 StorySpark. Todos os direitos reservados.`}],We=a=>{const c=/{{([^}]+)}}/g,g=[];let w;for(;(w=c.exec(a))!==null;){const f=w[1].trim();g.includes(f)||g.push(f)}return g},mt=a=>({userName:"João Silva",userEmail:"joao.silva@email.com",name:"João Silva",firstName:"João",lastName:"Silva",companyName:"StorySpark",supportEmail:"suporte@storyspark.com",senderName:"Equipe StorySpark",waitlistPosition:"42",position:"42",selectedIdeas:"IA para Copywriting, Analytics Avançados, Integração com CRM",inviteCode:"INV-1756616099-c110b08c",website_url:"https://storyspark.com",productName:"StorySpark Premium",discountCode:"SAVE20",discountPercentage:"20%",productDescription:"Plataforma completa de marketing de conteúdo com IA",promotionUrl:"https://storyspark.com/promo",accountUrl:"https://app.storyspark.com/dashboard",gettingStartedUrl:"https://storyspark.com/guia-inicio",featuresUrl:"https://storyspark.com/recursos",orderNumber:"SS-2024-001234",orderDate:"15 de Janeiro de 2024",orderTotal:"R$ 297,00",orderUrl:"https://app.storyspark.com/pedidos/SS-2024-001234",orderStatus:"Confirmado",customerName:"João Silva",orderItems:"StorySpark Premium - Plano Anual",totalAmount:"R$ 297,00",deliveryAddress:"Rua das Flores, 123, São Paulo - SP",deliveryDate:"22 de Janeiro de 2024",trackingUrl:"https://app.storyspark.com/tracking/SS-2024-001234",supportMessage:"Se você tiver alguma dúvida, entre em contato conosco em"})[a]||`{{${a}}}`,sa=a=>{se({name:a.name,description:a.description,subject:a.subject,html_content:a.html_content,text_content:a.text_content,variables:We(a.html_content),tags:["email"],category:a.category});const c={};We(a.html_content).forEach(g=>{c[g]=mt(g)}),ee(c)},oa=async()=>{if(!h.name.trim()){A.error("Nome do template é obrigatório");return}if(!h.subject.trim()){A.error("Assunto do email é obrigatório");return}if(!h.html_content.trim()){A.error("Conteúdo HTML é obrigatório");return}it(!0);try{const a={name:h.name.trim(),description:h.description.trim(),subject:h.subject.trim(),html_content:h.html_content,text_content:h.text_content,category:h.category,is_active:!0};await o(a)&&(T(!1),se({name:"",description:"",subject:"",html_content:"",text_content:"",variables:[],tags:["email"],category:"Sistema"}),ee({}),H(""))}catch(a){console.error("Erro ao criar template:",a)}finally{it(!1)}},na=async()=>{var a,c,g,w,f,G,X,ne,pe;if(n){if(!n.name.trim()){A.error("Nome do template é obrigatório");return}if(!((c=(a=n.metadata)==null?void 0:a.subject)!=null&&c.trim())){A.error("Assunto do email é obrigatório");return}if(!((w=(g=n.metadata)==null?void 0:g.html_content)!=null&&w.trim())){A.error("Conteúdo HTML é obrigatório");return}lt(!0);try{await i(n.id,{name:n.name.trim(),description:(f=n.description)==null?void 0:f.trim(),subject:(X=(G=n.metadata)==null?void 0:G.subject)==null?void 0:X.trim(),html_content:(ne=n.metadata)==null?void 0:ne.html_content,text_content:(pe=n.metadata)==null?void 0:pe.text_content,category:n.category,is_active:!0})&&(te(!1),I(null),N({}),H(""))}catch(Ot){console.error("Erro ao atualizar template:",Ot)}finally{lt(!1)}}},ia=async a=>{const c=t.find(g=>g.id===a);c&&confirm(`Tem certeza que deseja excluir o template "${c.name}"? Esta ação não pode ser desfeita.`)&&await d(a)},ca=async a=>{const c={name:`${a.name} (Cópia)`,description:a.description,subject:a.subject||"",html_content:a.html_content||"",text_content:a.text_content||"",category:a.category,is_active:!0,variables:a.variables||[]};await o(c),A.success("Template duplicado com sucesso!")},la=async a=>{try{await i(a.id,{is_active:!a.is_active})&&A.success(`Template ${a.is_active?"desativado":"ativado"} com sucesso!`)}catch(c){console.error("Erro ao alterar status do template:",c)}},da=a=>{I(a),U(!0)},ma=a=>{I(a),te(!0)},pa=a=>{switch(a){case"sent":return"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";case"scheduled":return"bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";case"draft":return"bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";case"sending":return"bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";default:return"bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"}},ze=a=>new Date(a).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}),pt=(a,c)=>c===0?0:(a/c*100).toFixed(1),ut=(a,c)=>c===0?0:(a/c*100).toFixed(1),ye=t.filter(a=>{var ne;const c=a.name.toLowerCase().includes(y.toLowerCase())||(a.description||"").toLowerCase().includes(y.toLowerCase())||(((ne=a.metadata)==null?void 0:ne.subject)||"").toLowerCase().includes(y.toLowerCase()),g=pe=>(pe||"").toLowerCase(),f=!(C&&C!=="all")||g(a.category)===g(C),X=!(m&&m!=="all")||m==="active"&&a.is_active||m==="inactive"&&!a.is_active;return c&&f&&X}),xt=a=>{const c=We(a);n?(I({...n,variables:c,template_variables:c,metadata:{...n.metadata,html_content:a}}),N(g=>{const w={...g};return c.forEach(f=>{f in w||(w[f]="")}),Object.keys(w).forEach(f=>{c.includes(f)||delete w[f]}),w})):(se({...h,html_content:a,variables:c}),ee(g=>{const w={...g};return c.forEach(f=>{f in w||(w[f]="")}),Object.keys(w).forEach(f=>{c.includes(f)||delete w[f]}),w}))},gt=(a,c,g)=>{let w=a||"",f=c||"";return Object.entries(g).forEach(([G,X])=>{const ne=new RegExp(`\\{\\{${G}\\}\\}`,"g"),pe=String(X??"");w=w.replace(ne,pe),f=f.replace(ne,pe)}),{subject:w,html:f}},ht=async a=>{var c,g,w;if(!M){A.error("Informe um e-mail para envio de teste");return}oe(!0);try{if(a==="new"){const{subject:f,html:G}=gt(h.subject,h.html_content,K),X=await Ie.sendEmail({to:[{email:M}],subject:f||"(sem assunto)",html:G,text:h.text_content,category:"template_test"});X.success?A.success("E-mail de teste enviado com sucesso!"):A.error(X.error||"Falha ao enviar teste")}else if(n){const{subject:f,html:G}=gt(((c=n.metadata)==null?void 0:c.subject)||n.subject,((g=n.metadata)==null?void 0:g.html_content)||n.html_content,u),X=await Ie.sendEmail({to:[{email:M}],subject:f||"(sem assunto)",html:G,text:((w=n.metadata)==null?void 0:w.text_content)||n.text_content,category:`${n.id}_test`});X.success?A.success("E-mail de teste enviado com sucesso!"):A.error(X.error||"Falha ao enviar teste")}}catch(f){console.error("Erro ao enviar teste:",f),A.error((f==null?void 0:f.message)||"Erro ao enviar teste")}finally{oe(!1)}};return r?e.jsxs("div",{className:"flex items-center justify-center h-64",children:[e.jsx(ue,{className:"h-8 w-8 animate-spin"}),e.jsx("span",{className:"ml-2",children:"Carregando templates..."})]}):s?e.jsxs("div",{className:"flex items-center justify-center h-64",children:[e.jsx(ga,{className:"h-8 w-8 text-red-500"}),e.jsx("span",{className:"ml-2 text-red-600",children:s})]}):e.jsxs("div",{className:"space-y-6 p-4 sm:p-6",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-2xl sm:text-3xl font-bold tracking-tight",children:"Email Marketing"}),e.jsx("p",{className:"text-muted-foreground text-sm sm:text-base",children:"Gerencie campanhas, templates, listas e analytics de email marketing"})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row gap-2",children:[e.jsxs(_,{variant:"outline",onClick:()=>v(),disabled:r,className:"w-full sm:w-auto",children:[r?e.jsx(ue,{className:"h-4 w-4 mr-2 animate-spin"}):e.jsx(Na,{className:"h-4 w-4 mr-2"}),r?"Carregando...":"Recarregar"]}),e.jsxs(_,{variant:"outline",onClick:()=>S(!0),className:"w-full sm:w-auto",children:[e.jsx(we,{className:"h-4 w-4 mr-2"}),"Nova Campanha"]}),e.jsxs(_,{variant:"outline",onClick:aa,disabled:$e,className:"w-full sm:w-auto",children:[$e?e.jsx(ue,{className:"h-4 w-4 mr-2 animate-spin"}):e.jsx(ha,{className:"h-4 w-4 mr-2"}),$e?"Atualizando...":"Atualizar Design"]}),e.jsx(Re,{open:b,onOpenChange:T,children:e.jsx(fa,{asChild:!0,children:e.jsxs(_,{className:"w-full sm:w-auto",children:[e.jsx(Pt,{className:"h-4 w-4 mr-2"}),"Novo Template"]})})})]})]}),e.jsxs(De,{value:F,onValueChange:L,className:"w-full",children:[e.jsxs(Fe,{className:"grid w-full grid-cols-2 md:grid-cols-4 gap-1",children:[e.jsxs(Z,{value:"campaigns",className:"flex items-center gap-1 sm:gap-2 text-xs sm:text-sm",children:[e.jsx(we,{className:"h-3 w-3 sm:h-4 sm:w-4"}),e.jsx("span",{className:"hidden sm:inline",children:"Campanhas"}),e.jsx("span",{className:"sm:hidden",children:"Camp."})]}),e.jsxs(Z,{value:"lists",className:"flex items-center gap-1 sm:gap-2 text-xs sm:text-sm",children:[e.jsx(Se,{className:"h-3 w-3 sm:h-4 sm:w-4"}),e.jsx("span",{className:"hidden sm:inline",children:"Listas"}),e.jsx("span",{className:"sm:hidden",children:"Listas"})]}),e.jsxs(Z,{value:"templates",className:"flex items-center gap-1 sm:gap-2 text-xs sm:text-sm",children:[e.jsx(At,{className:"h-3 w-3 sm:h-4 sm:w-4"}),e.jsx("span",{className:"hidden sm:inline",children:"Templates"}),e.jsx("span",{className:"sm:hidden",children:"Temp."})]}),e.jsxs(Z,{value:"analytics",className:"flex items-center gap-1 sm:gap-2 text-xs sm:text-sm",children:[e.jsx(zt,{className:"h-3 w-3 sm:h-4 sm:w-4"}),e.jsx("span",{className:"hidden sm:inline",children:"Analytics"}),e.jsx("span",{className:"sm:hidden",children:"Anal."})]})]}),e.jsxs(J,{value:"campaigns",className:"space-y-4 sm:space-y-6",children:[e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4",children:[e.jsxs(B,{children:[e.jsxs(q,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[e.jsx(W,{className:"text-sm font-medium",children:"Total Enviados"}),e.jsx(we,{className:"h-4 w-4 text-muted-foreground"})]}),e.jsxs($,{children:[e.jsx("div",{className:"text-2xl font-bold",children:xe.totalSent.toLocaleString()}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"+12% desde o mês passado"})]})]}),e.jsxs(B,{children:[e.jsxs(q,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[e.jsx(W,{className:"text-sm font-medium",children:"Taxa de Abertura"}),e.jsx(ge,{className:"h-4 w-4 text-muted-foreground"})]}),e.jsxs($,{children:[e.jsxs("div",{className:"text-2xl font-bold",children:[xe.openRate,"%"]}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"+2.1% desde o mês passado"})]})]}),e.jsxs(B,{children:[e.jsxs(q,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[e.jsx(W,{className:"text-sm font-medium",children:"Taxa de Clique"}),e.jsx(Ge,{className:"h-4 w-4 text-muted-foreground"})]}),e.jsxs($,{children:[e.jsxs("div",{className:"text-2xl font-bold",children:[xe.clickRate,"%"]}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"+0.8% desde o mês passado"})]})]}),e.jsxs(B,{children:[e.jsxs(q,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[e.jsx(W,{className:"text-sm font-medium",children:"Campanhas Ativas"}),e.jsx(va,{className:"h-4 w-4 text-muted-foreground"})]}),e.jsxs($,{children:[e.jsx("div",{className:"text-2xl font-bold",children:dt.filter(a=>a.status==="sending"||a.status==="scheduled").length}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"2 agendadas para hoje"})]})]})]}),e.jsxs(B,{children:[e.jsxs(q,{children:[e.jsx(W,{children:"Campanhas Recentes"}),e.jsx(Ne,{children:"Gerencie suas campanhas de email marketing"})]}),e.jsx($,{children:e.jsx("div",{className:"space-y-4",children:dt.map(a=>e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-3",children:[e.jsxs("div",{className:"flex-1",children:[e.jsxs("div",{className:"flex flex-wrap items-center gap-2 sm:gap-3",children:[e.jsx("h3",{className:"font-medium",children:a.name}),e.jsx(ce,{className:pa(a.status),children:a.status==="sent"?"Enviada":a.status==="scheduled"?"Agendada":a.status==="draft"?"Rascunho":a.status==="sending"?"Enviando":a.status})]}),e.jsx("p",{className:"text-sm text-muted-foreground mt-1",children:a.subject}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs text-muted-foreground",children:[e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(Se,{className:"h-3 w-3"}),a.recipients.toLocaleString()," destinatários"]}),e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(ge,{className:"h-3 w-3"}),a.opens.toLocaleString()," aberturas (",pt(a.opens,a.recipients),"%)"]}),e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(Ge,{className:"h-3 w-3"}),a.clicks.toLocaleString()," cliques (",ut(a.clicks,a.recipients),"%)"]}),e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(Mt,{className:"h-3 w-3"}),a.sent_at?`Enviada em ${ze(a.sent_at)}`:a.scheduled_for?`Agendada para ${ze(a.scheduled_for)}`:"Não agendada"]})]})]}),e.jsxs(ke,{children:[e.jsx(Ce,{asChild:!0,children:e.jsx(_,{variant:"ghost",size:"sm",children:e.jsx(tt,{className:"h-4 w-4"})})}),e.jsxs(Te,{align:"end",children:[e.jsxs(D,{children:[e.jsx(ge,{className:"h-4 w-4 mr-2"}),"Visualizar"]}),e.jsxs(D,{children:[e.jsx(at,{className:"h-4 w-4 mr-2"}),"Editar"]}),e.jsxs(D,{children:[e.jsx(Rt,{className:"h-4 w-4 mr-2"}),"Duplicar"]}),e.jsxs(D,{className:"text-red-600",children:[e.jsx(Ye,{className:"h-4 w-4 mr-2"}),"Excluir"]})]})]})]},a.id))})})]})]}),e.jsxs(J,{value:"lists",className:"space-y-6",children:[e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",children:[e.jsxs(B,{children:[e.jsxs(q,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[e.jsx(W,{className:"text-sm font-medium",children:"Total de Listas"}),e.jsx(Se,{className:"h-4 w-4 text-muted-foreground"})]}),e.jsxs($,{children:[e.jsx("div",{className:"text-2xl font-bold",children:Ae.length}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"+1 nova lista este mês"})]})]}),e.jsxs(B,{children:[e.jsxs(q,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[e.jsx(W,{className:"text-sm font-medium",children:"Total de Contatos"}),e.jsx(It,{className:"h-4 w-4 text-muted-foreground"})]}),e.jsxs($,{children:[e.jsx("div",{className:"text-2xl font-bold",children:Ae.reduce((a,c)=>a+c.subscribers,0).toLocaleString()}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"+156 novos contatos"})]})]}),e.jsxs(B,{children:[e.jsxs(q,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[e.jsx(W,{className:"text-sm font-medium",children:"Taxa de Crescimento"}),e.jsx(Ze,{className:"h-4 w-4 text-muted-foreground"})]}),e.jsxs($,{children:[e.jsx("div",{className:"text-2xl font-bold",children:"+8.2%"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Crescimento mensal"})]})]})]}),e.jsxs(B,{children:[e.jsxs(q,{children:[e.jsx(W,{children:"Listas de Email"}),e.jsx(Ne,{children:"Gerencie suas listas de contatos"})]}),e.jsx($,{children:e.jsx("div",{className:"space-y-4",children:Ae.map(a=>e.jsxs("div",{className:"flex items-center justify-between p-4 border rounded-lg",children:[e.jsxs("div",{className:"flex-1",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("h3",{className:"font-medium",children:a.name}),e.jsx(ce,{variant:"outline",children:a.type})]}),e.jsx("p",{className:"text-sm text-muted-foreground mt-1",children:a.description}),e.jsxs("div",{className:"flex items-center gap-4 mt-2 text-xs text-muted-foreground",children:[e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(Se,{className:"h-3 w-3"}),a.subscribers.toLocaleString()," assinantes"]}),e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(Mt,{className:"h-3 w-3"}),"Criada em ",ze(a.createdAt)]}),e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(Ze,{className:"h-3 w-3"}),"+",a.growthRate,"% este mês"]})]})]}),e.jsxs(ke,{children:[e.jsx(Ce,{asChild:!0,children:e.jsx(_,{variant:"ghost",size:"sm",children:e.jsx(tt,{className:"h-4 w-4"})})}),e.jsxs(Te,{align:"end",children:[e.jsxs(D,{children:[e.jsx(ge,{className:"h-4 w-4 mr-2"}),"Visualizar Contatos"]}),e.jsxs(D,{children:[e.jsx(at,{className:"h-4 w-4 mr-2"}),"Editar Lista"]}),e.jsxs(D,{children:[e.jsx(It,{className:"h-4 w-4 mr-2"}),"Adicionar Contatos"]}),e.jsxs(D,{className:"text-red-600",children:[e.jsx(Ye,{className:"h-4 w-4 mr-2"}),"Excluir Lista"]})]})]})]},a.id))})})]})]}),e.jsxs(J,{value:"templates",className:"space-y-4 sm:space-y-6",children:[e.jsx("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4",children:e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2",children:[e.jsxs("div",{className:"relative",children:[e.jsx(ba,{className:"absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"}),e.jsx(Y,{placeholder:"Buscar templates...",value:y,onChange:a=>k(a.target.value),className:"pl-8 w-full sm:w-64"})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsxs(ke,{children:[e.jsx(Ce,{asChild:!0,children:e.jsxs(_,{variant:"outline",size:"sm",className:"flex-1 sm:flex-none",children:[e.jsx(Lt,{className:"h-4 w-4 mr-2"}),"Categoria"]})}),e.jsxs(Te,{children:[e.jsx(D,{onClick:()=>x("all"),children:"Todas"}),e.jsx(D,{onClick:()=>x("Sistema"),children:"Sistema"}),e.jsx(D,{onClick:()=>x("Marketing"),children:"Marketing"}),e.jsx(D,{onClick:()=>x("Transacional"),children:"Transacional"})]})]}),e.jsxs(ke,{children:[e.jsx(Ce,{asChild:!0,children:e.jsxs(_,{variant:"outline",size:"sm",className:"flex-1 sm:flex-none",children:[e.jsx(Lt,{className:"h-4 w-4 mr-2"}),"Status"]})}),e.jsxs(Te,{children:[e.jsx(D,{onClick:()=>p("all"),children:"Todos"}),e.jsx(D,{onClick:()=>p("active"),children:"Ativos"}),e.jsx(D,{onClick:()=>p("inactive"),children:"Inativos"})]})]})]})]})}),e.jsx("div",{className:"flex items-center justify-between mb-4",children:e.jsxs("p",{className:"text-sm text-muted-foreground",children:[ye.length," template",ye.length!==1?"s":""," encontrado",ye.length!==1?"s":"",y&&` para "${y}"`,C&&C!=="all"&&` na categoria "${C}"`,m&&m!=="all"&&` com status "${m==="active"?"ativo":"inativo"}"`]})}),e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6",children:ye.map(a=>{var c;return e.jsxs(B,{className:"hover:shadow-md transition-shadow",children:[e.jsx(q,{children:e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{className:"flex-1",children:[e.jsx(W,{className:"text-lg",children:a.name}),e.jsx(Ne,{className:"mt-1",children:a.description})]}),e.jsxs(ke,{children:[e.jsx(Ce,{asChild:!0,children:e.jsx(_,{variant:"ghost",size:"sm",children:e.jsx(tt,{className:"h-4 w-4"})})}),e.jsxs(Te,{align:"end",children:[e.jsxs(D,{onClick:()=>da(a),children:[e.jsx(ge,{className:"h-4 w-4 mr-2"}),"Visualizar"]}),e.jsxs(D,{onClick:()=>ma(a),children:[e.jsx(at,{className:"h-4 w-4 mr-2"}),"Editar"]}),e.jsxs(D,{onClick:()=>ca(a),children:[e.jsx(Rt,{className:"h-4 w-4 mr-2"}),"Duplicar"]}),e.jsx(D,{onClick:()=>la(a),children:a.is_active?e.jsxs(e.Fragment,{children:[e.jsx(ja,{className:"h-4 w-4 mr-2"}),"Desativar"]}):e.jsxs(e.Fragment,{children:[e.jsx(ya,{className:"h-4 w-4 mr-2"}),"Ativar"]})}),e.jsxs(D,{className:"text-red-600",onClick:()=>ia(a.id),children:[e.jsx(Ye,{className:"h-4 w-4 mr-2"}),"Excluir"]})]})]})]})}),e.jsx($,{children:e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(ce,{variant:"outline",className:"text-xs",children:a.category}),e.jsxs(ce,{variant:"secondary",className:"text-xs",children:[((c=a.variables)==null?void 0:c.length)||0," variáveis"]}),e.jsx(ce,{variant:a.is_active?"default":"secondary",className:"text-xs",children:a.is_active?"Ativo":"Inativo"})]}),e.jsx("p",{className:"text-sm text-muted-foreground line-clamp-2",children:a.subject}),e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between text-xs text-muted-foreground gap-1",children:[e.jsxs("span",{children:["Criado em ",new Date(a.created_at).toLocaleDateString("pt-BR")]}),e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(wa,{className:"h-3 w-3"}),a.usage_count||0," usos"]})]})]})})]},a.id)})}),ye.length===0&&e.jsxs("div",{className:"text-center py-12",children:[e.jsx(At,{className:"h-12 w-12 text-muted-foreground mx-auto mb-4"}),e.jsx("h3",{className:"text-lg font-medium mb-2",children:"Nenhum template encontrado"}),e.jsx("p",{className:"text-muted-foreground mb-4",children:y||C?"Tente ajustar os filtros de busca":"Crie seu primeiro template de email"}),e.jsxs(_,{onClick:()=>T(!0),children:[e.jsx(Pt,{className:"h-4 w-4 mr-2"}),"Criar Template"]})]})]}),e.jsxs(J,{value:"analytics",className:"space-y-6",children:[e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",children:[e.jsxs(B,{children:[e.jsxs(q,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[e.jsx(W,{className:"text-sm font-medium",children:"Taxa de Abertura Média"}),e.jsx(ge,{className:"h-4 w-4 text-muted-foreground"})]}),e.jsxs($,{children:[e.jsxs("div",{className:"text-2xl font-bold",children:[xe.openRate,"%"]}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"+2.1% desde o mês passado"})]})]}),e.jsxs(B,{children:[e.jsxs(q,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[e.jsx(W,{className:"text-sm font-medium",children:"Taxa de Clique Média"}),e.jsx(Ge,{className:"h-4 w-4 text-muted-foreground"})]}),e.jsxs($,{children:[e.jsxs("div",{className:"text-2xl font-bold",children:[xe.clickRate,"%"]}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"+0.8% desde o mês passado"})]})]}),e.jsxs(B,{children:[e.jsxs(q,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[e.jsx(W,{className:"text-sm font-medium",children:"Total de Assinantes"}),e.jsx(Se,{className:"h-4 w-4 text-muted-foreground"})]}),e.jsxs($,{children:[e.jsx("div",{className:"text-2xl font-bold",children:Ae.reduce((a,c)=>a+c.subscribers,0).toLocaleString()}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"+156 novos este mês"})]})]}),e.jsxs(B,{children:[e.jsxs(q,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[e.jsx(W,{className:"text-sm font-medium",children:"ROI Médio"}),e.jsx(Ze,{className:"h-4 w-4 text-muted-foreground"})]}),e.jsxs($,{children:[e.jsx("div",{className:"text-2xl font-bold",children:"R$ 4.20"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Para cada R$ 1 investido"})]})]})]}),e.jsxs(B,{children:[e.jsxs(q,{children:[e.jsx(W,{children:"Performance das Campanhas Recentes"}),e.jsx(Ne,{children:"Análise detalhada das últimas campanhas enviadas"})]}),e.jsx($,{children:e.jsx("div",{className:"space-y-4",children:xe.recentCampaigns.map(a=>{var c;return e.jsxs("div",{className:"flex items-center justify-between p-4 border rounded-lg",children:[e.jsxs("div",{className:"flex-1",children:[e.jsx("h3",{className:"font-medium",children:a.name}),e.jsx("p",{className:"text-sm text-muted-foreground",children:a.subject}),e.jsxs("div",{className:"flex items-center gap-4 mt-2 text-xs text-muted-foreground",children:[e.jsxs("span",{children:["Enviada em ",ze(a.sentAt)]}),e.jsxs("span",{children:[a.recipients.toLocaleString()," destinatários"]})]})]}),e.jsxs("div",{className:"flex items-center gap-6 text-sm",children:[e.jsxs("div",{className:"text-center",children:[e.jsxs("div",{className:"font-medium",children:[pt(a.opens,a.recipients),"%"]}),e.jsx("div",{className:"text-xs text-muted-foreground",children:"Abertura"})]}),e.jsxs("div",{className:"text-center",children:[e.jsxs("div",{className:"font-medium",children:[ut(a.clicks,a.recipients),"%"]}),e.jsx("div",{className:"text-xs text-muted-foreground",children:"Clique"})]}),e.jsxs("div",{className:"text-center",children:[e.jsxs("div",{className:"font-medium",children:["R$ ",((c=a.revenue)==null?void 0:c.toFixed(2))||"0.00"]}),e.jsx("div",{className:"text-xs text-muted-foreground",children:"Receita"})]})]})]},a.id)})})})]}),e.jsxs(B,{children:[e.jsxs(q,{children:[e.jsx(W,{children:"Tendência de Performance"}),e.jsx(Ne,{children:"Evolução das métricas ao longo do tempo"})]}),e.jsx($,{children:e.jsx("div",{className:"h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg",children:e.jsxs("div",{className:"text-center",children:[e.jsx(zt,{className:"h-12 w-12 text-muted-foreground mx-auto mb-4"}),e.jsx("p",{className:"text-muted-foreground",children:"Gráfico de performance será implementado aqui"})]})})})]})]})]}),e.jsx(Sa,{isOpen:V,onClose:()=>S(!1)}),e.jsx(Re,{open:b,onOpenChange:T,children:e.jsxs(Je,{className:"max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto",children:[e.jsxs(Qe,{children:[e.jsx(Xe,{children:"Criar Novo Template de Email"}),e.jsx(Ke,{children:"Crie um novo template de email para suas campanhas"})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-3",children:[e.jsx(O,{children:"Templates Padrão"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Escolha um template padrão para começar ou crie do zero"}),e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3",children:ra.map((a,c)=>e.jsx(B,{className:"cursor-pointer hover:bg-accent transition-colors",onClick:()=>sa(a),children:e.jsxs($,{className:"p-4",children:[e.jsx("h4",{className:"font-medium text-sm",children:a.name}),e.jsx("p",{className:"text-xs text-muted-foreground mt-1",children:a.description}),e.jsx(ce,{variant:"outline",className:"mt-2 text-xs",children:a.category})]})},c))})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx(O,{htmlFor:"name",children:"Nome do Template"}),e.jsx(Y,{id:"name",value:h.name,onChange:a=>se({...h,name:a.target.value}),placeholder:"Ex: Boas-vindas"})]}),e.jsxs("div",{children:[e.jsx(O,{htmlFor:"category",children:"Categoria"}),e.jsx(Y,{id:"category",value:h.category,onChange:a=>se({...h,category:a.target.value}),placeholder:"Ex: Sistema, Marketing"})]})]}),e.jsxs("div",{children:[e.jsx(O,{htmlFor:"description",children:"Descrição"}),e.jsx(Y,{id:"description",value:h.description,onChange:a=>se({...h,description:a.target.value}),placeholder:"Descreva o propósito deste template"})]}),e.jsxs("div",{children:[e.jsx(O,{htmlFor:"subject",children:"Assunto do Email"}),e.jsx(Y,{id:"subject",value:h.subject,onChange:a=>se({...h,subject:a.target.value}),placeholder:"Ex: Bem-vindo ao StorySpark!"})]}),e.jsxs(De,{defaultValue:"html",className:"w-full",children:[e.jsxs(Fe,{children:[e.jsx(Z,{value:"html",children:"HTML"}),e.jsx(Z,{value:"text",children:"Texto"}),e.jsx(Z,{value:"preview",children:"Preview"})]}),e.jsxs(J,{value:"html",className:"space-y-2",children:[e.jsx(O,{htmlFor:"html-content",children:"Conteúdo HTML"}),e.jsx(Gt,{value:h.html_content,onChange:xt,language:"html",height:"300px",placeholder:"Conteúdo HTML do email...",minimap:!1,wordWrap:!0})]}),e.jsxs(J,{value:"text",className:"space-y-2",children:[e.jsx(O,{htmlFor:"text-content",children:"Conteúdo em Texto"}),e.jsx(Dt,{id:"text-content",value:h.text_content,onChange:a=>se({...h,text_content:a.target.value}),placeholder:"Versão em texto do email...",className:"min-h-[200px]"})]}),e.jsxs(J,{value:"preview",className:"space-y-2",children:[e.jsx(O,{children:"Preview do Email"}),e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx(O,{className:"text-xs",children:"Visualizar como:"}),e.jsxs("div",{className:"flex gap-1",children:[e.jsx(_,{size:"sm",variant:ae===360?"default":"outline",onClick:()=>je(360),children:"Mobile"}),e.jsx(_,{size:"sm",variant:ae===600?"default":"outline",onClick:()=>je(600),children:"Tablet"}),e.jsx(_,{size:"sm",variant:ae===800?"default":"outline",onClick:()=>je(800),children:"Desktop"})]})]}),e.jsxs("div",{className:"border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 min-h-[200px]",children:[h.subject&&e.jsxs("div",{className:"border-b border-gray-200 dark:border-gray-700 pb-2 mb-4",children:[e.jsx("strong",{children:"Assunto:"})," ",(()=>{let a=h.subject;return Object.entries(K).forEach(([c,g])=>{a=a.replace(new RegExp(`{{${c}}}`,"g"),String(g??""))}),a})()]}),h.html_content?e.jsx(nt,{html:(()=>{let a=h.html_content;return Object.entries(K).forEach(([c,g])=>{a=a.replace(new RegExp(`{{${c}}}`,"g"),String(g??""))}),a})(),width:ae}):e.jsx("div",{className:"text-muted-foreground text-center py-8",children:"Digite o conteúdo HTML para ver o preview"})]}),h.variables.length>0&&e.jsxs("div",{className:"mt-4 space-y-2",children:[e.jsx(O,{children:"Variáveis para Preview/Teste"}),e.jsx("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-3",children:h.variables.map(a=>e.jsxs("div",{className:"space-y-1",children:[e.jsx(O,{className:"text-xs text-muted-foreground",children:`{{${a}}}`}),e.jsx(Y,{value:K[a]??"",onChange:c=>ee({...K,[a]:c.target.value}),placeholder:`Valor para ${a}`})]},a))})]}),e.jsxs("div",{className:"flex items-center gap-2 pt-2",children:[e.jsx(Y,{placeholder:"Enviar teste para...",value:M,onChange:a=>H(a.target.value),className:"max-w-xs"}),e.jsx(_,{variant:"outline",onClick:async()=>{try{const a=K;let c=h.subject,g=h.html_content;Object.entries(a).forEach(([f,G])=>{c=c.replace(new RegExp(`{{${f}}}`,"g"),String(G??"")),g=g.replace(new RegExp(`{{${f}}}`,"g"),String(G??""))});const w=await Ie.sendEmail({to:[{email:M}],subject:c||"(sem assunto)",html:g,text:h.text_content,category:"template_test"});w.success?A.success("Teste enviado"):A.error(w.error||"Falha ao enviar teste")}catch(a){A.error((a==null?void 0:a.message)||"Erro ao enviar teste")}},children:"Enviar teste"})]})]})]}),h.variables.length>0&&e.jsxs("div",{children:[e.jsx(O,{children:"Variáveis Detectadas"}),e.jsx("div",{className:"flex flex-wrap gap-2 mt-2",children:h.variables.map(a=>e.jsx(ce,{variant:"secondary",children:a},a))}),e.jsxs("div",{className:"mt-4 p-4 border rounded-lg bg-muted/50",children:[e.jsx(O,{className:"text-sm font-medium",children:"Testar Template"}),e.jsx("p",{className:"text-xs text-muted-foreground mb-3",children:"Envie um e-mail de teste para verificar como o template ficará"}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(Y,{placeholder:"E-mail para teste",value:M,onChange:a=>H(a.target.value),className:"flex-1"}),e.jsxs(_,{variant:"outline",size:"sm",onClick:()=>ht("new"),disabled:!M||!h.html_content||R,children:[R?e.jsx(ue,{className:"h-4 w-4 mr-2 animate-spin"}):e.jsx(we,{className:"h-4 w-4 mr-2"}),R?"Enviando...":"Enviar Teste"]})]})]})]})]}),e.jsxs(Ft,{children:[e.jsx(_,{variant:"outline",onClick:()=>{se({name:"",description:"",subject:"",html_content:"",text_content:"",variables:[],tags:["email"],category:"Sistema"}),ee({}),H("")},children:"Limpar"}),e.jsx(_,{variant:"outline",onClick:()=>T(!1),children:"Cancelar"}),e.jsxs(_,{onClick:oa,disabled:!h.name||!h.subject||!h.html_content||re,children:[re?e.jsx(ue,{className:"h-4 w-4 mr-2 animate-spin"}):e.jsx(Ut,{className:"h-4 w-4 mr-2"}),re?"Criando...":"Criar Template"]})]})]})}),e.jsx(Re,{open:ve,onOpenChange:U,children:e.jsxs(Je,{className:"max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto",children:[e.jsxs(Qe,{children:[e.jsx(Xe,{children:"Visualizar Template"}),e.jsxs(Ke,{children:[n==null?void 0:n.name," - ",(ft=n==null?void 0:n.metadata)==null?void 0:ft.subject]})]}),n&&e.jsxs(De,{defaultValue:"preview",className:"w-full",children:[e.jsxs(Fe,{children:[e.jsx(Z,{value:"preview",children:"Preview"}),e.jsx(Z,{value:"html",children:"HTML"}),e.jsx(Z,{value:"text",children:"Texto"})]}),e.jsx(J,{value:"preview",className:"space-y-4",children:e.jsxs("div",{className:"border rounded-lg p-4 bg-gray-50 dark:bg-gray-800",children:[e.jsxs("div",{className:"border-b border-gray-200 dark:border-gray-700 pb-2 mb-4",children:[e.jsx("strong",{children:"Assunto:"})," ",(vt=n.metadata)==null?void 0:vt.subject]}),e.jsx(nt,{html:((bt=n.metadata)==null?void 0:bt.html_content)||""})]})}),e.jsx(J,{value:"html",children:e.jsx("pre",{className:"bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-auto max-h-96 text-gray-900 dark:text-gray-100",children:e.jsx("code",{children:(jt=n.metadata)==null?void 0:jt.html_content})})}),e.jsx(J,{value:"text",children:e.jsx("pre",{className:"bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-auto max-h-96 text-gray-900 dark:text-gray-100",children:(yt=n.metadata)==null?void 0:yt.text_content})})]})]})}),e.jsx(Re,{open:P,onOpenChange:te,children:e.jsxs(Je,{className:"max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto",children:[e.jsxs(Qe,{children:[e.jsx(Xe,{children:"Editar Template"}),e.jsx(Ke,{children:"Edite as informações do template de email"})]}),n&&e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx(O,{htmlFor:"edit-name",children:"Nome do Template"}),e.jsx(Y,{id:"edit-name",value:n.name,onChange:a=>I({...n,name:a.target.value})})]}),e.jsxs("div",{children:[e.jsx(O,{htmlFor:"edit-category",children:"Categoria"}),e.jsx(Y,{id:"edit-category",value:n.category,onChange:a=>I({...n,category:a.target.value})})]})]}),e.jsxs("div",{children:[e.jsx(O,{htmlFor:"edit-description",children:"Descrição"}),e.jsx(Y,{id:"edit-description",value:n.description,onChange:a=>I({...n,description:a.target.value})})]}),e.jsxs("div",{children:[e.jsx(O,{htmlFor:"edit-subject",children:"Assunto do Email"}),e.jsx(Y,{id:"edit-subject",value:(wt=n.metadata)==null?void 0:wt.subject,onChange:a=>I({...n,metadata:{...n.metadata,subject:a.target.value}})})]}),e.jsxs(De,{value:z,onValueChange:de,children:[e.jsxs(Fe,{children:[e.jsx(Z,{value:"html",children:"HTML"}),e.jsx(Z,{value:"text",children:"Texto"}),e.jsx(Z,{value:"preview",children:"Preview"})]}),e.jsxs(J,{value:"html",className:"space-y-2",children:[e.jsx(O,{htmlFor:"edit-html-content",children:"Conteúdo HTML"}),e.jsx(Gt,{value:((St=n.metadata)==null?void 0:St.html_content)??"",onChange:xt,language:"html",height:"300px",minimap:!1,wordWrap:!0})]}),e.jsxs(J,{value:"text",className:"space-y-2",children:[e.jsx(O,{htmlFor:"edit-text-content",children:"Conteúdo em Texto"}),e.jsx(Dt,{id:"edit-text-content",value:(Nt=n.metadata)==null?void 0:Nt.text_content,onChange:a=>I({...n,metadata:{...n.metadata,text_content:a.target.value}}),className:"min-h-[200px]"})]}),e.jsxs(J,{value:"preview",className:"space-y-2",children:[e.jsx(O,{children:"Preview do Email"}),e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx(O,{className:"text-xs",children:"Visualizar como:"}),e.jsxs("div",{className:"flex gap-1",children:[e.jsx(_,{size:"sm",variant:j===360?"default":"outline",onClick:()=>E(360),children:"Mobile"}),e.jsx(_,{size:"sm",variant:j===600?"default":"outline",onClick:()=>E(600),children:"Tablet"}),e.jsx(_,{size:"sm",variant:j===800?"default":"outline",onClick:()=>E(800),children:"Desktop"})]})]}),e.jsxs("div",{className:"border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 min-h-[200px]",children:[((kt=n.metadata)==null?void 0:kt.subject)&&e.jsxs("div",{className:"border-b border-gray-200 dark:border-gray-700 pb-2 mb-4",children:[e.jsx("strong",{children:"Assunto:"})," ",(()=>{let a=n.metadata.subject;return Object.entries(u).forEach(([c,g])=>{a=a.replace(new RegExp(`{{${c}}}`,"g"),String(g??""))}),a})()]}),(Ct=n.metadata)!=null&&Ct.html_content?e.jsx(nt,{html:(()=>{var c;let a=(c=n.metadata)==null?void 0:c.html_content;return Object.entries(u).forEach(([g,w])=>{a=a.replace(new RegExp(`{{${g}}}`,"g"),String(w??""))}),a})(),width:j}):e.jsx("div",{className:"text-muted-foreground text-center py-8",children:"Digite o conteúdo HTML para ver o preview"})]}),n.variables.length>0&&e.jsxs("div",{className:"mt-4 space-y-2",children:[e.jsx(O,{children:"Variáveis para Preview/Teste"}),e.jsx("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-3",children:n.variables.map(a=>e.jsxs("div",{className:"space-y-1",children:[e.jsx(O,{className:"text-xs text-muted-foreground",children:`{{${a}}}`}),e.jsx(Y,{value:u[a]??"",onChange:c=>N({...u,[a]:c.target.value}),placeholder:`Valor para ${a}`})]},a))})]}),e.jsxs("div",{className:"flex items-center gap-2 pt-2",children:[e.jsx(Y,{placeholder:"Enviar teste para...",value:M,onChange:a=>H(a.target.value),className:"max-w-xs"}),e.jsx(_,{variant:"outline",onClick:async()=>{try{const a=u;let c=n.metadata.subject,g=n.metadata.html_content;Object.entries(a).forEach(([f,G])=>{c=c.replace(new RegExp(`{{${f}}}`,"g"),String(G??"")),g=g.replace(new RegExp(`{{${f}}}`,"g"),String(G??""))});const w=await Ie.sendEmail({to:[{email:M}],subject:c||"(sem assunto)",html:g,text:n.metadata.text_content,category:`${n.id}_test`});w.success?A.success("Teste enviado"):A.error(w.error||"Falha ao enviar teste")}catch(a){A.error((a==null?void 0:a.message)||"Erro ao enviar teste")}},children:"Enviar teste"})]})]})]}),n.variables.length>0&&e.jsxs("div",{children:[e.jsx(O,{children:"Variáveis Detectadas"}),e.jsx("div",{className:"flex flex-wrap gap-2 mt-2",children:n.variables.map(a=>e.jsx(ce,{variant:"secondary",children:a},a))}),e.jsxs("div",{className:"mt-4 p-4 border rounded-lg bg-muted/50",children:[e.jsx(O,{className:"text-sm font-medium",children:"Testar Template"}),e.jsx("p",{className:"text-xs text-muted-foreground mb-3",children:"Envie um e-mail de teste para verificar como o template ficará"}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(Y,{placeholder:"E-mail para teste",value:M,onChange:a=>H(a.target.value),className:"flex-1"}),e.jsxs(_,{variant:"outline",size:"sm",onClick:()=>ht("edit"),disabled:!M||!((Tt=n.metadata)!=null&&Tt.html_content)||R,children:[R?e.jsx(ue,{className:"h-4 w-4 mr-2 animate-spin"}):e.jsx(we,{className:"h-4 w-4 mr-2"}),R?"Enviando...":"Enviar Teste"]})]})]})]})]}),e.jsxs(Ft,{children:[e.jsx(_,{variant:"outline",onClick:()=>{var a,c,g;n&&I({...n,name:n.name,description:n.description,metadata:{...n.metadata,subject:(a=n.metadata)==null?void 0:a.subject,html_content:(c=n.metadata)==null?void 0:c.html_content,text_content:(g=n.metadata)==null?void 0:g.text_content}}),N({}),H("")},children:"Restaurar"}),e.jsx(_,{variant:"outline",onClick:()=>te(!1),children:"Cancelar"}),e.jsxs(_,{onClick:na,disabled:!(n!=null&&n.name)||!((Et=n==null?void 0:n.metadata)!=null&&Et.subject)||!((_t=n==null?void 0:n.metadata)!=null&&_t.html_content)||qe,children:[qe?e.jsx(ue,{className:"h-4 w-4 mr-2 animate-spin"}):e.jsx(Ut,{className:"h-4 w-4 mr-2"}),qe?"Salvando...":"Salvar Alterações"]})]})]})})]})};export{Zr as default};
