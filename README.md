# Trak-iT API Synchronization

This library provides a full suite of tools to keep a local copy of objects from Trak-iT's APIs in-sync. Other Trak-iT API libraries are available on GitHub. https://github.com/trakitwireless

### Prerequisites

The `@trakit/objects` and `@trakit/commands` packages are required since they contain the definitions for all the commands required to manipulate the objects.

In order to build this project, you need to install the RollupJS, and plugins for TypeScript and Minifying.
```
npm i rollup rollup-plugin-typescript2 @rollup/plugin-terser
```
After those have been installed, build the project normally.
```
rollup --config rollup.config.js
```

## Questions and Feedback

If you have any questions, please start for the project on GitHub
https://github.com/trakitwireless/trakit-ts-sync/issues
