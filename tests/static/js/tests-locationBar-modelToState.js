(function () {
    "use strict";

    fluid.defaults("fluid.tests.locationBar.modelToState", {
        gradeNames: ["fluid.locationBar"],
        modelToState: true,
        modelToQuery: false,
        queryToModel: false,
        model: {
            fromInitialModel: true
        }
    });
})();
