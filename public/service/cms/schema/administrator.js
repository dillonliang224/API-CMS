/**
 * Created by liang on 2017/6/17.
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

// 管理员（邮箱密码登录）
const AdministratorSchema = new Schema({
    status        : {type: Number,  required: true},       //用户状态
    admin_name    : {type: String,  required: false},      //用户名
    admin_email   : {type: String,  required: true},       //用户邮箱
    admin_password: {type: String,  required: true},       //用户密码
    create_time   : {type: Date,    required: true},       //创建时间
    update_time   : {type: Date,    required: true},       //更新时间

    admin_gender  : {type: Boolean, required: false},       //用户性别
    admin_mobile  : {type: String,  required: false},       //用户手机
    admin_age     : {type: Number,  required: false},       //用户简介
    admin_profile : {type: String,  required: false},       //用户简介
    admin_avatar  : {type: String,  required: false},       //用户头像
});

AdministratorSchema.virtual('id', function () {
    return this._id.toString();
});

//状态
AdministratorSchema.statics.STATUS = {
    NORMAL : 1,
    REMOVED : 0,
};

//用户性别
AdministratorSchema.statics.GENDER = {
    MALE : true,
    FEMALE : false
};

exports.AdministratorSchema = AdministratorSchema;