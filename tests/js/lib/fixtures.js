/* eslint-env node */
"use strict";
var fluid  = require("infusion");
var fs     = require("fs");
var path   = require("path");
var mkdirp = require("mkdirp");

require("../../../");
require("./express.js");

require("fluid-webdriver");
fluid.webdriver.loadTestingSupport();

fluid.registerNamespace("fluid.tests.locationBar.caseHolder");

// Common function used to retrieve the query data from the window's location.
fluid.tests.locationBar.getQueryJson = function () {
    return fluid.locationBar.stateManager.queryToJson(window.location.search);
};

// Common function to apply a change to the component's model.
fluid.tests.locationBar.applyChange = function (path, value) {
    var component = fluid.getGlobalValue("locationBarComponent");
    component.applier.change(path, value);
};


// Save coverage data to a file.
fluid.tests.locationBar.caseHolder.saveCoverage = function (that, coverageData) {
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

// Our test caseHolder (based on a standard one from fluid-test-browser).
// TODO: Convert this to use sequences once fluid-express and fluid-webdriver are converted.
fluid.defaults("fluid.tests.locationBar.caseHolder", {
    gradeNames: ["fluid.test.webdriver.caseHolder"],
    coverageDir: "%fluid-location-bar-relay/coverage",
    sequenceEnd: [
        // Retrieve the coverage data.
        {
            func: "{testEnvironment}.webdriver.executeScript",
            args: [fluid.test.webdriver.invokeGlobal, "fluid.getGlobalValue", "window.__coverage__"] // functionPath, fnArgs, environment
        },
        // Save the coverage data.
        {
            event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
            listener: "fluid.tests.locationBar.caseHolder.saveCoverage",
            args:     ["{that}", "{arguments}.0"]
        },
        { func: "{testEnvironment}.events.stopFixtures.fire", args: [] },
        { listener: "fluid.identity", event: "{testEnvironment}.events.onFixturesStopped"}
    ]
});

fluid.defaults("fluid.test.locationBar.testEnvironment", {
    gradeNames: ["fluid.test.webdriver.testEnvironment.withExpress"],
    components: {
        express: {
            type: "fluid.test.locationBar.express"
        }
    }
});
