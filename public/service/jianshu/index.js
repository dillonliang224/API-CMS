/**
 * Created by liang on 2017/6/15.
 */

const mongoose = require('mongoose');
const config = require('../config/index');
mongoose.Promise = global.Promise;

if(!config && !config.mongodb && !config.mongodb.jianshu){
    throw new Error('please provide mongodb config');
}

const JS_CONFIG = config.mongodb.jianshu;

const client = mongoose.createConnection(JS_CONFIG.url, {
    user: JS_CONFIG.user,
    pass: JS_CONFIG.password
});
console.log(client);

client.on('error', function(err){
    console.log(222);
    console.error(err.stack);
});


//define model===========================================
const article = require('./schema/article');

client.model('Article', article.ArticleSchema, 'article');

exports.client = client;
exports.mongoose = mongoose;
exports.ObjectId = mongoose.Types.ObjectId;