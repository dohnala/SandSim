import {Element, MapGenerator} from "engine";

const backgroundColor = [0.31, 0.3, 0.3, 1];

// Elements and their properties
//
// key - unique identification of the element, for now, they must be sorted in ascending incremental order (0, 1, 2, ..)
// name - name of the element, used in UI
// hsv - base HSV (Hue, Saturation, Value) color of the element
//      - [0] - Hue, int in range [0..360]
//      - [1] - Saturation, float in range [0..1]
//      - [2] - Value, float in range [0..1]
// alpha - transparency of the element in range [0..1]
// params - additional dynamic parameters which affect element color in runtime
//      - [0] - Value modifier in range [0..1]
//            - if the modifier is 0.5 for example, it means that random number in range [0..0.5] will be added
//              to the base value of HSV at runtime
//      - [1] - Value noise speed in range [0..]
//            - it determines how fast the element's Value is changed
//      - [2] - Value noise modifier in range [0..1]
//            - if the modifier is 0.5 for example, it means that random number in range [0..0.5] will be added
//              to the base value of HSV at runtime with speed of [Value noise speed] parameter
const elements = [
    {key: Element.Empty, value: {name: "Empty", hsv: [0,0,1], alpha: 0, params: [0,0,0,0]}},
    {key: Element.Wall, value: {name: "Wall", hsv: [0,0,0], alpha: 1, params: [0,0,0,0]}},
    {key: Element.Sand, value: {name: "Sand",  hsv: [46,0.5,0.5], alpha: 1, params: [0.2,0,0,0]}},
    {key: Element.Dirt, value: {name: "Dirt", hsv: [18,0.6,0.3], alpha: 1, params: [0.1,0,0,0]}},
    {key: Element.Water, value: {name: "Water", hsv: [222,0.7,0.65], alpha: 0.8, params: [0.1,0.015,0.1,0]}}
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

            result = result.concat(elements[key].value.params);
        }
    }

    return result;
}

const elementColorsArrayDim = () => {
    // height = 2 (color + params)
    return [2, elements.length];
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

export {backgroundColor, elements, mapSizes, chunkSizes, mapGenerators,
    elementColorsArray, elementColorsArrayDim, mapGeneratorByName}