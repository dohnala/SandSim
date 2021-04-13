use wasm_bindgen::prelude::*;
use crate::map::{MapConfig, Map};
use crate::math::Vec2;
use crate::element::Element;
use crate::rand::Random;

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
        let mut random = Random::new(self.config.seed);
        let mut map = Map::new(self.config);

        for x in 0..self.config.size {
            for y in 0..self.config.size {
                let noise = random.u8();

                // Create a pixel
                let pixel = map.create_pixel_with_noise(Element::Noise, noise);

                // Insert it into the map
                map.insert_pixel(Vec2::new(x, y), &pixel);
            }
        }

        return map;
    }

}
