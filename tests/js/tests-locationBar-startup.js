/* eslint-env node */
"use strict";
var fluid = require("infusion");

require("./lib/fixtures");

fluid.registerNamespace("fluid.tests.locationBar.startup");

fluid.defaults("fluid.tests.locationBar.startup.caseHolder", {
    gradeNames: ["fluid.tests.locationBar.caseHolder"],
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
                        args:     [fluid.test.webdriver.invokeGlobal, "fluid.getGlobalValue", "locationBarComponent.model"] // functionPath, fnArgs, environment
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "jqUnit.assertDeepEq",
                        args:     ["The model should have been updated based on the query parameter...", "{testEnvironment}.options.expected.modelAfterStartup", "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.webdriver.executeScript",
                        args:     [fluid.test.webdriver.invokeGlobal, "fluid.getGlobalValue", "window.history.state"] // functionPath, fnArgs, environment
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "jqUnit.assertDeepEq",
                        args:     ["The window history state should include updates from the location bar and our default data...", "{testEnvironment}.options.expected.modelAfterStartup", "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.webdriver.executeScript",
                        args: [fluid.tests.locationBar.getQueryJson]
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

fluid.defaults("fluid.tests.locationBar.startup.environment", {
    gradeNames: ["fluid.test.locationBar.testEnvironment"],
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
            type: "fluid.tests.locationBar.startup.caseHolder"
        }
    }
});

fluid.test.webdriver.allBrowsers({ browsers: ["chrome"], baseTestEnvironment: "fluid.tests.locationBar.startup.environment" });
