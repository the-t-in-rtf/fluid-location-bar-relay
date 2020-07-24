/* eslint-env node */
"use strict";
var fluid = require("infusion");

require("./lib/fixtures");

fluid.registerNamespace("fluid.tests.locationBar.modelToQuery");

fluid.defaults("fluid.tests.locationBar.modelToQuery.caseHolder", {
    gradeNames: ["fluid.tests.locationBar.caseHolder"],
    rawModules: [{
        name: "Testing the model->query relay mechanism in isolation.",
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
                        args:     [fluid.test.webdriver.invokeGlobal, "fluid.getGlobalValue", "locationBarComponent.model"] // functionPath, fnArgs, environment
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "jqUnit.assertDeepEq",
                        args:     ["The model should not have been updated based on the query parameter.", "{testEnvironment}.options.expected.modelAfterStartup", "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.webdriver.executeScript",
                        args: [fluid.tests.locationBar.getQueryJson]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "jqUnit.assertDeepEq",
                        args:     ["The query string in the location bar should not contain the original non-model material.", "{testEnvironment}.options.expected.queryAfterStartup", "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.webdriver.executeScript",
                        args:     [fluid.test.webdriver.invokeGlobal, "fluid.getGlobalValue", "window.history.state"] // functionPath, fnArgs, environment
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "jqUnit.assertDeepEq",
                        args:     ["The window history state should not include any of the component's model data.", "{testEnvironment}.options.expected.state", "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.webdriver.executeScript",
                        args: [fluid.tests.locationBar.applyChange, "fromChange", true]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args: [fluid.tests.locationBar.getQueryJson]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "jqUnit.assertDeepEq",
                        args:     ["The URL should include our model change.", "{testEnvironment}.options.expected.queryAfterChange", "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.webdriver.executeScript",
                        args:     [fluid.test.webdriver.invokeGlobal, "fluid.getGlobalValue", "window.history.state"] // functionPath, fnArgs, environment
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "jqUnit.assertDeepEq",
                        args:     ["The window history state should not have been updated as a result of the model change.", "{testEnvironment}.options.expected.state", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("fluid.tests.locationBar.modelToQuery.environment", {
    gradeNames: ["fluid.test.locationBar.testEnvironment"],
    path:   "tests/static/tests-locationBar-modelToQuery.html?fromQuery=true",
    expected: {
        modelAfterStartup: {
            fromInitialModel: true
        },
        queryAfterStartup: {
            fromInitialModel: true
        },
        state: {},
        queryAfterChange: {
            fromInitialModel: true,
            fromChange: true
        }
    },
    components: {
        caseHolder: {
            type: "fluid.tests.locationBar.modelToQuery.caseHolder"
        }
    }
});

fluid.test.webdriver.allBrowsers({ browsers: ["chrome"], baseTestEnvironment: "fluid.tests.locationBar.modelToQuery.environment" });
