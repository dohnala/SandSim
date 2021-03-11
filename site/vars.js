import {Element, MapGenerator} from "engine";

const elements = [
    {key: Element.Empty, value: {name: "Empty", color: "rgba(255,255,255,1)"}},
    {key: Element.Wall, value: {name: "Wall", color: "rgba(0,0,0,1)"}},
    {key: Element.Sand, value: {name: "Sand", color: "rgba(194, 178, 127, 1)"}},
    {key: Element.Dirt, value: {name: "Dirt", color: "rgba(132, 57, 24, 1)"}},
    {key: Element.Water, value: {name: "Water", color: "rgba(44, 100, 230, 1)"}}
];

const mapSizes = [64, 128, 256, 512];
const chunkSizes = [16, 32, 64];

const mapGenerators = [
    {key: MapGenerator.EMPTY, value: {name: "Empty"}},
    {key: MapGenerator.CAVE, value: {name: "Cave"}},];

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

export {elements, mapSizes, chunkSizes, mapGenerators, mapGeneratorByName}