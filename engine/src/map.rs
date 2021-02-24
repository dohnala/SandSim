extern crate console_error_panic_hook;

use wasm_bindgen::prelude::*;
use crate::element::Element;

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

static EMPTY_PIXEL: Pixel = Pixel {
    element: Element::Empty,
    ra: 0,
    rb: 0,
    rc: 0,
};

// Represents pixel state on the map
#[wasm_bindgen]
#[repr(C)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct PixelState {
    element: Element,
    clock: u8,
}

#[wasm_bindgen]
impl PixelState {
    // Creates a new pixel state
    pub fn new(element: Element) -> PixelState {
        PixelState {
            element,
            clock: 0,
        }
    }

    // Updates a pixel
    fn update(&self, api: MapApi) {
        self.element.update(*self, api);
    }

    pub fn element(&self) -> Element {
        self.element
    }

    pub fn clock(&self) -> u8 {
        self.clock
    }
}

pub static EMPTY_PIXEL_STATE: PixelState = PixelState {
    element: Element::Empty,
    clock: 0,
};

// Represents a map of given width and height composed of pixels
#[wasm_bindgen]
pub struct Map {
    width: i32,
    height: i32,
    pixels: Vec<Pixel>,
    pixel_states: Vec<PixelState>,
    generation: u8
}

#[wasm_bindgen]
impl Map {
    // Creates a new empty map with given width and height
    pub fn new(width: i32, height: i32) -> Map {
        console_error_panic_hook::set_once();

        let pixels = (0..width * height)
            .map(|_i| {
                EMPTY_PIXEL
            })
            .collect();

        let pixel_states = (0..width * height)
            .map(|_i| {
                EMPTY_PIXEL_STATE
            })
            .collect();

        Map {
            width,
            height,
            pixels,
            pixel_states,
            generation: 0
        }
    }

    // Inserts a new pixel of given element at x,y
    pub fn insert(&mut self, x: i32, y: i32, element: Element) {
        if self.get_pixel_state(x, y).element() == Element::Empty || element == Element::Empty {
            let index = self.get_index(x, y);

            self.pixels[index] = Pixel {
                element,
                ra: 0,
                rb: 0,
                rc: 0,
            };

            self.pixel_states[index] = PixelState {
                element,
                clock: self.generation,
            }
        }
    }

    // Clears the map so its empty
    pub fn clear(&mut self) {
        self.generation = 0;

        for x in 0..self.width {
            for y in 0..self.height {
                let index = self.get_index(x, y);
                self.pixels[index] = EMPTY_PIXEL;
                self.pixel_states[index] = EMPTY_PIXEL_STATE
            }
        }
    }

    // Simulates a tick and process all pixels
    pub fn tick(&mut self) {
        for x in 0..self.width {
            // process pixels from bottom
            for y in (0..self.height).rev() {
                // process rows from different side each tick
                let scan_x = if self.generation % 2 == 0 {
                    self.width - (1 + x)
                } else {
                    x
                };

                Map::update_pixel(
                    self.get_pixel_state(scan_x, y),
                    MapApi::new(scan_x, y, self));
            }
        }

        self.generation = self.generation.wrapping_add(1);
    }

    pub fn width(&self) -> i32 {
        self.width
    }

    pub fn height(&self) -> i32 {
        self.height
    }

    pub fn generation(&self) -> u8 {
        self.generation
    }

    pub fn pixels(&self) -> *const Pixel {
        self.pixels.as_ptr()
    }

    pub fn get_pixel(&self, x: i32, y: i32) -> Pixel {
        let i = self.get_index(x, y);
        return self.pixels[i];
    }

    pub fn get_pixel_state(&self, x: i32, y: i32) -> PixelState {
        let i = self.get_index(x, y);
        return self.pixel_states[i];
    }
}

impl Map {
    fn get_index(&self, x: i32, y: i32) -> usize {
        (x + (y * self.width)) as usize
    }

    fn update_pixel(pixel_state: PixelState, api: MapApi) {
        if pixel_state.clock.wrapping_sub(api.map.generation) == 1 {
            return;
        }

        pixel_state.update(api);
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
            map
        }
    }

    // Returns a pixel in direction (dx, dy) relative to current pixel
    pub fn get_pixel(&mut self, dx: i32, dy: i32) -> PixelState {
        let nx = self.x + dx;
        let ny = self.y + dy;

        if nx < 0 || nx > self.map.width - 1 || ny < 0 || ny > self.map.height - 1 {
            return PixelState {
                element: Element::Wall,
                clock: self.map.generation,
            };
        }

        self.map.get_pixel_state(nx, ny)
    }

    // Sets a pixel at to a direction (dx, dy) relative to current pixel
    pub fn set_pixel(&mut self, dx: i32, dy: i32, pixel: PixelState) {
        let nx = self.x + dx;
        let ny = self.y + dy;

        if nx < 0 || nx > self.map.width - 1 || ny < 0 || ny > self.map.height - 1 {
            return;
        }

        let index = self.map.get_index(nx, ny);

        self.map.pixels[index] = Pixel::new(pixel.element);
        self.map.pixel_states[index] = pixel;
        self.map.pixel_states[index].clock = self.map.generation.wrapping_add(1);
    }

    pub fn rand_dir(&self) -> i32 {
        let rnd = self.map.generation.wrapping_add((self.x + self.y) as u8);

        if (rnd & 1 << 7) == 0 { -1 } else { 1 }
    }
}