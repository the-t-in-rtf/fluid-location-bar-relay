/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%fluid-express");

fluid.defaults("fluid.test.locationBar.express", {
    gradeNames: ["fluid.express"],
    components: {
        src: {
            type: "fluid.express.router.static",
            options: {
                path: "/src",
                content: ["%fluid-location-bar-relay/instrumented/src", "%fluid-location-bar-relay/src"]
            }
        },
        nm: {
            type: "fluid.express.router.static",
            options: {
                path: "/node_modules",
                content: ["%fluid-location-bar-relay/node_modules"]
            }
        },
        tests: {
            type: "fluid.express.router.static",
            options: {
                path: "/tests",
                content: ["%fluid-location-bar-relay/tests"]
            }
        }
    }
});
