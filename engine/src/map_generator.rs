use wasm_bindgen::prelude::*;
use crate::map::{PixelState, MapConfig, EMPTY_PIXEL_STATE, WALL_PIXEL_STATE};
use crate::rand::Random;

// Represents a map generator
#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum MapGenerator {
    EMPTY = 0,
    CAVE = 1,
}

impl MapGenerator {
    pub fn generate_map(&self, config: &MapConfig) -> Vec<PixelState> {
        match self {
            MapGenerator::EMPTY => generate_empty_map(config),
            MapGenerator::CAVE => generate_cave_map(config),
        }
    }
}

// Generates a new empty map
fn generate_empty_map(config: &MapConfig) -> Vec<PixelState> {
    return (0..config.width * config.height)
        .map(|_i| {
            EMPTY_PIXEL_STATE
        })
        .collect();
}

// Generates a new cave map
fn generate_cave_map(config: &MapConfig) -> Vec<PixelState> {
    // You should return a 1D Vec<PixelState> of length config.width * config.height
    // where each item can be either EMPTY_PIXEL_STATE or WALL_PIXEL_STATE

    // To compute index in this 1D Vec from x,y, use index method below

    // NOTE: All parameter of this generator should be hardcoded in this method for now
    // we will improve that in the future

    let wall_density = 0.5;
    let mut random = Random::new(config.seed);

    return (0..config.width * config.height)
        .map(|_i| {
            if random.next() <= wall_density {WALL_PIXEL_STATE} else {EMPTY_PIXEL_STATE}
        })
        .collect();
}

fn index(x: i32, y: i32, config: &MapConfig) -> usize {
    (x + (y * config.width)) as usize
}