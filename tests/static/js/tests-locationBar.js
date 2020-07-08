/* globals fluid */
(function () {
    "use strict";

    fluid.defaults("fluid.tests.locationBar.locationBar", {
        gradeNames: ["fluid.locationBar"],
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
