/*jslint node:true*/

/*global describe, it, before, after, beforeEach, afterEach*/

'use strict';

var CrawlOncePlugin = require('../');

var Webcheck = require('webcheck');
var freeport = require('freeport');
var express = require('express');

describe('Crawl Once Plugin', function () {
    var port;
    before(function (done) {
        var app = express();

        /*jslint unparam: true*/
        app.get('/doNotMiss', function (req, res) {
            res.send('<html><head></head><body><p>index</p></body></html>');
        });
        app.get('/doNotMiss/ignore', function (req, res) {
            res.send('<html><head></head><body><p>ignore</p></body></html>');
        });
        app.get('/miss', function (req, res) {
            res.send('<html><head></head><body><p>missByFilter</p></body></html>');
        });
        /*jslint unparam: false*/

        freeport(function (err, p) {
            if (err) {
                done(err);
            }
            port = p;
            app.listen(port);
            done();
        });
    });

    describe('Basic functions', function () {
        var webcheck, plugin;

        before(function () {
            webcheck = new Webcheck();
            plugin = new CrawlOncePlugin({
                filterUrl: /doNotMiss/
            });
            webcheck.addPlugin(plugin);
            plugin.enable();
        });
        it('should crawl a website if it is not in ignore list', function (done) {
            var crawled;
            webcheck.once('result', function () {
                crawled = true;
            });
            webcheck.crawl({
                url: 'http://localhost:' + port + '/doNotMiss/'
            }, function (err) {
                if (err) {
                    return done(err);
                }
                if (crawled) {
                    return done();
                }
                return done(new Error('Not crawled'));
            });
        });
        it('should not crawl a site a second time', function (done) {
            webcheck.middlewares.push(function () {
                return done(new Error('Crawled again'));
            });
            webcheck.crawl({
                url: 'http://localhost:' + port + '/doNotMiss/'
            }, function (err) {
                if (err) {
                    return done(err);
                }
                webcheck.middlewares = [];
                return done();
            });
        });
        it('should be able to crawl an unfiltered website', function (done) {
            var crawled;
            webcheck.once('result', function () {
                crawled = true;
            });
            webcheck.crawl({
                url: 'http://localhost:' + port + '/miss/'
            }, function (err) {
                if (err) {
                    return done(err);
                }
                if (crawled) {
                    return done();
                }
                return done(new Error('Not crawled'));
            });
        });
        it('should be able to crawl an unfiltered website again', function (done) {
            var crawled;
            webcheck.once('result', function () {
                crawled = true;
            });
            webcheck.crawl({
                url: 'http://localhost:' + port + '/miss/'
            }, function (err) {
                if (err) {
                    return done(err);
                }
                if (crawled) {
                    return done();
                }
                return done(new Error('Not crawled'));
            });
        });
        it('should not crawl a site from ignore list', function (done) {
            plugin.ignore('http://localhost:' + port + '/doNotMiss/ignore');
            webcheck.middlewares.push(function () {
                return done(new Error('Crawled'));
            });
            webcheck.crawl({
                url: 'http://localhost:' + port + '/doNotMiss/ignore'
            }, function (err) {
                if (err) {
                    return done(err);
                }
                webcheck.middlewares = [];
                return done();
            });
        });
        it('should be able to crawl an unfiltered website with another query', function (done) {
            var crawled;
            webcheck.once('result', function () {
                crawled = true;
            });
            webcheck.crawl({
                url: 'http://localhost:' + port + '/doNotMiss/?query'
            }, function (err) {
                if (err) {
                    return done(err);
                }
                if (crawled) {
                    return done();
                }
                return done(new Error('Not crawled'));
            });
        });
    });

    describe('Ignore query', function () {
        var webcheck, plugin;

        before(function () {
            webcheck = new Webcheck();
            plugin = new CrawlOncePlugin({
                filterUrl: /doNotMiss/,
                ignoreQuery: true
            });
            webcheck.addPlugin(plugin);
            plugin.enable();
        });
        it('should crawl a website if it is not in ignore list', function (done) {
            var crawled;
            webcheck.once('result', function () {
                crawled = true;
            });
            webcheck.crawl({
                url: 'http://localhost:' + port + '/doNotMiss/'
            }, function (err) {
                if (err) {
                    return done(err);
                }
                if (crawled) {
                    return done();
                }
                return done(new Error('Not crawled'));
            });
        });
        it('should not crawl a site a second time', function (done) {
            webcheck.middlewares.push(function () {
                return done(new Error('Crawled again'));
            });
            webcheck.crawl({
                url: 'http://localhost:' + port + '/doNotMiss/'
            }, function (err) {
                if (err) {
                    return done(err);
                }
                webcheck.middlewares = [];
                return done();
            });
        });
        it('should be able to crawl an unfiltered website', function (done) {
            var crawled;
            webcheck.once('result', function () {
                crawled = true;
            });
            webcheck.crawl({
                url: 'http://localhost:' + port + '/miss/'
            }, function (err) {
                if (err) {
                    return done(err);
                }
                if (crawled) {
                    return done();
                }
                return done(new Error('Not crawled'));
            });
        });
        it('should be able to crawl an unfiltered website again', function (done) {
            var crawled;
            webcheck.once('result', function () {
                crawled = true;
            });
            webcheck.crawl({
                url: 'http://localhost:' + port + '/miss/'
            }, function (err) {
                if (err) {
                    return done(err);
                }
                if (crawled) {
                    return done();
                }
                return done(new Error('Not crawled'));
            });
        });
        it('should not crawl a site from ignore list', function (done) {
            plugin.ignore('http://localhost:' + port + '/doNotMiss/ignore');
            webcheck.middlewares.push(function () {
                return done(new Error('Crawled'));
            });
            webcheck.crawl({
                url: 'http://localhost:' + port + '/doNotMiss/ignore'
            }, function (err) {
                if (err) {
                    return done(err);
                }
                webcheck.middlewares = [];
                return done();
            });
        });
        it('should not be able to crawl an unfiltered website with another query', function (done) {
            webcheck.middlewares.push(function () {
                return done(new Error('Crawled'));
            });
            webcheck.crawl({
                url: 'http://localhost:' + port + '/doNotMiss/?query'
            }, function (err) {
                if (err) {
                    return done(err);
                }
                webcheck.middlewares = [];
                return done();
            });
        });
    });
});
