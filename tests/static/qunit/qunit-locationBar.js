/* globals fluid, jqUnit, window */
(function () {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");

    fluid.registerNamespace("gpii.locationBar.tests.locationBar");

    gpii.locationBar.tests.locationBar.runTests = function (that) {
        jqUnit.module("Testing locationBar component..");

        jqUnit.test("Confirm that data is synchronized correctly on startup...", function () {
            // TODO:  This fails with Safari (and only Safari).  Discuss with Antranig
            jqUnit.assertDeepEq("The combined model data should include the updates from the location bar and our default data...", that.options.expected.modelAfterStartup, that.model);

            jqUnit.assertDeepEq("The window history state should include updates from the location bar and our default data...", that.options.expected.modelAfterStartup, window.history.state);

            var queryStringJson = gpii.locationBar.queryToJson(window.location.search);
            jqUnit.assertDeepEq("The query string in the location bar should include updates from the location bar and our default data...", that.options.expected.modelAfterStartup, queryStringJson);
        });
    };

    gpii.locationBar.tests.locationBar({
        expected: {
            modelAfterStartup: {
                number: 2,
                string: "this works",
                array: ["one", "two", "three"],
                object: {
                    element: "exists"
                }
            }
        },
        listeners: {
            "onCreate.runTests": {
                funcName: "gpii.locationBar.tests.locationBar.runTests",
                args:     ["{that}"]
            }
        }
    });
})();



