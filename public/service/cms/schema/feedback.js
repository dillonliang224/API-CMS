/**
 * Created by liang on 2017/7/3.
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

// 意见反馈
const AppFeedbackSchema = new Schema({
    status          : {type: Number,  required: true},    //状态
    content         : {type: String,  required: true},    //意见反馈
    images          : {type: Array,   required: false},   //图片
    mobile          : {type: String,  required: false},   //手机号
    create_time     : {type: Date,    required: true},    //创建时间
    update_time     : {type: Date,    required: true},    //更新时间
});

AppFeedbackSchema.virtual('id', function () {
    return this._id.toString();
});

AppFeedbackSchema.index({create_time : 1});

// 意见反馈状态
AppFeedbackSchema.statics.STATUS = {
    REMOVED    : 0,   //删除
    NORMAL     : 1,   //正常
};

exports.AppFeedbackSchema = AppFeedbackSchema;