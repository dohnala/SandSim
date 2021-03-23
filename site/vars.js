import {Element, MapGenerator} from "engine";

const elements = [
    {key: Element.Empty, value: {name: "Empty", color: [255,255,255,255]}},
    {key: Element.Wall, value: {name: "Wall", color: [0,0,0,255]}},
    {key: Element.Sand, value: {name: "Sand", color: [194,178,127, 255]}},
    {key: Element.Dirt, value: {name: "Dirt", color: [132,57,24,255]}},
    {key: Element.Water, value: {name: "Water", color: [44,100,230,255]}}
];

const mapSizes = [64, 128, 256, 512];
const chunkSizes = [16, 32, 64];

const mapGenerators = [
    {key: MapGenerator.EMPTY, value: {name: "Empty"}},
    {key: MapGenerator.CAVE, value: {name: "Cave"}},];

const elementColorsArray = () => {
    let result = [];

    for (let key in elements) {
        if (elements.hasOwnProperty(key)) {
            result = result.concat(elements[key].value.color);
        }
    }

    return result;
}

const mapGeneratorByName = name => {
    for (let key in mapGenerators) {
        if (mapGenerators.hasOwnProperty(key)) {
            if (mapGenerators[key].value.name === name) {
                return key;
            }
        }
    }

    return null;
}

export {elements, mapSizes, chunkSizes, mapGenerators, elementColorsArray, mapGeneratorByName}