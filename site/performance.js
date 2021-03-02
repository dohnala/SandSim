const MEAN_FRAMES_SIZE = 100;

let fpsLabel = document.getElementById("fps");
let meanFrameTimeLabel = document.getElementById("meanFrameTime");
let meanRenderTimeLabel = document.getElementById("meanRenderTime");
let meanTickTimeLabel = document.getElementById("meanTickTime");
let lastTickTimeLabel = document.getElementById("lastTickTime");

const fps = new class {
    constructor() {
        this.mean = 0;
        this.frames = [];
        this.lastFrameTimeStamp = performance.now();
    }

    measure() {
        const now = performance.now();
        const delta = now - this.lastFrameTimeStamp;
        this.lastFrameTimeStamp = now;
        const fps = (1 / delta) * 1000;

        this.frames.push(fps);
        if (this.frames.length > MEAN_FRAMES_SIZE) {
            this.frames.shift();
        }

        this.mean = measureMean(this.frames);
    }
}

const frameTime = new class {
    constructor() {
        this.mean = 0;
        this.last = 0;
        this.frames = [];
        this.startTime = performance.now();
    }

    start() {
        this.startTime = performance.now();
    }

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

const renderTime = new class {
    constructor() {
        this.mean = 0;
        this.last = 0;
        this.frames = [];
        this.startTime = performance.now();
    }

    start() {
        this.startTime = performance.now();
    }

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

const tickTime = new class {
    constructor() {
        this.mean = 0;
        this.last = 0;
        this.frames = [];
        this.startTime = performance.now();
    }

    start() {
        this.startTime = performance.now();
    }

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

const measureMean = array => {
    let sum = 0;

    for (let i = 0; i < array.length; i++) {
        sum += array[i];
    }

    return  sum / array.length;
}

const updateLabels = () => {
    fpsLabel.textContent = `FPS: ${Math.round(fps.mean)}`;
    meanFrameTimeLabel.textContent = `${Math.round(frameTime.mean)}ms`;
    meanRenderTimeLabel.textContent = `${Math.round(renderTime.mean)}ms`;
    meanTickTimeLabel.textContent = `${Math.round(tickTime.mean)}ms`;
}

setInterval(updateLabels, 500);

export { fps, frameTime, renderTime, tickTime};