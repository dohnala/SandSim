extern crate js_sys;
extern crate wasm_bindgen;

mod element;

use wasm_bindgen::prelude::*;
use crate::element::Element;

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

impl Pixel {
    pub fn new(element: Element) -> Pixel {
        Pixel {
            element,
            ra: 0,
            rb: 0,
            rc: 0,
        }
    }
}

static EMPTY_PIXEL: Pixel = Pixel {
    element: Element::Empty,
    ra: 0,
    rb: 0,
    rc: 0,
};

#[wasm_bindgen]
pub struct Map {
    width: i32,
    height: i32,
    pixels: Vec<Pixel>,
}

#[wasm_bindgen]
impl Map {
    pub fn new(width: i32, height: i32) -> Map {
        let pixels = (0..width * height)
            .map(|i| {
                Pixel::new(Element::Empty)
            })
            .collect();

        Map {
            width,
            height,
            pixels
        }
    }

    pub fn paint(&mut self, x: i32, y: i32, element: Element) {
        if self.get_pixel(x, y).element == Element::Empty || element == Element::Empty {
            let index = self.get_index(x, y);

            self.pixels[index] = Pixel {
                element,
                ra: 0,
                rb: 0,
                rc: 0,
            }
        }
    }

    pub fn reset(&mut self) {
        for x in 0..self.width {
            for y in 0..self.height {
                let index = self.get_index(x, y);
                self.pixels[index] = EMPTY_PIXEL;
            }
        }
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
}