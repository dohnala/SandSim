use crate::map::{MapApi, MoveContext, MoveResult};
use crate::math::{Vec2, sign};
use crate::pixel::{SolidPixelState, Pixel, Movable, ToPixel};
use crate::element::Element;

// Function to update all solid pixels
pub fn update_solid(pixel: &mut SolidPixelState, api: &mut MapApi) {
    api.add_velocity(pixel, api.gravity());
    api.move_by_velocity(pixel,move_solid);

    spread_absorbed_liquid(pixel, api);
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
            api.displace(context.last_valid_dir + Vec2::new(-1, 0));
            api.displace(context.last_valid_dir + Vec2::new(1, 0));

            if context.last_move {
                api.set_falling(pixel, true);
                MoveResult::SWAP { dir: context.dir }
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
                                         direction, context, move_solid);
        },
        Pixel::Solid(contact_pixel) => {
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
                                         direction, context, move_solid);
        },
        Pixel::Liquid(contact_pixel) => {
            if context.depth > 0 {
                // Try to displace adjacent pixels
                api.displace(context.last_valid_dir + Vec2::new(-1, 0));
                api.displace(context.last_valid_dir + Vec2::new(1, 0));
                api.set_falling(pixel, true);

                if pixel.absorbed_liquid() == Element::Empty {
                    pixel.set_absorbed_liquid(contact_pixel.element);
                    return MoveResult::REPLACE { dir: context.dir };
                } else {
                    return MoveResult::SWAP { dir: context.dir };
                }
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

            return api.move_by_direction(pixel, true,
                                         direction, context, move_solid)
        },
    }
}

fn handle_solid_collision(pixel: &mut SolidPixelState,
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

fn handle_liquid_collision(pixel: &mut SolidPixelState, api: &mut MapApi) -> Vec2<i32> {
    // TODO - make this constants configurable
    api.set_velocity(pixel, Vec2::new(pixel.velocity().x / 5f32, 1f32));

    return api.direction(pixel);
}

// Spread absorbed liquid around
fn spread_absorbed_liquid(pixel: &mut SolidPixelState, api: &mut MapApi) {
    if pixel.falling() || api.removed() || pixel.absorbed_liquid() == Element::Empty {
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
        if spread_absorbed_liquid_dir(pixel, *dir, api) {
            return;
        }
    }
}

// Spreads the absorbed liquid in given direction
fn spread_absorbed_liquid_dir(pixel: &mut SolidPixelState,
                              dir: Vec2<i32>,
                              api: &mut MapApi) -> bool {
    match api.pixel(dir) {
        Pixel::Empty(_) => {
            api.insert_pixel(dir, pixel.absorbed_liquid());
            pixel.set_absorbed_liquid(Element::Empty);
            api.set_pixel(Vec2::new(0, 0), &pixel.to_pixel(), true);

            // Try to displace adjacent pixels
            api.displace(dir + Vec2::new(-1, 0));
            api.displace(dir + Vec2::new(1, 0));

            return true;
        },
        Pixel::Solid(mut other) => {
            if other.absorbed_liquid() == Element::Empty {
                other.set_absorbed_liquid(pixel.absorbed_liquid());
                api.set_pixel(dir, &other.to_pixel(), true);
                pixel.set_absorbed_liquid(Element::Empty);
                api.set_pixel(Vec2::new(0, 0), &pixel.to_pixel(), true);
                return true;
            } else {
                return false;
            }
        },
        _ => {
            return false;
        },
    }
}