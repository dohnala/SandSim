use wasm_bindgen::prelude::*;
use crate::map::{PixelState, MapConfig, EMPTY_PIXEL_STATE, WALL_PIXEL_STATE};
use crate::rand::Random;
use crate::element::Element;

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
    return (0..config.size * config.size)
        .map(|_i| {
            EMPTY_PIXEL_STATE
        })
        .collect();
}

// Generates a new cave map
fn generate_cave_map(config: &MapConfig) -> Vec<PixelState> {
    // parameters
    let border_size = 3;
    let wall_density = 0.52;
    let wall_threshold: u8 = 5;
    let smooth_iterations: u8 = 12;

    let mut random = Random::new(config.seed);

    // Create vector filled will walls
    let mut pixels = vec![WALL_PIXEL_STATE; (config.size * config.size) as usize];
    let mut pixels_copy = vec![WALL_PIXEL_STATE; (config.size * config.size) as usize];
    let mut buffer_switch = true;

    // Generate random pixels, but leave the border with walls
    for x in border_size .. config.size - border_size {
        for y in border_size .. config.size - border_size {
            pixels[index(x, y, config)] = if random.next() <= wall_density {
                WALL_PIXEL_STATE
            } else {
                EMPTY_PIXEL_STATE
            }
        }
    }

    // Double buffering smoothing
    for _ in 0 .. smooth_iterations {
        if buffer_switch {
            smooth_map(config, &pixels, &mut pixels_copy, border_size, wall_threshold);
        } else {
            smooth_map(config, &pixels_copy, &mut pixels, border_size, wall_threshold);
        }
        buffer_switch = !buffer_switch;
    }

    return if buffer_switch { pixels_copy } else { pixels };
}

// Create rooms
fn smooth_map(config: &MapConfig, source_pixels: & Vec<PixelState>, target_pixels: &mut Vec<PixelState>, border_size: i32, wall_threshold : u8) {

    // Do not process borders
    for x in border_size .. config.size - border_size {
        for y in border_size .. config.size - border_size {
            let mut surrounding_walls: u8 = 0;

            for neighbour_x in x-1..=x+1 {
                for neighbour_y in y-1..=y+1 {
                    let index = index(neighbour_x, neighbour_y, config);
                    surrounding_walls += if source_pixels[index].element() == Element::Wall {1} else {0};
                }
            }

            let current_index = index(x, y, config);

            if surrounding_walls > wall_threshold {
                target_pixels[current_index] = WALL_PIXEL_STATE;
            } else if surrounding_walls < wall_threshold {
                target_pixels[current_index] = EMPTY_PIXEL_STATE
            }
        }
    }
}


fn index(x: i32, y: i32, config: &MapConfig) -> usize {
    (x + (y * config.size)) as usize
}