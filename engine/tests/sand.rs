use engine::map::{Map, MapConfig};
use engine::element::Element;

/*
    If there is empty element under sand, it should moved down

    . . .       . . .
    . S .  =>   . . .
    . . .       . S .
 */
#[test]
fn test_sand_move_down() {
    let mut map = Map::new(MapConfig::new(3, 3, 0.2, 5f32));

    map.insert(1, 1, Element::Sand);
    map.tick();

    assert_eq!(map.pixel_state(0, 0).element(), Element::Empty);
    assert_eq!(map.pixel_state(1, 0).element(), Element::Empty);
    assert_eq!(map.pixel_state(2, 0).element(), Element::Empty);

    assert_eq!(map.pixel_state(0, 1).element(), Element::Empty);
    assert_eq!(map.pixel_state(1, 1).element(), Element::Empty);
    assert_eq!(map.pixel_state(2, 1).element(), Element::Empty);

    assert_eq!(map.pixel_state(0, 2).element(), Element::Empty);
    assert_eq!(map.pixel_state(1, 2).element(), Element::Sand);
    assert_eq!(map.pixel_state(2, 2).element(), Element::Empty);
}

/*
    If there is end of map under sand, it should stay where it is

    . . .       . . .
    . . .  =>   . . .
    . S .       . S .
 */
#[test]
fn test_sand_move_at_map_boundary() {
    let mut map = Map::new(MapConfig::new(3, 3, 0.2, 5f32));

    map.insert(1, 2, Element::Sand);
    map.tick();

    assert_eq!(map.pixel_state(0, 0).element(), Element::Empty);
    assert_eq!(map.pixel_state(1, 0).element(), Element::Empty);
    assert_eq!(map.pixel_state(2, 0).element(), Element::Empty);

    assert_eq!(map.pixel_state(0, 1).element(), Element::Empty);
    assert_eq!(map.pixel_state(1, 1).element(), Element::Empty);
    assert_eq!(map.pixel_state(2, 1).element(), Element::Empty);

    assert_eq!(map.pixel_state(0, 2).element(), Element::Empty);
    assert_eq!(map.pixel_state(1, 2).element(), Element::Sand);
    assert_eq!(map.pixel_state(2, 2).element(), Element::Empty);
}

/*
    If down position is not empty, but down-right and down-left are free,
    move randomly to one of them

    . . .       . . .    . . .
    . S .  =>   . . . OR . . .
    . S .       S S .    . S S
 */
#[test]
fn test_sand_move_random_diagonal() {
    let mut map = Map::new(MapConfig::new(3, 3, 0.2, 5f32));

    map.insert(1, 1, Element::Sand);
    map.insert(1, 2, Element::Sand);

    loop {
        map.tick();
    }

    assert_eq!(map.pixel_state(0, 0).element(), Element::Empty);
    assert_eq!(map.pixel_state(1, 0).element(), Element::Empty);
    assert_eq!(map.pixel_state(2, 0).element(), Element::Empty);

    assert_eq!(map.pixel_state(0, 1).element(), Element::Empty);
    assert_eq!(map.pixel_state(1, 1).element(), Element::Empty);
    assert_eq!(map.pixel_state(2, 1).element(), Element::Empty);

    if map.pixel_state(0, 2).element() == Element::Sand {
        assert_eq!(map.pixel_state(2, 2).element(), Element::Empty);
    } else {
        assert_eq!(map.pixel_state(0, 2).element(), Element::Empty);
        assert_eq!(map.pixel_state(2, 2).element(), Element::Sand);
    }

    assert_eq!(map.pixel_state(1, 2).element(), Element::Sand);

}

/*
    If both down and down-right positions are not empty, but down-left is free,
    move there

    . . .       . . .
    . S .  =>   . . .
    . S S       S S S
 */
#[test]
fn test_sand_move_down_left() {
    let mut map = Map::new(MapConfig::new(3, 3, 0.2, 5f32));

    map.insert(1, 1, Element::Sand);
    map.insert(1, 2, Element::Sand);
    map.insert(2, 2, Element::Sand);
    map.tick();

    assert_eq!(map.pixel_state(0, 0).element(), Element::Empty);
    assert_eq!(map.pixel_state(1, 0).element(), Element::Empty);
    assert_eq!(map.pixel_state(2, 0).element(), Element::Empty);

    assert_eq!(map.pixel_state(0, 1).element(), Element::Empty);
    assert_eq!(map.pixel_state(1, 1).element(), Element::Empty);
    assert_eq!(map.pixel_state(2, 1).element(), Element::Empty);

    assert_eq!(map.pixel_state(0, 2).element(), Element::Sand);
    assert_eq!(map.pixel_state(1, 2).element(), Element::Sand);
    assert_eq!(map.pixel_state(2, 2).element(), Element::Sand);
}

/*
    If both down and down-left positions are not empty, but down-right is free,
    move there

    . . .       . . .
    . S .  =>   . . .
    S S .       S S S
 */
#[test]
fn test_sand_move_down_right() {
    let mut map = Map::new(MapConfig::new(3, 3, 0.2, 5f32));

    map.insert(1, 1, Element::Sand);
    map.insert(0, 2, Element::Sand);
    map.insert(1, 2, Element::Sand);
    map.tick();

    assert_eq!(map.pixel_state(0, 0).element(), Element::Empty);
    assert_eq!(map.pixel_state(1, 0).element(), Element::Empty);
    assert_eq!(map.pixel_state(2, 0).element(), Element::Empty);

    assert_eq!(map.pixel_state(0, 1).element(), Element::Empty);
    assert_eq!(map.pixel_state(1, 1).element(), Element::Empty);
    assert_eq!(map.pixel_state(2, 1).element(), Element::Empty);

    assert_eq!(map.pixel_state(0, 2).element(), Element::Sand);
    assert_eq!(map.pixel_state(1, 2).element(), Element::Sand);
    assert_eq!(map.pixel_state(2, 2).element(), Element::Sand);
}

/*
    If all down positions are not empty, not move

    . . .       . . .
    . S .  =>   . S .
    S S S       S S S
 */
#[test]
fn test_sand_not_move() {
    let mut map = Map::new(MapConfig::new(3, 3, 0.2, 5f32));

    map.insert(1, 1, Element::Sand);
    map.insert(0, 2, Element::Sand);
    map.insert(1, 2, Element::Sand);
    map.insert(2, 2, Element::Sand);
    map.tick();

    assert_eq!(map.pixel_state(0, 0).element(), Element::Empty);
    assert_eq!(map.pixel_state(1, 0).element(), Element::Empty);
    assert_eq!(map.pixel_state(2, 0).element(), Element::Empty);

    assert_eq!(map.pixel_state(0, 1).element(), Element::Empty);
    assert_eq!(map.pixel_state(1, 1).element(), Element::Sand);
    assert_eq!(map.pixel_state(2, 1).element(), Element::Empty);

    assert_eq!(map.pixel_state(0, 2).element(), Element::Sand);
    assert_eq!(map.pixel_state(1, 2).element(), Element::Sand);
    assert_eq!(map.pixel_state(2, 2).element(), Element::Sand);
}