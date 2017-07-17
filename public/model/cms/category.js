/**
 * Created by liang on 2017/7/17.
 */

const async = require('async');

const cmsMongodbClient = require('../../service/cms').client;
const Category = cmsMongodbClient.model('Category');

/**
 * @desc
 * */

/**
 * @desc 更新category
 * */
exports.updateCategory = function (category, callback) {

};

/**
 * @desc 获取category列表
 * */
exports.getCategoryList = function (callback) {
    let condition = {
        status: Category.STATUS.NORMAL
    };

    Category.find(condition)
        .sort('-create_time')
        .exec(callback);
};

/**
 * @desc 获取category详情
 * */
exports.getCategoryDetail = function (categoryID, callback) {
    let condition = {
        _id: categoryID,
        status: Category.STATUS.NORMAL
    };

    Category.findOne(condition, callback);
};

/**
 * @desc 删除category
 * */
exports.removeCategory = function (categoryID, callback) {
    let condition = {
        _id: categoryID,
        status: Category.STATUS.NORMAL
    };

    let update = {
        $set: {
            status: Category.STATUS.REMOVED,
            update_time: new Date()
        }
    };

    Category.update(condition, update, callback);
};