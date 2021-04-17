use wasm_bindgen::prelude::*;
use crate::map::{MapConfig, Map};
use crate::math::Vec2;
use crate::element::Element;
use noise::{Fbm, Seedable, MultiFractal, NoiseFn, Turbulence};
use crate::map_generator::LevelCellType::{Solid, Empty};

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
    level: Level,
}

impl CaveMapGenerator {
    pub fn new(config: MapConfig) -> CaveMapGenerator {
        let cell_size = config.size / LEVEL_SIZE as i32;

        CaveMapGenerator {
            config,
            level: Level::new(LEVEL, cell_size),
        }
    }

    // Generates a complete map
    pub fn generate(&mut self) -> Map {
        let mut map = Map::new(self.config);

        self.generate_terrain(&mut map);

        return map;
    }

    // Generates a terrain
    fn generate_terrain(&mut self, map: &mut Map) {
        const TERRAIN_THRESHOLD: f64 = 0.45;
        const SOIL_DIRT_THRESHOLD: f64 = 0.175;

        // Noise to differentiate between terrain / empty
        let terrain_noise_fn = Turbulence::new(&self.level)
            .set_seed(self.config.seed as u32)
            .set_frequency(0.02)
            .set_power(20.0)
            .set_roughness(3);

        // Noise to differentiate between soil types
        let terrain_type_noise_fn = Fbm::new()
            .set_seed((self.config.seed + 1) as u32)
            .set_octaves(5)
            .set_persistence(0.5)
            .set_lacunarity(1.0)
            .set_frequency(0.05);

        // Noise to shade terrain near border
        let terrain_border_noise_fn = Fbm::new()
            .set_seed((self.config.seed + 2) as u32)
            .set_octaves(3)
            .set_persistence(0.8)
            .set_lacunarity(1.5)
            .set_frequency(0.25);

        // Noise to shade terrain inside
        let terrain_inside_noise_fn = Fbm::new()
            .set_seed((self.config.seed + 3) as u32)
            .set_octaves(6)
            .set_persistence(0.7)
            .set_lacunarity(1.25)
            .set_frequency(0.25);

        for x in 0..self.config.size {
            for y in 0..self.config.size {
                let point = [x as f64, y as f64];

                // Sample noise value for given point
                let terrain = terrain_noise_fn.get(point);
                let terrain_type = terrain_type_noise_fn.get(point);
                let terrain_border = terrain_border_noise_fn.get(point);
                let terrain_inside = terrain_inside_noise_fn.get(point);

                // Determine element
                let element = match (terrain, terrain_type) {
                    // Empty element
                    (t, _) if t > TERRAIN_THRESHOLD => Element::Empty,
                    // Soil: Dirt element
                    (_, t) if t < SOIL_DIRT_THRESHOLD => Element::SoilDirt,
                    // Soil: Rock element
                    _ => Element::SoilRock,
                };

                // Determine noise to shade element
                let noise = match (terrain, terrain_type) {
                    // Empty element has 0 noise
                    (t, _) if t > TERRAIN_THRESHOLD => 0,
                    // Shade border
                    (t, _) if t > 0.0 => match terrain_border {
                        r if r >= 0.4 => 20,
                        r if r >= 0.0 => 10,
                        _ => 0,
                    },
                    // Shade inside
                    _ => match terrain_inside {
                        r if r >= 0.6 => 10,
                        _ => 0,
                    },
                };

                // Create a pixel and insert it into the map
                let pixel = map.create_pixel_with_noise(element, noise);
                map.insert_pixel(Vec2::new(x, y), &pixel);
            }
        }

        self.generate_grass(map);
    }

    // Generates grass
    fn generate_grass(&mut self, map: &mut Map) {
        const GRASS_HEIGHT: i32 = 3;
        const GRASS_HEIGHT_PROB: f64 = 0.1;

        // Noise to place grass
        let grass_noise_fn = Fbm::new()
            .set_seed((self.config.seed + 3) as u32)
            .set_octaves(5)
            .set_persistence(0.5)
            .set_lacunarity(0.3)
            .set_frequency(0.5);

        let place_grass = |map: &mut Map, x: i32, y: i32, h: i32| {
            let grass_noise = grass_noise_fn.get([x as f64, y as f64]);

            if grass_noise < h as f64 * GRASS_HEIGHT_PROB {
                return false;
            }

            let noise = match grass_noise {
                n if n >= 0.4 => 20,
                n if n >= 0.2 => 10,
                _ => 0,
            };

            let pixel = map.create_pixel_with_noise(Element::Grass, noise);
            map.insert_pixel(Vec2::new(x, y), &pixel);

            return true;
        };

        for x in 0..self.config.size {
            for y in 0..self.config.size {

                let pixel = map.pixel(x, y);
                let bottom_pixel = map.pixel(x, y + 1);

                match (pixel.element(), bottom_pixel.element()) {
                    (Element::Empty, Element::SoilDirt) => {
                        place_grass(map, x, y + 1, 0);

                        for h in 0..GRASS_HEIGHT {
                            if !place_grass(map, x, y - h, h) {
                                break;
                            }
                        }
                    },
                    _ => {},
                }
            }
        }
    }
}

// Number of cells for level data
const LEVEL_SIZE: usize = 8;

// Number of pixels for noise gradient between empty and solid cells
const LEVEL_NOISE_GRADIENT: f64 = 10.0;

static LEVEL: [[char; LEVEL_SIZE]; LEVEL_SIZE] = [
    ['#', '#', '#', '#', '#', '#', '#', '#'],
    ['#', '#', '#', ' ', ' ', '#', '#', '#'],
    ['#', ' ', ' ', ' ', ' ', ' ', ' ', '#'],
    ['#', '#', ' ', ' ', '#', ' ', '#', '#'],
    ['#', '#', ' ', '#', '#', '#', '#', ' '],
    ['#', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ['#', ' ', ' ', ' ', '#', ' ', ' ', '#'],
    ['#', '#', '#', '#', '#', '#', '#', '#'],
];

#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum LevelCellType {
    Empty = 0,
    Solid = 1,
}

pub struct Level {
    cells: [LevelCellType; LEVEL_SIZE * LEVEL_SIZE],
    // How big the cell is in pixels
    cell_size: i32,
}

impl Level {
    // Creates a new level from level data in form of 2D char array
    pub fn new(data: [[char; LEVEL_SIZE]; LEVEL_SIZE],
               cell_size: i32) -> Level {

        let mut cells = [Solid; LEVEL_SIZE * LEVEL_SIZE];

        for y in 0..LEVEL_SIZE {
            for x in 0..LEVEL_SIZE {
                cells[y * LEVEL_SIZE + x] = match data[y][x] {
                    '#' => Solid,
                    _ => Empty,
                }
            }
        }

        Level { cells, cell_size }
    }

    pub fn cell(&self, x: i32, y: i32) -> Option<LevelCellType> {
        if x < 0 || x >= LEVEL_SIZE as i32 || y < 0 || y >= LEVEL_SIZE as i32 {
            return None;
        }

        return Some(self.cells[(x + y * LEVEL_SIZE as i32) as usize]);
    }
}

impl Level {
    // Returns the noise for the given cell
    // For Solid cells -> 0.0
    // for Other cells -> 1.0
    fn cell_noise(&self, cell_x: i32, cell_y: i32) -> Option<f64> {
        return match self.cell(cell_x, cell_y) {
            Some(cell) => match cell {
                Solid => Some(0.0),
                _ => Some(1.0),
            },
            None => None,
        }
    }

    // Returns relative position for cell including noise gradient
    // If cell_size = 32, noise_gradient = 8 and map_position is 60, then position is 4
    fn position(&self, map_position: f64) -> f64 {
        let half_cell_size = self.cell_size as f64 / 2.0;
        let position = (map_position % self.cell_size as f64) - half_cell_size;
        let border = half_cell_size - LEVEL_NOISE_GRADIENT;

        if position >= border {
            return position - border;
        }

        if position <= -border {
            return position + border;
        }

        return 0.0;
    }
}

// Level can be viewed as 2D noise function
impl NoiseFn<[f64; 2]> for Level {
    // Returns noise for given point
    fn get(&self, point: [f64; 2]) -> f64 {
        // Converts the point to level cell
        let (cell_x, cell_y) = (
            point[0] as i32 / self.cell_size,
            point[1] as i32 / self.cell_size
        );

        // Finds a point position in the cell including the noise gradient
        let (position_x, position_y) = (
            self.position(point[0]),
            self.position(point[1]),
        );

        // Finds direction to the closest neighbour cell
        let (direction_x, direction_y) = (
            if position_x > 0.0 {1} else {-1},
            if position_y > 0.0 {1} else {-1},
        );

        // Gets the noise for given cell
        let current_noise = match self.cell_noise(cell_x, cell_y) {
            Some(x) => x,
            None => 0.0
        };

        // Gets the noise for neighbour cell in x direction
        let next_noise_x = match self.cell_noise(cell_x + direction_x, cell_y) {
            Some(noise) => noise,
            None => current_noise,
        };

        // Gets the noise for neighbour cell in y direction
        let next_noise_y = match self.cell_noise(cell_x, cell_y + direction_y) {
            Some(noise) => noise,
            None => current_noise,
        };

        // Gets the noise for neighbour cell in both x and y directions
        let next_noise_xy = match self.cell_noise(
            cell_x + direction_x, cell_y + direction_y) {
            Some(noise) => noise,
            None => current_noise,
        };

        // Computes which neighbour noise to use and how much take it
        let (next_noise, alpha) = match (next_noise_x, next_noise_y, next_noise_xy) {
            // If there are both 1 in neighbour noise on x and y, take the one the point is closer to
            (nx, ny, _) if nx == 1.0 && ny == 1.0 => {
                (next_noise_x, position_x.abs().max(position_y.abs()) / LEVEL_NOISE_GRADIENT)
            },
            // If there is only one 1 noise in neighbour, take it
            (nx, ny, _) if nx == 1.0 && ny == 0.0 => {
                (next_noise_x, position_x.abs() / LEVEL_NOISE_GRADIENT)
            },
            (nx, ny, _) if nx == 0.0 && ny == 1.0 => {
                (next_noise_y, position_y.abs() / LEVEL_NOISE_GRADIENT)
            },
            // If there is only 1 noise in diagonal neighbour, take it
            (_, _, nxy) if nxy == 1.0 => {
                (next_noise_xy, position_x.abs().min(position_y.abs()) / LEVEL_NOISE_GRADIENT)
            },
            // Otherwise, take current noise
            (_, _, _) => (current_noise, 0.0),
        };

        return match self.cell(cell_x, cell_y) {
            Some(cell) => match cell {
                Solid => {
                    // Lerp current noise to the neighbour noise according to alpha
                    lerp(current_noise, next_noise, alpha)
                },
                _ => current_noise,
            },
            None => current_noise
        };
    }
}

#[allow(dead_code)]
fn map_noise_u8(noise: f64) -> u8 {
    (noise.max(0.0) * u8::max_value() as f64) as u8
}

pub fn lerp(a: f64, b: f64, alpha: f64) -> f64 {
    return a * (1.0 - alpha) + b * alpha;
}