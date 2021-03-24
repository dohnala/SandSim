import {backgroundColor, elementColorsArray, elementColorsArrayDim} from "../vars";
import {showActiveChunks} from "../ui";
import { memory } from "engine/engine_bg";

const reglBuilder = require("regl");

let background_vert = require("./shaders/background.vert");
let background_frag = require("./shaders/background.frag");
let map_vert = require("./shaders/map.vert");
let map_frag = require("./shaders/map.frag");
let chunk_vert = require("./shaders/chunk.vert");
let chunk_frag = require("./shaders/chunk.frag");

let startWebGL = ({ canvas, map, config }) => {
    const regl = reglBuilder({
        extensions: ['OES_texture_float'],
        canvas: canvas,
    });

    const elementTextureDim = elementColorsArrayDim();

    // Texture with colors for all elements
    const elementTexture = regl.texture({
        width: elementTextureDim[0],
        height: elementTextureDim[1],
        type: 'float',
        data: elementColorsArray(),
    });

    const mapSize = map.config().size;

    // Texture with map pixels
    const mapTexture = regl.texture({
        width: mapSize,
        height: mapSize,
        data: new Uint8Array(memory.buffer, map.display(), mapSize * mapSize * 4)
    });

    let drawBackground = regl({
        vert: background_vert,
        frag: background_frag,
        uniforms: {
            color: regl.prop('color'),
        },
        depth: { enable: false },
        attributes: {
            position: [[-1, 4], [-1, -1], [4, -1]]
        },
        count: 3,
    });

    // Draw all map pixels
    let drawMap = regl({
        vert: map_vert,
        frag: map_frag,
        uniforms: {
            time: ({tick}) => tick,
            element_texture_dim: elementTextureDim,
            element_texture: elementTexture,
            map_size: mapSize,
            map_texture: () => {
                return mapTexture({
                    width: mapSize,
                    height: mapSize,
                    data: new Uint8Array(memory.buffer, map.display(), mapSize * mapSize * 4) });
            },
        },
        depth: { enable: false },
        blend: {
            enable: true,
            func: {
                srcRGB: 'src alpha',
                srcAlpha: 'src alpha',
                dstRGB: 'one minus src alpha',
                dstAlpha: 'one minus src alpha',
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
            color: [0.3, 0.7, 0.1, 1],
            scale: regl.prop('scale'),
            offset: regl.prop('offset'),
        },
        depth: { enable: false },
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
        regl.clear({
            color: [0, 0, 0, 255],
        })

        drawBackground({color: backgroundColor});
        drawMap();
    }

    const drawDebugInfo = () => {
        drawActiveChunks();
    }

    return () => {
        regl.poll();

        drawScene();
        drawDebugInfo();
    };
};

export { startWebGL};