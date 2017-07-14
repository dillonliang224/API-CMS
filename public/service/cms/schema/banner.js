/**
 * Created by liang on 2017/7/4.
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

// banner
const BannerSchema = new Schema({
    status          : {type: Number,  required: true},    //状态
    title           : {type: String,  required: true},    //标题
    cover           : {type: String,  required: true},    //banner封面
    url             : {type: String,  required: true},    //banner地址
    create_time     : {type: Date,    required: true},    //创建时间
    update_time     : {type: Date,    required: true},    //更新时间
});

BannerSchema.virtual('id', function () {
    return this._id.toString();
});

BannerSchema.index({create_time : 1});

// 意见反馈状态
BannerSchema.statics.STATUS = {
    REMOVED    : 0,   //删除
    NORMAL     : 1,   //正常
};

exports.BannerSchema = BannerSchema;