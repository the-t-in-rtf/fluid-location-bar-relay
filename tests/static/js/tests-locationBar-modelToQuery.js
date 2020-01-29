(function () {
    "use strict";

    fluid.defaults("gpii.tests.locationBar.modelToQuery", {
        gradeNames: ["gpii.locationBar"],
        modelToState: false,
        modelToQuery: true,
        queryToModel: false,
        model: {
            fromInitialModel: true
        }
    });
})();
