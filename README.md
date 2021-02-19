# Sand simulation

## Requirements
To install all necessary tools, follow [these instructions](https://developer.mozilla.org/en-US/docs/WebAssembly/Rust_to_wasm)

### Install Cargo watch

```
cargo install cargo-watch
```

## Build and Run

```
# Compile the engine into WebAssembly and create npm package
cd engine && wasm-pack build && cd ..

# Start web server at http://localhost:8080/SandSim/
cd site && npm install && npm run start 

# Watch for changes in engine and rebuild it when needed
# Run in a separate terminal
cd engine && cargo watch -s "wasm-pack build"
```