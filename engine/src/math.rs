use std::ops::{Add, Sub, Mul, Div, AddAssign, SubAssign, MulAssign, DivAssign};
use num_traits::{Num, NumAssign};
use std::iter::Skip;

#[repr(C)]
#[derive(Clone, Copy, PartialEq, Debug)]
pub struct Vec2<T> {
    pub x: T,
    pub y: T,
}

impl<T> Vec2<T> {
    pub fn new(x: T, y: T) -> Vec2<T> {
        Vec2 {x, y}
    }
}

impl<T: Num> Add for Vec2<T> {
    type Output = Vec2<T>;

    fn add(self, rhs: Vec2<T>) -> Vec2<T> {
        Vec2::new(self.x + rhs.x, self.y + rhs.y)
    }
}

impl<T: Num + NumAssign> AddAssign for Vec2<T> {
    fn add_assign(&mut self, rhs: Self) {
        self.x += rhs.x;
        self.y += rhs.y
    }
}

impl<T: Num> Sub for Vec2<T> {
    type Output = Vec2<T>;

    fn sub(self, rhs: Vec2<T>) -> Vec2<T> {
        Vec2::new(self.x - rhs.x, self.y - rhs.y)
    }
}

impl<T: Num + SubAssign> SubAssign for Vec2<T> {
    fn sub_assign(&mut self, rhs: Self) {
        self.x -= rhs.x;
        self.y -= rhs.y
    }
}

impl<T: Num + Copy> Mul<T> for Vec2<T> {
    type Output = Vec2<T>;

    fn mul(self, rhs: T) -> Vec2<T> {
        Vec2::new(self.x * rhs, self.y * rhs)
    }
}

impl<T: Num + MulAssign + Copy> MulAssign<T> for Vec2<T> {
    fn mul_assign(&mut self, rhs: T) {
        self.x *= rhs;
        self.y *= rhs
    }
}

impl<T: Num + Copy> Div<T> for Vec2<T> {
    type Output = Vec2<T>;

    fn div(self, rhs: T) -> Vec2<T> {
        Vec2::new(self.x / rhs, self.y / rhs)
    }
}

impl<T: Num + DivAssign + Copy> DivAssign<T> for Vec2<T> {
    fn div_assign(&mut self, rhs: T) {
        self.x /= rhs;
        self.y /= rhs
    }
}

impl Vec2<f32> {
    pub fn magnitude(&self) -> f32 {
        (self.x * self.x + self.y * self.y).sqrt()
    }

    pub fn normalize(&self) -> Vec2<f32> {
        let mag = self.magnitude();

        if mag > 0f32 {
            Vec2::new(self.x / mag, self.y / mag)
        } else {
            Vec2::new(self.x, self.y)
        }
    }

    pub fn direction(&self) -> Vec2<i32> {
        let normalized = self.normalize();

        let x = if normalized.x > 0.1f32 {1} else if normalized.x < -0.1f32 {-1} else {0};
        let y = if normalized.y > 0.1f32 {1} else if normalized.y < -0.1f32 {-1} else {0};

        Vec2::new(x, y)
    }
}

pub fn sign(value: f32) -> f32 {
    if value > 0f32 {1f32} else if value < 0f32 {-1f32} else {0f32}
}

pub struct Move {
    current: Vec2<i32>,
    step: i32,
    gradient_step: i32,
    gradient_acc: i32,
    longest: i32,
    shortest: i32,
    inverted: bool,
    i: i32,
}

impl Iterator for Move {
    type Item = Vec2<i32>;

    fn next(&mut self) -> Option<Self::Item> {
        return if self.i <= self.longest {
            let value = Some(self.current);

            if self.inverted {
                self.current = self.current + Vec2::new(0, self.step);
            } else {
                self.current = self.current + Vec2::new(self.step, 0);
            }

            self.gradient_acc += self.shortest;

            if self.gradient_acc >= self.longest {
                if self.inverted {
                    self.current = self.current + Vec2::new(self.gradient_step, 0);
                } else {
                    self.current = self.current + Vec2::new(0, self.gradient_step);
                }

                self.gradient_acc -= self.longest;
            }

            self.i += 1;

            value
        } else {
            None
        }
    }
}

// Return an iterator of all moves from given position to given position
pub fn path(from: Vec2<i32>, to: Vec2<i32>) -> Skip<Move> {
    return positions(from, to).skip(1)
}

// Returns an iterator of all positions between given positions
pub fn positions(from: Vec2<i32>, to: Vec2<i32>) -> Move {
    let delta = to - from;

    let mut step = delta.x.signum();
    let mut gradient_step = delta.y.signum();

    let mut longest = delta.x.abs();
    let mut shortest = delta.y.abs();

    let mut inverted = false;

    if longest < shortest {
        inverted = true;
        longest = delta.y.abs();
        shortest = delta.x.abs();

        step = delta.y.signum();
        gradient_step = delta.x.signum();
    }

    let gradient_acc = longest / 2;

    Move {
        current: from,
        step,
        gradient_step,
        gradient_acc,
        longest,
        shortest,
        inverted,
        i: 0}
}