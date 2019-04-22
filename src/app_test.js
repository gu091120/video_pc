import puppeteer from "puppeteer";

const MAIN_URL = "https://www.4kdy.net/";
const MOVIE_SELECTOR =
    "body > div:nth-child(3) > div > div:nth-child(2) > div > div.col-lg-wide-75.col-xs-1.padding-0 > div.stui-pannel_hd > div > h3 > a";

const MOVIEINFO_SELECTOR = {
    MOVIE_PAGE_URL: ".stui-vodlist__detail .title a",
    MOVIE_INFO:
        "body > div:nth-child(3) > div > div:nth-child(1) > div > div > div.col-md-wide-75.col-xs-1",
    MOVIE_NAME: ".stui-content__detail  .title",
    MOVIE_ACTORS: ".stui-content__detail > p:nth-child(2) > a",
    MOVIE_DIRECTOR: ".stui-content__detail > p:nth-child(3) > a",
    MOVIE_TYPE: ".stui-content__detail > p:nth-child(4) > a",
    MOVIE_ADDRESS: ".stui-content__detail > p:nthintercerpt-child(5) > a",
    MOVIE_DETAIL:
        "div.stui-content__detail > p.desc.detail.hidden-xs > span.detail-content",
    MOVIE_PLAY_URL: ".stui-content__detail > div > a"
};
const MOVIE_ITEM_SELECTORS = ".stui-vodlist > li";

const intercerpt = page => {
    return new Promise(async (resolve, reject) => {
        try {
            //const blockTypes = new Set(["image", "media", "font"]);
            const blockTypes = new Set(["image", "font"]);
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

const openUrl = (browser, url) => {
    return new Promise(async (resolve, reject) => {
        try {
            const page = await browser.newPage();
            await intercerpt(page);
            await page.goto(url);
            await page.waitFor(2 * 1000);
            resolve(page);
        } catch (e) {
            reject(e);
        }
    });
};

const openBrowser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch({ headless: true });
            resolve(browser);
        } catch (e) {
            reject(e);
        }
    });
};

const getMovieItemsList = page => {
    return new Promise(async (resolve, reject) => {
        try {
            await page.click(MOVIE_SELECTOR);
            await page.waitFor(2 * 1000);
            const arr = await page.evaluate(
                (m_items, m_name) => {
                    return Array.prototype.slice
                        .apply(document.querySelectorAll(m_items))
                        .map($m_items => {
                            const dom = $m_items.querySelector(m_name);
                            return {
                                movie_page_url: dom.href
                            };
                        });
                },
                MOVIE_ITEM_SELECTORS,
                MOVIEINFO_SELECTOR.MOVIE_PAGE_URL
            );
            resolve(arr);
        } catch (e) {
            reject(e);
        }
    });
};

const getMovieInfo = (browser, url) => {
    return new Promise(async (resolve, reject) => {
        try {
            const page = await openUrl(browser, url);
            page.on("close", () => {
                console.log(`${url}:页面关闭`);
            });
            const movie_info = await page.evaluate(
                (
                    info,
                    name,
                    actors,
                    direct,
                    type,
                    address,
                    detail,
                    play_url
                ) => {
                    const m_info = document.querySelector(info);
                    const movie_name = m_info.querySelector(name).innerText;
                    const movie_actors = Array.prototype.slice
                        .apply(m_info.querySelectorAll(actors))
                        .map(item => item.innerText);
                    const movie_director = Array.prototype.slice
                        .apply(m_info.querySelectorAll(direct))

                        .map(item => item.innerText);
                    const movie_type = Array.prototype.slice
                        .apply(m_info.querySelectorAll(type))
                        .map(item => item.innerText);
                    const movie_address = Array.prototype.slice
                        .apply(m_info.querySelectorAll(address))
                        .map(item => item.innerText);
                    const movie_detail = m_info.querySelector(detail).innerText;
                    const movie_play_url = m_info.querySelector(play_url).href;
                    //const video_info = dp && dp.options.video;
                    return {
                        movie_name,
                        movie_actors,
                        movie_director,
                        movie_type,
                        movie_address,
                        movie_detail,
                        movie_play_url
                    };
                },
                MOVIEINFO_SELECTOR.MOVIE_INFO,
                MOVIEINFO_SELECTOR.MOVIE_NAME,
                MOVIEINFO_SELECTOR.MOVIE_ACTORS,
                MOVIEINFO_SELECTOR.MOVIE_DIRECTOR,
                MOVIEINFO_SELECTOR.MOVIE_TYPE,
                MOVIEINFO_SELECTOR.MOVIE_ADDRESS,
                MOVIEINFO_SELECTOR.MOVIE_DETAIL,
                MOVIEINFO_SELECTOR.MOVIE_PLAY_URL
            );
            //await page.click(MOVIEINFO_SELECTOR.MOVIE_PLAY_URL);
            await page.goto(movie_info.movie_play_url);
            //await page.waitFor(1000);
            const video_info = await getMovieUrl(page);
            movie_info.video_info = video_info;
            resolve(movie_info);
            //page.close();
        } catch (e) {
            reject(e);
        }
    });
};

const getMovieUrl = page =>
    page.evaluate(() => {
        let vide_info = {};
        if (dp) {
            vide_info = dp.options.video;
        }
        return vide_info;
    });

async function run() {
    const browser = await openBrowser();
    browser.on("disconnected", () => {
        console.log("浏览器关闭");
    });
    console.log("浏览器打开成功");
    const page = await openUrl(browser, MAIN_URL);
    console.log("Url打开成功");
    const movieArr = await getMovieItemsList(page);
    console.log("页面列表获取成功,页面数量：" + movieArr.length);
    //console.log(movieArr);
    const p_arr = movieArr
        //.slice(0, 10)
        .map(item => getMovieInfo(browser, item.movie_page_url));
    console.log("开始获取电影信息");
    const m_info = await Promise.all(p_arr);
    console.log("获取电影信息成功");
    console.log(m_info);
    //browser.close();
}

run();
