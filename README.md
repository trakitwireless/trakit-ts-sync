# Trak-iT API Synchronization

This library provides a full suite of tools to keep a local copy of objects from Trak-iT's APIs in-sync. Other Trak-iT API libraries are available on GitHub. https://github.com/trakitwireless

### Prerequisites

The `@trakit/objects` package is required as since this library sends requests to the APIs. The `@trakit/commands` package is required as most Response classes will contain an object from that library.

In order to build this project, you need to install the RollupJS, and plugins for TypeScript and Minifying.
```
npm i rollup rollup-plugin-typescript2 @rollup/plugin-terser
```
After those have been installed, build the project normally.
```
rollup --config client/rollup.config.js
rollup --config worker/rollup.config.js
```

## Questions and Feedback

If you have any questions, please start for the project on GitHub
https://github.com/trakitwireless/trakit-ww/issues
