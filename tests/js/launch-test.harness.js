// TODO:  Remove this once testem is confirmed working
// A convenience script to start up a copy of the test harness for manual QA.  You can also just use `testem`.
//
/* eslint-env node */
"use strict";
var fluid = require("infusion");
fluid.setLogging(true);

var gpii = fluid.registerNamespace("gpii");

require("./lib/harness");

gpii.locationBar.tests.harness({
    port:  "9918"
});
