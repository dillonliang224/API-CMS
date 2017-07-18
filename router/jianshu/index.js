/**
 * Created by liang on 2017/7/14.
 */

const article = require('../../controller/jianshu/article');

exports.map = function (app) {
    app.get('/jianshu/articles', article.getArticles);         // 获取简书文章列表
    app.get('/jianshu/article', article.getArticleDetailByID); // 获取简书文章详情
    app.delete('/jianshu/article', article.removeArticleByID); // 删除简书文章
    app.post('/jianshu/article/home', article.getArticleFromJianShu); //获取简书数据
    app.post('/jianshu/article/by/url', article.getArticleFromJianShuByUrl);  //通过url获取简书数据
};