use crate::map::{MapApi, MoveContext, MoveResult};
use crate::math::{Vec2, sign};
use crate::pixel::{SolidPixelState, Pixel, Movable};

// Function to update all solid pixels
pub fn update_solid(pixel: &mut SolidPixelState, api: &mut MapApi) {
    api.add_velocity(pixel, api.gravity());
    api.move_by_velocity(pixel,move_solid);
    api.activate_when_moved(pixel);
}

// Function to move a solid pixel
fn move_solid(pixel: &mut SolidPixelState,
              contact: &mut Pixel,
              api: &mut MapApi,
              context: &MoveContext) -> MoveResult {

    match contact {
        // If there is an empty pixel in the movement path, we just go through it
        Pixel::Empty(contact_pixel) => {
            // Try to displace adjacent pixels
            api.displace(context.last_valid_pos + Vec2::new(-1, 0));
            api.displace(context.last_valid_pos + Vec2::new(1, 0));

            if context.last_move {
                api.set_falling(pixel, true);
                MoveResult::MOVE {pos: context.pos}
            } else {
                // Apply air resistance when falling
                if context.first_move && pixel.falling() {
                    api.set_velocity(pixel, Vec2::new(
                        pixel.velocity().x * (1f32 - contact_pixel.properties.friction),
                        pixel.velocity().y));
                }

                MoveResult::CONTINUE
            }
        },
        Pixel::Static(contact_pixel) => {
            if context.depth > 0 {
                return MoveResult::STOP;
            }

            let direction = handle_collision(
                pixel,
                contact_pixel.properties.friction,
                false,
                api);

            return move_by_direction(pixel, false,direction, api, context);
        },
        Pixel::Solid(contact_pixel) => {
            if context.depth > 0 {
                return MoveResult::STOP;
            }

            let direction = handle_collision(
                pixel,
                contact_pixel.properties.friction,
                contact_pixel.falling(),
                api);

            return move_by_direction(pixel, contact_pixel.falling(), direction, api, context);
        },
    }
}

fn handle_collision(pixel: &mut SolidPixelState,
                    contact_friction: f32,
                    contact_falling: bool,
                    api: &mut MapApi) -> Vec2<i32> {
    // Transfer portion of y velocity to the x velocity according to its restitution
    if pixel.falling() {
        let velocity_x = sign(pixel.velocity().x) * pixel.velocity().y.abs() *
            pixel.properties.restitution;

        api.set_velocity(pixel, Vec2::new(
            if velocity_x.abs() > pixel.velocity().x.abs() {velocity_x} else {pixel.velocity().x},
            pixel.velocity().y));
    }

    // Compute normalized direction the pixel is moving to
    let direction = api.direction(pixel);

    api.set_velocity(pixel, Vec2::new(
        // Apply friction
        pixel.velocity().x * (1f32 - pixel.properties.friction) * (1f32 - contact_friction),
        // Set velocity to 1 if pixel is not falling
        if contact_falling { pixel.velocity().y } else { 1f32 }));

    return direction;
}

fn move_by_direction(pixel: &mut SolidPixelState,
                     contact_falling: bool,
                     direction: Vec2<i32>,
                     api: &mut MapApi,
                     context: &MoveContext) -> MoveResult {
    // Try to move diagonally according to direction
    if direction.x != 0 && direction.y != 0 {
        match api.move_by_direction(pixel, direction, context, move_solid) {
            MoveResult::MOVE { pos } => {
                api.set_falling(pixel, true);
                return MoveResult::MOVE {pos};
            }
            _ => {},
        }
    }

    // Try to vertically according to direction
    if direction.y != 0 {
        match api.move_by_direction(pixel, Vec2::new(0, direction.y), context, move_solid) {
            MoveResult::MOVE { pos } => {
                api.set_falling(pixel, true);
                return MoveResult::MOVE { pos };
            }
            _ => {},
        }
    }

    // Try to move horizontally according to direction
    if direction.x != 0 {
        match api.move_by_direction(pixel, Vec2::new(direction.x, 0), context, move_solid) {
            MoveResult::MOVE { pos } => {
                api.set_falling(pixel, contact_falling);
                return MoveResult::MOVE {pos}
            }
            _ => {
                // Change velocity direction on x
                api.set_velocity(pixel, Vec2::new(
                    pixel.velocity().x * -1f32, pixel.velocity().y));
            },
        }
    }

    api.set_falling(pixel, contact_falling);
    return MoveResult::STOP;
}