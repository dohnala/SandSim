// Blends pixels of different elements when they are next to each other

precision mediump float;

varying vec2 uv;
uniform int map_size;
uniform sampler2D map;
uniform sampler2D scene;

// Radius of blending - how much pixels are affected
#define radius int(1)

// Weight to interpolate color of pixels
#define color_weight float(0.25)

int element(vec4 pixel_info) {
    return int((pixel_info.r * 255.) + 0.1);
}

vec2 scene_coords(vec2 uv) {
    return uv;
}

vec2 map_coords(vec2 uv) {
    return vec2(uv.x, 1.0 -uv.y);
}

vec2 uv_offset(int x, int y) {
    return vec2(float(x) * (1./float(map_size)), float(y) * (1./float(map_size)));
}

void main() {
    int current_element = element(texture2D(map, map_coords(uv)));
    vec4 current_color = texture2D(scene, scene_coords(uv));

    // Average color of neighbour pixels
    float weight = 0.0;
    vec3 avg_color = vec3(0, 0, 0);

    int neighbour_element;
    vec4 neighbour_color;

    // Dont process empty pixels
    if (current_element != 0) {
        for (int x = -radius; x <= +radius; x++) {
            for (int y = -radius; y <= +radius; y++) {
                // Dont process this pixel
                if (!(x == 0 && y == 0)) {
                    neighbour_element = element(texture2D(map, map_coords(uv + uv_offset(x, y))));
                    neighbour_color = texture2D(scene, scene_coords(uv + uv_offset(x, y)));

                    // Only process not-empty pixels of different element
                    if (neighbour_element != 0 && neighbour_element != current_element) {
                        avg_color += neighbour_color.rgb;
                        weight += 1.0;
                    }
                }
            }
        }
    }

    if (weight > 0.0) {
        // If some neighbours affects the color, compute the color using linear interpolation
        gl_FragColor = vec4(mix(current_color.rgb, avg_color / weight, color_weight), current_color.a);
    } else {
        gl_FragColor = current_color;
    }
}