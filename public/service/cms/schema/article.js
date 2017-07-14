/**
 * Created by liang on 2017/6/17.
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

// 文章
const ArticleSchema = new Schema({
    status          : {type: Number, required: true},   //状态
    title           : {type: String, required: true},   //标题
    content         : {type: String, required: true},   //内容
    create_time     : {type: Date,   required: true},   //创建时间
    update_time     : {type: Date,   required: true},   //更新时间
});

ArticleSchema.virtual('id', function () {
    return this._id.toString();
});

//状态
ArticleSchema.statics.STATUS = {
    NORMAL : 1,
    REMOVED : 0,
};

exports.ArticleSchema = ArticleSchema;