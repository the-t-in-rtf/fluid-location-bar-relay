"use strict";
var fluid = require("infusion");

require("gpii-test-browser");
require("./harness");

fluid.defaults("gpii.locationBar.tests.testEnvironment", {
    gradeNames: ["gpii.tests.browser.environment.withExpress"],
    components: {
        express: {
            type: "gpii.locationBar.tests.harness"
        }
    }
});