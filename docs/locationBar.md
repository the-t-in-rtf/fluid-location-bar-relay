# `gpii.locationBar`

A component that relays changes between its model and both the browser's location bar and history.  It:

1. Publishes model changes to the query string portion of the location bar.   This completely replaces the current query data in the location bar, so you should preserve any variables you care about as part of your model and rules.
2. Parses the initial query string and publishes that data to the model.
3. Publishes model data to the browser history `state` object.
4. Publishes state data from the browser history to the model when the state changes (such as when the back and forward button are hit).

Each of these interactions is enabled by default, but can be individually disabled. See "Component Options" below for
more details.  Each of these interactions is controlled by [model transformation rules](http://docs.fluidproject.org/infusion/development/ModelTransformationAPI.html#fluid-model-transformwithrules-source-rules-options-).
This allows you to:

1. Control which options are relayed.
2. Rename or otherwise manipulate variables before relaying them.

See "Component Options" below for more details.

## Usage

If you want to sync all model changes with the state and the location bar, you can simply add the
`gpii.locationBar` grade to your component's `gradeNames` (see below).  All model data will be synced with the
location bar and browser state.  If you want fuller control, update the `rules` options (see below) to control which
model variables are relayed.

For detailed examples of usage, see the tests in this package.

## *WARNING*: Do not use multiple instances of this component on the same page!

This component is only intended to be used once on a given page.  The behavior when two or more instances operate on
the same page is not tested, and may result in unwanted behavior like:

1. Model data being published from one component to another unexpectedly.
2. Model data stored in the browser history or location bar being lost when a second, third, etc. component attempts to save its changes.

You have been warned...

## Query String Encoding

All query string values are encoded and decoded using the functions provided by the [gpii-express](http://github.com/GPII/gpii-express/)
package.   See that package for more details.

## Component Options

| Option               | Type        | Description |
| -------------------- | ----------- | ----------- |
| `addNewHistoryEntry` | `{Boolean}` | If this is `true`, add a new history entry for each model change.  If this is `false`, update the current history entry instead.  Defaults to `true`. |
| `modelListener`      | `{Object}`  | The [model listener definition block](http://docs.fluidproject.org/infusion/development/ChangeApplierAPI.html#model-listener-declaration) that controls which model changes are listened to. You should not need to change this. |
| `modelToQuery`       | `{Boolean}` | If this is `true`, publish the model to the location bar on startup, and when the model changes.  Defaults to `true`. |
| `modelToState`       | `{Boolean}` | If this is `true`, save the model to the state when creating history entries.  Defaults to `true`. |
| `queryToModel`       | `{Boolean}` | If this is `true`, parse the query on startup and update the model (see below for rules).  Defaults to `true`. |
| `rules`              | `{Object}`  | The model transformation rules that govern how information is relayed (see individual rules below for details). This option is not merged, which means any options you define will override inherited options completely. |
| `rules.modelToQuery` | `{Object}`  | Rules that control what (if any) model data is converted into query parameters in the current window's location.  The final output is a JSON object keyed by the query parameter name.  Each key's contents will be converted to a string using `JSON.stringify()` and URL encoded. Only relevant if `modelToQuery` is enabled. |
| `rules.modelToState` | `{Object}`  | Rules that control what (if any) model data should be stored in the browser's history.  This is only relevant if `modelToState` is enabled. |
| `rules.queryToModel` | `{Object}`  | Rules that control what (if any) query data should be applied as a change to the current model.  This only takes place when the component is created, and only if `queryToModel` is enabled. |
| `rules.stateToModel` | `{Object}`  | Rules that control what (if any) state data should be applied as a change to the current model. This is only relevant if `stateToModel` is enabled. |
| `stateToModel`       | `{Boolean}` | If this is `true`, listen for history changes and update the model with the saved state.  Defaults to `true`. |

On startup, the following happens in order:

1. If `queryToModel` is `true` (as it is by default), any data in the query string is applied to the model as a change.
2. If `modelToState` is `true` (as it is by default), any data in the initial model is relayed to the browser history as part of the current state.

From that point on, any model changes are relayed to the state if `modelToState` is `true`, and to the URL (as query
string data) if `modelToQuery` is `true`.  State changes (hitting the browser's "back" button, for example) are monitored,
and if `stateToModel` is `true`, then the model is updated to reflect its previous values.