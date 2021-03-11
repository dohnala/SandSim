use std::ops::{Add, Sub, Mul, Div};
use num_traits::Num;

#[repr(C)]
#[derive(Clone, Copy, PartialEq, Debug)]
pub struct Vec2<T> {
    pub x: T,
    pub y: T,
}

impl<T: Num + Copy> Vec2<T> {
    pub fn new(x: T, y: T) -> Vec2<T> {
        Vec2 {x, y}
    }
}

impl<T: Num + Copy> Add for Vec2<T> {
    type Output = Vec2<T>;

    fn add(self, other: Vec2<T>) -> Vec2<T> {
        Vec2 {
            x: self.x + other.x,
            y: self.y + other.y,
        }
    }
}

impl<T: Num + Copy> Sub for Vec2<T> {
    type Output = Vec2<T>;

    fn sub(self, other: Vec2<T>) -> Vec2<T> {
        Vec2 {
            x: self.x - other.x,
            y: self.y - other.y,
        }
    }
}

impl<T: Num + Copy> Mul<T> for Vec2<T> {
    type Output = Vec2<T>;

    fn mul(self, factor: T) -> Vec2<T> {
        Vec2 {
            x: self.x * factor,
            y: self.y * factor,
        }
    }
}

impl<T: Num + Copy> Div<T> for Vec2<T> {
    type Output = Vec2<T>;

    fn div(self, factor: T) -> Vec2<T> {
        Vec2 {
            x: self.x / factor,
            y: self.y / factor,
        }
    }
}

pub struct Move {
    current: Vec2<i32>,
    target: Vec2<i32>,
    step_y: i32,
    first: bool,
    last: bool,
}

impl Iterator for Move {
    type Item = Vec2<i32>;

    fn next(&mut self) -> Option<Self::Item> {
        if (self.first || self.last) && self.current == self.target {
            return None;
        }

        self.current = self.current + Vec2::new(0, self.step_y);
        self.first = false;

        if self.current == self.target {
            self.last = true;
        }

        return Some(self.current);
    }
}

// Returns an iterator of all moves from given position to given position
pub fn path(from: Vec2<i32>, to: Vec2<i32>) -> Move {
    let diff_y = to.y - from.y;
    let step_y = if diff_y > 0 {1} else {-1};

    Move {current: from, target: to, step_y, first: true, last: false}
}