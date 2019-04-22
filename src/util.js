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
