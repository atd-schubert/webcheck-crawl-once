import * as url from "url";
import { ICrawlOptions, Plugin as WebcheckPlugin } from "webcheck";
import * as pkg from "./package.json";

export interface ISimplifiedRegExpr {
    test(txt: string): boolean;
}

export interface ICrawlOncePluginOptions {
    filterUrl?: ISimplifiedRegExpr | RegExp;
    ignoreQuery?: boolean;
}

export interface IAssociativeArray<T> {
    [name: string]: T;
}

/**
 * A helper function for empty regular expressions
 * @private
 * @type {{test: Function}}
 */
const emptyFilter: ISimplifiedRegExpr = { // a spoofed RegExpr...
    test: (): boolean => {
        return true;
    },
};

/**
 * Crawl once plugin for webcheck
 * Do not crawl the same resource multiple
 * @author Arne Schubert <atd.schubert@gmail.com>
 * @param {{}} [opts] - Options for this plugin
 * @param {RegExp|{test:Function}} [opts.filterUrl] - Filter urls
 * @param {boolean} [opts.ignoreQuery] - Should the query part of url ignored
 * @augments WebcheckPlugin
 * @constructor
 */
export class CrawlOncePlugin extends WebcheckPlugin {

    public package: any = pkg;

    /**
     * List of already crawled resources
     */
    // public list: IAssociativeArray<boolean> = {};
    public readonly list: Set<string> = new Set<string>();

    constructor(opts: ICrawlOncePluginOptions = {}) {
        super();

        const urlFilter = opts.filterUrl || emptyFilter;
        opts.ignoreQuery = opts.ignoreQuery || false;

        this.on = {
            crawl: (settings: ICrawlOptions): void => {
                if (urlFilter.test(settings.url)) {
                    if (opts.ignoreQuery) {
                        const parsedUrl = url.parse(settings.url);
                        if (this.ignore(parsedUrl.protocol + "//" + parsedUrl.host + parsedUrl.pathname)) {
                            settings.preventCrawl = true;
                        }
                    } else {
                        if (this.ignore(settings.url)) {
                            settings.preventCrawl = true;
                        }
                    }
                }
            },
        };

        this.reset();
    }

    /**
     * Reset an entry or the complete list of already requested resources
     * @param hash
     */
    public reset(hash?: string): void {
        if (hash) {
            this.list.delete(hash);
            return;
        }
        this.list.clear();
        return;
    }
    /**
     * Ignore a resource and return if a resource is already in ignore list
     * @param {string} ignoredUrl - Url that should be ignored
     * @returns {boolean} - Is this url already ignored
     */
    public ignore(ignoredUrl: string): boolean {
        if (this.list.has(ignoredUrl)) {
            return true;
        }
        this.list.add(ignoredUrl);
        return false;
    }
    /**
     * Check if a resource is in ignore list
     * @param checkedUrl
     * @returns {boolean}
     */
    public check(checkedUrl: string): boolean {
        return this.list.has(checkedUrl);
    }
}
