"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("./fixtures");

fluid.registerNamespace("gpii.locationBar.tests.navigation");

gpii.locationBar.tests.navigation.applyChange = function (path, value) {
    var component = fluid.getGlobalValue("locationBarComponent");
    component.applier.change(path, value);
};

fluid.defaults("gpii.locationBar.tests.navigation.caseHolder", {
    gradeNames: ["gpii.locationBar.tests.caseHolder"],
    rawModules: [{
        name: "Testing 'back' and 'forward' navigation...",
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
                        args:     [gpii.locationBar.tests.navigation.applyChange, "number", 90]
                    },
                    {
                        event:    "{testEnvironment}.browser.events.onEvaluateComplete",
                        listener: "{testEnvironment}.browser.evaluate",
                        args:     [gpii.test.browser.getGlobalValue, "locationBarComponent.model.number"]
                    },
                    {
                        event:    "{testEnvironment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["The model should have been updated after our first change...", 90, "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.browser.evaluate",
                        args: [gpii.locationBar.tests.navigation.applyChange, "number", 210]
                    },
                    {
                        event:    "{testEnvironment}.browser.events.onEvaluateComplete",
                        listener: "{testEnvironment}.browser.evaluate",
                        args:     [gpii.test.browser.getGlobalValue, "locationBarComponent.model.number"]
                    },
                    {
                        event:    "{testEnvironment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["The model should have been updated after our second change...", 210, "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.browser.back",
                        args: []
                    },
                    {
                        event:    "{testEnvironment}.browser.events.onBackComplete",
                        listener: "{testEnvironment}.browser.evaluate",
                        args:     [gpii.test.browser.getGlobalValue, "locationBarComponent.model.number"]
                    },
                    {
                        event:    "{testEnvironment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["We should see the previous value after hitting the back button...", 90, "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.browser.forward",
                        args: []
                    },
                    {
                        event:    "{testEnvironment}.browser.events.onForwardComplete",
                        listener: "{testEnvironment}.browser.evaluate",
                        args:     [gpii.test.browser.getGlobalValue, "locationBarComponent.model.number"]
                    },
                    {
                        event:    "{testEnvironment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["We should see the next value after hitting the forward button...", 210, "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.locationBar.tests.navigation.environment", {
    gradeNames: ["gpii.locationBar.tests.environment"],
    endpoint:   "tests/static/tests-locationBar.html",
    components: {
        caseHolder: {
            type: "gpii.locationBar.tests.navigation.caseHolder"
        }
    }
});

gpii.locationBar.tests.navigation.environment();