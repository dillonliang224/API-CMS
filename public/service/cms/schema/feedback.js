/**
 * Created by liang on 2017/7/3.
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// 意见反馈
const FeedbackSchema = new Schema({
    status          : {type: Number,  required: true},    //状态
    content         : {type: String,  required: true},    //意见反馈
    images          : {type: Array,   required: false},   //图片
    mobile          : {type: String,  required: false},   //手机号
    create_time     : {type: Date,    required: true},    //创建时间
    update_time     : {type: Date,    required: true},    //更新时间
});

FeedbackSchema.virtual('id', function () {
    return this._id.toString();
});

FeedbackSchema.index({create_time : 1});

// 意见反馈状态
FeedbackSchema.statics.STATUS = {
    REMOVED    : 0,   //删除
    NORMAL     : 1,   //正常
};

exports.FeedbackSchema = FeedbackSchema;