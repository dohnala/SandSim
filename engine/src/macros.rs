extern crate web_sys;

// Macro which logs messages to JS console
macro_rules! log {
    ($($t:tt)*) => {
        web_sys::console::log_1(&format!($($t)*).into());
    }
}