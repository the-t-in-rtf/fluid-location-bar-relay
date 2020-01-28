/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%gpii-express");

fluid.defaults("gpii.test.locationBar.express", {
    gradeNames: ["gpii.express"],
    components: {
        src: {
            type: "gpii.express.router.static",
            options: {
                path: "/src",
                content: ["%gpii-location-bar-relay/instrumented/src", "%gpii-location-bar-relay/src"]
            }
        },
        nm: {
            type: "gpii.express.router.static",
            options: {
                path: "/node_modules",
                content: ["%gpii-location-bar-relay/node_modules"]
            }
        },
        tests: {
            type: "gpii.express.router.static",
            options: {
                path: "/tests",
                content: ["%gpii-location-bar-relay/tests"]
            }
        }
    }
});
