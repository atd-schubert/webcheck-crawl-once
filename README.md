# webcheck-crawl-once
A plugin for [webcheck](https://github.com/atd-schubert/node-webcheck) to prevent multiple downloads of the same
resource.

## How to install

```bash
npm install --save webcheck-crawl-once
```

## How to use

```js
var Webcheck = require('webcheck');
var CrawlOncePlugin = require('webcheck-crawl-once');

var plugin = CrawlOncePlugin({
    filterUrl:
    ignoreQuery: false,
});

var webcheck = new Webcheck();
webcheck.addPlugin(plugin);

plugin.enable();

// now continue with your code...

```

## Options

- `filterUrl`: Filter urls that should only crawled once (default all urls).
- `ignoreQuery`: Ignore query in url.

### Note for filters

Filters are regular expressions, but the plugin uses only the `.test(str)` method to proof. You are able to write
your own and much complexer functions by writing the logic in the test method of an object like this:

```js
opts = {
   filterSomething: {
       test: function (val) {
           return false || true;
       }
   }
}
```

## Methods

- `reset(undefined | url)`: Reset a specific url, or the complete ignore list
- `ignore(url)`: Add a resource to ignore list
- `check(url)`: Check if a resource is ignored
