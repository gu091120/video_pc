import { openUrl } from "./util.js";

const MOVIE_ITEM_SELECTORS = ".stui-vodlist > li";

const MOVIEINFO_SELECTOR = {
    MOVIE_PAGE_URL: ".stui-vodlist__detail .title a",
    MOVIE_INFO:
        "body > div:nth-child(3) > div > div:nth-child(1) > div > div > div.col-md-wide-75.col-xs-1",
    MOVIE_NAME: ".stui-content__detail  .title",
    MOVIE_ACTORS: ".stui-content__detail > p:nth-child(2) > a",
    MOVIE_DIRECTOR: ".stui-content__detail > p:nth-child(3) > a",
    MOVIE_TYPE: ".stui-content__detail > p:nth-child(4) > a",
    MOVIE_ADDRESS: ".stui-content__detail > p:nth-child(5) > a",
    MOVIE_DETAIL:
        "div.stui-content__detail > p.desc.detail.hidden-xs > span.detail-content",
    MOVIE_PLAY_URL: "#play_1 > ul > li > a "
};

const VIDEO_TYPE_URL_LIST = "#header-top > div > div > div > ul > li > a";

export const getVideoTypeUrlList = (url, page) => {
    return new Promise(async (resolve, reject) => {
        try {
            await openUrl(url, page);
            const arr = await page.evaluate(list => {
                return Array.from(document.querySelectorAll(list)).map(
                    $item => ({
                        type: $item.innerText,
                        url: $item.href
                    })
                );
            }, VIDEO_TYPE_URL_LIST);
            resolve(arr);
        } catch (e) {
            reject(e);
        }
    });
};

export const getVideoList = (url, page) => {
    return new Promise(async (resolve, reject) => {
        try {
            await openUrl(url, page);
            const arr = await page.evaluate(
                (m_items, m_name) => {
                    return Array.from(document.querySelectorAll(m_items)).map(
                        $m_items => {
                            const dom = $m_items.querySelector(m_name);
                            return dom.href;
                        }
                    );
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

export const getVideInfo = (url, page) => {
    return new Promise(async (resolve, reject) => {
        try {
            await openUrl(url, page);
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
                    const video_name = m_info.querySelector(name).innerText;
                    const video_actors = Array.from(
                        m_info.querySelectorAll(actors)
                    ).map(item => item.innerText);
                    const video_director = Array.from(
                        m_info.querySelectorAll(direct)
                    ).map(item => item.innerText);
                    const video_type = Array.from(
                        m_info.querySelectorAll(type)
                    ).map(item => item.innerText);
                    const video_address = Array.from(
                        m_info.querySelectorAll(address)
                    ).map(item => item.innerText);
                    const video_detail = m_info.querySelector(detail).innerText;
                    //const video_play_url = m_info.querySelector(play_url).href;
                    const video_play_url = Array.from(
                        document.querySelectorAll(play_url)
                    ).map(item => item.href);
                    //const video_info = dp && dp.options.video;
                    return {
                        video_name,
                        video_actors,
                        video_director,
                        video_type,
                        video_address,
                        video_detail,
                        video_play_url
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
            resolve(movie_info);
        } catch (e) {
            reject(e);
        }
    });
};

//获取video播放地址
export const getVideoDetail = (url, page) => {
    return new Promise(async (resolve, reject) => {
        try {
            await openUrl(url, page);
            const res = await page.evaluate(() => {
                let vide_info = {};
                if (dp) {
                    vide_info = dp.options.video;
                }
                return vide_info;
            });
            resolve(res);
        } catch (e) {
            reject(e);
        }
    });
};
