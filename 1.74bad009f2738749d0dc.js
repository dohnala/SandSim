(window.webpackJsonp=window.webpackJsonp||[]).push([[1],[,function(n,t,e){"use strict";e.r(t),e.d(t,"canvas",(function(){return b})),e.d(t,"width",(function(){return m})),e.d(t,"height",(function(){return y})),e.d(t,"map",(function(){return g}));var r=e(2),i=e(3),o=e(5),c=document.getElementById("canvas"),u=!1,a=null,l=null;c.addEventListener("mousedown",(function(n){n.preventDefault(),u=!0,clearInterval(l),l=window.setInterval((function(){return f(n)}),100),f(n),a=n})),document.body.addEventListener("mouseup",(function(n){clearInterval(l),u&&(n.preventDefault(),a=null,u=!1)})),c.addEventListener("mousemove",(function(n){clearInterval(l),function(n){clearInterval(l),l=window.setInterval((function(){return f(n)}),100);var t={clientX:n.clientX,clientY:n.clientY};if(!u)return;var e=0;if(f(t),a)for(;d(t,a)>1/3;){var r=d(t,a);if(t=v(t,p(s(h(a,n)),Math.min(1/3,r))),++e>1e3)break;f(t)}a=n}(n)})),c.addEventListener("mouseleave",(function(n){clearInterval(l),a=null}));var f=function(n){if(u){var t=c.getBoundingClientRect(),e=c.width/Math.ceil(window.devicePixelRatio)/t.width,i=c.height/Math.ceil(window.devicePixelRatio)/t.height,o=(n.clientX-t.left)*e,a=(n.clientY-t.top)*i,l=Math.min(Math.floor(o),m-1),f=Math.min(Math.floor(a),y-1);g.insert(l,f,r.a.Sand)}};var d=function(n,t){return Math.sqrt(Math.pow(n.clientX-t.clientX,2)+Math.pow(n.clientY-t.clientY,2),2)},v=function(n,t){return{clientX:n.clientX+t.clientX,clientY:n.clientY+t.clientY}},h=function(n,t){return{clientX:n.clientX-t.clientX,clientY:n.clientY-t.clientY}},s=function(n){var t=w(n);return{clientX:n.clientX/t,clientY:n.clientY/t}},p=function(n,t){return{clientX:n.clientX*t,clientY:n.clientY*t}},w=function(n){return Math.sqrt(Math.pow(n.clientX,2)+Math.pow(n.clientY,2),2)},m=100,y=100,g=r.b.new(m,y),b=document.getElementById("canvas");b.width=m*Math.ceil(window.devicePixelRatio),b.height=y*Math.ceil(window.devicePixelRatio);var M,k,x,X,Y,E,I,A,D,T,C=(k=(M={canvas:b,map:g}).canvas,x=M.map,X=o({canvas:k}),Y=x.width(),E=x.height(),I=x.pixels(),A=new Uint8Array(i.m.buffer,I,Y*E*4),D=X.texture({width:Y,height:E,data:A}),T=X({frag:"\n        precision highp float;\n        uniform sampler2D data;\n        varying vec2 uv;\n        void main() {\n            vec2 textCoord = (uv * vec2(0.5, -0.5)) + vec2(0.5);\n            vec4 data = texture2D(data, textCoord);\n            int element = int((data.r * 255.) + 0.1);\n            vec4 color;\n            \n            // empty\n            if (element == 0) {\n                color = vec4(1, 1, 1, 1);\n            }\n            \n            if (element == 1) {\n                color = vec4(0, 0, 0, 1);\n            }\n            \n            // sand\n            if (element == 2) {\n                color = vec4(0.76, 0.7, 0.5, 1);\n            }\n            \n            gl_FragColor = color;\n        }",vert:"\n        precision mediump float;\n        attribute vec2 position;\n        varying vec2 uv;\n        void main() {\n            uv = position;\n            gl_Position = vec4(position, 0, 1);\n        }",uniforms:{data:function(){return I=x.pixels(),A=new Uint8Array(i.m.buffer,I,Y*E*4),D({width:Y,height:E,data:A})}},attributes:{position:[[-1,4],[-1,-1],[4,-1]]},count:3}),function(){X.poll(),T()});!function n(){window.paused||g.tick(),C(),window.animationId=requestAnimationFrame(n)}()},function(n,t,e){"use strict";(function(n){e.d(t,"a",(function(){return M})),e.d(t,"b",(function(){return k})),e.d(t,"e",(function(){return x})),e.d(t,"d",(function(){return X})),e.d(t,"f",(function(){return Y})),e.d(t,"c",(function(){return E})),e.d(t,"g",(function(){return I})),e.d(t,"h",(function(){return A}));var r=e(3);function i(n,t){if(!(n instanceof t))throw new TypeError("Cannot call a class as a function")}function o(n,t){for(var e=0;e<t.length;e++){var r=t[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(n,r.key,r)}}function c(n,t,e){return t&&o(n.prototype,t),e&&o(n,e),n}var u=new Array(32).fill(void 0);function a(n){return u[n]}u.push(void 0,null,!0,!1);var l=u.length;function f(n){var t=a(n);return function(n){n<36||(u[n]=l,l=n)}(n),t}var d=new("undefined"==typeof TextDecoder?(0,n.require)("util").TextDecoder:TextDecoder)("utf-8",{ignoreBOM:!0,fatal:!0});d.decode();var v=null;function h(){return null!==v&&v.buffer===r.m.buffer||(v=new Uint8Array(r.m.buffer)),v}function s(n,t){return d.decode(h().subarray(n,n+t))}var p=0,w=new("undefined"==typeof TextEncoder?(0,n.require)("util").TextEncoder:TextEncoder)("utf-8"),m="function"==typeof w.encodeInto?function(n,t){return w.encodeInto(n,t)}:function(n,t){var e=w.encode(n);return t.set(e),{read:n.length,written:e.length}};var y=null;function g(){return null!==y&&y.buffer===r.m.buffer||(y=new Int32Array(r.m.buffer)),y}var b,M=Object.freeze({Empty:0,0:"Empty",Wall:1,1:"Wall",Sand:2,2:"Sand"}),k=function(){function n(){i(this,n)}return c(n,[{key:"free",value:function(){var n=this.ptr;this.ptr=0,r.a(n)}},{key:"insert",value:function(n,t,e){r.h(this.ptr,n,t,e)}},{key:"clear",value:function(){r.f(this.ptr)}},{key:"tick",value:function(){r.k(this.ptr)}},{key:"width",value:function(){return r.l(this.ptr)}},{key:"height",value:function(){return r.g(this.ptr)}},{key:"pixels",value:function(){return r.j(this.ptr)}}],[{key:"__wrap",value:function(t){var e=Object.create(n.prototype);return e.ptr=t,e}},{key:"new",value:function(t,e){var i=r.i(t,e);return n.__wrap(i)}}]),n}(),x="function"==typeof Math.random?Math.random:(b="Math.random",function(){throw new Error("".concat(b," is not defined"))}),X=function(){return function(n){l===u.length&&u.push(u.length+1);var t=l;return l=u[t],u[t]=n,t}(new Error)},Y=function(n,t){var e=function(n,t,e){if(void 0===e){var r=w.encode(n),i=t(r.length);return h().subarray(i,i+r.length).set(r),p=r.length,i}for(var o=n.length,c=t(o),u=h(),a=0;a<o;a++){var l=n.charCodeAt(a);if(l>127)break;u[c+a]=l}if(a!==o){0!==a&&(n=n.slice(a)),c=e(c,o,o=a+3*n.length);var f=h().subarray(c+a,c+o);a+=m(n,f).written}return p=a,c}(a(t).stack,r.d,r.e),i=p;g()[n/4+1]=i,g()[n/4+0]=e},E=function(n,t){try{console.error(s(n,t))}finally{r.c(n,t)}},I=function(n){f(n)},A=function(n,t){throw new Error(s(n,t))}}).call(this,e(6)(n))},function(n,t,e){"use strict";var r=e.w[n.i];n.exports=r;e(2);r.n()}]]);
//# sourceMappingURL=1.74bad009f2738749d0dc.js.map