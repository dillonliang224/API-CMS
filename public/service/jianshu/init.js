/**
 * Created by liang on 2017/6/15.
 */

const async = require('async');

const mongodb = require('../jianshu');
const jianshuMongodb = mongodb.client;

const Article = jianshuMongodb.model('Article');

const mongoose = require('mongoose');
const config = require('../config');

if (!config && !config.mongodb) {
    throw new Error('please provide mongodb config');
}

const JS_CONFIG = config.mongodb.jianshu;

const client = mongoose.createConnection(JS_CONFIG.url, {
    user: JS_CONFIG.user,
    pass: JS_CONFIG.password
});

client.on('error', function (err) {
    console.error(err.stack);
});

const ObjectId = mongoose.Types.ObjectId;


//=======初始化简书文章
const initJianShu = function (callback) {
    Article.findOne({}, callback);
};

async.parallel({
    jianshu: function (cb) {
        initJianShu(cb)
    }
}, function (err, results) {
    console.log(results);

    if (err) {
        return console.error(err.stack);
    }

    console.log('为保证安全，请执行后删除此脚本');
    process.exit();
});