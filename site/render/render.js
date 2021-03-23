const reglBuilder = require("regl");

import {showActiveChunks} from "../ui";
import { memory } from "engine/engine_bg";

let map_vert = require("./shaders/map.vert");
let map_frag = require("./shaders/map.frag");
let chunk_vert = require("./shaders/chunk.vert");
let chunk_frag = require("./shaders/chunk.frag");

let startWebGL = ({ canvas, map, config }) => {
    const regl = reglBuilder({
        canvas
    });

    const size = map.config().size;
    let ptr_pixels = map.display();
    let pixels = new Uint8Array(memory.buffer, ptr_pixels, size * size * 4);
    const dataTexture = regl.texture({ width: size, height: size, data: pixels });

    let drawMap = regl({
        vert: map_vert,
        frag: map_frag,
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
            vert: chunk_vert,
            frag: chunk_frag,
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