import {elements, elementColorsArray} from "../vars";
import {showActiveChunks} from "../ui";
import { memory } from "engine/engine_bg";

const reglBuilder = require("regl");

let map_vert = require("./shaders/map.vert");
let map_frag = require("./shaders/map.frag");
let chunk_vert = require("./shaders/chunk.vert");
let chunk_frag = require("./shaders/chunk.frag");

let startWebGL = ({ canvas, map, config }) => {
    const regl = reglBuilder({
        extensions: ['OES_texture_float'],
        canvas: canvas,
    });

    const mapSize = map.config().size;

    // Texture with colors for all elements
    const elementTexture = regl.texture({
        width: elements.length,
        height: 1,
        type: 'float',
        data: elementColorsArray(),
    });

    // Texture with map pixels
    const mapTexture = regl.texture({
        width: mapSize,
        height: mapSize,
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

    // Draw a single chunk
    const drawChunk = regl({
        vert: chunk_vert,
        frag: chunk_frag,
        attributes: {
            position: [[-1, -1], [1, -1], [1, 1], [-1, 1]],
        },
        uniforms: {
            color: [0, 1, 0, 0.5],
            scale: regl.prop('scale'),
            offset: regl.prop('offset'),
        },
        count: 4,
        lineWidth: 1,
        primitive: 'line loop'
    });

    // Load all map chunks
    let chunks = (() => {
        let chunks = [];

        if (config.useChunks) {
            let scale = config.chunkSize / mapSize;

            for (let i = 0; i < map.chunks_count(); i++) {
                let chunk = map.chunk(i);

                chunks.push({
                    scale: scale,
                    offset: [-1 + scale + 2*(chunk.x()/config.size), 1 - scale - 2*(chunk.y()/config.size)],
                });
            }
        }

        return chunks;
    })();

    // Draw active chunks
    const drawActiveChunks = () => {
        if (config.useChunks && showActiveChunks) {
            drawChunk(chunks.filter((_, index) => map.chunk(index).active_next_tick()));
        }
    }

    const drawScene = () => {
        drawMap();
    }

    const drawDebugInfo = () => {
        drawActiveChunks();
    }

    return () => {
        regl.poll();

        drawDebugInfo();
        drawScene();
    };
};

export { startWebGL};