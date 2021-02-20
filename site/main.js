import { Map } from "./node_modules/engine/engine.js";
import { startWebGL } from "./render";
import {} from "./ui";

let width = 100;
let height = 100;
const map = Map.new(width, height);

const canvas = document.getElementById("canvas");

canvas.width = width * Math.ceil(window.devicePixelRatio);
canvas.height = height * Math.ceil(window.devicePixelRatio);

let drawMap = startWebGL({ canvas, map });

const renderLoop = () => {
    if (!window.paused) {
        map.tick();
    }

    drawMap();
    window.animationId = requestAnimationFrame(renderLoop);
};

renderLoop();

export { canvas, width, height, map };