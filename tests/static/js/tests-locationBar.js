/* globals fluid */
(function () {
    "use strict";

    fluid.defaults("gpii.locationBar.tests.locationBar", {
        gradeNames: ["gpii.locationBar"],
        model: {
            number: 1,
            string: "this works",
            array: ["one", "two", "three"],
            object: {
                element: "exists"
            }
        }
    });
})();

