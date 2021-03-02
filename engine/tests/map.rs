use engine::map::{Map, Pixel, PixelState, EMPTY_PIXEL_STATE};
use engine::element::Element;

#[test]
fn test_pixel_new() {
    let pixel = Pixel::new(Element::Sand);

    assert_eq!(pixel.element(), Element::Sand);
}

#[test]
fn test_pixel_state_new() {
    let pixel_state = PixelState::new(Element::Sand);

    assert_eq!(pixel_state.element(), Element::Sand);
    assert_eq!(pixel_state.clock(), 0);
}

#[test]
fn test_empty_pixel_state() {
    let pixel_state = EMPTY_PIXEL_STATE;

    assert_eq!(pixel_state.element(), Element::Empty);
    assert_eq!(pixel_state.clock(), 0);
}

#[test]
fn test_map_new() {
    let map = Map::new(3, 3);

    assert_eq!(map.width(), 3);
    assert_eq!(map.height(), 3);
    assert_eq!(map.generation(), 0);

    for x in 0..map.width() {
        for y in 0..map.height() {
            assert_eq!(map.get_pixel(x, y).element(), Element::Empty);

            assert_eq!(map.get_pixel_state(x, y).element(), Element::Empty);
            assert_eq!(map.get_pixel_state(x, y).clock(), 0);
        }
    }
}

#[test]
fn test_map_insert()
{
    let mut map = Map::new(3, 3);

    map.insert(1, 1, Element::Sand);

    assert_eq!(map.get_pixel(1, 1).element(), Element::Sand);
    assert_eq!(map.get_pixel_state(1, 1).element(), Element::Sand);
    assert_eq!(map.get_pixel_state(1, 1).clock(), 0);
}

#[test]
fn test_map_clear()
{
    let mut map = Map::new(3, 3);

    map.insert(1, 1, Element::Sand);
    map.clear();

    assert_eq!(map.get_pixel(0, 0).element(), Element::Empty);
    assert_eq!(map.get_pixel_state(0, 0).element(), Element::Empty);
    assert_eq!(map.get_pixel_state(0, 0).clock(), 0);
}

#[test]
fn test_map_tick()
{
    let mut map = Map::new(3, 3);

    map.tick();

    assert_eq!(map.generation(), 1);

    for x in 0..map.width() {
        for y in 0..map.height() {
            assert_eq!(map.get_pixel(x, y).element(), Element::Empty);

            assert_eq!(map.get_pixel_state(x, y).element(), Element::Empty);
            assert_eq!(map.get_pixel_state(x, y).clock(), 0);
        }
    }
}