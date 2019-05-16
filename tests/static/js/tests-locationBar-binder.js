/* globals fluid */
(function () {
    "use strict";

    fluid.defaults("gpii.locationBar.tests.binder", {
        gradeNames: ["gpii.locationBar", "fluid.viewComponent"],
        selectors: {
            radio: "input[name='radio']"
        },
        bindings: {
            "radio": "radio"
        },
        model: {
            radio: "four"
        },
        listeners: {
            "onCreate.applyBindings": {
                "funcName": "gpii.binder.applyBinding",
                "args":     "{that}"
            }
        }
    });
})();
