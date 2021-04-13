use wasm_bindgen::prelude::*;
use crate::map::{MapConfig, Map};

// Represents a map generator
#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum MapGenerator {
    EMPTY = 0,
    CAVE = 1,
}

#[wasm_bindgen]
pub fn generate_map(generator: MapGenerator, config: MapConfig) -> Map {
    match generator {
        MapGenerator::EMPTY => EmptyMapGenerator::new(config).generate(),
        MapGenerator::CAVE => CaveMapGenerator::new(config).generate(),
    }
}

pub struct EmptyMapGenerator {
    config: MapConfig,
}

impl EmptyMapGenerator {
    pub fn new(config: MapConfig) -> EmptyMapGenerator {
        EmptyMapGenerator {config}
    }

    pub fn generate(&mut self) -> Map {
        Map::new(self.config)
    }
}

pub struct CaveMapGenerator {
    config: MapConfig,
}

impl CaveMapGenerator {
    pub fn new(config: MapConfig) -> CaveMapGenerator {
        CaveMapGenerator {config}
    }

    pub fn generate(&mut self) -> Map {
        Map::new(self.config)
    }
}