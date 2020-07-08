(function () {
    "use strict";

    fluid.defaults("fluid.tests.locationBar.queryToModel", {
        gradeNames: ["fluid.locationBar"],
        modelToState: false,
        modelToQuery: false,
        queryToModel: true,
        model: {
            baz: true
        }
    });
})();
