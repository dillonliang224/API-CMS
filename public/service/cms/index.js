/**
 * Created by liang on 2017/6/17.
 */

const mongoose = require('mongoose');

const config = require('../config/index');

mongoose.Promise = global.Promise;

if(!config && !config.mongodb && !config.mongodb.cms){
    throw new Error('please provide mongodb config');
}

const APP_CONFIG = config.mongodb.cms;

const client = mongoose.createConnection(APP_CONFIG.url, {
    user: APP_CONFIG.user,
    pass: APP_CONFIG.password
});

client.on('error', function(err){
    console.error(err.stack);
});


//define model===========================================
const administrator = require('./schema/administrator');
const article = require('./schema/article');
const banner = require('./schema/banner');
const feedback = require('./schema/feedback');
const splashScreen = require('./schema/splashScreen');

client.model('Administrator', administrator.AdministratorSchema, 'administrator');
client.model('Article', article.ArticleSchema, 'article');
client.model('Banner', banner.BannerSchema, 'banner');
client.model('AppFeedback', feedback.AppFeedbackSchema, 'app_feedback');
client.model('AppSplashScreen', splashScreen.AppSplashScreenSchema, 'app_splash_screen');

exports.client = client;
exports.mongoose = mongoose;
exports.ObjectId = mongoose.Types.ObjectId;