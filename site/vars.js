import {Element, MapGenerator} from "engine";

const elements = [
    {key: Element.Empty, value: {name: "Empty", color: "rgba(255,255,255,1)"}},
    {key: Element.Wall, value: {name: "Wall", color: "rgba(0,0,0,1)"}},
    {key: Element.Sand, value: {name: "Sand", color: "rgba(194, 178, 127, 1)"}}];

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

export {elements, mapGenerators, mapGeneratorByName}