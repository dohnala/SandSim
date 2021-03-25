use crate::map::{MapApi, MoveContext, MoveResult};
use crate::math::{Vec2, sign};
use crate::pixel::{LiquidPixelState, Pixel, Movable, ToPixel};
use crate::element::Element;

// Function to update all liquid pixels
pub fn update_liquid(pixel: &mut LiquidPixelState, api: &mut MapApi) {
    api.add_velocity(pixel, api.gravity());
    api.move_by_velocity(pixel,move_liquid);

    spread(pixel, api);
}

// Function to move a solid pixel
fn move_liquid(pixel: &mut LiquidPixelState,
               contact: &mut Pixel,
               api: &mut MapApi,
               context: &MoveContext) -> MoveResult {

    match contact {
        // If there is an empty pixel in the movement path, we just go through it
        Pixel::Empty(contact_pixel) => {
            // Try to displace adjacent pixels
            api.displace(context.last_valid_dir + Vec2::new(-1, 0));
            api.displace(context.last_valid_dir + Vec2::new(1, 0));

            if context.last_move {
                api.set_falling(pixel, true);
                return MoveResult::SWAP {dir: context.dir};
            } else {
                // Apply air resistance when falling
                if context.first_move && pixel.falling() {
                    api.set_velocity(pixel, Vec2::new(
                        pixel.velocity().x * (1f32 - contact_pixel.properties.friction),
                        pixel.velocity().y));
                }

                return MoveResult::CONTINUE;
            }
        },
        Pixel::Static(contact_pixel) => {
            if context.depth > 0 {
                api.set_falling(pixel, false);
                return MoveResult::STOP;
            }

            let direction = handle_solid_collision(
                pixel,
                contact_pixel.properties.friction,
                false,
                api);

            return api.move_by_direction(pixel, false,
                                         direction, context, move_liquid);
        },
        Pixel::Solid(contact_pixel) => {
            if contact_pixel.absorbed_liquid() == Element::Empty {
                contact_pixel.set_absorbed_liquid(pixel.element);
                api.set_pixel(context.dir, &contact_pixel.to_pixel(), true);
                api.set_falling(pixel, contact_pixel.falling());
                return MoveResult::REMOVE;
            } else {
                if context.depth > 0 {
                    api.set_falling(pixel, contact_pixel.falling());
                    return MoveResult::STOP;
                }

                let direction = if contact_pixel.falling() {
                    handle_solid_collision(
                        pixel,
                        contact_pixel.properties.friction,
                        contact_pixel.falling(),
                        api)
                } else {
                    handle_liquid_collision(pixel, api)
                };

                return api.move_by_direction(pixel, contact_pixel.falling(),
                                              direction, context, move_liquid);
            }
        },
        Pixel::Liquid(contact_pixel) => {
            if context.depth > 0 {
                api.set_falling(pixel, contact_pixel.falling());
                return MoveResult::STOP;
            }

            let direction = handle_solid_collision(
                pixel,
                contact_pixel.properties.friction,
                contact_pixel.falling(),
                api);

            return api.move_by_direction(pixel, contact_pixel.falling(),
                                         direction, context, move_liquid);
        },
    }
}

fn handle_solid_collision(pixel: &mut LiquidPixelState,
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

fn handle_liquid_collision(pixel: &mut LiquidPixelState,
                           api: &mut MapApi) -> Vec2<i32> {
    // TODO - make this constants configurable
    api.set_velocity(pixel, Vec2::new(pixel.velocity().x / 5f32, 1f32));

    return api.direction(pixel);
}

// Spread around
fn spread(pixel: &mut LiquidPixelState, api: &mut MapApi) {
    if pixel.falling() || api.removed() {
        return;
    }

    let dir_x = match api.random().rand(&[0.5f32, 0.5f32]) {
        0 => -1,
        _ => 1,
    };

    let dirs = [
        Vec2::new(0, 1),
        Vec2::new(dir_x, 1),
        Vec2::new(-dir_x, 1),
        Vec2::new(dir_x, 0),
        Vec2::new(-dir_x, 0),
    ];

    for dir in dirs.iter() {
        if spread_dir(pixel, *dir, api) {
            return;
        }
    }
}

// Spreads the absorbed liquid in given direction
fn spread_dir(pixel: &mut LiquidPixelState, dir: Vec2<i32>, api: &mut MapApi) -> bool {
    match api.pixel(dir) {
        Pixel::Empty(_) => {
            api.insert_pixel(Vec2::new(0, 0), Element::Empty);
            api.set_pixel(dir, &pixel.to_pixel(), true);

            // Try to displace adjacent pixels
            api.displace(dir + Vec2::new(-1, 0));
            api.displace(dir + Vec2::new(1, 0));

            return true
        },
        _ => return false,
    }
}