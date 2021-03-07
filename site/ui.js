import {config, createMap, map, nextTick} from "./main.js";
import {elements, mapGenerators, mapGeneratorByName, mapSizes, chunkSizes} from "./vars";
import {pixelsProcessed, tickTime} from "./performance";

var $ = require( "jquery" );

const canvas = document.getElementById("canvas");

$('document').ready(function(){
    addMapSizes();
    addChunkSizes();
    addMapGenerators();
    addElements();
    updateCreateForm()

});

// -----------------------------------------------------------------------------------------------
//  CREATE MAP
// -----------------------------------------------------------------------------------------------
let createButton = $('#create');
let useChunksCheckbox = $('#configUseChunks');
let chunkSizeSelect = $('#configChunkSize');
let showActiveChunks = false;
let showActiveChunksCheckbox = $('#showActiveChunks');

createButton.click(() => {
    config.size = Number($('#configSize').val());
    config.gravity = clamp($('#configGravity').val(), -1, 1);
    config.maxVelocity = clamp($('#configMaxVelocity').val(), 0, 100);
    config.useChunks = useChunksCheckbox.is(":checked");
    config.chunkSize = Number(chunkSizeSelect.val());
    config.generator = mapGeneratorByName($('#configGenerator').val());

    createMap()
    updateCreateForm();
});

const updateCreateForm = () => {
    $('#configSize').val(config.size);
    $('#configGravity').val(config.gravity);
    $('#configMaxVelocity').val(config.maxVelocity);
    $('#configGenerator').val(mapGenerators[config.generator].value.name);

    useChunksCheckbox.prop('checked', config.useChunks)
    chunkSizeSelect.val(config.chunkSize);
    chunkSizeSelect.prop('disabled', !config.useChunks)
}

const addMapSizes = () => {
    mapSizes.forEach(function (value) {
        let option = `<option>${value}</option>`;

        $('#configSize').append(option);
    });
}

const addChunkSizes = () => {
    chunkSizes.forEach(function (value) {
        let option = `<option>${value}</option>`;

        $('#configChunkSize').append(option);
    });
}

const addMapGenerators = () => {
    for (let key in mapGenerators) {
        if (mapGenerators.hasOwnProperty(key)) {
            let option = `<option>${mapGenerators[key].value.name}</option>`;

            $('#configGenerator').append(option);
        }
    }
}

useChunksCheckbox.change(function() {
    chunkSizeSelect.prop('disabled', !this.checked)
    showActiveChunksCheckbox.prop('disabled', !this.checked)
});

showActiveChunksCheckbox.change(function() {
    showActiveChunks = this.checked;
});

// -----------------------------------------------------------------------------------------------
//  ACTIONS
// -----------------------------------------------------------------------------------------------
let paused = false;
let playButton = $('#play');
let pauseButton = $('#pause');
let nextFrameButton = $('#nextFrame');
let resetButton = $('#reset');

playButton.hide();
nextFrameButton.addClass("disabled");

playButton.click(() => togglePause());
pauseButton.click(() => togglePause());
nextFrameButton.click(() => nextFrame());
resetButton.click(() => resetMap());

$('body').keypress(event => {
    // P
    if (event.keyCode === 112) {
        togglePause();
    }
    // F
    else if (event.keyCode === 102) {
        nextFrame();
    }
    // R
    else if (event.keyCode === 114) {
        resetMap();
    }
})

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

const nextFrame = () => {
    if (paused) {
        tickTime.start();
        pixelsProcessed.measure(nextTick());
        tickTime.stop();
    }
}

const resetMap = () => {
    map.clear();
    pixelsProcessed.reset();
}

// -----------------------------------------------------------------------------------------------
//  ELEMENTS
// -----------------------------------------------------------------------------------------------
let selectedElement = null;

const addElements = () => {
    for (let key in elements) {
        if (elements.hasOwnProperty(key)) {
            let radio = `
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="flexRadioDefault" id="element_${key}">
                    <label class="form-check-label" for="element_${key}">
                        <i class="bi bi-square-fill" style="color: ${elements[key].value.color}"></i>
                        <label>${elements[key].value.name}</label>
                    </label>
                </div>`;

            $('#painting').append(radio);
            $('#element_' + key + '').change(() => selectedElement = Number(key));
        }
    }

    // Select Sand by default
    selectedElement = 2;
    $('#element_2').attr('checked', true)
}

// -----------------------------------------------------------------------------------------------
//  BRUSH SETTINGS
// -----------------------------------------------------------------------------------------------
let brushSize = {
    value: 0,
    step: 1,
    min: 0,
    max: 5
}

let brushSizeSlider = $('#brushSize');

brushSizeSlider.on("change", function () {
    brushSize.value = clamp(Number($(this).val()), brushSize.min, brushSize.max);
});

$(window).bind('mousewheel DOMMouseScroll', function(event){
    if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
        brushSize.value = clamp(brushSize.value + brushSize.step, brushSize.min, brushSize.max);
        brushSizeSlider.val(brushSize.value);
    } else {
        brushSize.value = clamp(brushSize.value - brushSize.step, brushSize.min, brushSize.max);
        brushSizeSlider.val(brushSize.value);
    }
});

// -----------------------------------------------------------------------------------------------
//  PIXEL INSPECTION
// -----------------------------------------------------------------------------------------------
let inspectPixelPosition = null;
let inspecting = false;
let inspectRepeat = null;
let inspectCheckBox = $('#inspectCheck');
let inspectDetails = $('#inspectDetails');

inspectDetails.hide();

inspectCheckBox.click(() => {
    if (inspectCheckBox.prop('checked')) {
        inspecting = true;
        clearInterval(inspectRepeat);
        inspectRepeat = window.setInterval(() => inspectPixel(), 100);
    } else {
        inspecting = false;
        clearInterval(inspectRepeat);
    }
})

const findInspectPixelPosition = event => {
    if (inspectCheckBox.prop('checked')) {
        inspectPixelPosition = getPixelPosition(event);
    } else {
        inspectPixelPosition = null;
    }
}

const inspectPixel = event => {
    if (inspecting && inspectPixelPosition) {
        let pixel = map.pixel_state(inspectPixelPosition[0], inspectPixelPosition[1])

        if (pixel) {
            inspectDetails.show();
            $('#inspectElement').text(elements[pixel.element()].value.name);
            $('#inspectPosition').text("(" + inspectPixelPosition[0] + ", " + inspectPixelPosition[1] + ")");
            $('#inspectVelocity').text("(0, " + pixel.velocity_y() + ")");
        }
    } else {
        inspectDetails.hide();
    }
}

// -----------------------------------------------------------------------------------------------
//  PAINTING
// -----------------------------------------------------------------------------------------------
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
    findInspectPixelPosition(event);
});

canvas.addEventListener("mouseleave", event => {
    clearInterval(repeat);
    lastPaint = null;
    inspectPixelPosition = null;
});

const paint = event => {
    if (!painting) {
        return;
    }

    let pixelPosition = getPixelPosition(event);

    map.insert(pixelPosition[0], pixelPosition[1], selectedElement, brushSize.value);
};

const smoothPaint = event => {
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

// -----------------------------------------------------------------------------------------------
//  UTILS
// -----------------------------------------------------------------------------------------------

const getPixelPosition = event => {
    const boundingRect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / Math.ceil(window.devicePixelRatio) / boundingRect.width;
    const scaleY = canvas.height / Math.ceil(window.devicePixelRatio) / boundingRect.height;

    const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
    const canvasTop = (event.clientY - boundingRect.top) * scaleY;

    const x = Math.max(Math.min(Math.floor(canvasLeft), config.size - 1), 0);
    const y = Math.max(Math.min(Math.floor(canvasTop), config.size - 1), 0);

    return [x, y];
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

const clamp = function(value, min, max) {
    return Math.min(Math.max(value, min), max);
};

export {showActiveChunks}