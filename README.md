# gpii-locationBar-relay

This is a [Fluid component](http://fluidproject.org/infusion.html) that relays changes between a component's model and
both the browser state and location bar.  This makes your model state "bookmarkable", and makes it so that users can
navigate back and forth through any changes they have made using the browser's back and forward buttons.

It can be used with any component that is served up via a web server.  Although you can write static files that use this
component, it will not work with Chrome because of [their unique security restrictions around file
URLs](http://blog.chromium.org/2008/12/security-in-depth-local-web-pages.html).

For usage details, check out [the documentation](docs).
