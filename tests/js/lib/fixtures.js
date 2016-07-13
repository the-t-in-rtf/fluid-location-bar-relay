/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("gpii-express");
require("../../../");

require("gpii-test-browser");
gpii.test.browser.loadTestingSupport();

require("./harness.js");

// Our test caseHolder (based on a standard one from gpii-test-browser).
fluid.defaults("gpii.locationBar.tests.caseHolder", {
    gradeNames: ["gpii.test.browser.caseHolder.withExpress"]
});

// Our test environment (based on a standard one from gpii-test-browser).
fluid.defaults("gpii.locationBar.tests.environment", {
    gradeNames: ["gpii.test.browser.environment.withExpress"],
    startUrl: {
        expander: {
            funcName: "fluid.stringTemplate",
            args: ["%baseUrl%endpoint", { baseUrl: "{testEnvironment}.options.url", endpoint: "{testEnvironment}.options.endpoint"}]
        }
    },
    components: {
        express: {
            type: "gpii.locationBar.tests.harness"
        }
    }
});
