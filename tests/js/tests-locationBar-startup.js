/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("./lib/fixtures");

fluid.registerNamespace("gpii.locationBar.tests.startup");

/* globals window */
gpii.locationBar.tests.startup.getQueryJson = function () {
    return gpii.locationBar.stateManager.queryToJson(window.location.search);
};

fluid.defaults("gpii.locationBar.tests.startup.caseHolder", {
    gradeNames: ["gpii.locationBar.tests.caseHolder"],
    rawModules: [{
        name: "Testing the location bar startup process...",
        tests: [
            {
                name: "Confirm that data is synchronized correctly on startup...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.browser.goto",
                        args: ["{testEnvironment}.options.startUrl"]
                    },
                    {
                        event:    "{testEnvironment}.browser.events.onLoaded",
                        listener: "{testEnvironment}.browser.evaluate",
                        args:     [gpii.test.browser.getGlobalValue, "locationBarComponent.model"]
                    },
                    {
                        event:    "{testEnvironment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertDeepEq",
                        args:     ["The model should have been updated based on the query parameter...", "{testEnvironment}.options.expected.modelAfterStartup", "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.browser.evaluate",
                        args: [gpii.test.browser.getGlobalValue, "window.history.state"]
                    },
                    {
                        event:    "{testEnvironment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertDeepEq",
                        args:     ["The window history state should include updates from the location bar and our default data...", "{testEnvironment}.options.expected.modelAfterStartup", "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.browser.evaluate",
                        args: [gpii.locationBar.tests.startup.getQueryJson]
                    },
                    {
                        event:    "{testEnvironment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertDeepEq",
                        args:     ["The query string in the location bar should include updates from the location bar and our default data...", "{testEnvironment}.options.expected.modelAfterStartup", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.locationBar.tests.startup.environment", {
    gradeNames: ["gpii.locationBar.tests.environment"],
    endpoint:   "tests/static/tests-locationBar.html?number=9",
    expected: {
        modelAfterStartup: {
            number: 9,
            string: "this works",
            array: ["one", "two", "three"],
            object: {
                element: "exists"
            }
        }
    },
    components: {
        caseHolder: {
            type: "gpii.locationBar.tests.startup.caseHolder"
        }
    }
});

gpii.locationBar.tests.startup.environment();
