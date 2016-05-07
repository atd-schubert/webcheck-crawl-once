/// <reference path="../typings/main.d.ts" />

import { CrawlOncePlugin } from '../webcheck-crawl-once';
import { Webcheck } from 'webcheck';
import * as freeport from 'freeport';
import * as express from 'express';

/* tslint:disable:align */

describe('Crawl Once Plugin', (): void => {
    var port: number;
    before((done: MochaDone): void => {
        var app: express.Application = express();

        app.get('/doNotMiss', (req: express.Request, res: express.Response): void => {
            res.send('<html><head></head><body><p>index</p></body></html>');
        });
        app.get('/doNotMiss/ignore', (req: express.Request, res: express.Response): void => {
            res.send('<html><head></head><body><p>ignore</p></body></html>');
        });
        app.get('/miss', (req: express.Request, res: express.Response): void => {
            res.send('<html><head></head><body><p>missByFilter</p></body></html>');
        });

        freeport((err: Error, p: number): void => {
            if (err) {
                done(err);
            }
            port = p;
            app.listen(port);
            done();
        });
    });

    describe('Basic functions', (): void => {
        var webcheck: Webcheck,
            plugin: CrawlOncePlugin;

        before((): void => {
            webcheck = new Webcheck({});
            plugin = new CrawlOncePlugin({
                filterUrl: /doNotMiss/
            });
            webcheck.addPlugin(plugin);
            plugin.enable();
        });
        it('should crawl a website if it is not in ignore list', (done: MochaDone): void => {
            var crawled: boolean;
            webcheck.once('result', (): void => {
                crawled = true;
            });
            webcheck.crawl({
                url: 'http://localhost:' + port + '/doNotMiss/'
            }, (err: Error): void => {
                if (err) {
                    return done(err);
                }
                if (crawled) {
                    return done();
                }
                return done(new Error('Not crawled'));
            });
        });
        it('should not crawl a site a second time', (done: MochaDone): void => {
            webcheck.middlewares.push((): void => {
                return done(new Error('Crawled again'));
            });
            webcheck.crawl({
                url: 'http://localhost:' + port + '/doNotMiss/'
            }, (err: Error): void => {
                if (err) {
                    return done(err);
                }
                webcheck.middlewares = [];
                return done();
            });
        });
        it('should be able to crawl an unfiltered website', (done: MochaDone): void => {
            var crawled: boolean;
            webcheck.once('result', (): void => {
                crawled = true;
            });
            webcheck.crawl({
                url: 'http://localhost:' + port + '/miss/'
            }, (err: Error): void => {
                if (err) {
                    return done(err);
                }
                if (crawled) {
                    return done();
                }
                return done(new Error('Not crawled'));
            });
        });
        it('should be able to crawl an unfiltered website again', (done: MochaDone): void => {
            var crawled: boolean;
            webcheck.once('result', (): void => {
                crawled = true;
            });
            webcheck.crawl({
                url: 'http://localhost:' + port + '/miss/'
            }, (err: Error): void => {
                if (err) {
                    return done(err);
                }
                if (crawled) {
                    return done();
                }
                return done(new Error('Not crawled'));
            });
        });
        it('should not crawl a site from ignore list', (done: MochaDone): void => {
            plugin.ignore('http://localhost:' + port + '/doNotMiss/ignore');
            webcheck.middlewares.push((): void => {
                return done(new Error('Crawled'));
            });
            webcheck.crawl({
                url: 'http://localhost:' + port + '/doNotMiss/ignore'
            }, (err: Error): void => {
                if (err) {
                    return done(err);
                }
                webcheck.middlewares = [];
                return done();
            });
        });
        it('should be able to crawl an unfiltered website with another query', (done: MochaDone): void => {
            var crawled: boolean;
            webcheck.once('result', (): void => {
                crawled = true;
            });
            webcheck.crawl({
                url: 'http://localhost:' + port + '/doNotMiss/?query'
            }, (err: Error): void => {
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

    describe('Ignore query', (): void => {
        var webcheck: Webcheck,
            plugin: CrawlOncePlugin;

        before((): void => {
            webcheck = new Webcheck({});
            plugin = new CrawlOncePlugin({
                filterUrl: /doNotMiss/,
                ignoreQuery: true
            });
            webcheck.addPlugin(plugin);
            plugin.enable();
        });
        it('should crawl a website if it is not in ignore list', (done: MochaDone): void => {
            var crawled: boolean;
            webcheck.once('result', (): void => {
                crawled = true;
            });
            webcheck.crawl({
                url: 'http://localhost:' + port + '/doNotMiss/'
            }, (err: Error): void => {
                if (err) {
                    return done(err);
                }
                if (crawled) {
                    return done();
                }
                return done(new Error('Not crawled'));
            });
        });
        it('should not crawl a site a second time', (done: MochaDone): void => {
            webcheck.middlewares.push((): void => {
                return done(new Error('Crawled again'));
            });
            webcheck.crawl({
                url: 'http://localhost:' + port + '/doNotMiss/'
            }, (err: Error): void => {
                if (err) {
                    return done(err);
                }
                webcheck.middlewares = [];
                return done();
            });
        });
        it('should be able to crawl an unfiltered website', (done: MochaDone): void => {
            var crawled: boolean;
            webcheck.once('result', (): void => {
                crawled = true;
            });
            webcheck.crawl({
                url: 'http://localhost:' + port + '/miss/'
            }, (err: Error): void => {
                if (err) {
                    return done(err);
                }
                if (crawled) {
                    return done();
                }
                return done(new Error('Not crawled'));
            });
        });
        it('should be able to crawl an unfiltered website again', (done: MochaDone): void => {
            var crawled: boolean;
            webcheck.once('result', (): void => {
                crawled = true;
            });
            webcheck.crawl({
                url: 'http://localhost:' + port + '/miss/'
            }, (err: Error): void => {
                if (err) {
                    return done(err);
                }
                if (crawled) {
                    return done();
                }
                return done(new Error('Not crawled'));
            });
        });
        it('should not crawl a site from ignore list', (done: MochaDone): void => {
            plugin.ignore('http://localhost:' + port + '/doNotMiss/ignore');
            webcheck.middlewares.push((): void => {
                return done(new Error('Crawled'));
            });
            webcheck.crawl({
                url: 'http://localhost:' + port + '/doNotMiss/ignore'
            }, (err: Error): void => {
                if (err) {
                    return done(err);
                }
                webcheck.middlewares = [];
                return done();
            });
        });
        it('should not be able to crawl an unfiltered website with another query', (done: MochaDone): void => {
            webcheck.middlewares.push((): void => {
                return done(new Error('Crawled'));
            });
            webcheck.crawl({
                url: 'http://localhost:' + port + '/doNotMiss/?query'
            }, (err: Error): void => {
                if (err) {
                    return done(err);
                }
                webcheck.middlewares = [];
                return done();
            });
        });
    });
});
