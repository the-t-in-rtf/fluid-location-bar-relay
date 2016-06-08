/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("./fixtures");

fluid.defaults("gpii.locationBar.tests.binder.caseHolder", {
    gradeNames: ["gpii.locationBar.tests.caseHolder"],
    rawModules: [{
        name: "Testing the location bar and 'gpii-binder' together...",
        tests: [
            {
                name: "Confirm that query data is relayed on startup...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.browser.goto",
                        args: ["{testEnvironment}.options.startUrl"]
                    },
                    {
                        event:    "{testEnvironment}.browser.events.onLoaded",
                        listener: "{testEnvironment}.browser.evaluate",
                        args:     [gpii.test.browser.getGlobalValue, "combinedComponent.model.radio"]
                    },
                    {
                        event:    "{testEnvironment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["The model should have been updated based on the query...", "two", "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.browser.evaluate",
                        args: [gpii.test.browser.val, "input[name='radio']:checked"]
                    },
                    {
                        event:    "{testEnvironment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["The form element should have been updated from the query...", "two", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Confirm that form changes are relayed...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.browser.goto",
                        args: ["{testEnvironment}.options.startUrl"]
                    },
                    {
                        event:    "{testEnvironment}.browser.events.onLoaded",
                        listener: "{testEnvironment}.browser.click",
                        args:     ["input[value='three']"]
                    },
                    {
                        event:    "{testEnvironment}.browser.events.onClickComplete",
                        listener: "{testEnvironment}.browser.evaluate",
                        args:     [gpii.test.browser.getGlobalValue, "combinedComponent.model.radio"]
                    },
                    {
                        event:    "{testEnvironment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["The model should have been updated based on the form change...", "three", "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.browser.evaluate",
                        args: [gpii.test.browser.getGlobalValue, "window.history.state.radio"]
                    },
                    {
                        event:    "{testEnvironment}.browser.events.onEvaluateComplete",
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
                        func: "{testEnvironment}.browser.goto",
                        args: ["{testEnvironment}.options.startUrl"]
                    },
                    {
                        event:    "{testEnvironment}.browser.events.onLoaded",
                        listener: "{testEnvironment}.browser.click",
                        args:     ["input[value='one']"]
                    },
                    // Sanity check to confirm that the model was indeed updated based on our click.
                    {
                        event:    "{testEnvironment}.browser.events.onClickComplete",
                        listener: "{testEnvironment}.browser.evaluate",
                        args:     [gpii.test.browser.getGlobalValue, "combinedComponent.model.radio"]
                    },
                    {
                        event:    "{testEnvironment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["The model should have been updated based on the form change...", "one", "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.browser.back",
                        args: []
                    },
                    {
                        event:    "{testEnvironment}.browser.events.onBackComplete",
                        listener: "{testEnvironment}.browser.evaluate",
                        args:     [gpii.test.browser.getGlobalValue, "combinedComponent.model.radio"]
                    },
                    {
                        event:    "{testEnvironment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["The model should have been updated based on the second form change...", "two", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.locationBar.tests.binder.environment", {
    gradeNames: ["gpii.locationBar.tests.environment"],
    endpoint:   "tests/static/tests-locationBar-binder.html?radio=two",
    components: {
        caseHolder: {
            type: "gpii.locationBar.tests.binder.caseHolder"
        }
    }
});

gpii.locationBar.tests.binder.environment();
