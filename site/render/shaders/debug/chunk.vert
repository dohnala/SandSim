precision mediump float;

attribute vec2 position;
uniform float scale;
uniform vec2 offset;

void main () {
    vec2 p  = position;
    p *= scale;
    p += offset;
    gl_Position = vec4(p, 0, 1);
}