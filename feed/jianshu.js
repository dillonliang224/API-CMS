/**
 * Created by liang on 2017/7/4.
 */

const request = require('request');
const cheerio = require('cheerio');
const async = require('async');
const articleJianShuModel = require('../public/model/jianshu/article');

let url = 'http://www.jianshu.com/';

function getData(url) {
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let home = cheerio.load(body);
            let list = home('#list-container .note-list li');
            list.each(function (index, item) {
                let article_id = home(this).find('.content .title').attr('href').replace('/p/', '')

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

                        // let article = {
                        //     id: article_id,
                        //     title: title,
                        //     author: {
                        //         id: author_id,
                        //         name: author_name,
                        //         avatar: author_avatar
                        //     },
                        //     meta: {
                        //         publish_time: publish_time,
                        //         wordage: wordage
                        //     },
                        //     image: image,
                        //     content: content,
                        //     abstract: abstract,
                        //     is_from_jianshu: true
                        // };

                        let article = {
                            js_id: article_id,
                            title: title,
                            cover: image,
                            content: content,
                            abstract: abstract,
                        };
                        articleJianShuModel.createNewArticle(article, function () {

                        })
                    }
                })
            })
        }
    })
}


async.parallel({
    getDataFromJianShu: function (cb) {
        getData(url)
    }
}, function (err, results) {
    if (err) {
        return console.error(err.stack);
    }

    console.log('为保证安全，请执行后删除此脚本');
    process.exit();
});