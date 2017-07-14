/**
 * Created by liang on 2017/6/24.
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

// 活动参数者
const UserSchema = new Schema({
    status          : {type: Number, required: true},   //状态
    name            : {type: String, required: true},   //姓名
    avatar          : {type: String, required: true},   //头像
    openid          : {type: String, required: true},   //微信ID
    create_time     : {type: Date,   required: true},   //创建时间
    update_time     : {type: Date,   required: true},   //更新时间
});

UserSchema.virtual('id', function () {
    return this._id.toString();
});

//状态
UserSchema.statics.STATUS = {
    NORMAL : 1,
    REMOVED : 0,
};

exports.UserSchema = UserSchema;