import {backgroundColor, elementColorsArray, elementColorsArrayDim} from "../vars";
import {showActiveChunks} from "../ui";
import { memory } from "engine/engine_bg";

const reglBuilder = require("regl");

const useBlending = true;

// Common shaders
let texture_vert = require("./shaders/common/texture.vert");
let texture_frag = require("./shaders/common/texture.frag");

// Scene shaders
let background_vert = require("./shaders/scene/background.vert");
let background_frag = require("./shaders/scene/background.frag");
let map_vert = require("./shaders/scene/map.vert");
let map_frag = require("./shaders/scene/map.frag");

// Post-processing shaders
let blend_vert = require("./shaders/effects/blend.vert");
let blend_frag = require("./shaders/effects/blend.frag");

// Debug shaders
let chunk_vert = require("./shaders/debug/chunk.vert");
let chunk_frag = require("./shaders/debug/chunk.frag");

let startWebGL = ({ canvas, map, config }) => {
    const regl = reglBuilder({
        extensions: ['OES_texture_float'],
        canvas: canvas,
    });

    const mapSize = map.config().size;

    // Framebuffer where the scene is rendered into
    const sceneFbo = regl.framebuffer({
        color: regl.texture({
            width: mapSize,
            height: mapSize,
            wrap: "clamp"
        }),
        depth: false
    });

    const elementTextureDim = elementColorsArrayDim();

    // Texture with colors for all elements
    const elementTexture = regl.texture({
        width: elementTextureDim[0],
        height: elementTextureDim[1],
        type: 'float',
        data: elementColorsArray(),
    });

    // Texture with map pixels
    const mapTexture = regl.texture({
        width: mapSize,
        height: mapSize,
        data: new Uint8Array(memory.buffer, map.display(), mapSize * mapSize * 4)
    });

    const clear = () => {
        regl.clear({color: [0, 0, 0, 255],})
    }

    // Draw background to the scene framebuffer
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
        framebuffer: sceneFbo
    });

    // Draw map to the scene framebuffer
    let drawMap = regl({
        vert: map_vert,
        frag: map_frag,
        uniforms: {
            time: ({tick}) => tick,
            elements_size: elementTextureDim,
            elements: elementTexture,
            map_size: mapSize,
            map: () => {
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
        framebuffer: sceneFbo
    });

    // Apply blending when different elements are next to each other
    const applyBlending = regl({
        vert: blend_vert,
        frag: blend_frag,
        attributes: {
            position: [[-1, 4], [-1, -1], [4, -1]]
        },
        uniforms: {
            map_size: mapSize,
            map: () => {
                return mapTexture({
                    width: mapSize,
                    height: mapSize,
                    data: new Uint8Array(memory.buffer, map.display(), mapSize * mapSize * 4) });
            },
            scene: sceneFbo,
        },
        depth: { enable: false },
        count: 3,
    });

    // Draw scene framebuffer to the screen
    const drawScene = regl({
        vert: texture_vert,
        frag: texture_frag,
        attributes: {
            position: [[-1, 4], [-1, -1], [4, -1]]
        },
        uniforms: {
            texture: sceneFbo
        },
        depth: { enable: false },
        count: 3,
    });

    // Draw a debug chunk to the screen
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

    // Draw all active chunks to the screen
    const drawActiveChunks = () => {
        if (config.useChunks && showActiveChunks) {
            drawChunk(chunks.filter((_, index) => map.chunk(index).active_next_tick()));
        }
    }

    return () => {
        regl.poll();

        clear();
        drawBackground({color: backgroundColor});
        drawMap();

        if (useBlending) {
            applyBlending();
        } else {
            drawScene();
        }

        drawActiveChunks();
    };
};

export { startWebGL};