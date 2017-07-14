/**
 * Created by liang on 2017/7/14.
 */

const article = require('../../controller/jianshu/article');

exports.map = function (app) {
    app.get('/articles', article.getArticles);         // 获取简书文章列表
};