import { mainControl } from "./mainControl";

async function run() {
    console.time("sort");
    await mainControl.init();
    console.log("end");
}
run();
