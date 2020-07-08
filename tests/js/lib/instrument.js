/* eslint-env node */
"use strict";
var fluid = require("infusion");

// Require the package to pick up our relative path.
fluid.require("%fluid-location-bar-relay");

fluid.require("%fluid-testem/src/js/instrumenter.js");

fluid.defaults("fluid.test.locationBar.instrumenter", {
    gradeNames: ["fluid.component"],
    inputPath: "%fluid-location-bar-relay",
    outputPath: "%fluid-location-bar-relay/instrumented",
    instrumentationOptions: {
        sources:    ["./src/**/*.js"],
        excludes:   ["./instrumented", "./docs", "./index.js", "./Gruntfile.js", "./node_modules"],
        nonSources: []
    },
    listeners: {
        "onCreate.instrument": {
            funcName: "fluid.testem.instrumenter.instrument",
            args: ["{that}.options.inputPath", "{that}.options.outputPath", "{that}.options.instrumentationOptions"] // inputPath, outputPath, instrumentationOptions
        }
    }
});

fluid.test.locationBar.instrumenter();
