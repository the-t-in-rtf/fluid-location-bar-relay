"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("gpii-express");
require("../../");

require("gpii-test-browser");
gpii.test.browser.loadTestingSupport();

fluid.defaults("gpii.locationBar.tests.harness", {
    gradeNames: ["gpii.express"],
    baseUrl: {
        expander: {
            funcName: "fluid.stringTemplate",
            args:     ["http://localhost:%port/", { port: "{that}.options.port"}]
        }
    },
    config: {
        express: {
            port:  "{harness}.options.port"
        },
        app: {
            name: "Location Bar Relay Test Harness",
            url:  "{harness}.options.baseUrl"
        }
    },
    components: {
        nm: {
            type: "gpii.express.router.static",
            options: {
                path:    "/nm",
                content: ["%gpii-location-bar-relay/node_modules"]
            }
        },
        src: {
            type: "gpii.express.router.static",
            options: {
                path:    "/src",
                content: ["%gpii-location-bar-relay/src"]
            }
        },
        tests: {
            type: "gpii.express.router.static",
            options: {
                path:    "/tests",
                content: ["%gpii-location-bar-relay/tests"]
            }
        }
    }
});

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