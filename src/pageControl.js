import StackPool from "./stackPool";

import puppeteer from "puppeteer";

const HEADLESS = true;
let browser = null;
let count = 0;

const MAX_PAGES = 5;

class PageStack extends StackPool {
    constructor() {
        super();
        this.max_page_count = MAX_PAGES;
        this.runningPages = null;
    }
    init() {
        return new Promise(async (resolve, reject) => {
            const browser = await openBrowser();
            const pageArr = await browser.pages();
            this.concat(pageArr);
            resolve();
        });
    }

    runPage(task) {
        return new Promise(async (resolve, reject) => {
            console.log(count++);
            let page = this.delStack();
            if (page) {
                try {
                    await task(page);
                } catch (e) {}
                this.runEnd(page);
                resolve(page);
            } else {
                const running_page_count = await getRunningPages();
                if (running_page_count < MAX_PAGES) {
                    page = await openPage();
                    try {
                        await task(page);
                    } catch (e) {}
                    this.runEnd(page);
                    resolve(page);
                }
                resolve(false);
            }
        });
    }

    async closePage(page) {
        this.delStack(page);
        page.close();
    }

    runEnd(page) {
        this.addStack(page);
    }
}

export const pageStack = new PageStack();

export const openBrowser = isHeadless => {
    if (browser) {
        return Promise.resolve(browser);
    }
    return new Promise(async (resolve, reject) => {
        try {
            browser = await puppeteer.launch({
                headless: isHeadless || HEADLESS,
                timeout: 5000
            });
            resolve(browser);
        } catch (e) {
            reject(e);
        }
    });
};

export const openPage = () => {
    return new Promise(async (resolve, reject) => {
        const page = await browser.newPage();
        page.on("close", () => {
            console.log(`页面关闭`);
        });
        await intercerpt(page);
        resolve(page);
    });
};
const intercerpt = page => {
    return new Promise(async (resolve, reject) => {
        try {
            const blockTypes = new Set(["image", "media", "font"]);
            //const blockTypes = new Set(["image", "font"]);
            await page.setRequestInterception(true);
            page.on("request", request => {
                const type = request.resourceType();
                const shouldBlock = blockTypes.has(type);
                //this.debug("onRequest", { type, shouldBlock });
                return shouldBlock ? request.abort() : request.continue();
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

export const getRunningPages = () => {
    return new Promise(async (resolve, reject) => {
        const num = await browser.pages();
        resolve(num.length);
    });
};

export const openUrl = (url, page, opt) => {
    return new Promise(async (resolve, reject) => {
        try {
            await page.goto(url);
            resolve(page);
        } catch (e) {
            console.log("error" + e);
            reject(e);
        }
    });
};
