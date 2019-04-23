const mongoose = require("mongoose"),
    DB_URL = "mongodb://localhost:27017/",
    DBNAME = "webVideo";
var db = mongoose.connection; //获取connection实例

db.on("connected", function(err) {
    if (err) {
        console.log("连接数据库失败：" + err);
    } else {
        console.log("连接数据库成功！");
    }
});

mongoose.connect(DB_URL + DBNAME);

const videoInfoSchema = new mongoose.Schema({
    video_name: String,
    video_actors: Array,
    video_director: Array,
    video_type: Array,
    video_address: Array,
    video_detail: String,
    video_play_url: Array,
    vide_info: Object
});

const videoSchema = new mongoose.Schema({
    url: String,
    type: String,
    parent_url: String
});

videoInfoSchema.statics.findVideoByName = function(name) {
    return new Promise((resolve, reject) => {
        this.find({ video_name: name }, { _id: 0 }, (err, res) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(res);
        });
    });
};
const VideoInfo = mongoose.model("videoInfo", videoInfoSchema);
const Video = mongoose.model("video", videoSchema);

export const videoInfoSaveToDb = info => {
    const videoInfo = new VideoInfo(info);
    videoInfo.save((err, res) => {
        if (err) {
            console.log(err);
            console.log("插入失败");
            return;
        }
        console.log("插入成功");
        console.log(res);
    });
};

export const videoSaveToDb = info => {
    const video = new Video(info);
    video.save((err, res) => {
        if (err) {
            console.log(err);
            console.log("插入失败");
            return;
        }
        console.log("插入成功");
        console.log(res);
    });
};
