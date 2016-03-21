/*

    A component to relay model changes to and from the browser's location bar.  See the docs for details.

*/

// TODO:  Add support for IE using https://github.com/devote/HTML5-History-API or similar polyfill.
"use strict";
/* global fluid, window, document */

(function () {
    var gpii = fluid.registerNamespace("gpii");

    fluid.registerNamespace("gpii.locationBar");

    // Parse a JSON object and return a query string (no leading question mark)
    gpii.locationBar.jsonToQuery = function (data) {
        var queryParts = [];

        fluid.each(data, function (value, key) {
            // If we are passed a literal string, we cannot continue.
            if (!key) { return; }

            // Strip null and undefined values to keep the query string short, while preserving `false` values.
            if (value === undefined || value === null) { return; }

            var valueToEncode = typeof value === "string" ? value : JSON.stringify(value);
            var encodedKey   = encodeURIComponent(key);
            var encodedValue = encodeURIComponent(valueToEncode);
            queryParts.push(encodedKey + "=" + encodedValue);
        });

        return queryParts.join("&");
    };

    // Parse a query string and return a JSON object.
    gpii.locationBar.queryToJson = function (queryString) {
        var queryData = {};

        // Remove the leading question mark if found.
        if (queryString.indexOf("?") === 0) {
            queryString = queryString.substring(1);
        }

        // Split by ampersands
        var queryParts = queryString.split("&");
        queryParts.forEach(function (queryPart) {
            var matches = queryPart.match(/^([^=]+)=(.+)$/);
            if (matches) {
                var key   = matches[1];

                var stringValue = decodeURIComponent(matches[2]);
                var value = stringValue;
                try {
                    value = JSON.parse(stringValue);
                }
                catch (e) {
                    // Do nothing
                }

                queryData[key] = value;
            }
        });

        return queryData;
    };

    // Load model data from the query string and apply it to the model.
    gpii.locationBar.queryToModel = function (that) {
        if (that.options.queryToModel) {
            var queryData = gpii.locationBar.queryToJson(window.location.search);
            var newModelData = fluid.model.transformWithRules(queryData, that.options.rules.queryToModel);

            gpii.locationBar.batchChanges(that, newModelData, false);

            that.events.queryDataLoaded.fire(that);
        }
    };

    // Listen for any model changes and update the query string to include the current model state.
    gpii.locationBar.update = function (that) {
        var queryData = fluid.model.transformWithRules(that.model, that.options.rules.modelToQuery);
        var queryString = gpii.locationBar.jsonToQuery(queryData);

        // Combine the "origin" with the "path" to get the URL minus any existing query data
        var updatedURL = window.location.origin + window.location.pathname + "?" + queryString;

        var stateData = that.options.modelToState ? fluid.model.transformWithRules(that.model, that.options.rules.modelToState) : {};

        // Add a new history entry
        if (window.history) {
            if (that.options.addNewHistoryEntry) {
                if (window.history.pushState) {
                    window.history.pushState(stateData, document.title, updatedURL);
                }
            }
            // Update the existing location
            else if (window.history.replaceState) {
                window.history.replaceState(stateData, document.title, updatedURL);
            }
        }
    };

    // Apply all changes in a single transaction.  Also ensures that values flagged with `null` are deleted from the model.
    gpii.locationBar.batchChanges = function (that, changeSet, deleteExisting) {
        var myTransaction = that.applier.initiate();

        if (deleteExisting) {
            // If we are loading the entire model from the state, we must clear out existing values to avoid revealing
            // data from the future (Spoilers!)
            myTransaction.fireChangeRequest({ path: "", type: "DELETE"});
        }

        fluid.each(changeSet, function (value, key) {
            var change = { path: key };
            if (value === undefined || value === null) {
                change.type = "DELETE";
            }
            else {
                change.value = value;
            }
            myTransaction.fireChangeRequest(change);
        });

        myTransaction.commit();
    };

    // Enable our browser back/forward listener.
    gpii.locationBar.bindStateToModel = function (that) {
        if (that.options.stateToModel) {
            window.onpopstate = that.handleStateChange;
        }
    };

    // Update the model using the recorded history when the back/forward button is pressed.
    gpii.locationBar.handleStateChange = function (that, event) {
        var newModelData = fluid.model.transformWithRules(event.state, that.options.rules.stateToModel);

        gpii.locationBar.batchChanges(that, newModelData, true);
    };

    fluid.defaults("gpii.locationBar", {
        gradeNames: ["fluid.modelComponent"],
        addNewHistoryEntry: true,
        modelToQuery:       true,
        queryToModel:       true,
        modelToState:       true,
        stateToModel:       true,
        invokers: {
            handleStateChange: {
                funcName: "gpii.locationBar.handleStateChange",
                args:     ["{that}", "{arguments}.0"]
            }
        },
        listeners: {
            "onCreate.queryToModel": {
                funcName: "gpii.locationBar.queryToModel",
                args:     ["{that}"]
            },
            "onCreate.bindStateToModel": {
                funcName: "gpii.locationBar.bindStateToModel",
                args:     ["{that}"]
            }
        },
        events: {
            queryDataLoaded: null
        },
        mergePolicy: {
            rules: "nomerge"
        },
        rules: {
            modelToQuery: { "": "" },
            queryToModel: { "": "" },
            modelToState: { "": "" },
            stateToModel: { "": "" }
        },
        modelListeners: {
            "*": {
                funcName:      "gpii.locationBar.update",
                args:          ["{locationBar}"],
                excludeSource: "init"
            }
        }
    });
})();

