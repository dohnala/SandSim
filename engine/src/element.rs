use wasm_bindgen::prelude::*;
use crate::map::{MapApi, EMPTY_PIXEL_STATE, PixelState, MoveContext, MoveResult};

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
            Element::Sand => update_movable_solid(pixel, api),
        }
    }
}

// Function to update all movable solid pixels (sand, dirt, salt, ...)
fn update_movable_solid(pixel: &mut PixelState, api: &mut MapApi) {
    api.add_velocity(pixel, api.gravity());
    api.move_by_velocity(pixel, move_solid);
}

// Function to move a solid pixel
fn move_solid(pixel: &mut PixelState, api: &mut MapApi, context: &MoveContext) -> MoveResult {
    match context.contact.element() {
        // If there is an empty pixel in the movement path, we just go through it and
        // in the last move we swap the pixels
        Element::Empty => {
            if context.last_move {
                api.set_pixel(0, 0, &EMPTY_PIXEL_STATE);
                api.set_pixel(context.x, context.y, pixel);
                MoveResult::STOP
            } else {
                MoveResult::CONTINUE
            }
        },
        // If there is anything solid in the movement path
        _ => {
            // First update the velocity to the average
            api.set_velocity(pixel,
                             (pixel.velocity_y() + context.contact.velocity_y()) / 2f32);

            // If this is first move in the path, take a random horizontal direction
            // and try to move there
            if context.first_move {
                let rand_x = match api.rand(&[0.5, 0.5]) {
                    0 => -1,
                    _ => 1,
                };

                return api.move_by_direction(
                    pixel, rand_x, 0, context, move_solid)
            } else {
                // Otherwise, move to the last valid position and stop the movement
                api.set_pixel(0, 0, &EMPTY_PIXEL_STATE);
                api.set_pixel(context.last_valid_x, context.last_valid_y, pixel);
                MoveResult::STOP
            }
        }
    }
}