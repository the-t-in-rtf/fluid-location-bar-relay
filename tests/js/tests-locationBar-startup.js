/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("./lib/fixtures");

fluid.registerNamespace("gpii.tests.locationBar.startup");

/* globals window */
gpii.tests.locationBar.startup.getQueryJson = function () {
    return gpii.locationBar.stateManager.queryToJson(window.location.search);
};

fluid.defaults("gpii.tests.locationBar.startup.caseHolder", {
    gradeNames: ["gpii.tests.locationBar.caseHolder"],
    rawModules: [{
        name: "Testing the location bar startup process...",
        tests: [
            {
                name: "Confirm that data is synchronized correctly on startup...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["{testEnvironment}.options.url"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     [gpii.test.webdriver.invokeGlobal, "fluid.getGlobalValue", "locationBarComponent.model"] // functionPath, fnArgs, environment
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "jqUnit.assertDeepEq",
                        args:     ["The model should have been updated based on the query parameter...", "{testEnvironment}.options.expected.modelAfterStartup", "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.webdriver.executeScript",
                        args:     [gpii.test.webdriver.invokeGlobal, "fluid.getGlobalValue", "window.history.state"] // functionPath, fnArgs, environment
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "jqUnit.assertDeepEq",
                        args:     ["The window history state should include updates from the location bar and our default data...", "{testEnvironment}.options.expected.modelAfterStartup", "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.webdriver.executeScript",
                        args: [gpii.tests.locationBar.startup.getQueryJson]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "jqUnit.assertDeepEq",
                        args:     ["The query string in the location bar should include updates from the location bar and our default data...", "{testEnvironment}.options.expected.modelAfterStartup", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.locationBar.startup.environment", {
    gradeNames: ["gpii.test.locationBar.testEnvironment"],
    path:   "tests/static/tests-locationBar.html?number=9",
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
            type: "gpii.tests.locationBar.startup.caseHolder"
        }
    }
});

gpii.test.webdriver.allBrowsers({ browsers: ["chrome"], baseTestEnvironment: "gpii.tests.locationBar.startup.environment" });
