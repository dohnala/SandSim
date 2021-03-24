use engine::math::{Vec2, path};
use engine::rand::Random;

#[test]
fn test_zero() {
    let moves: Vec<Vec2<i32>> = path(Vec2::new(0, 0), Vec2::new(0, 0))
        .collect();

    assert_eq!(moves, vec![]);
}

#[test]
fn test_one() {
    // One down
    let moves: Vec<Vec2<i32>> = path(Vec2::new(0, 0), Vec2::new(0, 1))
        .collect();

    assert_eq!(moves, vec![
        Vec2::new(0, 1)]);

    // One up
    let moves: Vec<Vec2<i32>> = path(Vec2::new(0, 0), Vec2::new(0, -1))
        .collect();

    assert_eq!(moves, vec![
        Vec2::new(0, -1)]);

    // One right
    let moves: Vec<Vec2<i32>> = path(Vec2::new(0, 0), Vec2::new(1, 0))
        .collect();

    assert_eq!(moves, vec![
        Vec2::new(1, 0)]);

    // One left
    let moves: Vec<Vec2<i32>> = path(Vec2::new(0, 0), Vec2::new(-1, 0))
        .collect();

    assert_eq!(moves, vec![
        Vec2::new(-1, 0)]);

    // One diagonal
    let moves: Vec<Vec2<i32>> = path(Vec2::new(0, 0), Vec2::new(-1, 1))
        .collect();

    assert_eq!(moves, vec![
        Vec2::new(-1, 1)]);
}

#[test]
fn test_two() {
    // Two down
    let moves: Vec<Vec2<i32>> = path(Vec2::new(0, 0), Vec2::new(0, 2))
        .collect();

    assert_eq!(moves, vec![
        Vec2::new(0, 1),
        Vec2::new(0, 2)]);

    // Two up
    let moves: Vec<Vec2<i32>> = path(Vec2::new(0, 0), Vec2::new(0, -2))
        .collect();

    assert_eq!(moves, vec![
        Vec2::new(0, -1),
        Vec2::new(0, -2)]);

    // Two diagonal
    let moves: Vec<Vec2<i32>> = path(Vec2::new(0, 0), Vec2::new(2, -2))
        .collect();

    assert_eq!(moves, vec![
        Vec2::new(1, -1),
        Vec2::new(2, -2)]);
}

#[test]
fn test_long() {
    let moves: Vec<Vec2<i32>> = path(Vec2::new(0, 0), Vec2::new(2, 7))
        .collect();

    assert_eq!(moves, vec![
        Vec2::new(0, 1),
        Vec2::new(1, 2),
        Vec2::new(1, 3),
        Vec2::new(1, 4),
        Vec2::new(1, 5),
        Vec2::new(2, 6),
        Vec2::new(2, 7)]);

    let moves: Vec<Vec2<i32>> = path(Vec2::new(0, 0), Vec2::new(5, -3))
        .collect();

    assert_eq!(moves, vec![
        Vec2::new(1, -1),
        Vec2::new(2, -1),
        Vec2::new(3, -2),
        Vec2::new(4, -2),
        Vec2::new(5, -3)]);
}