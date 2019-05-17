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
        excludes:   ["./instrumented", "./docs"],
        nonSources: [
            "./*.js",
            "./tests/**",
            // Test dependencies required for our browser tests
            "./node_modules/infusion/src/lib/jquery/core/js/jquery.js",
            "./node_modules/infusion/src/framework/core/js/FluidDocument.js",
            "./node_modules/infusion/src/framework/core/js/Fluid.js",
            "./node_modules/infusion/src/framework/core/js/FluidIoC.js",
            "./node_modules/infusion/src/framework/core/js/FluidDOMUtilities.js",
            "./node_modules/infusion/src/framework/core/js/FluidView.js",
            "./node_modules/infusion/src/framework/core/js/DataBinding.js",
            "./node_modules/infusion/src/framework/core/js/ModelTransformation.js",
            "./node_modules/infusion/src/framework/core/js/ModelTransformationTransforms.js",
            "./node_modules/gpii-binder/src/js/binder.js",
            "./node_modules/gpii-express/src/js/lib/querystring-coding.js"
        ]
    },
    listeners: {
        "onCreate.instrument": {
            funcName: "gpii.testem.instrumenter.instrument",
            args: ["{that}.options.inputPath", "{that}.options.outputPath", "{that}.options.instrumentationOptions"] // inputPath, outputPath, instrumentationOptions
        }
    }
});

gpii.test.locationBar.instrumenter();
