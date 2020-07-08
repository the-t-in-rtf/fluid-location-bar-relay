# gpii-location-bar-relay

This is a [Fluid component](http://fluidproject.org/infusion.html) that relays changes between a component's model and
both the browser state and location bar.  This makes your model state "bookmarkable", and makes it so that users can
navigate back and forth through any changes they have made using the browser's back and forward buttons.

It can be used with any component that is served up via a web server.  Although you can write static files that use this
component, it will not work with Chrome because of [their unique security restrictions around file
URLs](http://blog.chromium.org/2008/12/security-in-depth-local-web-pages.html).

For usage details, check out [the documentation](docs).

## Tests

To run the tests in this package, you will need to have Chrome and chromedriver installed.  Once you have both those,
the command `npm test` will run the tests and generate a coverage report.

Because of the need for forward and backward navigation, the tests in this package use
[gpii-webdriver](https://github.com/GPII/gpii-webdriver), which is based on the WebDriver API.  At time of writing,
there is [a bug that prevents Firefox from being used with this package](https://issues.gpii.net/browse/GPII-1913).
