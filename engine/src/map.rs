extern crate console_error_panic_hook;

use wasm_bindgen::prelude::*;
use crate::element::Element;
use crate::rand::Random;

// Represents a read-only pixel on the map
#[wasm_bindgen]
#[repr(C)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct Pixel {
    element: Element,
    // the struct must have 4 bytes
    // empty registers so far, which can be used later
    ra: u8,
    rb: u8,
    rc: u8,
}

#[wasm_bindgen]
impl Pixel {
    // Creates a new pixel with given element
    pub fn new(element: Element) -> Pixel {
        Pixel {
            element,
            ra: 0,
            rb: 0,
            rc: 0,
        }
    }

    pub fn element(&self) -> Element {
        self.element
    }
}

// Represents pixel state on the map
#[wasm_bindgen]
#[repr(C)]
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct PixelState {
    element: Element,
    velocity_y: f32,
    // used to determine if the pixel was updated during a tick
    clock_flag: bool,
}

#[wasm_bindgen]
impl PixelState {
    // Creates a new pixel state
    pub fn new(element: Element) -> PixelState {
        PixelState {
            element,
            velocity_y: 0f32,
            clock_flag: false,
        }
    }

    pub fn element(&self) -> Element {
        self.element
    }

    pub fn velocity_y(&self) -> f32 {
        self.velocity_y
    }

    pub fn clock_flag(&self) -> bool {
        self.clock_flag
    }
}

impl PixelState {
    fn set_velocity_y(&mut self, velocity: f32) {
        self.velocity_y = velocity;
    }
}

static EMPTY_PIXEL: Pixel = Pixel {
    element: Element::Empty,
    ra: 0,
    rb: 0,
    rc: 0,
};

pub static EMPTY_PIXEL_STATE: PixelState = PixelState {
    element: Element::Empty,
    velocity_y: 0f32,
    clock_flag: false,
};

pub static WALL_PIXEL_STATE: PixelState = PixelState {
    element: Element::Wall,
    velocity_y: 0f32,
    clock_flag: false,
};

// Represents a map configuration
#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct MapConfig {
    width: i32,
    height: i32,
    gravity: f32,
    max_velocity: f32,
    seed: u16,
}

#[wasm_bindgen]
impl MapConfig {
    pub fn new(width: i32, height: i32, gravity: f32, max_velocity: f32, seed: u16) -> MapConfig {
        MapConfig {
            width,
            height,
            gravity,
            max_velocity,
            seed,
        }
    }
}

// Represents a map composed of pixels
#[wasm_bindgen]
pub struct Map {
    config: MapConfig,
    pixels: Vec<Pixel>,
    pixel_states: Vec<PixelState>,
    generation: u8,
    // used to determine which pixels were updated during a tick
    clock_flag: bool,
    random: Random,
}

#[wasm_bindgen]
impl Map {
    // Creates a new empty map with given config
    pub fn new(config: MapConfig) -> Map {
        console_error_panic_hook::set_once();

        let pixels = (0..config.width * config.height)
            .map(|_i| {
                EMPTY_PIXEL
            })
            .collect();

        let pixel_states = (0..config.width * config.height)
            .map(|_i| {
                EMPTY_PIXEL_STATE
            })
            .collect();

        let random = Random::new(config.seed);

        Map {
            config,
            pixels,
            pixel_states,
            generation: 0,
            clock_flag: false,
            random,
        }
    }

    // Inserts a new pixels of given element in radius from x,y
    pub fn insert(&mut self, x: i32, y: i32, element: Element, radius: i32) {
        for i in -radius..=radius {
            for j in -radius..=radius {
                if i*i + j*j <= radius*radius {
                    self.insert_pixel(x+i, y+j, element);
                }
            }
        }
    }

    // Clears the map so its empty
    pub fn clear(&mut self) {
        self.generation = 0;
        self.clock_flag = false;

        for x in 0..self.config.width {
            for y in 0..self.config.height {
                let index = self.index(x, y);
                self.pixels[index] = EMPTY_PIXEL;
                self.pixel_states[index] = EMPTY_PIXEL_STATE;
            }
        }
    }

    // Simulates a tick and process all pixels
    pub fn tick(&mut self) {
        self.clock_flag = !self.clock_flag;

        for x in 0..self.config.width {
            // process pixels from bottom
            for y in (0..self.config.height).rev() {
                // process rows from different side each tick
                let scan_x = if self.generation % 2 == 0 {
                    self.config.width - (1 + x)
                } else {
                    x
                };

                Map::update_pixel(
                    &mut self.pixel_state(scan_x, y),
                    &mut MapApi::new(scan_x, y, self));
            }
        }

        self.generation = self.generation.wrapping_add(1);
    }

    pub fn width(&self) -> i32 {
        self.config.width
    }

    pub fn height(&self) -> i32 {
        self.config.height
    }

    pub fn generation(&self) -> u8 {
        self.generation
    }

    pub fn pixels(&self) -> *const Pixel {
        self.pixels.as_ptr()
    }

    pub fn pixel(&self, x: i32, y: i32) -> Pixel {
        let i = self.index(x, y);
        return self.pixels[i];
    }

    pub fn pixel_state(&self, x: i32, y: i32) -> PixelState {
        let i = self.index(x, y);
        return self.pixel_states[i];
    }
}

impl Map {
    fn index(&self, x: i32, y: i32) -> usize {
        (x + (y * self.config.width)) as usize
    }

    fn update_pixel(pixel: &mut PixelState, api: &mut MapApi) {
        if Map::can_update(pixel, api) {
            pixel.clock_flag = api.map.clock_flag;
            Element::update(pixel, api);
        }
    }

    // Return true if a pixel can be updated
    fn can_update(pixel: &mut PixelState, api: &MapApi) -> bool {
        match pixel.element {
            // TODO: replace with static flag
            Element::Empty => false,
            Element::Wall => false,
            _ => pixel.clock_flag() != api.map.clock_flag
        }
    }

    // Inserts a new pixel of given element at x,y
    fn insert_pixel(&mut self, x: i32, y: i32, element: Element) {
        if self.pixel_state(x, y).element() == Element::Empty || element == Element::Empty {
            let index = self.index(x, y);

            self.pixels[index] = Pixel::new(element);
            self.pixel_states[index] = PixelState {
                element,
                velocity_y: 0f32,
                clock_flag: self.clock_flag,
            };
        }
    }
}

// Map API which pixels can use to define its behavior
pub struct MapApi<'a> {
    x: i32,
    y: i32,
    map: &'a mut Map,
}

impl<'a> MapApi<'a> {
    // Creates a new Map api for pixel at x, y
    pub fn new(x: i32, y: i32, map: &'a mut Map) -> MapApi {
        MapApi {
            x,
            y,
            map,
        }
    }

    pub fn gravity(&self) -> f32 {
        return self.map.config.gravity;
    }

    // Adds velocity to given pixel
    pub fn add_velocity(&mut self, pixel: &mut PixelState, velocity: f32) {
        self.set_velocity(pixel, pixel.velocity_y + velocity);
    }

    // Adds velocity to given pixel
    pub fn set_velocity(&mut self, pixel: &mut PixelState, velocity: f32) {
        pixel.set_velocity_y(velocity.clamp(
            -self.map.config.max_velocity, self.map.config.max_velocity));
    }

    // Returns a pixel in direction (dx, dy) relative to current pixel
    pub fn pixel(&mut self, dx: i32, dy: i32) -> PixelState {
        let nx = self.x + dx;
        let ny = self.y + dy;

        if nx < 0 || nx > self.map.config.width - 1 || ny < 0 || ny > self.map.config.height - 1 {
            return WALL_PIXEL_STATE;
        }

        self.map.pixel_state(nx, ny)
    }

    // Sets a pixel at to a direction (dx, dy) relative to current pixel
    pub fn set_pixel(&mut self, dx: i32, dy: i32, pixel: &PixelState) {
        let nx = self.x + dx;
        let ny = self.y + dy;

        if nx < 0 || nx > self.map.config.width - 1 || ny < 0 || ny > self.map.config.height - 1 {
            return;
        }

        let index = self.map.index(nx, ny);

        self.map.pixels[index] = Pixel::new(pixel.element);
        self.map.pixel_states[index] = *pixel;
    }

    // Compute a path in the map of the pixel according to its velocity and pass that context
    // to given function which should do the actual movement across the path and should return
    // whether the movement should continue or stop
    pub fn move_by_velocity(&mut self,
                            pixel: &mut PixelState,
                            move_f: fn(&mut PixelState, &mut MapApi, &MoveContext) -> MoveResult) {
        let sign_y = if pixel.velocity_y() > 0f32 {1} else {-1};
        let velocity_y = (pixel.velocity_y().abs()) as i32;

        // Keep track of last valid position during the movement
        let last_valid_x = 0;
        let mut last_valid_y = 0;

        if velocity_y >= 1 {
            for y in 1..=velocity_y {
                let contact = self.pixel(0, y * sign_y);

                let result = move_f(pixel, self, &MoveContext::new(
                    0,
                    y * sign_y,
                    &contact,
                    y == 1,
                    y == velocity_y,
                    last_valid_x,
                    last_valid_y));

                match result {
                    MoveResult::STOP => break,
                    MoveResult::CONTINUE => {
                        // Update last valid position with a new place
                        last_valid_y = y * sign_y;
                        continue
                    }
                }
            }
        } else {
            // Update itself so the changes of velocity, ... are stored
            self.set_pixel(0, 0, pixel);
        }
    }

    // Move to a neighbor position using given unit direction and pass a new context
    // to given function which should do the actual movement
    //
    // This can only be called inside move function where the move context is available
    pub fn move_by_direction(&mut self,
                             pixel: &mut PixelState,
                             direction_x: i32,
                             direction_y: i32,
                             context: &MoveContext,
                             move_f: fn(&mut PixelState,
                                        &mut MapApi,
                                        &MoveContext) -> MoveResult) -> MoveResult {
        let contact = self.pixel(
            context.x + direction_x,
            context.y + direction_y);

        return move_f(pixel, self, &MoveContext::new(
            context.x + direction_x,
            context.y + direction_y,
            &contact,
            false,
            true,
            context.last_valid_x,
            context.last_valid_y));
    }

    // Returns random index from given probability distribution
    pub fn rand(&mut self, distribution: &[f32]) -> usize {
        let mut random = self.map.random.next();

        for (i, prob) in distribution.iter().enumerate() {
            if random <= *prob {
                return i;
            } else {
                random -= prob;
            }
        }

        distribution.len() - 1
    }
}

pub struct MoveContext<'a> {
    pub x: i32,
    pub y: i32,
    pub contact: &'a PixelState,
    pub first_move: bool,
    pub last_move: bool,
    pub last_valid_x: i32,
    pub last_valid_y: i32,
}

impl<'a> MoveContext<'a> {
    pub fn new(x: i32,
               y: i32,
               contact: &PixelState,
               first_move: bool,
               last_move: bool,
               last_valid_x: i32,
               last_valid_y: i32) -> MoveContext {
        MoveContext {
            x, y, contact, first_move, last_move, last_valid_x, last_valid_y
        }
    }
}

pub enum MoveResult {
    CONTINUE,
    STOP
}