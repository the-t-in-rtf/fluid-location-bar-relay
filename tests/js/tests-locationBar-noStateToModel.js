/* eslint-env node */
"use strict";
var fluid = require("infusion");

require("./lib/fixtures");

fluid.registerNamespace("fluid.tests.locationBar.noStateToModel");

fluid.tests.locationBar.noStateToModel.updateState = function () {
    window.history.pushState({ fromState: true}, "Change state value.");
};


// The state->model relay mechanism is tested in its enabled state elsewhere.
fluid.defaults("fluid.tests.locationBar.noStateToModel.caseHolder", {
    gradeNames: ["fluid.tests.locationBar.caseHolder"],
    rawModules: [{
        name: "Confirming that the state->model relay mechanism can be disabled using a configuration option.",
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
                        args:     ["The model should be as expected after startup.", "{testEnvironment}.options.expected.modelAfterStartup", "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.webdriver.executeScript",
                        args: [fluid.tests.locationBar.noStateToModel.updateState]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     [fluid.test.webdriver.invokeGlobal, "fluid.getGlobalValue", "window.history.state"] // functionPath, fnArgs, environment
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "jqUnit.assertDeepEq",
                        args:     ["The window history state should have been updated.", "{testEnvironment}.options.expected.stateAfterStateChange", "{arguments}.0"]
                    },
                    {
                        func:    "{testEnvironment}.webdriver.executeScript",
                        args:     [fluid.test.webdriver.invokeGlobal, "fluid.getGlobalValue", "locationBarComponent.model"] // functionPath, fnArgs, environment
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "jqUnit.assertDeepEq",
                        args:     ["The model should not have been updated by the state change.", "{testEnvironment}.options.expected.modelAfterStateChange", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("fluid.tests.locationBar.noStateToModel.environment", {
    gradeNames: ["fluid.test.locationBar.testEnvironment"],
    path:   "tests/static/tests-locationBar-noStateToModel.html",
    expected: {
        modelAfterStartup: {
            fromInitialModel: true
        },
        modelAfterStateChange: {
            fromInitialModel: true
        },
        stateAfterStateChange: {
            fromState: true
        }
    },
    components: {
        caseHolder: {
            type: "fluid.tests.locationBar.noStateToModel.caseHolder"
        }
    }
});

fluid.test.webdriver.allBrowsers({ browsers: ["chrome"], baseTestEnvironment: "fluid.tests.locationBar.noStateToModel.environment" });
