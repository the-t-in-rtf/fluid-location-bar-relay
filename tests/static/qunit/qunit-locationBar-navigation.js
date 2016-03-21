/* globals fluid, jqUnit, window */
(function () {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");

    fluid.registerNamespace("gpii.locationBar.tests.locationBar.navigation");

    gpii.locationBar.tests.locationBar.navigation.runTests = function (that) {
        jqUnit.module("Testing locationBar component startup..");

        jqUnit.test("Confirm that we can navigate back and forward...", function () {
            var historyLength = window.history.length;

            // Make some model changes
            that.applier.change("number", 8);
            that.applier.change("number", 7);

            jqUnit.assertEquals("The browser history should be two entries longer...", historyLength + 2, window.history.length);

            jqUnit.assertEquals("The model should have been updated by the change applier...", 7, that.model.number);

            window.history.go(-1);

            // TODO:  Discuss better ways of handling this with Antranig.
            jqUnit.stop();
            setTimeout(function () {
                jqUnit.start();
                jqUnit.assertEquals("We should be able to see the previous model value after hitting the back button once...", 8, that.model.number);

                jqUnit.stop();
                window.history.go(-1);
                setTimeout(function () {
                    jqUnit.start();

                    jqUnit.assertEquals("We should be able to see the original model value after hitting the back button twice...", 1, that.model.number);

                    window.history.go(1);
                    jqUnit.stop();
                    setTimeout(function () {
                        jqUnit.start();
                        jqUnit.assertEquals("We should be able to see the next model value after hitting the forward button...", 8, that.model.number);

                        window.history.go(1);
                        jqUnit.stop();
                        setTimeout(function () {
                            jqUnit.start();
                            jqUnit.assertEquals("We should be able to see the next model value after hitting the forward button...", 7, that.model.number);
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });
    };

    gpii.locationBar.tests.locationBar({
        listeners: {
            "onCreate.runTests": {
                funcName: "gpii.locationBar.tests.locationBar.navigation.runTests",
                args:     ["{that}"]
            }
        }
    });
})();



