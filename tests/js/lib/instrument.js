/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

// Require the package to pick up our relative path.
fluid.require("%gpii-location-bar-relay");

fluid.require("%gpii-testem/src/js/instrumenter.js");

fluid.defaults("gpii.test.locationBar.instrumenter", {
    gradeNames: ["fluid.component"],
    inputPath: "%gpii-location-bar-relay",
    outputPath: "%gpii-location-bar-relay/instrumented",
    instrumentationOptions: {
        sources:    ["./src/**/*.js"],
        excludes:   ["./instrumented", "./docs", "./index.js", "./Gruntfile.js", "./node_modules"],
        nonSources: []
    },
    listeners: {
        "onCreate.instrument": {
            funcName: "gpii.testem.instrumenter.instrument",
            args: ["{that}.options.inputPath", "{that}.options.outputPath", "{that}.options.instrumentationOptions"] // inputPath, outputPath, instrumentationOptions
        }
    }
});

gpii.test.locationBar.instrumenter();
