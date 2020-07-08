/* eslint-env node */
"use strict";
var fluid = require("infusion");

require("./lib/fixtures");

fluid.registerNamespace("fluid.tests.locationBar.queryToModel");

fluid.defaults("fluid.tests.locationBar.queryToModel.caseHolder", {
    gradeNames: ["fluid.tests.locationBar.caseHolder"],
    rawModules: [{
        name: "Testing the query->model relay mechanism in isolation.",
        tests: [
            {
                name: "Confirm that query data is synchronized correctly on startup.",
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
                        args: [fluid.tests.locationBar.getQueryJson]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "jqUnit.assertDeepEq",
                        args:     ["The query string in the location bar should not include additional model variables from the component.", "{testEnvironment}.options.expected.queryAfterStartup", "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.webdriver.executeScript",
                        args:     [fluid.test.webdriver.invokeGlobal, "fluid.getGlobalValue", "window.history.state"] // functionPath, fnArgs, environment
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "jqUnit.assertDeepEq",
                        args:     ["The window history state should not include any of the component's model data.", "{testEnvironment}.options.expected.stateAfterStartup", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("fluid.tests.locationBar.queryToModel.environment", {
    gradeNames: ["fluid.test.locationBar.testEnvironment"],
    path:   "tests/static/tests-locationBar-queryToModel.html?foo=true&bar=false",
    expected: {
        modelAfterStartup: {
            foo: true,
            bar: false,
            baz: true
        },
        queryAfterStartup: {
            foo: true,
            bar: false
        },
        stateAfterStartup: {}
    },
    components: {
        caseHolder: {
            type: "fluid.tests.locationBar.queryToModel.caseHolder"
        }
    }
});

fluid.test.webdriver.allBrowsers({ browsers: ["chrome"], baseTestEnvironment: "fluid.tests.locationBar.queryToModel.environment" });
