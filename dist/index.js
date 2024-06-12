!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).I18=t()}(this,(function(){"use strict";var e=function(){return e=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var o in t=arguments[r])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},e.apply(this,arguments)};"function"==typeof SuppressedError&&SuppressedError;var t={},r=e=>encodeURIComponent(e).replace(/[!'()*]/g,(e=>`%${e.charCodeAt(0).toString(16).toUpperCase()}`)),n="%[a-f0-9]{2}",o=new RegExp("("+n+")|([^%]+?)","gi"),a=new RegExp("("+n+")+","gi");function i(e,t){try{return[decodeURIComponent(e.join(""))]}catch(e){}if(1===e.length)return e;t=t||1;var r=e.slice(0,t),n=e.slice(t);return Array.prototype.concat.call([],i(r),i(n))}function c(e){try{return decodeURIComponent(e)}catch(n){for(var t=e.match(o)||[],r=1;r<t.length;r++)t=(e=i(t,r).join("")).match(o)||[];return e}}var l=function(e){if("string"!=typeof e)throw new TypeError("Expected `encodedURI` to be of type `string`, got `"+typeof e+"`");try{return e=e.replace(/\+/g," "),decodeURIComponent(e)}catch(t){return function(e){for(var t={"%FE%FF":"��","%FF%FE":"��"},r=a.exec(e);r;){try{t[r[0]]=decodeURIComponent(r[0])}catch(e){var n=c(r[0]);n!==r[0]&&(t[r[0]]=n)}r=a.exec(e)}t["%C2"]="�";for(var o=Object.keys(t),i=0;i<o.length;i++){var l=o[i];e=e.replace(new RegExp(l,"g"),t[l])}return e}(e)}},s=(e,t)=>{if("string"!=typeof e||"string"!=typeof t)throw new TypeError("Expected the arguments to be of type `string`");if(""===t)return[e];const r=e.indexOf(t);return-1===r?[e]:[e.slice(0,r),e.slice(r+t.length)]},u=function(e,t){for(var r={},n=Object.keys(e),o=Array.isArray(t),a=0;a<n.length;a++){var i=n[a],c=e[i];(o?-1!==t.indexOf(i):t(i,c,e))&&(r[i]=c)}return r};return function(e){const t=r,n=l,o=s,a=u;function i(e){if("string"!=typeof e||1!==e.length)throw new TypeError("arrayFormatSeparator must be single character string")}function c(e,r){return r.encode?r.strict?t(e):encodeURIComponent(e):e}function p(e,t){return t.decode?n(e):e}function f(e){return Array.isArray(e)?e.sort():"object"==typeof e?f(Object.keys(e)).sort(((e,t)=>Number(e)-Number(t))).map((t=>e[t])):e}function d(e){const t=e.indexOf("#");return-1!==t&&(e=e.slice(0,t)),e}function y(e){const t=(e=d(e)).indexOf("?");return-1===t?"":e.slice(t+1)}function g(e,t){return t.parseNumbers&&!Number.isNaN(Number(e))&&"string"==typeof e&&""!==e.trim()?e=Number(e):!t.parseBooleans||null===e||"true"!==e.toLowerCase()&&"false"!==e.toLowerCase()||(e="true"===e.toLowerCase()),e}function h(e,t){i((t=Object.assign({decode:!0,sort:!0,arrayFormat:"none",arrayFormatSeparator:",",parseNumbers:!1,parseBooleans:!1},t)).arrayFormatSeparator);const r=function(e){let t;switch(e.arrayFormat){case"index":return(e,r,n)=>{t=/\[(\d*)\]$/.exec(e),e=e.replace(/\[\d*\]$/,""),t?(void 0===n[e]&&(n[e]={}),n[e][t[1]]=r):n[e]=r};case"bracket":return(e,r,n)=>{t=/(\[\])$/.exec(e),e=e.replace(/\[\]$/,""),t?void 0!==n[e]?n[e]=[].concat(n[e],r):n[e]=[r]:n[e]=r};case"comma":case"separator":return(t,r,n)=>{const o="string"==typeof r&&r.includes(e.arrayFormatSeparator),a="string"==typeof r&&!o&&p(r,e).includes(e.arrayFormatSeparator);r=a?p(r,e):r;const i=o||a?r.split(e.arrayFormatSeparator).map((t=>p(t,e))):null===r?r:p(r,e);n[t]=i};default:return(e,t,r)=>{void 0!==r[e]?r[e]=[].concat(r[e],t):r[e]=t}}}(t),n=Object.create(null);if("string"!=typeof e)return n;if(!(e=e.trim().replace(/^[?#&]/,"")))return n;for(const a of e.split("&")){if(""===a)continue;let[e,i]=o(t.decode?a.replace(/\+/g," "):a,"=");i=void 0===i?null:["comma","separator"].includes(t.arrayFormat)?i:p(i,t),r(p(e,t),i,n)}for(const e of Object.keys(n)){const r=n[e];if("object"==typeof r&&null!==r)for(const e of Object.keys(r))r[e]=g(r[e],t);else n[e]=g(r,t)}return!1===t.sort?n:(!0===t.sort?Object.keys(n).sort():Object.keys(n).sort(t.sort)).reduce(((e,t)=>{const r=n[t];return Boolean(r)&&"object"==typeof r&&!Array.isArray(r)?e[t]=f(r):e[t]=r,e}),Object.create(null))}e.extract=y,e.parse=h,e.stringify=(e,t)=>{if(!e)return"";i((t=Object.assign({encode:!0,strict:!0,arrayFormat:"none",arrayFormatSeparator:","},t)).arrayFormatSeparator);const r=r=>t.skipNull&&null==e[r]||t.skipEmptyString&&""===e[r],n=function(e){switch(e.arrayFormat){case"index":return t=>(r,n)=>{const o=r.length;return void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?r:null===n?[...r,[c(t,e),"[",o,"]"].join("")]:[...r,[c(t,e),"[",c(o,e),"]=",c(n,e)].join("")]};case"bracket":return t=>(r,n)=>void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?r:null===n?[...r,[c(t,e),"[]"].join("")]:[...r,[c(t,e),"[]=",c(n,e)].join("")];case"comma":case"separator":return t=>(r,n)=>null==n||0===n.length?r:0===r.length?[[c(t,e),"=",c(n,e)].join("")]:[[r,c(n,e)].join(e.arrayFormatSeparator)];default:return t=>(r,n)=>void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?r:null===n?[...r,c(t,e)]:[...r,[c(t,e),"=",c(n,e)].join("")]}}(t),o={};for(const t of Object.keys(e))r(t)||(o[t]=e[t]);const a=Object.keys(o);return!1!==t.sort&&a.sort(t.sort),a.map((r=>{const o=e[r];return void 0===o?"":null===o?c(r,t):Array.isArray(o)?o.reduce(n(r),[]).join("&"):c(r,t)+"="+c(o,t)})).filter((e=>e.length>0)).join("&")},e.parseUrl=(e,t)=>{t=Object.assign({decode:!0},t);const[r,n]=o(e,"#");return Object.assign({url:r.split("?")[0]||"",query:h(y(e),t)},t&&t.parseFragmentIdentifier&&n?{fragmentIdentifier:p(n,t)}:{})},e.stringifyUrl=(t,r)=>{r=Object.assign({encode:!0,strict:!0},r);const n=d(t.url).split("?")[0]||"",o=e.extract(t.url),a=e.parse(o,{sort:!1}),i=Object.assign(a,t.query);let l=e.stringify(i,r);l&&(l=`?${l}`);let s=function(e){let t="";const r=e.indexOf("#");return-1!==r&&(t=e.slice(r)),t}(t.url);return t.fragmentIdentifier&&(s=`#${c(t.fragmentIdentifier,r)}`),`${n}${l}${s}`},e.pick=(t,r,n)=>{n=Object.assign({parseFragmentIdentifier:!0},n);const{url:o,query:i,fragmentIdentifier:c}=e.parseUrl(t,n);return e.stringifyUrl({url:o,query:a(i,r),fragmentIdentifier:c},n)},e.exclude=(t,r,n)=>{const o=Array.isArray(r)?e=>!r.includes(e):(e,t)=>!r(e,t);return e.pick(t,o,n)}}(t),function(){function r(e){void 0===e&&(e={}),this.pack=e.pack||{},this.localeField=e.localeField||"locale",this.defaultLocale=e.defaultLocale||"zh",this.replace=e.replace||!1,this.debug=e.debug||!1,this.locale=this.getLocale(!0),this.replace&&this.DOMreplace(),this.debug&&console.log("I18初始化",this)}return r.prototype.DOMreplace=function(){for(var e=this,t=function(t){return e.t(t)||t.replace(/{locale}/g,e.getLocale())},r=document.querySelectorAll("[i18-children]"),n=0;n<r.length;n++){var o=r[n].getAttribute("i18-children");r[n].innerHTML=t(o)}var a=document.querySelectorAll("[i18-placeholder]");for(n=0;n<a.length;n++){o=a[n].getAttribute("i18-placeholder");a[n].setAttribute("placeholder",t(o))}var i=document.querySelectorAll("[i18-src]");for(n=0;n<i.length;n++){o=i[n].getAttribute("i18-src");i[n].setAttribute("src",t(o))}},r.prototype.setLocale=function(r){var n;localStorage.setItem(this.localeField,r);var o=window.location.href.split("?")[0],a=window.location.href.split("?")[1],i=t.stringify(e(e({},t.parse(a)),((n={})[this.localeField]=r,n)));window.location.href="".concat(o,"?").concat(i),-1!==window.location.href.indexOf("#")&&window.location.reload()},r.prototype.getLocale=function(e){var r,n;if(void 0===e&&(e=!1),e){var o=window.location.href.split("?")[1],a=null===(r=t.parse(o))||void 0===r?void 0:r[this.localeField],i=localStorage.getItem(this.localeField),c=null===(n=navigator.language)||void 0===n?void 0:n.split("-")[0];return a||i||c}return this.locale},r.prototype.t=function(e,t){var r,n,o=this.getLocale(),a=(null===(r=this.pack[e])||void 0===r?void 0:r[o])||(null===(n=this.pack[e])||void 0===n?void 0:n[this.defaultLocale]);return t&&Object.keys(t).forEach((function(e){a=a.replace("{".concat(e,"}"),t[e])})),a},r}()}));
