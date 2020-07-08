/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("./lib/fixtures");

fluid.registerNamespace("gpii.tests.locationBar.modelToState");

fluid.defaults("gpii.tests.locationBar.modelToState.caseHolder", {
    gradeNames: ["gpii.tests.locationBar.caseHolder"],
    rawModules: [{
        name: "Testing the model->state relay mechanism in isolation.",
        tests: [
            {
                name: "Confirm that data is synchronized correctly on startup.",
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
                        args:     ["The model should not have been updated based on the query parameter.", "{testEnvironment}.options.expected.modelAfterStartup", "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.webdriver.executeScript",
                        args: [gpii.tests.locationBar.getQueryJson]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "jqUnit.assertDeepEq",
                        args:     ["The query string in the location bar should not have been changed.", "{testEnvironment}.options.expected.queryAfterStartup", "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.webdriver.executeScript",
                        args:     [gpii.test.webdriver.invokeGlobal, "fluid.getGlobalValue", "window.history.state"] // functionPath, fnArgs, environment
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "jqUnit.assertDeepEq",
                        args:     ["The window history state should include the component's model data.", "{testEnvironment}.options.expected.stateAfterStartup", "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.webdriver.executeScript",
                        args: [gpii.tests.locationBar.applyChange, "fromChange", true]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args: [gpii.tests.locationBar.getQueryJson]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "jqUnit.assertDeepEq",
                        args:     ["The URL should not include our model change.", "{testEnvironment}.options.expected.queryAfterChange", "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.webdriver.executeScript",
                        args:     [gpii.test.webdriver.invokeGlobal, "fluid.getGlobalValue", "window.history.state"] // functionPath, fnArgs, environment
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "jqUnit.assertDeepEq",
                        args:     ["The window history state should have been updated as a result of the model change.", "{testEnvironment}.options.expected.stateAfterChange", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.locationBar.modelToState.environment", {
    gradeNames: ["gpii.test.locationBar.testEnvironment"],
    path:   "tests/static/tests-locationBar-modelToState.html?fromQuery=true",
    expected: {
        modelAfterStartup: {
            fromInitialModel: true
        },
        queryAfterStartup: {
            fromQuery: true
        },
        stateAfterStartup: {
            fromInitialModel: true
        },
        queryAfterChange: {
            fromQuery: true
        },
        stateAfterChange: {
            fromInitialModel: true,
            fromChange: true
        }
    },
    components: {
        caseHolder: {
            type: "gpii.tests.locationBar.modelToState.caseHolder"
        }
    }
});

gpii.test.webdriver.allBrowsers({ browsers: ["chrome"], baseTestEnvironment: "gpii.tests.locationBar.modelToState.environment" });
