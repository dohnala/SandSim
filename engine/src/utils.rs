/// Generates random integer
pub fn rand_int(n: i32) -> i32 {
    (js_sys::Math::random() * n as f64) as i32
}

/// Generates a random direction of length 2
pub fn rand_dir_2() -> i32
{
    let i = rand_int(1000);
    if (i % 2) == 0 {
        -1
    } else {
        1
    }
}