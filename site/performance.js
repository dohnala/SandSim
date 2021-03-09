import {config} from "./main";

const MEAN_FRAMES_SIZE = 100;
const PIXEL_PROCESSED_FRAMES_SIZE = 10;

let fpsLabel = document.getElementById("fps");
let meanRenderTimeLabel = document.getElementById("meanRenderTime");
let meanTickTimeLabel = document.getElementById("meanTickTime");
let lastTickTimeLabel = document.getElementById("lastTickTime");
let meanPixelsProcessedLabel = document.getElementById("meanPixelsProcessed");
let lastPixelsProcessedLabel = document.getElementById("lastPixelsProcessed");

const fps = {
    mean: 0,
    delta: 0,
    frames: [],
    lastFrameTimeStamp: performance.now(),

    measure() {
        const now = performance.now();
        const diff = now - this.lastFrameTimeStamp;
        this.lastFrameTimeStamp = now;
        const fps = (1 / diff) * 1000;
        this.delta = diff / 1000;

        this.frames.push(fps);
        if (this.frames.length > MEAN_FRAMES_SIZE) {
            this.frames.shift();
        }

        this.mean = measureMean(this.frames);
    }
}

const renderTime = {
    mean: 0,
    last: 0,
    frames: [],
    startTime:  performance.now(),

    start() {
        this.startTime = performance.now();
    },

    stop() {
        if (window.paused) return;

        const now = performance.now();
        const frameTime = now - this.startTime;

        this.last = frameTime;

        this.frames.push(frameTime);
        if (this.frames.length > MEAN_FRAMES_SIZE) {
            this.frames.shift();
        }

        this.mean = measureMean(this.frames);
    }
}

const tickTime = {
    mean: 0,
    last: 0,
    frames: [],
    startTime:  performance.now(),

    start() {
        this.startTime = performance.now();
    },

    stop() {
        const now = performance.now();
        const frameTime = now - this.startTime;

        this.last = frameTime;

        lastTickTimeLabel.textContent = window.paused ? `${Math.round(this.last)}ms` : "";

        this.frames.push(frameTime);
        if (this.frames.length > MEAN_FRAMES_SIZE) {
            this.frames.shift();
        }

        this.mean = measureMean(this.frames);
    }
}

const pixelsProcessed = {
    mean: 0,
    last: 0,
    frames: [],

    measure(pixels) {
        this.last = pixels;

        lastPixelsProcessedLabel.textContent = window.paused ? `${Math.round(this.last)} 
        (${percentage(this.last, config.size*config.size)}%)` : "";

        this.frames.push(pixels);
        if (this.frames.length > PIXEL_PROCESSED_FRAMES_SIZE) {
            this.frames.shift();
        }

        this.mean = measureMean(this.frames);
    },

    reset() {
        this.mean = 0;
        this.last = 0;
        this.frames = [];
    }
}

const measureMean = array => {
    let sum = 0;

    for (let i = 0; i < array.length; i++) {
        sum += array[i];
    }

    return  sum / array.length;
}

const percentage = (value, max) => {
    return Math.round((100 * value) / max);
}

const updateLabels = () => {
    fpsLabel.textContent = `FPS: ${Math.round(fps.mean)}`;
    meanRenderTimeLabel.textContent = `${Math.round(renderTime.mean)}ms`;
    meanTickTimeLabel.textContent = `${Math.round(tickTime.mean)}ms`;
    meanPixelsProcessedLabel.textContent = `${Math.round(pixelsProcessed.mean)} 
    (${percentage(Math.round(pixelsProcessed.mean), config.size*config.size)}%)`;
}

setInterval(updateLabels, 100);

export { fps, renderTime, tickTime, pixelsProcessed};