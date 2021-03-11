import {showActiveChunks} from "./ui";

const reglBuilder = require("regl");
import { memory } from "./node_modules/engine/engine_bg";

let startWebGL = ({ canvas, map, config }) => {
    const regl = reglBuilder({
        canvas
    });

    const size = map.config().size;
    let ptr_pixels = map.display();
    let pixels = new Uint8Array(memory.buffer, ptr_pixels, size * size * 4);
    const dataTexture = regl.texture({ width: size, height: size, data: pixels });

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
            
            // dirt
            if (element == 3) {
                color = vec4(0.52, 0.22, 0.09, 1);
            }
            
            // water
            if (element == 4) {
                color = vec4(0.17, 0.39, 0.9, 1);
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
                ptr_pixels = map.display();
                pixels = new Uint8Array(memory.buffer, ptr_pixels, size * size * 4);

                return dataTexture({width: size, height: size, data: pixels});
            },
        },

        attributes: {
            position: [[-1, 4], [-1, -1], [4, -1]]
        },

        count: 3,
    });

    function drawChunk(props) {
        return regl({
            frag: `
            precision mediump float;
            uniform vec4 color;
            void main () {
              gl_FragColor = color;
            }`,

            vert: `
            precision mediump float;
            attribute vec2 position;
            uniform float scale;
            uniform vec2 offset;
            void main () {
              vec2 p  = position;
              p *= scale;
              p += offset;
              gl_Position = vec4(p, 0, 1);
            }`,

            attributes: {
                position: [[-1, -1], [1, -1], [1, 1], [-1, 1]],
            },
            uniforms: {
                color: [0, 1, 0, 1],
                scale: props.scale,
                offset: props.offset,
            },
            count: 4,
            lineWidth: 1,
            primitive: 'line loop'
        });
    }
    let chunkDrawCalls = [];

    if (config.useChunks) {
        let scale = config.chunkSize / size;

        for (let i = 0; i < map.chunks_count(); i++) {
            let chunk = map.chunk(i);

            chunkDrawCalls.push(drawChunk({
                    scale: scale,
                    offset: [-1 + scale + 2*(chunk.x()/config.size), 1 - scale - 2*(chunk.y()/config.size)],
                }));
        }
    }

    let drawChunks = () => {
        if (config.useChunks && showActiveChunks) {
            for (let i = 0; i < chunkDrawCalls.length; i++) {
                let chunk = map.chunk(i);

                if (chunk.active_next_tick()) {
                    chunkDrawCalls[i]();
                }
            }
        }
    }

    return () => {
        regl.poll();
        drawChunks();
        drawMap();
    };
};

export { startWebGL};