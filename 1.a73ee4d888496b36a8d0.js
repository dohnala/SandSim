(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{10:function(t,e,n){"use strict";var r=n.w[t.i];t.exports=r;n(9);r.J()},15:function(t,e,n){"use strict";n.r(e),n.d(e,"canvas",(function(){return it})),n.d(e,"config",(function(){return rt})),n.d(e,"map",(function(){return L})),n.d(e,"createMap",(function(){return at})),n.d(e,"nextTick",(function(){return ot}));var r=n(9),i=n(10),a=n(12),o=[{key:r.a.Empty,value:{name:"Empty",color:"rgba(255,255,255,1)"}},{key:r.a.Wall,value:{name:"Wall",color:"rgba(0,0,0,1)"}},{key:r.a.Sand,value:{name:"Sand",color:"rgba(194, 178, 127, 1)"}}],u=[{key:r.d.EMPTY,value:{name:"Empty"}},{key:r.d.CAVE,value:{name:"Cave"}}],c=document.getElementById("fps"),l=document.getElementById("meanRenderTime"),s=document.getElementById("meanTickTime"),f=document.getElementById("lastTickTime"),h=document.getElementById("meanPixelsProcessed"),v=document.getElementById("lastPixelsProcessed"),d={mean:0,delta:0,frames:[],lastFrameTimeStamp:performance.now(),measure:function(){var t=performance.now(),e=t-this.lastFrameTimeStamp;this.lastFrameTimeStamp=t;var n=1/e*1e3;this.delta=e/1e3,this.frames.push(n),this.frames.length>100&&this.frames.shift(),this.mean=w(this.frames)}},m={mean:0,last:0,frames:[],startTime:performance.now(),start:function(){this.startTime=performance.now()},stop:function(){if(!window.paused){var t=performance.now()-this.startTime;this.last=t,this.frames.push(t),this.frames.length>100&&this.frames.shift(),this.mean=w(this.frames)}}},p={mean:0,last:0,frames:[],startTime:performance.now(),start:function(){this.startTime=performance.now()},stop:function(){var t=performance.now()-this.startTime;this.last=t,f.textContent=window.paused?"".concat(Math.round(this.last),"ms"):"",this.frames.push(t),this.frames.length>100&&this.frames.shift(),this.mean=w(this.frames)}},y={mean:0,last:0,frames:[],measure:function(t){this.last=t,v.textContent=window.paused?"".concat(Math.round(this.last)," \n        (").concat(g(this.last,rt.width*rt.height),"%)"):"",this.frames.push(t),this.frames.length>100&&this.frames.shift(),this.mean=w(this.frames)},reset:function(){this.mean=0,this.last=0,this.frames=[]}},w=function(t){for(var e=0,n=0;n<t.length;n++)e+=t[n];return e/t.length},g=function(t,e){return Math.round(100*t/e)};setInterval((function(){c.textContent="FPS: ".concat(Math.round(d.mean)),l.textContent="".concat(Math.round(m.mean),"ms"),s.textContent="".concat(Math.round(p.mean),"ms"),h.textContent="".concat(Math.round(y.mean)," \n    (").concat(g(Math.round(y.mean),rt.width*rt.height),"%)")}),100);var _=n(14),k=document.getElementById("canvas");_("document").ready((function(){x(),O(),b()})),_("#create").click((function(){rt.width=nt(_("#configWidth").val(),64,512),rt.height=nt(_("#configHeight").val(),64,512),rt.gravity=nt(_("#configGravity").val(),-1,1),rt.max_velocity=nt(_("#configMaxVelocity").val(),0,100),rt.generator=function(t){for(var e in u)if(u.hasOwnProperty(e)&&u[e].value.name===t)return e;return null}(_("#configGenerator").val()),at(),b()}));var b=function(){_("#configWidth").val(rt.width),_("#configHeight").val(rt.height),_("#configGravity").val(rt.gravity),_("#configMaxVelocity").val(rt.max_velocity),_("#configGenerator").val(u[rt.generator].value.name)},x=function(){for(var t in u)if(u.hasOwnProperty(t)){var e="<option>".concat(u[t].value.name,"</option>");_("#configGenerator").append(e)}},M=!1,E=_("#play"),C=_("#pause"),T=_("#nextFrame"),I=_("#reset");E.hide(),T.addClass("disabled"),E.click((function(){return Y()})),C.click((function(){return Y()})),T.click((function(){return P()})),I.click((function(){return X()})),_("body").keypress((function(t){112===t.keyCode?Y():102===t.keyCode?P():114===t.keyCode&&X()}));var Y=function(){M=!M,window.paused=M,M?(E.show(),C.hide(),T.removeClass("disabled")):(E.hide(),C.show(),T.addClass("disabled"))},P=function(){M&&(p.start(),y.measure(ot()),p.stop())},X=function(){L.clear(),y.reset()},D=null,O=function(){var t=function(t){if(o.hasOwnProperty(t)){var e='\n                <div class="form-check">\n                    <input class="form-check-input" type="radio" name="flexRadioDefault" id="element_'.concat(t,'">\n                    <label class="form-check-label" for="element_').concat(t,'">\n                        <i class="bi bi-square-fill" style="color: ').concat(o[t].value.color,'"></i>\n                        <label>').concat(o[t].value.name,"</label>\n                    </label>\n                </div>");_("#painting").append(e),_("#element_"+t).change((function(){return D=Number(t)}))}};for(var e in o)t(e);D=2,_("#element_2").attr("checked",!0)},A={value:0,step:1,min:0,max:5},B=_("#brushSize");B.on("change",(function(){A.value=nt(Number(_(this).val()),A.min,A.max)})),_(window).bind("mousewheel DOMMouseScroll",(function(t){t.originalEvent.wheelDelta>0||t.originalEvent.detail<0?(A.value=nt(A.value+A.step,A.min,A.max),B.val(A.value)):(A.value=nt(A.value-A.step,A.min,A.max),B.val(A.value))}));var S=null,j=!1,F=null,q=_("#inspectCheck"),R=_("#inspectDetails");R.hide(),q.click((function(){q.prop("checked")?(j=!0,clearInterval(F),F=window.setInterval((function(){return G()}),100)):(j=!1,clearInterval(F))}));var G=function(t){if(j&&S){var e=L.pixel_state(S[0],S[1]);e&&(R.show(),_("#inspectElement").text(o[e.element()].value.name),_("#inspectPosition").text("("+S[0]+", "+S[1]+")"),_("#inspectVelocity").text("(0, "+e.velocity_y()+")"))}else R.hide()},V=!1,W=null,z=null;k.addEventListener("mousedown",(function(t){t.preventDefault(),V=!0,clearInterval(z),z=window.setInterval((function(){return J(t)}),100),J(t),W=t})),document.body.addEventListener("mouseup",(function(t){clearInterval(z),V&&(t.preventDefault(),W=null,V=!1)})),k.addEventListener("mousemove",(function(t){clearInterval(z),N(t),function(t){S=q.prop("checked")?U(t):null}(t)})),k.addEventListener("mouseleave",(function(t){clearInterval(z),W=null,S=null}));var L,H,J=function(t){if(V){var e=U(t);L.insert(e[0],e[1],D,A.value)}},N=function(t){clearInterval(z),z=window.setInterval((function(){return J(t)}),100);var e={clientX:t.clientX,clientY:t.clientY};if(V){var n=0;if(J(e),W)for(;K(e,W)>1/3;){var r=K(e,W);if(e=Q(e,tt($(Z(W,t)),Math.min(1/3,r))),++n>1e3)break;J(e)}W=t}},U=function(t){var e=k.getBoundingClientRect(),n=k.width/Math.ceil(window.devicePixelRatio)/e.width,r=k.height/Math.ceil(window.devicePixelRatio)/e.height,i=(t.clientX-e.left)*n,a=(t.clientY-e.top)*r;return[Math.max(Math.min(Math.floor(i),rt.width-1),0),Math.max(Math.min(Math.floor(a),rt.height-1),0)]},K=function(t,e){return Math.sqrt(Math.pow(t.clientX-e.clientX,2)+Math.pow(t.clientY-e.clientY,2),2)},Q=function(t,e){return{clientX:t.clientX+e.clientX,clientY:t.clientY+e.clientY}},Z=function(t,e){return{clientX:t.clientX-e.clientX,clientY:t.clientY-e.clientY}},$=function(t){var e=et(t);return{clientX:t.clientX/e,clientY:t.clientY/e}},tt=function(t,e){return{clientX:t.clientX*e,clientY:t.clientY*e}},et=function(t){return Math.sqrt(Math.pow(t.clientX,2)+Math.pow(t.clientY,2),2)},nt=function(t,e,n){return Math.min(Math.max(t,e),n)},rt={width:128,height:128,gravity:.2,max_velocity:5,generator:r.d.EMPTY},it=document.getElementById("canvas"),at=function(){var t,e,n,o,u,c,l,s,f,h;L=r.b.new(r.c.new(rt.width,rt.height,rt.gravity,rt.max_velocity,Math.floor(Math.random()*Math.floor(1e4))),Number(rt.generator)),it.width=rt.width*Math.ceil(window.devicePixelRatio),it.height=rt.height*Math.ceil(window.devicePixelRatio),e=(t={canvas:it,map:L}).canvas,n=t.map,o=a({canvas:e}),u=n.width(),c=n.height(),l=n.pixels(),s=new Uint8Array(i.C.buffer,l,u*c*4),f=o.texture({width:u,height:c,data:s}),h=o({frag:"\n        precision highp float;\n        uniform sampler2D data;\n        varying vec2 uv;\n        void main() {\n            vec2 textCoord = (uv * vec2(0.5, -0.5)) + vec2(0.5);\n            vec4 data = texture2D(data, textCoord);\n            int element = int((data.r * 255.) + 0.1);\n            vec4 color;\n            \n            // empty\n            if (element == 0) {\n                color = vec4(255, 255, 255, 1);\n            }\n            \n            if (element == 1) {\n                color = vec4(0, 0, 0, 1);\n            }\n            \n            // sand\n            if (element == 2) {\n                color = vec4(0.76, 0.7, 0.5, 1);\n            }\n            \n            gl_FragColor = color;\n        }",vert:"\n        precision mediump float;\n        attribute vec2 position;\n        varying vec2 uv;\n        void main() {\n            uv = position;\n            gl_Position = vec4(position, 0, 1);\n        }",uniforms:{data:function(){return l=n.pixels(),s=new Uint8Array(i.C.buffer,l,u*c*4),f({width:u,height:c,data:s})}},attributes:{position:[[-1,4],[-1,-1],[4,-1]]},count:3}),H=function(){o.poll(),h()},y.reset()};at();var ot=function(){return L.tick(d.delta)};!function t(){d.measure(),window.paused||(p.start(),y.measure(ot()),p.stop()),m.start(),H(),m.stop(),window.animationId=requestAnimationFrame(t)}()},9:function(t,e,n){"use strict";(function(t){n.d(e,"d",(function(){return k})),n.d(e,"a",(function(){return b})),n.d(e,"b",(function(){return x})),n.d(e,"c",(function(){return M})),n.d(e,"f",(function(){return T})),n.d(e,"g",(function(){return I})),n.d(e,"e",(function(){return Y})),n.d(e,"h",(function(){return P})),n.d(e,"i",(function(){return X}));var r=n(10);function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function a(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function o(t,e,n){return e&&a(t.prototype,e),n&&a(t,n),t}var u=new Array(32).fill(void 0);function c(t){return u[t]}u.push(void 0,null,!0,!1);var l=u.length;function s(t){var e=c(t);return function(t){t<36||(u[t]=l,l=t)}(t),e}var f=new("undefined"==typeof TextDecoder?(0,t.require)("util").TextDecoder:TextDecoder)("utf-8",{ignoreBOM:!0,fatal:!0});f.decode();var h=null;function v(){return null!==h&&h.buffer===r.C.buffer||(h=new Uint8Array(r.C.buffer)),h}function d(t,e){return f.decode(v().subarray(t,t+e))}function m(t,e){if(!(t instanceof e))throw new Error("expected instance of ".concat(e.name));return t.ptr}var p=0,y=new("undefined"==typeof TextEncoder?(0,t.require)("util").TextEncoder:TextEncoder)("utf-8"),w="function"==typeof y.encodeInto?function(t,e){return y.encodeInto(t,e)}:function(t,e){var n=y.encode(t);return e.set(n),{read:t.length,written:n.length}};var g=null;function _(){return null!==g&&g.buffer===r.C.buffer||(g=new Int32Array(r.C.buffer)),g}var k=Object.freeze({EMPTY:0,0:"EMPTY",CAVE:1,1:"CAVE"}),b=Object.freeze({Empty:0,0:"Empty",Wall:1,1:"Wall",Sand:2,2:"Sand"}),x=function(){function t(){i(this,t)}return o(t,[{key:"__destroy_into_raw",value:function(){var t=this.ptr;return this.ptr=0,t}},{key:"free",value:function(){var t=this.__destroy_into_raw();r.f(t)}},{key:"insert",value:function(t,e,n,i){r.t(this.ptr,t,e,n,i)}},{key:"clear",value:function(){r.r(this.ptr)}},{key:"tick",value:function(){return r.A(this.ptr)>>>0}},{key:"width",value:function(){return r.e(this.ptr)}},{key:"height",value:function(){return r.b(this.ptr)}},{key:"generation",value:function(){return r.s(this.ptr)}},{key:"pixels",value:function(){return r.z(this.ptr)}},{key:"pixel",value:function(t,e){var n=r.x(this.ptr,t,e);return E.__wrap(n)}},{key:"pixel_state",value:function(t,e){var n=r.y(this.ptr,t,e);return C.__wrap(n)}}],[{key:"__wrap",value:function(e){var n=Object.create(t.prototype);return n.ptr=e,n}},{key:"new_empty",value:function(e){m(e,M);var n=e.ptr;e.ptr=0;var i=r.w(n);return t.__wrap(i)}},{key:"new_cave",value:function(e){m(e,M);var n=e.ptr;e.ptr=0;var i=r.v(n);return t.__wrap(i)}},{key:"new",value:function(e,n){m(e,M);var i=e.ptr;e.ptr=0;var a=r.u(i,n);return t.__wrap(a)}}]),t}(),M=function(){function t(){i(this,t)}return o(t,[{key:"__destroy_into_raw",value:function(){var t=this.ptr;return this.ptr=0,t}},{key:"free",value:function(){var t=this.__destroy_into_raw();r.g(t)}},{key:"width",get:function(){return r.e(this.ptr)},set:function(t){r.n(this.ptr,t)}},{key:"height",get:function(){return r.b(this.ptr)},set:function(t){r.k(this.ptr,t)}},{key:"gravity",get:function(){return r.a(this.ptr)},set:function(t){r.j(this.ptr,t)}},{key:"max_velocity",get:function(){return r.c(this.ptr)},set:function(t){r.l(this.ptr,t)}},{key:"seed",get:function(){return r.d(this.ptr)},set:function(t){r.m(this.ptr,t)}}],[{key:"__wrap",value:function(e){var n=Object.create(t.prototype);return n.ptr=e,n}},{key:"new",value:function(e,n,i,a,o){var u=r.B(e,n,i,a,o);return t.__wrap(u)}}]),t}(),E=function(){function t(){i(this,t)}return o(t,[{key:"__destroy_into_raw",value:function(){var t=this.ptr;return this.ptr=0,t}},{key:"free",value:function(){var t=this.__destroy_into_raw();r.h(t)}},{key:"element",value:function(){return r.D(this.ptr)>>>0}}],[{key:"__wrap",value:function(e){var n=Object.create(t.prototype);return n.ptr=e,n}},{key:"new",value:function(e){var n=r.E(e);return t.__wrap(n)}}]),t}(),C=function(){function t(){i(this,t)}return o(t,[{key:"__destroy_into_raw",value:function(){var t=this.ptr;return this.ptr=0,t}},{key:"free",value:function(){var t=this.__destroy_into_raw();r.i(t)}},{key:"element",value:function(){return r.G(this.ptr)>>>0}},{key:"velocity_y",value:function(){return r.I(this.ptr)}},{key:"clock_flag",value:function(){return 0!==r.F(this.ptr)}}],[{key:"__wrap",value:function(e){var n=Object.create(t.prototype);return n.ptr=e,n}},{key:"new",value:function(e){var n=r.H(e);return t.__wrap(n)}}]),t}(),T=function(){return function(t){l===u.length&&u.push(u.length+1);var e=l;return l=u[e],u[e]=t,e}(new Error)},I=function(t,e){var n=function(t,e,n){if(void 0===n){var r=y.encode(t),i=e(r.length);return v().subarray(i,i+r.length).set(r),p=r.length,i}for(var a=t.length,o=e(a),u=v(),c=0;c<a;c++){var l=t.charCodeAt(c);if(l>127)break;u[o+c]=l}if(c!==a){0!==c&&(t=t.slice(c)),o=n(o,a,a=c+3*t.length);var s=v().subarray(o+c,o+a);c+=w(t,s).written}return p=c,o}(c(e).stack,r.p,r.q),i=p;_()[t/4+1]=i,_()[t/4+0]=n},Y=function(t,e){try{console.error(d(t,e))}finally{r.o(t,e)}},P=function(t){s(t)},X=function(t,e){throw new Error(d(t,e))}}).call(this,n(13)(t))}}]);
//# sourceMappingURL=1.a73ee4d888496b36a8d0.js.map