/**
 * Created by liang on 2017/6/19.
 */

const async = require('async');

const appMongodbClient = require('../../service/cms').client;
const AppSplashScreen = appMongodbClient.model('AppSplashScreen');

/**
 * @desc 添加闪屏
 * */
exports.addAppSplashScreen = function (splashScreen, callback) {
    let splashScreenDoc = {
        status: splashScreen.status,
        title: splashScreen.title,
        list: splashScreen.list,
        platform: splashScreen.platform,
        create_time: new Date(),
        update_time: new Date()
    };

    AppSplashScreen.create(splashScreenDoc, callback);
};

/**
 * @desc 更新闪屏
 * */
exports.updateAppSplashScreen = function (splashScreen, callback) {
    let condition = {
        _id:　splashScreen.id,
    };

    let update = {
        status: splashScreen.status,
        title: splashScreen.title,
        list: splashScreen.list,
        platform: splashScreen.platform,
        update_time: new Date()
    };

    AppSplashScreen.update(condition, update, function (err, result) {
        callback(err, result && result.nModified === 1);
    });
};

/**
 * @desc 获取闪屏
 * */
exports.getAppSplashScreenDetail = function (platform, callback) {
    let condition = {
        status: AppSplashScreen.STATUS.ENABLE,
        platform: platform
    };

    AppSplashScreen.findOne(condition, callback);
};