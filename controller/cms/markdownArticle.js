/**
 * Created by liang on 2017/8/04.
 */

const articleModel = require('../../public/model/cms/article');
const util = require('util');

/**
 * @desc 获取markdown 文章列表
 * */
exports.getMarkdownArticles = function (req, res, next) {
 	let pageSkip = req.query.page_skip || 0;
 	let pageSize = req.query.page_size || 10;

 	const getMarkdownArticles = util.promisify(articleModel.getMarkdownArticles);

 	(async function () {
 	    try {
 	        let results = await getMarkdownArticles(pageSkip, pageSize);

 	        let count = results.count;
 	        let articles = [];

 	        results.articles.forEach(function (article) {
                if (article && article.category_id) {
                    articles.push({
                        article_id: article._id,
                        article_title: article.title,
                        category_id: article.category_id._id,
                        category_title: article.category_id.title,
                        create_time: article.create_time
                    });
                }
            });
 	        
 	        res.json({
 	            flag: '0000',
 	            msg: '',
 	            result: {
 	                count: count,
 	                list: articles
 	            }
 	        });
 	    } catch (err) {
 	        return next(err);
 	    }
 	})();
};

/**
 * @desc 获取markdown 文章详情
 * */
exports.getMarkdownArticleDetail = function (req, res, next) {
    let articleID = req.query.article_id;

 	if (!articleID) {
 		return next(new BadRequestError('article_id is need'));
	}

	const getMarkdownArticleDetail = util.promisify(articleModel.getMarkdownArticleDetail);

 	(async function () {
 	    try {
 	        let article = await getMarkdownArticleDetail(articleID);

            if (!article || !article.category_id) {
                return res.json({
                    flag: '0000',
                    msg: '',
                    result: {
                        ok: false,
                        success_message: '',
                        failed_message: '文章不存在'
                    }
                });
            }

 	        res.json({
 	            flag: '0000',
 	            msg: '',
 	            result: {
 	                ok: true,
                    article_id: article._id,
                    article_title: article.title,
                    article_content: article.content,
                    category_id: article.category_id._id,
                    category_title: article.category_id.title,
                    article_count: article.category_id.article_count
 	            }
 	        });
 	    } catch (err) {
 	        return next(err);
 	    }
 	})();
};

/**
 * @desc 创建markdown文章
 * */
exports.createMarkdownArticle = function (req, res, next) {
 	if (!req.body.title) {
 	    return next(new BadRequestError('请传入文章title'));
    }

    if (!req.body.content) {
 	    return next(new BadRequestError('请传入文章内容'));
    }

    if (!req.body.category_id) {
 	    return next(new BadRequestError('请传入文章类别'));
    }

    let article = {
 	    title: req.body.title,
        content: req.body.content,
        category_id: req.body.category_id
    };

 	const createNewMarkdownArticle = util.promisify(articleModel.createNewMarkdownArticle);

 	(async function () {
 	    try {
 	        let result = await createNewMarkdownArticle(article);

            res.json({
                flag: '0000',
                msg: '',
                result: {
                    ok: !!result,
                    article_id: !!result ? result._id : null,
                    success_message: !!result ? '创建成功' : '',
                    failed_message: !!result ? '' : '创建失败'
                }
            });
 	    } catch (err) {
 	        return next(err);
 	    }
 	})();
};

/**
 * @desc 更新markdown文章
 * */
exports.updateMarkdownArticle = function (req, res, next) {
 	if (!req.body.article_id) {
 	    return next(new BadRequestError('请传入文章ID'));
    }

    if (!req.body.title) {
 	    return next(new BadRequestError('请传入文章title'));
    }

    if (!req.body.content) {
 	    return next(new BadRequestError('请传入文章content'));
    }

    if (!req.body.category_id) {
 	    return next(new BadRequestError('请传入文章category'));
    }

    let article = {
 	    id: req.body.article_id,
        title: req.body.title,
        content: req.body.content,
        category_id: req.body.category_id
    };

 	const updateMarkdownArticle = util.promisify(articleModel.updateMarkdownArticle);

 	(async function () {
 	    try {
 	        let result = await updateMarkdownArticle(article);

 	        res.json({
 	            flag: '0000',
 	            msg: '',
 	            result: {
 	                ok: !!result,
                    success_message: !!result ? '更新成功' : '',
                    failed_message: !!result ? '' : '更新失败'
 	            }
 	        });
 	    } catch (err) {
 	        return next(err);
 	    }
 	})();
};

/**
 * @desc 删除markdown文章
 * */
exports.removeMarkdownArticle = function (req, res, next) {
    let articleID = req.query.article_id;

    if (!articleID) {
 		return next(new BadRequestError('请传入文章ID'));
 	}

    const removeMarkdownArticle = util.promisify(articleModel.removeMarkdownArticle);

    (async function () {
        try {
            let result = await removeMarkdownArticle(articleID);

            res.json({
                flag: '0000',
                msg: '',
                result: {
                    ok: !!result,
                    success_message: !!result ? '删除成功' : '',
                    failed_message: !!result ? '' : '删除失败'
                }
            });
        } catch (err) {
            return next(err);
        }
    })();
};