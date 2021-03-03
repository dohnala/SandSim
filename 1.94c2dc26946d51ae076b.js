(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{10:function(t,n,e){"use strict";var r=e.w[t.i];t.exports=r;e(9);r.A()},15:function(t,n,e){"use strict";e.r(n),e.d(n,"canvas",(function(){return R})),e.d(n,"config",(function(){return P})),e.d(n,"map",(function(){return C})),e.d(n,"createMap",(function(){return U})),e.d(n,"nextTick",(function(){return W}));var r=e(9),i=e(10),a=e(12),o=document.getElementById("fps"),u=document.getElementById("meanFrameTime"),c=document.getElementById("meanRenderTime"),f=document.getElementById("meanTickTime"),l=document.getElementById("lastTickTime"),s={mean:0,delta:0,frames:[],lastFrameTimeStamp:performance.now(),measure:function(){var t=performance.now(),n=t-this.lastFrameTimeStamp;this.lastFrameTimeStamp=t;var e=1/n*1e3;this.delta=n/1e3,this.frames.push(e),this.frames.length>100&&this.frames.shift(),this.mean=m(this.frames)}},h={mean:0,last:0,frames:[],startTime:performance.now(),start:function(){this.startTime=performance.now()},stop:function(){if(!window.paused){var t=performance.now()-this.startTime;this.last=t,this.frames.push(t),this.frames.length>100&&this.frames.shift(),this.mean=m(this.frames)}}},d={mean:0,last:0,frames:[],startTime:performance.now(),start:function(){this.startTime=performance.now()},stop:function(){if(!window.paused){var t=performance.now()-this.startTime;this.last=t,this.frames.push(t),this.frames.length>100&&this.frames.shift(),this.mean=m(this.frames)}}},v={mean:0,last:0,frames:[],startTime:performance.now(),start:function(){this.startTime=performance.now()},stop:function(){var t=performance.now()-this.startTime;this.last=t,l.textContent=window.paused?"".concat(Math.round(this.last),"ms"):"",this.frames.push(t),this.frames.length>100&&this.frames.shift(),this.mean=m(this.frames)}},m=function(t){for(var n=0,e=0;e<t.length;e++)n+=t[e];return n/t.length};setInterval((function(){o.textContent="FPS: ".concat(Math.round(s.mean)),u.textContent="".concat(Math.round(h.mean),"ms"),c.textContent="".concat(Math.round(d.mean),"ms"),f.textContent="".concat(Math.round(v.mean),"ms")}),500);var p=e(14),w=document.getElementById("canvas"),y=r.a.Sand,g=!1,_=p("#create"),k=p("#play"),x=p("#pause"),b=p("#nextFrame");k.hide(),b.addClass("disabled"),p("document").ready((function(){M()})),_.click((function(){P.width=O(p("#configWidth").val(),64,512),P.height=O(p("#configHeight").val(),64,512),P.gravity=O(p("#configGravity").val(),-1,1),P.max_velocity=O(p("#configMaxVelocity").val(),0,100),U(),M()})),k.click((function(){return T()})),x.click((function(){return T()})),b.click((function(){g&&(v.start(),W(),v.stop())})),p("#reset").click((function(){return C.clear()}));var M=function(){p("#configWidth").val(P.width),p("#configHeight").val(P.height),p("#configGravity").val(P.gravity),p("#configMaxVelocity").val(P.max_velocity)},T=function(){g=!g,window.paused=g,g?(k.show(),x.hide(),b.removeClass("disabled")):(k.hide(),x.show(),b.addClass("disabled"))};p("#emptyElement").change((function(){return y=r.a.Empty})),p("#wallElement").change((function(){return y=r.a.Wall})),p("#sandElement").change((function(){return y=r.a.Sand}));var E=!1,I=null,X=null;w.addEventListener("mousedown",(function(t){t.preventDefault(),E=!0,clearInterval(X),X=window.setInterval((function(){return Y(t)}),100),Y(t),I=t})),document.body.addEventListener("mouseup",(function(t){clearInterval(X),E&&(t.preventDefault(),I=null,E=!1)})),w.addEventListener("mousemove",(function(t){clearInterval(X),function(t){clearInterval(X),X=window.setInterval((function(){return Y(t)}),100);var n={clientX:t.clientX,clientY:t.clientY};if(!E)return;var e=0;if(Y(n),I)for(;B(n,I)>1/3;){var r=B(n,I);if(n=F(n,q(j(S(I,t)),Math.min(1/3,r))),++e>1e3)break;Y(n)}I=t}(t)})),w.addEventListener("mouseleave",(function(t){clearInterval(X),I=null}));var Y=function(t){if(E){var n=w.getBoundingClientRect(),e=w.width/Math.ceil(window.devicePixelRatio)/n.width,r=w.height/Math.ceil(window.devicePixelRatio)/n.height,i=(t.clientX-n.left)*e,a=(t.clientY-n.top)*r,o=Math.max(Math.min(Math.floor(i),P.width-1),0),u=Math.max(Math.min(Math.floor(a),P.height-1),0);C.insert(o,u,y)}};var C,A,B=function(t,n){return Math.sqrt(Math.pow(t.clientX-n.clientX,2)+Math.pow(t.clientY-n.clientY,2),2)},F=function(t,n){return{clientX:t.clientX+n.clientX,clientY:t.clientY+n.clientY}},S=function(t,n){return{clientX:t.clientX-n.clientX,clientY:t.clientY-n.clientY}},j=function(t){var n=D(t);return{clientX:t.clientX/n,clientY:t.clientY/n}},q=function(t,n){return{clientX:t.clientX*n,clientY:t.clientY*n}},D=function(t){return Math.sqrt(Math.pow(t.clientX,2)+Math.pow(t.clientY,2),2)},O=function(t,n,e){return Math.min(Math.max(t,n),e)},P={width:128,height:128,gravity:.2,max_velocity:5},R=document.getElementById("canvas"),U=function(){var t,n,e,o,u,c,f,l,s,h;C=r.b.new(r.c.new(P.width,P.height,P.gravity,P.max_velocity)),R.width=P.width*Math.ceil(window.devicePixelRatio),R.height=P.height*Math.ceil(window.devicePixelRatio),n=(t={canvas:R,map:C}).canvas,e=t.map,o=a({canvas:n}),u=e.width(),c=e.height(),f=e.pixels(),l=new Uint8Array(i.t.buffer,f,u*c*4),s=o.texture({width:u,height:c,data:l}),h=o({frag:"\n        precision highp float;\n        uniform sampler2D data;\n        varying vec2 uv;\n        void main() {\n            vec2 textCoord = (uv * vec2(0.5, -0.5)) + vec2(0.5);\n            vec4 data = texture2D(data, textCoord);\n            int element = int((data.r * 255.) + 0.1);\n            vec4 color;\n            \n            // empty\n            if (element == 0) {\n                color = vec4(255, 255, 255, 1);\n            }\n            \n            if (element == 1) {\n                color = vec4(0, 0, 0, 1);\n            }\n            \n            // sand\n            if (element == 2) {\n                color = vec4(0.76, 0.7, 0.5, 1);\n            }\n            \n            gl_FragColor = color;\n        }",vert:"\n        precision mediump float;\n        attribute vec2 position;\n        varying vec2 uv;\n        void main() {\n            uv = position;\n            gl_Position = vec4(position, 0, 1);\n        }",uniforms:{data:function(){return f=e.pixels(),l=new Uint8Array(i.t.buffer,f,u*c*4),s({width:u,height:c,data:l})}},attributes:{position:[[-1,4],[-1,-1],[4,-1]]},count:3}),A=function(){o.poll(),h()}};U();var W=function(){C.tick(s.delta)};!function t(){s.measure(),h.start(),window.paused||(v.start(),W(),v.stop()),d.start(),A(),d.stop(),h.stop(),window.animationId=requestAnimationFrame(t)}()},9:function(t,n,e){"use strict";(function(t){e.d(n,"a",(function(){return x})),e.d(n,"b",(function(){return b})),e.d(n,"c",(function(){return M})),e.d(n,"g",(function(){return I})),e.d(n,"v",(function(){return X})),e.d(n,"m",(function(){return Y})),e.d(n,"o",(function(){return C})),e.d(n,"r",(function(){return A})),e.d(n,"n",(function(){return B})),e.d(n,"e",(function(){return F})),e.d(n,"i",(function(){return S})),e.d(n,"t",(function(){return j})),e.d(n,"d",(function(){return q})),e.d(n,"h",(function(){return D})),e.d(n,"j",(function(){return O})),e.d(n,"p",(function(){return P})),e.d(n,"l",(function(){return R})),e.d(n,"s",(function(){return U})),e.d(n,"k",(function(){return W})),e.d(n,"q",(function(){return L})),e.d(n,"f",(function(){return V})),e.d(n,"w",(function(){return z})),e.d(n,"u",(function(){return G}));var r=e(10);function i(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}function a(t,n){for(var e=0;e<n.length;e++){var r=n[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function o(t,n,e){return n&&a(t.prototype,n),e&&a(t,e),t}var u=new Array(32).fill(void 0);function c(t){return u[t]}u.push(void 0,null,!0,!1);var f=u.length;function l(t){var n=c(t);return function(t){t<36||(u[t]=f,f=t)}(t),n}var s=new("undefined"==typeof TextDecoder?(0,t.require)("util").TextDecoder:TextDecoder)("utf-8",{ignoreBOM:!0,fatal:!0});s.decode();var h=null;function d(){return null!==h&&h.buffer===r.t.buffer||(h=new Uint8Array(r.t.buffer)),h}function v(t,n){return s.decode(d().subarray(t,t+n))}function m(t){f===u.length&&u.push(u.length+1);var n=f;return f=u[n],u[n]=t,n}function p(t){return function(){try{return t.apply(this,arguments)}catch(t){r.e(m(t))}}}var w=0,y=new("undefined"==typeof TextEncoder?(0,t.require)("util").TextEncoder:TextEncoder)("utf-8"),g="function"==typeof y.encodeInto?function(t,n){return y.encodeInto(t,n)}:function(t,n){var e=y.encode(t);return n.set(e),{read:t.length,written:e.length}};var _=null;function k(){return null!==_&&_.buffer===r.t.buffer||(_=new Int32Array(r.t.buffer)),_}var x=Object.freeze({Empty:0,0:"Empty",Wall:1,1:"Wall",Sand:2,2:"Sand"}),b=function(){function t(){i(this,t)}return o(t,[{key:"__destroy_into_raw",value:function(){var t=this.ptr;return this.ptr=0,t}},{key:"free",value:function(){var t=this.__destroy_into_raw();r.a(t)}},{key:"insert",value:function(t,n,e){r.l(this.ptr,t,n,e)}},{key:"clear",value:function(){r.i(this.ptr)}},{key:"tick",value:function(){r.q(this.ptr)}},{key:"width",value:function(){return r.r(this.ptr)}},{key:"height",value:function(){return r.k(this.ptr)}},{key:"generation",value:function(){return r.j(this.ptr)}},{key:"pixels",value:function(){return r.p(this.ptr)}},{key:"pixel",value:function(t,n){var e=r.n(this.ptr,t,n);return T.__wrap(e)}},{key:"pixel_state",value:function(t,n){var e=r.o(this.ptr,t,n);return E.__wrap(e)}}],[{key:"__wrap",value:function(n){var e=Object.create(t.prototype);return e.ptr=n,e}},{key:"new",value:function(n){!function(t,n){if(!(t instanceof n))throw new Error("expected instance of ".concat(n.name));t.ptr}(n,M);var e=n.ptr;n.ptr=0;var i=r.m(e);return t.__wrap(i)}}]),t}(),M=function(){function t(){i(this,t)}return o(t,[{key:"__destroy_into_raw",value:function(){var t=this.ptr;return this.ptr=0,t}},{key:"free",value:function(){var t=this.__destroy_into_raw();r.b(t)}}],[{key:"__wrap",value:function(n){var e=Object.create(t.prototype);return e.ptr=n,e}},{key:"new",value:function(n,e,i,a){var o=r.s(n,e,i,a);return t.__wrap(o)}}]),t}(),T=function(){function t(){i(this,t)}return o(t,[{key:"__destroy_into_raw",value:function(){var t=this.ptr;return this.ptr=0,t}},{key:"free",value:function(){var t=this.__destroy_into_raw();r.c(t)}},{key:"element",value:function(){return r.u(this.ptr)>>>0}}],[{key:"__wrap",value:function(n){var e=Object.create(t.prototype);return e.ptr=n,e}},{key:"new",value:function(n){var e=r.v(n);return t.__wrap(e)}}]),t}(),E=function(){function t(){i(this,t)}return o(t,[{key:"__destroy_into_raw",value:function(){var t=this.ptr;return this.ptr=0,t}},{key:"free",value:function(){var t=this.__destroy_into_raw();r.d(t)}},{key:"element",value:function(){return r.x(this.ptr)>>>0}},{key:"velocity_y",value:function(){return r.z(this.ptr)}},{key:"clock_flag",value:function(){return 0!==r.w(this.ptr)}}],[{key:"__wrap",value:function(n){var e=Object.create(t.prototype);return e.ptr=n,e}},{key:"new",value:function(n){var e=r.y(n);return t.__wrap(e)}}]),t}(),I=p((function(t,n){c(t).getRandomValues(c(n))})),X=function(t){l(t)},Y=p((function(t,n,e){var r,i;c(t).randomFillSync((r=n,i=e,d().subarray(r/1,r/1+i)))})),C=p((function(){return m(self.self)})),A=function(){return m(t)},B=p((function(t,n,e){return m(c(t).require(v(n,e)))})),F=function(t){return m(c(t).crypto)},S=function(t){return m(c(t).msCrypto)},j=function(t){return void 0===c(t)},q=function(t){return m(c(t).buffer)},D=function(t){return c(t).length},O=function(t){return m(new Uint8Array(c(t)))},P=function(t,n,e){c(t).set(c(n),e>>>0)},R=function(t){return m(new Uint8Array(t>>>0))},U=function(t,n,e){return m(c(t).subarray(n>>>0,e>>>0))},W=function(){return m(new Error)},L=function(t,n){var e=function(t,n,e){if(void 0===e){var r=y.encode(t),i=n(r.length);return d().subarray(i,i+r.length).set(r),w=r.length,i}for(var a=t.length,o=n(a),u=d(),c=0;c<a;c++){var f=t.charCodeAt(c);if(f>127)break;u[o+c]=f}if(c!==a){0!==c&&(t=t.slice(c)),o=e(o,a,a=c+3*t.length);var l=d().subarray(o+c,o+a);c+=g(t,l).written}return w=c,o}(c(n).stack,r.g,r.h),i=w;k()[t/4+1]=i,k()[t/4+0]=e},V=function(t,n){try{console.error(v(t,n))}finally{r.f(t,n)}},z=function(t,n){throw new Error(v(t,n))},G=function(){return m(r.t)}}).call(this,e(13)(t))}}]);
//# sourceMappingURL=1.94c2dc26946d51ae076b.js.map