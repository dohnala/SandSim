use wasm_bindgen::prelude::*;
use crate::map::{MapApi, PixelState, MoveContext, MoveResult};

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
    api.activate_when_moved(pixel);
}

// Function to move a solid pixel
fn move_solid(pixel: &mut PixelState, api: &mut MapApi, context: &MoveContext) -> MoveResult {
    match context.contact.element() {
        // If there is an empty pixel in the movement path, we just go through it
        Element::Empty => {
            if context.last_move {
                api.set_falling(pixel, true);
                MoveResult::MOVE {x: context.x, y: context.y}
            } else {
                MoveResult::CONTINUE
            }
        },
        // If there is anything solid in the movement path
        _ => {
            // If the pixel run into the solid pixel change its velocity to the average of
            // its velocity and velocity of the pixel under it
            api.set_velocity(pixel,(pixel.velocity_y() + context.contact.velocity_y()) / 2f32);

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
                // Otherwise, move to the last valid position
                api.set_falling(pixel, false);
                MoveResult::MOVE {x: context.last_valid_x, y: context.last_valid_y}
            }
        }
    }
}