import {Map, MapConfig, MapGenerator} from "./node_modules/engine/engine.js";
import { startWebGL } from "./render";
import {} from "./ui";
import {fps, pixelsProcessed, renderTime, tickTime} from "./performance";

const generateSeed = () => {
    return Math.floor(Math.random() * Math.floor(10000));
}

let config = {
    width: 128,
    height: 128,
    gravity: 0.2,
    max_velocity: 5,
    generator: MapGenerator.EMPTY,
    seed: 1,
}

let map;
let drawMap;

const canvas = document.getElementById("canvas");

const createMap = () => {
    map = Map.new(MapConfig.new(
        config.width,
        config.height,
        config.gravity,
        config.max_velocity,
        config.seed),
        Number(config.generator));
    canvas.width = config.width * Math.ceil(window.devicePixelRatio);
    canvas.height = config.height * Math.ceil(window.devicePixelRatio);
    drawMap = startWebGL({ canvas, map });

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