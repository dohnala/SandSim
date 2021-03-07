import {Map, MapConfig, MapGenerator} from "./node_modules/engine/engine.js";
import { startWebGL } from "./render";
import {} from "./ui";
import {fps, pixelsProcessed, renderTime, tickTime} from "./performance";

let config = {
    size: 128,
    gravity: 0.2,
    maxVelocity: 5,
    useChunks: true,
    chunkSize: 16,
    generator: MapGenerator.EMPTY,
}

let map;
let drawMap;

const canvas = document.getElementById("canvas");

const generateSeed = () => {
    return Math.floor(Math.random() * Math.floor(10000));
}

const createMap = () => {
    map = Map.new(MapConfig.new(
        config.size,
        config.gravity,
        config.maxVelocity,
        config.useChunks,
        config.chunkSize,
        generateSeed()),
        Number(config.generator));
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

export { canvas, config, map, createMap, nextTick};