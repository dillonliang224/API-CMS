/**
 * Created by liang on 2017/6/14.
 */

const async = require('async');

const jianshuMongodb = require('../../service/jianshu').client;

const Article = jianshuMongodb.model('Article');

/**
 * @desc 创建简书文章(存在更新，不存在添加)
 * */
exports.createNewArticle = function(article, callback) {
    let condition = {
        js_id: article.js_id,
        status: Article.STATUS.NORMAL
    };

    Article.findOne(condition, function (err, result) {
        if (err) {
            return callback(err);
        }

        if (result) {
            let condition = {
                js_id: article.js_id,
                status: Article.STATUS.NORMAL
            };
            
            let update = {
                $set: {
                    title: article.title,
                    content: article.content,
                    abstract: article.abstract,
                    cover: article.cover,
                    update_time: new Date()
                }
            };

            Article.findOneAndUpdate(condition, update, {new: true}, callback);
        } else {
            let articleDoc = {
                status: Article.STATUS.NORMAL,
                title: article.title,
                content: article.content,
                abstract: article.abstract,
                cover: article.cover,
                js_id: article.js_id,
                create_time: new Date(),
                update_time: new Date()
            };

            Article.create(articleDoc, callback);
        }
    });
};

/**
 * @desc 获取简书文章列表
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
 * @desc 获取简书文章列表(不分页)
 * */
exports.getArticles = function (callback) {
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
                .exec(cb);
        }
    }, callback);
};

/**
 * @desc 获取简书文章详情 id
 * */
exports.getArticleDetailByID = function (articleID, callback) {
    let condition = {
        _id: articleID,
        status: Article.STATUS.NORMAL
    };

    Article.findOne(condition, callback);
};

/**
 * @desc 通过js_id获取简书文章
 * */
exports.getArticleDetailByJSID = function (jsID, callback) {
    let condition = {
        js_id: jsID,
        status: Article.STATUS.NORMAL
    };

    Article.findOne(condition, callback);
};

/**
 * @desc 删除简书文章
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