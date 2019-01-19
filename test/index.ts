import * as express from "express";
import * as freeport from "freeport";
import { Server } from "http";
import { Webcheck } from "webcheck";
import { CrawlOncePlugin } from "../";

describe("Crawl Once Plugin", (): void => {
    let port: number;
    let server: Server;
    before((done: Mocha.Done): void => {
        const app: express.Application = express();

        app.get("/doNotMiss", (req: express.Request, res: express.Response): void => {
            res.send(`<html><head></head><body><p>index</p></body></html>`);
        });
        app.get("/doNotMiss/ignore", (req: express.Request, res: express.Response): void => {
            res.send(`<html><head></head><body><p>ignore</p></body></html>`);
        });
        app.get("/miss", (req: express.Request, res: express.Response): void => {
            res.send(`<html><head></head><body><p>missByFilter</p></body></html>`);
        });

        freeport((err: Error, p: number): void => {
            if (err) {
                done(err);
            }
            port = p;
            server = app.listen(port);
            done();
        });
    });
    after((done: Mocha.Done) => {
        server.close(done);
    });

    describe("Basic functions", (): void => {
        const webcheck = new Webcheck();
        const plugin: CrawlOncePlugin = new CrawlOncePlugin({
            filterUrl: /doNotMiss/,
        });
        before((): void => {
            webcheck.addPlugin(plugin);
            plugin.enable();
        });
        it("should crawl a website if it is not in ignore list", (done: Mocha.Done): void => {
            let crawled: boolean;
            webcheck.once("result", (): void => {
                crawled = true;
            });
            webcheck.crawl({
                url: "http://localhost:" + port + "/doNotMiss/",
            }, (err?: Error | null): void => {
                if (err) {
                    return done(err);
                }
                if (crawled) {
                    return done();
                }
                return done(new Error("Not crawled"));
            });
        });
        it("should not crawl a site a second time", (done: Mocha.Done): void => {
            webcheck.middlewares.push((): void => {
                return done(new Error("Crawled again"));
            });
            webcheck.crawl({
                url: "http://localhost:" + port + "/doNotMiss/",
            }, (err?: Error | null): void => {
                if (err) {
                    return done(err);
                }
                webcheck.middlewares.length = 0;
                return done();
            });
        });
        it("should be able to crawl an unfiltered website", (done: Mocha.Done): void => {
            let crawled: boolean;
            webcheck.once("result", (): void => {
                crawled = true;
            });
            webcheck.crawl({
                url: "http://localhost:" + port + "/miss/",
            }, (err?: Error | null): void => {
                if (err) {
                    return done(err);
                }
                if (crawled) {
                    return done();
                }
                return done(new Error("Not crawled"));
            });
        });
        it("should be able to crawl an unfiltered website again", (done: Mocha.Done): void => {
            let crawled: boolean;
            webcheck.once("result", (): void => {
                crawled = true;
            });
            webcheck.crawl({
                url: "http://localhost:" + port + "/miss/",
            }, (err?: Error | null): void => {
                if (err) {
                    return done(err);
                }
                if (crawled) {
                    return done();
                }
                return done(new Error("Not crawled"));
            });
        });
        it("should not crawl a site from ignore list", (done: Mocha.Done): void => {
            plugin.ignore("http://localhost:" + port + "/doNotMiss/ignore");
            webcheck.middlewares.push((): void => {
                return done(new Error("Crawled"));
            });
            webcheck.crawl({
                url: "http://localhost:" + port + "/doNotMiss/ignore",
            }, (err?: Error | null): void => {
                if (err) {
                    return done(err);
                }
                webcheck.middlewares.length = 0;
                return done();
            });
        });
        it("should be able to crawl an unfiltered website with another query", (done: Mocha.Done): void => {
            let crawled: boolean;
            webcheck.once("result", (): void => {
                crawled = true;
            });
            webcheck.crawl({
                url: "http://localhost:" + port + "/doNotMiss/?query",
            }, (err?: Error | null): void => {
                if (err) {
                    return done(err);
                }
                if (crawled) {
                    return done();
                }
                return done(new Error("Not crawled"));
            });
        });
    });

    describe("Ignore query", (): void => {
        const webcheck = new Webcheck();
        const plugin = new CrawlOncePlugin({
            filterUrl: /doNotMiss/,
            ignoreQuery: true,
        });

        before((): void => {
            webcheck.addPlugin(plugin);
            plugin.enable();
        });
        it("should crawl a website if it is not in ignore list", (done: Mocha.Done): void => {
            let crawled: boolean;
            webcheck.once("result", (): void => {
                crawled = true;
            });
            webcheck.crawl({
                url: "http://localhost:" + port + "/doNotMiss/",
            }, (err?: Error | null): void => {
                if (err) {
                    return done(err);
                }
                if (crawled) {
                    return done();
                }
                return done(new Error("Not crawled"));
            });
        });
        it("should not crawl a site a second time", (done: Mocha.Done): void => {
            webcheck.middlewares.push((): void => {
                return done(new Error("Crawled again"));
            });
            webcheck.crawl({
                url: "http://localhost:" + port + "/doNotMiss/",
            }, (err?: Error | null): void => {
                if (err) {
                    return done(err);
                }
                webcheck.middlewares.length = 0;
                return done();
            });
        });
        it("should be able to crawl an unfiltered website", (done: Mocha.Done): void => {
            let crawled: boolean;
            webcheck.once("result", (): void => {
                crawled = true;
            });
            webcheck.crawl({
                url: "http://localhost:" + port + "/miss/",
            }, (err?: Error | null): void => {
                if (err) {
                    return done(err);
                }
                if (crawled) {
                    return done();
                }
                return done(new Error("Not crawled"));
            });
        });
        it("should be able to crawl an unfiltered website again", (done: Mocha.Done): void => {
            let crawled: boolean;
            webcheck.once("result", (): void => {
                crawled = true;
            });
            webcheck.crawl({
                url: "http://localhost:" + port + "/miss/",
            }, (err?: Error | null): void => {
                if (err) {
                    return done(err);
                }
                if (crawled) {
                    return done();
                }
                return done(new Error("Not crawled"));
            });
        });
        it("should not crawl a site from ignore list", (done: Mocha.Done): void => {
            plugin.ignore("http://localhost:" + port + "/doNotMiss/ignore");
            webcheck.middlewares.push((): void => {
                return done(new Error("Crawled"));
            });
            webcheck.crawl({
                url: "http://localhost:" + port + "/doNotMiss/ignore",
            }, (err?: Error | null): void => {
                if (err) {
                    return done(err);
                }
                webcheck.middlewares.length = 0;
                return done();
            });
        });
        it("should not be able to crawl an unfiltered website with another query", (done: Mocha.Done): void => {
            webcheck.middlewares.push((): void => {
                return done(new Error("Crawled"));
            });
            webcheck.crawl({
                url: "http://localhost:" + port + "/doNotMiss/?query",
            }, (err?: Error | null): void => {
                if (err) {
                    return done(err);
                }
                webcheck.middlewares.length = 0;
                return done();
            });
        });
    });
});
