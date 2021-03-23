import {Element, MapGenerator} from "engine";

const elements = [
    {key: Element.Empty, value: {name: "Empty", hsv: [0,0,1], alpha: 0}},
    {key: Element.Wall, value: {name: "Wall", hsv: [0,0,0], alpha: 1}},
    {key: Element.Sand, value: {name: "Sand",  hsv: [46,0.35,0.62], alpha: 1}},
    {key: Element.Dirt, value: {name: "Dirt", hsv: [18,0.69,0.30], alpha: 1}},
    {key: Element.Water, value: {name: "Water", hsv: [222,0.79,0.54], alpha: 0.5}}
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
            result = result.concat(
                [elements[key].value.hsv[0] / 360.],
                [elements[key].value.hsv[1]],
                [elements[key].value.hsv[2]],
                [elements[key].value.alpha]);
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