"use strict";
var fluid = require("infusion");

// We are reusing a grade from `gpii-test-browser`, but use a wrapper here so that we can change settings for all tests
// in the future.
//
fluid.defaults("gpii.locationBar.tests.caseHolder", {
    gradeNames: ["gpii.tests.browser.caseHolder.withExpress"]
});

