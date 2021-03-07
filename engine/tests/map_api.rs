use engine::map::{Map, MapApi, MapConfig};
use engine::element::Element;

#[test]
fn test_map_api_get_pixel() {
    let config = MapConfig::new(
        3, 0.2, 5f32, false, 0, 0);
    let mut map = Map::new_empty(config);

    map.insert(1, 1, Element::Sand, 0);
    map.insert(1, 2, Element::Sand, 0);

    let mut api = MapApi::new(1, 1, &mut map);

    assert_eq!(api.pixel(0, 0).element(), Element::Sand);
    assert_eq!(api.pixel(0, -1).element(), Element::Empty);
    assert_eq!(api.pixel(0, 1).element(), Element::Sand);
    assert_eq!(api.pixel(0, 2).element(), Element::Wall);
    assert_eq!(api.pixel(0, -2).element(), Element::Wall);
    assert_eq!(api.pixel(2, 0).element(), Element::Wall);
    assert_eq!(api.pixel(-2, 0).element(), Element::Wall);
}