/**
 * Created by liang on 2017/7/17.
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// 群
const GroupSchema = new Schema({
    status          : {type: Number, required: true},   //状态
    name            : {type: String, required: true},   //名称
    url             : {type: String, required: true},   //地址
    live_group      : {type: String, required: false},  //
    create_time     : {type: Date,   required: true},   //创建时间
    update_time     : {type: Date,   required: true},   //更新时间
});

GroupSchema.virtual('id', function () {
    return this._id.toString();
});

//状态
GroupSchema.statics.STATUS = {
    NORMAL : 1,
    REMOVED : -1,
};

exports.GroupSchema = GroupSchema;