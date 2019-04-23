import {
    getVideoList,
    getVideInfo,
    getVideoTypeUrlList,
    getVideoDetail
} from "./tasks";
import { videoInfoSaveToDb, videoSaveToDb } from "./mongodb/index";

import { urlStack } from "./urlStack";

export const URLTYPE = {
    INDEX_URL: "indexUrl",
    ALL_VIDEO: "videoList",
    VIDE_INFO: "videoInfo",
    VIDEO_DETAIL: "videoDetail"
};

export const taskSelect = urlInfo => {
    switch (urlInfo.url_type) {
        case URLTYPE.INDEX_URL:
            return getVideoAllTypeUrlListTask(urlInfo.url);
        case URLTYPE.ALL_VIDEO:
            return getVideoListTask(urlInfo.url);
        case URLTYPE.VIDE_INFO:
            return getVideInfoTask(urlInfo.url);
        case URLTYPE.VIDEO_DETAIL:
            return getVideoDetailTask(urlInfo.url);
        default:
            break;
    }
};

//获取所有类型视频列表Url
export const getVideoAllTypeUrlListTask = url => page => {
    return new Promise(async (resolve, reject) => {
        try {
            let all_video_type = await getVideoTypeUrlList(url, page);
            let arr = all_video_type.map(item => {
                urlStack.addStack({
                    url: item.url,
                    url_type: URLTYPE.ALL_VIDEO
                });
            });
            //saveInfo({ AllTypeUrlListTask: all_video_type });
            resolve(arr);
        } catch (e) {
            reject(e);
        }
    });
};

export const getVideoListTask = url => page => {
    return new Promise(async (resolve, reject) => {
        try {
            const moive_item_list = await getVideoList(url, page);
            const arr = moive_item_list.map(url => {
                urlStack.addStack({ url_type: URLTYPE.VIDE_INFO, url });
            });
            //saveInfo({ getVideoListTask: moive_item_list });
            resolve(arr);
        } catch (e) {
            reject(e);
        }
    });
};

export const getVideInfoTask = url => page => {
    return new Promise(async (resolve, reject) => {
        try {
            const info = await getVideInfo(url, page);
            const arr = info.video_play_url.map(url => {
                urlStack.addStack({ url_type: URLTYPE.VIDEO_DETAIL, url });
            });
            videoInfoSaveToDb(info);
            //saveInfo({ getVideInfoTask: info });
            resolve(arr);
        } catch (e) {
            reject(e);
        }
    });
};

export const getVideoDetailTask = url => page => {
    return new Promise(async (resolve, reject) => {
        try {
            const info = await getVideoDetail(url, page);
            //saveInfo({ getVideoDetailTask: info });
            info.parent_url = url;
            videoSaveToDb(info);
            resolve(info);
        } catch (e) {
            reject(e);
        }
    });
};

let video_info = {};
function saveInfo(info) {
    console.log(info);
    //video_info[type] = info;
}
