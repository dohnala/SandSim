precision highp float;
uniform sampler2D data;
varying vec2 uv;

void main() {
    vec2 textCoord = (uv * vec2(0.5, -0.5)) + vec2(0.5);
    vec4 data = texture2D(data, textCoord);
    int element = int((data.r * 255.) + 0.1);
    vec4 color;

    // empty
    if (element == 0) {
        color = vec4(1, 1, 1, 1);
    }

    if (element == 1) {
        color = vec4(0, 0, 0, 1);
    }

    // sand
    if (element == 2) {
        color = vec4(0.76, 0.7, 0.5, 1);
    }

    // dirt
    if (element == 3) {
        color = vec4(0.52, 0.22, 0.09, 1);
    }

    // water
    if (element == 4) {
        color = vec4(0.17, 0.39, 0.9, 1);
    }

    gl_FragColor = color;
}