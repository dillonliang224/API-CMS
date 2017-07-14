/**
 * Created by liang on 2017/7/4.
 */

const async = require('async');

const appMongodbClient = require('../../service/cms').client;
const Banner = appMongodbClient.model('Banner');

/**
 * @desc 创建banner
 * */
exports.createNewBanner = function (banner, callback) {
    let bannerDoc = {
        status: banner.STATUS.NORMAL,
        title: banner.title,
        cover: banner.cover,
        url: banner.url,
        create_time: new Date(),
        update_time: new Date(),
    };

    Banner.create(bannerDoc, callback);
};

/**
 * @desc 更新banner
 * */
exports.updateBanner = function (banner, callback) {
    let condition = {
        _id: banner.id,
        status: banner.STATUS.NORMAL,
    };

    let update = {
        $set: {
            title: banner.title,
            cover: banner.cover,
            url: banner.url,
            update_time: new Date(),
        }
    };

    Banner.update(condition, update, function (err, result) {
        callback(err, result && result.nModified === 1);
    });
};

/**
 * @desc 获取banner列表
 * */
exports.getBannerList = function (pageSkip, pageSize, callback) {
    let condition = {
        status: Banner.STATUS.NORMAL
    };

    async.parallel({
        count: function (cb) {
            Banner.count(condition, cb);
        },
        banners: function (cb) {
            Banner.find(condition)
                .sort('-create_time')
                .skip(pageSkip)
                .limit(pageSize)
                .exec(cb);
        }
    }, callback);
};

/**
 * @desc 获取banner详情
 * */
exports.getBannerDetail = function (bannerID, callback) {
    let condition = {
        _id: bannerID,
        status: Banner.STATUS.NORMAL
    };

    Banner.findOne(condition, callback);
};

/**
 * @desc 删除banner
 * */
exports.removeBanner = function (bannerID, callback) {
    let condition = {
        _id: bannerID,
        status: Banner.STATUS.NORMAL
    };

    let update = {
        $set: {
            status: Banner.STATUS.REMOVED,
            update_time: new Date()
        }
    };

    Banner.update(condition, update, function (err, result) {
        callback(err, result && result.nModified === 1);
    });
};