/**
 * @author synder on 2017/2/20
 * @copyright
 * @desc
 */


const NODE_ENV = process.env.NODE_ENV;

/**
 * session处理
 * */
module.exports = function () {
    return function (req, res, next) {
        return next();
    }
};