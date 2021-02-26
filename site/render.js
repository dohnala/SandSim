const reglBuilder = require("regl");
import { memory } from "./node_modules/engine/engine_bg";

let startWebGL = ({ canvas, map }) => {
    const regl = reglBuilder({
        canvas
    });

    const width = map.width();
    const height = map.height();
    let ptr_pixels = map.pixels();
    let pixels = new Uint8Array(memory.buffer, ptr_pixels, width * height * 4);
    const dataTexture = regl.texture({ width, height, data: pixels });

    let drawMap = regl({
        frag: `
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
                color = vec4(255, 255, 255, 1);
            }
            
            if (element == 1) {
                color = vec4(0, 0, 0, 1);
            }
            
            // sand
            if (element == 2) {
                color = vec4(0.76, 0.7, 0.5, 1);
            }
            
            gl_FragColor = color;
        }`,

        vert: `
        precision mediump float;
        attribute vec2 position;
        varying vec2 uv;
        void main() {
            uv = position;
            gl_Position = vec4(position, 0, 1);
        }`,

        uniforms: {
            data: () => {
                ptr_pixels = map.pixels();
                pixels = new Uint8Array(memory.buffer, ptr_pixels, width * height * 4);

                return dataTexture({width, height, data: pixels});
            },
        },

        attributes: {
            position: [[-1, 4], [-1, -1], [4, -1]]
        },

        count: 3,
    });

    return () => {
        regl.poll();
        drawMap();
    };
};

export { startWebGL};