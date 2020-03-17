(function () {
    "use strict";

    fluid.defaults("gpii.tests.locationBar.modelToState", {
        gradeNames: ["gpii.locationBar"],
        modelToState: true,
        modelToQuery: false,
        queryToModel: false,
        model: {
            fromInitialModel: true
        }
    });
})();
