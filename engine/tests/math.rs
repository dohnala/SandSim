use engine::math::{Vec2, path};

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
}