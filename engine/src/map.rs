use wasm_bindgen::prelude::*;
use crate::element::Element;

/// Represents a pixel of given element on the map
#[wasm_bindgen]
#[repr(C)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct Pixel {
    element: Element,
    // the struct must have 4 bytes
    // empty registers so far, which can be used later
    ra: u8,
    rb: u8,
    clock: u8,
}

impl Pixel {
    /// Creates a new pixel with given element
    pub fn new(element: Element) -> Pixel {
        Pixel {
            element,
            ra: 0,
            rb: 0,
            clock: 0,
        }
    }

    /// Updates a pixel
    fn update(&self, api: MapApi) {
        self.element.update(*self, api);
    }

    pub fn element(&self) -> Element {
        self.element
    }
}

pub static EMPTY_PIXEL: Pixel = Pixel {
    element: Element::Empty,
    ra: 0,
    rb: 0,
    clock: 0,
};

/// Represents a map of given width and height composed of pixels
#[wasm_bindgen]
pub struct Map {
    width: i32,
    height: i32,
    pixels: Vec<Pixel>,
    generation: u8
}

#[wasm_bindgen]
impl Map {
    /// Creates a new empty map with given width and height
    pub fn new(width: i32, height: i32) -> Map {
        let pixels = (0..width * height)
            .map(|_i| {
                Pixel::new(Element::Empty)
            })
            .collect();

        Map {
            width,
            height,
            pixels,
            generation: 0
        }
    }

    /// Inserts a new pixel of given element at x,y
    pub fn insert(&mut self, x: i32, y: i32, element: Element) {
        if self.get_pixel(x, y).element() == Element::Empty || element == Element::Empty {
            let index = self.get_index(x, y);

            self.pixels[index] = Pixel {
                element,
                ra: 0,
                rb: 0,
                clock: self.generation,
            }
        }
    }

    /// Clears the map so its empty
    pub fn clear(&mut self) {
        for x in 0..self.width {
            for y in 0..self.height {
                let index = self.get_index(x, y);
                self.pixels[index] = EMPTY_PIXEL;
            }
        }
    }

    /// Simulates a tick and process all pixels
    pub fn tick(&mut self) {
        for x in 0..self.width {
            // process width from different side each time
            let scanx = if self.generation % 2 == 0 {
                self.width - (1 + x)
            } else {
                x
            };

            for y in 0..self.height {
                let pixel = self.get_pixel(scanx, y);

                Map::update_pixel(
                    pixel,
                    MapApi {
                        map: self,
                        x: scanx,
                        y,
                    },
                );
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

    pub fn pixels(&self) -> *const Pixel {
        self.pixels.as_ptr()
    }
}

impl Map {
    fn get_index(&self, x: i32, y: i32) -> usize {
        (x + (y * self.width)) as usize
    }

    fn get_pixel(&self, x: i32, y: i32) -> Pixel {
        let i = self.get_index(x, y);
        return self.pixels[i];
    }

    fn update_pixel(pixel: Pixel, api: MapApi) {
        if pixel.clock - api.map.generation == 1 {
            return;
        }

        pixel.update(api);
    }
}

/// Map API which pixels can use to define its behavior
pub struct MapApi<'a> {
    x: i32,
    y: i32,
    map: &'a mut Map,
}

impl<'a> MapApi<'a> {
    /// Returns a pixel in direction (dx, dy) relative to current pixel
    pub fn get_pixel(&mut self, dx: i32, dy: i32) -> Pixel {
        let nx = self.x + dx;
        let ny = self.y + dy;

        if nx < 0 || nx > self.map.width - 1 || ny < 0 || ny > self.map.height - 1 {
            return Pixel {
                element: Element::Wall,
                ra: 0,
                rb: 0,
                clock: self.map.generation,
            };
        }

        self.map.get_pixel(nx, ny)
    }

    /// Sets a pixel at to a direction (dx, dy) relative to current pixel
    pub fn set_pixel(&mut self, dx: i32, dy: i32, pixel: Pixel) {
        let nx = self.x + dx;
        let ny = self.y + dy;

        if nx < 0 || nx > self.map.width - 1 || ny < 0 || ny > self.map.height - 1 {
            return;
        }

        let index = self.map.get_index(nx, ny);
        self.map.pixels[index] = pixel;
        self.map.pixels[index].clock = self.map.generation.wrapping_add(1);
    }
}