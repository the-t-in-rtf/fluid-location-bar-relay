/* eslint-env node */
"use strict";
var fluid = require("infusion");
fluid.setLogging(true);

var gpii = fluid.registerNamespace("gpii");

require("./express");

gpii.test.locationBar.express({
    port: 6984
});
