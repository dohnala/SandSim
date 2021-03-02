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
    pub fn update(pixel: &mut PixelState, api: &mut MapApi) {
        match pixel.element()  {
            Element::Empty => (),
            Element::Wall => (),
            Element::Sand => update_sand(pixel, api),
        }
    }
}

// SAND
fn update_sand(pixel: &mut PixelState, api: &mut MapApi) {
    let down_pixel = api.get_pixel(0, 1);

    // Move down
    if down_pixel.element() == Element::Empty {
        api.set_pixel(0, 0, &EMPTY_PIXEL_STATE);
        api.set_pixel(0, 1, pixel);
    } else {
        api.set_pixel(0, 0, pixel);
    }
}