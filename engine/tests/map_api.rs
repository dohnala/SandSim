use engine::map::{Map, MapApi, MapConfig};
use engine::pixel::Element;
use engine::math::Vec2;

#[test]
fn test_map_api_get_pixel() {
    let config = MapConfig::new(
        3, 0.2, 5f32, false, 0, 0);
    let mut map = Map::new_empty(config);

    map.insert(1, 1, Element::Sand, 0);
    map.insert(1, 2, Element::Sand, 0);

    let mut api = MapApi::new(Vec2::new(1, 1), &mut map);

    assert_eq!(api.pixel(Vec2::new(0, 0)).element(), Element::Sand);
    assert_eq!(api.pixel(Vec2::new(0, -1)).element(), Element::Empty);
    assert_eq!(api.pixel(Vec2::new(0, 1)).element(), Element::Sand);
    assert_eq!(api.pixel(Vec2::new(0, 2)).element(), Element::Wall);
    assert_eq!(api.pixel(Vec2::new(0, -2)).element(), Element::Wall);
    assert_eq!(api.pixel(Vec2::new(2, 0)).element(), Element::Wall);
    assert_eq!(api.pixel(Vec2::new(-2, 0)).element(), Element::Wall);
}

#[test]
fn test_activate_pixel() {
    let config = MapConfig::new(
        8, 0.2, 5f32, true, 2, 0);
    let mut map = Map::new_empty(config);

    map.tick();

    for i in 0..map.chunks_count() {
        assert_eq!(map.chunk(i).active_next_tick(), false);
    }

    let mut api = MapApi::new(Vec2::new(3, 2), &mut map);
    api.activate_pixel(Vec2::new(0, 0));

    for i in 0..map.chunks_count() {
        if i == 5 {
            assert_eq!(map.chunk(i).x(), 2);
            assert_eq!(map.chunk(i).y(), 2);
            assert_eq!(map.chunk(i).active_next_tick(), true);
        } else {
            assert_eq!(map.chunk(i).active_next_tick(), false);
        }
    }
}