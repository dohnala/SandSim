import {Map, MapConfig} from "./node_modules/engine/engine.js";
import { startWebGL } from "./render";
import {} from "./ui";
import {fps, frameTime, renderTime, tickTime} from "./performance";

let config = {
    width: 128,
    height: 128,
    gravity: 0.2,
    max_velocity: 5
}

let map;
let drawMap;

const canvas = document.getElementById("canvas");

const generateSeed = () => {
    return Math.floor(Math.random() * Math.floor(10000));
}

const createMap = () => {
    map = Map.new(MapConfig.new(config.width, config.height, config.gravity, config.max_velocity, generateSeed()));
    canvas.width = config.width * Math.ceil(window.devicePixelRatio);
    canvas.height = config.height * Math.ceil(window.devicePixelRatio);
    drawMap = startWebGL({ canvas, map });
}

createMap();

const renderLoop = () => {
    fps.measure();
    frameTime.start();

    if (!window.paused) {
        tickTime.start();
        nextTick();
        tickTime.stop();
    }

    renderTime.start();
    drawMap();
    renderTime.stop();

    frameTime.stop();

    window.animationId = requestAnimationFrame(renderLoop);
};

const nextTick = () => {
    map.tick(fps.delta);
}

renderLoop();

export { canvas, config, map, createMap, nextTick};