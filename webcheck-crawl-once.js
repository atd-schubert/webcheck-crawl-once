/*jslint node:true*/
'use strict';

var WebcheckPlugin = require('webcheck/plugin');
var url = require('url');

var pkg = require('./package.json');
/**
 * A helper function for empty regular expressions
 * @private
 * @type {{test: Function}}
 */
var emptyFilter = {
    test: function () {
        return true;
    }
};


/**
 * Crawl once plugin for webcheck
 * Do not crawl the same resource multiple
 * @author Arne Schubert <atd.schubert@gmail.com>
 * @param {{}} [opts] - Options for this plugin
 * @param {RegExp|{test:Function}} [opts.filterUrl] - Filter urls
 * @param {boolean} [opts.ignoreQuery] - Should the query part of url ignored
 * @augments Webcheck.Plugin
 * @constructor
 */
var CheerioPlugin = function (opts) {
    var self;
    WebcheckPlugin.apply(this, arguments);

    self = this;

    opts = opts || {};

    // unsupported at the moment but maybe comming in a next version
    // opts.filterContentType = opts.filterContentType || emptyFilter;
    // opts.filterStatusCode = opts.filterStatusCode || emptyFilter;

    opts.filterUrl = opts.filterUrl || emptyFilter;
    opts.ignoreQuery = opts.ignoreQuery || false;

    this.on.queue = function (settings) {
        var parsedUrl;
        if (opts.filterUrl.test(settings.url)) {
            if (opts.ignoreQuery) {
                parsedUrl = url.parse(settings.url);
                if (self.ignore(parsedUrl.protocol + '//' + parsedUrl.host + parsedUrl.pathname)) {
                    settings.preventCrawl = true;
                }
            } else {
                if (self.ignore(settings.url)) {
                    settings.preventCrawl = true;
                }
            }
        }
    };

    this.reset();
};

CheerioPlugin.prototype = {
    '__proto__': WebcheckPlugin.prototype,
    package: pkg,

    /**
     * @type {Array}
     */
    list: null,
    /**
     * Reset an entry or the complete list of already requested resources
     * @param {string} [hash] - Entry to delete
     * @returns {boolean}
     */
    reset: function (hash) {
        if (hash) {
            return delete this.list[hash];
        }
        this.list = {};
    },
    /**
     * Ignore a resource and return if a resource is already in ignore list
     * @param {string} url - Url that should be ignored
     * @returns {boolean} - Is this url already ignored
     */
    ignore: function (url) {
        if (this.list[url]) {
            return true;
        }
        this.list[url] = true;
        return false;
    },
    /**
     * Check if a resource is in ignore list
     * @param url
     * @returns {boolean}
     */
    check: function (url) {
        return !!this.list[url];
    }

};

module.exports = CheerioPlugin;
