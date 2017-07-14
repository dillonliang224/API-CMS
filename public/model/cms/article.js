/**
 * Created by liang on 2017/6/17.
 */

const async = require('async');

const cmsMongodb = require('../../service/cms');

const cmsMongodbClient = cmsMongodb.client;

const Article = cmsMongodbClient.model('Article');

/**
 * @desc 创建文章
 * */
exports.createNewArticle = function(article, callback) {
    let articleDoc = {
        status: Article.STATUS.NORMAL,
        title: article.title,
        content: article.content,
        create_time: new Date(),
        update_time: new Date()
    };

    Article.create(articleDoc, function (err, result) {
        callback(err, result);
    });
};

/**
 * @desc 获取文章列表
 * */
exports.getArticleList = function (pageSkip, pageSize, callback) {
    let condition = {
        status: Article.STATUS.NORMAL
    };

    async.parallel({
        count: function (cb) {
            Article.count(condition, cb);
        },

        articles: function (cb) {
            Article.find(condition)
                .sort('-create_time')
                .skip(pageSkip)
                .limit(pageSize)
                .exec(cb);
        }
    }, callback);
};

/**
 * @desc 获取文章详情 id
 * */
exports.getArticleDetailByID = function (articleID, callback) {
    let condition = {
        _id: articleId,
        status: Article.STATUS.NORMAL
    };

    Article.findOne(condition, callback);
};

/**
 * @desc 删除文章
 * */
exports.removeArticleByID = function (articleID, callback) {
    let condition = {
        _id: articleID,
        status: Article.STATUS.NORMAL
    };

    let update = {
        $set: {
            status: Article.STATUS.REMOVED,
            update_time: new Date()
        }
    };

    Article.update(condition, update, function (err, result) {
        callback(err, result && result.nModified == 1);
    });
};