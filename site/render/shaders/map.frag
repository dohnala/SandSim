precision highp float;
uniform sampler2D map_texture;
uniform sampler2D element_texture;
uniform int element_count;
varying vec2 uv;

void main() {
    vec2 textCoord = (uv * vec2(0.5, -0.5)) + vec2(0.5);
    vec4 pixel_info = texture2D(map_texture, textCoord);
    int element = int((pixel_info.r * 255.) + 0.1);
    vec4 color = texture2D(element_texture, vec2(float(element)/float(element_count),0));

    gl_FragColor = color;
}