(window.webpackJsonp=window.webpackJsonp||[]).push([[1],[,,,,,,,,,function(e,n,t){"use strict";(function(e){t.d(n,"a",(function(){return z})),t.d(n,"d",(function(){return C})),t.d(n,"b",(function(){return E})),t.d(n,"c",(function(){return I})),t.d(n,"f",(function(){return D})),t.d(n,"g",(function(){return L})),t.d(n,"e",(function(){return A})),t.d(n,"h",(function(){return T})),t.d(n,"i",(function(){return Y}));var i=t(10);function r(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function o(e,n){for(var t=0;t<n.length;t++){var i=n[t];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function a(e,n,t){return n&&o(e.prototype,n),t&&o(e,t),e}var c=new Array(32).fill(void 0);function u(e){return c[e]}c.push(void 0,null,!0,!1);var s=c.length;function l(e){var n=u(e);return function(e){e<36||(c[e]=s,s=e)}(e),n}var f=new("undefined"==typeof TextDecoder?(0,e.require)("util").TextDecoder:TextDecoder)("utf-8",{ignoreBOM:!0,fatal:!0});f.decode();var v=null;function p(){return null!==v&&v.buffer===i.kb.buffer||(v=new Uint8Array(i.kb.buffer)),v}function d(e,n){return f.decode(p().subarray(e,e+n))}function m(e,n){if(!(e instanceof n))throw new Error("expected instance of ".concat(n.name));return e.ptr}var h=null;function y(){return null!==h&&h.buffer===i.kb.buffer||(h=new Int32Array(i.kb.buffer)),h}var x=null;function _(){return null!==x&&x.buffer===i.kb.buffer||(x=new Float32Array(i.kb.buffer)),x}function g(e){return null==e}var w=0,b=new("undefined"==typeof TextEncoder?(0,e.require)("util").TextEncoder:TextEncoder)("utf-8"),k="function"==typeof b.encodeInto?function(e,n){return b.encodeInto(e,n)}:function(e,n){var t=b.encode(e);return n.set(t),{read:e.length,written:t.length}};var z=Object.freeze({Empty:0,0:"Empty",Wall:1,1:"Wall",Sand:2,2:"Sand",Dirt:3,3:"Dirt",Water:4,4:"Water"}),C=Object.freeze({EMPTY:0,0:"EMPTY",CAVE:1,1:"CAVE"}),M=function(){function e(){r(this,e)}return a(e,[{key:"__destroy_into_raw",value:function(){var e=this.ptr;return this.ptr=0,e}},{key:"free",value:function(){var e=this.__destroy_into_raw();i.a(e)}},{key:"x",value:function(){return i.f(this.ptr)}},{key:"y",value:function(){return i.X(this.ptr)}},{key:"active",value:function(){return 0!==i.V(this.ptr)}},{key:"active_next_tick",value:function(){return 0!==i.W(this.ptr)}}],[{key:"__wrap",value:function(n){var t=Object.create(e.prototype);return t.ptr=n,t}}]),e}(),E=function(){function e(){r(this,e)}return a(e,[{key:"__destroy_into_raw",value:function(){var e=this.ptr;return this.ptr=0,e}},{key:"free",value:function(){var e=this.__destroy_into_raw();i.u(e)}},{key:"insert",value:function(e,n,t,r){i.db(this.ptr,e,n,t,r)}},{key:"clear",value:function(){i.ab(this.ptr)}},{key:"tick",value:function(){return i.ib(this.ptr)>>>0}},{key:"config",value:function(){var e=i.bb(this.ptr);return I.__wrap(e)}},{key:"display",value:function(){return i.cb(this.ptr)}},{key:"pixel_info",value:function(e,n){var t=i.hb(this.ptr,e,n);return 0===t?void 0:S.__wrap(t)}},{key:"chunks_count",value:function(){return i.Z(this.ptr)>>>0}},{key:"chunk",value:function(e){var n=i.Y(this.ptr,e);return M.__wrap(n)}}],[{key:"__wrap",value:function(n){var t=Object.create(e.prototype);return t.ptr=n,t}},{key:"new_empty",value:function(n){m(n,I);var t=n.ptr;n.ptr=0;var r=i.gb(t);return e.__wrap(r)}},{key:"new_cave",value:function(n){m(n,I);var t=n.ptr;n.ptr=0;var r=i.fb(t);return e.__wrap(r)}},{key:"new",value:function(n,t){m(n,I);var r=n.ptr;n.ptr=0;var o=i.eb(r,t);return e.__wrap(o)}}]),e}(),I=function(){function e(){r(this,e)}return a(e,[{key:"__destroy_into_raw",value:function(){var e=this.ptr;return this.ptr=0,e}},{key:"free",value:function(){var e=this.__destroy_into_raw();i.v(e)}},{key:"size",get:function(){return i.f(this.ptr)},set:function(e){i.C(this.ptr,e)}},{key:"gravity",get:function(){return i.c(this.ptr)},set:function(e){i.z(this.ptr,e)}},{key:"max_velocity",get:function(){return i.d(this.ptr)},set:function(e){i.A(this.ptr,e)}},{key:"use_chunks",get:function(){return 0!==i.g(this.ptr)},set:function(e){i.D(this.ptr,e)}},{key:"chunk_size",get:function(){return i.b(this.ptr)},set:function(e){i.y(this.ptr,e)}},{key:"seed",get:function(){return i.e(this.ptr)},set:function(e){i.B(this.ptr,e)}}],[{key:"__wrap",value:function(n){var t=Object.create(e.prototype);return t.ptr=n,t}},{key:"new",value:function(n,t,r,o,a,c){var u=i.jb(n,t,r,o,a,c);return e.__wrap(u)}}]),e}(),S=function(){function e(){r(this,e)}return a(e,[{key:"__destroy_into_raw",value:function(){var e=this.ptr;return this.ptr=0,e}},{key:"free",value:function(){var e=this.__destroy_into_raw();i.x(e)}},{key:"element",get:function(){return i.m(this.ptr)>>>0},set:function(e){i.J(this.ptr,e)}},{key:"friction",get:function(){try{var e=i.R(-16);i.o(e,this.ptr);var n=y()[e/4+0],t=_()[e/4+1];return 0===n?void 0:t}finally{i.R(16)}},set:function(e){i.L(this.ptr,!g(e),g(e)?0:e)}},{key:"restitution",get:function(){try{var e=i.R(-16);i.r(e,this.ptr);var n=y()[e/4+0],t=_()[e/4+1];return 0===n?void 0:t}finally{i.R(16)}},set:function(e){i.O(this.ptr,!g(e),g(e)?0:e)}},{key:"inertia",get:function(){try{var e=i.R(-16);i.p(e,this.ptr);var n=y()[e/4+0],t=_()[e/4+1];return 0===n?void 0:t}finally{i.R(16)}},set:function(e){i.M(this.ptr,!g(e),g(e)?0:e)}},{key:"velocity_x",get:function(){try{var e=i.R(-16);i.s(e,this.ptr);var n=y()[e/4+0],t=_()[e/4+1];return 0===n?void 0:t}finally{i.R(16)}},set:function(e){i.P(this.ptr,!g(e),g(e)?0:e)}},{key:"velocity_y",get:function(){try{var e=i.R(-16);i.t(e,this.ptr);var n=y()[e/4+0],t=_()[e/4+1];return 0===n?void 0:t}finally{i.R(16)}},set:function(e){i.Q(this.ptr,!g(e),g(e)?0:e)}},{key:"falling",get:function(){var e=i.n(this.ptr);return 16777215===e?void 0:0!==e},set:function(e){i.K(this.ptr,g(e)?16777215:e?1:0)}},{key:"not_moved_count",get:function(){var e=i.q(this.ptr);return 16777215===e?void 0:e},set:function(e){i.N(this.ptr,g(e)?16777215:e)}},{key:"absorbed_liquid",get:function(){var e=i.l(this.ptr);return 5===e?void 0:e},set:function(e){i.I(this.ptr,g(e)?5:e)}}],[{key:"__wrap",value:function(n){var t=Object.create(e.prototype);return t.ptr=n,t}}]),e}(),D=function(){return function(e){s===c.length&&c.push(c.length+1);var n=s;return s=c[n],c[n]=e,n}(new Error)},L=function(e,n){var t=function(e,n,t){if(void 0===t){var i=b.encode(e),r=n(i.length);return p().subarray(r,r+i.length).set(i),w=i.length,r}for(var o=e.length,a=n(o),c=p(),u=0;u<o;u++){var s=e.charCodeAt(u);if(s>127)break;c[a+u]=s}if(u!==o){0!==u&&(e=e.slice(u)),a=t(a,o,o=u+3*e.length);var l=p().subarray(a+u,a+o);u+=k(e,l).written}return w=u,a}(u(n).stack,i.T,i.U),r=w;y()[e/4+1]=r,y()[e/4+0]=t},A=function(e,n){try{console.error(d(e,n))}finally{i.S(e,n)}},T=function(e){l(e)},Y=function(e,n){throw new Error(d(e,n))}}).call(this,t(12)(e))},function(e,n,t){"use strict";var i=t.w[e.i];e.exports=i;t(9);i.lb()},,,,,function(e,n){e.exports="precision mediump float;\n#define GLSLIFY 1\n\nattribute vec2 position;\nvarying vec2 uv;\n\nvoid main() {\n    uv = 0.5 * (position + 1.0);\n    gl_Position = vec4(position, 0, 1);\n}"},function(e,n){e.exports="precision mediump float;\n#define GLSLIFY 1\n\nvarying vec2 uv;\nuniform sampler2D texture;\n\nvoid main() {\n    gl_FragColor = texture2D(texture, uv);\n}"},function(e,n){e.exports="precision mediump float;\n#define GLSLIFY 1\n\nattribute vec2 position;\n\nvoid main() {\n    gl_Position = vec4(position, 0, 1);\n}"},function(e,n){e.exports="precision mediump float;\n#define GLSLIFY 1\n\nuniform vec4 color;\n\nvoid main () {\n    gl_FragColor = color;\n}"},function(e,n){e.exports="precision mediump float;\n#define GLSLIFY 1\n\nattribute vec2 position;\nvarying vec2 uv;\n\nvoid main() {\n    // Convert position to UV\n    uv = 0.5 * (position + 1.0);\n    gl_Position = vec4(position, 0, 1);\n}"},function(e,n){e.exports="precision highp float;\n#define GLSLIFY 1\n\nuniform float time;\nuniform vec2 elements_size;\nuniform sampler2D elements;\nuniform int map_size;\nuniform sampler2D map;\n\nvarying vec2 uv;\n\n// clang-format off\nvec3 hsv2rgb(vec3 c) {\n  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);\n  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);\n  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);\n}\n\n//\n// Description : Array and textureless GLSL 2D/3D/4D simplex\n//               noise functions.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : ijm\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//\n\nvec3 mod289(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 mod289(vec4 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute(vec4 x) {\n     return mod289(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt(vec4 r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nfloat snoise(vec3 v)\n  {\n  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;\n  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);\n\n// First corner\n  vec3 i  = floor(v + dot(v, C.yyy) );\n  vec3 x0 =   v - i + dot(i, C.xxx) ;\n\n// Other corners\n  vec3 g = step(x0.yzx, x0.xyz);\n  vec3 l = 1.0 - g;\n  vec3 i1 = min( g.xyz, l.zxy );\n  vec3 i2 = max( g.xyz, l.zxy );\n\n  //   x0 = x0 - 0.0 + 0.0 * C.xxx;\n  //   x1 = x0 - i1  + 1.0 * C.xxx;\n  //   x2 = x0 - i2  + 2.0 * C.xxx;\n  //   x3 = x0 - 1.0 + 3.0 * C.xxx;\n  vec3 x1 = x0 - i1 + C.xxx;\n  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y\n  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y\n\n// Permutations\n  i = mod289(i);\n  vec4 p = permute( permute( permute(\n             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))\n           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))\n           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));\n\n// Gradients: 7x7 points over a square, mapped onto an octahedron.\n// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)\n  float n_ = 0.142857142857; // 1.0/7.0\n  vec3  ns = n_ * D.wyz - D.xzx;\n\n  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)\n\n  vec4 x_ = floor(j * ns.z);\n  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)\n\n  vec4 x = x_ *ns.x + ns.yyyy;\n  vec4 y = y_ *ns.x + ns.yyyy;\n  vec4 h = 1.0 - abs(x) - abs(y);\n\n  vec4 b0 = vec4( x.xy, y.xy );\n  vec4 b1 = vec4( x.zw, y.zw );\n\n  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;\n  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;\n  vec4 s0 = floor(b0)*2.0 + 1.0;\n  vec4 s1 = floor(b1)*2.0 + 1.0;\n  vec4 sh = -step(h, vec4(0.0));\n\n  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\n  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;\n\n  vec3 p0 = vec3(a0.xy,h.x);\n  vec3 p1 = vec3(a0.zw,h.y);\n  vec3 p2 = vec3(a1.xy,h.z);\n  vec3 p3 = vec3(a1.zw,h.w);\n\n//Normalise gradients\n  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n\n// Mix final noise value\n  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\n  m = m * m;\n  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),\n                                dot(p2,x2), dot(p3,x3) ) );\n  }\n\nvec2 map_coords(vec2 uv) {\n    return vec2(uv.x, 1.0 - uv.y);\n}\n\nint element(float value) {\n    return int((value * 255.) + 0.1);\n}\n\nvec4 to_rgb(vec4 hsv) {\n    return vec4(hsv2rgb(vec3(hsv.xyz)), hsv.w);\n}\n\nvec4 element_params(int element) {\n    return texture2D(elements, vec2(\n        float(1)/float(elements_size[0]),\n        float(element)/float(elements_size[1])));\n}\n\nvec4 pixel_color(int element, float pixel_noise) {\n    // Element Color is in HSV + A format\n    // color.x = Hue\n    // color.y = Saturation\n    // color.z = Value\n    // color.a = Alpha\n    vec4 color = texture2D(elements, vec2(0, float(element)/float(elements_size[1])));\n\n    // Element Parameters\n    // params.x = Value modifier in range [0..1] - how much random value should be added to element Value\n    // params.y = Noise speed - how frequently should be color of element changed\n    // paramy.z = Noise Value modifier in range [0..1] - how much noise value should be added to element Value\n    vec4 params = element_params(element);\n\n    // Create noise from UV coordinates which changes based on element noise speed\n    float noise = snoise(vec3(floor(uv * float(map_size)), time * params.y));\n\n    // Change element's Value according to value modifier and noise value modifier\n    float value = color.z + pixel_noise * params.x + noise * params.z;\n\n    return to_rgb(vec4(color.xy, value, color.w));\n}\n\nvoid main() {\n    // Pixel info contains information about how pixel should be rendered\n    // pixel_info.x = element\n    // pixel_infor.y = noise (for solid and liquid elements)\n    // pixel_infor.z = surrounded_liquid (for solid elements)\n    vec4 pixel_info = texture2D(map, map_coords(uv));\n\n    int current_element = element(pixel_info.x);\n    int surrounded_liquid = element(pixel_info.z);\n\n    // Compute pixel color\n    vec4 color = pixel_color(current_element, pixel_info.y);\n\n    // If a solid pixel is surrounded by liquid, mix the color with it according to the liquid's alpha\n    if (surrounded_liquid != 0) {\n        vec4 liquid_color = pixel_color(surrounded_liquid, pixel_info.y);\n        color = mix(color, liquid_color, 0.5);\n    }\n\n    // Convert the color to RGBA\n    gl_FragColor = color;\n}"},function(e,n){e.exports="precision mediump float;\n#define GLSLIFY 1\n\nattribute vec2 position;\nvarying vec2 uv;\n\nvoid main() {\n    // Convert position to UV\n    uv = 0.5 * (position + 1.0);\n    gl_Position = vec4(position, 0, 1);\n}"},function(e,n){e.exports="// Blends pixels of different elements when they are next to each other\n\nprecision mediump float;\n#define GLSLIFY 1\n\nvarying vec2 uv;\nuniform int map_size;\nuniform sampler2D map;\nuniform sampler2D scene;\n\n// Radius of blending - how much pixels are affected\n#define radius int(1)\n\n// Weight to interpolate color of pixels\n#define color_weight float(0.5)\n\nint element(vec4 pixel_info) {\n    return int((pixel_info.r * 255.) + 0.1);\n}\n\nvec2 scene_coords(vec2 uv) {\n    return uv;\n}\n\nvec2 map_coords(vec2 uv) {\n    return vec2(uv.x, 1.0 - uv.y);\n}\n\nvec2 uv_offset(int x, int y) {\n    return vec2(float(x) * (1./float(map_size)), float(y) * (1./float(map_size)));\n}\n\nvoid main() {\n    int current_element = element(texture2D(map, map_coords(uv)));\n    vec4 current_color = texture2D(scene, scene_coords(uv));\n\n    // Average color of neighbour pixels\n    float weight = 0.0;\n    vec3 avg_color = vec3(0, 0, 0);\n\n    int neighbour_element;\n    vec4 neighbour_color;\n\n    bool found_different_element = false;\n\n    // Dont process empty pixels\n    if (current_element != 0) {\n        for (int x = -radius; x <= +radius; x++) {\n            for (int y = -radius; y <= +radius; y++) {\n                // Dont process this pixel\n                if (!(x == 0 && y == 0)) {\n                    neighbour_element = element(texture2D(map, map_coords(uv + uv_offset(x, y))));\n                    neighbour_color = texture2D(scene, scene_coords(uv + uv_offset(x, y)));\n\n                    if (neighbour_element != 0) {\n                        if (neighbour_element != current_element) {\n                            found_different_element = true;\n                        }\n\n                        avg_color += neighbour_color.rgb;\n                        weight += 1.0;\n                    }\n                }\n            }\n        }\n    }\n\n    if (found_different_element && weight > 0.0) {\n        // If some neighbours affects the color, compute the color using linear interpolation\n        gl_FragColor = vec4(mix(current_color.rgb, avg_color / weight, color_weight), current_color.a);\n    } else {\n        gl_FragColor = current_color;\n    }\n}"},function(e,n){e.exports="precision mediump float;\n#define GLSLIFY 1\n\nattribute vec2 position;\nuniform float scale;\nuniform vec2 offset;\n\nvoid main () {\n    vec2 p  = position;\n    p *= scale;\n    p += offset;\n    gl_Position = vec4(p, 0, 1);\n}"},function(e,n){e.exports="precision mediump float;\n#define GLSLIFY 1\n\nuniform vec4 color;\n\nvoid main () {\n    gl_FragColor = color;\n}"},function(e,n,t){"use strict";t.r(n),t.d(n,"canvas",(function(){return Se})),t.d(n,"config",(function(){return Ie})),t.d(n,"map",(function(){return te})),t.d(n,"createMap",(function(){return De})),t.d(n,"nextTick",(function(){return Le})),t.d(n,"generateSeed",(function(){return Ee}));var i=t(9),r=[.31,.3,.3,1],o=[{key:i.a.Empty,value:{name:"Empty",hsv:[0,0,1],alpha:0,params:[0,0,0,0]}},{key:i.a.Wall,value:{name:"Wall",hsv:[0,0,0],alpha:1,params:[0,0,0,0]}},{key:i.a.Sand,value:{name:"Sand",hsv:[46,.5,.5],alpha:1,params:[.2,0,0,0]}},{key:i.a.Dirt,value:{name:"Dirt",hsv:[18,.6,.3],alpha:1,params:[.1,0,0,0]}},{key:i.a.Water,value:{name:"Water",hsv:[222,.7,.65],alpha:.7,params:[.1,.015,.1,0]}}],a=[64,128,256,512],c=[16,32,64],u=[{key:i.d.EMPTY,value:{name:"Empty"}},{key:i.d.CAVE,value:{name:"Cave"}}],s=function(){var e=[];for(var n in o)o.hasOwnProperty(n)&&(e=(e=e.concat([o[n].value.hsv[0]/360],[o[n].value.hsv[1]],[o[n].value.hsv[2]],[o[n].value.alpha])).concat(o[n].value.params));return e},l=document.getElementById("fps"),f=document.getElementById("meanRenderTime"),v=document.getElementById("meanTickTime"),p=document.getElementById("lastTickTime"),d=document.getElementById("meanPixelsProcessed"),m=document.getElementById("lastPixelsProcessed"),h={mean:0,delta:0,frames:[],lastFrameTimeStamp:performance.now(),measure:function(){var e=performance.now(),n=e-this.lastFrameTimeStamp;this.lastFrameTimeStamp=e;var t=1/n*1e3;this.delta=n/1e3,this.frames.push(t),this.frames.length>100&&this.frames.shift(),this.mean=g(this.frames)}},y={mean:0,last:0,frames:[],startTime:performance.now(),start:function(){this.startTime=performance.now()},stop:function(){if(!window.paused){var e=performance.now()-this.startTime;this.last=e,this.frames.push(e),this.frames.length>100&&this.frames.shift(),this.mean=g(this.frames)}}},x={mean:0,last:0,frames:[],startTime:performance.now(),start:function(){this.startTime=performance.now()},stop:function(){var e=performance.now()-this.startTime;this.last=e,p.textContent=window.paused?"".concat(Math.round(this.last),"ms"):"",this.frames.push(e),this.frames.length>100&&this.frames.shift(),this.mean=g(this.frames)}},_={mean:0,last:0,frames:[],measure:function(e){this.last=e,m.textContent=window.paused?"".concat(Math.round(this.last)," \n        (").concat(w(this.last,Ie.size*Ie.size),"%)"):"",this.frames.push(e),this.frames.length>10&&this.frames.shift(),this.mean=g(this.frames)},reset:function(){this.mean=0,this.last=0,this.frames=[]}},g=function(e){for(var n=0,t=0;t<e.length;t++)n+=e[t];return n/e.length},w=function(e,n){return Math.round(100*e/n)};setInterval((function(){l.textContent="FPS: ".concat(Math.round(h.mean)),f.textContent="".concat(Math.round(y.mean),"ms"),v.textContent="".concat(Math.round(x.mean),"ms"),d.textContent="".concat(Math.round(_.mean)," \n    (").concat(w(Math.round(_.mean),Ie.size*Ie.size),"%)")}),100);var b=t(13),k=document.getElementById("canvas");b("document").ready((function(){L(),A(),T(),j(),D()}));var z=b("#create"),C=b("#generateSeed"),M=b("#configUseChunks"),E=b("#configChunkSize"),I=!1,S=b("#showActiveChunks");z.click((function(){Ie.size=Number(b("#configSize").val()),Ie.gravity=pe(b("#configGravity").val(),-1,1),Ie.maxVelocity=pe(b("#configMaxVelocity").val(),0,100),Ie.useChunks=M.is(":checked"),Ie.chunkSize=Number(E.val()),Ie.generator=function(e){for(var n in u)if(u.hasOwnProperty(n)&&u[n].value.name===e)return n;return null}(b("#configGenerator").val()),Ie.seed=Number(b("#seed").val()),De(),D()})),C.click((function(){Ie.seed=Ee(),D()}));var D=function(){b("#configSize").val(Ie.size),b("#configGravity").val(Ie.gravity),b("#configMaxVelocity").val(Ie.maxVelocity),b("#configGenerator").val(u[Ie.generator].value.name),b("#seed").val(Ie.seed),M.prop("checked",Ie.useChunks),E.val(Ie.chunkSize),E.prop("disabled",!Ie.useChunks)},L=function(){a.forEach((function(e){var n="<option>".concat(e,"</option>");b("#configSize").append(n)}))},A=function(){c.forEach((function(e){var n="<option>".concat(e,"</option>");b("#configChunkSize").append(n)}))},T=function(){for(var e in u)if(u.hasOwnProperty(e)){var n="<option>".concat(u[e].value.name,"</option>");b("#configGenerator").append(n)}};M.change((function(){E.prop("disabled",!this.checked),S.prop("disabled",!this.checked)})),S.change((function(){I=this.checked}));var Y=!1,R=b("#play"),q=b("#pause"),P=b("#nextFrame"),F=b("#reset");R.hide(),P.addClass("disabled"),R.click((function(){return V()})),q.click((function(){return V()})),P.click((function(){return G()})),F.click((function(){return X()})),b("body").keypress((function(e){112===e.keyCode?V():102===e.keyCode?G():114===e.keyCode&&X()}));var V=function(){Y=!Y,window.paused=Y,Y?(R.show(),q.hide(),P.removeClass("disabled")):(R.hide(),q.show(),P.addClass("disabled"))},G=function(){Y&&(x.start(),_.measure(Le()),x.stop())},X=function(){te.clear(),_.reset()},N=null,O=function(e){var n,t,i,r;return"rgb("+(n=o[e].value.hsv[0],t=o[e].value.hsv[1],i=o[e].value.hsv[2],[255*(r=function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:(e+n/60)%6;return i-i*t*Math.max(Math.min(r,4-r,1),0)})(5),255*r(3),255*r(1)]).join(",")+")"},j=function(){var e=function(e){if(o.hasOwnProperty(e)){var n='\n                <div class="form-check">\n                    <input class="form-check-input" type="radio" name="flexRadioDefault" id="element_'.concat(e,'">\n                    <label class="form-check-label" for="element_').concat(e,'">\n                        <i class="bi bi-square-fill" style="color: ').concat(O(e),'"></i>\n                        <label>').concat(o[e].value.name,"</label>\n                    </label>\n                </div>");b("#painting").append(n),b("#element_"+e).change((function(){return N=Number(e)}))}};for(var n in o)e(n);N=2,b("#element_2").attr("checked",!0)},B={value:0,step:1,min:0,max:5},W=b("#brushSize");W.on("change",(function(){B.value=pe(Number(b(this).val()),B.min,B.max)})),b(window).bind("mousewheel DOMMouseScroll",(function(e){e.originalEvent.wheelDelta>0||e.originalEvent.detail<0?(B.value=pe(B.value+B.step,B.min,B.max),W.val(B.value)):(B.value=pe(B.value-B.step,B.min,B.max),W.val(B.value))}));var U=null,K=!1,J=null,H=b("#inspectCheck"),Q=b("#inspectDetails");Q.hide(),H.click((function(){H.prop("checked")?(K=!0,clearInterval(J),J=window.setInterval((function(){return Z()}),100)):(K=!1,clearInterval(J))}));var Z=function(){if(K&&U){var e=te.pixel_info(U[0],U[1]);if(e)if(Q.show(),b("#inspectElement").text(o[e.element].value.name),b("#inspectPosition").text("("+U[0]+", "+U[1]+")"),void 0!==e.velocity_x&&void 0!==e.velocity_y?(b("#inspectVelocity").text("("+e.velocity_x+", "+e.velocity_y+")"),b("#inspectVelocityRow").show()):b("#inspectVelocityRow").hide(),void 0!==e.falling?(b("#inspectFalling").text(e.falling),b("#inspectFallingRow").show()):b("#inspectFallingRow").hide(),void 0!==e.not_moved_count?(b("#inspectNotMovedCount").text(e.not_moved_count),b("#inspectNotMovedCountRow").show()):b("#inspectNotMovedCountRow").hide(),void 0!==e.absorbed_liquid&&0!==e.absorbed_liquid){var n=o[Number(e.absorbed_liquid)];n?(b("#inspectAbsorbedLiquid").text(n.value.name),b("#inspectAbsorbedLiquidRow").show()):b("#inspectAbsorbedLiquidRow").hide()}else b("#inspectAbsorbedLiquidRow").hide()}else Q.hide()},$=!1,ee=null,ne=null;k.addEventListener("mousedown",(function(e){e.preventDefault(),$=!0,clearInterval(ne),ne=window.setInterval((function(){return re(e)}),100),re(e),ee=e})),document.body.addEventListener("mouseup",(function(e){clearInterval(ne),$&&(e.preventDefault(),ee=null,$=!1)})),k.addEventListener("mousemove",(function(e){clearInterval(ne),oe(e),function(e){U=H.prop("checked")?ae(e):null}(e)})),k.addEventListener("mouseleave",(function(){clearInterval(ne),ee=null,U=null}));var te,ie,re=function(e){if($){var n=ae(e);te.insert(n[0],n[1],N,B.value)}},oe=function(e){clearInterval(ne),ne=window.setInterval((function(){return re(e)}),100);var n={clientX:e.clientX,clientY:e.clientY};if($){var t=0;if(re(n),ee)for(;ce(n,ee)>1/3;){var i=ce(n,ee);if(n=ue(n,fe(le(se(ee,e)),Math.min(1/3,i))),++t>1e3)break;re(n)}ee=e}},ae=function(e){var n=k.getBoundingClientRect(),t=k.width/Math.ceil(window.devicePixelRatio)/n.width,i=k.height/Math.ceil(window.devicePixelRatio)/n.height,r=(e.clientX-n.left)*t,o=(e.clientY-n.top)*i;return[Math.max(Math.min(Math.floor(r),Ie.size-1),0),Math.max(Math.min(Math.floor(o),Ie.size-1),0)]},ce=function(e,n){return Math.sqrt(Math.pow(e.clientX-n.clientX,2)+Math.pow(e.clientY-n.clientY,2),2)},ue=function(e,n){return{clientX:e.clientX+n.clientX,clientY:e.clientY+n.clientY}},se=function(e,n){return{clientX:e.clientX-n.clientX,clientY:e.clientY-n.clientY}},le=function(e){var n=ve(e);return{clientX:e.clientX/n,clientY:e.clientY/n}},fe=function(e,n){return{clientX:e.clientX*n,clientY:e.clientY*n}},ve=function(e){return Math.sqrt(Math.pow(e.clientX,2)+Math.pow(e.clientY,2),2)},pe=function(e,n,t){return Math.min(Math.max(e,n),t)},de=t(10),me=t(14),he=t(15),ye=t(16),xe=t(17),_e=t(18),ge=t(19),we=t(20),be=t(21),ke=t(22),ze=t(23),Ce=t(24),Me=function(e){var n=e.canvas,t=e.map,i=e.config,a=me({extensions:["OES_texture_float"],canvas:n}),c=t.config().size,u=a.framebuffer({color:a.texture({width:c,height:c,wrap:"clamp"}),depth:!1}),l=[2,o.length],f=a.texture({width:l[0],height:l[1],type:"float",data:s()}),v=a.texture({width:c,height:c,data:new Uint8Array(de.kb.buffer,t.display(),c*c*4)}),p=a({vert:xe,frag:_e,uniforms:{color:a.prop("color")},depth:{enable:!1},attributes:{position:[[-1,4],[-1,-1],[4,-1]]},count:3,framebuffer:u}),d=a({vert:ge,frag:we,uniforms:{time:function(e){return e.tick},elements_size:l,elements:f,map_size:c,map:function(){return v({width:c,height:c,data:new Uint8Array(de.kb.buffer,t.display(),c*c*4)})}},depth:{enable:!1},blend:{enable:!0,func:{srcRGB:"src alpha",srcAlpha:"src alpha",dstRGB:"one minus src alpha",dstAlpha:"one minus src alpha"}},attributes:{position:[[-1,4],[-1,-1],[4,-1]]},count:3,framebuffer:u}),m=a({vert:be,frag:ke,attributes:{position:[[-1,4],[-1,-1],[4,-1]]},uniforms:{map_size:c,map:function(){return v({width:c,height:c,data:new Uint8Array(de.kb.buffer,t.display(),c*c*4)})},scene:u},depth:{enable:!1},count:3}),h=(a({vert:he,frag:ye,attributes:{position:[[-1,4],[-1,-1],[4,-1]]},uniforms:{texture:u},depth:{enable:!1},count:3}),a({vert:ze,frag:Ce,attributes:{position:[[-1,-1],[1,-1],[1,1],[-1,1]]},uniforms:{color:[.3,.7,.1,1],scale:a.prop("scale"),offset:a.prop("offset")},depth:{enable:!1},count:4,lineWidth:1,primitive:"line loop"})),y=function(){var e=[];if(i.useChunks)for(var n=i.chunkSize/c,r=0;r<t.chunks_count();r++){var o=t.chunk(r);e.push({scale:n,offset:[-1+n+o.x()/i.size*2,1-n-o.y()/i.size*2]})}return e}();return function(){a.poll(),a.clear({color:[0,0,0,255]}),p({color:r}),d(),m(),i.useChunks&&I&&h(y.filter((function(e,n){return t.chunk(n).active_next_tick()})))}},Ee=function(){return Math.floor(Math.random()*Math.floor(1e4))},Ie={size:256,gravity:.2,maxVelocity:10,useChunks:!0,chunkSize:32,generator:i.d.EMPTY,seed:1},Se=document.getElementById("canvas"),De=function(){te=i.b.new(i.c.new(Ie.size,Ie.gravity,Ie.maxVelocity,Ie.useChunks,Ie.chunkSize,Ie.seed),Number(Ie.generator)),Se.width=Ie.size*Math.ceil(window.devicePixelRatio),Se.height=Ie.size*Math.ceil(window.devicePixelRatio),ie=Me({canvas:Se,map:te,config:Ie}),_.reset()};De();var Le=function(){return te.tick(h.delta)};!function e(){h.measure(),window.paused||(x.start(),_.measure(Le()),x.stop()),y.start(),ie(),y.stop(),window.animationId=requestAnimationFrame(e)}()}]]);
//# sourceMappingURL=1.e980c46a42b90c8c21d6.js.map