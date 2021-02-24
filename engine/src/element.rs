use wasm_bindgen::prelude::*;
use crate::map::{MapApi, EMPTY_PIXEL_STATE, PixelState};

// Represent an element of a pixel
#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Element {
    Empty = 0,
    Wall = 1,
    Sand = 2,
}

impl Element {
    // Update given pixel according to the element
    pub fn update(&self, pixel: PixelState, api: MapApi) {
        match self {
            Element::Empty => update_static(pixel, api),
            Element::Wall => update_static(pixel, api),
            Element::Sand => update_sand(pixel, api),
        }
    }
}

// STATIC OBJECTS
fn update_static(pixel: PixelState, mut api: MapApi) {
    api.set_pixel(0, 0, pixel);
}


// SAND
fn update_sand(pixel: PixelState, mut api: MapApi) {
    let dx = api.rand_dir();
    let down_pixel = api.get_pixel(0, 1);

    // Move down
    if down_pixel.element() == Element::Empty {
        api.set_pixel(0, 0, EMPTY_PIXEL_STATE);
        api.set_pixel(0, 1, pixel);
    }
    // Move randomly to down-left or down-right if possible
    else if api.get_pixel(-dx, 1).element() == Element::Empty {
        api.set_pixel(0, 0, EMPTY_PIXEL_STATE);
        api.set_pixel(-dx, 1, pixel);
    }
    else if api.get_pixel(dx, 1).element() == Element::Empty {
        api.set_pixel(0, 0, EMPTY_PIXEL_STATE);
        api.set_pixel(dx, 1, pixel);
    }
    // Do nothing
    else {
        api.set_pixel(0, 0, pixel);
    }
}