/**
 * Created by liang on 2017/6/17.
 */

const async = require('async');

const cmsMongodb = require('../../service/cms');

const cmsMongodbClient = cmsMongodb.client;

const Administrator = cmsMongodbClient.model('Administrator');

/**
 * @desc 创建管理员
 * */
exports.createNewAdministrator = function (admin, callback) {
    let adminDoc = {
        status: Administrator.STATES.NORMAL,
        admin_name: admin.admin_name,
        admin_email: admin.admin_email,
        admin_password: admin.admin_password,
        admin_gender: admin.gender === 'male' ? Administrator.GENDER.MALE : Administrator.GENDER.FEMALE,
        admin_mobile: admin.admin_mobile,
        admin_age: admin.admin_age,
        admin_profile: admin.admin_profile,
        admin_avatar: admin.admin_avatar,
        create_time: new Date(),
        update_time: new Date(),
    };

    Administrator.create(adminDoc, callback);
};

/**
 * @desc 更新管理员
 * */
exports.updateAdministrator = function (admin, callback) {
    let condition = {
        _id: admin.id,
        status: Administrator.STATES.NORMAL,
    };

    let update = {
        $set: {
            admin_name: admin.admin_name,
            admin_password: admin.admin_password,
            admin_gender: admin.gender === 'male' ? Administrator.GENDER.MALE : Administrator.GENDER.FEMALE,
            admin_mobile: admin.admin_mobile,
            admin_age: admin.admin_age,
            admin_profile: admin.admin_profile,
            admin_avatar: admin.admin_avatar,
            update_time: new Date(),
        }
    };

    Administrator.update(condition, update, function (err, result) {
        callback(err, result && result.nModified == 1);
    });
};

/**
 * @desc 管理员列表
 * */
exports.getAdministratorList = function (pageSkip, pageSize, callback) {
    let condition = {
        status: Administrator.STATES.NORMAL
    };

    async.parallel({
        count: function (cb) {
            Administrator.count(condition, cb);
        },
        administrators: function (cb) {
            Administrator.find(condition)
                .sort('-create_time')
                .skip(pageSkip)
                .limit(pageSize)
                .exec(cb);
        }
    }, callback);
}

/**
 * @desc 管理员详情(id)
 * */
exports.getAdministratorDetailById = function (adminId, callback) {
    let condition = {
        _id: adminId,
        status: Administrator.STATES.NORMAL
    };

    Administrator.findOne(condition, callback);
};

/**
 * @desc 管理员详情(email)
 * */
exports.getAdministratorDetailByEmail = function (email, callback) {
    let condition = {
        admin_email: email,
        status: Administrator.STATES.NORMAL
    };

    Administrator.findOne(condition, callback);
};

/**
 * @desc 删除管理员
 * */
exports.removeAdministratorById = function (adminId, callback) {
    let condition = {
        _id: adminId,
        status: Administrator.STATES.NORMAL
    };

    let update = {
        status: Administrator.STATES.REMOVED,
        update_time: new Date()
    };

    Administrator.update(condition, update, function (err, result) {
        callback(err, result && result.nModified == 1);
    });
};