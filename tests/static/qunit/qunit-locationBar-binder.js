/* globals fluid, jqUnit, $, window */
(function () {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");

    fluid.registerNamespace("gpii.locationBar.tests.binder");

    gpii.locationBar.tests.binder.runTests = function (that) {
        jqUnit.module("Testing locationBar with gpii-binder...");

        jqUnit.test("Confirm that query data is passed through to the model and the form...", function () {
            jqUnit.assertEquals("The initial model data should have been updated from the query...", "two", that.model.radio);

            var element = $("input[name='radio']:checked");
            jqUnit.assertEquals("The form element should have been updated from the query...", "two", element.val());
        });

        jqUnit.test("Confirm that form changes are passed to the model and the state...", function () {
            $("input[value='three']").click();
            jqUnit.stop();
            setTimeout(function () {
                jqUnit.start();
                jqUnit.assertEquals("The model data should have been updated...", "three", that.model.radio);
                jqUnit.assertEquals("The window state should have been updated...", "three", window.history.state.radio);

            }, 250);
        });

        jqUnit.test("Confirm that state changes are passed to the form...", function () {
            window.history.back();
            jqUnit.stop();
            setTimeout(function () {
                jqUnit.start();
                jqUnit.assertEquals("The initial model data should have been updated from the query...", "two", that.model.radio);

                var element = $("input[name='radio']:checked");
                jqUnit.assertEquals("The form element should have been updated from the query...", "two", element.val());
            }, 100);
        });
    };
    

    gpii.locationBar.tests.binder(".locationBar-binder-form", {
        listeners: {
            "onCreate.runTests": {
                funcName: "gpii.locationBar.tests.binder.runTests",
                args:     ["{that}"]
            }
        }
    });
})();



