/* globals fluid, window */
(function () {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");

    fluid.registerNamespace("gpii.locationBar.tests.locationBar.navigation");

    gpii.locationBar.tests.locationBar.navigation.go = function (steps) {
        window.history.go(steps);
    };

    fluid.defaults("gpii.locationBar.tests.locationBar.navigation.caseHolder", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [
            {
                tests: [
                    {
                        name: "Confirm that we can navigate backward...",
                        type: "test",
                        sequence: [
                            {
                                func: "{testEnvironment}.events.startTest.fire"
                            },
                            {
                                func: "{testEnvironment}.locationBar.applier.change",
                                args: ["number", 8]
                            },
                            {
                                func: "gpii.locationBar.tests.locationBar.navigation.go",
                                args: [-1]
                            },
                            {
                                event:    "{testEnvironment}.locationBar.events.onModelChanged",
                                listener: "jqUnit.assertEquals",
                                args:     ["We should be able to see the previous model value after hitting the back button...", 1, "{testEnvironment}.locationBar.model.number"]
                            }
                        ]
                    },
                    {
                        name: "Confirm that we can navigate forward...",
                        type: "test",
                        sequence: [
                            {
                                func: "{testEnvironment}.events.startTest.fire"
                            },
                            {
                                event: "{testEnvironment}.locationBar.events.onModelChanged",
                                func: "{testEnvironment}.locationBar.applier.change",
                                args: ["number", 3]
                            },
                            {
                                event: "{testEnvironment}.locationBar.events.onModelChanged",
                                func: "{testEnvironment}.locationBar.applier.change",
                                args: ["number", 4]
                            },
                            {
                                event:    "{testEnvironment}.locationBar.events.onModelChanged",
                                listener: "gpii.locationBar.tests.locationBar.navigation.go",
                                args:     [-1]
                            },
                            {
                                event:    "{testEnvironment}.locationBar.events.onModelChanged",
                                listener: "jqUnit.assertEquals",
                                args:     ["We should be able to see the previous model value after hitting the back button...", 3, "{testEnvironment}.locationBar.model.number"]
                            },
                            {
                                func: "gpii.locationBar.tests.locationBar.navigation.go",
                                args: [1]
                            },
                            {
                                event:    "{testEnvironment}.locationBar.events.onModelChanged",
                                listener: "jqUnit.assertEquals",
                                args:     ["We should be able to see the latest model value after going backward and forward...", 4, "{testEnvironment}.locationBar.model.number"]
                            }
                        ]
                    }
                    //         window.history.go(-1);
                    //             jqUnit.assertEquals("We should be able to see the previous model value after hitting the back button once...", 8, that.model.number);
                    //
                    //             window.history.go(-1);
                    //                 jqUnit.assertEquals("We should be able to see the original model value after hitting the back button twice...", 1, that.model.number);
                    //
                    //                 window.history.go(1);
                    //                     jqUnit.assertEquals("We should be able to see the next model value after hitting the forward button...", 8, that.model.number);
                    //
                    //                     window.history.go(1);
                    //                         jqUnit.assertEquals("We should be able to see the next model value after hitting the forward button...", 7, that.model.number);
                ]
            }
        ]
    });

    fluid.defaults("gpii.locationBar.tests.locationBar.navigation.testEnvironment", {
        gradeNames: ["fluid.test.testEnvironment"],
        events: {
            startTest: null
        },
        components: {
            caseHolder: {
                type: "gpii.locationBar.tests.locationBar.navigation.caseHolder"
            },
            locationBar: {
                type: "gpii.locationBar.tests.locationBar",
                createOnEvent: "startTest",
                options: {
                    events: {
                        onModelChanged: null
                    },
                    listeners: {
                        "onCreate.bindRelay": {
                            func: "{that}.applier.modelChanged.addListener",
                            args: ["*", "{that}.events.onModelChanged.fire"]
                        }
                    }
                }
            }
        }
    });

    gpii.locationBar.tests.locationBar.navigation.testEnvironment();

    // gpii.locationBar.tests.locationBar.navigation.runTests = function (that) {
    //     jqUnit.module("Testing locationBar component startup..");
    //
    //     jqUnit.test("Confirm that we can navigate back and forward...", function () {
    //         var historyLength = window.history.length;
    //
    //         // Make some model changes
    //         that.applier.change("number", 8);
    //         that.applier.change("number", 7);
    //
    //         jqUnit.assertEquals("The browser history should be two entries longer...", historyLength + 2, window.history.length);
    //
    //         jqUnit.assertEquals("The model should have been updated by the change applier...", 7, that.model.number);
    //
    //         window.history.go(-1);
    //
    //         // TODO:  Discuss better ways of handling this with Antranig.
    //         jqUnit.stop();
    //         setTimeout(function () {
    //             jqUnit.start();
    //             jqUnit.assertEquals("We should be able to see the previous model value after hitting the back button once...", 8, that.model.number);
    //
    //             jqUnit.stop();
    //             window.history.go(-1);
    //             setTimeout(function () {
    //                 jqUnit.start();
    //
    //                 jqUnit.assertEquals("We should be able to see the original model value after hitting the back button twice...", 1, that.model.number);
    //
    //                 window.history.go(1);
    //                 jqUnit.stop();
    //                 setTimeout(function () {
    //                     jqUnit.start();
    //                     jqUnit.assertEquals("We should be able to see the next model value after hitting the forward button...", 8, that.model.number);
    //
    //                     window.history.go(1);
    //                     jqUnit.stop();
    //                     setTimeout(function () {
    //                         jqUnit.start();
    //                         jqUnit.assertEquals("We should be able to see the next model value after hitting the forward button...", 7, that.model.number);
    //                     }, 100);
    //                 }, 100);
    //             }, 100);
    //         }, 100);
    //     });
    // };
    //
    // gpii.locationBar.tests.locationBar({
    //     listeners: {
    //         "onCreate.runTests": {
    //             funcName: "gpii.locationBar.tests.locationBar.navigation.runTests",
    //             args:     ["{that}"]
    //         }
    //     }
    // });
})();



