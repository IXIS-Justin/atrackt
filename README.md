# atrackt
---

A script for making tracking easier.

## Dependencies

* [jQuery](http://jquery.com)

### Optional (But Recommended)

* [Live Query](https://github.com/brandonaaron/livequery)
  * Allows tracking new elements added to the page after the initial load (via ajax, etc.)

## Usage

* Download the [script](https://raw.github.com/brewster1134/atrackt/master/js/atrackt.js) _(right-click & save as)_
* Add the script to your page
  * `<script src="atrackt.js"></script>`
* Add a plugin to your page _([or write your own!](#registering-plugins))_
  * `<script src="atrackt.siteCatalyst.js"></script>`

That's it!  The settings from your plugin will register events to elements and start tracking!

### Advanced Usage

To manually track any JS object, just pass it as an argument to the track method.

```coffee
Atrackt.track(object)
```

If you add new elements to your page (and are not using liveQuery) you can scan the dom again and re-bind elements.

```coffee
Atrackt.refresh()
```

#### Registering Plugins

Common plugins can be found in `js/plugins` and will self-register themselves by including them on your page, but if you would like custom tracking, you can quickly create a new plugin by calling the `registerPlugin` method.

The minimum a plugin needs is a `send` method.  This is a function that accepts a tracking object as an argument.  From here, you can do additional processing on the object and send it where ever you like to track it.

```coffee
Atrackt.registerPlugin 'testPlugin',
  send: (obj) ->
    # do stuff to the object and send it somewhere
```

Typically just creating a send method for you to manually track objects is not enough.  Normally you want to bind a whole bunch of elements to an event _(or events)_ to track.

You can accomplish this by passing an events object.  The events object accepts a click event as the key, and an array of jquery selectors as the value.  Any matching selectors will be bound and tracked when that event fires.

```coffee
Atrackt.registerPlugin 'testPlugin',
  send: (obj) ->
    # do stuff to the object and send it somewhere
  events:
    # track every anchor on click
    click: ['a']
    # track every anchor and button on hover
    hover: ['a', 'button' ]
```

## Debugging Console

To better visualize what elements are being tracked, you can add `?debugTracking=true` to the end of any URL to show the debugging console.

It is a bit crude, but it gives you a visual overview of your elements.

* The console shows all the elements currently being tracked, along with their various values.
* If you hover over an element in your console, it will scroll to that element on your page and highlight it.
* If you hover over an element on your page, it will show you the data object that is being passed to your plugin(s).
* The debugger will also show you errors if you have any.  For example if you have multiple elements on your page that are tracking the exact same data, they will turn red and show the error in the error column.

## Demo

Download the project and open `demo/index.html` in your browser.

Visit `demo/index.html?debugTracking=true` to view the debugging console.

## Development

### Dependencies

* [CoffeeScript](http://coffeescript.org)

Do **NOT** modify `atrackt.js` directly.  Modify `src/atrackt.coffee` and generate `atrackt.js`.

The can be done by either running testem _(see the [Testing](#testing) section below)_, or by compiling with CoffeeScript directly.

`coffee -o js/ -c src/atrackt.coffee && coffee -o js/plugins/ -c src/plugins/*.coffee`

## Testing

### Dependencies

* [Node.js](http://nodejs.org)
* [Testem](https://github.com/airportyh/testem)

### Optional

* [PhantomJS](http://phantomjs.org)

Simply run `testem`
