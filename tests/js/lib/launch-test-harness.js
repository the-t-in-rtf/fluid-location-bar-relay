/* eslint-env node */
"use strict";
var fluid = require("infusion");
fluid.setLogging(true);

require("./express");

fluid.test.locationBar.express({
    port: 6984
});
