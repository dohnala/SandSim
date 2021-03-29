use wasm_bindgen::prelude::*;
use crate::element::{Element, EmptyProperties, StaticProperties, SolidProperties, LiquidProperties};
use crate::math::Vec2;
use crate::map::MapApi;
use crate::solid::update_solid;
use crate::liquid::update_liquid;

// Represents an information about single pixel which is used for displaying
// The struct size has to be exactly 32 bytes, so the array of these structs can
// be used as RGBA texture which is an input to a fragment shader
// All properties defined here can be used in the shader to determine pixel color
#[wasm_bindgen]
#[repr(C)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct PixelDisplayInfo {
    pub element: Element,
    // Pixel::Solid or Pixel::Liquid => noise
    pub ra: u8,
    // Pixel::Solid => surrounded_liquid
    pub rb: u8,
    pub  rc: u8,
}

impl PixelDisplayInfo {
    // Creates a new pixel display info from given pixel
    pub fn new(pixel: &Pixel) -> PixelDisplayInfo {
        let noise = match pixel {
            Pixel::Solid(state) => state.noise,
            _ => 0,
        };

        let surrounded_liquid = match pixel {
            Pixel::Solid(state) => state.absorbed_liquid as u8,
            _ => 0,
        };

        PixelDisplayInfo {
            element: pixel.element(),
            ra: noise,
            rb: surrounded_liquid,
            rc: 0
        }
    }
}

// Represents an information about state of pixel
#[wasm_bindgen]
#[repr(C)]
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct PixelInfo {
    pub element: Element,
    pub friction: Option<f32>,
    pub restitution: Option<f32>,
    pub inertia: Option<f32>,
    pub velocity_x: Option<f32>,
    pub velocity_y: Option<f32>,
    pub falling: Option<bool>,
    pub not_moved_count: Option<u8>,
    pub absorbed_liquid: Option<Element>,
}

impl PixelInfo {
    // Creates a new pixel info from given pixel
    pub fn new(pixel: &Pixel) -> PixelInfo {
        let friction = match pixel {
            Pixel::Empty(state) => Some(state.properties.friction),
            Pixel::Static(state) => Some(state.properties.friction),
            Pixel::Solid(state) => Some(state.properties.friction),
            Pixel::Liquid(state) => Some(state.properties.friction),
        };

        let restitution = match pixel {
            Pixel::Solid(state) => Some(state.properties.restitution),
            Pixel::Liquid(state) => Some(state.properties.restitution),
            _ => None,
        };

        let inertia = match pixel {
            Pixel::Solid(state) => Some(state.properties.inertia),
            Pixel::Liquid(state) => Some(state.properties.inertia),
            _ => None,
        };

        let velocity_x = match pixel {
            Pixel::Solid(state) => Some(state.velocity.x),
            Pixel::Liquid(state) => Some(state.velocity.x),
            _ => None,
        };

        let velocity_y = match pixel {
            Pixel::Solid(state) => Some(state.velocity.y),
            Pixel::Liquid(state) => Some(state.velocity.y),
            _ => None,
        };

        let falling = match pixel {
            Pixel::Solid(state) => Some(state.falling),
            Pixel::Liquid(state) => Some(state.falling),
            _ => None,
        };

        let not_moved_count = match pixel {
            Pixel::Solid(state) => Some(state.not_moved_count),
            Pixel::Liquid(state) => Some(state.not_moved_count),
            _ => None,
        };

        let absorbed_liquid = match pixel {
            Pixel::Solid(state) => Some(state.absorbed_liquid),
            _ => None,
        };

        PixelInfo {
            element: pixel.element(),
            friction,
            restitution,
            inertia,
            velocity_x,
            velocity_y,
            falling,
            not_moved_count,
            absorbed_liquid,
        }
    }
}

// Represents a pixel and its state
#[derive(Clone, Copy, Debug, PartialEq)]
pub enum Pixel {
    Empty(EmptyPixelState),
    Static(StaticPixelState),
    Solid(SolidPixelState),
    Liquid(LiquidPixelState)
}

#[derive(Clone, Copy, Debug, PartialEq)]
pub struct EmptyPixelState {
    pub element: Element,
    pub properties: &'static EmptyProperties,
}

impl EmptyPixelState {
    pub fn new(element: Element, properties: &'static EmptyProperties) -> EmptyPixelState {
        EmptyPixelState {element, properties}
    }
}

#[derive(Clone, Copy, Debug, PartialEq)]
pub struct StaticPixelState {
    pub element: Element,
    pub properties: &'static StaticProperties,
}

impl StaticPixelState {
    pub fn new(element: Element, properties: &'static StaticProperties) -> StaticPixelState {
        StaticPixelState {element, properties}
    }
}

#[derive(Clone, Copy, Debug, PartialEq)]
pub struct SolidPixelState {
    pub element: Element,
    pub properties: &'static SolidProperties,
    // Velocity controls the movement of pixel
    velocity: Vec2<f32>,
    velocity_threshold: Vec2<f32>,
    // Number of updates the pixel did not moved
    not_moved_count: u8,
    // Flag to determine if a pixel is falling due to gravity
    falling: bool,
    // Used to determine if the pixel was updated during a tick
    clock: u8,
    // Random noise in [0..255] used for some effects
    noise: u8,
    // Liquid element this pixel absorbed
    absorbed_liquid: Element,
}

impl SolidPixelState {
    pub fn new(element: Element,
               properties: &'static SolidProperties,
               velocity: Vec2<f32>,
               noise: u8) -> SolidPixelState {
        SolidPixelState {
            element,
            properties,
            velocity,
            velocity_threshold: Vec2::new(0f32, 0f32),
            not_moved_count: 0,
            falling: true,
            clock: 0,
            noise,
            absorbed_liquid: Element::Empty,
        }
    }

    pub fn absorbed_liquid(&self) -> Element {
        return self.absorbed_liquid;
    }

    pub fn set_absorbed_liquid(&mut self, liquid: Element) {
        self.absorbed_liquid = liquid;
    }
}

#[derive(Clone, Copy, Debug, PartialEq)]
pub struct LiquidPixelState {
    pub element: Element,
    pub properties: &'static LiquidProperties,
    // Velocity controls the movement of pixel
    velocity: Vec2<f32>,
    velocity_threshold: Vec2<f32>,
    // Number of updates the pixel did not moved
    not_moved_count: u8,
    // Flag to determine if a pixel is falling due to gravity
    falling: bool,
    // Used to determine if the pixel was updated during a tick
    clock: u8,
    // Random noise in [0..255] used for some effects
    noise: u8,
}

impl LiquidPixelState {
    pub fn new(element: Element,
               properties: &'static LiquidProperties,
               velocity: Vec2<f32>,
               noise: u8) -> LiquidPixelState {
        LiquidPixelState {
            element,
            properties,
            velocity,
            velocity_threshold: Vec2::new(0f32, 0f32),
            not_moved_count: 0,
            falling: true,
            clock: 0,
            noise,
        }
    }
}

impl Pixel {
    // Update given pixel according to the type
    pub fn update(&mut self, api: &mut MapApi) {
        match self {
            Pixel::Empty(_) => {},
            Pixel::Static(_) => {},
            Pixel::Solid(pixel) => update_solid(pixel, api),
            Pixel::Liquid(pixel) => update_liquid(pixel, api),
        }
    }

    pub fn element(&self) -> Element {
        match self {
            Pixel::Empty(pixel) => pixel.element,
            Pixel::Static(pixel) => pixel.element,
            Pixel::Solid(pixel) => pixel.element,
            Pixel::Liquid(pixel) => pixel.element,
        }
    }
}

// Trait used to convert a type to pixel
pub trait ToPixel {
    fn to_pixel(&self) -> Pixel;
}

// Trait which can be implemented by pixels which should be updated
pub trait Updatable {
    // Clock is used to synchronize updates so a pixel is not updated multiple times
    // during one physics tick
    fn set_clock(&mut self, clock: u8);
    fn clock(&self) -> u8;
}

// Trait which can be implemented by pixels which supports movement
pub trait Movable {
    // Velocity controls the movement of pixel
    fn set_velocity(&mut self, velocity: Vec2<f32>);
    fn velocity(&self) -> Vec2<f32>;

    // Velocity threshold is a float number in [0..1] range which is used when absolute velocity
    // value is less then 1, where this value acts like a accumulating threshold which when
    // reaches 1, its reset and pixel moves by one pixel
    fn set_velocity_threshold(&mut self, velocity_threshold: Vec2<f32>);
    fn velocity_threshold(&self) -> Vec2<f32>;

    // Number of updates the pixel did not moved
    fn set_not_moved_count(&mut self, not_moved_count: u8);
    fn not_moved_count(&self) -> u8;

    // Flag to determine if a pixel is falling due to gravity
    fn set_falling(&mut self, falling: bool);
    fn falling(&self) -> bool;
}

impl ToPixel for EmptyPixelState {
    fn to_pixel(&self) -> Pixel {
        Pixel::Empty(*self)
    }
}

impl ToPixel for StaticPixelState {
    fn to_pixel(&self) -> Pixel {
        Pixel::Static(*self)
    }
}

impl ToPixel for SolidPixelState {
    fn to_pixel(&self) -> Pixel {
        Pixel::Solid(*self)
    }
}

impl ToPixel for LiquidPixelState {
    fn to_pixel(&self) -> Pixel {
        Pixel::Liquid(*self)
    }
}

impl Updatable for SolidPixelState {
    fn set_clock(&mut self, clock: u8) {
        self.clock = clock;
    }

    fn clock(&self) -> u8 {
        self.clock
    }
}

impl Updatable for LiquidPixelState {
    fn set_clock(&mut self, clock: u8) {
        self.clock = clock;
    }

    fn clock(&self) -> u8 {
        self.clock
    }
}

impl Movable for SolidPixelState {
    fn set_velocity(&mut self, velocity: Vec2<f32>) {
        self.velocity = velocity;
    }

    fn velocity(&self) -> Vec2<f32> {
        self.velocity
    }

    fn set_velocity_threshold(&mut self, velocity_threshold: Vec2<f32>) {
        self.velocity_threshold = velocity_threshold;
    }

    fn velocity_threshold(&self) -> Vec2<f32> {
        self.velocity_threshold
    }

    fn set_not_moved_count(&mut self, not_moved_count: u8) {
        self.not_moved_count = not_moved_count;
    }

    fn not_moved_count(&self) -> u8 {
        self.not_moved_count
    }

    fn set_falling(&mut self, falling: bool) {
        self.falling = falling;
    }

    fn falling(&self) -> bool {
        self.falling
    }
}

impl Movable for LiquidPixelState {
    fn set_velocity(&mut self, velocity: Vec2<f32>) {
        self.velocity = velocity;
    }

    fn velocity(&self) -> Vec2<f32> {
        self.velocity
    }

    fn set_velocity_threshold(&mut self, velocity_threshold: Vec2<f32>) {
        self.velocity_threshold = velocity_threshold;
    }

    fn velocity_threshold(&self) -> Vec2<f32> {
        self.velocity_threshold
    }

    fn set_not_moved_count(&mut self, not_moved_count: u8) {
        self.not_moved_count = not_moved_count;
    }

    fn not_moved_count(&self) -> u8 {
        self.not_moved_count
    }

    fn set_falling(&mut self, falling: bool) {
        self.falling = falling;
    }

    fn falling(&self) -> bool {
        self.falling
    }
}