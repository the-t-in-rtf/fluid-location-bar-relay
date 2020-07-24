(function () {
    "use strict";

    fluid.defaults("fluid.tests.locationBar.noStateToModel", {
        gradeNames: ["fluid.locationBar"],
        modelToState: false,
        modelToQuery: false,
        queryToModel: false,
        stateToModel: false,
        model: {
            fromInitialModel: true
        }
    });
})();
