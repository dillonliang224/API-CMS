/**
 * Created by liang on 2017/6/17.
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

// cms 文章 =========================================================
const ArticleSchema = new Schema({
    status          : {type: Number, required: true},   //状态
    title           : {type: String, required: true},   //标题
    abstract        : {type: String, required: true},   //摘要
    content         : {type: String, required: true},   //内容
    cover           : {type: String, required: false},  //文章封面
    group_id        : {type: String, required: false},  //group
    published_id    : {type: String, required: false},  //已发布文章id
    category_id     : {type: String, required: false},  //文章类别
    create_user     : {type: String, required: false},  //作者
    create_time     : {type: Date,   required: true},   //创建时间
    update_time     : {type: Date,   required: true},   //更新时间
});

ArticleSchema.virtual('id', function () {
    return this._id.toString();
});

//状态
ArticleSchema.statics.STATUS = {
    PUBLISHED : 1,
    DRAFT: 0,
    REMOVED : -1,
};

// markdown 文章 ====================================================
const MarkdownArticleSchema = new Schema({
    status          : {type: Number,    required: true},   //状态
    title           : {type: String,    required: true},   //标题
    content         : {type: String,    required: true},   //内容
    category_id     : {type: ObjectId,  required: false, ref: 'Category'},  //文章类别
    create_time     : {type: Date,      required: true},   //创建时间
    update_time     : {type: Date,      required: true},   //更新时间
});

MarkdownArticleSchema.virtual('id', function () {
    return this._id.toString();
});

//状态
MarkdownArticleSchema.statics.STATUS = {
    NORMAL : 1,
    REMOVED : -1,
};

exports.ArticleSchema = ArticleSchema;
exports.MarkdownArticleSchema = MarkdownArticleSchema;