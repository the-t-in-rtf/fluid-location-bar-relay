(function () {
    "use strict";

    fluid.defaults("gpii.tests.locationBar.noStateToModel", {
        gradeNames: ["gpii.locationBar"],
        modelToState: false,
        modelToQuery: false,
        queryToModel: false,
        stateToModel: false,
        model: {
            fromInitialModel: true
        }
    });
})();
