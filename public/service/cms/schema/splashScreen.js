/**
 * Created by liang on 2017/6/19.
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// app闪屏
const SplashScreenSchema = new Schema({
    status          : {type: Number,  required: true},    //闪屏状态
    title       	: {type: String,  required: false},   //标题
    list			: {type: Array,  required: true},	  //闪屏图片地址
    platform        : {type: String,  required: true},    //平台
    create_time     : {type: Date,    required: true},    //创建时间
    update_time     : {type: Date,    required: true},    //更新时间
});

SplashScreenSchema.virtual('id', function () {
    return this._id.toString();
});

SplashScreenSchema.index({create_time : 1});

// 闪屏状态
SplashScreenSchema.statics.STATUS = {
    DISABLE    : 0,   //不可用
    ENABLE     : 1,   //可用
};

exports.SplashScreenSchema = SplashScreenSchema;