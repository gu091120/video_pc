const PAGESTACKNUM = 5;

import { taskSelect, URLTYPE } from "./taskControl.js";
import { pageStack, getRunningPages } from "./pageControl.js";
import { urlStack } from "./urlStack";
const MAIN_URL = "https://www.4kdy.net/";

class MainControl {
    async runTask() {
        let page;
        const urlInfo = urlStack.delStack();
        if (urlInfo) {
            const task = taskSelect(urlInfo);
            page = await pageStack.runPage(task);
            this.checkAddRunTask();
            return;
        }
        pageStack.closePage(page);
    }
    async checkAddRunTask() {
        let running_page_count = await getRunningPages();
        let num = pageStack.max_page_count - running_page_count;
        console.log(
            `running_page_count:${running_page_count}----max_page_count:${
                pageStack.max_page_count
            }}`
        );
        if (num > 0) {
            if (urlStack.getLength() < num) {
                num = urlStack.getLength();
            }
            new Array(num).fill(0).forEach(() => {
                this.runTask();
            });
        } else if (running_page_count < pageStack.max_page_count) {
            this.runTask();
        }
    }
    init() {
        return new Promise(async (resolve, reject) => {
            try {
                urlStack.addStack({
                    url: MAIN_URL,
                    url_type: URLTYPE.INDEX_URL
                });
                await pageStack.init();
                this.runTask();
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }
}
export const mainControl = new MainControl();
