use engine::map::{Map, Pixel, PixelState, EMPTY_PIXEL_STATE, MapConfig, MapApi};
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
}

#[test]
fn test_empty_pixel_state() {
    let pixel_state = EMPTY_PIXEL_STATE;

    assert_eq!(pixel_state.element(), Element::Empty);
}

#[test]
fn test_map_new() {
    let config = MapConfig::new(
        3, 0.2, 5f32, false, 0, 0);
    let map = Map::new_empty(config);

    assert_eq!(map.size(), 3);

    for x in 0..map.size() {
        for y in 0..map.size() {
            assert_eq!(map.pixel(x, y).element(), Element::Empty);
            assert_eq!(map.pixel_state(x, y).element(), Element::Empty);
        }
    }
}

#[test]
fn test_map_insert()
{
    let config = MapConfig::new(
        3, 0.2, 5f32, false, 0, 0);
    let mut map = Map::new_empty(config);

    map.insert(1, 1, Element::Sand, 0);

    assert_eq!(map.pixel(1, 1).element(), Element::Sand);
    assert_eq!(map.pixel_state(1, 1).element(), Element::Sand);
}

#[test]
fn test_map_clear()
{
    let config = MapConfig::new(
        3, 0.2, 5f32, false, 0, 0);
    let mut map = Map::new_empty(config);

    map.insert(1, 1, Element::Sand, 0);
    map.clear();

    assert_eq!(map.pixel(0, 0).element(), Element::Empty);
    assert_eq!(map.pixel_state(0, 0).element(), Element::Empty);
}

#[test]
fn test_map_tick()
{
    let config = MapConfig::new(
        3, 0.2, 5f32, false, 0, 0);
    let mut map = Map::new_empty(config);

    map.tick();

    for x in 0..map.size() {
        for y in 0..map.size() {
            assert_eq!(map.pixel(x, y).element(), Element::Empty);
            assert_eq!(map.pixel_state(x, y).element(), Element::Empty);
        }
    }
}

#[test]
fn test_generate_chunk_with_same_size() {
    let config = MapConfig::new(
        8, 0.2, 5f32, true, 8, 0);
    let map = Map::new_empty(config);

    assert_eq!(map.chunks_count(), 1);
    assert_eq!(map.chunk(0).x(), 0);
    assert_eq!(map.chunk(0).y(), 0);
}

#[test]
fn test_generate_chunk_with_bigger_size() {
    let config = MapConfig::new(
        8, 0.2, 5f32, true, 16, 0);
    let map = Map::new_empty(config);

    assert_eq!(map.chunks_count(), 1);
    assert_eq!(map.chunk(0).x(), 0);
    assert_eq!(map.chunk(0).y(), 0);
}

#[test]
fn test_generate_chunk_with_smaller_size() {
    let config = MapConfig::new(
        8, 0.2, 5f32, true, 4, 0);
    let map = Map::new_empty(config);

    assert_eq!(map.chunks_count(), 4);
    assert_eq!(map.chunk(0).x(), 0);
    assert_eq!(map.chunk(0).y(), 0);
    assert_eq!(map.chunk(1).x(), 4);
    assert_eq!(map.chunk(1).y(), 0);
    assert_eq!(map.chunk(2).x(), 0);
    assert_eq!(map.chunk(2).y(), 4);
    assert_eq!(map.chunk(3).x(), 4);
    assert_eq!(map.chunk(3).y(), 4);
}