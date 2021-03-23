import {elements, elementColorsArray} from "../vars";

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

    const mapSize = map.config().size;

    // Texture with colors for all elements
    const elementTexture = regl.texture({
        width: elements.length,
        height: 1,
        type: 'uint8',
        format: 'rgba',
        data: new Uint8Array(elementColorsArray()),
    });

    // Texture with map pixels
    const mapTexture = regl.texture({
        width: mapSize,
        height: mapSize,
        type: 'uint8',
        format: 'rgba',
        data: new Uint8Array(memory.buffer, map.display(), mapSize * mapSize * 4)
    });

    // Draw all map pixels
    let drawMap = regl({
        vert: map_vert,
        frag: map_frag,
        uniforms: {
            element_texture: elementTexture,
            element_count: elements.length,
            map_texture: () => {
                return mapTexture({
                    width: mapSize,
                    height: mapSize,
                    data: new Uint8Array(memory.buffer, map.display(), mapSize * mapSize * 4) });
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
        let scale = config.chunkSize / mapSize;

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