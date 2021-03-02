import { Map } from "./node_modules/engine/engine.js";
import { startWebGL } from "./render";
import {} from "./ui";
import {fps, frameTime, renderTime, tickTime} from "./performance";

let width = 128;
let height = 128;
const map = Map.new(width, height);

const canvas = document.getElementById("canvas");

canvas.width = width * Math.ceil(window.devicePixelRatio);
canvas.height = height * Math.ceil(window.devicePixelRatio);

let drawMap = startWebGL({ canvas, map });

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
    map.tick();
}

renderLoop();

export { canvas, width, height, map, nextTick};