precision highp float;
uniform sampler2D map_texture;
uniform sampler2D element_texture;
uniform int element_count;
varying vec2 uv;

// clang-format off
#pragma glslify: hsv2rgb = require('glsl-hsv2rgb')

void main() {
    vec2 textCoord = (uv * vec2(0.5, -0.5)) + vec2(0.5);
    vec4 pixel_info = texture2D(map_texture, textCoord);
    int element = int((pixel_info.r * 255.) + 0.1);

    // Color is in HSV + A format (x = h, y = s, z = v, w = a)
    vec4 color = texture2D(element_texture, vec2(float(element)/float(element_count),0));

    // Convert the color to RGBA
    gl_FragColor = vec4(hsv2rgb(vec3(color.xyz)), color.w);
}