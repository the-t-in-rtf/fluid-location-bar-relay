(function () {
    "use strict";

    fluid.defaults("fluid.tests.locationBar.modelToQuery", {
        gradeNames: ["fluid.locationBar"],
        modelToState: false,
        modelToQuery: true,
        queryToModel: false,
        model: {
            fromInitialModel: true
        }
    });
})();
