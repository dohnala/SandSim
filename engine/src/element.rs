use wasm_bindgen::prelude::*;

// These are all supported elements and their properties defined in static read-only memory

pub static EMPTY: ElementType = ElementType::Empty(EmptyProperties {
    friction: 0.1f32,
});

pub static WALL: ElementType = ElementType::Static(StaticProperties {
    friction: 0.5f32,
});

pub static SAND: ElementType = ElementType::Solid(SolidProperties {
    friction: 0.2f32,
    restitution: 0.2f32,
    inertia: 0.1f32,
});

pub static DIRT: ElementType = ElementType::Solid(SolidProperties {
    friction: 0.4f32,
    restitution: 0.125f32,
    inertia: 0.8f32,
});

pub static WATER: ElementType = ElementType::Liquid(LiquidProperties {
    friction: 0f32,
    restitution: 1f32,
    inertia: 0f32,
});

// Represents an element as an simple unsigned byte number, which can be used in wasm
#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Element {
    Empty = 0,
    Wall = 1,
    Sand = 2,
    Dirt = 3,
    Water = 4,
}

impl Element {
    // Returns a reference to a an element type which defined all properties for given element
    pub fn element_type(element: Element) -> &'static ElementType {
        match element {
            Element::Empty => &EMPTY,
            Element::Wall => &WALL,
            Element::Sand => &SAND,
            Element::Dirt => &DIRT,
            Element::Water => &WATER,
        }
    }
}

#[derive(Clone, Copy, Debug, PartialEq)]
pub enum ElementType {
    Empty(EmptyProperties),
    Static(StaticProperties),
    Solid(SolidProperties),
    Liquid(LiquidProperties),
}

#[derive(Clone, Copy, Debug, PartialEq)]
pub struct EmptyProperties {
    // How much the velocity is reduced during the movement [0..1]
    // 0 means no friction is applies, so the velocity is not reduced
    // 1 means that the velocity is reduced to zero and object will not move
    pub friction: f32,
}

#[derive(Clone, Copy, Debug, PartialEq)]
pub struct StaticProperties {
    // How much the velocity is reduced during the movement [0..1]
    // 0 means no friction is applies, so the velocity is not reduced
    // 1 means that the velocity is reduced to zero and object will not move
    pub friction: f32,
}

#[derive(Clone, Copy, Debug, PartialEq)]
pub struct SolidProperties {
    // How much the velocity is reduced during the movement [0..1]
    // 0 means no friction is applies, so the velocity is not reduced
    // 1 means that the velocity is reduced to zero and object will not move
    pub friction: f32,

    // How much velocity is preserved after the collision [0..1]
    // 0 means that no velocity is preserved
    // 1 means that all velocity is preserved
    pub restitution: f32,

    // Resistance to change in velocity [0..1]
    // 0 means that there is no resistance
    // 1 means that there is maximum resistance and the element will not move by applying
    // any external force
    pub inertia: f32,
}

#[derive(Clone, Copy, Debug, PartialEq)]
pub struct LiquidProperties {
    // How much the velocity is reduced during the movement [0..1]
    // 0 means no friction is applies, so the velocity is not reduced
    // 1 means that the velocity is reduced to zero and object will not move
    pub friction: f32,

    // How much velocity is preserved after the collision [0..1]
    // 0 means that no velocity is preserved
    // 1 means that all velocity is preserved
    pub restitution: f32,

    // Resistance to change in velocity [0..1]
    // 0 means that there is no resistance
    // 1 means that there is maximum resistance and the element will not move by applying
    // any external force
    pub inertia: f32,
}

