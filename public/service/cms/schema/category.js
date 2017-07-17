/**
 * Created by liang on 2017/7/17.
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// 文章类别
const CategorySchema = new Schema({
    status          : {type: Number, required: true},   //状态
    title           : {type: String, required: true},   //标题
    create_time     : {type: Date,   required: true},   //创建时间
    update_time     : {type: Date,   required: true},   //更新时间
});

CategorySchema.virtual('id', function () {
    return this._id.toString();
});

//状态
CategorySchema.statics.STATUS = {
    PUBLISHED : 1,
    REMOVED : -1,
};

exports.CategorySchema = CategorySchema;