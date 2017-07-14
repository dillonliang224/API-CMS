/**
 * Created by liang on 2017/7/14.
 */

const articleModel = require('../../public/model/jianshu/article');

/**
 * @desc 创建简书文章
 * */
exports.createNewArticle = function (req, res, next) {

};

/**
 * @desc 获取简书文章列表
 * */
exports.getArticleList = function (req, res, next) {
    let pageSkip = req.query.page_skip;
    let pageSize = req.query.page_size;

    articleModel.getArticleList(pageSkip, pageSize, function (err, results) {
        if (err) {
            return next(err);
        }

        let count = results.count;
        let articles = [];

        results.articles.forEach(function (article) {
            if (article.id) {
                articles.push({
                    article_id: article._id,
                    article_title: article.title,
                    article_content: article.content,
                    create_time: article.create_time
                });
            }
        });

        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: true,
                count: count,
                list: articles
            }
        });
    });
};

/**
 * @desc 获取简书文章列表
 * */
exports.getArticles = function (req, res, next) {
    console.log('hello');

    articleModel.getArticles(function (err, results) {
        if (err) {
            return next(err);
        }

        let count = results.count;
        let articles = [];

        results.articles.forEach(function (article) {
            if (article.id) {
                articles.push({
                    article_id: article._id,
                    article_title: article.title,
                    article_content: article.content,
                    create_time: article.create_time
                });
            }
        });

        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: true,
                count: count,
                list: articles
            }
        });
    });
};

/**
 * @desc 获取简书文章详情
 * */
exports.getArticleDetailByID = function (req, res, next) {
    if (!req.query.article_id) {
        return next(new BadRequestError('请传入文章ID'));
    }

    let articleID = req.query.article_id;

    articleModel.getArticleDetailByID(articleID, function (err, article) {
        if (err) {
            return next(err);
        }

        if (!article) {
            return res.json({
                flag: '0000',
                msg: '',
                result: {
                    ok: true,
                    success_message: '',
                    failed_message: '该文章不存在'
                }
            });
        }

        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: true,
                article_title: article.title,
                article_content: article.content,
                article_js_id: article.js_id,
                create_time: article.create_time,
                update_time: article.update_time,
                success_message: '获取文章成功',
                failed_message: ''
            }
        });
    });
};

/**
 * @desc 删除简书文章
 * */
exports.removeArticleByID = function (req, res, next) {
    if (!req.query.article_id) {
        return next(new BadRequestError('请传入文章ID'));
    }

    let articleID = req.query.article_id;

    articleModel.removeArticleByID(articleID, function (err, result) {
        if (err) {
            return next(err);
        }

        console.log(result);

        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: true,

                success_message: '',
                failed_message: ''
            }
        });
    });
};