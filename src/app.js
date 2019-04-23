import { mainControl } from "./mainControl";
import { videoInfoSaveToDb, videoSaveToDb } from "./mongodb/index";
async function run() {
    // videoInfoSaveToDb({
    //     video_name: "电影义"
    // });
    // videoSaveToDb({
    //     url: "dasdasdasd"
    // });
    console.time("sort");
    await mainControl.init();
    console.log("end");
}
run();
