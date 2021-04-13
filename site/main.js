import {generate_map, Map, MapConfig, MapGenerator} from "./node_modules/engine/engine.js";
import { startWebGL } from "./render/render";
import {} from "./ui";
import {fps, pixelsProcessed, renderTime, tickTime} from "./performance";

const generateSeed = () => {
    return Math.floor(Math.random() * Math.floor(10000));
}

let config = {
    size: 256,
    gravity: 0.2,
    maxVelocity: 10,
    useChunks: true,
    chunkSize: 32,
    generator: MapGenerator.EMPTY,
    seed: 1,
}

let map;
let drawMap;

const canvas = document.getElementById("canvas");

const createMap = () => {
    map = generate_map(Number(config.generator), MapConfig.new(
        config.size,
        config.gravity,
        config.maxVelocity,
        config.useChunks,
        config.chunkSize,
        config.seed));

    canvas.width = config.size * Math.ceil(window.devicePixelRatio);
    canvas.height = config.size * Math.ceil(window.devicePixelRatio);
    drawMap = startWebGL({ canvas, map, config });

    pixelsProcessed.reset();
}

createMap();

const renderLoop = () => {
    fps.measure();

    if (!window.paused) {
        tickTime.start();
        pixelsProcessed.measure(nextTick());
        tickTime.stop();
    }

    renderTime.start();
    drawMap();
    renderTime.stop();

    window.animationId = requestAnimationFrame(renderLoop);
};

const nextTick = () => {
    return map.tick(fps.delta);
}

renderLoop();

export { canvas, config, map, createMap, nextTick, generateSeed};