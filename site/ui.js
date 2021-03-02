import {tickTime} from "./performance";

var $ = require( "jquery" );

import { width, height, map, nextTick } from "./main.js";
import { Element } from "./node_modules/engine/engine.js";

const canvas = document.getElementById("canvas");

let selectedElement = Element.Sand;

let paused = false;
let playButton = $('#play')
let pauseButton = $('#pause')
let nextFrameButton = $('#nextFrame')

playButton.hide();
nextFrameButton.addClass("disabled");

playButton.click(() => togglePause());
pauseButton.click(() => togglePause());

nextFrameButton.click(() => {
    if (paused) {
        tickTime.start();
        nextTick();
        tickTime.stop();
    }
});

$('#reset').click(() => map.clear());

const togglePause = () => {
    paused = !paused;
    window.paused = paused;

    if (paused) {
        playButton.show();
        pauseButton.hide();
        nextFrameButton.removeClass("disabled");
    } else {
        playButton.hide();
        pauseButton.show();
        nextFrameButton.addClass("disabled");
    }
}

$('#emptyElement').change(() => selectedElement = Element.Empty);
$('#wallElement').change(() => selectedElement = Element.Wall);
$('#sandElement').change(() => selectedElement = Element.Sand);

let painting = false;
let lastPaint = null;
let repeat = null;

canvas.addEventListener("mousedown", event => {
    event.preventDefault();
    painting = true;
    clearInterval(repeat);
    repeat = window.setInterval(() => paint(event), 100);
    paint(event);
    lastPaint = event;
});

document.body.addEventListener("mouseup", event => {
    clearInterval(repeat);
    if (painting) {
        event.preventDefault();
        lastPaint = null;
        painting = false;
    }
});

canvas.addEventListener("mousemove", event => {
    clearInterval(repeat);
    smoothPaint(event);
});

canvas.addEventListener("mouseleave", event => {
    clearInterval(repeat);
    lastPaint = null;
});

const paint = event => {
    if (!painting) {
        return;
    }
    const boundingRect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / Math.ceil(window.devicePixelRatio) / boundingRect.width;
    const scaleY = canvas.height / Math.ceil(window.devicePixelRatio) / boundingRect.height;

    const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
    const canvasTop = (event.clientY - boundingRect.top) * scaleY;

    const x = Math.min(Math.floor(canvasLeft), width - 1);
    const y = Math.min(Math.floor(canvasTop), height - 1);

    map.insert(x, y, selectedElement);
};

function smoothPaint(event) {
    clearInterval(repeat);
    repeat = window.setInterval(() => paint(event), 100);

    let startEvent = { clientX: event.clientX, clientY: event.clientY };

    if (!painting) {
        return;
    }

    let i = 0;
    paint(startEvent);

    if (lastPaint) {
        while (eventDistance(startEvent, lastPaint) > 1 / 3) {
            let d = eventDistance(startEvent, lastPaint);
            startEvent = add(
                startEvent,
                scale(norm(sub(lastPaint, event)), Math.min(1 / 3, d))
            );
            i++;
            if (i > 1000) {
                break;
            }
            paint(startEvent);
        }
    }
    lastPaint = event;
}

const eventDistance = (a, b) => {
    return Math.sqrt(
        Math.pow(a.clientX - b.clientX, 2) + Math.pow(a.clientY - b.clientY, 2),
        2
    );
};

const add = (a, b) => {
    return { clientX: a.clientX + b.clientX, clientY: a.clientY + b.clientY };
};

const sub = (a, b) => {
    return { clientX: a.clientX - b.clientX, clientY: a.clientY - b.clientY };
};

const norm = a => {
    let mag = magnitude(a);
    return { clientX: a.clientX / mag, clientY: a.clientY / mag };
};

const scale = (a, s) => {
    return { clientX: a.clientX * s, clientY: a.clientY * s };
};

const magnitude = a => {
    return Math.sqrt(Math.pow(a.clientX, 2) + Math.pow(a.clientY, 2), 2);
};