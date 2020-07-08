/* globals fluid */
(function () {
    "use strict";

    fluid.defaults("fluid.tests.locationBar.binder", {
        gradeNames: ["fluid.locationBar", "fluid.viewComponent"],
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
                "funcName": "fluid.binder.applyBinding",
                "args":     "{that}"
            }
        }
    });
})();
