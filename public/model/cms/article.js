/**
 * Created by liang on 2017/6/17.
 */

const async = require('async');

const cmsMongodb = require('../../service/cms');

const cmsMongodbClient = cmsMongodb.client;

const Article = cmsMongodbClient.model('Article');
const MarkdownArticle = cmsMongodbClient.model('MarkdownArticle');
const Category = cmsMongodbClient.model('Category');

// cms article =======================================================
/**
 * @desc 创建文章草稿
 * */
exports.createDraftArticle = function (article, callback) {
    let articleDoc = {
        status: Article.STATUS.DRAFT,       // 文章状态
        title: article.title,               // 文章标题
        abstract: article.abstract,         // 文章摘要
        content: article.content,           // 文章内容
        cover: article.cover,               // 文章封面
        category_id: article.category_id,   // 文章类别
        create_user: article.create_user,   // 文章作者
        create_time: new Date(),            // 创建时间
        update_time: new Date()             // 更新时间
    };

    Article.create(articleDoc, function (err, result) {
        callback(err, result);
    });
};

/**
 * @desc 更新文章草稿
 * */
exports.updateDraftArticle = function (article, callback) {
    let condition = {
        id: article.id,
    };

    let update = {
        $set: {
            status: Article.STATUS.DRAFT,
            title: article.title,               // 文章标题
            abstract: article.abstract,         // 文章摘要
            content: article.content,           // 文章内容
            cover: article.cover,               // 文章封面
            category_id: article.category_id,   // 文章类别
            create_user: article.create_user,   // 文章作者
            update_time: new Date()             // 更新时间
        }
    };

    Article.update(condition, update, callback);
};

/**
 * @desc 发布文章
 * */
exports.publishArticle = function (article, callback) {
    // 文章已存在
    if (article.published_id) {
        async.parallel({
            //更新发布过的文章
            updatePublishArticle: function (cb) {
                let condition = {
                    id: article.published_id,
                };

                let update = {
                    $set: {
                        status: Article.STATUS.PUBLISHED,
                        title: article.title,               // 文章标题
                        abstract: article.abstract,         // 文章摘要
                        content: article.content,           // 文章内容
                        cover: article.cover,               // 文章封面
                        category_id: article.category_id,   // 文章类别
                        create_user: article.create_user,   // 文章作者
                        update_time: new Date()             // 更新时间
                    }
                };

                Article.update(condition, update, callback);
            },
            //更新文章草稿
            updateDraftArticle: function (cb) {
                let condition = {
                    id: article.id,
                };

                let update = {
                    $set: {
                        status: Article.STATUS.DRAFT,
                        title: article.title,               // 文章标题
                        abstract: article.abstract,         // 文章摘要
                        content: article.content,           // 文章内容
                        cover: article.cover,               // 文章封面
                        category_id: article.category_id,   // 文章类别
                        create_user: article.create_user,   // 文章作者
                        update_time: new Date()             // 更新时间
                    }
                };

                Article.update(condition, update, callback);
            }
        }, callback);
    } else {
        let articleDoc = {
            status: Article.STATUS.PUBLISHED,   // 文章状态
            title: article.title,               // 文章标题
            abstract: article.abstract,         // 文章摘要
            content: article.content,           // 文章内容
            cover: article.cover,               // 文章封面
            category_id: article.category_id,   // 文章类别
            create_user: article.create_user,   // 文章作者
            create_time: new Date(),            // 创建时间
            update_time: new Date()             // 更新时间
        };

        Article.create(articleDoc, function (err, result) {
            if (err) {
                return callback(err);
            }

            let articleID = result._id;

            let condition = {
                id: article.id,
            };

            let update = {
                $set: {
                    status: Article.STATUS.DRAFT,
                    title: article.title,               // 文章标题
                    abstract: article.abstract,         // 文章摘要
                    content: article.content,           // 文章内容
                    cover: article.cover,               // 文章封面
                    published_id: articleID,            // 已发布文章id
                    category_id: article.category_id,   // 文章类别
                    create_user: article.create_user,   // 文章作者
                    update_time: new Date()             // 更新时间
                }
            };

            Article.update(condition, update, callback);
        });
    }
};

/**
 * @desc 获取文章列表(已发布)
 * */
exports.getPublishedArticleList = function (pageSkip, pageSize, callback) {
    let condition = {
        status: Article.STATUS.PUBLISHED
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
 * @desc 获取文章列表(草稿)
 * */
exports.getDraftArticleList = function (pageSkip, pageSize, callback) {
    let condition = {
        status: Article.STATUS.DRAFT
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
 * @desc 获取文章详情
 * */
exports.getArticleDetailByID = function (articleID, callback) {
    let condition = {
        _id: articleID,
    };

    Article.findOne(condition, callback);
};

/**
 * @desc 删除文章
 * */
exports.removeArticleByID = function (articleID, publishedID, callback) {
    async.parallel({
        removeDraftArticle: function (cb) {
            let condition = {
                _id: articleID,
            };

            let update = {
                $set: {
                    status: Article.STATUS.REMOVED,
                    update_time: new Date()
                }
            };

            Article.update(condition, update, cb);
        },
        removePublishedArticle: function (cb) {
            if (publishedID) {
                let condition = {
                    _id: publishedID,
                };

                let update = {
                    $set: {
                        status: Article.STATUS.REMOVED,
                        update_time: new Date()
                    }
                };

                Article.update(condition, update, cb);
            } else {
                cb();
            }
        }
    }, callback);
};

// markdown article =======================================================
/**
 * @desc 获取markdown文章列表
 * */
exports.getMarkdownArticles = function (pageSkip, pageSize, callback) {
    let condition = {
        status: MarkdownArticle.STATUS.NORMAL
    };

    async.parallel({
        count: function (cb) {
            MarkdownArticle.count(condition, cb);
        },
        articles: function (cb) {
            MarkdownArticle.find(condition)
                .populate('category_id')
                .sort('-update_time')
                .skip(pageSkip)
                .limit(pageSize)
                .exec(cb);
        }
    }, callback);
};

 /**
  * @desc 获取markdown文章详情
  * */
exports.getMarkdownArticleDetail = function (articleID, callback) {
    let condition = {
        status: MarkdownArticle.STATUS.NORMAL,
        _id: articleID
    };

    MarkdownArticle.findOne(condition)
        .populate('category_id')
        .exec(callback);
};

/**
 * @desc 新建markdown文章
 * */
exports.createNewMarkdownArticle = function (article, callback) {
    (async function () {
        try {
            let markdownArticleDoc = {
                status: MarkdownArticle.STATUS.NORMAL,
                title: article.title,
                content: article.content,
                category_id: article.category_id,
                create_time: new Date(),
                update_time: new Date()
            };

            let result = await Promise.resolve(MarkdownArticle.create(markdownArticleDoc));

            let categoryCondition = {
                _id: article.category_id,
                status: Category.STATUS.NORMAL
            };

            let categoryUpdate = {
                $inc: {
                    article_count: 1
                },
                update_time: new Date()
            };

            Category.update(categoryCondition, categoryUpdate, function (err, result) {
                if (err) {
                    logger.error(err);
                }
            });

            return callback(null, result);
        } catch (err) {
            return callback(err);
        }
    })();
};

/**
 * @desc 更新markdown文章
 * */
exports.updateMarkdownArticle = function (article, callback) {
    (async function () {
        try {
            let condition = {
                status: MarkdownArticle.STATUS.NORMAL,
                _id: article.id
            };

            let update = {
                $set: {
                    title: article.title,
                    content: article.content,
                    category_id: article.category_id,
                    update_time: new Date()
                }
            };
            
            let oldArticle = await Promise.resolve(MarkdownArticle.findOneAndUpdate(condition, update));
            
            if (!oldArticle) {
                return callback(null, false);
            }

            if (oldArticle.category_id != article.category_id) {
                let categoryCondition = {
                    _id: article.category_id,
                    status: Category.STATUS.NORMAL
                };

                let categoryUpdate = {
                    $inc: {
                        article_count: 1
                    },
                    update_time: new Date()
                };

                Category.update(categoryCondition, categoryUpdate, function (err, result) {
                    if (err) {
                        logger.error(err);
                    }
                });

                let oldCategoryCondition = {
                    _id: oldArticle.category_id,
                    status: Category.STATUS.NORMAL
                };

                let oldCategoryUpdate = {
                    $inc: {
                        article_count: -1
                    },
                    update_time: new Date()
                };

                Category.update(oldCategoryCondition, oldCategoryUpdate, function (err, result) {
                    if (err) {
                        logger.error(err);
                    }
                });
            }

            return callback(null, true);

        } catch (err) {
            return callback(err);
        }
    })();
};

/**
 * @desc 删除markdown文章
 * */
exports.removeMarkdownArticle = function (articleID, callback) {
    (async function () {
        try {
            let condition = {
                status: MarkdownArticle.STATUS.NORMAL,
                _id: articleID
            };

            let update = {
                $set: {
                    status: MarkdownArticle.STATUS.REMOVED,
                    update_time: new Date()
                }
            };

            let article = await Promise.resolve(MarkdownArticle.findOneAndUpdate(condition, update, { new: true }));

            if (!article || article.status != MarkdownArticle.STATUS.REMOVED) {
                return callback(null, false);
            }

            let categoryCondition = {
                _id: article.category_id,
                status: Category.STATUS.NORMAL
            };

            let categoryUpdate = {
                $inc: {
                    article_count: -1
                },
                update_time: new Date()
            };

            Category.update(categoryCondition, categoryUpdate, function (err, result) {
                if (err) {
                    logger.error(err);
                }
            });

            return callback(null, true);

        } catch (err) {
            return callback(err);
        }
    })();
};