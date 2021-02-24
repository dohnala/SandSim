import 'bootstrap/dist/css/bootstrap.min.css';

import("./debug.js").catch(e =>
    console.error("Error importing `debug.js`:", e)
);

import("./main.js").catch(e =>
    console.error("Error importing `main.js`:", e)
);