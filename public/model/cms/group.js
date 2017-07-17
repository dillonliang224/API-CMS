/**
 * Created by liang on 2017/7/17.
 */

const async = require('async');

const cmsMongodbClient = require('../../service/cms').client;
const Group = cmsMongodbClient.model('Group');

/**
 * 获取group详情
 * */
exports.getGroupDetail = function (groupID, callback) {
    let condition = {
        _id: groupID,
        status: Group.STATUS.NORMAL
    };

    Group.findOne(condition, callback);
};