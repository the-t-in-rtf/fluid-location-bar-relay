/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
var fs    = require("fs");
var path  = require("path");
var mkdirp = require("mkdirp");

require("../../../");
require("./express.js");

require("gpii-webdriver");
gpii.webdriver.loadTestingSupport();

fluid.registerNamespace("gpii.tests.locationBar.caseHolder");

// Common function used to retrieve the query data from the window's location.
gpii.tests.locationBar.getQueryJson = function () {
    return gpii.locationBar.stateManager.queryToJson(window.location.search);
};

// Common function to apply a change to the component's model.
gpii.tests.locationBar.applyChange = function (path, value) {
    var component = fluid.getGlobalValue("locationBarComponent");
    component.applier.change(path, value);
};


// Save coverage data to a file.
gpii.tests.locationBar.caseHolder.saveCoverage = function (that, coverageData) {
    if (!fluid.jQueryStandalone.isEmptyObject(coverageData)) {
        var resolvedCoverageDir = fluid.module.resolvePath(that.options.coverageDir);
        mkdirp.sync(resolvedCoverageDir);
        var filename = "coverage-" + that.id + "-" + Date.now();
        var outputPath = path.resolve(resolvedCoverageDir, filename);
        fs.writeFileSync(outputPath, JSON.stringify(coverageData, null, 2), { encoding: "utf8"});
        fluid.log("Saved coverage data.");
    }
    else {
        fluid.log("No coverage data to save.");
    }
};

// Our test caseHolder (based on a standard one from gpii-test-browser).
// TODO: Convert this to use sequences once gpii-express and gpii-webdriver are converted.
fluid.defaults("gpii.tests.locationBar.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder"],
    coverageDir: "%gpii-location-bar-relay/coverage",
    sequenceEnd: [
        // Retrieve the coverage data.
        {
            func: "{testEnvironment}.webdriver.executeScript",
            args: [gpii.test.webdriver.invokeGlobal, "fluid.getGlobalValue", "window.__coverage__"] // functionPath, fnArgs, environment
        },
        // Save the coverage data.
        {
            event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
            listener: "gpii.tests.locationBar.caseHolder.saveCoverage",
            args:     ["{that}", "{arguments}.0"]
        },
        { func: "{testEnvironment}.events.stopFixtures.fire", args: [] },
        { listener: "fluid.identity", event: "{testEnvironment}.events.onFixturesStopped"}
    ]
});

fluid.defaults("gpii.test.locationBar.testEnvironment", {
    gradeNames: ["gpii.test.webdriver.testEnvironment.withExpress"],
    components: {
        express: {
            type: "gpii.test.locationBar.express"
        }
    }
});
