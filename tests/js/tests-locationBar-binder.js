/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("./lib/fixtures");

fluid.defaults("gpii.tests.locationBar.binder.caseHolder", {
    gradeNames: ["gpii.tests.locationBar.caseHolder"],
    rawModules: [{
        name: "Testing the location bar and 'gpii-binder' together...",
        tests: [
            {
                name: "Confirm that query data is relayed on startup...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["{testEnvironment}.options.url"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     [gpii.test.webdriver.invokeGlobal, "fluid.getGlobalValue", "combinedComponent.model.radio"] // functionPath, fnArgs, environment
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["The model should have been updated based on the query...", "two", "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.webdriver.findElement",
                        args: [{ css: "input[name='radio']:checked"} ]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.testElementValue",
                        args:     ["The form element should have been updated from the query...", "{arguments}.0", "two"] // message, element, expectedValue, jqUnitFn
                    }
                ]
            },
            {
                name: "Confirm that form changes are relayed...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["{testEnvironment}.options.url"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: "input[value='three']" }]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "{testEnvironment}.webdriver.actionsHelper",
                        // We must call "click" with a specific element located in the previous call, i.e. {arguments}.0
                        args:     [[{fn: "click", args: ["{arguments}.0"]}]]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     [gpii.test.webdriver.invokeGlobal, "fluid.getGlobalValue", "combinedComponent.model.radio"] // functionPath, fnArgs, environment
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["The model should have been updated based on the form change...", "three", "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.webdriver.executeScript",
                        args: [gpii.test.webdriver.invokeGlobal, "fluid.getGlobalValue", "window.history.state.radio"] // functionPath, fnArgs, environment
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["The state should have been updated based on the form change...", "three", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Confirm that state changes are relayed...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["{testEnvironment}.options.url"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: "input[value='one']" }]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "{testEnvironment}.webdriver.actionsHelper",
                        // We must call "click" with a specific element located in the previous call, i.e. {arguments}.0
                        args:     [[{fn: "click", args: ["{arguments}.0"]}]]
                    },
                    // Sanity check to confirm that the model was indeed updated based on our click.
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args: [gpii.test.webdriver.invokeGlobal, "fluid.getGlobalValue", "combinedComponent.model.radio"] // functionPath, fnArgs, environment
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["The model should have been updated based on the form change...", "one", "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.webdriver.navigateHelper",
                        args: ["back"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onNavigateHelperComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args: [gpii.test.webdriver.invokeGlobal, "fluid.getGlobalValue", "combinedComponent.model.radio"] // functionPath, fnArgs, environment
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["The model should have been updated based on the second form change...", "two", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.locationBar.binder.environment", {
    gradeNames: ["gpii.test.locationBar.testEnvironment"],
    path:   "tests/static/tests-locationBar-binder.html?radio=%22two%22",
    components: {
        caseHolder: {
            type: "gpii.tests.locationBar.binder.caseHolder"
        }
    }
});

gpii.test.webdriver.allBrowsers({ browsers: ["chrome"], baseTestEnvironment: "gpii.tests.locationBar.binder.environment" });
