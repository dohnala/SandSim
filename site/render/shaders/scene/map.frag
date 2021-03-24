precision highp float;

uniform float time;
uniform vec2 element_texture_dim;
uniform sampler2D element_texture;
uniform int map_size;
uniform sampler2D map_texture;

varying vec2 uv;

// clang-format off
#pragma glslify: hsv2rgb = require('glsl-hsv2rgb')
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

void main() {
    // Convert UV to map coordinates
    vec2 map_coords = (uv * vec2(0.5, -0.5)) + vec2(0.5);

    // Pixel info contains information about how pixel should be rendered
    // pixel_info.r = element
    // pixel_infor.g = noise (only for solid elements)
    vec4 pixel_info = texture2D(map_texture, map_coords);

    // In order to get element, it need to be converted from float
    int element = int((pixel_info.r * 255.) + 0.1);

    // Coordinates to load texture data for element
    float element_texture_coords = float(element)/float(element_texture_dim[1]);
    // Coordinates to load color for element
    float element_color_coords = 0.;
    // Coordinates to load params for element
    float element_params_coords = float(1)/float(element_texture_dim[0]);

    // Element Color is in HSV + A format
    // color.x = Hue
    // color.y = Saturation
    // color.z = Value
    // color.a = Alpha
    vec4 color = texture2D(element_texture, vec2(element_color_coords, element_texture_coords));

    // Element Parameters
    // params.x = Value modifier in range [0..1] - how much random value should be added to element Value
    // params.y = Noise speed - how frequently should be color of element changed
    // paramy.z = Noise Value modifier in range [0..1] - how much noise value should be added to element Value
    vec4 params = texture2D(element_texture, vec2(element_params_coords, element_texture_coords));

    // Create noise from UV coordinates which changes based on element noise speed
    float noise = snoise3(vec3(floor(uv * float(map_size)), time * params.y));

    // Change element's Value according to value modifier and noise value modifier
    float value = color.z + pixel_info.g * params.x + noise * params.z;

    color = vec4(color.x, color.y, value, color.w);

    // Convert the color to RGBA
    gl_FragColor = vec4(hsv2rgb(vec3(color.xyz)), color.w);
}