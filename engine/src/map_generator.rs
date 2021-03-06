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
    // parameters
    let wall_density = 0.38;
    let surrounding_count_threshold = 4;
    let smooth_iterations = 5;

    let mut random = Random::new(config.seed);
    let map_size = (config.width * config.height) as usize;

    let mut pixel_states : Vec<PixelState>  = (0..map_size)
        .map(|_i| {
            if random.next() <= wall_density {WALL_PIXEL_STATE} else {EMPTY_PIXEL_STATE}
        })
        .collect();

    for i in 0 .. smooth_iterations {
        smoothMap(config, &mut pixel_states, surrounding_count_threshold);
    }

    return pixel_states;
}

// Create rooms
fn smoothMap(config: &MapConfig, pixel_states: &mut Vec<PixelState>, surrounding_count_threshold : i8) {
    for x in 1 .. config.width - 1 {
        for y in 1 .. config.height - 1 {
            let mut surrounding_count : i8 = 0;

            for neighbour_x in x - 1 .. x + 2 {
                for neighbour_y in y - 1 .. y + 2 {
                    let offset_index = index(neighbour_x, neighbour_y, config);

                    // fill border
                    if neighbour_x == 0 || neighbour_x == config.width - 1 || neighbour_y == 0 || neighbour_y == config.height - 1 {
                        pixel_states[offset_index] = WALL_PIXEL_STATE;
                    }

                    if pixel_states[offset_index] == WALL_PIXEL_STATE {
                        surrounding_count += 1;
                    }
                }
            }

            let current_index = index(x, y, config);
            if surrounding_count > surrounding_count_threshold {
                pixel_states[current_index] = WALL_PIXEL_STATE;
            } else if surrounding_count < surrounding_count_threshold {
                pixel_states[current_index] = EMPTY_PIXEL_STATE
            }
        }
    }
}

fn index(x: i32, y: i32, config: &MapConfig) -> usize {
    (x + (y * config.width)) as usize
}