/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("./lib/fixtures");

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
                name: "Confirm that backward and forward navigation work as expected...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["{testEnvironment}.options.startUrl"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     [gpii.locationBar.tests.navigation.applyChange, "number", 90]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     [gpii.test.webdriver.invokeGlobal, "fluid.getGlobalValue", "locationBarComponent.model.number"] // functionPath, fnArgs, environment
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["The model should have been updated after our first change...", 90, "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.webdriver.executeScript",
                        args: [gpii.locationBar.tests.navigation.applyChange, "number", 210]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     [gpii.test.webdriver.invokeGlobal, "fluid.getGlobalValue", "locationBarComponent.model.number"] // functionPath, fnArgs, environment
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["The model should have been updated after our second change...", 210, "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.webdriver.navigateHelper",
                        args: ["back"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onNavigateHelperComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     [gpii.test.webdriver.invokeGlobal, "fluid.getGlobalValue", "locationBarComponent.model.number"] // functionPath, fnArgs, environment
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["We should see the previous value after hitting the back button...", 90, "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.webdriver.navigateHelper",
                        args: ["forward"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onNavigateHelperComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     [gpii.test.webdriver.invokeGlobal, "fluid.getGlobalValue", "locationBarComponent.model.number"] // functionPath, fnArgs, environment
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
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

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.locationBar.tests.navigation.environment" });
