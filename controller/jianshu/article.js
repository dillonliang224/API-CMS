/**
 * Created by liang on 2017/7/14.
 */

const request = require('request');
const cheerio = require('cheerio');

const articleModel = require('../../public/model/jianshu/article');

/**
 * @desc 获取简书文章列表(分页)
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
                    article_cover: article.cover,
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
 * @desc 获取简书文章列表（不分页）
 * */
exports.getArticles = function (req, res, next) {
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
                    article_cover: article.cover,
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

        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: !!result,
                success_message: '',
                failed_message: ''
            }
        });
    });
};

/**
 * @desc 从简书获取数据
 * */
exports.getArticleFromJianShu = function (req, res, next) {
    request('http://www.jianshu.com', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let home = cheerio.load(body);
            let list = home('#list-container .note-list li');

            list.each(function (index, item) {
                let article_id = home(this).find('.content .title').attr('href').replace('/p/', '')
                if (index == 0) {
                    request('http://www.jianshu.com/p/' + article_id, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            let $ = cheerio.load(body, {decodeEntities: false}),
                                title = $('.article .title').text(),
                                avatar_info = $('.article .author .avatar'),
                                author_id = avatar_info.attr('href').replace('/u/', ''),
                                author_avatar = avatar_info.find('img').attr('src'),
                                author_name = $('.article .author .info .name a').text().trim(),
                                article_meta = $('.article .author .info .meta'),
                                publish_time = article_meta.find('.publish-time').text().trim(),
                                wordage = article_meta.find('.wordage').text().trim(),
                                content = $('.article .show-content ').html(),
                                abstract = $('.article .show-content p').first().text().slice(0, 80),
                                imageDiv = $('.article .show-content .image-package').first(),
                                image;

                            if (imageDiv) {
                                image = imageDiv.find('img').attr('src');
                            }

                            let article = {
                                js_id: article_id,
                                title: title,
                                cover: image,
                                content: content,
                                abstract: abstract,
                            };
                            articleModel.createNewArticle(article, function (err, result) {
                                res.json({
                                    flag: '0000',
                                    msg: '',
                                    result: {
                                        ok: true,
                                        article: result
                                    }
                                });
                            });
                        }
                    });
                }
            });
        }
    });
};

/**
 * @desc 从简书获取数据(指定文章链接)
 * */
exports.getArticleFromJianShuByUrl = function (req, res, next) {
    let url = req.body.url;

    if (!url) {
        return next(new BadRequestError('请传入文章链接'));
    }

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let $ = cheerio.load(body, {decodeEntities: false}),
                title = $('.article .title').text(),
                avatar_info = $('.article .author .avatar'),
                author_id = avatar_info.attr('href').replace('/u/', ''),
                author_avatar = avatar_info.find('img').attr('src'),
                author_name = $('.article .author .info .name a').text().trim(),
                article_meta = $('.article .author .info .meta'),
                publish_time = article_meta.find('.publish-time').text().trim(),
                wordage = article_meta.find('.wordage').text().trim(),
                content = $('.article .show-content ').html(),
                abstract = $('.article .show-content p').first().text().slice(0, 80),
                imageDiv = $('.article .show-content .image-package').first(),
                image;

            if (imageDiv) {
                image = imageDiv.find('img').attr('src');
            }

            let temp = url.split('/');
            let article_id = temp[(temp.length - 1)];

            let article = {
                js_id: article_id,
                title: title,
                cover: image,
                content: content,
                abstract: abstract,
            };
            articleModel.createNewArticle(article, function (err, result) {
                res.json({
                    flag: '0000',
                    msg: '',
                    result: {
                        ok: true,
                        article: result
                    }
                });
            });
        }
    });
};