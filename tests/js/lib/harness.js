/*

    Our test harness configuration.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");

require("gpii-express");
require("../../../");

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