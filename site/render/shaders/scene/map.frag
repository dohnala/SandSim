precision highp float;

uniform float time;
uniform vec2 elements_size;
uniform sampler2D elements;
uniform int map_size;
uniform sampler2D map;

varying vec2 uv;

// clang-format off
#pragma glslify: hsv2rgb = require('glsl-hsv2rgb')
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

vec2 map_coords(vec2 uv) {
    return vec2(uv.x, 1.0 - uv.y);
}

int element(float value) {
    return int((value * 255.) + 0.1);
}

vec4 to_rgb(vec4 hsv) {
    return vec4(hsv2rgb(vec3(hsv.xyz)), hsv.w);
}

vec4 element_params(int element) {
    return texture2D(elements, vec2(
        float(1)/float(elements_size[0]),
        float(element)/float(elements_size[1])));
}

vec4 pixel_color(int element, float pixel_noise) {
    // Element Color is in HSV + A format
    // color.x = Hue
    // color.y = Saturation
    // color.z = Value
    // color.a = Alpha
    vec4 color = texture2D(elements, vec2(0, float(element)/float(elements_size[1])));

    // Element Parameters
    // params.x = Value modifier in range [0..1] - how much random value should be added to element Value
    // params.y = Noise speed - how frequently should be color of element changed
    // paramy.z = Noise Value modifier in range [0..1] - how much noise value should be added to element Value
    vec4 params = element_params(element);

    // Create noise from UV coordinates which changes based on element noise speed
    float noise = snoise3(vec3(floor(uv * float(map_size)), time * params.y));

    // Change element's Value according to value modifier and noise value modifier
    float value = color.z + pixel_noise * params.x + noise * params.z;

    return to_rgb(vec4(color.xy, value, color.w));
}

void main() {
    // Pixel info contains information about how pixel should be rendered
    // pixel_info.x = element
    // pixel_infor.y = noise (for solid and liquid elements)
    // pixel_infor.z = surrounded_liquid (for solid elements)
    vec4 pixel_info = texture2D(map, map_coords(uv));

    int current_element = element(pixel_info.x);
    int surrounded_liquid = element(pixel_info.z);

    // Compute pixel color
    vec4 color = pixel_color(current_element, pixel_info.y);

    // If a solid pixel is surrounded by liquid, mix the color with it according to the liquid's alpha
    if (surrounded_liquid != 0) {
        vec4 liquid_color = pixel_color(surrounded_liquid, pixel_info.y);
        color = mix(color, liquid_color, 0.5);
    }

    // Convert the color to RGBA
    gl_FragColor = color;
}