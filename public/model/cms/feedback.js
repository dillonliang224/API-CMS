/**
 * Created by liang on 2017/7/4.
 */

const async = require('async');

const appMongodbClient = require('../../service/cms').client;
const AppFeedback = appMongodbClient.model('Feedback');

/**
 * @desc 创建反馈意见
 * */
exports.createNewAppFeedback = function (feedback, callback) {
    let feedbackDoc = {
        status: AppFeedback.STATUS.NORMAL,
        content: feedback.content,
        images: feedback.images || [],
        mobile: feedback.mobile || null,
        create_time: new Date(),
        update_time: new Date(),
    };

    AppFeedback.create(feedbackDoc, callback);
};

/**
 * @desc 获取反馈意见列表
 * */
exports.getAppFeedbackList = function (pageSkip, pageSize, callback) {
    let condition = {
        status: AppFeedback.STATUS.NORMAL
    };

    async.parallel({
        count: function (cb) {
            AppFeedback.count(condition, cb);
        },
        feedbacks: function (cb) {
            AppFeedback.find(condition)
                .sort('-create_time')
                .skip(pageSkip)
                .limit(pageSize)
                .exec(cb);
        }
    }, callback);
};

/**
 * @desc 删除反馈意见
 * */
exports.removeAppFeedback = function (feedbackID, callback) {
    let condition = {
        _id: feedbackID,
        status: AppFeedback.STATUS.NORMAL
    };

    let update = {
        $set: {
            status: AppFeedback.STATUS.REMOVED,
            update_time: new Date()
        }
    };

    AppFeedback.update(condition, update, function (err, result) {
        callback(err, result && result.nModified === 1);
    });
};