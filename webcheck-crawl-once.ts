/// <reference path="./typings/main.d.ts" />

import { Plugin as WebcheckPlugin, ICrawlOptions } from 'webcheck';
import * as url from 'url';
import * as pkg from './package.json';

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
var emptyFilter: ISimplifiedRegExpr = { // a spoofed RegExpr...
    test: (): boolean => {
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
 * @augments WebcheckPlugin
 * @constructor
 */
export class CrawlOncePlugin extends WebcheckPlugin {

    public package: any = pkg;

    /**
     * List of already crawled resources
     * @type {IAssociativeArray}
     */
    public list: IAssociativeArray<boolean> = {};

    constructor(opts?: ICrawlOncePluginOptions) {
        super();
        opts = opts || {};

        opts.filterUrl = opts.filterUrl || emptyFilter;
        opts.ignoreQuery = opts.ignoreQuery || false;

        this.on['crawl'] = (settings: ICrawlOptions): void => {
            var parsedUrl: url.Url;
            if (opts.filterUrl.test(settings.url)) {
                if (opts.ignoreQuery) {
                    parsedUrl = url.parse(settings.url);
                    if (this.ignore(parsedUrl.protocol + '//' + parsedUrl.host + parsedUrl.pathname)) {
                        settings.preventCrawl = true;
                    }
                } else {
                    if (this.ignore(settings.url)) {
                        settings.preventCrawl = true;
                    }
                }
            }
        };

        this.reset();
    }

    /**
     * Reset an entry or the complete list of already requested resources
     * @param hash
     */
    public reset(hash?: string): void {
        if (hash) {
            delete this.list[hash];
            return;
        }
        this.list = {};
        return;
    }
    /**
     * Ignore a resource and return if a resource is already in ignore list
     * @param {string} url - Url that should be ignored
     * @returns {boolean} - Is this url already ignored
     */
    public ignore(url: string): boolean {
        if (this.list[url]) {
            return true;
        }
        this.list[url] = true;
        return false;
    }
    /**
     * Check if a resource is in ignore list
     * @param url
     * @returns {boolean}
     */
    check(url: string): boolean {
        return !!this.list[url];
    }
}
