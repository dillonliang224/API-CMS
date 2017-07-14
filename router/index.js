/**
 * Created by liang on 2017/7/14.
 */

/**
 *  @desc 系统路由，所有的路由都注册在这里
 * */

const jianshuRouter = require('./jianshu');

module.exports = function (app) {
    jianshuRouter.map(app);
};