extern crate console_error_panic_hook;

use wasm_bindgen::prelude::*;
use crate::rand::Random;
use crate::math::{Vec2, path, sign};
use crate::pixel::{*};
use crate::element::{Element, ElementType};

// Represents a square chunk in the map which can be processed independently
#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Chunk {
    x: i32,
    y: i32,
    active: bool,
    active_next_tick: bool,
}

#[wasm_bindgen]
impl Chunk {
    pub fn x(&self) -> i32 {
        self.x
    }

    pub fn y(&self) -> i32 {
        self.y
    }

    pub fn active(&self) -> bool {
        self.active
    }

    pub fn active_next_tick(&self) -> bool {
        self.active_next_tick
    }
}

impl Chunk {
    fn new(pos: Vec2<i32>) -> Chunk {
        Chunk { x: pos.x, y:pos.y, active: true, active_next_tick: true }
    }

    pub fn pos(&self) -> Vec2<i32> {
        Vec2::new(self.x, self.y)
    }
}

// Represents a map configuration
#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct MapConfig {
    pub size: i32,
    pub gravity: f32,
    pub max_velocity: f32,
    pub use_chunks: bool,
    pub chunk_size: i32,
    pub seed: u16,
}

#[wasm_bindgen]
impl MapConfig {
    pub fn new(size: i32, gravity: f32, max_velocity: f32,
               use_chunks: bool, chunk_size: i32, seed: u16) -> MapConfig {
        MapConfig {
            size,
            gravity,
            max_velocity,
            use_chunks,
            chunk_size,
            seed,
        }
    }
}

// Represents a map composed of pixels
#[wasm_bindgen]
pub struct Map {
    // Map configuration
    config: MapConfig,
    // Pixels and their states
    pixels: Vec<Pixel>,
    // Pixel information used to display the map
    display: Vec<PixelDisplayInfo>,
    // Exclusive chunks used to process pixels
    chunks: Vec<Chunk>,
    // The dimension of chunk vector
    chunk_dim: i32,
    // Used to determine which pixels were updated during a tick
    clock: u8,
    // Pseudo random generator
    random: Random,
    // How much ticks pixel does not have to move and still be updated
    not_moved_threshold: u8,
}

#[wasm_bindgen]
impl Map {
    // Creates a new map
    pub fn new(config: MapConfig) -> Map {
        console_error_panic_hook::set_once();

        let mut random = Random::new(config.seed);

        let elements: Vec<Element> = (0..config.size * config.size)
            .map(|_i| { Element::Empty })
            .collect();

        let pixels: Vec<Pixel> = (&elements)
            .into_iter()
            .map(|element| { Map::create_pixel(*element, &mut random) })
            .collect();

        let display = (&pixels)
            .into_iter()
            .map(|pixel| { PixelDisplayInfo::new(pixel) })
            .collect();

        let chunks = if config.use_chunks {
            Map::generate_chunks(config.size, config.chunk_size)
        } else { vec![] };

        let chunk_dim = if config.use_chunks {
            config.size / config.chunk_size
        } else {0};

        let not_moved_threshold = (1f32 / config.gravity).clamp(1f32, 10f32) as u8;

        Map {
            config,
            pixels,
            display,
            chunks,
            chunk_dim,
            clock: 0,
            random,
            not_moved_threshold,
        }
    }

    // Inserts a new pixels of given element in radius from x,y
    pub fn paint(&mut self, x: i32, y: i32, element: Element, radius: i32) {
        for i in -radius..=radius {
            for j in -radius..=radius {
                if i*i + j*j <= radius*radius {
                    self.paint_pixel(Vec2::new(x, y) + Vec2::new(i, j), element);
                }
            }
        }
    }

    // Clears the map so its empty
    pub fn clear(&mut self) {
        self.clock = 0;

        for x in 0..self.config.size {
            for y in 0..self.config.size {
                let index = self.pixel_index(Vec2::new(x, y));

                let pixel = Map::create_pixel(Element::Empty, &mut self.random);
                self.pixels[index] = pixel;
                self.display[index] = PixelDisplayInfo::new(&pixel)
            }
        }
    }

    // Simulates a tick and return number of processed pixels
    pub fn tick(&mut self) -> u32 {
        self.reset_chunks();
        self.clock = self.clock.wrapping_add(1);

        let processed_pixels: u32 = if self.config.use_chunks {
            self.process_chunks()
        } else {
            self.process_pixels(Vec2::new(0, 0),
                                Vec2::new(self.config.size, self.config.size))
        };

        return processed_pixels;
    }

    // Returns a config for this map
    pub fn config(&self) -> MapConfig {
        self.config
    }

    // Returns pointer to the pixel display data
    pub fn display(&self) -> *const PixelDisplayInfo {
        self.display.as_ptr()
    }

    // Returns information about pixel on given x,y
    pub fn pixel_info(&self, x: i32, y: i32) -> Option<PixelInfo> {
        let pos = Vec2::new(x, y);

        if self.out_of_bounds(pos) {
            return None;
        }

        return Some(PixelInfo::new(&self.pixels[self.pixel_index(pos)]));
    }

    // Returns number of chunks
    pub fn chunks_count(&self) -> usize {
        self.chunks.len()
    }

    // Returns ith chunk
    pub fn chunk(&self, i: usize) -> Chunk {
        self.chunks[i]
    }
}

impl Map {
    // Returns index in pixels vector for given position
    fn pixel_index(&self, pos: Vec2<i32>) -> usize {
        (pos.x + (pos.y * self.config.size)) as usize
    }

    // Returns index in chunks vector for given position
    fn chunk_index(&self, pos: Vec2<i32>) -> usize {
        (pos.x + (pos.y * self.chunk_dim)) as usize
    }

    // Returns pixel for given position
    pub fn pixel(&mut self, x: i32, y: i32) -> Pixel {
        let pos = Vec2::new(x, y);

        if self.out_of_bounds(pos) {
            return Map::create_pixel(Element::Wall, &mut self.random);
        }

        return self.pixels[self.pixel_index(pos)];
    }

    // Updates given pixel
    fn update_pixel(&mut self, x: i32, y: i32) -> bool {
        let pixel= &mut self.pixel(x, y);

        match pixel {
            Pixel::Empty(_) => false,
            Pixel::Static(_) => false,
            Pixel::Solid(state) => {
                if self.can_update(state) {
                    pixel.update(&mut MapApi::new(Vec2::new(x, y), self));
                    true
                } else {
                    false
                }
            },
            Pixel::Liquid(state) => {
                if self.can_update(state) {
                    pixel.update(&mut MapApi::new(Vec2::new(x, y), self));
                    true
                } else {
                    false
                }
            }
        }
    }

    // Returns true if given pixel can be updated
    fn can_update<T: Updatable>(&self, pixel: &mut T) -> bool {
        let allow = pixel.clock() != self.clock;

        if allow {
            pixel.set_clock(self.clock);
        }

        return allow;
    }

    // Inserts a new pixel of given element at given position
    fn paint_pixel(&mut self, pos: Vec2<i32>, element: Element) {
        if self.out_of_bounds(pos) {
            return;
        }

        let allow_paint = match self.pixel(pos.x, pos.y) {
            Pixel::Empty(_) => true,
            _ => match Element::element_type(element) {
                ElementType::Empty(_) => true,
                _ => false,
            }
        };

        if allow_paint {
            let index = self.pixel_index(pos);
            let pixel = Map::create_pixel(element, &mut self.random);

            self.pixels[index] = pixel;
            self.display[index] = PixelDisplayInfo::new(&pixel);

            self.activate_surrounding_pixels(pos);
        }
    }

    // Create new pixel from given element
    fn create_pixel(element: Element, random: &mut Random) -> Pixel {
        let noise = random.u8();

        match Element::element_type(element) {
            ElementType::Empty(properties) => Pixel::Empty(
                EmptyPixelState::new(element, properties)),
            ElementType::Static(properties) => Pixel::Static(
                StaticPixelState::new(element, properties, noise)),
            ElementType::Solid(properties) => {
                let velocity = match random.rand(&[0.5f32, 0.5f32]) {
                    0 => Vec2::new(-0.02f32, 0f32),
                    _ => Vec2::new(0.02f32, 0f32),
                };

                Pixel::Solid(SolidPixelState::new(element, properties, velocity, noise))
            },
            ElementType::Liquid(properties) => {
                let velocity = match random.rand(&[0.5f32, 0.5f32]) {
                    0 => Vec2::new(-0.02f32, 0f32),
                    _ => Vec2::new(0.02f32, 0f32),
                };

                Pixel::Liquid(LiquidPixelState::new(element, properties, velocity, noise))
            }
        }
    }

    // Generates chunks of given size for map of given size and return them
    fn generate_chunks(map_size: i32, chunk_size: i32) -> Vec<Chunk> {
        return (0..map_size).step_by(chunk_size as usize)
            .into_iter()
            .flat_map(|y| {
                return (0..map_size).step_by(chunk_size as usize)
                    .into_iter()
                    .map(move |x| {
                        Chunk::new(Vec2::new(x, y))
                    })
            })
            .collect();
    }

    // Resets chunks for next tick
    fn reset_chunks(&mut self) {
        for mut chunk in self.chunks.iter_mut() {
            chunk.active = chunk.active_next_tick;
            chunk.active_next_tick = false;
        }
    }

    // Marks a chunk for given pixel position active for next tick
    fn set_chunk_active_next_tick(&mut self, pixel_pos: Vec2<i32>) {
        if self.config.use_chunks {
            let index = self.chunk_index(pixel_pos / self.config.chunk_size);

            match self.chunks.get_mut(index) {
                Some(chunk) => {
                    chunk.active_next_tick = true
                }
                None => {}
            }
        }
    }

    // Process all active chunks and pixels they contain
    fn process_chunks(&mut self) -> u32 {
        let mut pixels = 0;

        // Process chunks from bottom
        for chunk_y in (0..self.chunk_dim).rev() {
            for chunk_x in 0..self.chunk_dim {
                // process chunks from different side each tick
                let chunk_scan_x = if self.clock % 2 == 0 {
                    self.chunk_dim - (1 + chunk_x)
                } else {
                    chunk_x
                };

                let chunk = self.chunk(self.chunk_index(
                    Vec2::new(chunk_scan_x, chunk_y)));

                if chunk.active {
                    pixels += self.process_pixels(
                        chunk.pos(),
                        chunk.pos() + Vec2::new(
                            self.config.chunk_size, self.config.chunk_size));
                }
            }
        }

        return pixels;
    }

    // Process pixels within given rectangle area
    fn process_pixels(&mut self, from: Vec2<i32>, to: Vec2<i32>) -> u32 {
        let mut pixels = 0;

        // Process pixels from bottom
        for y in (from.y..to.y).rev() {
            for x in from.x..to.x {
                // process pixels from different side each tick
                let scan_x = if self.clock % 2 == 0 {
                    from.x + to.x - (1 + x)
                } else {
                    x
                };

                pixels += self.update_pixel(scan_x, y) as u32;
            }
        }

        return pixels;
    }

    // Activates pixel on given position by activating corresponding chunk
    fn activate_pixel(&mut self, pos: Vec2<i32>) {
        if self.out_of_bounds(pos) {
            return;
        }

        self.set_chunk_active_next_tick(pos)
    }

    // Activates pixel on given position and all its surrounding pixels
    // by activating corresponding chunks
    fn activate_surrounding_pixels(&mut self, pos: Vec2<i32>) {
        for dir_x in -1..=1 {
            for dir_y in -1..=1 {
                self.activate_pixel(pos + Vec2::new(dir_x, dir_y));
            }
        }
    }

    // Return true if given position is out of bounds of the map
    fn out_of_bounds(&self, pos: Vec2<i32>) -> bool {
        return pos.x < 0 || pos.x > self.config.size - 1 || pos.y < 0 || pos.y > self.config.size - 1
    }
}

// Map API which pixels can use to define its behavior
pub struct MapApi<'a> {
    old_pos: Vec2<i32>,
    pos: Vec2<i32>,
    removed: bool,
    map: &'a mut Map,
}

impl<'a> MapApi<'a> {
    // Creates a new Map api for pixel at x, y
    pub fn new(pos: Vec2<i32>, map: &'a mut Map) -> MapApi {
        MapApi {
            old_pos: pos,
            pos,
            removed: false,
            map,
        }
    }

    // Returns random generator
    pub fn random(&mut self) -> &mut Random {
        &mut self.map.random
    }

    // Returns gravity
    pub fn gravity(&self) -> Vec2<f32> {
        return Vec2::new(0f32, self.map.config.gravity);
    }

    // Adds velocity to given pixel
    pub fn add_velocity<T: Movable>(&mut self, pixel: &mut T, velocity: Vec2<f32>) {
        self.set_velocity(pixel, pixel.velocity() + velocity);
    }

    // Sets velocity to given pixel
    pub fn set_velocity<T: Movable>(&mut self, pixel: &mut T, velocity: Vec2<f32>) {
        pixel.set_velocity(Vec2::new(
            velocity.x.clamp(-self.map.config.max_velocity, self.map.config.max_velocity),
            velocity.y.clamp(-self.map.config.max_velocity, self.map.config.max_velocity),
        ));
    }

    // Sets falling flag to given pixel
    pub fn set_falling<T: Movable>(&mut self, pixel: &mut T, falling: bool) {
        pixel.set_falling(falling);
    }

    // Returns a pixel in direction (dx, dy) relative to current pixel
    pub fn pixel(&mut self, dir: Vec2<i32>) -> Pixel {
        let new_pos = self.pos + dir;
        self.map.pixel(new_pos.x, new_pos.y)
    }

    // Sets a pixel at to a direction (dx, dy) relative to current pixel and activate it
    // if set
    pub fn set_pixel(&mut self, dir: Vec2<i32>, pixel: &Pixel, activate: bool) {
        let new_pos = self.pos + dir;

        if self.map.out_of_bounds(new_pos) {
            return;
        }

        let index = self.map.pixel_index(new_pos);

        self.map.pixels[index] = *pixel;
        self.map.display[index] = PixelDisplayInfo::new(pixel);

        if activate {
            self.activate_surrounding_pixels(dir);
        }
    }

    // Activates pixel on given relative position, so it will be processed next tick
    pub fn activate_pixel(&mut self, dir: Vec2<i32>) {
        self.map.activate_pixel(self.pos + dir)
    }

    // Activates pixel on given relative position and all its surrounding pixels
    // so they will be processed next tick
    pub fn activate_surrounding_pixels(&mut self, dir: Vec2<i32>) {
        self.map.activate_surrounding_pixels(self.pos + dir);
    }

    // Insert a new pixel of given element on given relative position
    pub fn insert_pixel(&mut self, dir: Vec2<i32>, element: Element) {
        let pixel = &Map::create_pixel(element,  &mut self.map.random);

        self.set_pixel(dir, &pixel, true);
    }

    // Returns a direction of pixel's normalized velocity
    pub fn direction<T: Movable>(&self, pixel: &T) -> Vec2<i32> {
        pixel.velocity().direction()
    }

    // Displaces a pixel on given direction according to its inertia
    pub fn displace(&mut self, dir: Vec2<i32>) {
        match  self.pixel(dir) {
            Pixel::Empty(_) => {},
            Pixel::Static(_) => {},
            Pixel::Solid(mut pixel) => {
                let inertia = pixel.properties.inertia;
                self.displace_pixel(dir, &mut pixel, inertia)
            },
            Pixel::Liquid(mut pixel) => {
                let inertia = pixel.properties.inertia;
                self.displace_pixel(dir, &mut pixel, inertia)
            },
        }
    }

    // Computes a path in the map of the pixel according to its velocity and pass that context
    // to given function which should decide what to do by providing the result
    pub fn move_by_velocity<T: Movable + ToPixel>(&mut self,
                                                  pixel: &mut T,
                                                  move_f: fn(&mut T,
                                                             &mut Pixel,
                                                             &mut MapApi,
                                                             &MoveContext) -> MoveResult) {

        let velocity_sign = Vec2::new(
            sign(pixel.velocity().x) as i32,
            sign(pixel.velocity().y) as i32);

        let velocity_size = Vec2::new(
            pixel.velocity().x.abs(),
            pixel.velocity().y.abs());

        let dir_x = if velocity_size.x < 1f32 {
            let velocity_threshold_x = pixel.velocity_threshold().x + velocity_size.x;
            let velocity_x = velocity_threshold_x as i32;
            if velocity_x > 0 {
                pixel.set_velocity_threshold(Vec2::new(0f32, pixel.velocity_threshold().y));
            } else {
                pixel.set_velocity_threshold(Vec2::new(
                    velocity_threshold_x,
                    pixel.velocity_threshold().y));
            }
            velocity_x * velocity_sign.x
        } else {
            pixel.set_velocity_threshold(Vec2::new(0f32, pixel.velocity_threshold().y));
            pixel.velocity().x as i32
        };

        let dir_y = if velocity_size.y < 1f32 {
            let velocity_threshold_y = pixel.velocity_threshold().y + velocity_size.y;
            let velocity_y = velocity_threshold_y as i32;
            if velocity_y > 0 {
                pixel.set_velocity_threshold(Vec2::new(pixel.velocity_threshold().x, 0f32));
            } else {
                pixel.set_velocity_threshold(Vec2::new(
                    pixel.velocity_threshold().x,
                    velocity_threshold_y));
            }
            velocity_y * velocity_sign.y
        } else {
            pixel.set_velocity_threshold(Vec2::new(pixel.velocity_threshold().x, 0f32));
            pixel.velocity().y as i32
        };

        let target_dir = Vec2::new(dir_x, dir_y);

        // Keep track of last valid direction during the movement
        let mut last_valid_dir = Vec2::new(0, 0);

        for (i, dir) in path(
            Vec2::new(0, 0), target_dir).enumerate() {

            let mut contact = self.pixel(dir);

            let result = move_f(pixel, &mut contact, self, &mut MoveContext::new(
                dir,
                i == 0,
                dir == target_dir,
                last_valid_dir,
                0));

            match result {
                // Continue moving along the path and update last valid direction
                MoveResult::CONTINUE => {
                    last_valid_dir = dir;
                    continue
                },
                // Finalize the movement by swapping the pixels and activating them
                MoveResult::SWAP {dir: move_dir } => {
                    if move_dir.x != 0 || move_dir.y != 0 {
                        pixel.set_not_moved_count(0);
                        self.swap(&pixel.to_pixel(), move_dir);
                        self.pos += move_dir;
                        self.activate_when_moved(pixel);
                        return;
                    } else {
                        break;
                    }
                }
                // Finalize the movement by replacing the pixel on given direction
                MoveResult::REPLACE {dir: replace_dir } => {
                    if replace_dir.x != 0 || replace_dir.y != 0 {
                        pixel.set_not_moved_count(0);
                        self.replace(&pixel.to_pixel(), replace_dir);
                        self.pos += replace_dir;
                        self.activate_when_moved(pixel);
                        return;
                    } else {
                        break;
                    }
                }
                // Removes the pixel from the map
                MoveResult::REMOVE => {
                    self.remove(Vec2::new(0, 0));
                    self.removed = true;
                    return;
                },
                MoveResult::STOP => {
                    if last_valid_dir.x != 0 || last_valid_dir.y != 0 {
                        pixel.set_not_moved_count(0);
                        self.swap(&pixel.to_pixel(), last_valid_dir);
                        self.pos += last_valid_dir;
                        self.activate_when_moved(pixel);
                        return;
                    } else {
                        break;
                    }
                },
            }
        }

        // If we did not move, increment not moved count,and update itself
        // so the changes are stored
        pixel.set_not_moved_count(pixel.not_moved_count() + 1);
        if pixel.not_moved_count() >= self.map.not_moved_threshold {
            pixel.set_not_moved_count(self.map.not_moved_threshold);
        }
        self.set_pixel(Vec2::new(0, 0), &pixel.to_pixel(), false);

        self.activate_when_moved(pixel);
    }

    // Moves to a neighbor position using given unit direction and pass a new context
    // to given function which should do the actual movement
    //
    // This can only be called inside move function where the move context is available
    pub fn move_by_direction<T: Movable>(&mut self,
                                         pixel: &mut T,
                                         contact_falling: bool,
                                         dir: Vec2<i32>,
                                         context: &MoveContext,
                                         move_f: fn(&mut T,
                                                    &mut Pixel,
                                                    &mut MapApi,
                                                    &MoveContext) -> MoveResult) -> MoveResult {
        // Try to move diagonally according to direction
        if dir.x != 0 && dir.y != 0 {
            match self._move_by_direction(pixel, contact_falling, dir, context, move_f) {
                MoveResult::STOP => {},
                result=> {
                    return result;
                }
            }
        }

        // Try to vertically according to direction
        if dir.y != 0 {
            match self._move_by_direction(pixel, contact_falling, Vec2::new(0, dir.y), context, move_f) {
                MoveResult::STOP => {},
                result=> {
                    return result;
                }
            }
        }

        // Try to move horizontally according to direction
        if dir.x != 0 {
            match self._move_by_direction(pixel, contact_falling, Vec2::new(dir.x, 0), context, move_f) {
                MoveResult::STOP => {},
                result=> {
                    return result;
                }
            }
        }

        // Stop the movement
        self.set_falling(pixel, contact_falling);
        return MoveResult::STOP;
    }

    // Returns whether the pixel has moved
    pub fn moved<T: Movable + ToPixel>(&self, pixel: &T) -> bool {
        if self.old_pos.x != self.pos.x || self.old_pos.y != self.pos.y {
            true
        } else {
            pixel.not_moved_count() < self.map.not_moved_threshold
        }
    }

    // Returns whether the pixel has been removed
    pub fn removed(&self) -> bool {
        self.removed
    }

    // Displaces given pixel on given direction according given inertia
    fn displace_pixel<T: Movable + ToPixel>(&mut self, dir: Vec2<i32>, pixel: &mut T, inertia: f32) {
        // Pixel which is falling cannot be displaced
        if pixel.falling() {
            return;
        }

        let displace = match self.random().rand(
            &[inertia, 1f32 - inertia]) {
            0 => false,
            _ => true,
        };

        if displace {
            // Reset not moved count
            pixel.set_not_moved_count(0);

            // Generate small velocity on x if its zero
            if pixel.velocity().x < 1f32 {
                let displace_velocity_x = self.random().f32_range(-1f32, 1f32);
                pixel.set_velocity(pixel.velocity() + Vec2::new(displace_velocity_x, 0f32));
            }

            self.set_pixel(dir, &pixel.to_pixel(), true);
        }
    }
}
impl<'a> MapApi<'a> {
    // Swaps given pixel with pixel on given direction
    fn swap(&mut self, pixel: &Pixel, dir: Vec2<i32>) {

        // Swap the pixels and activate them
        let target_pixel = self.pixel(dir);

        self.set_pixel(Vec2::new(0, 0), &target_pixel, true);
        self.set_pixel(dir, pixel, true);
    }

    // Replaces the pixel on given direction
    fn replace(&mut self, pixel: &Pixel, dir: Vec2<i32>) {
        self.remove(Vec2::new(0, 0));
        self.set_pixel(dir, pixel, true);
    }

    // Removes the pixel from given direction
    fn remove(&mut self, dir: Vec2<i32>) {
        self.insert_pixel(dir,Element::Empty);
    }

    // Activates a pixel when falling or has moved, so it is processed next frame
    fn activate_when_moved<T: Movable + ToPixel>(&mut self, pixel: &mut T) {
        if pixel.falling() || self.moved(pixel) {
            self.activate_pixel(Vec2::new(0, 0));
        }
    }

    fn _move_by_direction<T: Movable>(&mut self,
                                      pixel: &mut T,
                                      contact_falling: bool,
                                      dir: Vec2<i32>,
                                      context: &MoveContext,
                                      move_f: fn(&mut T,
                                                 &mut Pixel,
                                                 &mut MapApi,
                                                 &MoveContext) -> MoveResult) -> MoveResult {
        let mut contact = self.pixel(context.last_valid_dir + dir);

        let result = move_f(pixel, &mut contact, self, &MoveContext::new(
            context.last_valid_dir + dir,
            false,
            true,
            context.last_valid_dir,
            context.depth + 1));

        match result {
            // Set falling flag if can move on y, otherwise according to contact
            MoveResult::CONTINUE | MoveResult::SWAP { dir: _ } | MoveResult::REPLACE { dir: _ } => {
                self.set_falling(pixel, if dir.y == 0 { contact_falling } else { true });
                return result;
            },
            // Remove falling flag if removed
            MoveResult::REMOVE => {
                self.set_falling(pixel, false);
                return result;
            }
            // Remove falling flag if stopped
            MoveResult::STOP => {
                self.set_falling(pixel, if dir.y == 0 { contact_falling } else { true });

                if dir.y == 0 {
                    // Change velocity direction on x
                    self.set_velocity(pixel, Vec2::new(
                        pixel.velocity().x * -1f32, pixel.velocity().y));
                }
                return result;
            }
        }
    }
}

pub struct MoveContext<> {
    pub dir: Vec2<i32>,
    pub first_move: bool,
    pub last_move: bool,
    pub last_valid_dir: Vec2<i32>,
    pub depth: u8,
}

impl MoveContext {
    pub fn new(dir: Vec2<i32>,
               first_move: bool,
               last_move: bool,
               last_valid_dir: Vec2<i32>,
               depth: u8) -> MoveContext {
        MoveContext { dir, first_move, last_move, last_valid_dir, depth }
    }
}

pub enum MoveResult {
    // Continue moving
    CONTINUE,
    // Stop moving and return to the last valid direction
    STOP,
    // Swap the pixel with pixel in given direction
    SWAP {dir: Vec2<i32>},
    // Replace the pixel on given direction
    REPLACE {dir: Vec2<i32>},
    // Removes pixel
    REMOVE,
}