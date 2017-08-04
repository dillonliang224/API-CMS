/**
 * Created by liang on 2017/7/19.
 */

const category = require('../../controller/cms/category');
const markdownArticle = require('../../controller/cms/markdownArticle');

exports.map = function (app) {
    // category
    app.get('/category/list', category.getCategoryList);                // 获取category列表
    app.get('/category', category.getCategoryDetail);                   // 获取category详情
    app.put('/category', category.updateCategory);                      // 更新category
    app.post('/category', category.createNewCategory);                  // 添加category
    app.delete('/category', category.removeCategoryByID);               // 删除category

    // markdown article
    app.get('/markdown/articles', markdownArticle.getMarkdownArticles);		// 获取文章列表
    app.get('/markdown/article', markdownArticle.getMarkdownArticleDetail);	// 获取文章详情
    app.put('/markdown/article', markdownArticle.updateMarkdownArticle);	// 更新文章
    app.post('/markdown/article', markdownArticle.createMarkdownArticle);	// 添加文章
    app.delete('/markdown/article', markdownArticle.removeMarkdownArticle);	// 删除文章
};